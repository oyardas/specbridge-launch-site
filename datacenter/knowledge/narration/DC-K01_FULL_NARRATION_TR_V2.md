# DC-K01 — Data Center Service Models — Full Narration TR v2

Voice baseline: S3F — Sage Senior Adviser  
Narration style: senior technical adviser, calm, precise, board-level but educational  
Research authority: `research/DC-K01_SERVICE_MODELS.md`  
Target total duration: approximately 35–40 minutes  

---

## [K01-00] Veri merkezi gerçekte ne satar?

Bir veri merkezi yatırımını değerlendirirken yapılan ilk hata, işi bina ve kabinet sayısı üzerinden tanımlamaktır. Oysa veri merkezi, fiziksel kapasitenin farklı sorumluluk seviyeleriyle hizmete dönüştürüldüğü bir dijital altyapı işletmesidir.

Aynı tesis yalnız rack alanı ve enerji sağlayabilir. Aynı tesis müşterinin serverlarını da yönetebilir. Bir üst seviyede compute, storage ve network kaynaklarını IaaS olarak sunabilir. Daha ileri seviyede GPU kapasitesi, private cloud, disaster recovery, cyber recovery veya interconnection hizmetleri üretebilir. Bütün bu modeller aynı binayı kullanabilir, fakat aynı iş değildir.

Bu nedenle tasarımın başlangıç noktası şu soru olmalıdır: Bu tesis hangi müşteriye, hangi hizmeti, hangi sorumluluk sınırıyla ve hangi servis seviyesi altında satacak?

Örneğin colocation müşterisi kendi server ve storage cihazını getirmek isteyebilir. Onun ihtiyacı güvenilir power, cooling, fiziksel güvenlik ve bağlantı ekosistemidir. IaaS müşterisi ise server satın almak istemez; sanal compute, storage ve network kapasitesini portal veya API üzerinden tüketmek ister. GPU cloud müşterisi daha da farklıdır. O yalnız GPU aramaz; uygun scheduler, yüksek hızlı network, hızlı storage, güvenilir enerji ve çoğu zaman yüksek yoğunluklu cooling altyapısı bekler.

Dolayısıyla doğru sıra marka seçiminden önce başlar. Önce hedef müşteri belirlenir. Sonra service ve revenue modeli tanımlanır. Ardından hangi katmanı müşterinin, hangi katmanı provider’ın yöneteceği belirlenir. SLA, RPO, RTO, security ve sovereignty şartları yazılır. Workload karakteri ve büyüme planı anlaşılır. En son facility ve IT architecture bu gereksinimlerden türetilir.

Bunu tersine çevirdiğimizde, yani önce binayı ve BoQ’yu dondurup daha sonra “buradan ne satarız?” diye düşündüğümüzde, stranded capacity riski oluşur. Örneğin standard air-cooled rack’lere göre kurulmuş bir white space daha sonra yüksek yoğunluklu AI hizmetine dönüştürülmek istendiğinde güç dağıtımı, cooling, floor loading ve network fabric baştan sorun haline gelebilir. Benzer şekilde cloud hizmeti satmak isteyen bir operator yalnız hypervisor kurarak cloud provider olamaz. Portal, tenant isolation, metering, billing, lifecycle automation ve support sistemleri gerekir.

Bir başka önemli nokta da şudur: Daha gelişmiş görünen hizmet otomatik olarak daha iyi hizmet değildir. Uptime Institute’un risk ve venue-selection yaklaşımında da olduğu gibi karar yalnız teknik prestij üzerinden verilmez. Finansal sonuç, fırsat, risk, compliance, sustainability ve service quality birlikte değerlendirilir. Aynı mantık Tier seçiminde de geçerlidir. Daha yüksek Tier, işin risk toleransına uygun değilse gereksiz yatırım olabilir.

Bu bölümün ana mesajı basit: Veri merkezi önce bir service architecture problemidir. Facility, bu service architecture’ın fiziksel üretim katmanıdır.

Bir sonraki bölümde fiziksel kapasitenin nasıl colocation, cage, suite, wholesale, powered shell ve build-to-suit gibi farklı ticari ürünlere dönüştüğünü inceleyeceğiz.

