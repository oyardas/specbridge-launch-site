# DC-K07 — Facility & Building Architecture — Full Narration TR V2

Bu metin DC-K07 Golden Deep Research için uzun-form S3F seslendirme kaynağıdır. Quick Brief ayrı bir mod olarak üretilecektir. Full Briefing sekiz chapter üzerinden veri merkezi binasını site, structure, functional zoning, physical path diversity, fire, water, security, logistics, AI readiness, retrofit ve commissioning perspektiflerinden ele alır.

---

## [K07-00] Veri merkezi binası neden sadece bir shell değildir?

Bir veri merkezi projesinde binaya yalnızca IT ve mekanik-elektrik ekipmanını içine koyduğumuz pasif bir kabuk gibi bakmak, tasarımın en tehlikeli basitleştirmelerinden biridir. Çünkü binanın geometrisi, yapısal sistemi, odaların birbirine göre konumu, kablo ve boru yolları, erişim kapıları, yangın ve su zonları, yükleme alanı ve gelecekteki genişleme sınırları doğrudan availability davranışını belirler. İki UPS görmek, iki bağımsız güç yolu olduğu anlamına gelmez. İki chiller veya iki pompa görmek de iki bağımsız cooling path bulunduğunu kanıtlamaz. Eğer bu sistemlerin kabloları aynı riser’dan, boruları aynı galeriden, kontrolleri aynı odadan veya ikisi de aynı flood level içinden geçiyorsa bina aslında redundancy’yi fiziksel olarak tekrar tek bir failure domain’e çevirmiş olabilir.

Bu yüzden Golden yaklaşım binayı ekipman seçiminden sonra ele almaz. Önce business requirement ve SLA anlaşılır; sonra site riskleri, project condition, building form ve functional zoning şekillenir. Ardından structure, envelope, fire ve water compartments, fiziksel A ve B dağıtım yolları, loading ve replacement path, white space, MMR, technical rooms, AI ve liquid readiness birlikte tasarlanır. Son aşamada da bunların failure state’lerde gerçekten nasıl davrandığı commissioning ile kanıtlanır.

Standartların yaklaşımı da bu bütünlüğü destekler. Modern veri merkezi building-construction standartları site seçimini, natural hazards ve komşuluk risklerini, building configuration’ı, access control’ü, physical intrusion protection’ı, fire protection’ı ve water damage protection’ı aynı çerçevede değerlendirir. Bunun anlamı şudur: availability yalnız UPS, generator veya cooling capacity hesabı değildir. Yapının kendisi de availability sisteminin fiziksel katmanıdır.

Örneğin data hall içinde iki ayrı elektrik dağıtım hattı tasarlanmış olabilir. Ancak iki hat aynı duvar penetrasyonundan geçiyor ve o noktada bir yangın veya su kaçağı yaşanıyorsa tek fiziksel olay iki hattı aynı anda etkileyebilir. Benzer biçimde iki MMR bulunabilir ama iki carrier bina dışından aynı duct bank’e giriyorsa dışarıdaki tek bir excavation olayı bütün network çeşitliliğini ortadan kaldırabilir. Ya da data hall floor load’u çok yüksek olabilir fakat loading dock veya freight elevator yeni AI rack’in ağırlığını taşıyamıyorsa kağıt üzerindeki yapısal kapasite operasyonel olarak kullanılamaz.

Bina ayrıca lifecycle davranışını belirler. Bir UPS veya chiller’a bakım yapılabilmesi, o cihazın ömrü sonunda binadan çıkarılıp yenisinin getirilebileceği anlamına gelmez. Major equipment replacement path baştan tasarlanmamışsa duvar sökmek, canlı hatları kapatmak veya iki redundancy path’i aynı anda riske atmak gerekebilir. Bu nedenle maintainability ile replaceability aynı kavram değildir.

AI ve high-density compute bu konuyu daha da kritik hale getirir. Yeni rack’ler daha ağırdır, daha yoğun güç dağıtımı ister, overhead service zone’u büyütür, liquid distribution ve leak management gerektirir ve çoğu zaman integrated rack veya CDU gibi büyük parçaların taşınmasını zorunlu kılar. Dolayısıyla AI-ready bina sadece “yüksek floor load” demek değildir. Structure, power, cooling, liquid routing, water containment, network, service clearance, loading ve future density birlikte düşünülmelidir.

