# DC-K09 — Accelerated Compute / GPU / DPU — Golden Deep Research

**Research state:** `DC_K09_GOLDEN_DEEP_RESEARCH = COMPLETE`  
**Research date:** 2026-09-02  
**Scope:** Vendor-neutral accelerated-compute architecture from accelerator taxonomy through host attachment, memory/interconnect topology, virtualization, infrastructure offload, power/thermal coupling, operations, acceptance and lifecycle.  
**Next production stage:** 8-chapter Full Narration TR V2 + independent Quick Brief + S3F audio QA.

---

## Evidence labels used in this module

- **STANDARD** — formal industry specification or standards body material.
- **OPEN SPEC** — open hardware/software specification maintained by an industry consortium.
- **PLATFORM DOC** — neutral platform or orchestration documentation.
- **BENCHMARK** — benchmark methodology/results source; useful for comparative validation, not a universal design threshold.
- **VENDOR CLAIM / REFERENCE** — vendor architecture, product capability or validated reference design. It is evidence of an implementation, not a vendor-neutral requirement.
- **GUIDANCE** — industry design/operations guidance.
- **SPECBRIDGE PLANNING GUIDANCE** — engineering synthesis used to structure decisions; not a standard threshold.

---

# Executive thesis

## 0. Accelerated compute is a system architecture, not a GPU SKU

The useful unit of design is not “one GPU”. It is the complete data path:

`WORKLOAD → SOFTWARE STACK → ACCELERATOR TYPE → LOCAL MEMORY → HOST CPU / NUMA → PCIe / CXL → SCALE-UP DOMAIN → NIC / STORAGE PATH → SCALE-OUT DOMAIN → POWER / THERMAL → SCHEDULING / ISOLATION → OPERATIONS → ACCEPTANCE → LIFECYCLE`

A technically powerful accelerator can underperform or become operationally unusable when memory capacity, memory bandwidth, host locality, PCIe lane budget, peer topology, network placement, software compatibility, cooling, power or scheduling are mismatched.

## 1. The Golden principle

**Do not size accelerated infrastructure from headline FLOPS/TOPS alone.** Freeze the platform only after workload precision, model/data working set, memory behavior, communication pattern, topology, utilization target, failure blast radius, facility coupling and lifecycle are proven together.

## 2. Canonical distinctions

The following distinctions are frozen for all future SpecBridge work:

- `GPU ≠ DPU ≠ IPU ≠ SmartNIC ≠ FPGA ≠ custom AI ASIC`
- `accelerator compute ≠ infrastructure offload`
- `device memory capacity ≠ device memory bandwidth`
- `peak arithmetic throughput ≠ delivered application throughput`
- `PCIe generation ≠ negotiated end-to-end device capability`
- `CXL availability in a standard ≠ CXL support in a deployed accelerator platform`
- `scale-up ≠ scale-out`
- `peer-to-peer path ≠ guaranteed application-level collective efficiency`
- `GPU partitioning ≠ node-level high availability`
- `virtual function ≠ dedicated physical failure domain`
- `DPU ≠ ordinary NIC with a faster port`
- `dual accelerator fabric ≠ end-to-end path independence`
- `rack power capacity ≠ accelerator application performance`
- `liquid-ready facility ≠ validated accelerator thermal solution`

---

# Part I — Accelerator taxonomy

## 3. GPU

A GPU is a highly parallel processor optimized for throughput-oriented workloads. Modern data-center GPUs combine general parallel execution resources with matrix/tensor-oriented units and high-bandwidth local memory. AI and HPC use cases exploit different combinations of precision, memory bandwidth and communication.

## 4. AI accelerator / tensor accelerator / custom ASIC

A custom accelerator can optimize a narrower workload domain than a general GPU. The architectural decision should therefore compare software ecosystem, supported operators/data types, compiler maturity, memory architecture, scale topology and lifecycle—not only nominal arithmetic throughput.

## 5. FPGA

An FPGA provides reconfigurable hardware logic. Its value can be deterministic pipelines, protocol processing, streaming, low-latency transformation or specialized acceleration. It should not be treated as a slower or faster GPU; the programming model and workload fit are fundamentally different.

## 6. SmartNIC

A SmartNIC adds programmable packet/data-path capabilities beyond a conventional NIC. Implementations vary widely. “SmartNIC” alone does not prove independent compute cores, full infrastructure control, storage offload or security isolation.

## 7. DPU

A DPU is best treated as an infrastructure-processing domain placed in or near the I/O path. Typical roles include networking, storage, security, telemetry, virtualization and tenant isolation. NVIDIA BlueField and AMD Pensando are current vendor examples; their product claims are not a universal DPU definition.

## 8. IPU

Intel uses “Infrastructure Processing Unit” for infrastructure offload/isolation platforms. Architecturally, IPU and DPU categories overlap in several use cases. Procurement should specify required functions rather than assuming label equivalence.

## 9. DPU versus AI accelerator

A DPU can contain substantial programmable compute, but its primary architectural role is normally infrastructure processing rather than model training/inference. A platform that uses DPU resources for selected data-path kernels should still model DPU failure and capacity separately from the primary AI-compute domain.

## 10. Accelerator hierarchy

A practical taxonomy is:

1. **Compute accelerator:** GPU / AI ASIC / FPGA for application computation.
2. **Infrastructure accelerator:** DPU / IPU / SmartNIC for network, storage, security, management or data movement.
3. **Media/special-function accelerator:** video, compression, crypto, packet inspection and similar functions.
4. **On-package accelerator function:** accelerator integrated into CPU/SoC/chiplet complex.

DMTF Redfish explicitly models acceleration functions as processor functions and includes examples such as compression, encryption, packet inspection, packet switching, scheduling and video processing.

---

# Part II — Workload first

## 11. Training workload

Training generally stresses accelerator arithmetic, HBM capacity/bandwidth and inter-accelerator communication concurrently. Large distributed training can shift bottlenecks from compute to collective communication or memory long before peak compute is reached.

## 12. Inference workload

Inference sizing depends on model size, context length, batch policy, latency SLO, concurrency, precision/quantization and cache behavior. A GPU optimized for maximum training throughput is not automatically the economically optimal inference platform.

