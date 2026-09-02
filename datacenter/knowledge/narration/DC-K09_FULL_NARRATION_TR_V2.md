# DC-K09 — Accelerated Compute / GPU / DPU — Full Narration TR V2

Bu metin DC-K09 Golden Deep Research bulgularını S3F Senior Adviser ses standardı için sekiz bölümlük uzun anlatıma dönüştürür. Quick Brief ayrı bir üretim modudur; bu metin Quick Brief değildir.

---

## [K09-00] Accelerated compute nedir; GPU, DPU, SmartNIC ve FPGA neden aynı şey değildir?

Accelerated compute konuşulurken ilk hata, bütün özel donanımları GPU başlığı altında toplamaktır. Oysa veri merkezindeki accelerator ailesinin üyeleri aynı işi yapmaz. GPU, AI accelerator, FPGA, SmartNIC, DPU ve IPU farklı veri yollarına, programlama modellerine ve failure domain’lerine sahiptir. Bu ayrım yalnız terminoloji değildir; yanlış sınıflandırma yanlış BoQ, yanlış network, yanlış power ve yanlış operasyon modeli üretir.

GPU temel olarak yüksek paralellik gerektiren application compute için kullanılır. Modern data center GPU’ları yoğun matrix ve vector işlemlerini, yüksek bandwidth memory ile birlikte yürütür. AI training, inference, HPC, rendering ve bazı scientific workload’lar bunun örnekleridir. Fakat bir GPU’nun çok yüksek peak compute rakamına sahip olması, her workload’da en yüksek delivered performance vereceği anlamına gelmez. Yazılım stack’i, precision, memory bandwidth, topology ve data feed yetersizse compute birimleri bekler.

Custom AI ASIC veya tensor accelerator daha dar bir workload alanına optimize edilebilir. Bu tip cihazlar belirli operator veya data type’larda çok verimli olabilir, ancak software ecosystem ve portability farklıdır. FPGA ise yeniden programlanabilir logic yapısıyla streaming pipeline, protocol processing, deterministic latency veya özel data transformation gibi işlerde güçlü olabilir. FPGA’yı “GPU’nun daha küçük versiyonu” gibi düşünmek teknik olarak yanlıştır.

SmartNIC kavramı da geniştir. Basit bir NIC network packet taşır. SmartNIC bunun üzerine programmable packet processing, telemetry veya offload ekleyebilir. Fakat her SmartNIC bağımsız infrastructure processor değildir. DPU veya IPU sınıfında ise network, storage, security ve management gibi infrastructure service’leri host CPU’dan ayırmak, hızlandırmak ve bazı durumlarda tenant’tan izole etmek hedeflenir. Bu nedenle DPU’nun başarısı AI modelinin FLOPS değeriyle değil; packet rate, flow count, storage throughput, encryption, isolation ve host CPU offload gibi sonuçlarla ölçülür.

Buradaki kritik mimari ayrım application compute ile infrastructure offload arasındadır. GPU esas iş yükünü hızlandırırken, DPU aynı node’un network, storage veya security işlerini yönetebilir. İkisi birlikte kullanılabilir; fakat birbirinin yerine geçmez. Bir AI server’da GPU sayısını artırmak network ve storage service’lerini otomatik olarak hızlandırmaz. Aynı şekilde güçlü bir DPU da model training compute ihtiyacını ortadan kaldırmaz.

Form factor da accelerator rolünden ayrıdır. Accelerator PCI Express add-in card, OAM benzeri module, vendor-specific baseboard veya rack-scale tray içinde olabilir. OCP Open Accelerator Infrastructure gibi açık çalışmalar, accelerator module, universal baseboard, power, management, tray ve chassis katmanlarını ortaklaştırmaya çalışır. Ancak form factor standardı, üstündeki accelerator’ın aynı performans veya software stack’e sahip olacağı anlamına gelmez.

Doğru tasarım önce workload’ı tanımlar. Training mi, inference mı, HPC mi, video mu, network offload mı, storage acceleration mı? Sonra gereken accelerator rolü seçilir. Application compute gerekiyorsa GPU veya başka compute accelerator değerlendirilir. Infrastructure offload gerekiyorsa DPU, IPU veya SmartNIC sınıfı fonksiyonlar tanımlanır. Sonrasında host attachment, memory, peer topology, network, storage, power, cooling, sharing ve management birlikte kapatılır.