DC-K07’nin ana tezi budur: veri merkezi binası bir architecture container değil, failure domains’i şekillendiren bir resilience system’dir. Golden tasarımın sorusu “hangi odaları koyalım?” değil, “hangi fiziksel olay hangi sistemi etkiler ve hedeflenen hizmet seviyesinde hangi bağımsız yol yaşamaya devam eder?” olmalıdır. Binayı bu seviyede okumaya başladığımızda architectural drawing, single-line diagram kadar kritik bir engineering artifact haline gelir.

---

## [K07-01] Site risk, building form ve functional zoning

Facility architecture’ın ilk kararı floor plan değildir. İlk karar, seçilen sahanın gerçekten veri merkezi için uygun olup olmadığıdır. Bir site ucuz arazi ve yüksek utility capacity sunabilir ama flood exposure, komşu endüstriyel tesis, wildfire veya smoke riski, erişim problemi, güvenlik setback’i, yetersiz drainage veya gelecekte genişleyecek alanın bulunmaması nedeniyle uzun vadede kötü bir data center site olabilir. Bu nedenle site risk assessment doğal çevre, adjacencies, utility corridors, emergency access, water availability, geotechnical condition, seismicity, wind ve security geometriyi birlikte ele almalıdır.

Flood risk özellikle binary bir kontrol değildir. “Flood zone içinde değil” demek tek başına yeterli değildir. Pluvial flooding, yoğun yağışta site drainage davranışı, river veya coastal event, groundwater, aşağı kotta bulunan electrical rooms, below-grade penetrations ve sewer backflow gibi farklı mekanizmalar vardır. Risk, olayın olasılığı kadar kaybedilecek hizmet seviyesi ve kritik ekipmanın konumu ile değerlendirilir. Bu yüzden düşük kotta boş alan bulduk diye switchgear, UPS veya network core’u bodruma yerleştirmek, proje özelinde çok ciddi common-mode risk üretebilir.

Site uygun bulunduğunda building form kararı gelir. Purpose-built single-storey bir yapı ağır ekipman lojistiği, direct load path ve overhead service zone açısından güçlü olabilir; fakat çok arazi tüketir ve large roof exposure yaratır. Multi-storey bina daha az arazi kullanabilir ve kentsel lokasyonlarda avantaj sağlayabilir; buna karşılık freight elevator, vertical riser, liquid distribution ve inter-floor drainage risklerini büyütür. Converted industrial building hızlı bir brownfield fırsatı sağlayabilir ama column grid, clear height, roof capacity, fire compartments ve loading path gibi inherited constraints tasarımı sınırlar. Prefabricated veya hybrid facility ise factory integration ve hızlı deployment sunabilir; ancak site civils, foundations, lifting, utility tie-ins ve commissioning ortadan kalkmaz.

Doğru building form seçildikten sonra functional zoning başlar. Golden program yalnız “server room, UPS room ve generator room” şeklinde birkaç kutudan oluşmaz. Secure perimeter, visitor reception, loading ve staging, quarantine ve unpack, white-space halls, MMR ve carrier rooms, electrical rooms, battery veya BESS zones, mechanical rooms, pump veya CDU zones, NOC, BMS, EPMS, workshop, spares, staff welfare ve future-expansion interfaces ayrı fonksiyonlar olarak düşünülmelidir.

Bu fonksiyonlar arasındaki ilişki en az room list kadar önemlidir. Dışarıdan gelen crate ve contractor malzemelerinin, temiz white space’e giden personel akışıyla aynı rotayı kullanması istenmez. Loading alanı kontrollü dış erişim ister ama white space’e doğrudan uncontrolled geçiş vermemelidir. Electrical plant’e bakım yapan ekip mümkünse data hall içinden geçmeden görevini yapabilmelidir. MMR, carrier entrance ve internal telecom routes ile mantıklı yakınlıkta olmalı ama tüm network çeşitliliğini aynı physical path’e sıkıştırmamalıdır.

Security flow da katmanlı olmalıdır. Public alan, controlled staff alanı, restricted technical zone ve critical room arasında progressive access control kurulur. Mantrap değerli bir bileşendir fakat tek başına physical security architecture değildir. Loading dock, roof plant, external yard, carrier entry ve contractor access gibi başka giriş yüzeyleri de aynı security zoning içinde ele alınmalıdır.