## 13. Fine-tuning

Fine-tuning ranges from relatively light parameter-efficient methods to full-model training. The memory and communication profile must be measured rather than inferred from the word “fine-tuning”.

## 14. HPC

HPC workloads may prioritize FP64, memory bandwidth, interconnect latency, deterministic scaling or specialized libraries. AI-oriented low-precision peak performance can be irrelevant to an HPC acceptance test.

## 15. Visualization / media

Rendering, transcoding, VDI and media pipelines use accelerator blocks and software stacks that can differ materially from AI/HPC. Media engines, graphics capability, encoder/decoder counts and licensing may dominate.

## 16. Infrastructure acceleration

Network/storage/security offload should be sized from packets, flows, connections, encryption, storage IOPS/bandwidth, policy scale and isolation requirements—not from AI-model metrics.

## 17. Mixed workloads

Mixed clusters should explicitly model fragmentation. A device can have high theoretical utilization while real schedulable capacity is stranded because jobs require incompatible memory sizes, partition profiles, topology or maintenance windows.

---

# Part III — Performance dimensions

## 18. Peak compute is a ceiling

Peak FLOPS/TOPS represent arithmetic capability under defined precision and sparsity assumptions. They do not include data loading, memory stalls, communication, kernel inefficiency, framework overhead or synchronization.

## 19. Precision matters

FP64, FP32, TF32-like formats, BF16, FP16, FP8 and lower-precision/microscaling formats serve different accuracy/performance domains. Procurement must tie advertised throughput to the precision actually validated for the workload.

## 20. Sparsity assumptions

Performance figures that assume structured sparsity cannot be compared directly with dense performance. Acceptance data must identify whether sparsity is enabled and whether the application can preserve required quality.

## 21. Delivered throughput

Delivered throughput is an end-to-end application outcome: examples include tokens/s, time-to-train, samples/s, simulation steps/s, frames/s or application-specific transactions. This is the preferred acceptance measure.

## 22. Latency

Interactive inference can be limited by time-to-first-token, inter-token latency or p99 response latency even when aggregate tokens/s is high.

## 23. Utilization

GPU utilization counters must be interpreted with memory, tensor-core, copy-engine, PCIe/fabric and scheduler metrics. A single percentage cannot diagnose the bottleneck.

## 24. Benchmark evidence

MLPerf is useful because its benchmark suites test complete systems against defined quality targets. It should be used as comparative evidence, not as proof that the same ranking will hold for the customer workload.

---

# Part IV — Accelerator memory

## 25. Device-local memory

Accelerator-local HBM or other high-bandwidth memory is often the first hard constraint for model placement. Capacity determines what can be resident; bandwidth determines how fast data can be supplied to compute units.

## 26. Capacity ≠ bandwidth

Two accelerators with equal memory capacity can deliver different performance because bandwidth, cache hierarchy, memory controllers and software behavior differ.

## 27. Working set

Sizing should include model weights, optimizer state, activations, KV cache, temporary buffers, communication buffers and framework overhead as applicable.

## 28. Memory headroom

An accelerator running at nearly full memory capacity can suffer scheduling fragmentation and poor multi-tenant flexibility. Headroom should be an intentional policy, not accidental leftover capacity.

## 29. HBM bandwidth

High HBM bandwidth benefits memory-bound kernels, but only if software can generate sufficient concurrency and locality. Memory bandwidth should be validated with workload-level profiling.

## 30. Host memory dependency

CPU DRAM remains important for dataset staging, orchestration, preprocessing, networking/storage stacks and oversubscription mechanisms. Accelerator-rich servers should not be paired with an undersized host-memory subsystem.

## 31. Coherent memory technologies

CXL defines open coherent connectivity for heterogeneous memory and compute use cases. CXL 4.0 is current as of 2026-09-02 and adds 128 GT/s capability, bundled ports and RAS enhancements. This does **not** imply that current shipping accelerators expose or benefit from all CXL 4.0 capabilities.

## 32. Unified-memory abstractions

Software “unified memory” can simplify programming but does not eliminate physical topology or migration costs. Acceptance should monitor where pages reside and whether migration/remote access causes stalls.

---

# Part V — Host attachment and PCIe

## 33. PCIe as the common host interface

PCIe remains the general-purpose host/device interconnect. PCI-SIG lists PCIe Base Specification 7.0 as current, with 128 GT/s raw signaling and up to 512 GB/s bidirectional bandwidth for x16 at specification level.

## 34. Standard version ≠ deployed link

A server, CPU, riser, retimer, switch, cable and accelerator must all support the negotiated generation/width. The weakest compatible element determines the live link.

## 35. Lane budget

Every accelerator, NIC, NVMe device and PCIe switch consumes platform I/O resources. A BoQ that lists devices without root-complex/lane mapping is incomplete.

## 36. Width matters

An x16-capable accelerator installed behind an x8 electrical path may function correctly but with reduced host bandwidth. Slot physical size cannot be used as proof of electrical width.

## 37. PCIe switches

PCIe switches can increase fan-out and enable complex multi-device topologies, but they add oversubscription, latency, firmware and failure-domain considerations.

## 38. Retimers

Retimers enable channel reach at high signaling rates. They add firmware/management and physical-design dependencies and should appear in topology and failure analysis.

## 39. Above-4G / large BAR

Large accelerator memory mappings can require platform firmware settings such as Above 4G Decoding and Resizable BAR. Exact requirements are platform-specific and must be taken from validated system documentation.

## 40. IOMMU / ACS / virtualization settings

SR-IOV or passthrough can depend on IOMMU, ACS and related firmware configuration. These settings may also influence performance; “enable everything” is not a universal tuning strategy.

---

# Part VI — Chiplets, UCIe and package-level scaling

## 41. Chiplet architecture

Modern accelerators increasingly partition compute, memory, cache and I/O across multiple dies. The package should be treated as a system: internal fabric, memory stacks, thermal hotspots and yield/lifecycle behavior matter.

## 42. UCIe

UCIe is an open die-to-die interconnect standard. UCIe 3.0 supports 48 and 64 GT/s and adds manageability and signaling enhancements. It is primarily a **package/chiplet interconnect**, not a rack-scale GPU fabric.

