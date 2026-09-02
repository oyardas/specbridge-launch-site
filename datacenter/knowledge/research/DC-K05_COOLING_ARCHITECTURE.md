# DC-K05 — Data Center Cooling Architecture — GOLDEN DEEP RESEARCH

Status: GOLDEN DEEP RESEARCH COMPLETE — AUDIO / UI NOT YET ACCEPTED
Language: TR
Author: Önder Yardaş
Research date: 2026-09-02
Scope: Vendor-neutral data-center thermal architecture from silicon/rack heat capture to outdoor heat rejection, including air cooling, DX, chilled water, economization, rear-door, direct-to-chip, immersion, CDU/TCS/FWS, resilience, controls, water/energy metrics, commissioning, retrofit and AI-density transition.

---

## Evidence language — bu dokümanda iddia sınıfları

- **FACT** — Standard, resmi kurum, primary engineering source veya açık üretici teknik dokümanıyla doğrudan desteklenen olgu.
- **ENGINEERING GUIDANCE** — Standardı tamamlayan, tasarım/operasyon için önerilen mühendislik yaklaşımı.
- **VENDOR CLAIM / PRODUCT EXAMPLE** — Belirli ürün veya üreticiye ait kapasite, özellik, performans ya da mimari örnek. Genellenemez.
- **SPECBRIDGE INTERPRETATION** — Kaynaklardan türetilen vendor-neutral sistem yorumu.
- **DECISION GUIDANCE** — Proje kararında kullanılacak çerçeve; hard standard threshold değildir.

Bu ayrım özellikle liquid cooling alanında zorunludur. 2025–2026 döneminde ürün güçleri, coolant sınıfları, CDU ölçekleri ve operating practices hızla değişmektedir; bir üreticinin bugünkü rakamı sektör limiti değildir.

---

# 1. Executive conclusion

**SPECBRIDGE INTERPRETATION**

Veri merkezi cooling architecture bir “klima seçimi” değildir. IT cihazının tükettiği elektrik enerjisinin ısıya dönüşmesinden başlayıp, bu ısının **chip → package → server → rack → room/TCS → facility loop → heat-rejection system → outdoor environment veya heat-reuse sink** zincirinden güvenli, ölçülebilir ve sürdürülebilir biçimde taşınmasıdır.

Golden karar kuralı:

`WORKLOAD → IT ENVIRONMENTAL CLASS → RACK DENSITY / HEAT CAPTURE → AIR + LIQUID FRACTION → TCS/FWS BOUNDARY → HYDRAULICS → HEAT REJECTION → WATER / ENERGY → RESILIENCE → CONTROLS → COMMISSIONING → OPERATIONS → GROWTH`

Bu nedenle doğru soru “air mi liquid mi?” değildir. Doğru sorular şunlardır:

1. Heat nerede capture edilecek?
2. Ne kadarı air, ne kadarı liquid path üzerinden taşınacak?
3. IT equipment hangi inlet/coolant envelope içinde full performance verecek?
4. Heat hangi loop’larla facility boundary’ye aktarılacak?
5. Normal, maintenance ve fault state’lerinde hangi cooling path ayakta kalacak?
6. Climate, water, energy, refrigerant ve site constraints hangi heat-rejection architecture’ı destekliyor?
7. Bugünkü rack density ile gelecekteki AI density aynı facility içinde nasıl birlikte yaşayacak?
8. Cooling failure olduğunda IT workload’un thermal ride-through süresi ne kadar?

---

# 2. Canonical thermal chain

**FACT + SPECBRIDGE INTERPRETATION**

```text
ELECTRICAL POWER TO ITE
        ↓
SILICON / PACKAGE HEAT
        ↓
HEAT SINK / COLD PLATE / IMMERSION FLUID
        ↓
SERVER AIRFLOW and/or TECHNOLOGY COOLANT
        ↓
RACK / ROW / ROOM HEAT CAPTURE
        ↓
TCS — TECHNOLOGY COOLING SYSTEM
        ↓
CDU / HEAT EXCHANGER BOUNDARY
        ↓
FWS — FACILITY WATER / REFRIGERANT SYSTEM
        ↓
CHILLER / DRY COOLER / COOLING TOWER / ADIABATIC / ECONOMIZER
        ↓
OUTDOOR ENVIRONMENT
        ↘
         OPTIONAL HEAT REUSE
```

**Golden principle:** Every arrow is an engineering interface and potential failure domain.

---

# 3. Canonical cooling taxonomy — tek eksenli “air vs liquid” sınıflaması yeterli değildir

## Axis A — Heat capture location

1. **Room-level air capture** — CRAC/CRAH/perimeter.
2. **Row-level close-coupled capture** — in-row / overhead / rear-door.
3. **Rack-level capture** — RDHx, rack CDU, liquid sidecar.
4. **Component-level capture** — cold plate / direct-to-chip.
5. **Equipment immersion** — single-phase veya two-phase immersion.

## Axis B — Primary heat transport medium

- air
- refrigerant
- chilled water / facility water
- single-phase water/glycol technology coolant
- dielectric single-phase fluid
- two-phase working fluid

## Axis C — IT-to-facility boundary

- no liquid inside white space
- facility water to terminal coil
- FWS separated from TCS by CDU/HX
- dedicated TCS with liquid-to-air heat rejection
- immersion tank + secondary heat exchanger

## Axis D — Heat rejection

- compressor-based DX / condensing
- air-cooled chiller
- water-cooled chiller + cooling tower
- dry cooler / fluid cooler
- evaporative / adiabatic
- waterside economizer
- airside economizer
- refrigerant economizer
- district/heat-reuse interface

## Axis E — Deployment condition

- greenfield
- brownfield expansion
- retrofit
- mixed-density / hybrid hall
- dedicated AI liquid zone

## Axis F — Resilience model

- component redundancy
- path redundancy
- concurrent maintainability
- fault tolerance / continuous cooling requirement
- workload-level resilience compensating for infrastructure limits

**SPECBRIDGE INTERPRETATION:** “Liquid-cooled data center” tek bir mimari değildir. D2C + dry cooler, D2C + chiller, RDHx + existing chilled water, immersion + fluid cooler veya hybrid air+D2C tamamen farklı failure-domain ve OPEX davranışları yaratır.

---

# 4. Standards and authority map

## 4.1 ISO/IEC 22237-4:2021 — Environmental control

**FACT**

ISO/IEC 22237-4 environmental control için temperature control, fluid movement, relative humidity, particulate control, vibration ve environmental-control system physical security gereksinimlerini availability, security ve energy-efficiency enablement sınıfları bağlamında ele alır.

**Boundary:** Standard size/density-specific liquid product architecture dikte etmez.

## 4.2 TIA-942-C — May 2024

**FACT**

TIA-942-C data-center infrastructure standardı cooling dahil power, telecommunications, architecture, fire/safety ve security alanlarını kapsar; tüm boyut/tip data center’lara uygulanabilir.

## 4.3 ASHRAE TC 9.9

**FACT**

Thermal Guidelines for Data Processing Environments Fifth Edition ve ASHRAE Handbook Chapter 20, equipment inlet environment ve liquid-cooled ITE class’ları için temel vendor-neutral engineering references’tır.

## 4.4 ANSI/ASHRAE Standard 90.4-2022

**FACT**

Data-center energy standardı mechanical load component — MLC ve electrical loss component — ELC yaklaşımıyla minimum energy-efficiency requirements getirir. Cooling energy fan, pump ve heat rejection dahil sistem seviyesinde değerlendirilir.

## 4.5 OCP Cooling Environments

**FACT**

