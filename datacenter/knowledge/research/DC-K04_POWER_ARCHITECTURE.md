# DC-K04 — Data Center Power Architecture

Status: WAVE 1 RESEARCH BASELINE
Language: TR
Author: Önder Yardaş
Research date: 2026-09-01

## Executive conclusion

Veri merkezinde 'elektrik var mı?' sorusu yetersizdir. Asıl mühendislik konusu, utility kaynağından IT power supply unit'e kadar uzanan zincirin hangi failure domain'lere ayrıldığı, hangi bileşenin yedekli olduğu, bakım sırasında hangi path'in kalmaya devam ettiği ve bir arızanın hangi müşterileri etkileyebildiğidir.

Tipik zincir:

UTILITY / GRID -> MV SWITCHGEAR -> TRANSFORMER -> LV SWITCHGEAR -> UPS -> PDU/RPP veya BUSWAY -> RACK PDU A/B -> IT PSU A/B

Generator ve energy storage, utility kaybı sırasında bu zincirin sürekliliğini destekler.

Doğru power design, tek tek kaliteli cihazlardan değil; topology + protection + controls + maintenance + operations bütününden oluşur.

## 1. Power chain katmanları

### Utility / grid connection
Kontrat gücü, short-circuit level, utility redundancy, feeder topology ve energization schedule belirlenir.

### Medium Voltage switchgear
Utility/transformer feeders, protection, isolation ve switching burada yönetilir. MV topology site scale ve local utility yapısına göre değişir.

### Transformers
MV'yi facility LV seviyesine dönüştürür. Kayıplar, impedance, redundancy, fire strategy, location ve maintenance erişimi önemlidir.

### LV switchgear / switchboards
UPS, mechanical loads, lighting, generator interface ve downstream distribution'ı yönetir.

### UPS
Kısa süreli enerji sürekliliği, power conditioning ve generator devreye girene kadar ride-through sağlar.

### Downstream distribution
Klasik PDU/RPP veya modern busway/tap-off mimarileri kullanılabilir.

### Rack distribution
Rack PDU, busbar veya vendor-specific rack-level DC architecture ile IT PSU'lara besleme yapılır.

## 2. UPS topology

### Online double-conversion
AC -> DC -> AC dönüşüm yoluyla kritik yük sürekli inverter üzerinden beslenir. Vertiv'in UPS teknik white paper'ı double-conversion'ı data center için en kapsamlı power-disturbance protection yaklaşımı olarak tarif eder.

Avantaj:
- load isolation
- voltage/frequency conditioning
- mains disturbance filtering
- utility failure sırasında inverter zaten aktif olduğu için transfer gap yok

Dezavantaj:
- conversion losses
- more power electronics
- heat generation

### ECO / high-efficiency modes
Bazı UPS'lerde normal durumda bypass path kullanılarak conversion losses azaltılır. Efficiency artarken raw mains exposure ve transfer/control assumptions dikkatle değerlendirilmelidir. Mode seçimi yalnız efficiency KPI ile yapılmamalıdır.

### Static bypass
UPS inverter fault/overload veya certain operating modes sırasında alternate path sağlar. Static bypass'ı redundancy yerine bağımsız failure analysis içinde değerlendirmek gerekir.

### Maintenance bypass
UPS'in bakım için tamamen izole edilmesini sağlar. Manual/maintenance bypass tasarımı operational procedure ile birlikte düşünülmelidir.

## 3. UPS system configurations

Schneider Electric'in UPS configuration white paper'ı multiple principal UPS configurations olduğunu ve doğru modelin application requirements'a göre seçilmesi gerektiğini vurgular. SpecBridge karar modeli:

### N
Yalnız gerekli kapasite. Redundancy yok.

### N+1
Gerekli kapasiteye bir ek module/unit. Capacity component redundancy sağlar; distribution path redundancy sağlamayabilir.

### N+2
İki spare capacity unit/module.

### 2N
İki bağımsız tam-capacity power path. Gerçek 2N tasarımda common components minimize edilmelidir.

### 2N+1
İki path'in yanında ek capacity redundancy. Çok yüksek CAPEX ve complexity getirir.

### Distributed redundant
Multiple UPS systems and distribution paths ile critical load redundancy sağlanır; topology daha karmaşık olabilir ancak large facilities'de CAPEX/efficiency avantajları sunabilir.

## 4. A/B feed gerçeği

Bir server'da iki PSU olması tek başına redundancy değildir.

Gerçek A/B chain örneği:

UTILITY / GENERATION DOMAIN A -> UPS A -> DISTRIBUTION A -> RACK PDU A -> PSU A
UTILITY / GENERATION DOMAIN B -> UPS B -> DISTRIBUTION B -> RACK PDU B -> PSU B

