# DC-K03 — Rack & Cabinet Engineering — Golden Deep Research

**Status:** GOLDEN DEEP RESEARCH — RESEARCH GATE  
**Language:** TR  
**Author:** Önder Yardaş  
**Research date:** 2026-09-02  
**Program:** SpecBridge Data Center Knowledge Library

---

## Evidence language used in this module

Bu çalışma DC-K01 / DC-K02 Golden standardını kullanır. Her önemli iddia aşağıdaki sınıflardan biriyle okunmalıdır:

- **FACT** — standard, standards body, current primary technical documentation veya açık manufacturer specification ile desteklenen bilgi.
- **ENGINEERING GUIDANCE** — standardın tek başına zorunlu kılmadığı, ancak güvenilir engineering practice ile desteklenen tasarım yaklaşımı.
- **VENDOR CLAIM** — belirli ürün/platform için üreticinin yayımladığı değer veya özellik; endüstri standardı değildir.
- **SPECBRIDGE INTERPRETATION** — birden çok kaynağın birlikte okunmasından çıkarılan vendor-neutral yorum.
- **DECISION GUIDANCE** — proje seçimi için önerilen karar mantığı; universal standard olarak sunulmaz.

Kaynak referansları `[Rxx]` biçimindedir ve bölüm 54'teki Authoritative Source Register'a bağlanır.

---

## Executive conclusion

**Rack artık yalnızca server'ı vidaladığımız metal enclosure değildir.** Modern rack; mekanik taşıma, rack-scale power distribution, airflow containment, liquid distribution, high-speed cabling, bonding, monitoring, physical access ve serviceability'nin aynı fiziksel envelope içinde birleştiği bir **integration platform**dur.

Bu nedenle rack engineering için yanlış soru:

> “42U mu 48U mu?”

Doğru soru:

> **WORKLOAD → EQUIPMENT FORM FACTOR → POWER ENVELOPE → COOLING INTERFACE → STRUCTURAL LOAD → CABLING → SERVICE ACCESS → FACILITY INTERFACES → RACK ARCHITECTURE**

2026 itibarıyla rack dünyası tek bir form faktöründen oluşmaz. IEC 60297'nin 482.6 mm / 19-inch ecosystem'i hâlâ enterprise, colocation, network ve storage dünyasının temel interoperability eksenidir. OCP Open Rack V3 21-inch OpenU, 48 V-class busbar ve rack-scale standardization ile farklı bir ecosystem oluşturur. OCP'nin Nisan 2026'da yayımladığı Open Rack Wide (ORW) ise AI rack'lerinin güç, sıvı debisi, kablolama ve serviceability ihtiyaçları nedeniyle rack fiziksel footprint'inin dahi değişebildiğini gösterir. [R01][R08][R09]

NVIDIA'nın güncel GB300 NVL72 referans mimarisinde tek compute rack için `up to 142 kW` güç gereksinimi, sekiz adet 33 kW power shelf ve rack/tray-level leak detection gibi özellikler yayımlanmıştır; DGX rack guide yaklaşık 120 kW rack consumption ve nominal 50–51 V DC busbar tarif eder. Bunlar **vendor/platform examples**dır, “AI rack standardı = 120/142 kW” anlamına gelmez. [R16][R17]

**Golden conclusion:** Rack standardı workload'dan önce seçilmez. Project rack standardı ancak equipment listesi, power envelope, cooling architecture, loaded weight, floor/seismic constraints, cabling topology, access model ve service workflow birlikte doğrulandıktan sonra freeze edilmelidir.

---

## 1. Scope: Rack engineering neyi kapsar?

Bu modül şu sınırları kapsar:

1. rack / cabinet / enclosure taxonomy;
2. 19-inch / RU ecosystem;
3. OCP Open Rack V3 / OpenU;
4. OCP Open Rack Wide (ORW);
5. MGX rack adaptations;
6. rack width / height / depth / rail envelope;
7. static / dynamic / shipping / seismic load;
8. floor and point-load coordination;
9. rack-level AC and DC power architecture;
10. rack PDU and intelligent metering;
11. airflow and containment interfaces;
12. RDHx and direct-to-chip readiness;
13. manifold / quick-disconnect / leak-detection interfaces;
14. cable management;
15. grounding / bonding;
16. monitoring and access control;
17. serviceability and human factors;
18. AI / HPC rack-scale systems;
19. colocation and multi-tenant standardization;
20. failure modes and acceptance checklist.

Bu modül facility-level UPS/generator detayını DC-K04'e, cooling plant/TCS tasarımını DC-K05'e bırakır; fakat rack ile bu sistemler arasındaki **physical/electrical/thermal interfaces** burada ele alınır.

---

## 2. Canonical rack taxonomy

Rack'i tek eksende “standard / AI” diye sınıflandırmak yetersizdir. SpecBridge beş eksen kullanır.

### Axis A — Mechanical equipment interface

- IEC 60297 / 482.6 mm (19-inch) ecosystem
- ETSI telecom rack/cabinet practice
- OCP Open Rack V3 / 21-inch OpenU
- OCP/MGX adapted 19-inch rack-scale architecture
- OCP Open Rack Wide (ORW)
- proprietary / appliance-specific rack-scale system

### Axis B — Enclosure form

- open frame
- open rack
- enclosed cabinet
- secure colocation cabinet
- integrated / smart cabinet
- liquid-ready cabinet
- rack-scale appliance

### Axis C — Power delivery

- conventional AC + rack PDU
- A/B AC + dual rack PDU
- high-current 3-phase rack PDU
- 48/50 V-class DC busbar + power shelves
- high-power busbar / rack-scale conversion architecture

### Axis D — Thermal interface

- air only
- air + containment
- air + RDHx
- direct-to-chip with rack manifold
- direct-to-chip with blind-mate manifold
- rack/row CDU integrated interface
- platform-specific fully liquid-cooled rack

### Axis E — Operating model

- enterprise
- colocation retail
- wholesale / hyperscale
- HPC
- AI factory
- edge / integrated enclosure
- telco

**SPECBRIDGE INTERPRETATION:** Aynı cabinet fiziksel olarak 19-inch olabilir ama power/cooling/service modeline göre engineering class'ı tamamen değişebilir.

---

## 3. Rack, cabinet, frame ve integrated enclosure farkı

### Rack / open rack

Equipment mounting için taşıyıcı frame'dir. Front/rear rails, structural posts ve accessory attachment points temel bileşenlerdir. Door veya side panel zorunlu değildir.

### Cabinet

Rack frame'e doors, side panels, locks, airflow control, cable management ve çoğu zaman 0U accessory zones eklenmiş enclosure'dır.

### Integrated / Smart Cabinet

Rack ile birlikte UPS, rack PDU, monitoring, access control ve bazen close-coupled cooling'in tek package olarak sunulduğu çözümdür. Bu terim fiziksel “rack modularity” ile karıştırılmamalıdır.

### Rack-scale appliance

Compute, interconnect, power shelves, busbar ve cooling manifold'un vendor/reference architecture tarafından tek rack-scale system olarak tanımlandığı yapıdır. Güncel NVL72 platformları bu sınıfa örnektir. [R16][R17]

