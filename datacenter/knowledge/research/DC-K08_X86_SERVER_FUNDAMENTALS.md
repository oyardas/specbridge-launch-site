# DC-K08 — x86 Server Fundamentals — Golden Deep Research

**Status:** GOLDEN DEEP RESEARCH BASELINE  
**Language:** TR with canonical English infrastructure terminology  
**Scope:** Vendor-neutral x86 server architecture fundamentals for enterprise, cloud, virtualization, storage, database, HPC/AI host and edge use cases  
**Evidence model:** FACT / ENGINEERING GUIDANCE / VENDOR CLAIM / SPECBRIDGE INTERPRETATION / DECISION GUIDANCE  
**Golden rule:** `WORKLOAD → CPU TOPOLOGY → MEMORY CAPACITY/BANDWIDTH → NUMA LOCALITY → PCIe/CXL LANE BUDGET → LOCAL STORAGE/BOOT → NETWORK/OOB → POWER/THERMAL → RAS/SECURITY → FIRMWARE/MANAGEMENT → SERVICEABILITY → LIFECYCLE → BoQ`

---

## 0. Executive summary

An x86 server is not “a CPU plus RAM.” It is a coordinated platform in which instruction-set compatibility, CPU topology, NUMA domains, memory channels, PCIe/CXL root complexes, storage, NICs, management controllers, firmware, power, thermals, serviceability and platform security jointly determine real workload behavior.

The most common procurement failure is to size one dimension in isolation: buying more cores while starving memory bandwidth, adding NVMe devices without PCIe lane planning, selecting two sockets when one socket has better locality and software-license economics, or counting redundant PSUs without tracing the upstream A/B power path.

The architecture must therefore be frozen only after the workload has been translated into a balanced resource model.

### K08 executive conclusions

1. **x86 is an instruction-set family, not a complete server architecture.** AMD64 and Intel 64 implement the x86-64 execution model, but platform topology, memory, I/O, RAS and security capabilities vary by processor generation and OEM implementation. [R1][R2]
2. **Core count alone is not server capacity.** Frequency behavior, cache hierarchy, memory bandwidth, NUMA locality, vector/crypto capability, I/O and power envelope can dominate application performance.
3. **A socket is a physical CPU package/interface; a NUMA node is an OS-visible locality domain.** They often correlate but must not be treated as synonyms. Linux explicitly exposes and manages NUMA memory policy. [R3]
4. **Memory capacity and memory bandwidth are different constraints.** Channel population, DIMM topology and locality can matter as much as total installed GB/TB.
5. **PCIe lanes are a finite platform budget.** NICs, NVMe, GPUs/accelerators, HBAs and CXL devices compete for root-complex connectivity; slot count alone does not prove usable bandwidth.
6. **NVMe is a protocol family, not a form factor.** M.2, U.2/U.3, E1.S/E3.S and add-in cards are packaging choices; NVMe may run over PCIe while NVMe-oF uses network transports. [R11][R12]
7. **CXL capability must be evaluated as an end-to-end platform feature.** The current CXL specification is newer than many shipping host platforms; specification release does not prove CPU, board, BIOS, OS, device and validation support. [R9][R10]
8. **BMC and UEFI are different control planes.** UEFI initializes/boots the host; BMC performs out-of-band management. Redfish standardizes system-management APIs across multi-vendor server estates. [R13][R15][R16]
9. **ECC is necessary but not equivalent to complete RAS.** Corrected/uncorrected error handling, memory sparing/mirroring, patrol scrubbing, PCIe AER, machine-check reporting, poison handling and firmware recovery are separate capabilities. [R4][R13]
10. **Dual PSU does not prove dual power path.** Redundancy must be traced from facility source to rack PDU to PSU to internal distribution.
11. **Server security is a chain.** Secure Boot, TPM, SPDM, signed firmware, BMC security, root-of-trust, device firmware and recovery controls must be evaluated together. [R20][R21][R22]
12. **The right server is a workload-balanced platform, not the largest SKU.** Procurement should optimize usable performance, availability, power, software licensing, serviceability and lifecycle cost together.

---

## 1. Evidence language contract

### 1.1 FACT
A statement directly supported by a normative standard, official architecture specification, operating-system implementation documentation or other primary source.

### 1.2 ENGINEERING GUIDANCE
A design recommendation derived from repeatable engineering practice, not a normative requirement unless explicitly tied to a standard.

### 1.3 VENDOR CLAIM
A product capability or performance statement published by a manufacturer. It must not be generalized to all x86 servers.

### 1.4 SPECBRIDGE INTERPRETATION
A synthesis that connects standards and platform behavior into a vendor-neutral architecture model.

### 1.5 DECISION GUIDANCE
A conditional recommendation intended to help choose or reject an architecture based on workload, risk, operations and lifecycle requirements.

---

# PART I — Canonical taxonomy

## 2. x86 ISA is not the server

**FACT:** AMD64 and Intel 64 documentation describe the x86-64 programming/architecture environment. [R1][R2]

**SPECBRIDGE INTERPRETATION:** “x86 server” should be decomposed into at least five layers:

1. **ISA layer** — x86-64 instruction and execution model.
2. **Microarchitecture layer** — core design, cache hierarchy, branch prediction, vector engines, power/frequency behavior.
3. **Processor package/socket layer** — cores, memory controllers, PCIe/CXL root complexes, socket-to-socket links.
4. **Platform layer** — motherboard/HPM, DIMM topology, risers, storage backplane, NIC/accelerator slots, BMC, PSU, thermal solution.
5. **System/software layer** — UEFI/ACPI, OS/hypervisor, drivers, scheduler, NUMA policy, management and telemetry.

## 3. Canonical server resource axes

| Axis | What it means | Typical mistake |
|---|---|---|
| Compute | cores, threads, frequency, IPC, cache, vector/crypto | treating GHz or core count as capacity |
| Memory capacity | addressable/installed DRAM/CXL memory | assuming more GB always improves performance |
| Memory bandwidth | channels × data rate × effective utilization | under-populating channels |
| Locality | CPU↔memory↔PCIe proximity | ignoring NUMA placement |
| I/O | PCIe/CXL lanes, generation, bifurcation, root complexes | counting slots instead of lanes |
| Storage | boot/local NVMe/SAS/SATA design | confusing NVMe protocol with form factor |
| Network | NIC bandwidth, queues, offloads, OOB | attaching high-speed NIC to constrained root path |
| Power | PSU, CPU power, DIMMs, drives, accelerators | using CPU TDP as whole-server power |
| Thermal | airflow/liquid interface, fan power, inlet limits | selecting dense config without thermal validation |
| RAS | error detection/correction/recovery/serviceability | equating ECC with enterprise RAS |
| Management | BMC, Redfish, PLDM/MCTP, telemetry | treating management as optional GUI |
| Security | Secure Boot, TPM, SPDM, firmware resilience | securing OS but not platform firmware |
| Lifecycle | firmware matrix, parts, support, replacement | buying peak spec with weak long-term operability |

## 4. Canonical distinctions that must remain explicit

`x86 ISA ≠ CPU microarchitecture ≠ server platform`

`CORE ≠ THREAD ≠ vCPU`

`SOCKET ≠ NUMA NODE`

`MEMORY CAPACITY ≠ MEMORY BANDWIDTH`

`ECC ENABLED ≠ COMPLETE RAS`

`PCIe SLOT COUNT ≠ USABLE PCIe BANDWIDTH`

`PCIe SPEC VERSION ≠ NEGOTIATED DEVICE LINK`

`NVMe ≠ FORM FACTOR`

`NVMe over PCIe ≠ NVMe-oF`

`BMC ≠ UEFI/BIOS`

`SECURE BOOT ≠ COMPLETE FIRMWARE RESILIENCE`

`DUAL PSU ≠ END-TO-END A/B POWER`

`HOT-SWAP ≠ NO-SERVICE-IMPACT`

`1U/2U ≠ PERFORMANCE CLASS`

`HARDWARE SUPPORT ≠ VALIDATED OS/HYPERVISOR SUPPORT`

---

# PART II — CPU architecture and topology

## 5. Core
A physical execution core. Modern server CPUs may expose many cores in one package; core architecture and per-core behavior vary by generation.

