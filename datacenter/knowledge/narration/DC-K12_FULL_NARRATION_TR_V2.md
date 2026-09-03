# DC-K12 — Storage Fundamentals — Full Narration TR V2

Bu metin DC-K12 Golden Deep Research için uzun-form S3F seslendirme kaynağıdır. Quick Brief ayrı bir üretim modu olarak hazırlanacaktır. Full Briefing sekiz chapter üzerinden storage mimarisini veri semantiği, medya, protokol, kapasite, koruma, performans, lifecycle ve karar mühendisliği açısından anlatır.

---

## [K12-00] Storage gerçekte ne sağlar?

Storage denildiğinde ilk akla gelen sayı çoğu zaman terabayttır. Kaç disk var, kaç terabayt ham kapasite var, sistem kaç IOPS veriyor gibi sorular sorulur. Oysa kurumsal depolamanın gerçek değeri disk sayısı değildir. Storage, uygulamaya belirli erişim semantiği, performans, dayanıklılık, güvenlik ve geri kazanım davranışı sağlayan bir veri hizmetidir. Bu nedenle doğru tasarım kapasite listesinden değil, workload ve data modelinden başlar.

İlk ayrım block, file ve object arasındadır. Block storage, host'a adreslenebilir bloklar sunar. File system veya database gibi üst katmanlar bu blokları kullanarak kendi veri yapısını oluşturur. File storage ise dosya ve klasörlerden oluşan paylaşılan bir namespace sunar; metadata, izinler, locking ve file-service davranışı servis kontratının parçasıdır. Object storage ise veriyi object ve metadata biçiminde, key veya identifier üzerinden sunar. Bu üç model aynı fiziksel diskleri kullanabilir ama uygulamaya verdikleri kontrat aynı değildir.

Bu ayrım procurement açısından kritiktir. Bir ürünün SSD kullanması onun block, file veya object olduğunu söylemez. Aynı şekilde SAN, NAS ve object ifadeleri de tek bir teknik eksen değildir. SAN çoğunlukla block erişim için bir networked storage fabric yaklaşımını anlatır. NAS file service yaklaşımıdır. Object storage ise object API semantiğidir. Medya, protokol, transport ve erişim modeli ayrı ayrı yazılmalıdır.

İkinci kritik ayrım kapasite sayılarını doğru okumaktır. Raw capacity, drive nameplate kapasitelerinin toplamıdır. Usable capacity, protection policy, metadata ve system overhead sonrasında kalan alandır. Resilient usable capacity ise sistem bir failure veya maintenance durumu yaşarken gerekli rebuild ve operational reserve korunarak güvenle kullanılabilecek kapasitedir. Effective capacity ise deduplication veya compression gibi data-reduction etkilerini de hesaba katabilir. Bu dört sayı birbirinin yerine kullanılamaz.

Storage aynı zamanda bir failure-domain problemidir. Bir volume iki path üzerinden erişilebilir olabilir ama iki path aynı switch'e, aynı controller'a veya aynı power domain'e bağlıysa gerçek bağımsızlık yoktur. Bir array dual-controller olabilir fakat cache, firmware, enclosure veya backend bağımlılıkları ortak olabilir. Bir distributed storage üç replica tutabilir fakat replica'lar aynı rack failure domain'inde kalıyorsa beklenen koruma sağlanmayabilir. Dolayısıyla fiziksel ve logical topology birlikte değerlendirilmelidir.

Data protection da storage'ın içinde tek bir özellik değildir. RAID veya erasure coding belirli device ya da fragment kayıplarına karşı koruma sağlar. Snapshot point-in-time kopya mekanizmasıdır. Replication veriyi başka bir sisteme veya site'a taşır. Backup bağımsız retention ve restore kontratı sağlar. Disaster recovery ise ayrı failure domain'de belirli RPO ve RTO hedefleriyle iş sürekliliğini geri getirme disiplinidir. Snapshot backup değildir; replication da backup değildir.

Performans tarafında da tek bir sayı yeterli değildir. IOPS, throughput ve latency farklı metriklerdir. Küçük random I/O ile büyük sequential I/O aynı sistemi farklı biçimde zorlar. Read-write oranı, block size, queue depth, cache state ve dataset büyüklüğü benchmark sonucunu değiştirir. Özellikle kritik workload'larda average latency yerine percentile ve tail latency değerleri izlenmelidir. Normal durumda iyi görünen sistem, rebuild veya controller failover sırasında SLA dışına çıkabilir.

SpecBridge yaklaşımında storage karar zinciri bu yüzden workload ve data modelinden başlar; block, file veya object semantiği belirlenir; kapasite ve performans hedefleri ayrı ayrı hesaplanır; medya, protocol ve transport seçilir; failure domain ve protection katmanları tasarlanır; snapshot, backup ve DR ayrıştırılır; lifecycle ve security koşulları eklenir; degraded-state testleri yapılır; en son TCO ve BoQ freeze gerçekleştirilir.

