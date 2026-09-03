# DC-K13 — Enterprise Storage & NVMe-oF — Full Narration TR V2

## [K13-00] Enterprise storage gerçekte ne sağlar?

Enterprise storage konuşulurken ilk hata, konuyu doğrudan bir array modeli, kapasite değeri ya da disk tipiyle başlatmaktır. Oysa gerçek tasarım sorusu şudur: Bir iş yükünün verisi hangi erişim modeliyle, hangi performans hedefiyle, hangi hata durumlarında, hangi kurtarma taahhüdüyle ve hangi operasyon süreciyle hizmet alacak? Bu nedenle enterprise storage, disklerin ve kontrolcülerin toplamı değil; workload ile kalıcı veri arasındaki uçtan uca hizmet zinciridir.

Bu zincir host işletim sistemiyle başlar. Uygulama blok, dosya ya da nesne semantiği üzerinden veri ister. Host stack bu isteği ilgili protokole dönüştürür. Ardından transport ve fabric katmanı devreye girer. Sonra storage subsystem isteği karşılar, cache ve medya katmanına erişir, protection politikasını uygular ve gerektiğinde replication, snapshot, encryption, telemetry ve management işlevlerini işletir. Bu zincirdeki herhangi bir ortak hata noktası, kağıt üzerinde çift kontrolcü veya çift bağlantı varmış gibi görünse bile gerçek dayanıklılığı düşürebilir.

Bu yüzden enterprise storage değerlendirmesinde controller sayısı tek başına anlamlı değildir. İki kontrolcü aynı power domain, aynı backplane, aynı enclosure veya aynı management domain üzerinden bağımlıysa, sistemin görünür yedekliliği ile gerçek failure-domain bağımsızlığı aynı şey değildir. Aynı mantık fabric için de geçerlidir. İki kablo kullanmak dual fabric anlamına gelmez. İki yolun aynı switch stack, aynı uplink veya aynı bakım penceresine bağımlı olması gerçek bağımsızlığı azaltabilir.

Enterprise storage tasarımının doğru başlangıç noktası workload ve service objective’tir. Gereken IOPS, throughput, average latency değil tail latency, write durability, RPO, RTO, maintenance davranışı ve growth modeli netleştirilmelidir. Ardından kapasite modelinin raw, usable, resilient usable ve effective gibi ayrı kavramlarla ifade edilmesi gerekir. Protection overhead, spare policy, rebuild reserve ve operasyonel boş alan ayrı ayrı ele alınmalıdır.

Bir diğer kritik konu degraded-state davranışıdır. Sistem sağlıklıyken elde edilen performans, gerçek iş sürekliliğini kanıtlamaz. Controller failure, node failure, fabric loss, drive failure, rebuild, replication catch-up veya firmware upgrade sırasında uygulamanın gördüğü gecikme ve throughput kabul kriterlerinin parçası olmalıdır. Çünkü enterprise storage’ın değeri yalnız normal durumda hızlı çalışması değil, hata ve bakım sırasında da öngörülebilir davranmasıdır.

Golden yaklaşım şu zinciri izler: workload ve data model, erişim protokolü, performans hedefi, kapasite modeli, availability ile RPO ve RTO, storage architecture, transport ve fabric, host multipath, failure domains, data services, security, operations, degraded-state acceptance ve son olarak TCO ile BoQ freeze. Bu zincir korunursa teknoloji seçimi daha sonra yapılır ve daha doğru yapılır. Yani storage tasarımında ilk soru hangi ürünü alacağımız değil, hangi veri hizmetini hangi koşullarda garanti edeceğimizdir.

## [K13-01] Scale-up, scale-out ve controller mimarileri

Enterprise storage platformlarını anlamak için ilk temel ayrımlardan biri scale-up ve scale-out mimarisidir. Scale-up tasarımda kapasite veya port sayısı çoğunlukla belirli bir controller domain arkasında büyür. Bu model operasyonel olarak sade, yönetilebilir ve öngörülebilir olabilir. Ancak controller CPU, cache, back-end bandwidth, enclosure sayısı ve toplam kapasite gibi sınırlar vardır. Bu sınırlar başlangıç BoQ’sunda görünmese bile üç ya da beş yıllık büyüme planında kritik hale gelir.

