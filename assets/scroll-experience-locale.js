
(() => {
  "use strict";

  const root = document.documentElement;
  const selector = '[data-i18n^="v7_"]';
  const defaults = new Map();

  document.querySelectorAll(selector).forEach((element) => {
    defaults.set(element.getAttribute("data-i18n"), element.textContent);
  });

  const translations = {
    en: {
      v7_stage1_kicker:"01 Controlled process",v7_stage1_title:"Understand every requirement.",v7_stage1_body:"Turn long tender documents into traceable requirements your team can review.",
      v7_stage2_kicker:"Focus without losing context",v7_stage2_title:"One requirement comes forward.",v7_stage2_body:"The tender stays visible; only the context needed for the decision moves forward.",
      v7_stage3_kicker:"02 Verifiable evidence",v7_stage3_title:"Connect the claim to evidence.",v7_stage3_body:"Requirement, evidence and source stay visible in one chain without losing context.",
      v7_stage4_kicker:"03 Early risk detection",v7_stage4_title:"See the gaps before submission.",v7_stage4_body:"Missing evidence and ambiguity emerge inside the same structure while the team can still act.",
      v7_stage5_kicker:"One connected workflow",v7_stage5_title:"Scroll down. The process moves across.",v7_stage5_body:"One scroll gesture connects tender, requirements, evidence, gaps, review and reports.",
      v7_stage6_kicker:"Human decision authority",v7_stage6_title:"AI assists. Humans decide.",v7_stage6_body:"The abstract evidence graph becomes a traceable, human-controlled review workspace.",
      v7_focus_req_title:"Encryption requirement",v7_focus_req_text:"All data at rest must be encrypted.",v7_status_review:"REVIEW",
      v7_evidence_label:"EVIDENCE",v7_evidence_title:"DOC-07 · Security Architecture",v7_evidence_text:"Section 4.2.1 · Storage encryption",
      v7_source_label:"SOURCE",v7_source_title:"§ 4.2.1",v7_source_text:"Verified reference",
      v7_risk_missing:"MISSING EVIDENCE",v7_risk_ambiguous:"AMBIGUOUS REQUIREMENT",v7_risk_human:"HUMAN REVIEW",
      v7_flow_tender:"Tender",v7_flow_tender_sub:"Source documents",v7_flow_requirements:"Requirements",v7_flow_requirements_sub:"Structured clauses",
      v7_flow_evidence:"Evidence",v7_flow_evidence_sub:"Traceable sources",v7_flow_gaps:"Gaps",v7_flow_gaps_sub:"Missing proof and ambiguity",
      v7_flow_review:"Review",v7_flow_review_sub:"Human decision authority",v7_flow_reports:"Reports",v7_flow_reports_sub:"Review-ready output",
      v7_ws_nav_overview:"Overview",v7_ws_nav_requirements:"Requirements",v7_ws_nav_evidence:"Evidence",v7_ws_nav_gaps:"Gaps & Risks",v7_ws_nav_reports:"Reports",
      v7_ws_project_title:"Data Center Infrastructure RFP",v7_ws_project_sub:"126 requirements · controlled review",v7_ws_review_ready:"REVIEW READY",
      v7_ws_evidence_completeness:"Evidence completeness",v7_ws_verified:"§ 4.2.1 verified",v7_ws_open_gap:"OPEN GAP",v7_ws_gap_title:"Key ownership",v7_ws_evidence_requested:"Evidence requested",
      v7_ws_human_review:"HUMAN REVIEW",v7_ws_decision_required:"A decision is required before finalization. AI assessment is advisory.",
      v7_ws_approve:"APPROVE",v7_ws_request_evidence:"REQUEST EVIDENCE",v7_scroll_label:"Scroll-driven product experience"
    },
    zh: {
      v7_stage1_kicker:"01 受控流程",v7_stage1_title:"理解每一项要求。",v7_stage1_body:"将冗长的招标文件转化为可追溯、可由团队审阅的要求。",
      v7_stage2_kicker:"聚焦但不丢失上下文",v7_stage2_title:"突出一个关键要求。",v7_stage2_body:"招标整体仍然可见，只把决策所需的上下文带到前景。",
      v7_stage3_kicker:"02 可验证证据",v7_stage3_title:"将主张连接到证据。",v7_stage3_body:"要求、证据和来源保持在同一条可追溯链中。",
      v7_stage4_kicker:"03 提前识别风险",v7_stage4_title:"在提交前发现缺口。",v7_stage4_body:"缺失证据和歧义在同一结构中浮现，团队仍有时间采取行动。",
      v7_stage5_kicker:"一个连贯工作流",v7_stage5_title:"向下滚动，流程横向展开。",v7_stage5_body:"一次滚动连接招标、要求、证据、缺口、审阅和报告。",
      v7_stage6_kicker:"人工决策权",v7_stage6_title:"AI 辅助，人来决策。",v7_stage6_body:"抽象证据图转化为可追溯、由人工控制的审阅工作区。",
      v7_focus_req_title:"加密要求",v7_focus_req_text:"所有静态数据都必须加密。",v7_status_review:"审阅",
      v7_evidence_label:"证据",v7_evidence_title:"DOC-07 · 安全架构",v7_evidence_text:"第 4.2.1 节 · 存储加密",
      v7_source_label:"来源",v7_source_title:"§ 4.2.1",v7_source_text:"已验证引用",
      v7_risk_missing:"缺失证据",v7_risk_ambiguous:"要求存在歧义",v7_risk_human:"人工审阅",
      v7_flow_tender:"招标",v7_flow_tender_sub:"源文件",v7_flow_requirements:"要求",v7_flow_requirements_sub:"结构化条款",
      v7_flow_evidence:"证据",v7_flow_evidence_sub:"可追溯来源",v7_flow_gaps:"缺口",v7_flow_gaps_sub:"缺失证据与歧义",
      v7_flow_review:"审阅",v7_flow_review_sub:"人工决策权",v7_flow_reports:"报告",v7_flow_reports_sub:"可审阅输出",
      v7_ws_nav_overview:"概览",v7_ws_nav_requirements:"要求",v7_ws_nav_evidence:"证据",v7_ws_nav_gaps:"缺口与风险",v7_ws_nav_reports:"报告",
      v7_ws_project_title:"数据中心基础设施 RFP",v7_ws_project_sub:"126 项要求 · 受控审阅",v7_ws_review_ready:"可审阅",
      v7_ws_evidence_completeness:"证据完整度",v7_ws_verified:"§ 4.2.1 已验证",v7_ws_open_gap:"开放缺口",v7_ws_gap_title:"密钥所有权",v7_ws_evidence_requested:"已请求证据",
      v7_ws_human_review:"人工审阅",v7_ws_decision_required:"最终确定前需要人工决策。AI 评估仅供参考。",
      v7_ws_approve:"批准",v7_ws_request_evidence:"请求证据",v7_scroll_label:"滚动驱动的产品体验"
    },
    ru: {
      v7_stage1_kicker:"01 Контролируемый процесс",v7_stage1_title:"Понимайте каждое требование.",v7_stage1_body:"Преобразуйте большие тендерные документы в прослеживаемые требования, удобные для командной проверки.",
      v7_stage2_kicker:"Фокус без потери контекста",v7_stage2_title:"Одно требование выходит на первый план.",v7_stage2_body:"Тендер остаётся видимым; вперёд выносится только контекст, необходимый для решения.",
      v7_stage3_kicker:"02 Проверяемые доказательства",v7_stage3_title:"Свяжите утверждение с доказательством.",v7_stage3_body:"Требование, доказательство и источник остаются в одной прослеживаемой цепочке.",
      v7_stage4_kicker:"03 Раннее выявление рисков",v7_stage4_title:"Увидьте пробелы до подачи.",v7_stage4_body:"Недостающие доказательства и неоднозначности проявляются в той же структуре, пока команда ещё может действовать.",
      v7_stage5_kicker:"Единый связанный процесс",v7_stage5_title:"Прокрутите вниз — процесс движется по горизонтали.",v7_stage5_body:"Один жест прокрутки связывает тендер, требования, доказательства, пробелы, проверку и отчёты.",
      v7_stage6_kicker:"Полномочия человека",v7_stage6_title:"ИИ помогает. Решает человек.",v7_stage6_body:"Абстрактный граф доказательств превращается в прослеживаемое рабочее пространство под контролем человека.",
      v7_focus_req_title:"Требование к шифрованию",v7_focus_req_text:"Все данные в состоянии покоя должны быть зашифрованы.",v7_status_review:"ПРОВЕРИТЬ",
      v7_evidence_label:"ДОКАЗАТЕЛЬСТВО",v7_evidence_title:"DOC-07 · Архитектура безопасности",v7_evidence_text:"Раздел 4.2.1 · Шифрование хранения",
      v7_source_label:"ИСТОЧНИК",v7_source_title:"§ 4.2.1",v7_source_text:"Проверенная ссылка",
      v7_risk_missing:"НЕТ ДОКАЗАТЕЛЬСТВА",v7_risk_ambiguous:"НЕОДНОЗНАЧНОЕ ТРЕБОВАНИЕ",v7_risk_human:"ПРОВЕРКА ЧЕЛОВЕКОМ",
      v7_flow_tender:"Тендер",v7_flow_tender_sub:"Исходные документы",v7_flow_requirements:"Требования",v7_flow_requirements_sub:"Структурированные пункты",
      v7_flow_evidence:"Доказательства",v7_flow_evidence_sub:"Прослеживаемые источники",v7_flow_gaps:"Пробелы",v7_flow_gaps_sub:"Недостающие доказательства и неоднозначности",
      v7_flow_review:"Проверка",v7_flow_review_sub:"Решение человека",v7_flow_reports:"Отчёты",v7_flow_reports_sub:"Результат для проверки",
      v7_ws_nav_overview:"Обзор",v7_ws_nav_requirements:"Требования",v7_ws_nav_evidence:"Доказательства",v7_ws_nav_gaps:"Пробелы и риски",v7_ws_nav_reports:"Отчёты",
      v7_ws_project_title:"RFP инфраструктуры ЦОД",v7_ws_project_sub:"126 требований · контролируемая проверка",v7_ws_review_ready:"ГОТОВО К ПРОВЕРКЕ",
      v7_ws_evidence_completeness:"Полнота доказательств",v7_ws_verified:"§ 4.2.1 проверен",v7_ws_open_gap:"ОТКРЫТЫЙ ПРОБЕЛ",v7_ws_gap_title:"Владение ключами",v7_ws_evidence_requested:"Запрошено доказательство",
      v7_ws_human_review:"ПРОВЕРКА ЧЕЛОВЕКОМ",v7_ws_decision_required:"Перед финализацией требуется решение. Оценка ИИ носит рекомендательный характер.",
      v7_ws_approve:"ОДОБРИТЬ",v7_ws_request_evidence:"ЗАПРОСИТЬ ДОКАЗАТЕЛЬСТВО",v7_scroll_label:"Продуктовый опыт, управляемый прокруткой"
    },
    ar: {
      v7_stage1_kicker:"01 عملية مضبوطة",v7_stage1_title:"افهم كل متطلب.",v7_stage1_body:"حوّل وثائق المناقصات الطويلة إلى متطلبات قابلة للتتبع والمراجعة من قبل الفريق.",
      v7_stage2_kicker:"ركّز دون فقدان السياق",v7_stage2_title:"يبرز متطلب واحد إلى الواجهة.",v7_stage2_body:"تبقى المناقصة مرئية، ويتقدم فقط السياق المطلوب لاتخاذ القرار.",
      v7_stage3_kicker:"02 أدلة قابلة للتحقق",v7_stage3_title:"اربط الادعاء بالدليل.",v7_stage3_body:"يبقى المتطلب والدليل والمصدر ضمن سلسلة واحدة قابلة للتتبع دون فقدان السياق.",
      v7_stage4_kicker:"03 اكتشاف مبكر للمخاطر",v7_stage4_title:"اكتشف الفجوات قبل التقديم.",v7_stage4_body:"تظهر الأدلة الناقصة وحالات الغموض داخل البنية نفسها بينما لا يزال بإمكان الفريق التصرف.",
      v7_stage5_kicker:"سير عمل مترابط",v7_stage5_title:"مرّر لأسفل، فتتحرك العملية أفقياً.",v7_stage5_body:"حركة تمرير واحدة تربط المناقصة والمتطلبات والأدلة والفجوات والمراجعة والتقارير.",
      v7_stage6_kicker:"سلطة القرار البشري",v7_stage6_title:"الذكاء الاصطناعي يساعد، والإنسان يقرر.",v7_stage6_body:"يتحول مخطط الأدلة المجرد إلى مساحة مراجعة قابلة للتتبع وتحت تحكم بشري.",
      v7_focus_req_title:"متطلب التشفير",v7_focus_req_text:"يجب تشفير جميع البيانات أثناء التخزين.",v7_status_review:"مراجعة",
      v7_evidence_label:"دليل",v7_evidence_title:"DOC-07 · بنية الأمان",v7_evidence_text:"القسم 4.2.1 · تشفير التخزين",
      v7_source_label:"المصدر",v7_source_title:"§ 4.2.1",v7_source_text:"مرجع موثّق",
      v7_risk_missing:"دليل مفقود",v7_risk_ambiguous:"متطلب غامض",v7_risk_human:"مراجعة بشرية",
      v7_flow_tender:"المناقصة",v7_flow_tender_sub:"المستندات المصدر",v7_flow_requirements:"المتطلبات",v7_flow_requirements_sub:"بنود مهيكلة",
      v7_flow_evidence:"الأدلة",v7_flow_evidence_sub:"مصادر قابلة للتتبع",v7_flow_gaps:"الفجوات",v7_flow_gaps_sub:"أدلة ناقصة وغموض",
      v7_flow_review:"المراجعة",v7_flow_review_sub:"سلطة القرار البشري",v7_flow_reports:"التقارير",v7_flow_reports_sub:"مخرجات جاهزة للمراجعة",
      v7_ws_nav_overview:"نظرة عامة",v7_ws_nav_requirements:"المتطلبات",v7_ws_nav_evidence:"الأدلة",v7_ws_nav_gaps:"الفجوات والمخاطر",v7_ws_nav_reports:"التقارير",
      v7_ws_project_title:"RFP بنية مركز البيانات",v7_ws_project_sub:"126 متطلباً · مراجعة مضبوطة",v7_ws_review_ready:"جاهز للمراجعة",
      v7_ws_evidence_completeness:"اكتمال الأدلة",v7_ws_verified:"تم التحقق من § 4.2.1",v7_ws_open_gap:"فجوة مفتوحة",v7_ws_gap_title:"ملكية المفاتيح",v7_ws_evidence_requested:"تم طلب الدليل",
      v7_ws_human_review:"مراجعة بشرية",v7_ws_decision_required:"يلزم قرار قبل الإنهاء. تقييم الذكاء الاصطناعي استشاري.",
      v7_ws_approve:"موافقة",v7_ws_request_evidence:"طلب دليل",v7_scroll_label:"تجربة منتج مدفوعة بالتمرير"
    }
  };

  function languageCode() {
    const value = String(root.lang || "tr").toLowerCase();
    if (value.startsWith("zh")) return "zh";
    if (value.startsWith("ru")) return "ru";
    if (value.startsWith("ar")) return "ar";
    if (value.startsWith("en")) return "en";
    return "tr";
  }

  function render() {
    const code = languageCode();
    const dictionary = translations[code] || null;
    document.querySelectorAll(selector).forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const fallback = defaults.get(key);
      element.textContent = dictionary && Object.prototype.hasOwnProperty.call(dictionary, key)
        ? dictionary[key]
        : fallback;
    });
  }

  const observer = new MutationObserver(render);
  observer.observe(root, { attributes: true, attributeFilter: ["lang", "dir"] });
  render();
})();
