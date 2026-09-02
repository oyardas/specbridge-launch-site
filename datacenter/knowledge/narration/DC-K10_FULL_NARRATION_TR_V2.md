# DC-K10 — Virtualization & Containers — Full Narration TR V2

Bu metin DC-K10 Golden Deep Research bulgularını S3F Senior Adviser ses standardı için sekiz bölümlük uzun anlatıma dönüştürür. Quick Brief ayrı bir üretim modudur; bu metin Quick Brief değildir.

---

## [K10-00] Sanallaştırma nedir; VM, container ve hypervisor neden aynı şey değildir?

Sanallaştırma konuşulurken ilk hata, VM, container, hypervisor ve Kubernetes kavramlarını aynı soyutlama katmanının farklı isimleri gibi kullanmaktır. Oysa bu teknolojiler farklı sınırlar oluşturur. Bir sanal makine, işlemci, bellek, firmware ve aygıtların sanal bir görünümünü bir guest işletim sistemine sunar. Guest kendi kernel’ını çalıştırır. Normal bir Linux container ise çoğunlukla host kernel’ını paylaşan süreçleri namespace, cgroup ve diğer kernel güvenlik mekanizmalarıyla izole eder. Bu nedenle VM ile container arasındaki fark yalnız başlangıç süresi veya kaynak tüketimi değildir; güvenlik sınırı, patch modeli, state yönetimi ve failure domain de değişir.

Hypervisor, sanal makinelerin CPU, memory ve virtual device kaynaklarını yöneten execution katmanıdır. Container runtime ise OCI benzeri container tanımlarını süreçlere dönüştürür. Kubernetes ise bu runtime’ların üzerinde çalışan bir orchestrator’dır; Pod’ları node’lara yerleştirir, desired state’i korur ve network, storage ve device entegrasyonlarını koordine eder. Kubernetes bir hypervisor değildir. Aynı şekilde containerd veya runc bir cluster orchestrator değildir. Bu ayrımlar BoQ’da doğru ürünün, doğru lisansın ve doğru operasyon sorumluluğunun tanımlanması için gereklidir.

Bare metal de sıfır soyutlama anlamına gelmez. İşletim sistemi yine CPU scheduler, virtual memory, driver, IOMMU ve filesystem katmanları kullanır. Ancak genel amaçlı bir server hypervisor arada olmadığı için workload’un işletim sistemi doğrudan fiziksel host üzerinde çalışır. Bu model çok yüksek determinism, özel device erişimi veya belirli lisanslama gereksinimlerinde doğru olabilir. Fakat bare metal seçmek otomatik olarak en iyi performans veya en iyi güvenlik demek değildir; yaşam döngüsü ve HA modeli ayrıca tasarlanmalıdır.

VM’in temel avantajı bağımsız guest kernel ve daha güçlü makine sınırıdır. Legacy uygulamalar, appliance imajları, belirli işletim sistemi sertifikasyonları veya güçlü tenant ayrımı bu modeli tercih ettirebilir. Container’ın temel avantajı ise application packaging ile execution ortamını daha tekrarlanabilir hale getirmesi ve düşük guest-OS overhead’iyle hızlı rollout, scale-out ve CI/CD akışlarına uyum sağlamasıdır. Ancak container’ın hafif olması, uygulamanın stateless olduğu veya node failure’dan otomatik olarak etkilenmeyeceği anlamına gelmez.

Modern platformlarda üçüncü bir yol da vardır: sandboxed veya VM-backed container runtime. Burada kullanıcı container image ve Pod benzeri lifecycle kullanabilir, fakat execution sınırına küçük bir virtual machine veya daha güçlü izolasyon katmanı eklenir. Bu yaklaşım özellikle untrusted workload veya multi-tenant code execution gibi senaryolarda değerlidir. Yine de ek memory, startup ve device compatibility maliyeti vardır. RuntimeClass seçmek tek başına güçlü izolasyon garantisi değildir; gerçek runtime implementasyonu ve host konfigürasyonu doğrulanmalıdır.

KubeVirt gibi platformlar ise Kubernetes kontrol modeli altında sanal makineleri yönetir. Buradaki workload hâlâ bir VM’dir; guest işletim sistemi ve virtual hardware boundary korunur. Kubernetes API ve scheduler VM’in lifecycle’ını yönetiyor diye onu container saymak hatalıdır. Bu model legacy VM ile cloud-native operasyonu yakınlaştırabilir, fakat Kubernetes, hypervisor, storage, network ve VM lifecycle bağımlılıklarını aynı tasarım içinde birleştirir.

Doğru başlangıç sorusu “VM mi container mı?” değildir. Önce workload’un bağımsız kernel gereksinimi, güvenlik sınırı, state modeli, portability hedefi, startup ve deployment davranışı, device ihtiyacı, vendor certification durumu ve availability tasarımı tanımlanmalıdır. Ardından bare metal, VM, ordinary container, sandboxed container veya Kubernetes-managed VM seçenekleri değerlendirilir.