Scale-out tasarımda ise yeni storage node’ları eklenerek kapasite ve çoğu zaman aggregate throughput büyütülür. Fakat node eklemek otomatik olarak lineer performans artışı anlamına gelmez. Metadata, cluster coordination, east-west traffic, rebalance, quorum ve failure-domain placement gibi unsurlar performans ve dayanıklılığı etkiler. Bu nedenle scale-out sistemlerde yalnız node başına kapasite değil, cluster davranışı ve büyüme sırasında oluşan yeniden dağıtım yükü de ölçülmelidir.

Controller mimarilerinde de pazarlama terimlerine dikkat etmek gerekir. Active-active ifadesi her host yolunun aynı anda aynı performansla kullanılabildiği anlamına gelmeyebilir. Bazı sistemlerde belirli LUN veya namespace için preferred owner vardır ve diğer yollar erişilebilir ama optimized değildir. Bazı yapılarda failover sonrası ownership değişir. Bu nedenle host’un gerçek gördüğü path state, controller failure sırasında I/O’nun nasıl yönlendiği ve failback sırasında yaşanan kesinti doğrudan test edilmelidir.

Shared-media ve shared-nothing ayrımı da önemlidir. İki controller aynı disk enclosure’a erişebilir veya iki node kendi medyasını taşıyabilir. Her iki modelin de avantajları vardır; fakat failure-domain analizi farklıdır. Shared back-end component, cache mirroring, common metadata store veya inter-controller link gibi unsurların kesilmesi halinde davranış bilinmelidir. Tek bir komponentin iki kontrolcüyü birlikte etkileyip etkilemediği kabul testinde doğrulanmalıdır.

Unified ya da multiprotocol storage platformları blok, file ve object servislerini aynı sistemde sunabilir. Bu operasyonel konsolidasyon sağlayabilir; ancak üç servisin aynı performans, security ve availability davranışına sahip olduğu varsayılmamalıdır. File metadata işlemleri, block latency ve object namespace davranışı farklı olabilir. Her protokol için ayrı workload profili, ayrı acceptance ve gerekirse ayrı QoS policy tanımlanmalıdır.

Enterprise storage tasarımında controller sayısı, node sayısı, cache büyüklüğü ve port sayısı sadece fiziksel sayılardır. Mühendislik kararı bunların arkasındaki davranışı anlamaktır. Failover süresi, cache persistence, host path transition, upgrade süreci, rebalance davranışı ve support matrix birlikte değerlendirilmelidir. Ayrıca growth senaryosunda eklenen her enclosure veya node’un power, rack, fabric portu, lisans ve support maliyeti BoQ içine dahil edilmelidir.

Doğru karar çerçevesi şöyledir: başlangıç yükü ve üç yıllık büyüme, latency ve throughput SLO, failure-domain hedefi, maintenance modeli, replication gereksinimi ve operasyon ekibinin yetkinliği belirlenir. Ardından scale-up veya scale-out mimarinin hangisinin bu gereksinimlere daha düşük riskle uyduğu ölçülür. Böylece mimari seçim bir ürün karşılaştırması olmaktan çıkar ve gerçek hizmet tasarımına dönüşür.

## [K13-02] NVMe mimarisi, namespace ve subsystem mantığı

NVMe çoğu zaman yalnız daha hızlı SSD protokolü gibi anlatılır. Bu eksik bir tanımdır. NVMe modern depolama için host ile non-volatile memory subsystem arasındaki iletişimi tanımlayan geniş ve modüler bir mimaridir. Queue-based çalışma modeli, yüksek paralellik ve düşük software overhead onun temel özelliklerindendir. Ayrıca bugün NVMe yalnız PCIe üzerinden yerel disk erişimi için değil, farklı fabric transport’ları üzerinden paylaşımlı storage erişimi için de kullanılmaktadır.

