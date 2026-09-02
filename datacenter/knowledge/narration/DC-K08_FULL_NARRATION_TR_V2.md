# DC-K08 — x86 Server Fundamentals — Full Narration TR V2

Bu metin DC-K08 Golden Deep Research bulgularını, S3F Senior Adviser ses standardı için sekiz bölümlük uzun anlatıma dönüştürür. Quick Brief ayrı bir üretim modudur; bu metin Quick Brief değildir.

---

## [K08-00] x86 server gerçekte nedir?

Bir x86 sunucuyu yalnızca işlemci, RAM ve diskten oluşan bir kutu gibi düşünmek, veri merkezi tasarımında yapılabilecek en temel hatalardan biridir. x86 aslında önce bir instruction-set ailesidir. Yani yazılımın işlemciyle konuştuğu temel komut ve çalışma modelini tarif eder. Ama bir sunucunun gerçek davranışını belirleyen şey yalnız instruction set değildir. İşlemci microarchitecture’ı, socket yapısı, memory controller’lar, PCI Express ve CXL root complex’leri, anakart üzerindeki fiziksel bağlantılar, riser’lar, storage backplane, network adaptörleri, BMC, firmware, güç kaynakları ve termal tasarım birlikte tek bir platform oluşturur.

Bu nedenle “x86 server” dediğimizde beş katmanı birbirinden ayırmak gerekir. Birinci katman instruction set’tir. İkinci katman, core’ların nasıl çalıştığını, cache hiyerarşisini, branch prediction ve execution engine davranışını belirleyen microarchitecture katmanıdır. Üçüncü katman işlemci package ve socket’tir; burada core’larla birlikte memory controller ve I/O root’ları devreye girer. Dördüncü katman fiziksel server platformudur: motherboard, DIMM slotları, PCIe riser’ları, storage ve network bileşenleri, BMC, PSU ve cooling çözümü. Beşinci katman ise UEFI, ACPI, operating system, hypervisor, scheduler, driver ve management yazılımıdır.

Bu ayrımın ticari bir sonucu vardır. Aynı core sayısına ve aynı RAM kapasitesine sahip iki sunucu, farklı memory channel population, farklı PCIe lane dağılımı veya farklı firmware politikası nedeniyle gerçek uygulamada çok farklı sonuç verebilir. Örneğin bir virtualization host’ta çok sayıda core satın almak kolaydır. Fakat memory bandwidth yetersizse bu core’lar beslenemez. Bir database sunucusunda büyük RAM kapasitesi satın alınabilir; fakat NUMA locality kötü tasarlanmışsa latency artar. Bir HCI node’da çok sayıda NVMe disk seçilebilir; fakat lane budget kapanmıyorsa backplane veya PCIe switch darboğazı oluşabilir.

Bu yüzden server sizing üç temel düzlemde dengelenmelidir: compute, memory ve I/O. Compute tarafında core sayısı, per-core performance, cache ve instruction capability vardır. Memory tarafında yalnız kapasite değil channel sayısı, DIMM population, effective speed ve locality vardır. I/O tarafında PCIe ve CXL lane budget, NIC, NVMe, HBA ve accelerator yolları vardır. Bunların tamamı power, thermal, RAS, security ve lifecycle sınırları içinde çalışır.

Bir başka kritik ayrım da standard ile gerçek platform capability arasındadır. Endüstride daha yeni PCIe, CXL veya NVMe standardı yayımlanmış olabilir. Bu, bugün seçtiğiniz server CPU’sunun, motherboard’un, BIOS’un, riser’ın ve cihazın o standardın tüm özelliklerini desteklediği anlamına gelmez. RFP’ye “latest standard” yazmak yerine, gerçekten ihtiyaç duyulan lane width, generation, protocol feature ve validated support açıkça yazılmalıdır.

Aynı prensip OEM datasheet okumalarında da geçerlidir. Datasheet platformun maksimum teorik seçeneklerini gösterebilir; fakat seçilen chassis, riser, CPU adedi, DIMM population veya storage backplane bu seçeneklerin hepsini aynı anda sunmayabilir. Bu yüzden maksimum değerleri toplamak yerine exact configured BOM üzerinden capability matrix oluşturmak gerekir. Teknik kabulün konusu ürün ailesi değil, satın alınan gerçek konfigürasyondur.

