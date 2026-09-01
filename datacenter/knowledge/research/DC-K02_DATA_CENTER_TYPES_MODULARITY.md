# DC-K02 — Veri Merkezi Tipleri & Modülerlik

**Status:** GOLDEN MODULE V2 — DEEP RESEARCH COMPLETE / NARRATION NOT STARTED  
**Language:** TR  
**Author:** Önder Yardaş  
**Research date:** 2026-09-01  
**Evidence boundary:** Public standards, certification bodies and authoritative engineering sources are primary. Vendor material is used only as implementation/product evidence and must not be generalized into an industry rule.  
**Quick Brief:** Existing S3F Quick Brief remains valid and is preserved as the short-form layer.  
**Full Briefing:** Not generated yet; research/evidence quality precedes narration and audio production.

---

## Executive conclusion

Bir veri merkezini **“traditional”, “modular”, “containerized”, “micro”, “edge”, “enterprise”, “colo”, “hyperscale” veya “AI data center”** diye tek bir listede sınıflandırmak teknik olarak hatalıdır. Bu terimler aynı soruya cevap vermez.

Örneğin:

- **greenfield / brownfield / retrofit** projenin mevcut saha ve bina durumunu,
- **traditional / prefabricated / modular / hybrid** üretim ve teslim yöntemini,
- **building / skid / container / micro DC / smart cabinet** fiziksel formu,
- **enterprise / colocation / regional / hyperscale / edge / HPC / AI** kullanım ve işletme bağlamını,
- **monolithic / phased / repeatable block** ise büyüme yöntemini anlatır.

Bu nedenle bir tesis aynı anda:

> **brownfield + hybrid + prefabricated power skids + conventional white space + modular liquid-cooling zone + enterprise AI data center**

olabilir.

Bu modülün temel kararı şu cümleyle özetlenir:

```text
REQUIREMENT
    ↓
PROJECT CONDITION
    ↓
SCALE + INITIAL / ULTIMATE CAPACITY
    ↓
DENSITY + COOLING METHOD
    ↓
SITE / BUILDING / UTILITY CONSTRAINTS
    ↓
TIME-TO-CAPACITY
    ↓
GROWTH / PHASING MODEL
    ↓
RESILIENCE + MAINTAINABILITY
    ↓
LOGISTICS / ROUTE / CRANE
    ↓
STANDARDIZATION vs CUSTOMIZATION
    ↓
DELIVERY ARCHITECTURE
```

**Golden rule:**

> **Modularity bir dayanıklılık seviyesi, tek bir ürün veya tek bir enclosure tipi değildir. Modularity; kapasiteyi, sistemleri ve entegrasyon sınırlarını tekrar edilebilir bloklar halinde tasarlama ilkesidir.**

ISO/IEC 22237-1 veri merkezi tasarımını yalnız fiziksel forma göre değil; amaç, büyüklük/karmaşıklık, availability, security, energy efficiency, planned lifetime, business risk ve operating cost bağlamında ele alır. TIA-942-C de topolojisinin her boyut ve tipte data center için uygulanabilir olduğunu belirtir. Bu iki formal yaklaşım, “hangi kutu?” sorusundan önce “hangi gereksinim ve hangi risk profili?” sorusunun gelmesi gerektiğini destekler. [R1][R3]

---

# 1. Evidence language — bu modülde ifadeler nasıl okunmalı?

Bu dokümanda beş ayrı kanıt/yorum seviyesi kullanılır:

### FACT
Standardın, certification body’nin veya kaynak dokümanın açıkça söylediği şey.

### ENGINEERING GUIDANCE
Bir standardın veya yetkin teknik kuruluşun tasarım/operasyon yaklaşımı; proje özelinde mühendislik doğrulaması gerektirir.

### VENDOR CLAIM
Bir üreticinin kendi çözümü, zaman/maliyet/performans iddiası veya ürün envelope’u. Universal rule değildir.

### SPECBRIDGE INTERPRETATION
Birden fazla güvenilir kaynağın ve engineering practice’in sistematik biçimde birleştirilmesiyle oluşturulan vendor-neutral sınıflandırma veya çıkarım.

### DECISION GUIDANCE
Belirli bir proje bağlamında hangi seçeneğin neden aday olması gerektiğini açıklayan karar yardımı. Hard threshold değildir.

Bu ayrım özellikle “modular daha ucuzdur”, “container Tier III olamaz”, “AI için mutlaka prefabricated gerekir” veya “factory-tested ise site commissioning gerekmez” gibi hatalı genellemeleri önlemek için kritiktir.

---

# 2. Canonical taxonomy — tek liste yerine beş eksen

**SPECBRIDGE INTERPRETATION**

## Axis A — Project condition

1. Greenfield
2. Brownfield
3. Retrofit / modernization

## Axis B — Delivery / production method

1. Traditional / site-built
2. Prefabricated
3. Modular
4. Hybrid industrialized construction

## Axis C — Physical form / enclosure

1. Conventional building / room
2. Prefabricated room / hall
3. Skid / e-house / power module
4. Cooling module / plant module
5. Containerized module
6. Micro data center
7. Smart Cabinet / All-in-One Cabinet
8. Multi-rack integrated row / pod

## Axis D — Mission / operating model / workload context

1. Branch / Edge
2. Enterprise
3. Colocation
4. Regional cloud
5. Hyperscale
6. HPC
7. AI / AI Factory
8. Hybrid facility

## Axis E — Growth model

1. Upfront / monolithic capacity
2. Phased build-out
3. Repeatable block expansion
4. Retrofit insertion
5. Temporary / relocatable capacity

Bu yapıdaki en önemli sonuç şudur:

> **Bir data center tipi çoğu zaman bir “etiket” değil, beş eksenin kombinasyonudur.**

---

# 3. Greenfield, brownfield ve retrofit

## 3.1 Greenfield

Yeni saha veya yeni yapı üzerinde veri merkezi tasarımıdır. Utility girişleri, bina geometrisi, structural loading, MEP zoning, fire compartments, carrier entry, loading route ve expansion area başlangıçtan optimize edilebilir.

**Güçlü taraf:** En yüksek master-plan özgürlüğü.  
**Risk:** Utility, permit, civil works ve uzun lead-time equipment programı projenin kritik yolunu oluşturabilir.

## 3.2 Brownfield

Mevcut bina/saha veya mevcut facility altyapısı içinde kapasite ekleme/değişim yapılır. Brownfield bir “daha küçük data center” anlamına gelmez; constraint yoğunluğu daha yüksek bir proje koşuludur.

Tipik kısıtlar:

- mevcut floor loading
- mevcut shaft / riser
- energization limiti
- mevcut generator / UPS topolojisi
- mevcut chilled/facility-water kapasitesi
- erişim ve lifting route
- operasyon sırasında kesinti sınırı
- live-system tie-in

## 3.3 Retrofit / modernization

Mevcut bir sistemin performans, kapasite, verimlilik veya teknoloji açısından yenilenmesidir. UPS replacement, battery modernization, busway ekleme, liquid cooling zone, CDU skid, controls/DCIM yenilemesi veya high-density rack eklenmesi retrofit olabilir.

Eaton’ın factory-engineered compact UPS skid yaklaşımını özellikle retrofit projeleri için konumlandırması, prefabrication’ın sadece greenfield için olmadığını gösteren bir vendor implementation örneğidir. [R19]