## 43. UCIe ≠ PCIe ≠ scale-up fabric

UCIe can carry protocol mappings inside a package. PCIe connects devices/platform components. Vendor or consortium scale-up fabrics connect accelerator domains at node/rack scale. These layers should not be collapsed into one “high-speed interconnect” box.

---

# Part VII — Open accelerator hardware infrastructure

## 44. OAI

OCP Open Accelerator Infrastructure defines common infrastructure for accelerator solutions, including module, baseboard, host interface, power distribution, expansion, security/control/management, tray and chassis concepts.

## 45. OAM

OCP Accelerator Module provides a module form factor and common interfaces intended to improve interoperability and system integration for accelerator modules.

## 46. UBB

Universal Baseboard provides a common accelerator-baseboard construct for interconnecting multiple accelerator modules. It is a physical/system architecture concept; the actual accelerator-to-accelerator protocol can vary.

## 47. OAM ≠ PCIe add-in card

OAM architectures are designed for dense accelerator integration and scale-up connectivity. A PCIe add-in card is a different electromechanical/integration model.

## 48. OCP NIC 3.0

OCP NIC 3.0 is an open NIC form-factor/specification family. DPU/SmartNIC functions can be implemented in NIC-class modules, but OCP NIC compliance by itself does not make a device a DPU.

---

# Part VIII — Scale-up versus scale-out

## 49. Scale-up definition

Scale-up connects accelerators into a tightly coupled compute domain, normally prioritizing very high bandwidth, low latency and efficient peer communication.

## 50. Scale-out definition

Scale-out connects nodes/racks/clusters through a network fabric. Its engineering concerns include topology, congestion, routing, collective behavior, fault domains and operational scale.

## 51. Scale-up ≠ scale-out

A rack-scale vendor fabric can make dozens of accelerators behave as a larger domain, but inter-rack communication still depends on a scale-out network. Failure and performance acceptance must test both separately.

## 52. Vendor scale-up examples

- **VENDOR REFERENCE:** NVIDIA NVLink/NVSwitch rack systems.
- **VENDOR REFERENCE:** AMD Infinity Fabric / UALink-oriented accelerator systems.

These are implementation evidence, not vendor-neutral requirements.

## 53. Topology is part of the product

The same accelerator model can produce different application performance in 1-GPU, 8-GPU, switched, fully connected or rack-scale configurations.

## 54. Bisection bandwidth

Aggregate link bandwidth is insufficient. Collective-heavy workloads depend on topology and available bisection bandwidth under simultaneous traffic.

## 55. Hop count

Peer communication that crosses additional switches or host/root-complex paths can increase latency and reduce effective throughput.

## 56. Collective communication

All-reduce, all-gather, reduce-scatter and similar collective operations stress the entire communication topology. Acceptance should use the actual distributed-training communication pattern, not only point-to-point bandwidth.

---

# Part IX — GPU / NIC / storage locality

## 57. NIC locality

For GPU-direct data movement, NIC placement relative to the accelerator matters. PCIe distance, root-complex locality and switch topology can affect effective bandwidth and latency.

## 58. Storage locality

AI pipelines can be storage-bound. Local NVMe, distributed file/object systems and direct-storage paths must be evaluated against dataset/read pattern, checkpoint behavior and metadata load.

## 59. Direct GPU data paths

**VENDOR REFERENCE:** NVIDIA GPUDirect RDMA permits direct data exchange between GPU memory and peer devices such as NICs over PCIe; GPUDirect Storage enables direct DMA paths between storage and GPU memory. The architectural lesson is vendor-neutral: avoiding unnecessary CPU bounce buffers can reduce host overhead, but requires compatible hardware/software/topology.

## 60. Affinity

GPU↔NIC affinity should be represented explicitly in topology diagrams. A physically present NIC is not automatically the best NIC for every GPU.

## 61. CPU locality still matters

Even with direct paths, host CPU is responsible for parts of orchestration, driver work, networking, preprocessing and control. CPU socket/NUMA placement remains relevant.

---

# Part X — DPU / IPU / SmartNIC architecture

## 62. Infrastructure offload model

A DPU/IPU can remove networking, storage, security and management processing from host CPUs, creating a separate infrastructure execution domain.

## 63. Isolation model

Infrastructure processors can provide stronger separation between tenant/application CPU resources and provider infrastructure services. This can reduce attack surface and noisy-neighbor coupling when designed correctly.

## 64. DPU data path

A useful DPU topology shows:

`NETWORK PORTS → PARSER / SWITCH / CRYPTO / STORAGE ENGINES → DPU CPU / CONTROL → HOST PCIe → VM / CONTAINER / GPU / STORAGE`

## 65. DPU ≠ free performance

Offload consumes DPU compute, memory and power and introduces its own software/firmware. It should be sized and monitored like a subsystem.

## 66. DPU failure domain

If all host network/storage connectivity depends on one DPU, DPU failure can become node failure. Redundancy and failover behavior must be validated.

## 67. DPU management plane

Infrastructure-processor lifecycle may include separate OS images, secure boot, firmware, agents and orchestration. Ownership must be explicit.

## 68. DPU security boundary

Security value comes from enforced isolation, trusted boot/firmware and controlled management—not from the product label alone.

## 69. DPU storage role

Storage virtualization, NVMe transport, compression/encryption or remote-storage initiation can be DPU/IPU use cases. The performance budget must include both network and storage traffic simultaneously.

## 70. DPU in AI clusters

In AI infrastructure, DPU/SuperNIC-class devices can handle infrastructure services so CPU/GPU resources focus on application work. They do not replace the high-performance scale-out network architecture itself.

---

# Part XI — Virtualization and partitioning

## 71. Full-device passthrough

A VM or workload receives direct control of a physical accelerator function. This can offer predictable performance but reduces sharing flexibility.

## 72. SR-IOV

SR-IOV exposes virtual functions from a PCIe device. Support is device/driver/platform-specific. SR-IOV provides a virtualization mechanism; it does not automatically guarantee equal performance, memory isolation or fault isolation for all devices.

## 73. Spatial partitioning