Sonuç olarak x86 server satın alımı bir SKU seçimi değildir. Önce workload tanımlanır. Ardından CPU topology, memory capacity ve bandwidth, NUMA, PCIe/CXL lane budget, storage, network, management, power, thermal ve support lifecycle birlikte modellenir. En yüksek core sayısına veya en yeni ürün adına sahip sunucu otomatik olarak en iyi sunucu değildir. En iyi sunucu, hedef workload için dengeli, yönetilebilir, güvenli, servis edilebilir ve ekonomik olan platformdur.

---

## [K08-01] Core, thread, socket, cache ve CPU topology

Server işlemcisini değerlendirirken ilk yapılması gereken şey core, hardware thread, vCPU ve socket kavramlarını birbirinden ayırmaktır. Physical core gerçek execution kaynaklarını taşıyan işlem birimidir. SMT veya benzeri mekanizmalar bir core üzerinde birden fazla hardware thread gösterebilir; fakat iki hardware thread iki bağımsız physical core değildir. Virtualization dünyasındaki vCPU ise hypervisor scheduler’ın yönettiği bir yazılım abstraction’ıdır. Bu nedenle “sunucuda yüzlerce vCPU var” ifadesi fiziksel compute kapasitesini tek başına anlatmaz.

Core sayısı arttıkça toplam throughput potansiyeli yükselir, fakat her workload lineer ölçeklenmez. Per-core performance, frequency davranışı, IPC, cache locality ve memory bandwidth önemlidir. Bir database lisansı physical core başına fiyatlanıyorsa daha fazla core teknik olarak çekici, ekonomik olarak çok pahalı olabilir. Bazı web veya application workload’ları ise yatay ölçeklenebilir ve daha küçük node’larla daha iyi failure-domain davranışı sağlayabilir. Dolayısıyla CPU SKU seçmeden önce workload’ın scale-up mı scale-out mı istediği anlaşılmalıdır.

Frequency konusunda da katalog rakamlarına dikkat etmek gerekir. Base frequency, turbo veya boost değerleri belirli operating condition’ları temsil eder. Tüm core’ların sürekli maksimum frekansta çalışacağı varsayımı doğru değildir. Instruction mix, sıcaklık, platform power limit’i ve firmware policy gerçek sustained frequency’yi etkiler. Aynı şekilde GHz rakamlarını farklı microarchitecture jenerasyonları arasında doğrudan karşılaştırmak da yanıltıcıdır; çünkü IPC değişebilir.

Cache hiyerarşisi, CPU ile memory arasındaki latency farkını yönetmek için kritik bir katmandır. L1 ve L2 genellikle core’a daha yakındır; larger shared cache katmanları birden fazla core tarafından paylaşılabilir. Cache kapasitesi tek başına performans ölçüsü değildir. Workload’ın working set’i, sharing topology ve erişim pattern’i önemlidir. High-performance database, analytics veya virtualization workload’larında cache ve memory birlikte değerlendirilmelidir.

Socket tarafında en önemli karar 1S ve 2S mimari arasındadır. Single-socket server daha basit locality sunar; inter-socket traffic yoktur ve çoğu workload için operasyonel sadelik sağlar. Güncel tek-socket platformlar çok yüksek core, memory channel ve I/O kapasitesi sunabildiği için eskiden iki socket gerektiren bazı workload’lar bugün tek socket ile karşılanabilir. Bu yaklaşım power, lisanslama ve NUMA karmaşıklığı açısından avantaj yaratabilir.

Dual-socket server ise aggregate core, memory capacity, memory bandwidth veya I/O ihtiyacı gerçekten yüksek olduğunda anlamlıdır. Fakat ikinci socket aynı zamanda ikinci bir locality domain, socket-to-socket coherent traffic ve daha karmaşık tuning anlamına gelir. Bir application thread CPU0 üzerinde çalışırken data CPU1’e bağlı memory’deyse remote access oluşur. Benzer şekilde yüksek hızlı NIC veya NVMe cihazı diğer socket’ın root complex’ine bağlıysa cross-socket traffic artabilir.