NVMe içinde namespace önemli bir kavramdır. Namespace host’a sunulan mantıksal storage alanıdır. Fakat bir namespace fiziksel bir SSD ile bire bir aynı şey değildir. Bir NVM subsystem birden fazla controller, birden fazla namespace ve farklı transport endpoint’leri içerebilir. Bu nedenle host’un gördüğü logical namespace ile alttaki physical failure domain arasında doğrudan eşitlik kurmak doğru değildir.

NVMe’nin queue yapısı performans tasarımında önemli sonuçlar doğurur. Host tarafında submission ve completion queue’ları kullanılır. Yüksek parallelism sayesinde çok sayıda outstanding I/O verimli şekilde işlenebilir. Ancak bu aynı zamanda queue depth, CPU affinity, NUMA locality, interrupt processing ve driver davranışının performansı etkileyebileceği anlamına gelir. Bir sistemin katalogda milyonlarca IOPS desteklemesi, uygulamanın bu performansı gerçek host topolojisinde alacağı anlamına gelmez.

Enterprise storage tarafında NVMe’nin bir başka önemli yönü management modelidir. NVMe Management Interface ile discovery, monitoring, configuration ve firmware lifecycle gibi işlemler standardize edilmeye çalışılır. Bu nedenle storage acceptance yalnız data path testi olmamalıdır. Controller health, media health, firmware inventory, telemetry, error counters ve management-plane erişimi de operasyon tasarımının parçasıdır.

Güncel NVMe ailesi yalnız standart NVM command set ile sınırlı değildir. Zoned Namespace, Key Value, Computational Programs ve Subsystem Local Memory gibi ek command set’ler de vardır. Her enterprise storage tasarımında bunların kullanılması gerekmez. Ancak bu yapı NVMe’nin tek bir disk protokolünden çok daha geniş ve gelişebilir bir mimari olduğunu gösterir.

Bir diğer kritik ayrım NVMe ile NVMe-oF arasındadır. NVMe command semantics ile bu command’lerin hangi transport üzerinden taşındığı farklı katmanlardır. Host local PCIe üzerinden NVMe device’a bağlanabilir veya aynı NVMe command yapısı TCP, RDMA ya da Fibre Channel fabric üzerinden uzak storage subsystem’e taşınabilir. Bu yüzden NVMe kullanmak otomatik olarak NVMe-oF kullanmak anlamına gelmez.

Acceptance aşamasında host driver sürümü, operating system destek seviyesi, multipath implementation, controller firmware ve storage software birlikte dondurulmalıdır. Bir ürünün NVMe destekli olması tek başına yeterli değildir. Gerçek üretim tasarımında supported matrix doğrulanmalıdır. Böylece NVMe’nin performans avantajları operational compatibility ve lifecycle riskleriyle dengelenir.

Golden sonuç şudur: NVMe bir teknoloji etiketi değil, host, queue, namespace, subsystem, transport ve management katmanlarından oluşan bir sistemdir. Doğru enterprise storage tasarımı bu katmanların her birini görünür hale getirir ve ayrı ayrı kabul eder.

## [K13-03] NVMe over Fabrics: TCP, RDMA ve Fibre Channel

NVMe over Fabrics, NVMe command modelini yerel PCIe sınırının dışına çıkararak host ile merkezi storage arasında fabric üzerinden çalıştırır. En önemli avantajı, NVMe semantiğini korurken shared enterprise storage modeline ulaşabilmesidir. Ancak NVMe-oF tek bir transport değildir. TCP, RDMA ve Fibre Channel farklı operasyon modelleri, farklı altyapı bağımlılıkları ve farklı failure davranışları getirir.

NVMe over TCP, mevcut Ethernet ve IP operasyon deneyiminden yararlanabilmesi nedeniyle birçok ortam için pragmatik bir seçenektir. TCP stack kullanır ve RDMA zorunluluğu yoktur. Bu, tasarımı basitleştirebilir ama ağ mühendisliğini ortadan kaldırmaz. Yeterli bandwidth, düşük congestion, doğru routing, redundant switch path, tutarlı MTU, host CPU headroom ve latency visibility yine gereklidir. TCP retransmission veri bütünlüğünü koruyabilir ama tail latency üzerinde ciddi etkiler yaratabilir.