Golden sonuç şudur: Sanallaştırma bir consolidation ürünü değil, execution boundary tasarımıdır. VM, container ve orchestrator birbirinin daha yeni veya daha eski versiyonu değildir. Her biri farklı kaynak, güvenlik, lifecycle ve recovery sözleşmesi yaratır. Platform ancak workload’un hangi sınırda çalışacağı ve bu sınırın nasıl işletileceği açıkça kabul edildiğinde freeze edilmelidir.

---

## [K10-01] vCPU, memory, NUMA ve overcommit nasıl gerçekten çalışır?

Sanallaştırılmış compute kapasitesini tasarlarken en sık yapılan hata, vCPU sayısını fiziksel core sayısı gibi okumaktır. vCPU guest’in gördüğü bir scheduling context’tir. Hypervisor bu vCPU’ları host üzerindeki physical core ve hardware thread’lere zamanlar. Bir fiziksel core aynı anda birden fazla hardware thread sunabilir, fakat bu thread’ler core kaynaklarını paylaşır. Bu nedenle socket, core, hardware thread ve vCPU aynı kapasite birimi değildir. Lisanslama, performans ve consolidation hesabında hangi birimin kullanıldığı açıkça yazılmalıdır.

CPU overcommit, bütün VM’lerin aynı anda peak kullanmadığı varsayımıyla daha fazla vCPU tanımlamaya imkan verir. Bu ekonomik olarak güçlü olabilir, fakat overcommit guaranteed capacity değildir. Workload’lar eşzamanlı peak’e çıktığında scheduler queue oluşur ve latency artar. Güvenli bir universal ratio yoktur. Bir VDI cluster, bir database cluster ve genel amaçlı application server havuzu farklı davranır. Doğru ratio, observed concurrency, latency SLO ve failure sırasında kalan host kapasitesiyle belirlenir.

Reservation, limit, shares ve pinning de birbirine karıştırılmamalıdır. Reservation belirli bir minimum entitlement korumayı hedefler. Limit workload’un üst tüketimini kısıtlar. Shares veya weights contention anında relative priority sağlar. CPU pinning ise belirli vCPU veya execution thread’lerini seçilmiş physical CPU’lara bağlar. Pinning determinism sağlayabilir ama scheduler esnekliğini azaltır. Ayrıca yalnız vCPU’yu pinleyip QEMU emulator veya I/O thread’lerini başka NUMA domain’de bırakmak istenen sonucu bozabilir.

Memory tarafında da configured RAM ile gerçek physical consumption aynı değildir. Guest’e tahsis edilmiş memory, host üzerinde resident memory, workload working set ve guaranteed memory farklı ölçümlerdir. Memory overcommit mümkündür, fakat CPU overcommit’e göre failure davranışı daha serttir. Host memory pressure yükseldiğinde ballooning, guest swap, host swap veya OOM gibi mekanizmalar devreye girebilir. Bunların her biri workload latency ve stability üzerinde farklı etki yaratır.

Ballooning kontrollü bir reclamation mekanizmasıdır; gerçekten kullanılmayan guest page’lerini geri kazanmak için yararlı olabilir. Fakat memory’nin application tarafından aktif kullanıldığı anda ballooning performansı koruyamaz. Host-side swapping liveness sağlayabilir ama latency-sensitive workload’larda ciddi bozulma yaratabilir. Guest swap ise guest OS politikasıdır ve host pressure ile birleştiğinde çift taraflı paging sorunu oluşturabilir. Bu nedenle production acceptance yalnız “host RAM doluyor mu?” sorusuna bakmamalıdır.

NUMA, abstraction’ın ortadan kaldıramadığı fiziksel gerçektir. Dual-socket veya multi-die server’da CPU ve memory erişim maliyeti local ve remote domain’lerde farklı olabilir. Büyük VM’lerde vNUMA topology, physical NUMA ile uyumlu tasarlanmalıdır. vCPU bir socket tarafında, guest memory diğer tarafta ve yüksek hızlı NIC üçüncü bir PCIe path üzerinde ise workload headline CPU ve RAM kapasitesine rağmen yavaşlayabilir. CPU, memory ve I/O locality birlikte görülmelidir.

Huge pages selected workload’larda TLB overhead’ini azaltabilir, fakat host üzerinde rezervasyon ve fragmentation yaratır. CPU pinning, hugepages, SR-IOV veya accelerator passthrough gibi seçenekler performans determinism’i artırırken placement flexibility’yi azaltır. Böyle workload’lar cluster içinde ayrı placement domain veya node pool gerektirebilir.

Capacity planning’in en kritik fakat gözden kaçan parçası headroom’dur. Installed CPU ve memory’nin tamamı sellable capacity değildir. Hypervisor, kernel, management agents, I/O buffers ve platform service’leri kaynak tüketir. Ayrıca host maintenance veya bir host failure sırasında workload’ların diğer host’lara taşınabilmesi için gerçek fiziksel kapasite boş kalmalıdır. Cluster normal durumda yüzde yüz doluysa HA yalnız kağıt üzerinde kalır.

