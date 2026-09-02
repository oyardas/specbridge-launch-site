# DC-K07 — Facility & Building Architecture

**Track:** Facility & Building  
**Golden research state:** DEEP RESEARCH BASELINE  
**Language:** Turkish  
**Position in curriculum:** DC-K07  
**Primary question:** Veri merkezi binası, IT ve MEP ekipmanını barındıran pasif bir kabuk mudur; yoksa availability, maintainability, security, safety, logistics ve future-density davranışını belirleyen aktif bir mühendislik katmanı mıdır?

---

## 0. Executive conclusion

Bir veri merkezi binası yalnızca rack, UPS ve cooling ekipmanının konulduğu bir shell değildir. **Bina; failure-domain sınırlarını, fiziksel A/B ayrışmasını, servis ve değiştirme yollarını, yangın/su/fiziksel güvenlik zonlarını, white-space ölçeklenebilirliğini, taşıma kapasitesini, liquid-cooling readiness’i ve canlı tesiste büyüme kabiliyetini belirleyen availability sisteminin fiziksel katmanıdır.**

Bu nedenle doğru sıra şudur:

`BUSINESS / SLA → SITE RISK → PROJECT CONDITION → BUILDING FORM → FUNCTIONAL ZONING → STRUCTURAL ENVELOPE → PHYSICAL PATH DIVERSITY → FIRE / WATER / SECURITY COMPARTMENTS → LOGISTICS / REPLACEMENT → WHITE-SPACE & TECHNICAL ROOMS → AI / LIQUID READINESS → EXPANSION / LIVE-SITE PHASING → COMMISSIONING → OPERATIONS → FREEZE`

**Ana karar:** “Bina tamam, içine data center koyalım” yaklaşımı Golden tasarım değildir. Building architecture en başta power, cooling, telecom, security, fire, operations ve IT-density ile birlikte tasarlanmalıdır. ISO/IEC 22237-2:2024; location/site selection, environmental risk, site/building configuration, access, intrusion, fire ve water-damage protection konularını building-construction kapsamına açıkça dahil eder. TIA-942-C mimariyi power, cooling, fire protection, safety, physical security ve telecommunications ile birlikte ele alır. Uptime Institute da değerlendirme bileşenleri içinde structural factors, building characteristics, site location, distribution paths, critical spaces, fire protection ve outdoor environment başlıklarını ayrı ayrı sayar. [R01][R02][R03][R04]

---

# A. Evidence language and research rules

## 1. Evidence labels

Bu dokümanda her teknik ifade aşağıdaki sınıflardan biriyle okunmalıdır:

- **FACT** — standard, code, formal engineering publication veya açık primary source tarafından desteklenen doğrulanabilir ifade.
- **ENGINEERING GUIDANCE** — standardın tek bir zorunlu değeri olmadığı durumda vendor-neutral iyi uygulama veya tasarım yöntemi.
- **VENDOR CLAIM** — üretici/reference-design kaynağındaki performans, delivery veya mimari iddia; universal standard değildir.
- **SPECBRIDGE INTERPRETATION** — birden fazla kaynağın sistem seviyesinde birleştirilmesi.
- **DECISION GUIDANCE** — proje şartlarına göre seçim yapmaya yardım eden vendor-neutral karar çerçevesi.

## 2. Non-negotiable research discipline

1. Yerel building, fire, seismic, occupational safety ve environmental mevzuat her projede ayrıca doğrulanmalıdır.
2. Uptime Tier ile building code aynı şey değildir; Uptime kendi sitesinde building code, regional weather, security ve property usage gibi konuların ayrıca ele alınması gerektiğini belirtir. [R05]
3. BICSI/TIA/ISO/IEC/Uptime aynı soruyu aynı kapsamla cevaplamaz; birbirinin yerine kullanılmamalıdır. [R01][R02][R03][R04][R06]
4. Vendor reference design performansı yalnız örnektir; generic threshold değildir.
5. Floor-load, aisle width, clear height, fire rating, flood elevation ve structural/seismic sayıları project/AHJ/structural engineer doğrulaması olmadan “global data-center standardı” olarak dondurulmaz.
6. AI-ready ifadesi tek başına bir rack-density veya floor-load sayısı değildir.

---

# B. Canonical facility taxonomy

## 3. Five-axis canonical taxonomy

### Axis A — Project condition

- **Greenfield** — yeni saha/yeni bina.
- **Brownfield** — mevcut kampüs veya binada significant new data-center construction.
- **Retrofit** — mevcut data-center veya technical facility içinde yeni load/density/architecture adaptasyonu.
- **Live-site expansion** — çalışan data-center’ın kesintisiz veya kontrollü riskle genişletilmesi.

### Axis B — Building form

- Purpose-built reinforced building
- Multi-storey purpose-built data center
- Converted industrial/commercial building
- Prefabricated building / hall
- Containerized / modular facility block
- Room-within-a-room / hardened room
- Edge / micro facility
- Hybrid campus

### Axis C — Functional layer

- Site/perimeter
- Building envelope
- Security/access
- Logistics/loading
- White space
- Electrical rooms
- UPS/battery/BESS spaces
- Generator/fuel spaces
- Mechanical/cooling spaces
- Telecom/MMR/carrier spaces
- Control/NOC/DCIM/BMS spaces
- Support/operations spaces

### Axis D — Resilience topology

- Shared physical path
- Separated A/B paths
- Compartmentalized A/B plant
- Multiple building blocks
- Multi-building campus
- Distributed availability-zone architecture

### Axis E — Density/readiness

- Traditional air-cooled
- High-density air-cooled
- Hybrid air + liquid
- Direct-to-chip liquid-ready
- Predominantly liquid-cooled AI/HPC
- Future-density adaptable

## 4. Core distinctions

`BUILDING REDUNDANCY ≠ EQUIPMENT REDUNDANCY`

`A/B ELECTRICAL ≠ A/B PHYSICAL PATH DIVERSITY`

`TWO ROOMS ≠ TWO FAILURE DOMAINS`

`HIGH FLOOR LOAD ≠ AI-READY`

`RAISED FLOOR ≠ DATA CENTER`

`SLAB-ON-GRADE ≠ AUTOMATICALLY BETTER`

`FIRE COMPARTMENT ≠ AVAILABILITY COMPARTMENT`

`WATER DETECTION ≠ WATER-RISK ELIMINATION`

`SECURITY MANTRAP ≠ COMPLETE PHYSICAL SECURITY`

`MODULAR BUILDING ≠ CONTAINERIZED DATA CENTER`

---

# C. Why building architecture is part of availability

## 5. Failure-domain principle

**SPECBRIDGE INTERPRETATION:** A redundant UPS, chiller, pump, bus or carrier route only provides intended resilience if the building prevents one physical event from disabling both paths.

Typical shared physical failure domains:

- same fire compartment;
- same pipe gallery;
- same cable riser;
- same ceiling/service zone;
- same flood level;
- same access corridor;
- same loading/replacement route;
- same structural bay;
- same exterior exposure;
- same control room;
- same utility entry trench.

## 6. Uptime implication

Uptime Tier is performance-based and differentiates site-infrastructure topology through capacity components and distribution paths. Structural factors, building characteristics, critical spaces, site location, outdoor environment, fire protection and distribution paths appear among evaluation components. Therefore, physical layout can invalidate an apparently redundant MEP diagram. [R04][R05]

## 7. ISO/IEC implication

