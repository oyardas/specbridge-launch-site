# DC-K05 — Data Center Cooling Architecture

Status: WAVE 1 RESEARCH BASELINE
Language: TR
Author: Önder Yardaş
Research date: 2026-09-01

## Executive conclusion

Veri merkezi soğutması 'klima kapasitesi' değildir; IT ekipmanının ürettiği ısının chip/rack seviyesinden dış çevreye taşındığı termal zincirdir. Airflow, heat transfer, coolant loop, redundancy, controls ve room/rack geometry birlikte çalışır.

Temel ısı zinciri:

CHIP -> HEAT SINK / COLD PLATE -> AIR veya LIQUID -> ROOM/RACK HEAT EXCHANGER -> FACILITY LOOP -> CHILLER / DRY COOLER / CONDENSER / HEAT REJECTION -> OUTDOOR ENVIRONMENT

Doğru cooling architecture rack density, IT equipment environmental envelope, climate, water availability, site constraints, energy strategy, redundancy ve growth path'e göre seçilmelidir.

## 1. ASHRAE neden temel referanstır?

ASHRAE TC 9.9 Datacom Series, data center thermal design için vendor-neutral temel kaynak ailesidir. Thermal Guidelines for Data Processing Environments, air-cooled ve liquid-cooled equipment environmental limits için ortak referans sağlar. ASHRAE Handbook ayrıca equipment inlet temperature'ı common design point olarak kullanır.

Önemli prensip:

ROOM TEMPERATURE tek başına yeterli KPI değildir. IT EQUIPMENT INLET CONDITIONS ve airflow distribution izlenmelidir.

## 2. Heat load basics

IT equipment tükettiği electrical power'ın büyük kısmını ısıya dönüştürür. Bu nedenle 1 kW IT load yaklaşık 1 kW thermal load olarak düşünülür; ancak facility cooling sizing'de UPS losses, lighting, people, envelope ve pump/fan loads gibi ek heat sources ayrıca ele alınır.

Cooling design metriği yalnız total MW değildir:
- kW/rack
- airflow per rack
- supply/return temperatures
- delta-T
- heat density per floor area
- diversity/utilization
- transient load

## 3. Air cooling architectures

### Room / perimeter cooling
CRAC/CRAH units room perimeter'ında veya mechanical area'da cold air sağlar.

#### CRAC — Computer Room Air Conditioner
Genellikle DX/refrigerant-based direct expansion cooling approach ile ilişkilendirilir.

#### CRAH — Computer Room Air Handler
Genellikle chilled-water coil üzerinden facility chilled water kullanır.

Terminoloji vendor'a göre değişebilir; design decision refrigerant/water loop, heat rejection ve control topology üzerinden verilmelidir.

### Raised-floor supply
Cold air underfloor plenum üzerinden perforated tiles ile cold aisle'a gelir.

Avantaj:
- legacy, well-understood design

Risk:
- underfloor power/data cable obstruction
- pressure imbalance
- tile placement dependency
- high-density scaling limits

### Overhead / slab-floor supply
Cooling duct/units overhead veya row-level supply yapar; power/fiber de overhead taşınabilir.

Modern high-density facilities'de raised floor zorunlu değildir.

### In-row cooling
Cooling unit rack rows arasına yerleştirilir, heat source'a daha yakın çalışır.

Avantaj:
- shorter airflow path
- higher density support
- modular scaling

Risk:
- white-space kullanımı
- condensate/refrigerant/water piping
- maintenance access

### Rear-door heat exchanger
Server exhaust air rack rear door'da liquid heat exchanger üzerinden soğutulur.

Avantaj:
- retrofit-friendly
- existing air-cooled servers ile kullanılabilir
- room heat load azaltılabilir

Risk:
- rack weight/depth
- facility/CDU piping
- hose/serviceability

## 4. Hot aisle / cold aisle

Racks front-to-front cold aisle ve rear-to-rear hot aisle oluşturacak şekilde yerleştirilir.

Problem:
- hot/cold air mixing
- recirculation
- bypass airflow

Containment bu mixing'i azaltır.

### Cold aisle containment
Cold air zone enclosed.

### Hot aisle containment
Hot exhaust zone enclosed.

Selection fire suppression, ceiling return, room pressure, access and operating practice ile birlikte yapılır.

## 5. DX vs chilled-water systems

### DX / direct expansion
Refrigerant-based cooling cycle.

Güçlü:
- smaller deployments
- simpler local architecture
- no central chilled-water plant requirement

Sınırlamalar:
- large-scale efficiency/service architecture product-specific
- refrigerant piping and environmental regulations

### Chilled water
Central chiller plant cold water üretir; CRAH/in-row coils üzerinden heat transfer yapılır.

Güçlü:
- large campuses
- central efficiency optimization
- thermal storage/free-cooling integration possibilities

Risk:
- pumps, valves, piping, water treatment
- large common failure domains if poorly zoned
- complex plant controls

## 6. Heat rejection technologies

- air-cooled chiller
- water-cooled chiller + cooling tower
- dry cooler
- adiabatic/evaporative systems
- economizer / free cooling

