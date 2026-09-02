# DC-K11 — HCI — Full Narration TR V2

Bu metin DC-K11 Golden Deep Research için uzun-form S3F seslendirme kaynağıdır. Quick Brief ayrı bir üretim modu olarak hazırlanacaktır. Full Briefing sekiz chapter üzerinden HCI mimarisini dağıtık sistem, failure domain, kapasite, ağ, lifecycle ve karar mühendisliği açısından anlatır.

---

## [K11-00] HCI neden yalnızca server ve disk değildir?

Hyperconverged Infrastructure, yani HCI, ilk bakışta çok basit bir fikir gibi görünür. Aynı sunucuların içinde işlemci, bellek ve disk bulunur; bu sunucular bir cluster oluşturur; sanallaştırma ve depolama yazılımla yönetilir. Geleneksel üç katmanlı mimaride ayrı ayrı gördüğümüz compute, storage ve çoğu zaman storage network katmanları tek bir operasyonel platform altında birleşir. Fakat bu sade görünüm bizi yanlış sonuca götürmemeli. HCI, server ile diski aynı kasaya koymak değildir. HCI, fiziksel kaynakları dağıtık bir sistem davranışıyla bir araya getiren bir altyapı mimarisidir.

Geleneksel üç katmanlı yapıda compute host, storage array ve aradaki SAN ya da NAS altyapısı farklı sistemlerdir. Storage controller, cache, disk yerleşimi, RAID veya benzeri koruma mantığı array içinde çözülür. Compute host depolamayı dışarıdan tüketir. Converged Infrastructure bu katmanları önceden doğrulanmış bir çözüm olarak paketleyebilir ama compute ile storage mimari olarak hâlâ ayrıdır. HCI'da ise node üzerindeki local media, dağıtık storage software tarafından cluster genelinde paylaşılan bir veri katmanına dönüşür. Böylece aynı node hem workload çalıştırır hem de cluster storage hizmetine katkıda bulunur.

Tam da burada HCI'ın en önemli avantajı ve en önemli riski aynı noktada ortaya çıkar: kaynakların yakın entegrasyonu. Tekrarlanabilir node yapısı procurement, deployment, scaling ve lifecycle operasyonlarını kolaylaştırabilir. Ancak bir node kaybettiğinizde yalnızca CPU kaybetmezsiniz. Aynı anda memory, storage capacity, storage bandwidth, network endpoint ve bazen control-plane fonksiyonları da kaybolabilir. Bu nedenle HCI availability tasarımı yalnızca “kaç node var?” sorusuyla yapılamaz.

HCI'ın doğru tasarım birimi node sayısı değil, cluster state'tir. Normal durumda sistem ne kadar yük taşır? Bir node maintenance moduna alındığında ne olur? Aynı sırada ikinci bir drive arızalanırsa hangi veri yeniden oluşturulur? Network partition oluşursa quorum hangi tarafta kalır? Rebuild sırasında uygulama latency'si ne kadar yükselir? Bir rack veya ToR switch kaybedildiğinde storage replicas gerçekten başka failure domain'lerde midir? Bunların tümü HCI kararının parçalarıdır.

Bir başka kritik ayrım da Hyperconverged Infrastructure ile yalnızca software-defined storage kavramını eşitlememektir. Software-defined storage, local veya network-attached media'yı yazılım ile havuzlayabilir ve dağıtık veri servisleri sunabilir. HCI çoğu durumda bu SDS katmanını aynı compute node'ları üzerinde çalıştırır ve sanallaştırma ile lifecycle yönetimini de entegre eder. Fakat modern platformlarda disaggregated veya converged SDS seçenekleri de vardır. Compute node'ları ile storage node'ları ayrılabilir. Bu yüzden “HCI her zaman identical node'ların birlikte büyüdüğü sistemdir” cümlesi de artık evrensel değildir.

HCI'ın yönetimsel sadeliği, data plane'in fiziksel ve dağıtık karmaşıklığını ortadan kaldırmaz. Bir GUI üzerinden tek tıkla node eklemek kolay olabilir. Fakat arka planda data placement, replication, erasure coding, metadata, checksumming, cache, rebuild, rebalance, cluster membership ve network traffic devam eder. Tek bir yönetim paneli görmek, tek bir failure domain olduğu veya sistemin basit olduğu anlamına gelmez.

Bu nedenle SpecBridge yaklaşımında HCI kararı şu zincirle başlar: workload ve SLA, failure model, compute ve memory ihtiyacı, storage data layout, fiziksel failure-domain placement, east-west network, virtualization veya container entegrasyonu, data protection, maintenance ve rebuild reserve, lifecycle, failure testleri, TCO ve son olarak BoQ freeze. Vendor ve ürün bu zincirin başında değil, daha sonra gelir.

Bu chapter'dan çıkarılacak temel sonuç şudur: HCI bir appliance kategorisi değildir; dağıtık sistem davranışı gösteren bir altyapı mimarisidir. Doğru tasarım, normal durumda çalışan sistemi değil, arıza ve bakım durumlarında da tutarlı ve ölçülebilir biçimde hizmet vermeye devam eden cluster'ı tarif eder.

---

## [K11-01] HCI node, compute ve resource coupling