ISO/IEC 22237-1 frames availability, security and energy efficiency across planned lifetime; Part 2 explicitly covers site/building construction, access, intrusion, fire and water protection. Building decisions therefore belong to lifecycle risk analysis, not just architectural aesthetics. [R01][R02]

---

# D. Site-to-building decision chain

## 8. Site risk before floor plan

**FACT:** ISO/IEC 22237-2 includes location/site selection, natural environment, adjacencies and protection from environmental risk in its scope. [R02]

Before a floor plan is frozen, evaluate:

- flood/pluvial/river/coastal exposure;
- seismicity and soil/geotechnical condition;
- extreme wind/storm/tornado where relevant;
- wildfire/smoke/dust/industrial contamination;
- adjacent hazardous occupancies;
- airport/rail/highway risk where relevant;
- utility corridors and easements;
- emergency access;
- water availability and discharge constraints;
- security setback and perimeter geometry;
- future campus expansion land.

## 9. Flood and water risk

FEMA critical-facility guidance demonstrates that flood risk must be assessed using event probability/depth and loss-of-service consequences, not a binary “in flood zone / not in flood zone” checkbox. [R21]

**ENGINEERING GUIDANCE:** Critical electrical/IT functions should not be located at low elevations merely because space is convenient. Project-specific flood levels, drainage, surface runoff, below-grade penetrations and pump dependence must be studied together.

## 10. Adjacent-risk principle

A site can have excellent utility capacity yet poor resilience because of neighboring industrial fire/explosion risk, fuel storage, uncontrolled public access, construction exposure or shared drainage. Site selection must include adjacency risk, not just land price and MW availability. [R02]

---

# E. Building-form decision

## 11. Purpose-built single-storey

Typical strengths:

- direct structural load path;
- simpler heavy-equipment logistics;
- easier high-bay/service-zone planning;
- reduced vertical riser dependence;
- strong AI/liquid-cooling adaptability.

Typical constraints:

- land-intensive;
- longer horizontal distribution;
- large roof/exterior exposure;
- site circulation must be carefully separated.

## 12. Multi-storey data center

Potential advantages:

- land efficiency;
- city/urban deployment;
- repeatable floor blocks;
- possible operational separation by floor.

Risks:

- structural loading and vibration;
- vertical risers becoming shared failure domains;
- freight-elevator dependence;
- replacement-path complexity;
- liquid distribution/drainage consequences across levels;
- roof/plant distribution decisions.

**DECISION GUIDANCE:** “One floor = one data center” is an architecture choice, not an automatic resilience property. Vendor claims must be validated by actual system independence. [R27]

## 13. Converted industrial/commercial building

Evaluate at minimum:

- existing structural capacity;
- column grid;
- clear height;
- floor flatness and penetrations;
- roof capacity;
- fire compartmentation;
- loading dock/freight path;
- generator/chiller/dry-cooler placement;
- MMR diversity;
- buried utilities;
- hazardous legacy materials;
- live-neighbor operational risk.

## 14. Prefabricated/hybrid building

Prefabrication can shorten site work and improve factory quality, but site civils, foundations, utility tie-ins, access, lifting, fire strategy and commissioning remain project-specific. K02 modularity rules remain authoritative: prefabricated, modular and containerized are not synonyms.

## 15. Room-within-a-room

Rittal’s high-availability room is an example of a tested integrated enclosure system with protection claims for the complete room construction. This is **VENDOR CLAIM / product architecture**, useful when existing-building risks must be compartmentalized; it does not replace whole-building/site analysis. [R28]

---

# F. Functional zoning

## 16. Canonical building zones

A Golden building program should explicitly allocate:

1. secure perimeter and gate;
2. visitor/staff security reception;
3. loading/staging/quarantine;
4. white-space halls;
5. network/MMR/carrier rooms;
6. UPS/power distribution rooms;
7. battery/BESS rooms or dedicated outdoor zones;
8. generator/fuel system areas;
9. cooling/mechanical rooms;
10. pump/CDU/water-treatment zones;
11. NOC/DCIM/BMS/EPMS operations;
12. spares/workshop/maintenance;
13. staff/welfare areas;
14. fire-control/emergency response interfaces;
15. future expansion/reserved interfaces.

## 17. Dirty-to-clean logistics flow

Recommended logical sequence:

`SITE ENTRY → SECURITY CHECK → LOADING → RECEIVING → QUARANTINE / UNPACK → STAGING → FREIGHT PATH → WHITE SPACE`

Do not force incoming crates, waste, contractor materials and operational staff through the same route where avoidable.

## 18. Visitor-to-critical-space flow

`PUBLIC → CONTROLLED → RESTRICTED → CRITICAL`

Security architecture should progressively restrict access rather than rely on a single door/mantrap.

## 19. Operations-to-plant flow

Maintenance paths should allow technicians to reach electrical/mechanical plant without unnecessary passage through white space. Conversely, critical plant replacement should not require dismantling live IT rows.

---

# G. White-space architecture

## 20. What white space must provide

White space is not just net rack area. It must support:

- rack footprints and service clearances;
- power busway/cable trays;
- network pathways;
- air containment or liquid distribution;
- CDU/RDHx/fan-wall interfaces where used;
- leak detection and drainage strategy;
- fire detection/suppression;
- lighting and life safety;
- equipment handling/turning paths;
- future density transitions.

## 21. Pod and hall boundaries

Smaller repeatable pods can improve phasing and fault isolation; very large halls can improve space efficiency and flexibility. The correct choice depends on tenant/workload, power/cooling topology, operations and expansion strategy.

## 22. Column-grid implications

Columns affect rack rows, containment, overhead busway, cable routes, pipe headers, maintenance aisles and future reconfiguration. A generic building grid should not be frozen before IT-space planning.

## 23. Clear-height principle

AI/high-density facilities may require larger overhead service zones for busway, large cable bundles, liquid headers, leak trays, fire systems and structural supports. ASHRAE’s integrated-design framework explicitly notes higher ceilings and extensive liquid distribution as AI facility implications. [R08]

## 24. Raised floor vs slab

### Raised floor can provide

- underfloor air/plenum in relevant architectures;
- underfloor cable/piping flexibility;
- localized service access.

### Slab can provide

- direct support for heavy equipment;
- simpler anchoring;
- overhead distribution flexibility;
- reduced dependence on floor-tile structural behavior.

**DECISION GUIDANCE:** Choose based on airflow, structural loading, piping/cabling philosophy, leak risk, serviceability and retrofit constraints. Do not treat raised floor as a data-center certification requirement.

## 25. AI shift

ASHRAE’s current AI framework says AI racks are becoming significantly heavier and that reinforced slab-on-grade, seismic anchoring where required, higher ceilings, liquid distribution, leak detection and containment are increasingly relevant design considerations. These are **current engineering trends**, not one-size-fits-all mandatory geometry values. [R08]

---

# H. Structural engineering

## 26. Structural load categories

At minimum distinguish:

- uniformly distributed load;
- concentrated rack/equipment load;
- rolling load during installation;
- point load from casters/feet;
- dynamic/vibration load;
- suspended overhead services;
- roof plant loads;
- seismic/wind loads;
- future load reserve.

## 27. Rack weight is not the only structural question

The structure must support the entire equipment route:

`TRUCK / DOCK → STAGING → FREIGHT ELEVATOR / RAMP → CORRIDOR → DATA HALL → FINAL POSITION`

A strong data-hall slab is insufficient if the loading dock, elevator or corridor cannot carry the equipment.