## 6. Hardware thread / SMT
A logical execution context sharing physical core resources. SMT can improve throughput for suitable workloads but must not be counted as an independent physical core.

## 7. vCPU
A hypervisor scheduling abstraction. vCPU count is a virtualization design parameter and is not equal to physical core count or hardware-thread count.

## 8. Frequency
Base/max/turbo/boost values are operating points, not guaranteed sustained all-core application frequency. Power, temperature, instruction mix and firmware policy affect realized frequency.

## 9. IPC
Instructions per cycle is microarchitecture- and workload-dependent. Comparing GHz across different CPU generations without IPC and workload context is misleading.

## 10. Cache hierarchy
L1/L2/L3 caches reduce DRAM access pressure. Cache size alone does not predict performance; sharing topology, latency, bandwidth and workload working set matter.

## 11. Vector and matrix capability
Modern x86 CPUs expose vector and specialized arithmetic extensions. These can materially change analytics, compression, encryption, media, AI preprocessing and HPC behavior. Deep accelerator analysis belongs to DC-K09.

## 12. Socket
A processor package/interface position. Server platforms may be 1-socket or multi-socket.

## 13. Single-socket architecture
A 1P server can eliminate inter-socket NUMA traffic, simplify locality, reduce power and sometimes reduce per-socket/per-core software licensing exposure.

## 14. Dual-socket architecture
A 2P server can increase aggregate core count, memory channels/capacity and I/O, but introduces inter-socket topology and stronger NUMA sensitivity.

## 15. Socket-to-socket links
Inter-socket fabrics provide coherent access to remote memory/I/O. Remote access is valid but generally has different latency/bandwidth behavior than local access.

## 16. 1S vs 2S decision principle

**DECISION GUIDANCE:** Do not select 2S only because it is “more enterprise.” Select it when the workload requires capacity, memory, I/O, consolidation or resilience features that justify the NUMA, power, cost and licensing implications.

## 17. Dense-core vs performance-core designs
Current server product families can expose different core-density/per-core-performance tradeoffs. This is a workload-selection issue, not a universal hierarchy.

## 18. Example — current AMD server platform

**VENDOR CLAIM / EXAMPLE:** AMD’s EPYC 9005 architecture documentation describes up to twelve DDR5 memory controllers, up to 128 PCIe Gen5 lanes in 1P designs, and configurable CXL 2.0 connectivity. [R5]

This is an example of a current platform capability, not an x86 requirement.

## 19. Example — current Intel server platform

**VENDOR CLAIM / EXAMPLE:** Intel’s Xeon 6 product brief describes up to twelve memory channels and PCIe 5.0 lane configurations, including large aggregate I/O budgets in 1P/2P systems. [R7]

This is an example, not a cross-vendor baseline.

---

# PART III — NUMA and locality

## 20. NUMA definition
Non-Uniform Memory Access means memory-access characteristics depend on locality. Linux exposes explicit NUMA memory-policy mechanisms. [R3]

## 21. Local memory
Memory attached to the local NUMA domain of the executing CPU/core.

## 22. Remote memory
Memory reached through another locality domain/interconnect.

## 23. NUMA node is not always one socket
CPU package topology, chiplet design, firmware configuration and OS presentation can create locality structures that do not map one-to-one to sockets.

## 24. NUMA and PCIe
NICs, GPUs, NVMe devices and other PCIe endpoints attach to specific root complexes. Device locality relative to CPU/memory affects high-throughput workloads.

## 25. NUMA and virtualization
Hypervisor CPU pinning, memory placement and device assignment should preserve locality for latency/bandwidth-sensitive VMs.

## 26. NUMA and databases
Large database/analytics engines may be sensitive to remote memory and memory-channel balance. CPU count without locality-aware memory population can produce poor scaling.

## 27. NUMA and storage/network I/O
High-rate NIC/NVMe traffic can create cross-socket traffic if queues, interrupts, memory buffers and application threads are placed on a remote domain.

## 28. NUMA validation checklist

- OS-visible node count
- CPU/core membership per node
- installed memory per node
- PCIe endpoint/root-complex locality
- NIC queue/IRQ affinity
- storage controller/NVMe locality
- VM/pod CPU and memory pinning where applicable
- accelerator locality

## 29. NUMA anti-pattern
“Two CPUs installed and all DIMM slots filled” is not a topology validation.

---

# PART IV — Memory subsystem

## 30. Memory capacity
Total usable DRAM/CXL memory available to the platform after firmware/hardware reservations.

## 31. Memory channel
An independent memory-controller path. Channel count is a major determinant of theoretical memory bandwidth.

## 32. DIMM-per-channel (DPC)
Memory topology can support one or more DIMMs per channel depending on platform. Higher DPC may improve capacity but can change supported data rate/latency/thermal behavior.

## 33. Memory population balance
Balanced population across active channels is often required to extract intended bandwidth.

## 34. Capacity vs bandwidth
A server with very large RAM but partially populated channels can have more capacity and less bandwidth than a smaller but fully channel-balanced configuration.

## 35. Vendor example — channel utilization

**VENDOR GUIDANCE:** AMD’s EPYC 9005 memory-population guide explicitly distinguishes memory-bandwidth-intensive workloads from workloads that can perform well with fewer populated channels. [R6]

**SPECBRIDGE INTERPRETATION:** DIMM population is a workload decision, not merely a capacity arithmetic exercise.

## 36. RDIMM
Registered DIMMs are common server memory modules. Platform compatibility must be verified against CPU/OEM memory rules.

## 37. 3DS RDIMM
Three-dimensional stacked/registered designs can increase capacity; capacity, speed, thermal and platform-support limits remain model-specific.

## 38. MRDIMM
Some current server platforms support multiplexer-combined DIMM technologies for higher bandwidth. This is a platform-specific capability, not generic DDR5 behavior. Intel Xeon 6 documentation provides a current example. [R7]

## 39. ECC
ECC memory detects/corrects certain memory errors. It is foundational for servers but should not be used as shorthand for all memory RAS behavior.

## 40. Corrected vs uncorrected errors
Linux EDAC distinguishes corrected and uncorrected memory-controller events. [R4]

## 41. RAS beyond ECC
Potential platform features include patrol scrubbing, demand scrubbing, memory sparing, mirroring, poison handling, retry, page retirement and advanced device correction. Actual support must be validated per CPU, OEM and firmware.

## 42. Memory speed labels
A DIMM transfer-rate label is not the same as application-level sustained bandwidth.

## 43. Memory latency
Latency is affected by locality, DIMM topology, controller behavior, frequency and workload access patterns.

## 44. Memory oversizing risk
Excess unused memory increases CAPEX and power without necessarily improving performance; undersizing creates paging, consolidation limits or application failure.

## 45. Memory performance decision

`WORKING SET → CAPACITY → CHANNEL COUNT → DPC → DATA RATE → NUMA PLACEMENT → RAS POLICY → BENCHMARK`

---

# PART V — PCI Express and I/O architecture

## 46. PCIe is the server I/O spine
PCIe connects NICs, NVMe, accelerators, HBAs, DPUs and other devices to CPU root complexes.

## 47. Lane
A PCIe lane is a bidirectional serial link building block. Devices use link widths such as x1/x4/x8/x16.

## 48. Generation
PCIe generations raise signaling/data capability. PCI-SIG released PCIe Base Specification 7.0 in June 2025; the specification is a technology standard, not proof that 2026 server platforms ship PCIe 7.0. [R8]

## 49. Current-standard vs deployed-platform rule

**FACT:** PCIe 7.0 is a current PCI-SIG specification. [R8]

**VENDOR EXAMPLE:** Current AMD EPYC 9005 and Intel Xeon 6 platform materials describe PCIe 5.0 host connectivity. [R5][R7]

**DECISION GUIDANCE:** Procurement must state actual CPU/platform/device link capability, not “latest PCIe standard available.”

## 50. Link negotiation
A PCIe endpoint operates at the highest mutually supported and correctly trained speed/width. Slot mechanics do not guarantee electrical width.

## 51. Bifurcation
A wide root port can be divided into smaller links if CPU/board/firmware support it. This matters for multi-NVMe carrier cards and dense I/O designs.

## 52. Root complex
The CPU/platform endpoint that originates PCIe hierarchy. Root-complex placement determines NUMA locality.