HCI mimarisini anlamanın ikinci adımı node'un ne olduğunu doğru tanımlamaktır. HCI node yalnızca bir virtualization host değildir. Aynı fiziksel server, workload compute kaynağı, distributed storage participant, network endpoint, management target ve bazen cluster control fonksiyonlarının taşıyıcısıdır. Bu nedenle node sizing yapılırken CPU, memory ve diskleri birbirinden bağımsız düşünmek ciddi hata yaratır.

Önce CPU tarafına bakalım. Geleneksel sizing çalışmasında toplam physical core sayısını, beklenen vCPU demand'i ve uygun overcommit oranını hesaplamak alışılmış yöntemdir. HCI'da buna platform overhead'i eklenir. Storage service checksum yapabilir, compression ve deduplication çalıştırabilir, metadata yönetebilir, erasure coding hesaplayabilir, rebuild sırasında yoğun veri taşıyabilir ve network stack üzerinde ek CPU tüketebilir. Eğer bütün core'ları guest workload'a tahsis edilmiş kabul edersek normal durumda bile gerçek kullanılabilir compute capacity'yi fazla hesaplarız. Arıza veya rebuild anında bu fark daha da büyür.

Memory için de aynı mantık geçerlidir. Hypervisor veya host OS, storage daemon'ları, cache, management appliance'ları, monitoring ve background service'ler memory kullanır. Installed RAM ile guest-usable RAM aynı şey değildir. Üstelik HCI availability tasarımında yalnız normal durumda boş memory değil, node failure sonrasında workload restart veya evacuation için kalan memory de önemlidir. Cluster yüzde doksan beş memory utilization ile çalışıyorsa dashboard normal görünebilir; fakat bir node kaybında pratik HA capacity kalmayabilir.

PCIe topolojisi de HCI ile ortadan kalkmaz. NVMe SSD'ler, high-speed NIC'ler, GPU veya DPU gibi accelerator'lar aynı socket ve lane bütçesini paylaşabilir. NUMA locality, PCIe switch yapısı ve device placement uygulama ile storage performansını etkileyebilir. Çok güçlü iki NIC ve çok sayıda NVMe drive bulunan bir node'un bütün bu aygıtları aynı anda line rate seviyesinde çalıştırabileceğini varsaymak doğru değildir. Platform topology ve actual workload birlikte test edilmelidir.

Local media kavramı da dikkatle ele alınmalıdır. Disk fiziksel olarak bir node'a bağlıdır ama veri yalnız o node'a ait olmak zorunda değildir. Distributed storage layer, data component'lerini cluster içindeki başka node'lara da yerleştirir. Bir local NVMe arızası, policy'ye bağlı olarak başka node'lardaki replica veya erasure-code fragment'lerinden onarılabilir. Bu yüzden fiziksel locality ile logical durability farklı kavramlardır.

All-flash HCI ifadesi de tek başına yeterli teknik tanım değildir. NVMe, SAS veya SATA media; cache ve capacity tier ayrımı; SSD endurance class; sustained latency; queue depth ve firmware davranışı workload sonucunu değiştirir. Aynı şekilde hybrid HCI'da SSD cache ile HDD capacity ekonomik avantaj sağlayabilir ama rebuild süresi, latency dağılımı ve cache dependency farklılaşır. Procurement dokümanında yalnız “all flash” veya “hybrid” yazmak yeterli değildir.

Resource coupling scaling kararını da etkiler. Classical symmetric HCI node eklediğinizde aynı anda CPU, RAM, storage ve NIC capacity eklersiniz. Eğer büyümenin çoğu storage tarafındaysa kullanılmayan CPU ve RAM oluşabilir. Eğer yalnız compute ihtiyacı artıyorsa gereksiz media satın alınabilir. Bazı modern platformlar compute-heavy, storage-heavy veya disaggregated node profilleriyle bu sorunu azaltır. Ancak mixed-node support varsa bile bu, her hardware kombinasyonunun desteklendiği anlamına gelmez. Compatibility matrix ve data-placement kuralları yine belirleyicidir.

GPU-enabled HCI konusunda da aynı disiplin gerekir. Bir node'a GPU takmak onu otomatik olarak AI factory yapmaz. VDI, inference veya belirli accelerated workloads için HCI uygun olabilir. Fakat büyük-scale training workload'ları GPU-to-GPU scale-up fabric, deterministic scale-out network, çok yüksek storage throughput, rack power ve liquid cooling gibi özel gereksinimler getirebilir. Bu noktada general-purpose HCI ile specialized AI infrastructure arasında ayrı karar vermek gerekir.

Edge ve ROBO senaryoları başka bir özel durumdur. İki veya üç node'lu küçük cluster fiziksel olarak sade görünür. Ancak bir node kaybının toplam kapasite üzerindeki yüzdesi çok büyüktür. Witness reachability, remote lifecycle, replacement logistics ve degraded-state autonomy daha kritik hale gelir. Küçük cluster her zaman daha kolay cluster değildir.

Kısacası HCI node'u procurement SKU'su olarak değil, çoklu kaynakların ve failure domain'lerin kesiştiği bir engineering block olarak görmek gerekir. CPU, memory, PCIe, media, network ve management overhead'i birlikte modellendiğinde gerçek usable compute ve storage ortaya çıkar. Bir sonraki chapter'da bu node'lardaki local media'nın nasıl distributed storage haline geldiğini ve raw capacity ile resilient usable capacity arasındaki farkı ele alacağız.

---

## [K11-02] Distributed storage, replicas, erasure coding ve usable capacity

