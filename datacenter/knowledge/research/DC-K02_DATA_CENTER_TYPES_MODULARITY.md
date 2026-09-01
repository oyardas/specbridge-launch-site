# DC-K02 — Data Center Types, Traditional vs Prefabricated / Modular

Status: WAVE 1 RESEARCH BASELINE
Language: TR
Author: Önder Yardaş
Research date: 2026-09-01

## Executive conclusion

'Geleneksel' ve 'modüler' veri merkezi iki zıt teknoloji değildir; esas fark üretim ve teslimat metodolojisidir. Geleneksel yaklaşımda sistemlerin büyük bölümü sahada tasarlanır, monte edilir ve entegre edilir. Prefabricated/modular yaklaşımda power, cooling, IT veya full-facility blokları fabrikada daha yüksek standardizasyonla üretilip test edilerek sahada entegre edilir.

Schneider Electric'in güncel prefabricated data center white paper'ı bu yaklaşımı 'custom construction' zihniyetinden 'standardized site integration' modeline geçiş olarak tanımlar. Uptime Institute ise modular sistemlerin Tier hedefleriyle çelişmediğini; Tier-Ready programıyla modular deployment'ların da aynı performance-based reliability yaklaşımında değerlendirilebildiğini belirtir.

Dolayısıyla soru 'modüler mi geleneksel mi daha iyi?' değil, şudur:

HANGİ İŞ YÜKÜ + HANGİ BÜYÜME HIZI + HANGİ SAHA + HANGİ KAPASİTE BLOKLARI + HANGİ AVAILABILITY HEDEFİ -> HANGİ DELIVERY MODELİ?

## 1. Data center deployment türleri

### Traditional / stick-built
Bina, electrical, mechanical ve IT-supporting infrastructure büyük ölçüde proje bazlı ve sahada oluşturulur.

Güçlü yanları:
- çok yüksek layout özgürlüğü
- kompleks site ve bina şartlarına uyum
- büyük tek-parça kampüslerde geniş tasarım esnekliği
- özel utility, fuel, water ve structural çözümlere uyum

Zayıf yanları:
- daha uzun saha programı
- saha kalite değişkenliği
- çok sayıda subcontractor interface
- commissioning entegrasyonunun daha karmaşık olabilmesi
- capacity'nin erken ve büyük bloklarda kurulması halinde stranded CAPEX riski

### Prefabricated modular data center
Power room, cooling module, IT module veya bunların kombinasyonları fabrikada entegre edilir.

Schneider'in 2026 White Paper 163 revizyonunda standardize, pre-assembled ve integrated modules'ın daha hızlı deployment ve daha öngörülebilir execution sunduğu; geleneksel stick-built ile benzer maliyet düzeyinde olabileceği belirtilir. Bu bir üretici perspektifidir ancak metodolojik ayrım önemlidir.

### Containerized data center
IT veya support infrastructure ISO-container benzeri enclosure içinde olabilir. Her modular çözüm container değildir; 'modular' daha geniş üst kavramdır.

### Micro data center
Küçük footprint'te rack, power, cooling, monitoring ve fiziksel enclosure birleşimidir. Vertiv'in micro data center tanımı, IT ve supporting facility infrastructure'ın önceden entegre edilmiş küçük bir birimde birleştirilmesine örnektir.

### Smart cabinet / all-in-one cabinet
Tek veya birkaç rack seviyesinde UPS, PDU, precision cooling, monitoring, access ve yangın algılama gibi fonksiyonların cabinet/row çözümü içinde toplanmasıdır. Branch office, edge, küçük server room ve kontrollü hızlı deployment senaryolarına uygundur.

### Prefabricated multi-MW block
IT hall + power + cooling + monitoring gibi sistemler MW-scale modüller olarak büyütülür. Vertiv MegaMod örneği 0.5 MW / 1 MW building block ölçeğinde genişleme yaklaşımını gösterir. Bu rakam vendor product örneğidir, industry standard değildir.