Bu chapter'ın ana sonucu şudur: Storage bir disk kutusu değildir. Uygulamanın veriye nasıl erişeceğini, verinin hangi arızalarda ayakta kalacağını, hangi performans sınırlarında hizmet vereceğini ve nasıl geri kazanılacağını tanımlayan uçtan uca bir veri servisidir.

---

## [K12-01] HDD, SSD, SATA, SAS, SCSI ve NVMe

Storage tasarımında en sık yapılan kavramsal hatalardan biri media, interface, command model ve transport kavramlarını aynı şeymiş gibi konuşmaktır. HDD ve SSD media sınıflarıdır. SATA ve SAS farklı interface ve transport ekosistemleridir. SCSI bir komut ve mimari ailesidir. NVMe ise non-volatile memory için tasarlanmış modern bir komut ve protokol ailesidir. Bu kavramları ayırmadan yapılan BoQ, teknik olarak belirsiz kalır.

HDD mekanik bir aygıttır. Platter, head movement ve rotational latency nedeniyle küçük random I/O davranışı büyük sequential transferden farklıdır. Yüksek kapasite ve ekonomik terabayt maliyeti hâlâ önemli avantajlardır. Ancak yüksek yoğunluklu HDD sistemlerinde rebuild süresi ve degraded-state exposure kritik hale gelir. Büyük drive kapasitesi tek başına daha iyi storage anlamına gelmez; bir drive kaybından sonra veriyi ne kadar sürede ve hangi performans etkisiyle yeniden korumalı duruma getirebildiğiniz de önemlidir.

SSD mekanik seek'i ortadan kaldırır ama kendi fizik kurallarını getirir. NAND flash erase-before-write davranışı, garbage collection, wear leveling, over-provisioning ve write amplification gibi mekanizmalar sustained performance ve endurance üzerinde etkilidir. Kısa süreli benchmark burst'leri bu davranışların tamamını göstermeyebilir. Özellikle write-heavy database veya log workload'larında sustained-state latency ve endurance sınıfı test edilmelidir.

SSD endurance konusu kapasiteden bağımsız değerlendirilmelidir. Aynı kapasitedeki iki SSD farklı write endurance sınıflarına sahip olabilir. Drive writes per day, total bytes written, warranty şartları ve actual write amplification birlikte düşünülmelidir. Yoğun yazma workload'una düşük endurance sınıfı seçmek, sistem performansı iyi olsa bile lifecycle riskine yol açabilir.

Power-loss protection da kritik bir ayrımdır. Uygulama write işleminin tamamlandığını düşündüğünde veri gerçekten persistent media üzerinde güvenli mi, yoksa volatile cache içinde mi? Controller cache, device cache ve SSD üzerindeki koruma zinciri birlikte doğrulanmalıdır. Bir write acknowledgement yalnız en zayıf persistent katman kadar güvenilirdir.

SATA ekosistemi uzun yıllardır HDD ve SSD bağlantısında kullanılır. Interface generation ve nominal link rate, application throughput garantisi değildir. Storage path içinde controller, queue davranışı, media, protocol overhead ve workload pattern bulunur. Bu yüzden bağlantı hızını doğrudan application performansına çevirmek hatalıdır.

SAS, kurumsal storage dünyasında geniş kullanılan serial transport ailesidir ve SCSI command ecosystem'i ile ilişkilidir. Fakat SCSI yalnız SAS kablosu anlamına gelmez. SCSI architecture ve command sets farklı transportlar üzerinden taşınabilir. iSCSI bunun açık örneğidir; SCSI komutları IP ve TCP tabanlı network üzerinden taşınır. Bu nedenle bir teknik şartnamede SCSI, SAS ve iSCSI ayrı kavramlar olarak yazılmalıdır.

NVMe, non-volatile memory için düşük overhead ve yüksek paralellik hedefleyen modern bir specification family'dir. NVMe'yi yalnız local PCIe SSD ile eşitlemek doğru değildir. NVMe over Fabrics yaklaşımında aynı command semantics farklı transportlar üzerinden network'e taşınabilir. PCIe, RDMA ve TCP transport seçenekleri güncel NVMe specification ailesinin ayrı parçalarıdır. NVMe/TCP TCP tabanlı network üzerinden çalışırken NVMe/RDMA RDMA transport kullanır.

Buradaki önemli nokta, NVMe etiketi gördüğümüzde otomatik olarak düşük latency garantisi varsaymamaktır. Host CPU, PCIe topology, NUMA locality, driver stack, network transport, controller architecture, media behavior ve queue settings gerçek sonucu belirler. Aynı NVMe drive farklı sistemlerde çok farklı tail latency gösterebilir.