## 53. PCIe switches
Switches expand fan-out but introduce topology, oversubscription, latency, management and failure-domain considerations.

## 54. Riser
A riser changes physical presentation of CPU lanes. A physical slot inventory should be tied to actual lane source, width and generation.

## 55. I/O lane budget

| Consumer | Typical link need | Architecture question |
|---|---:|---|
| boot M.2/NVMe | x4 class | shared lanes or dedicated? |
| front NVMe SSD | x4 per device | direct attach or switch/backplane? |
| NIC | x8/x16 class depending speed/device | which NUMA root? |
| HBA/RAID | x8/x16 | SAS/SATA drive count and queueing? |
| GPU/accelerator | often x16 class | direct CPU, switch or fabric? |
| DPU/SmartNIC | x16 class | host/offload/control-plane design? |
| CXL memory/device | platform-dependent | CPU/firmware/OS validation? |

Values are illustrative device classes, not universal requirements.

## 56. Slot-count trap
A chassis with many slots can still have a constrained electrical lane budget or oversubscribed switch topology.

## 57. Gen mismatch
A newer device in an older slot generally negotiates to a common supported generation; purchasing a faster device does not create a faster root path.

## 58. Width mismatch
An x16 mechanical slot can be electrically x8 or x4. BoQ must capture electrical width.

## 59. I/O decision chain

`ENDPOINTS → REQUIRED BANDWIDTH → LANE WIDTH → PCIe GEN → ROOT COMPLEX → NUMA LOCALITY → SWITCH/BIFURCATION → SLOT/RISER → POWER/THERMAL → FIRMWARE/DRIVER`

---

# PART VI — CXL boundary

## 60. What CXL is
Compute Express Link adds coherent interconnect semantics on PCIe-based infrastructure for memory/accelerator use cases.

## 61. CXL is not “faster PCIe”
It introduces coherent memory/cache semantics and fabric capabilities; use cases differ from ordinary PCIe device I/O.

## 62. Current specification state
CXL Consortium released CXL 4.0 in November 2025. [R9]

## 63. CXL 3.2 context
CXL 3.2 added memory-device management/security/functionality enhancements and backward-compatible evolution. [R10]

## 64. Platform support boundary
A server may advertise a CPU generation with some CXL capability while supporting only particular device types, lane groups, firmware modes or OS combinations.

## 65. CXL end-to-end validation

`CPU ROOT → BOARD ROUTING → SLOT/CONNECTOR → DEVICE → BIOS/UEFI → ACPI TABLES → OS/HYPERVISOR → DRIVER/MANAGER → RAS/SECURITY → APPLICATION`

## 66. CXL memory expansion
Can extend memory capacity, but latency/bandwidth/locality and software tiering policy must be evaluated; it is not automatically equivalent to local DDR.

## 67. CXL pooling/composability
Fabric/pooling capabilities are architecture-level features and require compatible switches, devices, management and software.

## 68. CXL procurement rule
Never specify only “CXL supported.” Specify version/features, device class, ports/lanes, validated devices, BIOS/OS support and management expectations.

---

# PART VII — Local storage and boot

## 69. NVMe is a protocol family
NVM Express defines host communication with non-volatile memory over transports including PCIe, RDMA and TCP. The current Base Specification is Revision 2.4, ratified July 31, 2026. [R11][R28]

## 70. NVMe over PCIe
Local NVMe SSDs commonly attach through PCIe. The current NVMe over PCIe Transport Specification is Revision 1.4. [R12]

## 71. NVMe is not M.2
M.2 is a physical form factor. NVMe devices also exist in U.2/U.3, EDSFF and add-in-card forms.

## 72. SAS/SATA vs NVMe
Protocol choice should follow workload, endurance, serviceability, cost, controller design and software stack—not fashion.

## 73. Boot device role
Boot media should be designed around recoverability and operating model, not simply maximum speed.

## 74. Mirrored boot
Mirrored boot devices can reduce single-device boot failure risk, but controller/firmware/backplane common modes must still be considered.

## 75. Local data vs external storage
A compute node may use local NVMe for OS/cache/data or rely on SAN/NAS/distributed storage. This changes PCIe, network and failure-domain requirements.

## 76. RAID controller
Hardware RAID/HBA design can be appropriate for SAS/SATA/local RAID workloads; software-defined storage may prefer direct-drive visibility.

## 77. HBA
An HBA exposes drives with less abstraction than a traditional hardware RAID controller. Actual modes and features are vendor-specific.

## 78. NVMe hot-plug
Hot-plug capability depends on drive form factor, backplane, PCIe topology, firmware, OS and service procedure.

## 79. Storage endurance
Capacity is not enough. Endurance class, DWPD/TBW, latency consistency, PLP and telemetry matter for write-heavy workloads.

## 80. Local-storage decision matrix

| Use case | Preferred pattern | Main validation |
|---|---|---|
| stateless compute | small mirrored/recoverable boot | rebuild automation |
| virtualization host | boot + external/shared storage or local HCI | controller/HCI support matrix |
| database | workload-specific local NVMe or external array | latency/endurance/HA |
| HCI | direct-attached drives per HCI HCL | drive/controller/firmware exact match |
| cache/scratch | high-throughput local NVMe | endurance + lane budget |
| edge | local resilient storage | remote recovery + environmental limits |

---

# PART VIII — Network and host I/O

## 81. NIC as a PCIe endpoint
NIC bandwidth is constrained by PCIe generation/width and root-complex topology as well as network link speed.

## 82. Data-plane NIC
Carries production/workload traffic.

## 83. OOB management NIC
Provides BMC out-of-band management path; it should not be assumed to share the same trust or availability model as production data traffic.

## 84. Shared LOM/NCSI
Some platforms can share physical NIC resources between host and BMC using management sideband technologies. This affects failure and security domains.

## 85. Multi-NIC redundancy
Two NIC ports do not guarantee path diversity if they share one adapter, one PCIe root, one riser, one switch ASIC, one cable bundle or one upstream switch.

## 86. NIC NUMA locality
High packet-rate workloads should align queues/interrupts/application threads with the NIC’s local NUMA domain where practical.

## 87. Offloads
Checksum, segmentation, RDMA, crypto and virtualization offloads can shift CPU consumption; exact value is workload- and driver-dependent.

## 88. DPU/SmartNIC boundary
DPUs/SmartNICs are accelerator/offload platforms and belong in deeper analysis in DC-K09/DC-K24. K08 records only their host-server dependencies: PCIe lanes, power, cooling, firmware, security and management.

---

# PART IX — Firmware, boot and hardware description

## 89. UEFI
UEFI defines modern firmware interfaces, boot services/runtime services and Secure Boot mechanisms. Current UEFI specification: 2.11. [R13]

## 90. ACPI
ACPI communicates platform configuration, power-management and hardware description information to the OS. Current specification: 6.6. [R14]

## 91. SMBIOS
SMBIOS standardizes firmware-exposed platform inventory structures. Current DMTF release: 3.9.0. [R17]

## 92. Firmware is a compatibility matrix
CPU microcode, UEFI/BIOS, BMC, NIC firmware, storage firmware, drive firmware and accelerator firmware can jointly affect stability and supportability.

## 93. Secure Boot
UEFI Secure Boot validates executable trust relationships during boot, but it does not by itself provide complete firmware protection/detection/recovery. [R13][R22]

## 94. Firmware update policy
Firmware updates require compatibility testing, maintenance windows, rollback/recovery plans and inventory control.

## 95. Option ROM / device firmware
PCIe devices can carry privileged firmware/boot components. Platform security must include these components, not only motherboard BIOS.

## 96. NIST firmware resiliency model
NIST SP 800-193 frames platform firmware resilience around **Protection, Detection, Recovery**. [R22]

---

# PART X — BMC and management plane

## 97. BMC definition
A Baseboard Management Controller provides out-of-band platform management independent of the host OS state.

## 98. BMC is not BIOS
BMC manages/observes platform hardware; UEFI/BIOS initializes the host and participates in boot/runtime firmware interfaces.

## 99. Redfish
DMTF Redfish provides standardized RESTful management for servers and other infrastructure. Current Redfish Specification: 1.23.1; Data Model release: 2025.4. [R15][R16]