---

## 4. Normative standards map

Rack selection yalnız vendor datasheet'iyle yapılmamalıdır. İlgili standard families:

| Domain | Primary reference | Engineering role |
|---|---|---|
| 19-inch mechanical dimensions | IEC 60297-3-100 | 482.6 mm series rack/cabinet interfaces |
| Mechanical performance | IEC 61587-1:2022 | cabinet/rack environmental and mechanical performance test classifications |
| Seismic rack testing | IEC 61587-2:2011 | IEC 60297/60917 rack/cabinet seismic test reference |
| Data center infrastructure | ANSI/TIA-942-C | data center telecom/power/cooling/architecture context |
| Bonding / grounding | ANSI/TIA-607-E | telecommunications bonding/earthing infrastructure |
| DC power distribution | ISO/IEC 22237-3:2021 | power distribution, bonding and metering context |
| Environmental control | ISO/IEC 22237-4:2021 | temperature/fluid/humidity/environmental control context |
| Telecom equipment practice | ETSI EN 300 119-2 | telecom rack/cabinet coordination dimensions and access |
| Appliance couplers | IEC 60320-1:2021 family | connector/coupler requirements; exact connector selection remains equipment/rating specific |
| Open rack ecosystem | OCP ORv3 / ORW specs | open rack physical/power/liquid interfaces |

**FACT:** IEC 60297-3-100 defines basic dimensions for the 482.6 mm (19 in) series; IEC 61587-1:2022 addresses performance/test classifications for mechanical structures, and IEC 61587-2 provides seismic rack/cabinet test conditions. [R01][R02][R03]

---

## 5. 19-inch ne demektir — ve ne demek değildir?

**FACT:** IEC 60297-3-100, 482.6 mm / 19-inch mechanical series için front panel, subrack, chassis, rack ve cabinet basic dimensions'ını tanımlar. [R01]

19-inch ifadesi:

- cabinet'in external width'inin 19 inch olduğu anlamına gelmez;
- rack'in external footprint'ini tek başına tanımlamaz;
- usable mounting depth'i tanımlamaz;
- load rating'i tanımlamaz;
- cooling capability'yi tanımlamaz.

19-inch esas olarak equipment mounting interface ecosystem'idir. Bu nedenle aynı 19-inch mounting interface 600 mm, 750/800 mm veya daha geniş cabinet envelope içinde uygulanabilir.

---

## 6. RU / U capacity

Traditional rack ecosystem'inde equipment height rack units ile ifade edilir. OCP'nin historical Open Rack açıklaması traditional rack unit'i yaklaşık 44.5 mm, OpenU'yu ise 48 mm olarak karşılaştırır. [R10]

**DECISION GUIDANCE:** `48U` bilgisi capacity'nin yalnız bir boyutudur. Gerçek kullanılabilir capacity çoğu projede şu kaynaklardan biri tarafından önce sınırlandırılır:

- power kW;
- cooling kW;
- rack PDU outlet/current capacity;
- cable volume;
- physical depth;
- weight;
- service access;
- liquid manifold / power shelf zones.

Bu nedenle `free U` = `free capacity` değildir.

---

## 7. Height selection

42U, 45U, 47U, 48U ve daha yüksek commercial cabinets yaygındır; ancak height seçimi yalnız daha fazla server yerleştirmek amacıyla yapılmaz.

Kontrol edilmesi gerekenler:

- clear ceiling height;
- overhead power busway;
- fiber/copper trays;
- sprinkler/fire detection clearances;
- containment roof;
- lifting tool height;
- rack-top equipment;
- top cable entry radius;
- floor leveling/caster allowance;
- seismic anchoring.

**VENDOR EXAMPLES:** Vertiv VR commercial family 42U/48U, 600/800 mm width ve ~1100/1200 mm depth variants yayımlar. Schneider NetShelter SX Gen2 family de 42U–52U aralığı ve farklı width/depth options sunar. Bunlar market examples'dır; normative preferred dimensions olarak kullanılmamalıdır. [R18][R19]

---

## 8. Width selection: mounting width ≠ cabinet width

### 600 mm class

Genel server deployment için compact footprint sağlar. Ancak high cable counts, twin 0U PDUs, large fiber trunks veya liquid plumbing için side zones sınırlı olabilir.

### 750/800 mm class

Networking, dense cabling, multiple vertical PDUs ve side cable managers için daha fazla lateral volume sağlar.

### 1200 mm ORW class

**FACT / CURRENT 2026:** OCP ORW Meta Design Specification V1.0.1, Meta implementation için nominal 2390 mm height × 1200 mm width × 1219 mm depth yayımlar. ORW Base Specification ile Meta Design Specification ayrı dokümanlardır; bu 1200 mm width değeri Meta design implementation değeridir, her ORW implementation için universal external dimension olarak okunmamalıdır. [R09]

**SPECBRIDGE INTERPRETATION:** AI rack engineering'de “rack daha geniş olamaz” varsayımı artık geçerli değildir. Power, liquid, interconnect ve serviceability gereksinimleri mechanical footprint'i değiştirebilir.

---

## 9. Depth selection

Depth şu toplam envelope ile belirlenmelidir:

`CHASSIS DEPTH + RAIL/TRAVEL + REAR CONNECTOR + CABLE BEND + PDU/MANIFOLD + DOOR/RDHx + SERVICE MARGIN`

**ENGINEERING GUIDANCE:** Liquid manifold içeren rack'lerde rear plumbing ile electrical/network cabling çakışmamalıdır. OCP rack manifold white paper, liquid cooling application için örnek olarak deep rack design (~1200 mm) önerir; bu guidance specific implementation context'idir, universal mandatory dimension değildir. [R24]

Modern vendor cabinets 1070/1100/1200 mm gibi depths sunar. Schneider ve Vertiv 48U × ~800W × 1200D commercial examples yayımlar. [R18][R19]

---

## 10. Rail position and usable depth

External cabinet depth ile rail-to-rail usable mounting depth aynı değildir.

Procurement check:

- front rail adjustability;
- rear rail adjustability;
- server rail minimum/maximum span;
- rear cable arm space;
- side/rear PDU collision;
- rear-door hinge envelope;
- hot-swap PSU extraction;
- GPU tray / switch tray extraction path.

**COMMON FAILURE:** Chassis external depth datasheet'te rack depth'ten küçük görünür, fakat rail kit + rear cabling + door closure birlikte sığmaz.

---

## 11. Open Rack V3 — ayrı ecosystem

**FACT:** OCP current SpecsAndDesigns page Open Rack V3 Base Specification 1.1 (Dec 2023), Meta Open Rack Frame V3 1.3 (Jun 2024) ve liquid/power supporting specifications listeler. [R08]

OCP ORv3 implementations tipik olarak:

- 21-inch OpenU equipment bay;
- 48 V-class DC busbar;
- rack power shelf;
- tool-less/service-oriented integration;
- optional 19-inch adapters;
- liquid manifold integration

