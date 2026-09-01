# DC-K01 — Data Center Service Models

**Status:** GOLDEN MODULE V2 — DEEP RESEARCH COMPLETE / FULL NARRATION PENDING  
**Language:** TR  
**Author:** Önder Yardaş  
**Research date:** 2026-09-01  
**Evidence boundary:** Public authoritative / official sources. Vendor material is used as implementation evidence, not as a universal standard.  
**Quick Brief:** Existing ~5 minute S3F narration remains valid as the introductory layer.  
**Target Full Briefing:** ~30–40 minutes, chaptered.

---

## Executive conclusion

Bir veri merkezi yatırımının ilk tasarım sorusu **“hangi marka UPS, switch veya server kullanılacak?”** değildir. İlk soru şudur:

> **Bu tesis hangi müşteriye, hangi sorumluluk sınırıyla, hangi SLA altında, hangi birimle fiyatlanan hangi dijital altyapı hizmetini satacak?**

Aynı fiziksel bina; yalnız cabinet/kW satan bir colocation tesisi, yönetilen private-cloud platformu, bare-metal sağlayıcısı, IaaS cloud, GPU cloud, disaster-recovery platformu veya yoğun interconnection merkezi olabilir. Bu modeller aynı müşteriye hitap etmez; aynı organizasyon kabiliyetini gerektirmez; aynı power-density, cooling, network, metering, security veya operations mimarisini de gerektirmez.

Bu nedenle doğru tasarım sırası şöyledir:

```text
TARGET CUSTOMER
      ↓
SERVICE / REVENUE MODEL
      ↓
RESPONSIBILITY BOUNDARY
      ↓
SLA / RPO / RTO / SECURITY / SOVEREIGNTY
      ↓
WORKLOAD CHARACTERISTICS
      ↓
CAPACITY + DENSITY + GROWTH MODEL
      ↓
FACILITY + IT + NETWORK + OPERATIONS ARCHITECTURE
      ↓
BoQ / PROCUREMENT / COMMERCIAL MODEL
```

Tersi yönde ilerlemek — önce binayı ve BoQ’yu sabitleyip daha sonra “buradan hangi servisleri satarız?” diye düşünmek — **stranded capacity**, yanlış güç yoğunluğu, yetersiz connectivity, gereksiz CAPEX, yetersiz operasyon ekibi ve marjı düşük bir hizmet portföyü üretme riskini yükseltir.

Uptime Institute’un venue-selection yaklaşımı da kararın yalnız maliyetle alınmaması gerektiğini; **Financial, Opportunity, Risk, Compliance, Sustainability ve Service Quality** gibi birden çok boyutun birlikte değerlendirilmesi gerektiğini vurgular. Ayrıca Tier seviyesi “ne kadar yüksek o kadar iyi” şeklinde yorumlanmamalıdır; uygun dayanıklılık seviyesi işin risk toleransına ve business case’ine göre seçilmelidir. [R1][R2]

---

# 1. Bu modülün kapsamı

Bu çalışma veri merkezi hizmetlerini **sekiz ticari/teknik aile** altında inceler:

1. **Physical Capacity & Colocation**
2. **Managed Infrastructure & Hosting**
3. **Cloud Infrastructure Services**
4. **AI / GPU / HPC Services**
5. **Storage, Backup, DR & Cyber Recovery**
6. **Connectivity & Interconnection**
7. **Managed Operations & Security**
8. **Platform / Ecosystem Services**

Bunlar birbirini dışlayan kategoriler değildir. Olgun bir veri merkezi işletmecisi bunların birkaçını üst üste bindirerek bir **service ladder** oluşturabilir.

Örnek:

```text
COLOCATION
   +
CROSS-CONNECT
   +
SMART HANDS
   +
MANAGED NETWORK
   +
BACKUP
   +
PRIVATE CLOUD
   +
DRaaS
```

Müşteriye tek bir ürün değil, birbirini besleyen bir altyapı hizmet portföyü sunulur.

---

# 2. Önce “mekân” ile “servis”i ayırmak gerekir

Data center sektöründe üç kavram sıklıkla karıştırılır:

### Facility
Fiziksel bina, enerji, cooling, yangın, güvenlik, white space ve support infrastructure.

### IT platform
Server, storage, virtualization, cloud management, network fabric, security platform ve automation.

### Service
Müşterinin satın aldığı sözleşmesel sonuç: cabinet, kW, VM, GPU-hour, TB-month, backup, recovery, cross-connect, managed service vb.

Örneğin bir **IaaS** hizmeti yalnız data center binası değildir. AWS’nin tanımıyla IaaS, compute, storage ve network kaynaklarının tüketim bazlı bir hizmet olarak sunulmasıdır. Bu nedenle IaaS için facility’nin üzerine virtualization, tenant isolation, software-defined networking, orchestration, API, metering, billing, lifecycle ve support katmanları gerekir. [R8]

Benzer şekilde **AI cloud** yalnız GPU server satın almak değildir. NVIDIA’nın 2026 AI Cloud Requirements dokümanı AI cloud kapasitesini compute, network, storage, software ve service operations dahil bir **full-stack service-delivery** problemi olarak ele alır. [R13]

---

# 3. Service responsibility spectrum

Bir hizmet modelini anlamanın en iyi yollarından biri müşterinin kontrolü ile provider’ın sorumluluğunun nerede kesiştiğine bakmaktır.

```text
CUSTOMER CONTROL  ←──────────────────────────────→  PROVIDER CONTROL

OWN DC   COLO   MANAGED COLO   DEDICATED   IaaS   PaaS   SaaS
  │       │          │             │         │      │      │
More customer responsibility                         More abstraction
```

Ancak bu çizgi yalnız teknik yönetimi ifade eder. **Data ownership, compliance accountability ve business risk** hizmet provider’a geçti diye otomatik olarak ortadan kalkmaz.

AWS shared-responsibility modeli bunun iyi bilinen bir örneğidir: provider “cloud’un güvenliğinden”; müşteri ise seçtiği hizmet modeline bağlı olarak “cloud içindeki” veri, kimlik, işletim sistemi, uygulama ve yapılandırmaların bir kısmından sorumludur. Abstraction arttıkça provider daha fazla altyapı operasyonunu üstlenir, fakat müşterinin data-governance sorumluluğu devam eder. [R9][R10]

---

# 4. Aile A — Physical Capacity & Colocation

## 4.1 Retail Colocation

Retail colocation modelinde müşteri kendi IT ekipmanını getirir; provider tipik olarak şu katmanları sağlar:

- cabinet / rack / cage / suite alanı
- conditioned power
- cooling
- physical security
- facility operations
- carrier / cross-connect erişimi
- isteğe bağlı remote/smart hands

**Müşterinin kontrolünde kalan tipik alanlar:**

- server / storage / network seçimi
- OS ve hypervisor
- application
- data
- çoğu logical security policy

Equinix’in Secure Cabinet ve Private Cage dokümanları, cabinet/cage hizmetlerinin **power allocation, cabinet quantity, demarcation ve cross-connect** ile birlikte sözleşmesel ürün olarak tasarlandığını gösterir. Örneğin Secure Cabinet hizmetinde cabinet ve güç kVA bazında tahsis edilebilir ve power draw cap sözleşmesel bir parametredir. [R3][R4]

### Uygun müşteri profili

