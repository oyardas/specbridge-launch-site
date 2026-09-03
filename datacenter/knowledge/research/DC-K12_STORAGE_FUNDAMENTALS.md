# DC-K12 — Storage Fundamentals — Golden Deep Research

**Research state:** `DC_K12_GOLDEN_DEEP_RESEARCH = COMPLETE`  
**Research date:** 2026-09-03  
**Scope:** Vendor-neutral storage fundamentals from data-access models and media through logical addressing, block/file/object semantics, HDD/SSD/NVMe, SCSI/SATA, local/direct/networked storage, RAID/erasure coding, capacity math, thin provisioning, snapshots, deduplication/compression, performance, multipathing, consistency, durability, protection, lifecycle, observability, sizing, acceptance and BoQ freeze.  
**Next production stage:** 8-chapter Full Narration TR V2 + independent Quick Brief + frozen S3F audio QA.

---

## Evidence labels used in this module

- **STANDARD / OPEN SPEC** — standards-body, consortium or open specification material.
- **PLATFORM DOC** — authoritative implementation documentation used to illustrate behavior, not universal requirements.
- **VENDOR CLAIM / REFERENCE** — vendor documentation used only as an implementation example.
- **SPECBRIDGE PLANNING GUIDANCE** — engineering synthesis for sizing and procurement decisions.
- **DECISION GUIDANCE** — acceptance and BoQ logic derived from the evidence set.

---

# Executive thesis

## 0. Storage is a data-service contract, not a disk count

A storage design is the end-to-end contract connecting workload behavior to media, access semantics, protection, failure domains, performance, data services, lifecycle and recovery. A correct design starts from the workload and data contract, not from a capacity number or a preferred array family.

`WORKLOAD / DATA MODEL → ACCESS SEMANTICS → CAPACITY → PERFORMANCE → MEDIA → PROTOCOL / TRANSPORT → FAILURE DOMAIN → PROTECTION → DATA SERVICES → SECURITY → OBSERVABILITY → RECOVERY → LIFECYCLE → ACCEPTANCE → TCO / BoQ FREEZE`

## 1. Golden principle

**Choose storage by workload semantics, failure/recovery objectives and measurable service requirements. Do not choose it only by raw TB, headline IOPS, interface speed, drive type, controller count or a vendor feature matrix.**

## 2. Canonical distinctions

- `raw capacity ≠ usable capacity ≠ effective capacity ≠ resilient usable capacity`
- `block ≠ file ≠ object`
- `protocol ≠ transport ≠ media`
- `SCSI command model ≠ SAS physical transport only`
- `NVMe ≠ PCIe-only local storage`
- `interface link rate ≠ application throughput`
- `IOPS ≠ throughput ≠ latency`
- `average latency ≠ tail latency`
- `sequential workload ≠ random workload`
- `read-heavy ≠ write-heavy`
- `queue depth ≠ user concurrency`
- `HDD ≠ SSD ≠ NVMe protocol`
- `SSD media ≠ guaranteed low tail latency`
- `RAID level ≠ complete availability architecture`
- `replication ≠ erasure coding`
- `snapshot ≠ backup`
- `replication ≠ backup`
- `thin provisioned capacity ≠ physically available capacity`
- `deduplication/compression ratio ≠ guaranteed capacity multiplier`
- `cache ≠ durable media unless explicitly protected and acknowledged as such`
- `dual path ≠ independent failure domains`
- `multipathing ≠ application HA`
- `controller HA ≠ site DR`
- `local storage ≠ automatically faster for every workload`
- `shared storage ≠ automatically more available`
- `object API ≠ file-system namespace`
- `NFS ≠ SMB`
- `iSCSI ≠ Fibre Channel`
- `NVMe/TCP ≠ iSCSI over faster disks`
- `data reduction ≠ free CPU / memory / latency`
- `capacity reserve ≠ rebuild reserve ≠ operational free space`
- `vendor maximum ≠ recommended design point`