## 100. MCTP
DMTF MCTP provides transport for management-controller/device communications independent of specific underlying physical binding. [R18]

## 101. PLDM
PLDM specifications cover platform monitoring/control, firmware update and related management functions. [R19]

## 102. SPDM
DMTF SPDM provides security protocol/data-model mechanisms for authentication, measurement and secure device communication. Current SPDM 1.4.0 was published in 2025. [R20]

## 103. BMC security boundary
BMC has privileged hardware access and must be treated as a security-sensitive management endpoint.

## 104. BMC network design

- dedicated management VLAN/VRF where appropriate
- strong authentication/authorization
- certificate lifecycle
- API/Redfish governance
- firmware lifecycle
- logging/telemetry
- restricted Internet reachability
- break-glass procedure

## 105. Fleet automation
At scale, Redfish/standard APIs are more important than a vendor GUI because repeatability, inventory and policy enforcement matter.

## 106. OCP management modularity
OCP DC-SCM and MHS work aim to modularize/interoperate server-management and host-processor building blocks. [R23][R24][R26]

---

# PART XI — Platform trust and security

## 107. TPM
TCG TPM 2.0 provides a standardized trusted-platform capability used for measurements, keys and attestation-related workflows. Current TPM 2.0 Library Version 185 was published in March 2026. [R21]

## 108. Root of trust
A root of trust may be implemented in CPU/platform/controller silicon depending on vendor/platform. Procurement must identify what is measured, verified, update-protected and recoverable.

## 109. Measured Boot
Measured boot records measurements into a trust architecture; it is distinct from Secure Boot enforcement.

## 110. Attestation
Attestation uses trustworthy measurements/identities to prove platform state to a verifier. Platform support and operational integration are separate requirements.

## 111. SPDM device trust
SPDM can support authentication/measurements for components; implementation support must be verified per device/platform. [R20]

## 112. Firmware recovery
Security architecture should include a credible recovery path when firmware integrity is compromised, aligning with NIST’s protection/detection/recovery model. [R22]

## 113. Supply-chain trust
Serial/inventory, firmware provenance, approved component lists and update sources should be governed through lifecycle.

## 114. Security anti-pattern
“TPM installed + Secure Boot enabled” is not a complete server-platform security architecture.

---

# PART XII — RAS: Reliability, Availability, Serviceability

## 115. Reliability
Probability that components/system operate correctly over time under defined conditions.

## 116. Availability
Ability of the service/system to be usable when required. Availability depends on architecture above and below the server node.

## 117. Serviceability
Ability to diagnose, maintain and replace components safely and efficiently.

## 118. Memory RAS
ECC plus platform-specific correction, scrubbing, sparing/mirroring, error containment and reporting.

## 119. CPU RAS
Machine-check/error reporting, retry/containment and platform-specific processor RAS features.

## 120. PCIe RAS
PCIe Advanced Error Reporting and platform firmware/OS error-handling mechanisms can report/recover certain I/O faults; support varies.

## 121. Error record persistence
UEFI defines hardware error record mechanisms including processor, memory, PCIe and CXL error sections. [R13]

## 122. Telemetry without action is not RAS
Corrected-error counters must feed thresholds, ticketing and replacement policy.

## 123. Hot-swap
Hot-swap describes replacement while powered/running under supported conditions. It does not mean the workload is unaffected.

## 124. Redundant fan/PSU
Component redundancy is valuable but must be analyzed for shared control, backplane, power-distribution and environmental failure domains.

## 125. Server as a failure domain
Cluster/service architecture should assume whole-node loss can occur. Node-level RAS does not eliminate the need for application/infrastructure redundancy.

---

# PART XIII — Power and thermal architecture

## 126. CPU power is not server power
Whole-server power includes CPU(s), memory, NICs, drives, accelerators, fans, BMC, motherboard conversion and PSU losses.

## 127. TDP/power rating boundary
Processor power metrics are product-specific design/operating parameters and should not be used as a direct facility power estimate.

## 128. PSU rating
Nameplate PSU wattage is maximum capability, not continuous server consumption.

## 129. Redundant PSU mode
1+1 PSU designs may share load during normal operation and carry full load after one PSU/feed failure; actual behavior depends on platform and power policy.

## 130. Dual-cord server
A dual-cord server can connect to A/B rack PDUs, but internal PSU/backplane topology and upstream facility paths still require validation.

## 131. Fan power
Dense high-resistance configurations can materially increase fan power. Performance-per-server must be evaluated with facility energy and acoustics/thermal limits where relevant.

## 132. Air cooling
Most general-purpose x86 servers remain air-cooled, but inlet/airflow requirements depend on configuration.

## 133. Liquid-ready host
High-power CPUs/accelerators can drive direct-to-chip or other liquid-cooling requirements. Server support must align with facility FWS/TCS/CDU architecture. Deep cooling analysis remains DC-K05.

## 134. Thermal derating
High ambient temperature, altitude, blocked airflow or dense component population can trigger fan increase or performance throttling.

## 135. Power/thermal decision chain

`CONFIG BOM → MAX/EXPECTED NODE POWER → FAN/COOLING MODE → PSU REDUNDANCY → A/B FEEDS → RACK POWER → HEAT LOAD → INLET LIMITS → DEGRADED STATE → VALIDATION`

---

# PART XIV — Chassis and physical server architecture

## 136. 1U rack server
Optimizes rack density but can constrain fan diameter, heatsink volume, drive/PCIe layout and acoustic/thermal headroom.

## 137. 2U rack server
Provides more internal volume for drives, risers, accelerators and thermal solution. It is not inherently faster or more reliable.

## 138. Multi-node chassis
Several server nodes can share a chassis/power/cooling infrastructure. This improves density but creates shared chassis failure/service domains that must be modeled.

## 139. Blade architecture
Blade systems centralize enclosure resources and management. They can simplify operations but introduce enclosure/fabric dependencies and vendor platform coupling.

## 140. OCP/MHS approach
OCP MHS aims for consistent modular interfaces/form factors among data-center/edge/enterprise building blocks. [R23][R24]

## 141. Open Rack
OCP Open Rack defines a different rack/power ecosystem from conventional 19-inch-only assumptions, including 48V-class rack power implementations. [R25]

## 142. Chassis selection principle
Choose chassis based on device count, lane topology, serviceability, thermal headroom, PSU design, cable management and rack integration—not only rack-unit density.

---

# PART XV — Current standards snapshot vs shipping reality

## 143. Current standards snapshot — September 2026

| Domain | Current published standard/reference | Source |
|---|---|---|
| x86-64 AMD architecture | AMD64 APM current 2026 revisions | [R1] |
| Intel x86 architecture | Intel 64 / IA-32 SDM updated Aug 2026 | [R2] |
| PCIe | PCI Express Base Spec 7.0 | [R8] |
| CXL | CXL 4.0 released Nov 2025 | [R9] |
| NVMe Base | NVMe 2.4 ratified Jul 2026 | [R11] |
| NVMe/PCIe transport | Rev 1.4 ratified Jul 2026 | [R12] |
| UEFI | 2.11 | [R13] |
| ACPI | 6.6 | [R14] |
| Redfish | 1.23.1 | [R15] |
| Redfish Data Model | 2025.4 | [R16] |
| SMBIOS | 3.9.0 | [R17] |
| MCTP | 1.3.3 | [R18] |
| SPDM | 1.4.0 | [R20] |
| TPM 2.0 Library | Version 185 | [R21] |

## 144. Standards-release trap

**DECISION GUIDANCE:** The newest published standard should inform roadmap compatibility, but an RFP/BoQ must state the exact capability of the selected CPU, board, firmware, riser/backplane, device and supported OS/hypervisor combination.

---

# PART XVI — Workload decision model

## 145. General enterprise virtualization
Primary variables: core density, memory capacity, memory bandwidth, NUMA, NIC/storage I/O, software licensing, VM density and failure-domain size.

## 146. Database
Primary variables: per-core performance, memory latency/bandwidth, local/remote NUMA, storage latency/endurance, licensing and HA architecture.

## 147. Web/application tier
Often scales horizontally; may benefit from simpler 1S designs and high node count rather than maximum 2S node size.

## 148. In-memory analytics
Memory capacity and bandwidth/locality can dominate; channel population must be explicit.

