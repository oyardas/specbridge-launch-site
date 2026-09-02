# DC-K06 — UPS & Energy Storage — GOLDEN DEEP RESEARCH

Status: GOLDEN DEEP RESEARCH COMPLETE — AUDIO / UI NOT YET ACCEPTED
Language: TR
Author: Önder Yardaş
Research date: 2026-09-02
Scope: Vendor-neutral UPS and stored-energy architecture for data centers, including UPS functional classes/topologies, bypass and fault behavior, battery/flywheel/supercapacitor technologies, autonomy/sizing, BMS/monitoring, safety, BESS boundary, grid-interactive considerations, commissioning, lifecycle and AI-load implications.

---

## Evidence language — bu dokümanda iddia sınıfları

- **FACT** — Standard, resmi kurum veya primary engineering source ile doğrudan desteklenen olgu.
- **ENGINEERING GUIDANCE** — Standardı tamamlayan tasarım/operasyon yaklaşımı.
- **VENDOR CLAIM / PRODUCT EXAMPLE** — Belirli üretici/ürüne ait kapasite, verim, ömür veya performans örneği; genellenemez.
- **SPECBRIDGE INTERPRETATION** — Kaynaklardan türetilen vendor-neutral sistem yorumu.
- **DECISION GUIDANCE** — Proje seçimi için karar çerçevesi; hard standard threshold değildir.

UPS ve enerji depolama alanında bu ayrım kritik önemdedir. Bir ürünün 99% verim, 15 yıl battery life veya belirli MW/kWh değeri ilan etmesi sektör standardı değildir. Aynı şekilde “10 dakika autonomy” veya “lithium her zaman daha iyidir” ifadesi universal engineering rule değildir.

---

# 0. Executive conclusion

**SPECBRIDGE INTERPRETATION**

Data-center UPS architecture bir “UPS cihazı + akü” seçimi değildir. Kritik yükün hangi power-quality envelope içinde kesintisiz kalacağı, utility/generator geçişindeki bridge süresi, fault current davranışı, bypass yolları, stored-energy technology, recharge/cycling duty, fire/life safety ve maintenance state’lerinin birlikte tasarlandığı bir **continuity system**’dir.

Golden decision chain:

`CRITICAL LOAD → CONTINUITY / POWER QUALITY → UPS FUNCTION & MODE → REDUNDANCY / BYPASS → FAULT BEHAVIOR → STORAGE POWER → STORAGE ENERGY / AUTONOMY → TECHNOLOGY / CHEMISTRY → SAFETY → RECHARGE / CYCLING → MONITORING → COMMISSIONING → LIFECYCLE → BESS / GRID BOUNDARY → FREEZE`

Temel sonuçlar:

1. UPS kW/kVA kapasitesi ile stored-energy kWh/autonomy aynı problem değildir.
2. N+1 UPS modülü, battery path ve bypass/common bus independence kanıtlamaz.
3. Static bypass maintenance bypass değildir; ikisi de otomatik olarak ikinci bağımsız A/B source path değildir.
4. “Battery autonomy” generator start süresinden ibaret değildir; source qualification, transfer, cooling/TCS restart ve contingency margin birlikte ele alınır.
5. VRLA, vented lead-acid, lithium-ion, nickel-cadmium, flywheel ve supercapacitor aynı power/energy/lifecycle davranışına sahip değildir.
6. UPS battery ile site-level BESS aynı şey değildir; mimari, control objective, cycling duty ve safety boundary farklı olabilir.
7. Lithium-ion seçiminde cell chemistry kadar BMS, propagation behavior, enclosure, fire strategy, integration ve tested system configuration önemlidir.
8. Battery SOC tek başına availability kanıtı değildir; capacity, internal resistance, temperature, aging ve system fault state önemlidir.
9. AI yüklerinde hızlı power swings, high rack density ve critical cooling auxiliaries stored-energy architecture’ı IT load ile daha sıkı bağlar.
10. Kabul testi yalnız “utility breaker açıldı, UPS tuttu” seviyesinde kalamaz; degraded states, bypass, string failure, BMS/control faults, recharge ve return-to-normal test edilmelidir.

---

# 1. K04 ile K06 sınırı

**SPECBRIDGE INTERPRETATION**

- **DC-K04 Power Architecture:** utility, MV/LV, transformer, generator, transfer, UPS’in power-chain içindeki yeri, A/B distribution, protection ve facility-level failure domains.
- **DC-K06 UPS & Energy Storage:** UPS’in kendi functional behavior’ı, stored-energy subsystem, autonomy, battery/flywheel/supercapacitor technology, BMS, safety, lifecycle ve BESS ilişkisi.

K06, K04’ü tekrar etmez; K04’teki `UPS / STORED ENERGY` domain’ini derinleştirir.

---

# 2. Canonical UPS continuity chain

```text
UTILITY / GENERATOR / ALTERNATE SOURCE
        ↓
UPS INPUT / RECTIFIER
        ↓
DC LINK ←→ STORED ENERGY
        ↓
INVERTER
        ↓
UPS OUTPUT
        ↓
DOWNSTREAM DISTRIBUTION
        ↓
CRITICAL IT + CRITICAL COOLING/CONTROL LOADS

ALTERNATE PATH:
UPS INPUT / BYPASS SOURCE
        ↓
STATIC BYPASS / MAINTENANCE BYPASS
        ↓
CRITICAL OUTPUT BUS
```

**Golden principle:** Her ok, switch, control power source ve common bus ayrı failure-domain sorusudur.

---

# 3. Standards and authority map

## 3.1 ISO/IEC 22237-3:2021

**FACT** — Data-centre power supply/distribution, availability, measurement ve power-quality management için facility-level çerçeve sağlar. Stored energy’nin grid tarafından kullanımı bu standardın mevcut kapsamı dışındadır.

## 3.2 ISO/IEC TS 22237-31:2026

**FACT** — Resilience, dependability, fault tolerance, availability tolerance, maintainability, recoverability ve vulnerability için KPI/resilience-level yaklaşımı getirir. UPS değerlendirmesi component count’tan system resilience’a taşınmalıdır.

## 3.3 ANSI/TIA-942-C — May 2024

**FACT** — Power/cooling dahil data-center infrastructure requirements ve Rated availability yaklaşımı sağlar. UPS redundancy tek başına facility rating sonucu değildir.

## 3.4 IEC 62040-1:2017 + AMD1:2021 + AMD2:2022