HCI'ın kalbi distributed storage layer'dır. Local drive'ların cluster genelinde shared storage haline gelmesini sağlayan mekanizma budur. Bu katman yalnız capacity pooling yapmaz; data placement, resiliency, metadata, cache, checksum, rebuild ve rebalance gibi davranışları da belirler. Bu nedenle HCI storage sizing çalışması disk kapasitesini toplamaktan çok daha fazlasıdır.

İlk kavram data placement'tır. Her distributed system, verinin hangi node veya drive üzerinde tutulacağını belirlemek zorundadır. Bazı sistemler metadata map kullanır, bazıları policy-driven object placement uygular, bazıları deterministik algoritmalar kullanır. Ceph tarafındaki CRUSH yaklaşımı iyi bir vendor-neutral referanstır; host, rack, row veya room gibi failure domain'ler modele dahil edilebilir ve replica ya da erasure-code fragment'leri bu hiyerarşiye göre dağıtılabilir. Buradaki ders Ceph kullanmak zorunludur değildir. Asıl ders, physical topology'nin storage policy içinde temsil edilmesi gerektiğidir.

Replication en anlaşılır koruma yöntemlerinden biridir. Verinin iki veya üç tam kopyası farklı component'lerde tutulur. Bu, recovery davranışını sadeleştirir ve okuma erişilebilirliğini artırabilir. Bedeli ise kapasite overhead'i, write amplification ve network traffic'tir. İki replica bulunduğunu görmek, iki bağımsız arızaya dayanıldığı anlamına gelmez. İki kopya aynı rack, aynı PDU veya aynı ToR failure domain'i içindeyse correlated failure karşısında beklenen koruma sağlanmayabilir.

Erasure coding farklı bir yöntemdir. Data, data ve parity fragment'lerine ayrılır. Uygun k artı m düzenleri replication'a göre daha iyi kapasite verimliliği sağlayabilir. Buna karşılık hesaplama, network ve recovery complexity artabilir. Küçük random write workload'ları ile büyük sequential workload'lar aynı sonucu vermeyebilir. Bu nedenle “erasure coding daha verimli, dolayısıyla her workload için daha iyidir” demek doğru değildir.

Capacity konusunda üç ayrı sayı kullanılmalıdır. Raw capacity, drive nameplate kapasitelerinin toplamıdır. Usable capacity, resilience policy, metadata ve system reserve sonrasında kalan alandır. Resilient usable capacity ise tasarım failure veya maintenance durumu devam ederken rebuild ve growth headroom'u korunarak güvenli biçimde kullanılabilecek kapasitedir. SpecBridge açısından procurement freeze için en değerli sayı üçüncüsüdür.

Free space burada yalnız ekonomik boşluk değildir; reliability parameter'dır. Bir node veya drive kaybolduğunda distributed storage kayıp data component'lerini kalan media üzerine yeniden oluşturmak ister. Cluster fiziksel olarak yüzde doksan dokuz doluysa, arızayı onaracak alan kalmayabilir. Bu nedenle capacity warning threshold'ları ve operational headroom availability modelinin parçasıdır.

Cache architecture da kapasite ve durability yorumunu değiştirir. Write-back cache, read cache, persistent cache veya metadata cache farklı davranır. Cache tier yüksek performans sağlarken aynı zamanda failure dependency yaratabilir. Cache media endurance, power-loss protection ve failure recovery yolu doğrulanmalıdır. “NVMe cache var” cümlesi tek başına yeterli değildir.

Data reduction için de muhafazakâr yaklaşım gerekir. Compression ve deduplication oranı workload'a bağlıdır. Zaten sıkıştırılmış media, encrypted datasets veya bazı database pattern'leri düşük reduction gösterebilir. Vendor'ın “up to” oranını sizing multiplier olarak kullanmak risklidir. Başlangıç tasarımında conservative factor kullanılmalı, gerçek production telemetry geldikçe güncellenmelidir.

Thin provisioning ve snapshot'lar da capacity illusion yaratabilir. Logical provisioned capacity physical capacity'yi aşabilir. Snapshot başlangıçta küçük görünür ama change rate yüksek workload'larda hızlı büyüyebilir. Snapshot retention, backup retention ile karıştırılmamalıdır. Snapshot aynı system ve aynı administrative plane üzerinde kaldığı sürece bağımsız backup değildir.

Distributed storage'ın bir başka önemli davranışı rebuild'tir. Rebuild bir background job gibi görünse de aslında production workload'dır. Disk okur, network kullanır, CPU harcar ve target media'ya yazar. Uygulama workload'larıyla aynı resources üzerinde yarışır. Bu nedenle yalnız “rebuild tamamlandı” değil, rebuild sırasında P95 ve P99 application latency'nin ne olduğu da acceptance kriteridir.

Rebalance ise failure olmadan da meydana gelebilir. Yeni node eklendiğinde data distribution yeniden dengelenebilir. Bu işlem de network ve storage bandwidth tüketir. Node'un cluster'a join olması expansion'ın tamamlandığı anlamına gelmez; data health ve balance normal state'e dönmeden expansion acceptance verilmemelidir.

Bu chapter'ın ana sonucu şudur: HCI capacity planning raw terabyte hesabı değildir. Data layout, failure-domain placement, resilience overhead, conservative data reduction, free-space reserve, snapshot growth, rebuild traffic ve growth horizon birlikte değerlendirilmelidir. Bir sonraki chapter'da storage resilience'in üzerinde çalışan quorum, witness ve cluster failure-domain davranışını inceleyeceğiz.

