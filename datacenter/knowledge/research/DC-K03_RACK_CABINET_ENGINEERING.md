# DC-K03 — Rack & Cabinet Engineering

Status: WAVE 1 RESEARCH BASELINE
Language: TR
Author: Önder Yardaş
Research date: 2026-09-01

## Executive conclusion

Bir rack/kabinet yalnız equipment enclosure değildir. Mekanik taşıma, power distribution, airflow, liquid distribution, cabling, grounding, monitoring ve serviceability aynı fiziksel noktada birleşir. Rack seçimi yanlışsa server doğru olsa bile deployment verimsiz, sıcak, servis edilmesi zor veya future-ready olmayan bir sisteme dönüşebilir.

Rack engineering için temel soru '42U mu 48U mu?' değildir. Doğru soru şudur:

WORKLOAD + EQUIPMENT FORM FACTOR + POWER DENSITY + COOLING METHOD + CABLING + SERVICE ACCESS + FLOOR/STRUCTURAL LIMITS -> RACK ARCHITECTURE

## 1. Rack, cabinet ve enclosure farkı

### Open rack
Kapak/yan panel olmadan equipment mounting frame. Lab, hyperscale veya controlled hall uygulamalarında görülebilir.

### Cabinet
Rack frame + side panels/doors/security/airflow management kombinasyonu. Enterprise ve colocation için tipiktir.

### Smart cabinet / integrated enclosure
Rack ile birlikte UPS/PDU/cooling/monitoring/access gibi supporting systems'in entegre edildiği çözümdür.

### Open Compute rack
OCP Open Rack, geleneksel 19-inch rack ecosystem'inden farklı, data-center-specific rack/power architecture yaklaşımıdır. OCP Rack & Power Project, rack'i grid-to-chip zincirinin bir parçası olarak ele alır. Open Rack V3 familyasında busbar ve power shelf gibi rack-level DC power distribution yaklaşımları bulunur.

## 2. 19-inch rack temel kavramları

Geleneksel enterprise equipment ekosisteminin büyük bölümü 19-inch mounting rails kullanır. Kritik boyutlar:

- usable rack units (U)
- rack width
- rack depth
- front/rear clearance
- static load
- dynamic/shipping load
- rail compatibility
- door perforation
- cable pathways
- PDU mounting zone

42U, 45U, 47U, 48U gibi yükseklikler yaygındır ancak doğru yükseklik ceiling, fire system, cable tray, overhead busway ve serviceability ile birlikte değerlendirilmelidir.

## 3. Rack width and depth

### 600 mm class
Network/standard server deployments için kullanılabilir, fakat side cable management ve high-density PDU/cabling için dar kalabilir.

### 800 mm class
Daha fazla cable management, side-mounted PDU ve airflow control alanı sunar.

### 1000/1200 mm depth sınıfı
Modern deep servers, GPU systems, storage nodes ve cable bend radius için daha uygun olabilir.

Rakamlar vendor ve product family'ye göre değişir. En uzun server chassis + rear connector/cable bend + rear-door/cooling equipment + service clearance birlikte hesaplanmalıdır.

## 4. Rack load engineering

### Static load
Rack yerindeyken taşıyabileceği equipment ağırlığı.

### Dynamic / rolling load
Rack hareket ettirilirken veya transport sırasında izin verilen yük.

### Floor loading
Rack toplam ağırlığı tek başına yeterli değildir. Contact area ve point load yapı mühendisliği açısından önemlidir.

AI/GPU rack'lerde ağırlık ciddi artabilir:
- dense compute chassis
- large PSU population
- rear-door HX
- liquid manifolds
- rack CDU
- copper busbars

Bu nedenle high-density rack seçimi structural design ile koordine edilmelidir.

## 5. Rack power distribution

### Conventional AC rack
Tipik zincir:

FACILITY PDU / BUSWAY -> RACK PDU A + RACK PDU B -> SERVER PSU A/B

A/B feed gerçek redundancy yaratmak için upstream distribution paths de bağımsız olmalıdır. Aynı UPS veya aynı panelden gelen iki rack PDU yalnız görünüşte dual feed olabilir.