**FACT** — UPS safety requirements için current consolidated IEC reference’tır.

## 3.5 IEC 62040-2:2016

**FACT** — UPS electromagnetic compatibility product standardıdır.

## 3.6 IEC 62040-3:2021

**FACT** — UPS performance specification/test standardıdır; complete UPS ve continuity’yi sağlayan functional units için performance/test requirements tanımlar.

## 3.7 IEC 62477-1:2022

**FACT** — Power electronic converter systems safety için general reference; UPS product standards’ını destekleyen üst safety çerçevesidir.

## 3.8 IEC 62485-2:2010

**FACT** — Stationary lead-acid ve NiCd/NiMH battery installation safety; electrical, gas emission ve electrolyte hazards dahil.

## 3.9 IEC 62485-5:2020 + COR1:2022

**FACT** — Stationary lithium-ion battery installations için installation, use, inspection, maintenance ve disposal safety requirements sağlar.

## 3.10 IEC 62619:2022

**FACT** — Industrial/stationary lithium secondary cells and batteries için safety requirements ve tests; UPS ve EES örnek uygulamalar arasındadır.

## 3.11 IEC 62933-5-2:2025

**FACT** — Grid-integrated electrochemical BESS için lifecycle safety; BESS’i yalnız battery cabinet değil system-of-subsystems olarak ele alır.

## 3.12 NFPA 855 — 2026

**FACT** — Stationary energy storage system installation, commissioning, operation/maintenance, decommissioning ve electrochemical ESS safety için current NFPA reference’tır.

## 3.13 UL 9540 / UL 9540A

**FACT** — UL 9540 ESS product/system safety reference; UL 9540A thermal-runaway/fire propagation test methodudur. 6th Edition UL 9540A Mart 2026’da yayımlanmıştır ve 2026 NFPA 855 large-scale fire-test yaklaşımıyla ilişkilidir.

## 3.14 IEEE stationary battery family

Current relevant references include:

- IEEE 485-2020 — lead-acid sizing.
- IEEE 450-2020 — vented lead-acid maintenance/testing/replacement.
- IEEE 484-2019 — vented lead-acid installation design/installation.
- IEEE 1188-2025 — VRLA maintenance/testing/replacement.
- IEEE 1115-2025 — NiCd sizing.
- IEEE 1679-2020 — stationary storage technology characterization/evaluation.
- IEEE 1679.1-2025 — stationary lithium-based technology evaluation.
- IEEE 946-2020 — stationary DC power-system design reference; revision project P946 active.

---

# 4. UPS’in temel işi nedir?

**FACT + SPECBRIDGE INTERPRETATION**

UPS’in primary function’ı kritik load power continuity sağlamaktır. Data-center bağlamında buna çoğu kez:

- voltage/frequency continuity,
- power conditioning,
- short interruption avoidance,
- source transition bridge,
- defined fault/bypass behavior,
- observability

eşlik eder.

UPS “uzun süreli jeneratör alternatifi” olarak varsayılmamalıdır; storage duration ve duty ayrıca tasarlanır.

---

# 5. IEC 62040-3 performance classification — VFI / VI / VFD

**FACT + ENGINEERING GUIDANCE**

UPS market terminolojisindeki “online”, “line-interactive” ve “standby” ifadelerinin yerine IEC 62040-3 output-performance classification esas alınmalıdır.

- **VFI — Voltage and Frequency Independent:** output voltage/frequency input değişimlerinden belirlenen ölçüde bağımsızdır; double-conversion systems ile güçlü biçimde ilişkilidir.
- **VI — Voltage Independent:** output voltage regulation sağlanır, frequency input ile daha yakından ilişkilidir.
- **VFD — Voltage and Frequency Dependent:** output normal durumda input kaynağına daha doğrudan bağımlıdır.

**Boundary:** Classification tek başına redundancy, battery autonomy veya facility availability rating’i söylemez.

---

# 6. Online double-conversion architecture

**ENGINEERING GUIDANCE**

Typical path:

`AC INPUT → RECTIFIER/DC BUS → INVERTER → LOAD`

Stored energy DC bus’a bağlıdır. Güç conversion path üzerinden sürekli işlendiği için input disturbances ile load arasında güçlü conditioning sağlanabilir.

Evaluate:

- conversion efficiency across load range,
- rectifier/input harmonic behavior,
- inverter overload,
- short-circuit contribution,
- static bypass transfer conditions,
- generator compatibility,
- battery/DC-link window,
- failure isolation.

---

# 7. VI / line-interactive approaches

**ENGINEERING GUIDANCE**

Input source normal operation’da output ile daha yakın ilişkilidir; voltage regulation ve stored-energy transition architecture ürün tasarımına göre değişir.

Typical fit:

- edge,
- smaller IT environments,
- less demanding power-quality contexts.

Large mission-critical three-phase design’de exact IEC performance class ve load requirement ile doğrulanmalıdır.

---

# 8. VFD / standby approaches

**ENGINEERING GUIDANCE**

Normal durumda load input kaynağına daha doğrudan bağlıdır; inverter/storage path disturbance sonrası devreye girer.

Typical use:

- smaller loads,
- endpoint/edge devices,
- applications where transfer behavior is acceptable.

“UPS var” ifadesi VFD ile VFI arasındaki power-quality farkını gizlememelidir.

---

# 9. Centralized vs distributed UPS

| Model | Strength | Risk |
|---|---|---|
| Large centralized | scale, common maintenance model | larger blast radius, distribution dependency |
| Power-block UPS | repeatable capacity blocks, fault containment | more systems/controls |
| Row-level/distributed | short distribution path, incremental deployment | equipment count, service complexity |
| Rack-level UPS | local autonomy | high device count, battery fleet operations |

**DECISION GUIDANCE:** Facility size alone selection rule değildir; fault containment, maintainability, phasing ve operations maturity önemlidir.

---

# 10. Monolithic vs modular UPS

**ENGINEERING GUIDANCE**

Modular UPS capacity modules ile growth ve internal redundancy sağlayabilir. Ancak:

- common frame/bus,
- controller,
- static bypass,
- input/output switchgear,
- battery interface

common-mode oluşturabilir.

`MODULAR UPS ≠ AUTOMATICALLY REDUNDANT UPS SYSTEM`.

---

# 11. N, N+1, 2N ve distributed redundancy

**SPECBRIDGE INTERPRETATION**