- donanım sahipliğini bırakmak istemeyen enterprise
- bankacılık / finans / sağlık / kamu gibi kontrol gereksinimi yüksek kurumlar
- SaaS şirketleri
- telco/network provider
- regional deployment yapan global şirket
- kendi private cloud’unu üçüncü taraf tesiste çalıştırmak isteyen müşteri

### Facility etkisi

Retail colo tesisi tek bir müşterinin “ideal rack”ine göre değil, **heterojen müşteri yüklerini** karşılayacak esneklikte tasarlanmalıdır:

- farklı rack geometrileri
- farklı kW/rack talepleri
- granular metering
- A/B feed opsiyonları
- cage/suite bölünebilirliği
- sık müşteri erişimi
- cross-connect kapasitesi
- carrier diversity
- hızlı MACD: Move/Add/Change/Delete operasyonu

CyrusOne da colocation tesislerinin, build-to-suit ortamların aksine, geniş müşteri yükü ve equipment çeşitliliği için esneklik taşıması gerektiğini vurgular. [R7]

---

## 4.2 Private Cage

Private cage, birden fazla cabinet için müşteri özelinde ayrılmış güvenli alandır. Equinix’in dokümanında cage alanı cabinet quantity ve power allocation’a göre tasarlanır; ayrıca interconnection demarcation noktası bulunur. [R4]

### Ne zaman anlamlı?

- 3–20+ cabinet kullanan müşteri
- ayrı erişim politikası isteyen müşteri
- kendi intra-cage cabling yapısını kontrol etmek isteyen müşteri
- compliance nedeniyle shared-floor exposure azaltmak isteyen müşteri

Cage, “kendi data center’ım” demek değildir. Facility, ortak MEP altyapısı, carrier ekosistemi ve temel operasyon provider tarafından yönetilmeye devam eder.

---

## 4.3 Private Suite / Dedicated Data Hall

Suite veya dedicated hall, daha büyük müşteriye ayrılmış fiziksel alandır. Bu segment retail colocation ile wholesale arasında konumlanabilir.

Tipik avantajlar:

- daha güçlü fiziksel izolasyon
- özel security controls
- daha özel airflow/cooling yaklaşımı
- özel network demarcation
- müşteriye özgü rack layout
- daha kontrollü expansion path

Digital Realty’nin data-center suite modeli, pre-commissioned ayrılmış alanı daha düşük upfront deployment ve daha kolay genişleme ile konumlandırır. [R6]

---

## 4.4 Wholesale / Hyperscale Colocation

“Wholesale” tek bir uluslararası standartta sabitlenmiş teknik terim değildir; sektör pratiğinde daha büyük, genellikle **yüzlerce kW’dan MW ölçeğine uzanan committed capacity blocks** için kullanılır.

Retail modelden farkı çoğunlukla şunlardır:

- daha büyük minimum commitment
- daha uzun contract term
- daha düşük $/kW fakat daha yüksek toplam sözleşme değeri
- müşteri başına daha büyük concentration
- daha fazla customization
- daha az shared white-space interaction

### Provider açısından

**Avantaj:** Büyük anchor customer kapasite doluluğunu hızla yükseltir.  
**Risk:** Customer concentration artar; bir contract’ın yenilenmemesi büyük boş kapasite bırakabilir.

---

## 4.5 Powered Shell / Powered Base Building

“Powered shell” kapsamı provider’a göre değişebilir; bu nedenle **scope contract ile kesin tanımlanmalıdır**.

Genel kavramsal anlam:

- bina kabuğu hazırdır
- utility/power erişimi vardır
- fiber erişimi vardır
- bazı base-building MEP sistemleri hazırdır
- müşteri veya tenant kendi teknik fit-out’unun daha büyük kısmını yapar

Digital Realty bunu “Powered Base Buildings” adıyla **power ve fiber-provisioned, fit-out ready** yapı olarak konumlandırır. [R6]

### Uygun müşteri

- çok büyük kapasite ihtiyacı olan enterprise/hyperscaler
- kendi electrical/mechanical standardını uygulamak isteyen tenant
- uzun vadeli deployment yapan müşteri
- facility CAPEX’inin tümünü doğrudan taşımak istemeyen şirket

### Risk

“Hazır bina” ile “operasyonel data center” arasındaki scope sınırı yanlış anlaşılırsa ciddi commissioning, integration ve contract sorunları oluşabilir.

---

## 4.6 Build-to-Suit

Build-to-Suit (BTS), belirli müşterinin gereksinimlerine göre **purpose-built facility veya major facility block** geliştirilmesidir.

Digital Realty ve CyrusOne’un BTS modelleri; security, structural design, power density, cooling ve MEP redundancy gibi unsurların müşteriye göre özelleştirilebildiğini gösterir. [R5][R26]

### Kullanım profili

- hyperscale cloud
- büyük AI platformu
- national cloud
- çok büyük enterprise
- yüksek regülasyonlu özel kullanım

### Ticari karakter

- yüksek upfront development commitment
- uzun lease / service term
- anchor customer dependency
- design-lock riski
- buna karşılık yüksek kontrat görünürlüğü

---

## 4.7 High-Density / AI Colocation

AI colo, klasik colocation’ın “biraz daha fazla kW” versiyonu değildir.

Farklılaşan başlıklar:

- çok yüksek rack density
- liquid cooling / facility water readiness
- CDU ve secondary loop alanı
- high-current rack power distribution
- high-speed east-west network
- yüksek fiber count
- AI cluster staging ve commissioning
- floor loading
- özel maintenance procedures

Bu nedenle provider’ın “60 kW cabinet satıyorum” demesi yetmez. Asıl soru:

> **60 kW’ı sürekli, yedekli, termal olarak kontrollü ve serviceable biçimde rack’e ulaştırıp ısıyı güvenli şekilde çıkarabiliyor musunuz?**

NVIDIA’nın güncel AI-factory facility reference yaklaşımı site, power, cooling, controls, connectivity ve compute’u birlikte ele alır. [R14]

---

# 5. Aile B — Managed Infrastructure & Hosting

## 5.1 Remote Hands / Smart Hands

Bu hizmetlerde müşteri ekipmanı müşteriye ait olmaya devam eder; fakat fiziksel görevleri provider’ın sahadaki teknisyeni gerçekleştirir.

Equinix Smart Hands örnek kapsamları:

- rack-and-stack
- cabling
- power cycling
- visual inspection
- component replacement
- circuit testing
- emergency troubleshooting
- remote-console facilitation [R20]

### Neden stratejik?

Remote/Smart Hands basit “teknisyen saati” değildir. Global veya şehir dışı müşterinin **local operations dependency** ihtiyacını çözer ve colocation stickiness’ini artırır.

---

## 5.2 Managed Colocation

Managed colocation standardize edilmiş tek bir ürün değildir. Provider’ın colocation katmanının üzerinde üstlendiği operasyonlara göre değişir.

Örnek ek sorumluluklar:

- network management
- firewall operations
- OS monitoring
- patching
- backup
- hardware lifecycle
- capacity monitoring

### Kritik kural

“Managed” kelimesi tek başına anlamlı değildir. Sözleşmede şu sorular net olmalıdır:

- Kim patch yapar?
- Kim firmware upgrade yapar?
- Kim incident’a müdahale eder?
- Kim application health’i izler?
- Kim backup restore testini yapar?
- Hangi layer’ın SLA’sı provider’a aittir?

---

## 5.3 Dedicated Server

