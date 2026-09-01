# SpecBridge Data Center Knowledge Library — Wave 1 Master Narration TR

Voice baseline: S3F — Sage Senior Adviser
Narration style: senior technical adviser, calm, precise, documentary pacing

---

## [DC-K01] Data Center Hizmet Modelleri

Bir veri merkezini yalnız kabinet, enerji ve soğutma kapasitesi üzerinden tanımlarsak, yatırımın en kritik kısmını eksik bırakmış oluruz. Çünkü aynı fiziksel veri merkezi, farklı hizmet modelleriyle tamamen farklı bir iş modeline dönüşebilir.

Önce en temel ayrımı kuralım. Colocation'da müşteri kendi sunucusunu, storage'ını ve network ekipmanını getirir. Veri merkezi ona güvenli alan, enerji, soğutma, fiziksel güvenlik ve bağlantı ortamı sağlar. Yani müşteri hâlâ kendi BT altyapısının sahibidir. Provider ise kritik fiziksel ortamı işletir.

Retail colocation tek kabinetten başlayabilir. Private cage modelinde müşteri birkaç veya onlarca kabineti fiziksel olarak ayrılmış bir alanda kullanır. Daha büyük müşteriler için private suite veya data hall ortaya çıkar. Wholesale colocation ise yüzlerce kilowatt veya megawatt ölçeğinde kapasite bloklarıyla çalışabilir.

Bu noktada önemli bir soru soralım: Colocation ile cloud aynı şey midir? Hayır.

IaaS, yani Infrastructure as a Service modelinde müşteri artık fiziksel sunucunun kendisini satın almak zorunda değildir. Compute, storage ve network kaynaklarını hizmet olarak tüketir. Burada provider'ın sorumluluğu rack'in çok ötesine geçer. Virtualization, orchestration, tenant isolation, virtual networking, metering, billing, monitoring ve lifecycle automation gibi katmanlar gerekir.

Dolayısıyla bir binanın içinde yüzlerce sunucu bulunması, o işletmeyi otomatik olarak cloud provider yapmaz.

Managed hosting ve dedicated server modelleri ise colocation ile IaaS arasında düşünülebilir. Fiziksel sunucu provider'a aittir; müşteri dedicated kapasite kullanır. Managed modelde işletim sistemi, monitoring, patching veya backup gibi görevler de sağlayıcının sorumluluğuna geçebilir.

Bare metal as a Service burada ayrı bir yere sahiptir. Müşteriye fiziksel sunucu tahsis edilir, ancak satın alma ve klasik kurulum süreci yerine hizmet modeliyle sunulur. Bu yaklaşım lisanslama, performans analizi, legacy workload veya düşük seviyeli donanım erişimi gereken uygulamalarda değerlidir.

Şimdi AI tarafına geçelim.

GPU as a Service, yalnız GPU sunucusu kiralamak değildir. Başarılı bir GPUaaS veya AI Cloud için yüksek yoğunluklu güç, çoğu zaman sıvı soğutma, yüksek hızlı east-west network, yüksek throughput storage, scheduler, orchestration ve GPU health management birlikte gerekir.

NVIDIA'nın AI cloud gereksinimleri de bunu full-stack bir hizmet olarak ele alıyor. Yani AI cloud'un gerçek ürünü GPU kartı değil; compute, network, storage, software ve operasyonun birlikte garanti edilen davranışıdır.

Data protection servisleri de ayrı bir gelir katmanıdır. Storage as a Service, Backup as a Service, DR as a Service ve Cyber Recovery birbirinden farklıdır. Backup bir kopya üretir. Disaster Recovery iş yükünü başka bir ortamda yeniden çalıştırma kabiliyetidir. Cyber Recovery ise saldırıya karşı izole, immutable veya kontrollü recovery alanı gerektirebilir.

Bir diğer kritik katman interconnection'dır. Cross-connect, Internet Exchange, IP Transit, Cloud Connect ve Data Center Interconnect servisleri özellikle carrier-neutral veri merkezlerinde stratejik değer yaratır. Büyük bir colocation tesisinin yalnız kabinet satması ve interconnection ekosistemini zayıf bırakması önemli bir ticari fırsatı kaybetmek anlamına gelir.