Hardware resources can be divided into isolated partitions. **VENDOR REFERENCE:** NVIDIA MIG and AMD Instinct partitioning are current implementations with different profile/capability models.

## 74. Temporal sharing

Multiple workloads can time-share an accelerator. Utilization can improve, but latency jitter and interference must be evaluated.

## 75. MIG is not generic GPU virtualization

NVIDIA MIG is a specific vendor partitioning technology. It should be referenced as an implementation example, not written into vendor-neutral requirements unless the customer intentionally standardizes on NVIDIA.

## 76. AMD partitioning

AMD Instinct virtualization documentation describes SR-IOV and spatial/temporal partitioning for supported products. Again, the neutral requirement should describe isolation and resource outcomes, not vendor feature names.

## 77. Partitioning ≠ HA

If all partitions are on one physical GPU, a device failure removes them together. If all GPUs are in one server, server failure remains common-mode.

## 78. Fragmentation

Partition profiles can strand memory/compute. Cluster utilization policy must account for the job-size distribution.

## 79. Multi-tenancy

Multi-tenant accelerator service requires resource isolation, memory/data cleanup, scheduling fairness, firmware security, network/storage isolation and accounting.

---

# Part XII — Kubernetes and orchestration

## 80. Device Plugin model

Kubernetes Device Plugins are a stable mechanism for exposing specialized hardware such as GPUs, NICs and FPGAs to kubelet.

## 81. Dynamic Resource Allocation

Kubernetes DRA is stable and provides ResourceClaim-based allocation for devices. It enables device classes, attributes and more flexible allocation semantics than simple integer extended resources.

## 82. DRA in current Kubernetes

Kubernetes documentation states DRA is stable and, in v1.35+, the core behavior is always enabled. Kubernetes v1.36 continues to mature accelerator/device-management capabilities.

## 83. Scheduling attributes

A scheduler may need accelerator model, memory, partition profile, topology, NIC affinity, NUMA locality, health and firmware characteristics—not just “gpu: 8”.

## 84. Topology-aware placement

For multi-GPU jobs, placement should preserve the required scale-up domain and network locality. Randomly selecting eight healthy GPUs can create a poor topology.

## 85. Gang scheduling dependency

Distributed jobs often require multiple accelerator resources to start together. Orchestration architecture should address partial allocation and deadlock/queue behavior.

## 86. Health management

A device can be present but degraded. Scheduling should integrate health signals and quarantine policy.

## 87. Drain and maintenance

Accelerator firmware/driver changes may require node drain, reboot or rack-level sequencing. Change windows should account for cluster capacity loss.

## 88. Accounting

Accelerator service economics require usage accounting by device/partition/time/job and, where relevant, energy or service class.

---

# Part XIII — Software stack

## 89. Driver dependency

Accelerator performance and stability depend on kernel driver, runtime, libraries and firmware versions. “Hardware installed” is not an acceptance state.

## 90. Framework compatibility

Framework/compiler support can determine whether a theoretical hardware feature is usable. Compatibility matrices belong in procurement and lifecycle planning.

## 91. Kernel/library maturity

New hardware generations may ship before every workload library is equally optimized. Pilot benchmarking should use the intended production stack.

## 92. Container runtime

Containers do not remove driver compatibility requirements. Host driver, container toolkit/runtime and user-space libraries must form a supported stack.

## 93. Reproducibility

Golden performance tests should record firmware, driver, runtime, framework, container image, compiler/library versions and benchmark configuration.

## 94. Software lock-in

A highly optimized proprietary stack may deliver strong performance but increase portability and lifecycle risk. This is a commercial/technical trade-off, not automatically a defect.

---

# Part XIV — Management, telemetry and Redfish

## 95. BMC is not enough

Accelerator management spans server BMC, device firmware, driver/runtime telemetry and cluster-level observability.

## 96. Redfish

DMTF Redfish provides standard management schemas and models acceleration functions. The latest Redfish release family should be used where platform vendors implement it.

## 97. Accelerator telemetry

Useful telemetry includes temperature, power, clocks, memory errors, PCIe/fabric errors, throttling reason, utilization, memory usage, link state and health.

## 98. Fabric telemetry

Scale-up and scale-out link errors, retransmissions, congestion and switch health must be correlated with application performance.

## 99. DPU telemetry

DPU capacity should include CPU/memory utilization, packet rate, flow count, encryption, storage throughput, drops, latency and offload-engine health.

## 100. Observability ownership

Define which team owns server BMC, accelerator management, DPU OS, scale-up switches, scale-out fabric and cluster scheduler alerts.

---

# Part XV — Security

## 101. Firmware trust

Accelerator, DPU, PCIe switch/retimer and management firmware form part of the trusted computing base.

## 102. Secure boot

Secure boot/verified firmware should be evaluated for host and infrastructure processors where supported.

## 103. Device isolation

IOMMU, ACS, SR-IOV isolation, partitioning and DPU security policies should be tested against the intended tenancy model.

## 104. Management-plane isolation

BMC/DPU/accelerator management endpoints should not share unrestricted tenant/application paths.

## 105. Firmware update risk

Firmware updates can change performance, compatibility and thermal behavior. Version control and rollback planning are mandatory.

## 106. Data remanence

Multi-tenant accelerators require memory/data cleanup behavior to be understood and validated across reset/reallocation paths.

---

# Part XVI — Power and thermal coupling

## 107. Accelerator power is dynamic

Accelerators can create synchronized load changes and high transient demand. Facility design should use measured/validated platform behavior, not only a static label.

## 108. Board/module power ≠ rack power

Rack power includes CPUs, memory, NICs, DPUs, switches, storage, fans/pumps and conversion losses in addition to accelerators.

## 109. Rack-scale systems

Current vendor rack-scale AI reference systems demonstrate that the unit of deployment can include compute trays, scale-up switch trays, management switches, power shelves/busbars and liquid manifolds. These are examples of integration complexity, not a universal rack design.

## 110. Thermal design

Accelerator cooling must address junction limits, memory, voltage regulators, optics/NICs, switches, storage and residual air heat.

## 111. Liquid cooling

ASHRAE’s 2026 AI framework treats liquid cooling and TCS integration as central for very high-density AI systems. The exact cooling threshold remains project/platform-specific; SpecBridge will not convert guidance examples into universal standards.