Common-mode failures araştırılmalıdır:
- shared transformer
- shared switchboard bus
- shared bypass
- shared control power
- shared room/fire zone
- shared cable tray
- shared maintenance procedure

A/B etiketi electrical independence kanıtı değildir.

## 5. Generator architecture

Generator tasarımında yalnız kVA rating değil:
- starting sequence
- step load capability
- fuel autonomy
- fuel polishing/quality
- day tanks and bulk storage
- paralleling controls
- emissions/noise
- maintenance isolation
- N/N+1/2N topology
- black-start sequence

önemlidir.

UPS battery/generator interaction transient behavior açısından test edilmelidir.

## 6. Battery / energy storage

### VRLA
Olgun teknoloji; footprint, replacement cycle ve thermal environment önemlidir.

### Lithium-ion
Daha yüksek energy density, cycle life ve smaller footprint avantajı olabilir; thermal runaway, BMS, fire detection/suppression ve vendor lifecycle riskleri değerlendirilmelidir.

### Flywheel
Kısa ride-through ve high-cycle applications için kullanılabilir; generator reliability ile birlikte ele alınır.

### BESS
Facility-grid interaction ve longer-duration energy strategy sunabilir, fakat UPS battery ile aynı design problem değildir.

## 7. PDU / RPP vs busway

### Traditional PDU / RPP
Centralized transformer/distribution cabinets ve branch circuits rack'lere gider.

Avantaj:
- olgun, bilinen architecture
- fixed deployments için basit

Risk:
- cable-heavy
- changes/additions labor intensive
- underfloor congestion
- branch capacity granularity

### Busway
Upstream switchboard'dan overhead/underfloor busbar ve tap-off units ile rack power distribution.

Vertiv'in modern busway white paper'ı, busway'i traditional PDU/RPP'ye alternatif, scalable ve overhead data-hall distribution approach olarak tanımlar. Schneider iBusway dokümantasyonu da data center rack'leri için prefabricated busbar trunking ve tap-off yaklaşımı sunar.

Avantaj:
- flexible tap-off
- capacity changes kolay
- cable reduction
- overhead deployment ile floor airflow avantajı

Risk:
- short-circuit/protection coordination
- tap-off operational procedures
- vendor interoperability
- initial design envelope

## 8. AC vs DC rack / facility distribution

Traditional enterprise DC çoğunlukla AC facility distribution + server PSU conversion kullanır.

OCP/Open Rack gibi ekosistemlerde rack-level DC busbar/power shelf architecture görülebilir. Schneider'in DC architecture white paper'ı DC distribution'ın conversion-stage simplification potansiyelini tartışırken protection, isolation/earthing, fault modeling ve bypass gibi konuların daha karmaşık mühendislik gerektirdiğini vurgular.

Sonuç:
DC architecture 'daha verimli, o halde her yerde kullan' kararı değildir. IT ecosystem compatibility ve protection design kritik belirleyicidir.

## 9. Power quality

Kontrol edilmesi gereken başlıklar:
- voltage sags/swells
- harmonics
- frequency deviations
- transient events
- power factor
- phase imbalance
- grounding/neutral strategy

UPS seçimi poor upstream protection veya grounding tasarımını telafi etmez.

## 10. Protection and selective coordination

Bir branch fault mümkün olduğunca yalnız faulted branch'i açmalıdır. Upstream main breaker'ın gereksiz trip'i büyük outage yaratabilir.

Gerekli mühendislik:
- short-circuit study
- breaker/fuse coordination
- arc-flash study where applicable
- cable sizing
- ground fault strategy
- settings management

Protection settings commissioning sonrası kontrol altında tutulmalıdır.

## 11. Power monitoring

EPMS/BMS/DCIM integration için minimum levels:

UTILITY -> MV -> TRANSFORMER -> LV -> UPS INPUT/OUTPUT -> DISTRIBUTION -> BUSWAY/PDU -> RACK PDU -> optionally OUTLET

Ölçümler:
- kW/kVA
- current
- voltage
- PF
- energy
- THD where needed
- breaker state
- battery state
- UPS mode

Colocation billing data ile engineering telemetry aynı purpose değildir; metering accuracy class ve commercial boundary tanımlanmalıdır.

## 12. Redundancy vs maintainability

### Redundancy
Bir component arızalandığında spare capacity/path vardır.

### Concurrent maintainability
Planned maintenance için bir component/path service'den çıkarılabilir ve critical load çalışmaya devam eder.

