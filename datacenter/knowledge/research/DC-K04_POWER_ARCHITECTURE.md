# DC-K04 — Data Center Power Architecture — Golden Deep Research

**Status:** GOLDEN DEEP RESEARCH CANDIDATE  
**Language:** TR  
**Program:** SpecBridge Data Center Knowledge Library  
**Research date:** 2026-09-02  
**Scope:** Utility / grid interface → MV → transformer → LV → transfer → generator → UPS / stored energy → downstream distribution → rack power → IT PSU; failure domains, protection, controls, monitoring, commissioning, lifecycle and AI/high-density interfaces.

---

## 0. Executive conclusion

Bir veri merkezinde güç mimarisi, UPS ve jeneratör adetlerinin toplamı değildir. Gerçek sistem; enerji kaynağından IT power supply unit'e kadar uzanan **topology + failure domains + protection + transfer logic + controls + stored energy + maintainability + monitoring + operating procedures** bütünüdür.

Canonical chain:

`UTILITY / GRID → MV SWITCHGEAR → TRANSFORMER → LV SWITCHGEAR → TRANSFER / GENERATION DOMAIN → UPS / STORED ENERGY → PDU / RPP / BUSWAY → RACK POWER → IT PSU`

Her projede ayrıca mechanical power, fire/life-safety loads, controls, auxiliaries ve black-start dependency'leri ayrı load classes olarak değerlendirilir.

Golden sonuç:

- **COMPONENT REDUNDANCY ≠ PATH REDUNDANCY**
- **PATH REDUNDANCY ≠ CONCURRENT MAINTAINABILITY**
- **CONCURRENT MAINTAINABILITY ≠ FAULT TOLERANCE**
- **N+1 UPS ≠ TIER III / RATED-3**
- **A/B LABEL ≠ A/B INDEPENDENCE**
- **STATIC BYPASS ≠ MAINTENANCE BYPASS ≠ SECOND INDEPENDENT POWER PATH**
- **UPS BATTERY ≠ GRID-INTERACTIVE BESS**
- **NAMEPLATE MW ≠ RESILIENT USABLE MW**
- **POWER QUALITY MONITORING ≠ COMMERCIAL BILLING METERING**

Bir güç mimarisinin doğruluğu, yalnız normal durumda enerji taşımasıyla değil; **bakım, fault, transfer, black-start, degraded mode ve recovery** sırasında kritik yükün nasıl davrandığıyla kanıtlanır.

---

## 1. Evidence-language contract

Bu modülde her iddia aşağıdaki sınıflardan biriyle okunmalıdır:

- **FACT:** Standardın, resmi kurumun veya açık teknik dokümanın doğrudan desteklediği bilgi.
- **ENGINEERING GUIDANCE:** Standart veya mühendislik pratiğinden türeyen, proje bağlamı gerektiren uygulama rehberi.
- **VENDOR CLAIM:** Bir üretici veya çözüm sağlayıcının kendi ürün/teknolojisi hakkında yayımladığı iddia.
- **SPECBRIDGE INTERPRETATION:** Birden çok kaynağın birlikte okunmasından çıkarılan vendor-neutral yorum.
- **DECISION GUIDANCE:** Proje kararı vermeyi kolaylaştıran, ancak evrensel code requirement olmayan öneri.

Bir vendor white paper'daki topology veya efficiency bilgisi standard gereksinimi değildir. Aynı şekilde Tier/TIA sınıflandırması da tek bir UPS topolojisine indirgenemez.

## 2. Standards hierarchy and boundary

K04 dört ayrı standard alanını birlikte okur:

1. **Data-center facility standards:** ISO/IEC 22237, TIA-942-C, Uptime Tier.
2. **Electrical installation and equipment standards:** IEC 60364, IEC 61439, IEC 60947, IEC 62040, IEC 62271, IEC 60076, IEC 61643.
3. **Measurement / power quality / stored-energy standards:** IEC 61000-4-30, IEC 61557-12, IEC 62485, IEC 62619, IEC 62933.
4. **Jurisdiction-specific codes and practices:** örneğin NFPA/NEC ailesi, local utility requirements, fire code, environmental permits ve Türkiye'deki ilgili mevzuat/proje şartları.

**FACT:** ISO/IEC 22237-3 veri merkezindeki power supply/distribution, telecommunications bonding, lightning protection ve power/power-quality measurement integration konularını kapsar; safety ve EMC'yi başka standartlara bırakır. Ayrıca data-center stored energy'nin grid'i desteklemek için kullanımı bu standardın kapsamı dışındadır.

## 3. Canonical power-domain taxonomy

K04 power architecture'ı sekiz katmanda sınıflandırır:

1. **SOURCE DOMAIN:** Utility, alternate utility, on-site generation, grid-interactive source.
2. **MV DOMAIN:** Incoming switchgear, sectionalization, protection, metering.
3. **TRANSFORMATION DOMAIN:** Transformers and associated protection/isolation.
4. **LV / TRANSFER DOMAIN:** Main switchboards, bus sections, ATS/TSE, paralleling.
5. **CONTINUITY DOMAIN:** UPS, batteries, flywheel or other stored energy.
6. **DISTRIBUTION DOMAIN:** PDU, RPP, busway, panelboards, STS where applicable.
7. **RACK DOMAIN:** rPDU, rack busbar, power shelf / DC busbar, IT PSU.
8. **CONTROL / OBSERVABILITY DOMAIN:** Protection relays, controls, EPMS, BMS/DCIM integration, event logs and operating procedures.

## 4. Failure-domain taxonomy

A failure domain, aynı arıza veya operasyonel hata tarafından birlikte etkilenebilen ekipman ve path kümesidir. Failure domain yalnız equipment boundary değildir.

Başlıca domain türleri:

- electrical bus section;
- transformer;
- UPS module/block;
- bypass source;
- transfer system;
- generator/paralleling bus;
- battery string/BMS;
- busway run;
- fire compartment;
- room / flood zone;
- cable route;
- controls/PLC/network;
- maintenance procedure;
- operator action;
- common fuel system;
- common cooling/ventilation dependency for electrical rooms.

## 5. Capacity redundancy vs path redundancy

**Component redundancy**, gerekli capacity'ye ek module/unit koymaktır. N+1 tipik örnektir.

**Path redundancy**, kritik yüke alternatif fiziksel/elektriksel distribution path sağlamaktır.

Bir sistem N+1 UPS modüllerine sahip olabilir fakat tek downstream switchboard veya tek busway nedeniyle path redundancy'si olmayabilir. Bu yüzden capacity redundancy tek başına availability class ispatı değildir.

## 6. Concurrent maintainability

Concurrent maintainability, planlı bakım için bir capacity component veya distribution-path elemanının hizmet dışına alınması sırasında kritik ICT hizmetinin devam edebilmesidir.

**FACT:** TIA Rated-3 ve Uptime Tier III, redundant capacity component kavramını multiple/redundant distribution paths ve planned maintenance continuity ile birlikte ele alır.

**SPECBRIDGE INTERPRETATION:** “N+1 UPS var” ifadesi ancak UPS capacity layer hakkında bilgi verir; Tier III / Rated-3 sonucuna tek başına götürmez.

