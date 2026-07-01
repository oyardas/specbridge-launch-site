(function () {
  "use strict";

  const STORAGE_KEY = "specbridge-language";
  const DEFAULT_LANGUAGE = "tr";

  const translations = {
    tr: {
      language_label: "Türkçe",
      lang: "tr",
      p4b_nav_login: "Giriş",
      p4b_nav_signup: "Üye Ol",
      p4b_eyebrow: "Şartname ve ihale karar destek merkezi",
      p4b_title: "Şartnameden rapora, her karar kanıtlı ve insan onaylı.",
      p4b_lead: "SpecBridge AI, teknik şartname ve ihale dokümanlarını kaynak madde, gerekçe, risk seviyesi ve insan onay durumu ile birlikte yapılandırır.",
      p4b_sublead: "AI önerir. Ekibiniz inceler, düzeltir ve onaylar.",
      p4b_cta_primary: "Demo Talep Et",
      p4b_cta_secondary: "Örnek Raporu Gör",
      p4b_trust_controlled: "Kontrollü pilot",
      p4b_trust_no_upload: "Public upload yok",
      p4b_trust_synthetic: "Sentetik demo raporlar",
      p4b_trust_human: "İnsan onaylı karar desteği",
      p4b_board_title: "SpecBridge Komuta Paneli",
      p4b_board_subtitle: "İnceleme paketi · Kontrollü pilot",
      p4b_board_status: "İnsan onayı gerekli",
      p4b_card_clause_label: "Madde inceleme kuyruğu",
      p4b_card_clause_value: "14 bulgu",
      p4b_card_clause_note: "Risk işaretleri kaynak maddelerle bağlı kalır.",
      p4b_card_evidence_label: "Kanıt izi",
      p4b_card_evidence_value: "Madde + gerekçe",
      p4b_card_evidence_note: "Her öneri inceleme bağlamını korur.",
      p4b_card_signal_label: "Marka / ürün sinyalleri",
      p4b_card_signal_value: "Şartname dilinden tespit",
      p4b_card_signal_note: "Sinyaller otomatik ürün değişimi olmadan görünür olur.",
      p4b_card_approval_label: "Onay durumu",
      p4b_card_approval_value: "3 bekleyen karar",
      p4b_card_approval_note: "Nihai karar ekibinizde kalır.",
      p4b_flow_1_title: "Şartname ayrıştırıldı",
      p4b_flow_1_note: "Kaynak maddeler indekslendi",
      p4b_flow_2_title: "Riskler görünür",
      p4b_flow_2_note: "Manuel inceleme kuyruğu hazır",
      p4b_flow_3_title: "Rapor paketi",
      p4b_flow_3_note: "İnsan onayı bekliyor",
      dir: "ltr",
      title: "SpecBridge AI | İhale Zekâsı ve Presales Karar Desteği",
      description: "SpecBridge AI; ihale, şartname ve RFP dokümanlarını analiz ederek satış, presales, teknik ve yönetici ekipleri için yapılandırılmış karar destek raporları üretir.",
      nav_product: "Ürün",
      nav_reports: "Örnek Rapor",
      nav_use_cases: "Kullanım Alanları",
      nav_security: "Güven",
      nav_pilot: "Demo Talep Et",
      hero_eyebrow: "Şartname ve İhale Karar Merkezi",
      hero_title: "Şartnameden rapora, her karar kanıtlı ve insan onaylı.",
      hero_lead: "SpecBridge AI, teknik şartname ve ihale dokümanlarını analiz eder; madde bazlı riskleri, marka ve ürün sinyallerini, uygunluk matrisi hazırlığını ve her önerinin kaynak kanıt / onay durumunu görünür hale getirir.",
      hero_sublead: "Ürün karar vermez; karar sürecini hızlandırır, yapılandırır ve denetlenebilir hale getirir. AI önerir, insan onaylar.",
      hero_cta_primary: "Demo Talep Et",
      hero_cta_secondary: "Örnek Raporu Gör",
      hero_trust_source: "Kaynak maddeye bağlı bulgular",
      hero_trust_audit: "Denetlenebilir inceleme izi",
      hero_trust_approval: "İnsan onaylı iş akışı",
      command_preview_kicker: "SpecBridge Command Center",
      command_preview_status: "İnsan onayı gerekli",
      command_preview_clause_label: "Madde riski",
      command_preview_clause_value: "Manuel inceleme kuyruğu",
      command_preview_clause_note: "Riskler kaynak maddelere bağlı kalır.",
      command_preview_brand_label: "Marka ve ürün sinyalleri",
      command_preview_brand_value: "Şartname dilinden tespit edilir",
      command_preview_brand_note: "Sinyaller otomatik ürün ikamesi yapmadan görünür hale getirilir.",
      command_preview_evidence_label: "Kanıt izi",
      command_preview_evidence_value: "Madde, gerekçe, onay durumu",
      command_preview_evidence_note: "Bulgular rapor incelemesi için yapılandırılır.",
      command_preview_approval_label: "Onay akışı",
      command_preview_approval_value: "AI önerir, insan onaylar",
      command_preview_approval_note: "Karar ekibinizde kalır.",
      motion_ecosystem_eyebrow: "Karar Ekosistemi",
      motion_ecosystem_title: "Karar y\u00fczeyindeki sinyalleri birlikte inceleyin",
      motion_ecosystem_intro: "Sakin etkile\u015fim katman\u0131, teklif eforu ba\u015flamadan \u00f6nce ekiplerin g\u00f6zden ge\u00e7irmesi gereken alanlar\u0131 \u00f6ne \u00e7\u0131kar\u0131r.",
      motion_faq_eyebrow: "Pilot Sorular\u0131",
      motion_faq_title: "Ger\u00e7ek ihale dosyalar\u0131ndan \u00f6nce net s\u0131n\u0131rlar",
      motion_faq_1_q: "Bu web sitesine ger\u00e7ek ve gizli ihale dosyalar\u0131 y\u00fcklenebilir mi?",
      motion_faq_1_a: "Hay\u0131r. Public web sitesi statik bir lansman y\u00fczeyidir. Ger\u00e7ek dosyalar i\u00e7in mutab\u0131k kal\u0131nm\u0131\u015f pilot s\u00fcreci ve veri y\u00f6netim s\u0131n\u0131r\u0131 gerekir.",
      motion_faq_2_q: "Pilot inceleme ilk olarak neye bakar?",
      motion_faq_2_a: "\u0130lk inceleme, rapor yap\u0131s\u0131n\u0131, karar faydas\u0131n\u0131 ve i\u015f ak\u0131\u015f\u0131 uyumunu de\u011ferlendirmek i\u00e7in sentetik veya onayl\u0131 \u00f6rnek materyalle ba\u015flamal\u0131d\u0131r.",
      motion_faq_3_q: "SpecBridge AI hukuki veya ticari onay\u0131n yerine ge\u00e7er mi?",
      motion_faq_3_a: "Hay\u0131r. \u0130nceleme haz\u0131rl\u0131\u011f\u0131n\u0131 destekler. Nihai uyum, hukuk, ticari ve teklif kararlar\u0131 insan sorumlulu\u011fundad\u0131r.",
      motion_faq_4_q: "Presales ekipleri i\u00e7in hangi \u00e7\u0131kt\u0131lar faydal\u0131d\u0131r?",
      motion_faq_4_a: "Teklif ver / verme sinyalleri, gap g\u00f6r\u00fcn\u00fcrl\u00fc\u011f\u00fc, a\u00e7\u0131klama sorular\u0131, vendor-bias notlar\u0131, risk \u0131s\u0131 haritas\u0131 ve aksiyon plan\u0131 temel presales y\u00fczeyleridir.",
      motion_assistant_button: "Karar asistan\u0131",
      motion_assistant_eyebrow: "Rahats\u0131z etmeyen rehber",
      motion_assistant_title: "\u00d6rnek paketle ba\u015flay\u0131n",
      motion_assistant_text: "Sentetik rapor paketini \u00f6nce inceleyin; gizli materyal kullan\u0131lmadan \u00f6nce pilot veri y\u00f6netimi s\u0131n\u0131r\u0131n\u0131 netle\u015ftirin.",
      motion_assistant_cta: "\u00d6rnek \u00e7\u0131kt\u0131lar\u0131 g\u00f6r",
      hero_note: "Kontrollü demo ve pilot hazırlık aşaması. Henüz production SaaS servisi değildir.",
      trust_controlled_pilot: "Yalnızca kontrollü pilot",
      trust_no_public_upload: "Public doküman yükleme yok",
      trust_synthetic_samples: "Sentetik örnek raporlar",
      trust_human_review: "İnsan onaylı karar desteği",
      preview_eyebrow: "Karar Paketi Önizlemesi",
      preview_title: "Teklif emeği başlamadan önce daha incelenebilir bir karar yüzeyi",
      preview_intro: "SpecBridge AI, uzun ihale dokümanlarını teklif emeği başlamadan önce incelenebilir yönetici, teknik ve satış/presales karar görünümlerine dönüştürmek üzere konumlandırılır.",
      preview_exec_title: "Yönetici karar kartı",
      preview_exec_text: "Teklif ver / verme hazırlığı, genel skor, ana engeller ve yönetim incelemesi için önerilen sonraki aksiyonlar.",
      preview_matrix_title: "Uyumluluk matrisi önizlemesi",
      preview_matrix_text: "Madde durumu, kanıt ihtiyacı, ürün eşleştirme ve teknik doğrulama için organize edilmiş gap notları.",
      preview_risk_title: "Risk ve açıklama panosu",
      preview_risk_text: "Ticari, hukuki/idari, teslimat, SLA ve vendor-bias risklerini açıklama sorularına dönüştürür.",
      preview_note: "Kontrollü MVP akışında JSON ve dosya çıktıları authoritative kalır.",
      security_static_title: "Statik website sınırı",
      security_static_text: "Public website ihale dosyalarını işlemez ve production SaaS dosya alım kanalı olarak çalışmaz.",
      security_no_upload_title: "Gizli dosya yükleme yok",
      security_no_upload_text: "Pilot sözleşmesi, saklama ve silme kuralları netleşmeden gizli doküman gönderilmemelidir.",
      security_pilot_title: "Pilot kontrollü veri yönetimi",
      security_pilot_text: "Demo ve pilot materyali anonimleştirilmiş, sentetik veya kontrollü inceleme için açıkça onaylanmış olmalıdır.",
      security_advisory_title: "İnsan sorumluluğu",
      security_advisory_text: "Çıktılar inceleme ve karar hazırlığını destekler; nihai hukuki, ticari ve teklif kararları insan ekiplerde kalır.",
      final_cta_eyebrow: "Kontrollü Pilot Sonraki Adım",
      final_cta_title: "Gerçek ihale dosyalarını kullanmadan önce sentetik karar paketini inceleyin.",
      final_cta_text: "Anonim örnek paketle başlayın; ardından gizli doküman kullanılmadan önce pilot veri yönetimi, saklama ve insan inceleme sınırlarını netleştirin.",
      final_cta_primary: "Pilot Görüşmesi Talep Et",
      final_cta_secondary: "Örnek Paketi Gör",
      pilot_readiness_title: "Pilot ve demo talebi için güven hazırlığı",
      pilot_readiness_body: "Demo talebi, kapsamı netleştirmek ve doğru iletişim kanalını açmak için kullanılır. Bu aşamada public upload veya otomatik lead backend etkin değildir.",
      pilot_readiness_privacy_title: "KVKK ve gizlilik",
      pilot_readiness_privacy_text: "Demo sürecinde paylaşılan dokümanlar müşteri onayı olmadan yayınlanmaz veya üçüncü taraflarla paylaşılmaz.",
      pilot_readiness_security_title: "Güvenli değerlendirme",
      pilot_readiness_security_text: "Genel demo akışı anonim örnek dokümanlar ve kontrollü çıktı paketleri üzerinden gösterilir.",
      pilot_readiness_scope_title: "Pilot kapsamı",
      pilot_readiness_scope_text: "Pilot görüşmede doküman tipi, karar çıktıları, rapor profili ve güvenlik beklentileri birlikte netleştirilir.",
      pilot_readiness_note: "Form alanı demo talep niyetini netleştirir; backend/contact form davranışı bu patch ile değiştirilmez.",
      panel_title: "Karar Rapor Paketi",
      panel_badge: "Demo-ready MVP",
      panel_signal_label: "Teklif Ver / Verme Sinyali",
      panel_signal_value: "İnceleme Gerekli",
      signal_technical_fit: "Teknik Uyum",
      signal_compliance: "Uyumluluk Matrisi",
      signal_vendor_bias: "Vendor Bias",
      signal_commercial_risk: "Ticari Risk",
      signal_clarifications: "Açıklama Soruları",
      signal_structured: "Yapılandırılmış",
      signal_included: "Dahil",
      signal_flagged: "İşaretlenir",
      signal_reviewed: "Değerlendirilir",
      signal_generated: "Üretilir",
      product_eyebrow: "Ürün Akışı",
      product_title: "İhale dokümanından karar yüzeyine",
      product_intro: "SpecBridge AI, parçalı ihale inceleme işlerini yapılandırılmış, tekrarlanabilir ve gözden geçirilebilir bir karar paketine dönüştürür.",
      flow_1_title: "Kontrollü doküman alımı",
      flow_1_text: "Kontrollü demo akışında anonimleştirilmiş veya önceden onaylanmış ihale, RFP veya teknik şartname içeriği kullanılır. Public dosya yükleme açık değildir.",
      flow_2_title: "Analiz",
      flow_2_text: "Teknik, ticari, hukuki/idari, teslimat ve destekle ilgili riskler incelenir.",
      flow_3_title: "Karar",
      flow_3_text: "Teklif ver / verme hazırlığı, gap’ler, uyumluluk sinyalleri ve açıklama soruları değerlendirilir.",
      flow_4_title: "İndirme",
      flow_4_text: "Yönetici, teknik ve satış/presales rapor paketleri inceleme için üretilir.",
      coverage_eyebrow: "Analiz Kapsamı",
      coverage_title: "Teknik uyumluluğun ötesinde",
      feature_executive_summary: "Yönetici Özeti",
      feature_document_classification: "Doküman Sınıflandırması",
      feature_bid_no_bid: "Teklif Ver / Verme Önerisi",
      feature_technical_fit: "Teknik Uyum",
      feature_compliance_matrix: "Madde Bazlı Uyumluluk Matrisi",
      feature_gap_analysis: "Gap Analizi",
      feature_vendor_bias: "Vendor Bias / Lock-in İncelemesi",
      feature_rewrite: "Tarafsız Yeniden Yazım Önerileri",
      feature_evidence: "Kanıt / Ürün Eşleştirme",
      feature_clarifications: "Açıklama Soruları",
      feature_commercial_risk: "Ticari Risk",
      feature_legal_risk: "Hukuki / İdari Risk",
      feature_delivery_risk: "Teslimat / Kabul Riski",
      feature_sla: "SLA / Garanti / Destek İncelemesi",
      feature_bom: "BOM / Ürün Eşleştirme",
      feature_heatmap: "Risk Isı Haritası ve Aksiyon Planı",
      reports_eyebrow: "Rapor Profilleri",
      reports_title: "Farklı karar rolleri için farklı raporlar",
      report_exec_title: "Yönetici Raporu",
      report_exec_text: "Yönetim incelemesi için karar özeti, teklif ver / verme sinyali, ana riskler, temel gap’ler ve aksiyon planı.",
      report_tech_title: "Teknik Rapor",
      report_tech_text: "Madde bazlı uyumluluk, teknik uyum, ürün eşleştirme, kanıt gereksinimleri ve mimari riskler.",
      report_sales_title: "Satış / Presales Raporu",
      report_sales_text: "Fırsat yeterliliği, müşteri soruları, ticari risk, konumlandırma riskleri ve presales aksiyonları.",
      use_cases_eyebrow: "Kullanım Alanları",
      use_cases_title: "Karmaşık ihaleleri inceleyen ekipler için tasarlandı",
      case_bid_title: "Teklif Ver / Verme Desteği",
      case_bid_text: "Görünür teknik, ticari ve teslimat risk sinyalleriyle fırsat kararlarını daha erken verin.",
      case_compliance_title: "Uyumluluk İncelemesi",
      case_compliance_text: "Teknik ve idari isterleri incelenebilir çıktılara ve aksiyon kalemlerine dönüştürün.",
      case_bias_title: "Vendor Bias Tespiti",
      case_bias_text: "Lock-in dilini tespit edin; itiraz ve açıklama süreçleri için tarafsız yeniden yazım önerileri hazırlayın.",
      sample_eyebrow: "Örnek Raporlar",
      sample_title: "Anonimleştirilmiş demo çıktıları",
      sample_intro: "Örnek raporlar yalnızca anonimleştirilmiş demo senaryoları ile yayınlanır. Gerçek müşteri dokümanları açık onay ve hukuki/güvenlik hazırlığı olmadan kullanılmamalıdır.",
      sample_status: "Public anonim örnek",
      sample_box_title: "İndirilebilir örnek paket",
      sample_li_1: "Yönetici, teknik ve satış/presales örnek rapor görünümleri",
      sample_li_2: "Uyumluluk ve risk matrisi CSV",
      sample_li_3: "Açıklama soruları CSV",
      sample_li_4: "Teklif Ver / Verme karar kartı",
      sample_disclaimer: "Bu paket yalnızca sentetik bir senaryo kullanır. Gerçek müşteri verisi, gerçek ihale dokümanı, kişisel veri veya gizli vendor fiyatı içermez.",
      sample_download: "Örnek Paketi İndir",
      sample_view: "HTML Örneği Gör",
      security_eyebrow: "Güvenlik ve Gizlilik",
      security_title: "Hassas ihale dokümanı yönetimi etrafında tasarlandı",
      security_intro: "İhale ve RFP dokümanları hassas ticari, teknik ve hukuki bilgiler içerebilir. Pilot kullanım kontrollü veri yönetimi, açık saklama kuralları ve net silme politikası gerektirir.",
      security_callout_title: "Yalnızca danışma amaçlı çıktı.",
      security_callout_text: "SpecBridge AI çıktıları hukuki danışmanlık, nihai uyumluluk onayı, resmi satın alma görüşü veya bağlayıcı teklif ver / verme kararlarının yerine geçmez.",
      pilot_eyebrow: "Kontrollü Pilot",
      pilot_title: "Kontrollü pilot hazırlığı",
      pilot_intro: "SpecBridge AI şu anda kontrollü demo ve pilot hazırlık aşamasındadır. Bu iletişim alanı, gizlilik, KVKK ve backend süreçleri tamamlanana kadar statiktir; lütfen web sitesi üzerinden gizli dosya göndermeyin.",
      form_name: "Ad Soyad",
      form_company: "Şirket",
      form_email: "E-posta",
      form_role: "Rol",
      form_use_case: "İlgilenilen kullanım alanı",
      form_button: "Sadece statik form önizlemesi",
    form_name_label: "Ad Soyad",
    form_company_label: "Şirket",
    form_email_label: "E-posta",
    form_role_label: "Rol",
    form_use_case_label: "İlgilenilen kullanım alanı",
    form_consent: "KVKK Aydınlatma Metni, Privacy Policy ve Terms of Use bağlantılarını inceledim; demo/pilot talebim için tarafımla iletişime geçilmesini kabul ediyorum.",
    form_static_note: "Bu form şu anda statik önizlemedir. Backend, otomatik kayıt ve e-posta gönderimi etkin değildir; gizli dosya veya kişisel veri göndermeyin.",
      footer_stage: "© SpecBridge AI. Kontrollü demo ve pilot hazırlık aşaması.",
      footer_privacy: "Privacy Policy",
      footer_terms: "Terms of Use",
      footer_kvkk: "KVKK Aydınlatma Metni",
      footer_retention: "Data Retention",
      footer_deletion: "File Deletion",
      footer_contact: "İletişim / Pilot",
      footer_note: "Lütfen pilot sözleşmesi ve veri işleme süreci netleşmeden gizli ihale dokümanları, kişisel veri, ticari sırlar veya production dosyaları göndermeyin."
    },
    en: {
      language_label: "English",
      lang: "en",
      p4b_nav_login: "Sign in",
      p4b_nav_signup: "Sign up",
      p4b_eyebrow: "Tender and specification decision support center",
      p4b_title: "From specification to report, every decision is evidence-linked and human-approved.",
      p4b_lead: "SpecBridge AI structures technical specifications and tender documents with source clauses, rationale, risk level and human approval status.",
      p4b_sublead: "AI proposes. Your team reviews, edits and approves.",
      p4b_cta_primary: "Request demo",
      p4b_cta_secondary: "View example report",
      p4b_trust_controlled: "Controlled pilot",
      p4b_trust_no_upload: "No public upload",
      p4b_trust_synthetic: "Synthetic demo reports",
      p4b_trust_human: "Human-approved decision support",
      p4b_board_title: "SpecBridge Command Board",
      p4b_board_subtitle: "Review package · Controlled pilot",
      p4b_board_status: "Human approval required",
      p4b_card_clause_label: "Clause review queue",
      p4b_card_clause_value: "14 findings",
      p4b_card_clause_note: "Risk flags remain tied to source clauses.",
      p4b_card_evidence_label: "Evidence trail",
      p4b_card_evidence_value: "Clause + rationale",
      p4b_card_evidence_note: "Every recommendation keeps its review context.",
      p4b_card_signal_label: "Brand / product signals",
      p4b_card_signal_value: "Detected from specification wording",
      p4b_card_signal_note: "Signals are surfaced without automatic substitution.",
      p4b_card_approval_label: "Approval status",
      p4b_card_approval_value: "3 pending decisions",
      p4b_card_approval_note: "The final decision remains with your team.",
      p4b_flow_1_title: "Specification parsed",
      p4b_flow_1_note: "Source clauses indexed",
      p4b_flow_2_title: "Risks surfaced",
      p4b_flow_2_note: "Manual review queue ready",
      p4b_flow_3_title: "Report package",
      p4b_flow_3_note: "Awaiting human approval",
      dir: "ltr",
      title: "SpecBridge AI | Tender Intelligence & Presales Decision Support",
      description: "SpecBridge AI analyzes tender, specification and RFP documents to generate structured decision-support reports for sales, presales, technical and executive teams.",
      nav_product: "Product",
      nav_reports: "Example Report",
      nav_use_cases: "Use Cases",
      nav_security: "Trust",
      nav_pilot: "Request Demo",
      hero_eyebrow: "Tender and Specification Intelligence Command Center",
      hero_title: "From specification to report, every decision is evidence-linked and human-approved.",
      hero_lead: "SpecBridge AI analyzes technical specifications and tender documents, surfaces clause-level risks, detects brand and product signals, prepares compliance-matrix-ready findings, and keeps every recommendation tied to source evidence and approval status.",
      hero_sublead: "The product does not make the final decision; it accelerates, structures, and makes the decision process auditable. AI proposes, humans approve.",
      hero_cta_primary: "Request Demo",
      hero_cta_secondary: "View Example Report",
      hero_trust_source: "Source-linked findings",
      hero_trust_audit: "Auditable review trail",
      hero_trust_approval: "Human-approved workflow",
      command_preview_kicker: "SpecBridge Command Center",
      command_preview_status: "Human approval required",
      command_preview_clause_label: "Clause risk",
      command_preview_clause_value: "Manual review queue",
      command_preview_clause_note: "Risks stay tied to source clauses.",
      command_preview_brand_label: "Brand and product signals",
      command_preview_brand_value: "Detected from specification wording",
      command_preview_brand_note: "Signals are surfaced without automatic substitution.",
      command_preview_evidence_label: "Evidence trail",
      command_preview_evidence_value: "Clause, rationale, approval status",
      command_preview_evidence_note: "Findings are structured for report review.",
      command_preview_approval_label: "Approval workflow",
      command_preview_approval_value: "AI proposes, human approves",
      command_preview_approval_note: "The decision remains with your team.",
      motion_ecosystem_eyebrow: "Decision Ecosystem",
      motion_ecosystem_title: "Review signals across the tender decision surface",
      motion_ecosystem_intro: "A calm interaction layer highlights the areas teams usually need to inspect before proposal effort starts.",
      motion_faq_eyebrow: "Pilot Questions",
      motion_faq_title: "Clear boundaries before real tender files",
      motion_faq_1_q: "Can real confidential tender files be uploaded on this website?",
      motion_faq_1_a: "No. The public website is a static launch surface. Real files require an agreed pilot process and data handling boundary.",
      motion_faq_2_q: "What does the pilot review first?",
      motion_faq_2_a: "The first review should use synthetic or approved sample material to evaluate report structure, decision usefulness and workflow fit.",
      motion_faq_3_q: "Does SpecBridge AI replace legal or commercial approval?",
      motion_faq_3_a: "No. It supports review preparation. Final compliance, legal, commercial and bid decisions remain human-owned.",
      motion_faq_4_q: "Which outputs are useful for presales teams?",
      motion_faq_4_a: "Bid/no-bid signals, gap visibility, clarification questions, vendor-bias notes, risk heatmap and action planning are the primary presales surfaces.",
      motion_assistant_button: "Decision assistant",
      motion_assistant_eyebrow: "Non-intrusive guide",
      motion_assistant_title: "Start with a sample package",
      motion_assistant_text: "Review the synthetic report package first, then define pilot data handling before any confidential material is used.",
      motion_assistant_cta: "View sample outputs",
      hero_note: "Controlled demo and pilot preparation stage. Not a production SaaS service yet.",
      trust_controlled_pilot: "Controlled pilot only",
      trust_no_public_upload: "No public document upload",
      trust_synthetic_samples: "Synthetic sample reports",
      trust_human_review: "Human-reviewed decision support",
      preview_eyebrow: "Decision Package Preview",
      preview_title: "A more reviewable surface before proposal effort starts",
      preview_intro: "SpecBridge AI is positioned to convert long tender documents into executive, technical and sales/presales decision views that teams can inspect before committing proposal effort.",
      preview_exec_title: "Executive decision card",
      preview_exec_text: "Bid/no-bid readiness, overall score, top blockers and recommended next actions for leadership review.",
      preview_matrix_title: "Compliance matrix preview",
      preview_matrix_text: "Clause status, evidence needs, product mapping and gap notes organized for technical validation.",
      preview_risk_title: "Risk and clarification board",
      preview_risk_text: "Commercial, legal/admin, delivery, SLA and vendor-bias risks converted into clarification questions.",
      preview_note: "JSON and file outputs remain authoritative in the controlled MVP workflow.",
      security_static_title: "Static website boundary",
      security_static_text: "The public website does not process tender files or operate as a production SaaS intake channel.",
      security_no_upload_title: "No confidential upload",
      security_no_upload_text: "Confidential documents should not be sent before pilot agreement, retention and deletion rules are confirmed.",
      security_pilot_title: "Pilot-controlled handling",
      security_pilot_text: "Demo and pilot material should be anonymized, synthetic or explicitly approved for controlled review.",
      security_advisory_title: "Human accountability",
      security_advisory_text: "Outputs support review and decision preparation; final legal, commercial and bid decisions remain human-owned.",
      final_cta_eyebrow: "Controlled Pilot Next Step",
      final_cta_title: "Review a synthetic decision package before using real tender files.",
      final_cta_text: "Start with the anonymized sample package, then define pilot data handling, retention and human review boundaries before any confidential document is used.",
      final_cta_primary: "Request Pilot Discussion",
      final_cta_secondary: "View Sample Package",
      pilot_readiness_title: "Trust readiness for pilot and demo requests",
      pilot_readiness_body: "The demo request flow is used to clarify scope and open the right communication path. Public upload or automated lead backend is not enabled at this stage.",
      pilot_readiness_privacy_title: "Privacy and data protection",
      pilot_readiness_privacy_text: "Documents shared during the demo process are not published or shared with third parties without customer approval.",
      pilot_readiness_security_title: "Controlled evaluation",
      pilot_readiness_security_text: "The general demo flow is presented through anonymized sample documents and controlled report packages.",
      pilot_readiness_scope_title: "Pilot scope",
      pilot_readiness_scope_text: "The pilot discussion aligns document type, decision outputs, report profile, and security expectations.",
      pilot_readiness_note: "This patch does not change backend or contact form behavior.",
      panel_title: "Decision Report Package",
      panel_badge: "Demo-ready MVP",
      panel_signal_label: "Bid / No-Bid Signal",
      panel_signal_value: "Review Required",
      signal_technical_fit: "Technical Fit",
      signal_compliance: "Compliance Matrix",
      signal_vendor_bias: "Vendor Bias",
      signal_commercial_risk: "Commercial Risk",
      signal_clarifications: "Clarification Questions",
      signal_structured: "Structured",
      signal_included: "Included",
      signal_flagged: "Flagged",
      signal_reviewed: "Reviewed",
      signal_generated: "Generated",
      product_eyebrow: "Product Flow",
      product_title: "From tender document to decision surface",
      product_intro: "SpecBridge AI converts fragmented tender review work into a structured, repeatable and reviewable decision package.",
      flow_1_title: "Controlled document intake",
      flow_1_text: "Use anonymized or pre-approved tender, RFP or technical specification content in a controlled demo workflow. Public file upload is not enabled.",
      flow_2_title: "Analyze",
      flow_2_text: "Review technical, commercial, legal/admin, delivery and support-related risks.",
      flow_3_title: "Decide",
      flow_3_text: "Evaluate bid/no-bid readiness, gaps, compliance signals and clarification questions.",
      flow_4_title: "Download",
      flow_4_text: "Generate executive, technical and sales/presales report packages for review.",
      coverage_eyebrow: "Analysis Coverage",
      coverage_title: "Beyond technical compliance",
      feature_executive_summary: "Executive Summary",
      feature_document_classification: "Document Classification",
      feature_bid_no_bid: "Bid / No-Bid Recommendation",
      feature_technical_fit: "Technical Fit",
      feature_compliance_matrix: "Clause Compliance Matrix",
      feature_gap_analysis: "Gap Analysis",
      feature_vendor_bias: "Vendor Bias / Lock-in Review",
      feature_rewrite: "Neutral Rewrite Suggestions",
      feature_evidence: "Evidence / Product Mapping",
      feature_clarifications: "Clarification Questions",
      feature_commercial_risk: "Commercial Risk",
      feature_legal_risk: "Legal / Administrative Risk",
      feature_delivery_risk: "Delivery / Acceptance Risk",
      feature_sla: "SLA / Warranty / Support Review",
      feature_bom: "BOM / Product Mapping",
      feature_heatmap: "Risk Heatmap & Action Plan",
      reports_eyebrow: "Report Profiles",
      reports_title: "Different reports for different decision roles",
      report_exec_title: "Executive Report",
      report_exec_text: "Decision summary, bid/no-bid signal, top risks, key gaps and action plan for management review.",
      report_tech_title: "Technical Report",
      report_tech_text: "Clause-level compliance, technical fit, product mapping, evidence requirements and architecture risks.",
      report_sales_title: "Sales / Presales Report",
      report_sales_text: "Opportunity qualification, customer questions, commercial risk, positioning risks and presales actions.",
      use_cases_eyebrow: "Use Cases",
      use_cases_title: "Designed for teams reviewing complex tenders",
      case_bid_title: "Bid / No-Bid Support",
      case_bid_text: "Make opportunity decisions earlier with visible technical, commercial and delivery risk signals.",
      case_compliance_title: "Compliance Review",
      case_compliance_text: "Structure technical and administrative requirements into reviewable outputs and action items.",
      case_bias_title: "Vendor Bias Detection",
      case_bias_text: "Detect lock-in language and prepare neutral rewrite suggestions for objection and clarification workflows.",
      sample_eyebrow: "Sample Reports",
      sample_title: "Anonymized demo outputs",
      sample_intro: "Sample reports will be published using anonymized demo scenarios only. Real customer documents must not be used without explicit approval and legal/security readiness.",
      sample_status: "Public anonymized sample",
      sample_box_title: "Downloadable sample package",
      sample_li_1: "Executive, technical and sales/presales sample report views",
      sample_li_2: "Compliance and risk matrix CSV",
      sample_li_3: "Clarification questions CSV",
      sample_li_4: "Bid / No-Bid decision card",
      sample_disclaimer: "This package uses a synthetic scenario only. It does not include real customer data, real tender documents, personal data or confidential vendor pricing.",
      sample_download: "Download Sample Package",
      sample_view: "View HTML Sample",
      security_eyebrow: "Security & Privacy",
      security_title: "Built around sensitive tender document handling",
      security_intro: "Tender and RFP documents may contain sensitive commercial, technical and legal information. Pilot use requires controlled data handling, clear retention rules and explicit deletion policy.",
      security_callout_title: "Advisory output only.",
      security_callout_text: "SpecBridge AI outputs do not replace legal advice, final compliance approval, official procurement opinion or binding bid/no-bid decisions.",
      pilot_eyebrow: "Controlled Pilot",
      pilot_title: "Controlled pilot preparation",
      pilot_intro: "SpecBridge AI is currently in controlled demo and pilot preparation stage. This contact area is static until privacy, KVKK and backend handling are finalized; please do not submit confidential files through the website.",
      form_name: "Name",
      form_company: "Company",
      form_email: "Email",
      form_role: "Role",
      form_use_case: "Interested use case",
      form_button: "Static form preview only",
    form_name_label: "Full name",
    form_company_label: "Company",
    form_email_label: "Email",
    form_role_label: "Role",
    form_use_case_label: "Use case of interest",
    form_consent: "I have reviewed the KVKK Clarification Notice, Privacy Policy and Terms of Use links, and I agree to be contacted about my demo/pilot request.",
    form_static_note: "This form is currently a static preview. Backend delivery, automated storage and email sending are not enabled; do not submit confidential files or personal data.",
      footer_stage: "© SpecBridge AI. Controlled demo and pilot preparation stage.",
      footer_privacy: "Privacy Policy",
      footer_terms: "Terms of Use",
      footer_kvkk: "KVKK Aydınlatma Metni",
      footer_retention: "Data Retention",
      footer_deletion: "File Deletion",
      footer_contact: "Contact / Pilot",
      footer_note: "Please do not send confidential tender documents, personal data, commercial secrets or production files before a pilot agreement and data handling process are confirmed."
    },
    zh: {
      language_label: "中文",
      lang: "zh-Hans",
      p4b_nav_login: "登录",
      p4b_nav_signup: "注册",
      p4b_eyebrow: "招标与技术规格决策支持中心",
      p4b_title: "从规格到报告，每个决策都有证据链并经过人工确认。",
      p4b_lead: "SpecBridge AI 将技术规格和招标文件按来源条款、理由、风险等级和人工审批状态进行结构化。",
      p4b_sublead: "AI 提出建议，团队审阅、修改并批准。",
      p4b_cta_primary: "申请演示",
      p4b_cta_secondary: "查看示例报告",
      p4b_trust_controlled: "受控试点",
      p4b_trust_no_upload: "无公开上传",
      p4b_trust_synthetic: "合成演示报告",
      p4b_trust_human: "人工审批的决策支持",
      p4b_board_title: "SpecBridge 指挥面板",
      p4b_board_subtitle: "审阅包 · 受控试点",
      p4b_board_status: "需要人工审批",
      p4b_card_clause_label: "条款审阅队列",
      p4b_card_clause_value: "14 项发现",
      p4b_card_clause_note: "风险标记始终关联来源条款。",
      p4b_card_evidence_label: "证据链",
      p4b_card_evidence_value: "条款 + 理由",
      p4b_card_evidence_note: "每项建议都保留审阅上下文。",
      p4b_card_signal_label: "品牌 / 产品信号",
      p4b_card_signal_value: "从规格措辞中识别",
      p4b_card_signal_note: "显示信号，但不自动替换产品。",
      p4b_card_approval_label: "审批状态",
      p4b_card_approval_value: "3 个待决事项",
      p4b_card_approval_note: "最终决策仍由您的团队负责。",
      p4b_flow_1_title: "规格已解析",
      p4b_flow_1_note: "来源条款已索引",
      p4b_flow_2_title: "风险已呈现",
      p4b_flow_2_note: "人工审阅队列已就绪",
      p4b_flow_3_title: "报告包",
      p4b_flow_3_note: "等待人工审批",
      dir: "ltr",
      title: "SpecBridge AI | 招标情报与售前决策支持",
      description: "SpecBridge AI 分析招标、技术规范和 RFP 文档，为销售、售前、技术和管理团队生成结构化决策支持报告。",
      nav_product: "产品",
      nav_reports: "示例报告",
      nav_use_cases: "应用场景",
      nav_security: "信任",
      nav_pilot: "申请演示",
      hero_eyebrow: "招标与规格智能指挥中心",
      hero_title: "从规格到报告，每项决策都有证据链并经过人工确认。",
      hero_lead: "SpecBridge AI 分析技术规格和招标文件，呈现条款级风险、品牌和产品信号、合规矩阵准备情况，并将每项建议连接到来源证据和审批状态。",
      hero_sublead: "产品不会替代最终决策；它帮助团队加快、结构化并审计决策流程。AI 提出建议，人工确认。",
      hero_cta_primary: "申请演示",
      hero_cta_secondary: "查看示例报告",
      hero_trust_source: "关联来源条款的发现",
      hero_trust_audit: "可审计的审查轨迹",
      hero_trust_approval: "人工确认的工作流",
      command_preview_kicker: "SpecBridge 指挥中心",
      command_preview_status: "需要人工确认",
      command_preview_clause_label: "条款风险",
      command_preview_clause_value: "人工复核队列",
      command_preview_clause_note: "风险始终关联到来源条款。",
      command_preview_brand_label: "品牌和产品信号",
      command_preview_brand_value: "从规格文本中识别",
      command_preview_brand_note: "仅呈现信号，不进行自动替代。",
      command_preview_evidence_label: "证据链",
      command_preview_evidence_value: "条款、理由、审批状态",
      command_preview_evidence_note: "发现结果按报告复核结构整理。",
      command_preview_approval_label: "审批流程",
      command_preview_approval_value: "AI 提出建议，人工确认",
      command_preview_approval_note: "最终决策仍由您的团队负责。",
      motion_ecosystem_eyebrow: "Decision Ecosystem",
      motion_ecosystem_title: "Review signals across the tender decision surface",
      motion_ecosystem_intro: "A calm interaction layer highlights the areas teams usually need to inspect before proposal effort starts.",
      motion_faq_eyebrow: "Pilot Questions",
      motion_faq_title: "Clear boundaries before real tender files",
      motion_faq_1_q: "Can real confidential tender files be uploaded on this website?",
      motion_faq_1_a: "No. The public website is a static launch surface. Real files require an agreed pilot process and data handling boundary.",
      motion_faq_2_q: "What does the pilot review first?",
      motion_faq_2_a: "The first review should use synthetic or approved sample material to evaluate report structure, decision usefulness and workflow fit.",
      motion_faq_3_q: "Does SpecBridge AI replace legal or commercial approval?",
      motion_faq_3_a: "No. It supports review preparation. Final compliance, legal, commercial and bid decisions remain human-owned.",
      motion_faq_4_q: "Which outputs are useful for presales teams?",
      motion_faq_4_a: "Bid/no-bid signals, gap visibility, clarification questions, vendor-bias notes, risk heatmap and action planning are the primary presales surfaces.",
      motion_assistant_button: "Decision assistant",
      motion_assistant_eyebrow: "Non-intrusive guide",
      motion_assistant_title: "Start with a sample package",
      motion_assistant_text: "Review the synthetic report package first, then define pilot data handling before any confidential material is used.",
      motion_assistant_cta: "View sample outputs",
      hero_note: "当前处于受控演示和试点准备阶段，尚不是生产级 SaaS 服务。",
      trust_controlled_pilot: "仅限受控试点",
      trust_no_public_upload: "无公开文档上传",
      trust_synthetic_samples: "合成样例报告",
      trust_human_review: "人工复核的决策支持",
      preview_eyebrow: "决策包预览",
      preview_title: "在投入方案工作前获得更可审查的决策界面",
      preview_intro: "SpecBridge AI 面向将长篇招标文档转化为管理、技术和销售/售前决策视图，供团队在投入方案工作前审查。",
      preview_exec_title: "管理决策卡",
      preview_exec_text: "投标/不投标准备度、总体评分、主要阻碍和供管理层审查的下一步建议。",
      preview_matrix_title: "合规矩阵预览",
      preview_matrix_text: "条款状态、证据需求、产品映射和用于技术验证的差距说明。",
      preview_risk_title: "风险与澄清看板",
      preview_risk_text: "将商业、法律/行政、交付、SLA 和供应商倾向风险转化为澄清问题。",
      preview_note: "在受控 MVP 流程中，JSON 和文件输出保持为权威依据。",
      security_static_title: "静态网站边界",
      security_static_text: "公开网站不处理招标文件，也不作为生产级 SaaS 文件接收通道。",
      security_no_upload_title: "无机密文件上传",
      security_no_upload_text: "在试点协议、保留和删除规则确认前，不应发送机密文档。",
      security_pilot_title: "试点受控处理",
      security_pilot_text: "演示和试点材料应为匿名化、合成或已明确批准用于受控审查的内容。",
      security_advisory_title: "人工责任",
      security_advisory_text: "输出支持审查和决策准备；最终法律、商业和投标决策仍由人工团队负责。",
      final_cta_eyebrow: "受控试点下一步",
      final_cta_title: "在使用真实招标文件前先审查合成决策包。",
      final_cta_text: "从匿名样例包开始，然后在使用任何机密文档前明确试点数据处理、保留和人工审查边界。",
      final_cta_primary: "申请试点沟通",
      final_cta_secondary: "查看样例包",
      pilot_readiness_title: "试点和演示申请的可信准备",
      pilot_readiness_body: "演示申请流程用于明确范围并建立正确的沟通路径。当前阶段不启用公开上传或自动线索后端。",
      pilot_readiness_privacy_title: "隐私与数据保护",
      pilot_readiness_privacy_text: "未经客户批准，演示过程中共享的文档不会被发布或提供给第三方。",
      pilot_readiness_security_title: "受控评估",
      pilot_readiness_security_text: "通用演示流程基于匿名样本文档和受控报告包进行展示。",
      pilot_readiness_scope_title: "试点范围",
      pilot_readiness_scope_text: "试点沟通将明确文档类型、决策输出、报告配置和安全期望。",
      pilot_readiness_note: "此补丁不会更改后端或联系表单行为。",
      panel_title: "决策报告包",
      panel_badge: "演示就绪 MVP",
      panel_signal_label: "投标 / 不投标信号",
      panel_signal_value: "需要复核",
      signal_technical_fit: "技术匹配",
      signal_compliance: "合规矩阵",
      signal_vendor_bias: "供应商倾向",
      signal_commercial_risk: "商业风险",
      signal_clarifications: "澄清问题",
      signal_structured: "结构化",
      signal_included: "已包含",
      signal_flagged: "已标记",
      signal_reviewed: "已评估",
      signal_generated: "已生成",
      product_eyebrow: "产品流程",
      product_title: "从招标文档到决策界面",
      product_intro: "SpecBridge AI 将分散的招标评审工作转化为结构化、可重复、可审查的决策包。",
      flow_1_title: "受控文档输入",
      flow_1_text: "在受控演示流程中使用匿名化或预先批准的招标、RFP 或技术规范内容。公开文件上传未启用。",
      flow_2_title: "分析",
      flow_2_text: "评审技术、商业、法律/行政、交付和支持相关风险。",
      flow_3_title: "决策",
      flow_3_text: "评估投标/不投标准备度、缺口、合规信号和澄清问题。",
      flow_4_title: "下载",
      flow_4_text: "生成管理、技术和销售/售前报告包供审查。",
      coverage_eyebrow: "分析范围",
      coverage_title: "超越技术合规",
      feature_executive_summary: "管理摘要",
      feature_document_classification: "文档分类",
      feature_bid_no_bid: "投标 / 不投标建议",
      feature_technical_fit: "技术匹配",
      feature_compliance_matrix: "条款合规矩阵",
      feature_gap_analysis: "缺口分析",
      feature_vendor_bias: "供应商倾向 / 锁定审查",
      feature_rewrite: "中立改写建议",
      feature_evidence: "证据 / 产品映射",
      feature_clarifications: "澄清问题",
      feature_commercial_risk: "商业风险",
      feature_legal_risk: "法律 / 行政风险",
      feature_delivery_risk: "交付 / 验收风险",
      feature_sla: "SLA / 质保 / 支持审查",
      feature_bom: "BOM / 产品映射",
      feature_heatmap: "风险热力图与行动计划",
      reports_eyebrow: "报告类型",
      reports_title: "面向不同决策角色的不同报告",
      report_exec_title: "管理报告",
      report_exec_text: "用于管理层审查的决策摘要、投标/不投标信号、主要风险、关键缺口和行动计划。",
      report_tech_title: "技术报告",
      report_tech_text: "条款级合规、技术匹配、产品映射、证据要求和架构风险。",
      report_sales_title: "销售 / 售前报告",
      report_sales_text: "机会资格判断、客户问题、商业风险、定位风险和售前行动。",
      use_cases_eyebrow: "应用场景",
      use_cases_title: "为评审复杂招标的团队设计",
      case_bid_title: "投标 / 不投标支持",
      case_bid_text: "通过可见的技术、商业和交付风险信号，更早做出机会决策。",
      case_compliance_title: "合规审查",
      case_compliance_text: "将技术和行政要求结构化为可审查输出和行动项。",
      case_bias_title: "供应商倾向检测",
      case_bias_text: "检测锁定性语言，并为异议和澄清流程准备中立改写建议。",
      sample_eyebrow: "样例报告",
      sample_title: "匿名化演示输出",
      sample_intro: "样例报告仅使用匿名化演示场景发布。未经明确批准和法律/安全准备，不得使用真实客户文档。",
      sample_status: "公开匿名样例",
      sample_box_title: "可下载样例包",
      sample_li_1: "管理、技术和销售/售前样例报告视图",
      sample_li_2: "合规与风险矩阵 CSV",
      sample_li_3: "澄清问题 CSV",
      sample_li_4: "投标 / 不投标决策卡",
      sample_disclaimer: "该包仅使用合成场景，不包含真实客户数据、真实招标文档、个人数据或保密供应商价格。",
      sample_download: "下载样例包",
      sample_view: "查看 HTML 样例",
      security_eyebrow: "安全与隐私",
      security_title: "围绕敏感招标文档处理而设计",
      security_intro: "招标和 RFP 文档可能包含敏感的商业、技术和法律信息。试点使用需要受控数据处理、明确保留规则和清晰删除政策。",
      security_callout_title: "仅作为参考输出。",
      security_callout_text: "SpecBridge AI 输出不能替代法律建议、最终合规批准、正式采购意见或有约束力的投标/不投标决策。",
      pilot_eyebrow: "受控试点",
      pilot_title: "受控试点准备",
      pilot_intro: "SpecBridge AI 当前处于受控演示和试点准备阶段。在隐私、KVKK 和后端处理完成前，该联系区域为静态内容；请不要通过网站提交机密文件。",
      form_name: "姓名",
      form_company: "公司",
      form_email: "电子邮件",
      form_role: "角色",
      form_use_case: "感兴趣的应用场景",
      form_button: "仅静态表单预览",
    form_name_label: "姓名",
    form_company_label: "公司",
    form_email_label: "电子邮件",
    form_role_label: "职位",
    form_use_case_label: "关注的使用场景",
    form_consent: "我已查看 KVKK 说明、隐私政策和使用条款链接，并同意就我的演示/试点请求与我联系。",
    form_static_note: "此表单目前仅为静态预览。后端提交、自动存储和邮件发送尚未启用；请勿提交机密文件或个人数据。",
      footer_stage: "© SpecBridge AI。受控演示和试点准备阶段。",
      footer_privacy: "隐私政策",
      footer_terms: "使用条款",
      footer_kvkk: "KVKK 告知文本",
      footer_retention: "数据保留",
      footer_deletion: "文件删除",
      footer_contact: "联系 / 试点",
      footer_note: "在试点协议和数据处理流程确认前，请不要发送机密招标文档、个人数据、商业秘密或生产文件。"
    },
    ru: {
      language_label: "Русский",
      lang: "ru",
      p4b_nav_login: "Вход",
      p4b_nav_signup: "Регистрация",
      p4b_eyebrow: "Центр поддержки решений по тендерам и спецификациям",
      p4b_title: "От спецификации до отчета: каждое решение связано с доказательствами и подтверждается человеком.",
      p4b_lead: "SpecBridge AI структурирует технические спецификации и тендерные документы по исходным пунктам, обоснованию, уровню риска и статусу человеческого одобрения.",
      p4b_sublead: "AI предлагает. Ваша команда проверяет, редактирует и утверждает.",
      p4b_cta_primary: "Запросить демо",
      p4b_cta_secondary: "Посмотреть пример отчета",
      p4b_trust_controlled: "Контролируемый пилот",
      p4b_trust_no_upload: "Нет публичной загрузки",
      p4b_trust_synthetic: "Синтетические демо-отчеты",
      p4b_trust_human: "Поддержка решений с одобрением человека",
      p4b_board_title: "Панель управления SpecBridge",
      p4b_board_subtitle: "Пакет проверки · Контролируемый пилот",
      p4b_board_status: "Требуется одобрение человека",
      p4b_card_clause_label: "Очередь проверки пунктов",
      p4b_card_clause_value: "14 находок",
      p4b_card_clause_note: "Риски остаются связанными с исходными пунктами.",
      p4b_card_evidence_label: "След доказательств",
      p4b_card_evidence_value: "Пункт + обоснование",
      p4b_card_evidence_note: "Каждая рекомендация сохраняет контекст проверки.",
      p4b_card_signal_label: "Сигналы бренда / продукта",
      p4b_card_signal_value: "Выявлено из текста спецификации",
      p4b_card_signal_note: "Сигналы показываются без автоматической замены.",
      p4b_card_approval_label: "Статус одобрения",
      p4b_card_approval_value: "3 решения ожидают",
      p4b_card_approval_note: "Окончательное решение остается за вашей командой.",
      p4b_flow_1_title: "Спецификация разобрана",
      p4b_flow_1_note: "Исходные пункты индексированы",
      p4b_flow_2_title: "Риски выявлены",
      p4b_flow_2_note: "Очередь ручной проверки готова",
      p4b_flow_3_title: "Пакет отчета",
      p4b_flow_3_note: "Ожидает одобрения человека",
      dir: "ltr",
      title: "SpecBridge AI | Тендерная аналитика и поддержка пресейлз-решений",
      description: "SpecBridge AI анализирует тендерные документы, спецификации и RFP, создавая структурированные отчеты поддержки решений для продаж, пресейлз, технических и руководящих команд.",
      nav_product: "Продукт",
      nav_reports: "Пример отчета",
      nav_use_cases: "Сценарии",
      nav_security: "Доверие",
      nav_pilot: "Запросить демо",
      hero_eyebrow: "Центр управления тендерной и спецификационной аналитикой",
      hero_title: "От спецификации до отчета: каждое решение связано с доказательствами и подтверждается человеком.",
      hero_lead: "SpecBridge AI анализирует технические спецификации и тендерные документы, выявляет риски на уровне пунктов, сигналы брендов и продуктов, готовность матрицы соответствия и связывает каждую рекомендацию с исходным доказательством и статусом утверждения.",
      hero_sublead: "Продукт не принимает окончательное решение; он ускоряет, структурирует и делает процесс принятия решений проверяемым. AI предлагает, человек утверждает.",
      hero_cta_primary: "Запросить демо",
      hero_cta_secondary: "Смотреть пример отчета",
      hero_trust_source: "Выводы со ссылкой на источник",
      hero_trust_audit: "Проверяемый след рассмотрения",
      hero_trust_approval: "Процесс с утверждением человеком",
      command_preview_kicker: "SpecBridge Command Center",
      command_preview_status: "Требуется подтверждение человеком",
      command_preview_clause_label: "Риск по пунктам",
      command_preview_clause_value: "Очередь ручной проверки",
      command_preview_clause_note: "Риски остаются привязанными к исходным пунктам.",
      command_preview_brand_label: "Сигналы брендов и продуктов",
      command_preview_brand_value: "Выявляются из текста спецификации",
      command_preview_brand_note: "Сигналы показываются без автоматической замены продукта.",
      command_preview_evidence_label: "Цепочка доказательств",
      command_preview_evidence_value: "Пункт, обоснование, статус утверждения",
      command_preview_evidence_note: "Выводы структурируются для проверки отчета.",
      command_preview_approval_label: "Процесс утверждения",
      command_preview_approval_value: "AI предлагает, человек утверждает",
      command_preview_approval_note: "Решение остается за вашей командой.",
      motion_ecosystem_eyebrow: "Decision Ecosystem",
      motion_ecosystem_title: "Review signals across the tender decision surface",
      motion_ecosystem_intro: "A calm interaction layer highlights the areas teams usually need to inspect before proposal effort starts.",
      motion_faq_eyebrow: "Pilot Questions",
      motion_faq_title: "Clear boundaries before real tender files",
      motion_faq_1_q: "Can real confidential tender files be uploaded on this website?",
      motion_faq_1_a: "No. The public website is a static launch surface. Real files require an agreed pilot process and data handling boundary.",
      motion_faq_2_q: "What does the pilot review first?",
      motion_faq_2_a: "The first review should use synthetic or approved sample material to evaluate report structure, decision usefulness and workflow fit.",
      motion_faq_3_q: "Does SpecBridge AI replace legal or commercial approval?",
      motion_faq_3_a: "No. It supports review preparation. Final compliance, legal, commercial and bid decisions remain human-owned.",
      motion_faq_4_q: "Which outputs are useful for presales teams?",
      motion_faq_4_a: "Bid/no-bid signals, gap visibility, clarification questions, vendor-bias notes, risk heatmap and action planning are the primary presales surfaces.",
      motion_assistant_button: "Decision assistant",
      motion_assistant_eyebrow: "Non-intrusive guide",
      motion_assistant_title: "Start with a sample package",
      motion_assistant_text: "Review the synthetic report package first, then define pilot data handling before any confidential material is used.",
      motion_assistant_cta: "View sample outputs",
      hero_note: "Стадия контролируемой демонстрации и подготовки пилота. Пока не является production SaaS-сервисом.",
      trust_controlled_pilot: "Только контролируемый пилот",
      trust_no_public_upload: "Нет публичной загрузки документов",
      trust_synthetic_samples: "Синтетические примеры отчетов",
      trust_human_review: "Поддержка решений с проверкой человеком",
      preview_eyebrow: "Предпросмотр пакета решений",
      preview_title: "Более проверяемая поверхность до начала подготовки предложения",
      preview_intro: "SpecBridge AI предназначен для преобразования длинных тендерных документов в управленческие, технические и sales/presales представления, которые команды могут проверить до вложения усилий в предложение.",
      preview_exec_title: "Карточка управленческого решения",
      preview_exec_text: "Готовность bid/no-bid, общий балл, основные блокеры и рекомендуемые следующие действия для руководства.",
      preview_matrix_title: "Предпросмотр матрицы соответствия",
      preview_matrix_text: "Статус пунктов, потребности в доказательствах, сопоставление продуктов и gap-заметки для технической проверки.",
      preview_risk_title: "Панель рисков и уточнений",
      preview_risk_text: "Коммерческие, юридические/административные, поставочные, SLA и vendor-bias риски преобразуются в вопросы для уточнения.",
      preview_note: "В контролируемом MVP-процессе JSON и файловые результаты остаются authoritative.",
      security_static_title: "Граница статического сайта",
      security_static_text: "Публичный сайт не обрабатывает тендерные файлы и не является production SaaS-каналом приема файлов.",
      security_no_upload_title: "Нет загрузки конфиденциальных файлов",
      security_no_upload_text: "Конфиденциальные документы не следует отправлять до подтверждения пилотного соглашения, правил хранения и удаления.",
      security_pilot_title: "Контролируемая обработка в пилоте",
      security_pilot_text: "Демо- и пилотные материалы должны быть анонимизированными, синтетическими или явно одобренными для контролируемой проверки.",
      security_advisory_title: "Ответственность человека",
      security_advisory_text: "Выводы поддерживают проверку и подготовку решений; финальные юридические, коммерческие и bid-решения остаются за людьми.",
      final_cta_eyebrow: "Следующий шаг контролируемого пилота",
      final_cta_title: "Проверьте синтетический пакет решений до использования реальных тендерных файлов.",
      final_cta_text: "Начните с анонимного sample package, затем определите обработку пилотных данных, хранение и границы human review до использования конфиденциальных документов.",
      final_cta_primary: "Запросить обсуждение пилота",
      final_cta_secondary: "Посмотреть sample package",
      pilot_readiness_title: "Подготовка доверия для пилота и демо",
      pilot_readiness_body: "Запрос демо используется для уточнения объема и выбора правильного канала коммуникации. Публичная загрузка и автоматический backend для лидов на этом этапе не включены.",
      pilot_readiness_privacy_title: "Конфиденциальность и защита данных",
      pilot_readiness_privacy_text: "Документы, переданные в рамках демо, не публикуются и не передаются третьим сторонам без согласия клиента.",
      pilot_readiness_security_title: "Контролируемая оценка",
      pilot_readiness_security_text: "Общий демо-процесс показывается на анонимных примерах документов и контролируемых пакетах отчетов.",
      pilot_readiness_scope_title: "Объем пилота",
      pilot_readiness_scope_text: "В пилотном обсуждении уточняются тип документа, управленческие выводы, профиль отчета и требования безопасности.",
      pilot_readiness_note: "Этот patch не меняет поведение backend или контактной формы.",
      panel_title: "Пакет отчетов для решения",
      panel_badge: "MVP готово к демо",
      panel_signal_label: "Сигнал Bid / No-Bid",
      panel_signal_value: "Требуется проверка",
      signal_technical_fit: "Техническое соответствие",
      signal_compliance: "Матрица соответствия",
      signal_vendor_bias: "Vendor Bias",
      signal_commercial_risk: "Коммерческий риск",
      signal_clarifications: "Вопросы для уточнения",
      signal_structured: "Структурировано",
      signal_included: "Включено",
      signal_flagged: "Отмечено",
      signal_reviewed: "Проверено",
      signal_generated: "Сгенерировано",
      product_eyebrow: "Поток продукта",
      product_title: "От тендерного документа к поверхности решения",
      product_intro: "SpecBridge AI превращает фрагментированную тендерную проверку в структурированный, повторяемый и проверяемый пакет решений.",
      flow_1_title: "Контролируемый прием документов",
      flow_1_text: "В контролируемом демо используются анонимизированные или предварительно одобренные тендерные, RFP или технические спецификации. Публичная загрузка файлов не включена.",
      flow_2_title: "Анализ",
      flow_2_text: "Проверяются технические, коммерческие, юридические/административные, поставочные и сервисные риски.",
      flow_3_title: "Решение",
      flow_3_text: "Оцениваются готовность bid/no-bid, пробелы, сигналы соответствия и вопросы для уточнения.",
      flow_4_title: "Загрузка",
      flow_4_text: "Формируются управленческие, технические и sales/presales пакеты отчетов для проверки.",
      coverage_eyebrow: "Покрытие анализа",
      coverage_title: "За пределами технического соответствия",
      feature_executive_summary: "Резюме для руководства",
      feature_document_classification: "Классификация документа",
      feature_bid_no_bid: "Рекомендация Bid / No-Bid",
      feature_technical_fit: "Техническое соответствие",
      feature_compliance_matrix: "Матрица соответствия по пунктам",
      feature_gap_analysis: "Gap-анализ",
      feature_vendor_bias: "Проверка Vendor Bias / Lock-in",
      feature_rewrite: "Нейтральные предложения переписывания",
      feature_evidence: "Доказательства / сопоставление продуктов",
      feature_clarifications: "Вопросы для уточнения",
      feature_commercial_risk: "Коммерческий риск",
      feature_legal_risk: "Юридический / административный риск",
      feature_delivery_risk: "Риск поставки / приемки",
      feature_sla: "Проверка SLA / гарантии / поддержки",
      feature_bom: "BOM / сопоставление продуктов",
      feature_heatmap: "Тепловая карта рисков и план действий",
      reports_eyebrow: "Профили отчетов",
      reports_title: "Разные отчеты для разных ролей принятия решений",
      report_exec_title: "Отчет для руководства",
      report_exec_text: "Сводка решения, сигнал bid/no-bid, основные риски, ключевые пробелы и план действий для руководства.",
      report_tech_title: "Технический отчет",
      report_tech_text: "Соответствие по пунктам, техническое соответствие, сопоставление продуктов, требования к доказательствам и архитектурные риски.",
      report_sales_title: "Отчет Sales / Presales",
      report_sales_text: "Квалификация возможности, вопросы клиента, коммерческий риск, риски позиционирования и пресейлз-действия.",
      use_cases_eyebrow: "Сценарии использования",
      use_cases_title: "Для команд, проверяющих сложные тендеры",
      case_bid_title: "Поддержка Bid / No-Bid",
      case_bid_text: "Принимайте решения по возможностям раньше благодаря видимым техническим, коммерческим и поставочным сигналам риска.",
      case_compliance_title: "Проверка соответствия",
      case_compliance_text: "Структурируйте технические и административные требования в проверяемые результаты и действия.",
      case_bias_title: "Обнаружение Vendor Bias",
      case_bias_text: "Выявляйте lock-in формулировки и готовьте нейтральные варианты для возражений и уточнений.",
      sample_eyebrow: "Примеры отчетов",
      sample_title: "Анонимизированные демо-результаты",
      sample_intro: "Примеры отчетов публикуются только на основе анонимизированных демо-сценариев. Реальные документы клиентов нельзя использовать без явного одобрения и юридической/безопасностной готовности.",
      sample_status: "Публичный анонимный пример",
      sample_box_title: "Загружаемый пакет примеров",
      sample_li_1: "Примеры executive, technical и sales/presales отчетов",
      sample_li_2: "CSV матрица соответствия и рисков",
      sample_li_3: "CSV вопросы для уточнения",
      sample_li_4: "Карточка решения Bid / No-Bid",
      sample_disclaimer: "Этот пакет использует только синтетический сценарий. Он не содержит реальные данные клиентов, реальные тендерные документы, персональные данные или конфиденциальные цены поставщиков.",
      sample_download: "Скачать пакет примеров",
      sample_view: "Посмотреть HTML пример",
      security_eyebrow: "Безопасность и конфиденциальность",
      security_title: "Спроектировано вокруг обработки чувствительных тендерных документов",
      security_intro: "Тендерные и RFP-документы могут содержать чувствительную коммерческую, техническую и юридическую информацию. Пилот требует контролируемой обработки данных, четких правил хранения и политики удаления.",
      security_callout_title: "Только рекомендательный результат.",
      security_callout_text: "Результаты SpecBridge AI не заменяют юридическую консультацию, финальное утверждение соответствия, официальное закупочное мнение или обязательные решения bid/no-bid.",
      pilot_eyebrow: "Контролируемый пилот",
      pilot_title: "Подготовка контролируемого пилота",
      pilot_intro: "SpecBridge AI сейчас находится на стадии контролируемой демонстрации и подготовки пилота. Эта контактная зона статична до завершения privacy, KVKK и backend-процессов; не отправляйте конфиденциальные файлы через сайт.",
      form_name: "Имя",
      form_company: "Компания",
      form_email: "Email",
      form_role: "Роль",
      form_use_case: "Интересующий сценарий",
      form_button: "Только статический предпросмотр формы",
    form_name_label: "Имя и фамилия",
    form_company_label: "Компания",
    form_email_label: "Эл. почта",
    form_role_label: "Роль",
    form_use_case_label: "Интересующий сценарий использования",
    form_consent: "Я ознакомился с уведомлением KVKK, Privacy Policy и Terms of Use и согласен, чтобы со мной связались по моему запросу на демо/пилот.",
    form_static_note: "Эта форма сейчас является статическим предпросмотром. Backend-доставка, автоматическое хранение и отправка email не включены; не отправляйте конфиденциальные файлы или персональные данные.",
      footer_stage: "© SpecBridge AI. Стадия контролируемой демонстрации и подготовки пилота.",
      footer_privacy: "Privacy Policy",
      footer_terms: "Terms of Use",
      footer_kvkk: "KVKK Aydınlatma Metni",
      footer_retention: "Data Retention",
      footer_deletion: "File Deletion",
      footer_contact: "Контакт / Пилот",
      footer_note: "Не отправляйте конфиденциальные тендерные документы, персональные данные, коммерческие тайны или production-файлы до подтверждения пилотного соглашения и процесса обработки данных."
    },
    ar: {
      language_label: "العربية",
      lang: "ar",
      p4b_nav_login: "تسجيل الدخول",
      p4b_nav_signup: "إنشاء حساب",
      p4b_eyebrow: "مركز دعم قرارات المناقصات والمواصفات",
      p4b_title: "من المواصفة إلى التقرير، كل قرار مرتبط بالدليل ومعتمد بشريا.",
      p4b_lead: "ينظم SpecBridge AI المواصفات الفنية ووثائق المناقصات حسب البنود المصدرية والمبررات ومستوى المخاطر وحالة الاعتماد البشري.",
      p4b_sublead: "الذكاء الاصطناعي يقترح. فريقك يراجع ويعدل ويعتمد.",
      p4b_cta_primary: "طلب عرض",
      p4b_cta_secondary: "عرض تقرير نموذجي",
      p4b_trust_controlled: "تجربة مضبوطة",
      p4b_trust_no_upload: "لا يوجد رفع عام",
      p4b_trust_synthetic: "تقارير عرض تركيبية",
      p4b_trust_human: "دعم قرار باعتماد بشري",
      p4b_board_title: "لوحة قيادة SpecBridge",
      p4b_board_subtitle: "حزمة مراجعة · تجربة مضبوطة",
      p4b_board_status: "يتطلب اعتمادا بشريا",
      p4b_card_clause_label: "قائمة مراجعة البنود",
      p4b_card_clause_value: "14 ملاحظة",
      p4b_card_clause_note: "تبقى إشارات المخاطر مرتبطة بالبند المصدر.",
      p4b_card_evidence_label: "مسار الأدلة",
      p4b_card_evidence_value: "بند + مبرر",
      p4b_card_evidence_note: "كل توصية تحتفظ بسياق المراجعة.",
      p4b_card_signal_label: "إشارات العلامة / المنتج",
      p4b_card_signal_value: "مستخرجة من صياغة المواصفة",
      p4b_card_signal_note: "تظهر الإشارات دون استبدال تلقائي.",
      p4b_card_approval_label: "حالة الاعتماد",
      p4b_card_approval_value: "3 قرارات معلقة",
      p4b_card_approval_note: "يبقى القرار النهائي لدى فريقك.",
      p4b_flow_1_title: "تم تحليل المواصفة",
      p4b_flow_1_note: "تمت فهرسة البنود المصدرية",
      p4b_flow_2_title: "تم إظهار المخاطر",
      p4b_flow_2_note: "قائمة المراجعة اليدوية جاهزة",
      p4b_flow_3_title: "حزمة التقرير",
      p4b_flow_3_note: "بانتظار الاعتماد البشري",
      dir: "rtl",
      title: "SpecBridge AI | ذكاء المناقصات ودعم قرارات ما قبل البيع",
      description: "يحلل SpecBridge AI وثائق المناقصات والمواصفات وطلبات العروض RFP لإنتاج تقارير منظمة لدعم قرارات فرق المبيعات وما قبل البيع والفرق الفنية والتنفيذية.",
      nav_product: "المنتج",
      nav_reports: "تقرير نموذجي",
      nav_use_cases: "حالات الاستخدام",
      nav_security: "الثقة",
      nav_pilot: "اطلب عرضاً توضيحياً",
      hero_eyebrow: "مركز قيادة ذكي للمناقصات والمواصفات",
      hero_title: "من المواصفة إلى التقرير، كل قرار مرتبط بالأدلة ومعتمد بشرياً.",
      hero_lead: "يحلل SpecBridge AI المواصفات الفنية ووثائق المناقصات، ويكشف المخاطر على مستوى البنود وإشارات العلامات والمنتجات، ويجهز مخرجات مناسبة لمصفوفة الامتثال، ويربط كل توصية بالدليل المصدر وحالة الاعتماد.",
      hero_sublead: "المنتج لا يتخذ القرار النهائي؛ بل يسرّع العملية وينظمها ويجعلها قابلة للتدقيق. الذكاء الاصطناعي يقترح، والإنسان يعتمد.",
      hero_cta_primary: "اطلب عرضاً توضيحياً",
      hero_cta_secondary: "عرض تقرير نموذجي",
      hero_trust_source: "نتائج مرتبطة بالمصدر",
      hero_trust_audit: "مسار مراجعة قابل للتدقيق",
      hero_trust_approval: "سير عمل معتمد بشرياً",
      command_preview_kicker: "مركز قيادة SpecBridge",
      command_preview_status: "يتطلب اعتماداً بشرياً",
      command_preview_clause_label: "مخاطر البنود",
      command_preview_clause_value: "قائمة مراجعة يدوية",
      command_preview_clause_note: "تبقى المخاطر مرتبطة ببنود المصدر.",
      command_preview_brand_label: "إشارات العلامة والمنتج",
      command_preview_brand_value: "يتم اكتشافها من صياغة المواصفة",
      command_preview_brand_note: "تُعرض الإشارات دون استبدال تلقائي للمنتج.",
      command_preview_evidence_label: "مسار الأدلة",
      command_preview_evidence_value: "البند، المبرر، حالة الاعتماد",
      command_preview_evidence_note: "تُنظم النتائج لمراجعة التقرير.",
      command_preview_approval_label: "مسار الاعتماد",
      command_preview_approval_value: "الذكاء الاصطناعي يقترح والإنسان يعتمد",
      command_preview_approval_note: "يبقى القرار لدى فريقك.",
      motion_ecosystem_eyebrow: "Decision Ecosystem",
      motion_ecosystem_title: "Review signals across the tender decision surface",
      motion_ecosystem_intro: "A calm interaction layer highlights the areas teams usually need to inspect before proposal effort starts.",
      motion_faq_eyebrow: "Pilot Questions",
      motion_faq_title: "Clear boundaries before real tender files",
      motion_faq_1_q: "Can real confidential tender files be uploaded on this website?",
      motion_faq_1_a: "No. The public website is a static launch surface. Real files require an agreed pilot process and data handling boundary.",
      motion_faq_2_q: "What does the pilot review first?",
      motion_faq_2_a: "The first review should use synthetic or approved sample material to evaluate report structure, decision usefulness and workflow fit.",
      motion_faq_3_q: "Does SpecBridge AI replace legal or commercial approval?",
      motion_faq_3_a: "No. It supports review preparation. Final compliance, legal, commercial and bid decisions remain human-owned.",
      motion_faq_4_q: "Which outputs are useful for presales teams?",
      motion_faq_4_a: "Bid/no-bid signals, gap visibility, clarification questions, vendor-bias notes, risk heatmap and action planning are the primary presales surfaces.",
      motion_assistant_button: "Decision assistant",
      motion_assistant_eyebrow: "Non-intrusive guide",
      motion_assistant_title: "Start with a sample package",
      motion_assistant_text: "Review the synthetic report package first, then define pilot data handling before any confidential material is used.",
      motion_assistant_cta: "View sample outputs",
      hero_note: "مرحلة عرض تجريبي وتحضير تجربة مضبوطة. ليس خدمة SaaS إنتاجية بعد.",
      trust_controlled_pilot: "تجربة مضبوطة فقط",
      trust_no_public_upload: "لا يوجد رفع عام للوثائق",
      trust_synthetic_samples: "تقارير نموذجية اصطناعية",
      trust_human_review: "دعم قرار بمراجعة بشرية",
      preview_eyebrow: "معاينة حزمة القرار",
      preview_title: "سطح قرار أكثر قابلية للمراجعة قبل بدء جهد إعداد العرض",
      preview_intro: "يهدف SpecBridge AI إلى تحويل وثائق المناقصات الطويلة إلى عروض قرار تنفيذية وفنية ومبيعات/ما قبل البيع يمكن للفرق مراجعتها قبل الالتزام بجهد إعداد العرض.",
      preview_exec_title: "بطاقة قرار تنفيذية",
      preview_exec_text: "جاهزية التقديم أو عدمه، الدرجة الإجمالية، العوائق الرئيسية والإجراءات التالية المقترحة لمراجعة الإدارة.",
      preview_matrix_title: "معاينة مصفوفة الامتثال",
      preview_matrix_text: "حالة البنود، احتياجات الأدلة، مواءمة المنتجات وملاحظات الفجوات منظمة للتحقق الفني.",
      preview_risk_title: "لوحة المخاطر والتوضيحات",
      preview_risk_text: "تحويل المخاطر التجارية والقانونية/الإدارية والتسليم وSLA وتحيز المورد إلى أسئلة توضيح.",
      preview_note: "تبقى مخرجات JSON والملفات هي المرجع authoritative في سير MVP المضبوط.",
      security_static_title: "حدود الموقع الثابت",
      security_static_text: "لا يعالج الموقع العام ملفات المناقصات ولا يعمل كقناة SaaS إنتاجية لاستقبال الملفات.",
      security_no_upload_title: "لا رفع لملفات سرية",
      security_no_upload_text: "لا ينبغي إرسال الوثائق السرية قبل تأكيد اتفاقية التجربة وقواعد الاحتفاظ والحذف.",
      security_pilot_title: "معالجة مضبوطة في التجربة",
      security_pilot_text: "يجب أن تكون مواد العرض والتجربة مجهولة أو اصطناعية أو معتمدة صراحة للمراجعة المضبوطة.",
      security_advisory_title: "مسؤولية بشرية",
      security_advisory_text: "تدعم المخرجات المراجعة والتحضير للقرار؛ وتبقى القرارات القانونية والتجارية وقرارات التقديم النهائية مملوكة للفرق البشرية.",
      final_cta_eyebrow: "الخطوة التالية للتجربة المضبوطة",
      final_cta_title: "راجع حزمة قرار اصطناعية قبل استخدام ملفات مناقصات حقيقية.",
      final_cta_text: "ابدأ بالحزمة النموذجية المجهولة، ثم حدد معالجة بيانات التجربة والاحتفاظ وحدود المراجعة البشرية قبل استخدام أي وثيقة سرية.",
      final_cta_primary: "طلب مناقشة تجربة",
      final_cta_secondary: "عرض الحزمة النموذجية",
      pilot_readiness_title: "جاهزية الثقة لطلبات التجربة والعرض التوضيحي",
      pilot_readiness_body: "يُستخدم طلب العرض التوضيحي لتوضيح النطاق وفتح قناة التواصل المناسبة. لا يتم تفعيل الرفع العام أو نظام تسجيل العملاء المحتملين الآلي في هذه المرحلة.",
      pilot_readiness_privacy_title: "الخصوصية وحماية البيانات",
      pilot_readiness_privacy_text: "لا يتم نشر المستندات المشاركة أثناء العرض التوضيحي أو مشاركتها مع أطراف ثالثة دون موافقة العميل.",
      pilot_readiness_security_title: "تقييم مضبوط",
      pilot_readiness_security_text: "يتم عرض مسار العرض التوضيحي العام من خلال مستندات عينة مجهولة وحزم تقارير مضبوطة.",
      pilot_readiness_scope_title: "نطاق التجربة",
      pilot_readiness_scope_text: "توضح مناقشة التجربة نوع المستند، ومخرجات القرار، وملف التقرير، وتوقعات الأمان.",
      pilot_readiness_note: "لا يغير هذا التعديل سلوك backend أو نموذج التواصل.",
      panel_title: "حزمة تقرير القرار",
      panel_badge: "MVP جاهز للعرض",
      panel_signal_label: "إشارة تقديم / عدم تقديم",
      panel_signal_value: "تتطلب مراجعة",
      signal_technical_fit: "الملاءمة الفنية",
      signal_compliance: "مصفوفة الامتثال",
      signal_vendor_bias: "تحيز المورد",
      signal_commercial_risk: "المخاطر التجارية",
      signal_clarifications: "أسئلة التوضيح",
      signal_structured: "منظم",
      signal_included: "مضمن",
      signal_flagged: "محدد",
      signal_reviewed: "مراجع",
      signal_generated: "مولد",
      product_eyebrow: "تدفق المنتج",
      product_title: "من وثيقة المناقصة إلى سطح القرار",
      product_intro: "يحوّل SpecBridge AI أعمال مراجعة المناقصات المتفرقة إلى حزمة قرار منظمة وقابلة للتكرار والمراجعة.",
      flow_1_title: "إدخال وثائق مضبوط",
      flow_1_text: "يتم استخدام محتوى مناقصة أو RFP أو مواصفة فنية مجهول أو معتمد مسبقا ضمن سير عرض تجريبي مضبوط. رفع الملفات العام غير مفعل.",
      flow_2_title: "التحليل",
      flow_2_text: "مراجعة المخاطر الفنية والتجارية والقانونية/الإدارية ومخاطر التسليم والدعم.",
      flow_3_title: "القرار",
      flow_3_text: "تقييم جاهزية التقديم أو عدمه، الفجوات، إشارات الامتثال وأسئلة التوضيح.",
      flow_4_title: "التنزيل",
      flow_4_text: "إنشاء حزم تقارير تنفيذية وفنية ومبيعات/ما قبل البيع للمراجعة.",
      coverage_eyebrow: "نطاق التحليل",
      coverage_title: "أبعد من الامتثال الفني",
      feature_executive_summary: "ملخص تنفيذي",
      feature_document_classification: "تصنيف الوثيقة",
      feature_bid_no_bid: "توصية تقديم / عدم تقديم",
      feature_technical_fit: "الملاءمة الفنية",
      feature_compliance_matrix: "مصفوفة امتثال البنود",
      feature_gap_analysis: "تحليل الفجوات",
      feature_vendor_bias: "مراجعة تحيز المورد / الإقفال",
      feature_rewrite: "اقتراحات إعادة صياغة محايدة",
      feature_evidence: "الأدلة / مطابقة المنتجات",
      feature_clarifications: "أسئلة التوضيح",
      feature_commercial_risk: "المخاطر التجارية",
      feature_legal_risk: "المخاطر القانونية / الإدارية",
      feature_delivery_risk: "مخاطر التسليم / القبول",
      feature_sla: "مراجعة SLA / الضمان / الدعم",
      feature_bom: "BOM / مطابقة المنتجات",
      feature_heatmap: "خريطة المخاطر وخطة العمل",
      reports_eyebrow: "ملفات التقارير",
      reports_title: "تقارير مختلفة لأدوار قرار مختلفة",
      report_exec_title: "تقرير تنفيذي",
      report_exec_text: "ملخص القرار، إشارة التقديم/عدم التقديم، أهم المخاطر، الفجوات الرئيسية وخطة العمل لمراجعة الإدارة.",
      report_tech_title: "تقرير فني",
      report_tech_text: "امتثال على مستوى البنود، الملاءمة الفنية، مطابقة المنتجات، متطلبات الأدلة ومخاطر البنية.",
      report_sales_title: "تقرير المبيعات / ما قبل البيع",
      report_sales_text: "تأهيل الفرصة، أسئلة العميل، المخاطر التجارية، مخاطر التموضع وإجراءات ما قبل البيع.",
      use_cases_eyebrow: "حالات الاستخدام",
      use_cases_title: "مصمم للفرق التي تراجع مناقصات معقدة",
      case_bid_title: "دعم التقديم / عدم التقديم",
      case_bid_text: "اتخذ قرارات الفرص مبكرا باستخدام إشارات مخاطر فنية وتجارية وتسليم واضحة.",
      case_compliance_title: "مراجعة الامتثال",
      case_compliance_text: "حوّل المتطلبات الفنية والإدارية إلى مخرجات قابلة للمراجعة وبنود عمل.",
      case_bias_title: "كشف تحيز المورد",
      case_bias_text: "اكتشف لغة الإقفال وجهز اقتراحات محايدة للاعتراض وعمليات التوضيح.",
      sample_eyebrow: "تقارير نموذجية",
      sample_title: "مخرجات عرض مجهولة",
      sample_intro: "تنشر التقارير النموذجية باستخدام سيناريوهات عرض مجهولة فقط. لا يجوز استخدام وثائق عملاء حقيقية دون موافقة صريحة وجاهزية قانونية/أمنية.",
      sample_status: "نموذج عام مجهول",
      sample_box_title: "حزمة نموذجية قابلة للتنزيل",
      sample_li_1: "عروض تقارير تنفيذية وفنية ومبيعات/ما قبل البيع",
      sample_li_2: "ملف CSV لمصفوفة الامتثال والمخاطر",
      sample_li_3: "ملف CSV لأسئلة التوضيح",
      sample_li_4: "بطاقة قرار تقديم / عدم تقديم",
      sample_disclaimer: "تستخدم هذه الحزمة سيناريو اصطناعيا فقط. لا تتضمن بيانات عملاء حقيقية أو وثائق مناقصة حقيقية أو بيانات شخصية أو أسعار موردين سرية.",
      sample_download: "تنزيل الحزمة النموذجية",
      sample_view: "عرض نموذج HTML",
      security_eyebrow: "الأمان والخصوصية",
      security_title: "مصمم حول التعامل مع وثائق المناقصات الحساسة",
      security_intro: "قد تحتوي وثائق المناقصات وRFP على معلومات تجارية وفنية وقانونية حساسة. يتطلب الاستخدام التجريبي معالجة بيانات مضبوطة وقواعد احتفاظ واضحة وسياسة حذف صريحة.",
      security_callout_title: "مخرجات استشارية فقط.",
      security_callout_text: "لا تحل مخرجات SpecBridge AI محل الاستشارة القانونية أو الموافقة النهائية على الامتثال أو الرأي الرسمي للمشتريات أو قرارات التقديم/عدم التقديم الملزمة.",
      pilot_eyebrow: "تجربة مضبوطة",
      pilot_title: "تحضير تجربة مضبوطة",
      pilot_intro: "SpecBridge AI حاليا في مرحلة العرض التجريبي والتحضير للتجربة المضبوطة. تبقى منطقة الاتصال ثابتة حتى اكتمال الخصوصية وKVKK ومعالجة الخلفية؛ يرجى عدم إرسال ملفات سرية عبر الموقع.",
      form_name: "الاسم",
      form_company: "الشركة",
      form_email: "البريد الإلكتروني",
      form_role: "الدور",
      form_use_case: "حالة الاستخدام محل الاهتمام",
      form_button: "معاينة نموذج ثابت فقط",
    form_name_label: "الاسم الكامل",
    form_company_label: "الشركة",
    form_email_label: "البريد الإلكتروني",
    form_role_label: "الدور",
    form_use_case_label: "حالة الاستخدام محل الاهتمام",
    form_consent: "لقد راجعت روابط إشعار KVKK وسياسة الخصوصية وشروط الاستخدام، وأوافق على التواصل معي بخصوص طلب العرض التجريبي/المرحلة التجريبية.",
    form_static_note: "هذا النموذج حاليًا معاينة ثابتة فقط. لم يتم تفعيل التسليم الخلفي أو التخزين الآلي أو إرسال البريد الإلكتروني؛ لا ترسل ملفات سرية أو بيانات شخصية.",
      footer_stage: "© SpecBridge AI. مرحلة عرض تجريبي وتحضير تجربة مضبوطة.",
      footer_privacy: "سياسة الخصوصية",
      footer_terms: "شروط الاستخدام",
      footer_kvkk: "نص توضيح KVKK",
      footer_retention: "الاحتفاظ بالبيانات",
      footer_deletion: "حذف الملفات",
      footer_contact: "اتصال / تجربة",
      footer_note: "يرجى عدم إرسال وثائق مناقصات سرية أو بيانات شخصية أو أسرار تجارية أو ملفات إنتاج قبل تأكيد اتفاقية التجربة وعملية معالجة البيانات."
    }
  };

  function getSafeLanguage(language) {
    return Object.prototype.hasOwnProperty.call(translations, language) ? language : DEFAULT_LANGUAGE;
  }

  function setLanguage(language) {
    const safeLanguage = getSafeLanguage(language);
    const dictionary = translations[safeLanguage];

    document.documentElement.lang = dictionary.lang;
    document.documentElement.dir = dictionary.dir;
    document.title = dictionary.title;

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", dictionary.description);
    }

    const metadataTargets = [
      { selector: 'meta[property="og:title"]', value: dictionary.title },
      { selector: 'meta[property="og:description"]', value: dictionary.description },
      { selector: 'meta[name="twitter:title"]', value: dictionary.title },
      { selector: 'meta[name="twitter:description"]', value: dictionary.description }
    ];

    metadataTargets.forEach(function (target) {
      const element = document.querySelector(target.selector);
      if (element) {
        element.setAttribute("content", target.value);
      }
    });

    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      const key = node.getAttribute("data-i18n");
      if (dictionary[key]) {
        node.textContent = dictionary[key];
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (node) {
      const key = node.getAttribute("data-i18n-placeholder");
      if (dictionary[key]) {
        node.setAttribute("placeholder", dictionary[key]);
      }
    });

    document.querySelectorAll("[data-lang]").forEach(function (button) {
      const isActive = button.getAttribute("data-lang") === safeLanguage;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    localStorage.setItem(STORAGE_KEY, safeLanguage);
  }

  function getInitialLanguage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && translations[stored]) {
      return stored;
    }

    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get("lang");
    if (fromQuery && translations[fromQuery]) {
      return fromQuery;
    }

    return DEFAULT_LANGUAGE;
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-lang]").forEach(function (button) {
      button.addEventListener("click", function () {
        setLanguage(button.getAttribute("data-lang"));
      });
    });

    setLanguage(getInitialLanguage());
  });
}());