**DECISION GUIDANCE:** Brownfield/retrofit projelerde “modül fiziksel olarak sığıyor mu?” sorusu kadar önemli olan soru **“modül mevcut failure domain’e nasıl bağlanıyor ve tie-in sırasında hangi sistem kesilecek?”** sorusudur.

---

# 4. Traditional / conventional / stick-built data center

Traditional veya stick-built yaklaşımda building, electrical, mechanical ve white-space infrastructure’ın önemli bölümü proje özelinde sahada kurulur ve entegre edilir.

## Güçlü yönler

- irregular / constrained building geometry’ye yüksek uyum
- site-specific structural ve MEP optimizasyonu
- çok özel redundancy veya routing seçenekleri
- yüksek customization
- geniş vendor choice
- çok büyük campus master planlarında bina/civil tasarım özgürlüğü

## Zayıf yönler

- site labor ve subcontractor interface yoğunluğu
- weather / access / sequencing etkisi
- daha fazla field assembly
- project-specific wiring/piping variation
- commissioning kapsamının büyük bölümünün sahaya kalması
- fazla upfront capacity kurulursa stranded-capacity riski

Schneider Electric’in 2026 White Paper 163’ü traditional stick-built ile prefabricated yaklaşımı karşılaştırırken, prefabrication’ı custom construction zihniyetinden standardized site integration modeline geçiş olarak tanımlar. Aynı kaynak prefabricated çözümün daha hızlı ve öngörülebilir olabileceğini, fakat maliyetinin traditional çözümle benzer de olabileceğini söyler. Bu nedenle “traditional pahalı, prefab ucuz” şeklinde evrensel bir kural kurulamaz. [R13]

---

# 5. Prefabricated data center — ne demektir?

**FACT / VENDOR ENGINEERING EVIDENCE**

Prefabrication; power, cooling, IT space veya bunların kombinasyonlarının sahadan önce factory environment’ta pre-assembled, integrated ve belirli ölçüde tested halde üretilmesidir. Schneider ve Vertiv kaynakları bu yaklaşımı açıkça factory integration + site integration ayrımıyla ele alır. [R13][R16]

Prefabricated çözüm şunlardan herhangi biri olabilir:

- prefabricated power room
- electrical skid
- UPS + switchgear module
- cooling skid / pump skid
- CDU / liquid cooling module
- prefabricated IT hall
- row/pod
- container
- complete modular facility

**Önemli:**

> **PREFABRICATED ≠ MICRO DATA CENTER**

Bir 5 MW power module prefabricated olabilir; bu onu micro data center yapmaz.

---

# 6. Modular data center — ne demektir?

Modularity; sistemi değiştirilebilir, tekrar edilebilir veya aşamalı genişletilebilir building block’lara ayırma tasarım ilkesidir.

OCP Modular Data Center Sub-Project kapsamı power, cooling, IT ve all-in-one modules üzerinde çalışır. Bu, modülerliğin yalnız container veya yalnız IT room anlamına gelmediğini gösterir. [R11]

## Modular yapı üç farklı anlam taşıyabilir

### Capacity modularity
Örn. 500 kW → 1 MW → 1.5 MW şeklinde kapasite blokları.

### Functional modularity
Power, cooling, white space, controls gibi fonksiyonların ayrı modüllere bölünmesi.

### Replacement / lifecycle modularity
Bir sistemin tüm facility’yi yeniden kurmadan değiştirilebilir/yenilenebilir blok olarak tasarlanması.

**Golden distinction:**

> **MODULAR ≠ CONTAINERIZED**

Container yalnız bir enclosure/form factor’dür. Containerized bir çözüm modular olabilir; fakat her modular çözüm container değildir ve her container uygulaması iyi bir modular growth architecture anlamına gelmez.

---

# 7. Containerized data center

Containerized data center, IT veya support infrastructure’ın transportable enclosure içinde paketlenmesidir. Enclosure ISO shipping-container geometry’sine yakın olabilir veya custom transportable module olabilir.

## Avantaj adayları

- transportability
- factory integration
- fast capacity insertion
- remote / temporary deployments
- repeatability

## Kısıtlar

- width/height/weight envelope
- maintenance clearance
- internal aisle geometry
- acoustics
- structural limits
- route survey / bridge / road / port constraints
- cranage
- heat rejection interface
- fire compartment integration

**DECISION GUIDANCE:** “Containerized” bir architecture quality seviyesi değildir. İyi veya kötü tasarım; power/cooling topology, failure domains, maintainability, interfaces ve lifecycle planıyla belirlenir.

---

# 8. Micro data center

Micro data center, küçük fiziksel ölçekte compute/network/storage ile supporting physical infrastructure’ı yakın veya aynı enclosure içinde birleştiren integrated architecture’dır.

ASHRAE’nin edge computing bulletin’i küçük edge data center örnekleri arasında shipping-container modular systems, prefab edge pods, küçük brick-and-mortar rooms ve single-rack enclosures sayar. Bu örnekler “edge” ile “micro”nun ilişkili fakat eş anlamlı olmadığını gösterir. [R9]

Rittal’ın RiMatrix Micro Data Center yaklaşımı enclosure, power, climate control, monitoring ve security’yi tek bundle’da birleştiren bir vendor example’dır. [R21]

**Önemli:**

> **MICRO DATA CENTER fiziksel/entegrasyon ölçeğini anlatır; EDGE ise workload placement ve latency/operational context’i anlatır.**

Bir edge site tek cabinet olabilir; ancak regional edge birkaç yüz kW veya daha büyük de olabilir.

---

# 9. Smart Cabinet / All-in-One Cabinet

Smart Cabinet; tipik olarak rack/cabinet seviyesinde şu fonksiyonların bir kısmını veya tamamını entegre eder:

- IT rack
- UPS
- PDU / distribution
- cooling
- monitoring
- access/security
- optional fire detection/suppression

Huawei FusionModule500/800 ürün ailesi, tek cabinet veya single-row integrated power/cooling/monitoring yaklaşımının güncel vendor örneğidir. [R20]

**Önemli:**

> **SMART CABINET ≠ MODULAR DATA CENTER**

Smart Cabinet modüler mimarinin bir building block’u olabilir; fakat “modular data center” kavramı MW-scale power/cooling/IT blocks’a kadar uzanır.

---

# 10. Enterprise, colocation, regional, hyperscale, HPC ve AI neden ayrı eksendir?

Bu kavramlar çoğunlukla **facility mission / operating model / workload context** tanımlar.

### Enterprise
Tek kurum veya grup workload’ları için tasarım. Standardization ile customization arasında organizasyon ihtiyacına göre denge kurulur.

### Colocation
Heterojen tenant yükleri, metering, physical segmentation, customer access, diverse carrier/interconnection ve farklı density talepleri önemlidir.

### Regional cloud
Repeatable capacity, automation, network reach ve hızlı expansion kritik olabilir.

### Hyperscale
Çok büyük aggregate capacity, standardized design families, supply-chain repeatability ve campus phasing öne çıkar.

### HPC
Yüksek compute/network density, tightly coupled workloads ve thermal/power profile önceliklidir.

### AI / AI Factory
GPU/accelerator yoğunluğu, high-current distribution, network fabric, liquid cooling/TCS ve hızlı teknoloji yenilenmesi kritik hale gelir.

