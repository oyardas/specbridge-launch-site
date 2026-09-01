# DC-K01 — Data Center Service Models

Status: WAVE 1 RESEARCH BASELINE
Language: TR
Author: Önder Yardaş
Research date: 2026-09-01

## Executive conclusion

Bir veri merkezi yatırımı yalnız fiziksel kapasite üretmez; doğru ticari model seçildiğinde aynı fiziksel altyapı farklı sorumluluk, SLA, sermaye yoğunluğu ve marj profilleriyle çok farklı hizmetlere dönüştürülebilir. Colocation, managed hosting, IaaS, private cloud, GPUaaS, backup/DR ve interconnection aynı iş değildir. En kritik tasarım hatalarından biri, hizmet modelini belirlemeden bina, güç, soğutma ve network mimarisini sabitlemektir.

Doğru sıra şöyledir:

BUSINESS MODEL -> CUSTOMER RESPONSIBILITY -> SLA -> WORKLOAD CHARACTERISTICS -> CAPACITY/DENSITY -> FACILITY & IT ARCHITECTURE -> BoQ

## 1. Temel sınıflandırma

### A. Physical Capacity Services

#### Retail Colocation
Müşteri kendi server/storage/network cihazlarını getirir; sağlayıcı rack/cage alanı, güç, soğutma, fiziksel güvenlik ve bağlantı ekosistemi sağlar. Genellikle cabinet, kW veya kVA kapasitesi üzerinden fiyatlanır.

Uygun müşteri:
- enterprise IT
- SaaS şirketi
- finans/sağlık/kamu gibi kendi donanımını kontrol etmek isteyen kuruluş
- regional edge deployment

Mimari etkisi:
- çok kiracılı fiziksel izolasyon
- doğru metering
- A/B power opsiyonu
- güçlü cross-connect/MMR altyapısı
- remote/smart hands operasyonu

#### Private Cage
Birden çok cabinet için fiziksel olarak ayrılmış güvenli alan. Equinix dokümantasyonu private cage'i cabinet adedi ve power allocation'a göre oluşturulan, cross-connect'e hazır bir müşteri alanı olarak tanımlar.

#### Private Suite / Data Hall
Daha büyük müşterinin kendi ayrılmış suite veya hall alanını kullanmasıdır. Retail colo ile wholesale arasında ölçeklenebilir.

#### Wholesale Colocation
Büyük kapasite blokları, çoğunlukla yüzlerce kW ile MW arası. Müşterinin operasyonel ve teknik kontrolü retail colo'ya göre daha yüksek olabilir.

#### Powered Shell
Sağlayıcı bina kabuğu ve temel utility/facility altyapısını sağlar; müşteri iç fit-out veya IT altyapısının daha büyük bölümünü üstlenir.

#### Build-to-Suit
Belirli anchor customer/hyperscaler gereksinimine göre tasarlanan tesis veya büyük kapasite bloğu.

### B. Managed Infrastructure Services

#### Managed Colocation
Colocation altyapısına ek olarak sağlayıcı network, OS, monitoring veya belirli altyapı operasyonlarını yönetir. Sorumluluk sınırı sözleşmede açık tanımlanmalıdır.

#### Dedicated Server / Managed Hosting
Fiziksel server sağlayıcıya aittir; müşteri dedicated kapasite tüketir. Managed hosting'te OS, patch, monitoring, backup gibi servisler de eklenebilir.

#### Bare Metal as a Service
Fiziksel server sanallaştırılmadan, API/portal üzerinden hizmet olarak tahsis edilir. Özellikle lisans kısıtları, düşük jitter/latency, performans analizi veya belirli HPC kullanımında tercih edilebilir. AWS EC2 bare-metal instance dokümantasyonu doğrudan donanım erişimi isteyen specialized, legacy ve licensing-restricted workload örneklerini verir.

### C. Cloud Services

#### IaaS
Compute, storage ve network kaynaklarının hizmet olarak sunulmasıdır. AWS tanımında IaaS; compute, storage ve network altyapısının pay-as-you-go modelle sağlanması, fiziksel altyapının provider tarafından yönetilmesi olarak çerçevelenir.

IaaS için facility tek başına yeterli değildir. Gerekli ek katmanlar:
- virtualization platform
- orchestration/API
- tenant isolation
- virtual networking
- metering/billing
- image/catalog
- monitoring
- backup integration
- service lifecycle automation

#### Private Cloud
Bir müşteriye tahsis edilen cloud operating modelidir. Fiziksel olarak on-prem, colo veya provider tesisinde olabilir.