### Intelligent rack PDU
Ölçebileceği seviyeler product'a göre değişir:
- inlet metering
- branch/outlet metering
- current
- voltage
- power
- energy
- temperature/humidity sensors
- switched outlets

Colocation'da billing/metering ve capacity management için önemlidir.

### Rack busbar / OCP approach
OCP Open Rack V3 ecosystem'inde vertical busbar ve power shelf yapısı bulunur. OCP listelerindeki ORv3 implementations 48/50V-class DC rack architecture örnekleri sunar. Bu yapı traditional AC rack PDU yaklaşımından farklıdır ve hyperscale/OCP-oriented ecosystem gerektirir.

OCP'deki bir Eaton ORv3 örneği 21-inch ORv3 veya traditional 19-inch equipment'i hybrid destekleyebilen rack ve vertical DC busbar opsiyonunu gösterir. Bu vendor implementation örneğidir, genel enterprise standard değildir.

## 6. Rack airflow

### Front-to-back airflow
Server ekipmanlarının çoğunda standart airflow yönüdür. Cold aisle önden besler, hot aisle arkadan ısıyı toplar.

### Blanking panels
Boş U pozisyonlarından sıcak havanın cold aisle'a recirculation yapmasını azaltır.

### Perforated doors
Door open area ve pressure drop rack cooling kapasitesini etkiler.

### Cable obstruction
Rear cable bundle airflow resistance yaratabilir. Cable management yalnız estetik konu değildir.

### Containment relationship
Rack door, row geometry ve aisle containment birlikte tasarlanmalıdır.

## 7. Rack liquid cooling readiness

High-density deployment için rack şu unsurları destekleyebilir:
- cold-plate manifold mounting
- supply/return hose paths
- dripless quick disconnects
- leak detection
- rack CDU veya row CDU interfaces
- rear-door heat exchanger weight and hinge requirements
- condensate/dew-point strategy if applicable

OCP approved rack örneklerinde cold-plate manifolds için mounting ve yüksek-density power/cooling adaptations görülmektedir.

## 8. Rear Door Heat Exchanger

RDHx rack'in arka kapısında server exhaust heat'i liquid loop ile alır. İki yaklaşım görülebilir:

- passive RDHx
- active/fan-assisted RDHx

Avantaj:
- existing air-cooled server'larla retrofit imkanı
- room cooling yükünü azaltma potansiyeli

Risk:
- rack depth/weight
- door serviceability
- liquid hose routing
- facility water/CDU requirements

## 9. Rack density classification — engineering approach

Tek bir global kW/rack sınıflaması yoktur. SpecBridge karar modelinde practical envelope kullanılabilir:

- Low: <5 kW/rack
- Standard enterprise: ~5–10 kW/rack
- Medium: ~10–20 kW/rack
- High: ~20–40 kW/rack
- Very high / AI transition: ~40–80 kW/rack
- Extreme AI/HPC: 80–150+ kW/rack

Bu sınırlar standard değildir; design decision bands olarak kullanılmalıdır. Actual cooling selection equipment airflow/liquid requirements ile doğrulanmalıdır.

## 10. Cabinet selection decision matrix

| Requirement | Standard 600 mm cabinet | 800 mm enterprise cabinet | Smart cabinet | OCP/Open Rack | AI liquid-ready rack |
|---|---|---|---|---|---|
| General servers | İyi | Çok iyi | Küçük deployment | Ecosystem-dependent | Uygun ama overkill olabilir |
| Dense cabling | Orta | Çok iyi | Sınırlı | Tasarıma bağlı | Çok iyi olmalı |
| Edge | Orta | Orta | Çok iyi | Genelde değil | Genelde değil |
| Colocation | İyi | Çok iyi | Özel kullanım | Customer demand'e bağlı | AI colo için güçlü |
| OCP hyperscale | Zayıf | Zayıf/orta | Zayıf | Çok iyi | ORv3 high-density variants |
| 60+ kW AI | Genelde uygun değil | Tasarıma bağlı | Genelde değil | High-power design'e bağlı | Çok iyi |

## 11. Cable management

Rack-level cabling dört ayrı zone olarak ele alınmalıdır:

1. power A
2. power B
3. copper/data
4. fiber/high-speed interconnect

Fiber bend radius, DAC/AOC ağırlığı ve GPU cluster'daki büyük cable counts serviceability'yi ciddi etkiler.

Top-of-rack vs end-of-row network seçimi rack cable density'yi değiştirir.

## 12. Grounding / bonding

Rack metallic parts, doors, cable pathways ve equipment grounding local electrical codes ve project earthing design ile uyumlu olmalıdır. 'Rack metal olduğu için zaten grounded' varsayımı yapılmamalıdır.

## 13. Monitoring

Rack monitoring minimum şu bilgileri hedeflemelidir:
- power draw
- A/B feed health
- environmental sensors
- door/access events if required
- leak detection for liquid-ready zones
- capacity threshold alarms

DCIM integration use-case ve data quality belirlenmeden yalnız sensor satın almak değer yaratmaz.

## 14. Serviceability

Mühendislikte sık unutulan konu:

SERVER ÇALIŞIYOR MU? kadar SERVER GÜVENLİ VE HIZLI SERVİS EDİLEBİLİYOR MU?

Kontrol:
- front/rear clearance
- rail extraction distance
- heavy equipment lifting tools
- overhead tray interference
- PDU access
- liquid QD access
- rack door removal
- neighboring cabinet obstruction

## 15. Traditional vs modular cabinet

'Modüler kabinet' iki farklı anlama gelebilir:

### A. Modular rack construction
Rack accessories, PDU, monitoring, cooling options'ın modüler seçilmesi.

### B. Micro/modular data center cabinet
Rack'in çevresinde supporting infrastructure'ın integrated enclosure olarak sunulması.

Bu iki kavram karıştırılmamalıdır.

## 16. Common mistakes

1. Server depth kontrol etmeden rack sipariş etmek.
2. Rack U capacity'yi tek capacity metriği sanmak; power/cooling çoğu zaman önce dolar.
3. A/B rack PDU var diye upstream redundancy varsaymak.
4. AI rack ağırlığını structural design'dan ayırmak.
5. Rear cable congestion'ı airflow modeline dahil etmemek.
6. Liquid-ready demek için yalnız manifold mounting yeri bırakmak; CDU/leak/hoses/service planını unutmak.
7. Network optics/DAC cable bend radius'i ihmal etmek.
8. Customer colo cabinet dimension standardını sözleşmede tanımlamamak.

## 17. Rack engineering checklist

- RU requirement and growth
- maximum chassis depth
- equipment weight
- rack total weight
- floor/point load
- width/depth
- front/rear clearance
- airflow direction
- door perforation
- blanking
- A/B power
- PDU form factor
- connector types
- metering
- cable paths
- fiber bend radius
- grounding
- sensor locations
- liquid manifold readiness
- RDHx compatibility
- leak detection
- seismic requirement
- locking/access policy
- service tooling

## 18. Official / authoritative references

1. Open Compute Project — Rack & Power Project
https://www.opencompute.org/index.php/community/rack-and-power

2. Open Compute Project — Open Rack Specifications and Designs
https://www.opencompute.org/wiki/Open_Rack/SpecsAndDesigns

3. OCP — Eaton Open Rack v3 example
https://www.opencompute.org/products/390/eaton-open-rack-v3-orv3

4. OCP — Open Rack v3 Power Shelf example
https://www.opencompute.org/products/389/400g-disaggregated-core-and-edge-router-ddc

5. OCP — Open Rack V3 power connector specification
https://www.opencompute.org/documents/ocp-open-rack-v3-power-output-connector-rev2-0-pdf

6. OCP — Sanmina ORv3 example with cold-plate manifold support
https://www.opencompute.org/products/414/sanmina-open-rack-v3-orv3

7. ASHRAE — Datacom publication family / thermal and liquid cooling references
https://www.ashrae.org/technical-resources/publication-errata-and-updates

## 19. Research freeze statement

Rack/cabinet selection equipment catalog exercise değildir. It is the physical integration point of mechanical, electrical, thermal, network and operational design. Project-specific rack standard must be frozen only after workload, density, power, cooling and serviceability envelopes are known.