## 28. OCP evidence

OCP Ready site assessments include physical facility requirements for deploying OCP gear and historically added rolling/concentrated-load criteria. The program demonstrates that physical handling/load compatibility is a recognized facility-readiness dimension. Project design still requires current assessment documents and structural-engineer confirmation. [R13][R14]

## 29. Seismic anchoring

AI racks can have high mass and center of gravity. Seismic design must follow the applicable jurisdictional structural code and project importance category. “Bolt the rack” alone is not a complete seismic design; rack, anchorage, slab, overhead busway, piping and flexible connections must be coordinated.

## 30. Vibration

Generator sets, pumps, chillers, cooling towers/dry coolers and construction activity can introduce vibration. Sensitive storage/IT equipment and high-speed networking may require project-specific vibration review.

---

# I. Building envelope

## 31. Envelope responsibilities

The envelope must manage:

- rain/wind-driven water;
- thermal transfer;
- air infiltration;
- dust/contaminants;
- physical intrusion;
- fire/smoke separation;
- maintenance access;
- roof penetrations;
- lifecycle weathering.

## 32. Roof risk

Roofs often carry cooling equipment, pipework, penetrations and drainage. Water ingress above live IT/electrical spaces can become a common-mode failure. Roof drainage, overflow, waterproofing, curbs and penetration management must be part of data-center risk review.

## 33. Exterior-wall adjacency

Critical rooms adjacent to public roads, uncontrolled yards or impact-prone zones may require additional protection. Security setback, bollards/barriers, blast/impact risk and external service access are project-dependent.

---

# J. Fire and life safety

## 34. Fire strategy is system architecture

Fire protection must consider:

- detection;
- compartmentation;
- suppression;
- smoke management;
- egress;
- emergency power-off philosophy where applicable;
- battery/ESS hazards;
- cable fire load;
- fire-service access;
- post-event recovery.

## 35. NFPA 75 relevance

The public NFPA 75 2020 edition preview includes construction of IT equipment areas, fire protection/detection, utilities, emergency/recovery procedures and modular data centers. It is a formal reference family for IT-space fire protection. **Edition and local adoption must be confirmed with the AHJ for each project.** [R16]

## 36. Fire compartment vs availability compartment

A fire-rated wall can reduce fire spread, but it does not guarantee independent power, cooling, controls or cable paths. Conversely, physically separate A/B paths must still satisfy fire/life-safety rules.

## 37. Battery/BESS boundary

NFPA 855 covers stationary energy storage systems, including commissioning, operations, decommissioning and electrochemical ESS hazards. When UPS battery systems evolve toward larger lithium-ion/BESS architectures, dedicated fire, separation, ventilation, detection and emergency-response requirements can materially affect building layout. [R17]

## 38. Property-loss evidence

FM Data Sheet 5-32 identifies hazards and property-loss-prevention recommendations for data centers and related critical systems/equipment. It is useful as insurer/property-risk guidance and should be separated from code/standard conformance. [R15]

---

# K. Water-risk architecture

## 39. Water sources to map

- roof drains;
- domestic water;
- sprinkler/fire systems;
- chilled/facility water;
- condensate;
- liquid-cooling loops;
- humidification;
- drainage/sewer backflow;
- groundwater;
- flood/runoff;
- adjacent wet services.

## 40. Water zoning

**ENGINEERING GUIDANCE:** Treat every pressurized liquid path above or adjacent to critical equipment as a mapped risk. Where liquid cooling is used, zoning, isolation, leak detection, drainage/containment and operational response become building-level requirements. ASHRAE explicitly calls out enhanced leak detection, zoning and containment for AI liquid distribution. [R08]

## 41. Leak detection is not isolation

Leak sensors only detect. Golden design must also answer:

- what valve closes;
- what area loses cooling;
- how quickly;
- whether isolation itself causes an outage;
- where the leaked fluid goes;
- how the system is restored.

## 42. Drainage without cross-risk

A drain route that passes through another critical zone can move failure rather than eliminate it. Drainage, bunding/trenching, floor slope and leak trays require building-level review.

---

# L. Physical A/B diversity

## 43. Physical-diversity audit

For each A/B system ask:

1. same room?
2. same wall penetration?
3. same riser?
4. same trench?
5. same ceiling zone?
6. same fire compartment?
7. same flood level?
8. same structural bay?
9. same control network?
10. same maintenance access point?

## 44. Electrical rooms

A/B electrical architecture should avoid shared failure domains that defeat the intended topology. Room separation alone is not sufficient if both paths share upstream fuel, controls, risers, cable routes or downstream busway support.

## 45. Mechanical rooms

Cooling redundancy should be assessed end-to-end: terminal units, pumps, headers, heat exchangers, heat rejection, makeup water, controls and building routes.

## 46. Telecom/MMR

Diverse carriers entering one duct bank or one MMR do not create true physical route diversity. Building architecture must reserve independent entrances, risers and meet-me spaces where required by business model.

---

# M. MMR and carrier architecture

## 47. MMR function

Meet-me rooms are interconnection zones between carriers, customer/provider networks and internal structured cabling. They are not ordinary server rooms.

## 48. Dual-MMR principle

Where service requirements justify it, physically separated MMRs and building-entry paths can reduce common-mode telecom failure. Actual independence requires route audit outside as well as inside the building.

## 49. Carrier entrance risk

A diverse carrier logo list is meaningless if fibers converge at the same street chamber, bridge, duct or building penetration.

---

# N. Security architecture

## 50. Layered physical security

Typical layers:

`PERIMETER → VEHICLE CONTROL → SITE ENTRY → RECEPTION → MANTRAP / ACCESS CONTROL → INTERNAL SECURITY ZONE → CRITICAL ROOM → CABINET / CAGE`

ISO/IEC 22237-2 includes access and physical intrusion protection in building-construction scope. [R02]

## 51. Security zoning and operations

Security design must distinguish:

- employees;
- customer tenants;
- vendors;
- delivery personnel;
- maintenance contractors;
- emergency responders.

## 52. Security vs egress

Physical security cannot compromise life-safety egress. Door interlocks, fail-safe/fail-secure behavior and emergency overrides require AHJ/code coordination.

---

# O. Logistics and replacement architecture

## 53. Maintainability starts at the dock

A data center is maintainable only if failed equipment can be removed and replacement equipment can reach its final position safely.

## 54. Replacement-path register

For every major asset record:

- dimensions/weight;
- shipping condition;
- lifting points;
- door sizes;
- corridor width/turning radius;
- elevator/ramp capacity;
- temporary staging;
- isolation needed;
- live-load exposure;
- roof/wall removal requirements.

## 55. “Built-in” equipment risk

If a transformer, UPS, chiller, CDU, switchboard or generator cannot be replaced without demolition or shutting down both A/B paths, the building has embedded lifecycle risk.

## 56. Loading dock separation

Loading areas introduce vehicles, combustible packaging, contractors and external access. They should be zoned and controlled relative to critical operations.

---

# P. Operations spaces

## 57. NOC / control rooms

NOC, BMS, EPMS, DCIM and security monitoring may share data but should not automatically share one physical failure domain. Decide which control functions must remain available during evacuation, fire event or local room failure.

## 58. Workshop and spares

Maintenance work and spare-part storage can create fire load, dust and access risk. Separate workshop/staging from live white space where practical.

## 59. Staff and welfare

