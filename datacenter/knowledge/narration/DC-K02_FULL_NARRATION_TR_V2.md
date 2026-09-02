# DC-K02 — Veri Merkezi Tipleri & Modülerlik — Full Narration TR v2

Voice baseline: S3F — Sage Senior Adviser  
Narration style: senior technical adviser, calm, precise, board-level but educational  
Research authority: `research/DC-K02_DATA_CENTER_TYPES_MODULARITY.md`  
Target total duration: content-driven; approximately 35–45 minutes expected  

---

## [K02-00] “Modüler veri merkezi” aslında ne demektir?

Veri merkezi projelerinde en sık karşılaştığımız kavramsal hatalardan biri, birbirinden farklı sorulara cevap veren terimleri aynı sınıflandırma listesine koymaktır. Traditional, modular, containerized, micro data center, edge, enterprise, colocation, hyperscale ve AI data center ifadeleri çoğu zaman sanki birbirinin alternatifiymiş gibi kullanılır. Oysa bunlar aynı şeyi tarif etmez.

Bir projeyi doğru okumak için önce sınıflandırmayı eksenlere ayırmak gerekir. Birinci eksen projenin mevcut durumudur: Greenfield mi, brownfield mi, yoksa retrofit mi? İkinci eksen üretim ve teslim yöntemidir: Sahada kurulan traditional yaklaşım mı, fabrikada ön entegrasyonu yapılmış prefabricated sistemler mi, tekrar edilebilir kapasite bloklarına dayanan modular yaklaşım mı, yoksa bunların birlikte kullanıldığı hybrid model mi? Üçüncü eksen fiziksel formdur: Bina, skid, e-house, container, micro data center, Smart Cabinet veya çoklu rack pod gibi. Dördüncü eksen tesisin görevi ve workload karakteridir: Enterprise, colocation, regional cloud, hyperscale, HPC, AI veya edge. Beşinci eksen ise büyüme modelidir: Kapasite baştan mı kurulacak, fazlar halinde mi büyüyecek, tekrar edilebilir bloklarla mı genişleyecek?

Bu ayrım neden önemli? Çünkü gerçek bir tesis aynı anda brownfield, hybrid, prefabricated power skid’lere sahip, conventional white space kullanan ve ayrıca modular liquid-cooling zone barındıran bir enterprise AI data center olabilir. Tek bir etikete indirgemek, karar mekanizmasını bozabilir.

Buradaki en önemli kavram modularity’dir. Modularity tek başına bir kutu, container veya ürün ailesi değildir. Bir sistemi kapasite, fonksiyon veya lifecycle açısından tekrar edilebilir ve yönetilebilir building block’lara ayırma tasarım ilkesidir. Power sistemi modüler olabilir. Cooling sistemi modüler olabilir. IT white space modüler olabilir. Tüm facility modüler olabilir. Bunların her biri farklı ölçekte uygulanabilir.

Bu nedenle üç ayrımı baştan sabitleyelim. Birincisi, modular demek containerized demek değildir. Container yalnızca fiziksel enclosure biçimidir. İkincisi, prefabricated demek micro data center demek değildir. Megawatt ölçeğinde bir power module da prefabricated olabilir. Üçüncüsü, Smart Cabinet bütün modular data center kavramının eş anlamlısı değildir. Smart Cabinet, cabinet seviyesinde entegre power, cooling, monitoring ve security fonksiyonları sağlayan bir building block olabilir; fakat modularity bunun çok ötesine uzanır.

Bir başka hata da “hangi model daha iyi?” sorusunu bağlamdan bağımsız sormaktır. Traditional yaklaşım bazı projelerde en doğru seçenek olabilir. Prefabricated başka bir projede ciddi zaman avantajı sağlayabilir. Hybrid mimari ise çok sayıda multi-megawatt projede en rasyonel dengeyi kurabilir. Burada karar; ölçek, başlangıç ve nihai kapasite, rack density, cooling yöntemi, saha kısıtları, utility durumu, time-to-capacity, growth planı, resilience, maintainability, logistics ve lifecycle risklerinin birlikte değerlendirilmesiyle verilmelidir.

Dolayısıyla doğru karar zinciri şöyledir: Önce requirement. Sonra project condition. Ardından scale ve capacity. Sonra density ve cooling. Site ve utility constraints. Time-to-capacity. Growth model. Resilience ve maintainability. Logistics. Standardization ile customization arasındaki denge. En sonunda delivery architecture.

Bu sırayı tersine çevirip önce ürün veya enclosure seçersek, teknik karar yerine katalog kararı vermiş oluruz.

Bu bölümün ana mesajı şudur: Modularity bir architecture principle’dır; physical form değildir. Bir sonraki bölümde bu prensibi greenfield, brownfield, retrofit ve traditional construction bağlamında nasıl okuyacağımızı inceleyeceğiz.

---

## [K02-01] Greenfield, brownfield, retrofit ve traditional construction