İki socket ayrıca high availability anlamına gelmez. Tek chassis, tek motherboard ve çoğu durumda shared management, cooling ve power distribution hâlâ ortak failure domain’dir. Bir socket arızasının davranışı platform RAS özelliklerine bağlı olsa da node-level service continuity için cluster veya application-level redundancy gerekir.

Bu nedenle 1S versus 2S kararı şu sırayla verilmelidir: workload’ın compute ihtiyacı, memory capacity ve bandwidth ihtiyacı, I/O lane ihtiyacı, NUMA toleransı, software licensing modeli, node-loss blast radius ve power budget. Eğer tek socket bu gereksinimleri karşılıyorsa daha karmaşık iki-socket tasarım otomatik olarak daha iyi değildir. Eğer ihtiyaç gerçekten tek socket sınırını aşıyorsa 2S seçilir; ama o zaman NUMA-aware placement ve benchmark acceptance zorunlu hale gelir.

---

## [K08-02] Memory channels, DIMMs, ECC, RAS ve bandwidth

Server memory sizing yapılırken en sık görülen hata yalnız toplam kapasiteye bakmaktır. “Bir terabyte RAM istiyorum” bir capacity requirement’tır; performance requirement değildir. Memory subsystem’in gerçek davranışı channel sayısı, DIMM-per-channel, data rate, controller topology, NUMA placement ve RAS policy tarafından belirlenir. Bu nedenle total RAM rakamı BoQ’da gerekli ama yetersiz bir bilgidir.

Modern server CPU’ları birden fazla independent memory channel taşır. Teorik bandwidth, aktif channel sayısı ve transfer rate ile yakından ilişkilidir. Eğer çok büyük DIMM kullanarak daha az slot doldurursanız kapasite hedefini karşılayabilirsiniz ama bazı channel’ları boş bırakırsanız bandwidth potansiyelini düşürebilirsiniz. Tersine tüm slotları doldurmak da otomatik olarak en iyi çözüm değildir; higher DIMM-per-channel bazı platformlarda supported memory speed’i veya thermal behavior’ı etkileyebilir.

Bu yüzden memory design iki ayrı soruyla başlamalıdır. Birincisi workload’ın working set’i ne kadar capacity gerektiriyor? İkincisi workload’ın memory traffic’i ne kadar bandwidth ve ne kadar düşük latency gerektiriyor? Virtualization ortamında kapasite çoğu zaman öne çıkar; fakat yüksek VM density altında bandwidth de hızla kritik olabilir. In-memory analytics veya HPC workload’unda memory bandwidth primary bottleneck olabilir. Database tarafında capacity, latency ve locality birlikte önemlidir.

DIMM population ayrıca socket’lar arasında dengeli veya bilinçli şekilde asimetrik olmalıdır. Dual-socket bir platformda memory’nin çoğunu tek socket’a yerleştirip her iki CPU’yu yoğun kullanmak remote memory traffic’i artırabilir. Operating system veya hypervisor NUMA topology’yi görür ve memory allocation policy uygulayabilir, ancak fiziksel population kötü ise software bunu tamamen düzeltemez.

ECC server memory’nin temel özelliklerinden biridir. Fakat “ECC var, RAS tamam” demek doğru değildir. ECC belirli bit error’larını detect veya correct eder. Enterprise platformlar buna ek olarak patrol scrubbing, demand scrubbing, memory sparing, mirroring, poison handling veya advanced correction mekanizmaları sunabilir. Hangi özelliklerin gerçekten desteklendiği CPU, memory module, OEM platform ve firmware kombinasyonuna bağlıdır.

Corrected error ile uncorrected error arasındaki operasyonel fark da önemlidir. Corrected error service’i hemen düşürmeyebilir; fakat artan corrected-error rate yaklaşan DIMM failure’ının sinyali olabilir. Bu nedenle BMC veya OS telemetry yalnız log toplamak için değil, threshold ve proactive replacement policy için kullanılmalıdır. Uncorrected memory error ise process, VM veya bütün node seviyesinde ciddi etki yaratabilir.

Memory module tipi de platform-specific bir karardır. RDIMM, high-capacity registered çözümler veya bazı platformlarda higher-bandwidth DIMM teknolojileri kullanılabilir. Burada isimden çok validated population matrix önemlidir. Exact CPU SKU, DIMM part number, quantity, DPC ve effective supported speed vendor support matrix’iyle eşleştirilmelidir. HCI veya certified virtualization gibi ortamlarda HCL bu konuda daha da kritiktir.