Human factors matter. Shift operations need safe access, rest, sanitation and emergency procedures without contaminating or congesting critical technical paths.

---

# Q. AI / high-density facility readiness

## 60. AI-ready is a multidimensional contract

An AI-ready building should be assessed across:

1. structural/rolling load;
2. electrical power density;
3. power distribution space;
4. liquid/air cooling architecture;
5. liquid piping and isolation;
6. leak detection/containment/drainage;
7. overhead/underfloor service capacity;
8. data-cabling density;
9. equipment logistics;
10. commissioning/test-load capability;
11. acoustic/vibration considerations;
12. future expansion.

## 61. ASHRAE integrated-design evidence

ASHRAE’s current AI framework states that AI/HPC drives heavier racks, extensive liquid networks and tighter power/cooling integration; it recommends integrated architectural/electrical/mechanical design and long-term adaptability. [R07][R08]

## 62. Density is not just average kW/rack

Building design needs:

- rack-by-rack peak distribution;
- simultaneous cluster behavior;
- localized structural load;
- pipe/header routing;
- CDU placement;
- residual air heat;
- network cabling concentration;
- service clearances.

## 63. Liquid-ready building boundary

The building must explicitly define the interface among:

`HEAT REJECTION → FWS → HX/CDU → TCS → MANIFOLD → RACK → SERVER`

and the physical zones for each. K05 cooling Golden rules remain authoritative for thermal architecture.

## 64. Schneider reference-design evidence

Schneider’s 2026 AI reference designs explicitly integrate facility power, facility cooling, IT space and lifecycle software; greenfield and retrofit scenarios use different liquid-cooling integrations. This is **VENDOR CLAIM / reference architecture evidence** supporting the need for integrated facility design, not a universal prescribed layout. [R22][R23][R24]

## 65. Huawei reference-design evidence

Huawei’s AI reference design shows prefabricated modules that separately organize IT device module, cooling module, primary liquid loop and secondary loop, with piping/leak-detection infrastructure. This is **VENDOR CLAIM / product-reference evidence** illustrating physical service-zone consequences of liquid cooling. [R25][R26]

## 66. Vertiv evidence

Vertiv’s current AI material describes liquid-cooled high-density deployments as an integrated compute/facility problem and highlights repeatable building blocks and service-path flexibility. This is **VENDOR CLAIM / practitioner guidance**, useful for current market direction but not a standard. [R27]

---

# R. Energy, water and lifecycle architecture

## 67. Building form affects PUE/WUE/TCO

Envelope, air leakage, roof/plant arrangement, pipe lengths, airflow path, economization potential, dry-cooler space, heat recovery and equipment replacement all affect lifecycle energy/water/cost.

## 68. LBNL guidance

LBNL’s current Best Practices Guide emphasizes reliability and high-power-density capability while promoting lifecycle efficiency, PUE/WUE/CUE/ERE awareness, efficient cooling and appropriate operating conditions. [R18][R19][R20]

## 69. Heat-rejection space

High-temperature liquid systems can shift facility design toward dry coolers or other heat-rejection architectures. The building/site must reserve enough outdoor space, air paths, structural support, noise mitigation and maintenance access.

## 70. Stranded building capacity

A facility can have spare electrical MW yet be unable to deploy them because of:

- insufficient structural load;
- no liquid routes;
- no heat-rejection space;
- inadequate MMR/cabling;
- no replacement path;
- low clear height;
- fire/security constraints;
- insufficient white-space geometry.

---

# S. Greenfield / brownfield / retrofit

## 71. Greenfield advantage

Greenfield allows site, structure, zoning, A/B paths, MMR entrances, logistics and future phases to be co-designed from first principles.

## 72. Brownfield challenge

Brownfield often inherits:

- fixed structure;
- constrained utility entrances;
- occupied neighbors;
- legacy fire compartments;
- existing drainage;
- limited external plant space;
- limited shutdown windows.

## 73. Retrofit Golden rule

Do not ask only “Can we fit the rack?” Ask:

`CAN THE BUILDING SUPPORT → POWER → COOLING → LIQUID → NETWORK → LOGISTICS → SAFETY → OPERATIONS → COMMISSIONING → FAILURE RECOVERY?`

## 74. Retrofit archetypes

- Air-cooled rack-density increase
- Liquid-to-air CDU retrofit
- Liquid-to-liquid CDU retrofit
- New AI room inside conventional hall
- Dedicated high-density pod
- New external power/cooling modules serving old building
- Partial floor conversion

Schneider’s RD100/RD121 illustrate greenfield and retrofit AI scenarios and are useful **VENDOR REFERENCE** examples. [R23][R24]

---

# T. Live-site expansion

## 75. Live-site construction is an operational failure mode

Construction introduces:

- dust;
- vibration;
- water ingress;
- temporary power;
- temporary fire impairments;
- contractors;
- blocked egress;
- accidental cable/pipe damage;
- control changes;
- commissioning transients.

## 76. Expansion boundary

Future phases should have pre-engineered connection points for power, cooling, telecom, controls and structure. An expansion plan that requires repeated penetration of live critical rooms creates recurring risk.

## 77. Temporary works

Temporary walls, dust barriers, temporary drainage, lifting plans, hot-work controls, method of procedure (MOP) and rollback must be treated as part of the operational design.

---

# U. Commissioning the building

## 78. Building commissioning is more than MEP startup

Golden acceptance should include evidence that physical architecture performs during abnormal states.

## 79. Physical-path tests

Examples:

- A-path room inaccessible: can B path remain operational and serviceable?
- water leak in one zone: does isolation preserve the other zone?
- fire alarm/door release: is security/egress behavior correct?
- one freight route unavailable: can critical replacement still occur?
- one MMR unavailable: does telecom diversity remain?
- expansion tie-in: can construction boundary be maintained?

## 80. Integrated systems testing

Building, electrical, cooling, controls, security and fire must be tested as one system for intended failure scenarios. Uptime’s Tier framework includes performance confirmation, while ASHRAE’s AI framework emphasizes integrated design; together they support state-based verification rather than equipment-only checklists. [R04][R08]

---

# V. Building-risk matrix

## 81. Risk matrix

| Risk | Typical mechanism | Consequence | Golden control |
|---|---|---|---|
| Flood / surface water | site elevation, drainage failure | multi-system outage | site study, elevation, drainage, barriers, zoning |
| Roof leak | membrane/penetration/drain failure | IT/electrical damage | roof design, overflow, leak zoning, no critical exposure where practical |
| Shared riser | A/B services co-located | common-mode outage | physically diverse risers/compartments |
| Fire | cable/battery/equipment/adjacent occupancy | localized or facility loss | compartmentation, detection, suppression, recovery plan |
| Liquid leak | FWS/TCS/condensate/fire water | rack/electrical damage | isolation, detection, containment, drainage |
| Structural overload | heavy AI racks/equipment | unsafe/degraded floor | load map, route analysis, reserve |
| Logistics trap | doors/elevator/corridor too small | equipment not replaceable | replacement-path register |
| Security breach | weak perimeter/zone separation | malicious/accidental impact | layered access zones |
| MMR convergence | diverse carriers share route | telecom outage | entrance/riser/MMR diversity |
| Live construction | dust/water/hot work/cable strike | outage/fire | phased isolation, MOP, monitoring |
| Future density mismatch | structure/service zone fixed | stranded MW | density-ready zones and reserved pathways |
| Shared controls | common BMS/PLC/network | loss of both trains | control-domain audit |

---