## 2. Modülerlik seviyeleri

Modular terimini tek tip kabul etmek hatadır. En az dört seviye ayırmak gerekir:

### Level M1 — Component modularity
UPS power modules, battery cabinets, modular chillers, rack PDUs, modular switchgear.

### Level M2 — Subsystem modularity
Prefabricated power room, cooling skid, CDU skid, pump room, generator enclosure.

### Level M3 — IT-space modularity
Containerized IT room, prefabricated data hall, modular row or micro DC.

### Level M4 — Full facility modularity
IT, power, cooling, fire, monitoring ve security fonksiyonlarının büyük ölçüde fabrika entegrasyonlu bloklarda teslim edilmesi.

Bir proje hybrid olabilir: bina traditional, power rooms prefabricated, white-space traditional, AI cooling skid modular.

## 3. Traditional vs modular decision matrix

| Kriter | Traditional | Prefabricated / Modular |
|---|---|---|
| İlk tasarım özgürlüğü | Çok yüksek | Orta–yüksek, product envelope'a bağlı |
| Deployment süresi | Genelde daha uzun | Genelde daha kısa |
| Factory integration | Düşük/orta | Yüksek |
| Site labor dependency | Yüksek | Daha düşük |
| Repeatability | Orta | Yüksek |
| Phased expansion | Tasarıma bağlı | Güçlü kullanım alanı |
| Irregular building fit | Güçlü | Zorlaşabilir |
| Remote/edge | Genelde zayıf | Çok güçlü |
| Multi-MW custom campus | Çok güçlü | Hybrid/modular block ile güçlü olabilir |
| Transportation constraints | Düşük | Kritik olabilir |
| Vendor lock-in riski | Tasarıma bağlı | Platform seçimine göre artabilir |
| Commissioning | Site-heavy | Factory + site integration şeklinde bölünebilir |

## 4. Modüler yaklaşımın gerçek avantajları

### Schedule compression
Fabrika üretimi ile site civil works paralel yürütülebilir. Bu, özellikle time-to-capacity kritikse değerlidir.

### Repeatable quality
Bir modül ailesi tekrarlandığında wiring, piping, controls ve testing daha standardize hale gelir.

### Phased CAPEX
İhtiyaç geldikçe 250 kW, 500 kW, 1 MW vb. blokların eklenmesi mümkündür. Ancak block size vendor/design'e göre değişir; sayı evrensel değildir.

### Factory Acceptance Testing
Daha fazla sistem sahaya gelmeden test edilebilir. Bu commissioning'i ortadan kaldırmaz; site integration ve integrated systems testing yine gereklidir.

### Edge deployment
Remote locations, telco edge, hospital/industrial campus ve hızlı regional expansion için güçlüdür.

## 5. Modüler yaklaşımın riskleri

### Interface risk
Module içi kalite yüksek olsa bile module-to-site ve module-to-module interface yanlış tasarlanabilir.

Kontrol edilmesi gerekenler:
- MV/LV termination
- chilled/facility water interface
- controls/BMS/DCIM protocol mapping
- fire zoning
- structural/seismic anchoring
- weatherproofing
- network/fiber entry
- fuel and generator interfaces

### Transportation envelope
Road, bridge, port, crane, route survey, maximum module dimensions/weight kritik olabilir.

### Vendor-specific envelope
Bir üreticinin module geometry, bus, control veya cooling standardına fazla bağımlı tasarım future expansion'da lock-in yaratabilir.

### False simplicity
'Factory-built' olması, design validation, site engineering veya commissioning ihtiyacını kaldırmaz.

## 6. Tier ve modularity

Uptime Institute Tier yaklaşımı technology-neutral ve performance-based'dir. Tier Certification sayfası modular configurations ve leading-edge power/cooling solutions'ın performans kriterlerini sağladığı sürece kabul edilebilir olduğunu vurgular.