Memory oversizing’in de maliyeti vardır. Kullanılmayan capacity CAPEX bağlar, power tüketir ve bazen lisans veya refresh planını etkiler. Undersizing ise paging, VM consolidation limit’i veya application failure yaratır. Golden yaklaşım memory’yi şu sırayla dondurur: working set, total capacity, channel count, DPC, supported speed, NUMA distribution, ECC/RAS policy ve representative workload benchmark. Server memory tasarımı ancak bu zincirin tamamı kapandığında gerçek anlamda tamamlanmıştır.

---

## [K08-03] NUMA ve locality

NUMA, modern multi-socket ve yüksek I/O’lu server’larda görünmeyen ama performansı doğrudan etkileyen mimari katmandır. Non-Uniform Memory Access ifadesi, bir CPU core’un her memory alanına aynı latency ve bandwidth ile erişmediğini anlatır. Local memory kendi locality domain’ine doğrudan bağlıdır; remote memory ise başka bir domain üzerinden coherent interconnect kullanılarak erişilir. Her ikisi de geçerli erişimdir, fakat maliyetleri aynı değildir.

NUMA node ile socket kavramı çoğu zaman karıştırılır. Bir socket fiziksel processor package konumudur. NUMA node ise operating system’in gördüğü locality domain’dir. Bazı platformlarda bir socket bir NUMA node gibi görünebilir; bazı chiplet veya firmware konfigürasyonlarında ilişki daha karmaşık olabilir. Bu yüzden topology varsayılmamalı, işletim sisteminden ve platform dokümanından doğrulanmalıdır.

NUMA yalnız memory ile ilgili değildir. PCI Express root complex’leri de belirli CPU veya locality domain’lerine bağlıdır. High-speed NIC, NVMe SSD, HBA, GPU veya DPU hangi root’a bağlıysa o device’ın “local” CPU ve memory ilişkisi oluşur. Örneğin NIC CPU0’a bağlı ama network-heavy VM’in vCPU’ları CPU1 üzerinde ve buffer memory’si CPU1’e allocate edilmişse trafik socket’lar arası hareket edebilir. Bu da latency ve interconnect bandwidth tüketimi yaratır.

Virtualization tarafında NUMA topology VM sizing’i etkiler. Büyük bir VM physical NUMA boundary’lerini aşıyorsa hypervisor vNUMA sunabilir. Fakat CPU pinning, memory placement ve passthrough device locality yanlışsa application beklenen performansı alamaz. Özellikle latency-sensitive database veya NFV workload’larında “vCPU sayısı doğru” demek yeterli değildir; vCPU, memory ve I/O aynı locality planında düşünülmelidir.

Database ve in-memory sistemlerde NUMA etkisi daha görünür olabilir. Büyük shared-memory structure’lar, buffer pool veya query worker’ları remote memory’ye sık erişiyorsa per-core CPU gücü yüksek olsa bile scaling zayıflar. NUMA-aware application’lar thread ve memory placement yapabilir, fakat fiziksel memory population ve device topology yine temel sınırı oluşturur.

Storage ve network tarafında interrupt ve queue affinity de önemlidir. High-rate NIC queue’ları bir NUMA node’a bağlıyken processing thread’lerinin başka node’da çalışması cross-socket transfer yaratabilir. NVMe-intensive storage node’larında aynı durum drive queue ve CPU relationship için geçerlidir. HCI tasarımında bu daha karmaşık hale gelir çünkü aynı node compute, storage ve network işini birlikte yapar.

NUMA validation için birkaç bilgi mutlaka kayıt altına alınmalıdır: OS-visible node sayısı, her node’a ait CPU/core listesi, memory capacity, PCIe endpoint’lerin root-complex ilişkisi, NIC queue ve interrupt affinity, storage controller veya NVMe locality ve varsa accelerator placement. Bu topology, BoQ’daki fiziksel slot listesiyle eşleştirilmelidir.