2026 OCP Cooling Environments yapısı Cold Plate, CDU, Door Heat Exchanger, Immersion ve Heat Reuse alt projelerini; ayrıca coolant fluids, concurrent maintainability ve liquid cooling guidance workstream’lerini birlikte yürütmektedir.

## 4.6 2025 ASHRAE–OCP alliance

**FACT**

ASHRAE ile OCP Ekim 2025’te AI data-center liquid cooling performance ve resilience ihtiyaçları için formal alliance duyurdu. Açıklamada FWS, TCS, D2C/immersion ve CDU gibi intermediate systems açıkça ortak çalışma alanı olarak tanımlandı.

**SPECBRIDGE INTERPRETATION:** Bu işbirliği, liquid cooling’in artık yalnız OEM/product problemi değil; facility–IT interface standardization problemi olduğunu doğruluyor.

---

# 5. ASHRAE air-cooled equipment principle

**FACT**

ASHRAE’nin temel design reference point’i room thermostat değil **IT equipment inlet condition**’dır. Recommended ve allowable envelopes farklı amaç taşır: normal operation mümkün olduğunca recommended range içinde hedeflenirken allowable range operasyonel toleransı ifade eder.

**ENGINEERING GUIDANCE**

Cooling acceptance test’leri yalnız room average temperature ile kapatılmamalıdır. En azından rack inlet distribution, return conditions, airflow/bypass, humidity/dew point ve representative worst-case racks birlikte gözlenmelidir.

---

# 6. ASHRAE liquid cooling classes — current naming

**FACT**

ASHRAE 2021 Thermal Guidelines ile liquid classes, upper facility-water supply temperature’ı class isminde gösterecek şekilde güncellendi:

| ASHRAE liquid class | Maximum facility supply liquid temperature | Typical implication |
|---|---:|---|
| W17 | 17°C | traditional chilled-water-oriented infrastructure |
| W27 | 27°C | increased economization opportunity |
| W32 | 32°C | many climates can reduce/avoid chiller hours |
| W40 | 40°C | warm-water architecture; high economization potential |
| W45 | 45°C | chillerless opportunity in suitable climates |
| W+ | >45°C | equipment capable beyond W45 |

All classes share a 2°C lower reference limit in the ASHRAE framework.

**Critical boundary:** Class number is an **ITE capability/environmental class**, not a promise that a given site can operate chillerless. Outdoor design conditions, CDU approach temperature, heat-rejection selection, fouling margins and OEM-specific requirements remain project-specific.

---

# 7. Thermal load basics

**ENGINEERING GUIDANCE**

Steady-state first approximation:

```text
IT ELECTRICAL POWER ≈ IT HEAT REJECTED
```

Facility cooling load additionally includes, where applicable:

- fan/pump heat
- UPS/electrical losses released into conditioned zones
- lighting/people
- building envelope / solar gains
- CDU/pump losses
- power conversion inside AI racks
- transient and restart states

A single “MW cooling” number is insufficient. Cooling design should maintain at least:

- total IT MW
- rack-by-rack or pod density distribution
- air-cooled fraction
- liquid-captured fraction
- residual air heat
- sensible heat ratio where relevant
- transient step load
- future density reserve

---

# 8. Core thermal and hydraulic equations

## Air-side sensible heat

```text
Q = ṁ_air × cp_air × ΔT_air
```

Higher rack power therefore requires more airflow, larger air temperature rise, or both.

## Liquid-side heat transport

```text
Q = ṁ_liquid × cp_liquid × ΔT_liquid
```

Liquid’s volumetric heat capacity makes high heat flux transport practical with much lower volumetric flow than air.

## Pumping relationship

```text
Hydraulic power ≈ flow × pressure differential / efficiency
```

**SPECBRIDGE INTERPRETATION:** Higher liquid cooling capacity is not “free.” Small hose/QD/manifold pressure drops, long loops, excessive flow margins and poor balancing can convert thermal headroom into pump energy and control instability.

---

# 9. Rack density is a distribution, not an average

**DECISION GUIDANCE**

A hall with average 12 kW/rack may contain 5 kW storage racks and 80 kW accelerator racks. Average density therefore cannot size terminal cooling or airflow paths.

Use at minimum:

- median rack density
- P90/P95 rack density
- maximum committed density
- future design density
- pod/row heat concentration
- liquid capture ratio

**Golden rule:** cooling zoning follows **heat concentration**, not cabinet count.

---

# 10. Air cooling — room/perimeter architecture

**ENGINEERING GUIDANCE**

Perimeter CRAC/CRAH remains valid where rack density, airflow path, containment and room geometry are compatible.

Strengths:

- mature operations and skill base
- broad IT compatibility
- straightforward service model
- limited liquid proximity when DX architecture is used

Risks:

- long airflow path
- bypass and recirculation
- underfloor/overhead pressure imbalance
- fan-energy growth at high density
- local hotspots masked by room averages

---

# 11. CRAC vs CRAH — terminology is not the design decision

**ENGINEERING GUIDANCE**

CRAC commonly implies refrigerant/DX architecture; CRAH commonly implies chilled-water coil. Vendor terminology can vary.

The actual engineering decision must identify:

- refrigerant or water loop
- compressor location
- heat rejection path
- economizer mode
- redundancy boundary
- refrigerant/water containment risk
- controls and failure response

---

# 12. Raised floor vs slab / overhead

**FACT + ENGINEERING GUIDANCE**

Raised floor is not a prerequisite for a modern data center.

Raised-floor advantages:

- legacy familiarity
- air distribution plenum
- flexible tile positioning in suitable designs

Raised-floor risks:

- cable obstruction
- leakage
- pressure imbalance
- tile dependency
- structural/load limitations

Slab / overhead designs can simplify high-density routing and separate power/network/cooling services, but require disciplined overhead coordination and airflow management.

---

# 13. Hot aisle / cold aisle and containment

**ENGINEERING GUIDANCE**

Containment’s main purpose is not simply “make aisle colder”; it is to reduce:

- recirculation
- bypass airflow
- mixing

Hot aisle containment often provides a clean return-air path and can support higher return temperatures; cold aisle containment can be effective depending on room architecture.

Selection must be coordinated with:

- fire detection/suppression
- egress
- ceiling return
- room pressure
- maintenance practice
- leakage paths

---

# 14. In-row / close-coupled cooling

**ENGINEERING GUIDANCE**

Moving the heat exchanger nearer the rack reduces air transport distance and can improve density capability.

Advantages:

- shorter airflow path
- modular scaling
- better local load matching

Risks:

- white-space consumption
- water/refrigerant in row
- condensate/leak risk
- maintenance access
- multiple units sharing a common upstream failure domain

**Availability warning:** N+1 in-row units do not prove N+1 cooling if the common pump/header/control path is single.

---

# 15. Rear-door heat exchanger — RDHx / DHX

**FACT + ENGINEERING GUIDANCE**

RDHx captures server exhaust heat at rack rear. It can support air-cooled IT without internal server cold plates and is therefore valuable for retrofit/high-density transitions.

Strengths:

- existing air-cooled server compatibility
- reduced room heat load
- high-density retrofit potential

Risks:

- door weight and rack stability
- hinge/flexible hose service
- door opening effects
- upstream CDU/FWS dependence
- residual room heat depending on design

OCP maintains a Door Heat Exchanger sub-project focused on interface standardization, compatibility and leak/failure risks.

---

# 16. DX — Direct Expansion

**ENGINEERING GUIDANCE**

DX may be appropriate for small/medium deployments, distributed architectures, edge/micro facilities and locations where central chilled-water plant is undesirable.

Decision factors:

