# DC-K05 — Cooling Architecture — Full Narration TR V2

Bu metin DC-K05 Golden Deep Research için uzun-form S3F seslendirme kaynağıdır. Quick Brief ayrı ve korunmuş bir moddur. Full Briefing sekiz chapter üzerinden veri merkezi soğutmasını chip seviyesinden outdoor heat rejection'a kadar thermal-chain, hydraulics, resilience ve lifecycle karar sistemi olarak anlatır.

---

## [K05-00] Cooling architecture neden klima seçimi değildir?

Bir veri merkezinin soğutma sistemine dışarıdan bakıldığında ilk görülen şey genellikle CRAC, CRAH, chiller, dry cooler, CDU veya boru hatlarıdır. Fakat cooling architecture bu cihazların listesi değildir. Gerçek problem, IT ekipmanının tükettiği elektrik enerjisinin ısıya dönüşmesinden sonra bu ısının silicon seviyesinden dış çevreye kadar hangi fiziksel zincir üzerinden taşındığıdır. Bu zincirin herhangi bir halkası kapasite, kontrol veya resilience bakımından zayıfsa, mekanik ekipmanların toplam nameplate kapasitesi sistemi kurtarmaz.

Golden yaklaşım bu nedenle workload ile başlar. Önce IT platformunun air inlet, coolant supply, flow, pressure drop ve heat capture gereksinimleri anlaşılır. Sonra rack-by-rack density dağılımı çıkarılır. Ortalama rack gücü tek başına kullanışlı değildir; aynı hall içinde düşük yoğunluklu storage rack'leri ile çok yüksek yoğunluklu accelerator rack'leri birlikte bulunabilir. Tasarım median, yüksek yüzdelik yoğunluk, maksimum committed density ve future design density üzerinden zonlanmalıdır.

Bir sonraki soru heat'in nerede capture edildiğidir. Geleneksel air architecture server fan'larıyla heat'i room'a taşır. In-row sistem heat exchanger'ı rack'e yaklaştırır. Rear-door heat exchanger server exhaust'unu rack arkasında yakalar. Direct-to-chip cold plate heat'i CPU veya GPU gibi yüksek ısı akılı component'lerden alır. Immersion ise equipment'i dielectric fluid içine alarak farklı bir service model kurar. Bu teknolojiler birbirinin farklı kapasite versiyonu değildir; farklı physical boundary ve failure domain'lerdir.

Burada air ve liquid'i rakip iki kutup gibi görmek de yanlıştır. Modern AI rack çoğu zaman hybrid davranır. Heat'in önemli kısmı cold plate ile liquid'e taşınırken PSU, NIC, memory, storage veya board-level component'ler residual air heat bırakabilir. Bu nedenle total rack heat, liquid-captured heat ile residual air heat'in toplamıdır. OEM bu oranı açıkça vermeden room airflow'u ortadan kaldırmak risklidir.

Cooling chain'in facility tarafında TCS, yani Technology Cooling System ile FWS, yani Facility Water System sınırı kritik hale gelir. CDU veya heat exchanger bu iki domain arasında temperature, pressure, chemistry ve service responsibility separation sağlar. Ardından heat chiller, dry cooler, cooling tower, adiabatic system veya economizer üzerinden outdoor environment'a atılır; bazı projelerde heat reuse ek bir değer yolu olabilir.

Son olarak cooling architecture normal durumda çalışan bir kapasite hesabı değildir. Pump, CDU, header, control network, heat rejection device veya power source kaybında sistemin hangi state'e geçtiği önceden modellenmelidir. UPS runtime ile cooling runtime aynı şey değildir. Yüksek güçlü cold plate'lerde flow kaybı sonrası thermal margin çok hızlı tüketilebilir.

Bu thermal contract aynı zamanda procurement sınırlarını netleştirir. IT OEM yalnız server'ı, mechanical vendor yalnız chiller'ı, CDU vendor yalnız secondary loop'u optimize ederse aradaki interface'ler sahipsiz kalabilir. Golden package bu nedenle rack density map, air-liquid heat split, hydraulic schematic, control narrative, alarm matrix, water/fluid specification ve commissioning state matrix'i tek engineering baseline altında birleştirir. Böylece tasarım cihaz kataloğundan değil, doğrulanabilir interface'lerden yönetilir.