Building form ile zoning birlikte değerlendirilmediğinde sonradan pahalı uyumsuzluklar ortaya çıkar. Örneğin multi-storey tasarımda ağır AI rack için yeterli data-hall slab capacity bulunabilir ama freight elevator küçük kalmış olabilir. Ya da future liquid cooling düşünülmüş olabilir fakat CDU için erişilebilir mekanik zone ve drainage route ayrılmamış olabilir. Bu nedenle facility planı oda yerleştirme egzersizi değil, business requirement, site risk, physical movement, maintainability ve failure containment’ın aynı çizim üzerinde uzlaştırılmasıdır.

Golden karar kuralı şudur: bir building form ancak site hazards, functional adjacency, physical diversity, logistics ve future-density ihtiyaçlarını birlikte karşılıyorsa doğru seçimdir. Estetik veya yalnız initial CAPEX ile yapılan bina kararı, data center lifecycle’ında kolayca stranded capacity üretebilir.

---

## [K07-02] White space, structure, slab, raised floor ve equipment logistics

White space çoğu projede net rack alanı veya kaç cabinet sığdığı üzerinden konuşulur. Oysa gerçek white-space architecture rack footprint’inden çok daha fazlasını içerir. Rack service clearances, power busway, cable trays, structured cabling, air containment, liquid headers, CDU veya rear-door heat exchanger interfaces, fire detection, lighting, leak detection, drainage, maintenance access ve heavy-equipment movement aynı üç boyutlu volume içinde yaşar. Bu nedenle white space’i yalnız iki boyutlu plan üzerinden optimize etmek, özellikle high-density projelerde ciddi hata üretir.

Column grid bu noktada önem kazanır. Kolonlar yalnız rack sayısını azaltmaz; hot aisle veya cold aisle alignment’ını, containment sistemlerini, overhead busway route’unu, fiber tray’leri, large liquid headers’ı ve maintenance turning radius’larını etkileyebilir. Clear height de aynı şekilde kritik hale gelir. Geleneksel air-cooled data hall için yeterli görünen ceiling zone, yüksek amperli busway, yoğun fiber, large-bore liquid piping, leak tray ve sprinkler sistemleri aynı anda yerleştirildiğinde yetersiz kalabilir.

Structure değerlendirmesinde tek bir floor-load sayısı kullanmak da tehlikelidir. Uniformly distributed load, concentrated load, caster veya foot point load, rolling load, dynamic load, suspended service load ve roof plant load birbirinden farklıdır. AI rack’in final konumunda floor capacity yeterli olabilir ama rack loading dock’tan, ramp’tan, freight elevator’dan veya corridor’dan geçerken başka structural limits ile karşılaşabilir. Bu yüzden Golden yapı hesabı yalnız “rack kaç kilo?” sorusunu değil, truck’tan final position’a kadar bütün equipment route’u kapsar.

Raised floor ve slab tartışması da çoğu zaman gereksiz ideolojiye dönüşür. Raised floor bazı air-distribution mimarilerinde değerli underfloor plenum sağlar, kablo ve belirli servislerin erişimini kolaylaştırabilir. Ancak ağır rack’lerde tile ve pedestal system ayrıca doğrulanmalıdır; underfloor alan leak, contamination ve maintenance riskleri taşıyabilir. Structural slab ve overhead services ise ağır equipment için doğrudan load path, kolay anchoring ve görünür servis dağıtımı sağlayabilir. Buna karşılık overhead space dikkatli koordine edilmelidir.

Dolayısıyla “modern data center raised floor kullanmaz” veya “gerçek data center mutlaka raised floor olur” gibi iki uç yaklaşım da yanlıştır. Doğru seçim workload, cooling architecture, structural load, piping/cabling philosophy, liquid-risk strategy, retrofit conditions ve operations modeline göre yapılır.

AI transition bu kararı daha önemli hale getirir. High-density racks yalnız daha yüksek kW taşımaz; fiziksel olarak daha ağır olabilir, integrated rack olarak teslim edilebilir ve liquid-cooling interfaces içerebilir. Bu durumda slab capacity yanında loading doors, corridor geometry, freight lifting, turning radius ve final anchorage birlikte ele alınmalıdır. Rack’in taşınacağı rota boyunca floor transitions, thresholds ve elevator load limits de kontrol edilir.

Equipment logistics plant rooms için de geçerlidir. Bir transformer, UPS, switchboard, chiller, large CDU veya pump skid bina ömrü boyunca değiştirilebilir olmalıdır. Odaya ilk inşaat sırasında crane ile yerleştirilmiş ve sonra etrafı duvarla kapatılmış bir ekipman, teorik olarak maintainable olsa bile replaceable değildir. Golden replacement-path register her major asset için dimensions, weight, shipping condition, lifting points, door size, corridor, elevator veya ramp capacity, staging area ve required isolation state’i kaydeder.