özelliklerini kullanabilir.

**VENDOR EXAMPLE:** Sanmina OCP-accepted ORv3 example 600 mm width, 1068 mm depth, 1400 kg load rating, 44 OpenU / 47 RU support ve 48 V DC busbar option yayımlar. [R11]

Bu product değerleri OCP standardının tüm implementations için zorunlu değerleri değildir.

---

## 12. OpenU vs traditional RU

OCP'nin Open Rack background material'i OpenU'yu 48 mm ve traditional RU'yu yaklaşık 44.5 mm olarak açıklar; Open Rack IT equipment bay 21 inch'tir ve 19-inch equipment adapter ile desteklenebilir. [R10]

Sonuç:

- 19-inch RU chassis doğrudan 21-inch OpenU chassis değildir;
- adapter kullanımı physical interoperability sağlayabilir ama power/service/cooling architecture eşdeğerliği sağlamaz;
- ORv3 adoption bir rack procurement kararı değil, equipment ecosystem kararıdır.

---

## 13. MGX — 19-inch ve ORv3 arasında architecture bridge

**FACT:** OCP MGX Accelerated Computing Rack and Trays Specification, ORv3 üzerine native 19-inch component support, rear extender to 1200 mm, expanded I/O cabling volume, full-rack blind-mate manifold, interconnect cartridge mounting ve additional structural support tanımlar. [R15]

**SPECBRIDGE INTERPRETATION:** “19-inch = legacy, OCP = AI” ayrımı doğru değildir. Modern AI platformları 19-inch equipment pitch'i ile OCP-derived rack power/liquid/service concepts'i birlikte kullanabilir.

---

## 14. Open Rack Wide — 2026 AI-era rack evolution

**FACT / CURRENT:** OCP specifications page Nisan 2026 itibarıyla:

- Open Rack Wide (ORW) Base Specification 1.0;
- Open Rack Wide Meta Design Specification 1.0

listeler. [R08]

Final ORW Base Specification rack frame'in farklı busbar designs ile çalışabileceğini; air-cooled veya liquid-cooled busbars kullanılabileceğini ve 48 V busbar geometry interface'lerini tanımlar. [R25]

Meta Design Specification V1.0.1 nominal external dimensions olarak 2390 × 1200 × 1219 mm yayımlar. [R09]

AMD Helios announcement ORW'yi next-generation AI için open double-wide rack foundation olarak tanımlar; bu AMD/platform adoption claim'idir, standardın kendisi değildir. [R26]

**DECISION GUIDANCE:** ORW, conventional enterprise rack replacement olarak varsayılan seçim değildir. Next-generation high-power AI rack-scale systems için ecosystem option'dır.

---

## 15. ORW neyi çözmeye çalışıyor?

**SPECBRIDGE INTERPRETATION**, OCP/AMD materials birlikte okunduğunda ORW'nin ana problemi “daha çok U” değildir. Amaç:

- daha yüksek power delivery volume;
- daha yüksek liquid flow / thermal infrastructure;
- daha yoğun interconnect cabling;
- front/rear service access;
- wider rack-scale compute assemblies;
- standardized blind-mate interfaces

için daha fazla physical integration space oluşturmaktır. [R09][R25][R26]

Bu nedenle AI facility layout planning artık yalnız “rack pitch = 600/800 mm” varsayımıyla yapılamaz.

---

## 16. Static, dynamic, rolling ve shipping load birbirinden farklıdır

### Static load

Rack final position'da iken destekleyebildiği equipment mass/load.

### Dynamic / rolling load

Rack caster üzerinde hareket ederken veya relocation sırasında kabul edilen load.

### Shipping load

Rack equipment-installed olarak packaged/shipped edilecekse packaging + transport qualification ile ilgili ayrı limit.

### Anchored load condition

Bazı vendor ratings rack'in building structure'a bağlı olup olmamasına göre değişebilir.

**FACT:** IEC 61587-1:2022 cabinets/racks için use, storage, transport ve final-location load conditions'ı simüle eden performance classifications/test setups tanımlar. [R02]

**VENDOR EXAMPLES:** Schneider NetShelter SX Gen2 shock-package model 2500 lb shipping / 4000 lb static claim yayımlar; Vertiv VR example 1360 kg static ve 1022 kg dynamic; Rittal VX IT family 1500–1800 kg class vendor test values yayımlar. [R18][R19][R20]

Bu rakamlar cabinet families arasında doğrudan apples-to-apples comparison değildir; test condition ve certification basis ayrıca okunmalıdır.

---

## 17. Floor loading yalnız kg/rack değildir

Structural coordination için şu değerler gerekir:

- rack tare weight;
- installed IT weight;
- rack PDU/power shelf weight;
- liquid manifold + fluid inventory;
- RDHx/CDU if rack-mounted;
- cable mass;
- shipping/rolling condition if relevant;
- footprint area;
- caster/leveling-foot contact points;
- anchoring pattern;
- floor system / slab / raised-floor rating.

**ENGINEERING GUIDANCE:** Average kg/m² yeterli olmayabilir. Point load, rolling load ve local reinforcement yapısal mühendis tarafından doğrulanmalıdır.

---

## 18. Seismic engineering

**FACT:** IEC 61587-2:2011 IEC 60917/60297 series cabinets ve racks için specified seismic intensities altında mechanical structure performance'ını değerlendiren test conditions ve response spectra yaklaşımı tanımlar. [R03]

Seismic requirement varsa procurement sadece “seismic kit var mı?” diye yapılmamalıdır. Gerekli:

- rack test/qualification basis;
- installed load distribution assumptions;
- anchoring details;
- slab/interface design;
- overhead cable/liquid flexibility;
- door/panel retention;
- equipment rail retention;
- post-event inspection method.

---

## 19. Conventional AC rack power chain

Typical architecture:

`FACILITY UPS/PDU/BUSWAY → A FEED + B FEED → RACK PDU A + RACK PDU B → SERVER PSU A/B`

**FACT:** ISO/IEC 22237-3 addresses power distribution to data center equipment, telecommunications bonding and power measurement points as part of data center availability/efficiency architecture. [R06]

**DECISION GUIDANCE:** Rack PDU quantity tek başına resilience rating değildir.

---

## 20. A/B feed: görünüşte dual, gerçekte single olabilir

A/B rack PDU ancak upstream failure domains de ayrışıyorsa anlamlı resilience yaratır.

Kontrol:

- UPS source;
- switchboard;
- distribution panel;
- busway tap-off;
- breaker;
- cable route;
- rPDU;
- server PSU;
- single-corded device ATS/STS strategy.

**COMMON FAILURE:** İki rack PDU aynı upstream panel/UPS path'inden beslenir ve “dual feed” diye etiketlenir.

---

## 21. Rack PDU topology

Rack PDU selection dimensions:

- 0U vertical vs horizontal;
- single-phase vs three-phase;
- input current/voltage;
- breaker configuration;
- outlet types/count;
- branch balancing;
- inlet / branch / outlet metering;
- switching;
- environmental sensor ports;
- network management;
- maximum ambient temperature;
- locking power cords.