---

## [K11-03] Quorum, witness ve failure domains

Distributed cluster yalnız veriyi dağıtmakla kalmaz; hangi node'ların cluster'ın geçerli üyeleri olduğuna da karar vermek zorundadır. Network partition veya partial failure sırasında iki ayrı grubun kendisini aynı anda authoritative sanması split brain riskini yaratır. Bu nedenle quorum, witness ve membership mekanizmaları HCI availability tasarımının merkezindedir.

Buradaki ilk önemli kural, quorum kelimesini tek bir mekanizma gibi kullanmamaktır. Compute cluster membership quorum'u, storage metadata quorum'u ve application-level quorum farklı sistemler olabilir. Bir witness cluster membership için oy sağlayabilir ama workload data taşımayabilir. Aynı şekilde application database kendi consensus mekanizmasına sahip olabilir. Dolayısıyla “witness var, sorun çözülür” demek yeterli değildir.

Odd node count yaklaşımı çoğu kişinin zihninde üç, beş veya yedi node gibi majority-friendly sayılarla ilişkilidir. Bu sezgi yararlıdır ama ürün davranışını açıklamaz. İki node'lu edge cluster bile desteklenen witness veya arbitration modeliyle güvenli çalışabilir. Buna karşılık üç node'lu bir cluster, kapasite veya physical placement yanlışsa istenen business availability'yi sağlayamayabilir. Node count, quorum correctness için tek başına kanıt değildir.

Witness rolünün ne taşıdığı da açıkça belgelenmelidir. Bazı platformlarda witness yalnız oy veya metadata taşır. Bazılarında farklı görevler olabilir. Witness'ın başka siteye, cloud'a veya bağımsız bir failure domain'e yerleştirilmesi availability'yi artırabilir; fakat witness connectivity ve DNS, routing, security gibi bağımlılıklar ortaya çıkar. Witness kaybında cluster'ın ne yapacağı acceptance testinde görülmelidir.

Failure domain modelini drive seviyesinden site seviyesine kadar çıkarmak gerekir. Drive, controller veya HBA path, node, chassis, ToR switch, rack, PDU veya power train, cooling zone, room ve site ayrı ayrı değerlendirilebilir. Storage policy replicas'ı farklı node'lara dağıtsa bile bu node'ların tamamı aynı rack ve aynı PDU üzerindeyse rack-level failure karşısında koruma yoktur.

Network burada doğrudan storage failure domain'idir. HCI node'ları physically sağlıklı olabilir ama east-west network partition bazı storage components'i unreachable hale getirebilir. Bu durumda cluster data consistency'yi korumak için bir tarafı durdurabilir. Availability tasarımında network failure, disk failure kadar gerçek bir senaryodur.

Management network failure ise farklı bir durum yaratabilir. Data plane çalışmaya devam ederken management erişimi kaybolabilir. Bu, workload'un hemen durduğu anlamına gelmez ama monitoring, lifecycle ve recovery operasyonlarını etkiler. Bu nedenle management availability ile workload data availability ayrılmalıdır.

HCI'ın kaynakları node üzerinde birleştirmesi fault propagation açısından da önemlidir. Bir node power loss, aynı anda CPU, memory ve storage contribution kaybına yol açar. Classical three-tier mimaride host failure storage capacity'yi düşürmeyebilir; HCI'da düşürebilir. Bu, HCI'ın kötü olduğu anlamına gelmez. Yalnız failure reserve hesabının daha bütüncül yapılması gerektiğini gösterir.

Common-mode software failure da physical failure kadar önemlidir. Cluster'daki tüm node'lar aynı firmware, driver veya storage software build'ini kullanıyorsa standardization operasyonel fayda sağlar, fakat aynı bug bütün cluster'ı etkileyebilir. Rolling upgrade, canary yaklaşımı, compatibility matrix ve rollback boundary bu nedenle availability control'üdür.

Stretched cluster tasarımlarında failure-domain konusu site seviyesine çıkar. İki site arasında synchronous veya near-synchronous data placement, witness ve site quorum tasarlanabilir. Fakat surviving site yalnız quorum'u kazanmakla yetinemez; required workload'u çalıştıracak CPU, RAM, storage ve network kapasitesine de sahip olmalıdır. Site-loss testinde yalnız cluster'ın “online” olması business service'in kullanılabilir olduğu anlamına gelmez.

FMEA çalışmasında node maintenance plus unexpected second fault gibi birleşik durumlar özellikle değerlidir. Sistem bir node maintenance'dayken ikinci node veya network path kaybederse ne olur? N artı bir ifadesi bu durumu otomatik açıklamaz. Aynı şekilde rebuild sırasında ikinci drive failure data policy'nin gerçek sınırını gösterir.

Bu chapter'ın Golden sonucu şudur: HCI resilience, replica sayısı veya node sayısıyla değil, logical data policy ile physical failure-domain mapping'in birlikte doğrulanmasıyla kanıtlanır. Quorum, witness, storage placement, network partition ve surviving capacity aynı acceptance modelinin parçalarıdır. Bir sonraki chapter'da bu distributed system'i taşıyan east-west network'ü ayrıntılı ele alacağız.

---

## [K11-04] HCI network architecture