Golden sonuç şudur: Accelerated compute bir cihaz kategorisi değil, birbirinden farklı accelerator rollerinin ortak bir sistem içinde çalışmasıdır. Bir projede “sekiz GPU ve iki DPU” yazmak mühendislik başlangıcıdır, sonuç değildir. Her cihazın neyi hızlandırdığı, hangi data path’e bağlandığı, neyi paylaştığı, neyin failure domain’i olduğu ve hangi ölçümle kabul edileceği açıkça tanımlanmalıdır.

---

## [K09-01] GPU compute, precision, HBM capacity ve memory bandwidth

GPU seçerken katalogdaki en büyük sayı genellikle peak compute rakamıdır. Bu değer faydalıdır, fakat gerçek application performance için yalnız bir üst sınırdır. Delivered performance; compute unit’lerin ne kadar süre gerçek iş yaptığı, verinin memory’den ne kadar hızlı geldiği, precision formatının workload’a uyup uymadığı, communication’ın compute’u ne kadar beklettiği ve software stack’in hardware’i ne kadar iyi kullandığıyla belirlenir.

Precision burada kritik bir karardır. FP64, FP32, BF16, FP16, FP8 ve daha düşük precision formatları farklı workload ihtiyaçlarına hizmet eder. Scientific HPC uygulaması yüksek FP64 doğruluğu isteyebilirken, AI inference daha düşük precision ile kabul edilebilir kaliteyi koruyabilir. Bu nedenle iki accelerator’ın TOPS veya FLOPS değerini karşılaştırmadan önce hangi data type’ın kullanıldığı anlaşılmalıdır. Sparsity kullanılan rakamlar da dense workload rakamlarıyla doğrudan kıyaslanmamalıdır.

İkinci büyük boyut device memory’dir. HBM capacity, modelin veya çalışma setinin ne kadarının accelerator üzerinde resident kalabileceğini belirler. Model weights, optimizer state, activations, KV cache, communication buffers ve framework overhead birlikte düşünülmelidir. Sadece model dosyasının boyutuna bakarak memory sizing yapmak yetersizdir. Ayrıca memory’nin yüzde yüzüne yakın kullanım, scheduler fragmentation ve multi-tenant esneklik açısından risk yaratabilir.

Capacity ile bandwidth aynı şey değildir. İki GPU aynı miktarda HBM taşıyabilir ama farklı memory bandwidth nedeniyle memory-bound workload’da farklı performans gösterebilir. Yüksek compute capability’ye sahip bir accelerator, kernel sürekli memory bekliyorsa peak arithmetic throughput’una yaklaşamaz. Bu nedenle profiling sırasında compute utilization ile birlikte HBM bandwidth ve cache behavior da görülmelidir.

Host memory de accelerator mimarisinin parçasıdır. CPU DRAM dataset staging, preprocessing, control plane, storage ve network stack’i için kullanılır. Accelerator sayısı büyürken host memory channels veya capacity sabit bırakılırsa GPU’lar beslenemeyebilir. Unified memory gibi software abstraction’lar programlamayı kolaylaştırabilir, fakat fiziksel locality ve page migration maliyetini ortadan kaldırmaz.

Training ve inference memory davranışı da farklıdır. Training sırasında optimizer state ve activations ciddi memory tüketebilir; distributed training communication buffers da ek yük yaratır. Inference tarafında model size yanında context length, batch size, concurrency ve KV cache belirleyici olabilir. Uzun context veya yüksek concurrency, aynı model için çok farklı memory ihtiyacı doğurabilir.

Performance acceptance bu nedenle sadece synthetic compute benchmark olmamalıdır. Training için time-to-train veya samples per second, inference için tokens per second, time-to-first-token, inter-token latency ve tail latency gibi application outcome’ları kullanılmalıdır. HPC için simulation step, time-to-solution ve scaling efficiency daha anlamlı olabilir. MLPerf gibi benchmark suite’leri full-system karşılaştırma için yararlıdır, ancak müşteri workload’ının yerine geçmez.

Power cap ve thermal state de GPU performance’ın parçasıdır. Accelerator sustained workload altında thermal throttling yapıyorsa kısa benchmark sonuçları yanıltıcı olabilir. Aynı şekilde rack power sınırı nedeniyle GPU power cap düşürülürse katalog performansı değil, cap altındaki delivered throughput ölçülmelidir. Bu nedenle kabul testi gerçek cooling ve power configuration ile uzun süreli çalışmalıdır.