Bir veri merkezinin teslim modelini seçmeden önce projenin hangi fiziksel koşulda başladığını anlamak gerekir. Greenfield, brownfield ve retrofit kavramları burada temel ayrımı oluşturur.

Greenfield projede yeni bir saha veya yeni bir yapı üzerinde çalışırız. Utility girişleri, transformer ve generator yerleşimleri, electrical rooms, mechanical plant, structural loading, fire compartments, carrier entry, loading route, security zoning ve expansion area baştan planlanabilir. Bu büyük bir tasarım özgürlüğüdür. Ancak greenfield olmak projenin otomatik olarak hızlı olduğu anlamına gelmez. Utility bağlantı takvimi, izinler, civil works, long-lead equipment ve saha altyapısı kritik yol haline gelebilir.

Brownfield projede ise mevcut bina, mevcut data center veya mevcut utility altyapısı içinde kapasite ekleriz. Burada sorun yalnız alan bulmak değildir. Mevcut floor loading, shaft ve riser kapasitesi, generator ve UPS topolojisi, chilled veya facility-water kapasitesi, fire zoning, fiber route, lifting access ve en önemlisi canlı sistemlere yapılacak tie-in işlemleri kararın parçasıdır.

Örneğin yeni bir power skid fiziksel olarak binanın yanına yerleşebilir. Fakat mevcut switchgear’a bağlantı için uzun bir shutdown gerekiyorsa, fiziksel uygunluk operasyonel uygunluk anlamına gelmez. Aynı şekilde yeni bir liquid-cooling zone için CDU koyacak alan bulunabilir; fakat mevcut heat-rejection sistemi gerekli sıcaklık, akış veya yedeklilik seviyesini sağlayamıyorsa gerçek constraint başka yerdedir.

Retrofit ise mevcut sistemin kapasite, verimlilik, resilience veya teknoloji açısından yenilenmesidir. UPS değişimi, battery modernization, busway eklenmesi, controls veya DCIM yenilemesi, high-density rack zone, CDU skid veya liquid cooling retrofit bu kapsama girebilir. Retrofit projelerde prefabricated ve modular sistemler özellikle değerli olabilir; çünkü saha üzerindeki assembly süresini azaltabilir ve daha kontrollü bir entegrasyon sağlayabilir. Fakat burada da modülün mevcut failure domain’e nasıl bağlandığı esas konudur.

Şimdi traditional construction’a bakalım. Traditional veya stick-built yaklaşımda building, electrical, mechanical ve white-space infrastructure’ın önemli kısmı proje özelinde sahada kurulup entegre edilir. Bu yaklaşımın en büyük avantajı customization’dır. Irregular bina geometrisine uyum sağlamak, çok özel routing yapmak, farklı vendor’ları bir araya getirmek veya site-specific structural ve MEP optimizasyonu yapmak daha kolay olabilir.

Dezavantajı ise field integration yüküdür. Daha fazla subcontractor interface, saha işçiliği, sequence bağımlılığı, weather ve access etkisi, field wiring ve piping variation, ayrıca commissioning işinin büyük bölümünün sahada gerçekleşmesi söz konusudur. Bu nedenle traditional yaklaşımın başarısı yalnız tasarım kalitesine değil, saha yönetimi ve commissioning disiplinine de bağlıdır.

Burada önemli bir yanlış algıyı düzeltmek gerekir. Traditional eşittir eski teknoloji değildir. Hyperscale bir campus bile conventional building ve civil infrastructure kullanırken power veya cooling tarafında yüksek ölçüde industrialized ve repeatable modüller kullanabilir. Tam tersine küçük bir proje de container içinde olsa bile kötü interface tasarımı nedeniyle operasyonel olarak karmaşık olabilir.

Greenfield projede tüm facility’yi prefabricated yapmak mümkün olabilir; ancak site master planı ve utility altyapısı yine site-specific kalır. Brownfield projede ise çoğu zaman hybrid yaklaşım daha güçlüdür: Mevcut building korunur, yeni power veya cooling capacity prefabricated skid olarak eklenir, IT alanı conventional veya modular pod’larla büyütülür.

Bir başka kritik konu, kapasiteyi baştan fazla kurma riskidir. Traditional projelerde çok büyük plant kapasitesini ilk günden kurmak bazı durumlarda mantıklı olabilir; özellikle demand kesin ve economies of scale güçlü ise. Fakat demand belirsizse stranded capacity oluşabilir. Modular phasing burada avantaj sağlayabilir; ancak bunu bir sonraki bölümlerde ekonomik olarak daha ayrıntılı ele alacağız.

Bu bölümün sonucu şudur: Greenfield bize tasarım özgürlüğü verir; brownfield constraint yoğunluğunu artırır; retrofit mevcut failure domain’leri ve shutdown riskini merkeze taşır. Traditional construction ise bunlardan herhangi biriyle birlikte kullanılabilen bir delivery method’dur.