HCI tasarımında network yalnız VM'lerin dış dünyaya bağlandığı access layer değildir. Network aynı zamanda distributed storage'ın veri yolu, cluster control mekanizmasının iletişim katmanı, live migration yolu, rebuild/rebalance taşıyıcısı, backup source path'i ve bazı tasarımlarda replication fabric'idir. Bu nedenle HCI network'ünü geleneksel server access network'ü gibi boyutlandırmak ciddi performans ve availability sorunlarına yol açabilir.

İlk konu east-west bandwidth'tir. Normal workload sırasında storage reads ve writes node'lar arasında hareket edebilir. Replica oluşturmak bir write'ı birden fazla node'a gönderebilir. Erasure coding fragment'leri network üzerinden dağıtabilir. Live migration memory page'lerini taşır. Rebuild veya rebalance yoğun bulk traffic yaratır. Aynı anda backup çalışabilir. North-south application traffic bu toplamın yalnız bir parçasıdır.

Bu nedenle port speed ile delivered throughput'u eşitlememeliyiz. Yüz gigabit Ethernet NIC takmak yüz gigabit application throughput garantisi değildir. PCIe ve NUMA topology, packet processing, protocol overhead, switch oversubscription, QoS, congestion ve storage software path sonucu belirler. Interface speed bir kapasite bileşenidir, performans sonucu değildir.

Redundancy için dual NIC sık kullanılır. Fakat iki NIC aynı ToR'a bağlıysa switch failure'a karşı redundant değildir. İki farklı ToR'a bağlı olsa bile ToR'lar ortak control plane veya ortak uplink bottleneck taşıyabilir. MLAG veya benzeri multi-chassis teknolojiler yararlı olabilir ama logical dual-homing'in altında hangi common-mode risklerin kaldığı bilinmelidir. Routed leaf tasarımları başka seçenekler sunabilir. Burada hedef belirli bir vendor topology değil, independent path ve deterministic failure behavior'dır.

RDMA bazı HCI platformlarında önemli rol oynar. Microsoft Storage Spaces Direct örneğinde SMB Direct ve RDMA önerilen yüksek performanslı storage network mekanizmaları arasındadır. RDMA CPU overhead ve latency avantajı sağlayabilir. Ancak bu durum bütün HCI sistemlerinin RDMA gerektirdiği anlamına gelmez. Platform support matrix authoritative olmalıdır.

RoCE kullanıldığında congestion ve loss engineering özel önem taşır. ECN, PFC veya platformun önerdiği queue configuration yanlışsa “RDMA enabled” olmak beklenen davranışı sağlamaz. iWARP farklı transport özelliklerine sahiptir. RDMA seçimi yalnız NIC feature checkbox'ı değildir; end-to-end fabric design kararıdır.

Oversubscription konusu özellikle rebuild sırasında görünür hale gelir. Normal workload düşük traffic üretiyorsa oversubscribed uplink yeterli görünebilir. Bir node kaybında cluster terabaytlarca veriyi yeniden oluştururken aynı uplink backup, replication veya kullanıcı trafiğini de taşıyabilir. Acceptance testleri yalnız normal benchmark değil, failure ve recovery trafiğini de kapsamalıdır.

MTU configuration basit ama kritik örneklerden biridir. Jumbo frame bazı workload'larda overhead'i azaltabilir. Ancak path üzerindeki bir switch veya interface farklı MTU kullanıyorsa intermittent fragmentation veya packet loss sorunları ortaya çıkabilir. End-to-end consistency, büyük MTU seçmekten daha önemlidir.

QoS da benzer şekilde configuration'da bulunmasıyla tamamlanmaz. Storage, management, migration, backup ve workload traffic class'larının congestion altında nasıl davrandığı ölçülmelidir. Bir backup job'ın storage latency'yi SLA dışına çıkarıp çıkarmadığı test edilmelidir.

Average latency yerine tail latency de önemlidir. Distributed storage birçok node ve path'e dokunduğu için bir slow path bütün I/O completion süresini etkileyebilir. P95, P99 ve gerektiğinde daha yüksek percentile'lar, jitter ve packet drop telemetry'si birlikte izlenmelidir. Green interface status, healthy HCI fabric kanıtı değildir.

Network maintenance de HCI maintenance event'idir. ToR upgrade, routing change veya cable migration storage path'i etkileyebilir. Network MOP hazırlanırken cluster health, data resync, VM migration ve rollback trigger'ları birlikte tanımlanmalıdır. Networking ve virtualization ekiplerinin ayrı change window yürütmesi, tek distributed system üzerinde çakışan risk yaratabilir.

Physical topology ile storage failure domain'leri de eşleşmelidir. Replica'lar farklı node'larda olsa da bu node'ların network bağlantıları aynı switch'e bağımlıysa gerçek failure-domain independence eksik kalabilir. Rack-aware placement, dual ToR ve upstream path design birlikte değerlendirilmelidir.

Bu chapter'ın sonucu şudur: HCI network, storage architecture'ın kendisidir. Bandwidth, latency, redundancy, congestion ve maintenance davranışı cluster availability ve data durability üzerinde doğrudan etkilidir. Bir sonraki chapter'da bu altyapının VM, Kubernetes, backup ve DR servisleriyle nasıl bütünleştiğini ele alacağız.

---

## [K11-05] VM, Kubernetes, backup ve DR