Bu nedenle doğru cooling architecture, en güçlü chiller'ı veya en yeni liquid technology'yi seçen mimari değildir. Workload requirement, heat capture, hydraulics, water and energy strategy, resilience, controls, commissioning ve future density aynı end-to-end thermal contract içinde birbirini doğruladığında tasarım Golden seviyeye ulaşır.

---

## [K05-01] Airflow, containment, CRAC/CRAH ve close-coupled cooling

Air cooling veri merkezlerinde hâlâ temel ve geçerli bir architecture'dır. Ancak air cooling'i yalnız room temperature veya toplam tonnage üzerinden değerlendirmek, modern hall'lerdeki asıl problemi kaçırır. Tasarım reference point'i IT equipment inlet condition'dır. Rack önündeki hava, cihazın gerçekten gördüğü temperature ve humidity envelope içinde olmalıdır; room average değeri iyi görünürken belirli rack'lerde recirculation veya hotspot oluşabilir.

Klasik perimeter architecture'da CRAC veya CRAH unit'leri room seviyesinde heat removal sağlar. CRAC terimi çoğunlukla direct expansion, yani refrigerant-based cycle ile; CRAH ise chilled-water coil ile ilişkilendirilir. Fakat isim tek başına design kararını tanımlamaz. Asıl soru refrigerant veya water loop'un nereden geçtiği, compressor ve heat rejection'ın nerede bulunduğu, economizer mode'un nasıl çalıştığı ve maintenance sırasında hangi failure domain'in kaldığıdır.

Raised-floor supply uzun yıllar standart bir yöntem olarak kullanıldı. Underfloor plenum üzerinden perforated tile'lara hava verilir. Bu yaklaşım hâlâ doğru uygulanabilir, ancak cable obstruction, leakage, pressure imbalance ve yanlış tile placement performansı düşürebilir. Modern yüksek yoğunluklu tesislerde raised floor zorunlu değildir. Slab floor ve overhead distribution, özellikle power, network ve cooling routing birlikte tasarlandığında daha temiz bir service architecture sunabilir.

Hot aisle ve cold aisle düzeni airflow management'ın temelidir. Problem yalnız sıcak havanın varlığı değildir; hot ve cold stream'lerin karışmasıdır. Recirculation sıcak exhaust'un tekrar server inlet'ine dönmesine, bypass ise supply air'in IT load'dan geçmeden return'a kaçmasına neden olur. Containment bu mixing'i azaltır. Hot aisle containment yüksek return temperature ve daha kontrollü return path sağlayabilir; cold aisle containment ise başka room geometrilerinde uygun olabilir. Fire suppression, egress, room pressure ve maintenance practice seçimle birlikte çözülmelidir.

In-row veya close-coupled cooling, heat exchanger'ı rack'e yaklaştırarak airflow path'i kısaltır. Bu yaklaşım daha yüksek density ve modüler büyüme için güçlüdür. Fakat row içindeki water veya refrigerant piping, condensate, service clearance ve white-space kullanımı yeni design constraints yaratır. Ayrıca N artı bir in-row unit olması, hepsi aynı single pump veya common header'a bağlıysa gerçek path redundancy anlamına gelmez.

Rear-door heat exchanger air ile liquid arasında önemli bir transition technology'sidir. Server içinde cold plate gerektirmeden exhaust heat'i rack arkasında liquid loop'a aktarabilir. Bu nedenle retrofit için güçlüdür. Ancak door weight, hinge and hose service, opening behavior, CDU dependence ve residual room heat açıkça doğrulanmalıdır.

Air side performansın doğrulanmasında computational fluid dynamics yararlı olabilir, fakat CFD tek başına acceptance değildir. Model assumptions, rack airflow, leakage, tile veya opening characteristics ve actual fan curves doğru girilmelidir. Commissioning sırasında representative rack inlet sensors ve gerçek veya simulated heat load ile modelin sahadaki davranışa yakınlığı kontrol edilir. Özellikle mixed-density hall'lerde yalnız birkaç average sensor kullanmak lokal recirculation problemlerini gizleyebilir.