Local climate determines effectiveness. 'Free cooling var' ifadesi design conditions, hours/year, humidity/water strategy ve contamination analysis olmadan anlamlı değildir.

## 7. Water use

Cooling efficiency yalnız PUE ile değerlendirilmemelidir. Water consumption kritik bölgelerde WUE ve water-risk değerlendirmesi gerekir.

Water-based heat rejection ile liquid cooling aynı şey değildir:
- server liquid cooling secondary closed loop olabilir
- outdoor heat rejection dry cooler olabilir
- groundwater doğrudan IT loop'a bağlanmamalıdır unless specifically engineered, treated and isolated

Facility water ve technology cooling system (TCS) boundaries açık tanımlanmalıdır.

## 8. Liquid cooling categories

### Direct-to-chip / cold plate
Cold plate CPU/GPU/memory gibi high-heat components üzerine oturur. Liquid heat'i doğrudan chip yakınından alır.

Genellikle server'da tüm heat liquid'e gitmeyebilir; PSU, NIC ve diğer components için residual air cooling gerekebilir. NVIDIA GTC data-center cooling session'larında direct-to-chip deployment'larda liquid + air hybrid requirement örnekleri açıklanır.

### Rear Door Heat Exchanger
Rack exhaust air heat exchanger üzerinden liquid loop'a aktarılır. IT server içinde liquid modification gerektirmeyebilir.

### Immersion cooling
IT equipment dielectric fluid içine immersed edilir.

#### Single-phase
Liquid faz değiştirmeden heat exchanger'a taşır.

#### Two-phase
Dielectric fluid kaynar/condense olur; fluid chemistry ve environmental lifecycle çok önemlidir.

Operational impacts:
- server service procedure
- component compatibility
- fluid handling
- warranties
- lifting/draining
- network/power cabling

Immersion her AI workload için otomatik tercih değildir.

## 9. CDU — Coolant Distribution Unit

CDU facility loop ile technology cooling loop arasında heat exchange, pumping, filtration, pressure/temperature control sağlar.

Architectures:
- in-rack CDU
- in-row CDU
- perimeter CDU
- liquid-to-liquid
- liquid-to-air

Vertiv CoolChip family, direct-to-chip ve rear-door cooling için in-rack/in-row/perimeter ve liquid-to-liquid/liquid-to-air implementation examples sunar. Bunlar vendor examples olup architecture seçeneklerini göstermek için kullanılır.

## 10. Facility Water System vs Technology Cooling System

Önerilen logical separation:

FACILITY HEAT REJECTION / CHILLED WATER
        |
       HX / CDU
        |
TECHNOLOGY COOLING SYSTEM
        |
RACK MANIFOLD
        |
SERVER QD HOSE
        |
COLD PLATE

Neden isolation?
- water quality control
- material compatibility
- pressure separation
- contamination protection
- serviceability
- equipment warranty boundary

## 11. Rack manifold and quick disconnects

OCP 2026 Liquid Cooling Cold Plate Requirements dokümanı rack manifold'u rack içindeki liquid distribution'ın temel component'i olarak tanımlar. Flow requirement, coupling type, manifold dimension ve future capacity birlikte seçilmelidir.

Design criteria:
- flow capacity
- pressure drop
- materials
- blind-mate/hand-mate QD
- leak rate
- dripless behavior
- service clearance
- hose routing
- redundancy philosophy

## 12. Liquid cooling water/fluid quality

Critical parameters architecture/product'a göre değişir:
- conductivity
- pH
- hardness
- dissolved oxygen
- corrosion inhibitors
- biocide
- particulate filtration
- material compatibility

Bu değerler genel tahminle değil IT OEM/CDU/manifold requirements ile freeze edilmelidir.

## 13. Condensation and dew point

Coolant temperature surrounding air dew point'in altına düşerse condensation riski doğar.

Possible strategy:
- warm-water cooling
- dew-point monitoring
- supply temperature control
- insulation where needed

High-temperature liquid loops efficiency/free-cooling opportunities artırabilir. NVIDIA'nın 2026 Rubin-generation public materials'ında 45°C'ye kadar warm-liquid operation örneği verilmektedir; bu product-generation-specific örnektir, bütün liquid-cooled hardware için limit değildir.

## 14. Density-based selection framework

Tek bir industry threshold yoktur. Practical SpecBridge planning bands:

### <10 kW/rack
Well-designed air cooling çoğunlukla yeterli.

### 10–20 kW/rack
Containment + optimized room/in-row cooling yaygın seçenek.

### 20–40 kW/rack
In-row, RDHx veya enhanced air design değerlendirilir; equipment airflow çok önemlidir.

### 40–80 kW/rack
Liquid-assisted architecture güçlü aday. Direct-to-chip/RDHx hybrid design sık değerlendirilir.

### 80–150+ kW/rack
Purpose-built liquid cooling çoğunlukla ana design path olur; power, hydraulics ve network birlikte tasarlanmalıdır.

Bu bandlar engineering decision aid'dir, standard değildir.

## 15. Air vs liquid comparison