Fiziksel server provider’a aittir ve tek müşteriye tahsis edilir.

Müşteri açısından:

- server CAPEX’i yoktur
- dedicated physical capacity vardır
- shared hypervisor zorunlu değildir

Provider açısından ise:

- hardware lifecycle
- spare strategy
- replacement SLA
- firmware standardization
- inventory management

başlar.

---

## 5.4 Managed Hosting

Dedicated server’ın üzerine şu katmanlar eklenebilir:

- OS install/hardening
- patch management
- monitoring
- antivirus/EDR
- backup
- middleware
- database management

Böylece provider’ın operasyonel sorumluluğu ve potansiyel service margin’i yükselirken **staffing, toolchain ve liability** de artar.

---

## 5.5 Bare Metal as a Service

Bare Metal as a Service, dedicated physical server kapasitesinin **cloud-benzeri provisioning ve consumption modeline** dönüştürülmesidir.

IBM Cloud örneğinde bare-metal server tek tenant’a dedicated, hypervisor’suz fiziksel server olarak saatlik veya aylık tüketilebilir. [R11]

### Dedicated hosting’den farkı

Bare-metal hizmeti genellikle:

- portal/API
- automated provisioning
- standard server profiles
- metering/billing
- network automation

ile daha cloud-native bir tüketim deneyimi hedefler.

### Kullanım örnekleri

- lisans kısıtları
- hypervisor istemeyen workloads
- deterministic performance
- HPC
- security isolation
- özel appliance deployment

---

# 6. Aile C — Cloud Infrastructure Services

## 6.1 IaaS

IaaS provider’ın şu kaynakları hizmet olarak sunmasıdır:

- compute
- storage
- networking

AWS IaaS tanımı tüketim ve pay-as-you-go yaklaşımını açıkça vurgular. [R8]

### IaaS’ın minimum teknik platformu

```text
PORTAL / API
     ↓
IAM + TENANT
     ↓
ORCHESTRATION
     ↓
VIRTUAL COMPUTE ── VIRTUAL NETWORK ── STORAGE
     ↓
METERING / BILLING / MONITORING
     ↓
PHYSICAL SERVER / FABRIC / FACILITY
```

### “VMware kurduk, IaaS olduk” neden yanlış?

Çünkü virtualization yalnız bir resource-abstraction katmanıdır. IaaS ürününün ayrıca şunları çözmesi gerekir:

- self-service
- tenant isolation
- quotas
- image/catalog
- lifecycle automation
- IAM/RBAC
- networking
- service metering
- billing
- API
- support
- capacity management

---

## 6.2 Private Cloud

Private cloud belirli bir organizasyona dedicated cloud operating modelidir. Fiziksel lokasyon tek başına belirleyici değildir.

Private cloud:

- müşteri binasında
- colocation tesisinde
- provider tesisinde
- managed appliance modelinde

çalışabilir.

Private cloud’un ayırt edici özelliği yalnız “özel server” değil; **cloud-style resource pooling, automation ve governance** yaklaşımıdır.

---

## 6.3 Managed Private Cloud

Provider private-cloud stack’in yaşam döngüsünün daha büyük bölümünü yönetir:

- architecture
- deployment
- platform patching
- monitoring
- backup integration
- capacity
- support

Bu model özellikle IT ekibini infrastructure operations yerine application/business workload’a odaklamak isteyen kurumlarda anlamlıdır.

---

## 6.4 Hybrid Cloud

Hybrid cloud “biraz on-prem, biraz cloud” değildir. Asıl problem bu ortamlar arasındaki **control plane ve dependency architecture**dır.

Gerekli alanlar:

- connectivity
- identity federation
- DNS
- security policy
- data replication
- monitoring
- workload placement
- cost governance

AWS Outposts bunun bir örneğidir: AWS infrastructure ve services on-prem/edge lokasyona getirilerek region ile tutarlı hybrid experience hedeflenir. [R12]

---

## 6.5 Sovereign Cloud

Sovereignty yalnız “veri Türkiye’de/Avrupa’da duruyor” demek değildir.

Gerçek sovereignty değerlendirmesi en az şu başlıkları kapsamalıdır:

- data residency
- processing location
- administrative access
- operator nationality/jurisdiction
- control-plane dependency
- key ownership
- external legal exposure
- disconnected operation
- auditability

Microsoft’un 2026 Sovereign Cloud modeli public, private ve partner-operated deployment’ları ayrı seçenekler olarak ele alır; private model customer-controlled veya partner-operated data center’da hybrid ya da disconnected çalışabilir. [R15][R16]

### Provider fırsatı

Yerel data center operator için sovereign cloud yalnız compliance ürünü değil; aşağıdaki değerlerin birleşimidir:

- local facility
- local operations
- controlled access
- local connectivity
- dedicated/private infrastructure
- auditable governance

Ancak “yerel hosting = sovereign cloud” eşitliği doğru değildir.

---

# 7. Aile D — AI / GPU / HPC Services

## 7.1 GPU as a Service — GPUaaS

En basit biçimde GPU kapasitesinin hizmet olarak tüketilmesidir.

Ticari varyantlar:

- GPU-hour
- dedicated GPU
- fractional GPU
- reserved GPU
- dedicated multi-GPU server
- cluster reservation

### Shared GPU

NVIDIA MIG gibi teknolojiler bir fiziksel GPU’yu izole GPU instances’a bölebilir ve multi-tenant utilization’ı artırabilir. Ancak isolation/performance gereksinimi workload’a göre değerlendirilmelidir. [R17]

### Provider’ın gerçek sorunu

GPU satın almak değil, **utilization** üretmektir.

GPU business model’in kritik KPI’ları:

- booked utilization
- billable utilization
- cluster fragmentation
- idle GPU-hours
- scheduling efficiency
- network/storage bottleneck
- power availability

---

## 7.2 AI Cloud

AI Cloud aşağıdaki stack’in birlikte işletilmesini gerektirir:

```text
CUSTOMER / DEVELOPER EXPERIENCE
           ↓
KUBERNETES / SCHEDULER / AI PLATFORM
           ↓
GPU COMPUTE
      ↙          ↘
AI FABRIC      AI STORAGE
      ↘          ↙
POWER + COOLING + FACILITY
```

NVIDIA’nın NCP Requirements v2.3 dokümanı cloud provider için full-stack infrastructure ve operations beklentisi tanımlar. NVIDIA’nın inference reference architecture’ı da müşterinin fiziksel altyapının detayını bilmeden endpoint, model, Kubernetes capacity ve GPU workers talep edebilmesini hedefler. [R13][R18]

### Hizmet ladder’ı

```text
GPU COLOCATION
      ↓
DEDICATED GPU SERVER
      ↓
GPUaaS
      ↓
GPU KUBERNETES / CaaS
      ↓
MANAGED AI PLATFORM
      ↓
INFERENCE ENDPOINT / MODEL SERVICE
```

Her yukarı adım daha fazla yazılım, automation, customer support ve service responsibility gerektirir.

---

## 7.3 HPC as a Service

HPC yalnız hızlı CPU demek değildir. Google Cloud ve AWS, HPC’yi compute + storage + network üçlüsü üzerinden tanımlar. [R19][R27]

HPCaaS için tipik ihtiyaçlar:

- cluster scheduler
- low-latency network
- high-throughput parallel storage
- large compute pools
- batch queue
- workload images
- software licensing