Bunların hiçbiri “building traditional olamaz” veya “modular olmak zorundadır” anlamına gelmez.

---

# 11. Modularity maturity — M1’den M4’e

**SPECBRIDGE CANONICAL MODEL**

## M1 — Component modularity

Örnek:

- modular UPS power modules
- battery cabinets
- modular switchgear sections
- rack PDUs
- modular chillers

## M2 — Subsystem modularity

Örnek:

- prefabricated power room
- electrical skid
- cooling skid
- CDU skid
- pump module
- generator enclosure

## M3 — IT-space modularity

Örnek:

- prefab IT room
- modular white-space hall
- row/pod
- containerized IT block
- micro data center cluster

## M4 — Full-facility modularity

IT + power + cooling + fire + monitoring + security’nin büyük ölçüde factory-integrated repeatable blocks halinde teslimi.

Bir facility aynı anda M1, M2 ve M3’ü farklı sistemlerde kullanabilir. Bu nedenle “modüler mi değil mi?” binary sorusu çoğu gerçek projede yetersizdir.

---

# 12. Prefabricated power modules / skids

Electrical modularization için tipik içerik:

```text
UTILITY / MV
   ↓
SWITCHGEAR
   ↓
TRANSFORMER
   ↓
UPS / ENERGY STORAGE
   ↓
LV DISTRIBUTION / BYPASS
   ↓
SITE INTERFACE
```

Eaton modular power assembly yaklaşımı switchgear, transformer, UPS ve ilgili power equipment’ın skid/prefab assembly olarak factory engineered/tested teslimine örnektir. [R18][R19]

## Engineering value

- repeatable wiring
- controlled assembly
- factory QA/FAT
- site work ile parallel manufacturing
- retrofit insertion
- schedule predictability

## Engineering risk

- fault level / protection coordination interface
- earthing/bonding
- MV/LV termination
- bypass topology
- cable entry / bend radius
- heat rejection
- battery/fire code
- maintenance access

---

# 13. Prefabricated cooling modules

Cooling modularization şunları içerebilir:

- chiller/pump skid
- dry-cooler / heat-rejection module
- CRAH/row cooling block
- CDU skid
- primary-secondary heat exchanger module
- TCS distribution block

AI liquid-cooling retrofit’i için “bütün data center’ı liquid-cooled yapmak” yerine dedicated AI zone + CDU/secondary loop modülerizasyonu çoğu brownfield projede güçlü bir aday olabilir.

Ancak bu karar şu parametrelere bağlıdır:

- rack heat load
- liquid capture ratio
- facility-water temperatures
- TCS temperatures
- flow/pressure
- redundancy
- water quality
- leak detection
- maintenance/bypass
- heat rejection capacity

---

# 14. Modular white space / IT pod

IT-space modularity, rack rows ve containment’ın tekrar edilebilir IT capacity block olarak ele alınmasıdır.

```text
PHASE 1
[ IT POD A ] [ IT POD B ]
      ↓
PHASE 2
[ IT POD C ] [ IT POD D ]
      ↓
PHASE 3
[ AI POD ] + [ LIQUID COOLING MODULE ]
```

Bu modelde kritik konu yalnız pod geometrisi değil; her faz için upstream power, cooling plant, network, fire zoning ve maintenance path’in önceden hazırlanmasıdır.

---

# 15. Full-facility prefabrication

Full-facility modular yaklaşımda IT, power, cooling, monitoring, fire ve structural/enclosure katmanlarının büyük bölümü factory-built blocks olarak entegre edilebilir.

Vertiv MegaMod’un 0.5 MW başlangıç ve 0.5/1 MW building block’larla genişleme modeli bunun bir **vendor product example**’ıdır; bu değerler industry threshold değildir. [R17]

**VENDOR CLAIM boundary:** Bir ürünün 0.5 MW veya 1 MW blok kullanması, “doğru modular block size budur” anlamına gelmez. Doğru block size; demand curve, redundancy topology, plant efficiency, site logistics ve commercial phasing ile belirlenir.

---

# 16. Hybrid facility — çoğu gerçek projede en önemli kategori

Hybrid architecture, traditional ve prefabricated/modular yöntemlerin birlikte kullanılmasıdır.

Örnek:

```text
TRADITIONAL / SITE-SPECIFIC
Site + Civil + Building + Main Utility
              │
              ├── PREFAB POWER MODULES
              ├── PREFAB COOLING / CDU SKIDS
              ├── CONVENTIONAL WHITE SPACE
              └── MODULAR AI / HIGH-DENSITY PODS
```

Hybrid yaklaşımın gücü, **site-specific olması gereken şeyleri custom bırakıp repeatable olması gereken şeyleri standardize etmesidir.**

Bu özellikle:

- brownfield expansion
- multi-MW phased facilities
- mixed air/liquid cooling
- enterprise-to-colo transition
- AI capacity insertion

senaryolarında güçlüdür.

---

# 17. Modularity ve Tier / Rated availability ilişkisi

**FACT**

Uptime Tier-Ready programı prefabricated/modular solutions’ın manufacturer level’da Tier principles’a göre pre-validation’ına yöneliktir. TIA-942 Ready de pre-manufactured modular data center design için certification kategorisi sunar. [R4][R6]

Uptime Tier-Ready status specific reviewed solution’a aittir; başka bir site veya çözümün otomatik Tier certification’ı değildir. [R7]

TIA Rated-3 tanımı redundant capacity components ve multiple independent distribution paths ile planned maintenance sırasında ICT’nin kesintisiz kalmasını hedefleyen concurrently maintainable site infrastructure’dır. [R4]

**Sonuç:**

> **Modular bir facility concurrently maintainable / Tier III-equivalent design intent taşıyabilir. Fiziksel form buna engel değildir.**

Uptime’ın DXN client story’sinde Tier-Ready prefab/modular solution’ın son built site üzerinde Tier III Certification of Constructed Facility aldığı örnek de bunu doğrular. [R8]

### Kritik ayrım

```text
TIER-READY / READY MODULE
          ≠
FINAL CERTIFIED SITE
```

Site integration, upstream/downstream infrastructure, construction ve testing yine ayrı doğrulama gerektirir.

---

# 18. Availability label değil, end-to-end topology meselesidir

Bir module kendi içinde “2N” olabilir; ancak site ortak bir:

- transformer
- switchboard
- chilled-water header
- pump
- CDU
- controls network
- fuel system
- fire zone

üzerinden besleniyorsa gerçek failure domain beklenenden farklı olabilir.

**ENGINEERING GUIDANCE:** Redundancy değerlendirmesi module boundary’de değil **source-to-load / heat-source-to-heat-rejection** end-to-end path üzerinde yapılmalıdır.

---

# 19. Factory testing, site commissioning’i ortadan kaldırmaz

Vertiv prefabricated systems’ın pre-assembled, fully integrated ve factory-tested olabildiğini; manufacturing/transport’un site preparation ile paralel yürüyebildiğini belirtir. [R16]

Schneider’in site-preparation guidance’ı permit, land preparation, field piping/wiring ve site inspection’ın devam ettiğini açıkça gösterir. [R14]

Bu nedenle doğru QA zinciri şöyledir:

```text
DESIGN REVIEW
   ↓
FACTORY QA / FAT
   ↓
TRANSPORT INSPECTION
   ↓
SITE INSTALLATION
   ↓
FIELD CONNECTION TESTS
   ↓
SAT / START-UP
   ↓
SYSTEM COMMISSIONING
   ↓
INTEGRATED SYSTEMS TESTING
```

**Golden rule:**

> **FAT, IST’nin alternatifi değildir. Factory integration bazı riskleri daha erken yakalar; site interfaces ise ancak final installation üzerinde doğrulanabilir.**

---

# 20. Logistics ve transportation engineering

Prefabrication’ın en güçlü schedule avantajlarından biri, site work ile factory production’ın paralel ilerleyebilmesidir. Bunun karşılığında lojistik ayrı bir engineering workstream olur.

Kontrol edilmesi gerekenler:

- module dimensions
- shipping weight
- center of gravity
- road/bridge limits
- port/rail constraints
- turning radius
- route height
- temporary road
- delivery sequence
- crane capacity/radius
- lift points
- spreader/slings
- laydown area
- weather protection
- final anchoring
- seismic/wind requirements

Schneider’in site-installation guidance’ı crane/lifting, anchoring ve seismic considerations’ın saha planının parçası olduğunu vurgular. [R15]

**Failure mode:** Module teknik olarak doğru tasarlanmış olsa bile route survey geç yapılırsa proje schedule advantage tamamen kaybolabilir.

---

# 21. Site integration interfaces — Golden interface register

Prefabricated/modular design’de en kritik engineering artefact **interface register** olmalıdır.

## Electrical

- voltage / frequency
- fault current
- protection selectivity
- earthing / bonding
- cable / busway termination
- A/B path ownership
- bypass arrangement
- metering boundary

## Mechanical

- supply/return temperature
- flow
- pressure
- water quality
- flange/connection standard
- isolation valves
- expansion
- drainage
- leak detection

## Controls / monitoring

- BACnet/IP
- Modbus TCP
- SNMP/API
- alarm naming
- time sync
- historian/DCIM data ownership
- cybersecurity boundary

## Structural / civil

- foundation
- floor loading
- anchoring
- seismic/wind
- lifting points
- maintenance clearance

## Fire / life safety

- compartment
- detection
- suppression
- emergency shutdown
- smoke control
- AHJ interface

## Network / carrier

- fiber entry
- ODF/demarcation
- diversity
- route separation
- OOB management

---

# 22. Phased deployment ve stranded capacity

Modularity’nin ekonomik avantajı çoğu zaman “ucuz kutu” olmaktan değil, capacity installation timing’ini demand’e yaklaştırabilmekten gelir.

```text
DEMAND
  │       ┌──── Phase 3
  │   ┌───┘
  │ ┌─┘ Phase 2
  ├─┘ Phase 1
  └──────────────── TIME
```

### Potansiyel avantaj

- less unused initial capacity
- faster revenue activation
- lower exposure to forecast error
- technology refresh opportunity between phases

### Potansiyel dezavantaj

Çok küçük block size:

- equipment duplication
- more valves/switches/controls
- more interfaces
- higher $/kW
- lower partial-load efficiency
- more maintenance objects

üretebilir.

**SPECBRIDGE INTERPRETATION:** Doğru module size, **forecast uncertainty ile economies of scale arasındaki optimum noktadır**; universal kW/MW sayısı yoktur.

---

# 23. Scale decision matrix — illustrative, hard threshold değildir

Aşağıdaki değerler **karar tartışmasını yapılandırmak için örnek scale bands**’dir. Standard veya evrensel seçim sınırı değildir.

| Illustrative IT scale | Strong candidates | Neden | Kritik kontrol |
|---|---|---|---|
| **50–200 kW** | Micro DC, Smart Cabinet, integrated row, conventional small room | hızlı deployment, compact integration | environment, service access, noise, heat rejection, redundancy |
| **500 kW** | Prefab power/cooling + conventional IT room; small full-prefab; hybrid | factory integration ile site flexibility dengesi | block granularity, utility, logistics, expansion tie-ins |
| **1–2 MW** | Repeated modular blocks; conventional building + prefab MEP; full-prefab | repeatability ve phasing değerli hale gelir | failure domains, plant efficiency, route/crane, commissioning |
| **5 MW** | Hybrid campus, prefab power/cooling plants, modular/standardized halls | site/civil + industrialized MEP birlikte optimize edilebilir | interface count, central vs distributed plant, lifecycle |
| **20+ MW** | Campus-scale industrialized hybrid, repeatable halls/MEP blocks | supply chain, repeatability, phased energization kritik | utility master plan, network/fiber, water/heat rejection, logistics at scale |

**DECISION GUIDANCE:** 20+ MW facility’nin “containerized olması gerekir” sonucu çıkmaz. Büyük campus’ta civil/site utility master planı baskın olabilir; modularity daha çok repeatable halls, MEP blocks ve supply-chain standardization şeklinde uygulanabilir.

---

# 24. Rack density kararı nasıl değiştirir?

Rack density arttıkça şu interface’ler büyür veya değişir:

- feeder current
- busway/RPP/PDU sizing
- cable density
- airflow volume
- containment
- cooling coil/heat exchanger capacity
- facility-water flow
- CDU capacity
- floor loading
- service clearance

Ancak rack density tek başına delivery method seçmez.

Örneğin high-density AI rack:

- conventional building içinde liquid-cooled olabilir,
- modular pod içinde olabilir,
- prefabricated IT module içinde olabilir,
- retrofit AI zone olabilir.

---

# 25. AI ve liquid cooling modularity kararını nasıl değiştirir?

ASHRAE AI Data Center framework GPU-centric clusters için legacy CPU environments’a kıyasla çok daha yüksek rack power density ve liquid-cooling/TCS gereksinimini vurgular. ASHRAE örneğinde GPU clusters sıklıkla 40–100 kW/rack bandına, purpose-built AI environments ise 50–120 kW/rack ve üzerine çıkabilen yoğunluklara bağlanır. Bunlar **selection threshold değil, contemporary engineering context**’tir. [R10]

### Modularity açısından etkiler

1. **Shorter technology cycles** → replaceable/expandable cooling blocks değer kazanır.
2. **Mixed density** → whole-room redesign yerine dedicated AI zones mümkün olur.
3. **TCS interface** → temperatures/flows/pressures/water-quality canonical hale getirilmelidir.
4. **CDU redundancy** → IT pod redundancy ile koordineli tasarlanmalıdır.
5. **Network density** → cable/optics/fabric route modül envelope’unu etkiler.
6. **Future GPUs** → module power/cooling headroom’unu hızla tüketebilir.

**Failure mode:** “AI-ready” etiketi bulunan module’un actual future rack envelope’u tanımlı değilse, birkaç hardware generation sonra stranded module oluşabilir.

---

# 26. CAPEX — prefabricated her zaman daha ucuz değildir

Schneider White Paper 163 prefabricated approach’ın traditional stick-built ile **similar cost** seviyesinde olabileceğini açıkça belirtir. [R13]

Bu nedenle CAPEX karşılaştırması şu bileşenlere ayrılmalıdır:

```text
EQUIPMENT
+ FACTORY INTEGRATION
+ TRANSPORT
+ SITE CIVIL
+ CRANE / INSTALLATION
+ FIELD CONNECTIONS
+ COMMISSIONING
+ OWNER ENGINEERING
+ CONTINGENCY
+ TIME / DELAY COST
```