---

# A. Storage taxonomy and data-access semantics

## 3. Block storage

Block storage exposes addressable blocks to a host. The host or an upper layer normally supplies the file system or database structure. The useful design question is not merely “SAN or local”; it is who owns the namespace, allocation, locking, consistency and recovery semantics.

## 4. File storage

File storage exposes files and directories through a shared namespace and protocol. File-level metadata, permissions, locking and namespace behavior are part of the service contract rather than being wholly delegated to each host.

## 5. Object storage

Object storage addresses data as objects with identifiers/keys and associated metadata. It usually uses create/read/delete or whole-object replacement semantics rather than arbitrary block overwrite semantics. Treat S3-style APIs as widely deployed de-facto interfaces, not as equivalent to a vendor-neutral international standard.

## 6. Multi-protocol storage

One physical platform may expose block, file and object services, but identical hardware does not imply identical semantics, security models, consistency or performance. Each access path requires independent acceptance criteria.

## 7. Local / DAS

Direct-attached storage can reduce network dependencies and may provide strong locality, but application availability, replacement workflow, data mobility and host failure behavior must be designed explicitly.

## 8. Shared networked storage

Shared storage centralizes or distributes data services across multiple hosts. The design must account for path redundancy, namespace/locking, fabric behavior, controller/node failures, maintenance and recovery states.

## 9. Storage virtualization

Logical volumes, pools, namespaces and virtual disks can abstract physical placement. Abstraction improves flexibility but can hide contention and failure-domain coupling; acceptance must retain traceability from logical object to physical protection policy.

---

# B. Media and device fundamentals

## 10. HDD fundamentals

HDD behavior includes seek and rotational effects, making small random I/O fundamentally different from large sequential transfer. Capacity efficiency can be excellent, but latency and rebuild exposure often dominate dense HDD designs.

## 11. SSD fundamentals

SSDs remove mechanical seek but add flash-management behaviors including garbage collection, wear management, internal parallelism and write amplification. Sustained write behavior and tail latency matter more than short benchmark bursts.

## 12. NAND endurance

Endurance must be matched to write workload, over-provisioning, drive writes per day / total bytes written limits and warranty conditions. Capacity alone is not a sufficient SSD selection criterion.

## 13. Power-loss protection

A write acknowledgement is only as durable as the entire acknowledged write path. Controller cache, device cache and SSD power-loss protection behavior must be included in the durability contract.

## 14. Sector / logical block size

Hosts commonly address fixed-size logical blocks. Logical block size and physical media granularity can differ; alignment and workload block size can affect efficiency and performance.

## 15. SATA

SATA remains a storage interface ecosystem for HDD/SSD devices. SATA-IO explicitly recommends using correct generation naming and currently publishes Revision 3.5 materials; the historical 6 Gb/s link rate is an interface property, not an application throughput guarantee.

## 16. SAS and the SCSI family

SAS is a serial transport within the broader SCSI ecosystem. SCSI defines an architecture and command family that can be carried over multiple transports; therefore “SCSI” must not be reduced to one cable type.

## 17. NVMe

NVMe defines host software communication with non-volatile memory subsystems through a modular specification set. As of 2026-08-04 the current NVM Express specification family is NVMe 2.4, with separate Base, command-set, transport, boot and management-interface documents.

## 18. NVMe over Fabrics

NVMe can be transported beyond local PCIe. Current NVMe transport specifications include PCIe, RDMA and TCP. NVMe/TCP uses TCP transport; NVMe/RDMA uses RDMA transport. Design decisions must separate NVMe command semantics from the underlying transport and network design.

## 19. Namespaces and logical presentation

A physical device/subsystem may expose one or more logical namespaces or volumes. Namespace count is not equivalent to physical failure-domain count.

## 20. Zoned storage

Zoned storage changes write-placement expectations and can improve media efficiency for suitable software stacks. It is not a transparent drop-in optimization for every workload; host/software support is part of the acceptance boundary.