Golden yaklaşım GPU’yu üç rakamla özetlemez. Compute precision ve gerçek workload compatibility, device memory capacity, memory bandwidth, application data movement ve sustained thermal-power behavior birlikte değerlendirilir. En iyi accelerator en yüksek teorik FLOPS değerine sahip olan değil; hedef workload’ın verisini memory’den compute’a, compute’tan peer veya network’e en az bekleme ve kabul edilebilir enerji maliyetiyle taşıyan platformdur.

---

## [K09-02] PCIe, CXL, NUMA ve accelerator locality

Bir accelerator server’a takıldığında performans yolculuğu GPU üzerinde başlamaz. İlk gerçek topology sorusu cihazın hangi CPU, root complex, PCI Express switch ve NUMA domain’e bağlı olduğudur. Bu yol yanlış tasarlanırsa accelerator kendi içinde çok hızlı olsa bile host memory, NIC veya storage ile haberleşirken gereksiz hop ve bottleneck oluşabilir.

PCI Express data center accelerator’larının yaygın host interface’idir. Endüstride daha yeni PCIe specification yayımlanmış olabilir; bu, satın alınan CPU, motherboard, riser, retimer, switch ve accelerator’ın o generation’da çalışacağı anlamına gelmez. Canlı link bütün zincirin ortak desteklediği generation ve width ile negotiate olur. Fiziksel x16 slot görmek elektriksel x16 bağlantının kanıtı değildir.

Bu nedenle lane budget mühendisliği yapılmalıdır. Her GPU, NIC, DPU, NVMe ve HBA root complex kaynaklarını tüketir. Çok accelerator’lı bir server’da PCIe switch kullanmak fan-out sağlayabilir, fakat oversubscription ve shared failure domain yaratabilir. Bir switch arızası aynı anda birden fazla GPU ve NIC’i kaybettirebilir. Switch’in upstream bandwidth’i downstream device toplam talebinden düşükse bütün cihazlar aynı anda yoğunken contention oluşabilir.

Retimer’lar yüksek data rate’lerde signal integrity için gerekli olabilir. Retimer eklemek yanlış değildir; ancak firmware, compatibility ve failure analysis’e yeni bir eleman ekler. Golden topology diagram’ında retimer ve PCIe switch gibi görünmeyen ara elemanlar da gösterilmelidir.

NUMA locality, özellikle dual-socket host’larda kritik hale gelir. Bir GPU CPU0 root complex’ine, NIC CPU1’e bağlıysa direct data movement veya application control traffic socket’lar arası geçebilir. Remote memory erişimi de aynı şekilde ek latency ve inter-socket bandwidth tüketir. Bu nedenle “server’da sekiz GPU ve sekiz NIC var” bilgisi yeterli değildir; hangi GPU’nun hangi NIC ve CPU’ya local olduğu bilinmelidir.

GPU Direct benzeri vendor teknolojileri CPU bounce buffer’ı azaltarak GPU ile NIC veya storage arasında daha doğrudan data path sağlayabilir. Buradaki vendor-neutral ders, data path’i kısaltmanın ve doğru affinity kullanmanın önemli olduğudur. Direct path var diye topology önemsiz hale gelmez; tam tersine NIC’in GPU’ya en yakın PCIe path üzerinde olması daha değerli olur.

CXL ise coherent memory ve heterogeneous compute için açık bir interconnect ailesidir. Yeni CXL generation’ları accelerator ve memory architecture’a önemli imkanlar getirir, ancak standardın var olması belirli bir shipping GPU’nun CXL feature setini kullandığı anlamına gelmez. RFP’de “CXL 4.0 olsun” demek yerine ihtiyaç duyulan coherent memory, pooling veya accelerator interface fonksiyonu tanımlanmalı ve platform support matrix’iyle doğrulanmalıdır.

Firmware ayarları da topology’nin parçasıdır. Large BAR, Above 4G Decoding, IOMMU, ACS ve SR-IOV gibi ayarlar bazı accelerator veya virtualization senaryolarında gerekli olabilir. Fakat bütün ayarları her workload için aktif etmek doğru değildir. Vendor validated BIOS baseline ve hedef workload testleri birlikte kullanılmalıdır.