AI cloud ile HPCaaS’ın facility gereksinimleri kesişebilir; ancak workload scheduling, interconnect ve software ecosystem farklı olabilir.

---

# 8. Aile E — Storage, Backup, DR & Cyber Recovery

## 8.1 Storage as a Service

Müşteri kapasite/performance tier tüketir; provider storage platformunu yönetir.

Fiyatlama boyutları:

- TB-month
- performance tier
- IOPS / throughput
- replication
- snapshots
- egress

StorageaaS basit “disk kiralama” değildir; data durability, availability, lifecycle ve performance contract gerekir.

---

## 8.2 Backup as a Service — BaaS

BaaS için temel ürün değişkenleri:

- protected TB
- protected workload
- retention period
- backup frequency
- restore request
- immutable tier

Backup’ın değeri “backup job success” ile ölçülmemelidir. Asıl kritik metric **recoverability**dir.

---

## 8.3 Disaster Recovery as a Service — DRaaS

DRaaS backup’tan farklıdır. İş yükünün kesinti sonrası yeniden çalıştırılması için:

- replication
- recovery compute
- network reconfiguration
- orchestration
- runbook
- testing

birlikte gerekir.

NIST RPO’yu, outage sonrası verinin hangi geçmiş noktaya kadar geri getirilebilmesi gerektiği; RTO’yu ise sistemin recovery phase’de kalabileceği süre ile ilişkilendirir. [R22][R23]

### DRaaS ürününün merkezindeki soru

> “Müşteri kaç dakikada/saatte, ne kadar veri kaybıyla, hangi bağımlılıklarıyla tekrar çalışacak?”

---

## 8.4 Cyber Recovery / Vault

Cyber recovery, klasik disaster recovery’den farklı threat assumptions kullanır.

Önemli özellikler:

- isolated recovery domain
- immutable copy
- offline/logically isolated copy
- privileged-access separation
- clean-room recovery
- malware validation
- recovery exercises

CISA, kritik veriler için offline, encrypted ve immutable backup ile düzenli restore testing önerir. [R24][R25]

Bu nedenle “backup satıyoruz” ile “cyber recovery service sunuyoruz” aynı seviye değildir.

---

# 9. Aile F — Connectivity & Interconnection

Carrier-neutral data center’da connectivity yalnız facility’ye eklenen bandwidth değildir; başlı başına bir **platform business** olabilir.

## 9.1 Cross Connect

Bir customer portu ile carrier/cloud/partner portu arasında fiziksel bağlantı.

Equinix’in güncel billing modelinde cross-connect için tipik olarak:

- NRC — non-recurring installation charge
- MRC — monthly recurring charge

bulunur. [R21]

Bu, interconnection’ın tekrar eden gelir modeli oluşturabildiğini gösterir.

---

## 9.2 Internet Exchange — IX

Farklı networklerin doğrudan peering yapmasını sağlar.

Değer:

- düşük latency
- transit dependency azaltma
- daha verimli traffic exchange
- ecosystem attraction

---

## 9.3 IP Transit

Müşterinin global internet routing’e erişmesi için upstream provider hizmetidir. IX ile aynı şey değildir.

```text
IX      = peers exchange traffic
TRANSIT = provider gives route to broader Internet
```

---

## 9.4 Cloud Connect / Cloud On-Ramp

Customer’ın public-cloud networküne private/dedicated logical veya physical connection kurmasıdır.

Equinix Fabric; AWS, Google Cloud, Microsoft Azure ve diğer provider’lara direct logical connection seçenekleri sunar. [R28]

Bu hizmet hybrid-cloud müşterisi için data center lokasyonunu daha değerli hale getirir.

---

## 9.5 DCI — Data Center Interconnect

İki data center arasındaki high-capacity bağlantıdır.

Kullanım:

- active-active
- replication
- metro cluster
- DR
- storage replication
- distributed private cloud

---

## 9.6 Software-Defined Interconnection

Physical cross-connect’in yanında API ile provision edilen virtual connectivity katmanıdır.

Equinix Fabric 10 Mbps–100 Gbps bandında logical connections, cloud/provider/partner connectivity ve own-assets interconnection gibi modelleri destekler. [R29]

### Stratejik sonuç

Carrier-neutral facility için MMR ve interconnection alanı **yardımcı teknik oda değil, gelir motorudur**.

---

# 10. Aile G — Managed Operations & Security

Bu aile service margin’i artırabilir; ancak insan ve süreç bağımlılığı en hızlı artan alanlardan biridir.

## Operations services

- Smart Hands
- hardware lifecycle
- managed OS
- managed database
- managed network
- NOCaaS
- capacity management

## Security services

- managed firewall
- DDoS protection
- SOCaaS
- SIEM operations
- vulnerability management
- IAM/PAM services

### Ana risk

Provider çok geniş katalog açıp operasyon organizasyonunu aynı hızda geliştirmezse **service debt** oluşur.

Her yeni managed service için en az:

- owner
- L1/L2/L3 support
- tooling
- observability
- escalation
- maintenance window
- change management
- spare/licensing strategy

oluşturulmalıdır.

---

# 11. Aile H — Platform & Ecosystem Services

Daha olgun provider’larda değer yalnız kendi altyapısından değil, ekosistemden gelir.

Örnekler:

- marketplace
- cloud marketplace integration
- managed Kubernetes / CaaS
- PaaS
- database services
- model/inference service
- partner security services
- edge platform

Bu katmanlar data center şirketini **real-estate/facility provider** seviyesinden **digital infrastructure platform** seviyesine taşıyabilir.

Ancak bu evrim bir branding çalışması değil, organizasyon ve software capability dönüşümüdür.

---

# 12. Detailed responsibility matrix

Aşağıdaki tablo conceptual baseline’dır. Gerçek sorumluluk her sözleşmede ayrı tanımlanmalıdır.

| Katman | Retail Colo | Managed Colo | Dedicated / Hosting | Bare Metal aaS | IaaS | Managed Private Cloud | SaaS |
|---|---|---|---|---|---|---|---|
| Site / building | P | P | P | P | P | P | P |
| Power / cooling | P | P | P | P | P | P | P |
| Physical security | P | P | P | P | P | P | P |
| Physical server | C | C/P | P | P | P | P | P |
| Server lifecycle | C | C/P | P | P | P | P | P |
| Hypervisor | C | C/P | C/P | C/P | P | P | P |
| Virtual network | C | C/P | C/P | C/P | P platform / C config | P/C | P |
| Guest OS | C | C/P | C/P | C | C | P/C | P |
| Middleware | C | C/P | C/P | C | C | P/C | P |
| Application | C | C | C | C | C | C | P |
| Data governance | C | C | C | C | C | C | C/P governance |
| Backup policy | C | C/P | C/P | C | C | P/C | P/C |
| Compliance accountability | C | C | C | C | C | C | C |

**P:** provider operational responsibility  
**C:** customer responsibility  
**C/P:** contract/service-scope dependent

### Önemli ayrım

Provider bir kontrolü işletiyor olabilir; fakat müşteri regülasyon karşısındaki **accountability** sorumluluğunu kaybetmeyebilir. Shared-responsibility yaklaşımı tam da bu nedenle sözleşme ve governance tasarımının parçası olmalıdır. [R9]

---

# 13. Service economics — hangi hizmet neyle fiyatlanır?

## Physical capacity