- refrigerant circuit length and charge
- compressor modulation
- outdoor design temperature
- low-ambient operation
- free-cooling/economizer option
- maintenance skill
- refrigerant regulation/lifecycle
- redundancy at compressor/circuit/controller level

Large scale alone does not make DX wrong; system topology and lifecycle economics decide.

---

# 17. Chilled-water architecture

**ENGINEERING GUIDANCE**

Central chilled water remains a major option for campus/colo/hyperscale environments.

Typical chain:

```text
CHILLER → PRIMARY/SECONDARY PUMPS → HEADER → CRAH/IN-ROW/HX → RETURN
```

Strengths:

- central optimization
- large-scale plant efficiency
- integration with economizers/storage/heat recovery

Failure domains:

- common headers
- pumps
- valves
- control network
- chiller plant
- cooling towers / dry coolers
- water chemistry

**Golden rule:** plant N+1 does not prove distribution-path resilience.

---

# 18. Heat-rejection technologies

Cooling terminal selection and heat rejection are separate decisions.

| Heat rejection | Strength | Main constraint |
|---|---|---|
| Air-cooled chiller | No cooling tower; simpler water strategy | compressor energy / hot-climate derating |
| Water-cooled chiller + tower | high plant efficiency opportunity | water use, treatment, plume, maintenance |
| Dry cooler / fluid cooler | low water use, warm-loop friendly | ambient dry-bulb limit and footprint |
| Adiabatic / evaporative | lower approach in suitable climates | water quality/use and maintenance |
| Waterside economizer | compressor-hour reduction | climate and approach temperatures |
| Airside economizer | direct low-energy cooling opportunity | filtration, humidity, contamination |
| Refrigerant economizer | compressor bypass/reduction | product/system specific |
| Heat reuse | turns waste heat into useful energy | sink temperature, seasonality, economics |

---

# 19. Economization is an annual-hours problem

**ENGINEERING GUIDANCE**

“Free cooling available” is not a design conclusion.

Evaluate:

- hourly weather data
- design dry-bulb/wet-bulb
- IT supply temperature requirement
- CDU/HX approach temperature
- fan/pump energy
- redundancy mode
- water availability
- contamination/filtration
- partial-load behavior

The economic metric is often **compressor hours avoided and annual kWh**, not simply presence/absence of an economizer.

---

# 20. Water risk — water in the cooling plant is not the same as water at the chip

**FACT + SPECBRIDGE INTERPRETATION**

ISO/IEC 30134-9:2022 defines Water Usage Effectiveness — WUE as a use-phase data-center KPI. Its second edition is under development as of 2026.

Distinguish:

1. evaporative water consumed at heat rejection;
2. closed-loop facility water inventory;
3. technology coolant inventory;
4. makeup/blowdown/treatment water;
5. external/source water risk.

A D2C system can use a closed TCS while rejecting heat through a dry cooler and therefore need not imply high consumptive water use.

---

# 21. Direct-to-chip / cold-plate cooling

**FACT + ENGINEERING GUIDANCE**

Cold plates remove heat close to CPU/GPU/accelerator components and are now a mainstream architecture for rack-scale AI systems.

Advantages:

- high heat flux capture
- lower air-volume requirement
- warm-water/economizer opportunity
- high rack-density scaling

Engineering requirements:

- OEM-approved coolant and temperature range
- cold-plate pressure drop
- per-tray/rack flow
- manifold/QD interface
- leak detection
- residual air cooling
- TCS/FWS boundary
- maintenance responsibility

---

# 22. Residual heat — D2C does not automatically mean 100% liquid capture

**ENGINEERING GUIDANCE**

Depending on server design, PSU, NIC, DIMM, storage, board-level components and power shelves can still reject heat to air.

Define explicitly:

```text
TOTAL RACK HEAT = LIQUID-CAPTURED HEAT + RESIDUAL AIR HEAT
```

Required project data:

- liquid capture ratio at normal load
- liquid capture ratio at peak load
- residual airflow CFM/m³h
- maximum inlet air temperature
- fan power and control behavior

**Golden failure:** designing a “liquid hall” and removing room airflow before residual heat is proven.

---

# 23. Current AI rack-scale evidence

## NVIDIA GB300 NVL72

**VENDOR CLAIM / PRODUCT EXAMPLE**

NVIDIA describes GB300 NVL72 as a fully liquid-cooled rack-scale architecture.

## NVIDIA GB200 NVL72 OCP contribution

**VENDOR CLAIM / PRODUCT EXAMPLE**

NVIDIA’s OCP contribution describes approximately 120 kW rack cooling capacity requirement and liquid manifold/blind-mate innovations.

## 2026 Rubin direction

**VENDOR / CONFERENCE EXAMPLE**

A GTC 2026 partner session describes >200 kW rack-level direction and 45°C warm-water operation for Rubin-generation equipment. This is **not** a universal 2026 design threshold and must not be applied to other OEMs or generations without their official facility requirements.

**SPECBRIDGE INTERPRETATION:** Cooling masterplans must be based on an upgrade envelope, not just the current server generation.

---

# 24. ASHRAE contemporary AI density context

**ENGINEERING GUIDANCE / CURRENT FRAMEWORK**

ASHRAE’s current AI Data Center Energy Performance Framework describes GPU environments commonly in the 50–100 kW/rack region and purpose-built AI environments at roughly 50–120+ kW/rack, while explicitly recommending liquid/liquid-assisted architectures where air alone becomes inadequate.

These are contemporary context values — **not mandatory transition thresholds**.

---

# 25. Rear-door vs D2C vs immersion — they solve different boundaries

| Architecture | Heat capture | Server modification | Residual air | Retrofit fit | Service model |
|---|---|---|---|---|---|
| Air | server air → room | none | all heat | strongest | familiar |
| RDHx | server exhaust → door | usually none | low-to-medium depending design | strong | rack/door service |
| D2C | component → cold plate | OEM liquid platform required | often present | medium | IT + facilities boundary |
| Immersion | full equipment → dielectric fluid | compatible equipment required | very low for immersed equipment | difficult | specialized |

---

# 26. Immersion cooling

## Single-phase

Dielectric fluid remains liquid and transfers heat to an external heat exchanger.

## Two-phase

Working fluid boils at heat source and condenses in the system.

**ENGINEERING GUIDANCE**

Evaluate:

- fluid compatibility
- fluid lifecycle and environmental profile
- fire/safety requirements
- component warranty
- optics/cabling access
- service procedure
- lifting/draining
- contamination control
- tank redundancy
- fluid reclamation/disposal

**Decision guidance:** Immersion is a specialized architecture, not the automatic “highest density = best” answer.

---

# 27. FWS vs TCS — critical interface

**FACT + ENGINEERING GUIDANCE**

OCP/ASHRAE terminology increasingly distinguishes facility-side cooling from technology-side cooling.

```text
FWS / FACILITY SIDE
Heat rejection / chiller / dry cooler / facility pumps
        ↓
CDU or HX
        ↓
TCS / TECHNOLOGY SIDE
Secondary pumps / filtration / controls
        ↓
Rack manifold
        ↓
QD / hoses / cold plates
```

Why separation matters:

- coolant chemistry
- pressure class
- material compatibility
- contamination
- warranty boundary
- service ownership
- pressure transient protection
- leak containment

---

# 28. CDU functions

A CDU may provide:

- heat exchange
- secondary pumping
- temperature control
- differential pressure control
- filtration
- makeup/fill/drain
- air removal
- telemetry
- leak/pressure alarms
- FWS/TCS isolation

CDU form factors:

- in-rack
- in-row
- sidecar
- perimeter
- central / megawatt-scale
- liquid-to-liquid
- liquid-to-air / refrigerant-assisted