## 149. HCI
Requires exact compatibility among CPU, memory, NIC, storage controller/NVMe, drive firmware and HCI software HCL. “Generic server” is not enough.

## 150. Software-defined storage
Drive visibility, PCIe/NVMe topology, NIC bandwidth, NUMA and CPU cycles for data services all matter.

## 151. HPC CPU compute
Vector capability, memory bandwidth, NUMA and fabric/NIC locality matter; benchmark on representative kernels.

## 152. AI host server
The x86 host provides boot/control/data orchestration for accelerators; CPU, memory and PCIe/CXL topology must match accelerator/NIC/storage paths. Deep accelerator/network analysis is deferred to DC-K09/DC-K24.

## 153. Edge server
Environmental limits, remote management, serviceability, storage resilience and lifecycle support can matter more than maximum density.

## 154. Telco/NFV
Core isolation, NUMA, NIC offloads, timing and deterministic operational requirements can matter; architecture must be workload-profiled.

## 155. Workload decision matrix

| Workload | CPU priority | Memory priority | I/O priority | Typical architecture concern |
|---|---|---|---|---|
| virtualization | core density + efficiency | capacity + balanced channels | NIC/storage | VM density vs failure-domain size |
| database | per-core + cache | latency/capacity/bandwidth | storage | licensing + NUMA |
| web/app | efficiency | moderate | network | horizontal scale |
| in-memory | compute + locality | very high capacity/bandwidth | moderate | channel/NUMA balance |
| HCI | balanced | high | very high storage/network | exact HCL/topology |
| SDS | balanced | cache-dependent | very high NVMe/network | lane/root locality |
| HPC CPU | vector/per-core/cores | bandwidth | fabric | benchmark and locality |
| AI host | control + preprocessing | host memory | extreme PCIe/NIC | accelerator topology |
| edge | right-sized | right-sized | workload-specific | remote ops/environment |

---

# PART XVII — 1-socket vs 2-socket decision matrix

## 156. Comparison

| Criterion | 1S | 2S |
|---|---|---|
| topology simplicity | higher | lower |
| inter-socket NUMA | none | present |
| max aggregate cores | platform-dependent, often lower | often higher |
| max aggregate memory channels | platform-dependent | often higher |
| max aggregate memory capacity | platform-dependent | often higher |
| aggregate PCIe lanes | may be sufficient/high | may be higher |
| power | generally lower | generally higher |
| software licensing | can be advantageous | can be expensive for per-core/socket models |
| failure-domain size | smaller node possible | larger node possible |
| workload fit | scale-out, many enterprise roles | high-consolidation/memory/I/O roles |

No row is universal; actual CPU generation and OEM platform determine limits.

## 157. 1S preference signals

- workload scales horizontally
- latency/locality simplicity is valuable
- per-core/socket licensing is expensive
- one socket already supplies needed memory/I/O
- power/rack density favors more smaller nodes

## 158. 2S preference signals

- very high memory capacity/bandwidth requirement
- consolidation requires more cores per node
- I/O/accelerator topology needs aggregate resources
- application is validated and tuned for NUMA
- node-count reduction has operational value

---

# PART XVIII — Server performance model

## 159. Balanced server equation

`USABLE PERFORMANCE = f(CPU, CACHE, MEMORY BW, MEMORY LATENCY, NUMA, I/O, STORAGE, NETWORK, POWER, THERMAL, SOFTWARE)`

## 160. Bottleneck migration
Increasing one resource can move the bottleneck elsewhere. More CPU cores can expose memory-bandwidth or storage/network limits.

## 161. Benchmark requirement
Use workload-representative benchmarks, not only synthetic CPU scores.

## 162. Steady-state requirement
Short benchmark bursts can hide thermal/power throttling and queue saturation. Validate steady-state behavior.

## 163. Degraded-state performance
Measure expected behavior after PSU/fan/path/device failure where SLA depends on it.

## 164. Virtualization overcommit
vCPU and memory overcommit are workload/latency policy decisions; they should not be derived mechanically from hardware thread count.

---

# PART XIX — Software licensing and economic architecture

## 165. Per-core licensing
Some commercial software licenses by physical core. High-core-count CPUs can increase software cost far beyond hardware savings.

## 166. Per-socket licensing
Legacy licensing models can influence 1S/2S economics.

## 167. Host-count licensing
Some platforms license per host/node, which can favor larger consolidation nodes.

## 168. Subscription/support
Firmware entitlement, support tier, remote management licenses and extended lifecycle options belong in TCO.

## 169. Stranded capacity
Unused cores, RAM, PCIe lanes or drive bays are capital tied to a node. Modular growth and workload placement can reduce stranded capacity.

## 170. TCO equation

`SERVER TCO = HARDWARE + SOFTWARE LICENSE + SUPPORT + POWER + COOLING + RACK/PORTS + SPARES + OPERATIONS + DOWNTIME/RISK + REFRESH/MIGRATION`

---

# PART XX — Failure-mode analysis

## 171. F1 — Core-rich / memory-starved server
**Symptom:** high core utilization cannot be sustained; memory bandwidth bottleneck.  
**Cause:** insufficient channel population or locality.  
**Control:** channel-balanced configuration + workload benchmark.

## 172. F2 — Capacity-rich / channel-poor memory design
Large DIMMs chosen to minimize DIMM count, leaving channels idle.  
**Control:** size capacity and bandwidth independently.

## 173. F3 — Dual-socket NUMA penalty
Application/VM memory placed remotely or NIC/NVMe attached to the other socket.  
**Control:** topology-aware placement and validation.

## 174. F4 — PCIe lane exhaustion
GPU/NIC/NVMe plan exceeds direct lane budget.  
**Control:** explicit lane/root/switch map before BoQ freeze.

## 175. F5 — Mechanical slot assumption
x16 mechanical slot is electrically narrower or routed through shared switch.  
**Control:** board/riser electrical topology evidence.

## 176. F6 — NVMe protocol/form-factor confusion
Wrong backplane/connector/drive compatibility.  
**Control:** specify protocol + form factor + interface + hot-plug support.

## 177. F7 — CXL checkbox procurement
CPU says CXL capable but selected slot/device/BIOS/OS combination is unsupported.  
**Control:** end-to-end validated support matrix.

## 178. F8 — Dual PSU false resilience
Both PSUs fed from same rack PDU or shared internal upstream path.  
**Control:** trace facility-to-board A/B path.

## 179. F9 — Firmware mismatch
BIOS/BMC/NIC/storage firmware combination creates instability or unsupported state.  
**Control:** golden firmware baseline + controlled update process.

## 180. F10 — BMC exposed as ordinary IT endpoint
Management plane compromised.  
**Control:** isolated OOB design, strong identity, patching and audit.

## 181. F11 — ECC complacency
Corrected-error rate rises but no operational action occurs.  
**Control:** telemetry thresholds and proactive DIMM replacement policy.

## 182. F12 — 1U thermal over-density
Maximum CPU/NIC/NVMe configuration forces high fan power or throttling.  
**Control:** OEM thermal matrix + steady-state test.

## 183. F13 — Software-license shock
Hardware optimization increases licensed core count and total project cost.  
**Control:** workload/software commercial model before CPU SKU freeze.

## 184. F14 — Hot-swap assumption
Drive/PSU/fan is physically hot-swappable but workload lacks redundancy.  
**Control:** separate component serviceability from service availability.

## 185. F15 — Oversized failure domain
Very large 2S host consolidates too many VMs/services.  
**Control:** include node-loss blast radius in sizing.

## 186. F16 — Unsupported memory population
DIMM mix violates OEM/CPU rules or reduces supported speed.  
**Control:** exact memory population matrix in BoQ acceptance.

## 187. F17 — High-speed NIC on remote/constrained root
Network cannot reach intended throughput/latency.  
**Control:** PCIe width/gen + NUMA affinity validation.

## 188. F18 — Storage endurance mismatch
Read-intensive SSD class used for sustained write workload.  
**Control:** endurance/latency consistency specification.

## 189. F19 — Firmware security without recovery
Signed firmware exists but recovery path is weak.  
**Control:** NIST protection/detection/recovery model. [R22]

## 190. F20 — “Latest standard” mismatch
RFP asks PCIe 7/CXL 4 without shipping platform need/support.  
**Control:** distinguish roadmap requirement from current deployment requirement.