Buradan yatırımcı açısından temel sonuca gelelim.

Hizmet modeli belirlenmeden fiziksel mimari dondurulmamalıdır. Retail colocation istiyorsanız tenant isolation, metering, cage yapısı ve MMR önem kazanır. Private cloud istiyorsanız standardizasyon, HCI veya virtualization platformu, backup ve automation önem kazanır. AI cloud istiyorsanız rack density, liquid cooling, fabric network ve parallel storage tasarımı değişir.

Bu nedenle doğru sıra şudur: önce müşteri ve hizmet modeli; sonra SLA ve sorumluluk sınırı; ardından workload karakteri; en son facility ve IT mimarisi.

Bir veri merkezinin gerçek ürünü metrekare değildir. Gerçek ürün; güvenilir kapasitenin, doğru sorumluluk modeliyle müşteriye dönüştürülmesidir.

---

## [DC-K02] Veri Merkezi Tipleri ve Modülerlik

Veri merkezi projelerinde sık duyduğumuz iki kelime var: geleneksel ve modüler. Bunlar çoğu zaman iki rakip teknoloji gibi anlatılıyor. Oysa esas fark, altyapının nasıl üretildiği, test edildiği ve sahaya nasıl entegre edildiğidir.

Geleneksel veya stick-built veri merkezinde bina, elektrik ve mekanik sistemlerin büyük bölümü proje bazında sahada inşa edilir. Bu yaklaşım özellikle büyük, karmaşık ve araziye özel kampüslerde yüksek tasarım özgürlüğü sağlar. Irregular building geometry, özel utility bağlantıları, farklı katlar veya karmaşık mechanical plant düzenleri söz konusuysa geleneksel model çok güçlü olabilir.

Ancak bunun bedeli daha uzun saha programı, daha fazla subcontractor interface ve daha yüksek saha kalite değişkenliği olabilir.

Prefabricated veya modular yaklaşımda ise power room, cooling skid, IT module veya bazen bütün data hall fabrikada daha yüksek standardizasyonla üretilir ve test edilir. Schneider Electric bu değişimi customized construction yaklaşımından standardized site integration yaklaşımına geçiş olarak tarif ediyor.

Burada önemli bir yanlış anlamayı düzeltelim. Modular veri merkezi demek container demek değildir. Containerized data center, modular yaklaşımın yalnızca bir alt türüdür.

Modülerliği dört seviyede düşünebiliriz.

Birinci seviyede component modularity vardır. Örneğin modular UPS power modules veya modular chillers.

İkinci seviyede subsystem modularity vardır. Prefabricated power room, pump skid veya CDU skid gibi.

Üçüncü seviyede IT space modularity vardır. Prefabricated data hall, modular row veya micro data center.

Dördüncü seviyede ise power, cooling, rack, monitoring ve fire protection gibi sistemlerin büyük bölümünü birlikte taşıyan full-facility modular yaklaşım bulunur.

Bu nedenle hybrid mimari çok yaygındır. Bina geleneksel olabilir, power rooms prefabricated olabilir, standard white-space geleneksel olabilir ve AI zone için modular liquid-cooling pod eklenebilir.

Peki modular yaklaşım neden tercih edilir?

Birincisi, zaman. Fabrikadaki üretim devam ederken sahada civil works paralel ilerleyebilir.

İkincisi, repeatability. Aynı modül ailesi tekrarlandığında wiring, controls, piping ve test prosedürleri daha öngörülebilir hale gelir.

Üçüncüsü, phased CAPEX. Kapasite ihtiyaç geldikçe bloklar halinde eklenebilir. Bu, başlangıçta gereksiz kapasite kurup yıllarca kullanmama riskini azaltabilir.

Dördüncüsü, edge ve uzak lokasyonlardır. Küçük ekiplerle işletilecek sahalarda önceden entegre edilmiş micro data center veya smart cabinet ciddi avantaj sağlayabilir.

Ama modular yaklaşımın riskleri de vardır.