## 112. Residual heat

Direct-to-chip systems can leave power supplies, memory, NICs, storage and other components air-cooled. Residual-air capacity must be modelled.

## 113. CDU/manifold coupling

Rack-scale accelerator failures can propagate through a shared CDU/manifold if isolation and redundancy are not designed correctly.

## 114. Thermal throttling

A system can pass functional tests and still underperform because of sustained thermal throttling. Acceptance must include long-duration load.

## 115. Power capping

Power caps can improve facility fit or density but alter performance. Acceptance must document cap settings and resulting application throughput.

---

# Part XVII — Physical integration

## 116. Form factor

Accelerator integration can use PCIe add-in cards, OAM/OAI modules, vendor-specific baseboards/trays or rack-scale modules. Mechanical form is a first-class design variable.

## 117. Weight

Accelerator servers and rack-scale systems can impose high static/rolling loads. Coordinate with DC-K03 Rack Engineering and DC-K07 Facility Architecture.

## 118. Service access

GPU/DPU/NIC, cold-plate, cable and power replacement paths must be physically accessible without creating avoidable blast radius.

## 119. Cabling

Dense scale-up/scale-out systems can have significant copper/fiber and management cabling. Bend radius, connector serviceability and airflow must be engineered.

## 120. Optics and high-speed ports

High-speed fabric optics can be a meaningful power/thermal/reliability component. Full optical engineering is owned by later network modules, but K09 must reserve power, cooling and service space.

---

# Part XVIII — Workload-to-architecture decision matrices

## 121. Accelerator type fit matrix

| Workload | Primary accelerator tendency | Critical dimensions | Common sizing error |
|---|---|---|---|
| LLM training | GPU / AI accelerator | HBM, scale-up, scale-out, collective efficiency | Buying peak FLOPS without communication model |
| LLM inference | GPU / AI accelerator | HBM capacity, latency, throughput, partitioning | Ignoring context/cache and utilization economics |
| HPC simulation | GPU / FPGA / specialized accelerator | FP64, memory bandwidth, interconnect, libraries | Comparing AI low-precision TOPS |
| Video/media | GPU / media ASIC / FPGA | codec engines, streams, latency, licensing | Overbuying tensor compute |
| NFV/security | DPU/IPU/SmartNIC/FPGA | packet/flow/crypto rate, isolation | Calling every SmartNIC a DPU |
| Storage offload | DPU/IPU/SmartNIC/FPGA | NVMe-oF, compression, crypto, RDMA, CPU offload | Ignoring simultaneous network+storage load |
| Edge inference | GPU / NPU / ASIC | watts, thermals, model fit, remote ops | Datacenter-class SKU in constrained envelope |

## 122. Scale model matrix

| Scale | Architecture tendency | Primary risk |
|---|---|---|
| 1 accelerator | PCIe-attached device | Host/memory/software mismatch |
| 2–8 accelerators/node | local peer or switch topology | NUMA, lane budget, peer topology |
| multi-node pod | scale-up + scale-out | collective communication and NIC locality |
| rack-scale domain | dedicated scale-up fabric + network | power/cooling/fabric/common-mode failures |
| multi-rack cluster | rack scale-up + scale-out fabric | network contention, failure domains, operations |
| campus/fleet | multiple clusters / service pools | supply chain, lifecycle, scheduling fragmentation |

## 123. GPU versus DPU matrix

| Dimension | GPU / compute accelerator | DPU / IPU / infrastructure processor |
|---|---|---|
| Primary role | Application compute | Infrastructure services/offload/isolation |
| Typical workloads | AI, HPC, rendering | Network, storage, security, management |
| Key memory concern | HBM capacity/bandwidth | packet/storage buffers + local DRAM |
| Key fabric concern | peer/scale-up + scale-out | host/network/storage paths |
| Main utilization metric | delivered application throughput | infrastructure service throughput/latency |
| Failure effect | job/node compute loss | possible host connectivity/storage/security loss |

## 124. Virtualization matrix

| Model | Isolation | Utilization | Performance predictability | Main trade-off |
|---|---|---|---|---|
| full device passthrough | high physical assignment | lower sharing | high | fragmentation |
| spatial partition | hardware resource partition | high | medium/high | profile fragmentation |
| SR-IOV VF | device-specific | high | device-specific | driver/IOMMU/platform complexity |
| temporal sharing | time isolation | very high | variable | jitter/interference |
| software scheduler only | weak/stack-specific | potentially high | variable | noisy neighbor |

---

# Part XIX — Failure modes / FMEA seed

## 125. FMEA-01 — Accelerator thermal throttling

- **Trigger:** cooling degradation, cold-plate/contact issue, fan/pump fault.
- **Effect:** silent performance loss before hard failure.
- **Detection:** device clocks/power/temperature/throttle reason + application throughput.
- **Control:** sustained-load acceptance, thermal telemetry and alarm policy.

## 126. FMEA-02 — HBM uncorrectable error

- **Effect:** device reset/job failure/node degradation.
- **Control:** RAS telemetry, quarantine, spare capacity and restart policy.

## 127. FMEA-03 — PCIe link downtraining

- **Effect:** device remains functional at lower generation/width; hidden bandwidth loss.
- **Control:** automated live-link audit against BoQ topology.

## 128. FMEA-04 — PCIe switch failure

- **Effect:** multiple accelerators/NICs lost together.
- **Control:** map switch blast radius and spare node capacity.

## 129. FMEA-05 — Scale-up link failure

- **Effect:** degraded or partitioned accelerator domain.
- **Control:** topology health checks, rerouting capability if supported, job restart design.

## 130. FMEA-06 — Scale-up switch tray failure

- **Effect:** rack-scale communication domain impact.
- **Control:** vendor-specific redundancy validation and failure injection.

## 131. FMEA-07 — NIC local path failure

- **Effect:** GPU-direct traffic reroutes or job fails; performance may collapse.
- **Control:** NIC redundancy and locality-aware failover tests.

## 132. FMEA-08 — DPU failure

- **Effect:** host network/storage/security path may fail despite healthy CPU/GPU.
- **Control:** explicit DPU failure-domain and failover acceptance.