NVMe over RDMA, memory-to-memory transfer mekanizmalarını kullanarak software ve CPU overhead’ini azaltmayı hedefler. Düşük latency ve yüksek throughput isteyen iş yükleri için güçlü olabilir. Buna karşılık fabric engineering daha hassastır. Kullanılan RDMA teknolojisine göre NIC firmware, switch behavior, congestion handling, PFC veya ECN gibi mekanizmalar ve end-to-end interoperability dikkatle tasarlanmalıdır. Sadece NIC veya switch’in RDMA capable olması, fabric’in production-ready olduğu anlamına gelmez.

NVMe over Fibre Channel ise mevcut FC operasyon disiplinini korumak isteyen kurumlar için anlamlı olabilir. Dual fabric, zoning, HBA lifecycle ve SAN governance yaklaşımı devam ederken üst storage command path NVMe olabilir. Fakat mevcut FC altyapısının otomatik olarak NVMe/FC ready olduğu varsayılmamalıdır. HBA firmware, switch code, target support ve host multipath davranışı destek matrisi içinde doğrulanmalıdır.

Bu üç transport arasında seçim yapmak için yalnız latency benchmark’ına bakmak doğru değildir. Asıl değerlendirme workload latency ve CPU sensitivity, mevcut fabric yatırımı, ekip yetkinliği, failure-domain modeli, scale hedefi, troubleshooting süreci, security yaklaşımı ve lifecycle maliyetidir. Örneğin laboratuvarda en düşük latency veren çözüm, kurumun operasyon ekibi tarafından yönetilemiyorsa üretim riskini artırabilir.

Fabric redundancy de transport’tan bağımsız bir prensiptir. Kritik storage path’leri bağımsız switch, power ve uplink domain’lerine dağıtılmalıdır. İki network port aynı switch’e bağlıysa path redundancy vardır ama fabric independence yoktur. Aynı şekilde iki switch aynı upstream veya aynı power feed’e bağımlıysa ortak hata noktası devam eder.

Performance acceptance sırasında yalnız healthy-state throughput değil, tek fabric kaybı sırasında kalan path’lerin yükü de test edilmelidir. Normal durumda yüzde elli yükte çalışan iki fabric, biri kaybolduğunda kalan fabric’i yüzde yüz veya daha yüksek yükte çalıştırabilir. Bu nedenle degraded-state bandwidth headroom tasarımın parçasıdır.

Sonuç olarak NVMe-oF seçiminde amaç en yeni transport’u kullanmak değildir. Amaç workload, network, operations ve lifecycle açısından en öngörülebilir hizmeti sağlamaktır. Doğru seçim, teknoloji markasından değil uçtan uca tasarım zincirinden çıkar.

## [K13-04] Discovery, multipath, ANA ve host entegrasyonu

Enterprise storage’ın güvenilirliği büyük ölçüde host ile storage arasındaki path yönetimine bağlıdır. Bir host’un birden fazla bağlantı görmesi tek başına high availability anlamına gelmez. Bu yolların doğru keşfedilmesi, doğru kimlikle eşleşmesi, path state’lerinin doğru yorumlanması ve failure sırasında I/O’nun güvenli biçimde başka yola aktarılması gerekir.

NVMe-oF ortamında subsystem ve host identity kritik altyapı verisidir. Host NQN ve subsystem NQN değerleri kalıcı ve kontrollü şekilde yönetilmelidir. Otomatik cloning, yanlış template kullanımı veya duplicate identity, erişim ve güvenlik sorunları yaratabilir. Bu nedenle naming standardı, host onboarding ve offboarding süreci storage operasyonunun parçasıdır.

Discovery küçük ortamlarda statik olabilir, fakat ölçek büyüdükçe yönetilebilir discovery mekanizması gerekir. Hangi host’un hangi subsystem’i görebildiği, hangi namespace’lere eriştiği ve bu ilişkinin hangi policy ile tanımlandığı izlenebilir olmalıdır. Stale record’lar veya unutulmuş host izinleri hem operasyon hem güvenlik riski oluşturur.