### Prefabrication lehine olabilecek değer

- site labor azalması
- repeatability
- schedule compression
- parallel work
- lower rework exposure
- earlier revenue/capacity activation

### Traditional lehine olabilecek değer

- local supply-chain advantages
- lower transport cost
- bespoke space efficiency
- reuse of existing plant
- less proprietary integration

**Golden rule:** CAPEX modeli **system boundary eşitlenmeden** karşılaştırılamaz.

---

# 27. Lifecycle CAPEX ve replacement

Bir module ilk kurulumda hızlı olabilir fakat 10–20 yıl sonra:

- crane erişimi kalmış mı?
- module çıkarılabilir mi?
- replacement geometry aynı mı?
- controls backwards-compatible mı?
- manufacturer hâlâ destekliyor mu?
- spare parts available mı?
- tie-in outage gerekiyor mu?

soruları lifecycle CAPEX’i belirler.

**DECISION GUIDANCE:** Module placement planında yalnız “nasıl getireceğiz?” değil **“nasıl değiştireceğiz?”** sorusu da cevaplanmalıdır.

---

# 28. OPEX — modular etiketi enerji verimliliği garantisi değildir

OPEX’i belirleyen asıl faktörler:

- actual load profile
- UPS efficiency curve
- cooling architecture
- climate
- economization
- airflow management
- water strategy
- controls
- maintenance model
- technician travel
- spare-parts model
- partial-load operation

Modular solution iyi right-sizing ile stranded plant’i azaltabilir. Fakat çok sayıda küçük independent plant tekrarı partial-load inefficiency veya maintenance overhead yaratabilir.

**SPECBRIDGE INTERPRETATION:** “Modular = lower OPEX” yerine **“modularity OPEX’i iyileştirebilecek veya kötüleştirebilecek bir architecture variable’dır”** denmelidir.

---

# 29. Maintainability

Maintainability değerlendirmesinde yalnız component swap değil aşağıdakiler incelenmelidir:

- safe access
- hot work requirement
- lifting/removal path
- bypass
- isolation
- service clearance
- adjacent module impact
- control-system dependency
- spare module availability
- live replacement

Bir micro/Smart Cabinet solution compact olabilir; fakat service access dar ise bakım zorlaşabilir. Büyük traditional room ise daha fazla field complexity taşısa da geniş maintenance clearance sağlayabilir.

---

# 30. Vendor lock-in — risk nerede oluşur?

Vendor lock-in yalnız marka seçiminden oluşmaz. Asıl kilitlenme noktaları:

- proprietary module geometry
- proprietary busway/bus connector
- non-standard control protocol
- closed DCIM API
- unique cooling connection
- unique spare-part ecosystem
- proprietary cabinet dimensions
- custom battery/UPS module
- undocumented software dependency

## Lock-in’i azaltmak için standardize edilmesi gerekenler

- electrical interface
- mechanical interface
- control/API interface
- telemetry schema
- rack/cabinet envelope
- fiber/network demarcation
- foundation/lifting envelope
- fire interface
- commissioning test points
- lifecycle data/export

**Golden principle:**

> **Ürünü değil, interface’i standardize etmek vendor neutrality için daha değerlidir.**

---

# 31. Ne standardize edilmeli, ne site-specific kalmalı?

## Standardize edilmeye güçlü adaylar

- module naming / capacity unit
- voltage/frequency families
- protection/earthing interface requirements
- water temperature/flow/pressure interface ranges
- controls protocol
- alarm taxonomy
- DCIM data model
- rack dimensions
- fiber demarcation
- commissioning documents
- FAT/SAT templates
- spare-parts data

## Site-specific kalması gerekenler

- geotechnical
- seismic
- flood/wind
- ambient climate
- water availability
- utility capacity/fault level
- permits/AHJ
- fire/building code
- emissions/acoustics
- transport route
- crane plan
- carrier entry/diversity
- local labor/service model

ISO/IEC 22237-2’nin location/site selection, environmental risk, site configuration ve building construction başlıklarını açıkça kapsaması, site-specific engineering’in prefabrication ile ortadan kalkmadığını formal düzeyde destekler. [R2]

---

# 32. Traditional vs Prefabricated vs Modular vs Containerized — comparison matrix A

**Not:** Bu sütunlar tamamen mutually exclusive değildir. Bir çözüm aynı anda prefabricated + modular + containerized olabilir. Tablo kavramsal farkı göstermek içindir.

| Kriter | Traditional / Site-built | Prefabricated | Modular | Containerized |
|---|---|---|---|---|
| Deployment time | Genelde daha uzun | Genelde daha kısa | Phasing ile hızlanabilir | Factory-ready ise hızlı olabilir |
| Initial CAPEX | Site/custom scope’a bağlı | Traditional ile benzer de olabilir | Pay-as-grow avantajı mümkün | Transport/enclosure maliyeti önemli |
| Lifecycle CAPEX | Büyük refurbishment gerekebilir | Replaceable assemblies avantaj olabilir | Phase refresh avantajı olabilir | Obsolescence/removal planı kritik |
| OPEX | Topolojiye bağlı | Topolojiye bağlı | Right-sizing avantajı olabilir | Compact plant duplication dezavantaj olabilir |
| Site flexibility | Çok yüksek | Orta–yüksek | Module envelope’a bağlı | Enclosure/route envelope daha sınırlı |
| Customization | Çok yüksek | Orta–yüksek | Standardization ile dengelenir | Genelde daha sınırlı |
| Scalability | Master plan’a bağlı | Güçlü olabilir | Temel tasarım hedeflerinden biri | Add-container modelinde güçlü olabilir |
| Phased growth | Mümkün | Güçlü | Çok güçlü | Güçlü, site master planına bağlı |
| Commissioning | Site-heavy | Factory + site | Phase/module + site integration | Factory + transport + site |

---

# 33. Comparison matrix B — engineering/lifecycle

| Kriter | Traditional / Site-built | Prefabricated | Modular | Containerized |
|---|---|---|---|---|
| Transportation/logistics | Equipment-level | Module-level kritik | Module size’a bağlı | Çok kritik |
| Maintainability | Space/topology’ye bağlı | Factory design etkili | Replaceability tasarlanabilir | Compactness erişimi zorlaştırabilir |
| Redundancy | Serbestçe tasarlanabilir | Serbestçe tasarlanabilir | Block topology ile tasarlanabilir | Enclosure label’ından bağımsız |
| High-density support | Evet | Evet | Evet | Product envelope’a bağlı |
| Liquid-cooling readiness | Site design’e bağlı | Pre-integrated olabilir | CDU/TCS blocks için güçlü | Interface/heat rejection kritik |
| AI readiness | Power/cooling/network envelope’a bağlı | Pre-engineered option olabilir | Fast AI pod insertion için güçlü | Space/power limits incelenmeli |
| Vendor dependency | Low–medium | Medium, design’e bağlı | Medium–high olabilir | Medium–high olabilir |
| Lifecycle replacement | Site renovation | Module replacement mümkün | Design hedefi olabilir | Removal route kritik |
| Use-case fit | Bespoke campus, constrained building | Rapid/industrialized deployment | Phased/repeatable growth | Remote/edge/temporary/specific use cases |