- N: required capacity only.
- N+1: one additional capacity unit/module.
- 2N: two complete capacity paths, if independence is real.
- distributed redundant: multiple paths/capacity blocks with shared-load strategy.

Key rule:

`EQUIPMENT COUNT ≠ PATH INDEPENDENCE ≠ CONCURRENT MAINTAINABILITY ≠ FAULT TOLERANCE`.

---

# 12. Static bypass

Static bypass inverter overload/fault veya controlled transfer durumunda alternate electronic path sağlar.

Check:

- bypass source origin,
- synchronization window,
- transfer logic,
- overload/fault behavior,
- backfeed protection,
- common control power,
- return-to-inverter logic.

Static bypass ayrı facility A/B path anlamına gelmez.

---

# 13. Maintenance bypass

Maintenance bypass UPS power electronics’in planned isolation’ını mümkün kılar.

Engineering requirements:

- interlock,
- source compatibility,
- clear mimic/labeling,
- MOP,
- safe isolation,
- bypass source availability,
- downstream protection continuity.

Human-error risk burada critical failure mode’dur.

---

# 14. Rectifier/input domain

Rectifier design değerlendirmesi:

- input voltage/frequency range,
- power factor,
- THDi,
- soft start,
- generator loading,
- battery recharge current,
- input current limit,
- redundancy/fault isolation.

UPS output kW rating’i input-side transient behavior’ı açıklamaz.

---

# 15. DC link

DC link:

- rectifier,
- inverter,
- stored energy

arasındaki kritik interface’tir.

Freeze:

- nominal/min/max voltage,
- battery string architecture,
- protection,
- precharge,
- isolation,
- ripple/current limits,
- fault energy.

---

# 16. Inverter domain

Evaluate:

- steady-state output regulation,
- dynamic response,
- nonlinear loads,
- overload duration,
- fault contribution,
- synchronization,
- parallel operation,
- efficiency,
- thermal limits.

---

# 17. Short-circuit contribution and selectivity

**ENGINEERING GUIDANCE**

Power-electronic UPS inverter fault current conventional transformer/source behavior’dan farklı olabilir. Downstream protection study:

- inverter-limited current,
- bypass-source current,
- transfer timing,
- breaker/fuse trip characteristics,
- UPS current-limiting behavior

ile birlikte yapılmalıdır.

Golden test question:

> Inverter state’inde downstream fault gerçekten selective olarak temizleniyor mu, yoksa UPS output bus kaybediliyor mu?

---

# 18. Generator compatibility

UPS–generator integration yalnız kVA sizing değildir.

Check:

- rectifier input current,
- harmonics,
- power factor,
- recharge current,
- frequency/voltage acceptance window,
- generator transient response,
- step loading,
- UPS source qualification delay,
- multiple UPS synchronization/loading.

---

# 19. UPS operating states

Minimum state model:

1. double conversion normal,
2. high-efficiency mode,
3. battery discharge,
4. static bypass,
5. maintenance bypass,
6. overload/current limit,
7. degraded module state,
8. generator supply,
9. recharge,
10. fault lockout/recovery.

Architecture her state’te ayrı değerlendirilmelidir.

---

# 20. High-efficiency / ECO modes

**FACT + VENDOR CLAIM BOUNDARY**

Modern UPS products double-conversion dışında higher-efficiency modes sunabilir. Vendor examples 98–99% aralığında values gösterebilir; bunlar product/mode-specific’tir.

Evaluate trade-off:

- load path,
- transfer behavior,
- conditioning,
- fault response,
- generator compatibility,
- bypass exposure,
- efficiency gain.

Energy saving mode’u sadece nameplate efficiency ile seçmek doğru değildir.

---

# 21. UPS efficiency nasıl değerlendirilir?

**ENGINEERING GUIDANCE**

Tek `% efficiency` rakamı yeterli değildir.

Record:

- 25/50/75/100% load efficiency,
- normal mode,
- high-efficiency mode,
- battery/recharge losses,
- parallel/module loading,
- low-load phasing impact.

`P_loss = P_in - P_out`

UPS loss aynı zamanda cooling heat load’dur.

---

# 22. Power ve energy ayrımı

Critical distinction:

- **Power:** kW / MW — anlık yükü taşıma yeteneği.
- **Energy:** kWh / MWh — belirli süre bu gücü sürdürme yeteneği.

Basit ideal ilişki:

`Energy ≈ Power × Time`

Gerçekte correction factors gerekir:

- discharge rate,
- battery efficiency,
- temperature,
- end-of-discharge voltage,
- aging,
- inverter/DC losses,
- reserve margin.

---

# 23. Autonomy bir “10 dakika standardı” değildir

**DECISION GUIDANCE**

Required autonomy şu state chain’den çıkarılmalıdır:

`SOURCE LOSS → UPS BRIDGE → GENERATOR START → SOURCE QUALIFICATION → TRANSFER → CRITICAL MECHANICAL/TCS RECOVERY → STABLE OPERATION + CONTINGENCY`

5, 10 veya 15 dakika market conventions olabilir; universal data-center standardı değildir.

---

# 24. Stored-energy taxonomy

1. VRLA lead-acid.
2. Vented/flooded lead-acid.
3. Lithium-ion families.
4. Nickel-cadmium.
5. Flywheel.
6. Supercapacitor/ultracapacitor.
7. Hybrid combinations.
8. Site-level BESS.

IEEE 1679 teknolojileri electrochemical, kinetic, electrostatic ve başka storage media olarak daha geniş framework içinde değerlendirir.

---

# 25. VRLA batteries

Strengths:

- mature UPS ecosystem,
- broad service familiarity,
- lower initial cost in many configurations,
- established recycling chain in many markets.

Risks:

- aging sensitivity,
- temperature sensitivity,
- cell/block variance,
- replacement cycles,
- footprint/weight,
- capacity uncertainty without disciplined testing.

IEEE 1188-2025 maintenance/testing/replacement için current key reference’tır.

---

# 26. Vented lead-acid batteries

Potential strengths:

- long established stationary use,
- inspectable electrolyte/flooded design,
- high-reliability legacy applications.

Risks/requirements:

- ventilation/gas management,
- electrolyte handling,
- maintenance,
- dedicated battery-room design.

IEEE 450-2020, IEEE 484-2019, IEEE 485-2020 ve IEC 62485-2 key references’tır.

---

# 27. Lithium-ion batteries

Potential strengths:

- higher energy density,
- lower footprint/weight for comparable duty in many products,
- longer service life potential,
- faster recharge/cycling capability,
- integrated BMS visibility.