## 7. Fault tolerance

Fault tolerance, planned maintenance'dan daha ileri bir koşuldur. Tek bir beklenmedik fault'ın kritik hizmeti kesmemesi için independent/isolated architecture ve operating state gerekir.

**FACT:** TIA Rated-4 ve Uptime Tier IV, concurrent maintainability'nin üzerine single-fault tolerance / physical isolation prensipleri ekler.

## 8. End-to-end power chain

Canonical example:

```text
GRID / UTILITY
      │
      ▼
MV INTAKE / SWITCHGEAR
      │
      ▼
TRANSFORMER(S)
      │
      ▼
LV MAIN SWITCHGEAR ───── GENERATOR / PARALLELING DOMAIN
      │                         │
      └──────── TRANSFER / CONTROL ───────┘
                    │
                    ▼
                  UPS
                    │
                    ▼
          PDU / RPP / BUSWAY
                    │
                    ▼
               RACK PDU A/B
                    │
                    ▼
              IT PSU A/B
```

Her blok “ürün” değil, bir interface ve failure-domain boundary olarak incelenmelidir.

## 9. Utility / grid interface

Utility interface için minimum veri seti:

- contracted / available MVA and MW;
- service voltage;
- fault level / short-circuit contribution;
- feeder count and physical route;
- utility substation architecture;
- protection and metering boundary;
- energization schedule;
- planned outage regime;
- power-quality history where available;
- expansion commitment;
- curtailment / demand-response terms if relevant;
- regulatory and grid-code obligations.

“İki feeder” ifadesi fiziksel olarak independent utility path anlamına gelmeyebilir. Aynı upstream substation, transformer, protection scheme veya route common-mode yaratabilir.

## 10. Utility capacity is not IT capacity

Utility connection, IT load dışındaki yükleri de taşır:

- cooling plant;
- pumps/fans/CDUs;
- electrical losses;
- lighting and general services;
- security/NOC;
- battery charging;
- fuel-system auxiliaries;
- fire/life-safety loads;
- future reserve.

**DECISION GUIDANCE:** `IT MW` ile `utility MW` aynı hücrede yönetilmemelidir. Power model en az `critical IT`, `critical mechanical`, `non-critical facility`, `losses`, `reserve` sınıflarını ayırmalıdır.

## 11. Medium-voltage architecture

MV layer site ölçeğine göre radial, ring, sectionalized, dual-ended veya daha kompleks topolojiler içerebilir. Karar kriterleri:

- utility topology;
- fault current;
- isolation granularity;
- transformer block size;
- maintenance access;
- expansion phasing;
- protection/selectivity;
- arc-flash and personnel safety requirements;
- physical separation.

**FACT:** IEC 62271-200 metal-enclosed AC switchgear için >1 kV–52 kV sınıfını kapsayan temel product standard ailesidir.

## 12. Transformer architecture

Transformer design yalnız kVA/MVA seçimi değildir:

- ratio and vector group;
- impedance;
- efficiency/losses;
- inrush;
- fault contribution;
- harmonics/derating;
- cooling class;
- fire strategy;
- dry/oil technology;
- redundancy/block size;
- physical access and replacement path;
- parallel operation assumptions;
- grounding/neutral arrangement.

Transformer impedance short-circuit level ve downstream protection behavior üzerinde belirleyicidir.

## 13. Low-voltage switchgear and assemblies

LV switchgear power blocks'un dağıtım ve protection merkezidir.

**FACT:** IEC 61439-1:2020 LV assemblies için service conditions, construction, technical characteristics ve verification requirements tanımlar; UPS gibi power-electronic products kendi product standardlarına göre test edilir ancak assembly içine entegrasyonu IEC 61439 çerçevesiyle ele alınır.

Kritik kararlar:

- main-tie-main / sectionalization;
- bus rating;
- short-time withstand;
- breaker frame/trip units;
- spare ways;
- future section extension;
- form of separation;
- maintainability;
- arc-energy strategy;
- metering and controls.

## 14. Transfer switching architecture

Transfer system, source değişimini yöneten kritik continuity layer'dır.

**FACT:** IEC 60947-6-1:2026, manual/remote/automatic transfer switching equipment yanında bypass/isolation TSE, closed-transition ATSE ve stand-alone ATS controller kapsamlarını da açıkça ele alır.

Transfer kararları:

- open transition vs closed transition where permitted;
- source qualification windows;
- return-to-normal delay;
- generator warm-up/cool-down;
- neutral switching;
- sync-check;
- interlocks;
- bypass/isolation capability;
- manual fallback;
- controller power source;
- fail-safe state.

## 15. Transfer logic is a failure domain

ATS/TSE controller, sensing wiring, PLC network veya common DC control power kaynağı iki physical power path'i aynı anda etkileyebilir.

**SPECBRIDGE INTERPRETATION:** Independent copper path + shared controller = fully independent A/B architecture değildir.

## 16. Generator role

Generator long-duration utility-loss continuity için on-site source olabilir. Generator architecture'da minimum:

- rating/classification;
- ambient/altitude derating;
- step-load/transient response;
- starting sequence;
- engine auxiliaries;
- paralleling;
- synchronization;
- black-start capability;
- fuel autonomy;
- day tank/bulk storage;
- fuel quality/polishing;
- emissions/noise;
- maintenance isolation;
- cooling/ventilation;
- load-bank testing.

**FACT:** ISO 8528-1:2018 halen current published edition'dır ve 2023'te confirm edilmiştir; Edition 4 draft aşamasındadır ve current standard yerine kullanılmamalıdır.

## 17. Generator rating and block sizing

Generator nameplate, usable data-center capacity değildir. Aşağıdakiler hesaba katılır:

- site conditions;
- nonlinear loads;
- UPS input behavior;
- motor starts;
- cooling plant restart;
- staged load acceptance;
- redundancy state;
- maintenance state;
- fuel-system common modes.

AI campus'ta “MW büyüdü, generator MW da aynı oranda büyüt” yaklaşımı transient ve phasing açısından yeterli değildir.

## 18. Generator paralleling bus

Parallel generator plant ölçek avantajı sağlar fakat common paralleling switchgear/control katmanı yeni failure domain yaratabilir.

Kontrol edilecekler:

- N / N+1 generator count;
- bus section/tie;
- masterless vs centralized controls;
- sync-check;
- load share;
- failure-to-start handling;
- breaker fail logic;
- maintenance bypass;
- black-start sequence;
- degraded-mode procedures.

## 19. Fuel architecture

Fuel bir energy-storage subsystem'dir ve availability chain'e dahildir.

Failure modes:

- contaminated fuel;
- common bulk tank;
- transfer pump failure;
- day-tank control failure;
- blocked filters;
- insufficient delivery contract;
- fire/environmental isolation;
- operator error;
- autonomy assumption mismatch.

Fuel autonomy için universal saat sayısı verilmemelidir; business risk, jurisdiction, replenishment logistics ve outage scenario belirler.

## 20. Black-start sequence

Black-start, tamamen enerjisiz veya utility-independent başlangıç senaryosudur. Sequence tipik olarak:

1. DC controls / starter systems available.
2. Generator start and stabilize.
3. Essential electrical auxiliaries energize.
4. UPS/bypass path qualifies source.
5. Critical cooling/TCS loads energize.
6. IT load restored or maintained according to design.
7. Noncritical loads staged later.

Bu sequence commissioning'de gerçek interlock ve timing ile doğrulanmalıdır.

## 21. UPS primary function

**FACT:** IEC 62040-3:2021 UPS'in primary function'ını load power continuity sağlamak olarak tanımlar ve complete UPS için performance/test requirements verir.

UPS görevleri:

- ride-through;
- power conditioning;
- source isolation characteristics;
- stored-energy interface;
- controlled transfer/bypass behavior;
- monitoring and alarms.

UPS, upstream protection veya poor grounding tasarımının yerine geçmez.

## 22. Online double-conversion

Online double-conversion'da kritik yük inverter path üzerinden beslenir; utility disturbances'ın load'a taşınma şekli topology ve operating mode'a bağlıdır.

**VENDOR GUIDANCE:** Major UPS vendors double-conversion'ı high-criticality data-center loads için yaygın reference topology olarak ele alır.

Kritik inceleme:

- efficiency curve;
- overload behavior;
- static bypass source;
- battery path;
- fault clearing contribution;
- maintenance bypass;
- parallel module controls;
- generator compatibility.

## 23. ECO and high-efficiency modes

ECO veya high-efficiency modes conversion losses'i azaltabilir. Fakat efficiency tek karar kriteri değildir.

Değerlendirme:

- load exposure to input quality;
- transfer time/behavior;
- transfer thresholds;
- bypass-source quality;
- generator operation;
- harmonics;
- mode-change controls;
- operational policy.

**VENDOR CLAIM:** Bazı üreticiler belirli high-efficiency modes için ~99% sınıfında efficiency değerleri yayımlar. Bu değerler product/mode specific'tir; universal availability veya efficiency assumption değildir.

## 24. Static bypass

Static bypass, inverter overload/fault veya belirli modes sırasında alternate internal path sağlayabilir.

Yanlış çıkarım: “bypass var, dolayısıyla 2N.”

Static bypass için ayrı inceleme gerekir:

- bypass source independence;
- bypass breaker;
- synchronization;
- fault current;
- maintenance isolation;
- control logic;
- common upstream/downstream bus.

## 25. Maintenance bypass

Maintenance bypass, UPS'i planned maintenance için isolate etmeye yarar. Manual sequence ve interlock design critical'dır.

Failure risks:

- wrong breaker sequence;
- paralleling unlike sources;
- unintended break-before-make;
- bypass source unavailable;
- mislabeled path;
- procedural drift.

MOP + training + labeling + mimic diagram, hardware kadar önemlidir.

## 26. UPS topology taxonomy

### N
Gerekli capacity kadar UPS; redundancy yok.

### N+1
Capacity requirement'a en az bir additional module/unit. Component redundancy sağlar.

### Isolated redundant
Primary UPS yanında secondary path belirli failure scenarios için destek sağlar; topology-specific analysis gerekir.

### Distributed redundant
Birden çok UPS ve distribution path farklı load groups'u cross-support eder. CAPEX/efficiency avantajı olabilir; control/protection complexity yükselir.

### 2N
İki full-capacity independent chain hedeflenir. Common components minimize edilmelidir.

### 2(N+1) / system-plus-system with reserve
Her full-capacity path kendi internal capacity redundancy'sine sahip olabilir. Çok yüksek resiliency, CAPEX ve operational complexity getirir.

## 27. Power topology comparison matrix

| Topology | Capacity redundancy | Path redundancy | Planned maintenance potential | Common-mode sensitivity | CAPEX/OPEX tendency | Typical fit |
|---|---|---|---|---|---|---|
| N | No | Usually no | Low | High | Lowest | Low-criticality / edge with other mitigation |
| N+1 | Yes | Not necessarily | Component-level | Shared path remains | Low/Medium | Enterprise capacity resilience |
| Distributed redundant | Yes | Partial/multiple | High if engineered correctly | Controls/ties require analysis | Medium/High | Large colo/cloud |
| 2N | Full duplicate | Yes | High | Physical/control common points must be removed | High | High-criticality enterprise/colo |
| 2(N+1) | Full duplicate + reserve | Yes | Very high | Complexity itself becomes risk | Very high | Selected extreme-criticality / large AI blocks |

**DECISION GUIDANCE:** Bu tablo availability certification değildir; topology pre-screening aracıdır.

## 28. UPS architecture / mode decision matrix

| Requirement | Double-conversion | High-efficiency/ECO | Modular UPS | Large monolithic UPS |
|---|---|---|---|---|
| Power conditioning priority | Strong | Input-quality dependent | Strong if online topology | Strong if online topology |
| Incremental growth | Good | Good | Very strong | Weaker granularity |
| Maintenance granularity | Module-dependent | Mode-dependent | Strong | Plant/topology dependent |
| Generator integration | Validate | Extra mode validation | Validate per module/system | Validate system transient |
| Very large blocks | Scalable by topology | Product-specific | Module count/controls matter | Strong block economics possible |
| Failure-domain simplicity | Medium | More mode states | More modules/controls | Fewer units but larger blast radius |

## 29. Stored energy taxonomy

Stored energy has different missions:

1. **UPS ride-through:** milliseconds/minutes class continuity until alternate source qualifies or controlled shutdown.
2. **Generator start support:** bridge starting/transfer/transient interval.
3. **Longer critical-load autonomy:** project-specific extended battery runtime.
4. **Grid-interactive BESS:** demand flexibility, peak shaving, market services, renewable integration or resilience augmentation.
5. **Rack-level BBU:** rack/power-shelf ecosystem continuity.

Bu görevler aynı battery chemistry'yi kullanabilir ama aynı architecture değildir.

## 30. VRLA

VRLA mature UPS technology'dir. Engineering points:

- string topology;
- age/temperature sensitivity;
- replacement cycle;
- impedance monitoring;
- ventilation;
- room environment;
- failure isolation;
- maintenance access;
- footprint/weight.

## 31. Lithium-ion UPS batteries

Li-ion daha yüksek energy density ve daha küçük footprint sağlayabilir. Ancak karar:

- chemistry;
- cell/module safety;
- BMS architecture;
- propagation mitigation;
- monitoring;
- ventilation/fire strategy;
- replacement ecosystem;
- vendor lifecycle;
- transport/disposal;
- temperature range

ile birlikte verilmelidir.

**FACT:** IEC 62619:2022 industrial lithium batteries için stationary applications içine UPS ve electrical energy storage systems'i açıkça dahil eder.

## 32. Flywheel

Flywheel, kısa ride-through ve yüksek cycle capability gereken applications'da alternatif olabilir. Avantaj/dezavantaj:

- short duration;
- high cycle capability;
- mechanical system;
- footprint;
- maintenance;
- generator reliability dependency.

## 33. Grid-interactive BESS

Grid BESS, UPS battery'nin genişletilmiş adı değildir.

**FACT:** ISO/IEC 22237-3, data-center stored energy veya alternate source'un grid'i desteklemek için kullanılmasını kendi scope'u dışında bırakır.