En kritik risk interface riskidir. Fabrikadan çıkan modül çok iyi olabilir; ancak utility, site cooling loop, BMS, fire system veya structural anchoring bağlantısı yanlış tasarlanırsa bütün sistem başarısız olur.

İkinci risk lojistiktir. Modülün ağırlığı, karayolu taşımacılığı, köprü limitleri, crane erişimi ve site entrance geometry projenin başında değerlendirilmelidir.

Üçüncü risk vendor lock-in'dir. Module geometry, control system veya özel connector'lar future expansion'ı tek üreticiye bağımlı hale getirebilir.

Bir başka önemli konu Tier'dır. Modular sistem Tier hedefiyle çelişmez. Uptime Institute'un yaklaşımı technology-neutral ve performance-based'dir. Ancak Tier-Ready bir modül, bütün sahanın otomatik olarak Tier Certified olduğu anlamına gelmez. Site integration, distribution paths, operations ve commissioning hâlâ proje seviyesinde değerlendirilir.

Smart cabinet ve micro data center da doğru yerde çok değerlidir. Birkaç rack'lik hospital edge, branch, industrial site veya regional edge deployment için rack, UPS, cooling, monitoring ve security'nin entegre olduğu sistemler hızlı ve kontrollü çözüm olabilir.

Ancak aynı yaklaşımı yüzlerce kabinetlik colocation kampüsüne mekanik olarak büyütmek doğru olmayabilir.

Sonuç olarak, modüler mi geleneksel mi sorusunun tek doğru cevabı yoktur. Eğer deployment süresi kritik, büyüme fazlı ve tasarım tekrarlanabilir ise modular yaklaşım güçlüdür. Eğer site çok özel, kapasite çok büyük ve mimari yüksek derecede customized ise geleneksel veya hybrid yaklaşım daha uygun olabilir.

Doğru soru teknoloji adı değil, teslimat modelinin yatırım hedefiyle uyumudur.

---

## [DC-K03] Rack ve Cabinet Engineering

Bir veri merkezine girdiğinizde gözünüz ilk olarak kabinetlere gider. Bu nedenle rack çoğu zaman sistemin en basit parçası sanılır. Aslında rack, elektrik, mekanik, network ve operasyon tasarımının fiziksel olarak kesiştiği noktadır.

Rack seçiminde ilk konuşulan sayı genellikle 42U veya 48U olur. Ancak yalnız U kapasitesine bakmak büyük bir hatadır. Rack boş U kalmasına rağmen power capacity, cooling capacity veya cable capacity dolmuş olabilir.

Önce rack ve cabinet farkını ayıralım. Open rack yalnız mounting frame olabilir. Cabinet ise doors, side panels, locking ve airflow management gibi özelliklerle enclosed yapı oluşturur. Smart cabinet ise rack'in yanında UPS, PDU, cooling, monitoring veya access control gibi supporting systems'i de entegre edebilir.

Modern enterprise sistemlerinin büyük bölümü 19-inch mounting standardını kullanır. Fakat Open Compute Project'in Open Rack yaklaşımı farklıdır. OCP rack'i yalnız metal çerçeve olarak değil, rack-level power ve cooling infrastructure'ın parçası olarak ele alır. Open Rack V3 gibi sistemlerde vertical busbar ve power shelf yaklaşımı görülebilir.

Rack width ve depth neden önemlidir? Çünkü modern server'lar giderek derinleşiyor. GPU chassis, storage nodes, rear cabling ve büyük power connector'ları arka tarafta ciddi alan ister. Rack yeterince derin değilse kapı kapanabilir ama cable bend radius veya service access bozulabilir.

Ağırlık da kritik hale geliyor. Traditional enterprise rack ile yüksek yoğunluklu AI rack arasında ciddi fark vardır. GPU server'lar, büyük PSU population, rear-door heat exchanger, manifold ve sıvı hatları toplam rack ağırlığını artırır. Bu nedenle floor load ve point load structural engineering ile birlikte kontrol edilmelidir.

Power tarafına bakalım.