**VENDOR EXAMPLES:** Eaton Metered Outlet rPDU outlet-level metering ve ±1% vendor accuracy claim sunar; Vertiv Geist switched rPDU real/apparent power, PF, current, kWh, remote outlet control ve optional sensor monitoring sunar. [R21][R22]

---

## 22. Connector engineering

IEC 60320 family appliance couplers modern IT equipment ve rack PDU ecosystem'inde sık kullanılır. IEC 60320-1:2021 general appliance-coupler requirements'ı tanımlar. [R07]

Connector selection şu bilgilerle yapılmalıdır:

- equipment inlet type;
- voltage/current rating;
- temperature rating;
- retention/locking requirement;
- conductor gauge;
- rack thermal environment;
- local electrical code;
- vendor power-cord matrix.

**COMMON FAILURE:** C13/C19 benzeri connector formunu yalnız fiziksel görünüşten seçmek ve current/temperature derating'i kontrol etmemek.

---

## 23. Rack power metering — capacity management için temel telemetry

Metering hierarchy:

1. rack inlet;
2. branch;
3. outlet;
4. device PSU telemetry;
5. facility upstream meter.

Colocation use cases:

- customer allocation;
- billing support;
- capacity threshold alarms;
- A/B balance;
- stranded power identification.

AI/HPC use cases:

- burst profile;
- phase balance;
- power-cap coordination;
- cooling/load correlation.

**ENGINEERING GUIDANCE:** Meter exists = usable telemetry değildir. Accuracy class, sampling, timestamp, SNMP/API availability ve DCIM integration ayrıca acceptance test'e girmelidir.

---

## 24. OCP rack-level DC busbar architecture

ORv3 ecosystem'inde rack-level 48 V DC busbar ve power shelves traditional AC rPDU architecture'dan farklıdır. [R08][R11]

OCP marketplace examples:

- 48 V DC vertical busbar;
- power shelves;
- direct rack mating;
- 21-inch equipment bay;
- high-current connectors.

**VENDOR/IMPLEMENTATION EXAMPLE:** OCP-listed Interplex ORv3 busbar example 1400 A current-carrying rating yayımlar; TE Connectivity ORv3 connector example 1000 A-class output connection describes. Bunlar component examples'dır, all ORv3 deployments için required current değildir. [R27][R28]

---

## 25. AI power architecture is becoming rack-scale

NVIDIA DGX GB rack guide power shelves'in AC'yi nominal 50–51 V DC'ye dönüştürerek busbar üzerinden rack components'e dağıttığını ve rack consumption'ı yaklaşık 120 kW olarak verdiğini açıklar. [R17]

NVIDIA 2026 Enterprise Reference Architecture GB300 NVL72 compute rack için:

- 8 × 33 kW power shelves;
- six 5.5 kW PSUs per shelf;
- full rack up to 142 kW;
- rack/tray-level liquid leak detection

yayımlar. [R16]

**VENDOR CLAIM — NOT STANDARD:** Bu değerler specific NVIDIA architecture içindir.

**SPECBRIDGE INTERPRETATION:** High-density AI'da rack artık downstream passive enclosure değil; power conversion/distribution architecture'nın aktif bir parçasıdır.

---

## 26. Airflow is a rack property and a room property

Air cooling başarısı aynı anda şu katmanlara bağlıdır:

- ITE fan curve / airflow direction;
- rack front/rear pressure drop;
- doors;
- blanking;
- cable obstruction;
- aisle containment;
- room supply/return path;
- environmental setpoints.

**FACT:** ASHRAE AI energy framework precise airflow management, containment ve density-matched cooling strategy önerir. [R13]

---

## 27. Front-to-back airflow default varsayımı kontrol edilmelidir

Birçok server front-to-back airflow kullanır; fakat network switches gibi devices farklı airflow variants sunabilir.

Procurement rule:

- device airflow direction BoM seviyesinde işaretlenmeli;
- reverse airflow switches mixed cabinet'e rastgele konulmamalı;
- blanking and brush/grommet plan airflow modelinin parçası olmalı.

---

## 28. Door perforation

Door “mesh” olması yeterli kriter değildir.

İzlenecek özellikler:

- net open area / perforation;
- pressure drop;
- filter use if any;
- hinge opening angle;
- split vs single door;
- door security;
- RDHx replacement feasibility.

**VENDOR EXAMPLES:** Schneider NetShelter SX Gen2 product description 80% door perforation claim; Vertiv VR examples 77% perforated doors; Chatsworth ZetaFrame rear-door example 78% perforation yayımlar. Bunlar product-specific implementations'dır. [R18][R19][R23]

---

## 29. Blanking panels and bypass recirculation

Empty rack spaces sealed değilse hot exhaust air front/cold side'a recirculate olabilir.

**ENGINEERING GUIDANCE:** Blanking panels yalnız aesthetic accessory değil, airflow-control elementidir. Cable pass-through openings, unused floor openings ve side bypass paths de aynı mantıkla yönetilmelidir.

---

## 30. Cable congestion is thermal resistance

Rear cabling şu riskleri yaratabilir:

- fan exhaust obstruction;
- PSU hot-swap obstruction;
- PDU access obstruction;
- QD/manifold service conflict;
- door closure problem;
- fiber bend-radius violations;
- accidental disconnect during maintenance.

**DECISION GUIDANCE:** Cable management rack width/depth selectioninin input'udur, rack satın alındıktan sonra accessory olarak düşünülmemelidir.

---

## 31. Rack-level cable zoning

Minimum logical zones:

1. Power A
2. Power B
3. Copper management / OOB
4. High-speed fiber
5. DAC/AOC / scale-up interconnect
6. Liquid supply
7. Liquid return
8. Leak-detection harness

High-density AI rack'te electrical, optical ve liquid service zones çakışmamalıdır.

---

## 32. Top-of-Rack vs End-of-Row affects cabinet engineering

### Top-of-Rack

- more switches per rack/row;
- local DAC/AOC density;
- high top/rear cable volume;
- network device airflow coordination.

### End-of-Row / centralized

- longer horizontal links;
- larger fiber/copper trunks;
- fewer network switches inside compute rack;
- different pathway congestion.

Rack cable design network topology'den bağımsız değildir.

---

## 33. Grounding and bonding

**FACT:** ANSI/TIA-607-E (2024) generic telecommunications bonding and grounding infrastructure ve electrical/telecommunications systems interconnection requirements'ını kapsar. [R05]

Rack için kontrol:

- rack frame bonding;
- doors/panels;
- cable trays;
- rack PDU earth;
- equipment protective earth;
- bonding conductor path;
- paint/coating contact interfaces;
- project telecom bonding backbone.

**COMMON FAILURE:** “Rack metal olduğu için grounded” varsayımı.

---

## 34. Environmental monitoring

Potential rack sensors:

- front inlet temperature;
- rear exhaust temperature;
- humidity where relevant;
- door status;
- leak detection;
- differential pressure where designed;
- rack power A/B;
- branch/outlet current;
- CDU/manifold pressure/flow via thermal system telemetry.