**VENDOR EXAMPLE:** Vertiv CoolChip family publicly spans in-rack, in-row and perimeter architectures and liquid-to-liquid or liquid-to-air designs. Product range is not an industry sizing standard.

---

# 29. 2026 CDU scaling signal

**FACT / OCP EXAMPLE**

OCP Project Deschutes draft contribution published in 2026 describes a megawatt-scale CDU reference architecture with multiple parallel heat exchangers, large flow and explicit wetted-material/coolant requirements.

**CURRENT OPERATING TREND — UPTIME 2026**

Uptime Intelligence reports a market trend toward larger — hundreds-of-kW to MW-scale — redundant CDU arrangements operated by facilities teams, while noting this is not the only model.

**SPECBRIDGE INTERPRETATION:** CDU location defines failure blast radius. “One very large CDU” can simplify maintenance and hydraulics but increases common-mode exposure unless redundancy, isolation and workload zoning are explicit.

---

# 30. Rack manifold and QD engineering

Design data required:

- maximum rack heat to liquid
- design flow
- ΔT target
- available differential pressure
- manifold branch balancing
- connection type
- blind-mate vs hand-mate
- dry-break behavior
- leakage specification
- insertion/removal force
- hose bend radius
- material compatibility
- service clearance
- drip management

OCP Cold Plate workstreams explicitly cover universal quick disconnects, blind-mate interfaces, cooling-loop requirements and coolant-fluid guidance.

---

# 31. Fluid selection is a materials/lifecycle decision

Possible single-phase coolant families include:

- treated/deionized water with inhibitor package
- propylene-glycol mixtures such as PG25
- other OEM-approved water/glycol formulations

**FACT / CURRENT OCP SIGNAL**

OCP’s 2026 shipping/storage guidance identifies treated water and inhibited PG25 among commonly used single-phase liquid-cooled data-center deployment fluids.

**Critical boundary:** “PG25 is common” does not mean every cold plate/CDU is approved for any PG25 formulation.

Freeze fluid only after confirming:

- IT OEM requirements
- CDU requirements
- wetted materials
- elastomers
- corrosion inhibitor
- conductivity
- microbiology
- filtration
- freeze/storage conditions
- maintenance/replacement interval

---

# 32. Material compatibility and corrosion

**ENGINEERING GUIDANCE**

Potential issues:

- mixed metals / galvanic corrosion
- inhibitor depletion
- oxygen ingress
- elastomer incompatibility
- particulate generation
- plating compatibility
- pH drift
- biofouling

Fluid sampling should be an operations process, not only a commissioning activity.

---

# 33. Dew point and condensation

**FACT + ENGINEERING GUIDANCE**

If cold surface/coolant temperature falls below surrounding-air dew point, condensation becomes possible.

Controls:

- warm-water operation
- room dew-point monitoring
- coolant supply reset
- insulation where required
- humidity control
- condensation sensors

**ASHRAE boundary:** W17/W27 architectures particularly require condensation prevention consideration where supply temperatures are lower.

---

# 34. Hydraulic design — flow must follow heat and component limits

Required hydraulic model:

- rack heat load
- coolant cp/density/viscosity
- design ΔT
- manifold branch pressure drop
- QD/hose/cold-plate pressure drop
- valve authority
- CDU pump curve
- N+1 pump operating point
- minimum/maximum equipment flow

**Golden rule:** never size TCS from nominal pipe diameter alone.

---

# 35. Flow balancing

Poor balancing can create:

- starved trays
- low ΔT syndrome
- excessive pump energy
- high return temperature variation
- control hunting

Options:

- calibrated orifices
- pressure-independent valves
- balancing valves
- active flow control
- rack-level telemetry

Selection depends on OEM loop characteristics and scale.

---

# 36. Approach temperature is a first-class design parameter

```text
ITE coolant supply temperature ≠ facility-water supply temperature
```

CDU/HX requires an approach temperature.

If IT requires 32°C supply and the CDU design approach is 3°C, the facility side generally must provide a lower supply temperature at the relevant load/flow condition.

**ENGINEERING GUIDANCE:** Economizer/chillerless analysis must include CDU approach at design and part load, not just the ASHRAE class label.

---

# 37. Liquid capture ratio changes facility architecture

Example conceptual states:

- 0% liquid / 100% air — classic hall
- 50% liquid / 50% residual air — hybrid
- 80–95% liquid — high-density hybrid, reduced room airflow
- near-100% liquid — architecture-specific, still verify ancillary heat

**DECISION GUIDANCE:** Do not assume capture ratio from technology name; use OEM thermal design data.

---

# 38. Cooling redundancy — component count vs end-to-end path

Potential failure domains:

- chillers
- compressors
- cooling towers/dry coolers
- pumps
- headers
- CRAH/CRAC/in-row
- CDU
- HX
- manifolds
- branch valves
- controls
- sensors
- water source
- refrigerant circuit
- power feeds

**Golden principle:** N+1 terminal units on a single common header are not an independent cooling path.

---

# 39. Concurrent maintainability and continuous cooling

**FACT / UPTIME CONTEXT**

Uptime’s cooling resilience guidance separates ability to remove a component/path for maintenance from fault-tolerant/continuous-cooling behavior.

For liquid systems, maintenance state questions include:

- Can a CDU be isolated without stopping affected IT?
- Can a common header be maintained?
- Are there dry/isolation sections?
- Does pump switchover create pressure transient?
- Is thermal ride-through long enough for automatic recovery?

---

# 40. Thermal ride-through is much shorter than electrical ride-through can be

**ENGINEERING GUIDANCE + UPTIME CONTEXT**

Cold plates contain limited thermal mass and coolant inventory. High-power processors can heat rapidly after flow loss.

Therefore:

```text
UPS RUNTIME ≠ COOLING RUNTIME
```

Cooling continuity may need:

- UPS-backed CDU pumps/controls
- stored chilled water or thermal buffer
- pressure accumulator
- fast redundant-pump transfer
- redundant CDU
- workload throttling
- job checkpointing / migration

No universal ride-through value should be assumed; test with the actual IT platform and TCS.

---

# 41. Infrastructure resilience vs workload resilience

**SPECBRIDGE INTERPRETATION**

AI/HPC platforms may sometimes accept infrastructure designs that rely partly on workload restart/migration rather than Tier-like fault tolerance. Enterprise transactional workloads may not.

Cooling resilience target must therefore originate from:

`BUSINESS SERVICE → WORKLOAD FAILURE TOLERANCE → IT PLATFORM → COOLING CONTINUITY`

not from “standard CDU redundancy package.”

---

# 42. Controls architecture

Cooling contains interacting loops:

- room temperature control
- fan speed
- chilled-water supply reset
- pump differential pressure
- CDU secondary temperature
- TCS pressure/flow
- rack valve control
- heat-rejection fan/compressor control

Poorly coordinated loops can hunt against each other.

**ENGINEERING GUIDANCE:** Define control ownership and hierarchy explicitly: local equipment controller → plant controller → BMS/EPMS/DCIM supervisory layer.

---

# 43. Minimum telemetry set

## Air side

- rack inlet temperature
- rack exhaust temperature
- humidity / dew point
- differential pressure
- fan speed/power
- CRAH/CRAC state

## Liquid side

- FWS supply/return temperature
- TCS supply/return temperature
- flow
- differential pressure
- CDU pump state/speed
- filter differential pressure
- valve positions
- coolant conductivity / chemistry parameters where applicable
- leak sensors

## Plant

- chiller/heat-rejection power
- pump/fan power
- ambient conditions
- water consumption

