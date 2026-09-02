# DC-K03 — Rack & Cabinet Engineering — Full Narration TR V2

Bu metin DC-K03 Golden Deep Research için uzun-form S3F seslendirme kaynağıdır. Quick Brief ayrı ve korunmuş bir moddur. Full Briefing sekiz chapter üzerinden rack/cabinet engineering karar zincirini anlatır.

---

## [K03-00] Rack neden artık metal bir kutu değildir?

Bir veri merkezi tasarımında rack çoğu zaman listenin en sıradan kalemi gibi görünür. Kabinet sayısı belirlenir, kırk iki U veya kırk sekiz U seçilir, genişlik ve derinlik yazılır, ardından asıl mühendisliğin server, network, UPS ve cooling tarafında olduğu varsayılır. Modern veri merkezinde bu yaklaşım artık yeterli değildir. Rack, farklı mühendislik disiplinlerinin aynı fiziksel noktada birleştiği bir entegrasyon platformudur. Mekanik taşıma, elektrik dağıtımı, hava akışı, sıvı dağıtımı, kablolama, bonding, izleme, fiziksel erişim ve bakım süreçleri aynı rack envelope içinde birbirine bağlanır.

Bu nedenle ilk önemli ayrım şudur: rack capacity yalnız U kapasitesi değildir. Bir kabinetin içinde on U boş yer kalmış olabilir ama elektrik kapasitesi dolmuş olabilir. Rack PDU akım limiti dolmuş olabilir. Soğutma kapasitesi dolmuş olabilir. Fiber veya DAC kabloları servis alanını tüketmiş olabilir. Kabinetin toplam ağırlığı yapısal sınırı aşmış olabilir. Server rayını tamamen dışarı çekmek için gereken arka servis mesafesi kalmamış olabilir. Yani fiziksel olarak boş görünen bir rack mühendislik açısından dolu olabilir.

Doğru karar zinciri workload ile başlar. Hangi ekipman yerleşecek, hangi form faktörü kullanılacak, güç zarfı nedir, soğutma yöntemi nedir, toplam yüklü ağırlık ne olacaktır, kablolama yoğunluğu nasıl olacaktır ve ekipman nasıl servis edilecektir? Bu soruların cevabı rack mimarisini belirler. Rack seçilip ekipman ona uydurulmamalıdır; rack standardı doğrulanmış equipment ve facility interface gereksinimlerinden türetilmelidir.

Burada rack, cabinet ve integrated enclosure kavramlarını da ayırmak gerekir. Open rack temel olarak ekipmanı taşıyan mekanik frame'dir; kapak veya yan panel zorunlu değildir. Cabinet, bu frame'e kapak, yan panel, kilit, airflow control ve accessory alanları ekler. Smart cabinet veya integrated enclosure ise rack ile birlikte UPS, PDU, monitoring, access control ve bazen close-coupled cooling gibi supporting infrastructure'ı tek paket içinde sunabilir. Rack-scale appliance ise compute, interconnect, power shelf, busbar ve cooling manifold gibi unsurların tek sistem mimarisi olarak tanımlandığı daha bütünleşik bir sınıftır.

Modern rack engineering aynı zamanda üç farklı ekosistemi birlikte anlamayı gerektirir. Geleneksel enterprise ve colocation dünyasında on dokuz inch mounting ecosystem çok güçlüdür. Open Compute tarafında Open Rack V3, OpenU, rack seviyesinde DC busbar ve liquid interface yaklaşımıyla farklı bir standardizasyon dünyası oluşturur. Daha yeni wide-rack yaklaşımları ise AI sistemlerinde güç, sıvı debisi, kablolama ve serviceability ihtiyacının rack footprint'ini dahi değiştirebildiğini gösterir.

Buradaki amaç her projeye en yeni rack'i koymak değildir. Amaç, hangi rack ecosystem'inin hangi workload ve facility şartlarında doğru olduğunu bilmektir. Enterprise virtualization cluster için geniş bir AI rack gereksiz olabilir. Buna karşılık yüz kilowatt sınıfına yaklaşan rack-scale AI sistemi için standart bir kabinet seçip sonradan güç, sıvı ve kablo eklemeye çalışmak ciddi entegrasyon riski yaratabilir.