Risks:

- chemistry/system-specific thermal runaway behavior,
- BMS dependency,
- propagation/fire/explosion analysis,
- transport/service constraints,
- integration-specific protection.

IEC 62619:2022, IEC 62485-5:2020, IEEE 1679.1-2025 ve applicable fire codes are key references.

---

# 28. Lithium chemistry — “Li-ion” tek chemistry değildir

**ENGINEERING GUIDANCE**

LFP, NMC ve diğer lithium families farklı:

- energy density,
- thermal stability,
- voltage,
- cycle behavior,
- power capability,
- safety response

sunabilir.

Selection chemistry label’dan değil tested battery system + BMS + UPS compatibility + installation/fire strategy üzerinden yapılmalıdır.

---

# 29. Nickel-cadmium

Strengths:

- robust industrial history,
- temperature tolerance,
- high-rate capability in suitable products.

Trade-offs:

- cost,
- environmental/material concerns,
- maintenance/technology familiarity.

IEEE 1115-2025 current sizing reference’tır. Installation/maintenance reference family ayrıca technology lifecycle/status kontrolüyle kullanılmalıdır.

---

# 30. Flywheel storage

Flywheel electrical energy’yi rotational kinetic energy olarak saklar.

Potential fit:

- high power,
- short bridge duration,
- high cycle count,
- reduced electrochemical battery dependency.

Constraints:

- typically shorter energy duration than battery systems,
- mechanical system/integration requirements,
- generator start/recovery architecture becomes more critical.

IEEE 1679 flywheel’ı stationary energy-storage technology family içinde kapsar.

---

# 31. Supercapacitor / ultracapacitor

Potential fit:

- very high power,
- very rapid charge/discharge,
- high cycle capability,
- short-duration bridge.

Constraint:

- energy duration limited compared with battery systems.

Vendor TCO studies are useful examples but must not be generalized into universal superiority claims.

---

# 32. Hybrid stored-energy architectures

Examples:

- supercapacitor + battery,
- flywheel + generator,
- UPS battery + site BESS,
- short-duration high-power storage + longer-duration storage.

Benefits may include duty separation, but controls and common-mode risks increase.

---

# 33. UPS battery vs BESS — canonical distinction

| Attribute | UPS stored energy | BESS |
|---|---|---|
| Primary objective | no-break critical-load continuity | site/grid energy management and/or resilience |
| Response | immediate UPS DC-link support | system/application specific |
| Typical duty | standby + bridge, sometimes cycling | potentially frequent cycling |
| Power quality | integrated with UPS inverter | PCS/grid interface dependent |
| Load boundary | critical UPS output | site/microgrid/feeder boundary |
| Safety/code | UPS + battery installation standards | ESS system/code + chemistry requirements |

**Golden rule:** Same battery chemistry does not mean same system architecture.

---

# 34. Behind-the-meter BESS

2026 data-center architectures increasingly evaluate BTM BESS for:

- peak management,
- demand flexibility,
- renewable integration,
- longer-duration site support,
- grid services where permitted,
- AI power smoothing.

**VENDOR CLAIM / MARKET CONTEXT:** Vertiv 2026 material explicitly distinguishes conventional double-conversion UPS from BTM BESS roles in large data centers.

---

# 35. Grid-interactive stored energy boundary

ISO/IEC 22237-3:2021 explicitly notes use of data-center stored energy/alternate sources by the grid is outside its current scope.

Therefore grid-interactive UPS/BESS requires additional:

- interconnection rules,
- protection,
- dispatch logic,
- reserve floor,
- battery warranty/cycle model,
- cybersecurity/control governance,
- utility/regulatory compliance.

Grid service must never silently consume emergency autonomy below the agreed resilience floor.

---

# 36. Sizing starts with load profile

Do not size battery from UPS nameplate alone.

Define:

- initial critical kW,
- maximum committed kW,
- load steps,
- future growth,
- critical mechanical/TCS loads if UPS-backed,
- discharge duration,
- voltage window,
- redundancy state.

---

# 37. Lead-acid sizing framework

IEEE 485-2020 describes defining DC load and sizing stationary lead-acid batteries.

Core inputs include:

- duty/load profile,
- discharge time,
- end voltage,
- temperature,
- aging/design margins,
- manufacturer discharge data.

A generic `Ah = A × h` shortcut is insufficient for high-rate UPS discharge.

---

# 38. Lithium sizing framework

Lithium sizing must use OEM cell/module/system discharge curves and BMS operating window.

Check:

- minimum/maximum DC voltage,
- max continuous/pulse current,
- SOC operating range,
- EOL capacity assumption,
- temperature,
- BMS contactor behavior,
- required autonomy at worst-case state.

---

# 39. Discharge rate matters

Battery available energy depends on discharge rate and chemistry.

**ENGINEERING GUIDANCE:** High-rate short-duration UPS duty cannot be extrapolated linearly from low-rate battery nameplate energy.

Use manufacturer validated curves at intended discharge time/current and end voltage.

---

# 40. End-of-discharge voltage

End voltage affects:

- usable energy,
- cell stress,
- UPS DC bus/inverter operation,
- minimum number of cells/modules.

Battery sizing and UPS DC operating window must be solved together.

---

# 41. Temperature correction

Temperature changes available capacity, aging and safety behavior.

Design records:

- normal room/cabinet range,
- worst-case discharge temperature,
- cooling failure state,
- local hot spots,
- OEM derating.

Battery-room average temperature is not enough if cabinet/internal distribution is non-uniform.

---

# 42. Aging margin

Required autonomy must be met at agreed end-of-life condition, not only day-one capacity.

Define:

- EOL capacity criterion,
- replacement threshold,
- design margin,
- periodic capacity verification strategy.

Over-sizing without purpose can increase CAPEX/footprint and fault energy; under-sizing erodes autonomy.

---

# 43. Parallel battery strings

Parallel strings can increase capacity/redundancy, but introduce:

- current sharing,
- isolation,
- string protection,
- maintenance,
- unequal aging,
- fault contribution

issues.

“Two strings” does not automatically mean battery redundancy if a common disconnect, bus or UPS DC input is single-failure point.

---

# 44. Dedicated vs shared battery architecture

Options:

- battery per UPS module,
- battery per UPS frame,
- shared common battery,
- A/B independent battery systems.

Trade-off:

`resource utilization ↔ fault-domain isolation ↔ maintenance flexibility`.

---