Bu yaklaşım CAPEX’i gereksiz büyütmek için değil, lifecycle risk’i görünür yapmak içindir. Bazen removable wall panel veya oversized door küçük bir initial cost ekler ama yıllar sonra major equipment replacement sırasında günlerce outage veya demolition ihtiyacını önler. Benzer biçimde future AI zone için yüksek-capacity structural bay ayırmak tüm binayı aynı pahalı structural standard’a yükseltmekten daha rasyonel olabilir.

Golden sonuç nettir: white space ve structure birlikte tasarlanmalı, floor system seçiminden önce current ve future workload distribution bilinmeli ve bütün major equipment için end-to-end movement path kanıtlanmalıdır. Rack’in final noktada sığması, binanın o rack’i gerçekten destekleyebildiği anlamına gelmez.

---

## [K07-03] A/B physical diversity, MMR, risers ve failure domains

Data center resilience konuşulurken single-line diagram üzerinde iki paralel path görmek rahatlatıcıdır. Ancak Golden facility review bununla yetinmez; iki path’in bina içinde nereden geçtiğine bakar. Aynı riser, aynı trench, aynı fire compartment, aynı flood level, aynı wall penetration veya aynı overhead support zone üzerinde taşınan iki farklı cable veya pipe path, fiziksel olarak düşündüğümüz kadar bağımsız olmayabilir.

Bu nedenle her A/B system için physical-diversity audit yapılmalıdır. Power A ve Power B aynı room’da mı? Aynı cable gallery’den mi geçiyor? Cooling A ve Cooling B aynı large header’a mı bağlı? İki network path aynı MMR’a veya aynı building entrance’a mı giriyor? Controls iki plant train’i aynı controller veya aynı network switch üzerinden mi yönetiyor? Bakım ekibi iki path’e de aynı dar corridor’dan mı ulaşıyor? Tek bir sprinkler event, roof leak veya local fire iki path’i aynı anda etkileyebilir mi? Bu sorular schematic redundancy’nin gerçek failure-domain separation’a dönüşüp dönüşmediğini gösterir.

Electrical rooms’da fiziksel separation yalnız iki oda adı yaratmak değildir. İki room yan yana olsa ve bütün incoming cables aynı penetration bank’ten geçse, local fire veya physical damage ortak etkisini korur. Benzer biçimde two-N power architecture downstream’de tek bir common busway, common transfer device veya shared maintenance bypass’a dönüşüyorsa end-to-end independence kaybolur. K04 ve K06 power Golden prensipleri bu nedenle building layout ile birlikte okunmalıdır.

Cooling tarafında da aynı problem vardır. İki chiller veya iki pump mevcut olabilir fakat common header, common control, common cooling tower yard veya same water source nedeniyle building-level common mode devam edebilir. Liquid cooling ile FWS ve TCS loops eklenince physical routes daha da karmaşık hale gelir. Pipe zoning ve isolation valves yalnız hydraulic tasarım değil, availability zoning konusudur.

Telecom tarafında MMR ve carrier entrances özel önem taşır. Çok sayıda carrier sözleşmesi yapılmış olması fiziksel route diversity anlamına gelmez. Fibers aynı street chamber, bridge, duct bank veya building penetration’da birleşiyorsa dışarıdaki tek excavation tüm carrier çeşitliliğini kesebilir. Bu yüzden dual-MMR tasarımı gerektiğinde yalnız iki room çizmekle bitmez; outside plant route’tan internal riser’a kadar independence doğrulanmalıdır.

Risers binanın görünmeyen kritik failure domains’idir. Multi-storey data center’da power, cooling, fire, telecom ve controls vertical distribution için riser kullanır. A ve B sistemleri aynı riser içinde farklı tray veya pipe üzerinde olsa bile bir fire, water event veya structural impact ikisini birlikte etkileyebilir. Bu nedenle target resilience seviyesine göre physically separated risers veya compartmentation gerekebilir.

Physical diversity operasyonel erişimi de kapsar. Bir room’a bakım yapılırken diğer path’e erişim aynı construction zone’dan geçiyorsa planned maintenance common-risk yaratabilir. Benzer şekilde major equipment replacement sırasında crane veya lifting path’in ikinci train’i geçici olarak bloklaması resilience’i düşürür. Golden model bu temporary states’i de normal topology kadar ciddiye alır.