---

# 34. Use-case decision matrix

| Use case | Traditional | Prefabricated subsystem | Modular IT/facility | Micro/Smart | Typical design logic |
|---|---:|---:|---:|---:|---|
| Branch / Edge | Medium | Medium | High | **Very High** | compact, remote, fast, environmental protection |
| Enterprise | High | High | High | Medium | often hybrid; building reuse matters |
| Colocation | High | High | High | Low–Medium | heterogenous tenants + phased capacity |
| Regional cloud | Medium–High | High | **Very High** | Low | repeatability + growth speed |
| Hyperscale | High | **Very High** | **Very High** | Low | campus + industrialized repeated blocks |
| HPC | High | High | High | Low | density/network/cooling drive decision |
| AI | High | **Very High** | **Very High** | Low–Medium | rapid high-density power/liquid cooling blocks |

“Very High” bir mandatory recommendation değildir; ilgili yöntemin güçlü aday olma potansiyelini gösterir.

---

# 35. Risk matrix

| Risk | Traditional | Prefabricated / Modular | Control |
|---|---|---|---|
| Logistics | Equipment-level | **High if large modules** | route survey, weights, crane plan |
| Factory dependency | Low–Medium | **Medium–High** | dual sourcing, QA, schedule visibility |
| Customization | High flexibility / high engineering effort | envelope constraint | configurable standard interfaces |
| Module coupling | Low | **Medium–High** | explicit interface register |
| Site infrastructure mismatch | Medium | **High impact** | source-to-load validation |
| Commissioning gap | site complexity | factory/site boundary gap | FAT + SAT + IST |
| Future density | retrofit burden | module envelope may strand | reserved power/cooling/TCS headroom |
| Obsolescence | facility modernization | proprietary module risk | lifecycle/removal plan |
| Vendor lock-in | design dependent | can increase | open interfaces/APIs |

---

# 36. Failure-mode analysis

## F1 — Factory-perfect / site-wrong
Module FAT geçer; ancak site voltage, pressure, control naming veya physical clearance uyuşmaz.

**Control:** interface register + site verification before factory release.

## F2 — Redundancy illusion
Module “2N”dir; iki path shared upstream transformer/header/controller kullanır.

**Control:** end-to-end failure-domain diagram.

## F3 — Transport surprise
Module route/bridge/crane limitine uymaz.

**Control:** route and lifting study before design freeze.

## F4 — Density obsolescence
Future GPU rack module power/cooling envelope’unu aşar.

**Control:** density roadmap + reserved electrical/TCS interfaces.

## F5 — Proprietary expansion lock
Phase 2 yalnız original vendor’ın geometry/control/bus ecosystem’iyle genişleyebilir.

**Control:** standardized physical/electrical/mechanical/API interfaces.

## F6 — Commissioning gap
Factory test kapsamı site tie-in failure’ını yakalamaz.

**Control:** FAT/SAT/IST responsibility matrix.

## F7 — Fire/code mismatch
Module iç design’i local AHJ/building/fire compartment requirement’la uyuşmaz.

**Control:** early code/AHJ review.

## F8 — Expansion outage
Phase 2 tie-in için Phase 1 shutdown gerekir.

**Control:** isolation, bypass, spare connection points, concurrent-maintainability review.

## F9 — Replacement impossible
Module teorik replaceable’dır ama crane/removal route future construction ile kapanmıştır.

**Control:** permanent lifecycle access corridor.

## F10 — OPEX fragmentation
Çok küçük duplicated power/cooling blocks low-load efficiency ve maintenance overhead yaratır.

**Control:** block-size TCO model.

## F11 — Standardized error multiplication
Yanlış bir standard interface yüzlerce module’da tekrar edilir.

**Control:** Golden prototype / first-article validation before mass replication.

## F12 — Edge environment exposure
Compact edge enclosure dust, humidity, heat veya access riskine maruz kalır.

ASHRAE TC 9.9 edge bulletin küçük edge facilities’in adverse environmental conditions nedeniyle reliability riskleri taşıdığını vurgular. [R9]

---

# 37. Decision tree — hangi delivery architecture?

```text
START
  │
  ├─ Existing live facility? ── YES ─→ BROWNFIELD / RETROFIT PATH
  │                                  │
  │                                  ├─ Tight access? → skid / small modules / site-built mix
  │                                  └─ AI density?   → dedicated liquid-ready zone + CDU/TCS
  │
  └─ New site? ──────────────→ GREENFIELD PATH
                                     │
                                     ├─ High customization/site constraints?
                                     │      └→ traditional or hybrid
                                     │
                                     ├─ Time-to-capacity critical?
                                     │      └→ prefabricated / modular candidates
                                     │
                                     ├─ Demand uncertain / phased?
                                     │      └→ repeatable capacity blocks
                                     │
                                     └─ Very large campus?
                                            └→ industrialized hybrid + repeatable MEP/halls
```

Second-level decision:

```text
SCALE
  ↓
DENSITY / COOLING
  ↓
UTILITY + SITE
  ↓
AVAILABILITY / MAINTAINABILITY
  ↓
LOGISTICS
  ↓
LIFECYCLE / LOCK-IN
  ↓
TCO + TIME-TO-CAPACITY
  ↓
DELIVERY MODEL
```

---

# 38. Architecture visual — Traditional

```text
SITE
  ↓
BUILDING / CIVIL
  ↓
MEP SYSTEMS
  ↓
WHITE SPACE
  ↓
IT

Most integration occurs at the project/site level.
```

---

# 39. Architecture visual — Prefabricated

```text
FACTORY
 ├─ POWER MODULE
 ├─ COOLING MODULE
 └─ IT MODULE
        ↓
FACTORY QA / FAT
        ↓
TRANSPORT
        ↓
SITE CONNECTIONS
        ↓
SAT / COMMISSIONING / IST
```

---

# 40. Architecture visual — Modular expansion

```text
PHASE 1          PHASE 2          PHASE 3
[ 0.5–X MW ]  → [ + BLOCK ]    → [ + BLOCK ]
     │               │                │
     └──── reserved utility / MEP / network interfaces ────┘
```

`0.5–X MW` only illustrates the concept; there is no universal block size.

---

# 41. Architecture visual — Micro DC

```text
┌────────────────────────────┐
│ MICRO / SMART INTEGRATION  │
│                            │
│  IT RACK / COMPUTE         │
│  UPS / PDU                 │
│  COOLING                   │
│  MONITORING                │
│  PHYSICAL SECURITY         │
│  OPTIONAL FIRE PROTECTION  │
└────────────────────────────┘
             ↓
      SITE / NETWORK / POWER
```

---

# 42. Architecture visual — Hybrid AI retrofit

```text
EXISTING DATA CENTER
│
├─ EXISTING AIR-COOLED ZONE
│
└─ NEW AI ZONE
    ├─ high-density rack rows
    ├─ A/B high-current distribution
    ├─ liquid-cooled servers
    └─ CDU / secondary TCS module
             ↓
       FACILITY WATER / HEAT REJECTION
```

Bu architecture, “AI geldi → tüm facility değişmeli” varsayımının gerekli olmadığını gösteren bir decision visual’dır.

---

# 43. Common conceptual mistakes

