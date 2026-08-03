(function () {
  'use strict';

  const AUTH_KEY = 'kayas_walkthrough_auth_until';
  const PANEL_KEY = 'kayas_walkthrough_panel_collapsed';
  const THEME_KEY = 'kayas_walkthrough_theme';
  const VIEW_KEY = 'kayas_walkthrough_active_view';
  const EXPECTED = '13a9e92799eaf7515a82f73b4a2b3026a568dae3db4e35b5f4f4562b1d67bef7';
  const VERSION = '20260803-v21-professional';

  const DOCUMENTS = {
    field: {
      preview: 'https://drive.google.com/file/d/1F1yVDXgLKkmBB6pjOvssrsbANlOCQYve/preview',
      download: 'https://drive.google.com/uc?export=download&id=1F1yVDXgLKkmBB6pjOvssrsbANlOCQYve'
    },
    professional: {
      preview: 'https://drive.google.com/file/d/1Hm0wu8zRUpKadyibZ33xpG8hAQ24B9kg/preview',
      download: 'https://drive.google.com/uc?export=download&id=1Hm0wu8zRUpKadyibZ33xpG8hAQ24B9kg'
    },
    gantt: {
      preview: 'https://docs.google.com/spreadsheets/d/1EZEXAmANDyrx3SdmzWCiCZb5feKEqTF4/edit',
      download: 'https://drive.google.com/uc?export=download&id=1EZEXAmANDyrx3SdmzWCiCZb5feKEqTF4'
    }
  };

  function loadStylesheet(id, href) {
    let link = document.getElementById(id);
    if (link) return link;
    link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    return link;
  }

  function loadScript(id, src) {
    let script = document.getElementById(id);
    if (script) return script;
    script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = false;
    script.onerror = function () {
      console.error('[KAYAS v21] asset yüklenemedi:', src);
    };
    document.body.appendChild(script);
    return script;
  }

  function ensureProfessionalAssets() {
    loadStylesheet('kayas-v21-css', 'v21-fixes.css?v=' + VERSION);
    loadScript('kayas-v21-runtime', 'v21-runtime.js?v=' + VERSION);
  }
  ensureProfessionalAssets();

  const brandStyle = document.createElement('style');
  brandStyle.textContent = [
    'body.is-night .specbridge-icon,body.is-night .specbridge-login-logo,body.is-night .loading-brand{filter:grayscale(1) brightness(0) invert(1);opacity:.98}',
    'body:not(.is-night) .specbridge-icon,body:not(.is-night) .specbridge-login-logo,body:not(.is-night) .loading-brand{filter:none;opacity:1}'
  ].join('');
  document.head.appendChild(brandStyle);

  function configureDocuments() {
    document.querySelectorAll('.report-item[data-report-title]').forEach(function (item) {
      const title = item.getAttribute('data-report-title') || '';
      let doc = null;
      if (title === 'Saha Fizibilite Raporu') doc = DOCUMENTS.field;
      else if (title === 'Modüler Veri Merkezi Dışı Gereksinimler' || title === 'Açılış Hazırlık Planı') doc = DOCUMENTS.professional;
      else if (title === 'Master Uygulama Takvimi') doc = DOCUMENTS.gantt;
      if (!doc) return;
      item.setAttribute('data-report-src', doc.preview);
      item.setAttribute('data-report-download', doc.download);
    });

    const frame = document.getElementById('reportFrame');
    const open = document.getElementById('reportOpen');
    const download = document.getElementById('reportDownload');
    if (frame) frame.src = DOCUMENTS.field.preview;
    if (open) open.href = DOCUMENTS.field.preview;
    if (download) download.href = DOCUMENTS.field.download;
  }
  configureDocuments();

  function cloneInteractiveElement(element) {
    if (!element || !element.parentNode) return element;
    const clone = element.cloneNode(true);
    element.parentNode.replaceChild(clone, element);
    return clone;
  }

  async function sha256(value) {
    const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    return Array.from(new Uint8Array(buffer), function (byte) {
      return byte.toString(16).padStart(2, '0');
    }).join('');
  }

  const gate = document.getElementById('loginGate');
  const user = document.getElementById('loginUser');
  const pass = document.getElementById('loginPass');
  const error = document.getElementById('loginError');

  function unlock() {
    if (gate) gate.classList.add('is-hidden');
    setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 120);
  }

  if (Number(localStorage.getItem(AUTH_KEY) || 0) > Date.now()) unlock();

  const loginButton = document.getElementById('loginButton');
  if (loginButton) {
    loginButton.addEventListener('click', async function () {
      if (error) error.textContent = '';
      const valid = await sha256((user ? user.value.trim() : '') + ':' + (pass ? pass.value : ''));
      if (valid === EXPECTED) {
        localStorage.setItem(AUTH_KEY, String(Date.now() + 8 * 60 * 60 * 1000));
        unlock();
      } else {
        if (error) error.textContent = 'Kullanıcı adı veya şifre hatalı.';
        if (pass) pass.select();
      }
    });
  }

  [user, pass].filter(Boolean).forEach(function (input) {
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && loginButton) loginButton.click();
    });
  });

  let fullscreenButton = cloneInteractiveElement(document.getElementById('fullscreenButton'));
  if (fullscreenButton) {
    fullscreenButton.addEventListener('click', function () {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    });
  }

  function readTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return document.body.classList.contains('is-night') ? 'dark' : 'light';
  }

  let themeButton = cloneInteractiveElement(document.getElementById('themeButton'));
  const nightToggle = document.getElementById('nightToggle');

  function applyTheme(theme, persist) {
    const normalized = theme === 'light' ? 'light' : 'dark';
    const isDark = normalized === 'dark';
    document.documentElement.dataset.theme = normalized;
    document.body.classList.toggle('is-night', isDark);
    document.body.classList.toggle('is-light', !isDark);
    document.body.dataset.theme = normalized;
    window.__KAYAS_THEME__ = normalized;

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDark ? '#071423' : '#e8f0f6');
    if (themeButton) {
      themeButton.textContent = isDark ? '☀' : '☾';
      themeButton.setAttribute('aria-pressed', String(!isDark));
      themeButton.setAttribute('title', isDark ? 'Açık temaya geç' : 'Koyu temaya geç');
    }
    if (nightToggle) nightToggle.checked = isDark;
    if (persist !== false) localStorage.setItem(THEME_KEY, normalized);

    window.dispatchEvent(new CustomEvent('kayas:themechange', {
      detail: { theme: normalized, isDark: isDark }
    }));
    window.dispatchEvent(new Event('resize'));
  }

  applyTheme(readTheme(), false);

  if (themeButton) {
    themeButton.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      applyTheme(document.body.classList.contains('is-night') ? 'light' : 'dark', true);
    }, true);
  }

  if (nightToggle) {
    nightToggle.addEventListener('change', function () {
      applyTheme(nightToggle.checked ? 'dark' : 'light', true);
    });
  }

  const panel = document.getElementById('controlPanel');
  const panelToggleHeader = document.getElementById('panelToggleHeader');
  const panelEdgeToggle = document.getElementById('panelEdgeToggle');

  function syncPanelControls() {
    const collapsed = document.body.classList.contains('panel-collapsed');
    if (panelToggleHeader) {
      panelToggleHeader.setAttribute('aria-expanded', String(!collapsed));
      panelToggleHeader.setAttribute('aria-pressed', String(collapsed));
      panelToggleHeader.setAttribute('title', collapsed ? 'Kontrol panelini aç' : 'Kontrol panelini gizle');
    }
    if (panelEdgeToggle) {
      panelEdgeToggle.setAttribute('aria-expanded', String(!collapsed));
      panelEdgeToggle.textContent = collapsed ? '›' : '‹';
      panelEdgeToggle.setAttribute('title', collapsed ? 'Kontrol panelini aç' : 'Kontrol panelini gizle');
    }
    if (panel) panel.setAttribute('aria-hidden', String(collapsed));
  }

  function setPanelCollapsed(collapsed, options) {
    const settings = options || {};
    document.body.classList.toggle('panel-collapsed', Boolean(collapsed));
    if (settings.persist !== false) {
      try { localStorage.setItem(PANEL_KEY, collapsed ? '1' : '0'); } catch (_error) {}
    }
    syncPanelControls();
    requestAnimationFrame(function () { window.dispatchEvent(new Event('resize')); });
    setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 310);
  }

  function togglePanel(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setPanelCollapsed(!document.body.classList.contains('panel-collapsed'));
  }

  if (panelToggleHeader) panelToggleHeader.addEventListener('click', togglePanel, true);
  if (panelEdgeToggle) panelEdgeToggle.addEventListener('click', togglePanel, true);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      const drawer = document.getElementById('customerDrawer');
      const lightbox = document.getElementById('imageLightbox');
      if (lightbox && !lightbox.hidden) {
        lightbox.hidden = true;
        return;
      }
      if (drawer && !drawer.hidden) {
        setActiveView('model', true);
        return;
      }
      if (!document.body.classList.contains('panel-collapsed')) setPanelCollapsed(true);
    }
  });

  let initialCollapsed = window.innerWidth < 900;
  try {
    const saved = localStorage.getItem(PANEL_KEY);
    if (saved === '1' || saved === '0') initialCollapsed = saved === '1';
  } catch (_error) {}
  setPanelCollapsed(initialCollapsed, { persist: false });

  const drawer = document.getElementById('customerDrawer');
  const galleryPanel = document.querySelector('.drawer-panel[data-content="gallery"]');
  const reportsPanel = document.querySelector('.drawer-panel[data-content="reports"]');
  const drawerTitle = document.getElementById('drawerTitle');

  const tabButtons = Array.from(document.querySelectorAll('.presentation-tabs button')).map(cloneInteractiveElement);
  let drawerClose = cloneInteractiveElement(document.getElementById('drawerClose'));

  function setActiveView(view, persist) {
    const normalized = view === 'gallery' || view === 'reports' ? view : 'model';
    document.body.dataset.activeView = normalized;
    window.__KAYAS_ACTIVE_VIEW__ = normalized;

    tabButtons.forEach(function (button) {
      const active = button.dataset.panel === normalized;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
      button.setAttribute('tabindex', active ? '0' : '-1');
    });

    if (drawer) drawer.hidden = normalized === 'model';
    if (galleryPanel) galleryPanel.hidden = normalized !== 'gallery';
    if (reportsPanel) reportsPanel.hidden = normalized !== 'reports';
    if (drawerTitle) drawerTitle.textContent = normalized === 'reports' ? 'Raporlar ve Dokümanlar' : 'Konsept Görseller';

    if (normalized === 'model') {
      const lightbox = document.getElementById('imageLightbox');
      if (lightbox) lightbox.hidden = true;
    }

    if (persist !== false) localStorage.setItem(VIEW_KEY, normalized);
    requestAnimationFrame(function () { window.dispatchEvent(new Event('resize')); });
    window.dispatchEvent(new CustomEvent('kayas:viewchange', { detail: { view: normalized } }));
  }

  tabButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      setActiveView(button.dataset.panel || 'model', true);
    }, true);
  });

  if (drawerClose) {
    drawerClose.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      setActiveView('model', true);
    }, true);
  }

  setActiveView('model', false);

  document.querySelectorAll('.report-item[data-report-title]:not([disabled])').forEach(function (item) {
    item.addEventListener('click', function () {
      if (item.dataset.download === 'true') {
        const href = item.getAttribute('data-report-download') || item.getAttribute('data-report-src');
        if (href) window.open(href, '_blank', 'noopener');
        return;
      }
      document.querySelectorAll('.report-item').forEach(function (node) { node.classList.remove('is-selected'); });
      item.classList.add('is-selected');
      const src = item.getAttribute('data-report-src');
      const download = item.getAttribute('data-report-download') || src;
      const reportTitle = item.getAttribute('data-report-title') || 'Rapor';
      const frame = document.getElementById('reportFrame');
      const open = document.getElementById('reportOpen');
      const downloadLink = document.getElementById('reportDownload');
      const viewerTitle = document.getElementById('reportViewerTitle');
      if (frame && src) frame.src = src;
      if (open && src) open.href = src;
      if (downloadLink && download) downloadLink.href = download;
      if (viewerTitle) viewerTitle.textContent = reportTitle;
    });
  });

  const steps = [
    ['entrance', '01 / 08', 'Batı giriş, resepsiyon ve mantrap'],
    ['foyer', '02 / 08', 'Yatırımcı fuayesi ve büyük toplantı alanı'],
    ['walk', '03 / 08', 'Kontrollü ziyaretçi güzergâhı'],
    ['datahall', '04 / 08', 'H3C IC8000 veri salonu'],
    ['noc', '05 / 08', 'NOC, yönetim ve operatör alanları'],
    ['terrace', '06 / 08', '5 metre doğu terası ve dış üniteler'],
    ['layers', '07 / 08', 'Enerji, fiber ve soğutma katmanları'],
    ['top', '08 / 08', '110 m × 46 m genel üst görünüm']
  ];

  let current = -1;
  let timer = null;
  let playing = false;
  const title = document.getElementById('tourTitle');
  const step = document.getElementById('tourStep');
  const progress = document.getElementById('tourProgress');
  let tourButton = cloneInteractiveElement(document.getElementById('tourButton'));

  function show(index) {
    current = (index + steps.length) % steps.length;
    const item = steps[current];
    const button = document.querySelector('[data-view="' + item[0] + '"]');
    if (button) button.click();
    if (step) step.textContent = item[1];
    if (title) title.textContent = item[2];
    if (progress) progress.style.width = ((current + 1) / steps.length * 100) + '%';
    if (window.innerWidth < 760 && !document.body.classList.contains('panel-collapsed')) setPanelCollapsed(true);
  }

  function stop() {
    playing = false;
    clearInterval(timer);
    timer = null;
    if (tourButton) tourButton.innerHTML = '▶ <span>Rehberli Tur</span>';
  }

  function start() {
    playing = true;
    show(current < 0 ? 0 : current);
    clearInterval(timer);
    timer = setInterval(function () {
      if (current === steps.length - 1) {
        stop();
        return;
      }
      show(current + 1);
    }, 6500);
    if (tourButton) tourButton.innerHTML = 'Ⅱ <span>Turu Durdur</span>';
  }

  if (tourButton) tourButton.addEventListener('click', function () { playing ? stop() : start(); });
  const prev = document.getElementById('tourPrev');
  const next = document.getElementById('tourNext');
  if (prev) prev.addEventListener('click', function () { stop(); show(current - 1); });
  if (next) next.addEventListener('click', function () { stop(); show(current + 1); });

  const activeKeys = new Set();
  function keyDown(code, button) {
    if (activeKeys.has(code)) return;
    activeKeys.add(code);
    if (button) button.classList.add('is-pressed');
    window.dispatchEvent(new KeyboardEvent('keydown', { code: code, key: code, bubbles: true }));
  }
  function keyUp(code, button) {
    activeKeys.delete(code);
    if (button) button.classList.remove('is-pressed');
    window.dispatchEvent(new KeyboardEvent('keyup', { code: code, key: code, bubbles: true }));
  }

  document.querySelectorAll('[data-key]').forEach(function (button) {
    const code = button.dataset.key;
    ['pointerdown', 'touchstart'].forEach(function (type) {
      button.addEventListener(type, function (event) {
        event.preventDefault();
        keyDown(code, button);
      }, { passive: false });
    });
    ['pointerup', 'pointercancel', 'pointerleave', 'touchend', 'touchcancel'].forEach(function (type) {
      button.addEventListener(type, function (event) {
        event.preventDefault();
        keyUp(code, button);
      }, { passive: false });
    });
  });

  window.addEventListener('blur', function () {
    document.querySelectorAll('[data-key]').forEach(function (button) { keyUp(button.dataset.key, button); });
  });

  setTimeout(function () {
    const loading = document.getElementById('loadStatus');
    if (loading && !loading.hidden) loading.hidden = true;
  }, 14000);
})();