---

# C. Protocols and transports

## 21. SCSI architecture

The SCSI architecture family separates command architecture from transports. T10 identifies related standards across SCSI command sets and transports, while iSCSI is standardized by the IETF and Fibre Channel by T11.

## 22. iSCSI

RFC 7143 consolidates iSCSI, mapping SCSI operation over IP/TCP-based networking. iSCSI design must include target/initiator identity, sessions, path redundancy, authentication/security and Ethernet/IP failure domains.

## 23. NFSv4.1

RFC 8881 defines NFSv4.1 as a stateful network file system protocol with sessions, security requirements, multi-server namespace features and transparent state migration mechanisms. NFS sizing therefore includes metadata, locking/state and namespace behavior, not only data throughput.

## 24. SMB

SMB is a network file-sharing protocol with dialect negotiation and file-service semantics. “File share” is not a sufficient design specification; dialect, authentication, encryption/signing, locking, scale and client compatibility matter.

## 25. Object APIs and CDMI

SNIA CDMI, also standardized as ISO/IEC 17826, provides a vendor-neutral RESTful data-management interface for cloud/hybrid/on-prem storage. It is useful as a standards reference for object/container/data-management concepts; S3 compatibility should be specified separately when required.

## 26. Fibre Channel

Fibre Channel storage separates host/storage endpoints from a purpose-built switched fabric. Zoning, name services, multipathing and fabric redundancy are part of the storage service path and must be tested under failure.

## 27. RDMA storage transports

RDMA can reduce software and CPU overhead for appropriate transports, but requires end-to-end network correctness. “RDMA capable” is not equivalent to an engineered, validated RDMA storage fabric.

## 28. Protocol multipathing

Multipathing is a host-to-storage path-resilience mechanism. It does not by itself prove controller independence, fabric independence, storage-node resilience or application continuity.

---

# D. Capacity engineering

## 29. Raw capacity

Raw capacity is the sum of nominal device capacities before protection, metadata, sparing, over-provisioning and operational reserve.

## 30. Usable capacity

Usable capacity is what remains after system overhead and protection policy. The exact calculation depends on platform implementation and must be documented rather than inferred from device count.

## 31. Resilient usable capacity

Resilient usable capacity is the capacity available while maintaining the intended failure/maintenance policy and required recovery reserve. This is the relevant procurement number for critical systems.

## 32. Effective capacity

Effective capacity can include data-reduction benefits. It is workload-dependent and must not be purchased as if a dedupe/compression ratio were guaranteed unless contractually defined and acceptance-tested.

## 33. Decimal versus binary units

TB/TiB and GB/GiB differences must be made explicit in sizing sheets. Marketing capacity and operating-system display conventions can otherwise create avoidable disputes.

## 34. Protection overhead

Mirroring, parity and erasure coding trade capacity efficiency against fault tolerance, rebuild/reconstruction cost and write behavior. The correct policy is workload- and failure-domain-dependent.

## 35. Spare strategy

Dedicated spare, distributed spare, reserved free space and dynamic reconstruction are different implementation models. “Has spare” is not a complete resilience statement.

## 36. Rebuild reserve

A system near full capacity can have inadequate space or performance headroom to recover safely after failure. Rebuild/rebalance reserve must be separately dimensioned.

## 37. Growth reserve

Business growth reserve should be separated from technical failure reserve. Using the same free capacity for both creates false confidence.

## 38. Thin provisioning

SNIA defines thin provisioning as allocating physical capacity as applications write rather than preallocating all physical capacity at provisioning. Thin provisioning therefore creates an oversubscription risk that requires thresholding, forecasting and runbooks.

## 39. Snapshot capacity

Snapshot space depends on implementation and change rate. A snapshot schedule cannot be sized only from source volume size.

## 40. Deduplication

SNIA defines data deduplication as replacing multiple copies with references to a shared copy to save storage space and/or transferred data. Savings depend on workload redundancy, granularity and implementation.