# W. Space and adjacency matrix

## 82. Functional adjacency matrix

| Space | Prefer near | Prefer separated from | Key reason |
|---|---|---|---|
| White space | staging, MMR pathways, power/cooling distribution | public/loading exterior where uncontrolled | operations/security |
| MMR | carrier entrances, white-space telecom routes | shared single entrance/path | network resilience |
| UPS / switchgear | distribution path, service access | water-risk zones where avoidable | electrical resilience |
| Battery/BESS | service/emergency access | uncontrolled occupied areas | fire/thermal/maintenance |
| Cooling plant | heat rejection, hydraulic routes | shared critical electrical exposure | maintainability/water risk |
| CDU room/zone | AI halls, FWS/TCS interfaces | inaccessible trapped spaces | liquid serviceability |
| Loading/staging | secure external access, freight route | direct uncontrolled white-space access | logistics/security |
| NOC/control | secure staff access | single local hazard domain if mission-critical | operations continuity |
| Generator/fuel | external service access | air intakes/public risk where unsuitable | fire/emissions/logistics |

---

# X. Building-form decision matrix

## 83. Purpose-built vs converted vs multi-storey vs prefab/hybrid

| Attribute | Purpose-built single-storey | Multi-storey purpose-built | Converted building | Prefab / hybrid |
|---|---|---|---|---|
| Structural freedom | High | High but vertical complexity | Low–Medium | Medium–High by module |
| Heavy AI logistics | Strong | Freight path critical | Often constrained | Factory/module logistics critical |
| A/B path diversity | High potential | Riser design critical | Often constrained | Interface design critical |
| Time-to-capacity | Medium | Medium | Potentially fast if suitable | Potentially fast |
| Site footprint | High | Lower | Existing | Variable |
| Retrofit flexibility | N/A | Medium | Core challenge | Modular additions possible |
| Future density | High if reserved | High if structure/services designed | Constraint-driven | Block-specific |
| Liquid readiness | High potential | Vertical water-risk complexity | Constraint-driven | Can be factory-integrated |
| Vendor lock-in | Low–Medium | Low–Medium | Low | Can be Medium–High |

---

# Y. Raised-floor / slab decision matrix

## 84. Decision matrix

| Criterion | Raised floor | Structural slab / overhead services |
|---|---|---|
| Underfloor air | Strong fit where architecture uses it | Not primary |
| Heavy rack direct support | Requires raised-floor system verification | Strong direct load path potential |
| Overhead busway/cabling | Can still be used | Natural fit |
| Liquid piping | Possible but leak/underfloor access strategy required | Overhead/side distribution commonly easier to inspect |
| Retrofit flexibility | Can be useful | Depends on overhead capacity |
| AI high-mass rack | Project-specific verification | Often attractive with reinforced slab |
| Contamination/access | Underfloor management required | Fewer hidden zones |

**Decision:** no universal winner. Structure + cooling + services + operations decide.

---

# Z. AI-readiness matrix

## 85. Facility AI-readiness scorecard

| Domain | Baseline question | Failure if ignored |
|---|---|---|
| Structure | Can slab + route handle installed/rolling load? | rack cannot be deployed safely |
| Power | Can dense power reach rack without copper/space bottleneck? | stranded compute |
| Cooling | Can heat be captured/rejected at target density? | thermal throttling/outage |
| Liquid | Are FWS/TCS/CDU/manifold paths reserved? | costly retrofit |
| Water risk | Detection + isolation + containment + drainage? | common-mode damage |
| Space | Sufficient service/clear-height/maintenance zones? | unserviceable infrastructure |
| Network | Enough high-density fiber pathways and MMR capacity? | network bottleneck |
| Logistics | Can integrated racks/CDUs enter and be replaced? | deployment/replacement failure |
| Commissioning | Can realistic load/failure states be tested? | hidden integration defects |
| Future growth | Can next density generation be inserted? | premature obsolescence |

---

# AA. Scale decision matrix

## 86. Scale guidance — illustrative, not hard thresholds

| IT load scale | Typical building concern | Facility architecture tendency |
|---|---|---|
| 50–200 kW | existing-building suitability, security, local cooling | room / micro / prefabricated system |
| ~500 kW | independent technical rooms, maintainability | small purpose-built or hybrid |
| 1–2 MW | A/B distribution paths, MMR, loading, expansion | repeatable hall/pod building |
| ~5 MW | campus logistics, multiple plant blocks | purpose-built / modular hybrid |
| 20+ MW | utility, land, multi-building fault domains, large heat rejection | campus / repeatable facility blocks |
| AI 20+ MW | structural/logistics + liquid + synchronized load | integrated purpose-built AI facility/campus |

Scale ranges are **decision examples**, not standard-defined breakpoints.

---

# AB. Failure-mode analysis

## 87. F1 — Both A/B paths share one riser

**Failure:** local fire/water/structural event disables both.  
**Control:** path-diversity audit; separate physical zones where required.

## 88. F2 — Roof water above switchgear/white space

**Failure:** one drainage/roof event causes severe damage.  
**Control:** roof-risk mapping, penetration control, drainage/overflow design, critical-space adjacency review.

## 89. F3 — Strong data-hall slab, weak freight route

**Failure:** new AI rack cannot reach final location.  
**Control:** end-to-end rolling/replacement load map.

## 90. F4 — Battery technology changes without building review

**Failure:** fire/ventilation/egress/response assumptions become invalid.  
**Control:** ESS code/AHJ reassessment; dedicated hazard analysis. [R17]

## 91. F5 — Liquid cooling added without drainage/isolation

**Failure:** small leak becomes extended common-mode event.  
**Control:** zoning, valves, leak detection, containment, MOP/EOP.

## 92. F6 — Dual carriers, one outside route

**Failure:** excavation/duct damage disconnects all carriers.  
**Control:** outside-plant diversity verification.

## 93. F7 — Live-site expansion crosses operational halls

**Failure:** repeated construction creates outage risk.  
**Control:** preplanned expansion boundary and independent construction access.

## 94. F8 — Shared control room

**Failure:** local event removes both operational visibility and control.  
**Control:** critical control-function resilience analysis.

## 95. F9 — Hall designed for average density

**Failure:** localized AI cluster exceeds structural/cooling/service capacity.  
**Control:** rack-by-rack density/load map.

## 96. F10 — Fire separation mistaken for availability independence

**Failure:** systems remain physically or logically shared.  
**Control:** separate fire, power, cooling, control and service-path audits.

## 97. F11 — Prefabricated module interfaces not coordinated

**Failure:** site tie-ins become schedule/commissioning bottleneck.  
**Control:** interface register, FAT/SAT/IST and transport/lifting plan.

## 98. F12 — No replacement strategy

**Failure:** major plant can be serviced but not replaced.  
**Control:** lifecycle replacement path and temporary bypass plan.

---

# AC. Decision tree

## 99. Golden facility decision tree

```text
START
  |
  +-- What business/SLA and workload must the facility support?
  |
  +-- Site suitable for hazard, utility, security and expansion?
  |      |-- NO -> reject / mitigate / re-site
  |      `-- YES
  |
  +-- Greenfield, brownfield, retrofit or live-site expansion?
  |
  +-- Traditional density, hybrid, or AI/liquid target?
  |
  +-- What building form best fits land, schedule, logistics and growth?
  |
  +-- Can structure + equipment route support current and future loads?
  |
  +-- Are A/B power, cooling and telecom physically diverse where required?
  |
  +-- Are fire, water and security compartments coherent with availability?
  |
  +-- Can every major asset be installed, maintained and replaced?
  |
  +-- Can future phases connect without repeatedly invading live critical space?
  |
  +-- Can integrated failure states be commissioned and operated safely?
  |
  `-- FREEZE BUILDING ARCHITECTURE
```