**FACT:** IEC 62933 family grid-integrated electrical energy storage için ayrı safety/system framework sağlar; IEC 62933-5-4:2026 lithium-ion battery-based grid BESS için safety test methods/procedures yayımlar.

## 34. UPS battery vs BESS matrix

| Attribute | UPS battery | Grid-interactive BESS |
|---|---|---|
| Primary mission | Critical-load continuity | Grid / energy-management service + optional resilience |
| Dispatch | Event-driven by power path | Scheduled/optimized/grid-driven possible |
| Cycling profile | Usually lower frequency | Potentially frequent |
| Control authority | UPS/control system | EMS/grid/market interfaces possible |
| Availability implication | Direct critical path | Must not compromise critical path |
| Standards emphasis | UPS + stationary battery safety | EES/BESS system and grid integration |
| Golden rule | Preserve critical load first | Grid service must never silently consume resilience margin |

## 35. Battery autonomy

Universal “5/10/15 minute” prescription doğru değildir. Runtime şu zincire göre belirlenir:

`DETECTION → GENERATOR START → SOURCE QUALIFICATION → TRANSFER → MECHANICAL RECOVERY → IT STABILITY + MARGIN`

Ayrıca generator failure-to-start, restart attempts, degraded operation, controlled shutdown ve refueling scenarios incelenir.

## 36. Downstream distribution taxonomy

### Traditional PDU
Large distribution cabinet, sometimes transformation/isolation and branch distribution.

### RPP
Remote branch circuit panel near IT rows.

### Panelboard / floor distribution
Project-specific branch distribution.

### Busway / busbar trunking
Overhead/underfloor bus with tap-off units.

### Rack-level power shelf / busbar
OCP/rack-scale architecture where AC is converted and distributed as DC within rack ecosystem.

## 37. PDU / RPP

Strengths:

- mature architecture;
- clear branch protection;
- suitable for stable layouts;
- broad vendor familiarity.

Watchpoints:

- cable volume;
- fixed branch granularity;
- moves/adds/changes labor;
- underfloor congestion;
- spare circuit management;
- transformer heat/loss if present;
- panel access/arc boundary.

## 38. Busway

Busway can reduce branch cable congestion and enable flexible tap-offs.

Engineering requirements:

- rated current;
- short-circuit withstand;
- tap-off protection;
- phase balancing;
- hot-plug policy if product allows;
- mechanical support;
- overhead coordination;
- fire/smoke implications;
- spare capacity;
- vendor lifecycle/interoperability;
- EPMS integration.

Busway “daha modern” olduğu için değil, deployment/lifecycle modeline uyduğu için seçilir.

## 39. PDU/RPP vs busway vs rack-DC matrix

| Criterion | PDU/RPP | Busway | Rack-level DC / power shelf |
|---|---|---|---|
| Mixed 19-inch enterprise IT | Excellent | Excellent | Ecosystem-dependent |
| Frequent moves/adds/changes | Medium | Strong | Platform-dependent |
| High rack count | Cable-heavy | Strong | Strong in compatible ecosystems |
| Dynamic colo | Medium | Strong | Tenant compatibility may limit |
| OCP / rack-scale | Possible upstream | Possible upstream | Core ecosystem feature |
| AI high density | Circuit size grows rapidly | Strong with correct tap-off/bus sizing | Strong where rack platform designed for it |
| Vendor neutrality | High | Medium/High | Lower; interface ecosystem matters |
| Protection familiarity | High | High with design | DC fault/protection specialist design needed |

## 40. AC vs rack-level DC

Traditional enterprise path often ends in AC rPDU + server PSU conversion. OCP-like systems can use rack power shelves and ~48/50 VDC busbars.

**FACT:** OCP ORv3 specifications and approved products demonstrate 48/50 V-class rack power shelves and BBUs.

**VENDOR/PLATFORM EXAMPLES:** 18 kW, 21.6 kW and 33 kW power shelves exist in OCP marketplace; these are product examples, not design thresholds.

## 41. Higher-voltage AI distribution

AI rack power growth makes current, copper mass, voltage drop, connector density and heat increasingly important.

**ENGINEERING GUIDANCE:** Current ASHRAE AI framework discusses movement toward higher-voltage rack distribution, including 800 VDC concepts, as an emerging response to very high rack power. This is guidance, not a mandatory code requirement.

**DECISION GUIDANCE:** Do not select higher-voltage DC only from efficiency headline. Protection, isolation, safe maintenance, ecosystem compatibility, conversion stages and replacement lifecycle must be designed together.

## 42. Rack power envelope

For every rack class record:

- nominal/maximum kW;
- voltage;
- phase;
- current per feed;
- connector/receptacle;
- A/B or busbar topology;
- PSU/power-shelf redundancy;
- power factor/harmonics;
- transient/slew behavior where known;
- monitoring granularity;
- physical PDU/busbar location;
- residual capacity;
- service isolation.

## 43. AI/high-density context

**ENGINEERING GUIDANCE:** ASHRAE's current AI framework reports contemporary GPU clusters often in the 40–100 kW/rack range and purpose-built AI racks commonly 50–120+ kW/rack, with higher values emerging. These are context figures, not universal thresholds.

Consequences:

- higher feeder current;
- larger tap-offs;
- larger UPS/transformer blocks or different voltage strategy;
- busway temperature/short-circuit considerations;
- liquid-cooling electrical auxiliaries;
- synchronized load dynamics;
- more concentrated failure blast radius;
- need for rack-level telemetry.

## 44. Dynamic AI load behavior

AI accelerators can create faster and more correlated load changes than traditional enterprise compute. Design must evaluate actual vendor equipment envelope rather than assume static nameplate behavior.

Potential impacts:

- UPS transient response;
- generator step load;
- voltage regulation;
- busbar thermal cycling;
- harmonic behavior;
- protection nuisance trips;
- cooling-power coupling.

## 45. A/B chain canonical model

```text
PATH A: SOURCE A → MV A → TX A → LV A → UPS A → DIST A → rPDU A → PSU A
PATH B: SOURCE B → MV B → TX B → LV B → UPS B → DIST B → rPDU B → PSU B
```

Gerçek design çoğu zaman bu kadar temiz değildir. Bu nedenle A/B independence evidence-based checklist ile doğrulanır.

## 46. A/B common-mode checklist

| Layer | Common-mode question |
|---|---|
| Utility | Aynı upstream substation/feeder corridor mı? |
| MV | Aynı switchgear bus/room/control power mı? |
| Transformer | Shared transformer/tie/protection dependency var mı? |
| LV | Common main bus, tie, ATS veya control PLC var mı? |
| Generator | Shared paralleling bus/fuel/controls var mı? |
| UPS | Shared bypass source, battery controls veya output bus var mı? |
| Distribution | Same PDU/RPP/busway/cable tray/fire zone mı? |
| Rack | A ve B rPDU gerçekten farklı upstream paths mi? |
| IT | Dual PSU load paylaşımı/failover vendor tarafından destekleniyor mu? |
| Operations | Tek MOP/operator action iki path'i aynı anda riske atabilir mi? |

## 47. Protection objective

Protection sisteminin temel amacı, fault'ı güvenli şekilde temizlerken mümkün olan en küçük healthy load alanını etkilemektir.