**ENGINEERING GUIDANCE:** Sensor count değil, actionable threshold + telemetry ownership + alarm response procedure önemlidir.

---

## 35. Physical access and colocation security

Multi-tenant colocation rack'leri için:

- front/rear lock policy;
- keying strategy;
- electronic lock integration;
- shared row/containment access;
- side-panel security;
- customer cross-connect path;
- rack camera visibility;
- remote-hands access procedure

tasarım input'udur.

Cabinet security, facility physical security'nin yerine geçmez; onun inner layer'ıdır.

---

## 36. Serviceability is a first-class engineering requirement

Checklist:

- chassis fully extract edilebilir mi?
- rail slides aisle içinde güvenli açılıyor mu?
- heavy tray için lift kullanılabilir mi?
- front/rear door removal mümkün mü?
- power shelf hot-swap path açık mı?
- PDU breakers/outlets erişilebilir mi?
- fiber patching görünür mü?
- QD/manifold erişimi var mı?
- leak event'te isolation yapılabilir mi?
- adjacent rack service operation'ı engelliyor mu?

**SPECBRIDGE INTERPRETATION:** A rack is acceptable only when equipment can be **installed, operated, isolated and replaced** safely — not merely when it physically fits.

---

## 37. Human factors and heavy equipment

AI/HPC trays ağırlaşır. Service plan şu unsurları içermelidir:

- server lift / material handling tool;
- lift access aisle width;
- raised floor transitions;
- pallet/ramp unloading;
- maximum single-person lift policy;
- upper-U heavy equipment risk;
- center-of-gravity during rollout.

**DECISION GUIDANCE:** Heavy equipment'i “üst U boş, oraya koyalım” mantığıyla konumlandırmak structural/service risk yaratabilir.

---

## 38. There is no universal rack-density classification standard

`5 kW`, `20 kW`, `50 kW`, `100 kW` boundaries farklı reports/vendors tarafından farklı amaçlarla kullanılır.

**FACT / INDUSTRY CONTEXT:** TIA-942-C supporting white paper rising rack densities ve liquid-cooling migration'ı tartışır; ASHRAE 2026 AI framework 50–100+ kW racks için purpose-built liquid/liquid-assisted architectures'a işaret eder. Bunlar universal mandatory changeover thresholds değildir. [R04][R13]

SpecBridge practical decision bands kullanılabilir, ancak **standard olarak etiketlenmemelidir**:

- conventional low/medium air-cooled;
- dense air / close-coupled transition;
- liquid-assisted high density;
- rack-scale liquid-cooled AI/HPC;
- emerging ultra-high-power wide-rack architectures.

---

## 39. Cooling selection should be equipment-led, not kW-band-led

Karar girdileri:

- ITE thermal design;
- air fraction vs liquid fraction;
- required coolant flow;
- supply temperature;
- pressure drop;
- residual air heat;
- redundancy;
- site water/TCS;
- service model;
- leak-risk strategy.

**DECISION GUIDANCE:** `kW/rack > X → liquid` tek başına yeterli rule değildir.

---

## 40. Rear Door Heat Exchanger (RDHx)

**FACT:** ASHRAE Handbook rack/cabinet level liquid cooling'i rear-door or in-rack heat exchangers ile tanımlar; rear-door units passive veya fan-assisted olabilir ve cabinet depth/service geometry'yi etkiler. [R14]

RDHx engineering impacts:

- rear hinge/load;
- rack anchoring;
- added depth;
- hose routing;
- door swing;
- service access;
- condensation strategy;
- facility/TCS loop interface.

### Best fit

- air-cooled IT retained;
- room cooling offload desired;
- retrofit pathway needed.

### Not equivalent to

Direct-to-chip cooling.

---

## 41. Direct-to-chip rack readiness

A genuinely D2C-ready rack needs more than “manifold için boşluk”.

Required interface set:

- supply/return manifold location;
- hose routing;
- QD accessibility;
- drip/leak containment;
- leak sensors;
- fluid isolation;
- pressure/flow envelope;
- rack/row CDU relationship;
- residual-air cooling;
- commissioning and flushing plan;
- service procedure.

ASHRAE liquid-cooling framework TCS'yi CDU, manifolds, pumps, valves, instrumentation, heat rejection ve controls dahil complete system olarak ele alır. [R13]

---

## 42. Blind-mate liquid interfaces

**FACT:** OCP Open Rack V3 Blind Mate Manifold Specification physical quick-connector interfaces tanımlar. OCP 2026 Cooling Environments workstreams daha yüksek flow/lower impedance için PBMC — Pivoting Blind Mate Coupling — development'ını sürdürür/yayımlar. [R12][R29]

**SPECBRIDGE INTERPRETATION:** AI rack serviceability manuel hose connection'dan standardized blind-mate fluid interfaces'a evrilmektedir.

Ancak multi-vendor interoperability yalnız “QD çapı aynı” ile varsayılmamalıdır; fluid chemistry, seals, flow/pressure, cleanliness ve commissioning birlikte doğrulanmalıdır.

---

## 43. CDU relationship

Possible architectures:

1. rack CDU;
2. row CDU;
3. pod CDU;
4. facility-side heat exchanger / central TCS architecture;
5. vendor rack-scale integrated distribution.

Rack decision şu soruyu cevaplamalıdır:

> Rack nerede biter, TCS nerede başlar?

CDU capacity, redundancy ve service access DC-K05'in konusu olsa da rack interfaces K03'te freeze edilmelidir.

---

## 44. Facility water vs technology cooling loop

**ENGINEERING GUIDANCE:** Facility water'i doğrudan server cold plates'e bağlamak varsayılan kabul edilmemelidir. ASHRAE materials CDU/heat exchanger separation ve technology cooling system controls'ını önemli design interface olarak ele alır. [R13][R30]

Rack design documents şu boundary'yi açıkça göstermelidir:

`FACILITY LOOP → HEAT EXCHANGE/CDU → TECHNOLOGY COOLING LOOP → RACK MANIFOLD → IT GEAR`

Project-specific direct facility-water implementation varsa water quality, corrosion, pressure, ownership ve warranty ayrıca doğrulanmalıdır.

---

## 45. Condensation, dew point and leak strategy

Liquid cooling rack acceptance:

- coolant supply temperature;
- room dew point;
- insulation needs;
- leak detection coverage;
- drip management;
- automatic isolation policy;
- alarm integration;
- safe shutdown sequence.

ASHRAE legacy/current liquid guidance generally treats condensation avoidance as explicit design concern. [R14][R30]

---

## 46. AI rack example — NVIDIA GB300 NVL72

**VENDOR PLATFORM EXAMPLE:** NVIDIA current Enterprise Reference Architecture publishes:

- 72 Blackwell Ultra GPUs;
- 36 Grace CPUs;
- 9 NVSwitch trays;
- 8 × 33 kW power shelves;
- up to 142 kW full-rack requirement;
- liquid cooling;
- tray- and rack-level leak detection. [R16]

DGX GB rack guide describes approximately 120 kW power consumption and nominal 50–51 V DC busbar power architecture for DGX GB rack-scale systems. [R17]