Acceptance sırasında her accelerator için fiziksel pozisyon, CPU/NUMA affinity, root complex, switch path, live PCIe generation ve width, peer topology, local NIC ve storage path kaydedilmelidir. Sonra synthetic link testleriyle yetinmeden representative application çalıştırılmalıdır. Bir cihaz doğru enumerate olmuş olabilir ama link downtrain nedeniyle beklenen throughput’u vermeyebilir.

Golden sonuç şudur: accelerator locality bir optimizasyon ayrıntısı değil, platform architecture’dır. CPU, memory, GPU, NIC, DPU ve storage arasındaki gerçek fiziksel data path bilinmeden multi-accelerator server freeze edilmemelidir. BoQ yalnız cihaz listesini değil, bu ilişkileri de tarif etmelidir.

---

## [K09-03] Scale-up, scale-out ve multi-accelerator topology

Tek accelerator’dan çok accelerator’a geçtiğimiz anda interconnect, compute kadar önemli hale gelir. Fakat burada iki farklı kavram sürekli karıştırılır: scale-up ve scale-out. Scale-up, accelerator’ları daha sıkı bağlı bir compute domain içinde birleştirir. Scale-out ise node veya rack’leri network fabric üzerinden daha büyük cluster’a bağlar. Birinin hızlı olması diğerini otomatik olarak çözmez.

Scale-up domain genellikle peer accelerator iletişiminde yüksek bandwidth ve düşük latency hedefler. Bunun implementasyonu vendor-specific olabilir; baseboard üzerindeki direct links, accelerator switches veya rack-scale switch trays kullanılabilir. OCP OAI ve Universal Baseboard gibi açık çalışmalar fiziksel accelerator infrastructure için ortak yapı tarif ederken, gerçek peer protocol farklı olabilir.

Scale-out tarafında ise Ethernet veya InfiniBand gibi network teknolojileri devreye girer. Ayrıntılı AI/HPC network tasarımı başka bir modülün konusudur; fakat accelerator acceptance için network bandwidth, topology ve NIC locality vazgeçilmezdir. Distributed training sırasında GPU’lar collective operation’larda birbirini bekler. Scale-out fabric yetersiz veya congestion altındaysa pahalı accelerator’lar idle kalır.

Topology’nin etkisi sadece link speed değildir. Bisection bandwidth, hop count, switch oversubscription ve hangi GPU’nun hangi peer’a kaç hop ile ulaştığı önemlidir. Sekiz accelerator’lı iki sistem aynı device modeline sahip olsa bile biri fully connected veya yüksek bisection topology, diğeri shared switch bottleneck nedeniyle farklı scaling gösterebilir.

Collective communication bu farkı görünür yapar. All-reduce, all-gather ve reduce-scatter gibi operations distributed workload’ın kritik parçalarıdır. Point-to-point bandwidth testinin iyi olması, collective efficiency’nin iyi olacağını garanti etmez. Golden acceptance gerçek application communication pattern’ını veya onu temsil eden collective benchmark’ı içermelidir.

Rack-scale AI sistemleri scale-up kavramını node sınırının ötesine taşıyabilir. Güncel vendor reference sistemleri compute trays, accelerator switch trays, passive backplanes, management network, power shelves ve liquid cooling manifold’larını tek rack-scale product gibi entegre ediyor. Bu yaklaşım daha büyük accelerator domain yaratabilir, fakat rack’in kendisini büyük bir common failure domain’e dönüştürür. Bir power, cooling veya switch probleminde onlarca accelerator etkilenebilir.

Scale-up redundancy de dikkatle analiz edilmelidir. İki fiziksel link veya iki switch görmek end-to-end path independence anlamına gelmez. Ortak backplane, cable cartridge, power shelf, management controller veya cooling domain bulunabilir. Failure injection testleri design diagram’daki redundancy’nin gerçek davranışını göstermelidir.

Scale-out cluster tasarımında job placement topology-aware olmalıdır. Scheduler sekiz sağlıklı GPU buldu diye bunları rastgele dört node veya farklı network locality’lerine dağıtırsa job çalışabilir, ancak performans düşebilir. Resource allocation accelerator model, memory ve count yanında topology requirement taşımalıdır.

Training, inference ve HPC’nin scaling davranışları da aynı değildir. Büyük training job’ları collective bandwidth’e çok hassas olabilir. Inference serving daha bağımsız replicas kullanabilir ve scale-out pattern farklı olabilir. HPC ise latency veya deterministic communication’a daha duyarlı olabilir. Bu nedenle cluster topology workload mix’e göre tasarlanmalıdır.