---

# PART XXI — Risk matrix

## 191. Risk matrix

| Risk | Probability | Impact | Detection | Primary control |
|---|---|---|---|---|
| CPU/memory imbalance | Medium | High | workload benchmark | channel-aware sizing |
| NUMA misplacement | Medium | High | topology/perf telemetry | affinity/locality policy |
| PCIe oversubscription | Medium | High | topology review | lane-budget map |
| firmware incompatibility | Medium | High | validation/staging | golden firmware matrix |
| BMC compromise | Low/Med | Very High | security monitoring | isolated OOB + identity |
| DIMM error growth | Medium | Medium/High | EDAC/BMC telemetry | proactive RAS policy |
| PSU/feed common mode | Medium | High | physical trace | true A/B feed audit |
| thermal throttling | Medium | High | telemetry/benchmark | OEM thermal config + test |
| SSD endurance shortfall | Medium | High | SMART/NVMe telemetry | workload endurance sizing |
| CXL support mismatch | Medium | Medium/High | compatibility matrix | end-to-end validation |
| software-license overspend | Medium | Very High | commercial model | architecture + licensing co-design |
| oversized node blast radius | Medium | High | HA/FMEA review | failure-domain sizing |

---

# PART XXII — Procurement / BoQ canonical fields

## 192. CPU fields

- CPU vendor/family/generation
- exact processor SKU
- sockets installed / sockets supported
- physical cores per socket
- SMT state/policy
- base/max power/frequency fields required by OEM
- cache topology where material
- supported ISA extensions required by workload
- inter-socket link capability

## 193. Memory fields

- memory technology
- module type
- DIMM capacity
- quantity
- channels populated per socket
- DPC
- effective supported speed for exact population
- total capacity
- RAS mode/features required
- spare DIMM policy

## 194. PCIe/CXL fields

- CPU/platform PCIe generation
- total usable lanes
- per-slot electrical width/generation
- root-complex/NUMA mapping
- bifurcation support
- switch topology/oversubscription
- CXL version/features/ports if required
- validated device list

## 195. Storage fields

- boot device type/count/RAID or mirror design
- controller/HBA mode
- drive protocol
- form factor
- capacity
- endurance class
- PLP requirement
- hot-plug requirement
- backplane topology
- NVMe lane map

## 196. Network fields

- OCP/PCIe/mezzanine form factor
- port count/speed
- PCIe width/gen
- NUMA/root mapping
- offload/RDMA requirements
- optics/DAC separate BoQ relation
- OOB port architecture
- redundancy/failure-domain mapping

## 197. Management/security fields

- BMC controller/firmware baseline
- Redfish version/profile requirement
- remote console/media requirements
- TPM 2.0
- Secure Boot
- measured boot/attestation requirements
- root-of-trust/firmware recovery
- SPDM/device security requirements where applicable
- certificate/API governance

## 198. Power/thermal fields

- PSU quantity/rating/efficiency
- input voltage/cable/connector
- redundancy mode
- expected/max configured node power
- inlet/environmental limits
- fan/thermal option
- liquid-cooling kit/interface where needed

## 199. Physical/service fields

- chassis U/OU
- rack standard compatibility
- rail kit
- bezel/security option
- drive bay count/type
- risers
- cable-management arms if used
- hot-swap components
- field-replaceable units
- warranty/support SLA

## 200. Firmware/lifecycle fields

- supported OS/hypervisor/HCI HCL
- BIOS/BMC/NIC/storage firmware baseline
- update mechanism
- lifecycle support period
- spare strategy
- replacement compatibility
- EOL notice requirement

---

# PART XXIII — Architecture diagrams

## 201. Canonical x86 server anatomy

```text
                         ┌───────────────────────────────┐
                         │          BMC / OOB            │
                         │ Redfish · PLDM · MCTP · RoT  │
                         └──────────────┬────────────────┘
                                        │ management sideband
┌───────────────────────────────────────┴──────────────────────────────────────┐
│                               SERVER PLATFORM                               │
│                                                                              │
│  ┌──────────────────┐        coherent/socket link       ┌──────────────────┐ │
│  │ CPU SOCKET 0     │◄────────────────────────────────►│ CPU SOCKET 1     │ │
│  │ cores/cache      │                                  │ cores/cache      │ │
│  │ memory ctrl      │                                  │ memory ctrl      │ │
│  │ PCIe/CXL roots   │                                  │ PCIe/CXL roots   │ │
│  └──────┬─────┬─────┘                                  └─────┬─────┬──────┘ │
│         │     │                                              │     │        │
│      DDR5   PCIe/CXL                                      DDR5   PCIe/CXL    │
│         │     ├──────── NIC / DPU                            │     ├── NIC    │
│         │     ├──────── NVMe / HBA                           │     ├── NVMe   │
│         │     └──────── GPU / Accelerator                     │     └── CXL    │
│         │                                                    │              │
│  ┌──────▼────────────────────────────────────────────────────▼─────────────┐ │
│  │ UEFI / ACPI / SMBIOS · firmware · sensors · security · error records   │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│      PSUs → internal power distribution → CPU/DIMM/I/O/fans/BMC             │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 202. Resource-balance triangle

```text
                         COMPUTE
                       cores/cache
                          /\
                         /  \
                        /    \
                       /      \
             MEMORY  /________\  I/O
       capacity + BW + NUMA     PCIe/CXL + NIC/NVMe

             POWER / THERMAL / RAS / SECURITY
                 constrain all three corners
```

## 203. NUMA locality map

```text
             NUMA 0                                NUMA 1
      ┌─────────────────┐                   ┌─────────────────┐
      │ CPU0 cores      │                   │ CPU1 cores      │
      │ local DRAM      │                   │ local DRAM      │
      │ NIC0 / NVMe0    │                   │ NIC1 / NVMe1    │
      └────────┬────────┘                   └────────┬────────┘
               └──────── coherent interconnect ─────┘

LOCAL: CPU0 ↔ DRAM0 / NIC0 / NVMe0
REMOTE: CPU0 ↔ DRAM1 / NIC1 / NVMe1
```

## 204. I/O budget tree

```text
CPU PCIe/CXL ROOTS
├── x16 → GPU / accelerator
├── x16 → high-speed NIC / DPU
├── x16 → riser
│   ├── x8 → NIC/HBA
│   └── x8 → NIC/HBA
├── x16 → PCIe switch
│   ├── x4 → NVMe 1
│   ├── x4 → NVMe 2
│   ├── x4 → NVMe 3
│   └── x4 → NVMe 4
└── x16 → CXL / future expansion

Illustrative topology only; actual widths and generations are platform-specific.
```

## 205. Management and trust chain

```text
                 FLEET MANAGEMENT / AUTOMATION
                         │ Redfish API
                         ▼
                  ┌──────────────┐
                  │     BMC      │
                  └──────┬───────┘
         MCTP/PLDM/SPDM  │
     ┌───────────────────┼─────────────────────┐
     ▼                   ▼                     ▼
   BIOS/UEFI          NIC/NVMe FW          RoT / TPM
     │                   │                     │
     └────────────── platform trust ────────────┘
                         │
                  Secure/Measured Boot
                         │
                         ▼
                    OS / Hypervisor
```

---

# PART XXIV — Decision tree

## 206. Canonical server selection decision tree

```text
START
  │
  ├─ What is the workload and SLA?
  │
  ├─ Is scale-out acceptable?
  │      ├─ YES → test 1S economics/topology first
  │      └─ NO  → evaluate 2S capacity requirement
  │
  ├─ What is the working-set memory requirement?
  │      ├─ CAPACITY constrained → DIMM/CXL capacity model
  │      └─ BANDWIDTH constrained → channel/DPC/locality model
  │
  ├─ What devices consume PCIe/CXL lanes?
  │      └─ build exact root/lane/NUMA map
  │
  ├─ Is storage local, external, HCI or SDS?
  │      └─ define boot + data + endurance + controller topology
  │
  ├─ What NIC/fabric bandwidth is required?
  │      └─ validate PCIe width + NUMA + redundancy
  │
  ├─ What power/thermal envelope is available?
  │      └─ validate expected + degraded-state node power
  │
  ├─ What RAS/security/management controls are required?
  │      └─ BMC/Redfish + TPM/RoT + firmware resilience + telemetry
  │
  ├─ What software licenses dominate TCO?
  │      └─ recalculate CPU/socket/core architecture
  │
  ├─ Does exact OS/hypervisor/HCI HCL support the BOM?
  │      ├─ NO → reject/modify
  │      └─ YES
  │
  └─ Benchmark representative workload → Freeze BoQ