Bu farklı values deployment/platform documentation context'ine göre okunmalıdır.

**DECISION GUIDANCE:** AI rack procurement, conventional “empty cabinet + servers” BoQ yaklaşımından çıkıp rack-scale system integration acceptance'a dönüşebilir.

---

## 47. Residual air heat remains relevant

Direct-to-chip deployment'larda tüm rack heat'in sıvıya geçeceği otomatik varsayılmamalıdır. PSU, DIMM, storage, networking ve other components residual air load bırakabilir.

**ENGINEERING GUIDANCE:** Liquid fraction vendor thermal documentation ile doğrulanmalı ve remaining air-cooling capacity hesaplanmalıdır. ASHRAE retrofit guidance hybrid cooling approach'ı özellikle vurgular. [R31]

---

## 48. Cabinet decision matrix

| Requirement | 600 mm 19-inch | 750/800 mm 19-inch | Smart / integrated cabinet | OCP ORv3 | MGX / AI adapted rack | ORW / wide rack |
|---|---:|---:|---:|---:|---:|---:|
| General enterprise servers | Strong | Strong | Selected small-site use | Ecosystem-dependent | Usually unnecessary | No |
| Dense networking/cabling | Limited/Medium | Strong | Limited | Strong by design | Strong | Strong |
| Retail colocation standardization | Strong | Very strong | Niche | Customer-specific | AI-specific | Future/specialized |
| Edge / branch | Medium | Medium | Very strong | Usually weak fit | Weak fit | No |
| Conventional air cooling | Strong | Strong | Strong | Supported | Platform-specific | Not primary driver |
| RDHx retrofit | Product-dependent | Good candidate | Limited | Product-dependent | Possible | Architecture-specific |
| D2C manifold | Possible with design | Good candidate | Product-specific | Native ecosystem options | Strong | Core future use |
| 100 kW-class rack-scale AI | Usually poor fit | Specialized only | Poor fit | HPR/platform-specific | Strong | Designed for future high-power class |
| Multi-vendor enterprise ecosystem | Very strong | Very strong | Medium | OCP ecosystem | Platform ecosystem | Emerging OCP ecosystem |

This table is **DECISION GUIDANCE**, not a standards compliance matrix.

---

## 49. Power / cooling / structure coupling matrix

| Condition | Primary constraint | Rack implication |
|---|---|---|
| Low power + shallow servers | Space / cost | compact 19-inch may be sufficient |
| Dense network cabinet | cable volume / airflow | wider cabinet and vertical managers |
| 20–40 kW air-cooled | airflow / room cooling | high-open-area doors, containment, pressure/cable control |
| Liquid-assisted retrofit | plumbing / door/service | deep cabinet + RDHx or manifold integration |
| 50–100+ kW AI | liquid + power + weight | purpose-built high-density rack/power/cooling interfaces |
| 120–142 kW NVL72-class example | rack-scale platform | power shelves, DC busbar, liquid manifold, leak detection, structural validation |
| future ultra-high-power ORW | service/power/liquid footprint | wide-rack ecosystem and facility-layout redesign |

Ranges are **engineering context**, not universal thresholds.

---

## 50. Retrofit matrix

### Existing 600 mm cabinet

Check first:

- chassis depth;
- PDU/cable side volume;
- door airflow;
- loaded weight;
- RDHx compatibility;
- manifold clearance.

### Existing 800 mm × 1200 mm cabinet

Often more adaptable, but do not assume liquid readiness. Check structural, door, hose, leak and service interfaces.

### ORv3/MGX conversion

Adapter compatibility does not guarantee power/liquid compatibility.

### ORW

Treat as new facility-layout envelope unless the existing hall was explicitly designed for wide-rack pitch, weight, power and fluid distribution.

---

## 51. Colocation rack standardization

Colocation operator rack standard should contractually define:

- allowed rack widths/depths/heights;
- maximum loaded weight;
- floor anchoring;
- standard A/B feeds;
- max branch/rack kW;
- rPDU responsibility;
- cross-connect entry;
- rack lock/access;
- containment interface;
- liquid cooling demarcation;
- customer-owned rack acceptance;
- RDHx/manifold approval;
- fire/life-safety compatibility.

**SPECBRIDGE INTERPRETATION:** AI colocation introduces a second rack standard alongside conventional retail colo: a high-density rack-scale acceptance standard.

---

## 52. Failure-mode analysis

| ID | Failure mode | Consequence | Prevention / control |
|---|---|---|---|
| F1 | Chassis depth not checked | rear door cannot close / cable damage | max equipment envelope validation |
| F2 | Free U treated as free capacity | power/cooling overload | multi-dimensional capacity model |
| F3 | A/B PDUs share upstream source | hidden SPOF | end-to-end failure-domain trace |
| F4 | Static load confused with shipping/dynamic | transport/floor failure | rating basis verification |
| F5 | AI loaded weight excluded from structure | floor/anchoring risk | structural engineer sign-off |
| F6 | Door perforation/pressure ignored | inlet temperature / fan penalty | airflow acceptance test |
| F7 | Rear cables block exhaust/service | overheating / MTTR increase | cable-zone and service mock-up |
| F8 | Liquid-ready = only manifold space | incomplete TCS | interface register + CDU/leak plan |
| F9 | QD installed without fluid compatibility | leaks/material damage | fluid/seal/pressure qualification |
| F10 | RDHx hinge/load not checked | door/rack mechanical failure | RDHx-specific structural review |
| F11 | Grounding assumed through metal contact | unsafe/noisy bonding | bonding test and documented path |
| F12 | Rack PDU telemetry not integrated | blind capacity / billing errors | API/SNMP/DCIM acceptance |
| F13 | Heavy tray service path missing | safety/MTTR issue | lifting and aisle service study |
| F14 | ORv3 adapter treated as full compatibility | power/cooling mismatch | mechanical + electrical + thermal validation |
| F15 | Wide AI rack inserted into standard pitch | aisle/layout conflict | rack-footprint planning |
| F16 | Liquid-cooled rack assumed zero room heat | insufficient air cooling | residual heat fraction validation |
| F17 | Door/access security omitted in colo | tenant/security exposure | rack access policy |
| F18 | Future power growth ignored | stranded rack footprint | lifecycle power/cooling envelope |

---

## 53. Architecture diagrams

### Diagram A — Conventional enterprise rack

```text
Facility A power ──> rPDU-A ──> PSU-A ┐
                                      ├─> IT equipment
Facility B power ──> rPDU-B ──> PSU-B ┘

Cold aisle ──> [19-inch IT rack] ──> Hot aisle
                 │
                 ├─ copper / fiber
                 ├─ bonding
                 └─ sensors / DCIM
```

### Diagram B — Liquid-ready AI rack

```text
A/B AC ──> Power shelves ──> DC busbar ──> Compute / switch trays

Facility/TCS ──> CDU ──> Supply manifold ──> Cold plates
                    <── Return manifold <──┘

                    ├─ leak detection
                    ├─ residual-air path
                    ├─ high-speed fabrics
                    └─ service / blind-mate interfaces
```