# 45. DC voltage architecture

Freeze:

- nominal bus voltage,
- module/string count,
- full-charge voltage,
- low-voltage cutoff,
- equalize/charge modes where applicable,
- insulation/protection ratings,
- cable/bus current.

High DC voltage reduces current for given power but increases insulation, switching and arc hazard considerations.

---

# 46. Recharge time

Autonomy recovery after outage depends on:

- charger/rectifier headroom,
- battery max charge current,
- generator capacity,
- simultaneous IT load,
- battery temperature,
- control policy.

A battery that delivered 10 minutes once may not deliver it again shortly afterward if recharge is incomplete.

---

# 47. Standby duty vs cycling duty

UPS battery traditionally spends most time charged and waits for source failure. BESS may cycle daily or more frequently.

Cycling changes:

- degradation model,
- thermal load,
- warranty,
- SOC strategy,
- required energy reserve,
- replacement economics.

Do not use standby-life assumptions for grid-service cycling without explicit qualification.

---

# 48. Battery Management System — BMS

Lithium systems commonly use hierarchical BMS functions at cell/module/rack/system levels.

Typical functions:

- voltage/temperature monitoring,
- SOC/SOH estimation,
- current limits,
- balancing,
- contactor control,
- fault protection,
- alarms/communications.

BMS itself is a control failure domain and must be included in FMEA.

---

# 49. SOC is an estimate, not a proof

State of Charge can be derived from:

- coulomb counting,
- voltage models,
- temperature,
- chemistry-specific algorithms.

SOC = 100% does not prove full rated capacity at end-of-life.

---

# 50. SOH is multidimensional

State of Health can include:

- usable capacity,
- internal resistance/impedance,
- power capability,
- aging history,
- cell spread.

One vendor “SOH %” field should not be accepted without definition.

---

# 51. VRLA monitoring

Useful signals:

- block/cell voltage,
- string current,
- temperature,
- impedance/conductance trends,
- float behavior,
- capacity-test history.

IEEE 1188 maintenance/testing remains core evidence; monitoring is not a substitute for all prescribed testing.

---

# 52. Capacity testing

**ENGINEERING GUIDANCE**

Where applicable, controlled discharge/capacity testing provides stronger evidence of stored-energy capability than visual inspection or voltage alone.

Test plan must protect live-service resilience and account for recharge state afterward.

---

# 53. DC protection

Battery can supply very high fault current.

Design:

- string fuse/breaker,
- cabinet/rack disconnect,
- DC bus protection,
- polarity,
- isolation,
- selectivity,
- interrupting rating,
- arc hazard.

Fault-clearing design must consider chemistry/system-specific short-circuit behavior.

---

# 54. Backfeed and isolation

UPS/service work must prevent unexpected energization from:

- inverter,
- bypass,
- battery/DC bus,
- parallel UPS modules,
- external BESS/PCS.

LOTO and test-for-dead procedures must match actual multi-source topology.

---

# 55. Lead-acid safety

Potential hazards:

- DC shock/arc,
- short circuit,
- hydrogen gas,
- electrolyte,
- heavy lifting,
- thermal events.

IEC 62485-2 and IEEE installation/maintenance standards guide relevant stationary battery practices.

---

# 56. Lithium-ion safety

Potential hazards include:

- electrical energy,
- thermal runaway,
- flammable/toxic vent gases,
- propagation,
- re-ignition,
- deflagration/explosion depending on configuration.

Safety must be evaluated at cell → module → unit → installation level as applicable.

---

# 57. Thermal runaway is a system problem

Cell chemistry matters, but system outcome also depends on:

- cell spacing,
- module design,
- BMS response,
- enclosure,
- ventilation,
- gas management,
- propagation barriers,
- fire protection,
- installation geometry.

`SAFER CHEMISTRY ≠ AUTOMATICALLY SAFE INSTALLATION`.

---

# 58. UL 9540A role

**FACT**

UL 9540A evaluates thermal-runaway/fire propagation behavior through relevant test levels. 2026 UL material describes 6th Edition and alignment with 2026 NFPA 855 large-scale fire-test expectations.

**Boundary:** Test result applies to tested/qualified configurations and must not be generalized to materially different installations.

---

# 59. NFPA 855 lifecycle view

2026 NFPA 855 includes:

- interconnections,
- commissioning,
- operation/maintenance,
- decommissioning,
- electrochemical ESS chapters.

**SPECBRIDGE INTERPRETATION:** Stored-energy safety must be designed through full lifecycle, not only permit/installation date.

---

# 60. Battery room / cabinet architecture

Evaluate:

- fire separation,
- ventilation,
- cooling,
- gas detection where required,
- spill/electrolyte management where relevant,
- emergency access,
- egress,
- seismic/mechanical restraint,
- service clearance,
- replacement route.

---

# 61. Cooling and battery life

Battery environmental control affects:

- service life,
- capacity,
- safety,
- cell balance,
- warranty.

Cooling design must include battery heat release during:

- float/normal,
- discharge,
- recharge,
- fault state.

---

# 62. Footprint and structural load

Stored energy can dominate:

- floor area,
- floor loading,
- transport path,
- elevator/door capacity,
- seismic anchoring.

Higher energy density may reduce footprint but can change fire/safety concentration.

---

# 63. Lifecycle degradation

Key degradation drivers vary by chemistry but can include:

- calendar age,
- temperature,
- depth of discharge,
- cycle count,
- charge voltage,
- SOC window,
- cell imbalance.

Lifecycle model must match actual UPS/BESS duty.

---

# 64. Replacement strategy

Freeze:

- expected service life,
- replacement trigger,
- capacity threshold,
- compatible future product path,
- disposal/recycling,
- temporary redundancy during replacement,
- procurement lead time.

Battery replacement is a planned availability state.

---

# 65. Circularity and end-of-life

Evaluate:

- recycler availability,
- chemistry-specific process,
- transport classification,
- hazardous-material handling,
- chain of custody,
- second-life claims,
- local regulation.

Do not assume all lithium recycling chains equal mature lead-acid recycling chains.

---

# 66. AI/high-density workload implications

AI clusters may create:

- high absolute MW per block,
- rapid load swings,
- tightly coupled cooling/TCS electrical loads,
- larger transient steps.

UPS design therefore needs:

- dynamic response evidence,
- overload/current limits,
- generator interaction,
- critical cooling continuity,
- power-smoothing strategy where justified.

---

# 67. Power smoothing vs backup

Stored energy can serve two different functions:

1. **Backup/continuity** — supply energy during source loss.
2. **Power smoothing** — absorb/supply rapid changes while source remains present.

A system optimized for frequent smoothing may consume cycle life and SOC headroom. Emergency reserve floor must remain explicit.

---

# 68. UPS + BESS hybrid architecture

Possible concept:

```text
GRID / GENERATION
      |
MAIN BUS ─────────────── BTM BESS / PCS
      |
UPS INPUT
      |
UPS + DEDICATED BRIDGE STORAGE
      |
CRITICAL LOAD
```

Benefits:

- UPS retains no-break local continuity,
- BESS handles longer/site-level duty.

Risks:

- control interaction,
- protection coordination,
- reserve management,
- additional common-mode paths.

---

# 69. Can BESS replace UPS?

**DECISION GUIDANCE**

Not by assumption.

A BESS can replace some UPS functions only if the complete architecture proves:

- transfer/no-break requirement,
- power-quality requirement,
- fault response,
- selectivity,
- redundancy,
- control availability,
- maintenance state,
- safety/code compliance.

“Battery inverter exists” is not equivalent to UPS performance qualification.

---

# 70. Can UPS batteries provide grid services?

Technically possible in some architectures, but requires project-specific validation of:

- UPS bidirectional capability,
- battery warranty/cycle limits,
- interconnection rules,
- reserve floor,
- resilience impact,
- controls/cybersecurity,
- financial dispatch logic.

ISO/IEC 22237-3 currently leaves grid use outside its core scope.

---

# 71. Operational monitoring

Minimum useful telemetry may include:

UPS:
- input/output kW/kVA/PF,
- mode/state,
- module availability,
- bypass availability,
- alarms,
- temperature,
- battery/DC bus.

Storage:
- string/rack voltage/current,
- SOC/SOH definition-aware values,
- temperatures,
- cell spread,
- cycle count/energy throughput,
- alarms,
- isolation status.

---

# 72. Event chronology

Integrated event timeline should correlate:

- utility disturbance,
- ATS/generator,
- UPS source change,
- battery discharge,
- cooling/TCS restart,
- recharge,
- return-to-normal.

Without common timestamps, root-cause analysis becomes unreliable.

---

# 73. KPI set

Do not use one KPI.

Track:

- UPS availability,
- module/path availability,
- UPS efficiency by load/mode,
- stored-energy tested capacity,
- required vs available autonomy,
- battery replacement rate,
- cell/block/rack variance,
- failed starts/transfers,
- battery energy throughput,
- alarm recurrence,
- recharge time.

---

# 74. CAPEX/OPEX/TCO

CAPEX:

- UPS frames/modules,
- battery/storage,
- switchgear/bypass,
- room/fire systems,
- cabling,
- commissioning.

OPEX/lifecycle:

- conversion losses,
- cooling,
- battery testing,
- replacements,
- firmware/service,
- recycling,
- capacity expansion,
- downtime risk.

Vendor TCO calculators are useful scenario tools, not universal economic proof.

---

# 75. Storage Technology Comparison Matrix

| Criterion | VRLA | Lithium-ion | NiCd | Flywheel | Supercapacitor |
|---|---|---|---|---|---|
| Energy duration | short–medium | short–long product-dependent | short–medium | very short–short | very short |
| Power capability | high | high | high | very high | very high |
| Cycle capability | moderate | high | high | very high | extremely high |
| Footprint | high | lower in many systems | medium/high | technology-specific | technology-specific |
| BMS dependency | low/moderate monitoring | high | moderate | control system | control system |
| Fire/chemistry risk | lead-acid hazards | chemistry/system dependent | chemistry-specific | mechanical | electrical |
| Maintenance | established but significant | monitoring-centric | specialized | mechanical service | relatively low electrochemical wear |
| Typical UPS fit | broad legacy/current | broad modern | specialized | short bridge | very short bridge/power smoothing |

**DECISION GUIDANCE:** This matrix is qualitative. Final selection uses tested product data and project duty.

---

# 76. UPS Architecture Decision Matrix

| Requirement | Centralized monolithic | Centralized modular | Power-block UPS | Distributed/rack UPS |
|---|---|---|---|---|
| Large MW scale | strong | strong | very strong | weak/complex |
| Incremental growth | moderate | strong | very strong | strong |
| Fault containment | large domain | frame-dependent | strong | local |
| Maintenance granularity | system-dependent | module-friendly | block-friendly | device-heavy |
| Operations simplicity | fewer assets | moderate | repeatable | many assets |
| Colo tenant segmentation | moderate | strong | strong | strong |
| AI block deployment | possible | strong | very strong | selective |

---

# 77. Autonomy Decision Matrix

| Scenario | Design question | Typical implication |
|---|---|---|
| Reliable utility + fast generators | Can generator/TCS stabilize before battery reserve is consumed? | shorter bridge may be rational |
| Weak utility / slow recovery | How long until stable alternate source? | longer stored energy may be needed |
| Generatorless design | What source replaces long-duration backup? | UPS-only architecture usually insufficient |
| Frequent cycling/grid service | Is emergency reserve preserved? | separate or larger storage/control needed |
| Edge site | Is service response slower than generator recovery? | longer local autonomy may be justified |
| AI campus | Do critical cooling and power transients extend recovery? | autonomy must include coupled mechanical recovery |

No row defines a universal minute value.

---

# 78. Safety Decision Matrix

| Hazard | VRLA/VLA | Lithium-ion | Flywheel/Supercap | Required evidence |
|---|---|---|---|---|
| DC short/arc | high relevance | high relevance | high relevance | protection/interrupt rating |
| Gas/electrolyte | chemistry-specific | vent gases during fault | generally different | installation standard/OEM |
| Thermal runaway | possible battery thermal issues | central concern | not lithium thermal runaway | tested system/fire analysis |
| Propagation | battery layout dependent | module/unit/install dependent | technology-specific | test/configuration evidence |
| Mechanical energy | low | low | high for flywheel | containment/certification |
| Service isolation | mandatory | mandatory | mandatory | LOTO/MOP |

---

# 79. UPS vs BESS Decision Matrix

| Question | UPS | BESS |
|---|---|---|
| No-break critical load | core function | must be explicitly proven |
| Power conditioning | core capability by class/topology | PCS-dependent |
| Long-duration energy | limited/project-specific | common objective |
| Daily cycling | not always intended | common use case |
| Grid services | optional/special | common potential use |
| Emergency reserve | direct | must be reserve-controlled |
| Fire/code scope | UPS + battery standards | ESS installation/system standards |
| Failure domain | critical load path | site/grid path |