MMR, riser ve plant rooms arasındaki fiziksel ilişki aynı zamanda future expansion’ı etkiler. İlk phase’de iki bağımsız path kurulmuş olabilir ama second phase tie-in noktaları aynı corridor veya shared gallery üzerinde toplanırsa büyüme sırasında yeni common modes ortaya çıkar. Bu yüzden phase boundaries ve future connection points başlangıçtan tasarlanmalıdır.

Golden kural basittir ama disiplin gerektirir: redundancy sayıları ve equipment counts yalnız başlangıç verisidir. Asıl soru, gerçek dünyadaki tek bir fiziksel olayın iki path’i aynı anda etkileyip etkileyemeyeceğidir. Bina çizimleri, cable routing, pipe routing, fire zoning, flood levels, access routes ve outside plant birlikte incelenmeden “independent A/B” ifadesi kabul edilmemelidir.

---

## [K07-04] Fire, water, security ve building compartments

Fire, water ve security çoğu projede ayrı disiplinler olarak tasarlanır; fakat data center building architecture açısından ortak bir yönleri vardır: hepsi physical compartment boundaries oluşturur. Golden tasarım bu boundaries’in availability hedefiyle çelişmediğini doğrular. Örneğin fire-rated wall yangın yayılımını sınırlar, ancak duvarın içinden iki redundant path aynı opening üzerinden geçiyorsa availability açısından ortak nokta yaratabilir. Benzer biçimde security door çok güçlü olabilir ama emergency egress davranışı doğru tasarlanmamışsa life safety ile çatışır.

Fire strategy yalnız suppression sistemi seçmek değildir. Detection, compartmentation, smoke management, cable fire load, battery hazards, egress, emergency response ve post-event recovery birlikte düşünülür. IT rooms, electrical rooms, battery spaces ve generator/fuel areas aynı hazard profile’a sahip değildir. UPS battery architecture lead-acid’dan lithium-ion veya daha büyük BESS çözümüne geçtiğinde building fire strategy de yeniden değerlendirilmelidir. Battery chemistry, module arrangement, BMS, thermal event propagation, ventilation ve fire-service response physical room design’i etkiler.

Water risk data center dünyasında bazen yangından daha sık karşılaşılan operational threat olabilir. Roof drainage, sprinkler pipes, domestic water, chilled water, condensate, humidification, liquid-cooling loops, groundwater, flood ve sewer backflow farklı water sources yaratır. Golden facility review bunları bir water-source map üzerinde gösterir ve hangi critical spaces’in hangi liquid source’a maruz kaldığını belirler.

Liquid cooling ile water architecture first-class design domain haline gelir. Leak sensor koymak yeterli değildir. Bir leak algılandığında hangi valve kapanacak, hangi rack veya zone cooling kaybedecek, isolation süresi ne olacak, leaked fluid nereye akacak ve sistem nasıl restore edilecek soruları cevaplanmalıdır. Pipe route’ları, isolation zones, drip trays veya containment, drainage ve leak detection birlikte tasarlanır. Aksi halde küçük bir local leak extended outage veya electrical damage’e dönüşebilir.

Roof da önemli bir water-risk boundary’dir. Roof-mounted cooling equipment, pipe penetrations, cable entries ve drains zaman içinde membrane failure veya drainage blockage riski oluşturabilir. Kritikal switchgear veya IT space’in doğrudan riskli roof zones altında bulunması project-specific olarak sorgulanmalıdır. Roof overflow, emergency drainage ve inspection access lifecycle boyunca korunmalıdır.

Physical security ise sadece CCTV ve mantrap değildir. Perimeter, vehicle control, visitor reception, controlled internal zones, critical rooms, cages, loading dock, roof access, external plant yards ve carrier entrance gibi katmanların tamamını kapsar. Staff, tenants, vendors, contractors, delivery personnel ve emergency responders için farklı access profiles gerekir. Security zoning operations ile uyumlu olmalı ve emergency egress’i bloke etmemelidir.

Loading dock güvenlik ve fire açısından özel bir geçiş alanıdır. Combustible packaging, dış araçlar, vendor personnel ve waste aynı bölgede bulunur. Bu nedenle loading, quarantine, unpack ve staging akışı kontrollü olmalı; dirty logistics doğrudan white space’e taşınmamalıdır. Ayrıca fire event sırasında loading veya receiving area’nın kritik internal route’ları bloke edip etmediği değerlendirilir.