Operasyonda NUMA doğrulaması yalnız kurulum günü yapılmamalıdır. BIOS değişikliği, yeni riser, NIC taşıma veya firmware update OS-visible topology’yi etkileyebilir. Bu nedenle golden configuration inventory’sinde NUMA map saklanmalı; performans problemi yaşandığında scheduler, memory allocation ve device locality aynı referans üzerinden karşılaştırılmalıdır. Özellikle büyük cluster’larda node’lar arasında topology drift sessiz ve pahalı bir performans farkı yaratabilir.

En doğru yaklaşım NUMA’yı bir tuning detayı değil, server architecture requirement’ı olarak görmektir. Single-socket server seçmek NUMA problemini büyük ölçüde sadeleştirebilir. Dual-socket gerekiyorsa locality-aware sizing ve benchmark acceptance devreye girer. Golden karar kuralı basittir: CPU, memory ve I/O aynı topology üzerinde haritalanmadan server’ın gerçek performans kapasitesi kabul edilmez.

---

## [K08-04] PCIe, CXL ve I/O lane budget

Bir server’ın I/O kapasitesini anlamanın en doğru yolu slot sayısına değil, lane ve root-complex haritasına bakmaktır. PCI Express modern server’ın temel I/O omurgasıdır. NIC, NVMe, HBA, accelerator, GPU ve bazı CXL device’ları CPU üzerindeki PCIe veya CXL root’larına bağlanır. Her endpoint belirli lane width ve generation ile çalışır. Bu nedenle fiziksel olarak çok slotlu bir chassis, elektriksel olarak aynı derecede güçlü olmayabilir.

PCIe lane bidirectional serial bağlantının temel birimidir. Device’lar x4, x8 veya x16 gibi link width’leri kullanır. Generation arttıkça her lane’in data capability’si yükselir. Fakat burada kritik bir procurement kuralı vardır: endüstride daha yeni PCIe standardı yayımlanmış olması, satın aldığınız server’ın bu generation’ı desteklediği anlamına gelmez. CPU, motherboard routing, riser, backplane ve endpoint device aynı link üzerinde ortak bir capability’de anlaşır.

Bu nedenle RFP’ye yalnız “PCIe Gen5 veya üzeri” yazmak bile bazı durumlarda yetersizdir. Hangi slotun hangi CPU root’una bağlı olduğu, electrical width’i, supported generation’ı ve bifurcation capability’si belirtilmelidir. x16 mechanical slot elektriksel olarak x8 olabilir. Bir riser aynı physical presentation’ı sunarken lane source’u farklı olabilir. PCIe switch kullanılan tasarımda downstream device sayısı artabilir fakat uplink bandwidth ortak kullanılabilir.

Bifurcation özellikle dense NVMe tasarımlarında önemlidir. Bir x16 root port dört x4 NVMe path’ine bölünebilir, ancak CPU, board ve firmware bunu desteklemelidir. Aksi halde fiziksel adapter takılabilir ama tüm drive’lar görünmeyebilir. PCIe switch ise daha esnek fan-out sağlar; karşılığında oversubscription, latency, switch failure domain ve firmware/management karmaşıklığı getirir.

Lane budget hesabı BoQ freeze’den önce yapılmalıdır. Örneğin iki yüksek hızlı NIC, birkaç NVMe group, HBA ve accelerator aynı server’da kullanılacaksa toplam lane tüketimi, root-complex locality ve chassis riser seçenekleri birlikte kapatılmalıdır. “Sekiz PCIe slot var” ifadesi bunun yerine geçmez.

CXL bu resme coherent memory ve device semantics ekler. CXL’i sadece daha hızlı PCIe gibi düşünmek doğru değildir. Memory expansion, pooling veya composability gibi use case’ler CPU, board, slot, firmware, ACPI, operating system ve device support’un birlikte doğrulanmasını gerektirir. CXL standardının daha yeni bir version’ı yayımlanmış olsa bile shipping server platformu daha eski bir CXL generation veya sınırlı device feature set’i destekliyor olabilir.

Bu nedenle “CXL-ready” ifadesi tek başına kabul kriteri değildir. Exact version, device class, lane/port, BIOS option, OS/hypervisor support ve validated device list istenmelidir. Eğer CXL memory expansion kullanılacaksa capacity kadar latency, bandwidth ve locality de modellenmelidir. CXL memory local DDR ile otomatik olarak eşdeğer değildir.