---

# 80. Use-Case Decision Matrix

| Use case | Preferred study emphasis |
|---|---|
| Enterprise DC | maintainability, battery replacement, generator bridge |
| Colocation | tenant growth, block redundancy, predictable service state |
| Edge | compactness, remote monitoring, longer service-response autonomy |
| Regional cloud | modular MW blocks, lithium/VRLA lifecycle, operational scale |
| Hyperscale | power blocks, efficiency, automation, BESS/grid interaction |
| HPC/AI | fast load dynamics, power smoothing, cooling continuity, high MW block faults |
| DR site | autonomy vs low utilization, maintenance evidence |

---

# 81. Failure Mode / Risk Matrix

| ID | Failure mode | Impact | Control |
|---|---|---|---|
| F1 | Rectifier failure | battery discharge / module loss | redundancy + isolation |
| F2 | Inverter failure | bypass/transfer or outage | static bypass + redundant path |
| F3 | Static bypass unavailable | reduced fault/overload recovery | independent source/path validation |
| F4 | Maintenance bypass human error | outage | interlock + MOP + training |
| F5 | Common controller failure | multi-module loss | controller architecture + test |
| F6 | One battery string open | autonomy reduction | monitoring + string isolation + capacity margin |
| F7 | Battery short/DC fault | high fault energy | selective DC protection |
| F8 | BMS false trip | lithium storage isolation | redundancy/failsafe logic + tested behavior |
| F9 | Cell thermal runaway | fire/gas/propagation | chemistry/system test + fire strategy |
| F10 | VRLA capacity degradation hidden | autonomy shortfall | IEEE-aligned maintenance/capacity testing |
| F11 | Recharge insufficient after outage | second-event vulnerability | charger headroom + state monitoring |
| F12 | Generator + UPS interaction unstable | transfer/recovery failure | integrated testing |
| F13 | ECO/high-efficiency transfer issue | load disturbance | mode-specific acceptance testing |
| F14 | Downstream fault not selective on inverter | large load loss | UPS-state protection study/test |
| F15 | BESS dispatch consumes reserve | resilience loss | hard reserve floor + governance |
| F16 | Battery room cooling loss | accelerated degradation / safety event | critical cooling + alarms |
| F17 | Common battery bus fault | multiple UPS modules lost | segmentation/isolation |
| F18 | Firmware/communications common-mode | false control action | version control + local fallback |

---

# 82. State-Based Commissioning Matrix

Test at minimum, where design permits:

1. normal double-conversion state;
2. high-efficiency mode state;
3. utility loss to battery;
4. generator start/source qualification;
5. generator load pickup;
6. return-to-normal;
7. one UPS module unavailable;
8. one battery string unavailable;
9. static bypass transfer;
10. maintenance bypass/isolation procedure;
11. downstream fault/selectivity scenario;
12. BMS/communications alarm or controlled fault;
13. cooling loss in battery room/cabinet;
14. recharge after defined discharge;
15. repeated source event before full recharge;
16. integrated critical cooling/TCS restart for AI load;
17. emergency shutdown/fire interface where applicable.

Commissioning must compare actual event chronology against approved sequence of operations.

---

# 83. Golden architecture diagrams

## 83.1 Dual-path UPS model

```text
SOURCE A ─ UPS A + STORAGE A ─ DIST A ─┐
                                      ├─ DUAL-CORDED IT LOAD
SOURCE B ─ UPS B + STORAGE B ─ DIST B ─┘
```

Audit hidden common points:

- bypass source,
- battery bus,
- controls,
- cooling,
- switchgear,
- room/fire zone,
- monitoring.

## 83.2 UPS + generator bridge

```text
UTILITY LOST
   ↓
UPS STORED ENERGY ACTIVE
   ↓
GENERATOR STARTS
   ↓
V/F STABLE + SOURCE QUALIFIED
   ↓
TRANSFER / RECTIFIER ACCEPTS SOURCE
   ↓
CRITICAL COOLING RECOVERS
   ↓
BATTERY RECHARGE
```

## 83.3 UPS + BESS hybrid

```text
GRID ───────── SITE BUS ───────── CRITICAL UPS ───── IT
                 │                    │
                 │                    └─ BRIDGE STORAGE
                 │
                 └─ BESS / PCS ── ENERGY + FLEXIBILITY
```

---

# 84. Golden selection checklist and research conclusion

## Design checklist

### Requirement
- critical kW/kVA
- load profile/transients
- continuity class
- power-quality requirement
- autonomy state chain

### UPS
- IEC 62040 performance class
- topology/mode
- efficiency curve
- redundancy
- bypass architecture
- overload/fault current
- generator compatibility
- maintainability

### Storage
- technology/chemistry
- power capability
- usable energy
- temperature/aging margin
- DC window
- recharge time
- string redundancy
- cycling duty

### Safety
- applicable IEC/IEEE/NFPA/UL/local code
- battery room/cabinet
- ventilation/cooling
- fire/propagation evidence
- DC protection/isolation
- emergency response

### Operations
- SOC/SOH definitions
- capacity-test plan
- firmware/BMS governance
- replacement strategy
- spare/service model
- event chronology

### Commissioning
- normal/battery/bypass/generator states
- one-module/one-string failure
- selectivity
- recharge
- repeated event
- integrated cooling recovery

## Research conclusion

UPS & Energy Storage architecture must be selected from **critical-load continuity requirement outward**, not from battery chemistry or UPS catalogue inward.

The Golden question is not:

> “Hangi UPS ve hangi akü?”

It is:

> “Hangi normal, maintenance ve fault state’lerinde kritik load hangi path ve stored-energy reserve ile yaşamaya devam edecek; bu davranış hangi standard, test ve lifecycle evidence ile kanıtlanacak?”

---

## Full Briefing TR V2 — proposed 8-chapter narration structure

1. `K06-00` — UPS neden sadece bir cihaz değildir?
2. `K06-01` — VFI/VI/VFD, double conversion, bypass ve operating modes
3. `K06-02` — Redundancy, fault current, generator compatibility ve selectivity
4. `K06-03` — Autonomy nasıl gerçekten boyutlandırılır?
5. `K06-04` — VRLA, lithium-ion, NiCd, flywheel ve supercapacitor
6. `K06-05` — BMS, battery safety, thermal runaway ve lifecycle
7. `K06-06` — UPS battery, BESS, grid interaction ve AI power smoothing
8. `K06-07` — Commissioning, maintenance, TCO ve hangi mimari ne zaman?