---

## [K01-01] Colocation: cabinet’ten build-to-suit’a

Colocation, veri merkezi hizmetlerinin en temel ticari modellerinden biridir; ancak “kabinet kiralama” şeklinde tanımlamak yetersizdir. Müşteri aslında yalnız metal bir cabinet satın almaz. Güvenli alan, sürekli enerji, ısı uzaklaştırma kapasitesi, fiziksel güvenlik, operasyonel süreç ve bağlantı ekosisteminin birlikte oluşturduğu bir service boundary satın alır.

Retail colocation modelinde müşteri çoğunlukla kendi server, storage ve network cihazlarını getirir. Provider building, power, cooling, physical security ve facility operations’ı yönetir. Müşteri ise işletim sistemi, application ve çoğu IT architecture kararını kendi kontrolünde tutar.

Bu modelin küçük başlangıç noktası tek veya birkaç cabinet olabilir. Güç tahsisi cabinet başına kW veya kVA ile yapılabilir. Burada provider’ın kritik kabiliyeti granular capacity management’tır. Çünkü bir müşteri 5 kilowatt, başka biri 12 kilowatt, bir diğeri ise çok daha yüksek bir rack density isteyebilir. Metering, A ve B power feed, hot-cold aisle disiplini ve customer access süreçleri bu nedenle hizmetin parçasıdır.

Müşteri cabinet sayısını büyüttüğünde private cage modeli devreye girebilir. Cage, birden fazla cabinet’in fiziksel olarak ayrılmış güvenli bir müşteri alanında tutulmasını sağlar. Ancak cage, müşterinin kendi veri merkezine sahip olduğu anlamına gelmez. Temel facility altyapısı, power, cooling, MMR ve ortak operasyon provider’a aittir.

Daha büyük müşteriler private suite veya dedicated data hall talep edebilir. Burada tenant isolation yükselir; müşteri kendi layout, security policy ve bazen cooling veya network demarcation tasarımında daha fazla söz sahibi olur. Retail ile wholesale arasındaki sınırlar operator’dan operator’a değişebilir; bu terimlerin evrensel sabit teknik eşikleri yoktur.

Wholesale modelde sözleşme genellikle daha büyük capacity block’larına çıkar. Yüzlerce kilowatt veya megawatt seviyesindeki commitments görülebilir. Provider açısından bunun avantajı büyük bir anchor customer ile kapasite doluluğunu hızlı yükseltmektir. Dezavantajı ise customer concentration’dır. Bir büyük müşterinin contract yenilememesi, çok büyük boş kapasite bırakabilir.

Powered shell modelinde scope daha da değişir. Genel olarak bina kabuğu, utility ve fiber erişimi gibi temel unsurlar provider tarafından hazırlanırken, müşteri teknik fit-out’un daha büyük bölümünü üstlenebilir. Fakat “powered shell” teriminin kapsamı provider’a göre değiştiği için, bu modelde sözleşmedeki demarcation son derece önemlidir. Hangi switchgear hazır? UPS kimde? Cooling plant kimde? Commissioning sınırı nerede? Bunların açık yazılması gerekir.

Build-to-suit ise belirli bir büyük müşteri için purpose-built facility veya facility block geliştirilmesidir. Hyperscaler, büyük AI platformu, national cloud veya çok büyük enterprise bu modeli tercih edebilir. Structural design, security, redundancy, power density ve cooling architecture müşterinin gereksinimine göre özelleştirilebilir. Provider büyük ve uzun vadeli bir kontrat kazanır; müşteri ise kendi standardına yakın bir tesis elde eder. Buna karşılık design-lock ve anchor-customer dependency artar.

AI colocation bu fiziksel kapasite ailesinin yeni ve önemli bir alt segmentidir. Bir operator’ın “yüksek yoğunluk destekliyoruz” demesi tek başına yeterli değildir. Önemli olan 60, 80 veya 100 kilowatt gibi bir rack load’un sürekli ve yedekli biçimde rack’e ulaştırılması, ısının güvenli biçimde uzaklaştırılması, ilgili CDU veya liquid loop’un servis edilebilmesi ve yüksek hızlı fiber fabric’in desteklenmesidir.