Golden karar, accelerator quantity ile domain architecture’ı birlikte dondurur. Kaç GPU olduğundan önce şu sorular kapanmalıdır: Bir scale-up domain kaç accelerator içeriyor? İç topology nedir? Domain failure olduğunda blast radius nedir? Scale-out NIC’leri hangi GPU’lara local? Network oversubscription ne? Scheduler bu topology’yi biliyor mu? Acceptance testi hangi collective veya application metric’i kullanıyor? Bu sorular cevaplanmadan “GPU cluster” yalnız satın alma listesidir.

---

## [K09-04] DPU, IPU ve SmartNIC gerçekte ne yapar?

DPU konuşmalarında en büyük risk, güçlü bir network adapter ile gerçek infrastructure processing domain arasındaki farkın kaybolmasıdır. Bir NIC packet gönderir ve alır. SmartNIC programmable offload ekleyebilir. DPU veya IPU ise network, storage, security ve management service’lerini host CPU’dan ayırarak ayrı bir execution ve trust domain oluşturmayı hedefleyebilir. Ancak ürün adları standart değildir; fonksiyonlar tek tek tanımlanmalıdır.

Infrastructure offload’ın temel amacı host CPU’nun application work’e daha fazla kaynak ayırması olabilir. Virtual switch, overlay, routing, encryption, firewall, storage virtualization veya telemetry DPU üzerinde çalıştığında host CPU core’ları bu işlerden kurtulabilir. Fakat offload ücretsiz değildir. DPU’nun kendi CPU’su, memory’si, accelerator engines’i, firmware’i ve power budget’ı vardır. Aynı anda network, storage ve security service’i çalıştırılıyorsa hepsinin ortak kapasitesi test edilmelidir.

İkinci değer isolation’dır. Cloud provider, infrastructure service’lerini tenant operating system’inden ayrı bir processor üzerinde çalıştırabilir. Böylece tenant host üzerindeki privileged software’den infrastructure control plane’i ayırmak mümkün olabilir. Fakat gerçek isolation secure boot, firmware trust, access control ve management network tasarımına bağlıdır. “DPU var” demek tek başına zero-trust mimari kanıtı değildir.

DPU failure domain olarak da değerlendirilmelidir. Bir host’un bütün network ve storage connectivity’si tek DPU üzerinden geçiyorsa, DPU arızası CPU ve GPU sağlıklı olsa bile node’u servis dışı bırakabilir. İki port olması da redundancy kanıtı değildir; portlar aynı device ve firmware domain’indedir. Gerekiyorsa dual DPU, alternate path veya cluster-level evacuation modeli tasarlanmalıdır.

AI cluster’larda DPU’nun rolü daha da belirgin olabilir. GPU’ya yüksek hızlı data taşınırken virtual networking, storage access, security ve tenant isolation host CPU üzerinde önemli overhead yaratabilir. DPU bu işlerin bir kısmını offload ederek CPU ve GPU utilization’ını artırabilir. Fakat DPU scale-up GPU fabric’in yerine geçmez. DPU’nun 400 veya 800 gigabit network portu olması, GPU peer interconnect’i veya cluster collective architecture’ı otomatik olarak çözmez.

Storage acceleration da ayrı bir use case’tir. Remote NVMe, NVMe over Fabrics, encryption, compression veya storage virtualization DPU üzerinden işlenebilir. Bu durumda acceptance yalnız network packet testine dayanamaz. Network ve storage load aynı anda çalıştırılmalı; DPU CPU, memory, queue, crypto ve storage engines birlikte izlenmelidir.

Management modeli önemlidir. DPU kendi operating system image’ına, firmware’e, agent’lara ve orchestration tool’larına sahip olabilir. Bu platformu kim patch edecek? BMC team mi, network team mi, virtualization team mi? DPU reset edildiğinde host ne olur? Firmware update host reboot ister mi? Rollback nasıl yapılır? Bu sorular procurement sırasında kapanmalıdır.

Vendor örnekleri kavramı anlamak için yararlıdır. NVIDIA BlueField, AMD Pensando ve Intel IPU network, storage, security ve infrastructure offload alanlarında farklı implementation’lar sunar. Fakat Golden requirement vendor feature name yazmaz. Gereken packet rate, bandwidth, isolation, virtual function sayısı, storage throughput, crypto, telemetry, management ve failover sonucu tanımlar.