## 133. FMEA-09 — DPU overload

- **Effect:** packet/storage/security latency rises while GPU utilization falls.
- **Control:** multi-service load testing and capacity headroom.

## 134. FMEA-10 — Firmware incompatibility

- **Effect:** device not enumerated, degraded performance or instability.
- **Control:** frozen firmware matrix, canary update and rollback.

## 135. FMEA-11 — Driver/runtime mismatch

- **Effect:** application errors or missing features.
- **Control:** immutable tested software baseline.

## 136. FMEA-12 — Partition fragmentation

- **Effect:** free compute/memory exists but requested job cannot be placed.
- **Control:** profile policy and scheduler capacity model.

## 137. FMEA-13 — Orphaned unhealthy device allocation

- **Effect:** scheduler repeatedly assigns degraded resource.
- **Control:** device health integration, taints/quarantine and DRA/device-plugin policy.

## 138. FMEA-14 — Liquid leak / manifold isolation event

- **Effect:** multiple accelerators/rack unavailable.
- **Control:** leak zoning, isolation, drain/recovery and workload evacuation procedure.

## 139. FMEA-15 — Rack power cap / upstream constraint

- **Effect:** accelerator clocks capped, application throughput below design.
- **Control:** measure workload throughput at actual facility power envelope.

## 140. FMEA-16 — Scale-out congestion

- **Effect:** GPUs wait on collectives despite high local compute capacity.
- **Control:** network telemetry + distributed workload benchmark.

## 141. FMEA-17 — Storage feed bottleneck

- **Effect:** accelerator starvation during training/data loading/checkpoint.
- **Control:** dataset and checkpoint throughput test.

## 142. FMEA-18 — BMC/management visibility gap

- **Effect:** accelerator/DPU failures not correlated with server/fabric alarms.
- **Control:** unified telemetry ownership and event correlation.

## 143. FMEA-19 — Multi-tenant reset blast radius

- **Effect:** one tenant/device reset disrupts others sharing the physical device/node.
- **Control:** partition/reset behavior validation and tenancy policy.

## 144. FMEA-20 — Supply-chain generation mismatch

- **Effect:** replacement device has incompatible firmware/form factor/fabric or performance.
- **Control:** approved spare strategy and lifecycle-compatible alternates.

---

# Part XX — Acceptance engineering

## 145. Layered acceptance model

A Golden accelerated-compute platform must pass all layers:

1. Inventory and physical topology.
2. Firmware/secure-boot baseline.
3. PCIe/CXL enumeration and live-link state.
4. Accelerator memory/RAS health.
5. Peer/scale-up topology health.
6. NIC/storage locality.
7. DPU/IPU service health where used.
8. Power/thermal sustained load.
9. Single-node application benchmark.
10. Multi-node/collective benchmark.
11. Failure/recovery tests.
12. Scheduler/partition/multi-tenant tests.
13. Lifecycle/update/rollback test.

## 146. Topology acceptance

Record for every accelerator:

- server/node ID
- physical slot/module position
- CPU/NUMA affinity
- PCIe root/switch path
- live link generation/width
- peer/scale-up neighbors
- local NIC(s)
- local storage path if relevant
- cooling zone/manifold
- PSU/rack feed relationship

## 147. Single-device acceptance

Validate device health, memory, clocks, temperature, sustained power and representative workload.

## 148. Multi-device acceptance

Validate peer bandwidth/latency, collective behavior and topology consistency.

## 149. Multi-node acceptance

Run the intended scale-out workload pattern and correlate application throughput with fabric and accelerator telemetry.

## 150. DPU acceptance

Test network, storage and security services simultaneously, then inject DPU reset/failure and validate host behavior.

## 151. Virtualization acceptance

Validate partition/VF creation, isolation, performance, reset semantics, scheduler visibility and cleanup between tenants.

## 152. Thermal acceptance

Use long-duration workload at the actual power-cap/cooling configuration. A short synthetic burst is insufficient.

## 153. Maintenance acceptance

Demonstrate firmware/driver upgrade, node drain, rollback, spare replacement and return-to-service.

---

# Part XXI — BoQ engineering

## 154. Accelerator BoQ must include more than accelerator part numbers

Minimum engineering fields:

- accelerator model/form factor
- quantity per node and per rack
- device memory capacity/type
- required precision/features
- host CPU/socket topology
- PCIe/CXL generation/width requirements
- PCIe switch/retimer mapping
- scale-up topology/components
- NIC/DPU/IPU topology
- storage/feed requirements
- power cap/TDP/EDP assumptions
- cooling interface
- firmware/driver/runtime baseline
- virtualization/partitioning requirement
- support/HCL/certification requirement
- acceptance benchmark
- spare/lifecycle policy

## 155. Avoid “8 × GPU” BoQs

A line containing only accelerator count hides the most important engineering assumptions. An accepted BoQ needs topology and interface evidence.

## 156. Software belongs in BoQ scope

Driver/runtime/container/plugin/orchestration requirements are part of the deployable accelerator platform even when licensed separately.

## 157. Network belongs in accelerator acceptance

K24 will own detailed AI/HPC networking design. K09 nonetheless requires network bandwidth/topology/locality as an acceptance interface because accelerator scaling cannot be validated without it.

---

# Part XXII — Capacity and economics

## 158. Cost per accelerator is insufficient

Evaluate:

`CAPEX + host + fabric + DPU/NIC + storage + rack power + cooling + software/license + support + space + operations + energy + stranded capacity`

## 159. Cost per delivered unit of work

More useful commercial metrics include cost per token, training run, simulation, inference request or service-hour at target SLO.

## 160. Utilization economics

An expensive accelerator with high utilization can have lower unit economics than a cheaper accelerator that remains fragmented or starved by data/network constraints.

## 161. Power efficiency

Compare useful work per unit energy under the real workload. Board-level efficiency does not include network, DPU, CPU, cooling or facility overhead.

## 162. Refresh cadence

Accelerator generations can move faster than facility refresh. Design racks/power/cooling/network pathways for interface evolution without assuming exact future products.

## 163. Supply-chain risk