HCI en sık virtual machine workload'larıyla ilişkilendirilir çünkü compute ve distributed storage aynı platform içinde sıkı biçimde entegre edilir. Fakat VM çalıştırmak HCI'ın tek amacı değildir. Modern platformlar Kubernetes, container workloads, GPU-enabled services, backup integration ve site replication gibi ek katmanlar sunabilir. Burada kritik olan her abstraction layer'ın responsibility boundary'sini doğru korumaktır.

VM tarafında hypervisor CPU, memory, virtual network ve device lifecycle'ı yönetir. HCI storage ise virtual disk veya datastore benzeri storage objects için distributed data service sağlar. Bir VM başka node'a live migrate olduğunda compute locality değişebilir. Storage data aynı yerde kalabilir veya platform locality optimizasyonu uygulayabilir. Bu nedenle VM mobility ile storage resilience aynı kavram değildir.

HA restart da application availability ile karıştırılmamalıdır. Host kaybolduğunda surviving node'da VM restart edilebilir. Bu infrastructure recovery'dir. Uygulamanın database recovery, service discovery, cache warm-up veya application quorum ihtiyacı olabilir. VM yeniden boot oldu diye business transaction service anında healthy kabul edilemez.

Critical application replicas için affinity ve anti-affinity kuralları gerekir. İki database replica aynı HCI node üzerinde çalışıyorsa node failure ikisini birden kaybettirebilir. Anti-affinity farklı host'lara dağıtabilir; fakat host'ların aynı rack veya site failure domain'inde olması yine correlated risk yaratabilir. Application topology, HCI physical topology ile birlikte görülmelidir.

Kubernetes tarafında CSI önemli integration contract'ıdır. CSI, storage system'in persistent volume servislerini Kubernetes'e nasıl sunduğunu standardize eder. Ancak CSI support bir capability listesi değildir. Snapshot, clone, expansion, topology-awareness, multi-attach ve performance davranışı driver ve platforma göre değişir. Bu nedenle “CSI destekliyor” acceptance kriteri olarak yetersizdir.

StatefulSet veya başka Kubernetes controller'ları workload identity ve scheduling davranışı sağlar; underlying data durability'yi kendiliğinden sağlamaz. Persistent data'nın replica veya EC policy'si HCI storage layer'da çözülür. Backup ve application consistency ayrıca tasarlanır. Container restart, storage recovery ve application recovery üç farklı state olabilir.

VM ve container'ların aynı HCI cluster'da birlikte çalışması operational consolidation sağlayabilir. Ancak resource contention artabilir. Kubernetes system services, storage daemons, VMs ve container workloads aynı CPU, memory ve network kaynaklarını kullanabilir. Failure reserve ve performance acceptance bu mixed state üzerinde yapılmalıdır.

Data protection tarafında en kritik Golden ayrım şudur: HCI resilience backup değildir. Replica veya erasure code drive ve node failure'a karşı data availability sağlayabilir. Fakat administrator yanlışlıkla VM silerse, ransomware aynı management plane'i ele geçirirse veya application logical corruption üretirse bütün replicas aynı yanlış durumu koruyabilir.

Snapshot da backup değildir. Snapshot hızlı recovery point sağlayabilir ama çoğu durumda aynı storage system, aynı credentials ve aynı fault domain içinde bulunur. Bağımsız backup repository, immutable copy veya cyber recovery architecture farklı threat model'leri için gereklidir.

Backup data path performans etkisi yaratır. Büyük backup scan veya snapshot export storage read bandwidth ve network tüketebilir. Backup window cluster'ın normal workload davranışıyla birlikte test edilmelidir. Application-consistent backup gerekiyorsa guest veya database quiescing mekanizmaları da doğrulanmalıdır.

Replication ve DR tarafında synchronous ve asynchronous modeller farklı RPO ve latency trade-off'ları yaratır. Synchronous protection daha düşük data-loss exposure sağlayabilir ama latency ve link quality'ye daha hassastır. Asynchronous replication distance konusunda esnektir fakat nonzero RPO yaratır. Link degradation sırasında backlog büyümesi izlenmelidir.

Stretched cluster ise tek logical cluster'ı iki failure domain'e yayabilir. Bu architecture DR'ın bütününü çözmez. Witness placement, site interconnect, surviving-site capacity, network failover, DNS, security policy ve application sequencing hâlâ gereklidir. Independent backup da devam eder.

Gerçek DR acceptance, cluster'ın “site B online” demesiyle bitmez. Kullanıcıların uygulamaya erişebilmesi, correct network route'ların çalışması, database consistency'nin doğrulanması ve failback planının test edilmesi gerekir. RPO ve RTO business service seviyesinde ölçülmelidir.

Bu chapter'ın sonucu HCI'ın iyi bir infrastructure substrate olabileceği, fakat üst katman responsibility'lerini ortadan kaldırmadığıdır. VM HA, Kubernetes orchestration, storage resilience, backup ve DR birbirini tamamlayan ama birbirinin yerine geçmeyen katmanlardır. Bir sonraki chapter'da scale, lifecycle ve failure altında performans boyutuna geçeceğiz.

---

## [K11-06] Scale, lifecycle, operations ve performance under failure

HCI'ın en güçlü vaatlerinden biri scale-out kolaylığıdır. Yeni node eklenir, cluster capacity büyür ve platform data'yı yeniden dengeler. Bu model gerçekten operasyonel avantaj sağlayabilir. Ancak scale-out ile linear scale aynı şey değildir. Her node eklendiğinde application performance'ın tam aynı oranda artacağını varsaymak doğru değildir.