| Hizmet | Tipik charging unit |
|---|---|
| Cabinet colo | cabinet + committed kW/kVA |
| Cage | space/cabinet count + kW/kVA |
| Suite | area/capacity block |
| Wholesale | committed kW/MW |
| Powered shell | building/capacity lease |
| BTS | long-term custom capacity agreement |

## IT services

| Hizmet | Tipik charging unit |
|---|---|
| Dedicated server | server/month |
| Bare metal | server/hour or month |
| IaaS | vCPU/RAM/time + storage + traffic |
| Private cloud | cluster/node/capacity + management |
| GPUaaS | GPU-hour / GPU-month / reservation |
| HPCaaS | node/core/GPU time + storage/network |

## Data services

| Hizmet | Tipik charging unit |
|---|---|
| StorageaaS | TB-month + performance |
| BaaS | protected TB/workload + retention |
| DRaaS | protected workload + recovery capacity + RPO/RTO tier |
| Cyber recovery | protected capacity + isolation + recovery services |

## Connectivity

| Hizmet | Tipik charging unit |
|---|---|
| Cross Connect | NRC + MRC |
| Port | port speed |
| IP Transit | committed bandwidth / 95th percentile / contract model |
| Cloud Connect | port + virtual connection bandwidth |
| DCI | bandwidth + distance/service class |

AWS ve Google gibi hyperscale cloud modelleri on-demand, commitment/reservation ve interruptible/spot gibi farklı consumption modelleri kullanır. Bu örnekler data-center operator için önemli bir ders verir: **aynı fiziksel kapasite farklı commitment-risk profilleriyle fiyatlanabilir.** [R30][R31][R32]

---

# 14. Revenue ≠ margin: provider’ın gerçek maliyet sürücüleri

## Colocation cost drivers

- land/building
- utility capacity
- transformers/switchgear/UPS/generator
- cooling
- operations staff
- maintenance
- security
- unused capacity

## Managed service cost drivers

- skilled staff
- 24×7 support
- software licenses
- observability
- incident/change processes

## Cloud cost drivers

- server depreciation
- storage
- fabric
- licenses
- orchestration platform
- idle capacity
- support

## GPU cloud cost drivers

- expensive accelerators
- high-density facility
- liquid cooling
- high-speed fabric
- AI storage
- GPU failure/replacement
- **idle GPU time**

### Ana ekonomi ilkesi

> **Satın alınmış kapasite gelir değildir; kullanılan ve faturalanabilen kapasite gelirdir.**

Özellikle GPUaaS ve IaaS’ta utilization, finansal modelin merkezindedir.

---

# 15. Customer-to-service fit matrix

| Müşteri / ihtiyaç | Güçlü aday model | Neden |
|---|---|---|
| Kendi hardware’ını yönetmek isteyen enterprise | Colo | Control + outsourced facility |
| Küçük IT ekibi olan enterprise | Managed colo / managed hosting | Operations yükünü azaltır |
| Legacy/licensing-sensitive workload | Bare metal | Dedicated physical host |
| Dynamic digital workload | IaaS | Elastic/self-service capacity |
| Regulated dedicated platform | Private / sovereign cloud | Isolation/control/governance |
| Hybrid enterprise | Colo + cloud connect + private cloud | On-prem/cloud bridge |
| AI startup | GPUaaS / AI cloud | CAPEX’siz accelerator access |
| Large AI training organization | Dedicated GPU cluster / AI cloud | predictable scale/performance |
| Research/simulation | HPCaaS | compute+network+storage cluster |
| Business continuity requirement | DRaaS | orchestrated recovery |
| Ransomware resilience | Cyber recovery | isolated immutable recovery domain |
| Network-heavy digital business | Colo + IX + cross-connect | ecosystem/latency |

---

# 16. Service model → facility architecture matrix

| Tasarım konusu | Retail Colo | IaaS/Private Cloud | GPU/AI Cloud | DRaaS | Interconnection-heavy |
|---|---|---|---|---|---|
| Tenant physical isolation | Çok yüksek | Orta | Orta/Yüksek | Yüksek | Orta |
| Power granularity | Çok yüksek | Standardize | Büyük high-density blocks | Orta | Orta |
| kW/rack variability | Çok yüksek | Daha kontrollü | Çok yüksek | Orta | Düşük/Orta |
| Liquid cooling readiness | Talebe bağlı | Talebe bağlı | Kritik olabilir | Genelde ikincil | İkincil |
| East-west fabric | Customer-owned olabilir | Kritik | Çok kritik | Orta | Orta |
| Carrier/MMR density | Çok kritik | Önemli | Önemli | Önemli | Ana değer |
| Metering | Cabinet/customer | Resource-level | GPU/resource-level | Workload/DR tier | Port/bandwidth |
| Portal/API | Düşük/Orta | Kritik | Kritik | Yüksek | Yüksek |
| 24×7 platform ops | Facility | IT platform | AI platform | Recovery platform | Network platform |

Bu tablo neden **service modelin architecture’dan önce gelmesi gerektiğini** gösterir.

---

# 17. Four reference architecture patterns

## Pattern A — Carrier-neutral retail colocation

```text
CUSTOMERS
   │
CABINET / CAGE / SUITE
   │
A/B POWER + COOLING + SECURITY
   │
MMR A ───── MMR B
 │  │         │  │
ISP IX      CLOUD CARRIERS
   │
SMART HANDS / PORTAL / METERING
```

**Success factors:** carrier density, customer access, granular power, fast cross-connect, operational consistency.

---

## Pattern B — Managed private cloud

```text
CUSTOMER
   │
PORTAL / IAM
   │
PRIVATE CLOUD CONTROL PLANE
   │
COMPUTE ─ NETWORK ─ STORAGE
   │
BACKUP / MONITORING / SECURITY
   │
DATA CENTER FACILITY
```

**Success factors:** platform operations, lifecycle, standardization, support, automation.

---

## Pattern C — AI Cloud / GPUaaS

```text
CUSTOMER API / AI PLATFORM
           │
  SCHEDULER / KUBERNETES
           │
      GPU CLUSTER
       ╱       ╲
AI FABRIC     AI STORAGE
       ╲       ╱
LIQUID / POWER / FACILITY
```

**Success factors:** GPU utilization, cluster networking, storage throughput, power/cooling, scheduler, tenant isolation.

---

## Pattern D — DRaaS / Cyber Recovery

```text
PRODUCTION SITE
      │
REPLICATION / BACKUP
      │
ISOLATED RECOVERY DOMAIN
      │
IMMUTABLE DATA
      │
RECOVERY COMPUTE
      │
TEST / CLEAN ROOM / FAILOVER
```

**Success factors:** RPO/RTO realism, isolation, runbooks, testing, dependency mapping.

---

# 18. SLA architecture — “99.99%” tek başına anlamsızdır

Bir service SLA en az şu sorulara cevap vermelidir:

1. Hangi service layer ölçülüyor?
2. Measurement point neresi?
3. Planned maintenance dahil mi?
4. Customer-caused events hariç mi?
5. Power SLA mı, network SLA mı, VM SLA mı?
6. Response time ile resolution time aynı mı?
7. Credit mechanism nedir?
8. Data loss için RPO nedir?
9. Recovery için RTO nedir?
10. SLA breach customer’ın gerçek business loss’unu karşılıyor mu?