---

# AD. Golden architecture diagrams

## 100. Layer model

```text
[ SITE / NATURAL + ADJACENCY RISK ]
               ↓
[ PERIMETER / SECURITY / VEHICLE CONTROL ]
               ↓
[ BUILDING ENVELOPE / STRUCTURE ]
               ↓
[ FIRE / WATER / SECURITY COMPARTMENTS ]
               ↓
[ LOGISTICS / REPLACEMENT PATHS ]
               ↓
[ WHITE SPACE / MMR / TECHNICAL ROOMS ]
               ↓
[ POWER A/B ] [ COOLING A/B ] [ NETWORK A/B ]
               ↓
[ AI / LIQUID / FUTURE-DENSITY INTERFACES ]
               ↓
[ OPERATIONS / COMMISSIONING / EXPANSION ]
```

## 101. Physical-diversity model

```text
UTILITY / SOURCE A ---- A-ROOM ---- A-RISER ---- A-DISTRIBUTION ---- IT-A
                         |               |
                     A FIRE/WATER    A PHYSICAL PATH

UTILITY / SOURCE B ---- B-ROOM ---- B-RISER ---- B-DISTRIBUTION ---- IT-B

Golden test: no single realistic physical event should unintentionally defeat
both paths where the target resilience requires separation.
```

## 102. AI liquid facility model

```text
OUTDOOR HEAT REJECTION
          ↓
      FWS LOOP
          ↓
   HX / PRIMARY CDU ZONE
          ↓
      TCS LOOP
          ↓
  HALL MANIFOLD / BRANCH
          ↓
   RACK / SERVER COLD PLATE
          ↓
RESIDUAL AIR HEAT → AIR COOLING PATH

Building overlays:
structure + leak zoning + drainage + service clearance + cable pathways + replacement route
```

---

# AE. Common mistakes

## 103. Mistake — “Tier III building” as a generic adjective

Tier is a topology/performance classification. Do not assume a building product or room is Tier III without certification scope and full site infrastructure evidence. [R04][R05]

## 104. Mistake — using one rack-load number everywhere

Rack populations, rolling loads, point loads and future AI densities vary. Structural zones should be engineered to actual use cases.

## 105. Mistake — putting wet services wherever route is shortest

Shortest pipe is not always lowest risk. Availability zoning and drainage consequence matter.

## 106. Mistake — security only at front door

Critical rooms, loading, contractors, roof/yard plant and carrier entrances require layered control.

## 107. Mistake — no future phase interface

Expansion then becomes an uncontrolled retrofit into a live facility.

## 108. Mistake — plant room without replacement route

Maintainability is not equivalent to replaceability.

## 109. Mistake — “liquid-ready” because a pipe can be added later

Real liquid readiness includes structure, FWS/TCS boundary, CDU space, piping zone, valves, leak detection, drainage, controls and commissioning.

## 110. Mistake — vendor reference design treated as standard

Reference designs accelerate concept work but must be mapped to local code, site, climate, SLA and vendor-neutral requirements.

---

# AF. Design checklist

## 111. Site and envelope checklist

- [ ] Natural-hazard screening complete
- [ ] Adjacency risks mapped
- [ ] Flood/drainage strategy approved
- [ ] Security setback/perimeter defined
- [ ] Building envelope/roof risk reviewed
- [ ] Future expansion land/interface reserved

## 112. Structural checklist

- [ ] Installed load map
- [ ] Rolling/concentrated load map
- [ ] Loading dock route verified
- [ ] Freight elevator/ramp capacity verified
- [ ] Roof/overhead service loads coordinated
- [ ] Seismic/wind requirements coordinated
- [ ] Future density reserve documented

## 113. Availability checklist

- [ ] A/B electrical path audit
- [ ] A/B cooling path audit
- [ ] Telecom entrance/MMR audit
- [ ] Shared risers identified
- [ ] Fire/water common-mode zones identified
- [ ] Control-system common modes identified

## 114. Fire/water/security checklist

- [ ] Fire strategy/AHJ review
- [ ] Battery/ESS hazard review
- [ ] Liquid leak zoning/isolation
- [ ] Drainage/containment
- [ ] Security zone matrix
- [ ] Emergency egress/access coordination

## 115. Operations/logistics checklist

- [ ] Receiving/staging/quarantine
- [ ] Major equipment replacement paths
- [ ] Workshop/spares zones
- [ ] NOC/control resilience
- [ ] Live-site construction strategy
- [ ] Expansion tie-in points

## 116. AI-readiness checklist

- [ ] High-density structural zone
- [ ] High-density power route
- [ ] Liquid distribution zone
- [ ] CDU/HX space
- [ ] Leak containment/drainage
- [ ] High-density network/fiber pathways
- [ ] Integrated rack logistics
- [ ] Future density change plan

---

# AG. Procurement / RFP requirements

## 117. Minimum building deliverables

Require at concept/design stage:

- site-risk register;
- functional-space schedule;
- adjacency matrix;
- structural load plan;
- A/B physical-route drawings;
- fire/water/security compartment drawings;
- equipment logistics/replacement paths;
- MMR/carrier-entry map;
- liquid-cooling interface plan;
- future-expansion interface plan;
- integrated commissioning scenarios.

## 118. Vendor-neutral acceptance language

Avoid: “Vendor X standard hall.”

Prefer: “The proposed hall shall demonstrate compliance with the project structural, availability, serviceability, fire, water, security, logistics and future-density requirements, independent of product brand.”

---

# AH. Scenario guidance

## 119. Small enterprise / edge

Priorities:

- site/environmental protection;
- access control;
- compact resilient power/cooling;
- maintainability with limited staff;
- simple replacement path;
- remote monitoring.

## 120. Enterprise 0.5–2 MW

Priorities:

- dedicated technical rooms;
- phased capacity;
- serviceable A/B routes;
- MMR/telecom resilience;
- controlled loading/staging;
- future liquid zones.

## 121. Colocation

Priorities:

- tenant security zoning;
- cages/suites;
- multiple carrier/MMR architecture;
- loading/staging workflow;
- tenant density heterogeneity;
- meter/operations interfaces;
- expansion without cross-tenant risk.

## 122. Hyperscale/cloud

Priorities:

- repeatable blocks;
- campus-scale utility/heat-rejection/logistics;
- standardized interfaces;
- automation;
- fast phasing;
- supply-chain/replacement strategy.

## 123. AI/HPC

Priorities:

- heavy/high-density rack logistics;
- structural zones;
- liquid infrastructure;
- high-clearance/service zones;
- synchronized power/thermal design;
- fast hardware-cycle adaptability.

---

# AI. Research conclusions

## 124. Conclusion 1 — Building architecture is a resilience system

The building defines whether redundant infrastructure is truly independent.

## 125. Conclusion 2 — Functional zoning is as important as room count

Correct room names do not guarantee correct adjacency, security, fire, water or maintenance behavior.

## 126. Conclusion 3 — Physical routes must be audited, not inferred

Single-line diagrams cannot reveal shared risers, trenches, doors, flood zones or structural bays.

## 127. Conclusion 4 — AI-readiness is lifecycle adaptability