Air cooling'in Golden sonucu şudur: başarılı tasarım daha fazla fan veya daha düşük supply temperature kullanmak değildir. Airflow path'i ölçülebilir hale getirmek, mixing'i azaltmak, peak rack density'yi taşımak ve terminal cooling'i upstream plant failure domain'leriyle birlikte değerlendirmek gerekir. Air doğru uygulanırsa hâlâ çok güçlüdür; yanlış uygulanırsa yüksek kapasite bile hotspot'u gizleyebilir.

---

## [K05-02] DX, chilled water, economization ve heat rejection

Cooling architecture'ın facility tarafında iki farklı karar birbirinden ayrılmalıdır: heat'i white space'tan nasıl topladığımız ve bu heat'i outdoor environment'a nasıl attığımız. CRAC, CRAH veya CDU terminal-side seçimi bir karar; chiller, dry cooler, cooling tower veya economizer ise heat rejection kararıdır. Bu iki katmanı tek ürün adı altında düşünmek tasarım hatalarına yol açar.

Direct expansion, yani DX architecture'da refrigerant cycle heat'i terminal unit'ten condenser veya outdoor heat exchanger'a taşır. Küçük ve orta ölçekli tesislerde, edge veya distributed deployment'larda merkezi chilled-water plant gerektirmemesi önemli avantaj olabilir. Ancak refrigerant circuit length, charge, compressor modulation, low-ambient operation, hot-climate derating, maintenance skill ve refrigerant regulation lifecycle boyunca değerlendirilmelidir. Büyük scale, DX'i otomatik olarak yanlış yapmaz; topology ve economics karar verir.

Chilled-water architecture'da chiller plant soğuk su üretir ve pumps, headers, CRAH veya in-row coils üzerinden heat taşınır. Büyük campus, colocation ve hyperscale environments'da central optimization, economizer integration ve thermal storage gibi seçenekler güçlüdür. Buna karşılık common headers, pumps, valves, controls ve heat rejection plant büyük common-mode failure domain'leri yaratabilir. Plant üzerinde N artı bir chiller bulunması distribution path'in de redundant olduğunu kanıtlamaz.

Heat rejection seçenekleri site climate ve water strategy ile birlikte seçilir. Air-cooled chiller cooling tower gerektirmez fakat hot ambient'te compressor energy ve derating önem kazanır. Water-cooled chiller ve cooling tower yüksek efficiency opportunity sunabilir, ancak evaporative water use, treatment, plume ve maintenance getirir. Dry cooler düşük consumptive water kullanımı ve warm-liquid loop'larla uyumluluk açısından güçlüdür; outdoor dry-bulb ve footprint sınırları vardır. Adiabatic systems belirli climate conditions'da approach temperature'ı düşürebilir fakat water quality ve maintenance ister.

Economization, var veya yok şeklinde bir checkbox değildir. Asıl hesap annual hours problemidir. Hourly weather data, required supply temperature, heat exchanger veya CDU approach, fan and pump energy, redundancy mode ve contamination constraints birlikte incelenmelidir. Gerçek değer compressor hours avoided ve annual energy reduction üzerinden ölçülür.

ASHRAE liquid class'ları bu noktada önemlidir. W17, W27, W32, W40, W45 ve W+ class'ları IT equipment'in facility supply liquid temperature capability'sini ifade eder. Daha yüksek allowable supply temperature, daha fazla dry cooling veya economizer opportunity yaratabilir. Fakat W45 cihaz kullanmak, projenin otomatik olarak chillerless olduğu anlamına gelmez. Outdoor design temperature, CDU approach, fouling margin ve actual OEM requirement hâlâ geçerlidir.

Plant selection'da part-load behavior da peak efficiency kadar önemlidir. Data center ilk gün ultimate load'da çalışmayabilir; phased deployment yıllarca düşük veya orta load yaratabilir. Chiller staging, variable-speed pumps, condenser controls ve minimum flow requirements bu nedenle annual efficiency'yi belirler. Future expansion sırasında yeni plant block eklenirken mevcut service'in korunup korunamayacağı da mechanical topology'nin concurrent-maintainability sınırını belirler.