Geleneksel rack'te facility distribution iki ayrı rack PDU'ya, A ve B olarak gelir. Server'ın iki PSU'su varsa her biri farklı PDU'ya bağlanır. Fakat burada bir yanılsama olabilir. İki PDU'nun ikisi de aynı upstream UPS veya aynı panelden besleniyorsa gerçek dual path yoktur.

Bu nedenle rack seviyesinde gördüğümüz redundancy'nin upstream topology ile doğrulanması gerekir.

OCP gibi mimarilerde rack-level DC busbar ve power shelf kullanılabilir. Bu yaklaşım power cord sayısını azaltabilir ve hyperscale standardizasyonu sağlayabilir. Ancak traditional enterprise ecosystem için otomatik doğru çözüm değildir.

Airflow rack'in başka bir kritik boyutudur. Front-to-back airflow kullanan server'larda cold aisle önden besler, sıcak hava arkadan çıkar. Boş U alanlarına blanking panel koymazsanız sıcak hava rack içinde tekrar öne dönebilir. Rear cable bundle çok yoğun ise exhaust airflow'u kısıtlayabilir.

Yani cable management yalnız düzen değildir; thermal design'ın bir parçasıdır.

Liquid cooling geldiğinde rack daha da karmaşıklaşır. Manifold mounting, quick disconnect, hose routing, leak detection, CDU interface ve service access birlikte tasarlanmalıdır. Rear-door heat exchanger kullanılıyorsa kapı artık yalnız metal panel değildir; ağır bir heat exchanger'dır ve structural/service impact yaratır.

Burada practical bir yoğunluk yaklaşımı kullanabiliriz. Beş ile on kilowatt arası standard enterprise rack, çoğu air-cooled sistemde rahat yönetilebilir. Yirmi ile kırk kilowatt bandında airflow engineering daha kritik hale gelir. Kırk ile seksen kilowatt arası liquid-assisted tasarım güçlü aday olur. Seksen kilowatt ve üzeri AI/HPC rack'lerde purpose-built liquid cooling çoğu projede ana tasarım yolu haline gelebilir.

Bu değerler standard değildir; karar bandıdır. Her zaman gerçek IT equipment requirement doğrulanmalıdır.

Colocation için rack standardı ayrıca ticari konudur. Müşteri kendi cabinet'ini getiriyorsa width, depth, weight, power connector, locking ve cable entry kuralları sözleşmede tanımlanmalıdır. Aksi halde her müşteri farklı fiziksel standard getirir ve operasyon karmaşıklaşır.

Sonuç şu: rack seçimi katalogdan kabinet seçmek değildir. Rack, chip'ten power path'e, airflow'dan network cabling'e ve servis prosedürüne kadar bütün sistemin fiziksel entegrasyon noktasıdır.

---

## [DC-K04] Data Center Power Architecture

Bir veri merkezinde elektrik sistemini anlamak için tek bir UPS'e bakmak yeterli değildir. Asıl konu, enerjinin şebekeden sunucunun güç kaynağına kadar hangi yollardan geçtiği ve bu yollardan biri kaybolduğunda ne olduğudur.

Tipik zincir utility ile başlar. Ardından medium-voltage switchgear, transformer, low-voltage switchgear, UPS, downstream power distribution, rack PDU ve en sonunda server PSU gelir.

Generator ve battery sistemi, utility kaybında bu zincirin sürekliliğini destekler.

Burada ilk önemli kavram UPS'tir. Data center dünyasında online double-conversion UPS çok yaygındır. Enerji önce AC'den DC'ye, sonra tekrar kontrollü AC'ye çevrilir ve kritik yük sürekli inverter üzerinden beslenir. Utility kaybolduğunda inverter zaten aktif olduğu için transition gap oluşmaz.

Bazı UPS'lerde yüksek verim için ECO veya benzeri modlar bulunur. Bu modlarda load normal şartlarda bypass path üzerinden beslenebilir. Verim artar; ancak critical load'un mains condition'a exposure'ı ve transfer behavior'ı ayrıca değerlendirilmelidir. Bu nedenle yalnız yüksek efficiency yüzdesine bakarak mode seçilmez.

Şimdi N, N+1 ve 2N kavramlarını ayıralım.