---

# Authoritative source register

## Standards / formal references

1. **ISO/IEC 22237-3:2021 — Data centre power distribution**
   https://www.iso.org/standard/78551.html

2. **ISO/IEC TS 22237-31:2026 — KPIs for resilience**
   https://committee.iso.org/cms/live/live/en/sites/isoorg/contents/data/standard/08/87/88711.html

3. **ANSI/TIA-942-C — May 2024**
   https://tiaonline.org/standard/tia-942/

4. **IEC 62040-1:2017+AMD1:2021+AMD2:2022 CSV — UPS safety**
   https://webstore.iec.ch/en/publication/80573

5. **IEC 62040-2:2016 — UPS EMC**
   https://webstore.iec.ch/en/publication/33696

6. **IEC 62040-3:2021 — UPS performance/test requirements**
   https://webstore.iec.ch/en/publication/60140

7. **IEC 62477-1:2022 — Power electronic converter safety**
   https://webstore.iec.ch/en/publication/28936

8. **IEC 62485-2:2010 — Stationary battery installation safety**
   https://webstore.iec.ch/en/publication/7091

9. **IEC 62485-5:2020 — Stationary lithium-ion battery safe operation**
   https://webstore.iec.ch/en/publication/29086

10. **IEC 62619:2022 — Industrial/stationary lithium battery safety**
    https://webstore.iec.ch/en/publication/64073

11. **IEC 62933-5-2:2025 — Grid-integrated electrochemical EES safety**
    https://webstore.iec.ch/en/publication/68297

12. **NFPA 855 — 2026 — Stationary Energy Storage Systems**
    https://link.nfpa.org/all-publications/855/2026

13. **UL Solutions — UL 9540A Test Method**
    https://www.ul.com/services/ul-9540a-test-method

14. **UL Solutions — ESS installation code and UL 9540A FAQs**
    https://www.ul.com/resources/installation-codes-and-requirements-energy-storage-systems-ess-faqs

15. **UL Solutions — NFPA 855 / UL 9540A large-scale fire testing**
    https://www.ul.com/thecodeauthority/knowledge/understanding-UL-9540A-NFPA-855

16. **IEEE 1188-2025 — VRLA maintenance/testing/replacement**
    https://standards.ieee.org/ieee/1188/11656/

17. **IEEE 450-2020 — Vented lead-acid maintenance/testing/replacement**
    https://standards.ieee.org/ieee/450/6772/

18. **IEEE 485-2020 — Lead-acid battery sizing**
    https://standards.ieee.org/ieee/485/6726/

19. **IEEE 484-2019 — Vented lead-acid installation design**
    https://standards.ieee.org/ieee/421.5/5765/

20. **IEEE 1115-2025 — NiCd battery sizing**
    https://standards.ieee.org/ieee/1115/11969/

21. **IEEE 1679-2020 — Stationary energy-storage technology evaluation**
    https://standards.ieee.org/ieee/1679/7716/

22. **IEEE 1679.1-2025 — Lithium-based stationary battery evaluation**
    https://standards.ieee.org/ieee/1679.1/11048/

23. **IEEE 946-2020 / P946 — Stationary DC power system design family**
    https://standards.ieee.org/ieee/946/11047/

24. **IEEE 2030.2.1-2019 — BESS design/operation/maintenance guide**
    https://standards.ieee.org/ieee/2030.2.1/5832/

## Engineering / technology references

25. **Schneider Electric — The Different Types of UPS Systems — 2024 revision**
    https://www.se.com/us/en/download/document/SPD_SADE-5TNM3Y_EN/

26. **Schneider Electric — Battery Technology for Data Centers: VRLA vs. Li-ion**
    https://www.se.com/us/en/download/document/SPD_VAVR-A5AJXY_EN/

27. **Schneider Electric — eConversion vs double-conversion trade-off tool**
    https://www.se.com/ww/en/work/solutions/data-centers-and-networks/trade-off-tools/econversion-vs-double-conversion-calculator/

28. **Schneider Electric — Li-ion vs VRLA UPS battery TCO tool**
    https://www.se.com/ww/en/work/solutions/system/s1/data-center-and-network-systems/trade-off-tools/lithium-ion-vs-vrla-ups-battery-tco-calculator/

29. **Eaton — Energy-storage TCO: VRLA, Li-ion, flywheel and supercapacitor**
    https://www.eaton.com/us/en-us/markets/data-centers/knowledge-center/eaton-energy-storage-total-cost-of-ownership-white-paper.html

30. **Vertiv — BESS and UPS roles in large data-center power architecture — 2026**
    https://www.vertiv.com/en-us/insights/articles/white-papers/bess-and-ups-roles-in-large-data-center-power-architecture/

31. **Vertiv — Lithium-ion batteries in UPS applications**
    https://www.vertiv.com/49e9ce/globalassets/products/critical-power/uninterruptible-power-supplies-ups/advantages-of-using-lithium-ions-batteries-sl-70595.pdf

32. **Vertiv — Lithium-ion battery use and safety rules**
    https://www.vertiv.com/48ee08/globalassets/products/critical-power/uninterruptible-power-supplies-ups/lithium-ion-battery-use-safety-rules.pdf

33. **Vertiv — Liebert APM2 operating-mode / efficiency product example**
    https://www.vertiv.com/en-emea/about/news-and-events/news-releases/vertiv-launches-scalable-energy-efficient-ups-for-mid-size-edge-applications-in-emea/

34. **Schneider Electric — Galaxy VM product example**
    https://www.se.com/il/en/product-range/62414-galaxy-vm/

35. **Schneider Electric — Eco-mode engineering discussion**
    https://blog.se.com/datacenter/2015/07/07/a-new-take-on-ups-eco-mode-delivers-efficiency-without-sacrificing-reliability-and-availability/

36. **IEEE P1679.5 — Long-duration energy-storage technology evaluation project**
    https://standards.ieee.org/ieee/1679.5/12388/

---

## Research freeze statement

`DC_K06_GOLDEN_RESEARCH_V2 = COMPLETE`

This marker freezes the research baseline only. It does **not** mean K06 Full Narration, Full Audio, Golden UI, Pages acceptance or final `DC_K06_GOLDEN_V2 = ACCEPTED` has been completed.