### Diagram C — Rack form-factor evolution

```text
IEC 60297 19-inch
        │
        ├─ enterprise cabinet / colo / network
        │
        ├─ OCP ORv3: 21-inch OpenU + DC busbar ecosystem
        │       └─ MGX: 19-inch pitch + ORv3-derived AI interfaces
        │
        └─ OCP ORW 2026: wide rack for next-gen power/liquid/service envelope
```

These are SpecBridge conceptual diagrams, not standards drawings.

---

## 54. Authoritative Source Register

### Normative / standards bodies

**R01 — IEC 60297-3-100:2008** — 482.6 mm (19 in) series basic mechanical dimensions.  
https://webstore.iec.ch/en/publication/1283

**R02 — IEC 61587-1:2022** — environmental requirements, test setups and safety/performance classifications for cabinets/racks.  
https://webstore.iec.ch/en/publication/65981

**R03 — IEC 61587-2:2011** — seismic tests for IEC 60917 / 60297 cabinets and racks.  
https://webstore.iec.ch/en/publication/5635

**R04 — ANSI/TIA-942-C** — data center infrastructure standard, May 2024.  
https://tiaonline.org/standard/tia-942/

**R05 — ANSI/TIA-607-E** — Generic Telecommunications Bonding and Grounding (Earthing), released May 2024.  
https://tiaonline.org/standardannouncement/tia-publishes-new-standard-ansi-tia-607-e-generic-telecommunications-bonding-and-grounding-earthing-for-customer-premises/

**R06 — ISO/IEC 22237-3:2021** — data centre power distribution, bonding and metering context.  
https://www.iso.org/standard/78551.html

**R07 — IEC 60320-1:2021** — appliance couplers, general requirements.  
https://webstore.iec.ch/en/publication/64901

### Open rack / open infrastructure specifications

**R08 — OCP Open Rack Specs and Designs** — current ORv3 and ORW specification index; ORW 1.0 listed Apr 2026.  
https://www.opencompute.org/wiki/Open_Rack/SpecsAndDesigns

**R09 — OCP Open Rack Wide Meta Design Specification V1.0.1** — Meta ORW implementation dimensions and physical specification.  
https://www.opencompute.org/documents/open-rack-wide-orw-meta-design-specification-v1-0-1-final-pdf

**R10 — OCP Introducing Open Rack** — OpenU 48 mm / 21-inch ecosystem background.  
https://www.opencompute.org/blog/introducing-the-open-rack

**R11 — OCP Sanmina Open Rack V3 example** — OCP-accepted implementation; 21-inch/19-inch option, 48 V busbar, product load/dimensions.  
https://www.opencompute.org/products/414/sanmina-open-rack-v3-orv3

**R12 — OCP Open Rack V3 Blind Mate Manifold Specification** — rack liquid connector/manifold interface.  
https://www.opencompute.org/documents/open-rack-v3-blind-mate-manifold-specification-rev-1-0-review-april05-2024-pdf

**R13 — ASHRAE AI Data Center Energy Performance Framework — Energy and Thermal Efficiency** — density-based cooling, TCS, liquid cooling system context.  
https://www.ashrae.org/technical-resources/ai-data-center-framework/energy-and-thermal-efficiency

**R14 — ASHRAE Handbook — Data Centers and Telecommunications Facilities** — rack-level liquid cooling / RDHx definitions and integration.  
https://handbook.ashrae.org/Handbooks/A23/SI/A23_Ch20/a23_ch20_si.aspx

**R15 — OCP MGX Accelerated Computing Rack and Trays Specification** — ORv3-derived 19-inch AI rack adaptations, rear extender, manifold/interconnect structure.  
https://www.opencompute.org/documents/mgx-accelerated-computing-rack-and-trays-specification-1-1-pdf-1

### Current AI rack-scale primary documentation

**R16 — NVIDIA NVL72 AI Factory — System Hardware & Components** — GB300 NVL72 rack architecture, power shelves, up-to-142-kW rack and leak detection.  
https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html

**R17 — NVIDIA DGX GB Rack Scale Systems User Guide — Hardware** — rack-scale system, ~120 kW consumption, nominal 50–51 V DC busbar architecture.  
https://docs.nvidia.com/dgx/dgxgb200-user-guide/hardware.html

### Vendor implementation examples — not normative standards

**R18 — Schneider Electric APC NetShelter SX Gen2** — commercial 19-inch cabinet size/load/airflow examples.  
https://www.se.com/us/en/product/AR3387SPB2/apc-netshelter-sx-server-rack-enclosure-gen-2-shock-packaging-2500-lbs-black-48u-x-800w-x-1200d/

**R19 — Vertiv VR Rack** — commercial 19-inch cabinet dimensions/static/dynamic load examples.  
https://www.vertiv.com/en-us/products-catalog/facilities-enclosures-and-racks/racks-and-containment/VR3357/

**R20 — Rittal VX IT** — vendor rack load example and IT enclosure family.  
https://www.rittal.com/in-en/Unternehmen/Presse/Pressemeldungen/Pressemeldung_20200506

**R21 — Eaton Metered Outlet Rack PDU** — outlet metering/use-case example.  
https://www.eaton.com/us/en-us/catalog/backup-power-ups-surge-it-power-distribution/eaton-metered-outlet-rack-pdu.html

**R22 — Vertiv Geist Switched rPDU** — metering, switching and environment-sensor implementation example.  
https://www.vertiv.com/en-us/products-catalog/critical-power/power-distribution/14240342/

**R23 — Chatsworth ZetaFrame perforated rear door** — product-specific 78% perforation example.  
https://www.chatsworth.com/en-us/products/cabinets-and-enclosures/accessories/replacement-parts/double-perforated-metal-rear-door-for-zetaframe-cabinet/39861-e06

### Supporting engineering references

**R24 — OCP Rack Manifold Requirements and Qualification white paper** — rear plumbing/manifold integration and deep-rack engineering guidance.  
https://www.opencompute.org/documents/ocp-white-paper-rack-manifold-requirements-and-qualification-v3-pdf

**R25 — OCP Open Rack Wide Base Specification V1.0** — ORW frame interfaces and air/liquid-cooled busbar options.  
https://www.opencompute.org/documents/open-rack-wide-orw-base-specification-v1-0-0-final-pdf

**R26 — AMD Helios / Open Rack Wide announcement** — vendor adoption example of ORW for next-generation AI infrastructure.  
https://newsroom.amd.com/news/amd-showcases-helios-rack-scale-platform-built-o/

**R27 — OCP Interplex ORv3 Busbar example** — 1400 A component implementation example.  
https://www.opencompute.org/products/800/interplex-ovr3-busbar-140044-01

**R28 — OCP TE Connectivity ORv3 BB1000 connector example** — high-current ORv3 connector implementation.  
https://www.opencompute.org/products/655/te-connectivity-orv3-bb1000-connector

**R29 — OCP PBMC Design Specification** — higher-flow multi-sourced blind-mate liquid coupling direction.  
https://www.opencompute.org/documents/pbmc-design-specification1-0-final-pdf