Golden yaklaşım compute density’yi hedef olarak değil sonuç olarak kabul eder. Önce workload profile, concurrent peak, latency hedefi, NUMA ve device locality, host overhead ve N artı bir recovery reserve tanımlanır. Sonra vCPU, memory ve overcommit politikası bu sınırlar içinde hesaplanır. En yüksek consolidation ratio değil, failure ve maintenance koşullarında da SLO’yu koruyan ratio doğru tasarımdır.

---

## [K10-02] Virtual network, storage, SR-IOV, passthrough ve live migration

Bir VM’in network ve storage performansı, guest içindeki virtual NIC veya virtual disk etiketinden anlaşılmaz. Her virtual device’ın arkasında bir data path vardır. Bu path virtual switch, vhost backend, storage stack, physical NIC veya HBA, PCIe root complex, IOMMU ve sonunda fiziksel network ya da storage sistemine uzanır. Sanallaştırma bu path’i gizleyebilir, fakat bandwidth, latency ve failure domain’i ortadan kaldırmaz.

Legacy device emulation maksimum guest compatibility sağlayabilir ancak ek instruction ve context-switch overhead’i yaratabilir. Paravirtualized device modeli, örneğin virtio ailesi, virtual environment için optimize edilmiş interface sunar. Bununla birlikte virtio adı tek başına performans garantisi değildir. Queue sayısı, multiqueue, offload, host backend, NUMA locality ve physical uplink tasarımı delivered throughput’u belirler.

Virtual NIC bir physical NIC değildir. vNIC software virtual switch üzerinden çıkabilir, overlay tüneline girebilir veya SR-IOV virtual function üzerinden daha doğrudan physical device’a bağlanabilir. Software path policy, observability ve mobility açısından esnek olabilir. SR-IOV ise software switching overhead’ini azaltıp daha deterministic I/O sağlayabilir, fakat physical function failure domain’ine ve device compatibility’ye daha sıkı bağlanır. Bu nedenle “yüksek performans için SR-IOV” kararı, live migration ve HA planıyla birlikte alınmalıdır.

PCI passthrough bir device’ı VM’e daha doğrudan atar. IOMMU ve VFIO benzeri mekanizmalar DMA isolation ve userspace device assignment için temel oluşturur. Passthrough, network adapter, accelerator veya NVMe için güçlü performans sağlayabilir. Ancak VM artık host üzerindeki belirli bir physical device’a bağlıdır. Planned maintenance sırasında aynı capability’nin destination host’ta bulunması gerekir. Bazı device’lar migration state desteği sunabilir, fakat passthrough migration universal bir özellik değildir.

Storage tarafında virtual disk’in altında file, LUN, distributed volume, local NVMe veya başka bir service olabilir. Thin provisioning kapasite kullanımını iyileştirir, fakat allocated virtual capacity physical capacity’yi aşarsa exhaustion bir failure mode haline gelir. Datastore yüzde yüz dolduğunda sorun yalnız yeni VM oluşturamamak değildir; write failure ve recovery problemi yaşanabilir. Bu nedenle thin pool monitoring, reserve ve expansion runbook’u acceptance’ın parçasıdır.

Shared storage live migration ve cluster mobility’yi kolaylaştırabilir, fakat shared datastore aynı zamanda correlated failure domain olabilir. Bir controller, fabric veya storage pool problemi çok sayıda VM’i aynı anda etkileyebilir. Multipath ancak initiator, network/fabric, target ve path policy gerçekten bağımsız ve test edilmişse redundancy sağlar. İki port görmek end-to-end path independence kanıtı değildir.

Live migration da sık yanlış yorumlanır. Bu mekanizma running VM’in execution state’ini başka host’a taşır ve planned maintenance için çok değerlidir. Pre-copy yaklaşımında memory çoğunlukla VM çalışırken kopyalanır, sonunda kısa bir stop phase yapılır. Workload memory’yi hızlı dirty ediyorsa convergence uzayabilir. Post-copy yaklaşımı execution’ı destination’da daha erken başlatıp kalan page’leri sonradan getirir ve failure risk profilini değiştirir. CPU model, machine type, firmware, device model, storage access ve network path birlikte compatible olmalıdır.

Live migration high availability değildir. Host aniden power kaybederse running state’i migrate etmek için fırsat olmayabilir. Infrastructure HA tipik olarak VM’i surviving host üzerinde restart eder. Bu da application memory state’ini korumaz. Application-level clustering veya replication ayrı bir katmandır. Aynı nedenle snapshot da backup değildir. Snapshot kısa süreli rollback veya consistency mekanizması sağlayabilir, fakat bağımsız retention, failure domain ve restore testine sahip backup’ın yerini tutmaz.