Bir sonraki bölümde prefabricated, modular, containerized ve hybrid mimarilerin birbirinden hangi mühendislik sınırlarıyla ayrıldığını inceleyeceğiz.

---

## [K02-02] Prefabricated, modular ve containerized mimariler

Prefabricated yaklaşımın temel fikri, sahada yapılacak entegrasyonun bir bölümünü factory environment’a taşımaktır. Power, cooling, IT space veya bunların kombinasyonları önceden assemble edilebilir, kablolanabilir, borulanabilir, kontrol sistemleri entegre edilebilir ve belirli testlerden geçirilebilir. Sonrasında sahaya taşınır, site interfaces’e bağlanır ve final commissioning yapılır.

Prefabricated power module içinde switchgear, transformer, UPS, bypass ve low-voltage distribution bulunabilir. Cooling module içinde pumps, heat exchangers, chillers veya CDU altyapısı bulunabilir. IT module ise rack rows, containment, power distribution, cooling ve monitoring ile birlikte hazırlanabilir.

Prefabrication’ın en büyük potansiyel avantajlarından biri paralel çalışmadır. Sahada foundation, utility veya building çalışmaları devam ederken factory’de modül üretilebilir. Bu, time-to-capacity üzerinde ciddi değer yaratabilir. Ayrıca kontrollü assembly ortamı, tekrar edilebilir wiring ve piping, factory QA ve FAT gibi avantajlar sağlayabilir.

Ancak factory testing site commissioning’in yerini almaz. Bu ayrımı çok net tutmak gerekir. Bir modül factory’de kusursuz çalışabilir; fakat sahada yanlış fault-current varsayımı, grounding problemi, yanlış water temperature, control protocol uyuşmazlığı veya fiziksel clearance eksikliği nedeniyle başarısız olabilir. Bu nedenle doğru zincir design review, factory QA ve FAT, transport inspection, site installation, field connection tests, SAT, system commissioning ve integrated systems testing olarak ilerler.

Modular architecture ise prefabrication’dan farklı bir kavramdır. Bir çözüm factory-built olmadan da modular tasarlanabilir. Burada asıl konu capacity veya function’ın tekrar edilebilir blocks şeklinde düzenlenmesidir. Örneğin 500 kilowatt’lık bir başlangıç kapasitesi daha sonra aynı tasarım mantığıyla bir sonraki block eklenerek büyütülebilir. Bu yalnız bir örnektir; doğru block size proje özelinde belirlenmelidir.

Modularity’nin üç ana biçimini düşünebiliriz. Capacity modularity, kapasitenin fazlar halinde eklenmesidir. Functional modularity, power, cooling veya IT gibi fonksiyonların ayrı bloklar halinde ele alınmasıdır. Lifecycle modularity ise bir sistemin tüm facility’yi yeniden kurmadan değiştirilebilir veya refresh edilebilir olmasıdır.

Containerized çözüm ise bu iki kavramın dışında fiziksel formu tarif eder. IT veya support infrastructure transportable enclosure içine yerleştirilir. Bu enclosure ISO shipping container geometry’sine yakın olabilir veya custom module olabilir. Avantajı transportability, factory integration ve hızlı deployment olabilir. Buna karşılık width, height, weight, service clearance, internal aisle, route survey, bridge ve road limits, crane kapasitesi, fire integration ve heat-rejection interface kritik hale gelir.

En önemli risklerden biri, transport engineering’i geç bırakmaktır. Design tamamlandıktan sonra modülün sahaya gelemeyeceği anlaşılırsa prefab schedule avantajı kaybolur. Bu yüzden module dimensions, shipping weight, center of gravity, road ve bridge limits, turning radius, route height, laydown area, crane radius ve lifting points design freeze’den önce doğrulanmalıdır.

Şimdi hybrid modele geçelim. Gerçek dünyada çok sayıda proje için en güçlü cevap budur. Site ve building site-specific kalır. Main utility ve civil infrastructure conventional olabilir. Buna karşılık prefabricated power modules, cooling skids, modular white-space pods veya dedicated AI blocks kullanılabilir.

Hybrid yaklaşımın mantığı basittir: Site-specific olmak zorunda olan unsurları custom bırak, tekrar edilebilir olan unsurları standardize et. Bu özellikle brownfield expansion, multi-megawatt phased facility, mixed air-and-liquid cooling ve AI capacity insertion gibi projelerde değerli olabilir.

Burada vendor neutrality açısından önemli bir prensip vardır. Standardize edilmesi gereken şey yalnız ürün ailesi değil, interface’lerdir. Electrical voltage ve protection boundary, mechanical temperature, flow ve pressure, controls protocol, alarm taxonomy, rack geometry, fiber demarcation, fire interface ve commissioning test points açık tanımlanırsa farklı vendor veya generation’ların entegrasyonu daha yönetilebilir hale gelir.

Bu bölümün ana mesajı şudur: Prefabrication entegrasyonu factory’ye taşır. Modularity kapasiteyi veya fonksiyonları building block’lara ayırır. Containerization fiziksel enclosure biçimidir. Hybrid ise bunları proje gereksinimine göre birlikte kullanır.