N, ihtiyacımız olan minimum kapasitedir. N+1, gerekli kapasiteye bir yedek component ekler. Ancak yalnız UPS module seviyesinde N+1 olmak, bütün distribution path'in redundant olduğu anlamına gelmez.

2N ise iki ayrı tam kapasite path demektir. Fakat iki path aynı transformer, aynı bypass veya aynı room'u paylaşıyorsa common-mode failure oluşabilir.

Bu yüzden gerçek mühendislik sorusu şudur: Hangi bileşen ortak ve o ortak bileşen kaybolursa ne kadar IT etkilenir?

Rack seviyesindeki A/B feed bu konunun en görünür örneğidir. Server'ın PSU A'sı Rack PDU A'ya, PSU B'si Rack PDU B'ye bağlanır. İdeal durumda upstream distribution da bağımsızdır. A ve B yalnız etiket değil, failure domain tanımıdır.

Generator tasarımında da yalnız kVA değeri yeterli değildir. Starting sequence, step-load capability, fuel autonomy, paralleling controls, maintenance isolation ve black-start davranışı birlikte incelenmelidir.

Battery teknolojisinde VRLA, lithium-ion, flywheel ve daha büyük BESS sistemleri farklı roller oynar. Lithium-ion daha yüksek energy density ve cycle-life avantajı sunabilir; ancak thermal runaway, BMS ve fire strategy kritik hale gelir.

Downstream distribution'da traditional PDU/RPP veya busway kullanılabilir. PDU/RPP fixed layout için olgun bir çözümdür. Busway ise overhead trunk ve tap-off units sayesinde dynamic colocation veya sık capacity değişimi olan hall'larda çok esnek olabilir.

Ancak busway de otomatik olarak daha iyi değildir. Short-circuit protection, breaker coordination, tap-off safety ve vendor compatibility doğru tasarlanmalıdır.

High-density AI altyapısı power design'ı yeniden zorluyor. Geleneksel yedi kilowatt rack ile yüz kilowatt AI rack aynı distribution granularity ile tasarlanamaz. Rack circuit current, busway rating, UPS block size ve transformer topology değişebilir.

Burada en önemli kavramlardan biri selective coordination'dır. Bir rack branch'inde fault olduğunda yalnız o branch'in açılmasını isteriz. Eğer upstream main breaker trip ederse küçük bir fault büyük outage'a dönüşür.

Bu nedenle short-circuit study, protection coordination ve settings management power architecture'ın ayrılmaz parçasıdır.

Son olarak redundancy ile maintainability'yi ayıralım. Redundancy, bir component fail olduğunda spare capacity olmasıdır. Concurrent maintainability ise planlı bakım sırasında bir component veya distribution path service dışına alındığında IT operasyonunun devam edebilmesidir.

Bu ayrım, neden 'N+1 UPS aldık, dolayısıyla Tier III olduk' cümlesinin teknik olarak yanlış olduğunu açıklar.

Power architecture bir cihaz listesi değildir. Doğru tasarım, utility'den rack'e kadar bütün zinciri failure domain'ler halinde görüp yatırımın ihtiyacı kadar resilience sağlamaktır.

---

## [DC-K05] Cooling Architecture

Veri merkezinde soğutmayı anlamanın en doğru yolu klimalardan başlamak değil, chip'ten başlamaktır.

Bir işlemci veya GPU elektrik tükettiğinde bu enerjinin büyük bölümü ısıya dönüşür. O ısının chip'ten alınması, rack'ten çıkarılması ve sonunda dış çevreye atılması gerekir.

Bu nedenle cooling bir zincirdir: chip, heat sink veya cold plate, air veya liquid, room ya da rack heat exchanger, facility loop ve son olarak chiller, dry cooler, condenser veya başka bir heat rejection sistemi.

ASHRAE'nin data center thermal çalışmalarında temel referanslardan biri IT equipment inlet condition'dır. Yani odanın ortasında ölçülen sıcaklık tek başına yeterli değildir. Server'ın gerçekten içine çektiği havanın sıcaklık ve nem koşulları önemlidir.