Lifecycle planında da I/O topology önemini korur. Bugün boş bırakılan slotun gelecekte accelerator veya daha hızlı NIC için kullanılacağı düşünülüyorsa yalnız physical boşluk değil reserved lane, root locality, PSU headroom ve cooling capacity de ayrılmalıdır. Aksi halde “future-ready” görünen chassis, refresh döneminde yeni device’ı elektriksel veya termal olarak desteklemeyebilir. Expansion path bir slot listesi değil, kaynak rezervidir.

Golden I/O karar zinciri şöyledir: önce endpoint listesi çıkarılır; gerekli bandwidth belirlenir; lane width ve generation hesaplanır; root complex ve NUMA locality haritalanır; switch veya bifurcation ihtiyacı belirlenir; physical slot/riser seçilir; sonra power, thermal, firmware ve driver support doğrulanır. Bu harita kapanmadan server I/O mimarisi tamamlanmış sayılmaz.

---

## [K08-05] Boot, NVMe, local storage ve network interfaces

Server storage mimarisinde ilk ayrım boot media ile workload data arasındadır. Boot device’ın görevi işletim sistemini veya hypervisor’u güvenilir şekilde başlatmak ve gerektiğinde kolayca recover edilebilmektir. Bu nedenle boot tarafında maksimum benchmark hızı yerine recoverability, mirror capability, firmware support ve replacement procedure daha önemli olabilir. Stateless veya automated infrastructure’da boot device failure’ının çözümü hızlı rebuild olabilir; başka ortamlarda mirrored boot tercih edilebilir.

NVMe konusunda terminoloji çok önemlidir. NVMe bir protocol family’sidir; M.2 ise form factor’dır. NVMe drive M.2, U.2, U.3, E1.S, E3.S veya add-in-card şeklinde olabilir. Bu ayrım BoQ’da açık yazılmazsa yanlış backplane, connector veya hot-plug beklentisi oluşabilir. Local NVMe genellikle PCI Express üzerinden çalışır; NVMe over Fabrics ise network transport üzerinden remote NVMe erişimini kapsar. İkisi aynı deployment modeli değildir.

Local data storage kararı workload’a göre değişir. Stateless compute node küçük ve recoverable boot media ile external storage kullanabilir. HCI node ise data disklerini doğrudan local software-defined storage’a sunar ve controller mode, drive model, firmware ve HCL son derece kritiktir. Database server local low-latency NVMe kullanabilir veya external enterprise storage’a bağlanabilir. Cache veya scratch workload ise yüksek throughput kadar drive endurance’a da ihtiyaç duyar.

Storage drive seçerken capacity dışında endurance, power-loss protection, latency consistency ve telemetry ele alınmalıdır. Write-heavy database veya HCI workload’unda read-intensive drive sınıfı erken wear-out veya performans problemi yaratabilir. DWPD veya TBW gibi endurance ölçümleri use case ile eşleştirilmelidir. Hot-plug gereksinimi varsa yalnız drive’ın çıkarılabilir olması yetmez; backplane, PCIe topology, firmware, OS ve service procedure bunu desteklemelidir.

Network interface de aynı I/O zincirinin parçasıdır. NIC’in link speed’i 100, 200 veya daha yüksek olabilir; fakat host tarafındaki PCIe width ve generation yeterli değilse wire-speed workload elde edilemez. Ayrıca NIC hangi root complex’e bağlıysa NUMA locality oluşur. Queue ve interrupt affinity ile workload placement buna göre düzenlenebilir.

Network redundancy’de port sayısını path diversity ile karıştırmamak gerekir. İki port tek adapter üzerindeyse adapter failure ortak etkidir. İki adapter aynı riser veya root complex’e bağlıysa başka bir common mode vardır. İki kablo aynı upstream switch’e gidiyorsa network path hâlâ shared olabilir. Server level redundancy, rack ve fabric topology ile birlikte değerlendirilmelidir.

BMC’nin OOB port’u ayrıca bir management path’tir. Bazı platformlar dedicated BMC port kullanır; bazıları host NIC üzerinden sideband sharing yapabilir. Management plane’in security ve availability modelinin workload network’ünden ayrı düşünülmesi gerekir. OOB ağı güçlü authentication, certificate governance, logging ve restricted reachability ile tasarlanmalıdır.