## 41. Compression

Compression reduces encoded data size but consumes compute and can affect latency. Compressibility must be measured on representative data.

## 42. Combined data reduction

Do not multiply brochure dedupe and compression ratios blindly. Combined effective capacity must use observed workload behavior and a conservative acceptance floor.

---

# E. Protection and resilience

## 43. RAID is not availability by itself

RAID protects against defined device failures but does not cover controller, software, enclosure, fabric, site, operator or application failures by itself.

## 44. Mirroring

Mirroring keeps multiple copies and provides simple reconstruction semantics but consumes more capacity. Failure-domain placement is as important as copy count.

## 45. Parity RAID

Parity improves capacity efficiency relative to full mirroring but adds write/rebuild complexity. Large-drive rebuild windows and degraded-state performance must be acceptance-tested.

## 46. Erasure coding

Erasure coding is an error-correcting coding approach used to tolerate loss of fragments while improving capacity efficiency. Its compute, network and reconstruction characteristics differ from replication.

## 47. Failure domains

Drive, node, enclosure, rack, power feed, controller, fabric and site are different failure domains. A policy name is meaningless unless placement across these domains is proven.

## 48. Controller resilience

Dual controllers can remove one failure point only if cache, backend paths, firmware upgrade behavior and failover are correctly engineered and tested.

## 49. Fabric resilience

Two links to the same switch are not two independent fabrics. Storage acceptance should test actual switch/fabric/path failure.

## 50. Quorum and distributed storage

Distributed storage may use quorum/consensus and placement logic that differs from array-style RAID. Node count alone does not prove data durability or service availability.

## 51. Snapshot versus backup

A snapshot is a point-in-time storage mechanism, often sharing failure domains with production. It is not a substitute for an independent backup policy.

## 52. Replication versus backup

Replication copies changes and can also propagate corruption, deletion or ransomware. Backup requires independent recovery semantics, retention and tested restore.

## 53. Local HA versus DR

Storage failover within one system/site is not disaster recovery. DR requires an independent failure domain and explicit RPO/RTO/runbook testing.

---

# F. Performance engineering

## 54. IOPS

IOPS measures I/O operations per second. It is meaningful only with block size, read/write ratio, access pattern, queue depth, cache state and latency constraints.

## 55. Throughput

Throughput measures data transferred per unit time. Large sequential I/O can be throughput-bound while small random I/O can be latency/IOPS-bound.

## 56. Latency

SNIA defines I/O latency as the time between an I/O request and completion. Storage design must specify latency distribution, not only averages.

## 57. Tail latency

P95/P99/P99.9 behavior can dominate database, VM and transactional user experience. Tail latency during failure, rebuild and maintenance is a critical acceptance metric.

## 58. Block size

Performance changes with request size. A 4 KiB random workload and 1 MiB sequential workload cannot share one headline performance number.

## 59. Read/write ratio

Reads and writes exercise caches, media and protection differently. Performance qualification must include representative ratios.

## 60. Random/sequential mix

Real workloads are often mixed. Sequential benchmark maxima should never be used to size random transactional workloads.

## 61. Queue depth

Increasing queue depth can increase throughput/IOPS while also increasing latency. The useful operating point is workload-dependent.

## 62. Cache effects

Warm-cache benchmarks can measure memory more than storage media. Acceptance must define cache state, dataset size and test duration.

## 63. Sustained-state performance

Short tests can hide garbage collection, destage, compaction, rebuild and throttling. Critical storage requires sustained-state testing.

## 64. Degraded-state performance

Performance after drive/node/controller/path failure must be explicitly tested. A design that meets SLA only in healthy state is incomplete.

## 65. Rebuild/rebalance interference

Recovery consumes media, CPU and network resources. Recovery throttling is a service-policy decision, not merely an implementation detail.

## 66. Host bottlenecks

CPU, NUMA, HBA/NIC, PCIe lanes, driver stack and file system can bottleneck storage. Array benchmark claims do not automatically transfer to application performance.