Bir sonraki bölümde bu kavramları daha küçük ve dağıtık deployment’lara taşıyıp micro data center, Smart Cabinet ve edge architecture arasındaki farkları inceleyeceğiz.

---

## [K02-03] Micro DC, Smart Cabinet ve Edge

Edge computing konuşulduğunda sık yapılan hata, edge kavramını fiziksel olarak küçük bir cabinet ile eşitlemektir. Edge aslında workload placement ve latency bağlamıdır. Compute veya data processing kapasitesinin kullanıcıya, cihaza, üretim hattına, branch’e veya veri kaynağına daha yakın konumlandırılmasıdır. Fiziksel form bunun sonucu olabilir, tanımı değil.

Bir edge deployment tek rack olabilir. Küçük bir prefabricated pod olabilir. Container olabilir. Küçük bir brick-and-mortar room olabilir. Regional edge ise birkaç rack’ten çok daha büyük kapasiteye çıkabilir. Bu nedenle “edge eşittir micro” demek doğru değildir.

Micro data center ise küçük fiziksel ölçekte IT ve supporting infrastructure’ın entegre edildiği mimaridir. Tipik olarak rack veya birkaç rack seviyesinde compute, storage ve network yanında UPS, PDU, cooling, monitoring, physical security ve bazı durumlarda fire detection veya suppression birlikte ele alınır.

Bu yaklaşım branch office, factory floor, retail, telecom edge, hospital satellite site veya uzak operasyon noktalarında anlamlı olabilir. Çünkü klasik bir data center room kurmak yerine daha kompakt, factory-integrated ve remote-manageable bir çözüm sağlanabilir.

Smart Cabinet de benzer bir entegrasyon yaklaşımıdır; fakat onu tüm modular data center kavramıyla eşitlememek gerekir. Smart Cabinet genellikle cabinet seviyesinde rack, UPS, distribution, cooling, monitoring, access control ve security fonksiyonlarının bir araya getirilmesidir. Bir micro data center’ın building block’u olabilir, fakat megawatt ölçeğindeki modular power veya cooling architecture ile aynı sınıf değildir.

Edge ve micro deployment’larda environmental risk daha belirgin hale gelir. Büyük data center’larda kontrollü ortam, çift giriş, fiziksel güvenlik, teknik personel ve merkezi plant olabilir. Edge site ise depo, mağaza, üretim tesisi, ofis, dış ortam enclosure’ı veya erişimi kısıtlı uzak bir noktada bulunabilir. Dust, humidity, ambient temperature, vibration, acoustics, unauthorized access ve technician response time önemli hale gelir.

Bu nedenle micro data center seçerken yalnız “kaç U rack?” sorusu yeterli değildir. Şu soruları sormak gerekir: Normal ve peak heat load nedir? Cooling unit’in failure mode’u nedir? UPS runtime ve battery environment nasıl? Remote monitoring gerçek anlamda merkezi operasyona entegre mi? Door access ve camera gibi fiziksel security kontrolleri var mı? Fire strategy nedir? Network bağlantısı kesildiğinde local workload nasıl davranıyor? Spare parts ve technician erişimi ne kadar sürede sağlanıyor?

Edge deployment’ların bir başka kritik özelliği standardization ihtiyacıdır. Yüzlerce branch veya edge site varsa her siteyi farklı tasarlamak operational debt üretir. Burada modularity’nin değeri yalnız fiziksel kolaylık değil, aynı configuration, aynı alarm taxonomy, aynı remote-management model ve aynı spare-parts standardının tekrar edilebilmesidir.

Ancak standardization’ın da sınırı vardır. Aynı Smart Cabinet’i her sahaya zorla uygulamak doğru değildir. Bir site çok sıcak olabilir, diğerinde dust seviyesi yüksek olabilir, başka bir site seismic veya acoustic constraint taşıyabilir. Bu nedenle ürün standardizasyonu ile environmental envelope arasında kontrollü bir ilişki kurulmalıdır.

Micro ve edge tasarımlarda redundancy de bağlama göre ele alınmalıdır. Küçük bir branch için tam 2N power/cooling ekonomik olmayabilir. Bunun yerine application-level redundancy, ikinci site, cloud failover veya spare-unit strategy daha rasyonel olabilir. Buna karşılık kritik industrial control veya healthcare workload farklı availability gereksinimleri taşıyabilir.

Burada kararın facility etiketinden değil, business impact’ten türetilmesi gerekir. Bu yaklaşım, tüm modül boyunca kullandığımız ana prensiple aynıdır: Önce requirement, sonra architecture.

Bu bölümün sonucu şudur: Edge workload placement bağlamıdır. Micro data center compact integrated infrastructure’dır. Smart Cabinet cabinet-level integration’dır. Bunlar birbiriyle ilişkili olabilir, fakat aynı kavram değildir.