Sonuçta storage ve network server’ın “ek kartları” değildir; PCIe lane budget, NUMA, power, thermal ve firmware mimarisinin merkezindedir. Golden seçim sırası boot recovery modeli, workload data pattern’i, drive protocol ve form factor, endurance, controller/backplane topology, NIC bandwidth, root-complex locality, redundancy ve support matrix şeklinde ilerler.

---

## [K08-06] BMC, UEFI, Redfish, firmware ve platform security

Modern server’da management ve firmware katmanı en az CPU ve memory kadar önemlidir. BMC ile UEFI’nin görevleri farklıdır. UEFI host processor’ın boot sürecini başlatır, hardware initialization ve boot services sunar, operating system’e platform bilgisi aktarılmasına yardımcı olur. BMC ise host operating system çalışmasa bile server’ı uzaktan gözlemleyip yönetebilen out-of-band controller’dır. Power cycle, sensor telemetry, firmware management ve remote console gibi işlevler bu katmanda bulunabilir.

BMC yüksek ayrıcalıklı bir bileşendir. Bu nedenle sıradan bir web arayüzü gibi ele alınmamalıdır. Ayrı management network, güçlü identity ve authorization, certificate lifecycle, firmware patching, audit log ve restricted reachability gerekir. Default credential, shared admin account veya Internet’e doğrudan exposure kabul edilebilir bir production design değildir.

Redfish multi-vendor server management için standartlaştırılmış API modelidir. Amaç tek tek vendor GUI’lerine bağımlı kalmadan inventory, telemetry ve lifecycle automation yapabilmektir. Large fleet’te bu önemlidir çünkü yüzlerce server üzerinde BIOS setting, firmware state veya hardware health manuel GUI operasyonuyla yönetilemez. Redfish yanında MCTP ve PLDM gibi management protocol’ları controller ile device arasındaki platform management akışında rol oynar.

Firmware lifecycle tek bir BIOS dosyasından ibaret değildir. CPU microcode, UEFI, BMC, NIC firmware, HBA veya RAID firmware, NVMe drive firmware ve accelerator firmware birlikte bir compatibility matrix oluşturur. Bir component’i “en son firmware”e yükseltmek her zaman doğru değildir; validated baseline, HCL, regression test ve rollback planı gerekir. Özellikle HCI veya certified hypervisor ortamında exact firmware bundle support’un parçasıdır.

Platform security de bir zincirdir. Secure Boot boot edilen executable’ın trust relationship’ini kontrol eder; fakat bütün firmware security problemini çözmez. Measured Boot platform state’ini ölçerek attestation use case’lerine temel oluşturabilir. TPM trusted key ve measurement mekanizmaları sağlar. SPDM gibi device-security protocol’ları component authentication ve measurement senaryolarına yardımcı olabilir. Vendor platformları ek root-of-trust mekanizmaları sunabilir.

Kritik nokta yalnız protection değil detection ve recovery’dir. Firmware compromise veya failed update durumunda platformun güvenilir bir state’e nasıl döneceği tasarlanmalıdır. Signed image varsa ama recovery mechanism yoksa resilience eksiktir. Golden security yaklaşımı firmware’i protect, detect ve recover döngüsü içinde ele alır.

Supply chain tarafında component serial, approved part list, firmware provenance ve update source governance önemlidir. Server’a sonradan eklenen NIC, drive veya accelerator kendi firmware’ini taşır; bu yüzden platform trust yalnız motherboard üzerinde bitmez. Device inventory ve firmware inventory birlikte tutulmalıdır.

Bu control plane’in operasyonel sahibi de net olmalıdır. Server team, security team ve network team arasında BMC certificate, admin role, firmware cadence veya vulnerability response sorumluluğu belirsiz bırakılırsa teknik capability kullanılamaz hale gelir. Golden design bu nedenle yalnız feature listesi değil, ownership, change control, emergency access ve evidence retention modelini de tanımlar. Yönetilebilirlik, ürün fonksiyonundan çok sürekli bir operasyon disiplinidir.

Sonuç olarak BMC, UEFI ve security ayrı ayrı checkbox değil, operasyonel bir control plane’dir. Procurement aşamasında BMC capability, Redfish support, TPM, Secure Boot, measured boot veya root-of-trust requirement, firmware recovery ve update lifecycle yazılmalıdır. Acceptance aşamasında ise management API erişimi, identity policy, telemetry, firmware baseline, recovery procedure ve auditability test edilmelidir.