## 67. Network bottlenecks

For networked storage, oversubscription, packet loss, congestion, MTU inconsistency, QoS and routing/fabric design can dominate latency and throughput.

## 68. Benchmark reproducibility

Every performance claim should record tool/version, dataset, I/O profile, threads/jobs, queue depth, duration, warm-up, cache state, compression/dedupe characteristics and system health state.

---

# G. Data services and consistency

## 69. File-system semantics

File systems add namespace, allocation, locking, permissions and metadata semantics above block devices. Shared block access without a cluster-aware file system can corrupt data.

## 70. Object semantics

Object platforms typically identify objects by keys/IDs and manage metadata. Update, consistency, versioning and namespace behavior must be validated per API/platform.

## 71. Consistency model

Strong, session, eventual or other consistency behavior affects applications. “Object compatible” or “distributed” does not define consistency by itself.

## 72. Data integrity

Integrity includes detection/correction across media, memory, transport and software paths. End-to-end checksums are valuable only when failure handling and repair behavior are defined.

## 73. Encryption at rest

Encryption scope can be drive-, controller-, volume-, file- or application-level. Key management, rotation, recovery and HSM/KMS dependencies are part of the design.

## 74. Encryption in transit

NFS, SMB, iSCSI, NVMe/TCP and object APIs have different security options and operational trade-offs. Transport security must be specified per protocol.

## 75. Immutability

Immutability/retention controls can improve ransomware resilience, but implementation, privileged bypass, clock/time source, retention governance and deletion workflows must be validated.

## 76. QoS

QoS can cap or guarantee resources only within implementation limits. QoS policy must be tested under contention and failure, not merely configured.

## 77. Tiering

Tiering moves data among media classes based on policy. Migration windows, hot-data detection, recall latency and failure behavior affect workload experience.

---

# H. Operations, lifecycle and observability

## 78. Health telemetry

Device SMART/health, controller state, media errors, path status, capacity, latency, queue depth, rebuild state and environmental telemetry should be centralized and alertable.

## 79. Capacity thresholds

Thresholds require both absolute free capacity and projected growth/rebuild needs. One generic “80% full” rule is not universal.

## 80. Firmware lifecycle

Drive, HBA/NIC, controller, enclosure, switch and platform firmware compatibility is a lifecycle dependency. Support matrices must be frozen with the BoQ.

## 81. Non-disruptive upgrade claims

An NDU claim must be acceptance-tested against real workload and path behavior. Maintenance can still reduce redundancy/performance even without a full outage.

## 82. Media replacement

Replacement workflow must preserve failure-domain safety and avoid cascading rebuild risk. Large-capacity devices increase exposure time if recovery throughput is insufficient.

## 83. Data sanitization

End-of-life and RMA processes need defined cryptographic erase, secure erase or physical destruction policy appropriate to media and compliance requirements.

## 84. Configuration backup

Storage platform configuration, encryption keys, zoning/mappings and recovery metadata can be as important as data. Their protection must be part of operational design.

---

# I. Workload mapping

## 85. Virtualization

Virtualization storage requires predictable latency, failure handling, multipathing, queue behavior and enough maintenance reserve for host/storage mobility.

## 86. Databases

Databases often care about low and stable write latency, durability semantics, queue behavior and log/data separation more than headline capacity.

## 87. Backup repositories

Backup targets favor throughput, capacity efficiency, immutability and restore concurrency; ingest benchmark alone is insufficient.

## 88. AI / analytics

AI pipelines may combine high-throughput file/object access, metadata scalability and checkpoint behavior. GPU compute can be underutilized if storage cannot sustain feeder throughput.

## 89. Archive

Archive workloads prioritize durability, retention, cost and retrieval objectives. Low-cost capacity without restore/retrieval testing creates operational risk.

## 90. VDI

VDI can produce bursty random I/O and metadata pressure around boot/login events. Average daily throughput is a poor sizing basis.