Golden seçim yöntemi, cooling terminal ile heat rejection'ı aynı thermal budget içinde eşleştirmektir. White space iyi çalışırken outdoor plant peak day'de yetersiz kalıyorsa sistem başarısızdır. Benzer şekilde efficient chiller plant, kötü airflow veya yanlış TCS hydraulics'i telafi etmez. Architecture chip'ten outdoor environment'a kadar tek zincirdir.

---

## [K05-03] Direct-to-chip, RDHx ve immersion farkları

High-density cooling konuşulurken rear-door, direct-to-chip ve immersion çoğu zaman aynı liquid cooling başlığı altında toplanır. Bu pratik fakat teknik olarak eksik bir sınıflamadır. Üç yaklaşım heat'i farklı physical location'da capture eder, farklı server modification gerektirir ve farklı maintenance ile failure-domain davranışı yaratır.

Rear-door heat exchanger, air-cooled server'ın exhaust heat'ini rack arkasındaki liquid heat exchanger ile yakalar. Server internal design büyük ölçüde değişmeden kalabilir. Bu yüzden brownfield veya mixed-vendor retrofit için güçlüdür. Existing rack airflow devam eder, fakat room'a bırakılan heat önemli ölçüde azaltılabilir. Yine de door opening, flexible hose, weight, rack stability, upstream CDU ve facility-water availability tasarımın parçasıdır.

Direct-to-chip veya cold-plate architecture'da heat, CPU, GPU veya accelerator package'a çok yakın bir noktadan liquid'e aktarılır. Bu yaklaşım high heat flux için çok etkilidir ve air volume ihtiyacını ciddi biçimde düşürebilir. Ancak OEM-approved coolant range, flow, pressure drop, manifold, quick disconnect, cold-plate material ve leak strategy birlikte freeze edilmelidir. Bir cold plate yalnız thermal component değildir; hydraulic network'ün son branch'idir.

En kritik konu residual heat'tir. Direct-to-chip kelimesi bazen tüm rack heat'inin liquid'e gittiği izlenimi yaratır. Gerçekte PSU, NIC, memory, storage, power shelf ve board component'leri hâlâ air cooling isteyebilir. Bu nedenle total rack heat, liquid-captured fraction ile residual air fraction'ın toplamıdır. Room cooling sistemi liquid capture ratio doğrulanmadan küçültülmemelidir.

Immersion cooling ise server veya IT equipment'i dielectric fluid içine alır. Single-phase sistemde fluid faz değiştirmeden external heat exchanger'a gider. Two-phase sistemde working fluid boiling ve condensing cycle kullanır. Immersion yüksek density taşıyabilir fakat service procedure, component compatibility, optics, cabling, fluid handling, fire and environmental profile, lifting and draining gibi alanlarda tamamen farklı bir operating model yaratır. Her AI workload için otomatik tercih değildir.

Modern rack-scale AI sistemleri direct liquid cooling'i ana design path haline getiriyor. Bugünkü public product examples yüz kilowatt üzerindeki rack cooling requirement'larını gösteriyor; future generations daha da yukarı çıkıyor. Fakat bu değerler standard threshold değildir. Her OEM generation kendi facility requirements'ı ile değerlendirilmelidir.

Karar sırasında dört soru sorulmalıdır. Mevcut IT compatibility nedir? Retrofit ne kadar invasive olabilir? Required density ve future density nedir? Operasyon ekibi hangi service model'i güvenli biçimde sürdürebilir? Air en yüksek compatibility'yi, rear-door güçlü retrofit kabiliyetini, direct-to-chip yüksek density ile mainstream AI uyumunu, immersion ise specialized full-fluid architecture'ı temsil eder.

Bir başka ayrım warranty ve supply-chain boundary'sidir. Rear-door çözümünde server OEM çoğu zaman air-cooled platform olarak kalırken, direct-to-chip'te cold plate ve coolant interface IT platform qualification'ının parçasıdır. Immersion'da component compatibility çok daha geniş bir etki alanına sahiptir. Bu nedenle procurement yalnız thermal capacity değil, supported configuration, spare parts, field service, fluid responsibility ve change-control modelini de sözleşmesel olarak tanımlamalıdır.