---

## [K08-07] Power, thermal, serviceability, TCO ve hangi server ne zaman?

Server seçiminin son aşaması compute benchmark’ından daha geniştir. Bir node’un gerçek değeri yalnız performansı değil, power consumption, thermal behavior, serviceability, software licensing, failure-domain size ve lifecycle cost ile birlikte ölçülmelidir. En yüksek core sayısını veya en yoğun 1U configuration’ı seçmek, bütün sistem için en düşük TCO anlamına gelmeyebilir.

Önce power modelini doğru kurmak gerekir. CPU’nun power rating’i whole-server power değildir. Memory DIMM’leri, NIC, NVMe, accelerator, motherboard conversion, fans ve BMC de enerji tüketir. PSU nameplate watt değeri ise server’ın sürekli tüketimi değildir; PSU’nun sağlayabileceği kapasiteyi gösterir. Facility sizing için exact configured BOM’un expected ve worst-case power envelope’i hesaplanmalıdır.

Dual PSU da tek başına resilience kanıtı değildir. Eğer iki PSU aynı rack PDU’dan veya aynı facility electrical path’ten besleniyorsa common mode devam eder. Gerçek A/B tasarım, utility veya UPS path’inden rack PDU’ya, PSU’ya ve internal power distribution’a kadar trace edilmelidir. Bir PSU veya feed kaybında kalan PSU’nun full node load’unu taşıyabildiği doğrulanmalıdır.

Thermal tarafında chassis density önemli bir trade-off’tur. 1U daha fazla node’u aynı rack’e sığdırabilir; fakat küçük fan ve heatsink geometrisi yüksek static pressure gerektirebilir ve fan power artabilir. 2U daha fazla drive, riser veya accelerator alanı ve thermal headroom sağlayabilir. Bu nedenle rack-unit sayısı bir performance class değildir. Exact configuration’ın OEM thermal matrix’i, inlet condition ve altitude limit’i kontrol edilmelidir.

High-power CPU veya accelerator kullanılan sistemlerde liquid cooling gerekebilir. Böyle bir server seçildiğinde facility cooling design ile host interface uyumlu olmalıdır. CDU, facility water system ve technology cooling system boundary’leri K05’te daha derin işlenir; K08 açısından temel kabul kriteri server’ın target rack ve cooling infrastructure ile fiziksel ve operasyonel uyumudur.

Serviceability de TCO’nun parçasıdır. Hot-swap drive, fan veya PSU bulunması faydalıdır; fakat hot-swap workload outage olmayacağı anlamına gelmez. Service continuity cluster veya application redundancy’ye bağlıdır. Rail, cable management, front/rear access, field-replaceable unit ve spare strategy gerçek bakım süresini etkiler. Dense chassis içinde tek bir component replacement’ının diğer cabling veya airflow’u bozup bozmadığı da değerlendirilmelidir.

Software licensing çoğu projede hardware fiyatından daha büyük fark yaratabilir. Per-core licensed database veya virtualization software için çok yüksek core-count CPU seçimi toplam maliyeti artırabilir. Per-host licensed platform ise daha büyük consolidation node’larını ekonomik hale getirebilir. Bu nedenle CPU architecture commercial model görülmeden dondurulmamalıdır.

Son olarak failure-domain size değerlendirilir. Çok büyük bir 2S node yüzlerce VM barındırabilir; node loss olduğunda blast radius büyür. Daha küçük 1S node sayısını artırmak rack, switch ve management overhead yaratabilir ama failure domain’i küçültebilir. Doğru cevap workload ve SLA’ya bağlıdır.

Golden server seçim zinciri bu nedenle workload ile başlar; CPU topology, memory, NUMA ve I/O ile devam eder; storage/network, management/security, power/thermal, serviceability ve lifecycle eklenir; software licensing ve node-loss risk’i hesaba katılır. Son adım representative benchmark ve exact HCL/firmware verification’dır. Ancak bundan sonra BoQ freeze edilir. En iyi server “en büyük” server değil, workload için dengeli ve yaşam döngüsü boyunca yönetilebilir olan server’dır.