---

# 44. Leak detection and containment

Leak risk cannot be evaluated only as probability. Consider **consequence and blast radius**.

Controls:

- dripless/dry-break QD
- leak rope / point sensors
- drip trays
- automatic isolation valves
- differential pressure anomaly detection
- branch isolation
- floor/drain strategy
- equipment placement away from energized assemblies where possible
- response procedure

**Golden rule:** liquid close to electronics is manageable when interface design and operational response are engineered together.

---

# 45. Commissioning must be state-based

Cooling IST should not be limited to “temperatures stable at 100% load.”

Required state families:

1. normal operation
2. minimum load
3. maximum design load
4. rapid load increase/decrease
5. one terminal unit unavailable
6. one pump unavailable
7. one CDU unavailable
8. one chiller/heat-rejection device unavailable
9. header/path maintenance
10. utility loss / generator transition
11. control-network or sensor failure
12. leak alarm / automatic isolation
13. return-to-normal
14. expansion tie-in

---

# 46. Cooling load bank / thermal validation

**ENGINEERING GUIDANCE**

Commissioning method must approximate actual heat and flow behavior.

Possible methods:

- electrical rack load banks + air heat
- liquid load banks on TCS
- staged real IT
- combined air/liquid simulation

For hybrid AI racks, validate both liquid and residual-air paths simultaneously.

---

# 47. Maintenance ownership boundary

Liquid cooling creates shared IT/facilities responsibility.

Define RACI for:

- facility heat rejection
- FWS water treatment
- CDU
- TCS coolant
- manifold
- hoses/QD
- cold plates
- server service
- leak response
- fluid sampling
- firmware/controls

**CURRENT 2026 SIGNAL:** Uptime reports growing operator convergence around facilities-managed larger CDU/TCS assets, but practice remains fragmented. This is guidance, not a universal standard.

---

# 48. Retrofit architecture

Retrofit constraints often dominate technology selection:

- existing chilled-water temperature
- spare plant capacity
- piping route
- slab/rack loading
- ceiling/underfloor space
- maintenance windows
- aisle geometry
- leak containment
- electrical density

Strong retrofit patterns may include:

- RDHx on existing air-cooled servers
- liquid-to-air CDU where facility water is unavailable
- dedicated AI pod with isolated TCS
- staged D2C deployment while preserving room air for residual/legacy load

---

# 49. Greenfield architecture

Greenfield allows thermal zoning from day one:

- lower-density air zones
- high-density liquid zones
- common or separated heat rejection
- modular CDU blocks
- warm-water loops
- future heat reuse
- expansion headers

**Decision guidance:** Do not force all halls into the highest-density technology if workload mix does not require it. Hybridization can reduce CAPEX and operational complexity.

---

# 50. Air-to-liquid transition planning

Recommended maturity path:

**L0 — Air only**

Containment, airflow discipline, correct instrumentation.

**L1 — Liquid-ready facility**

Space, pipe routes, structural capacity, controls and future FWS/TCS connection points reserved.

**L2 — Liquid-assisted**

RDHx / dedicated close-coupled zones.

**L3 — D2C hybrid**

Dedicated TCS/CDU; residual air retained.

**L4 — Liquid-dominant AI zone**

High capture ratio, warm-water design, dedicated resilience/operations model.

**L5 — Heat-reuse / advanced liquid ecosystem**

High-temperature loops and external heat sink where economically justified.

---

# 51. SpecBridge density planning bands — not standards

There is no universal kW/rack threshold at which one cooling technology becomes mandatory.

| Planning band | Typical engineering direction | Main question |
|---|---|---|
| <10 kW/rack | well-managed air generally straightforward | airflow discipline |
| 10–20 kW/rack | containment + optimized room/in-row | hotspot and fan energy |
| 20–40 kW/rack | close-coupled / RDHx / advanced air; liquid-ready strongly considered | local heat concentration |
| 40–80 kW/rack | liquid-assisted or D2C becomes a strong candidate | capture ratio and facility interface |
| 80–150+ kW/rack | purpose-built liquid normally becomes central to design | TCS/FWS/resilience |
| >150 kW/rack | OEM-specific rack-scale liquid architecture; central/in-row CDU and facility redesign likely | future platform envelope |

**Boundary:** These are SpecBridge planning bands, not ASHRAE/TIA/ISO limits.

---

# 52. Architecture comparison matrix

| Criterion | Room Air | In-Row / Close Coupled | RDHx | D2C | Immersion |
|---|---|---|---|---|---|
| Existing IT compatibility | Very high | Very high | High | OEM liquid platform | Specialized |
| Retrofit friendliness | High | High | High | Medium | Low |
| Density scalability | Low–medium | Medium–high | High | Very high | Very high |
| Residual room airflow | Full | Full | Reduced | OEM-dependent | Low |
| Liquid near rack | Maybe | Often | Yes | Yes | Yes |
| TCS required | No | Not always | Often | Yes | Architecture-specific |
| Service familiarity | Highest | High | Medium-high | Medium | Specialized |
| AI rack fit | Limited at extreme density | Medium | Strong hybrid | Primary path | Use-case specific |
| Heat reuse potential | Low-grade | Low/medium | Medium | High with warm loop | High depending fluid/temp |
| Common-mode risk | room/plant | row/plant | CDU/header | CDU/TCS | tank/fluid/secondary loop |

---

# 53. Heat-rejection decision matrix

| Site condition | Strong candidates | Watch-outs |
|---|---|---|
| Hot / water constrained | dry cooler, air-cooled chiller, warm-liquid | peak ambient and footprint |
| Cool / temperate | dry cooler + economization, water-side economizer | freeze protection |
| Water available / energy cost high | water-cooled chiller / evaporative optimization | WUE and treatment |
| Retrofit without facility water | liquid-to-air/refrigerant CDU | condenser capacity and redundancy |
| District heat sink available | warm D2C + heat reuse interface | temperature match and seasonality |

---

# 54. Scale decision matrix

| IT scale | Cooling architecture tendency | Golden design focus |
|---|---|---|
| 50–200 kW | DX/room/in-row; micro liquid where required | simplicity and maintainability |
| ~500 kW | hybrid air + close-coupled; modular plant | zoning and growth |
| 1–2 MW | chilled water or distributed DX; dedicated liquid blocks plausible | failure domains and interfaces |
| ~5 MW | central/industrialized plant, modular CDUs, hybrid white space | phasing and plant resilience |
| 20+ MW | campus-scale heat rejection + repeatable liquid/air blocks | utility/water/supply chain/heat reuse |

**Boundary:** Scale does not determine cooling technology by itself; rack density and climate can dominate.

---

# 55. Use-case decision matrix

| Use case | Likely thermal strategy | Primary driver |
|---|---|---|
| Branch / Edge | DX, in-row, micro-DC close coupled | simplicity / remote ops |
| Enterprise mixed IT | contained air + liquid-ready zones | compatibility |
| Colocation | flexible air + RDHx/D2C-ready service zones | tenant variability |
| Cloud / hyperscale | optimized air + industrialized liquid blocks | fleet standardization |
| HPC | D2C / warm-water common | sustained density |
| AI training | rack-scale liquid dominant | accelerator heat flux |
| AI inference mixed | hybrid air + liquid depending platform | workload diversity |

---

# 56. Retrofit decision matrix

| Constraint | Recommended question |
|---|---|
| No chilled water | Can liquid-to-air CDU or dry-cooler loop be added? |
| Existing chilled water too cold | Is dew-point control/secondary mixing required? |
| Existing chilled water too warm | Does OEM W-class / CDU approach support it? |
| No pipe route | Can overhead sidecar/RDHx or dedicated pod solve? |
| Weak slab | Can CDU/manifold location be moved out of white space? |
| Limited maintenance window | Can factory-integrated liquid racks reduce field work? |
| Legacy air + new AI | Can thermally segmented hybrid zones coexist? |