Golden sonuç şudur: liquid cooling bir ürün kategorisi değil, farklı heat-capture boundaries ailesidir. Technology adı değil, capture location, residual heat, service responsibility ve upstream thermal chain karar vermelidir.

---

## [K05-04] FWS, TCS, CDU, manifold, QD ve coolant chemistry

Direct-to-chip veya rear-door architecture seçildiğinde asıl sistem tasarımı CDU, TCS, FWS, manifold, quick disconnect ve coolant chemistry tarafında başlar. Bu katman görünüşte piping detail gibi durabilir, fakat yüksek yoğunluklu AI hall'lerde availability ve lifecycle riskinin önemli kısmı burada oluşur.

Facility Water System, yani FWS, heat rejection veya chilled-water plant tarafındaki facility domain'i temsil eder. Technology Cooling System, yani TCS, IT equipment'e giden secondary coolant domain'idir. Bu iki tarafı CDU veya heat exchanger ayırabilir. Separation temperature, pressure, water chemistry, contamination, material compatibility, warranty ve service ownership bakımından kritiktir.

CDU yalnız pump box değildir. Heat exchange, secondary pumping, temperature control, differential pressure regulation, filtration, air removal, fill and drain, alarms ve telemetry sağlayabilir. In-rack, in-row, sidecar, perimeter veya central architecture'lar mümkündür. CDU büyüdükçe hydraulic simplification sağlanabilir, fakat failure blast radius da büyüyebilir. Yüzlerce kilowatt veya megawatt-scale CDU seçimi bu nedenle yalnız efficiency veya footprint kararı değildir.

Rack manifold CDU'dan gelen flow'u server branch'lerine dağıtır. Design flow, delta T, available differential pressure ve component pressure drop birlikte hesaplanmalıdır. Quick disconnect veya QD, serviceability ve leak riskinin kritik interface'idir. Blind-mate ve hand-mate seçenekleri, dry-break behavior, insertion force, hose bend radius, service clearance ve leakage specification platformla uyumlu olmalıdır.

Coolant seçimi generic water specification ile yapılamaz. Treated water veya inhibited propylene-glycol mixtures gibi seçenekler endüstride kullanılır, fakat her formulation her cold plate veya CDU için approved değildir. Mixed metals galvanic corrosion yaratabilir; inhibitor depletion, oxygen ingress, elastomer incompatibility, particulate ve microbiology lifecycle boyunca sorun çıkarabilir. Bu nedenle pH, conductivity, inhibitor state, filtration ve fluid sampling operation procedure'ın parçası olmalıdır.

Dew point başka bir boundary'dir. Coolant veya cold surface surrounding air dew point'in altına inerse condensation riski doğar. Warm-water operation, dew-point monitoring, supply temperature reset ve gerekirse insulation ile risk yönetilir. Daha yüksek coolant temperature aynı zamanda economization ve heat reuse fırsatını artırabilir.

Hydraulic model rack heat load'dan başlar. Liquid-side heat transport yaklaşık olarak mass flow, specific heat ve temperature rise çarpımına bağlıdır. Flow arttıkça heat taşınabilir, ancak pressure drop ve pump energy de artar. Small hoses, QD'ler ve cold plates significant pressure loss yaratabilir. Yanlış balancing bazı trays'i starve ederken diğerlerinde gereksiz yüksek flow oluşturabilir.

Service sırasında fluid loss ve refill process de tasarımın parçasıdır. Drain points, fill carts, degassing, sampling ports, flushing procedure ve contaminated-fluid handling önceden düşünülmelidir. Expansion yapılırken yeni branch'in cleanliness seviyesi mevcut loop'u bozmayacak şekilde doğrulanmalıdır. Commissioning sonunda yalnız flow ve temperature değil, baseline fluid sample, filter condition ve pressure-drop records da future maintenance karşılaştırması için kayıt altına alınmalıdır.

Golden tasarımda CDU location, manifold zoning ve TCS architecture aynı anda üç hedefi çözmelidir: required thermal capacity, maintainable hydraulic network ve kontrollü failure blast radius. FWS/TCS interface doğru kurulmadığında güçlü cold plates bile güvenilir bir cooling system oluşturmaz.