Multipathing ise yalnız çoklu path varlığı değil, doğru failover davranışıdır. Acceptance sırasında host port failure, storage port failure, switch failure, controller failure ve link flap senaryoları uygulanmalıdır. Uygulama I/O’su durmamalı, veri bozulmamalı ve stall süresi kabul edilen sınır içinde kalmalıdır. Ardından path geri geldiğinde failback davranışı da gözlenmelidir. Failover başarılı olup failback sırasında uzun kesinti yaşanması kabul edilemez.

NVMe tarafında Asymmetric Namespace Access benzeri mekanizmalar host’a path’in optimize olup olmadığı hakkında bilgi verebilir. Ancak bu bilgi gerçek failure-domain tasarımının yerine geçmez. Bir path optimized olabilir ama diğer path aynı storage node, aynı backplane veya aynı power domain’e bağlı olabilir. Bu nedenle logical path state ile physical dependency birlikte incelenmelidir.

Host stack support matrix burada belirleyicidir. İşletim sistemi sürümü, kernel, NVMe driver, multipath implementation, HBA veya NIC firmware, storage controller software ve switch code birlikte test edilmelidir. Bir bileşenin ayrı ayrı desteklenmesi kombinasyonun tamamının support edildiği anlamına gelmez. Production acceptance bu kombinasyonu freeze etmelidir.

Virtualization ve container ortamlarında host entegrasyonu daha da karmaşıklaşabilir. Hypervisor storage stack, CSI driver, persistent volume lifecycle ve node topology awareness gibi ek katmanlar devreye girer. Bu nedenle storage array üzerinde path sağlıklı görünürken uygulama tarafında volume attach veya failover problemi yaşanabilir. Testler yalnız array GUI üzerinden değil workload seviyesinde yapılmalıdır.

Golden yaklaşım host-to-data yolunu tek bir sistem olarak ele alır. Identity, discovery, authorization, multipath, path optimization, failover, failback ve support matrix birlikte kabul edilir. Böylece gerçek availability kablo sayısıyla değil, uygulamanın hata sırasında nasıl davrandığıyla ölçülür.

## [K13-05] Performance: IOPS, throughput, latency ve degraded state

Enterprise storage performansında en sık yapılan hata, tek bir büyük IOPS değerini performansın özeti olarak kabul etmektir. Oysa gerçek performans; block size, read/write mix, random veya sequential davranış, queue depth, host count, path count, dataset size, cache durumu ve data reduction gibi çok sayıda değişkenin sonucudur. Bu nedenle katalogdaki IOPS değeri doğrudan uygulama performansına çevrilemez.

IOPS ve throughput birbiriyle ilişkilidir. Küçük bloklarla yüksek IOPS mümkündür, ancak büyük bloklarda aynı IOPS değeri çok daha yüksek bandwidth gerektirir. Aynı şekilde latency queue depth arttıkça değişir. Daha fazla outstanding I/O throughput’u artırabilir ama tail latency’yi de yükseltebilir. Bu nedenle acceptance testinde yalnız peak throughput değil hedeflenen latency SLO ile birlikte sonuç ölçülmelidir.

Average latency çoğu kritik uygulama için yeterli değildir. Database, virtualization ve distributed system gibi iş yüklerinde p95, p99 hatta p99.9 latency daha anlamlı olabilir. Sistem ortalama iki milisaniye gösterirken küçük bir I/O yüzdesi yüz milisaniye üzerinde kalıyorsa kullanıcı deneyimi veya transaction latency ciddi etkilenebilir.

Cache davranışı da doğru anlaşılmalıdır. Write cache kısa benchmarklarda çok güçlü sonuç üretebilir. Fakat cache dolduğunda, destage başladığında veya backend media yoğunlaştığında performance değişebilir. Bu nedenle sustained workload testleri cache warm-up ve destage baskısı altında yapılmalıdır. Ayrıca write acknowledgement’ın gerçekten durable olup olmadığı power-loss protection ve cache persistence ile doğrulanmalıdır.