Bu bölümün ana fikri basittir: rack satın alınan bir aksesuar değil, proje boyunca yönetilen bir interface contract'tır. Mekanik, elektrik, termal, kablolama ve operasyon disiplinleri rack standardında ortaklaşa buluşmalıdır. Bu bakış açısı kurulmadan sağlıklı cabinet selection yapılamaz.

---

## [K03-01] On dokuz inch, OpenU, ORv3, MGX ve ORW nasıl ayrılır?

Rack dünyasında en sık yapılan hatalardan biri, on dokuz inch ifadesini kabinetin dış ölçüsü sanmaktır. On dokuz inch esas olarak equipment mounting interface ecosystem'ini tarif eder. Bir kabinetin dış genişliği altı yüz milimetre, sekiz yüz milimetre veya daha geniş olabilir ve yine on dokuz inch equipment rail kullanabilir. Aynı şekilde kabinetin derinliği, toplam yük kapasitesi, kapak yapısı veya cooling capability'si yalnız mounting pitch bilgisinden anlaşılamaz.

Traditional rack unit, yani U, ekipman yüksekliğini ifade eden temel birimdir. Ancak U kapasitesi rack mühendisliğinin yalnız bir boyutudur. Kırk sekiz U bir rack'in bütün U pozisyonlarını doldurmak çoğu zaman mümkün değildir; power shelf, network switch, cable manager, blanking, manifold, service clearance veya ağırlık sınırı önce devreye girebilir. Bu nedenle boş U sayısı ile gerçek kapasite aynı şey değildir.

Enterprise ve colocation dünyasında on dokuz inch ekosistemin en büyük avantajı geniş ekipman uyumluluğudur. Server, storage, network, security appliance, KVM ve farklı üreticilerin aksesuarları aynı mounting standardı içinde çalışabilir. Altı yüz milimetre sınıfı kabinetler daha kompakt olabilir; sekiz yüz milimetre sınıfı ise side cable management, yüksek yoğunluklu rack PDU ve fiber yönetimi için daha fazla alan sağlayabilir. Derinlik tarafında modern server, GPU chassis, rear connector ve cable bend radius nedeniyle bin iki yüz milimetre sınıfı kabinler birçok deployment'ta daha esnek olabilir. Ancak hiçbir katalog ölçüsü proje doğrulamasının yerine geçmez.

Open Compute Open Rack V3 farklı bir yaklaşım getirir. OpenU yüksekliği traditional U'dan farklıdır ve rack ecosystem'i yirmi bir inch sınıfı equipment space, rack seviyesinde kırk sekiz volt sınıfı DC busbar, power shelf ve liquid manifold gibi interface'leri birlikte ele alır. ORv3'ü yalnız daha geniş bir kabinet olarak görmek yanlıştır. Mekanik, elektrik ve servis modeli birlikte değişir.

MGX yaklaşımı özellikle öğreticidir çünkü iki dünyanın tamamen ayrı olmadığını gösterir. MGX rack-scale AI tasarımlarında on dokuz inch pitch kullanılabilirken, ORv3'ten türeyen busbar, manifold, rear extension ve rack-scale interconnect anlayışı birlikte uygulanabilir. Bu bize form factor isimlerinden çok interface setine bakmamız gerektiğini gösterir. Bir rack'in rail pitch'i conventional olabilir ama power ve liquid architecture'ı klasik enterprise kabinetten tamamen farklı olabilir.

Open Rack Wide ise rack footprint'inin yeni AI gereksinimleriyle büyüyebileceğini gösteren daha güncel bir sınıftır. Wide rack yaklaşımında daha geniş servis alanı, yüksek güçlü busbar seçenekleri, liquid distribution ve yoğun interconnect yapıları için yeni fiziksel envelope hedeflenir. Buradaki önemli nokta, wide rack'i her AI sistemi için zorunlu kabul etmemektir. Bu bir ecosystem ve facility-layout kararıdır. Aisle pitch, floor loading, overhead distribution, fire clearance, lifting path ve future replacement strategy birlikte değerlendirilmelidir.