1. **Modular = container** kabul etmek.
2. **Prefabricated = micro DC** kabul etmek.
3. **Smart Cabinet = modular data center** demek.
4. **Edge = küçük cabinet** demek.
5. **Hyperscale = traditional building** demek.
6. **AI = modular olmak zorunda** demek.
7. **Factory-tested = commissioning tamam** demek.
8. **Tier-Ready = site Tier certified** demek.
9. “2N module” etiketini end-to-end failure domain doğrulamadan kabul etmek.
10. Transport route’u design freeze’den sonra incelemek.
11. Module geometry’yi standardize edip electrical/mechanical/API interfaces’i standardize etmemek.
12. Phase expansion tie-in’larını baştan tasarlamamak.
13. CAPEX comparison’da system boundary’leri eşitlememek.
14. Modularity’yi otomatik OPEX/efficiency avantajı saymak.
15. Future liquid-cooling ve power-density roadmap’ini module envelope’a dahil etmemek.

---

# 44. Design / procurement checklist

## Business and capacity

- target service/workload
- initial IT kW/MW
- ultimate IT kW/MW
- demand ramp
- revenue/time-to-capacity sensitivity
- phasing strategy

## Physical

- greenfield/brownfield/retrofit
- site dimensions
- floor loading
- expansion area
- maintenance/removal route
- crane/laydown

## Electrical

- utility capacity/date
- MV/LV topology
- A/B topology
- fault current
- redundancy
- bypass/maintenance
- reserved expansion connections

## Cooling

- rack-density distribution
- air/liquid mix
- TCS temperatures/flow
- CDU architecture
- heat rejection
- water strategy
- future density

## Availability

- Tier/Rated target if applicable
- failure domains
- concurrent maintainability
- module/site boundary
- controls dependency

## Logistics

- dimensions/weights
- road/bridge/port
- crane radius
- delivery sequence
- weather/storage

## Integration

- electrical interface spec
- mechanical interface spec
- controls/API
- DCIM/BMS
- fire/AHJ
- network/fiber

## QA

- design review
- first article
- FAT
- transport inspection
- SAT
- commissioning
- IST
- handover documentation

## Lifecycle

- spare parts
- vendor support horizon
- replacement/removal
- expansion compatibility
- API/data portability
- obsolescence strategy

---

# 45. Executive comparison — what problem does each model solve?

| Model | Asıl çözdüğü problem | Yanlış beklenti |
|---|---|---|
| Traditional | maximum site/custom design freedom | “always old/slow/inefficient” |
| Prefabricated | move integration from site to factory | “always cheaper” |
| Modular | repeatability, phasing, scalable building blocks | “means container” |
| Containerized | transportable integrated enclosure | “defines availability level” |
| Micro DC | compact localized integrated infrastructure | “all edge is micro” |
| Smart Cabinet | cabinet-level integration | “equivalent to whole modular DC” |
| Hybrid | optimize site-specific + repeatable systems together | “compromise / second-best” |

---

# 46. SpecBridge scenario guidance

## Scenario A — 100 kW branch / industrial edge

Strong candidate:

- Smart Cabinet / Micro DC
- integrated UPS/cooling/monitoring
- remote management

Focus:

- environment
- serviceability
- remote support
- physical security

## Scenario B — 500 kW enterprise expansion

Strong candidate:

- existing building + prefabricated power/cooling subsystems
- conventional or modular row white space

Focus:

- brownfield tie-in
- outage window
- floor loading
- future expansion

## Scenario C — 2 MW regional cloud

Strong candidate:

- repeated capacity block architecture
- prefab power/cooling
- standardized IT halls/pods

Focus:

- module size economics
- redundancy
- supply chain
- commissioning repeatability

## Scenario D — 5 MW colocation

Strong candidate:

- hybrid building/civil
- repeatable MEP blocks
- flexible tenant white space

Focus:

- heterogenous rack density
- metering
- carrier/interconnection
- phased customer demand

## Scenario E — 20+ MW hyperscale / AI campus

Strong candidate:

- campus master plan
- industrialized hybrid
- repeated electrical/cooling/white-space blocks
- dedicated high-density liquid-ready AI zones

Focus:

- utility energization phases
- supply-chain repeatability
- TCS/liquid cooling
- network/fiber scale
- lifecycle technology change

---

# 47. Research conclusions

### Conclusion 1

**Modularity is an architecture principle, not a box.**

### Conclusion 2

The correct taxonomy is multi-axis; physical form, delivery method and workload type must not be collapsed into one list.

### Conclusion 3

**Modular ≠ containerized; prefabricated ≠ micro; Smart Cabinet ≠ modular data center.**

### Conclusion 4

Tier/TIA availability targets can coexist with modular/prefabricated architecture. Certification still applies to the defined solution/site and cannot be inferred from product marketing. [R4][R6][R7][R8]

### Conclusion 5

Factory integration shifts risk; it does not eliminate site engineering or commissioning.

### Conclusion 6

The strongest economic argument for modularity is often **time-to-capacity + phasing + repeatability**, not an automatic equipment-cost discount.

### Conclusion 7

AI/liquid cooling strengthens the value of well-defined replaceable power/cooling blocks, but AI does not mandate one physical delivery form.

### Conclusion 8

Vendor neutrality is best protected by open, documented **interfaces**, not by avoiding all prefabrication.

### Conclusion 9

For many multi-MW projects, the most robust answer is neither “all traditional” nor “all modular” but an **industrialized hybrid** architecture.

---

# 48. Full Briefing research handoff — proposed chapter structure

Research is now sufficiently structured to support a chaptered Full Briefing, but no TTS should be generated until narration text passes content QA.

Suggested chapters:

| Chapter | Title | Purpose |
|---|---|---|
| K02-00 | “Modüler veri merkezi” aslında ne demektir? | canonical taxonomy + misconceptions |
| K02-01 | Greenfield, brownfield, retrofit ve traditional construction | project-condition baseline |
| K02-02 | Prefabricated, modular ve containerized mimariler | delivery/form distinctions |
| K02-03 | Micro DC, Smart Cabinet ve Edge | compact/edge architectures |
| K02-04 | Scale, phasing, CAPEX ve stranded capacity | economics + growth |
| K02-05 | Tier, redundancy, commissioning ve failure domains | resilience + QA |
| K02-06 | AI, high density ve liquid cooling | future density / TCS |
| K02-07 | Logistics, lock-in ve hangi mimari hangi senaryo? | decision framework |

Existing S3F Quick Brief remains the short explanation and must not be replaced by this Full Briefing.

---

# 49. Authoritative source register

## Formal standards / certification authorities

### [R1] ISO/IEC 22237-1:2021 — Data centre facilities and infrastructures — General concepts
**Class:** FORMAL STANDARD  
**Supports:** size/complexity, availability/security/energy-efficiency over planned lifetime, business risk and operating-cost analysis.  
https://www.iso.org/standard/78550.html

### [R2] ISO/IEC 22237-2:2024 — Building construction
**Class:** FORMAL STANDARD  
**Supports:** location/site selection, environmental risks, site/building configuration and physical protection.  
https://www.iso.org/standard/82248.html

### [R3] TIA-942-C — Telecommunications Infrastructure Standard for Data Centers
**Class:** FORMAL INDUSTRY STANDARD  
**Supports:** standard scope across single/multi-tenant and any-size data centers; telecom, power, cooling, architecture, fire, safety and physical-security domains.  
https://tiaonline.org/standard/tia-942/