NVMe-oF transport seçimi performansın sadece bir parçasıdır. TCP ortamında CPU overhead, retransmission ve congestion etkili olabilir. RDMA ortamında network loss veya congestion mekanizmaları tail latency’yi değiştirebilir. FC ortamında fabric oversubscription veya ISL darboğazı görülebilir. Bu yüzden transport benchmark’ı ile storage subsystem benchmark’ı ayrı değil uçtan uca birlikte ele alınmalıdır.

Degraded-state testleri enterprise acceptance’ın temelidir. Bir controller kaybolduğunda, bir fabric kapandığında veya rebuild çalışırken sistem hâlâ hedeflenen application SLO’yu karşılamalıdır. Özellikle iki fabric normalde yüzde elli yükle çalışıyorsa tek fabric kaybında kalan altyapının tam yükü taşıması gerekir. Aynı mantık controller CPU ve back-end path için de geçerlidir.

Performance test raporunda her sonuçla birlikte block size, read/write mix, random/sequential oranı, queue depth, host count, path count, dataset size, data reduction state, cache state, failure veya rebuild durumu, test süresi, IOPS, throughput ve percentile latency yer almalıdır. Bu bilgiler yoksa sonuç procurement-grade evidence değildir.

Golden sonuç şudur: performans sayısı tek başına kabul kriteri değildir. Doğru enterprise storage performansı, gerçek workload profilinde ve hata durumlarında sürdürülebilir, ölçülebilir ve tekrarlanabilir davranıştır.

## [K13-06] Protection, replication, security ve cyber resilience

Enterprise storage yalnız veriyi hızlı sunmak için değil, veriyi kayıp ve bozulmaya karşı korumak için de tasarlanır. Protection katmanı RAID, replication, erasure coding, snapshot, backup ve cyber recovery gibi farklı mekanizmalardan oluşabilir. Bu mekanizmaların amaçları farklıdır ve birbirinin yerine geçmez.

RAID veya erasure coding media failure’a karşı koruma sağlayabilir ama site failure, ransomware veya yanlış silme gibi riskleri tek başına çözmez. Snapshot hızlı restore noktaları sunabilir ama çoğu durumda aynı storage platformunun control plane’ine bağımlıdır. Replication ikinci sistemde veri kopyası oluşturur ama kaynakta oluşan logical corruption veya malicious deletion hedefe de taşınabilir. Bu yüzden high-value workload için bağımsız backup ve gerektiğinde cyber recovery katmanı gereklidir.

Replication tasarımında synchronous ve asynchronous ayrımı iyi anlaşılmalıdır. Synchronous replication write acknowledgement davranışını ve latency budget’ını etkiler. Asynchronous replication ise RPO’yu replication lag ve network koşullarıyla ilişkilendirir. Her iki durumda da failover ve failback süreçleri operasyonel olarak test edilmelidir. Özellikle metro veya stretched storage mimarilerinde quorum, witness, split-brain prevention ve inter-site latency kritik hale gelir.

Security tarafında yalnız network isolation veya zoning yeterli değildir. Host ve storage arasında explicit identity ve authorization olmalıdır. NVMe-oF dünyasında host/subsystem authentication mekanizmaları, credential lifecycle ve destek matrisi birlikte değerlendirilmelidir. Bir transport’un authentication özelliği desteklemesi, tüm host ve target kombinasyonunda üretim için hazır olduğu anlamına gelmez.

Encryption at rest, encryption in flight ve key management ayrı gereksinimlerdir. Storage controller üzerinde at-rest encryption aktif olabilir ama fabric üzerindeki trafik şifreli olmayabilir. Aynı şekilde transport encryption kullanılabilir fakat key lifecycle kötü yönetiliyorsa operasyon riski oluşur. Key rotation, backup, escrow, failover ve disaster recovery sırasında key erişimi test edilmelidir.

Management plane security de kritik önemdedir. RBAC, MFA, audit logging, API token yönetimi, certificate lifecycle, firmware signing ve break-glass prosedürü storage acceptance içine dahil edilmelidir. Çünkü storage control plane ele geçirilirse snapshot, replication ve hatta immutable policy’ler ortak risk altında kalabilir.