Proje tarafında doğru sınıflandırma beş eksende yapılabilir. Birinci eksen mechanical equipment interface'tir: on dokuz inch, OpenU, MGX-adapted veya wide rack. İkinci eksen enclosure formudur: open frame, enclosed cabinet, secure colo cabinet veya rack-scale appliance. Üçüncü eksen power delivery'dir: A/B AC rack PDU, yüksek akımlı üç fazlı PDU veya DC busbar. Dördüncü eksen thermal interface'tir: air, rear-door heat exchanger, direct-to-chip veya rack manifold. Beşinci eksen operating model'dir: enterprise, colo, hyperscale, HPC, AI factory veya edge.

Bu beş eksen aynı anda okunmadan yalnız rack modeli seçmek teknik olarak eksik kalır. Golden kural şudur: form factor etiketi değil, bütün interface contract belirleyicidir.

---

## [K03-02] Derinlik, ağırlık, floor load ve serviceability neden birlikte hesaplanır?

Kabinet mühendisliğinde mekanik boyutlandırma sadece dış ölçüleri yazmak değildir. Rack'in gerçek kullanım envelope'u, ekipmanın fiziksel ölçüsü ile servis ve altyapı alanlarının toplamından oluşur. En uzun server chassis derinliği, rail çıkıntısı, güç konnektörleri, network transceiver ve kablolar, fiber bend radius, rack PDU gövdesi, cable manager, rear-door heat exchanger veya liquid manifold gibi unsurlar arka hacmi birlikte tüketir.

Bu nedenle derinlik hesabı basitçe server datasheet'inde yazan uzunluk değildir. Ekipmanın tam servis pozisyonunda nasıl çıkarılacağı da düşünülmelidir. Bir server ray üzerinde tamamen dışarı çekildiğinde aisle içinde ne kadar alan gerekir? Arka kapı açıkken komşu rack'e veya containment kapısına çarpar mı? Ağır GPU tray için lifting tool yaklaşabilir mi? Overhead busway, cable tray veya liquid piping servis hareketini engeller mi? Bu sorular proje çiziminde çözülmezse ilk büyük bakım sırasında ortaya çıkar.

Ağırlık tarafında da tek bir load rating yoktur. Static load, rack yerinde sabit dururken taşıdığı yüktür. Dynamic veya rolling load, rack hareket ettirilirken ortaya çıkan şartları ifade eder. Shipping load, paketlenmiş ve yüklü rack'in taşıma koşullarını içerir. Seismic performance ise farklı bir test ve yapısal davranış konusudur. Bir rack'in yüksek static load değeri olması, aynı yükle güvenli biçimde taşınabileceği veya deprem performansının yeterli olduğu anlamına gelmez.

AI rack'lerde bu ayrım daha kritik hale gelir. Compute trays, büyük power shelves, busbar, liquid manifold, coolant, cable cartridge, rear-door ekipmanı ve bazen rack CDU toplam kütleyi ciddi biçimde artırabilir. Fully loaded rack weight hesabında boş kabinet ağırlığına yalnız IT equipment eklemek yeterli değildir; sıvı, kablo, power hardware ve aksesuarlar da dahil edilmelidir. Floor engineering tarafında ise yalnız kilogram cinsinden toplam ağırlık değil, contact area, point load, rolling path ve anchoring detayları önemlidir.

Raised floor kullanılan projelerde concentrated load ve rolling load sınırları özellikle doğrulanmalıdır. Slab-on-grade projede bile rack ayakları, plinth, anchor noktaları ve hareket güzergahı yapı mühendisi tarafından değerlendirilmelidir. Ağır rack'in data hall içine nasıl taşınacağı ayrı bir lojistik gate'tir. Kapı genişliği, freight elevator capacity, turning radius, ramp slope ve floor transitions gerçek deployment'ın bir parçasıdır.

Serviceability bu mekanik hesabın merkezinde yer almalıdır. Rack içine ekipman sığması yeterli değildir; ekipmanın güvenli, hızlı ve öngörülebilir biçimde servis edilebilmesi gerekir. Ön ve arka erişim alanı, PDU'ya erişim, manifold isolation, quick disconnect pozisyonu, door removal, cable slack ve ağır ekipman lifting prosedürü tasarım sırasında doğrulanmalıdır. Colocation ortamında customer access ile operator access sınırı da bu fiziksel düzeni etkiler.