Bu nedenle colocation tasarımında temel soru yalnız kaç cabinet olacağı değildir. Asıl soru şudur: Hangi müşteri segmentleri için hangi capacity granularity, isolation, density ve interconnection modelini satıyoruz?

Bir sonraki bölümde müşteri donanımının provider tarafından işletildiği veya provider’ın fiziksel server sağladığı managed hosting, dedicated server ve bare metal modellerine geçeceğiz.

---

## [K01-02] Managed hosting, dedicated server ve bare metal

Colocation’da provider’ın ana sorumluluğu facility katmanındadır. Managed infrastructure hizmetlerinde ise provider IT operasyonuna doğru ilerlemeye başlar. Bu geçiş ticari olarak daha yüksek service value yaratabilir; fakat aynı anda staffing, tooling, process ve liability de büyür.

En basit managed servislerden biri Smart Hands veya Remote Hands’tir. Müşterinin cihazı yine müşteriye aittir; fakat provider’ın sahadaki teknisyeni rack-and-stack, cabling, power cycle, visual inspection, component replacement veya emergency troubleshooting gibi fiziksel görevleri yapar. Bu hizmet özellikle data center’dan uzakta olan müşteriler için kritiktir. Çünkü her basit fiziksel müdahalede kendi mühendisini sahaya göndermek zorunda kalmaz.

Smart Hands’in önemi yalnız teknisyen saatinden elde edilen gelir değildir. Müşterinin data center’a operasyonel bağımlılığını güçlendirir ve colocation hizmetini daha kullanılabilir hale getirir.

Managed colocation bundan daha geniş bir kavramdır. Provider network management, firewall operations, monitoring, backup veya işletim sistemi operasyonlarının bir kısmını üstlenebilir. Buradaki en büyük risk “managed” kelimesinin belirsiz kullanılmasıdır. Sözleşmede kimin patch yaptığı, firmware upgrade’i kimin yaptığı, incident sırasında kimin hangi süre içinde müdahale ettiği, backup restore’u kimin test ettiği ve application health’in kimin sorumluluğunda olduğu açıkça yazılmalıdır.

Dedicated server modelinde fiziksel server artık provider’a aittir. Müşteri tek tenant olarak server kapasitesini kullanır. Müşteri server satın alma CAPEX’inden kurtulur; provider ise hardware lifecycle sorumluluğunu üstlenir. Bundan sonra spare parts, standard server profiles, firmware, replacement SLA ve inventory management provider’ın işidir.

Managed hosting, dedicated server üzerine daha fazla operasyon katmanı ekler. Provider işletim sistemi kurabilir, hardening yapabilir, patch uygulayabilir, monitoring, antivirus, backup veya middleware hizmeti sağlayabilir. Bunun sonucunda müşteri açısından operational burden azalır. Provider açısından ise daha yüksek katma değerli gelir mümkündür; fakat insan kaynağı ve service-management olgunluğu zorunlu hale gelir.

Bare Metal as a Service ise dedicated fiziksel server ile cloud consumption modelinin kesiştiği noktadır. Fiziksel server tek tenant’a tahsis edilir; ancak provisioning portal veya API üzerinden, daha standardize ve hızlı biçimde yapılır. Bazı provider’larda saatlik, bazılarında aylık tüketim modeli olabilir.

Bare metal özellikle birkaç durumda anlamlıdır. Birincisi, lisanslama fiziksel socket veya core ile ilişkili olduğunda. İkincisi, shared hypervisor istemeyen security-sensitive workloads’ta. Üçüncüsü, düşük jitter veya daha deterministic performance beklenen uygulamalarda. Dördüncüsü, bazı HPC veya appliance deployment modellerinde.

Dedicated hosting ile bare metal arasındaki temel fark fiziksel server’ın dedicated olması değildir; ikisinde de bu olabilir. Asıl fark consumption ve automation modelidir. Bare-metal-as-a-service, cloud’a benzeyen hızlı provisioning, standard profile, portal, API, metering ve network automation yaklaşımı hedefler.