Gerekli studies:

- load flow;
- short circuit;
- protective-device coordination/selectivity;
- grounding/earthing;
- arc-flash where applicable;
- cable ampacity/voltage drop;
- harmonics;
- motor/generator starting;
- transient studies where relevant.

## 48. Selectivity / coordination

“Breaker var” protection design değildir. Downstream fault'ın upstream main'i gereksiz açmaması için time-current/energy coordination incelenir.

Trade-off:

- personnel/equipment protection;
- fast fault clearing;
- selectivity;
- arc energy;
- generator-mode lower fault current;
- UPS current limiting;
- maintenance mode.

## 49. Generator-mode protection

Utility fault level ile generator fault level aynı değildir. Generator island mode'da available fault current düşebilir; protection pickup/time settings farklı davranabilir.

**DECISION GUIDANCE:** Protection study utility-only scenario ile kapanmamalı; generator/island, bypass, maintenance and degraded configurations da modellemelidir.

## 50. UPS fault contribution

Power-electronic UPS output current limiting behavior traditional source'tan farklı olabilir. Downstream protection coordination UPS manufacturer data ve actual operating modes ile doğrulanmalıdır.

## 51. Transfer and protection interaction

Transfer sequence sırasında source impedance, phase/frequency, neutral reference ve fault current değişebilir. TSE/ATS settings ile protective devices ayrı ayrı değil, system state machine olarak incelenmelidir.

## 52. Earthing / grounding and bonding

Earthing/grounding design:

- personnel safety;
- fault clearing;
- neutral reference;
- EMC;
- telecommunications bonding;
- lightning/surge strategy;
- generator separately-derived-source implications;
- transfer neutral configuration

ile birlikte ele alınır.

**FACT:** ISO/IEC 22237-3 telecommunications bonding'i power-distribution kapsamına dahil eder; IEC 60364-5-54 ve TIA-607-E ilgili earthing/bonding engineering kaynaklarıdır.

## 53. Lightning and surge protection

Lightning and transient protection whole-building coordination gerektirir.

**FACT:** IEC 61643-11:2025 AC LV circuits için surge protective devices requirements/test methods'i current edition olarak tanımlar.

SPD selection upstream lightning-protection concept, earthing, installation location, coordination ve protected equipment withstand ile birlikte yapılmalıdır.

## 54. Power quality

Monitor edilebilecek parameters:

- frequency;
- voltage magnitude;
- dips/swells;
- interruptions;
- transient voltage;
- unbalance;
- flicker;
- harmonics/interharmonics;
- rapid voltage changes;
- current and harmonic current;
- power factor.

**FACT:** IEC 61000-4-30:2025, corrected 2026-07, current power-quality measurement methods standardıdır ve Class A / Class S measurement methods tanımlar.

## 55. EPMS measurement architecture

Recommended hierarchy:

`UTILITY → MV → TRANSFORMER → LV → GENERATOR → UPS IN/BYPASS/OUT → PDU/BUSWAY → RACK → optionally OUTLET`

EPMS goals:

- capacity;
- alarms/events;
- breaker state;
- energy allocation;
- efficiency/loss analysis;
- power quality;
- incident forensics;
- trend/predictive maintenance.

## 56. Billing meter vs engineering meter

Colocation billing boundary ve engineering telemetry aynı purpose değildir.

Billing metering için:

- commercial accuracy;
- tamper/security;
- settlement interval;
- tenant boundary.

Engineering monitoring için:

- event capture;
- PQ class;
- waveform/event resolution;
- topology state;
- correlation.

Bir cihaz her iki görevi de görebilir fakat acceptance criteria ayrı yazılmalıdır.

## 57. Controls and cyber-physical failure domains

Modern power train; PLC, relays, UPS controllers, generator controllers, BMS/EPMS gateways ve networked meters içerir.

Failure questions:

- control power redundancy;
- network segmentation;
- firmware/change management;
- time synchronization;
- fail-safe/manual mode;
- local operation if supervisory network fails;
- common credentials/access;
- remote command authority.

Cybersecurity K04'ün tam kapsamı değildir, ancak power continuity için controls independence ve manual recovery mutlaka modellenir.

## 58. Commissioning philosophy

Commissioning yalnız “equipment energized” kontrolü değildir. Amaç design intent ve failure behavior doğrulamaktır.

Sequence:

- factory tests / documentation review;
- site installation verification;
- point-to-point controls;
- equipment start-up;
- functional performance testing;
- integrated systems testing;
- failure/recovery scenarios;
- operator procedure validation;
- baseline capture.

## 59. Integrated Systems Testing — power scenarios

K04 minimum IST scenario library:

- utility loss;
- single generator fail-to-start;
- generator breaker fail;
- UPS module fault;
- battery string isolation;
- static bypass transition;
- maintenance bypass operation;
- A-path loss with B healthy;
- busway/branch fault;
- control network loss;
- cooling/TCS auxiliary loss during power event;
- return-to-normal;
- repeated utility disturbance;
- black-start;
- emergency power-off boundaries where applicable.

Test senaryosu business risk ve safety rules ile project-specific olarak finalize edilir.

## 60. State-based acceptance

Golden power design en az şu states için değerlendirilmeli:

- normal;
- one component unavailable;
- one path under maintenance;
- generator/island;
- UPS bypass;
- degraded redundancy;
- emergency operation;
- recovery/return to normal;
- future expansion tie-in.

“Normal state single-line diagram” tek başına acceptance için yeterli değildir.

## 61. Capacity management

Power capacity dört sayı ile yönetilmelidir:

1. **Installed nameplate capacity**
2. **Usable normal capacity**
3. **Resilient capacity under design redundancy state**
4. **Committed / allocated customer or IT capacity**

Ayrıca future reserve ve expansion trigger'ları tanımlanmalıdır.

## 62. Stranded capacity

Aşırı büyük upfront electrical blocks:

- unused transformer/UPS capacity;
- conversion loss at low load;
- early CAPEX;
- battery replacement on unused capacity;
- maintenance burden

yaratabilir.

Aşırı küçük blocks ise future expansion tie-in ve outage riskini artırabilir. Phasing kararı business demand + utility timeline + equipment lead time + redundancy state ile yapılır.

## 63. Scale / density decision matrix — illustrative

Aşağıdaki değerler hard thresholds değildir.

| Context | Typical design emphasis | Distribution tendency | Main watchpoints |
|---|---|---|---|
| 50–200 kW | Simple, serviceable continuity | LV + small UPS/PDU/rPDU | Site utility, remote ops, single points |
| ~500 kW | Enterprise block resilience | Modular UPS + PDU/RPP or busway | Growth, bypass, maintenance |
| 1–2 MW | Multi-block enterprise/colo | Busway or structured PDU blocks | A/B independence, protection, generator sequence |
| ~5 MW | Large colo/cloud | MV/LV blocks, scalable UPS/generation | phasing, controls, fuel, IST |
| 20+ MW | Hyperscale/AI campus | Repeated power blocks / MV distribution | utility, supply chain, common modes, future voltage |
| High-density AI zone | Rack power dominates local design | high-current AC/busway or rack DC ecosystem | transient load, cooling auxiliaries, connector/copper density |