---

# 57. Risk matrix

| Risk | Failure mechanism | Consequence | Primary control |
|---|---|---|---|
| Air recirculation | poor containment | hotspot / throttling | airflow measurement + containment |
| Common chilled header | single hydraulic path | multi-row outage | isolation / redundant path |
| CDU failure | pump/control/HX | many racks lose flow | redundancy + zoning + ride-through |
| QD leak | connector/service defect | electronics exposure | approved QD + detection + isolation |
| Fluid degradation | chemistry/material issue | corrosion/blockage | sampling + OEM chemistry |
| Condensation | supply below dew point | moisture | warm-water/reset/dew-point control |
| Flow imbalance | hydraulic mismatch | tray overheating | balancing + telemetry |
| Control hunting | competing loops | unstable temps/flow | hierarchy/tuning |
| Residual air omitted | D2C capture <100% | board/PSU overheating | OEM capture data + air path |
| Water scarcity | evaporative dependence | operational restriction | WUE/site water strategy |
| Chillerless assumption | insufficient ambient/approach margin | summer capacity loss | hourly climate model |
| Heat reuse dependency | external sink unavailable | no heat rejection path | reuse must not be sole sink unless engineered |
| Service ownership gap | IT/facility boundary unclear | delayed incident response | RACI + SOP/MOP/EOP |
| Future rack uplift | plant/TCS undersized | stranded hall | density roadmap / reserved interfaces |

---

# 58. Failure-mode analysis

## F1 — CRAH/CRAC fan failure

Check adjacent unit capacity, airflow redistribution and local hotspot behavior.

## F2 — Chiller unavailable

Check N+1 plant state, economizer availability and current IT load.

## F3 — Pump failure

Check automatic standby start, pressure transient and control response.

## F4 — Cooling tower/dry cooler unavailable

Check heat-rejection remaining capacity at design ambient.

## F5 — CDU pump/control failure

Check redundant pump/CDU behavior and rack thermal ride-through.

## F6 — HX fouling

Check approach-temperature degradation and alarm threshold.

## F7 — TCS leak

Check detection, isolation and blast radius.

## F8 — Manifold branch blockage

Check per-rack flow telemetry and bypass/isolation.

## F9 — QD incomplete engagement

Check leak/flow detection and service procedure.

## F10 — Coolant chemistry out of range

Check sampling, inhibitor/corrosion response and vendor escalation.

## F11 — Dew point excursion

Check supply reset and condensation interlocks.

## F12 — BMS/CDU control network failure

Check autonomous local control and safe fallback.

## F13 — Utility power loss

Check UPS-backed cooling controls/pumps and generator restoration sequence.

## F14 — Rapid AI load step

Check flow/temperature control response and throttling margin.

## F15 — Expansion tie-in

Check whether new headers/valves can be connected without violating accepted cooling resilience.

---

# 59. State-based commissioning matrix

| State | What must be demonstrated |
|---|---|
| Normal | all racks inside environmental envelope |
| Low load | stable control without hunting/overcooling |
| Design load | terminal + plant capacity and margin |
| Peak rack | local inlet/coolant conditions maintained |
| One unit unavailable | redundant capacity redistributes correctly |
| One path maintenance | critical load remains supported where required |
| CDU loss | automatic response / workload behavior |
| Pump transfer | no damaging pressure/flow transient |
| Heat rejection degradation | acceptable temperatures at design ambient |
| Leak alarm | detection, isolation, notification |
| Power transfer | cooling continuity through utility→generator state |
| Return-to-normal | safe sequencing, no simultaneous trip |
| Expansion state | future block connection without breaking active service |

---

# 60. Energy and sustainability metrics

## PUE — ISO/IEC 30134-2:2026

**FACT**

PUE quantifies total data-center energy relative to IT equipment energy. 2026 edition updates measurement/reporting guidance.

## CER — ISO/IEC 30134-7:2023

**FACT**

Cooling Efficiency Ratio quantifies energy efficiency of electrically powered cooling systems controlling data-center space temperature.

## WUE — ISO/IEC 30134-9:2022

**FACT**

Quantifies data-center water intensity; edition 2 is under development.

## ERF — ISO/IEC 30134-6:2021

**FACT**

Energy Reuse Factor quantifies reused energy as a fraction of total data-center energy; edition 2 entered development in 2026.

**SPECBRIDGE INTERPRETATION:** No single KPI should optimize the design in isolation. Lower PUE achieved with high local water stress, poor resilience or unusable heat-reuse assumptions is not automatically the better architecture.

---

# 61. Heat reuse

Higher coolant return temperatures can improve heat-reuse usefulness.

Potential sinks:

- district heating
- adjacent buildings
- industrial/process loads
- domestic hot-water preheat
- greenhouse/agriculture

Constraints:

- heat temperature grade
- distance
- seasonal demand
- uptime alignment
- heat-pump requirement
- commercial ownership

OCP Heat Reuse project now maintains design/economics/policy workstreams and published reference-design material.

**Golden rule:** heat reuse is an additional value path; unless explicitly engineered otherwise it must not become the only safe heat-rejection path.

---

# 62. CAPEX model

Cooling CAPEX should separate:

- terminal cooling
- chillers / heat rejection
- pumps
- piping
- CDU
- manifolds/QD
- containment
- controls
- leak detection
- structural/white-space changes
- commissioning
- water treatment
- future reserved capacity

Liquid cooling may reduce air-system size while adding TCS/CDU infrastructure. Therefore “liquid is cheaper/more expensive” without full system boundary is meaningless.

---

# 63. OPEX model

OPEX drivers:

- compressor kWh
- fan kWh
- pump kWh
- water
- water treatment
- refrigerant service
- fluid sampling/replacement
- filters
- CDU service
- downtime risk
- spares
- labor skill

Warm-water liquid architecture can expand economization and reduce compressor energy, but pumping/control and maintenance costs remain real.

---

# 64. Lifecycle / TCO

OCP provides an open liquid-cooled data-center TCO model intended to compare CAPEX and OPEX scenarios for new builds and retrofits.

**ENGINEERING GUIDANCE:** TCO model should include at least:

- IT refresh cycle
- facility life
- density growth
- water/energy price scenarios
- equipment replacement
- future chiller/TCS expansion
- stranded capacity
- downtime consequence

---

# 65. Procurement data contract

Before a cooling architecture is frozen, obtain from IT/OEM:

- rack max/typical power
- air/liquid heat split
- inlet-air requirement
- liquid class / coolant supply range
- required flow per rack/tray
- Δp
- coolant chemistry
- QD/manifold spec
- allowed transient conditions
- dew-point requirement
- service procedure
- warranty boundaries

From facility/cooling vendor:

- capacity at project design ambient
- approach temperatures
- part-load efficiency
- pump/fan curves
- redundancy topology
- controls sequence
- maintenance isolation
- water/refrigerant consumption
- sound/structural requirements

---

# 66. Design deliverables

A Golden cooling package should contain:

1. rack density map
2. heat-capture map
3. air/liquid fraction schedule
4. cooling PFD
5. FWS/TCS hydraulic schematic
6. CDU/manifold topology
7. heat-rejection topology
8. redundancy/failure-domain diagram
9. controls narrative
10. sensor/telemetry schedule
11. water/fluid quality schedule
12. leak-detection plan
13. room CFD or equivalent airflow validation where warranted
14. hydraulic calculations
15. annual energy/water model
16. commissioning/IST matrix
17. SOP/MOP/EOP interfaces
18. future density / expansion plan