## 91. Kubernetes

Container platforms require CSI/storage-class semantics, topology awareness, snapshot/backup integration and application-consistent recovery. A persistent volume is not automatically a backup.

---

# J. Sizing and procurement method

## 92. Step 1 — inventory workloads

Record dataset size, growth, block/object/file profile, read/write ratio, random/sequential mix, latency target, throughput, IOPS, concurrency, retention, RPO/RTO and maintenance constraints.

## 93. Step 2 — classify data semantics

Decide whether the application requires block, shared file, object or multiple services. Do not force an application into the wrong access model to fit an existing product.

## 94. Step 3 — size capacity layers

Calculate raw, protection overhead, metadata/system reserve, rebuild reserve, growth reserve and expected data-reduction range separately.

## 95. Step 4 — size performance

Use simultaneous IOPS, throughput and latency requirements with representative block size/mix. Add failure and maintenance scenarios.

## 96. Step 5 — map failure domains

Document every relevant path from host to data and identify shared components. Power, network and enclosure dependencies belong in the storage diagram.

## 97. Step 6 — define protection

Select RAID/replication/EC/snapshot/backup/DR as separate layers. State which failure each layer protects against.

## 98. Step 7 — define protocol/fabric

Specify interfaces, speeds, port counts, multipathing, switch/fabric topology, optics/cabling, security and management/OOB requirements.

## 99. Step 8 — define lifecycle

Freeze support matrix, firmware policy, expansion rules, mixed-generation constraints, maintenance method and end-of-life assumptions.

## 100. Step 9 — acceptance tests

Test healthy state, path failure, controller/node failure, device failure, rebuild/rebalance, near-capacity operation, upgrade/maintenance, backup/restore and DR as applicable.

## 101. Step 10 — freeze BoQ

Freeze drives/media, controllers/nodes, cache, licenses, protocol features, ports, optics, switches, support, rack/power requirements, spares and implementation services together with explicit assumptions.

---

# K. Golden acceptance matrix

## 102. Capacity acceptance

PASS only if usable and resilient usable capacity meet requirements without relying on unproven data-reduction ratios.

## 103. Performance acceptance

PASS only if representative workload meets IOPS/throughput and percentile-latency targets for the required duration.

## 104. Failure acceptance

PASS only if defined failures preserve the expected data/service state and recovery completes within engineered reserve.

## 105. Maintenance acceptance

PASS only if the platform remains within agreed service boundaries during planned maintenance and upgrade states.

## 106. Protection acceptance

PASS only if backup and restore are independently tested; replication/snapshot alone cannot satisfy this gate.

## 107. Security acceptance

PASS only if identity, encryption, key management, privileged access, audit and secure-retention requirements are verified where applicable.

## 108. Operations acceptance

PASS only if telemetry, alerting, capacity forecasting, runbooks, replacement workflow and support escalation are operationally usable.

## 109. Commercial acceptance

PASS only if licenses, capacity entitlements, support, expansion increments and required protocol/data-service features are included in the BoQ/TCO.

---

# L. Common design traps

## 110. Buying headline IOPS

A benchmark number without latency, block size, mix, queue depth and cache state is not a service requirement.

## 111. Buying effective TB as physical TB

Unverified dedupe/compression assumptions can create immediate capacity risk.

## 112. Treating snapshots as backup

Shared failure domains and privileged deletion paths can defeat recovery objectives.

## 113. Ignoring rebuild performance

A design may survive a device failure logically but breach SLA for hours or days during reconstruction.

## 114. Assuming dual everything means independence

Dual ports, controllers or switches can still share firmware, backplane, power or operational failure domains.

## 115. Ignoring application semantics

Choosing object for a workload needing POSIX-style file semantics, or shared block without a cluster file system, can break applications despite sufficient hardware performance.

## 116. Mixing protocol and media language