Compartment design’in Golden amacı yalnız hazard containment değil, recovery kolaylığıdır. Bir room kaybedildiğinde hangi function yaşamaya devam edecek? Diğer A/B train serviceable kalacak mı? NOC veya controls erişilebilir mi? Fire department müdahalesi ikinci train’i zorunlu olarak kapatacak mı? Water isolation operatör tarafından güvenle yapılabilecek mi? Bu sorular building compartments’i gerçek resilience architecture’a dönüştürür.

Sonuç olarak fire, water ve security çizimleri yalnız compliance documents değildir. Availability design’in physical evidence’ıdır. Golden freeze öncesinde bu üç disiplin power, cooling, network ve operations ile çapraz okunmalıdır.

---

## [K07-05] AI, high density ve liquid-cooling facility readiness

AI-ready ifadesi bugün data center projelerinde çok sık kullanılıyor, fakat çoğu zaman tek bir rakama indirgeniyor. “Şu kadar kilowatt per rack destekleriz” veya “floor load’umuz çok yüksek” demek, AI-ready facility’yi tanımlamak için yeterli değildir. Çünkü high-density AI workload aynı anda structure, electrical distribution, cooling, liquid, network, logistics, service clearances ve commissioning davranışını değiştirir.

İlk konu physical density’dir. AI racks daha ağır olabilir, integrated rack halinde taşınabilir ve yüksek center of gravity’ye sahip olabilir. Bu nedenle data hall slab capacity kadar loading dock, staging floor, freight elevator, corridor ve final anchoring doğrulanmalıdır. Seismic region’da rack anchorage, overhead busway, liquid piping ve flexible connections birlikte değerlendirilir. Yalnız rack’i slab’a bolt etmek bütün system seismic readiness’i kanıtlamaz.

İkinci konu service volume’dür. High-current power distribution daha büyük busway veya cable infrastructure isteyebilir. Dense network fabrics yüzlerce yüksek hızlı fiber bağlantısı üretir. Direct-to-chip liquid cooling primary ve secondary piping, CDU, manifolds, isolation valves, sensors ve leak management gerektirir. Fire systems ve structural supports da aynı ceiling veya service zone içinde yer ister. Bu yüzden traditional clear height ve overhead coordination assumptions gelecekte yetersiz kalabilir.

Üçüncü konu liquid architecture’dır. AI-ready building FWS ile TCS boundary’sini açıkça tanımlar. Outdoor heat rejection, facility-water loop, heat exchanger veya CDU, technology cooling system, manifolds ve server cold plates fiziksel olarak nerede bulunacak? CDU floor-mounted mı olacak, sidecar mı olacak, merkezi mechanical room’da mı? Primary ve secondary pipes hangi routes üzerinden geçecek? Isolation zone kaç rack’i etkiler? Leak detection hangi valve logic’i tetikler? Drainage ve containment hangi building zone’a akar? Bu sorular cevaplanmadan “liquid ready” etiketi anlamlı değildir.

Dördüncü konu residual air heat’tir. Direct-to-chip cooling bütün rack heat’ini her zaman liquid’e taşımaz. Network gear, power components ve başka server elements residual air heat üretebilir. Dolayısıyla high-density hall, liquid path yanında kalan air-cooling requirement’ı da desteklemelidir. Air containment, fan walls veya room cooling tamamen göz ardı edilmemelidir.

Beşinci konu synchronized load behavior’dır. Large GPU clusters aynı anda power draw değiştirir ve thermal output hızla yükselir. Facility power ve cooling architecture bu transient behavior’ı birlikte ele almalıdır. Bina formu burada electrical ve mechanical systems’in physically integrated olmasına alan sağlamalıdır. AI design, separate discipline optimizations’ın toplamı değil, integrated architecture’dır.

Altıncı konu hardware cycle’dır. AI infrastructure kısa aralıklarla değişebilir. Bugün belirli rack footprint veya CDU arrangement için optimize edilmiş hall, iki yıl sonra yeni form factor veya daha yüksek density ile karşılaşabilir. Future-density adaptability bu nedenle reserved structural zones, service pathways, liquid headers, power capacity ve modular expansion interfaces gerektirir. Her şeyi day one’da overbuild etmek gerekmez; fakat next-generation deployment için building-level optionality bırakmak gerekir.

Greenfield facility bu flexibility’yi baştan sağlayabilir. Retrofit’te ise mevcut structure, clear height, pipe routes ve heat rejection capacity ciddi constraints yaratabilir. Buna rağmen doğru engineering ile liquid-to-air CDU, liquid-to-liquid CDU veya dedicated AI pod gibi farklı retrofit patterns mümkün olabilir. Önemli olan vendor reference design’i kopyalamak değil, mevcut binanın hangi resource ve failure domains’e sahip olduğunu ölçmektir.