```

---

# PART XXV — Common mistakes

## 207. Mistake: “64 cores > 32 cores, therefore faster”
Wrong because workload scaling, frequency, cache, memory bandwidth and software licensing may reverse the result.

## 208. Mistake: “2 CPUs are more redundant”
Two sockets inside one server do not make the server an HA cluster.

## 209. Mistake: “All DIMM slots should be filled”
Population should follow capacity, bandwidth, platform rules and workload—not visual completeness.

## 210. Mistake: “More RAM always improves performance”
Only if capacity is the bottleneck or additional population improves bandwidth/locality without adverse tradeoffs.

## 211. Mistake: “PCIe 5 server means every slot is Gen5 x16”
Actual slot width/generation/routing must be documented.

## 212. Mistake: “NVMe = M.2”
Protocol and form factor are different taxonomy axes.

## 213. Mistake: “CXL 4.0 is current, so server must support CXL 4.0”
Standard publication and shipping platform capability are different timelines.

## 214. Mistake: “BMC network can share ordinary user LAN”
OOB management is a privileged control plane and should be architected accordingly.

## 215. Mistake: “Secure Boot means firmware is secure”
Platform firmware resilience also needs protection, detection and recovery controls.

## 216. Mistake: “Dual PSU means Tier-ready server power”
Server PSU redundancy does not prove rack/facility A/B path independence.

## 217. Mistake: “1U saves power”
1U saves rack space; actual power/fan efficiency depends on configuration and cooling conditions.

## 218. Mistake: “Hot-swap means no downtime”
The application/service must have redundancy and the replacement must be supported under live conditions.

---

# PART XXVI — Acceptance checklist

## 219. CPU/topology acceptance
- exact SKU and stepping/family recorded
- sockets/cores/threads verified
- NUMA topology captured
- required ISA extensions validated
- software-license model reviewed

## 220. Memory acceptance
- total capacity correct
- channel balance correct
- DPC/speed validated
- NUMA memory symmetric/asymmetric design intentional
- ECC/RAS mode validated

## 221. I/O acceptance
- every slot mapped to CPU/root complex
- electrical width/gen known
- lane budget closes
- riser/switch/bifurcation documented
- device NUMA locality known

## 222. Storage acceptance
- boot recovery defined
- drive protocol/form factor correct
- endurance/PLP correct
- hot-plug/backplane validated
- HCI/SDS HCL exact

## 223. Network acceptance
- NIC port/speed correct
- PCIe width/gen sufficient
- root/NUMA mapping correct
- redundancy path modeled
- OOB management path separate/controlled

## 224. Firmware/security acceptance
- UEFI/BMC baseline controlled
- Secure Boot policy defined
- TPM/RoT requirements met
- firmware update/recovery path tested
- Redfish/API security configured
- device firmware inventory captured

## 225. Power/thermal acceptance
- full BOM power estimate
- PSU redundancy/feed mapping
- rack power fit
- inlet/environment fit
- fan/thermal mode supported
- degraded-state operation considered

## 226. Lifecycle acceptance
- support/warranty SLA
- firmware support horizon
- spare parts
- replacement compatibility
- EOL/EOS process
- migration/refresh plan

---

# PART XXVII — Golden UI visual candidates

## 227. Visual 01 — Canonical x86 Server Anatomy
CPU socket(s), local memory, PCIe/CXL roots, NIC/NVMe/accelerator, UEFI/ACPI/SMBIOS, BMC and power/thermal boundary.

## 228. Visual 02 — NUMA Locality Map
CPU0/DRAM0/I/O0 vs CPU1/DRAM1/I/O1 with local and remote paths.

## 229. Visual 03 — CPU/Memory/I/O Balance Matrix
Shows why core count, memory capacity/bandwidth and lane budget must be sized together.

## 230. Visual 04 — Management & Platform Trust Chain
BMC → Redfish → MCTP/PLDM/SPDM → UEFI/device firmware → TPM/RoT → OS/hypervisor.

## 231. Optional Visual 05 — 1S vs 2S Decision Matrix
Locality, capacity, I/O, licensing, power and blast-radius comparison.

---

# PART XXVIII — Proposed Full Briefing structure

## 232. K08-00 — x86 server gerçekte nedir?
ISA, microarchitecture, processor package, platform and system-software layers.

## 233. K08-01 — Core, thread, socket, cache ve CPU topology
Core/thread/vCPU distinctions, 1S/2S and performance model.

## 234. K08-02 — Memory channels, DIMMs, ECC, RAS ve bandwidth
Capacity vs bandwidth, DPC, channel balance and RAS.

## 235. K08-03 — NUMA ve locality
CPU↔memory↔NIC↔NVMe locality, virtualization/database/HCI consequences.

## 236. K08-04 — PCIe, CXL ve I/O lane budget
Root complexes, lanes, bifurcation, switches, current standards vs shipping reality.

## 237. K08-05 — Boot, NVMe, local storage ve network interfaces
Protocol/form-factor separation, storage/endurance, NIC root-path design.

## 238. K08-06 — BMC, UEFI, Redfish, firmware ve platform security
Management planes, TPM/SPDM, Secure Boot and firmware resilience.

## 239. K08-07 — Power, thermal, serviceability, TCO ve hangi server ne zaman?
1U/2U, 1S/2S, licensing, failure modes, acceptance and BoQ freeze.

---

# PART XXIX — Golden decision rules

## 240. Rule 1
Never freeze a CPU SKU before workload, software licensing and memory/I/O requirements are known.

## 241. Rule 2
Never size memory only in GB/TB; record channels, DPC, effective speed and NUMA distribution.

## 242. Rule 3
Never accept a slot inventory without electrical width/gen/root-complex mapping.

## 243. Rule 4
Never call a design “CXL-ready” without CPU + board + firmware + OS + device validation.

## 244. Rule 5
Never treat NVMe as a physical connector/form factor.

## 245. Rule 6
Never place BMC/OOB management into the same governance model as ordinary workload traffic by default.

## 246. Rule 7
Never claim RAS from ECC alone.

## 247. Rule 8
Never claim power redundancy from PSU count alone.

## 248. Rule 9
Never optimize rack-U density without checking thermal headroom and serviceability.

## 249. Rule 10
Never approve a server BoQ without the exact firmware/HCL lifecycle state.

---

# PART XXX — Authoritative source register

## 250. Source register

### [R1] AMD — AMD64 Architecture Programmer’s Manual
**Class:** Primary architecture specification / vendor implementation of x86-64  
**Current reference:** AMD64 Architecture Programmer's Manual, 2026 revisions  
https://docs.amd.com/v/u/en-US/40332_4.09_APM_PUB  
**Use:** x86-64 execution/system architecture terminology.  
**Boundary:** AMD implementation/documentation; not all server-platform behavior.

### [R2] Intel — Intel 64 and IA-32 Software Developer Manuals
**Class:** Primary architecture specification / vendor implementation of x86  
https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html  
**Use:** Intel 64/IA-32 architecture and programming environment.  
**Boundary:** Intel implementation/documentation.

### [R3] Linux Kernel — NUMA Memory Policy
**Class:** OS implementation documentation  
https://cdn.kernel.org/doc/html/latest/admin-guide/mm/numa_memory_policy.html  
**Use:** NUMA concepts, local/remote allocation, policy behavior.

### [R4] Linux Kernel — EDAC
**Class:** OS RAS/error-management documentation  
https://cdn.kernel.org/doc/html/latest/driver-api/edac.html  
**Use:** corrected/uncorrected memory-error terminology and EDAC framework.

### [R5] AMD — EPYC 9005 Architecture Overview
**Class:** Vendor primary platform example  
https://www.amd.com/content/dam/amd/en/documents/epyc-technical-docs/user-guides/58462_amd-epyc-9005-tg-architecture-overview.pdf  
**Use:** current example of memory channels, PCIe Gen5, CXL 2.0 and socket I/O topology.  
**Boundary:** vendor-specific example, not x86 baseline.

### [R6] AMD — EPYC 9005 Memory Population Recommendations
**Class:** Vendor engineering guidance  
https://www.amd.com/content/dam/amd/en/documents/epyc-technical-docs/user-guides/58463_amd-epyc-9005-ug-memory-population-recommendations.pdf  
**Use:** workload-dependent channel population/bandwidth example.

### [R7] Intel — Xeon 6 Product Brief
**Class:** Vendor primary platform example / vendor claim  
https://www.intel.com/content/www/us/en/products/docs/xeon-6-product-brief.html  
**Use:** current Intel server memory/PCIe example.  
**Boundary:** product-specific claims.

### [R8] PCI-SIG — PCI Express Base Specification Revision 7.0
**Class:** Normative industry specification  
https://pcisig.com/PCIExpress/Spec/Base/_7.0  
**Release:** 11 Jun 2025  
**Use:** current PCIe standard status and architecture scope.

### [R9] CXL Consortium — CXL 4.0 release / specification
**Class:** Industry specification authority  
https://computeexpresslink.org/news/  
https://computeexpresslink.org/cxl-specification/  
**Release:** 18 Nov 2025  
**Use:** current CXL specification status.  
**Boundary:** current specification does not imply shipping-platform support.

### [R10] CXL Consortium — CXL 3.2 release
**Class:** Industry specification authority  
https://computeexpresslink.org/wp-content/uploads/2024/12/CXL_3.2-Spec-Announcement_FINAL-1.pdf  
**Use:** memory-device monitoring, functionality and security evolution.

### [R11] NVM Express — Base Specification Revision 2.4
**Class:** Normative industry specification  
https://nvmexpress.org/specification/nvm-express-base-specification/  
**Ratified:** 31 Jul 2026  
**Use:** current NVMe base standard.

### [R12] NVM Express — NVMe over PCIe Transport Revision 1.4
**Class:** Normative industry specification  
https://nvmexpress.org/specification/nvme-over-pcie-transport-specification/  
**Ratified:** 31 Jul 2026  
**Use:** local NVMe/PCIe transport boundary.

### [R13] UEFI Forum — UEFI Specification 2.11
**Class:** Normative firmware specification  
https://uefi.org/specs/UEFI/2.11/  
**Release:** Dec 2024  
**Use:** boot manager, Secure Boot, firmware interfaces, hardware-error records.

### [R14] UEFI Forum — ACPI Specification 6.6
**Class:** Normative platform/OS interface specification  
https://uefi.org/specifications  
**Release:** May 2025  
**Use:** platform hardware description/power-management interface.

### [R15] DMTF — Redfish Specification DSP0266 1.23.1
**Class:** Normative management specification  
https://www.dmtf.org/standards/redfish  
**Release:** 16 Jan 2026  
**Use:** standardized server/fleet management API.

### [R16] DMTF — Redfish Data Model DSP0268 2025.4
**Class:** Normative management data model  
https://www.dmtf.org/sites/default/files/standards/documents/DSP0268_2025.4.html  
**Release:** Jan 2026  
**Use:** standardized server component/resource data model.

### [R17] DMTF — SMBIOS Specification DSP0134 3.9.0
**Class:** Normative system-information specification  
https://www.dmtf.org/standards/smbios  
**Release:** 19 Aug 2025  
**Use:** platform inventory structures.

### [R18] DMTF — MCTP Base Specification DSP0236 1.3.3
**Class:** Normative management transport specification  
https://www.dmtf.org/dsp/DSP0236  
**Use:** management-controller/device transport architecture.

### [R19] DMTF — PLDM specifications / Firmware Update DSP0267
**Class:** Normative platform-management specification family  
https://www.dmtf.org/standards/pmci  
**Use:** platform monitoring/control and firmware update mechanisms.

### [R20] DMTF — SPDM DSP0274 1.4.0
**Class:** Normative device-security specification  
https://www.dmtf.org/standards/spdm  
**Release:** 25 May 2025  
**Use:** authentication, measurement and secured device-management concepts.

### [R21] Trusted Computing Group — TPM 2.0 Library Version 185
**Class:** Normative trusted-platform specification  
https://trustedcomputinggroup.org/resource/tpm-library-specification/  
**Release:** Mar 2026  
**Use:** TPM architecture and capabilities.

### [R22] NIST SP 800-193 — Platform Firmware Resiliency Guidelines
**Class:** Government security guidance  
https://csrc.nist.gov/pubs/sp/800/193/final  
**Use:** protection, detection and recovery model for platform firmware.

### [R23] Open Compute Project — Modular Hardware System (MHS)
**Class:** Open hardware specification program  
https://www.opencompute.org/wiki/Server/MHS  
**Use:** modular/interoperable server building-block architecture.

### [R24] Open Compute Project — DC-MHS Specs and Designs
**Class:** Open hardware specification set  
https://www.opencompute.org/wiki/Server/MHS/DC-MHS-Specs-and-Designs  
**Use:** current modular host/platform building-block specifications.

### [R25] Open Compute Project — Open Rack V3 Specs and Designs
**Class:** Open rack/power specification set  
https://www.opencompute.org/wiki/Open_Rack/SpecsAndDesigns  
**Use:** rack/power architecture example outside conventional 19-inch-only assumptions.

### [R26] Open Compute Project — DC-SCM / secure control module ecosystem
**Class:** Open hardware management architecture  
https://www.opencompute.org/wiki/Hardware_Management/Hardware_Management_Module  
**Use:** modular BMC/security/control-plane architecture.

### [R27] DMTF — Published Standards Index
**Class:** Standards authority index  
https://www.dmtf.org/standards/published_documents  
**Use:** current Redfish/PLDM/SPDM/MCTP version cross-check.

### [R28] NVM Express — Specifications overview
**Class:** Industry specification authority index  
https://nvmexpress.org/specifications/  
**Use:** current NVMe specification set and protocol-vs-transport framing.

---

# PART XXXI — Research conclusions

## 251. Architecture conclusion
The x86 server must be treated as a locality- and I/O-aware platform, not a list of CPU/RAM/drive quantities.

## 252. Sizing conclusion
The three primary sizing planes are **compute**, **memory** and **I/O**. Power, thermal, RAS, security and lifecycle constrain all three.

## 253. NUMA conclusion
NUMA is a first-class design property for 2S/high-I/O/high-memory servers and must be visible in workload, virtualization and device placement decisions.

## 254. Memory conclusion
Channel population and locality can be as important as installed capacity. A BoQ that records only total RAM is incomplete.

## 255. I/O conclusion
PCIe lane/root topology must be a BoQ artifact. Slot count without electrical mapping is insufficient.

## 256. CXL conclusion
CXL is strategically important for memory expansion/pooling/composability, but procurement must distinguish the current CXL specification from the exact features validated on the selected shipping server.

## 257. Storage conclusion
NVMe is a protocol architecture. Form factor, endurance, hot-plug, backplane and lane mapping remain separate decisions.

## 258. Management conclusion
BMC/Redfish/PLDM/MCTP form an operational control plane that should be designed, secured and automated—not treated as a maintenance afterthought.

## 259. Security conclusion
Server platform security requires Secure/Measured Boot, TPM/RoT, device trust, firmware lifecycle and recovery; no single checkbox proves platform trust.

## 260. Economic conclusion
Core/socket/node architecture changes software licensing, power and blast radius. Hardware unit price alone is not server TCO.

## 261. Golden acceptance candidate
K08 research is ready to drive:

- Full Narration TR — 8 chapters
- independent Quick Brief TR
- S3F production audio pipeline
- four primary Golden visuals
- exact manifest-driven UI metadata
- final Pages/source-parity acceptance

---

## Final Golden rule

`WORKLOAD → CPU TOPOLOGY → MEMORY CAPACITY/BANDWIDTH → NUMA LOCALITY → PCIe/CXL LANE BUDGET → LOCAL STORAGE/BOOT → NETWORK/OOB → POWER/THERMAL → RAS/SECURITY → FIRMWARE/MANAGEMENT → SERVICEABILITY → LIFECYCLE → BoQ → BENCHMARK → FREEZE`