### [R4] TIA-942 Certifications & Ratings
**Class:** CERTIFICATION AUTHORITY  
**Supports:** Rated-3 concurrently maintainable definition; TIA-942 Ready certification for modular data-center designs.  
https://tiaonline.org/products-and-services/tia942certification/tia-942-certifications-ratings/

### [R5] Uptime Institute — Tier Classification System
**Class:** CERTIFICATION AUTHORITY  
**Supports:** performance/resilience classification must align to business requirements rather than construction form.  
https://uptimeinstitute.com/tiers

### [R6] Uptime Institute — Tier-Ready Prefabricated and Modular Data Centers
**Class:** CERTIFICATION AUTHORITY  
**Supports:** manufacturer-level pre-validation of prefab/modular solution design against Tier principles.  
https://connect.uptimeinstitute.com/tier-certification/tier-ready

### [R7] Uptime Institute — Tier-Ready Terms and Limitations
**Class:** CERTIFICATION AUTHORITY  
**Supports:** Tier-Ready applies to the specific reviewed prefab/pre-designed solution and has defined validity limitations.  
https://uptimeinstitute.com/tier-ready-terms

### [R8] Uptime Institute — DXN client story
**Class:** AUTHORITY / IMPLEMENTATION EVIDENCE  
**Supports:** real example of Tier III Certification of Constructed Facility using a Tier-Ready prefabricated/modular solution.  
https://connect.uptimeinstitute.com/clients/dxn

## Engineering / open-industry guidance

### [R9] ASHRAE TC 9.9 — Edge Computing: Considerations for Reliable Operation
**Class:** ENGINEERING GUIDANCE  
**Supports:** edge is not a single enclosure size; small edge facilities face environmental/reliability risks and can take several physical forms.  
https://www.ashrae.org/about/news/2020/ashrae-technical-committee-release-technical-bulletin-on-edge-computing-design-and-operation

### [R10] ASHRAE — AI Data Center Energy Performance Framework: Energy and Thermal Efficiency
**Class:** ENGINEERING GUIDANCE  
**Supports:** contemporary AI rack-density context, liquid cooling/TCS, thermal segmentation and lifecycle performance. Numeric densities are context, not modular-selection thresholds.  
https://www.ashrae.org/technical-resources/ai-data-center-framework/energy-and-thermal-efficiency

### [R11] Open Compute Project — Modular Data Center Sub-Project
**Class:** OPEN ENGINEERING GUIDANCE  
**Supports:** modular solutions span power, cooling, IT and all-in-one modules; modularity is broader than containerization.  
https://www.opencompute.org/community/modular-data-center

### [R12] Open Compute Project — Data Center Facility Project
**Class:** OPEN ENGINEERING GUIDANCE  
**Supports:** modular/scalable facility design, power/cooling and operations focus.  
https://www.opencompute.org/community/data-center-facility

## Vendor engineering / implementation evidence

### [R13] Schneider Electric — White Paper 163 V4 (2026), Benefits and Drawbacks of Prefabricated Modules for Data Centers
**Class:** VENDOR ENGINEERING GUIDANCE  
**Supports:** standardized/preassembled/integrated modules; customized construction → standardized site integration; faster/more predictable deployment; cost can be similar to stick-built.  
**Boundary:** vendor-authored; not a universal cost/schedule rule.  
https://www.se.com/us/en/download/document/SPD_WTOL-7NGRBS_EN/

### [R14] Schneider Electric — Prefabricated Data Center Considerations: Site Prep
**Class:** VENDOR ENGINEERING GUIDANCE  
**Supports:** permits, site preparation and field connections remain required in prefabricated deployments.  
https://blog.se.com/datacenter/2014/09/24/prefabricated-data-center-considerations-part-2-site-prep/

### [R15] Schneider Electric — Prefabricated Data Center Considerations: Site Installation
**Class:** VENDOR ENGINEERING GUIDANCE  
**Supports:** crane/lifting, anchoring, layout and seismic/site-installation considerations.  
https://blog.se.com/datacenter/architecture/2014/10/09/prefabricated-data-center-considerations-part-4-site-installation/

### [R16] Vertiv — Prefabricated Data Center
**Class:** VENDOR IMPLEMENTATION EVIDENCE  
**Supports:** pre-assembly, integration, factory test and parallel factory/site work as prefabricated implementation patterns.  
**Boundary:** performance/cost claims remain vendor claims.  
https://www.vertiv.com/en-us/products-catalog/facilities-enclosures-and-racks/integrated-solutions/turnkey-data-centers-/

### [R17] Vertiv — MegaMod Prefabricated Modular Data Center
**Class:** VENDOR PRODUCT EXAMPLE  
**Supports:** example of full-prefab modular capacity in 0.5/1 MW building blocks.  
**Boundary:** these capacities are product-specific, not industry thresholds.  
https://www.vertiv.com/en-us/products-catalog/facilities-enclosures-and-racks/integrated-solutions/vertiv-megamod/

### [R18] Eaton — Modular Data Center Systems
**Class:** VENDOR ENGINEERING / PRODUCT EVIDENCE  
**Supports:** distinction among modular enclosures, skids and micro-modular systems; factory-tested standardized modules.  
https://www.eaton.com/us/en-us/markets/data-centers/benefits-of-modular/modular-data-center-systems.html

### [R19] Eaton — Modular Power Assembly / Compact UPS Skids
**Class:** VENDOR PRODUCT EXAMPLE  
**Supports:** off-site assembled/prewired/tested electrical skid approach, including retrofit use.  
https://www.eaton.com/us/en-us/catalog/low-voltage-power-distribution-controls-systems/modular-power-assembly.html

### [R20] Huawei — Smart Modular Data Center / FusionModule family
**Class:** VENDOR PRODUCT EXAMPLE  
**Supports:** Smart Cabinet/single-row integration of UPS, PDU, cooling, monitoring and rack infrastructure.  
**Boundary:** demonstrates product-level integration; does not define the universal meaning of modular data center.  
https://digitalpower.huawei.com/my/data-center-facility/product_solution/dce_medium_data_center/detail/926.html

### [R21] Rittal — RiMatrix Micro Data Center
**Class:** VENDOR PRODUCT EXAMPLE  
**Supports:** micro data center as a bundled enclosure/power/climate/monitoring/security architecture for edge and localized deployments.  
https://www.rittal.com/us-en_US/Solutions/IT-Infrastructure-Product-Solutions/RiMatrix-Micro-Data-Center

---

# 50. Research freeze boundary for the next gate

The Golden research position for DC-K02 is now:

```text
PROJECT CONDITION
+ DELIVERY METHOD
+ PHYSICAL FORM
+ MISSION / WORKLOAD
+ GROWTH MODEL
       ↓
SITE + SCALE + DENSITY + AVAILABILITY + LOGISTICS + LIFECYCLE
       ↓
DELIVERY ARCHITECTURE
```

Before audio production:

1. Run evidence/source QA against the [R1]–[R21] register.
2. Confirm no vendor claim is presented as a universal standard.
3. Convert the eight-chapter outline into controlled Turkish Full Narration.
4. Preserve the existing Quick Brief as a separate mode.
5. Only then generate chaptered S3F audio and run transcript/tail QA.

No audio regeneration is authorized by this research commit itself.