DPU seçiminin ekonomik tarafı da vardır. Host CPU core tasarrufu, higher utilization ve security isolation değer yaratabilir; ancak DPU CAPEX, power, software ve operations complexity ekler. DPU alınması otomatik TCO avantajı değildir. Kazanım representative workload altında ölçülmelidir.

Golden sonuç nettir: DPU veya IPU bir aksesuar değil, infrastructure subsystem’dir. Data path, trust boundary, capacity, failure behavior, management ownership ve lifecycle ayrı ayrı modellenmelidir. DPU’nun platformdaki görevi açık değilse BoQ’ya yalnız marka adı eklemek tasarım sayılmaz.

---

## [K09-05] Virtualization, partitioning ve accelerator scheduling

Accelerator’ların maliyeti yükseldikçe sharing ve utilization kritik hale gelir. Ancak bir GPU’yu birden fazla tenant veya workload arasında paylaşmanın tek yöntemi yoktur. Full-device passthrough, spatial partitioning, SR-IOV virtual functions, temporal sharing ve software scheduling farklı isolation ve performance sonuçları üretir. Bu nedenle “GPU virtualization destekleniyor” cümlesi yeterli değildir.

Full-device passthrough en basit performance modelidir. Bir VM veya workload fiziksel accelerator’ı doğrudan kullanır. Performance predictability yüksektir ve troubleshooting daha kolay olabilir. Buna karşılık küçük işler bütün GPU’yu işgal eder ve cluster fragmentation artabilir. Device fail olursa bütün workload kaybolur.

Spatial partitioning, physical GPU’nun compute ve memory kaynaklarını hardware-level bölgelere ayırabilir. NVIDIA MIG veya AMD’nin bazı Instinct partitioning modelleri bunun vendor implementation örnekleridir. Partition’lar daha iyi isolation ve concurrent utilization sağlayabilir, ancak profile çeşitliliği scheduler fragmentation yaratır. Boş toplam memory olsa bile istenen partition shape oluşmayabilir.

Temporal sharing bir GPU üzerinde workload’ların sırayla çalışmasına dayanır. Utilization artabilir fakat latency jitter ve noisy-neighbor etkisi daha yüksek olabilir. Interactive inference gibi tail-latency hassas service’lerde temporal sharing dikkatle benchmark edilmelidir.

SR-IOV ise PCIe device’ın virtual functions sunmasına imkan verir. GPU veya DPU’da SR-IOV support device ve driver’a bağlıdır. IOMMU, ACS, firmware ve hypervisor configuration da önemlidir. SR-IOV virtual function yaratılması, bütün physical device failure domain’inden bağımsızlık sağlamaz. Aynı physical card’ın reset veya hardware fault’u birden fazla VF’i etkileyebilir.

Kubernetes accelerator scheduling’de klasik Device Plugin framework uzun süredir kullanılır. Dynamic Resource Allocation ise daha zengin device attributes ve ResourceClaim modeli sunar. Current Kubernetes sürümlerinde DRA stable hale gelmiştir. Bu, accelerator allocation için topology, device class, health veya başka properties’i daha iyi ifade etmeye imkan verir. Ancak third-party driver ve scheduler policy yine gerçek deployment’ın parçasıdır.

Scheduler’ın yalnız `gpu count` bilmesi yetersizdir. Büyük job’larda GPU model, HBM capacity, partition profile, peer topology, NUMA domain, local NIC, fabric domain ve health status placement kararını etkileyebilir. Sekiz GPU isteyen job’ın sekiz farklı düşük-bandwidth path’e yerleşmesi teknik olarak allocation success, operasyonel olarak performance failure olabilir.

Multi-tenant service’te accounting de gerekir. Hangi tenant kaç device-hour veya partition-hour kullandı? Power cap ve performance class farklı mı? Failed job zamanı ücretlendirilecek mi? Reserved capacity nasıl tutulacak? GPUaaS veya accelerator-as-a-service ekonomisi bu telemetry olmadan yönetilemez.

Maintenance sırasında scheduling ile hardware lifecycle birleşir. Firmware veya driver update için node drain gerekebilir. Rack-scale domain’de bir switch veya cooling maintenance onlarca GPU’yu etkileyebilir. Scheduler bu kapasite kaybını önceden absorbe edebilecek headroom’a sahip olmalıdır.