#### Managed Private Cloud
Private cloud platformunun tasarım, operasyon ve yaşam döngüsü provider tarafından yönetilir.

#### Hybrid Cloud
Workloadların private/on-prem ve public cloud arasında kontrollü dağıtılması. Connectivity, identity, security ve data movement mimarisi kritik hale gelir.

#### Sovereign / Regulated Cloud
Data residency, control-plane, operator access, jurisdiction ve cryptographic control gereksinimleri ön plana çıkar. 'Sovereign' yalnız lokasyon anlamına gelmez; kontrol modeli ve operasyonel erişim de değerlendirilmelidir.

### D. AI / HPC Services

#### GPU as a Service
GPU kaynakları dedicated veya shared modelde hizmet olarak sunulur. Facility etkileri geleneksel IaaS'tan çok daha ağır olabilir:
- çok yüksek rack density
- liquid cooling gereksinimi
- high-speed east-west network
- high-throughput storage
- scheduler/orchestration
- GPU lifecycle and health monitoring

#### AI Cloud / AI Factory
GPU sunmakla sınırlı değildir. NVIDIA'nın 2026 AI Cloud requirements dokümanı full-stack compute, network, storage, software ve operasyon gereksinimlerini birlikte ele alır. Bu nedenle 'GPU satın aldım, AI cloud oldum' yaklaşımı yanlıştır.

#### HPC as a Service
Batch scheduler, high-speed interconnect, low-latency fabric, parallel storage ve workload-specific optimization gerektirebilir.

### E. Data Protection Services

- Storage as a Service
- Backup as a Service
- Disaster Recovery as a Service
- Cyber Recovery / Vault

Bu servislerin mimarisi capacity-only değildir; immutable copy, air-gap mantığı, recovery orchestration, RPO/RTO ve clean-room süreçleri önemlidir.

### F. Connectivity & Interconnection

- Cross Connect
- Internet Exchange access
- IP Transit
- Cloud Connect / Cloud On-ramp
- Data Center Interconnect
- Metro Connect

Equinix colocation dokümanları fiziksel cross-connect, fiber-connect ve metro-connect'i colocation ekosisteminin bağımsız ürünleri olarak tanımlar. Bu, carrier-neutral veri merkezinde interconnection'ın yardımcı özellik değil ayrı bir gelir ve stratejik değer katmanı olduğunu gösterir.

### G. Operations Services

- Remote Hands
- Smart Hands
- Managed Network
- NOC as a Service
- SOC as a Service
- Managed Security
- Managed OS/Middleware
- Hardware lifecycle services

## 2. Sorumluluk matrisi

| Katman | Colocation | Managed Hosting | IaaS | Managed Private Cloud | SaaS |
|---|---|---|---|---|---|
| Bina / power / cooling | Provider | Provider | Provider | Provider | Provider |
| Physical server | Customer | Provider | Provider | Provider | Provider |
| Virtualization | Customer | Customer/Provider | Provider | Provider | Provider |
| OS | Customer | Provider opsiyonel | Customer/provider modeline bağlı | Provider ağırlıklı | Provider |
| Middleware | Customer | Model bazlı | Customer | Provider ağırlıklı | Provider |
| Application | Customer | Customer | Customer | Customer | Provider |
| Data responsibility | Customer | Customer | Customer | Customer | Shared governance |

Not: Gerçek sorumluluk sözleşme ve servis tanımına göre değişir. Bu tablo kavramsal ayrım içindir.

## 3. Hizmet modeli facility tasarımını nasıl değiştirir?

### Colocation ağırlıklı tesis
Öncelikler:
- tenant isolation
- flexible power increments
- metering
- cage/suite adaptability
- carrier density
- cross-connect speed
- customer access control

### Enterprise/private-cloud ağırlıklı tesis
Öncelikler:
- standardization
- predictable HCI/virtualization clusters
- strong backup/DR
- corporate security integration
- lower multi-tenant complexity

### AI/GPU cloud ağırlıklı tesis
Öncelikler:
- 30–150+ kW/rack design envelope
- liquid-ready white space
- 100/200/400/800G fabric options
- parallel/high-throughput storage
- large power blocks
- thermal and hydraulic zoning

### Edge/micro DC
Öncelikler:
- compact footprint
- remote operation
- physical hardening
- low-touch maintenance
- fast deployment
- simplified service catalog

## 4. Revenue logic

Service model ile fiyatlama birimi eşleşmelidir.