Bu aşamada provider için kritik bir strateji sorusu oluşur: Facility operator olarak mı kalacağız, yoksa IT lifecycle’ın içine mi gireceğiz? Çünkü her yeni managed service yeni bir operasyon zinciri doğurur. Monitoring tool, ticketing, escalation, maintenance window, spare strategy ve L1, L2, L3 support olmadan geniş service catalog açmak, gelirden önce service debt üretir.

Bir sonraki bölümde abstraction seviyesini bir adım daha yükseltip IaaS, private cloud, hybrid cloud ve sovereign cloud modellerini inceleyeceğiz.

---

## [K01-03] IaaS, private, hybrid ve sovereign cloud

IaaS, yani Infrastructure as a Service, compute, storage ve network kaynaklarının hizmet olarak sunulmasıdır. Bu tanım basit görünür, fakat bir data center operator için çok önemli bir dönüşüm içerir. Çünkü müşteri artık fiziksel server değil, programlanabilir bir kaynak havuzu tüketir.

IaaS’ın altında portal veya API, identity ve tenant yönetimi, orchestration, virtual compute, virtual network, storage, metering, billing ve monitoring bulunur. Bunların altında fiziksel server, network fabric ve facility vardır.

Bu nedenle bir hypervisor cluster kurmak IaaS olmak için yeterli değildir. Gerçek IaaS müşterisi self-service bekler. VM oluşturmak, network bağlamak, storage tahsis etmek, image seçmek, quota görmek ve kaynağı kapattığında lifecycle’ın doğru biçimde sonlanmasını ister. Provider aynı zamanda tenant isolation ve resource accounting yapabilmelidir.

Bu modelde shared responsibility kavramı kritik hale gelir. Provider facility, hardware ve virtualization gibi alt katmanları yönetebilir. Müşteri ise guest operating system, application, identity configuration ve data için sorumluluk taşımaya devam edebilir. Hangi katmanın kimde olduğu kullanılan service’e göre değişir.

Private cloud ise tek bir organizasyona dedicated cloud operating modelidir. Private cloud’un on-premises olmak zorunda olduğu düşüncesi yanlıştır. Müşterinin kendi binasında olabilir, colocation tesisinde olabilir veya provider data center’ında managed service olarak çalışabilir. Önemli olan resource pool ve control modelinin müşteriye dedicated olmasıdır.

Managed private cloud’da provider platform lifecycle’ın daha büyük bölümünü üstlenir. Cluster deployment, patching, monitoring, backup integration ve capacity management provider tarafından yürütülebilir. Bu model, kendi cloud platformunu işletmek istemeyen fakat public cloud’a tamamen geçmek istemeyen kuruluşlar için anlamlı olabilir.

Hybrid cloud ise iki ayrı dünyanın yan yana bulunmasından daha fazlasıdır. On-prem veya private environment ile public cloud arasında connectivity, identity, DNS, security, monitoring ve data movement tutarlı biçimde yönetilmelidir. AWS Outposts gibi modeller public-cloud infrastructure ve services’i customer veya colo lokasyonuna getirerek bu hybrid experience’ı daha bütünleşik hale getirmeye çalışır.

Sovereign cloud konusu ise son yıllarda giderek daha önemli hale geldi. Burada en sık yapılan hata sovereignty’yi yalnız data residency ile eşitlemektir. Verinin ülke sınırları içinde bulunması önemli olabilir, ancak tek kriter değildir. Administrator kim? Control plane nerede? Encryption keys kimde? Provider hangi jurisdiction’a tabi? Sistem internet bağlantısı olmadan çalışabiliyor mu? Foreign operator erişimi nasıl sınırlandırılıyor? Audit log kim tarafından kontrol ediliyor?

Güncel sovereign-cloud modellerinde public cloud üzerinde ek sovereignty controls, customer-controlled private cloud ve local partner-operated national cloud gibi farklı seçenekler bulunabiliyor. Bu nedenle bir yerel data center’ın “veri burada duruyor, dolayısıyla sovereign cloud’uz” demesi teknik olarak yetersizdir.