Cyber resilience için ideal yaklaşım katmanlıdır. Primary storage üzerinde snapshot ve immutable capability bulunabilir. İkinci storage veya backup system üzerinde ayrı copy tutulabilir. Daha kritik ortamlarda isolated cyber recovery repository veya vault devreye girer. Amaç tek control plane veya tek credential domain altında bütün kopyaları toplamamaktır.

Golden sonuç, protection ve security’yi ayrı özellik listeleri değil aynı risk mimarisinin parçaları olarak ele almaktır. Verinin yalnız bugün erişilebilir olması değil, hata, saldırı ve operasyon hatası sonrasında güvenilir biçimde geri getirilebilir olması gerekir.

## [K13-07] Acceptance, lifecycle, TCO ve BoQ freeze

Enterprise storage projesi ürün teslimiyle bitmez. Gerçek kabul, sistemin production lifecycle boyunca nasıl çalışacağının doğrulanmasıyla tamamlanır. Bu nedenle acceptance planı healthy-state performanstan çok daha geniş olmalıdır. Host path failure, switch failure, controller failure, drive failure, rebuild, firmware maintenance, replication interruption, capacity pressure ve security event senaryoları test edilmelidir.

Nondisruptive upgrade ifadesi katalogdan kabul edilmemelidir. Controller veya node upgrade sırasında host path’lerin nasıl değiştiği, multipath stack’in nasıl tepki verdiği ve application latency’nin ne kadar yükseldiği ölçülmelidir. Aynı şekilde switch firmware, HBA veya NIC firmware ve operating system upgrade’leri support matrix üzerinden planlanmalıdır. Storage lifecycle birden fazla vendor ve software component içerdiği için compatibility yönetimi kritik hale gelir.

Telemetry acceptance da önemlidir. Capacity, latency percentile, IOPS, throughput, queue depth, cache state, controller health, path state, media health, replication lag ve rebuild progress görünür olmalıdır. Hata anında monitoring kayboluyorsa operasyon ekibi root cause bulmakta zorlanır. Bu nedenle observability sisteminin de failure sırasında ayakta kalması gerekir.

BoQ freeze yapılırken yalnız array model ve disk sayısı yazmak yeterli değildir. Controller veya node count, cache, media capacity ve endurance, raw ve resilient usable capacity, protection policy, port count ve speed, HBA veya NIC, switch bağımlılıkları, optics, replication ve encryption lisansları, management API gereksinimi, host support matrix, support term ve growth limitleri açıkça tanımlanmalıdır.

Capacity tarafında başlangıç ve ultimate requirement ayrı yazılmalıdır. İlk gün için yeterli olan sistem üç yıl sonra controller limitine, enclosure limitine veya fabric bandwidth sınırına ulaşabilir. Expansion unit economics değerlendirilmelidir. Sonraki kapasite artışında lisans, shelf, node, port, rack space ve power maliyetleri birlikte hesaplanmalıdır.

TCO yalnız acquisition cost değildir. Support renewal, software subscription, fabric port, optics, rack ve power, operational labor, backup, replication bandwidth, upgrade ve migration maliyetleri toplam maliyetin parçasıdır. Ayrıca platform değişimi gerektiğinde exit cost ve data migration riski de hesaba katılmalıdır.

Formal acceptance matrix en az şu senaryoları kapsamalıdır: healthy workload SLO, tek host path kaybı, tek fabric kaybı, controller veya node kaybı, drive failure ve rebuild, firmware maintenance, path restoration, replication interruption ve recovery, capacity reserve sınırına yaklaşma, telemetry continuity, authentication behavior ve gerekli ise backup restore handoff.

Son Golden kural şudur: Enterprise storage ancak host’tan veriye kadar tüm hizmet yolu sağlıklı, failed ve maintenance state’lerinde ölçülebilir, support edilebilir ve öngörülebilir davranıyorsa kabul edilir. NVMe-oF ise yalnız daha yeni olduğu için değil, transport, host stack, fabric, operations ve lifecycle birlikte gerçek hizmeti iyileştirdiğinde seçilmelidir.