Classical symmetric HCI'da node compute, memory ve storage'ı birlikte ekler. Growth pattern dengeliyse bu çok verimlidir. Fakat storage üç kat hızla büyürken compute sabit kalıyorsa stranded CPU ve RAM ortaya çıkabilir. Tam tersi durumda gereksiz storage alınabilir. Bu nedenle TCO çalışmasında kullanılmayan resource'lar da maliyettir. Disaggregated veya storage-heavy ve compute-heavy node seçenekleri bu problemi azaltabilir ama support ve placement kuralları ayrıca doğrulanmalıdır.

Small cluster ile large cluster trade-off'u da önemlidir. Üç node'lu cluster'da bir node kaybı node sayısının üçte birini götürür. On iki node'lu cluster'da aynı single-node failure yüzde olarak daha küçüktür. Buna karşılık çok büyük cluster control plane, network veya software defect için daha geniş blast radius yaratabilir. Cluster federation veya birden fazla fault-contained cluster bazı ortamlarda daha dengeli olabilir.

Node expansion'ın tamamlanması da join event ile ölçülmemelidir. Yeni node cluster'a katıldıktan sonra data rebalance başlayabilir. Data placement tekrar dengelenene, health normal state'e dönene ve performance stabilize olana kadar expansion technically devam eder. Change ticket ancak bu state görülünce kapanmalıdır.

Lifecycle tarafında HCI, tightly validated stack'tir. Server BIOS, BMC, NIC firmware, drive firmware, hypervisor, storage software, drivers ve management components belirli compatibility set içinde kalmalıdır. Software-defined kelimesi arbitrary hardware anlamına gelmez. Hardware compatibility list operational policy'nin bir parçasıdır.

Rolling upgrade, downtime azaltmak için çok değerlidir. Ancak rolling olması risksiz olduğu anlamına gelmez. Bir node maintenance moduna alınır; workloads move eder veya restart edilir; data component'leri farklı state'e geçebilir; cluster geçici mixed-version durumda olabilir. Kalan node'ların compute, memory ve storage headroom'u upgrade state'i taşıyabilmelidir.

Maintenance mode seçenekleri platforma göre farklı data behavior yaratabilir. Bazı modlar data'yı tamamen evacuate eder, bazıları local data'yı yerinde bırakır, bazıları yalnız workload'u taşır. Operator MOP içinde hangi mode'un neden seçildiğini ve ikinci failure durumunda ne olacağını bilmelidir.

Rollback konusu özellikle önemlidir. Software veya firmware upgrade bazı metadata veya on-disk format değişiklikleri yapabilir. “Bir önceki pakete geri döneriz” her zaman mümkün değildir. Rollback boundary upgrade öncesi belgelenmeli, backup ve recovery state doğrulanmalıdır.

Operations telemetry'si de distributed system'e uygun olmalıdır. Node health, CPU ve memory pressure, drive endurance, storage latency, throughput ve IOPS, network drop ve congestion, rebuild state, capacity headroom, replication lag ve backup status birlikte izlenmelidir. Tek bir health score root cause analizi yerine geçmez.

Performance acceptance normal state ile sınırlı kalmamalıdır. Synthetic benchmark yalnız cache warm durumda çalıştırılırsa media path görünmeyebilir. Average latency iyi görünürken P99 bozulabilir. Rebuild sırasında storage network ve CPU tüketimi application SLA'yı aşabilir. Bu nedenle representative workload, normal state, node failure, drive failure, rebuild, maintenance ve backup concurrency altında ölçülmelidir.

Noisy neighbor etkisi HCI'da birkaç shared resource üzerinden oluşabilir. Bir workload yoğun CPU kullanırken başka bir workload storage latency'si etkilenebilir; bulk backup network queues'u doldurabilir; data reduction CPU tüketebilir. QoS ve workload policy'leri gerçek contention altında doğrulanmalıdır.

Time synchronization ve logs da dağıtık troubleshooting için temel gereksinimdir. Node'lar arasında clock drift varsa aynı incident'ın event sequence'ini çıkarmak zorlaşır. Central log retention, audit ve accurate time HCI operations'ın görünmeyen ama kritik altyapısıdır.

Bu chapter'ın Golden sonucu şudur: HCI lifecycle automation çok değerlidir ama automation capacity reserve ve failure-domain engineering'in yerini tutmaz. Scale, maintenance ve upgrade operasyonları production state değişiklikleridir ve her biri acceptance modeliyle yönetilmelidir. Son chapter'da bütün bu bilgiyi sizing, TCO, commissioning ve architecture selection kararına bağlayacağız.

---

## [K11-07] Sizing, TCO, acceptance ve hangi mimari ne zaman?

HCI tasarımının son aşaması ürün seçmek değil, karar modelini freeze etmektir. Doğru sizing workload inventory ile başlar. Kaç VM veya container var, peak CPU demand ne, memory working set ne kadar, storage used ve provisioned capacity nedir, IOPS, throughput ve latency dağılımı nasıl, data yılda ne kadar büyüyor, RPO ve RTO hedefleri nedir, maintenance window ne kadar ve licensing constraint'leri neler? Bu veriler olmadan node sayısı yalnız tahmindir.