Golden AI-readiness scorecard bu yüzden on başlığı birlikte sorar: structure, power, cooling, liquid, water risk, space, network, logistics, commissioning ve future growth. Bu alanlardan biri zayıfsa available electrical MW gerçek compute capacity’ye dönüşmeyebilir. Stranded capacity yalnız utility shortage’dan değil, building architecture mismatch’inden de doğar.

---

## [K07-06] Retrofit, live-site expansion ve lifecycle replacement

Greenfield data center tasarlamak ile çalışan bir facility içinde retrofit yapmak aynı problem değildir. Greenfield’de site, structure, room zoning, A/B routes, MMR entrances, loading ve future phases baştan birlikte tasarlanabilir. Retrofit ise inherited constraints ile başlar. Existing structure, column grid, roof capacity, fire compartments, electrical rooms, chilled-water system, network risers, drainage ve shutdown windows zaten vardır. Golden retrofit engineering bu constraints’i saklamak yerine açıkça risk register’a taşır.

Retrofit’in ilk sorusu “yeni rack sığıyor mu?” değildir. Doğru sıra daha geniştir: structure destekliyor mu, rack binaya girebiliyor mu, power route mevcut mu, cooling ve heat rejection yeterli mi, liquid infrastructure nasıl eklenecek, network pathways yeterli mi, fire ve water risk değişiyor mu, operating team sistemi maintain edebilecek mi ve installation sırasında live load nasıl korunacak? Bir tek cevabın “hayır” olması deployment modelini değiştirebilir.

Liquid-cooling retrofit bunun iyi örneğidir. Existing building’de facility water bulunmuyorsa liquid-to-air CDU kullanılabilir; facility water varsa liquid-to-liquid interface daha efficient olabilir. Ancak her iki durumda da CDU space, electrical supply, piping route, leak detection, drainage, controls ve service access gerekir. Piping’i sadece en kısa route’tan geçirmek kolay olabilir ama critical electrical rooms’un üzerinden geçmek unacceptable risk yaratabilir.

Live-site expansion ise retrofit’in daha operasyonel biçimidir. Construction dust, vibration, temporary power, hot work, fire-system impairments, contractors, open ceilings, water connection, drilling ve cable pull gibi normal inşaat aktiviteleri live data center için failure mode’a dönüşür. Bu nedenle expansion boundary, contractor access ve temporary containment baştan tasarlanmalıdır.

Future phase interfaces ilk facility açılmadan planlanırsa risk ciddi biçimde azalır. Power bus veya switchgear tie-in noktaları, cooling headers, isolation valves, telecom ducts, controls interfaces ve structural expansion joints future phase için pre-engineered olabilir. Böylece ikinci phase geldiğinde çalışan critical room’un içinden tekrar tekrar pipe ve cable geçirmek gerekmez.

Method of Procedure burada building design’in extension’ıdır. Bir wall penetration açılacaksa hangi fire boundary geçici olarak bozulacak? Cooling header’a tie-in yapılacaksa hangi valves kapanacak? Crane operation hangi path’i bloklayacak? Dust barrier veya temporary wall fire detection behavior’ını nasıl etkiler? Rollback mümkün mü? Golden live-site expansion her construction activity’yi operational state olarak değerlendirir.

Lifecycle replacement konusu aynı derecede önemlidir. Major equipment’in expected life’i data center building’den daha kısa olabilir. UPS, battery, chiller, pump, CDU, switchgear, generator veya transformer değiştirilmek zorunda kalacaktır. Building design replacement day’i düşünmüyorsa ekipman fiziksel olarak trapped hale gelir. Replaceability için removable panels, lifting beams, service doors, temporary staging ve redundant bypass states gibi çözümler kullanılabilir.

NOC ve control rooms da lifecycle perspective ile incelenir. Bir room renovation veya local event bütün facility visibility’yi ortadan kaldırmamalıdır. Control architecture’ın physical distribution’ı operational sustainability ile uyumlu olmalıdır. Workshop ve spares zones future maintenance yükünü desteklemeli, white space’i repair area’ya çevirmemelidir.

Golden retrofit ve expansion prensibi şudur: yeni capacity eklemek yalnız construction project değildir; mevcut resilience system üzerinde kontrollü bir state transition’dır. Başarı, yeni rack’lerin açılması kadar eski critical load’un construction boyunca intended SLA’yı korumasıyla ölçülür.