Uptime Institute geçmiş araştırmalarında colo müşterilerinin önemli bir bölümünün provider outage yaşadığını ve birçok müşterinin SLA penalty’sini iş kaybını karşılamaya yeterli görmediğini raporlamıştır. Bu tarihsel veri güncel contract için doğrudan oran olarak kullanılmamalı, fakat **SLA credit ≠ business continuity** dersini iyi gösterir. [R33]

---

# 19. Service portfolio maturity model

Yeni bir operator’un aynı anda 25 servis açması doğru değildir.

## Level 1 — Facility operator

- cabinet/cage/suite
- power
- cooling
- physical security

## Level 2 — Interconnection operator

- cross-connect
- carrier access
- IX
- IP transit partner ecosystem
- cloud connect

## Level 3 — Managed infrastructure

- smart hands
- managed network
- dedicated server
- backup

## Level 4 — Cloud platform

- IaaS
- private cloud
- managed cloud
- DRaaS

## Level 5 — AI / digital platform

- GPUaaS
- AI cloud
- HPCaaS
- CaaS
- inference services
- marketplace

### Golden rule

Bir sonraki level’a geçmeden önce şu yetkinlikler doğrulanmalıdır:

- people
- process
- tooling
- automation
- capacity
- support model
- security
- billing
- SLA governance

---

# 20. Margin vs complexity decision matrix

Bu tablo relative bir decision aid’dir; gerçek marj market fiyatına ve utilization’a bağlıdır.

| Service | CAPEX intensity | Ops complexity | Software maturity | Utilization risk | Revenue potential | Margin opportunity |
|---|---:|---:|---:|---:|---:|---:|
| Retail colo | High | Medium | Low | Medium | Medium | Medium |
| Wholesale | Very high | Medium | Low | Customer concentration | High | Lower/unit, scale-driven |
| Smart Hands | Low | Medium | Low | Low | Low/Medium | Medium |
| Managed hosting | Medium | High | Medium | Medium | Medium | Medium/High |
| Bare Metal aaS | High | Medium/High | High | High | High | High if utilized |
| IaaS | High | Very high | Very high | High | High | High if scaled |
| GPUaaS | Very high | Very high | Very high | Very high | Very high | Very high / volatile |
| DRaaS | Medium/High | High | High | Reserved capacity risk | High | High |
| Cross-connect | Medium infrastructure | Low/Medium | Low | Low | Medium | Attractive recurring |

### Interpretation

Higher-layer service = otomatik olarak daha kârlı değildir.

Örneğin GPUaaS’ın sticker price’ı yüksek olabilir; fakat GPU utilization düşükse yatırımın return’ü hızla bozulur.

---

# 21. Product bundling — hizmetler nasıl birlikte satılır?

## Bundle 1 — Enterprise Colo

```text
Cabinet
+ A/B Power
+ Cross Connect
+ Internet
+ Smart Hands
```

## Bundle 2 — Managed Enterprise

```text
Colo
+ Dedicated Server
+ Managed Network
+ Backup
+ Security
```

## Bundle 3 — Hybrid Cloud

```text
Colo / Private Cloud
+ Cloud Connect
+ DCI
+ Identity integration
+ Managed network
```

## Bundle 4 — Business Continuity

```text
Production Colo
+ Backup
+ DR Site
+ DRaaS
+ Recovery Test
```

## Bundle 5 — AI Platform

```text
High-density facility
+ GPU compute
+ AI fabric
+ AI storage
+ Kubernetes/scheduler
+ Managed AI operations
```

Bundling customer lifetime value’yu artırabilir; ancak support boundary’nin karmaşıklığını da artırır.

---

# 22. Build-first vs sell-first risk

Bir veri merkezi için en riskli ticari sorulardan biri şudur:

> “Önce kapasiteyi mi kuracağız, yoksa anchor demand’i mi doğrulayacağız?”

### Build-first

**Avantaj:** hızlı delivery / ready capacity.  
**Risk:** stranded CAPEX, yanlış density mix.

### Contract-first / phased build

**Avantaj:** demand-linked CAPEX.  
**Risk:** müşterinin istediği delivery date kaçabilir.

Bu nedenle service model ile **phase architecture** birlikte tasarlanmalıdır.

Örnek:

- standard colo hall
- high-density liquid-ready zone
- future cloud pod
- future DR pod

Facility’nin tamamını ilk günden tek bir use-case’e kilitlemek yerine kontrollü expansion interfaces bırakılır.

---

# 23. Business risk register

## 23.1 Capacity mismatch
Yanlış cabinet/power/density mix.

## 23.2 Customer concentration
Wholesale/BTS anchor’ın kaybı.

## 23.3 Utilization risk
IaaS/GPU idle capacity.

## 23.4 Skills gap
Cloud/AI service satılıp platform ekibinin yetersiz kalması.

## 23.5 SLA overcommitment
Architecture’ın sağlayamayacağı SLA’yı satmak.

## 23.6 Cross-layer dependency
Facility healthy iken cloud platform outage yaşayabilir.

## 23.7 Vendor lock-in
Service control-plane’in tek vendor’a aşırı bağımlı olması.

## 23.8 Energy price risk
Colo ve AI cloud’da margin’in electricity cost’a hassas olması.

## 23.9 Cyber / tenant isolation
Multi-tenant cloud platformunda yanlış isolation.

## 23.10 Regulation / sovereignty
Customer expectations ile real operational control’un eşleşmemesi.

Uptime’ın güncel digital-resiliency yaklaşımı da enterprise workloads’ın owned data centers, colocation, public/private cloud, SaaS ve edge arasında dağıldığını; üçüncü taraf bağımlılıklarının yeni görünürlük ve risk problemleri yarattığını vurgular. [R34]

---

# 24. Common misconceptions

### Yanlış 1 — “Colocation = cabinet kiralamak”
Eksik. Asıl ürün power, cooling, security, SLA ve interconnection ile birlikte capacity service’tir.

### Yanlış 2 — “Wholesale, retail’in çok cabinetli hali”
Eksik. Contract size, customization, unit economics ve concentration risk farklıdır.

### Yanlış 3 — “Powered shell = hazır data center”
Yanlış olabilir. Fit-out ve MEP scope contract’a göre değişir.

### Yanlış 4 — “Private cloud = on-prem”
Yanlış. Private cloud colo/provider tesisinde de olabilir.

### Yanlış 5 — “IaaS = sanallaştırma”
Yanlış. Self-service, orchestration, network, metering ve lifecycle gerekir.

### Yanlış 6 — “GPUaaS = GPU server kiralamak”
Eksik. Utilization, scheduler, storage, network, power/cooling ve software platform gerekir.

### Yanlış 7 — “AI cloud = GPUaaS”
AI cloud daha yüksek abstraction ve platform layer içerebilir.

### Yanlış 8 — “Backup = DR”
Yanlış. DR workload recovery’yi de kapsar.

### Yanlış 9 — “DR = Cyber Recovery”
Yanlış. Cyber recovery compromised environment assumption’ıyla isolation/clean recovery ister.

### Yanlış 10 — “IX = internet transit”
Yanlış. IX peering; transit broader route service’tir.

### Yanlış 11 — “Sovereign = data ülkede”
Eksik. Operator/control-plane/key/jurisdiction da önemlidir.

### Yanlış 12 — “Daha yüksek Tier her zaman daha iyi”
Yanlış. Uptime Tier business-case ve risk tolerance ile eşleşmelidir. [R1]

---

# 25. Provider decision tree