Zoned storage gibi yeni yaklaşımlar da media ile software arasında daha açık bir işbirliği gerektirir. Host, write placement davranışını belirli zone kurallarına göre yönetebilir. Bu, uygun workload ve software stack için verimlilik sağlayabilir ama her uygulama için transparent replacement değildir.

SpecBridge açısından doğru hardware tanımı şu disipline uyar: media tipi ve endurance, command/protocol modeli, physical veya network transport, logical presentation ve failure-domain placement ayrı alanlarda belirtilir. Böylece “all-flash”, “NVMe storage” veya “SAS disk” gibi tek kelimelik ifadeler yerine gerçek engineering contract oluşur.

Bu chapter'ın sonucu şudur: hızlı storage seçmek, yalnız hızlı drive seçmek değildir. Media, interface, protocol, persistence ve host path birlikte değerlendirildiğinde gerçek service behavior ortaya çıkar.

---

## [K12-02] Block, file, object ve network storage protocols

Storage'ın uygulamaya nasıl sunulduğu, fiziksel media kadar önemlidir. Aynı SSD pool'u block volume, file share veya object namespace olarak sunulabilir. Ancak access semantics, locking, metadata, security ve recovery behavior farklıdır. Bu chapter'da block, file ve object modellerini network protocol ve transport katmanlarından ayırarak ele alacağız.

Block storage modelinde host bir logical block device görür. Host üzerindeki file system, volume manager veya database bu block device'ın nasıl kullanılacağını belirler. Shared block erişim gerekiyorsa coordination ayrıca çözülmelidir. Birden fazla host aynı block volume'a yazacaksa cluster-aware file system veya application-level coordination olmadan data corruption riski oluşabilir.

iSCSI, SCSI command operations'ını IP network üzerinden taşıyan standardize bir protokoldür. Tasarımda yalnız target IP adresi yetmez. Initiator ve target identity, session davranışı, authentication, network isolation, MTU, multipathing, switch redundancy ve congestion özellikleri değerlendirilmelidir. İki iSCSI path'in aynı physical switch veya power domain'e gitmesi gerçek independent fabric değildir.

Fibre Channel ise purpose-built switched fabric yaklaşımıyla block storage taşır. Host bus adapter, switch fabric ve storage target arasında zoning, name services ve multipath behavior bulunur. FC'nin yüksek olgunluğu engineering disiplinini ortadan kaldırmaz; dual fabric tasarımında gerçekten bağımsız switches, power, optics ve paths olması gerekir.

NVMe over Fabrics modern NVMe command semantics'ini network üzerinden taşır. NVMe/TCP standart TCP network altyapısını kullanabilir. NVMe/RDMA ise RDMA transport üzerinden daha düşük software overhead hedefler. Ancak RDMA-capable NIC satın almak, kayıpsız veya doğru tasarlanmış bir RDMA fabric elde edildiği anlamına gelmez. Network design, congestion control, QoS ve end-to-end validation gerekir.

File storage tarafında NFS ve SMB gibi protokoller öne çıkar. NFSv4.1 stateful behavior, sessions, locking ve namespace özellikleri içerir. NFS share tasarımı yalnız mount path ve throughput sayısından ibaret değildir. Metadata workload, file count, locking patterns, failover behavior, client versions ve security policy performansı etkiler.

SMB de network file service sunar ancak dialect negotiation, authentication, signing, encryption, locking ve Windows-oriented enterprise integrations gibi kendi davranışları vardır. “NAS support” ifadesi tek başına NFS ve SMB gereksinimlerini tarif etmez. Hangi protocol, hangi dialect/version, hangi security ve availability behavior gerektiği açıkça yazılmalıdır.

Object storage farklı bir application modelidir. Data object olarak key veya identifier ile tutulur ve metadata ile birlikte yönetilir. Object API üzerinden erişim, traditional file system'in arbitrary offset write veya POSIX namespace davranışıyla aynı değildir. S3-compatible ifadesi piyasada önemli bir de-facto interoperability beklentisidir ancak compatibility scope'unun hangi API operations ve features için geçerli olduğu test edilmelidir. Vendor-neutral standart referansı gerektiğinde CDMI gibi standardize data-management interfaces ayrıca incelenebilir.

Multipathing tüm bu networked storage modellerinde farklı şekillerde karşımıza çıkar. Host'un iki NIC veya HBA üzerinden target'a erişmesi path redundancy sağlar. Fakat storage controller, fabric, enclosure ve power dependency de ayrıca incelenmelidir. Multipath software bir path arızasında I/O'yu diğer path'e çevirebilir, fakat application HA sağlamaz ve site failure'ını çözmez.

Protocol seçimi workload ve operational model ile ilişkilidir. Database için block storage doğal olabilir. Shared engineering files için file service daha uygun olabilir. Large-scale archive veya analytics dataset için object model avantajlı olabilir. Kubernetes persistent volumes çoğunlukla CSI üzerinden farklı block veya file backends'e bağlanabilir. Tek platformun bütün protokolleri desteklemesi, her protokolde aynı scale veya performance verdiği anlamına gelmez.