Bir sonraki bölümde ölçek büyüdükçe modularity’nin ekonomik tarafını, phased deployment’ı, CAPEX, OPEX ve stranded capacity riskini inceleyeceğiz.

---

## [K02-04] Scale, phasing, CAPEX ve stranded capacity

Modular architecture’ın ekonomik değerini anlamak için önce önemli bir yanılgıyı düzeltmek gerekir: Prefabricated veya modular çözüm otomatik olarak daha ucuz değildir. Aynı system boundary ile karşılaştırıldığında equipment, factory integration, transport, site civil work, crane, field connections, commissioning ve owner engineering maliyetlerinin tamamı hesaba katılmalıdır.

Bazı projelerde traditional çözüm daha düşük ilk yatırım maliyetine sahip olabilir. Özellikle local supply chain güçlü, transport pahalı ve bina geometrisi özel ise. Başka bir projede ise factory integration, daha düşük saha işçiliği, daha az rework ve daha hızlı revenue activation modular çözümü toplam ekonomik açıdan daha güçlü hale getirebilir.

Burada time-to-capacity önemli bir finansal değişkendir. Bir data center block’u altı ay daha erken gelir üretmeye başlıyorsa, yalnız equipment CAPEX karşılaştırması eksik kalır. Aynı şekilde capacity ihtiyacı üç yıl sonra oluşacaksa, bugünden tüm power ve cooling plant’i kurmak finansal olarak doğru olmayabilir.

Phased deployment’ın temel mantığı demand curve ile installed capacity curve’ü birbirine yaklaştırmaktır. Phase 1 gerçek başlangıç ihtiyacını karşılar. Phase 2 talep yükseldiğinde eklenir. Phase 3 daha sonra devreye girer. Bu yaklaşım forecast error’a karşı koruma sağlar ve stranded capacity riskini azaltabilir.

Fakat çok küçük block size da sorun yaratabilir. Her yeni block ayrı switch, valve, controller, UPS, pump veya monitoring object gerektiriyorsa duplication artar. Dollar per kilowatt yükselebilir. Partial-load efficiency bozulabilir. Maintenance object sayısı büyüyebilir. Bu nedenle doğru block size, forecast uncertainty ile economies of scale arasındaki optimum noktadır.

Ölçek tartışmasını yapılandırmak için örnek bantlar kullanabiliriz. Elli ila iki yüz kilowatt aralığında micro data center, Smart Cabinet, integrated row veya küçük conventional room güçlü adaylardır. Beş yüz kilowatt civarında prefabricated power veya cooling ile conventional IT room arasında hybrid modeller anlamlı olabilir. Bir ila iki megawatt seviyesinde repeated modular blocks, conventional building ile prefabricated MEP veya full-prefab seçenekleri karşılaştırılabilir. Beş megawatt seviyesinde hybrid campus yaklaşımı, repeatable power ve cooling blocks ile standard IT halls güçlü hale gelir. Yirmi megawatt ve üzerindeki campus projelerinde ise utility master plan, supply-chain repeatability, phased energization ve standardized halls daha kritik olur.

Bu sayılar bir standart veya hard threshold değildir. Aynı kapasitedeki iki proje; climate, utility, rack density, revenue model, land, building ve resilience hedefleri nedeniyle tamamen farklı architecture seçebilir.

CAPEX dışında lifecycle CAPEX de önemlidir. Bir module ilk gün hızlı kurulmuş olabilir; fakat on beş yıl sonra nasıl değiştirileceği tasarlanmadıysa lifecycle avantajı kaybolabilir. Crane erişimi kalacak mı? Replacement module aynı geometry’ye uyacak mı? Control system backward-compatible olacak mı? Manufacturer support devam edecek mi? Tie-in sırasında shutdown gerekiyor mu? Bunlar ilk procurement sırasında düşünülmelidir.

OPEX tarafında da modular etiketi enerji verimliliği garantisi değildir. OPEX’i actual load profile, UPS efficiency, cooling architecture, climate, economization, airflow management, water strategy, controls, maintenance ve technician travel gibi faktörler belirler. Modularity doğru right-sizing ile unused plant’i azaltabilir. Buna karşılık çok sayıda küçük duplicated plant düşük load’da verimsiz çalışabilir.

Bir başka ekonomik değişken technology refresh’tir. Özellikle AI gibi hızlı gelişen workload’larda, tüm facility’yi ilk günden gelecekteki en yüksek density’ye göre overbuild etmek yerine, reserved interfaces bırakıp high-density blocks’ı demand geldiğinde eklemek daha rasyonel olabilir. Ancak interface kapasitesi yetersiz bırakılırsa bu kez retrofit maliyeti büyür.

Bu nedenle ekonomik model yalnız “traditional versus modular CAPEX” tablosu olmamalıdır. Initial CAPEX, lifecycle CAPEX, OPEX, time-to-capacity, revenue activation, stranded-capacity risk, expansion outage, replacement cost ve vendor dependency birlikte değerlendirilmelidir.