---

# 67. Common mistakes

1. Cooling’i tonnage veya total MW hesabına indirgemek.
2. Average rack density kullanmak.
3. Room temperature’ı rack inlet yerine primary KPI yapmak.
4. Hotspot’u daha düşük supply temperature ile çözmeye çalışmak.
5. Liquid cooling = chilled water demek.
6. D2C = 100% heat capture varsaymak.
7. FWS ile TCS’yi aynı chemistry/pressure domain kabul etmek.
8. CDU’yu yalnız pump box olarak görmek.
9. CDU/common header failure blast radius’ı modellememek.
10. QD/manifold pressure drop’u geç düşünmek.
11. OEM coolant chemistry yerine generic water spec yazmak.
12. Dew-point control’ü ihmal etmek.
13. “W45 = chiller yok” sonucunu climate model olmadan çıkarmak.
14. Liquid cooling’in electrical ride-through kadar thermal ride-through’a sahip olduğunu varsaymak.
15. Water consumption ile water inventory’yi karıştırmak.
16. PUE’yi tek sustainability KPI yapmak.
17. Heat reuse’i guaranteed business case saymak.
18. Retrofit pipe route/structural load’u geç çözmek.
19. IT ve facilities maintenance RACI’sini tanımlamamak.
20. AI hall’a yalnız daha büyük CRAC ekleyerek future-proof olduğunu düşünmek.

---

# 68. Cooling architecture decision tree

```text
START
  ↓
What is the workload / IT platform environmental requirement?
  ↓
What is rack-by-rack density and future density?
  ↓
Can air remove the peak heat with acceptable airflow/fan energy?
  ├─ YES → contained air / close-coupled options
  └─ NO / MARGINAL
        ↓
Is IT platform liquid-capable?
  ├─ NO → RDHx / enhanced air / platform change
  └─ YES
        ↓
What liquid capture ratio and residual air remain?
        ↓
Define TCS/FWS and CDU architecture
        ↓
Match ASHRAE/OEM liquid class + CDU approach to climate
        ↓
Select heat rejection: chiller / dry / evaporative / hybrid / economizer
        ↓
Validate water, energy, resilience and thermal ride-through
        ↓
Commission all maintenance/fault states
        ↓
FREEZE
```

---

# 69. Key architecture conclusions

1. Cooling architecture begins at the IT equipment requirement, not the mechanical catalog.
2. Heat capture location is as important as cooling-medium selection.
3. ASHRAE W17/W27/W32/W40/W45/W+ classes are equipment/facility interface classes, not site architecture guarantees.
4. D2C, RDHx and immersion are different system boundaries and must not be grouped as one “liquid” option.
5. Residual air heat must be measured/declared for D2C designs.
6. CDU placement defines both hydraulics and failure blast radius.
7. TCS/FWS interface, coolant chemistry and material compatibility are lifecycle controls.
8. Cooling resilience must be assessed as an end-to-end path including heat rejection, power and controls.
9. Thermal ride-through can be much shorter than UPS runtime.
10. PUE, CER, WUE and ERF answer different questions.
11. High-temperature liquid loops can enable economization and heat reuse but only if actual IT platform requirements permit them.
12. Hybrid air+liquid halls are likely to remain a major architecture because workload and refresh cycles are heterogeneous.

---

# 70. Golden Full Briefing — proposed 8 chapter structure

1. **K05-00 — Cooling architecture neden klima seçimi değildir?**
2. **K05-01 — Airflow, containment, CRAC/CRAH ve close-coupled cooling**
3. **K05-02 — DX, chilled water, economization ve heat rejection**
4. **K05-03 — Direct-to-chip, RDHx ve immersion farkları**
5. **K05-04 — FWS, TCS, CDU, manifold, QD ve coolant chemistry**
6. **K05-05 — Density, hydraulics, dew point ve AI thermal design**
7. **K05-06 — Resilience, controls, thermal ride-through ve commissioning**
8. **K05-07 — Energy, water, retrofit, TCO ve hangi mimari ne zaman?**

Narration must preserve Quick Brief as a separate existing mode and should target the accepted S3F long-form production standard rather than a fixed duration.

---

# 71. Golden UI — proposed decision visuals

1. **Thermal Chain & Boundary Map** — chip → rack → TCS → FWS → heat rejection.
2. **Cooling Architecture Selection Matrix** — air / close coupled / RDHx / D2C / immersion.
3. **ASHRAE W-Class & Heat-Rejection Map** — W17 → W+ with site/climate caveat.
4. **Cooling Failure-Domain / Commissioning State Matrix** — terminal → CDU → plant → power/control.

Optional fifth visual:

5. **Density Transition Ladder** — Air → Liquid-ready → Liquid-assisted → D2C hybrid → Liquid-dominant.

---

# 72. Authoritative source register

## Standards / primary engineering references

**R01 — ISO/IEC 22237-4:2021 — Environmental control**  
Class: STANDARD  
https://www.iso.org/standard/78552.html

**R02 — TIA-942-C — May 2024**  
Class: STANDARD  
https://tiaonline.org/standard/tia-942/

**R03 — ASHRAE Publication Updates / Datacom Series**  
Class: PRIMARY ENGINEERING  
https://www.ashrae.org/technical-resources/publication-errata-and-updates

**R04 — ASHRAE Handbook 2023 Chapter 20 — Data Centers and Telecommunications Facilities**  
Class: PRIMARY ENGINEERING  
https://handbook.ashrae.org/Handbooks/A23/SI/A23_Ch20/a23_ch20_si.aspx

**R05 — ASHRAE — Thermal Guidelines Fifth Edition overview**  
Class: PRIMARY ENGINEERING  
https://www.ashrae.org/news/ashraejournal/achieving-high-reliability-energy-efficiency-in-data-center-design-operations

**R06 — ASHRAE AI Data Center Energy Performance Framework — Energy and Thermal Efficiency**  
Class: CURRENT ENGINEERING FRAMEWORK  
https://www.ashrae.org/technical-resources/ai-data-center-framework/energy-and-thermal-efficiency

**R07 — ASHRAE AI Framework — Introduction / liquid W-class mapping**  
Class: CURRENT ENGINEERING FRAMEWORK  
https://www.ashrae.org/technical-resources/ai-data-center-framework/introduction-and-purpose

**R08 — ANSI/ASHRAE Standard 90.4-2022 fact sheet**  
Class: STANDARD SUMMARY  
https://www.ashrae.org/file%20library/about/government%20affairs/advocacy%20toolkit/virtual%20packet/standard-90.4-2022-fact-sheet.pdf

**R09 — ISO/IEC 30134-2:2026 — PUE**  
Class: STANDARD  
https://www.iso.org/standard/30134-2

**R10 — ISO/IEC 30134-7:2023 — CER**  
Class: STANDARD  
https://www.iso.org/standard/80493.html

**R11 — ISO/IEC 30134-9:2022 — WUE**  
Class: STANDARD  
https://www.iso.org/standard/77692.html

**R12 — ISO/IEC AWI 30134-9 — WUE Edition 2 under development**  
Class: STANDARD DEVELOPMENT STATUS  
https://www.iso.org/standard/89593.html

**R13 — ISO/IEC 30134-6:2021 — ERF**  
Class: STANDARD  
https://www.iso.org/standard/71717.html

**R14 — ISO/IEC AWI 30134-6 — ERF Edition 2 under development**  
Class: STANDARD DEVELOPMENT STATUS  
https://www.iso.org/standard/94620.html