SpecBridge BoQ yaklaşımında storage erişimi beş ayrı satırda düşünülmelidir: application semantic modeli; storage protocol; network transport; physical interface ve speed; redundancy ve security policy. Bu ayrım yapıldığında “NAS”, “SAN” veya “NVMe” gibi geniş etiketlerin arkasındaki belirsizlik ortadan kalkar.

Bu chapter'ın sonucu nettir: protocol bir ürün etiketi değildir. Uygulama semantiği ile network transport arasındaki kontrattır ve availability, security ve performance acceptance'ı kendi başına gerektirir.

---

## [K12-03] Capacity: raw, usable, resilient usable ve effective

Storage projelerinde en büyük ticari ve teknik uyuşmazlıkların önemli bölümü capacity terminolojisinden çıkar. Bir teklif yüz terabayt diyebilir; başka biri yüz terabayt usable diyebilir; üçüncü ürün data reduction sonrası yüz terabayt effective capacity vaat edebilir. Bu rakamların eşit olduğunu varsaymak yanlış karşılaştırmaya ve yetersiz kapasite satın alınmasına yol açar.

Raw capacity başlangıç noktasıdır. Drive'ların nominal nameplate kapasitesinin toplamıdır. Henüz RAID, replication, erasure coding, metadata, system reserve, spare, rebuild reserve veya growth reserve düşülmemiştir. Procurement açısından en kolay bulunan ama tek başına en az anlamlı sayılardan biridir.

Usable capacity, platform overhead ve protection policy sonrasında application'a tahsis edilebilen alanı ifade eder. İki-way mirror raw kapasitenin önemli bölümünü copy overhead için kullanır. Parity veya erasure coding farklı oranlar sağlayabilir. Metadata, filesystem/object overhead ve internal system areas platforma göre ek kapasite tüketebilir. Bu yüzden usable capacity formülü vendor implementation ve policy ile birlikte yazılmalıdır.

Resilient usable capacity, SpecBridge için daha önemli engineering sayısıdır. Sistem bir drive, node, controller veya maintenance condition yaşadığında yeniden korumalı duruma gelebilmek için yeterli free capacity ve operational headroom bırakılmalıdır. Cluster veya array yüzde doksan sekiz doluyken nominal usable kapasite yüksek görünebilir; fakat rebuild için alan ve performance reserve kalmayabilir. Bu yüzden failure reserve ile business growth reserve ayrı tutulmalıdır.

Effective capacity ise deduplication ve compression gibi data-reduction etkilerini hesaba katabilir. Fakat bu oran workload'a bağlıdır. Virtual desktop images veya duplicate backup blocks yüksek reduction gösterebilirken encrypted, compressed media veya bazı database datasets düşük reduction gösterebilir. Broşürdeki “up to” oranı physical capacity multiplier olarak kullanılmamalıdır. Contractual guarantee veya representative dataset testleri yoksa conservative assumption kullanılmalıdır.

Thin provisioning başka bir kapasite yanılsaması yaratır. Host'a yüz terabayt logical volume provision edilebilirken physical pool çok daha küçük olabilir. Bu operasyonel olarak verimlidir ama oversubscription riskidir. Capacity thresholds, forecasting ve emergency expansion process tanımlanmadan thin provisioning kullanmak, teknik borcu görünmez hale getirir.

Snapshots da benzer biçimde başlangıçta küçük görünür. Copy-on-write veya redirect-on-write implementation'a göre snapshot capacity change rate ile büyür. Yüksek değişim oranlı workload'da retention süresi uzadıkça alan tüketimi hızlı artabilir. Snapshot reserve kapasitesi workload change rate üzerinden modellenmelidir.

Decimal ve binary unit ayrımı da önemlidir. Drive manufacturer TB kullanırken operating systems veya tools farklı display conventions kullanabilir. TB ile TiB arasındaki fark proje ölçeğinde ciddi sayılara dönüşebilir. Sizing sheet'te unit convention açıkça belirtilmelidir.

Spare strategy ayrıca tanımlanmalıdır. Dedicated hot spare, distributed spare space veya dynamic free-space reconstruction farklı modellerdir. “Bir spare disk var” ifadesi modern distributed storage'da doğru model olmayabilir. Asıl soru, bir failure sonrasında data placement'ın hangi kapasite üzerinde ve ne kadar sürede yeniden korumalı hale geldiğidir.

Capacity plan yalnız bugünkü data size'a göre yapılmamalıdır. Dataset growth, snapshot retention, backup staging, rebuild reserve, firmware upgrade temporary needs ve expected business expansion ayrı kalemlerdir. Capacity threshold'ları da generic yüzde seksen kuralına bağlı olmamalı; recovery ve expansion lead time'a göre belirlenmelidir.