Yerel operator açısından doğru tasarlanmış sovereign service ciddi bir fırsat olabilir. Local facility, local operations, controlled access, private infrastructure, dedicated connectivity ve auditable governance birlikte sunulabilir. Fakat bunun bir marketing label değil, gerçek operating model olması gerekir.

Özetle cloud service’e doğru ilerledikçe provider daha fazla abstraction ve automation üstlenir. Bu da daha yüksek service value yaratabilir; ancak responsibility boundary, software maturity ve operational risk aynı hızda büyür.

Bir sonraki bölümde bu mantığın en yüksek sermaye ve performans yoğunluğuna sahip alanlarından biri olan GPUaaS, AI Cloud ve HPC as a Service’i ele alacağız.

---

## [K01-04] GPUaaS, AI Cloud ve HPC as a Service

AI yatırımlarının büyümesiyle birlikte GPU as a Service, AI Cloud ve AI Factory gibi kavramlar çok sık kullanılmaya başladı. Fakat bu terimler aynı şeyi anlatmaz.

En basit katman GPU colocation’dır. Müşteri GPU server’ını getirir; data center yüksek yoğunluklu power, cooling, physical security ve connectivity sağlar. Provider GPU kaynağını işletmek zorunda değildir.

Bir sonraki katman dedicated GPU server’dır. GPU hardware provider’a aittir ve müşteriye dedicated olarak sunulur. Burada hardware lifecycle provider’a geçer.

GPU as a Service modelinde ise GPU kapasitesi tüketilebilir bir resource haline gelir. GPU-hour, GPU-month, reserved GPU veya cluster reservation gibi charging modelleri kullanılabilir. Bazı GPU’lar partition teknolojileriyle birden fazla tenant’a bölünebilir. NVIDIA MIG buna bir örnektir. Buradaki amaç her workload’un bütün GPU’yu kullanmadığı durumlarda utilization’ı yükseltirken gerekli isolation’ı sağlamaktır.

Ancak GPU business modelinin en kritik finansal değişkeni satın alınan GPU sayısı değildir. Billable utilization’dır. On milyonlarca dolarlık accelerator capacity satın alıp bunun önemli bölümünü idle bırakmak, çok yüksek görünen saatlik fiyatlara rağmen kötü bir yatırım sonucu üretebilir.

Bu nedenle operator yalnız GPU procurement’a bakmamalıdır. Scheduler ne kadar iyi? Cluster fragmentation ne kadar? Müşteriler hangi reservation sürelerini istiyor? Network veya storage darboğazı GPU’yu bekletiyor mu? Maintenance sırasında ne kadar capacity kaybediliyor? Bu sorular finansal modelin parçasıdır.

AI Cloud, GPUaaS’tan daha geniştir. Kullanıcı yalnız accelerator talep etmek yerine Kubernetes capacity, models, endpoints, AI platform veya inference workers tüketebilir. NVIDIA’nın güncel cloud-partner reference yaklaşımı da AI hizmetini compute, network, storage, software ve operations stack’i olarak ele alır.

AI Cloud’un facility tarafındaki etkisi de ağırdır. GPU rack’leri çok yüksek power density’ye çıkabilir. Liquid cooling gerekebilir. AI fabric 200, 400 veya 800 gigabit gibi yüksek hızlara çıkabilir. Storage yalnız kapasite değil çok yüksek throughput üretmek zorunda olabilir. Yani GPU server satın alınması, toplam architecture’ın yalnız bir parçasıdır.

HPC as a Service bu ekosistemle bazı ortak özellikler taşır. HPC cluster’ları da compute, high-performance networking ve storage üçlüsüne dayanır. Fakat HPC workloads çoğunlukla batch scheduler, simulation, scientific workloads veya parallel computation odaklı olabilir. AI training ile aynı GPU veya network teknolojilerini kullanabilse bile software ecosystem ve workload behavior farklı olabilir.

Bir operator için en sağlıklı AI service ladder şu şekilde düşünülebilir. Önce high-density colocation. Sonra dedicated GPU. Sonra GPUaaS. Ardından managed GPU Kubernetes veya Container as a Service. Daha sonra managed AI platform ve inference service.