Golden paylaşım modeli şu soruları kapatır: Device dedicated mı shared mı? Isolation hardware mı time-based mi? Partition profile kim yönetiyor? Reset blast radius ne? Scheduler topology-aware mı? Health degradation allocation’dan çıkarılıyor mu? Accounting ve quota nasıl yapılıyor? Bu soruların cevabı yoksa virtualization yalnız teknik bir capability’dir, production service modeli değildir.

---

## [K09-06] Power, liquid cooling, rack-scale integration ve failure modes

Accelerated compute platformu data hall’a geldiğinde server engineering ile facility engineering birbirinden ayrı kalamaz. GPU sayısı ve power yoğunluğu arttıkça rack power distribution, liquid cooling, structural load, cabling ve serviceability accelerator topology’nin parçası olur. Rack-scale AI sistemleri bu coupling’i en görünür hale getiren örnektir.

İlk ayrım accelerator board power ile rack power arasındadır. Rack toplamında CPU, memory, NIC, DPU, scale-up switches, storage, fans, pumps ve power conversion losses bulunur. Bu nedenle accelerator sayısını device TDP ile çarpmak yeterli rack sizing değildir. Sustained workload power ve transient behavior platform validation’dan alınmalıdır.

Power cap performansı doğrudan etkileyebilir. Facility belirli rack power sınırına göre tasarlandıysa accelerator power cap düşürülebilir. Bu durumda satın alınan GPU’nun katalog peak performansı değil, gerçek cap altındaki workload throughput’u kabul kriteridir. Power limit değişiklikleri benchmark kayıtlarında version-controlled olmalıdır.

Cooling de benzer şekilde device label’dan daha geniştir. Direct-to-chip liquid cooling GPU ve CPU heat’in önemli kısmını yakalayabilir, fakat memory, NIC, DPU, storage, power supplies ve bazı switch components için residual air cooling devam edebilir. Liquid cooling tasarlayıp residual air load’u unutmak yeni bir bottleneck yaratır.

CDU ve manifold failure domain’leri dikkatle modellenmelidir. Bir shared manifold çok sayıda compute tray’i besliyorsa leak isolation veya pump fault büyük blast radius yaratabilir. Quick disconnect, valve zoning, leak detection, drainage, recovery procedure ve workload evacuation birlikte planlanmalıdır. Cooling system’in N+1 olması tek başına her rack’in bağımsız olduğu anlamına gelmez.

Rack-scale sistemlerde power shelves, busbar, liquid manifold, scale-up switch trays ve compute trays aynı product envelope içinde olabilir. Bu integration deployment’ı hızlandırabilir, fakat replacement ve maintenance prosedürünü de vendor-specific hale getirebilir. Bir switch tray değişimi için kaç compute workload etkilenir? Busbar isolation bütün rack’i kapatır mı? Manifold maintenance canlı yapılabilir mi? Bunlar acceptance sırasında test edilmelidir.

Thermal throttling gizli failure mode’dur. Server çalışmaya devam ederken GPU clock düşebilir ve application throughput geriler. Bu nedenle alarm yalnız “temperature too high” olmamalıdır; clock, power, throttle reason ve application KPI korele edilmelidir. Long-duration sustained load test, kısa synthetic benchmark’tan daha değerlidir.

PCIe link downtraining de benzer sessiz performans kaybı yaratır. Accelerator enumerate olur ve job çalışır, fakat x16 yerine x8 veya beklenenden düşük generation ile bağlıdır. Automated inventory, live link state’i BoQ topology ile karşılaştırmalıdır. PCIe switch veya retimer error’ları da telemetry’ye dahil edilmelidir.

DPU, scale-up switch, NIC ve storage failure accelerator availability’nin parçasıdır. GPU sağlıklı olsa bile local NIC kaybı distributed job’ı durdurabilir. DPU overload network ve storage latency’yi artırıp GPU utilization’ını düşürebilir. Scale-up switch failure büyük peer domain’i etkileyebilir. FMEA bu nedenle yalnız GPU hardware fault’larına odaklanmamalıdır.

Golden facility acceptance accelerator platformu gerçek rack envelope içinde test eder. Power feed, power cap, cooling supply, residual air, network, storage ve scheduler production configuration’a yakın olmalıdır. Amaç cihazın açıldığını kanıtlamak değil; platformun sustained application performance’ı güvenli, servis edilebilir ve failure-aware şekilde sağlayabildiğini kanıtlamaktır.