High-demand accelerators, optics, cables, switches, cooling parts and power components may have different lead times. The system schedule is set by the slowest critical dependency.

---

# Part XXIII — Design decision chain

## 164. D1 — Define workload and SLA

Training/inference/HPC/media/infrastructure; throughput, latency, quality, concurrency, availability and time-to-result.

## 165. D2 — Choose accelerator role

Application compute accelerator versus infrastructure accelerator versus specialized function.

## 166. D3 — Freeze precision and software ecosystem

Required data types, framework/compiler/library support, driver/runtime lifecycle.

## 167. D4 — Freeze memory envelope

Device-memory capacity, bandwidth, working-set/headroom and host-memory dependency.

## 168. D5 — Freeze host attachment

CPU/socket/NUMA, PCIe/CXL generation/width, root complex, switches/retimers.

## 169. D6 — Freeze scale-up domain

Peer topology, switch/fabric architecture, max domain and failure behavior.

## 170. D7 — Freeze NIC/DPU/storage locality

Scale-out ports, direct data paths, storage feed, infrastructure offload and redundancy.

## 171. D8 — Freeze sharing model

Dedicated device, passthrough, partitioning, SR-IOV, temporal sharing and scheduler policy.

## 172. D9 — Freeze rack/facility coupling

Power envelope, transients/caps, cooling, manifold, residual air, weight and service routes.

## 173. D10 — Freeze acceptance and lifecycle

Representative benchmark, telemetry, failure tests, firmware/driver baseline, spares, refresh and rollback.

---

# Part XXIV — Golden visual candidates

## 174. VISUAL 01 — Accelerator Role Stack

`APPLICATION COMPUTE`  
GPU · AI ASIC · FPGA  
↓  
`HOST / MEMORY / PCIe-CXL`  
↓  
`INFRASTRUCTURE OFFLOAD`  
DPU · IPU · SmartNIC  
↓  
`SCALE-UP / SCALE-OUT / STORAGE`  
↓  
`POWER / COOLING / OPERATIONS`

## 175. VISUAL 02 — Data-Movement Topology

`STORAGE ↔ NIC/DPU ↔ PCIe ROOT ↔ GPU HBM ↔ SCALE-UP PEERS`

Overlay:

- CPU/NUMA locality
- PCIe switches/retimers
- peer links
- scale-out NICs
- storage path

## 176. VISUAL 03 — Scale-Up vs Scale-Out Matrix

Show node, baseboard, rack and multi-rack domains with bandwidth/latency/failure boundaries.

## 177. VISUAL 04 — Accelerator Acceptance Chain

`WORKLOAD → SOFTWARE → MEMORY → HOST ATTACH → PEER TOPOLOGY → NETWORK/STORAGE → POWER/THERMAL → SCHEDULING → FAILURE TEST → TCO/LIFECYCLE`

## 178. VISUAL 05 — GPU/DPU Responsibility Matrix

Separate application compute from networking/storage/security/management offload.

---

# Part XXV — Proposed Full Briefing chapters

## 179. K09-00 — Accelerated compute nedir; GPU, DPU, SmartNIC ve FPGA neden aynı şey değildir?

Taxonomy, workload fit and the difference between application compute and infrastructure acceleration.

## 180. K09-01 — GPU compute, precision, HBM capacity ve memory bandwidth

Delivered performance, working set, precision, sparsity and memory behavior.

## 181. K09-02 — PCIe, CXL, NUMA ve accelerator locality

Host attachment, lane budget, switches/retimers, direct paths and locality.

## 182. K09-03 — Scale-up, scale-out ve multi-accelerator topology

Peer fabrics, collective communication, rack-scale domains and network interface boundary.

## 183. K09-04 — DPU, IPU ve SmartNIC gerçekte ne yapar?

Network/storage/security offload, isolation, failure domain and operations.

## 184. K09-05 — Virtualization, partitioning ve accelerator scheduling

Passthrough, SR-IOV, spatial/temporal sharing, Kubernetes Device Plugins and DRA.

## 185. K09-06 — Power, liquid cooling, rack-scale integration ve failure modes

Facility coupling, serviceability, sustained acceptance and FMEA.

## 186. K09-07 — Accelerator platformu nasıl seçilir, benchmark edilir ve BoQ’da freeze edilir?

Workload-to-platform decision chain, TCO, lifecycle, procurement and final acceptance.

---

# Part XXVI — Source register

The source register intentionally distinguishes open standards from vendor implementation examples.