Acceptance sırasında normal path kadar degraded path de ölçülmelidir. Virtual network throughput, storage latency, path failover, live migration duration ve downtime, migration network bandwidth, device compatibility, datastore failure ve restore time gerçek workload ile test edilmelidir. Golden sonuç, virtual I/O’nun görünmez bir implementation detayı olmadığıdır. VM mobility ve performans, gerçek physical data path ve failure domain ile birlikte freeze edilmelidir.

---

## [K10-03] Container internals, OCI image/runtime ve registry zinciri

Container mimarisini doğru anlamak için image’den değil process’ten başlamak gerekir. Normal Linux container, host kernel üzerinde çalışan bir veya daha fazla process’tir. Isolation; PID, mount, network, user ve benzeri namespace’ler, cgroup resource controls, capabilities, seccomp ve Linux security module politikalarıyla oluşturulur. Bu nedenle container’ın kendi guest kernel’ı yoktur. Container içindeki root kullanıcının etkisi, user namespace ve privilege ayarlarına göre host açısından çok farklı olabilir.

cgroup v2 modern Linux resource management’in birleşik hierarchy yaklaşımıdır. CPU, memory ve diğer resource controller’lar process gruplarının kullanımını sınırlar veya ölçer. Kubernetes gibi platformlar requests ve limits üzerinden scheduler kararları verirken node üzerindeki cgroup mekanizmaları runtime enforcement sağlar. cgroup namespace ise workload’un cgroup path görünümünü izole eder; resource policy’nin kendisi değildir.

User namespace, container içindeki user ID ile host user ID arasında mapping kurar. Bu sayede container içinde root görünen bir process host üzerinde unprivileged bir ID ile çalışabilir. Güvenlik açısından değerlidir, fakat storage permission, device erişimi ve bazı workload davranışları üzerinde compatibility etkisi vardır. Rootless runtime da daemon veya container execution’ın host privilege ihtiyacını azaltabilir. Yine de rootless veya user namespace kullanmak host kernel riskini sıfırlamaz.

Capabilities klasik root yetkisini daha küçük privilege parçalarına böler. Gereksiz capabilities’in drop edilmesi attack surface’i azaltır. Seccomp system call setini sınırlar. SELinux veya AppArmor gibi mandatory access control mekanizmaları filesystem ve process erişimini daha da kısıtlayabilir. Privileged container ise bu sınırların önemli bölümünü kaldırır ve istisna olarak ele alınmalıdır. HostNetwork, hostPID, hostPath veya raw device erişimi de portability ve isolation’ı azaltır.

Packaging tarafında OCI üç ayrı specification ailesi sunar: Image, Runtime ve Distribution. OCI Image Specification image manifest, index, config ve filesystem layer modelini tanımlar. OCI Runtime Specification bir runtime bundle’ın nasıl configure edilip execute edileceğini tanımlar. Distribution Specification ise registry client ve server arasında content’in nasıl taşınacağını tarif eder. Bunları tek bir “OCI standardı” gibi ele almak, conformance iddialarını belirsizleştirir.

Image tag ile digest de farklıdır. Tag insan için anlamlı ve hareket edebilir bir isimdir. Digest belirli content’i content-addressed olarak tanımlar. Production release’lerinde reproducibility ve integrity için hangi digest’in çalıştığı izlenmelidir. “latest” etiketi operasyonel versioning stratejisi değildir. Multi-architecture image index, aynı logical image adına farklı platform manifest’leri bağlayabilir; fakat application dependency’lerinin gerçekten her architecture’da çalışması yine test edilmelidir.

runc gibi low-level runtime bir OCI bundle’ını çalışan container’a dönüştürebilir. containerd gibi high-level runtime ise image transferi, local content, container supervision ve Kubernetes için CRI integration gibi daha geniş lifecycle sorumlulukları üstlenir. Kubelet CRI üzerinden runtime ile konuşur; CRI, OCI Runtime Spec’in kendisi değildir. Bu katmanların version ve security lifecycle’ı birbirinden farklıdır.

Registry production dependency’dir. Existing Pod’lar registry outage sırasında çalışmaya devam edebilir, fakat yeni node, scale-out veya recovery sırasında gerekli image cache’te yoksa deployment durabilir. Node cache’i registry disaster recovery planı değildir. Kritik image’ler için HA, replication, retention, access control, backup ve gerektiğinde air-gap export/import süreçleri tanımlanmalıdır.

Immutable image yaklaşımı running container’a manuel patch atmak yerine yeni, versioned image üretmeyi teşvik eder. Bu reproducibility sağlar ama workload’u stateless yapmaz. Database data’sı, queue state’i, uploaded files veya durable cache persistent storage üzerinde bulunabilir. Container’ın writable layer’ı genellikle ephemeral kabul edilmelidir.

Golden sonuç şudur: Container platformu yalnız Dockerfile veya Kubernetes manifest’inden oluşmaz. Source’tan build’e, OCI image’den registry’ye, CRI ve high-level runtime’dan low-level runtime’a, kernel isolation’dan node lifecycle’a kadar bir supply ve execution chain vardır. Bu zincirin her halkası versioned, hardened, observable ve recoverable olmadan containerization production mimarisi tamamlanmış değildir.