“NVMe storage”, “SSD storage”, “SAN”, “NAS” and “object” describe different axes. BoQs must state media, command/protocol, transport, access model and service layer separately.

## 117. Using vendor maximums as design targets

Maximum volume counts, node counts, capacities and IOPS are boundaries, not recommended steady-state operating points.

---

# M. Decision visuals for Golden UI

## 118. Visual 1 — Storage semantic stack

`APPLICATION → BLOCK / FILE / OBJECT → FILE SYSTEM / DATABASE / OBJECT API → PROTOCOL → TRANSPORT → CONTROLLER / NODE → MEDIA`

## 119. Visual 2 — Capacity waterfall

`RAW → protection overhead → system/metadata → spare/rebuild reserve → operational reserve → resilient usable → data reduction (measured) → effective`

## 120. Visual 3 — Performance triangle

`IOPS ↔ THROUGHPUT ↔ LATENCY`, annotated with block size, read/write mix, randomness, queue depth and cache state.

## 121. Visual 4 — Protection ladder

`device protection → controller/node resilience → path/fabric resilience → snapshot → backup → replication → site DR → cyber recovery`

## 122. Visual 5 — Failure-domain map

Host/HBA/NIC → switch/fabric A/B → controller/node → enclosure → media → rack/power/site, with shared dependencies highlighted.

## 123. Visual 6 — Storage selection matrix

Rows: database, virtualization, file collaboration, backup, archive, AI/analytics, Kubernetes. Columns: access model, latency, throughput, scale, protection, operational fit.

---

# N. Full Briefing production plan

## 124. K12-00 — Storage gerçekte ne sağlar?

Block/file/object, semantic contract, raw-versus-usable, protocol/media separation.

## 125. K12-01 — HDD, SSD, SATA, SAS, SCSI ve NVMe

Media, endurance, power-loss protection, command/transport distinctions.

## 126. K12-02 — Block, file, object ve network storage protocols

iSCSI, NFS, SMB, object APIs, Fibre Channel and NVMe transports.

## 127. K12-03 — Capacity: raw, usable, resilient usable ve effective

Protection overhead, reserves, thin provisioning, dedupe/compression.

## 128. K12-04 — RAID, replication, erasure coding ve failure domains

Protection layers, degraded state and rebuild/rebalance.

## 129. K12-05 — IOPS, throughput, latency ve benchmark gerçekliği

Workload profiles, percentile latency, cache, sustained/degraded-state tests.

## 130. K12-06 — Data services, security, lifecycle ve operations

Snapshots, backup, encryption, immutability, telemetry, firmware and maintenance.

## 131. K12-07 — Sizing, acceptance, TCO ve BoQ freeze

Workload-to-storage decision chain and procurement acceptance matrix.

---

# O. Frozen Golden rule

## 132. Canonical engineering chain

`WORKLOAD / DATA MODEL → BLOCK / FILE / OBJECT SEMANTICS → CAPACITY LAYERS → IOPS / THROUGHPUT / PERCENTILE LATENCY → MEDIA → PROTOCOL / TRANSPORT → FAILURE DOMAINS → RAID / REPLICATION / EC → SNAPSHOT / BACKUP / DR → DATA SERVICES / SECURITY → DEGRADED-STATE TEST → LIFECYCLE → TCO → BoQ FREEZE`

A storage platform must not be frozen from raw TB, media type, protocol label, controller count, dedupe ratio or a single synthetic benchmark alone.

---

# P. Current official-source baseline

## 133. NVM Express current specification baseline

NVM Express states that the latest NVMe specification set was released 2026-08-04 and is the NVMe 2.4 family. The set separates Base, command-set, transport, boot and management-interface specifications. Current transports listed include PCIe, RDMA and TCP.

Source: NVM Express — Specifications, https://nvmexpress.org/specifications/

## 134. NVMe/TCP current transport baseline

NVM Express lists NVMe over TCP Transport Specification Revision 1.3 as ratified 2026-07-31 and describes it as layered over TCP implementations.