Her basamakta müşterinin yönetmek zorunda olduğu altyapı azalırken provider’ın sorumluluğu artar. Bu nedenle en üst servise doğrudan sıçramak her zaman doğru değildir. Organizasyonun people, process, tooling ve software maturity’si hangi seviyeyi güvenilir biçimde sunabileceğini belirlemelidir.

Bir sonraki bölümde data protection tarafına geçeceğiz ve storage, backup, disaster recovery ve cyber recovery kavramlarının neden birbirinin yerine kullanılmaması gerektiğini inceleyeceğiz.

---

## [K01-05] Storage, Backup, DR ve Cyber Recovery

Data protection hizmetlerinde en sık yapılan kavramsal hata, storage, backup, disaster recovery ve cyber recovery’yi aynı ürün ailesinin farklı isimleri gibi görmektir. Oysa bunların her biri farklı bir outcome üretir.

Storage as a Service, müşterinin yönetilen storage capacity ve performance tüketmesidir. Provider disk satmaz; TB-month, throughput, IOPS, replication veya performance tier gibi parametrelerle bir storage service sunar. Burada durability, availability ve lifecycle management sözleşmenin parçası haline gelir.

Backup as a Service’in amacı production data’nın ayrı recovery copies’ini oluşturmaktır. Charging protected TB, workload count, retention period veya restore tier üzerinden yapılabilir. Fakat backup service’in başarısını yalnız “job success” oranıyla ölçmek tehlikelidir. Asıl soru verinin geri döndürülebilip döndürülemediğidir. Bu nedenle restore testing kritik bir service elementidir.

Disaster Recovery as a Service bir adım daha ileri gider. Burada yalnız data copy değil, workload’un başka bir ortamda yeniden çalışması hedeflenir. Replication, recovery compute, network configuration, dependency mapping, orchestration ve runbook gerekir.

Bu noktada RPO ve RTO kavramları ortaya çıkar. Recovery Point Objective, kesinti sonrasında verinin hangi geçmiş noktaya kadar geri getirilebilmesi gerektiğini ifade eder. RTO ise sistemin recovery sürecinde ne kadar süre unavailable kalabileceğini tanımlar. Bu iki hedef service design’ı ve maliyeti ciddi biçimde etkiler.

Örneğin sekiz saatlik RPO ile beş dakikalık RPO aynı replication architecture’ı gerektirmez. Dört saatlik RTO ile on beş dakikalık RTO da aynı reserved recovery compute kapasitesini gerektirmez. Provider satış ekibinin bu değerleri teknik architecture’dan bağımsız biçimde vaat etmesi büyük risktir.

Cyber recovery ise klasik DR’dan farklı bir threat model kullanır. Geleneksel disaster senaryosunda production site kaybedilmiş olabilir. Cyber incident’ta ise production environment’ın kendisinin compromised olduğu varsayılır. Backup credentials çalınmış olabilir, administrator accounts ele geçirilmiş olabilir, replication corrupted data’yı secondary site’a taşımış olabilir.

Bu nedenle cyber recovery için isolated recovery domain, immutable veya offline copies, privileged-access separation, clean-room recovery ve malware validation gibi ek kontroller gerekir. CISA’nın ransomware guidance’ı da offline ve encrypted backup, immutable storage ve düzenli restore testini özellikle vurgular.

Bu ayrım ticari açıdan önemlidir. Provider “backup hizmeti” satıyorsa müşteriye otomatik olarak business continuity sağlamış olmaz. DRaaS satıyorsa cyber recovery sağladığı da varsayılamaz.

Data protection service ladder’ını şöyle düşünebiliriz. Storage capacity veriyi barındırır. Backup verinin recovery copy’sini oluşturur. DR workload’u yeniden çalıştırır. Cyber recovery ise compromised environment koşullarında güvenilir bir clean recovery hedefler.

Bu dört seviyenin her birinde provider’ın sorumluluğu, tooling’i, test yükü ve SLA riski yükselir. Dolayısıyla data protection gelir modeli yalnız TB kapasitesiyle değil, recovery outcome ile tasarlanmalıdır.