Örnek olarak, raw capacity iki yüz terabayt olan bir sistem düşünelim. Protection ve metadata sonrasında yüz otuz terabayt usable kalabilir. Güvenli rebuild ve maintenance reserve için yirmi terabayt ayırıyorsak resilient usable yüz on terabayt olabilir. Workload ölçümünde ortalama bir buçuk kat verified data reduction görüyorsak effective capacity yaklaşık yüz altmış beş terabayt olarak raporlanabilir. Fakat fiziksel güvenlik sınırı hâlâ yüz on terabayt resilient usable kapasitedir.

SpecBridge sizing sheet bu nedenle raw, usable, resilient usable ve effective capacity'yi ayrı kolonlarda gösterir; her dönüşümün policy ve assumption'ını yazar. Böylece satış rakamı ile engineering capacity aynı şeymiş gibi görünmez.

Bu chapter'ın sonucu şudur: storage kapasitesi tek bir TB sayısı değildir. Güvenilir BoQ, protection overhead'i, technical reserve'i, growth'ü ve data reduction belirsizliğini görünür hale getirir.

---

## [K12-04] RAID, replication, erasure coding ve failure domains

Storage resilience konuşulurken RAID kelimesi çoğu zaman availability ile eş anlamlı kullanılır. Oysa RAID belirli media failure'larına karşı bir protection mechanism'dır; controller, network, enclosure, software, operator veya site failure'ını tek başına çözmez. Doğru resilience tasarımı protection method ile failure domain'i birlikte eşleştirir.

Mirroring en anlaşılır yöntemdir. Data iki veya daha fazla tam copy halinde tutulur. Recovery semantics sade olabilir ve read path için esneklik sağlar. Bedeli capacity overhead ve write traffic'tir. Ancak iki copy'nin varlığı, iki bağımsız failure domain olduğu anlamına gelmez. Aynı enclosure, rack veya power feed içindeki iki copy correlated failure karşısında birlikte kaybolabilir.

Parity RAID capacity efficiency'yi artırır. Data ile birlikte parity information saklanır ve belirli drive failures sonrasında missing data yeniden hesaplanabilir. Fakat write behavior daha karmaşıktır ve rebuild sırasında mevcut drives yoğun biçimde okunabilir. Büyük-capacity drive'larda rebuild süresi uzadıkça ikinci failure veya latent error exposure artabilir. Bu nedenle yalnız RAID level seçmek yetmez; degraded-state latency ve rebuild duration da acceptance criterion olmalıdır.

Erasure coding distributed storage ve object systems'de yaygın bir başka protection yaklaşımıdır. Data, k adet data fragment ve m adet parity fragment gibi yapılara ayrılır. Replication'a göre daha iyi capacity efficiency sağlayabilir fakat encoding, network traffic ve reconstruction overhead getirebilir. Küçük random write ile large sequential object workload aynı sonuçları vermez. Policy workload'a göre seçilmelidir.

Failure domain tasarımın merkezidir. Drive, enclosure, controller, node, rack, ToR switch, PDU, room ve site ayrı domain'ler olabilir. Protection policy'nin gerçekten bu boundaries üzerinde placement yaptığını doğrulamak gerekir. Üç replica aynı rack'te ise rack failure'ına karşı üç copy değil, tek failure domain vardır.

Controller resilience de detaylı incelenmelidir. Dual-controller array failover sunabilir; fakat write cache ownership, backend paths, firmware upgrade sequence ve controller interconnect behavior önemlidir. Controller failover sırasında application I/O'nun ne kadar süre durduğu ve tail latency'nin ne kadar yükseldiği test edilmelidir.

Fabric resilience de benzer bir konudur. İki host port'un aynı switch'e bağlanması cable failure'a karşı koruma sağlayabilir ama switch failure'ını çözmez. Gerçek A/B fabric hedefleniyorsa switch, power, optics ve upstream dependencies ayrıştırılmalıdır. Failover testleri cable pull seviyesinde kalmamalıdır; switch ve path failure da denenmelidir.

Distributed storage sistemlerinde quorum ve data placement ek bir boyut getirir. Cluster control quorum'u ile data quorum'u aynı implementation olmayabilir. Node count tek başına safe availability kanıtı değildir. Network partition durumunda hangi side'ın service vermeye devam ettiği ve data consistency'nin nasıl korunduğu anlaşılmalıdır.

Snapshot ve replication protection ladder'ın üst katmanlarıdır ama backup değildir. Snapshot aynı administrative plane ve aynı storage system içinde tutuluyorsa platform corruption veya privileged deletion'dan etkilenebilir. Replication yanlışlıkla silinen veya ransomware ile şifrelenen veriyi hızlı biçimde ikinci site'a taşıyabilir. Bağımsız backup retention ve tested restore bu nedenle ayrı bir katmandır.