**R30 — ASHRAE Water-Cooled Servers — Common Designs, Components, and Processes** — CDU vs non-CDU liquid implementations and water-cooling interfaces.  
https://www.ashrae.org/File%20Library/Technical%20Resources/Bookstore/WhitePaper_TC099-WaterCooledServers.pdf

**R31 — ASHRAE AI Framework — Retrofit & Modernization Strategies** — hybrid cooling and residual heat context.  
https://www.ashrae.org/technical-resources/ai-data-center-framework/retrofit-modernization-strategies

**R32 — ETSI EN 300 119-2** — telecom rack/cabinet coordination dimensions and access guidance.  
https://www.etsi.org/deliver/etsi_en/300100_300199/30011902/02.02.02_40/en_30011902v020202o.pdf

### Source-boundary notes

- IEC / ISO / TIA / ETSI sources establish standards context; full normative requirements require licensed/current standard text where applicable.
- OCP specifications establish open ecosystem interfaces, not generic enterprise rack requirements.
- NVIDIA values are current platform-specific architecture data, not rack-density standards.
- Schneider / Vertiv / Rittal / Eaton / Chatsworth values are product examples used to demonstrate market implementation ranges.
- ASHRAE density/cooling material is engineering guidance; it should not be converted into a single hard kW threshold without equipment and site validation.

---

## 55. Golden decision tree

```text
START
  |
  +-- What equipment ecosystem?
  |      +-- Conventional 19-inch --> enterprise/colo rack path
  |      +-- ORv3 / OCP -----------> ORv3 compatibility path
  |      +-- MGX / rack-scale AI --> platform rack path
  |      +-- ORW -------------------> wide-rack facility path
  |
  +-- Maximum installed depth + service extraction validated?
  |      +-- NO --> increase depth / redesign rack
  |
  +-- Loaded static + dynamic/shipping + floor/seismic validated?
  |      +-- NO --> structural gate
  |
  +-- Power architecture?
  |      +-- A/B AC rPDU
  |      +-- 3-phase high-density rPDU
  |      +-- power shelf + DC busbar
  |
  +-- Cooling architecture?
  |      +-- Air only --> airflow / door / containment gate
  |      +-- RDHx -----> door/load/plumbing gate
  |      +-- D2C ------> CDU/manifold/QD/leak/residual-air gate
  |
  +-- Cabling + service + access zones validated?
  |      +-- NO --> rack width/depth/layout redesign
  |
  +-- Facility interfaces and lifecycle growth validated?
         +-- YES --> FREEZE PROJECT RACK STANDARD
```

---

## 56. Golden rack engineering checklist

### Mechanical

- [ ] equipment form factor standard identified
- [ ] RU/OpenU requirement and growth
- [ ] external W/H/D
- [ ] usable mounting depth
- [ ] rail adjustment range
- [ ] door swing
- [ ] static load basis
- [ ] dynamic / shipping load basis
- [ ] rack tare + equipment + fluid + cable weight
- [ ] floor / point / rolling load
- [ ] seismic requirement
- [ ] anchoring

### Power

- [ ] A/B source failure domains traced
- [ ] rPDU/busbar architecture
- [ ] voltage/current/phase
- [ ] connector matrix
- [ ] breaker/selectivity interface
- [ ] inlet/branch/outlet metering requirements
- [ ] remote switching policy
- [ ] rack telemetry/DCIM

### Air cooling

- [ ] all ITE airflow directions
- [ ] blanking plan
- [ ] front/rear door open area
- [ ] cable obstruction analysis
- [ ] aisle containment interface
- [ ] residual heat load

### Liquid cooling

- [ ] RDHx or D2C architecture
- [ ] CDU ownership/location
- [ ] facility vs TCS boundary
- [ ] manifold location
- [ ] supply/return hose path
- [ ] QD/blind-mate type
- [ ] pressure/flow envelope
- [ ] fluid compatibility
- [ ] dew-point strategy
- [ ] leak sensors
- [ ] isolation/drain/service procedure
- [ ] residual air cooling

### Cabling

- [ ] Power A/B physically identifiable
- [ ] copper/OOB zones
- [ ] fiber zones
- [ ] DAC/AOC/interconnect cartridge path
- [ ] bend radius
- [ ] top/bottom entry
- [ ] service slack

### Operations

- [ ] locking/access policy
- [ ] lift/tooling path
- [ ] full tray extraction
- [ ] rPDU service access
- [ ] QD/manifold service access
- [ ] labeling
- [ ] commissioning checklist
- [ ] acceptance measurements
- [ ] spare accessory strategy

---

## 57. SpecBridge engineering rules — frozen research conclusions

1. **Rack U is not capacity.** Power, cooling, weight, cabling or serviceability can become the binding constraint first.
2. **19-inch is a mounting ecosystem, not a cabinet external dimension.**
3. **Rack depth must be calculated from equipment + rear interfaces + service envelope, not selected from a catalog default.**
4. **Static, dynamic, shipping and seismic load are separate engineering questions.**
5. **A/B rack PDUs do not prove A/B resilience; upstream failure domains must be traced.**
6. **Door perforation, blanking and cable routing are thermal design elements.**
7. **Liquid-ready means complete interface readiness — manifold, CDU/TCS, QDs, leak detection, service and residual air — not just mounting space.**
8. **RDHx and direct-to-chip solve different thermal problems.**
9. **ORv3 is not simply a wider 19-inch rack; it is a power/mechanical/service ecosystem.**
10. **MGX proves that 19-inch pitch can coexist with ORv3-derived AI rack architecture.**
11. **ORW 2026 proves that next-generation AI may change the rack footprint itself.**
12. **Current 120–142 kW NVL72 examples are platform examples, not universal AI rack thresholds.**
13. **Rack standard must be frozen with facility power/cooling/structural interfaces, not by IT procurement alone.**
14. **Colocation requires a conventional rack standard plus a separate high-density/AI acceptance standard.**
15. **Serviceability is a design requirement equal to fit, power and cooling.**

---

## 58. Research gate conclusion

`DC-K03 — Rack & Cabinet Engineering` artık basit cabinet-selection baseline'ından çıkıp standards-aware, vendor-neutral bir **physical integration decision module** seviyesine yükseltilmiştir.

Golden research'in ana architecture conclusion'ı:

> **RACK = MECHANICAL STRUCTURE + POWER INTERFACE + THERMAL INTERFACE + CABLING INTERFACE + SERVICE INTERFACE + OPERATING BOUNDARY**

2026 rack roadmap üç ayrı dünyayı birlikte yönetmelidir:

1. **IEC 60297 / 19-inch enterprise & colocation ecosystem**
2. **OCP ORv3 / MGX high-density open rack ecosystem**
3. **OCP ORW / next-generation wide AI rack ecosystem**

Bir sonraki production gate:

**DC-K03 Full Narration TR → S3F Full Audio chapter set → Golden UI → shared Full Player integration → Pages acceptance → `DC_K03_GOLDEN_V2 = ACCEPTED`.**