```text
START
 │
 ├─ Müşteri kendi hardware'ına sahip olmak istiyor mu?
 │      │
 │      ├─ YES → COLOCATION
 │      │          │
 │      │          ├─ küçük/orta → cabinet/cage/suite
 │      │          └─ büyük MW → wholesale/BTS
 │      │
 │      └─ NO
 │
 ├─ Dedicated physical performance gerekiyor mu?
 │      └─ YES → DEDICATED / BARE METAL
 │
 ├─ Elastic self-service compute gerekiyor mu?
 │      └─ YES → IaaS / PRIVATE CLOUD
 │
 ├─ GPU/AI workload mu?
 │      └─ YES → GPUaaS / AI CLOUD
 │
 ├─ Recovery outcome mu satılıyor?
 │      └─ YES → BaaS / DRaaS / CYBER RECOVERY
 │
 └─ Asıl değer network ecosystem mi?
        └─ YES → INTERCONNECTION / IX / CLOUD CONNECT
```

Gerçekte customer birden fazla branch’in birleşimini satın alabilir.

---

# 26. Golden Service Model Selection Framework

Her yeni data center projesinde aşağıdaki sorular cevaplanmadan final architecture dondurulmamalıdır.

## Customer
1. Hedef customer segments kim?
2. Customer kendi hardware’ını mı getiriyor?
3. Customer’ın operational maturity’si nedir?

## Commercial
4. Charging unit nedir: rack, kW, MW, VM, GPU-hour, TB?
5. Commitment süresi nedir?
6. Utilization riski kimde?

## SLA / Risk
7. Availability / RPO / RTO nedir?
8. Hangi failure domainler ayrılmalı?
9. Compliance/sovereignty şartı var mı?

## Technology
10. Workload density nedir?
11. East-west / north-south traffic profili nedir?
12. Storage latency/throughput ihtiyacı nedir?

## Operations
13. Kim 24×7 işletiyor?
14. L1/L2/L3 support kimde?
15. Change / patch / firmware responsibility kimde?

## Growth
16. 3–5 yıllık capacity ramp nedir?
17. Standart ve AI/high-density growth ayrı mı?
18. Exit / migration path var mı?

Bu cevaplardan sonra power, cooling, network, security ve platform architecture seçilir.

---

# 27. SpecBridge canonical service taxonomy v2

## FACILITY / COLOCATION
- Retail Colocation
- Secure Cabinet
- Private Cage
- Private Suite
- Dedicated Data Hall
- Wholesale Colocation
- Powered Shell / Powered Base
- Build-to-Suit
- Hyperscale Capacity
- High-Density / AI Colocation

## MANAGED INFRASTRUCTURE
- Remote Hands
- Smart Hands
- Managed Colocation
- Dedicated Server
- Managed Hosting
- Bare Metal as a Service
- Hardware Lifecycle

## CLOUD
- IaaS
- Private Cloud
- Managed Private Cloud
- Hybrid Cloud
- Sovereign Public Cloud
- Sovereign Private Cloud
- National / Partner Cloud

## AI / HPC
- GPU Colocation
- Dedicated GPU Server
- GPUaaS
- GPU Kubernetes / CaaS
- AI Cloud
- Managed AI Platform
- Inference as a Service
- HPCaaS

## DATA
- Storage as a Service
- Backup as a Service
- DRaaS
- Cyber Recovery
- Business Continuity

## CONNECTIVITY
- Cross Connect
- Internet Exchange
- IP Transit
- Metro Connect
- DCI
- Cloud Connect / On-Ramp
- Software-Defined Interconnection

## MANAGED OPERATIONS / SECURITY
- Managed Network
- NOCaaS
- Managed Firewall
- DDoS Protection
- Managed Security
- SOCaaS
- SIEM Operations
- Managed OS / Middleware / Database

## PLATFORM
- Marketplace
- Managed Kubernetes / CaaS
- PaaS
- Database as a Service
- Model / Inference Service
- Edge / Metro Platform

---

# 28. Recommended visual package for DC-K01 v2

Full module UI should contain at least the following visuals:

1. **Service Responsibility Spectrum** — Own DC → Colo → Managed → IaaS → PaaS/SaaS
2. **Canonical Service Taxonomy Tree**
3. **Responsibility Stack Matrix**
4. **Customer-to-Service Fit Matrix**
5. **Service Model → Facility Architecture Heatmap**
6. **Revenue Unit Map** — rack/kW/MW/VM/GPU-hour/TB/port
7. **AI Service Ladder** — GPU Colo → GPUaaS → AI Platform
8. **Data Protection Ladder** — Storage → Backup → DR → Cyber Recovery
9. **Interconnection Revenue Layer**
10. **Provider Maturity Ladder**
11. **Margin vs Complexity Matrix**
12. **Golden Service Selection Decision Tree**

Narration sırasında ilgili visual layer highlight edilmelidir.

---

# 29. Full narration chapter plan

DC-K01 Full Briefing tek uzun MP3 yerine chaptered audio olarak üretilmelidir.

| Chapter | Konu | Target |
|---|---|---:|
| K01-00 | Veri merkezi gerçekte ne satar? | 3–4 dk |
| K01-01 | Colocation: cabinet’ten BTS’ye | 5–6 dk |
| K01-02 | Managed hosting, dedicated ve bare metal | 4–5 dk |
| K01-03 | IaaS, private, hybrid ve sovereign cloud | 5–6 dk |
| K01-04 | GPUaaS, AI Cloud ve HPCaaS | 5–6 dk |
| K01-05 | Storage, Backup, DR ve Cyber Recovery | 4–5 dk |
| K01-06 | Interconnection ve managed operations | 4–5 dk |
| K01-07 | Ekonomi, risk ve hangi model seçilmeli? | 5–6 dk |

Total target: **~35–43 minutes**. Final duration narration pacing ve section density’ye göre belirlenmelidir; süreyi doldurmak için metin eklenmemelidir.

---

# 30. Authoritative / official source register

## Uptime Institute

**[R1] Uptime Institute — Tier Classification Myths and Misconceptions**  
Business case / risk tolerance determines the appropriate Tier.  
https://journal.uptimeinstitute.com/myths-and-misconceptions-regarding-the-uptime-institutes-tier-certification-system/

**[R2] Uptime Institute — Consulting / FORCSS venue decision framework**  
Financial, Opportunity, Risk, Compliance, Sustainability, Service Quality.  
https://connect.uptimeinstitute.com/professional-services/consulting-services

**[R33] Uptime Institute — 2016 Data Center Industry Survey**  
Historical evidence on colocation expectations, outages and SLA-credit limitations.  
https://uptimeinstitute.com/about-ui/press-releases/2016-survey-results

**[R34] Uptime Institute — Digital resiliency / distributed infrastructure**  
Owned DC, colo, cloud and third-party dependencies as a combined risk domain.  
https://connect.uptimeinstitute.com/professional-services/consulting-services/it-advisory-services

**[R35] Uptime Intelligence — Common factors for IT venue selection**  
In-house vs third-party venue selection considerations.  
https://journal.uptimeinstitute.com/it-venue-selection-when-choosing-in-house-or-outsource/

## Equinix — colocation / interconnection / operations

**[R3] Equinix — Secure Cabinet with kVA-Based Power**  
Cabinet + power allocation / draw-cap commercial structure.  
https://docs.equinix.com/colocation/secure-cabinets/colo-secure-cabinets-kva/