Seismic gereksinim olan bölgelerde kabinet ve rack standardının ilgili test classification'ı ve anchoring yaklaşımı proje şartnamesinde belirtilmelidir. Vendor'ın yalnız “seismic ready” demesi yeterli kanıt değildir. Hangi test standardına, hangi yük konfigürasyonuna ve hangi anchoring şartına göre doğrulama yapıldığı görülmelidir.

Bu bölümün karar kuralı şudur: rack derinliği, yük kapasitesi ve servis mesafesi birbirinden ayrı üç katalog alanı değildir. Bunlar aynı mechanical operating envelope'un parçalarıdır. Project rack standardı, ekipman daha sipariş edilmeden bu envelope'u tanımlamalı; equipment acceptance da bu sınırları ihlal etmemelidir.

---

## [K03-03] Rack power architecture: A/B PDU'dan DC busbar'a

Rack seviyesinde power design, elektrik odasından başlayan failure domain'in son kritik bölümüdür. Conventional enterprise rack'te tipik zincir facility distribution'dan rack PDU'ya, rack PDU'dan server power supply'larına gider. Yüksek availability hedefinde A ve B yolları ayrı rack PDU'larla ekipmanın çift PSU girişlerine bağlanır. Ancak iki PDU görmek gerçek A/B resilience olduğunu kanıtlamaz.

En önemli kontrol upstream source tracing'dir. PDU-A ve PDU-B aynı panelden, aynı UPS'ten veya aynı upstream breaker grubundan besleniyorsa görünüşte iki feed vardır ama failure domain hâlâ ortaktır. Bu nedenle rack acceptance dokümanında her feed'in source path'i uçtan uca izlenmelidir. Rack etiketi değil, gerçekten bağımsız enerji yolu kanıtlanmalıdır.

Rack PDU selection da yalnız outlet sayısına göre yapılmamalıdır. Inlet voltage, phase, current rating, branch protection, outlet type, connector retention, metering granularity, switching policy ve communication interface birlikte değerlendirilir. Intelligent PDU'lar inlet, branch veya outlet seviyesinde ölçüm sağlayabilir. Colocation ortamında bu ölçümler capacity management ve billing için kritik hale gelebilir. Ancak sensor veya meter bulunması tek başına değer yaratmaz; verinin DCIM, BMS veya operasyon sistemi içinde nasıl kullanılacağı tanımlanmalıdır.

Yüksek yoğunlukta üç fazlı rack PDU, yüksek akım konnektörleri ve daha sıkı cable management ihtiyacı devreye girer. Rear zone içinde iki büyük PDU, onlarca power cord, data cable ve airflow aynı alanı paylaşır. Bu yüzden güç tasarımı mekanik ve termal tasarımdan ayrı ele alınamaz. PDU gövdesinin server exhaust'u kapatması veya service access'i engellemesi gerçek bir engineering failure'dır.

Rack-scale AI sistemlerinde power architecture daha farklı olabilir. Power shelves facility AC'yi nominal elli volt sınıfı DC'ye çevirir ve rack boyunca uzanan busbar üzerinden compute ve switch trays'e dağıtır. Bu yaklaşım conventional rack PDU modelinden farklı bir interface contract yaratır. Power shelf redundancy, busbar current capacity, contact resistance, monitoring, service isolation ve fault handling rack system tasarımının parçası olur.

Güncel NVL72 sınıfı sistemler burada önemli bir örnek sunar. Bazı platform dokümanlarında rack consumption yaklaşık yüz yirmi kilowatt seviyesinde tarif edilirken, daha yeni konfigürasyonlarda full rack gereksiniminin yüz kırk iki kilowatt'a kadar çıkabildiği belirtilir. Bu değerler bir endüstri standardı değildir; platform-specific design points'tir. Doğru ders, “AI rack yüz kırk iki kilowatt olur” değildir. Doğru ders, rack power envelope'unun artık yüz kilowatt ölçeğinde olabildiği ve conventional PDU alışkanlıklarının otomatik olarak yeterli sayılamayacağıdır.