Site disaster recovery de storage HA'dan ayrılmalıdır. Array içindeki dual-controller veya campus içindeki stretched storage, deprem, yangın, geniş power outage veya operational isolation gibi site-level event'leri otomatik olarak çözmez. DR design bağımsız failure domain, network dependency, RPO, RTO ve orchestrated recovery testleri gerektirir.

SpecBridge acceptance planında resilience şu sırayla test edilir: device failure, path failure, switch/fabric failure, controller veya node failure, rebuild veya rebalance, planned maintenance, near-capacity condition ve gerekiyorsa site failover. Her testte yalnız service up/down değil, latency, throughput, recovery duration ve final protection state ölçülür.

Bu chapter'ın sonucu şudur: protection policy'nin adı değil, hangi failure domain'e karşı hangi service behavior'ı sağladığı önemlidir. Gerçek resilience ancak placement, reserve ve failure testing birlikte doğrulandığında kabul edilir.

---

## [K12-05] IOPS, throughput, latency ve benchmark gerçekliği

Storage performansı genellikle tek bir headline sayı ile pazarlanır: milyon IOPS, yüz gigabayt saniye throughput veya mikro saniye latency. Bu değerler laboratuvar koşullarında anlamlı olabilir ama application sizing için bağlam olmadan kullanılamaz. IOPS, throughput ve latency birbirine bağlı fakat farklı metriklerdir.

IOPS saniyedeki I/O operation sayısını ifade eder. Ancak bir operation'ın dört kilobayt mı yoksa bir megabayt mı olduğu sonucu tamamen değiştirir. Dört kilobayt random reads ile bir megabayt sequential reads aynı IOPS değerinde çok farklı bandwidth tüketir. Bu nedenle her IOPS hedefi block size ile birlikte yazılmalıdır.

Throughput belirli sürede taşınan data miktarıdır. Large sequential backup, media veya analytics workloads throughput'a daha duyarlı olabilir. Küçük transactional database I/O ise düşük latency ve yüksek IOPS isteyebilir. Interface line rate throughput için üst sınırların yalnız bir parçasıdır; protocol overhead, controller path, media ve workload behavior gerçek application throughput'u belirler.

Latency, I/O request ile completion arasındaki süredir. Average latency tek başına yetersizdir çünkü kritik application experience çoğu zaman tail events tarafından belirlenir. P95, P99 veya daha yüksek percentile değerleri, sistemin kötü anlarda nasıl davrandığını gösterir. Özellikle distributed database ve VM workloads'ta az sayıdaki yüksek latency event bütün transaction chain'i etkileyebilir.

Read-write ratio da temel parametredir. Reads cache'den servis edilebilirken writes protection, parity, replication veya destage işlemlerini tetikleyebilir. Write-heavy workload için sustained behavior mutlaka test edilmelidir. Kısa benchmark, write cache dolmadan bitebilir ve gerçek steady-state'i hiç göstermeyebilir.

Random ve sequential mix de önemlidir. HDD sistemleri random seek'ten güçlü biçimde etkilenir. SSD'ler random behavior'da çok daha güçlüdür ama garbage collection ve flash translation layer davranışları sustained write sırasında ortaya çıkabilir. Storage platformunun background tasks'i de workload ile aynı resources'u paylaşabilir.

Queue depth benchmark sonuçlarını dramatik biçimde etkileyebilir. Çok yüksek queue depth ile device daha fazla paralellik kullanarak yüksek IOPS üretebilir, fakat latency de yükselebilir. Application düşük concurrency ile çalışıyorsa vendor benchmark'ındaki yüksek queue depth sonucuna ulaşamayabilir. Bu nedenle test profile production concurrency'yi temsil etmelidir.

Cache state en önemli benchmark tuzaklarından biridir. Dataset controller veya host memory'ye sığıyorsa test storage media yerine RAM performansını ölçebilir. Cold-cache, warm-cache ve sustained-state conditions açıkça tanımlanmalıdır. Dataset active cache'ten daha büyük seçilmeli veya test amacı buna göre belirtilmelidir.

Healthy-state benchmark da tek başına yeterli değildir. Bir drive failed olduğunda parity reconstruction, replica healing veya erasure-code recovery başlayabilir. Controller failover cache ownership'i değiştirebilir. Node maintenance sırasında traffic başka paths'e taşınabilir. Kritik SLA bu degraded states içinde de ölçülmelidir.

Networked storage'da bottleneck storage box'ın dışında olabilir. NIC veya HBA queue, PCIe lanes, NUMA placement, switch buffers, packet loss, congestion, MTU inconsistency ve oversubscription latency'yi artırabilir. “Array yeterince hızlı” demek application path'in yeterli olduğu anlamına gelmez.

Reproducible acceptance için test dokümanı tool ve version, dataset size, block size, read-write ratio, random-sequential mix, threads/jobs, queue depth, duration, warm-up, cache state, compression/dedupe characteristics ve system health state'i kaydetmelidir. Aynı profile tekrarlandığında benzer sonuç alınabilmelidir.