Source: NVM Express — NVMe over TCP Transport Specification, https://nvmexpress.org/specification/tcp-transport-specification/

## 135. SCSI architecture baseline

T10/INCITS maintains the SCSI architecture and command-set family. Its architecture reference explicitly separates responsibilities across SCSI projects and related transport standards bodies.

Sources: T10 SCSI Standards Architecture, https://www.t10.org/scsi-3.htm ; INCITS SCSI Committee, https://www.incits.org/committees/t10

## 136. SATA baseline

SATA-IO maintains Serial ATA specifications and currently advertises SATA Revision 3.5. SATA-IO naming guidance distinguishes the interface generation/rate from product marketing terminology.

Sources: SATA-IO, https://sata-io.org/ ; SATA Naming Guidelines, https://sata-io.org/developers/sata-naming-guidelines

## 137. iSCSI baseline

RFC 7143 is the consolidated Internet Small Computer System Interface protocol specification.

Source: RFC Editor — RFC 7143, https://www.rfc-editor.org/info/rfc7143/

## 138. NFS baseline

RFC 8881 defines NFS version 4 minor version 1, including sessions, security and multi-server namespace behavior.

Source: RFC Editor — RFC 8881, https://www.rfc-editor.org/rfc/rfc8881.html

## 139. Object / CDMI baseline

SNIA CDMI is standardized as ISO/IEC 17826 and defines a vendor-neutral RESTful management data representation and protocol for cloud, hybrid and on-prem storage. SNIA’s object-storage educational material distinguishes object IDs/keys and metadata from file/directory and block addressing models.

Sources: SNIA CDMI, https://www.snia.org/cdmi ; SNIA What Is Object Storage, https://www.snia.org/education/what-is-object-storage

## 140. SNIA terminology baseline

SNIA’s Dictionary is the terminology baseline for block storage, RAID, thin provisioning, data deduplication and latency used in this module. Definitions are used as conceptual anchors; this research paraphrases them rather than reproducing full dictionary entries.

Sources: SNIA Dictionary, https://www.snia.org/education/dictionary/about-dictionary ; Block Storage, https://www.snia.org/education/online-dictionary/term/block-storage ; RAID, https://www.snia.org/education/online-dictionary/term/raid ; Thin Provisioning, https://www.snia.org/education/online-dictionary/term/thin-provisioning ; Data Deduplication, https://www.snia.org/education/online-dictionary/term/data-deduplication ; Latency, https://www.snia.org/education/online-dictionary/term/latency

## 141. Performance-metric baseline

SNIA educational material treats throughput, IOPS and latency as different storage performance metrics and emphasizes workload-specific I/O patterns rather than one universal performance number.

Source: SNIA — Everything You Wanted to Know About Throughput, IOPs, and Latency, https://www.snia.org/educational-library/everything-you-wanted-know-about-throughput-iops-and-latency-were-too-proud-ask

---

# Q. Research closeout

## 142. Research acceptance checklist

- vendor-neutral taxonomy: PASS
- block/file/object distinction: PASS
- media/interface/protocol separation: PASS
- current NVMe 2.4 baseline: PASS
- SCSI/SATA/iSCSI/NFS/object standards baseline: PASS
- capacity waterfall and reserves: PASS
- RAID/replication/EC/failure-domain separation: PASS
- performance model with percentile/degraded-state acceptance: PASS
- snapshot/backup/replication/DR separation: PASS
- security/lifecycle/operations coverage: PASS
- workload mapping: PASS
- sizing and BoQ freeze method: PASS
- 6 Golden visual candidates: PASS
- 8-chapter Full Briefing plan: PASS

## 143. Final research status

`DC_K12_GOLDEN_DEEP_RESEARCH = COMPLETE`

**Canonical research file count for this gate:** `1`  
**Ready for Full Narration TR V2:** YES  
**Ready for independent Quick Brief planning:** YES  
**KAYAS / DCTS changes:** NONE