Power architecture ayrıca future growth ile birlikte dondurulmalıdır. Bugün otuz kilowatt çalışan rack yarın altmış kilowatt'a çıkacaksa upstream busway tap-off, cable, breaker, connector ve cooling path buna göre planlanmalıdır. Buna karşılık her rack'i en yüksek olası güç için aşırı boyutlandırmak da stranded capacity ve maliyet yaratabilir. Bu yüzden rack standardı birkaç sınıf içerebilir: conventional enterprise, high-density air, liquid-ready AI ve rack-scale appliance gibi.

Golden kural şudur: rack'teki elektrik tasarımını sadece PDU datasheet'i değil, end-to-end failure domain ve lifecycle power envelope belirler. A/B etiketi değil kaynak bağımsızlığı; outlet sayısı değil gerçek akım ve servis kabiliyeti kabul kriteridir.

---

## [K03-04] Airflow, kapak ve kablo yönetimi termal tasarımın parçasıdır

Rack cooling konuşulduğunda çoğu ekip doğrudan CRAC, CRAH, chilled water veya liquid cooling tarafına geçer. Oysa rack içinde basit görünen airflow detayları bütün data hall thermal performance'ı etkiler. Server fanları havayı önden alıp arkaya atıyorsa rack, aisle ve containment tasarımı bu akışı desteklemelidir. Front-to-back airflow varsayımı her cihaz için kontrol edilmelidir; bazı network veya özel appliance'larda farklı yön bulunabilir.

Blanking panel küçük ama kritik bir parçadır. Boş U pozisyonları açık bırakılırsa hot aisle'dan sıcak hava rack içinden cold aisle tarafına geri dönebilir. Bu recirculation server inlet sıcaklığını yükseltir ve fan hızlarını artırabilir. Aynı şekilde floor opening, cable brush, side gap ve üst boşluklar da bypass hava yolu yaratabilir. Air management, yalnız büyük HVAC sistemlerinin değil rack geometry'nin de konusudur.

Kapak perforation oranı da tek başına yeterli bir performans metriği değildir. Yüksek open area genelde pressure drop'u azaltmaya yardımcı olabilir fakat gerçek airflow; perforation geometry, filter, cable obstruction, server fan curve ve containment pressure ile birlikte belirlenir. Üreticinin yüzde şeklinde verdiği değer bir product characteristic'tir; projenin cooling capacity garantisi değildir.

Rear cabling özellikle yüksek yoğunlukta termal riske dönüşebilir. Onlarca power cord, copper cable, fiber, DAC veya AOC aynı arka bölgede birikirse exhaust path daralır. Cable bundle sıcak havanın çıkışını engelleyebilir, server PSU servis alanını kapatabilir veya transceiver bend radius ihlaline yol açabilir. Bu nedenle cable management estetik bir konu değildir; airflow, signal integrity ve maintainability problemidir.

Rack-level cable zoning yapılması faydalıdır. Power A ve Power B fiziksel olarak ayırt edilebilir güzergahlarda tutulabilir. Management veya copper cabling ayrı zone'a alınabilir. Fiber ve yüksek hızlı interconnect için bend radius ve connector protection alanı tanımlanabilir. AI cluster'larda NVLink benzeri rack-scale interconnect cartridge veya çok sayıda high-speed fabric kablosu klasik rear cable manager kapasitesini aşabilir. Böyle durumlarda rack footprint ve service architecture yeniden düşünülmelidir.

Containment ile rack kapakları birlikte çalışır. Hot aisle containment kullanılıyorsa server exhaust'un containment volume'a kontrollü girmesi gerekir. Cold aisle containment'ta rack önü supply plenum'un parçası haline gelir. Bir rack'teki büyük açıklık, eksik blanking veya yanlış kapak bütün row pressure balance'ını etkileyebilir. Rack değişikliği bu yüzden yalnız IT ekibinin kararı olmamalıdır.

Liquid cooling geldikten sonra airflow önemini kaybetmez. Direct-to-chip sistemlerde GPU ve CPU heat'in önemli bölümü sıvıya taşınabilir fakat memory, storage, NIC, switch, PSU ve başka bileşenlerde residual air load kalabilir. Bu oran platforma göre değişir. “Liquid-cooled rack artık hava istemez” varsayımı tehlikelidir. Remaining air heat vendor thermal documentation ile hesaplanmalı ve room air system buna göre boyutlandırılmalıdır.