---

## [K05-05] Density, hydraulics, dew point ve AI thermal design

AI thermal design'ın en yaygın hatalarından biri rack density'yi tek başına cooling technology seçmek için kullanmaktır. Density önemli bir input'tur, fakat tek karar değişkeni değildir. IT equipment liquid capability, heat capture ratio, coolant class, climate, hydraulic constraints, service model ve future refresh birlikte değerlendirilmelidir.

Air side'da temel physics basittir: taşınan sensible heat, air mass flow ile specific heat ve temperature rise'ın çarpımıdır. Rack power yükseldikçe daha fazla airflow, daha yüksek delta T veya farklı heat-capture method gerekir. Fan energy ve pressure requirement hızla büyüyebilir. Liquid side'da benzer ilişki mass flow, liquid specific heat ve delta T üzerinden kurulur; liquid'in volumetric heat capacity avantajı çok daha yüksek heat flux'ı küçük flow volume ile taşımayı mümkün kılar.

SpecBridge planning bands yalnız engineering decision aid olarak kullanılmalıdır. On kilowatt altı rack'lerde well-managed air çoğunlukla rahattır. On ile yirmi kilowatt arasında containment ve optimized room veya in-row design yaygındır. Yirmi ile kırk kilowatt arasında close-coupled, rear-door veya liquid-ready planning güçlenir. Kırk ile seksen kilowatt arasında liquid-assisted veya direct-to-chip ciddi aday olur. Seksen ile yüz elli kilowatt ve üzerinde purpose-built liquid architecture çoğu projede central design path haline gelir. Daha yüksek rack-scale AI platformlarında ise OEM-specific liquid requirements facility'yi doğrudan şekillendirir. Bunların hiçbiri standard threshold değildir.

ASHRAE W-class mapping bu planı facility temperature ile bağlar. Daha sıcak facility supply liquid class'ı, uygun climate'ta dry cooler veya waterside economizer kullanımını kolaylaştırabilir. Fakat CDU heat exchanger approach temperature unutulmamalıdır. IT equipment otuz iki derece supply kabul ediyor diye facility loop da aynı temperature'da çalışamaz; heat exchange için driving temperature difference gerekir.

Hydraulic balancing özellikle çok rack'li TCS network'lerinde kritiktir. Branch pressure drop, QD, hose, manifold ve cold plate characteristics modelde yer almalıdır. Pressure-independent control, calibrated orifice veya balancing valves kullanılabilir. Amaç yalnız toplam flow'u tutturmak değil, her rack'in minimum ve maximum flow envelope içinde kalmasını sağlamaktır.

Dew point ile warm-water strategy birlikte yönetilmelidir. Çok düşük coolant temperature condensation riskini artırabilir ve compressor dependency yaratabilir. Çok yüksek temperature ise IT platform limitlerini, approach margin'i veya peak ambient capacity'yi zorlayabilir. Golden operating point, yıllık energy ile worst-case capacity arasında dengelenir.

AI hall tasarımında bugün kullanılan platform kadar next refresh de düşünülmelidir. Current rack yüz kilowatt civarında iken birkaç yıl sonra aynı zone daha yüksek heat flux isteyebilir. Pipe diameter, CDU location, header reserve, structural routing ve heat rejection capacity yalnız bugünkü load'a göre freeze edilirse stranded infrastructure oluşabilir.

Bu yaklaşım capacity planning'i mechanical plant ile rack deployment arasında bağlar. Her yeni AI block için yalnız electrical megawatt reservation değil, required liquid flow, residual airflow, CDU port capacity, header velocity, heat rejection margin ve control-point capacity de reserve edilmelidir. Aksi halde electrical capacity mevcut olduğu halde hydraulic veya thermal interface dolduğu için yeni rack devreye alınamaz. Bu durum stranded electrical capacity'nin cooling tarafındaki karşılığıdır.

Sonuç olarak density technology selection için başlangıçtır, final answer değildir. Thermal architecture, rack distribution, liquid fraction, hydraulics, dew point, ASHRAE/OEM envelope ve future platform roadmap aynı model içinde çözüldüğünde güvenilir hale gelir.