---

## [K10-04] Kubernetes CRI, Pod, RuntimeClass, CNI, CSI ve resource management

Kubernetes’i doğru boyutlandırmak için Pod, node, runtime ve control plane rollerini ayırmak gerekir. Pod Kubernetes’in temel scheduling unit’idir ve bir veya daha fazla container içerebilir. Aynı Pod içindeki container’lar aynı node’a yerleşir, network ve volume gibi bazı kaynakları paylaşır. Bu nedenle iki container’ı aynı Pod’a koymak availability replica’sı oluşturmaz. Node failure olduğunda Pod’un bütün container’ları birlikte etkilenir.

Worker node compute capacity sağlar ve kubelet ile CRI-compatible runtime çalıştırır. Control plane ise API server, scheduler, controller’lar ve cluster state için gerekli bileşenlerden oluşur. Worker’ların sağlıklı olması, control plane kaybının önemsiz olduğu anlamına gelmez. Existing Pod’lar bir süre çalışabilir fakat yeni scheduling, scaling, configuration veya recovery aksiyonları durabilir. Control plane ayrı bir availability ve backup domain’idir.

CRI kubelet ile container runtime arasındaki stable interface’tir. containerd veya CRI-O gibi runtime’lar bu sözleşmeyi uygular. RuntimeClass belirli Pod’ların alternatif runtime configuration kullanmasını sağlar. Örneğin standart shared-kernel runtime ile sandboxed, hardware-virtualized runtime farklı RuntimeClass olarak sunulabilir. Alternatif runtime’ın ek CPU veya memory overhead’i scheduler capacity hesabına dahil edilmelidir.

CPU ve memory requests scheduler’a workload’un planlanan minimum resource ihtiyacını bildirir. Limits runtime tüketimini sınırlar. Yanlış requests cluster’ı ya gereksiz boş bırakır ya da aşırı yoğunlaştırır. CPU limit throttling yaratabilir; memory limit ise OOM davranışına yol açabilir. QoS class bu konfigürasyondan türeyen eviction davranışlarını etkiler, fakat application SLO’su değildir.

Node allocatable, installed CPU ve RAM’den daha küçük olmalıdır. Operating system, kubelet, runtime, CNI, CSI, monitoring ve DaemonSet agent’ları kaynak tüketir. Ayrıca maintenance ve node failure için headroom gerekir. Kubernetes cluster’ında yüksek average utilization başarı göstergesi olabilir, fakat bir node kaybında bütün replacement Pod’lar unschedulable kalıyorsa availability tasarımı başarısızdır.

Latency-sensitive workload’larda CPU Manager, Topology Manager, huge pages ve device placement önemli hale gelir. CPU Manager selected workload’a exclusive CPU allocation verebilir. Topology Manager CPU, memory ve device hint’lerini aynı NUMA domain’e yaklaştırmayı hedefleyebilir. Ancak feature’ın stable olması, kullanılan device plugin veya driver’ın topology bilgisini doğru sunduğu anlamına gelmez. Benchmark ile doğrulama gerekir.

Specialized device allocation için klasik Device Plugin modeli yanında Dynamic Resource Allocation daha zengin bir yapı sunar. DeviceClass, ResourceClaim ve ResourceSlice gibi objelerle cihaz selection ve sharing senaryoları ifade edilebilir. DRA stable bir temel sunuyor olsa da driver, device ve feature support release bazında doğrulanmalıdır. GPU, NIC veya accelerator’ın scheduler tarafından allocate edilmesi, fiziksel PCIe ve NUMA locality problemini ortadan kaldırmaz.

Network tarafında CNI bir plugin invocation contract’tır. Overlay mi, native routing mi, eBPF mi veya bridge mi kullanılacağını CNI acronym’i belirlemez. Aynı şekilde NetworkPolicy object’i ancak seçilmiş implementation gerçekten enforce ediyorsa güvenlik kontrolüdür. Pod IP, Service, ingress veya external load balancer farklı katmanlardır ve her birinin failure domain’i vardır.

Storage tarafında CSI orchestrator ile storage driver arasındaki contract’ı standartlaştırır. PersistentVolume, PersistentVolumeClaim ve StorageClass abstraction sağlar, fakat backend replication, latency, backup veya topology davranışını otomatik garanti etmez. Volume topology scheduler kararını etkileyebilir; bir disk yalnız belirli zone veya node grubundan erişilebiliyorsa replacement Pod her yerde çalışamaz. VolumeSnapshot API snapshot sağlar, bağımsız backup veya application consistency sağlamaz.

Version lifecycle bütün bu stack’i tek karar haline getirir. Kubernetes minor version, container runtime, CNI, CSI, ingress, operator ve device driver’ın ayrı support matrix’i vardır. “Kubernetes 1.37 destekli” demek, bütün eklentilerin 1.37 ile kabul edildiği anlamına gelmez. Golden sonuç, Kubernetes platformunun bir ürün değil, tested component matrix olduğu gerçeğidir. Cluster ancak compute, runtime, network, storage, device ve control-plane sürümleri birlikte doğrulandığında freeze edilmelidir.