## 64. Use-case decision matrix

| Use case | Availability focus | Growth model | Power architecture emphasis |
|---|---|---|---|
| Edge / branch | Simplicity + remote recoverability | Small increments | Integrated UPS, generator where justified, observability |
| Enterprise | Business continuity | Moderate | N+1/2N according to risk, maintainable bypass, clear A/B |
| Colocation | Tenant SLA + metering | Frequent changes | busway flexibility, billing boundary, strong A/B evidence |
| Regional cloud | Fleet standardization | Repeatable blocks | modular power blocks, generator/UPS controls |
| Hyperscale | Large repeated domains | phased campus | MV topology, standardized blocks, automation, supply chain |
| HPC | High sustained load | project-specific | high power quality, transient and cooling coupling |
| AI factory | extreme rack power + fast evolution | rapid phased | grid-to-rack integration, liquid auxiliaries, higher-voltage/rack-DC readiness |

## 65. Risk / FMEA matrix

| Failure / risk | Effect | Detection | Design control |
|---|---|---|---|
| Shared A/B upstream bus | Both rack feeds lost | SLD/common-mode audit | physical/electrical separation |
| ATS controller failure | Source transfer unavailable/wrong | alarms/test | redundant/manual fallback as justified |
| Generator fail-to-start | Battery autonomy consumed | start alarms | N+1, testing, fuel/start system maintenance |
| UPS static bypass fault | unexpected path loss | UPS alarms | independent bypass analysis / maintenance procedure |
| Maintenance bypass error | outage or unsafe paralleling | procedure/interlock | key interlock, MOP, training |
| Battery degradation | insufficient ride-through | impedance/BMS trend | monitoring + replacement policy |
| Busway tap fault | local or upstream trip | breaker/EPMS event | selective protection, installation procedure |
| Low generator fault current | downstream fault not cleared as intended | protection study | multi-state coordination settings |
| Harmonics / imbalance | heating/nuisance trips | PQ monitoring | equipment selection, balancing, filtering as justified |
| Control network common mode | multiple systems lose coordination | network/PLC alarms | segmentation, local/manual fallback |
| Fuel contamination | generators unavailable | fuel test/alarms | quality/polishing/replenishment process |
| Expansion tie-in | maintenance state loses resilience | planning/MOP | reserved sections, phased topology, IST |
| AI load step | UPS/generator voltage instability | fast telemetry | equipment data + dynamic study + staged controls |
| BESS dispatch consumes reserve | resilience margin reduced | EMS/SOC | resilience floor and control priority |

## 66. CAPEX model

CAPEX drivers:

- utility interconnection;
- MV/LV switchgear;
- transformers;
- generator plant/fuel;
- UPS power modules;
- batteries/storage;
- busway/cabling;
- rooms/structure/fire systems;
- controls/EPMS;
- commissioning;
- spare capacity;
- future expansion provisions.

Lowest equipment purchase price ≠ lowest resilient delivered MW cost.

## 67. OPEX model

OPEX drivers:

- electrical losses;
- UPS operating mode;
- transformer loading;
- battery replacements;
- generator testing/fuel treatment;
- preventive maintenance;
- switchgear testing;
- spare parts;
- monitoring software/support;
- staff/contractor procedures;
- periodic studies/settings updates.

## 68. Lifecycle change control

Changes requiring controlled engineering review:

- new rack density;
- new UPS module;
- breaker setting change;
- busway tap addition;
- generator controls firmware;
- battery chemistry;
- BESS integration;
- new utility source;
- transformer replacement;
- tie breaker policy;
- new AI power shelf/voltage;
- tenant power allocation.

Protection/settings database, as-built single line and operating procedures must remain synchronized.

## 69. Protection settings as configuration assets

Breaker/relay settings are operational configuration, not commissioning-day notes. Minimum governance:

- owner;
- approved revision;
- study reference;
- device export/backup;
- change log;
- field verification;
- rollback plan;
- periodic validation.

A wrong setting can create a latent common-mode outage months after commissioning.

## 70. Monitoring event chronology

Incident analysis için EPMS event chronology'nin time synchronization kalitesi kritiktir. Utility event, ATS operation, generator start, UPS transition, breaker trip ve rack impact aynı time axis üzerinde korele edilebilmelidir.

## 71. Operational procedures

Power architecture SOP/MOP/EOP olmadan tamamlanmış sayılmaz.

- **SOP:** Normal recurring operation.
- **MOP:** Planned maintenance/change sequence.
- **EOP:** Fault/emergency response.

Procedures current as-built topology, interlocks ve actual labels ile eşleşmelidir.

## 72. Maintenance-state risk

Bir facility normal state'te 2N görünüp maintenance state'te single-path'e düşebilir. Bu durum saklanmamalı; operational risk register'da görünür olmalıdır.

## 73. Expansion-state risk

Future expansion için reserved breaker veya floor space olması, expansion'ın outage-free olduğu anlamına gelmez. Tie-in sırasında:

- bus de-energization;
- temporary protection;
- construction contamination;
- control changes;
- temporary cables;
- reduced redundancy

incelenmelidir.

## 74. Vendor lock-in

Lock-in alanları:

- proprietary UPS module/controller;
- busway tap-off ecosystem;
- battery/BMS protocol;
- switchgear communications;
- rack DC power shelf;
- monitoring software;
- spare parts and firmware.

Lock-in her zaman kötü değildir; standardized ecosystem operational simplification sağlayabilir. Karar lifecycle support, alternatives and migration cost üzerinden verilmelidir.

## 75. Common design mistakes

1. Utility MW = IT MW kabul etmek.
2. UPS nameplate totalini resilient capacity sanmak.
3. N+1'i Tier III/ Rated-3 diye etiketlemek.
4. Rack A/B etiketini upstream independence kanıtı sanmak.
5. Static bypass'ı second independent path gibi saymak.
6. Maintenance bypass MOP'unu tasarım dışında bırakmak.
7. Generator transient/load-step behavior'ı modellememek.
8. Battery runtime'ı generator sequence'den bağımsız seçmek.
9. UPS battery ile grid BESS'i tek design problem sanmak.
10. Generator mode protection coordination'ı incelememek.
11. Busway tap-off growth'unu short-circuit/selectivity study'den ayırmak.
12. Cooling/TCS electrical auxiliaries'i critical-power modelden çıkarmak.
13. AI rack density headline'ını universal threshold kullanmak.
14. Protection settings change control kurmamak.
15. EPMS billing ve PQ requirement'larını karıştırmak.
16. Control power/network common modes'i modellememek.
17. Commissioning'i equipment startup ile sınırlamak.
18. Return-to-normal sequence'i test etmemek.
19. Expansion tie-in state'lerini risk register'a almamak.
20. Physical fire/flood/cable-route separation'ı electrical SLD'den bağımsız görmek.

## 76. Golden architecture decision tree