---

## [K07-07] Commissioning, risk matrix ve hangi building architecture ne zaman?

Facility architecture’ın son doğrulaması drawing review ile bitmez. Commissioning, binanın intended normal, maintenance ve fault states altında gerçekten nasıl davrandığını kanıtlamalıdır. Electrical ve mechanical equipment tek tek startup testlerinden geçebilir, fakat Golden acceptance integrated failure scenarios’a bakar. Çünkü bina-level common modes ancak sistemler birlikte çalışırken görünür olur.

Örneğin A-path electrical room erişilemez hale geldiğinde B path yalnız elektriksel olarak çalışıyor mu, yoksa bakım personelinin access route’u da kapanıyor mu? Bir cooling zone’da water leak algılandığında isolation diğer zone’u koruyor mu? Fire alarm sırasında security doors ve egress doğru davranıyor mu? Bir MMR kaybedildiğinde carrier diversity gerçekten devam ediyor mu? Freight route kapalı olduğunda critical replacement için alternate path var mı? Bu sorular facility architecture commissioning’in gerçek içeriğidir.

Risk matrix en az flood, roof leak, shared riser, fire, liquid leak, structural overload, logistics trap, security breach, MMR convergence, live construction, future-density mismatch ve shared controls gibi building-level hazards içermelidir. Her risk için mechanism, consequence ve control açık yazılır. Risk yalnız probability ile değil, service impact ve recovery complexity ile değerlendirilir.

Building-form seçimi de bu risk profile’a göre yapılmalıdır. Purpose-built single-storey yapı high-density ve heavy logistics için güçlü bir baseline olabilir; fakat land constraint yüksekse multi-storey daha doğru olabilir. Multi-storey seçildiğinde vertical risers, freight elevators, structural loading ve inter-floor water risk daha ayrıntılı tasarlanır. Converted building hızlı deployment sağlayabilir ama constraints-driven engineering gerektirir. Prefabricated veya hybrid yaklaşım schedule ve factory quality avantajı sağlayabilir, fakat module interfaces, lifting ve site tie-ins commissioning’in kritik bölümü olur.

Raised floor veya slab seçimi de aynı şekilde contextual’dır. Underfloor air architecture ve flexible underfloor services önemliyse raised floor değerli olabilir. Heavy AI racks, direct anchoring ve overhead services öncelikliyse structural slab daha uygun olabilir. Golden karar tek bir endüstri trendine göre değil, workload, cooling, structure, liquid risk ve operations modeline göre verilir.

Scale de building architecture’ı etkiler ama hard threshold yaratmaz. Küçük edge veya enterprise room’da compact integrated solution yeterli olabilir. Bir veya iki megawatt seviyesinde dedicated technical rooms, MMR, controlled loading ve expansion interfaces önem kazanır. Büyük colo veya cloud facility’de repeatable halls, multiple plant blocks ve campus logistics devreye girer. Çok büyük AI campus’ta utility, land, multi-building failure domains, high-density liquid infrastructure ve hardware-cycle adaptability temel tasarım parametrelerine dönüşür.

Procurement aşamasında building deliverables açıkça istenmelidir. Site-risk register, functional-space schedule, adjacency matrix, structural load plan, physical A/B route drawings, fire-water-security compartments, equipment replacement paths, carrier entry map, liquid-cooling interface plan ve expansion tie-in strategy olmadan facility design yeterince kanıtlanmış sayılmamalıdır.

Golden freeze için son soru şudur: bu bina yalnız bugünkü equipment list’ini mi barındırıyor, yoksa hedeflenen availability seviyesini, planned maintenance’i, fault containment’ı, future technology değişimini ve major equipment replacement’ı ömrü boyunca destekleyen bir physical resilience platform mu? Cevap ikinci seçenek olduğunda architecture gerçek anlamda data-center-grade hale gelir.

DC-K07’nin Golden kuralı bu zincirle kapanır: business ve SLA’dan site risk’e; project condition’dan building form ve zoning’e; structure’dan physical path diversity’ye; fire, water ve security compartments’tan logistics ve replacement’a; white space’ten AI ve liquid readiness’e; expansion’dan commissioning ve operations’a kadar bütün kararlar aynı lifecycle modelinde tutarlı olmalıdır. Ancak bu zincir kanıtlandıktan sonra building architecture freeze edilmelidir.