Rear-door heat exchanger ise farklı bir hibrit çözüm sunar. Server'lar conventional air flow ile çalışmaya devam eder; sıcak exhaust kapı üzerindeki heat exchanger tarafından sıvıya aktarılır. Böylece room heat load azaltılabilir. Ancak door ağırlığı, hinge, rack depth, hose routing ve serviceability yeni mekanik sınırlar oluşturur.

Bu bölümün ana sonucu şudur: airflow, kapak, blanking ve cable management supporting accessory değildir. Bunlar rack thermal architecture'ın doğrudan parçalarıdır. Rack acceptance sırasında inlet sıcaklığı, pressure behavior, cable obstruction ve service erişimi birlikte doğrulanmalıdır.

---

## [K03-05] Liquid-ready rack ne demektir?

Bir rack'e “liquid-ready” etiketi vermek kolaydır. Arka tarafta manifold koyacak yer bırakılır ve ürün geleceğe hazır ilan edilir. Gerçek liquid readiness bundan çok daha geniştir. Rack, coolant distribution, mechanical mounting, quick disconnect, leak detection, service access, electrical separation, residual air cooling ve CDU ya da TCS boundary'sini birlikte desteklemelidir.

Direct-to-chip mimaride facility tarafındaki soğutma sistemi ile IT ekipmanı arasında technology cooling loop bulunabilir. Yaygın yaklaşımda CDU, facility water loop ile technology cooling loop arasında heat exchange, pumping ve temperature control görevi görür. Bu separation her projede zorunlu tek çözüm değildir fakat default engineering assumption olarak doğrudan facility water'ı server cold plate'e bağlamaktan daha kontrollü bir interface sağlar. Water quality, corrosion, pressure, ownership ve warranty sınırları açık hale gelir.

Rack manifold supply ve return akışını IT gear'a dağıtır. Manifold design sadece boru çapı değildir. Flow distribution, pressure drop, maximum allowable working pressure, burst margin, wetted material compatibility, venting, draining ve service isolation birlikte düşünülür. Server loop spacing rack form factor ile uyumlu olmalıdır. Traditional U ile OpenU pitch farklı olduğu için manifold port düzeni de ecosystem'e göre değişebilir.

Quick disconnect seçimi servis güvenliği açısından kritiktir. Manual connect veya blind-mate yaklaşımı kullanılabilir. Blind-mate sistemler tray'i rack'e takarken liquid connection'ın kontrollü biçimde yapılmasını hedefler fakat alignment, floating mechanism, seal material ve pressure qualification gerektirir. Bir connector'ın mekanik olarak uyması fluid compatibility veya lifecycle reliability anlamına gelmez.

Leak detection yalnız floor'a bir sensor koymak değildir. Tray seviyesinde, manifold bölgesinde, rack altında ve CDU çevresinde farklı detection zones gerekebilir. Alarmın BMS veya management system'e nasıl gideceği, hangi seviyede automatic isolation yapılacağı ve leak durumunda shutdown sequence'in ne olacağı operasyon prosedüründe tanımlanmalıdır. False positive ile gerçek leak arasında doğru response tasarımı önemlidir.

RDHx ile direct-to-chip'i de ayırmak gerekir. Rear-door heat exchanger server exhaust air'daki ısıyı rack arkasında sıvıya aktarır. Existing air-cooled server retrofit'i için güçlü bir araç olabilir. Direct-to-chip ise heat'i component üzerindeki cold plate'ten alır ve daha doğrudan liquid path oluşturur. İki yöntem aynı rack'te hibrit şekilde de bulunabilir fakat plumbing, load ve controls karmaşıklığı artar.

Rack CDU, row CDU veya facility-level CDU seçeneklerinin her biri farklı servis ve capacity modeline sahiptir. Rack içinde CDU koymak lokalizasyon avantajı sağlayabilir ama rack space, weight, power ve service zone tüketir. Row CDU birden fazla rack'i besleyebilir ancak failure domain ve distribution hose planı önem kazanır. Facility CDU daha merkezi olabilir fakat longer distribution loop ve zoning tasarımı gerekir.

Condensation konusu da göz ardı edilmemelidir. Coolant supply sıcaklığı room dew point'in altına inebiliyorsa insulation ve condensation control gerekir. Warm-water direct-to-chip tasarımları bu riski azaltabilir fakat gerçek supply temperature platform gereksinimine göre doğrulanmalıdır.