```text
START
  │
  ├─► What business availability / maintainability outcome is required?
  │
  ├─► What are initial, ultimate and resilient IT + mechanical MW?
  │
  ├─► What utility topology and fault level are actually available?
  │
  ├─► Define MV / transformer / LV block and expansion model
  │
  ├─► Define alternate source + transfer + black-start sequence
  │
  ├─► Select UPS topology / mode / stored-energy mission
  │
  ├─► Prove A/B path independence and common-mode boundaries
  │
  ├─► Select downstream distribution and rack power ecosystem
  │
  ├─► Run load-flow / short-circuit / selectivity / PQ studies
  │
  ├─► Define EPMS + controls + settings governance
  │
  ├─► Validate normal / maintenance / fault / recovery states
  │
  └─► Freeze topology, settings, procedures, commissioning scenarios
```

## 77. Golden rule

`BUSINESS AVAILABILITY → LOAD & GROWTH → SOURCE → FAILURE DOMAINS → TRANSFER → CONTINUITY → DISTRIBUTION → PROTECTION → OBSERVABILITY → COMMISSIONING → OPERATIONS`

Power architecture ancak bu zincirin tamamı birlikte doğrulandığında kabul edilmelidir.

## 78. Architecture diagram — independent A/B example

```text
       SOURCE / GENERATION A                    SOURCE / GENERATION B
                │                                        │
              MV-A                                     MV-B
                │                                        │
              TX-A                                     TX-B
                │                                        │
              LV-A                                     LV-B
                │                                        │
             UPS-A                                     UPS-B
                │                                        │
          DIST / BUSWAY-A                         DIST / BUSWAY-B
                │                                        │
             rPDU-A                                   rPDU-B
                └──────────────┐          ┌──────────────┘
                               ▼          ▼
                           DUAL-PSU IT LOAD
```

“Independent” etiketi ancak shared utility, room, controls, bypass, fuel, route ve operating procedures analiz edildikten sonra kullanılmalıdır.

## 79. Architecture diagram — continuity state machine

```text
UTILITY HEALTHY
     │
     ├─ fault/disturbance ─► UPS STORED ENERGY
     │                         │
     │                         ├─► GENERATOR START
     │                         │       │
     │                         │       ├─ source qualifies
     │                         │       ▼
     │                         └──── GENERATOR-SUPPLIED UPS/LOAD
     │
     └─ utility returns ─► qualification delay ─► controlled retransfer ─► normal
```

Gerçek timings ve failure branches project-specific'tir.

## 80. Full Briefing — proposed 8-chapter structure

- **K04-00 — Power architecture neden bir failure-domain problemidir?**
- **K04-01 — Utility, MV, transformer ve LV power blocks**
- **K04-02 — Generator, transfer logic ve black-start**
- **K04-03 — UPS topology, modes, static bypass ve maintenance bypass**
- **K04-04 — Battery, stored energy ve BESS sınırı**
- **K04-05 — PDU, RPP, busway, A/B, protection ve EPMS**
- **K04-06 — AI/high-density power, rack DC ve future voltage**
- **K04-07 — Commissioning, lifecycle ve hangi mimari ne zaman?**

## 81. Authoritative source register