SpecBridge performans acceptance'ında üç eksen birlikte değerlendirilir: minimum required throughput veya IOPS; maximum percentile latency; ve bu sınırların healthy, failure, rebuild ve maintenance states içinde korunması. Böylece yalnız en yüksek benchmark değil, application'a sunulan stabil service değerlendirilir.

Bu chapter'ın sonucu şudur: Storage performansı bir yarış arabasının maksimum hızı gibi tek sayı değildir. Doğru performans kontratı workload profile, latency distribution ve degraded-state davranışını birlikte ölçer.

---

## [K12-06] Data services, security, lifecycle ve operations

Modern storage platformları yalnız block veya file sunmaz. Snapshot, replication, compression, deduplication, tiering, QoS, encryption, immutability ve analytics gibi çok sayıda data service içerir. Bu özellikler değer yaratır ama her biri resource consumption, failure behavior ve lifecycle dependency getirir. Feature listesi tek başına architecture acceptance değildir.

Snapshot point-in-time recovery için yararlıdır. Ancak snapshot'ın implementation'ı, retention ve change rate capacity davranışını belirler. Snapshot aynı platform ve aynı privileged administrative plane üzerinde kalıyorsa independent backup sayılmaz. Ransomware veya operator error riskine karşı ayrı retention ve immutable backup layer gerekebilir.

Deduplication tekrar eden data blocks veya segments'i tek copy ile temsil ederek capacity tasarrufu sağlayabilir. Compression data representation'ını küçültür. Her iki teknoloji de workload'a bağlıdır ve CPU, memory veya latency overhead yaratabilir. Data reduction oranı production telemetry ile doğrulanmadan TCO'nun ana varsayımı haline getirilmemelidir.

Tiering hot ve cold data'yı farklı media classes arasında taşıyabilir. Bu capacity economics'i iyileştirebilir fakat hot-data detection, migration window, recall latency ve policy behavior anlaşılmalıdır. Application'ın latency-critical dataset'i yanlış tier'a düşerse nominal capacity yeterli olsa bile SLA bozulabilir.

Security storage path'in tüm katmanlarında düşünülmelidir. At-rest encryption drive, controller, volume, file veya application level uygulanabilir. Encryption key management, rotation, backup ve recovery planı olmadan şifreleme availability riskine dönüşebilir. KMS veya HSM dependency varsa onun failure model'i de storage architecture'a eklenmelidir.

In-transit security protocol'e göre değişir. SMB signing ve encryption, NFS security models, iSCSI authentication veya network isolation, object API TLS ve identity policy ayrı ayrı tasarlanmalıdır. Management plane de üretim data plane kadar önemlidir; privileged access, MFA veya PAM integration ve audit logs kritik sistemlerde acceptance criteria olabilir.

Immutability cyber recovery açısından güçlü bir araçtır fakat yalnız checkbox değildir. Retention lock'un kim tarafından bypass edilebildiği, privileged compromise scenario, clock dependency, legal retention ve deletion workflow test edilmelidir. “Immutable” kelimesi implementation details olmadan yeterli değildir.

Operations tarafında observability temel gereksinimdir. Capacity, latency, IOPS, throughput, queue depth, cache behavior, media errors, path status, controller/node health, rebuild state ve environmental conditions merkezi izlenebilmelidir. Alert thresholds yalnız generic percentage değil, business growth ve recovery reserve ile ilişkilendirilmelidir.

Firmware ve compatibility lifecycle da storage güvenilirliğinin parçasıdır. Drives, HBAs, NICs, controllers, enclosures, switches, OS drivers ve multipath software bir support matrix içinde birlikte yaşar. Bir komponenti upgrade etmek diğerlerini unsupported hale getirebilir. BoQ freeze sırasında version-independent “support included” ifadesi yerine lifecycle policy ve compatibility responsibility tanımlanmalıdır.

Non-disruptive upgrade iddiası da production test gerektirir. Sistem tamamen offline olmayabilir ama redundancy veya performance maintenance sırasında düşebilir. Controller reboot, node rolling upgrade veya firmware change sırasında application latency'nin service boundary içinde kaldığı doğrulanmalıdır.

Media replacement ve RMA processes data security ile ilişkilidir. Failed SSD veya HDD vendor'a gönderilecekse secure erase, cryptographic erase veya physical destruction policy belirlenmelidir. Self-encrypting drive kullanılması da key destruction ve audit procedure gerektirir.

Configuration backup gözden kaçan başka bir alandır. Storage data kadar zoning, LUN mappings, object policies, encryption keys, certificates ve recovery metadata da korunmalıdır. Disaster anında data mevcut olsa bile configuration reconstruct edilemiyorsa RTO uzar.

Bu chapter'ın ana sonucu şudur: storage operations, satın alma sonrası ayrı bir konu değildir. Data services, security, telemetry ve lifecycle decisions tasarımın içine baştan konduğunda platform uzun ömürlü ve denetlenebilir hale gelir.

