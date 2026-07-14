(() => {
  "use strict";

  const STATUS_VALUES = new Set([
    "proven",
    "controlled",
    "planned",
    "not_public",
    "future",
  ]);

  const INTERNAL_LINK_ALLOWLIST = [
    /^\/#(?:product-modules|reports|sample-reports|security|pilot)$/,
    /^\/actions\/$/,
  ];

  const STATUS_META = {
    tr: {
      proven: { symbol: "●", label: "Kanıtlanmış / Mevcut" },
      controlled: { symbol: "◆", label: "Kontrollü Pilot" },
      planned: { symbol: "▲", label: "Planlanan / Sınırlı" },
      not_public: { symbol: "■", label: "Public Değil" },
      future: { symbol: "◇", label: "Gelecek" },
    },
    en: {
      proven: { symbol: "●", label: "Proven / Available" },
      controlled: { symbol: "◆", label: "Controlled Pilot" },
      planned: { symbol: "▲", label: "Planned / Limited" },
      not_public: { symbol: "■", label: "Not Public" },
      future: { symbol: "◇", label: "Future" },
    },
  };

  const PAGE_COPY = {
    tr: {
      eyebrow: "PUBLIC İŞ AKIŞI DURUMU",
      title: "Şartname incelemesinden karar hazırlığına",
      description:
        "SpecBridge AI; şartname ve RFP dokümanlarını izlenebilir bulgulara, ekip tarafından incelenen karar destek çıktılarına ve kontrollü çıktı paketlerine dönüştürür.",
      support:
        "Kanıtlanmış, kontrollü pilot kapsamında sunulan, planlanan ve geleceğe ayrılan kabiliyetleri inceleyin.",
      primary_cta: "Rapor Çıktılarını İncele",
      secondary_cta: "Kontrollü Pilot Erişimi Talep Et",
      panel_label: "PUBLIC DURUM PANOSU",
      panel_title: "Kanıtlanmış, kontrollü, planlanan ve gelecek yönü",
      panel_text:
        "Durum etiketleri renk, sembol ve açıklama ile birlikte sunulur.",
      status_proven: "Kanıtlanmış / Mevcut",
      status_controlled: "Kontrollü Pilot",
      status_planned: "Planlanan / Sınırlı",
      status_future: "Gelecek",
      workflow_eyebrow: "PUBLIC İŞ AKIŞI",
      workflow_title: "İncelemeden onaylı çıktı paketine",
      board_eyebrow: "KABİLİYET DURUMU",
      board_title: "Mevcut durum ve gelecek yönü",
      board_intro:
        "Kartlar mevcut public kabiliyetleri, kontrollü pilot kapsamını, planlanan çıktıları ve gelecek yönünü açıkça ayırır.",
      fallback:
        "Durum bilgisi geçici olarak yenilenemedi. Public-safe yedek görünüm gösteriliyor.",
      updated_prefix: "Public durum güncellemesi",
      workflow_steps: [
        ["01", "İncelemeyi yapılandır", "Kanıtlanmış"],
        ["02", "Maddeleri ve bulguları izle", "Kanıtlanmış"],
        ["03", "İncele ve onayla", "Kanıtlanmış"],
        ["04", "Çıktı paketini oluştur", "Kanıtlanmış"],
      ],
    },
    en: {
      eyebrow: "PUBLIC WORKFLOW STATUS",
      title: "From specification review to decision-ready action",
      description:
        "SpecBridge AI structures specifications and RFPs into traceable findings, human-reviewed decision-support outputs and controlled export packages.",
      support:
        "See what is proven, available through controlled pilots, planned or reserved for future development.",
      primary_cta: "Explore Report Outputs",
      secondary_cta: "Request Controlled Pilot Access",
      panel_label: "PUBLIC STATUS BOARD",
      panel_title: "Proven, controlled, planned and future direction",
      panel_text:
        "Status labels are presented with color, symbol and explanatory text.",
      status_proven: "Proven / Available",
      status_controlled: "Controlled Pilot",
      status_planned: "Planned / Limited",
      status_future: "Future",
      workflow_eyebrow: "PUBLIC WORKFLOW",
      workflow_title: "From review to an approved export package",
      board_eyebrow: "CAPABILITY STATUS",
      board_title: "Current status and future direction",
      board_intro:
        "Cards clearly separate current public capabilities, controlled pilot scope, planned outputs and future direction.",
      fallback:
        "Status information is temporarily unavailable. The public-safe fallback view is shown.",
      updated_prefix: "Public status updated",
      workflow_steps: [
        ["01", "Structure the review", "Proven"],
        ["02", "Trace clauses and findings", "Proven"],
        ["03", "Review and approve", "Proven"],
        ["04", "Export the package", "Proven"],
      ],
    },
  };

  const board = document.getElementById("actions-board");
  const message = document.getElementById("actions-refresh-message");
  const updated = document.getElementById("actions-updated");
  const workflow = document.getElementById("actions-workflow-list");

  if (!board || !message || !updated || !workflow) {
    return;
  }

  let currentData = null;
  let refreshTimer = null;

  const language = () =>
    document.documentElement.lang.toLowerCase().startsWith("tr") ? "tr" : "en";

  const localized = (value, lang) => {
    if (!value || typeof value !== "object") {
      return "";
    }
    const selected = value[lang];
    if (typeof selected === "string") {
      return selected;
    }
    return typeof value.en === "string" ? value.en : "";
  };

  const validInternalHref = (href) =>
    typeof href === "string" &&
    INTERNAL_LINK_ALLOWLIST.some((pattern) => pattern.test(href));

  const numericOrder = (value) =>
    Number.isFinite(Number(value)) ? Number(value) : Number.MAX_SAFE_INTEGER;

  const validLocalizedText = (value) =>
    value &&
    typeof value === "object" &&
    typeof value.en === "string" &&
    typeof value.tr === "string";

  const validItem = (item) =>
    item &&
    typeof item === "object" &&
    typeof item.id === "string" &&
    STATUS_VALUES.has(item.status) &&
    validLocalizedText(item.title) &&
    validLocalizedText(item.description) &&
    (item.link === undefined ||
      (item.link &&
        typeof item.link === "object" &&
        typeof item.link.label_en === "string" &&
        typeof item.link.label_tr === "string" &&
        validInternalHref(item.link.href)));

  const validSection = (section) =>
    section &&
    typeof section === "object" &&
    typeof section.id === "string" &&
    STATUS_VALUES.has(section.status) &&
    validLocalizedText(section.title) &&
    validLocalizedText(section.description) &&
    Array.isArray(section.items) &&
    section.items.every(validItem);

  const validPayload = (payload) =>
    payload &&
    typeof payload === "object" &&
    payload.schema_version === "1.0" &&
    payload.route === "/actions/" &&
    typeof payload.updated_at === "string" &&
    Array.isArray(payload.sections) &&
    payload.sections.every(validSection);

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (text !== undefined) {
      node.textContent = text;
    }
    return node;
  };

  const statusBadge = (status, lang) => {
    const meta = STATUS_META[lang][status];
    const badge = element("span", `actions-status status-${status}`);
    const symbol = element("span", "", meta.symbol);
    symbol.setAttribute("aria-hidden", "true");
    badge.append(symbol, element("span", "", meta.label));
    return badge;
  };

  const renderCard = (item, lang) => {
    const card = element("article", `actions-card status-${item.status}`);
    const top = element("div", "actions-card-top");
    top.append(statusBadge(item.status, lang));

    const title = element("h3", "", localized(item.title, lang));
    const description = element(
      "p",
      "",
      localized(item.description, lang),
    );

    card.append(top, title, description);

    if (item.link && validInternalHref(item.link.href)) {
      const link = element(
        "a",
        "actions-card-link",
        lang === "tr" ? item.link.label_tr : item.link.label_en,
      );
      link.href = item.link.href;
      const arrow = element("span", "", "→");
      arrow.setAttribute("aria-hidden", "true");
      link.append(arrow);
      card.append(link);
    }

    return card;
  };

  const renderSection = (section, lang) => {
    const wrapper = element("section", "actions-section");
    wrapper.dataset.sectionId = section.id;

    const heading = element("div", "actions-section-heading");
    heading.append(
      statusBadge(section.status, lang),
      element("h2", "", localized(section.title, lang)),
      element("p", "", localized(section.description, lang)),
    );

    const grid = element("div", "actions-grid");

    [...section.items]
      .sort((left, right) => numericOrder(left.order) - numericOrder(right.order))
      .forEach((item) => grid.append(renderCard(item, lang)));

    wrapper.append(heading, grid);
    return wrapper;
  };

  const formatDate = (value, lang) => {
    const date = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(lang === "tr" ? "tr-TR" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  };

  const applyFixedCopy = (lang) => {
    const copy = PAGE_COPY[lang];

    document.querySelectorAll("[data-actions-copy]").forEach((node) => {
      const key = node.getAttribute("data-actions-copy");
      if (key && typeof copy[key] === "string") {
        node.textContent = copy[key];
      }
    });

    workflow.replaceChildren();

    copy.workflow_steps.forEach(([number, title, state]) => {
      const item = element("li");
      item.append(
        element("span", "actions-workflow-number", number),
        element("strong", "", title),
      );
      const stateNode = element("span", "actions-workflow-state");
      const symbol = element("span", "", "●");
      symbol.setAttribute("aria-hidden", "true");
      stateNode.append(symbol, document.createTextNode(` ${state}`));
      item.append(stateNode);
      workflow.append(item);
    });

    message.textContent = copy.fallback;
  };

  const render = (payload) => {
    const lang = language();
    const fragment = document.createDocumentFragment();

    [...payload.sections]
      .sort(
        (left, right) =>
          numericOrder(left.order) - numericOrder(right.order),
      )
      .forEach((section) => fragment.append(renderSection(section, lang)));

    board.replaceChildren(fragment);
    updated.textContent = `${PAGE_COPY[lang].updated_prefix}: ${formatDate(
      payload.updated_at,
      lang,
    )}`;
    message.hidden = true;
    message.dataset.state = "current";
  };

  const showFallback = () => {
    const lang = language();
    applyFixedCopy(lang);
    message.textContent = PAGE_COPY[lang].fallback;
    message.hidden = false;
    message.dataset.state = "fallback";
  };

  const refresh = async () => {
    try {
      const response = await fetch("./actions-state.json", {
        cache: "no-store",
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("status");
      }

      const payload = await response.json();

      if (!validPayload(payload)) {
        throw new Error("schema");
      }

      currentData = payload;
      applyFixedCopy(language());
      render(payload);

      const seconds = Math.max(
        60,
        Math.min(3600, numericOrder(payload.refresh_seconds) || 300),
      );

      if (refreshTimer === null) {
        refreshTimer = window.setInterval(refresh, seconds * 1000);
      }
    } catch {
      showFallback();
      if (refreshTimer === null) {
        refreshTimer = window.setInterval(refresh, 300000);
      }
    }
  };

  applyFixedCopy(language());
  refresh();

  const languageObserver = new MutationObserver(() => {
    const lang = language();
    applyFixedCopy(lang);
    if (currentData) {
      render(currentData);
    }
  });

  languageObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"],
  });
})();