| # | Source | Class | K04 use / boundary |
|---|---|---|---|
| 1 | ISO/IEC 22237-3:2021 — https://www.iso.org/standard/78551.html | STANDARD | Data-center power distribution, bonding, lightning, metering/PQ; safety/EMC elsewhere; grid-use of stored energy out of scope |
| 2 | IEC mirror of ISO/IEC 22237-3 — https://webstore.iec.ch/en/publication/71476 | STANDARD | Same scope confirmation |
| 3 | TIA-942-C, May 2024 — https://tiaonline.org/standard/tia-942/ | STANDARD | Data-center infrastructure including power; revision status |
| 4 | TIA-942 Ratings — https://tiaonline.org/products-and-services/tia942certification/tia-942-certifications-ratings/ | CERTIFICATION | Rated-1..4, multiple paths, concurrent maintainability/fault tolerance |
| 5 | Uptime Tier Classification — https://connect.uptimeinstitute.com/tiers | CERTIFICATION / GUIDANCE | Tier I-IV outcome definitions; Tier III/IV boundary |
| 6 | Uptime Tier Certification — https://connect.uptimeinstitute.com/tier-certification | CERTIFICATION | Certification context |
| 7 | IEC 60364-1:2025 — https://webstore.iec.ch/en/publication/63699 | STANDARD | Current LV installation fundamental principles |
| 8 | IEC 60364-5-54:2011+A1:2021 — https://webstore.iec.ch/en/publication/68865 | STANDARD | Earthing arrangements/protective conductors |
| 9 | IEC 61439-1:2020 — https://webstore.iec.ch/en/publication/32338 | STANDARD | LV assembly general/verification requirements |
| 10 | IEC 61439-2:2020 — https://webstore.iec.ch/en/publication/30043 | STANDARD | Power switchgear/controlgear assemblies |
| 11 | IEC 60947-2:2024 — https://webstore.iec.ch/en/publication/66277 | STANDARD | Circuit breakers ≤1000VAC / 1500VDC |
| 12 | IEC 60947-6-1:2026 — https://webstore.iec.ch/en/publication/90494 | STANDARD | Current transfer switching equipment standard; ATS/bypass/closed transition coverage |
| 13 | IEC 62271-200:2021 — https://webstore.iec.ch/en/publication/63466 | STANDARD | Metal-enclosed MV switchgear; consult current amendments/corrigenda for project |
| 14 | IEC 60076-1:2011 — https://webstore.iec.ch/en/publication/588 | STANDARD | Power transformer general requirements |
| 15 | IEC 62040-1 consolidated 2017+A1:2021+A2:2022 — https://webstore.iec.ch/en/publication/80573 | STANDARD | UPS safety |
| 16 | IEC 62040-2:2016 — https://webstore.iec.ch/en/publication/33696 | STANDARD | UPS EMC |
| 17 | IEC 62040-3:2021 — https://webstore.iec.ch/en/publication/60140 | STANDARD | UPS performance/test; verify lifecycle at project procurement date |
| 18 | IEC 61000-4-30:2025 — https://webstore.iec.ch/en/publication/71611 | STANDARD | Current PQ measurement methods; corrected version 2026-07 |
| 19 | IEC 61557-12:2018+A1:2021 — https://webstore.iec.ch/en/publication/65510 | STANDARD | Power metering/monitoring devices |
| 20 | IEC 61643-11:2025 — https://webstore.iec.ch/en/publication/65314 | STANDARD | Current AC LV surge protective devices |
| 21 | IEC 62485-2:2010 — https://webstore.iec.ch/en/publication/7091 | STANDARD | Stationary battery installation safety |
| 22 | IEC 62619:2022 — https://webstore.iec.ch/en/publication/64073 | STANDARD | Industrial lithium batteries incl UPS/stationary EES |
| 23 | IEC 62933-5-1:2024 — https://webstore.iec.ch/en/publication/72239 | STANDARD | EES safety general |
| 24 | IEC 62933-5-2:2025 — https://webstore.iec.ch/en/publication/68297 | STANDARD | Electrochemical grid-integrated EES safety |
| 25 | IEC 62933-5-4:2026 — https://webstore.iec.ch/en/publication/67442 | STANDARD | Li-ion grid BESS safety test methods |
| 26 | ISO 8528-1:2018 — https://www.iso.org/standard/68539.html | STANDARD | Current published genset application/rating/performance; confirmed 2023 |
| 27 | ISO/DIS 8528-1 — https://www.iso.org/standard/92425.html | DRAFT / WATCH | Future replacement; NOT current normative baseline |
| 28 | TIA-607-E (2024) — https://tiaonline.org/standardannouncement/tia-publishes-new-standard-ansi-tia-607-e-generic-telecommunications-bonding-and-grounding-earthing-for-customer-premises/ | STANDARD | Telecom bonding/grounding context |
| 29 | NFPA 70, 2026 edition — https://www.nfpa.org/70 | JURISDICTION-SPECIFIC CODE | NEC only where adopted/applicable; not universal global requirement |
| 30 | NFPA 110, 2025 — https://link.nfpa.org/all-publications/110/2025 | JURISDICTION-SPECIFIC STANDARD | Emergency/standby power systems where applicable |
| 31 | NFPA 111, 2025 — https://link.nfpa.org/all-publications/111/2025 | JURISDICTION-SPECIFIC STANDARD | Stored electrical energy emergency/standby systems where applicable |
| 32 | NFPA 70E, 2024 — https://link.nfpa.org/all-publications/70E/2024 | JURISDICTION-SPECIFIC STANDARD | Electrical workplace safety where applicable |
| 33 | IEEE 3002.2-2018 — https://ieeexplore.ieee.org/document/8529292 | ENGINEERING STANDARD | Load-flow study guidance |
| 34 | IEEE active standards / IEEE 3002.3-2018 — https://ias.ieee.org/technical-activities/active-standards/ | ENGINEERING STANDARD | Short-circuit study guidance/status |
| 35 | Open Compute — Open Rack specs/designs — https://www.opencompute.org/wiki/Open_Rack/SpecsAndDesigns | OPEN SPEC | ORv3 / power shelf / BBU / ORW ecosystem |
| 36 | OCP ORv3 Power Shelf spec — https://www.opencompute.org/documents/ocp-open-rack-v3-power-shelf-rev-1-0-1-pdf | OPEN SPEC | 48/50V-class rack power architecture; dated 2025-04-29 |
| 37 | OCP Eaton ORv3 Power Shelf — https://www.opencompute.org/products/389/ufispace-400g-disaggregated-core-and-edge-router-ddc | PRODUCT EXAMPLE | 18 kW / 15 kW N+1 platform example; not threshold |
| 38 | OCP Murata 33 kW power shelf — https://www.opencompute.org/products/787/murata-33kw-19-1ru-power-shelf | PRODUCT EXAMPLE | 33 kW / 50VDC product example |
| 39 | ASHRAE / PNNL / NEMA AI Data Center Energy Performance Framework — https://www.ashrae.org/technical-resources/ai-data-center-framework | GUIDANCE | Non-mandatory AI energy/resilience/commissioning guidance |
| 40 | ASHRAE Energy & Thermal Efficiency — https://www.ashrae.org/technical-resources/ai-data-center-framework/energy-and-thermal-efficiency | GUIDANCE | Contemporary GPU rack-density context; not hard threshold |
| 41 | ASHRAE Integrated Design Principles — https://www.ashrae.org/technical-resources/ai-data-center-framework/integrated-design-principles | GUIDANCE | Higher-voltage/high-density integrated design context |
| 42 | Schneider — Comparing UPS System Design Configurations — https://www.se.com/us/en/download/document/SPD_SADE-5TPL8X_EN/ | VENDOR GUIDANCE | UPS topology comparison; not certification rule |
| 43 | Schneider — From Grid to Chip, 2026 — https://www.se.com/us/en/download/document/SE-DB-AI_DataCenter/ | VENDOR CLAIM / GUIDANCE | AI grid-to-chip product/architecture direction; Apr 27 2026 |
| 44 | Schneider — Necessary Considerations for Designing DC Architectures — https://www.se.com/us/en/download/document/SPD_WP47_EN/ | VENDOR GUIDANCE | AC/DC distribution trade-offs |
| 45 | Schneider iBusway — https://www.se.com/uk/en/download/document/DEBU028EN/ | VENDOR PRODUCT/GUIDANCE | Busway implementation example |
| 46 | Vertiv — Picking the Right UPS for Your Data Center — https://www.vertiv.com/4aabcf/globalassets/documents/white-papers/white_paper_refresh_-_picking_the_right_ups_for_your_data_center-rev2_244002_0.pdf | VENDOR GUIDANCE | UPS mode/topology concepts; not standard |
| 47 | Vertiv — High Efficiency Modes — https://www.vertiv.com/en-us/about/news-and-events/articles/white-papers/high-efficiency-modes-of-operation/ | VENDOR CLAIM / GUIDANCE | ECO/high-efficiency mode claims and trade-offs |
| 48 | Vertiv — Busway Design — https://www.vertiv.com/en-us/about/news-and-events/articles/white-papers/optimizing-data-center-power-distribution-through-innovative-busway-design/ | VENDOR GUIDANCE | Busway deployment/arc-energy context |

## 82. Source-boundary notes

- Standards describe scope, requirements or test methods; they do not automatically dictate one universal topology.
- Uptime/TIA availability classes are system outcomes, not shorthand for UPS module count.
- NFPA references are jurisdiction-specific and should only be treated as requirements where adopted or contractually specified.
- Vendor white papers are useful engineering evidence but remain vendor guidance/claims.
- OCP product power values demonstrate ecosystem capability; they are not universal rack-density thresholds.
- ASHRAE AI framework explicitly presents guidance rather than mandatory requirements or replacement for applicable codes/standards.
- Draft ISO/DIS 8528-1 is watch-list material; ISO 8528-1:2018 remains the current published standard as of this research date.
- IEC publications with imminent stability review dates must be rechecked at project specification/procurement freeze.

## 83. K04 research acceptance checklist

Before narration, K04 research must satisfy:

- [x] current data-center power standards identified;
- [x] current transfer-switching standard updated to IEC 60947-6-1:2026;
- [x] utility/MV/transformer/LV chain defined;
- [x] generator/transfer/black-start model defined;
- [x] UPS topology/modes/bypass separated;
- [x] stored-energy / UPS battery / BESS boundary defined;
- [x] PDU/RPP/busway/rack-DC matrix included;
- [x] A/B common-mode checklist included;
- [x] protection/selectivity and generator-mode effects included;
- [x] PQ/EPMS/billing boundary included;
- [x] AI/high-density power treated as equipment-driven, not threshold-driven;
- [x] FMEA/risk matrix included;
- [x] use-case and scale matrices included;
- [x] commissioning/IST and recovery states included;
- [x] CAPEX/OPEX/lifecycle/change control included;
- [x] authoritative source register with explicit source classes included;
- [x] proposed 8-chapter Full Briefing structure included.

## 84. Research freeze statement

Power architecture should be accepted only when the design proves the required business outcome across **normal, maintenance, fault, generator/island, bypass, degraded, recovery and expansion states**.

The correct architecture is not the topology with the largest equipment count. It is the minimum controlled architecture that satisfies required availability, maintainability, fault containment, safety, capacity growth and lifecycle objectives **without hidden common-mode dependencies or stranded resilience CAPEX**.