Uptime Tier III kavramında planned removal of capacity components/distribution path maintenance sırasında operasyonun sürmesi temel prensiptir. Ancak site yine equipment failure veya operator error'a maruz kalabilir.

Bu nedenle 'N+1 UPS var = Tier III' yanlış çıkarımdır.

## 13. AI/high-density power impact

AI cluster'larda klasik 5–10 kW rack yerine 40–150+ kW zones ortaya çıkabilir.

Etkiler:
- rack circuit current büyür
- busway/tap-off sizing değişir
- transformer/UPS block size değişir
- floor cable/bus density artar
- liquid cooling electrical loads eklenir
- GPU load dynamics daha hızlı olabilir
- power shelf/rack busbar architectures gündeme gelir

Schneider'in 2026 grid-to-chip AI power paper'ı AI data center power distribution'ı grid'den chip'e kadar bütünsel ölçekleme problemi olarak ele alır.

## 14. Common power design mistakes

1. IT load ile utility capacity'yi aynı sayı kabul etmek.
2. UPS nameplate toplamını usable resilient capacity sanmak.
3. A/B rack feed'in upstream common points'ini analiz etmemek.
4. Mechanical cooling loads'i utility/generator sizing'den ayırmak.
5. Future AI zone için busway/switchboard space bırakmamak.
6. Breaker coordination study olmadan settings freeze etmek.
7. Static bypass/maintenance bypass failure domain'lerini modellememek.
8. Battery autonomy'yi generator start sequence'den bağımsız seçmek.
9. Capacity growth için spare ways/tap-offs/switchgear sections planlamamak.
10. Commissioning'de real failure transfer scenarios test etmemek.

## 15. Decision matrix

| Requirement | Traditional PDU/RPP | Busway | Rack-level DC/OCP |
|---|---|---|---|
| Fixed enterprise layout | İyi | İyi | Genelde gerekmez |
| Dynamic colocation | Orta | Çok iyi | Customer ecosystem'e bağlı |
| High rack count | Cable-heavy | Çok iyi | Hyperscale/OCP'de güçlü |
| Frequent moves/adds/changes | Zayıf/orta | Çok iyi | Platform-dependent |
| Standard 19-inch mixed IT | Çok iyi | Çok iyi | Compatibility kontrolü |
| OCP hyperscale | Orta | Orta | Çok iyi |
| AI high density | Tasarıma bağlı | Çok güçlü | High-power rack architecture için güçlü |

## 16. Power architecture checklist

- initial and ultimate IT MW
- mechanical load
- utility redundancy
- MV topology
- transformer redundancy
- UPS topology and mode
- battery technology/autonomy
- generator topology/fuel autonomy
- A/B independence
- bypass topology
- maintenance isolation
- downstream PDU/RPP/busway
- rack voltage/current
- protection coordination
- grounding/neutral
- EPMS metering
- spare capacity
- future high-density blocks
- commissioning failure tests
- SOP/MOP/EOP

## 17. Official / authoritative references

1. Uptime Institute — Tier Classification System
https://uptimeinstitute.com/tiers

2. Uptime Institute — Tier Certification
https://uptimeinstitute.com/tier-certification

3. Schneider Electric — Comparing UPS System Design Configurations
https://www.se.com/us/en/download/document/SPD_SADE-5TPL8X_EN/

4. Schneider Electric — Necessary Considerations for Designing DC Architectures in Data Centers
https://www.se.com/us/en/download/document/SPD_WP47_EN/

5. Schneider Electric — iBusway for Data Center
https://www.se.com/uk/en/download/document/DEBU028EN/

6. Schneider Electric — From Grid to Chip: Scalable Power Distribution for AI Data Centers, 2026
https://www.se.com/us/en/download/document/SE-DB-AI_DataCenter/

7. Vertiv — Picking the Right UPS for Your Data Center
https://www.vertiv.com/4aabcf/globalassets/documents/white-papers/white_paper_refresh_-_picking_the_right_ups_for_your_data_center-rev2_244002_0.pdf

8. Vertiv — Optimizing Data Center Power Distribution Through Innovative Busway Design
https://www.vertiv.com/495089/globalassets/products/critical-power/busway-and-busduct/vertiv-powerbar-impb/optimizing-data-center-power-distribution-through-innovative-busway-design-white-paper.pdf

9. Open Compute Project — Rack & Power / Open Rack specifications
https://www.opencompute.org/index.php/community/rack-and-power

## 18. Research freeze statement

Power architecture should be evaluated as a topology and failure-domain system, not a list of UPS, transformer and generator quantities. The correct design is the minimum architecture that satisfies the required business availability, maintainability, capacity growth, safety and lifecycle objectives without creating unnecessary common-mode risk or stranded CAPEX.