| Kriter | Air Cooling | RDHx | Direct-to-Chip | Immersion |
|---|---|---|---|---|
| Existing server compatibility | Çok iyi | Çok iyi | OEM support gerekir | Specialized |
| Retrofit | Çok iyi | İyi/çok iyi | Orta | Zor |
| Density potential | Düşük–orta | Orta–yüksek | Çok yüksek | Çok yüksek |
| White-space airflow dependency | Yüksek | Orta | Residual heat'e bağlı | Düşük |
| Facility liquid piping | Chilled systems'de olabilir | Evet | Evet | Evet |
| IT maintenance familiarity | Çok yüksek | Yüksek | Orta | Düşük/özel |
| AI rack suitability | Sınırlı | Güçlü | Çok güçlü | Use-case dependent |

## 16. Cooling redundancy

N/N+1/2N ifadeleri cooling için de kullanılabilir ancak component level ile end-to-end path ayrılmalıdır.

Potential failure domains:
- chillers
- pumps
- cooling towers/dry coolers
- CRAH/CRAC/in-row units
- CDUs
- manifolds
- controls
- valves
- common headers
- utility water

N+1 CRAH units tek common chilled-water header fail olursa availability sağlamaz.

## 17. Controls and monitoring

Monitor:
- rack inlet temperature
- return temperature
- humidity/dew point
- differential pressure
- coolant supply/return temperature
- flow
- leak sensors
- CDU pump state
- filter condition
- valve positions
- chiller efficiency

Control loops must avoid hunting and unintended interactions between room cooling and liquid loops.

## 18. PUE and cooling efficiency

PUE:
TOTAL FACILITY ENERGY / IT EQUIPMENT ENERGY

Düşük PUE iyi olabilir fakat tek başarı metriği değildir. Availability, water, climate, utilization ve embodied infrastructure dikkate alınmalıdır.

Cooling design düşük PUE uğruna reliability veya equipment envelope'ı ihlal etmemelidir.

## 19. Common mistakes

1. Cooling'i room tonnage hesabına indirgemek.
2. Rack density distribution yerine average kW/rack kullanmak.
3. Hot/cold mixing'i capacity artırarak çözmeye çalışmak.
4. Liquid cooling = chilled water demek.
5. Facility water'ı doğrudan IT loop'a bağlamak.
6. CDU/manifold failure domains'i modellememek.
7. Residual air heat'i direct-to-chip tasarımında unutmak.
8. Water/fluid chemistry ve material compatibility'yi OEM'den bağımsız belirlemek.
9. Leak detection ve service procedure hazırlamamak.
10. AI zone'u mevcut air hall'a yalnız daha büyük CRAC ekleyerek çözmeye çalışmak.

## 20. Cooling architecture checklist

- IT load and density distribution
- server environmental class
- airflow per rack
- inlet temperature target
- aisle containment
- room topology
- DX/chilled-water choice
- heat rejection
- climate design conditions
- water availability/risk
- redundancy
- future density
- liquid-ready interfaces
- CDU location/capacity
- FWS/TCS isolation
- manifold/QD
- fluid chemistry
- leak detection
- dew-point control
- monitoring
- commissioning
- maintenance access

## 21. Official / authoritative references

1. ASHRAE — Publication Updates / Datacom Series including Thermal Guidelines 5th Edition and Liquid Cooling Guidelines
https://www.ashrae.org/technical-resources/publication-errata-and-updates

2. ASHRAE — Handbook Chapter 20, Data Centers and Telecommunications Facilities
https://handbook.ashrae.org/Handbooks/A23/SI/A23_Ch20/a23_ch20_si.aspx

3. ASHRAE — High Reliability and Energy Efficiency / Thermal Guidelines Fifth Edition overview
https://www.ashrae.org/news/ashraejournal/achieving-high-reliability-energy-efficiency-in-data-center-design-operations

4. Open Compute Project — ACS Liquid Cooling Cold Plate Requirements, 2026
https://www.opencompute.org/documents/ocp-acs-liquid-cooling-cold-plate-requirements-pdf

5. Open Compute Project — Rack Manifold Requirements and Qualification
https://www.opencompute.org/documents/ocp-white-paper-rack-manifold-requirements-and-qualification-v3-pdf

6. Vertiv — CoolChip CDU family, architecture examples
https://www.vertiv.com/en-us/products-catalog/thermal-management/high-density-solutions/vertiv-coolchip-cdu/

7. NVIDIA GTC — Impacts of Introducing Liquid Cooling into Data Center Infrastructure
https://www.nvidia.com/en-us/on-demand/session/gtc25-exs74208/

8. NVIDIA — liquid-cooled AI platform direction example
https://blogs.nvidia.com/blog/liquid-cooling-ai-factories/

## 22. Research freeze statement

Cooling technology must be selected from the IT workload outward, not from the mechanical equipment catalog inward. Air, rear-door, direct-to-chip and immersion are tools in a thermal architecture. The correct solution is the architecture that safely removes the expected heat load, preserves serviceability and redundancy, meets equipment environmental requirements and supports the site's future density and sustainability constraints.