**[R4] Equinix — Private Cages**  
Cabinet quantity, power allocation, demarcation and cross-connect readiness.  
https://docs.equinix.com/colocation/colo-private-cage/

**[R20] Equinix — Smart Hands**  
On-site operational task scope.  
https://docs.equinix.com/smart-hands/

**[R21] Equinix — Cross Connect Pricing & Billing**  
NRC/MRC commercial model.  
https://docs.equinix.com/cross-connect/xc-pricing-billing-terms/

**[R28] Equinix — Connect to a Service Provider**  
Direct connectivity to AWS, GCP, Microsoft Azure and other providers.  
https://docs.equinix.com/fabric/service-providers/generic-connect-to-service-provider/

**[R29] Equinix — Fabric**  
Software-defined interconnection and logical connection model.  
https://docs.equinix.com/fabric/

## Digital Realty / CyrusOne — large-scale facility commercial models

**[R5] Digital Realty — Build-to-Suit**  
Customer-specific structural, security, electrical, mechanical and cooling design.  
https://www.digitalrealty.com/platform-digital/colocation/build-to-suit

**[R6] Digital Realty — Data Center Suites / Powered Base Buildings**  
Move-in-ready suites and fit-out-ready powered/fiber-provisioned building model.  
https://www.digitalrealty.com/platform-digital/colocation/data-center-suites

**[R7] CyrusOne — Sustainability Report / colo vs in-house**  
Colocation flexibility across customer loads and equipment types.  
https://www.cyrusone.com/hubfs/Website%20Documents%202025/2023_CyrusOne_Sustainability_Report.pdf

**[R26] CyrusOne — Build-to-Suit**  
Customized large-scale capacity, redundancy, power density and cooling options.  
https://www.cyrusone.com/solutions/build-to-suit

## AWS / IBM / Microsoft — cloud service responsibility and consumption

**[R8] AWS — What is IaaS?**  
Compute, storage and network infrastructure delivered on pay-as-you-go basis.  
https://aws.amazon.com/what-is/iaas/

**[R9] AWS — Shared Responsibility Model**  
Provider vs customer control/responsibility.  
https://aws.amazon.com/compliance/shared-responsibility-model/

**[R10] AWS — Security in Amazon EC2**  
EC2 customer responsibility examples: OS, network configuration, credentials and applications.  
https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security.html

**[R11] IBM Cloud — Bare Metal Server Options**  
Single-tenant physical server, hourly/monthly consumption, no shared server resources.  
https://cloud.ibm.com/docs/bare-metal?topic=bare-metal-about-bm

**[R12] AWS — Outposts**  
AWS infrastructure/services on-premises/edge for hybrid operation.  
https://aws.amazon.com/outposts/

**[R15] Microsoft — What is Microsoft Sovereign Cloud?**  
Public/private/partner-operated sovereignty deployment models.  
https://learn.microsoft.com/en-us/azure/azure-sovereign-clouds/microsoft-sovereign-cloud

**[R16] Microsoft — Sovereign Private Cloud**  
Customer control, residency and connected/disconnected private-cloud models.  
https://learn.microsoft.com/en-ie/industry/sovereign-cloud/sovereign-private-cloud/overview-sovereign-private-cloud

**[R30] AWS — EC2 On-Demand Pricing**  
Consumption-based compute model.  
https://aws.amazon.com/ec2/pricing/on-demand/

**[R31] AWS — EC2 Purchasing Options**  
On-Demand, Savings Plans, Reserved, Spot, Dedicated Hosts and Capacity Reservations.  
https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html

**[R32] Google Cloud — Compute Pricing**  
On-demand, committed use, sustained use and Spot pricing examples.  
https://cloud.google.com/products/compute/pricing

## NVIDIA / HPC

**[R13] NVIDIA — Requirements for AI Clouds v2.3, 25 Jun 2026**  
Full-stack service-delivery requirements for NVIDIA Cloud Partners.  
https://docs.nvidia.com/dsx/ncp/nvidia-requirements-for-ai-clouds/home

**[R14] NVIDIA DSX — Facilities Infrastructure Reference Design**  
AI Factory site, power, cooling, controls, connectivity and compute co-design.  
https://docs.nvidia.com/dsx/facilities-infra/reference-design-overview

**[R17] NVIDIA — Multi-Instance GPU (MIG)**  
GPU partitioning and multi-tenant isolation/utilization concepts.  
https://docs.nvidia.com/datacenter/tesla/mig-user-guide/introduction.html

**[R18] NVIDIA — Inference Reference Architecture**  
Cloud-like delivery of models, endpoints, Kubernetes capacity and GPU workers.  
https://docs.nvidia.com/ncx/ncp-inference-ra/

**[R19] Google Cloud — What is HPC?**  
HPC compute, storage and network cluster model.  
https://cloud.google.com/discover/what-is-high-performance-computing

**[R27] AWS — High Performance Computing**  
Cloud HPC compute, high-performance storage and networking.  
https://aws.amazon.com/hpc/

## NIST / CISA — recovery

**[R22] NIST — Recovery Point Objective**  
https://csrc.nist.gov/glossary/term/recovery_point_objective

**[R23] NIST — Recovery Time Objective**  
https://csrc.nist.gov/glossary/term/recovery_time_objective

**[R24] CISA — #StopRansomware Guide**  
Offline/encrypted backups, restore testing and immutable storage guidance.  
https://www.cisa.gov/stopransomware/ransomware-guide

**[R25] CISA — BlackMatter Ransomware Advisory**  
Offline, encrypted and immutable backup recommendation.  
https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-291a

---

# 31. Research conclusions for investors and designers

### Conclusion 1
Data center product design **facility design’dan önce** başlar.

### Conclusion 2
Colocation, cloud ve AI services aynı facility’de coexist edebilir; fakat aynı operational model değildir.

### Conclusion 3
Interconnection, mature colo platformunda yan özellik değil ayrı ürün ve ecosystem moat’tur.

### Conclusion 4
Higher-layer service daha yüksek revenue potansiyeli sunabilir; fakat software, staff, utilization ve SLA riskini de büyütür.

### Conclusion 5
GPU cloud’un en kritik finansal değişkeni yalnız GPU purchase cost değil **billable utilization**dır.

### Conclusion 6
DRaaS ile cyber recovery aynı service değildir; threat model ve isolation architecture farklıdır.

### Conclusion 7
Sovereignty yalnız data location değildir; control, operator, jurisdiction ve keys birlikte değerlendirilmelidir.

### Conclusion 8
Provider’ın optimum service portfolio’su “en fazla servis” değil; **mevcut people/process/tooling maturity ile güvenilir biçimde işletilebilen en yüksek değerli servis kombinasyonu**dur.

---

# 32. Research freeze statement

Bu v2 çalışma **DC-K01 Golden Research Baseline** olarak kullanılacaktır.

Full narration, diagrams ve interactive matrices bu araştırmadan türetilecek; yeni bir teknik veya ticari iddia eklenirse source register’a dayandırılacaktır. Vendor product örnekleri yalnız implementation evidence’tır; universal standard değildir.

Bir sonraki internal gate:

```text
DC-K01 V2 RESEARCH = COMPLETE
        ↓
FULL NARRATION SCRIPT
        ↓
S3F CHAPTER AUDIO
        ↓
TRANSCRIPT / VTT / QA
        ↓
INTERACTIVE VISUAL PACKAGE
        ↓
DC-K01 GOLDEN MODULE ACCEPTANCE
```