Geleneksel air cooling'de cold aisle ve hot aisle düzeni kullanılır. Rack'lerin ön yüzleri birbirine bakar ve cold aisle oluşur. Arka yüzleri hot aisle oluşturur. Eğer sıcak ve soğuk hava karışırsa cooling capacity var olduğu halde server inlet temperature yükselir.

Containment bu mixing'i azaltır. Cold aisle containment soğuk alanı, hot aisle containment ise sıcak exhaust alanını izole eder.

CRAC ve CRAH terimleri de sık karıştırılır. CRAC genellikle direct-expansion, yani refrigerant-based cooling ile ilişkilidir. CRAH ise çoğunlukla chilled-water coil kullanır. Fakat isimden çok asıl loop architecture önemlidir.

DX sistemler küçük ve orta uygulamalarda daha local ve basit olabilir. Chilled-water plant ise büyük kampüslerde central optimization ve scale avantajı sağlayabilir; ancak pump, valve, common header ve plant controls nedeniyle daha karmaşık failure domains oluşturabilir.

In-row cooling, cooling unit'i heat source'a daha yakın getirir. Böylece airflow path kısalır ve daha yüksek rack density desteklenebilir.

Rear-door heat exchanger başka bir ara çözümdür. Server hâlâ air-cooled çalışır, ancak arka kapıdaki liquid heat exchanger sıcak exhaust havadan ısıyı alır. Retrofit açısından güçlü olabilir.

Şimdi direct-to-chip liquid cooling'e gelelim.

Cold plate doğrudan CPU veya GPU gibi yüksek heat flux üreten component'in üzerine yerleştirilir. Liquid, ısıyı havaya göre çok daha yüksek heat capacity ile taşır. Bu nedenle yüksek yoğunluklu AI rack'lerde güçlü bir çözüm haline gelir.

Fakat önemli bir ayrıntı var: her direct-to-chip server bütün ısıyı sıvıya vermeyebilir. PSU, NIC veya diğer komponentler hâlâ air cooling gerektirebilir. Bu yüzden birçok deployment hybrid liquid-plus-air olur.

CDU, yani Coolant Distribution Unit, facility loop ile technology cooling loop arasında önemli sınırdır. Heat exchanger, pump, filtration, pressure ve temperature control sağlar. CDU rack içinde, row sonunda veya perimeter'da olabilir.

Neden facility water'ı doğrudan server loop'una bağlamıyoruz? Çünkü water quality, pressure, material compatibility, contamination ve warranty sınırlarını kontrol etmek isteriz. Facility Water System ile Technology Cooling System'in ayrılması bu nedenle güçlü bir mühendislik yaklaşımıdır.

Rack içinde manifold, coolant'ı server'lara dağıtır. Quick disconnect'ler servis sırasında hose bağlantısını yönetir. Burada flow capacity, pressure drop, leak performance ve service access gelecekteki rack density ile birlikte seçilmelidir.

Immersion cooling ise farklı bir dünyadır. Server dielectric fluid içine yerleştirilir. Single-phase veya two-phase sistemler olabilir. Çok yüksek density kapasitesi sunabilir, ancak service procedures, fluid compatibility, warranty ve operasyon modelini değiştirir.

Hangi yoğunlukta hangi teknoloji kullanılmalı? Evrensel tek eşik yoktur. Practical olarak on kilowatt altı rack'lerde iyi tasarlanmış air cooling çoğu zaman yeterlidir. Yirmi ile kırk kilowatt bandında in-row veya rear-door gibi çözümler daha güçlü hale gelir. Kırk ile seksen kilowatt bandında liquid-assisted design ciddi adaydır. Seksen kilowatt ve üzerindeki modern AI rack'lerde purpose-built liquid cooling çoğunlukla ana tasarım yoluna dönüşür.

Bu bandlar standard değil, karar rehberidir.

Son olarak PUE'ye bakalım. Düşük PUE önemlidir, ancak tek metrik değildir. Water use, climate, equipment reliability, capacity utilization ve operational risk birlikte değerlendirilmelidir.

Soğutma mimarisi mekanik ekipman listesinden başlamamalıdır. Workload ve rack density'den başlamalı; chip'ten dış çevreye kadar bütün heat path tasarlanmalıdır.