Bu bölümün ana mesajı şudur: Modularity’nin ekonomik avantajı çoğu zaman ucuz bir kutu olmaktan değil, kapasiteyi doğru zamanda aktive etmekten gelir.

Bir sonraki bölümde ekonomik kararın üzerine resilience katmanını ekleyip Tier, redundancy, maintainability ve commissioning ilişkisini inceleyeceğiz.

---

## [K02-05] Tier, redundancy, commissioning ve failure domains

Modular veya prefabricated bir data center’ın yüksek availability hedeflerine ulaşamayacağı düşüncesi doğru değildir. Uptime Tier-Ready ve TIA-942 Ready gibi çerçeveler, pre-engineered veya modular çözümlerin de belirli resilience prensipleriyle tasarlanabileceğini gösterir. Ancak burada çok önemli bir sınır vardır: Bir module’un hazır veya prevalidated olması, final site’ın otomatik olarak certified olduğu anlamına gelmez.

Availability her zaman end-to-end topology meselesidir. Bir power module kendi içinde 2N olabilir. Fakat iki path upstream’de aynı transformer, switchboard veya fuel system’e bağlanıyorsa gerçek failure domain ortak olabilir. Benzer şekilde iki cooling train ayrı görünür, fakat aynı header, pump controls veya heat-rejection system’i paylaşıyorsa tek hata noktası oluşabilir.

Bu nedenle redundancy değerlendirmesini module boundary’de durdurmamak gerekir. Electrical tarafta source’tan IT load’a kadar bütün path incelenmelidir. Mechanical tarafta IT heat source’tan final heat rejection’a kadar bütün chain değerlendirilmelidir. Controls, fuel, fire, water ve network gibi supporting systems de failure domain’in parçasıdır.

Concurrently maintainable tasarımın amacı, planned maintenance sırasında ICT load’un kesintiye uğramadan desteklenebilmesidir. Bunun için redundant capacity components kadar independent distribution paths, isolation, bypass ve bakım senaryoları önemlidir. “N plus one” veya “2N” etiketi tek başına yeterli değildir. Gerçek maintenance procedure üzerinde hangi breaker’ın açılacağı, hangi valve’ın kapatılacağı, hangi controller’ın service’e alınacağı simüle edilmelidir.

Prefabricated architecture’ın QA avantajı burada devreye girer. Factory’de assembly ve FAT yapılması wiring, control logic veya component defect’lerini daha erken yakalayabilir. Fakat final site interfaces yalnız sahada doğrulanabilir. Bu yüzden FAT, SAT ve IST’yi birbirinin alternatifi değil, ardışık güvence katmanları olarak görmek gerekir.

FAT sırasında module içindeki fonksiyonlar test edilir. Transport sonrası inspection, mekanik veya electrical hasarı kontrol eder. Site installation ve field connections tamamlandığında SAT ve start-up yapılır. System commissioning, module’un site sistemleriyle doğru çalıştığını doğrular. Integrated Systems Testing ise failure ve maintenance senaryolarında sistemlerin birlikte nasıl davrandığını gösterir.

Örneğin utility kaybında generator start ediyor olabilir. UPS kendi testinde sorunsuz olabilir. Cooling module da kendi başına çalışıyor olabilir. Ancak gerçek integrated test sırasında generator transition, UPS load, pump restart, controls communication ve thermal response birlikte doğrulanmalıdır.

Brownfield projelerde risk daha da büyür. Yeni module mevcut canlı sisteme bağlanırken temporary operating mode oluşabilir. Bu sırada redundancy düşebilir. Tie-in planı, rollback procedure ve maintenance window tasarımın parçası olmalıdır.

Bir başka önemli konu certification scope’tur. Tier-Ready veya Ready designation belirli bir reviewed solution’a ilişkindir. Final site’ın building, site utility, upstream ve downstream integration’ı ayrıca değerlendirilir. Bu nedenle vendor brochure üzerindeki certification logosunu final facility outcome’u olarak yorumlamak doğru değildir.

Risk yönetiminde interface register burada tekrar önem kazanır. Electrical fault current ve protection coordination, earthing, mechanical temperatures ve flows, controls protocol, fire shutdown logic, network dependency ve monitoring boundaries açıkça tanımlanmalıdır.

Bu bölümün ana mesajı şudur: Modular form yüksek resilience ile uyumludur; fakat resilience module etiketinden değil, end-to-end topology, isolation, maintainability ve integrated testing’den doğar.

Bir sonraki bölümde bu prensipleri günümüzün en hızlı değişen workload alanına, AI, high-density rack ve liquid cooling mimarisine uygulayacağız.

---

## [K02-06] AI, high density ve liquid cooling

AI data center tartışmasını yalnız “kaç GPU var?” sorusuna indirgemek ciddi bir tasarım hatasıdır. GPU-centric clusters power, cooling, network ve lifecycle açısından conventional compute’tan farklı baskılar yaratır. Rack power density yükselir, current seviyesi artar, network fabric yoğunlaşır ve liquid cooling daha önemli hale gelir.