---

## [K05-06] Resilience, controls, thermal ride-through ve commissioning

Cooling resilience elektrik resilience'ından daha az görünür olabilir, fakat özellikle liquid-cooled AI sistemlerinde outage behavior çok daha hızlı gelişebilir. Bir UPS dakikalarca enerji sağlayabilirken cold plate üzerindeki high-power processor flow kaybından sonra çok kısa sürede thermal limit'e yaklaşabilir. Bu nedenle UPS runtime ile cooling runtime aynı şey değildir.

Cooling failure domains chillers veya CRAC unit'lerle sınırlı değildir. Pumps, headers, valves, heat exchangers, CDUs, manifolds, sensors, control network, water source, refrigerant circuit ve power feeds ayrı ayrı incelenmelidir. Component redundancy ile path redundancy de ayrılmalıdır. N artı bir CRAH unit'i tek common chilled-water header'a bağlıysa header fault'u bütün yedek kapasiteyi etkileyebilir.

Liquid systems'da CDU özel önem taşır. Single CDU'nun internal pump redundancy'si olabilir, fakat common heat exchanger, controller veya upstream FWS path'i aynı blast radius içinde kalabilir. Bir CDU'nun yüzlerce rack beslemesi operasyonu basitleştirebilir; fakat failure consequence büyür. Zoning, isolation ve workload placement bu nedenle mechanical design ile birlikte çalışmalıdır.

Thermal ride-through stratejisi proje requirement'ına göre tanımlanmalıdır. UPS-backed CDU pumps ve controls, redundant pumps, pressure accumulator, stored chilled water, fast automatic transfer, workload throttling, checkpointing veya migration seçenekleri olabilir. Hiçbiri universal çözüm değildir. Actual IT platform ve TCS ile test edilmeden ride-through süresi varsayılmamalıdır.

Controls architecture da resilience'ın parçasıdır. Room cooling, chilled-water reset, pump differential pressure, CDU supply temperature ve rack flow control loops birbirine karşı hunting yapmamalıdır. Local equipment controller güvenli autonomous state'i korurken BMS veya DCIM supervisory visibility sağlamalıdır. Control network kaybında sistemin safe fallback behavior'ı önceden tanımlanmalıdır.

Leak event başka bir state'tir. QD leak, hose damage veya manifold fault yalnız sensor alarmı değildir. Detection, automatic isolation, branch blast radius, drip management, energized equipment proximity ve operator response birlikte tasarlanmalıdır. Leak probability kadar consequence önemlidir.

Commissioning bu nedenle steady-state temperature testinden daha geniş olmalıdır. Normal load, low load, design load, peak rack, one terminal unavailable, pump failure, CDU failure, heat rejection device failure, maintenance isolation, utility-to-generator transfer, control failure, leak alarm, return-to-normal ve expansion tie-in states test matrix'te yer almalıdır. Hybrid AI rack'te liquid ve residual air paths aynı anda doğrulanmalıdır.

Commissioning event chronology ayrıca önemlidir. Bir pump trip olduğunda standby pump start, CDU pressure recovery, rack flow stabilization, server throttling alarmı ve BMS notification'ın zaman sırası aynı clock reference üzerinden incelenmelidir. Sadece final temperature'ın normale dönmesi, transient sırasında equipment limitinin aşılmadığını kanıtlamaz. EPMS, BMS, CDU logs ve IT telemetry mümkün olduğunca korele edilerek gerçek system response doğrulanmalıdır.

Golden acceptance'ın amacı equipment'in tek tek çalıştığını göstermek değildir. System'in expected ve unexpected state'lerde workload'u nasıl koruduğunu kanıtlamaktır. Single failure'ın nerede durduğu, maintenance sırasında hangi capacity'nin kaldığı ve recovery'nin nasıl gerçekleştiği ölçülebilir olmalıdır.

Cooling architecture ancak controls narrative, alarm matrix, commissioning evidence ve SOP, MOP, EOP procedures aynı system behavior'ı tarif ettiğinde gerçekten resilient kabul edilebilir.

---