Liquid-ready acceptance için tek cümlelik kural şudur: manifold mounting space tek başına yeterli değildir. CDU/TCS boundary, flow-pressure envelope, connector standardı, fluid compatibility, leak strategy, service isolation, residual-air path ve maintenance procedure tamamlanmadan rack liquid-ready kabul edilmemelidir.

---

## [K03-06] Rack-scale AI sistemi conventional cabinet'ten nasıl farklıdır?

AI altyapısındaki en büyük değişim yalnız GPU sayısının artması değildir. Compute, power, cooling ve interconnect tasarımı rack ölçeğinde tek sistem haline gelmektedir. Conventional enterprise rack'te server'lar bağımsız cihazlar gibi düşünülür; rack onları taşıyan ve besleyen altyapıdır. Rack-scale AI'da ise rack'in kendisi system architecture'ın parçasıdır.

NVL72 sınıfı güncel sistemler bu dönüşümü açık biçimde gösterir. Compute trays, NVLink switch trays, high-speed cable cartridge yapıları, power shelves, DC busbar ve liquid cooling manifolds aynı rack içinde birlikte tasarlanır. Bazı konfigürasyonlarda yaklaşık yüz yirmi kilowatt rack consumption, daha yeni platform referanslarında yüz kırk iki kilowatt'a kadar full-rack power requirement yayımlanmıştır. Bu rakamlar vendor platform örneğidir; tasarım bandı seçmek için gerçek equipment release doğrulanmalıdır.

Power shelf tarafında yüksek kapasiteli AC to DC conversion rack'in bir bileşenidir. Busbar üzerinden trays'e nominal elli volt sınıfı DC dağıtılır. Bu, conventional A/B rack PDU modelinden farklı failure ve service davranışı yaratır. Power shelf redundancy, busbar joint, connector temperature, current sharing ve maintenance sequence artık rack acceptance'ın parçasıdır.

Thermal tarafta direct-to-chip liquid cooling GPU ve CPU heat'inin büyük bölümünü alabilir. Ancak networking, storage, memory veya power conversion gibi bileşenlerde air cooling devam edebilir. Bu yüzden AI rack için hem liquid capacity hem residual air load tasarlanmalıdır. Rack'in toplam cooling demand'ını yalnız “liquid cooled” etiketiyle ifade etmek yeterli değildir; liquid heat fraction ve remaining air kW değerleri istenmelidir.

Mechanical tarafta loaded weight kritik hale gelir. Power shelves, busbar, manifold, coolant, compute trays ve dense cabling rack kütlesini artırır. Rack'in static rating'i kadar floor point load, transport path ve installation tooling de kontrol edilmelidir. Bir AI rack data hall'a sığıyor olabilir ama freight elevator'a sığmıyor veya rolling load sınırını aşıyor olabilir. Bu nedenle rack-scale procurement binaya girişten service procedure'a kadar bütün lifecycle'ı kapsar.

Kablolama da klasik modelden farklıdır. Rack içi yüksek hızlı interconnect'ler büyük cable volume ve hassas bend radius yaratabilir. Rear zone yalnız server power ve Ethernet kablolarından oluşmaz; cable cartridge veya dense fabric bağlantıları service envelope'u belirleyebilir. Rack width veya rear extender ihtiyacı bu nedenle sadece mekanik tercih değildir.

Open Rack V3, MGX ve daha yeni wide rack yaklaşımları bu yeni ihtiyaçlara farklı cevaplar verir. ORv3 rack-level power ve liquid interface standardizasyonuna odaklanır. MGX bazı AI rack tasarımlarında conventional pitch ile ORv3-derived infrastructure'ı birleştirir. Wide rack ise gelecekte güç, liquid distribution ve cabling ihtiyacının rack footprint'ini büyütebileceğini kabul eder.

Burada procurement dili değişmelidir. “Kabinet adedi ve U yüksekliği” yeterli BoQ tanımı değildir. Rack-scale AI için equipment manifest, power envelope, liquid flow and temperature requirements, fully loaded weight, leak detection, service tooling, firmware or rack management, interconnect layout ve facility interface document birlikte talep edilmelidir.