Güncel engineering context’te GPU clusters için kırk ila yüz kilowatt per rack bandı sık görülür; purpose-built AI environments elli ila yüz yirmi kilowatt per rack ve üzerine çıkabilir. Bu değerler bir seçim threshold’u değildir. Bir projenin modular olması gerektiğini söylemez. Yalnız bugün karşılaşılan thermal ve electrical scale’in neden değiştiğini gösterir.

High-density rack’in ilk etkisi power distribution’dadır. Feeder current, busway veya RPP sizing, breaker capacity, cable density ve A/B path tasarımı yeniden ele alınmalıdır. İkinci etki cooling’dedir. Airflow ile taşınabilecek heat load sınırlı hale geldiğinde direct-to-chip liquid cooling, rear-door heat exchanger veya başka liquid-assisted yöntemler devreye girebilir.

Liquid cooling mimarisinde Technology Cooling System, yani TCS, ayrı bir engineering domain olarak düşünülmelidir. Coolant temperature, supply-return delta, flow, pressure, water quality, filtration, leak detection, CDU redundancy, bypass ve maintenance procedure belirlenmelidir. Facility Water System ile TCS arasındaki interface çoğu projede heat exchanger veya CDU üzerinden kurulur.

Modularity burada değer yaratabilir. Örneğin existing air-cooled data center içinde dedicated AI zone kurulabilir. High-density rack rows A/B high-current distribution ile beslenir. Liquid-cooled servers CDU veya secondary loop’a bağlanır. CDU module facility water veya heat-rejection system’ine bağlanır. Böylece tüm facility’yi aynı anda liquid-cooled hale getirmek zorunda kalmadan kontrollü bir high-density island oluşturulabilir.

Bu yaklaşım özellikle brownfield retrofit’te güçlüdür. Fakat yeniden aynı uyarıyı yapalım: Module koymak tek başına çözüm değildir. Mevcut heat-rejection system’in capacity’si, water temperatures, pump head, pipe route, structural loading ve electrical upstream kapasitesi yeterli değilse bottleneck başka yerdedir.

AI architecture’da lifecycle riski de yüksektir. Accelerator generations hızla değişir. Bugün yeterli olan rack power envelope birkaç generation sonra sınırlayıcı olabilir. Bu nedenle module’un yalnız mevcut rack’e değil, gelecekteki power ve cooling roadmap’ine göre değerlendirilmesi gerekir.

Burada iki zıt risk vardır. Birincisi overbuild. Gelecekte gerekebilir diye tüm facility’yi çok yüksek density’ye göre kurmak CAPEX ve stranded capacity yaratabilir. İkincisi underbuild. Expansion interfaces, busway capacity, pipe headers veya CDU connection points yetersiz bırakılırsa gelecekte pahalı retrofit gerekir.

Doğru denge reserved capability ile staged deployment arasındadır. Main electrical ve mechanical backbone belirli headroom ve expansion points sağlar. High-density blocks demand geldiğinde aktive edilir. Bu şekilde technology refresh de daha yönetilebilir hale gelir.

Network tarafı da unutulmamalıdır. AI clusters high-bandwidth, low-latency fabric, çok sayıda optics ve yoğun fiber routing gerektirebilir. Prefabricated IT module tasarlanırken cable bend radius, overhead pathways, service access ve future optics strategy modül envelope’una dahil edilmelidir.

AI-ready ifadesini bu nedenle sorgulamak gerekir. Gerçek bir AI-ready architecture için en azından rack power envelope, cooling method, TCS interface, network fabric space, structural loading, service access ve expansion planı tanımlı olmalıdır. Yalnız “liquid cooling destekli” etiketi yeterli değildir.

Bu bölümün ana mesajı şudur: AI modularity’yi zorunlu kılmaz; fakat hızlı density artışı ve kısa teknoloji çevrimi, replaceable ve expandable power/cooling blocks’ın değerini artırır.

Son bölümde bütün bu teknik katmanları logistics, vendor lock-in ve scenario-based decision framework ile birleştirip hangi projede hangi mimarinin daha güçlü aday olduğunu özetleyeceğiz.

---

## [K02-07] Logistics, lock-in ve hangi mimari hangi senaryo?

Bir data center delivery modelini seçerken teknik performans kadar iki konu genellikle geç fark edilir: Logistics ve lifecycle dependency. Prefabrication’ın schedule avantajı ancak module sahaya zamanında ve güvenli biçimde ulaşabiliyorsa vardır. Modularity’nin lifecycle avantajı ise gelecekte farklı generation veya vendor ile genişleme ve replacement mümkünse gerçektir.

Logistics tarafında module dimensions, shipping weight, center of gravity, route height, bridge limits, turning radius, port veya rail constraints, crane capacity, lifting points, laydown area ve delivery sequence design input olmalıdır. Bunları procurement sonrasında çözmeye çalışmak, schedule riskini büyütür.