Bir sonraki bölümde data center’ın en güçlü network-effect alanlarından biri olan interconnection’ı ve bunun managed operations ile nasıl birleştiğini ele alacağız.

---

## [K01-06] Interconnection ve managed operations

Carrier-neutral bir veri merkezinde network yalnız müşterinin internete çıkmasını sağlayan teknik bir altyapı değildir. Doğru tasarlandığında interconnection, ayrı bir ürün ailesi ve güçlü bir ecosystem moat oluşturabilir.

En temel ürün cross-connect’tir. Müşterinin cabinet, cage veya suite’inden bir carrier, cloud provider, business partner veya başka bir müşteriye fiziksel bağlantı kurulur. Bu hizmet çoğu pazarda bir defalık installation charge ve aylık recurring charge ile fiyatlanabilir. Yani MMR ve cross-connect altyapısı yalnız teknik maliyet değil, recurring revenue kaynağıdır.

Internet Exchange, farklı networklerin doğrudan peering yapmasına imkân verir. Bunun IP Transit’ten farklı olduğunu vurgulamak gerekir. IX üzerinde networkler birbirleriyle traffic exchange eder. Transit provider ise müşteriye daha geniş internet routing erişimi sağlar. Bir data center hem IX ekosistemine hem birden fazla transit provider’a sahip olabilir.

Cloud Connect veya cloud on-ramp hizmeti, müşteri infrastructure’ını public-cloud ortamına private veya dedicated connection üzerinden bağlar. Hybrid-cloud adoption arttıkça bu ürünün değeri yükselir. Çünkü müşteri kendi private infrastructure’ını AWS, Azure, Google Cloud veya başka platformlara public internet dışındaki kontrollü bağlantılarla entegre etmek isteyebilir.

Data Center Interconnect, yani DCI, iki data center arasındaki yüksek kapasiteli bağlantıdır. Active-active uygulamalar, storage replication, metro cluster veya disaster recovery için kullanılabilir.

Bir üst katmanda software-defined interconnection bulunur. Burada müşteriler portal veya API üzerinden virtual connections oluşturabilir, bandwidth seçebilir ve cloud veya partner endpoints’e bağlanabilir. Böylece fiziksel data center ekosistemi programmable bir network platformuna dönüşür.

Interconnection-heavy operator için MMR’nin tasarımı facility’nin merkezinde olmalıdır. Carrier diversity, fiber entrance diversity, patching capacity, demarcation process, cross-connect delivery time ve documentation kalitesi doğrudan commercial value üretir.

Bu network ekosistemini managed operations ile birleştirdiğimizde daha geniş bir service portfolio oluşur. Smart Hands, managed network, managed firewall, NOC as a Service, DDoS protection veya SOC services müşterinin operasyon yükünü azaltabilir.

Ancak managed service tarafında dikkat edilmesi gereken temel kural şudur: Satılan her service için operation model oluşturulmalıdır. Bir firewall service açıyorsanız kimin policy change yaptığı, change approval’ın nasıl olduğu, incident sırasında escalation’ın nereye gittiği ve log retention’ın nasıl yönetildiği bilinmelidir.

Aynı şekilde NOC veya SOC service yalnız dashboard açmak değildir. Alarm ownership, triage, escalation, response time ve service boundaries gerektirir.

Bu nedenle interconnection ve managed services gelir açısından çekici olabilir; fakat en başarılı provider, katalogda en fazla satırı olan değil, sattığı her satırı repeatable ve auditable bir süreçle işletebilen provider’dır.

Son bölümde bütün bu modelleri yatırımcı ve operator perspektifinden birleştirip hangi hizmetin hangi durumda seçilmesi gerektiğini, margin ile complexity arasındaki ilişkiyi ve doğru service portfolio’nun nasıl fazlanacağını değerlendireceğiz.

---

## [K01-07] Ekonomi, risk ve hangi model seçilmeli?

Şimdi bütün service modellerini tek bir yatırım kararı çerçevesinde birleştirebiliriz.

İlk önemli ders şudur: Revenue ile margin aynı şey değildir. Bir hizmetin satış fiyatı yüksek olabilir, fakat o hizmeti üretmek için gereken capital, software, staff ve idle capacity maliyeti daha hızlı büyüyebilir.