- retail colo: cabinet + committed kW/kVA + energy + cross-connect
- wholesale: committed MW / reserved capacity
- managed hosting: server/cluster + management bundle
- IaaS: vCPU/RAM/storage/network consumption or reserved capacity
- GPUaaS: GPU-hour / reserved GPU / cluster reservation
- storage: TB-month + performance tier + egress
- backup: protected TB + retention + restore tier
- DRaaS: protected workload + reserved recovery capacity + RPO/RTO tier
- network: port/bandwidth/cross-connect/cloud circuit
- remote hands: time/unit/support package

## 5. Decision guide

### Retail colocation seçin, eğer:
- müşteriler kendi donanımına sahip olmak istiyor
- interconnection önemli
- çok kiracılı talep var
- provider IT platform riskini sınırlamak istiyor

### Managed hosting seçin, eğer:
- müşteri fiziksel altyapıyı satın almak istemiyor
- workload öngörülebilir
- yüksek-touch service marjı hedefleniyor

### IaaS/private cloud seçin, eğer:
- automation/orchestration yetkinliği var
- billing/metering ve service lifecycle işletilebiliyor
- virtualization ve platform operations güçlü

### GPUaaS/AI cloud seçin, eğer:
- sadece GPU bütçesi değil, power/cooling/network/storage stack hazır
- utilization ve scheduling yönetilebiliyor
- müşteri pipeline ve AI software ekosistemi tanımlı

### DRaaS/cyber recovery seçin, eğer:
- ayrı failure domain mevcut
- recovery process test edilebiliyor
- immutable/isolated protection tasarımı var

## 6. Common mistakes

1. 40/80/80 gibi bir commercial allocation'ı teknik zorunluluk sanmak.
2. IaaS diye yalnız virtualization kurmak; portal, metering, network isolation ve lifecycle automation'ı unutmak.
3. GPUaaS diye yalnız GPU server satın almak.
4. Colocation tesisinde MMR/cross-connect kapasitesini sonradan düşünmek.
5. Hizmet kataloğuyla SLA seviyesini eşleştirmemek.
6. Çok fazla servis açıp operasyon ekibini yetersiz bırakmak.
7. Revenue model ile fiziksel capacity granularity'yi eşleştirmemek.

## 7. Reference service taxonomy for SpecBridge

### Facility & Colocation
Retail Colo; Private Cage; Private Suite/Data Hall; Wholesale; Powered Shell; Build-to-Suit; Hyperscale Lease; High-Density/AI Colo.

### Compute & Hosting
Dedicated Server; Bare Metal; Managed Hosting; IaaS; Private Cloud; Managed Private Cloud; Hybrid Cloud; Sovereign Cloud.

### AI & HPC
GPUaaS; AI Cloud/AI Factory; HPCaaS.

### Data Protection & Storage
StorageaaS; BaaS; DRaaS; Business Continuity; Cyber Recovery.

### Connectivity
Cross Connect; IX; IP Transit; Cloud Connect; DCI; Software-Defined Interconnection.

### Managed Operations & Security
Remote Hands; Smart Hands; Managed Network; Managed Security; SOCaaS; NOCaaS; Managed OS/Middleware; Hardware Lifecycle.

### Platform & Ecosystem
Marketplace; Edge/Metro Cloud; PaaS; SaaS/Application Services.

## 8. Authoritative / official references

1. Uptime Institute — Tier Classification System
https://uptimeinstitute.com/tiers

2. Uptime Institute — Tier Certification
https://uptimeinstitute.com/tier-certification

3. Equinix — Colocation Products and Services
https://docs.equinix.com/colocation/

4. Equinix — Private Cages
https://docs.equinix.com/colocation/colo-private-cage/

5. Equinix — Scalable Colocation Portfolio
https://www.equinix.com/product-solutions/colocation

6. AWS — What is IaaS?
https://aws.amazon.com/what-is/iaas/

7. AWS — EC2 Bare Metal examples
https://docs.aws.amazon.com/ec2/latest/instancetypes/ec2-nitro-instances.html

8. NVIDIA — Requirements for AI Clouds
https://docs.nvidia.com/dsx/ncp/nvidia-requirements-for-ai-clouds/home

## 9. Research freeze statement

Bu modül vendor-neutral karar çerçevesidir. Vendor product examples yalnız implementation evidence olarak kullanılmalı; nihai proje çözümü workload, SLA, density, facility constraints, business model ve operations maturity üzerinden seçilmelidir.