Golden karar şudur: AI rack satın almak cabinet almak değildir; rack-scale system acceptance yapmaktır. Facility, IT ve operations ekipleri aynı acceptance contract içinde çalışmadıkça yüksek yoğunluk avantajı deployment riskine dönüşebilir.

---

## [K03-07] Proje rack standardı nasıl seçilir ve freeze edilir?

Rack engineering'in son aşaması ürün karşılaştırması değil, proje standardını dondurmaktır. Bir veri merkezinde her müşteri veya her workload için tamamen farklı kabinet kullanmak operasyonu zorlaştırabilir. Buna karşılık tek bir conventional kabineti bütün AI, network, storage ve edge kullanımına zorlamak da teknik uyumsuzluk yaratabilir. Doğru yaklaşım sınırlı sayıda, açık kabul kriterleri olan rack class tanımlamaktır.

İlk adım equipment ecosystem'i belirlemektir. Conventional enterprise server ve network ağırlıklı ortamda on dokuz inch rack çoğu zaman doğal başlangıç noktasıdır. Dense cabling veya büyük PDU ihtiyacı varsa daha geniş cabinet seçilebilir. Colocation'da customer compatibility, physical security ve contractual dimension standardı önemlidir. OCP veya rack-scale AI deployment'ta ORv3, MGX veya wide rack gibi farklı interface setleri gerekebilir.

İkinci adım maximum equipment envelope'u doğrulamaktır. En derin chassis, connector, cable bend, rear accessory ve service extraction birlikte ölçülür. Üçüncü adım loaded weight ve structure gate'tir. Rack tare weight, IT equipment, power hardware, liquid, cables ve accessories toplamı floor, rolling path ve seismic requirement ile karşılaştırılır.

Dördüncü adım power architecture'dır. A/B AC rPDU mu kullanılacak, yüksek yoğunluklu üç faz mı, yoksa power shelf ve DC busbar mı? Failure domain upstream'e kadar izlenir. Beşinci adım cooling'dir. Air-only, RDHx, direct-to-chip veya hibrit model seçilir. Liquid varsa CDU location, manifold, quick disconnect, leak detection, fluid compatibility ve residual air capacity birlikte tanımlanır.

Altıncı adım cabling ve serviceability'dir. Power A/B, copper management, fiber, high-speed interconnect ve service slack için fiziksel zone ayrılır. Heavy tray removal, lift tool, door swing ve PDU/manifold access gerçek veya dijital mock-up ile doğrulanabilir. Yedinci adım operations'tır. Labeling, locking, monitoring, capacity alarms, maintenance isolation ve commissioning ölçümleri standardın parçası olur.

Failure-mode yaklaşımı burada çok değerlidir. Chassis depth'in yanlış olması kapının kapanmamasına; free U'nun free capacity sanılması power overload'a; A/B PDU'nun ortak source'tan beslenmesi gizli single point of failure'a; liquid-ready tanımının yalnız manifold alanına indirgenmesi eksik TCS tasarımına; ağır rack'in floor hesabından çıkarılması yapısal riske yol açabilir. Rack standardı bu hataları satın alma öncesinde engellemelidir.

Colocation için iki seviyeli standard çoğu zaman mantıklıdır. Birinci seviye conventional customer rack standardıdır; width, depth, height, weight, A/B feed, lock, cross-connect ve containment kurallarını tanımlar. İkinci seviye high-density veya AI acceptance standardıdır; rack kW, liquid demarcation, RDHx, manifold, CDU, leak detection, floor load ve commissioning gereksinimlerini ekler.

Project freeze sırasında yalnız model numarası yazmak yerine engineering envelope kaydedilmelidir. Mounting ecosystem, dış ölçüler, usable depth, static ve dynamic load, power class, connector family, cooling class, cable zones, bonding, monitoring, service clearance ve facility interface listesi version-controlled olmalıdır. Böylece vendor değişse bile mühendislik intent korunur.

Son karar kuralı şudur: rack standardı IT procurement tarafından tek başına seçilmez. Workload, facility power, cooling, structure, network ve operations birlikte onaylamadan freeze edilmez. Rack U kapasitesinin değil, bütün mechanical, electrical, thermal ve operational envelope'un kabul edildiği noktada Golden rack standardı oluşur.