## Open Compute Project — liquid cooling ecosystem

**R15 — OCP Cooling Environments Project**  
Class: OPEN ENGINEERING ECOSYSTEM  
https://www.opencompute.org/community/cooling-environments

**R16 — OCP Cold Plate Sub-Project**  
Class: OPEN ENGINEERING ECOSYSTEM  
https://www.opencompute.org/community/cold-plate

**R17 — OCP CDU Sub-Project**  
Class: OPEN ENGINEERING ECOSYSTEM  
https://www.opencompute.org/community/coolant-distribution-unit

**R18 — OCP Door Heat Exchanger Sub-Project**  
Class: OPEN ENGINEERING ECOSYSTEM  
https://www.opencompute.org/wiki/Cooling_Environments/Door_Heat_Exchanger

**R19 — OCP Heat Reuse Project**  
Class: OPEN ENGINEERING ECOSYSTEM  
https://www.opencompute.org/index.php/community/heat-reuse

**R20 — OCP Project Deschutes CDU v1.0 draft — 2026**  
Class: OPEN REFERENCE DESIGN / CURRENT  
https://www.opencompute.org/documents/ocp-specification-deschutes-v1-0-pdf

**R21 — OCP Shipping and Storage of 1-Phase Coldplate Liquid-Cooled Racks and Servers — March 2026**  
Class: OPEN ENGINEERING GUIDANCE / CURRENT  
https://www.opencompute.org/documents/considerations-for-shipping-and-storage-of-1-phase-coldplate-liquid-cooled-racks-and-servers-final-march-2026-pdf

**R22 — OCP Cold Plate workstream / fluid and QD references**  
Class: OPEN ENGINEERING GUIDANCE  
https://www.opencompute.org/wiki/Cooling_Environments/Cold_Plate

**R23 — ASHRAE + OCP alliance — October 2025**  
Class: INDUSTRY STANDARDS COLLABORATION  
https://www.opencompute.org/blog/open-compute-project-foundation-and-ashrae-form-new-alliance

**R24 — OCP Liquid-Cooled Data Center TCO Model**  
Class: OPEN DECISION TOOL  
https://www.opencompute.org/products/735/total-cost-of-ownership-model-for-liquid-cooled-data-centers

## Resilience / operating practice

**R25 — Uptime Intelligence — Resiliency considerations with direct liquid cooling — 2023**  
Class: INDEPENDENT ENGINEERING / RESILIENCE  
https://intelligence.uptimeinstitute.com/resource/resiliency-considerations-direct-liquid-cooling

**R26 — Uptime Intelligence — Consensus and confusion in liquid cooling maintenance — June 2026**  
Class: INDEPENDENT CURRENT OPERATIONS RESEARCH  
https://intelligence.uptimeinstitute.com/resource/consensus-and-confusion-liquid-cooling-maintenance

**R27 — Uptime — Close Coupled Cooling and Reliability**  
Class: INDEPENDENT ENGINEERING / RESILIENCE  
https://journal.uptimeinstitute.com/close-coupled-cooling-reliability/

**R28 — Uptime — DLC sustainability/resilience discussion**  
Class: INDEPENDENT ENGINEERING INTERPRETATION  
https://journal.uptimeinstitute.com/dlc-will-not-come-to-the-rescue-of-data-center-sustainability/

## Vendor / operator technical examples — not standards

**R29 — Schneider Electric WP133 V2 — Navigating Liquid Cooling Architectures for AI Workloads — 2025**  
Class: VENDOR ENGINEERING GUIDANCE  
https://www.se.com/us/en/download/document/SPD_WP133_EN/

**R30 — Schneider Electric WP210 V1.1 — Direct Liquid Cooling System Challenges — 2025**  
Class: VENDOR ENGINEERING GUIDANCE  
https://www.se.com/us/en/download/document/SPD_WP210_EN/

**R31 — Vertiv CoolChip CDU family**  
Class: VENDOR PRODUCT EXAMPLE  
https://www.vertiv.com/tr-emea/products-catalog/thermal-management/high-density-solutions/vertiv-coolchip-cdu/

**R32 — Vertiv CoolChip Econophase CDU**  
Class: VENDOR PRODUCT / RETROFIT EXAMPLE  
https://www.vertiv.com/tr-emea/products-catalog/thermal-management/high-density-solutions/vertiv-coolchip-econophase-cdu/

**R33 — NVIDIA GB300 NVL72**  
Class: IT OEM PRODUCT EXAMPLE  
https://www.nvidia.com/en-us/data-center/gb300-nvl72/

**R34 — NVIDIA DGX GB rack-scale hardware guide**  
Class: IT OEM TECHNICAL REFERENCE  
https://docs.nvidia.com/dgx/dgxgb200-user-guide/hardware.html

**R35 — NVIDIA GB200 NVL72 OCP design contribution — 120 kW cooling example**  
Class: IT OEM / OPEN DESIGN EXAMPLE  
https://developer.nvidia.com/blog/?p=90182

**R36 — NVIDIA Enterprise Reference Architecture — GB300 NVL72**  
Class: IT OEM REFERENCE ARCHITECTURE  
https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/overview.html

**R37 — NVIDIA GTC 2026 Rubin-era architecture session — >200 kW / 45°C example**  
Class: VENDOR/PARTNER FUTURE-GENERATION EXAMPLE  
https://www.nvidia.com/en-us/on-demand/session/gtc26-s82216/

---

# 73. Research acceptance checklist

- [x] Air cooling architecture
- [x] CRAC / CRAH / raised floor / slab / containment
- [x] Close-coupled / in-row
- [x] DX vs chilled water
- [x] Heat rejection and economization
- [x] ASHRAE W17/W27/W32/W40/W45/W+ classes
- [x] D2C / cold plate
- [x] RDHx
- [x] Immersion
- [x] Residual air heat
- [x] FWS / TCS boundary
- [x] CDU placement/scaling
- [x] Manifold / QD
- [x] Fluid chemistry / material compatibility
- [x] Hydraulics / flow / Δp / approach temperature
- [x] Dew point / condensation
- [x] Cooling redundancy / failure domains
- [x] Thermal ride-through
- [x] Controls / monitoring / leak detection
- [x] Commissioning / IST states
- [x] Retrofit / greenfield / mixed-density
- [x] AI high-density roadmap
- [x] PUE / CER / WUE / ERF
- [x] Heat reuse
- [x] CAPEX / OPEX / TCO
- [x] Comparison, scale, use-case, retrofit and risk matrices
- [x] Failure-mode analysis
- [x] 8-chapter Full Briefing outline
- [x] Golden UI visual plan
- [x] Authoritative source register

---

# 74. Research freeze statement

`DC_K05_GOLDEN_DEEP_RESEARCH = COMPLETE`

Cooling technology shall be selected **from the workload outward**. Air, close-coupled, rear-door, direct-to-chip and immersion are heat-capture mechanisms inside a larger thermal system. The accepted architecture is the one that:

- keeps actual IT inlet/coolant conditions inside OEM/ASHRAE requirements;
- carries the expected rack-by-rack heat distribution, not merely average hall load;
- exposes FWS/TCS, CDU, manifold, hydraulics and residual-air boundaries;
- survives the required maintenance/fault states with a proven thermal ride-through strategy;
- matches site climate, water and energy constraints;
- provides measurable controls, commissioning evidence and service ownership;
- supports the next IT refresh without forcing a facility redesign that should have been anticipated.

Next production gate:

`DC-K05 FULL NARRATION TR V2 → SOURCE QA → S3F FULL AUDIO 8/8 → GOLDEN UI → PAGES → FREEZE`