/* R-LAUNCH.8-B-MOTION-INTERACTION-POLISH:START */
(function () {
  var ASSISTANT_DISMISS_KEY = "specbridge-assistant-dismissed-r-launch-8-b";

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function setHeaderState() {
    var header = document.querySelector(".site-header");
    if (!header) {
      return;
    }

    var update = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 16);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function setRevealState() {
    var targets = document.querySelectorAll(".hero-copy, .hero-panel, .trust-strip, .section, .flow-step, .proof-card, .report-card, .use-case-card, .security-card, .sample-box, .final-cta, .faq-item, .ecosystem-pill");
    if (!targets.length) {
      return;
    }

    document.body.classList.add("motion-enabled");

    targets.forEach(function (target) {
      target.setAttribute("data-motion-reveal", "");
    });

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      targets.forEach(function (target) {
        target.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px"
    });

    targets.forEach(function (target) {
      observer.observe(target);
    });
  }

  function setEcosystemPills() {
    var pills = document.querySelectorAll("[data-ecosystem-pill]");
    if (!pills.length) {
      return;
    }

    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        pills.forEach(function (item) {
          item.classList.remove("is-selected");
          item.setAttribute("aria-pressed", "false");
        });

        pill.classList.add("is-selected");
        pill.setAttribute("aria-pressed", "true");
      });
    });
  }

  function setFaqBehavior() {
    var faqItems = document.querySelectorAll(".faq-item");
    if (!faqItems.length) {
      return;
    }

    faqItems.forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (!item.open) {
          return;
        }

        faqItems.forEach(function (other) {
          if (other !== item) {
            other.open = false;
          }
        });
      });
    });
  }

  function setAssistantLauncher() {
    var launcher = document.querySelector("[data-assistant-launcher]");
    var toggle = document.querySelector("[data-assistant-toggle]");
    var panel = document.querySelector("[data-assistant-panel]");
    var close = document.querySelector("[data-assistant-close]");

    if (!launcher || !toggle || !panel || !close) {
      return;
    }

    var dismissed = false;
    try {
      dismissed = localStorage.getItem(ASSISTANT_DISMISS_KEY) === "1";
    } catch (error) {
      dismissed = false;
    }

    var showLauncher = function () {
      if (dismissed) {
        return;
      }

      if (window.scrollY > 420) {
        launcher.hidden = false;
        window.requestAnimationFrame(function () {
          launcher.classList.add("is-visible");
        });
      }
    };

    var hidePanel = function () {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    };

    var dismissLauncher = function () {
      dismissed = true;
      hidePanel();
      launcher.classList.remove("is-visible");

      try {
        localStorage.setItem(ASSISTANT_DISMISS_KEY, "1");
      } catch (error) {
        return;
      }
    };

    toggle.addEventListener("click", function () {
      var willOpen = panel.hidden;
      panel.hidden = !willOpen;
      toggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });

    close.addEventListener("click", dismissLauncher);
    window.addEventListener("scroll", showLauncher, { passive: true });
    showLauncher();
  }

  document.addEventListener("DOMContentLoaded", function () {
    setHeaderState();
    setRevealState();
    setEcosystemPills();
    setFaqBehavior();
    setAssistantLauncher();
  });

  /* R-LAUNCH.9-P4B-FC3R2-LANGUAGE-LOCK:START */
  const SPECBRIDGE_LAUNCH_LANGUAGE_LOCK = "tr";

  function enforceSpecBridgeLaunchLanguageLock() {
    const lockedLanguage = SPECBRIDGE_LAUNCH_LANGUAGE_LOCK;

    try {
      window.localStorage.setItem(STORAGE_KEY, lockedLanguage);
    } catch (error) {
      // Ignore storage failures in restricted browser contexts.
    }

    try {
      if (typeof applyLanguage === "function") {
        applyLanguage(lockedLanguage);
        return;
      }
    } catch (error) {
      // Fall back to direct rendering below.
    }

    if (typeof translations !== "undefined" && translations[lockedLanguage]) {
      const selected = translations[lockedLanguage];

      document.documentElement.lang = selected.lang || "tr";
      document.documentElement.dir = selected.dir || "ltr";

      if (selected.title) {
        document.title = selected.title;
      }

      document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.getAttribute("data-i18n");
        if (key && Object.prototype.hasOwnProperty.call(selected, key)) {
          element.textContent = selected[key];
        }
      });

      document.querySelectorAll("[data-lang]").forEach((element) => {
        const isActive = element.getAttribute("data-lang") === lockedLanguage;
        element.classList.toggle("is-active", isActive);
        element.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    }
  }

  enforceSpecBridgeLaunchLanguageLock();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enforceSpecBridgeLaunchLanguageLock, { once: true });
  } else {
    enforceSpecBridgeLaunchLanguageLock();
  }
  /* R-LAUNCH.9-P4B-FC3R2-LANGUAGE-LOCK:END */

}());
/* R-LAUNCH.8-B-MOTION-INTERACTION-POLISH:END */