Vendor lock-in ise yalnız bir marka kullanmaktan ibaret değildir. Asıl lock-in proprietary geometry, özel bus connector, closed controls, kapalı DCIM API, unique cooling coupling, özel cabinet dimension veya yalnız tek manufacturer’dan sağlanabilen spare module gibi interface’lerde oluşur.

Bu nedenle vendor neutrality için en etkili yaklaşım, ürün ailesini tamamen standardize etmek değil, interface’leri standardize etmektir. Electrical voltage, frequency, protection ve earthing boundary açık olmalıdır. Mechanical supply-return temperature, flow, pressure ve connection standardı tanımlanmalıdır. Controls tarafında BACnet, Modbus, SNMP veya API gibi interfaces ile alarm naming ve telemetry schema belirlenmelidir. Rack geometry, fiber demarcation, fire interface, lifting envelope ve commissioning test points de dokümante edilmelidir.

Bununla birlikte her şeyi standardize etmek de doğru değildir. Geotechnical, seismic, flood, wind, ambient climate, water availability, utility fault level, permits, fire code, emissions, acoustics, transport route ve carrier entry gibi konular site-specific kalmalıdır. İyi architecture, standardization ile site reality arasındaki sınırı doğru çizer.

Şimdi birkaç senaryoyu birlikte değerlendirelim.

Yaklaşık yüz kilowatt’lık branch veya industrial edge için Smart Cabinet veya micro data center güçlü aday olabilir. Burada remote management, physical security, environment ve service response önemlidir.

Yaklaşık beş yüz kilowatt’lık enterprise expansion’da existing building ile prefabricated power veya cooling subsystem’lerin birlikte kullanıldığı hybrid model güçlü olabilir. Burada brownfield tie-in, outage window, floor loading ve future expansion önceliklidir.

Bir ila iki megawatt regional cloud deployment’ında repeated capacity blocks, prefabricated power ve cooling ile standardized IT pods değerli olabilir. Burada block-size economics, redundancy, supply chain ve commissioning repeatability önem kazanır.

Beş megawatt colocation facility’de conventional building ile repeatable MEP blocks ve flexible tenant white space birlikte kullanılabilir. Tenant density farklılıkları, metering, carrier interconnection ve phased customer demand kritik hale gelir.

Yirmi megawatt ve üzerindeki hyperscale veya AI campus’ta ise tek bir container veya tek bir prefab ürün düşünmek yerine industrialized hybrid architecture daha gerçekçidir. Campus utility master planı, repeated electrical ve cooling blocks, standardized halls, phased energization, liquid-ready AI zones ve network/fiber scale birlikte tasarlanır.

Bu örnekler hard threshold değildir. Aynı kapasitedeki iki projenin sonucu tamamen farklı olabilir. Karar her zaman requirement, project condition, scale, density, site constraint, time-to-capacity, growth model, resilience, logistics, lifecycle ve TCO üzerinden verilmelidir.

Son olarak failure-mode düşüncesini kararın içine dahil edelim. Factory-perfect ama site-wrong module olabilir. 2N etiketi altında shared upstream failure olabilir. Transport route sürprizi yaşanabilir. Future GPU density module envelope’u aşabilir. Proprietary expansion lock oluşabilir. FAT geçip IST’de problem çıkabilir. Fire veya AHJ requirement module tasarımıyla uyuşmayabilir. Phase 2 tie-in Phase 1 shutdown gerektirebilir. Module replaceable görünürken crane route sonradan kapanabilir. Çok küçük blocks OPEX fragmentation yaratabilir. Standardized design’de yapılan tek hata yüzlerce module’a kopyalanabilir.

Bu risklerin tamamı bize aynı prensibi hatırlatır: Modularity standardization sağlar; fakat standardization yanlış kararı da hızla çoğaltabilir. Bu yüzden first article, Golden prototype, interface validation ve integrated testing kritik önemdedir.

DC-K02’nin nihai karar çerçevesini tek cümlede özetleyebiliriz: Doğru veri merkezi tipi, tek bir kategori seçimi değildir. Project condition, delivery method, physical form, workload mission ve growth model’in; site, density, resilience, logistics ve lifecycle gereksinimleriyle birlikte optimize edilmesidir.

Traditional, prefabricated, modular, containerized, micro ve hybrid seçeneklerinin hiçbiri tek başına üstün değildir. Üstün olan, iş gereksinimine en doğru şekilde bağlanan architecture’dır.

Bu nedenle SpecBridge yaklaşımında karar ürünle başlamaz. Gereksinimle başlar, interface ve failure domains üzerinden doğrulanır, lifecycle ve ekonomiyle test edilir ve en sonunda BoQ’ya dönüşür.

DC-K02 Full Briefing burada tamamlanıyor. Kısa Quick Brief, hızlı yönetici özeti olarak ayrı kalmaya devam edecek; bu Full Briefing ise kararın arkasındaki engineering logic’i ayrıntılı biçimde taşır.