Tier-Ready programı prefabricated/modular design'ları manufacturer seviyesinde ön doğrulamaya tabi tutar. Bu, tüm saha otomatik olarak Tier Certified olur anlamına gelmez; final site integration yine proje kapsamıdır.

Önemli ayrım:

TIER-READY MODULE != TIER-CERTIFIED SITE

## 7. Smart cabinet / micro modular vs traditional rack room

### Smart cabinet avantajları
- küçük footprint
- hızlı kurulum
- integrated monitoring
- küçük BT ekipleri için basitleştirilmiş operasyon
- branch/edge için uygun

### Smart cabinet sınırlamaları
- cooling/power envelope sınırlı
- expansion granularity kaba olabilir
- service access dar olabilir
- noise/heat rejection ve room conditions yine önemlidir
- multi-rack high-density scaling'de traditional/modular room daha uygun olabilir

### Traditional cabinet rows avantajları
- standart 19-inch ecosystem
- daha esnek rack population
- büyük white-space içinde operasyon kolaylığı
- vendor neutrality daha yüksek olabilir

## 8. Use-case guide

### 1–5 racks / branch / hospital edge
Öneri: micro DC veya smart-cabinet yaklaşımı ciddi adaydır.

### 10–50 racks / fast enterprise deployment
Öneri: modular row, prefabricated power/cooling veya hybrid değerlendirilmeli.

### 0.5–5 MW fast-growth regional DC
Öneri: prefabricated power/cooling + modular capacity blocks güçlü adaydır.

### Large bespoke campus
Öneri: traditional campus + modular subsystems/halls hybrid yaklaşımı genellikle daha esnek olabilir.

### AI expansion inside existing air-cooled facility
Öneri: full rebuild yerine modular CDU/liquid-cooling pod/AI zone değerlendirilebilir.

## 9. Common mistakes

1. Modular = container kabul etmek.
2. Prefabricated = düşük kaliteli/geçici çözüm sanmak.
3. Factory-tested = site commissioning gereksiz demek.
4. TIER-Ready = site Tier Certified demek.
5. Transport/crane/route constraints'i geç değerlendirmek.
6. Module vendor'a bağlı interfaces'i standardize etmemek.
7. Future power/cooling expansion path'i baştan tasarlamamak.
8. Micro data center'ı büyük colo mimarisine ölçeklemek.

## 10. Design checklist

- target IT MW
- initial vs ultimate capacity
- rack density distribution
- service model
- redundancy target
- site shape and setbacks
- logistics / crane / transport limits
- utility energization schedule
- factory test strategy
- local code compliance
- BMS/DCIM integration
- future block compatibility
- spare parts and lifecycle
- vendor-neutral interface definitions
- commissioning boundary

## 11. Official / authoritative references

1. Schneider Electric — Benefits and Drawbacks of Prefabricated Modules for Data Centers, White Paper 163, V4, 2026
https://www.se.com/us/en/download/document/SPD_WTOL-7NGRBS_EN/

2. Uptime Institute — Tier Classification System
https://uptimeinstitute.com/tiers

3. Uptime Institute — Tier Certification / performance-based and technology-neutral approach
https://uptimeinstitute.com/tier-certification

4. Uptime Institute — Tier-Ready Prefabricated and Modular Data Centers
https://uptimeinstitute.com/tier-certification/TIER-Ready

5. Vertiv — Prefabricated Data Center overview
https://www.vertiv.com/en-us/products-catalog/facilities-enclosures-and-racks/integrated-solutions/turnkey-data-centers-/

6. Vertiv — MegaMod example
https://www.vertiv.com/en-us/products-catalog/facilities-enclosures-and-racks/integrated-solutions/vertiv-megamod/

7. Vertiv — Micro Data Centers
https://www.vertiv.com/tr-emea/solutions/micro-data-centers/

## 12. Research freeze statement

Modular veya traditional çözüm tek başına availability, efficiency veya commercial success garantisi değildir. Delivery methodology; business model, site, deployment schedule, capacity growth, operations maturity ve lifecycle strategy ile birlikte seçilmelidir.