## [K05-07] Energy, water, retrofit, TCO ve hangi mimari ne zaman?

Cooling architecture'ın son kararı yalnız thermal capacity üzerinden verilmez. Energy, water, retrofit constraints, CAPEX, OPEX, serviceability ve future density aynı yatırım kararının parçalarıdır. En düşük PUE veya en yüksek rack density tek başına en iyi architecture'ı tanımlamaz.

PUE total facility energy ile IT equipment energy arasındaki ilişkiyi ölçer. Cooling Efficiency Ratio, yani CER, cooling system energy efficiency'ye daha doğrudan bakar. Water Usage Effectiveness, WUE, data center water intensity'sini ölçer. Energy Reuse Factor, ERF, facility'den tekrar kullanılan energy fraction'ını gösterir. Bu KPI'lar farklı soruları cevaplar. Çok düşük PUE fakat yüksek local water stress yaratan bir design, başka bir site için doğru olsa bile burada doğru olmayabilir.

Heat rejection selection bu trade-off'u doğrudan etkiler. Cooling tower ve water-cooled chiller energy açısından güçlü olabilir fakat consumptive water ve treatment ister. Dry cooler water footprint'i düşürür ama hot ambient'te larger footprint veya higher fluid temperature gerektirebilir. Warm-water direct-to-chip architecture compressor hours'i azaltabilir ve heat reuse opportunity yaratabilir; ancak actual OEM temperature class ve CDU approach bunu desteklemelidir.

Retrofit projelerinde mevcut facility genellikle technology choice'u sınırlar. Chilled water temperature, spare plant capacity, pipe route, slab loading, white-space geometry ve maintenance windows dikkate alınır. Existing air-cooled servers için rear-door güçlü bir transition olabilir. Facility water yoksa liquid-to-air CDU veya dedicated dry-cooler loop değerlendirilebilir. Legacy air ile new AI aynı hall'de bulunacaksa thermally segmented hybrid zones çoğu zaman daha gerçekçi olur.

Greenfield projede ise future interfaces baştan ayrılabilir. Lower-density air zones, high-density liquid zones, modular CDU blocks, expansion headers ve warm-water heat rejection aynı campus planına entegre edilebilir. Fakat tüm tesisi en yüksek density technology ile kurmak gereksiz CAPEX yaratabilir. Workload heterogeneity devam ettiği sürece hybrid architecture güçlü bir model olacaktır.

TCO hesabı terminal units ile bitmemelidir. Chillers, pumps, piping, CDUs, manifolds, controls, leak detection, water treatment, fluid sampling, spares, commissioning, service labor ve replacement cycle dahil edilmelidir. Aynı şekilde liquid cooling air infrastructure'ı küçültebilir; bu nedenle “liquid daha pahalıdır” veya “daha ucuzdur” şeklinde boundary'siz cümleler anlamsızdır.

Son karar için SpecBridge zinciri workload'dan başlar. IT environmental requirement ve rack density belirlenir. Air'in peak load'u kabul edilebilir fan energy ile taşıyıp taşıyamadığı sorulur. Liquid gerekiyorsa heat capture ratio ve residual air doğrulanır. TCS, FWS ve CDU architecture kurulup climate'a uygun heat rejection seçilir. Sonra water, energy, resilience, thermal ride-through, maintenance ve expansion states doğrulanır.

Decision process procurement strategy'yi de etkiler. Standardized modular CDU veya dry-cooler blocks phasing'i hızlandırabilir; ancak proprietary controls, manifold interfaces veya coolant formulations vendor lock-in yaratabilir. Site-specific plant daha esnek olabilir fakat engineering ve commissioning burden'ı büyütür. Bu nedenle lifecycle decision matrix yalnız first cost ve efficiency değil, replacement path, alternate vendor possibility, spare strategy ve operating skill availability gibi seçenek değerlerini de içerir.

Golden cooling architecture, bugün çalışabilen system değil; next IT refresh geldiğinde de controlled şekilde büyüyebilen system'dir. Yatırımın değeri en güçlü cooling product'ta değil, thermal chain'in bütün life cycle boyunca ölçülebilir, maintainable ve adaptable olmasındadır.