Future density depends on structure, services, liquid, logistics, network and commissioning—not one numerical rack-load threshold.

## 128. Conclusion 5 — Water becomes a first-class building risk in liquid-cooled facilities

Detection, isolation, containment and recovery must be designed together.

## 129. Conclusion 6 — Replaceability is a building KPI

Every major component must have a credible end-of-life replacement route.

## 130. Conclusion 7 — Live expansion must be designed before the first phase opens

Future growth without pre-engineered interfaces creates recurrent operational risk.

## 131. Conclusion 8 — Standards and vendor designs have different roles

ISO/TIA/BICSI/Uptime/NFPA formalize requirements/performance domains; ASHRAE/LBNL provide engineering guidance; OCP adds deployment-readiness context; vendors illustrate current solution architectures. They must not be collapsed into one evidence class.

---

# AJ. Proposed Full Briefing structure

## 132. Full Narration chapter map

1. **K07-00 — Veri merkezi binası neden sadece bir shell değildir?**
2. **K07-01 — Site risk, building form ve functional zoning**
3. **K07-02 — White space, structure, slab, raised floor ve equipment logistics**
4. **K07-03 — A/B physical diversity, MMR, risers ve failure domains**
5. **K07-04 — Fire, water, security ve building compartments**
6. **K07-05 — AI/high-density ve liquid-cooling facility readiness**
7. **K07-06 — Retrofit, live-site expansion ve lifecycle replacement**
8. **K07-07 — Commissioning, risk matrix ve hangi building architecture ne zaman?**

Target: approximately 34–42 minutes depending on final narration source QA.

Quick Brief shall remain a separate mode and shall not be a shortened file generated from the Full Brief MP3.

---

# AK. Golden UI visual candidates

## 133. Visual 01 — Facility Layer Stack

`SITE → PERIMETER → ENVELOPE/STRUCTURE → COMPARTMENTS → LOGISTICS → WHITE SPACE/TECH ROOMS → A/B SYSTEMS → AI/LIQUID → OPERATIONS/EXPANSION`

## 134. Visual 02 — Functional Adjacency Matrix

White space / MMR / electrical / battery / cooling / loading / NOC adjacency and separation logic.

## 135. Visual 03 — Physical Diversity Audit

A-path vs B-path through rooms, risers, penetrations and distribution.

## 136. Visual 04 — AI Facility Readiness Scorecard

Structure, power, cooling, liquid, water risk, space, network, logistics, commissioning and growth.

## 137. Golden rule

`BUSINESS / SLA → SITE RISK → PROJECT CONDITION → BUILDING FORM → FUNCTIONAL ZONING → STRUCTURAL ENVELOPE → PHYSICAL PATH DIVERSITY → FIRE / WATER / SECURITY COMPARTMENTS → LOGISTICS / REPLACEMENT → WHITE-SPACE & TECHNICAL ROOMS → AI / LIQUID READINESS → EXPANSION / LIVE-SITE PHASING → COMMISSIONING → OPERATIONS → FREEZE`

---

# AL. Authoritative source register

> Source classification is part of the evidence model. Paywalled standards are referenced only for publicly verifiable scope/edition statements unless licensed text is available.

## Standards / formal criteria

**[R01] ISO/IEC 22237-1:2021 — Information technology — Data centre facilities and infrastructures — Part 1: General concepts**  
Class: **STANDARD**  
Use: general principles; availability/security/energy-efficiency over planned lifetime; business risk and operating cost.  
https://www.iso.org/standard/78550.html

**[R02] ISO/IEC 22237-2:2024 — Part 2: Building construction**  
Class: **STANDARD — PRIMARY K07 SOURCE**  
Use: location/site selection, environmental risks, site/building configuration, access, intrusion, fire, water damage and construction quality.  
https://www.iso.org/standard/82248.html

**[R03] ANSI/TIA-942-C — Telecommunications Infrastructure Standard for Data Centers, May 2024**  
Class: **STANDARD**  
Use: all-size data centers; telecommunications, power, cooling, architecture, fire protection, safety and physical security.  
https://tiaonline.org/standard/tia-942/

**[R04] Uptime Institute — Tier Certification Overview**  
Class: **PERFORMANCE / CERTIFICATION CRITERIA**  
Use: electrical, structural, building characteristics, mechanical, site, critical spaces, outdoor environment, fire protection, distribution paths, commissioning.  
https://uptimeinstitute.com/tier-certification

**[R05] Uptime Institute — Tier Standard: Topology / Tier Classification**  
Class: **PERFORMANCE STANDARD**  
Use: redundant capacity components/distribution paths, performance-based Tier distinctions; boundary vs local codes.  
https://uptimeinstitute.com/publications/asset/tier-standard-topology  
https://uptimeinstitute.com/tiers

**[R06] ANSI/BICSI 002-2024 — The Standard for Data Center Design**  
Class: **STANDARD / BEST PRACTICE**  
Use: cross-disciplinary data-center design and implementation. Public BICSI description states it covers all major systems/disciplines and implementation recommendations.  
https://shop.bicsi.org/ansi-bicsi-002-2024-the-standard-for-data-center-design-digital-version

**[R16] NFPA 75 — Standard for the Fire Protection of Information Technology Equipment (public 2020 preview)**  
Class: **FIRE STANDARD FAMILY**  
Use: IT-area construction, fire protection/detection, utilities, emergency/recovery and modular DC considerations. Confirm applicable edition/AHJ per project.  
https://link.nfpa.org/all-publications/75/2020

**[R17] NFPA 855:2023 — Standard for the Installation of Stationary Energy Storage Systems**  
Class: **FIRE / ESS STANDARD**  
Use: ESS interconnections, commissioning, O&M, electrochemical storage and hazards. Confirm local adoption/AHJ.  
https://link.nfpa.org/all-publications/855/2023

## Engineering guidance / research institutions

**[R07] PNNL / ASHRAE / NEMA — AI Data Center Energy Performance Framework**  
Class: **ENGINEERING FRAMEWORK — NOT MANDATORY CODE**  
Use: AI data-center planning, design, construction, operations and retrofit; energy/water integration.  
https://www.ashrae.org/technical-resources/ai-data-center-framework

**[R08] ASHRAE — AI Framework: Integrated Design Principles**  
Class: **ENGINEERING GUIDANCE**  
Use: integrated architecture/electrical/mechanical design; structural and safety readiness; liquid distribution; adaptability.  
https://www.ashrae.org/technical-resources/ai-data-center-framework/integrated-design-principles

**[R09] ASHRAE — AI Framework: Site Planning**  
Class: **ENGINEERING GUIDANCE**  
Use: climate, site, water/grid/seismic and thermal planning references.  
https://www.ashrae.org/technical-resources/ai-data-center-framework/site-planning

**[R10] ASHRAE — AI Framework: Energy and Thermal Efficiency**  
Class: **ENGINEERING GUIDANCE**  
Use: containment, airflow, environmental envelopes, liquid/high-density cooling.  
https://www.ashrae.org/technical-resources/ai-data-center-framework/energy-and-thermal-efficiency

**[R11] ASHRAE — Data Center Resources / TC 9.9 Datacom Series**  
Class: **ENGINEERING GUIDANCE**  
Use: thermal guidelines, liquid cooling, edge and facility thermal design references.  
https://www.ashrae.org/technical-resources/bookstore/datacom-series