---

## [K10-05] VM/container availability, security ve stateful workload gerçekleri

Virtualization ve container platformlarında availability kelimesi çoğu zaman tek bir özellik gibi kullanılır. Gerçekte process restart, Pod restart, VM restart, node veya host failover, application replication, storage redundancy, network redundancy ve site disaster recovery farklı katmanlardır. Bir alt katmandaki mekanizma üst katmandaki continuity ihtiyacını otomatik olarak sağlamaz.

VM dünyasında live migration planned maintenance için çok değerlidir, fakat sudden host failure anında running state’i kurtarmayabilir. Infrastructure HA çoğunlukla VM’i başka host’ta restart eder. Restart edilen VM’in operating system’i yeniden boot eder ve application kendi recovery mekanizmasını uygular. Eğer database transaction veya in-memory session application tarafından replicate edilmemişse hypervisor HA bu state’i geri getirmez.

Kubernetes tarafında controller reconciliation desired state’i yeniden kurmaya çalışır. Bir worker node kaybolduğunda Deployment replica’sı başka node’da oluşturulabilir. Ancak bunun gerçekleşmesi için free capacity, healthy control plane, registry erişimi, CNI, DNS, CSI ve gerekli persistent data path çalışıyor olmalıdır. Controller var diye recovery anında garanti edilmez. Image pull, volume attach ve application warm-up süreleri RTO’yu etkiler.

PodDisruptionBudget da doğru sınırda kullanılmalıdır. PDB planned, voluntary disruption sırasında belirli availability davranışını korumaya yardımcı olur. Hard node failure, storage outage veya network partition gibi involuntary olayları engellemez. Topology spread ve anti-affinity replica’ları farklı node veya zone’lara dağıtabilir, fakat doğru topology label ve yeterli capacity yoksa policy istenen diversity’yi sağlayamaz.

Stateful workload ayrı bir problemdir. StatefulSet stable identity ve ordered lifecycle sağlayabilir, fakat database replication, quorum ve consistency uygulamanın veya database sisteminin sorumluluğundadır. Üç replica aynı failure domain’deyse replica count gerçek resilience üretmez. CSI ile persistent volume bağlanmış olması da data’nın yedekli veya backup’lı olduğu anlamına gelmez.

Snapshot ile backup ayrımı burada tekrar kritiktir. VM snapshot veya CSI VolumeSnapshot kısa rollback ve backup workflow’una kaynak sağlayabilir. Ancak bağımsız retention, off-platform copy, application consistency ve restore validation yoksa snapshot production backup değildir. Restore testi yalnız byte’ların geri gelmesini değil, identity, DNS, secret, network policy, certificate ve application dependency’lerinin yeniden kurulmasını da doğrulamalıdır.

Security boundary da availability kadar katmanlıdır. VM ayrı guest kernel ile normal container’a göre daha güçlü bir kernel boundary sağlayabilir, fakat hypervisor vulnerability, management-plane compromise veya guest credential problemi devam eder. Ordinary container host kernel’ı paylaştığı için privileged mode, hostPath, host network, capabilities ve seccomp policy daha kritik hale gelir. User namespaces ve rootless execution risk azaltabilir ama compatibility ve host-kernel riskini sıfırlamaz.

Kubernetes Pod Security Standards, privileged, baseline ve restricted policy profilleriyle önemli bir minimum kontrol modeli sunar. Restricted profile non-root behavior, capability drop ve seccomp gibi kontrolleri güçlendirir. Buna rağmen image provenance, registry access, secrets, network segmentation ve supply-chain security ayrıca tasarlanmalıdır. Bir digest image content’ini tanımlar; o content’in güvenilir kaynaktan geldiğini tek başına ispatlamaz.

Management plane en güçlü target’lardan biridir. Hypervisor manager, Kubernetes API, registry, PKI, backup controller, storage management ve BMC/OOB erişimi aynı uncontrolled network veya credential domain içinde olmamalıdır. Platform kullanıcı trafiği çalışırken management plane kaybı recovery ve maintenance yeteneğini ortadan kaldırabilir.

Golden acceptance bir “HA checkbox” aramaz. Host power-off, worker hard failure, storage path loss, CNI veya registry outage, control-plane member loss, certificate rotation, bad image rollout ve restore senaryoları workload altında test edilir. Ölçülen sonuç process’in tekrar başlaması değil, service’in hedef RTO ve data consistency ile geri dönmesidir. Gerçek availability, katmanların birbirine nasıl bağlandığının kanıtıdır.

---

## [K10-06] Hybrid platform: Kubernetes üzerinde VM, sandboxed containers ve operasyon