---

## [K12-07] Sizing, acceptance, TCO ve BoQ freeze

Storage tasarımının son adımı ürün seçmek değil, gereksinimleri ölçülebilir bir acceptance ve procurement modeline dönüştürmektir. İyi bir BoQ yalnız drives ve controllers listesi değildir. Workload, capacity, performance, resilience, protocol, security, lifecycle ve support assumptions aynı teknik kontrat içinde görünür olmalıdır.

İlk adım workload inventory'dir. Her workload için dataset size, annual growth, access model, block size veya object/file profile, read-write ratio, random-sequential mix, concurrency, IOPS, throughput, percentile latency, retention, RPO ve RTO kaydedilir. Bu bilgiler yoksa storage sizing tahmindir.

İkinci adım access semantics seçimidir. Application block mu, shared file mı, object mı istiyor? Birden fazla service gerekiyorsa her biri ayrı workload profile ile değerlendirilir. Var olan bir ürüne uydurmak için application'ı yanlış semantiğe zorlamak uzun vadede daha pahalı olabilir.

Üçüncü adım capacity waterfall'dır. Raw capacity'den protection overhead, metadata ve system reserve düşülür. Ardından spare veya rebuild reserve, maintenance reserve ve growth reserve ayrılır. Data reduction ayrı bir measured assumption olarak eklenir. Procurement'ın ana kapasite hedefi resilient usable capacity olmalıdır.

Dördüncü adım performance modelidir. IOPS ve throughput aynı anda, belirlenmiş block size, mix ve latency percentile hedefiyle yazılır. Test duration sustained state'i gösterecek kadar uzun olmalıdır. Healthy-state yanında drive failure, path failure, controller/node failure, rebuild ve maintenance senaryoları eklenir.

Beşinci adım failure-domain map'tir. Host'tan media'ya kadar HBA veya NIC, switch/fabric, controller/node, enclosure, rack, power ve site dependencies çizilir. Dual component'lerin gerçekten bağımsız olup olmadığı burada görülür. Protection policy bu topology ile eşleştirilir.

Altıncı adım data protection ladder'dır. Device protection, snapshot, backup, replication, DR ve cyber recovery ayrı katmanlar olarak yazılır. Her katmanın hangi failure scenario'ya karşı koruma sağladığı ve hangi RPO/RTO hedefini desteklediği belirtilir. Restore test planı olmayan backup kabul edilmemelidir.

Yedinci adım protocol ve fabric BoQ'sudur. Controller/node ports, host HBAs veya NICs, switch ports, optics, DAC/AOC veya fiber cabling, licenses, multipath software ve security requirements birlikte hesaplanır. Storage box fiyatına bakıp fabric'i sonradan eklemek TCO'yu bozar.

Sekizinci adım lifecycle'dır. Support period, firmware compatibility, expansion increments, mixed-generation support, spare strategy, upgrade methodology ve end-of-life assumptions yazılır. Vendor maximum values design target olarak kullanılmaz; recommended operating range ve failure reserve esas alınır.

Dokuzuncu adım acceptance test matrix'tir. Capacity acceptance, performance acceptance, failure acceptance, maintenance acceptance, protection/restore acceptance, security acceptance ve operations acceptance ayrı PASS kriterleri alır. Bir platform yalnız benchmark'ta hızlı olduğu için Golden kabul edilmez.

Onuncu adım TCO ve BoQ freeze'dir. Hardware yanında protocol/data-service licenses, capacity licenses, support, implementation, migration, rack power, cooling impact, network fabric, backup integration ve expected expansion costs dahil edilir. Assumptions açıkça yazılır; özellikle data reduction veya future growth gibi belirsiz değerler sensitivity analysis ile gösterilir.

Workload-to-storage kararında vendor en sona gelir. Önce service contract oluşturulur, sonra uygun architectures shortlist edilir, ardından vendors bu contract'a göre karşılaştırılır. Böylece procurement feature yarışından çıkar ve measurable engineering decision haline gelir.

SpecBridge'in DC-K12 Golden kuralı şu zincirdir: workload ve data model; block, file veya object semantics; capacity layers; IOPS, throughput ve percentile latency; media; protocol ve transport; failure domains; RAID, replication veya erasure coding; snapshot, backup ve DR; security ve data services; degraded-state test; lifecycle; TCO ve son olarak BoQ freeze.

Bu chapter'ın ve bütün modülün sonucu nettir: doğru storage sistemi en yüksek kapasiteyi veya en yüksek benchmark sayısını veren ürün değildir. Workload'un veri semantiğini doğru taşıyan, arıza ve bakım sırasında ölçülebilir service seviyesini koruyan, geri kazanımı kanıtlanmış ve lifecycle boyunca ekonomik olarak yönetilebilir olan mimaridir.