**[R12] ASHRAE Handbook — HVAC Applications, Chapter 20: Data Centers and Telecommunication Facilities**  
Class: **ENGINEERING HANDBOOK**  
Use: facility thermal classes and liquid-cooled datacom facility considerations.  
https://handbook.ashrae.org/Handbooks/A23/SI/A23_Ch20/a23_ch20_si.aspx

**[R18] LBNL / DOE — Best Practices Guide for Energy-Efficient Data Center Design**  
Class: **GOVERNMENT / RESEARCH GUIDANCE**  
Use: lifecycle efficiency, reliability, high-power-density capacity, PUE/WUE/CUE/ERE design context.  
https://datacenters.lbl.gov/sites/default/files/2025-07/best-practice-guide-data-center-design.pdf

**[R19] LBNL — Power & Cooling Technologies**  
Class: **GOVERNMENT / RESEARCH GUIDANCE**  
Use: power/cooling technology and operational best practices.  
https://datacenters.lbl.gov/power-cooling-technologies

**[R20] LBNL — Facility Performance Modeling & Simulation**  
Class: **GOVERNMENT / RESEARCH GUIDANCE**  
Use: lifecycle energy/water/flexibility/reliability modeling.  
https://datacenters.lbl.gov/facility-performance-modeling-simulation

**[R21] FEMA — Prioritizing Mitigation Actions for Critical Facilities**  
Class: **GOVERNMENT HAZARD GUIDANCE**  
Use: event/depth-based flood-risk analysis and loss-of-service consequences.  
https://www.fema.gov/sites/default/files/documents/fema_prioritizing-mitigation-actions_critical-facilities_region-three-06-2021.pdf

## OCP / industry facility-readiness criteria

**[R13] Open Compute Project — Data Center Facility / OCP Ready**  
Class: **OPEN INDUSTRY FACILITY REQUIREMENTS**  
Use: hyperscale/OCP deployment-readiness assessment; facility physical compatibility.  
https://www.opencompute.org/wiki/Data_Center_Facility/OCP_Ready

**[R14] Open Compute Project — Facility Recognition Program**  
Class: **OPEN INDUSTRY FACILITY GUIDELINES**  
Use: fundamental facility requirements for OCP rack deployment.  
https://www.opencompute.org/sp/facility-recognition-program

**[R15] FM Property Loss Prevention Data Sheet 5-32 — Data Centers and Related Facilities, January 2026**  
Class: **PROPERTY-LOSS / INSURER GUIDANCE**  
Use: hazards and property-loss prevention for data centers and critical systems.  
https://www.fm.com/FMAApi/data/ApprovalStandardsDownload?isGated=false&itemId=%7B2D62FBAB-83CA-4B26-A447-72D7EF6D574D%7D

## Vendor / reference architecture sources — illustrative only

**[R22] Schneider Electric — Reference Design 113, 10.2–12.7 MW AI facility, 2026**  
Class: **VENDOR REFERENCE DESIGN**  
Use: integrated facility power/cooling/IT-space/lifecycle architecture for liquid-cooled AI.  
https://www.se.com/us/en/download/document/RD113DS/

**[R23] Schneider Electric — Reference Design 100, liquid/air-cooled AI greenfield + retrofit, 2026**  
Class: **VENDOR REFERENCE DESIGN**  
Use: retrofit versus purpose-built AI hall integration examples.  
https://www.se.com/us/en/download/document/RD100DSR0_EN/

**[R24] Schneider Electric — Reference Design 121, AMD MI455X greenfield + retrofit, 2026**  
Class: **VENDOR REFERENCE DESIGN**  
Use: current greenfield/retrofit high-density facility example.  
https://www.se.com/us/en/download/document/RD121DS/

**[R25] Huawei — AIDC Facility Solution, 2026**  
Class: **VENDOR CLAIM / SOLUTION ARCHITECTURE**  
Use: module prefabrication, high-density convergence, facility/IT coordination.  
https://digitalpower.huawei.com/ph/data-center-facility/aidc

**[R26] Huawei — AI Data Center Reference Design**  
Class: **VENDOR REFERENCE DESIGN**  
Use: IT module, cooling module, primary/secondary liquid-loop physical zoning and leak detection.  
https://digitalpower.huawei.com/upload-pro/index/index/Huawei-AI-Data-Center-Reference-Design.pdf

**[R27] Vertiv — Designing AI data centers for fast-moving demands**  
Class: **VENDOR / PRACTITIONER GUIDANCE**  
Use: repeatable building blocks, liquid cooling and flexible service-path concepts.  
https://www.vertiv.com/en-asia/insights/articles/educational-articles/designing-ai-data-centers-for-fast-moving-demands-insights-from-off-grid-and-regional-operators/

**[R28] Rittal — High Availability Security Rooms**  
Class: **VENDOR PRODUCT / TESTED ENCLOSURE CLAIM**  
Use: room-within-a-room physical protection example.  
https://www.rittal.com/com-en/products/PG20231215ITI101/PG20240402ITI201/PRO17648?variantId=7857972

**[R29] Eaton — Server Room / Data Center Physical Infrastructure Guidance**  
Class: **VENDOR GUIDANCE**  
Use: physical-space, power, monitoring and flexibility context.  
https://www.eaton.com/us/en-us/markets/data-centers/server-room.html

**[R30] BICSI — Data Center Standards overview**  
Class: **STANDARDS PUBLISHER OVERVIEW**  
Use: confirms current BICSI data-center standard family and 002-2024 context.  
https://shop.bicsi.org/standards/data-center

---

# AM. Source-boundary notes

## 138. Paywalled standards

The research does not reproduce proprietary standard text beyond public scope descriptions. Project compliance must use legally licensed current standards and the applicable AHJ/local regulations.

## 139. Current AI guidance

ASHRAE’s 2026 AI framework contains forward-looking engineering observations about rapidly increasing rack density, liquid cooling and facility design. These observations are treated as **current engineering guidance**, not universal mandatory numeric thresholds. [R07][R08]

## 140. Vendor claims

Schneider, Huawei, Vertiv, Rittal and Eaton sources are intentionally retained because they show current deployable architectures. Any performance, schedule, efficiency, structural or product claim remains **VENDOR CLAIM** until independently validated for a project.

---

# AN. Golden acceptance criteria for research stage

## 141. Research QA checklist

K07 research may advance to narration only if:

- [x] Building construction is anchored in ISO/IEC 22237-2:2024.
- [x] TIA/Uptime/BICSI scopes are separated rather than conflated.
- [x] Site, structure, envelope, fire, water, security, logistics, MMR and operations are all covered.
- [x] Raised-floor vs slab is treated as a design choice, not ideology.
- [x] AI readiness includes structure + liquid + space + network + logistics + commissioning.
- [x] Greenfield/brownfield/retrofit/live-site expansion are separated.
- [x] Physical A/B path diversity is explicitly audited.
- [x] Major-asset replacement paths are included.
- [x] Risk matrix and decision matrices are included.
- [x] Vendor claims are explicitly marked.
- [x] No universal structural/fire/space threshold is invented without an authoritative project-applicable basis.
- [x] Proposed 8-chapter Full Briefing map exists.
- [x] Golden UI visual candidates exist.

## 142. Research state

`DC_K07_GOLDEN_DEEP_RESEARCH = COMPLETE`

This flag means the **research baseline** is complete. It does **not** mean Full Narration, Quick Brief, audio, Golden UI, Pages acceptance or `DC_K07_GOLDEN_V2 = ACCEPTED` are complete.