Retail colocation yüksek facility CAPEX gerektirir; ancak software complexity görece düşüktür. Wholesale modelde büyük capacity blocks satılır ve unit revenue daha düşük olabilir, fakat scale yüksektir. Bunun karşılığında customer concentration riski artar.

Smart Hands düşük capital ile ek service revenue yaratabilir; ancak insan kaynağı gerektirir. Managed hosting daha yüksek margin fırsatı sunabilir, fakat patching, monitoring, hardware replacement ve support organizasyonu gerekir.

IaaS ve private cloud daha yüksek service value üretir, ancak automation ve platform operations çok daha karmaşıktır. GPUaaS’ın gelir potansiyeli çok yüksek olabilir; fakat CAPEX ve utilization riski de en yüksek modeller arasındadır. GPU satın almakla gelir oluşmaz. GPU’nun billable biçimde kullanılması gerekir.

DRaaS başka bir örnektir. Müşteri recovery outcome için yüksek değer ödeyebilir; fakat provider RPO ve RTO sözünü tutmak için reserved recovery capacity, testing ve orchestration yatırımı yapmak zorundadır.

Interconnection ise farklı bir karakter taşır. Cross-connect, port ve cloud connectivity gibi hizmetler physical ecosystem üzerine recurring revenue ekleyebilir ve müşteri bağlılığını yükseltebilir. Bu nedenle carrier-neutral bir data center’ın değerini yalnız cabinet occupancy ile ölçmek eksik olur.

Peki yeni bir operator hangi sırayla ilerlemeli?

En güvenli yaklaşım service maturity ladder kullanmaktır. İlk seviyede facility operator olunur: cabinet, cage, suite, power, cooling ve security. İkinci seviyede carrier ve interconnection ekosistemi büyütülür. Üçüncü seviyede Smart Hands, managed network, dedicated server ve backup gibi managed infrastructure hizmetleri eklenir. Dördüncü seviyede IaaS, private cloud ve DRaaS gibi software-defined platform services açılır. Beşinci seviyede GPUaaS, AI Cloud, HPC veya managed AI platform gibi çok yüksek complexity’li servisler düşünülür.

Bu sıra zorunlu değildir, fakat önemli bir test sağlar. Bir sonraki seviyeye geçmeden önce people, process, tooling, automation, capacity, security, billing ve SLA governance hazır mı?

Customer fit de aynı derecede önemlidir. Kendi hardware’ını kontrol etmek isteyen enterprise için colocation doğru olabilir. Küçük IT ekibi olan müşteri managed colo veya managed hosting isteyebilir. Elastic digital workload IaaS’a uygundur. Regulated workload private veya sovereign cloud gerektirebilir. AI startup GPUaaS tüketebilir. Büyük AI training müşterisi dedicated GPU cluster isteyebilir. Business continuity ihtiyacı DRaaS’a, ransomware resilience ihtiyacı ise cyber recovery’ye yönelir.

Son olarak service architecture ile facility architecture’ın birlikte fazlanması gerekir. Örneğin ilk günden bütün tesisi AI facility’ye çevirmek yerine standard colocation hall, liquid-ready high-density zone, future cloud pod ve future DR pod gibi growth interfaces planlanabilir. Böylece capital demand ile birlikte devreye alınır.

DC-K01’in nihai mesajı budur: En iyi data center business model, katalogda en fazla hizmeti sunan model değildir. Hedef müşterinin ihtiyacına uygun, facility ve IT architecture tarafından gerçekten desteklenen, söz verilen SLA’yı operasyonel olarak üretebilen ve utilization riski kabul edilebilir olan service portfolio en iyi modeldir.

Bu nedenle her yeni projede önce müşteriyi ve service modelini tanımlamalı; sonra responsibility boundary, commercial unit, SLA ve workload’u belirlemeli; en son power, cooling, network, compute, storage ve operations architecture’ını tasarlamalıyız.

Bu, kabinet satan bir tesisten güvenilir bir dijital altyapı platformuna geçişin temelidir.

Bu ses yapay zekâ ile üretilmiştir.
