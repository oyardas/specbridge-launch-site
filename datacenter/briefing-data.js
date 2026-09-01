window.DATACENTER_BRIEFING={
  meta:{title:'Data Center Investment Briefing',subtitle:'Dijital ekonominin fiziksel altyapısı · Türkiye yatırım perspektifi',version:'v1.0',author:'Önder Yardaş',defaultLanguage:'tr'},
  sources:{
    mckinsey:{name:'McKinsey & Company',title:'The data center build-out and the cost of compute',url:'https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/the-cost-of-compute-a-7-trillion-dollar-race-to-scale-data-centers',note:'Global capacity-demand scenarios and investment context.'},
    iea:{name:'International Energy Agency',title:'Energy and AI / data-center electricity demand',url:'https://www.iea.org/reports/energy-and-ai',note:'Electricity-demand outlook for data centers and AI.'},
    cbre:{name:'CBRE',title:'Global Data Center Trends',url:'https://www.cbre.com/insights/reports/global-data-center-trends-2025',note:'Supply, vacancy, power constraints and market development.'},
    synergy:{name:'Synergy Research Group',title:'Hyperscale data-center capacity outlook',url:'https://www.srgresearch.com/articles/hyperscale-operators-to-account-for-67-of-all-data-center-capacity-by-2031',note:'Hyperscale footprint and capacity-share analysis.'},
    uptime:{name:'Uptime Institute',title:'Global Data Center Survey / outage research',url:'https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025',note:'Operational resilience, outage causes and industry practices.'},
    tier:{name:'Uptime Institute',title:'Tier Standard: Topology',url:'https://uptimeinstitute.com/tiers',note:'Tier concepts and concurrent maintainability context.'},
    decix:{name:'DE-CIX',title:'Istanbul as a strategic digital hub',url:'https://www.de-cix.net/en/about-de-cix/media/press-releases/istanbul-emerges-as-a-strategic-digital-hub-bridging-europe-central-asia-and-the-middle-east-turkish-interconnection-market-set-to-double-by-2030',note:'Istanbul interconnection and regional digital-hub context.'},
    aws:{name:'Amazon Web Services',title:'AWS Local Zones in Istanbul, Türkiye',url:'https://aws.amazon.com/about-aws/whats-new/2026/05/aws-local-zones-istanbul-turkiye/',note:'AWS local infrastructure signal in Türkiye.'},
    google:{name:'Google Cloud',title:'New Google Cloud region coming to Türkiye',url:'https://cloud.google.com/blog/products/infrastructure/new-google-cloud-region-coming-to-turkiye/',note:'Google Cloud Türkiye region announcement.'},
    invest:{name:'Investment Office of the Presidency of Türkiye',title:'Türkiye data-center and AI investment initiatives',url:'https://www.invest.gov.tr/en/news/news-from-turkey/pages/minister-kacir-announces-usd-3-billion-public-funding-program-accelerate-data-center-ai-investments.aspx',note:'Public investment and incentive signal.'},
    tuik:{name:'TÜİK',title:'Hanehalkı Bilişim Teknolojileri Kullanım Araştırması',url:'https://data.tuik.gov.tr/',note:'Türkiye population and digital-use indicators.'},
    kvkk:{name:'KVKK',title:'Kişisel verilerin yurt dışına aktarılması',url:'https://www.kvkk.gov.tr/Icerik/2053/Yurtdisina-Aktarim',note:'Data-transfer and governance framework in Türkiye.'},
    ashr:{name:'ASHRAE',title:'Data Center Resources',url:'https://www.ashrae.org/technical-resources/bookstore/datacom-series',note:'Thermal and data-center environmental guidance.'},
    iso:{name:'ISO',title:'ISO/IEC 27001 Information Security Management',url:'https://www.iso.org/standard/27001',note:'Information-security management-system framework.'}
  },
  chapters:[
    {id:'00',title:'Neye yatırım yapıyoruz?',kicker:'Açılış',summary:'Kabinet ile veri merkezi arasındaki farkı kurar.',visual:'systems',sources:['uptime','tier'],segments:[
      'Bir veri merkezine ilk kez giren bir yatırımcının gördüğü şey genellikle kabinetlerdir. Sıralar halinde duran kabinetler, içlerindeki sunucular ve kilometrelerce kablo. Fakat veri merkezinin kendisi bunların hiçbiri değildir.',
      'Kabinet, sistemin yalnızca görünen son noktasıdır. Asıl yatırım; o kabinetin yılın üç yüz altmış beş günü, günün yirmi dört saati güvenilir biçimde çalışabilmesini sağlayan elektriktir, soğutmadır, fiber bağlantıdır, fiziksel ve siber güvenliktir, izleme ve operasyondur.',
      'Bu nedenle bir veri merkezi yatırımını gayrimenkul mantığıyla değerlendirmek eksik kalır. Burada metrekare değil, güvenilir kapasite üretilir. Müşteriye satılan gerçek ürün kabinet değil; erişilebilir güç, bağlantı, çevresel kontrol, güvenlik ve hizmet sürekliliğidir.',
      'Bir başka ifadeyle veri merkezi bir bina değil, birbirine bağımlı kritik sistemlerin oluşturduğu bir sistemler sistemidir. Bu sistemlerin herhangi biri zayıfsa, en pahalı sunucu yatırımı bile beklenen değeri üretemez.'
    ]},
    {id:'01',title:'Dünya neden daha fazla veri merkezine ihtiyaç duyuyor?',kicker:'Küresel talep',summary:'Cloud, dijitalleşme, veri büyümesi ve AI etkisini çerçeveler.',visual:'demand',sources:['mckinsey','cbre','synergy'],segments:[
      'Dünya ekonomisinin giderek daha büyük bölümü hesaplama, veri saklama ve bağlantı üzerinden çalışıyor. Bankacılık, e-ticaret, sağlık, üretim, kamu hizmetleri, video, oyun, kurumsal yazılımlar ve yapay zekâ farklı sektörler gibi görünse de hepsi aynı fiziksel altyapıya ihtiyaç duyuyor.',
      'Bu ihtiyaç yalnızca bir teknoloji trendi değil. Cloud dönüşümü şirketlerin kendi küçük sistem odalarından profesyonel veri merkezi ve bulut altyapılarına geçmesini hızlandırıyor. Aynı anda veri üretimi, regülasyon, siber dayanıklılık ve düşük gecikme gereksinimleri de fiziksel kapasite ihtiyacını büyütüyor.',
      'McKinsey senaryolarında global veri merkezi kapasite talebi 2025 seviyelerinden 2030’a doğru çok güçlü bir artış gösteriyor. Bu rakamların tahmin olduğunu unutmamak gerekir; ancak yön açıktır: dünya daha fazla güvenilir compute kapasitesi talep ediyor.',
      'CBRE verilerinin gösterdiği önemli nokta ise şudur: yeni arz hızla artmasına rağmen birçok büyük pazarda boş kapasite düşük kalıyor. Yani sektör yalnızca kapasite inşa etmiyor; yeni kapasiteyi aynı zamanda tüketiyor.'
    ]},
    {id:'02',title:'AI neyi değiştirdi?',kicker:'Yüksek yoğunluk',summary:'AI’ın güç, soğutma ve network yoğunluğunu neden değiştirdiğini anlatır.',visual:'ai',sources:['mckinsey','iea','cbre','ashr'],segments:[
      'Bugünkü veri merkezi tartışmalarının merkezinde yapay zekâ var. Bunun nedeni yalnızca AI yazılımlarının popüler olması değil; AI iş yüklerinin fiziksel altyapıyı farklı bir yoğunluk seviyesine taşımasıdır.',
      'Klasik enterprise rack’leri çoğu tesiste daha düşük güç yoğunluklarında çalışırken, GPU ve accelerator kümeleri onlarca kilowattı aşan rack tasarımlarını gündeme getiriyor. Bunun sonucu daha yüksek akım, farklı güç dağıtımı, daha güçlü network fabric ve çoğu durumda liquid veya hybrid cooling ihtiyacıdır.',
      'Ancak yatırım tezini yalnızca AI üzerine kurmak doğru değildir. AI olmasa bile bankalar, hastaneler, kamu sistemleri, ERP platformları, e-ticaret, video, IoT ve cloud servisleri çalışmaya devam edecektir. AI bu dönüşümü başlatmadı; zaten var olan dijital altyapı dönüşümünü hızlandırdı.',
      'Bu nedenle doğru tesis bütün kabinetleri aşırı yoğunluk için tasarlamak yerine, standart yükleri verimli biçimde desteklerken ayrılmış AI ve high-density zonları için ölçeklenebilir bir yol bırakmalıdır.'
    ]},
    {id:'03',title:'Elektrik neden yeni kıt kaynak?',kicker:'Power first',summary:'Secured MW kavramını yatırım kararının merkezine taşır.',visual:'energy',sources:['iea','cbre'],segments:[
      'Veri merkezi dünyasında bugün en değerli varlıklardan biri kullanılabilir ve zamanında teslim edilebilir elektrik kapasitesidir. Arsa bulunabilir. Bina yapılabilir. Fakat doğru lokasyonda yeterli megawattı, doğru bağlantı takvimiyle ve gerekli yedeklilikle sağlamak giderek daha zor hale geliyor.',
      'IEA, veri merkezi elektrik tüketiminin bu on yılın sonuna doğru güçlü şekilde artmasını bekliyor. Bu artış yalnız tesis içinde daha büyük UPS veya jeneratör kurmak anlamına gelmiyor; şebeke bağlantısı, trafo merkezi, iletim ve dağıtım planlaması da yatırımın parçası haline geliyor.',
      'Bu yüzden bir araziyi data-center arazisi yapan şey yalnız konumu değildir. Secured power, bağlantı süresi, ikinci besleme olasılığı, gelecekteki genişleme yolu ve enerji maliyeti birlikte değerlendirilmelidir.',
      'Yatırımcı için kritik soru şudur: kaç megawatt istediğimiz değil, kaç megawattı hangi tarihte, hangi güvenilirlik seviyesiyle ve hangi genişleme hakkıyla gerçekten kullanabileceğimiz.'
    ]},
    {id:'04',title:'Kabinetin arkasındaki güç zinciri',kicker:'Elektrik altyapısı',summary:'Utility’den rack PDU’ya kadar zincirin önemini açıklar.',visual:'power',sources:['tier','uptime'],segments:[
      'Şimdi bir kabinetin önünde durduğumuzu düşünelim. İçinde milyonlarca dolarlık sunucu olabilir. Fakat o sunucunun değeri, arkasındaki güç zinciri kadar güvenilirdir.',
      'Elektrik; şebeke veya üretim kaynağından trafoya, switchgear’a, UPS sistemlerine, dağıtım panolarına, busway veya PDU’lara ve en sonunda rack PDU’ya kadar kontrollü biçimde taşınır. Tasarım seviyesine göre A ve B yolları birbirinden ayrılır ve bakım sırasında hizmetin devam etmesi hedeflenir.',
      'Buradaki kritik kavram redundancy ile resilience arasındaki farktır. İki cihaz satın almak tek başına iki bağımsız yol oluşturmaz. Ortak bir panel, ortak kontrol sistemi, ortak kablo güzergâhı veya yanlış bakım prosedürü gizli bir single point of failure yaratabilir.',
      'Bu nedenle elektrik altyapısı yalnız ekipman listesiyle değil, tek hat şemaları, koruma koordinasyonu, seçicilik, operasyon senaryoları, bakım yolu ve entegre testlerle doğrulanmalıdır.'
    ]},
    {id:'05',title:'Soğutma: enerjiyi ısı olarak dışarı atmak',kicker:'Thermal chain',summary:'Chip’ten heat rejection’a kadar termal zinciri açıklar.',visual:'cooling',sources:['ashr','iea'],segments:[
      'Sunucuya verdiğimiz elektriğin çok büyük bölümü sonunda ısıya dönüşür. Bu nedenle veri merkezi aslında aynı anda bir compute tesisi ve sürekli çalışan bir ısı taşıma sistemidir.',
      'Termal zincir çipte başlar. Isı sunucuya, rack’e ve beyaz alana taşınır; daha sonra hava veya sıvı üzerinden soğutma sistemine ve en sonunda dış ortama veya başka bir heat-rejection katmanına aktarılır.',
      'Standart kabinetlerle yüksek yoğunluklu AI kabinetlerinin aynı termal yaklaşımı kullanması her zaman doğru değildir. In-row air cooling, rear-door heat exchanger, direct-to-chip liquid cooling veya hybrid çözümler farklı yoğunluk ve işletme hedeflerine cevap verir.',
      'Asıl mühendislik sorusu hangi teknolojinin daha yeni olduğu değil; beklenen yük profilini, su ve enerji koşullarını, bakım kabiliyetini ve gelecekteki yoğunluk artışını hangi mimarinin en güvenilir ve ekonomik biçimde desteklediğidir.'
    ]},
    {id:'06',title:'Network ve interconnection',kicker:'Bağlantı ekonomisi',summary:'Fiber çeşitliliği, carrier-neutrality, MMR ve cloud/IX bağlarını açıklar.',visual:'network',sources:['decix','aws','google'],segments:[
      'Bir veri merkezinde elektrik varsa ama bağlantı yoksa çok pahalı bir depo elde edersiniz. Veri merkezinin ekonomik değeri yalnız içinde ne olduğuyla değil, neye bağlandığıyla da ölçülür.',
      'Profesyonel bir tesis birden fazla carrier’ı, fiziksel olarak farklı fiber güzergâhlarını, meet-me room yapısını, cross-connect hizmetlerini, internet exchange bağlantılarını ve mümkün olduğunda cloud on-ramp seçeneklerini planlamalıdır.',
      'Carrier-neutral yaklaşım müşteriye yalnız yedeklilik sağlamaz; ticari esneklik de sağlar. Müşteri tek bir operatöre mahkûm olmaz, kapasite ve rota seçeneklerini iş yüküne göre değiştirebilir.',
      'Ayrıca kritik altyapının yönetimi için production network’ten ayrılmış out-of-band yönetim ağı önemlidir. Arıza anında ana ağ erişilemezken bile cihazlara kontrollü yönetim erişimi sağlayabilmek operasyonel dayanıklılığın parçasıdır.'
    ]},
    {id:'07',title:'Fiziksel ve siber güvenlik',kicker:'Defense in depth',summary:'Perimeter’dan privileged access’e kadar çok katmanlı güvenliği anlatır.',visual:'security',sources:['iso','kvkk'],segments:[
      'Veri merkezi güvenliği tek bir güvenlik kapısı veya firewall değildir. Fiziksel ve dijital kontrol katmanlarının birlikte çalıştığı defense-in-depth yaklaşımı gerekir.',
      'Fiziksel tarafta perimeter, araç ve ziyaretçi kontrolü, mantrap, kimlik doğrulama, CCTV, zonlama ve gerektiğinde rack seviyesinde erişim vardır. Ama tehdit yalnız binaya giren kişiden gelmez.',
      'Yanlış firewall kuralı, ele geçirilmiş privileged account, güvensiz uzaktan erişim, yetersiz loglama veya yönetim ağının production ağıyla yanlış biçimde birleşmesi fiziksel ihlal olmadan da kritik sonuçlar doğurabilir.',
      'Bu nedenle güvenlik; teknoloji, süreç ve yönetişimin birlikte ele alınmasını gerektirir. Kim kime, hangi sistemden, hangi süreyle ve hangi kayıt altında erişebilir sorusu teknik mimarinin ayrılmaz parçasıdır.'
    ]},
    {id:'08',title:'Veri merkezinin görünmeyen merkezi: operasyon',kicker:'24×7 işletme',summary:'NOC, DCIM, prosedürler ve insan faktörünü yatırımın parçası olarak anlatır.',visual:'operations',sources:['uptime'],segments:[
      'Bir veri merkezi açılış günü tamamlanmaz. Aslında o gün başlar. Tasarım ve inşaat tek seferliktir; operasyon ise tesisin ekonomik ömrü boyunca devam eder.',
      'NOC, DCIM, BMS ve EPMS gibi platformlar tesisin farklı katmanlarını görünür hale getirir. Ancak dashboard sahibi olmak tek başına iyi operasyon değildir. Alarm yönetimi, capacity management, bakım planlaması, olay yönetimi ve değişiklik kontrolü için tanımlı süreçler gerekir.',
      'SOP günlük standart operasyonu, MOP planlı bakım veya değişiklik adımlarını, EOP ise acil durum müdahalesini tanımlar. Bu prosedürlerin kalitesi, eğitim seviyesi ve vardiya disiplini doğrudan uptime sonucunu etkileyebilir.',
      'Sektör araştırmaları ciddi kesintilerde insan ve süreç faktörünün önemini sürekli gösteriyor. Bu nedenle resilience yalnız daha fazla donanım satın almak değil; doğru prosedür, doğru eğitim ve kontrollü değişiklik kültürü kurmaktır.'
    ]},
    {id:'09',title:'Commissioning: sistem gerçekten birlikte çalışıyor mu?',kicker:'Doğrulama',summary:'Component test ile integrated systems testing arasındaki farkı kurar.',visual:'commissioning',sources:['uptime','tier'],segments:[
      'UPS çalıştı. Jeneratör çalıştı. Chiller çalıştı. Network switch çalıştı. Peki bu, veri merkezinin çalıştığını kanıtlar mı? Hayır. Çünkü mission-critical tesislerde asıl risk çoğu zaman sistemlerin kesişim noktalarındadır.',
      'Commissioning’in amacı yalnız cihazları tek tek devreye almak değildir. Tasarım niyetini doğrulamak, kontrol sekanslarını test etmek, alarm ve failover davranışlarını görmek ve tesisin gerçek arıza senaryolarında nasıl tepki verdiğini kanıtlamaktır.',
      'Şehir elektriği kesildiğinde UPS’in yükü tutması, jeneratörlerin doğru sırayla devreye girmesi, soğutmanın stabil kalması, alarm sistemlerinin doğru mesajı üretmesi ve operasyon ekibinin doğru prosedürü uygulaması birlikte sınanmalıdır.',
      'İyi commissioning, problemi müşteri yükü devreye alınmadan önce bulur. Kötü commissioning ise problemi canlı operasyon sırasında müşterinin bulmasına izin verir.'
    ]},
    {id:'10',title:'Neden bağımsız teknik danışman?',kicker:'Owner’s Adviser',summary:'Disiplinler ve vendor’lar arasında yatırımcı adına tek teknik yönetişim katmanını açıklar.',visual:'advisory',sources:['tier','uptime'],segments:[
      'Bir veri merkezi projesinde birçok güçlü uzman vardır. UPS üreticisi güç sistemini, cooling üreticisi termal sistemi, network vendor’ı ağı, müteahhit kendi teslim kapsamını optimize eder. Bu normaldir.',
      'Fakat yatırımcı açısından temel soru şudur: bütün sistemi kim optimize ediyor? Bir disiplinin yerel olarak doğru kararı, başka bir disiplinle birleştiğinde toplam sistem açısından yanlış sonuç üretebilir.',
      'Bağımsız teknik danışmanın rolü marka seçmekten daha geniştir. Yatırım hedefini teknik gereksinime çevirmek, teklifler arasında ortak değerlendirme zemini kurmak, overdesign ve underdesign riskini görmek, gizli single point of failure’ları tespit etmek ve commissioning kriterlerini yatırımcı adına korumaktır.',
      'Danışman bir ürünün temsilcisi değil, yatırım kararının teknik temsilcisidir. Değeri yalnız doğru ekipmanı seçmekten değil; yanlış CAPEX’i, rework’ü, change-order’ı, vendor lock-in’i ve işletme döneminde ortaya çıkacak tasarım borcunu azaltmaktan gelir.'
    ]},
    {id:'11',title:'Türkiye neden önemli?',kicker:'Bölgesel fırsat',summary:'İç pazar, coğrafya, interconnection ve hyperscaler sinyallerini birleştirir.',visual:'turkey',sources:['tuik','decix','aws','google','invest'],segments:[
      'Türkiye’nin veri merkezi fırsatı tek bir avantaja dayanmıyor. Büyük iç pazar, yüksek dijital kullanım, Avrupa ile Orta Doğu ve Orta Asya arasındaki konum, gelişen interconnection ekosistemi ve global cloud oyuncularının artan fiziksel ilgisi aynı anda güçleniyor.',
      'İstanbul’un değeri yalnız nüfustan gelmiyor. Balkanlar, Karadeniz, Kafkasya, Orta Doğu ve Orta Asya arasında network trafiğinin geçebileceği doğal bir kavşak olması bölgesel platform potansiyeli yaratıyor.',
      'DE-CIX’in İstanbul interconnection pazarındaki büyümeye ilişkin verileri, AWS’in İstanbul Local Zone adımı ve Google Cloud’un Türkiye region planı aynı yönde okunabilir: Türkiye yalnız cloud tüketen bir pazar değil, giderek daha fazla fiziksel dijital altyapının konuşlandırıldığı bir pazar haline geliyor.',
      'Bu sinyaller hiçbir özel projeye otomatik müşteri garantisi vermez. Fakat ülkenin infrastructure market olarak global oyuncular tarafından daha ciddi değerlendirildiğini gösteren güçlü doğrulama işaretleridir.'
    ]},
    {id:'12',title:'Why now? Fırsat penceresi',kicker:'Zamanlama',summary:'Olgun pazarlardaki enerji kıtlığı ile Türkiye’deki gelişen talebi birlikte okur.',visual:'whynow',sources:['cbre','decix','aws','google','invest'],segments:[
      'Yatırım açısından doğru soru yalnız Türkiye’nin iyi bir pazar olup olmadığı değildir. Zamanlamanın da doğru olup olmadığıdır.',
      'Olgun Avrupa veri merkezi pazarlarında power availability ve yeni kapasitenin devreye alınma süresi giderek daha önemli bir sınırlama haline geliyor. Aynı dönemde Türkiye’de interconnection trafiği, cloud yatırımı ve kamu politika ilgisi yükseliyor.',
      'Bu kombinasyon Türkiye’yi henüz doygun olmayan, fakat dijital altyapı sinyalleri belirgin biçimde güçlenen emerging market konumuna getiriyor. Erken olmak avantaj sağlayabilir; fakat erken olmak talebi varsaymak anlamına gelmemeli.',
      'Doğru strateji spekülatif olarak büyük tesis kurmak değil; secured power, gerçek müşteri pipeline’ı ve fazlı masterplan üzerinden talep geldikçe büyüyen bir platform oluşturmaktır.'
    ]},
    {id:'13',title:'Yatırım modeli: fazlı büyüme',kicker:'Capital discipline',summary:'Masterplan ile Phase-1 CAPEX’i birbirinden ayırır.',visual:'phases',sources:['cbre','uptime'],segments:[
      'Veri merkezinde nihai vizyon ile ilk gün harcanacak sermaye aynı şey olmak zorunda değildir. Elli megawattlık bir masterplan, ilk günde elli megawattlık mekanik ve elektrik ekipmanı satın almak anlamına gelmemelidir.',
      'Daha disiplinli model; arsayı, enerji yolunu, bina geometrisini ve ana altyapıyı nihai büyümeyi destekleyecek şekilde planlarken ilk faz CAPEX’ini doğrulanmış talebe göre sınırlamaktır.',
      'Anchor müşteri, pre-lease, cloud veya managed-service pipeline’ı büyüdükçe yeni salonlar, yeni power block’ları ve yeni cooling modülleri devreye alınabilir. Böylece stranded-capital riski azaltılır.',
      'Yatırımcı için ana metrik yalnız toplam kabinet sayısı değildir. Satılabilir kilowatt, contracted load, doluluk, power utilization, service mix ve bir sonraki faza geçiş için gereken talep eşiği birlikte izlenmelidir.'
    ]},
    {id:'14',title:'Sonuç: stratejik dijital altyapı',kicker:'Kapanış',summary:'Yatırım tezini güç, bağlantı, operasyon ve yönetişim üzerine kapatır.',visual:'closing',sources:['mckinsey','iea','cbre','decix'],segments:[
      'Veri merkezi yatırımının özü kabinet satın almak değildir. Güvenilir elektrik, kontrollü termal ortam, bağlantı, güvenlik, operasyon ve hizmet sürekliliğini tek bir ekonomik platformda birleştirmektir.',
      'Dünya daha fazla compute kapasitesi talep ediyor. Yapay zekâ bu talebi hızlandırıyor. Olgun pazarlarda enerji ve kapasite darboğazları oluşurken Türkiye’nin büyük iç pazarı, bölgesel konumu ve hyperscaler ilgisi yeni bir fırsat penceresi yaratıyor.',
      'Fakat fırsatın varlığı her projenin doğru olduğu anlamına gelmez. Doğru lokasyon, secured power, carrier-neutral connectivity, doğrulanmış müşteri talebi, fazlı CAPEX, iyi commissioning ve profesyonel operasyon aynı anda sağlanmalıdır.',
      'Bu nedenle veri merkezi yatırımı yapıp yapmamak tek başına doğru soru değildir. Doğru soru şudur: doğru yerde, doğru enerjiyle, doğru müşteriye, doğru mimariyle ve doğru yönetişim modeliyle uzun ömürlü bir dijital altyapı platformu kurabilir miyiz? Cevap evetse, bu yalnız bir teknoloji yatırımı değil; önümüzdeki on yılların dijital ekonomisine altyapı sağlayan stratejik bir varlık yatırımıdır.'
    ]}
  ]
};