Kurumsal veri merkezlerinde bütün workload’ları tek hamlede container’a taşımak çoğu zaman gerçekçi değildir. Legacy uygulamalar, commercial appliance’lar, belirli operating system gereksinimleri ve vendor certification VM olarak kalabilir. Yeni microservice veya cloud-native uygulamalar ise container ve Kubernetes modelinden faydalanabilir. Bu nedenle hybrid VM artı container mimarisi geçici bir başarısızlık değil, bilinçli bir production modeli olabilir.

En basit hybrid yaklaşım, aynı physical data center standardı üzerinde ayrı VM cluster ve Kubernetes cluster çalıştırmaktır. Server, network, storage, observability ve security standartları ortaklaştırılabilir, fakat control plane’ler ayrıdır. Bu separation blast radius’i sınırlayabilir; karşılığında iki farklı skill set, automation ve lifecycle yönetilir.

KubeVirt gibi Kubernetes-managed VM yaklaşımı control modelini yakınlaştırır. VM object’leri Kubernetes API üzerinden tanımlanır, scheduling ve lifecycle Kubernetes constructs ile koordine edilir. Fakat guest workload yine full virtual machine olarak çalışır. Guest OS, virtual CPU, virtual memory ve virtual device modeli korunur. “VM container içinde çalışıyor” şeklindeki basitleştirme capacity ve security kararlarını yanlış yönlendirebilir.

Kubernetes üzerinde VM live migration da klasik virtualization’daki gibi storage, CPU ve device compatibility’ye bağlıdır. PVC-backed VM diskleri için shared access veya uygun storage architecture gerekebilir. Passthrough GPU, SR-IOV VF veya host device gibi kaynaklar migration flexibility’yi azaltabilir. Feature’ın platformda bulunması, her device kombinasyonunun migratable olduğu anlamına gelmez. Acceptance her target workload profile için yapılmalıdır.

VM storage Kubernetes dünyasında CSI ve PVC abstraction’ına bağlanabilir. Bu operasyonel convergence sağlar; aynı StorageClass veya snapshot automation VM ve Pod workflow’larında kullanılabilir. Ancak VM application consistency problemi değişmez. Database guest içinde çalışıyorsa disk snapshot’ı almak, guest filesystem ve application state’in consistent olduğunu otomatik olarak garanti etmez.

Network tarafında VM’in primary Pod network’ü ve secondary network attachment’ları olabilir. Burada CNI implementation, overlay veya underlay, MTU, policy ve physical uplink topology birlikte değerlendirilir. High-performance VM network için SR-IOV veya dedicated device kullanılabilir; fakat mobility ve node replacement planı da aynı anda tasarlanmalıdır.

Sandboxed container ile KubeVirt farklı problemleri çözer. Sandboxed runtime, container packaging ve Pod lifecycle’ını korurken execution’a daha güçlü bir isolation boundary eklemeyi hedefler. KubeVirt ise full guest OS gerektiren VM workload’u Kubernetes altında yönetir. Güvenlik ihtiyacı nedeniyle her container’ı KubeVirt VM’e çevirmek veya legacy VM olduğu için her workload’a sandboxed runtime uygulamak doğru abstraction değildir.

Hybrid model modernization için de değerlidir. Bir monolithic application önce VM olarak Kubernetes-managed lifecycle’a alınabilir, çevresindeki yeni service’ler container olarak geliştirilebilir. Zaman içinde uygun component’ler containerize edilirken certification veya state nedeniyle VM kalması gereken parçalar korunabilir. Bu yaklaşım migration riskini azaltabilir; fakat control plane complexity ve support matrix büyür.

Version compatibility özellikle önemlidir. Kubernetes, KubeVirt, container runtime, CNI, CSI ve guest device driver’larının ayrı release cadence’i vardır. KubeVirt’in belirli Kubernetes minor version için yayımlanmış support matrix’i varken bir sonraki Kubernetes sürümüne otomatik compatibility varsayılmamalıdır. Upgrade önce lab’de tested matrix olarak yürütülmelidir.

Operational convergence’ın TCO’su yalnız tool sayısıyla ölçülmemelidir. Aynı API ve GitOps workflow’unu VM ve container için kullanmak eğitim ve automation avantajı sağlayabilir. Öte yandan Kubernetes control plane’in kaybı hem Pod hem VM operations’ını aynı anda etkileyebilir ve blast radius büyüyebilir. Ayrı platformlar daha fazla yönetim maliyeti getirirken failure isolation sağlayabilir.

Golden sonuç, hybrid mimarinin “tek platform her şeyi çözer” hedefiyle değil, doğru workload boundary’lerini koruyarak standardizasyon sağlamasıdır. Compute, network, storage, security, observability, backup ve lifecycle prensipleri ortak olabilir. Fakat VM ile container’ın execution ve recovery farkları görünür kalmalıdır. Convergence ancak bu farklar kaybolmadan yönetilebiliyorsa değerlidir.

---

## [K10-07] Virtualization/container platformu nasıl seçilir, test edilir ve BoQ’da freeze edilir?