| ID | Class | Source | Use in K09 |
|---|---|---|---|
| R1 | STANDARD | PCI-SIG — PCI Express Base Specification Revision 7.0 — https://pcisig.com/PCIExpress/Spec/Base/_7.0 | Current PCIe base generation and host/device interconnect baseline |
| R2 | STANDARD | PCI-SIG — PCI Express Base specification overview — https://pcisig.com/specification-overview/pci-express-base | Current/previous generation context |
| R3 | OPEN SPEC | Compute Express Link Consortium — CXL Specification — https://computeexpresslink.org/cxl-specification/ | CXL 4.0 coherent connectivity baseline |
| R4 | OPEN SPEC | CXL Consortium — CXL 4.0 release — https://computeexpresslink.org/wp-content/uploads/2025/11/CXL_4.0-Specification-Release_FINAL_Website-Copy.pdf | 128 GT/s, bundled ports, RAS release context |
| R5 | OPEN SPEC | UCIe Consortium — Specifications — https://www.uciexpress.org/specifications | UCIe 3.0 die-to-die/chiplet baseline |
| R6 | OPEN SPEC | OCP — Open Accelerator Infrastructure — https://www.opencompute.org/wiki/Server/OAI | OAI/OAM/UBB/HIB/PDB/SCM/tray/chassis taxonomy |
| R7 | OPEN SPEC | OCP — OAI-OAM Base Specification r2.0 v0.75 — https://www.opencompute.org/documents/oai-oam-base-specification-r2-0-v0-75-2-pdf | Accelerator-module/common-baseboard physical architecture |
| R8 | OPEN SPEC | OCP — Server/NIC — https://www.opencompute.org/wiki/Server/NIC | OCP NIC 3.0 current released specification family |
| R9 | STANDARD | DMTF — Redfish Schema Index — https://redfish.dmtf.org/redfish/schema_index | Accelerator/processor management schema baseline |
| R10 | STANDARD | DMTF — Redfish Developer Essentials — https://redfish.dmtf.org/essentials | Current Redfish release/tooling baseline |
| R11 | PLATFORM DOC | Kubernetes — Dynamic Resource Allocation — https://kubernetes.io/docs/concepts/resource-management/dynamic-resource-allocation/ | Stable ResourceClaim-based device allocation |
| R12 | PLATFORM DOC | Kubernetes — Device Plugins — https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/ | Stable specialized-device advertisement mechanism |
| R13 | PLATFORM DOC | Kubernetes v1.36 DRA update — https://kubernetes.io/blog/2026/05/07/kubernetes-v1-36-dra-136-updates/ | Current device-management direction |
| R14 | BENCHMARK | MLCommons — MLPerf Training — https://mlcommons.org/benchmarks/training/ | Full-system workload benchmark methodology/results context |
| R15 | GUIDANCE | ASHRAE/PNNL/NEMA — AI Data Center Energy Performance Framework — https://www.ashrae.org/technical-resources/ai-data-center-framework | Integrated AI facility/energy/cooling guidance |
| R16 | GUIDANCE | ASHRAE — Integrated Design Principles — https://www.ashrae.org/technical-resources/ai-data-center-framework/integrated-design-principles | Rack-scale power/thermal integration context |
| R17 | GUIDANCE | ASHRAE — Energy and Thermal Efficiency — https://www.ashrae.org/technical-resources/ai-data-center-framework/energy-and-thermal-efficiency | GPU-centric density and liquid-cooling guidance |
| R18 | OPEN SPEC / GUIDANCE | OCP — OAI System Liquid Cooling Guidelines — https://www.opencompute.org/documents/oai-system-liquid-cooling-guidelines-in-ocp-template-mar-3-2023-update-pdf | Accelerator-module liquid-cooling implementation guidance |
| R19 | VENDOR REFERENCE | NVIDIA — DGX GB Rack Scale Systems Hardware — https://docs.nvidia.com/dgx/dgxgb200-user-guide/hardware.html | Current rack-scale GPU integration example |
| R20 | VENDOR REFERENCE | NVIDIA — DGX GB Rack Scale Networking — https://docs.nvidia.com/dgx/dgxgb200-user-guide/networking.html | Scale-up versus scale-out implementation example |
| R21 | VENDOR REFERENCE | NVIDIA — BlueField Platform — https://www.nvidia.com/en-us/networking/products/data-processing-unit/ | DPU networking/storage/security offload example |
| R22 | VENDOR REFERENCE | NVIDIA — GPUDirect RDMA / Storage — https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/gpu-operator-rdma.html | Direct GPU/NIC/storage data-path example |
| R23 | VENDOR REFERENCE | NVIDIA — Multi-Instance GPU User Guide — https://docs.nvidia.com/datacenter/tesla/mig-user-guide/introduction.html | Spatial GPU partition implementation example |
| R24 | VENDOR REFERENCE | NVIDIA — MIG Supported GPUs — https://docs.nvidia.com/datacenter/tesla/mig-user-guide/supported-gpus.html | Current supported-device implementation context |
| R25 | VENDOR REFERENCE | AMD — CDNA Architecture — https://www.amd.com/en/technologies/cdna.html | GPU/HBM/chiplet/fabric implementation example |
| R26 | VENDOR REFERENCE | AMD — Instinct MI300 Architecture — https://rocmdocs.amd.com/en/latest/reference/gpu-arch/mi300.html | Multi-GPU OAM / PCIe / Infinity Fabric topology example |
| R27 | VENDOR REFERENCE | AMD — Instinct Virtualization Driver — https://instinct.docs.amd.com/projects/virt-drv/en/latest/index.html | SR-IOV GPU virtualization example |
| R28 | VENDOR REFERENCE | AMD — GPU Partitioning — https://instinct.docs.amd.com/projects/virt-drv/en/latest/userguides/GPU_partitioning.html | Spatial/temporal partition implementation example |
| R29 | VENDOR REFERENCE | AMD — Pensando DPU — https://www.amd.com/en/products/data-processing-units/pensando.html | Infrastructure offload example |
| R30 | VENDOR REFERENCE | Intel — Infrastructure Processing Unit — https://www.intel.com/content/www/us/en/products/details/networking/ipu.html | IPU offload/isolation example |

---

# Part XXVII — Research conclusions

## 187. Accelerators move the system bottleneck

Accelerated compute does not remove bottlenecks; it moves them. Once arithmetic becomes fast, memory movement, peer communication, network/storage feed, orchestration, power and cooling become first-order constraints.

## 188. Data movement is the architecture

The most valuable topology for K09 is not a box labelled “GPU cluster”. It is the complete data-movement map from storage and NIC/DPU through PCIe/NUMA into accelerator memory and across scale-up/scale-out domains.

## 189. DPU is an infrastructure failure domain

DPU/IPU designs can improve offload and isolation, but they must appear in availability/FMEA just like switches, storage controllers and host CPUs.

## 190. Partitioning improves utilization but changes operations

Partitioning and SR-IOV create scheduling, fragmentation, reset, monitoring and multi-tenant security questions. They are service architecture decisions, not just checkbox features.

## 191. Rack-scale accelerator systems couple IT and facility engineering

Power shelves/busbars, liquid manifolds, scale-up switch trays, management and high-speed network components make the rack an integrated system. K03/K04/K05/K07 interfaces therefore become mandatory dependencies of K09.

## 192. Golden K09 decision statement

**Select the accelerated platform by the workload’s delivered result and end-to-end data path. Freeze GPU/DPU/accelerator quantity only after memory, locality, peer topology, network/storage feed, sharing model, power/cooling envelope, failure behavior, software lifecycle and representative application benchmarks are accepted together.**

---

# Final marker

`DC_K09_GOLDEN_DEEP_RESEARCH = COMPLETE`

**Ready for next production gate:** YES  
**Next production gate:** `DC-K09 Full Narration TR V2 + S3F Golden Audio Pipeline`