---

## [K09-07] Accelerator platformu nasıl seçilir, benchmark edilir ve BoQ’da freeze edilir?

Accelerator projesinin sonunda alınacak karar “hangi GPU daha hızlı?” sorusundan çok daha geniştir. Doğru seçim, hedef workload’ın delivered result’ını kabul edilebilir risk ve toplam maliyetle üreten bütün platformdur. Bu nedenle procurement süreci workload definition ile başlar ve representative benchmark ile biter.

Birinci adım workload ve SLA’dır. Training için model, dataset, target quality, time-to-train ve scaling hedefi; inference için model size, context, concurrency, latency ve throughput hedefi; HPC için precision ve time-to-solution; infrastructure offload için packet, flow, storage ve security requirement belirlenir. Bu bilgiler yoksa accelerator sizing yalnız spekülasyondur.

İkinci adım accelerator rolünü seçmektir. Application compute için GPU, custom AI accelerator veya FPGA; infrastructure service için DPU, IPU veya SmartNIC değerlendirilebilir. Aynı platformda birden fazla accelerator rolü birlikte bulunabilir. Her birinin data path ve failure domain’i ayrı çizilmelidir.

Üçüncü adım software ve precision’dır. Framework, compiler, runtime, driver, library ve container stack hedef hardware’i gerçekten destekliyor mu? Workload hangi precision ile kalite hedefini koruyor? Vendor benchmark’ı aynı software ve precision şartlarında mı? Bu sorular cevaplanmadan peak performance karşılaştırması yapılmamalıdır.

Dördüncü adım memory ve topology’dir. HBM capacity, bandwidth, headroom, host memory, CPU/NUMA locality, PCI Express lanes, switches, retimers ve local NIC ilişkisi kapanmalıdır. Sonra scale-up domain tanımlanır: kaç accelerator, hangi peer topology, hangi switches ve hangi failure blast radius? Scale-out için network interface boundary tanımlanır; ayrıntılı network engineering daha sonraki modülde yapılır.

Beşinci adım sharing modelidir. Dedicated device mı, passthrough mu, SR-IOV mu, spatial partition mı, temporal sharing mi? Scheduler hangi topology ve health attribute’larını biliyor? Multi-tenant reset ve firmware update blast radius ne? Utilization target ile isolation target arasında trade-off yapılır.

Altıncı adım facility coupling’dir. Rack sustained power, cap strategy, cooling method, liquid interface, residual air, weight, cable management ve service routes doğrulanır. Rack-scale system seçilmişse power shelves, switches, manifolds ve compute trays tek integrated BOM ve failure model olarak ele alınır.

Yedinci adım acceptance testidir. Inventory ve live link state ile başlanır. Single-device workload benchmark, multi-device peer/collective test, multi-node application test, storage feed ve NIC locality testi yapılır. DPU varsa network-storage-security simultaneous load test edilir. Thermal sustained test, power cap test ve selected failure injection senaryoları uygulanır. Sonuçlar application KPI ile correlation içinde incelenir.

BoQ bundan sonra freeze edilir. BoQ accelerator model ve quantity yanında memory, form factor, host topology, PCIe/CXL requirement, scale-up components, NIC/DPU, storage interface, power/cooling, software baseline, virtualization model, HCL/support, acceptance benchmark ve spare policy içermelidir. “Sekiz GPU’lu server” engineering BoQ değildir.

TCO değerlendirmesi de device fiyatından geniş olmalıdır. Host, fabric, DPU/NIC, storage, rack power, cooling, software, support, energy, operations ve stranded capacity toplam maliyete girer. En pahalı accelerator doğru utilization ile düşük cost-per-token sağlayabilir; daha ucuz accelerator network veya memory bottleneck nedeniyle pahalıya gelebilir.

Golden freeze noktası nettir: Workload, software, memory, host attachment, peer topology, network/storage feed, sharing model, power/cooling, operations, failure behavior, representative benchmark ve lifecycle birlikte kabul edildiğinde platform freeze edilir. Accelerated compute yatırımında güvenilir sonuç, en büyük katalog rakamını satın almak değil; bütün data path’i ölçülebilir bir service outcome’a dönüştürmektir.