Bir virtualization veya container platformunu seçmenin son aşaması ürün datasheet karşılaştırması değildir. Doğru freeze, workload requirement’tan başlayıp physical resource, isolation, availability, security, operations ve lifecycle boyunca kanıt zinciri oluşturmaktır. “Kaç VM çalıştırır?”, “kaç Pod destekler?” veya “Kubernetes uyumlu mu?” gibi sorular tek başına procurement için yeterli değildir.

İlk karar workload classification’dır. Full guest OS veya vendor certification gerektiren, appliance formatında gelen ya da güçlü kernel separation isteyen workload için VM mantıklı olabilir. Immutable deployment, horizontal replica ve CI/CD akışına uygun application için container daha doğal olabilir. Untrusted code çalıştırılan bir service container workflow ile birlikte sandboxed runtime isteyebilir. Legacy VM ile cloud-native service aynı operasyon modeline yaklaşacaksa Kubernetes-managed VM değerlendirilebilir.

İkinci adım resource modelini freeze etmektir. CPU socket, core, thread, vCPU, overcommit, reservation ve pinning politikası açık olmalıdır. Installed memory, allocatable memory, working set, memory overcommit ve reclamation yöntemi yazılmalıdır. NUMA topology ile high-throughput NIC, storage veya accelerator device locality haritalanmalıdır. Kubernetes node’larında system reserve, DaemonSet overhead ve Pod requests capacity’den düşülmelidir.

Üçüncü adım I/O ve state modelidir. VM tarafında virtual switch, vNIC backend, virtio veya SR-IOV path’i, datastore veya local storage ve multipath failure domain gösterilir. Kubernetes tarafında CNI implementation, CSI driver, StorageClass, volume topology ve registry dependency tanımlanır. Stateful application’ın replication ve backup modeli, platform snapshot özelliğinden ayrı yazılır.

Dördüncü adım availability ladder’dır. Planned maintenance için live migration veya drain, unplanned host/node failure için restart veya reschedule, application continuity için replica/quorum, storage ve network redundancy, site failure için DR ayrı test case olur. Her biri için RTO, gerekirse RPO ve measured downtime kaydedilir. Cluster failure reserve, normal workload yerleştirildikten sonra kalan tesadüfi boşluk değil, admission policy ile korunan capacity olmalıdır.

Beşinci adım security boundary’dir. Management network isolation, hypervisor/node hardening, privileged workload policy, user namespace, seccomp, secret handling, image provenance ve registry RBAC tanımlanır. VM ve container’ın threat model’i aynı değildir. En güçlü isolation her workload’a zorunlu değildir; en zayıf isolation da yalnız density için seçilmemelidir.

Altıncı adım performance acceptance’tır. Synthetic CPU ve storage testleri faydalıdır, fakat representative application load gereklidir. VM için scheduler delay, CPU ready benzeri contention göstergeleri, memory pressure, virtual network ve storage latency izlenir. Container için CPU throttling, OOM, eviction, node allocatable, CNI/CSI latency ve unschedulable condition gözlenir. Failure testleri cluster idle iken değil, representative load altında tekrarlanır.

Yedinci adım lifecycle’dır. Hypervisor build, guest tools, Kubernetes minor version, container runtime, CNI, CSI, operator ve device driver’ın support matrix’i birlikte kaydedilir. Firmware, microcode ve BIOS baseline bu stack’in dışı değildir. Upgrade, rollback ve deprecated API kontrolü acceptance procedure’a dahil edilir. License metric socket, core, VM, vCPU veya node bazlı olabilir ve architecture TCO’sunu ciddi biçimde değiştirebilir.

BoQ yalnız server adedi ve software license satırlarından oluşmamalıdır. Host topology, management/control plane, runtime version, network ve storage integration, HA/migration capability, backup integration, registry, observability, security policy, support term ve acceptance testleri sözleşme kapsamına girmelidir. “Supported” kelimesinin yanında test condition ve evidence yoksa feature henüz accepted değildir.

TCO hesabı da maksimum density yerine delivered service üzerinden yapılmalıdır. CAPEX yanında license, support, power, storage, network, backup, operations, upgrade effort ve failover için ayrılan reserve capacity dikkate alınır. Daha yüksek consolidation ratio kağıt üzerinde ucuz görünüp failure sırasında capacity yetmediğinde pahalı olabilir. Benzer şekilde tek converged control plane tool maliyetini azaltırken blast radius’i büyütebilir.

Golden karar zinciri şu mantıktadır: workload ve isolation ihtiyacını tanımla; CPU, memory ve NUMA’yı kapat; I/O ve state path’ini doğrula; runtime ve orchestrator matrix’ini sabitle; security boundary’yi belirle; maintenance ve failure reserve’i koru; recovery testlerini yük altında çalıştır; lifecycle ve TCO’yu hesapla; ardından BoQ’yu freeze et. Platform seçimi ancak bu zincir geçtiğinde tamamlanır.

---