Average utilization tek başına sizing için yeterli değildir. Failure-state planning peak coincident demand'e bakmalıdır. Bir node kaybolduğunda surviving nodes üzerinde CPU ve memory yeterli mi? Restart storm yaşanırsa storage ve network aynı anda yükselen talebi karşılıyor mu? Storage tarafında resilience overhead, metadata, snapshot growth, data reduction uncertainty, rebuild reserve ve forecast growth birlikte hesaplanmalıdır.

Vendor-neutral capacity düşüncesini basit bir ifadeyle özetleyebiliriz. Required raw capacity, protected logical data'nın conservative data-reduction factor ile düzeltilmiş değerinin resilience overhead, operational headroom ve growth factor ile çarpılmasına dayanır. Exact implementation overhead için vendor calculator authoritative olabilir ama calculator input assumptions freeze edilmelidir.

Compute ve memory için de benzer bir state equation kullanabiliriz: design failure sonrasında surviving capacity, required peak workload artı platform overhead ve recovery margin'den büyük veya eşit olmalıdır. Bu hesap node maintenance için de yapılmalıdır. Planned maintenance sırasında cluster'ın SLA dışına çıkması kabul ediliyorsa bu açık business kararı olmalıdır; gizli teknik varsayım değil.

Architecture fit açısından HCI general VM estate, VDI, ROBO veya edge ve private cloud için güçlü adaydır. Standardized lifecycle ve operational simplification gerçek değer yaratabilir. Database workload'ları için latency, licensing ve application support doğrulanırsa uygun olabilir. Kubernetes için CSI ve topology integration önemlidir. GPU-enabled inference veya VDI senaryoları mümkün olabilir. Buna karşılık very large archive, aşırı asymmetric storage growth veya specialized large-scale AI training için başka architecture family'leri ekonomik veya teknik olarak daha uygun olabilir.

Bu nedenle procurement sürecinde HCI ile traditional three-tier ve disaggregated architectures aynı resilience ve performance koşullarında karşılaştırılmalıdır. HCI'ın SAN ve external storage appliance sayısını azaltması CAPEX ve operational complexity avantajı sağlayabilir. Fakat software subscription, core veya capacity licensing maliyeti büyüyebilir. Stranded CPU, RAM veya storage TCO'ya dahil edilmelidir.

Refresh cycle da önemli bir ekonomik faktördür. Compute ve storage tightly coupled ise yeni CPU generation'a geçmek storage refresh'i de tetikleyebilir. Mixed-generation support veya disaggregated expansion bu etkiyi azaltabilir. Exit cost da hesaba katılmalıdır: data migration, hypervisor compatibility, backup portability ve license termination maliyetleri lifecycle modelinin parçasıdır.

BoQ hazırlarken yalnız node SKU listesi verilmemelidir. Target workload, cluster size, availability model, failure domain, resilient usable capacity, performance envelope, network topology, software edition ve license metric, backup ve DR, witness, support term ve expansion unit birlikte tanımlanmalıdır. Node satırında CPU, DIMM population, boot media, cache veya capacity drives, endurance, NIC ports, PSU ve support entitlement açık olmalıdır.

Acceptance planı da BoQ kadar önemlidir. Hardware ve firmware inventory doğrulanır. Compatibility matrix kontrol edilir. Network redundancy, latency, MTU ve QoS test edilir. Storage policies istenen physical failure domain'lere map edilir. Raw, usable ve resilient usable capacity karşılaştırılır. Representative workload benchmark yapılır. Sonra drive failure, node failure, network failure, rebuild ve maintenance state'leri test edilir.

Backup acceptance, backup job'ın success olması değildir; representative data restore edilmelidir. DR acceptance, replication healthy görünmesi değildir; business service failover ve failback çalıştırılmalıdır. Security acceptance MFA, RBAC, management segmentation, certificate health ve key-management recovery'yi içermelidir. Observability acceptance alarm'ların gerçekten doğru ekip ve kanal tarafından görüldüğünü doğrulamalıdır.

FMEA burada final decision'ın sigortasıdır. Single drive failure, node power loss, ToR failure, network partition, witness loss, capacity threshold breach, rebuild sırasında ikinci failure, firmware defect, KMS loss, DR link saturation ve ransomware compromise gibi senaryolar architecture'ın kağıt üzerinde görünmeyen zayıflıklarını ortaya çıkarır.

Son karar kuralı nettir. Workload ve SLA'yı tanımla. Failure model'i seç. Compute ve memory'yi surviving-state üzerinden boyutlandır. Storage layout ve physical placement'i freeze et. East-west network'ü failure ve rebuild traffic'ine göre tasarla. VM ve container integration'ını doğrula. Backup ile DR'ı HCI resilience'den ayır. Maintenance ve rebuild reserve bırak. Lifecycle compatibility'yi freeze et. Failure testlerini representative load altında çalıştır. Sonra TCO'yu karşılaştır ve BoQ'yu dondur.

DC-K11'in ana mesajı budur: HCI doğru workload ve operating model için son derece güçlü olabilir, fakat başarısı appliance markasından değil distributed-system engineering kalitesinden gelir. Satın alınması gereken şey üç, dört veya sekiz node değildir. Satın alınması ve kabul edilmesi gereken şey, normal, maintenance, failure, rebuild ve recovery state'lerinde ölçülebilir biçimde çalışan resilient cluster'dır.
