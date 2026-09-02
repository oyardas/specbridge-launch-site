# DC-K10 — Virtualization & Containers — Golden Deep Research

**Research state:** `DC_K10_GOLDEN_DEEP_RESEARCH = COMPLETE`  
**Research date:** 2026-09-02  
**Scope:** Vendor-neutral compute abstraction from hardware virtualization and VM lifecycle through Linux container isolation, OCI artifacts/runtime, Kubernetes CRI/orchestration, hybrid VM-container platforms, performance locality, security, availability, operations, acceptance, BoQ and lifecycle.  
**Next production stage:** 8-chapter Full Narration TR V2 + independent Quick Brief + S3F audio QA.

---

## Evidence labels used in this module

- **STANDARD** — formal industry specification or standards-body material.
- **OPEN SPEC** — open specification maintained by an industry consortium or open project.
- **PLATFORM DOC** — neutral/open platform or orchestration documentation.
- **SECURITY GUIDANCE** — public security guidance from an authoritative body.
- **VENDOR CLAIM / REFERENCE** — vendor architecture or implementation evidence; not a universal requirement.
- **SPECBRIDGE PLANNING GUIDANCE** — engineering synthesis used to structure decisions; not a standard threshold.

---

# Executive thesis

## 0. Virtualization is a resource and failure-domain architecture, not merely consolidation

The useful design unit is not “how many VMs fit on a host” or “how many containers fit on a node”. It is the end-to-end execution contract:

`WORKLOAD → ISOLATION MODEL → CPU / MEMORY → NUMA / I/O LOCALITY → VIRTUAL NETWORK / STORAGE → RUNTIME → ORCHESTRATION → AVAILABILITY → SECURITY → OBSERVABILITY → PATCH / UPGRADE → BACKUP / RESTORE → ACCEPTANCE → LIFECYCLE`

Virtualization creates abstraction; it does not remove physical constraints. Containers improve packaging and scheduling density; they do not remove kernel, node, network, storage or application dependencies.

## 1. Golden principle

**Choose the isolation and orchestration model from workload behavior, failure tolerance, security boundary, portability requirement and operational model—not from a blanket preference for VM or container.** Freeze the platform only after locality, overcommit, storage/network semantics, migration/restart behavior, image/template lifecycle, security controls and recovery are tested together.

## 2. Canonical distinctions

The following distinctions are frozen for future SpecBridge work:

- `virtual machine ≠ container`
- `hardware virtualization ≠ operating-system-level virtualization`
- `hypervisor ≠ container runtime ≠ orchestrator`
- `vCPU ≠ physical core ≠ hardware thread`
- `CPU reservation ≠ CPU limit ≠ CPU pinning ≠ CPU isolation`
- `assigned memory ≠ resident memory ≠ working set ≠ guaranteed memory`
- `overcommit ≠ guaranteed capacity`
- `ballooning ≠ swapping ≠ application memory reclamation`
- `NUMA-aware placement ≠ automatic locality`
- `virtual NIC ≠ physical path independence`
- `SR-IOV / passthrough ≠ live-migration compatibility`
- `snapshot ≠ backup`
- `live migration ≠ high availability ≠ disaster recovery`
- `VM restart HA ≠ application-level HA`
- `container restart ≠ stateful application recovery`
- `container image ≠ running container`
- `OCI Image Spec ≠ OCI Runtime Spec ≠ OCI Distribution Spec`
- `container runtime ≠ Kubernetes CRI`
- `Pod ≠ container`
- `Kubernetes ≠ hypervisor`
- `CNI ≠ network implementation`
- `CSI ≠ storage implementation`
- `namespace isolation ≠ identical security boundary to a VM`
- `rootless / user namespace ≠ zero host risk`
- `immutable image ≠ stateless workload`
- `replica count ≠ failure-domain diversity`
- `PodDisruptionBudget ≠ protection from involuntary infrastructure failure`
- `KubeVirt VM ≠ container; it is a VM managed through Kubernetes control constructs`
- `RuntimeClass ≠ inherently stronger isolation; the selected runtime implementation determines the boundary`
- `OVF/OVA portability ≠ guaranteed cross-platform operational equivalence`
- `supported Kubernetes version ≠ guaranteed runtime/CNI/CSI/device-plugin compatibility`

## 3. Current-version snapshot used by this research

As of 2026-09-02:

- Kubernetes current active minor: **1.37**, initial release **1.37.0 on 2026-08-26**.
- OCI Runtime Specification current released major/minor baseline: **v1.3.0**.
- OCI Image and Distribution specifications: **v1.1.0** released independently; their version numbers must not be conflated with Runtime Spec versioning.
- containerd **2.3** is an LTS line; project release guidance should be checked against the Kubernetes compatibility matrix before deployment.
- KubeVirt current published release series: **v1.9**, built for Kubernetes v1.36 and supported according to its published matrix.
- CSI specification release stream has reached **v1.13.0**.
- CNI specification document currently identifies **spec v1.1.0**.
- DMTF OVF remains **2.1.1**; age of a standard does not make it obsolete, but implementation support must be verified.
- OASIS Virtio **1.3** is a useful open virtual-I/O specification baseline; implemented device features remain product/version dependent.

---

# Part I — Virtualization taxonomy and boundaries

## 4. Bare metal

Bare metal means the workload operating system executes directly on server hardware without a general-purpose server hypervisor beneath it. Firmware, BMC, IOMMU, NUMA and device drivers still create abstraction layers; “bare metal” does not mean “no software boundary”.

## 5. Full virtual machine

A VM presents virtual CPU, memory, firmware and devices to a guest operating system. The guest owns its kernel lifecycle. This creates a stronger execution boundary than ordinary shared-kernel containers, at the cost of guest OS overhead and more state to operate.

## 6. Type-1 versus Type-2 is insufficient for procurement

The historical Type-1/Type-2 hypervisor distinction is useful conceptually but does not describe cluster management, device model, security hardening, HA, storage integration or lifecycle. Procurement should specify architecture and capabilities rather than relying on this label alone.

## 7. Hardware-assisted virtualization

Modern server virtualization depends heavily on CPU virtualization extensions and IOMMU support. Hardware assistance reduces trapping/emulation overhead but does not guarantee near-native performance for every workload or device path.

## 8. Emulation

Emulation can present a CPU or device model different from the host. It improves compatibility in some scenarios but can impose material performance cost. Emulation capability must not be confused with hardware-assisted virtualization.

## 9. Paravirtualized device model

Paravirtualized devices such as virtio expose an interface optimized for virtual environments rather than imitating a physical legacy device. They can improve I/O efficiency while still requiring driver and migration compatibility.

## 10. OS-level virtualization

Containers isolate processes while normally sharing the host kernel. The isolation primitives, resource controls and filesystem/image model differ fundamentally from a VM with an independent guest kernel.

## 11. Sandbox or VM-backed container runtime

A container can be launched through a RuntimeClass/runtime that adds a VM-like isolation layer. The workload may retain a container packaging model while the execution boundary includes hardware virtualization. This is a third design option, not evidence that VM and container are equivalent.

## 12. MicroVM

A microVM reduces virtual hardware/device surface and startup overhead for selected use cases. “Micro” describes implementation intent, not a universal security or density guarantee.

## 13. Unikernel

A unikernel links application and minimal OS/runtime components into a specialized image. It can reduce footprint and attack surface in selected designs but changes debugging, compatibility and operational practices. It is not the default container or VM model.

## 14. Application virtualization

Application packaging/streaming technologies can abstract an application from aspects of an OS without providing a server VM or Linux container boundary. They are outside K10’s main data-center execution scope.

## 15. Desktop virtualization is adjacent, not identical

VDI uses VM technology but introduces graphics, user-profile, session-broker, endpoint and licensing concerns. K10 principles apply to the virtualization substrate, while desktop-specific service design belongs in a dedicated workload module.

## 16. Control plane versus execution plane

A platform can have a highly available management/control plane while an individual execution node remains a failure domain. Conversely, a healthy execution node can be unusable when the control plane, identity, image registry, DNS or storage control path fails.

## 17. Management domain is part of the architecture

Hypervisor managers, Kubernetes APIs/controllers, registries, certificate authorities and automation systems must appear in availability and backup design. Treating them as “software only” hides critical recovery dependencies.

---

# Part II — VM compute architecture

## 18. vCPU is a scheduling abstraction

A vCPU is a guest-visible CPU execution context scheduled onto host CPU resources. One vCPU does not equal one physical core unless the platform policy deliberately creates such a mapping.

## 19. Physical core and hardware thread are different capacity units

Simultaneous multithreading exposes hardware threads that share core resources. Capacity planning must identify whether host inventory and licensing count cores, threads, sockets or processors.

## 20. CPU overcommit

CPU overcommit increases consolidation when workloads do not peak simultaneously. It also creates queueing and noisy-neighbor risk. The acceptable ratio is workload- and SLO-dependent; there is no universal safe ratio.

## 21. CPU reservation

A reservation protects a minimum schedulable entitlement according to platform semantics. It does not necessarily pin execution to a specific physical CPU.

## 22. CPU limit

A limit caps consumption. A low limit can create latency or throughput problems even when host capacity is idle. Limits must therefore be validated under burst and sustained load.

## 23. CPU shares/weights

Shares or weights govern relative contention behavior. They matter most when multiple workloads compete for constrained CPU resources.

## 24. CPU pinning

Pinning maps vCPU/emulator/I/O threads to selected physical CPUs. It can improve predictability but reduces scheduler flexibility and can create imbalance when locality is wrong.

## 25. Dedicated CPU is not automatically isolated CPU

A workload can receive exclusive CPU allocation while interrupts, kernel housekeeping or emulator work still affect those cores unless the host is engineered for stronger isolation.

## 26. Emulator and I/O threads matter

High-performance VMs can be affected by where QEMU/emulator and I/O threads run, not only by vCPU pinning. Libvirt exposes separate pinning controls because these are distinct execution domains.

## 27. CPU model compatibility

Guest-visible CPU features affect migration. A host-passthrough-like model can expose more host capability but reduce migration portability across heterogeneous CPU generations.

## 28. Baseline CPU model

A cluster CPU baseline can improve migration compatibility by exposing a common feature set. The trade-off is leaving newer instruction-set features unused on newer hosts.

## 29. Heterogeneous clusters require explicit policy

A cluster containing different CPU generations, sockets or NUMA topologies should define placement and migration domains. “Same architecture” is not enough evidence of safe migration.

## 30. Nested virtualization

Running a hypervisor inside a VM is useful for labs, CI and selected platforms. It adds another translation and support boundary and should not be assumed as a production capability unless explicitly validated.

---

# Part III — VM memory, NUMA and locality

## 31. Assigned memory is a configuration value

Configured guest memory is not the same as physical memory currently resident on the host. Host reclamation, sparse allocation and workload behavior can make these values diverge.

## 32. Working set drives performance

The actively used memory working set is more relevant to pressure than nominal VM allocation alone. Acceptance should observe host and guest memory pressure together.

## 33. Memory overcommit

Memory overcommit can improve density but has sharper failure behavior than idle CPU sharing. If reclamation cannot keep pace, the platform can enter swap, severe latency or OOM conditions.

## 34. Ballooning

Balloon drivers provide a mechanism for coordinated guest memory reclamation. Ballooning does not create free capacity without consequence; guest workload behavior determines whether reclaimed pages were truly spare.

## 35. Hypervisor swapping

Host-side swapping can preserve process liveness while destroying latency predictability. It should not be treated as normal capacity for performance-critical services.

## 36. Guest swapping

Guest swap is controlled inside the VM and has different observability and policy. Host and guest swapping can interact badly under pressure.

## 37. Transparent page sharing/deduplication

Memory deduplication can reduce physical usage for similar pages but has CPU, security and predictability trade-offs. Do not assume a fixed saving ratio.

## 38. Huge pages

Huge pages can reduce TLB overhead for selected memory-intensive workloads. They also create reservation, fragmentation and scheduling constraints.

## 39. NUMA node

A NUMA node represents a locality domain where CPU and memory access cost differs from remote nodes. Virtualization cannot erase this physical topology.

## 40. vNUMA

A VM can expose virtual NUMA topology to a guest. That topology should reflect a deliberate mapping to physical NUMA resources for large or latency-sensitive workloads.

## 41. Cross-NUMA execution

A VM whose vCPUs, memory and devices span remote NUMA domains can suffer higher latency and lower effective bandwidth even when headline CPU/RAM capacity is adequate.

## 42. NUMA-aware placement is end-to-end

Locality must include vCPU, guest memory, emulator/I/O threads and high-throughput PCIe devices. Fixing CPU locality alone can leave remote I/O paths.

## 43. Memory hot-add

Hot-add can improve operational flexibility but may change guest NUMA topology and application behavior. Support must be checked per guest OS and workload.

## 44. vCPU hot-add

CPU hot-add is not the same as dynamic application scaling. Some operating systems or applications do not rebalance optimally after topology changes.

## 45. Memory reservation for platform services

Hosts require memory for hypervisor/kernel, management agents, I/O buffers and control components. Sellable/allocatable memory must not equal installed memory.

## 46. Headroom is an availability control

Keeping cluster headroom is necessary for host evacuation, maintenance and failure restart. A cluster at steady-state near 100% committed physical capacity can have no credible N+1 behavior.

## 47. Admission control belongs to HA

HA capacity should be protected by admission or policy rather than assumed to remain free. Otherwise business growth can silently consume failover reserve.

---

# Part IV — Virtual I/O, network and storage

## 48. Device emulation versus paravirtualized I/O

Legacy device emulation maximizes compatibility but may add overhead. Paravirtualized drivers normally provide better virtualized performance when guest support is mature.

## 49. Virtio is an interface family, not a performance guarantee

Virtio standardizes virtual device concepts. Queue configuration, host backend, offloads, NUMA locality and physical NIC/storage still determine delivered performance.

## 50. vNIC is not a physical NIC

A vNIC terminates in a virtual switch, vhost/data path, SR-IOV VF or other backend. Architecture diagrams must show the backend and physical uplink path.

## 51. Virtual switch

A software virtual switch can provide switching, policy, overlays and observability. Its CPU path and failure/upgrade model belong in host capacity design.

## 52. SR-IOV

SR-IOV exposes virtual functions from a physical device. It can reduce software switching overhead and improve deterministic I/O, while introducing device/driver, migration and failure-domain constraints.

## 53. PCI passthrough

Direct assignment gives a VM stronger control of a device and can improve performance. It also couples the VM to host hardware and can constrain snapshot, live migration or HA behavior unless device migration is supported end to end.

## 54. VFIO

VFIO is a Linux userspace framework for secure device assignment with IOMMU mediation. QEMU documents migration support for compatible VFIO devices, demonstrating that passthrough migration is a device-specific capability rather than a universal property.

## 55. IOMMU is a security and locality component

IOMMU translation/isolation protects DMA boundaries and enables device assignment. IOMMU grouping and platform topology must be validated before promising safe passthrough.

## 56. Virtual disk is not a storage SLA

A virtual disk may map to a file, LUN, volume, object-backed layer, local NVMe or distributed storage. Latency, IOPS, throughput, replication and failure semantics come from the complete backend.

## 57. Thin provisioning

Thin provisioning improves utilization but creates an exhaustion failure mode. Allocated virtual capacity can exceed physical capacity only if monitoring, reserve and expansion controls are credible.

## 58. Thick/eager allocation

Pre-allocation can improve predictability for selected workloads but consumes capacity earlier. The storage platform’s exact semantics must be verified.

## 59. Storage multipathing

Multiple paths are useful only when initiator, fabric, target and path policy are configured and tested. Two HBAs or NICs do not automatically create end-to-end path independence.

## 60. Datastore/volume failure domain

A shared storage pool can correlate many VM failures. HA design must identify which hosts, datastores, storage controllers, networks and power domains can fail together.

## 61. Local storage

Local NVMe can deliver high performance but shifts availability to replication at application, distributed-storage or VM-platform level. Live migration may require storage migration or shared-access alternatives.

## 62. Storage migration

Moving VM storage is a data-plane operation with bandwidth, consistency and time implications. It should be tested separately from memory-only live migration.

## 63. CNI and VM networking are not the same layer

Container platforms commonly use CNI plugin contracts; traditional VM platforms use virtual switches/bridges, overlays and SDN constructs. Hybrid platforms may combine both and require explicit boundary mapping.

## 64. CSI and VM storage integration are not the same contract

Kubernetes CSI standardizes orchestrator-to-storage driver operations. A VM platform can use different APIs even when the same physical array provides storage.

---

# Part V — VM availability, migration and recovery

## 65. Live migration

Live migration transfers running VM execution state to another host with limited guest interruption. QEMU documents pre-copy/post-copy and device-state concerns. Success depends on CPU/device compatibility, network, storage and dirty-memory convergence.

## 66. Pre-copy

Pre-copy iteratively transfers memory while the VM continues running, then stops briefly to finish. A high dirty-page rate can prevent fast convergence.

## 67. Post-copy

Post-copy resumes execution on the destination before all memory has moved, fetching remaining pages on demand. It changes failure risk and requires explicit platform support/policy.

## 68. Migration network

Migration can consume substantial bandwidth and should not be assumed harmless on production networks. Dedicated QoS or network paths may be required.

## 69. Migration compatibility is a matrix

CPU features, machine type, firmware, device model, passthrough devices, storage access, network configuration and software versions all affect compatibility.

## 70. Live migration is not HA

Live migration is normally a planned mobility mechanism. A host that fails abruptly may provide no opportunity to migrate its running VMs.

## 71. HA restart

Infrastructure HA commonly detects host failure and restarts VMs on surviving hosts. This restores execution but does not preserve in-memory application state.

## 72. Application HA

Clustering, replication, consensus and stateless service replicas provide application-level continuity. Infrastructure HA and application HA can complement each other but solve different failure layers.

## 73. Fault tolerance

Continuous execution mechanisms that maintain synchronized secondary state are different from restart HA. They carry specific latency, compatibility and cost limits and should not be generalized from vendor terminology.

## 74. Snapshot

A VM snapshot captures selected VM/disk state for a point in time. It can be useful for short operational rollback but is not equivalent to an independent backup.

## 75. Snapshot chain risk

Long snapshot chains can affect performance, capacity and recovery complexity. Snapshot retention must be controlled.

## 76. Backup

A backup should have an independent retention/recovery objective and preferably an independent failure domain. Application consistency must be defined for stateful workloads.

## 77. Crash-consistent versus application-consistent

Crash consistency captures state similar to sudden power loss. Application consistency coordinates application/filesystem state. The acceptance requirement depends on the workload.

## 78. Restore test

Backup success is not recovery evidence. Restore must be tested with time, dependencies, identity/network and application validation.

## 79. DR

Disaster recovery covers a larger failure domain such as site, region or platform loss. VM replication alone is insufficient if identity, network, DNS, secrets, registries or application dependencies are absent at the recovery site.

## 80. RPO/RTO belong to workloads

Infrastructure can provide mechanisms, but application owners must define acceptable data loss and recovery time. One platform-level RPO/RTO value should not be applied blindly to every workload.

---

# Part VI — Container execution fundamentals

## 81. Container is a process isolation model

A Linux container is fundamentally one or more processes running under host-kernel isolation/resource controls with a prepared filesystem and runtime configuration. It does not boot a separate general-purpose guest kernel in the ordinary OCI model.

## 82. Namespace

Linux namespaces isolate views of resources such as process IDs, mounts, networking, users and other kernel domains. Namespaces are a core isolation primitive, not a complete security policy by themselves.

## 83. cgroup

cgroups organize processes and control/account resources. cgroup v2 provides a unified hierarchy and is the current Linux direction; Kubernetes recommends cgroup v2 on supported systems.

## 84. cgroup namespace

A cgroup namespace virtualizes the process view of cgroup paths. This helps avoid leaking host hierarchy details but does not replace resource-controller policy.

## 85. User namespace

User namespaces map container user IDs to different host IDs. Kubernetes user namespaces are stable as of v1.36 and can reduce impact if a container is compromised.

## 86. Mount namespace

Filesystem mount views can be isolated per container/pod. Bind mounts, host paths and device mounts can intentionally cross that boundary and therefore require policy.

## 87. Network namespace

Network namespaces isolate interfaces, routes and network stacks. CNI commonly configures connectivity into these domains, but the network implementation is outside the CNI contract itself.

## 88. PID namespace

PID namespaces isolate process numbering and visibility. Host PID sharing weakens that isolation and should be explicit.

## 89. Linux capabilities

Capabilities split traditional root privilege into narrower privileges. Dropping unnecessary capabilities reduces attack surface; “root inside container” remains a security design choice.

## 90. seccomp

Seccomp restricts system calls. Kubernetes Restricted Pod Security Standards require an allowed seccomp profile rather than Unconfined for Linux workloads.

## 91. LSM controls

SELinux/AppArmor and similar Linux security modules can provide mandatory-access controls beyond namespace/cgroup isolation. Runtime and distribution support must be validated.

## 92. Rootless runtime

Rootless operation reduces host privilege of runtime processes. It can improve isolation but changes networking, storage and device capabilities and is not a universal substitute for hardening.

## 93. Privileged container

A privileged container relaxes multiple isolation controls and can approach host-level authority. It must be treated as an exception with explicit justification.

## 94. Host namespaces

`hostNetwork`, `hostPID`, host paths and device access increase coupling to the node. They can be necessary for infrastructure components but reduce portability and isolation.

## 95. Immutable image

The intended operational pattern is to replace containers from versioned images rather than patch a running container manually. This is an application-delivery model, not proof that the workload has no persistent state.

## 96. Writable layer

Containers normally have a writable runtime layer even when the image is immutable. Data in that layer may be ephemeral and should not be confused with durable application storage.

## 97. Container restart

Restart recreates execution state from image/config plus attached persistent data. In-memory state is lost unless the application externalizes or replicates it.

## 98. Sidecar and multi-container pod

Containers in one Pod share a scheduling/lifecycle boundary and can share network and volumes. They are not independently placed across nodes for HA.

## 99. Container density

Lower per-instance guest-OS overhead can increase density, but kernel memory, page cache, networking, logging, runtime daemons and application requests still consume node resources.

---

# Part VII — OCI image, runtime and registry contracts

## 100. OCI is three specification families

OCI maintains Runtime, Image and Distribution specifications. Procurement and platform documentation should identify which conformance/compatibility claim applies.

## 101. OCI Runtime Specification

Runtime Spec defines configuration, execution environment and lifecycle of a container bundle. v1.3.0 is the current released baseline in this research snapshot.

## 102. Runtime bundle

A runtime bundle includes a root filesystem and runtime configuration such as `config.json`. It is not the same artifact as a registry image manifest.

## 103. OCI Image Specification

Image Spec defines image manifests/indexes, configuration and filesystem layers. It enables interoperable image tooling but does not define cluster scheduling or application HA.

## 104. Image index

An image index can reference platform-specific manifests, enabling multi-architecture image selection. Multi-arch publication still requires application and dependency support for each architecture.

## 105. Content addressing

OCI image content uses digests to identify content. A human-readable tag can move; a digest provides immutable content identity for the referenced object.

## 106. Tag versus digest

Production deployment policy should distinguish convenient tags from digest-pinned integrity. “latest” is not a version-control strategy.

## 107. OCI Distribution Specification

Distribution Spec defines registry client/server behavior for moving content. Registry availability and retention are operational dependencies separate from runtime correctness.

## 108. OCI Image/Distribution v1.1 artifacts

The v1.1 specifications add relationships through `subject`/referrers mechanisms, enabling associated artifacts such as metadata. Support must be verified on both registry and client tooling.

## 109. Registry is a production dependency

A cluster may continue running existing containers when a registry fails but be unable to scale, redeploy or recover nodes. Registry availability belongs in recovery design.

## 110. Image pull cache is not a registry DR strategy

Node caches can reduce pull latency and survive short outages but are incomplete and ephemeral. Critical images need governed registry replication/export/retention.

## 111. Low-level runtime

runc is a widely used OCI runtime implementation. Runtime version and security fixes matter even when operators interact only with Kubernetes or a higher-level runtime.

## 112. High-level runtime

containerd manages image transfer/storage, container execution/supervision and related lifecycle functions. Its CRI plugin can expose Kubernetes CRI.

## 113. Runtime version lifecycle

Runtime branches have different support windows. Selecting a version because it “works today” is insufficient; Kubernetes/runtime compatibility and security maintenance horizon must be frozen together.

---

# Part VIII — Kubernetes execution architecture

## 114. Kubernetes is an orchestrator

Kubernetes schedules and manages Pods across nodes. It relies on node OS/kernel, container runtime, networking, storage and many external integrations.

## 115. Pod is the scheduling unit

A Pod can contain one or more containers and is scheduled as one unit to one node. Containers inside the Pod are not independent HA replicas.

## 116. Node

A Kubernetes node provides compute resources and runs kubelet plus a CRI-compatible runtime. Node failure removes all Pods on that node until controllers recreate eligible workloads elsewhere.

## 117. Control plane

API server, scheduler, controllers and etcd/control-plane state are operational dependencies. Worker capacity alone is not a complete Kubernetes platform.

## 118. CRI

Kubernetes CRI is the stable gRPC protocol between kubelet and container runtime services. CRI is not itself the OCI runtime or container engine.

## 119. CRI implementation

containerd and CRI-O are examples of runtimes implementing CRI. Kubernetes compatibility must be checked against the runtime’s supported version matrix.

## 120. RuntimeClass

RuntimeClass selects a runtime configuration for a Pod. It can support alternative isolation such as hardware-virtualized sandbox runtimes and can declare node scheduling constraints and Pod overhead.

## 121. RuntimeClass overhead

Alternative runtimes may consume additional CPU/memory. Kubernetes can account for declared Pod overhead; capacity models must include it.

## 122. Deployment

Deployment manages replicated, replaceable Pods and rolling updates. It is well suited to stateless or externally stateful services but does not make an application stateless.

## 123. StatefulSet

StatefulSet provides stable identity/ordering patterns for stateful Pods. Application consistency and storage replication remain workload responsibilities.

## 124. DaemonSet

DaemonSet places a Pod on matching nodes, useful for node agents such as networking, storage or monitoring components. DaemonSet resource overhead must be reserved on every eligible node.

## 125. Job and CronJob

Batch execution has completion/retry semantics unlike long-running services. Capacity and disruption policies should reflect workload type.

## 126. Requests

CPU/memory requests influence scheduling and reserved capacity semantics. A cluster with inaccurate requests can be either stranded or overcommitted.

## 127. Limits

Limits constrain runtime consumption. CPU and memory limits have different failure/latency behavior and should be validated rather than applied from a universal template.

## 128. Pod-level resources

Kubernetes 1.37 supports beta Pod-level resource specification for CPU, memory and hugepages. Feature state and support must be checked for the deployed release.

## 129. QoS class

Kubernetes QoS classes are derived from resource configuration and affect eviction behavior. QoS class is not an end-to-end application SLA.

## 130. Node allocatable

Node capacity available to Pods must subtract OS, kubelet, runtime, DaemonSets and reserved resources. Installed RAM/CPU is not equal to sellable allocatable capacity.

## 131. Cluster headroom

Maintenance, node failure and autoscaling delay require spare capacity. A cluster with perfect average utilization can have poor failure recovery if no headroom is protected.

## 132. Version skew and component matrix

Kubernetes has explicit version-skew rules, while CNI/CSI/runtime/device components have their own support matrices. Upgrade design must treat the combination as one tested stack.

---

# Part IX — Container resource locality and specialized workloads

## 133. CPU Manager

Kubernetes CPU Manager can provide exclusive CPU allocation for eligible workloads. Exclusive allocation improves predictability but must still be coordinated with topology and node housekeeping.

## 134. Topology Manager

Topology Manager coordinates CPU, device and memory-related placement hints for latency/high-throughput workloads. Stable availability does not mean every plugin/device participates equally.

## 135. Memory Manager

Memory placement controls can improve NUMA alignment. The workload should still be benchmarked under target node topology.

## 136. Huge pages in Kubernetes

Hugepages are explicit resources and can constrain placement. They should be requested only where the application/runtime stack benefits.

## 137. DRA

Dynamic Resource Allocation is stable since Kubernetes v1.35. It lets workloads claim devices through DeviceClass/ResourceClaim/ResourceSlice constructs.

## 138. Device plugin versus DRA

Device plugins remain an established mechanism for advertising specialized devices. DRA provides richer claim/filter/share/configuration semantics; migration requires driver/platform support.

## 139. CDI

DRA drivers can use Container Device Interface mechanisms to make allocated devices available to containers. Device assignment is therefore a multi-component contract.

## 140. Device locality

GPU, NIC, accelerator and storage device locality can dominate performance. Scheduler acceptance should include NUMA and PCIe topology for sensitive workloads.

## 141. Consumable device capacity

Kubernetes DRA supports evolving shared-capacity models. Feature state must be checked per release before basing production isolation on it.

## 142. Resource fragmentation

Even when aggregate free CPU/RAM/device capacity is high, a workload can remain unschedulable because required resources are not co-located on one eligible node.

## 143. Defragmentation can be disruptive

Moving/restarting workloads to compact free resources creates operational disruption. Scheduling policy and maintenance automation should include this cost.

## 144. Autoscaling latency

Node autoscaling cannot instantly recover a large stateful or device-bound workload. Boot, image pull, storage attach and device initialization time belong in SLO planning.

---

# Part X — Kubernetes network and storage interfaces

## 145. CNI contract

CNI specifies how a runtime invokes network plugins to attach a container network domain. The current specification document identifies v1.1.0. CNI does not define a particular overlay, routing protocol or security policy.

## 146. CNI implementation diversity

Different plugins can use overlays, native routing, eBPF, bridges or cloud APIs. Performance and failure domains depend on the implementation, not the CNI acronym.

## 147. Pod IP is not service availability

A Pod IP identifies one execution instance. Services, ingress/gateway layers, external load balancers and DNS add separate availability and policy domains.

## 148. Network policy

NetworkPolicy API behavior depends on a network implementation that enforces it. Declaring policy objects without implementation validation is not an acceptance test.

## 149. East-west bandwidth

Container density increases the number of endpoints but does not reduce aggregate traffic. Node uplink oversubscription and failure impact should be modelled from workload traffic.

## 150. CSI contract

CSI standardizes storage operations between orchestrators and storage drivers. The current specification stream has reached v1.13.0, but deployed driver compatibility must match the Kubernetes release.

## 151. PersistentVolume/PersistentVolumeClaim

PV/PVC abstract storage lifecycle and claiming. They do not define the backend’s replication, backup or performance guarantees.

## 152. StorageClass

StorageClass expresses provisioning policy. Multiple classes should correspond to materially different operational/service properties, not only marketing names.

## 153. Volume topology

Some storage is accessible only from particular nodes/zones. Scheduler and CSI topology awareness are therefore part of placement correctness.

## 154. Volume snapshot

Kubernetes VolumeSnapshot provides a standardized CSI snapshot API. It remains a snapshot mechanism; independent backup and application-consistency requirements still apply.

## 155. Stateful container backup

Backup should include persistent data plus manifests/configuration/secrets policy and recovery dependencies. Restoring only PVC bytes may not recreate a service.

## 156. Ephemeral storage

Container writable layers, logs and `emptyDir` consume node-local capacity. Ephemeral-storage pressure can evict Pods even when CPU/RAM are healthy.

---

# Part XI — Isolation and security architecture

## 157. VM security boundary

A VM adds a guest-kernel and virtual-hardware boundary. Hypervisor vulnerabilities and management-plane compromise still exist, so “VM” is not synonymous with “secure”.

## 158. Container shared-kernel boundary

Ordinary containers share the host kernel. Kernel attack surface therefore matters across tenants/workloads more directly than with separate guest kernels.

## 159. Isolation strength is workload-specific

A trusted internal microservice and an untrusted multi-tenant code-execution service can require different boundaries. Security architecture should drive runtime choice.

## 160. Pod Security Standards

Kubernetes defines Privileged, Baseline and Restricted policy profiles. Restricted controls include non-root/capability/seccomp constraints, but application and supply-chain security still require additional controls.

## 161. User namespaces

Stable Kubernetes user-namespace support can map container root away from host root and materially reduce selected host-escape impact. It also has compatibility limitations that must be tested.

## 162. Seccomp profile

System-call filtering reduces kernel exposure. Runtime default profiles need version/control governance; “default” is a configuration dependency, not a permanent specification.

## 163. Image provenance

OCI digest identity provides content addressing, but provenance/signature/attestation policies require additional tooling and governance. Digest alone says what content is, not whether it is trusted.

## 164. Registry access control

Registry permissions, token scope, deletion/retention and replication are production security controls. An overly privileged CI identity can become a supply-chain failure domain.

## 165. Secrets

Secret distribution belongs in the execution architecture. Baking credentials into images or VM templates creates persistent uncontrolled copies.

## 166. Host hardening

Hypervisor hosts and Kubernetes nodes should minimize packages/services and use controlled patching. A large general-purpose admin footprint increases attack surface.

## 167. Management-plane isolation

Hypervisor management, Kubernetes API, BMC/OOB and storage/network management should not share an uncontrolled trust boundary with tenant/application traffic.

## 168. Escape risk belongs in FMEA

Container escape, guest-to-host hypervisor exploit and privileged-management compromise are different scenarios with different mitigations and blast radii.

## 169. NIST container guidance remains architectural background

NIST SP 800-190 predates current OCI/Kubernetes releases but remains useful for its component-oriented container security model. Current implementation details must be validated against current platform documentation.

## 170. NIST virtualization guidance is foundational, not a version matrix

SP 800-125/125A discuss virtualization and hypervisor security architecture. They should guide threat modelling, while product-version controls come from current platform documentation.

---

# Part XII — Kubernetes availability and disruption semantics

## 171. Controller reconciliation

Kubernetes controllers continually work toward desired state. Reconciliation is not instantaneous and can be blocked by capacity, storage, networking, registry or policy.

## 172. ReplicaSet/Deployment availability

Multiple replicas improve availability only when they are spread across meaningful failure domains and the service can route around failures.

## 173. Anti-affinity/topology spread

Scheduling policies can distribute replicas across nodes/zones. They require correct topology labels and enough spare capacity.

## 174. PodDisruptionBudget

PDB constrains selected voluntary disruptions. Kubernetes explicitly notes that involuntary disruptions cannot be prevented by PDBs.

## 175. Drain

Node drain uses eviction/recreation workflows for many Pods. Stateful, daemon, local-storage and disruption-constrained workloads require special handling.

## 176. Node failure

A failed node causes running Pods to disappear from service; controllers can recreate replacements if capacity/data dependencies permit. In-memory state on the failed node is not migrated.

## 177. Pod restart versus relocation

A container restart on the same node and recreation on another node have different storage, IP, cache and device implications.

## 178. Stateful quorum

Distributed databases require quorum/replication logic above Kubernetes scheduling. Replica count without fault-domain-aware quorum design can amplify outages.

## 179. Control-plane failure

Existing Pods may continue temporarily when parts of the control plane fail, but scheduling, scaling and configuration changes can stop. Control-plane recovery is therefore a distinct SLO.

## 180. etcd/control state backup

Cluster-state backup is not application-data backup. Both must have separate recovery procedures.

---

# Part XIII — Hybrid VM + container architecture

## 181. Hybrid is a first-class design

Enterprises often need VMs for legacy/stateful/appliance workloads and containers for cloud-native services. A single project can legitimately use both.

## 182. Shared physical infrastructure

VM and container clusters can share server, network and storage standards while retaining separate control planes. Shared hardware does not require one orchestrator.

## 183. Kubernetes-managed VMs

KubeVirt adds VM workloads to Kubernetes, allowing VMs and Pods to use Kubernetes scheduling/control constructs. The VM still runs a guest OS through virtualization.

## 184. KubeVirt is not “VM inside a container” as an architectural simplification

Implementation uses Kubernetes Pods/components around VM execution, but the workload boundary remains a virtual machine. Capacity and security should be modelled accordingly.

## 185. KubeVirt version snapshot

KubeVirt v1.9.0 was released in July 2026 and is built for Kubernetes v1.36 with a published support matrix. A Kubernetes 1.37 deployment must not assume compatibility without checking the current matrix.

## 186. KubeVirt live migration

KubeVirt supports live migration with explicit storage/network/device limitations. Shared RWX storage is a key default requirement for PVC-backed VM live migration in documented scenarios.

## 187. Migration policy

KubeVirt migration policies expose configurable strategies/limits. Policy APIs and feature states must be checked because not every migration control has stable API status.

## 188. VM storage on Kubernetes

VM disks represented through PVC/CSI inherit CSI topology, snapshot and storage-class behavior. VM application consistency remains an additional layer.

## 189. VM networking on Kubernetes

A VM may use primary Pod networking plus secondary networks. CNI/NAD implementation and physical underlay integration determine actual path behavior.

## 190. VM device assignment in Kubernetes

GPU/SR-IOV/host-device assignment combines Kubernetes resource scheduling with hypervisor/device capabilities. Live migration and NUMA locality must be verified for each device path.

## 191. Sandboxed containers and KubeVirt solve different problems

A VM-backed RuntimeClass can strengthen container isolation while preserving container lifecycle semantics. KubeVirt manages full VM workloads. They should not be selected interchangeably.

## 192. Modernization path

Kubernetes-managed VM platforms can support gradual modernization: keep hard-to-containerize applications as VMs while new services use containers. The business case should include operational convergence cost, not only platform consolidation.

---

# Part XIV — Operations and lifecycle

## 193. Golden image/template lifecycle

VM templates should be versioned, patched, tested and reproducible. A template is not a permanent artifact; guest agents, firmware, drivers and bootstrap logic age.

## 194. Container image lifecycle

Images should be rebuilt from controlled source/base images, scanned/verified and promoted through environments. Patching a running container breaks reproducibility.

## 195. Host patching

Hypervisor and Kubernetes node patching requires evacuation/drain capacity. Maintenance planning therefore consumes real cluster headroom.

## 196. Firmware coupling

CPU microcode, BIOS/UEFI, NIC/HBA/GPU firmware can affect virtualization and device behavior. Host lifecycle cannot be managed solely at the OS package layer.

## 197. Runtime patching

runc/containerd/CRI security updates can require coordinated node maintenance. Runtime is not an invisible implementation detail.

## 198. Kubernetes minor upgrades

Kubernetes maintains support windows and version-skew rules. CNI/CSI/runtime/ingress/device integrations must be validated before each minor upgrade.

## 199. API deprecation

Kubernetes APIs evolve. Application manifests, operators and automation should be scanned for deprecated/removed APIs before upgrades.

## 200. VM hardware version/machine type

Virtual hardware compatibility levels can affect migration and feature availability. Upgrade policy must include rollback and cross-host compatibility testing.

## 201. Guest tools/agents

Time sync, quiescing, shutdown, network information and backup integration may depend on guest tools. Missing/outdated agents create silent operational degradation.

## 202. Observability layers

Monitor host/node, hypervisor/runtime, VM/Pod, network, storage and application. One layer can report healthy while another is saturated or failed.

## 203. Capacity telemetry

Track not only utilization but commitments, requests, reservations, allocatable, thin-provisioned storage, unschedulable workloads and failover headroom.

## 204. Configuration drift

Host BIOS, kernel parameters, runtime config, CNI/CSI versions and security profiles can drift. Golden acceptance needs machine-readable inventory where possible.

## 205. Time synchronization

VM hosts, guests, Kubernetes nodes and control planes require reliable time. Time drift can break certificates, logs, distributed consensus and application behavior.

## 206. DNS dependency

Container orchestration and modern applications rely heavily on DNS. DNS capacity and failure modes belong in platform FMEA.

## 207. Certificate lifecycle

Kubernetes, registries, APIs, ingress and management systems use certificates. Expiry/rotation must be monitored and rehearsed.

## 208. License lifecycle

Virtualization software, guest OS and commercial Kubernetes components can have socket/core/node/VM/vCPU or subscription metrics. Architecture changes can alter licensing cost materially.

---

# Part XV — Performance engineering and benchmarking

## 209. Consolidation ratio is an output

Do not start with a target such as “20 VMs per host”. Derive density from workload CPU, memory working set, I/O, latency, availability reserve and failure behavior.

## 210. Average utilization is not enough

Capacity must include concurrent peak, burst, batch windows and failure redistribution. P95/P99 and seasonal patterns can matter more than averages.

## 211. Noisy neighbor

Shared CPU cache, memory bandwidth, storage queues and network uplinks create contention even when individual resource limits appear correct.

## 212. Steal/ready time concepts

Hypervisor CPU scheduling delay should be observed with guest CPU metrics. A guest can show high CPU demand while the host scheduler is the real bottleneck.

## 213. Container throttling

CPU limits can throttle containers even on a host with spare CPU. Application latency should be correlated with cgroup throttling metrics.

## 214. Memory pressure acceptance

Test what happens when node/host memory approaches policy thresholds: ballooning, eviction, OOM and application recovery should be observed deliberately.

## 215. Storage acceptance

Measure latency distribution, IOPS, throughput and recovery under normal and degraded paths. Synthetic sequential throughput alone is insufficient.

## 216. Network acceptance

Measure east-west throughput, latency, packet loss, connection scale and failover while using the actual virtual/CNI data path.

## 217. Migration benchmark

Record migration time, downtime, bandwidth, dirty-memory behavior and application impact. “Migration succeeded” is not enough.

## 218. Restart benchmark

Measure VM HA restart and Pod rescheduling separately, including image pull, storage attach/mount, readiness and application warm-up.

## 219. Failure-under-load

Repeat failure tests while the platform is loaded. Spare capacity and control-plane behavior can look very different from idle tests.

---

# Part XVI — FMEA seeds

## 220. FMEA-01 — Single hypervisor host fails

**Effect:** all VMs on host stop.  
**Controls:** HA restart, protected cluster headroom, application replication.  
**Acceptance:** fail a host under representative load and measure recovery.

## 221. FMEA-02 — Kubernetes worker node fails

**Effect:** Pods on node disappear; replacements depend on controller/capacity/storage.  
**Controls:** replica spread, headroom, stateful replication.  
**Acceptance:** hard node failure, not only graceful drain.

## 222. FMEA-03 — CPU overcommit saturation

**Effect:** VM latency and scheduling delay.  
**Controls:** reservations, density policy, telemetry.  
**Acceptance:** sustained concurrent peak test.

## 223. FMEA-04 — Host memory pressure

**Effect:** balloon/swap/OOM or VM degradation.  
**Controls:** admission, reserve, alerts, workload tiers.  
**Acceptance:** controlled pressure test.

## 224. FMEA-05 — Kubernetes memory pressure

**Effect:** Pod eviction/OOM/restart.  
**Controls:** requests/limits, node reserve, QoS, app resiliency.  
**Acceptance:** pressure and recovery test.

## 225. FMEA-06 — NUMA misplacement

**Effect:** increased latency/lower bandwidth.  
**Controls:** topology policies, pinning, placement.  
**Acceptance:** topology + benchmark evidence.

## 226. FMEA-07 — Shared datastore fails

**Effect:** many VMs unavailable simultaneously.  
**Controls:** storage HA/replication, failure-domain design.  
**Acceptance:** controller/path/fabric failure tests.

## 227. FMEA-08 — CSI backend unavailable

**Effect:** Pod attach/mount/provision fails; stateful recovery blocked.  
**Controls:** storage HA, retry/timeout design, topology.  
**Acceptance:** recreate stateful workload during backend/path failure.

## 228. FMEA-09 — Registry unavailable

**Effect:** new Pods/nodes cannot pull missing images.  
**Controls:** registry HA/replication/cache governance.  
**Acceptance:** node replacement while primary registry is unavailable.

## 229. FMEA-10 — CNI plugin/control path fails

**Effect:** new Pod networking or policy programming fails.  
**Controls:** HA, monitoring, rollback.  
**Acceptance:** deploy/restart workload during component failure.

## 230. FMEA-11 — Migration network congested

**Effect:** slow/non-converging VM migration and production impact.  
**Controls:** dedicated/QoS path, rate/concurrency limits.  
**Acceptance:** simultaneous migration under load.

## 231. FMEA-12 — CPU incompatibility blocks migration

**Effect:** maintenance/HA mobility restricted.  
**Controls:** cluster CPU baseline/domain policy.  
**Acceptance:** migration across oldest/newest supported hosts.

## 232. FMEA-13 — Passthrough device blocks mobility

**Effect:** VM/Pod cannot migrate or reschedule equivalently.  
**Controls:** explicit device-aware HA plan.  
**Acceptance:** device failure + node maintenance scenario.

## 233. FMEA-14 — Thin storage exhausts physical capacity

**Effect:** write failures, VM/Pod corruption/outage risk.  
**Controls:** reserve, forecast, hard alert, auto-expansion where safe.  
**Acceptance:** threshold and emergency runbook test.

## 234. FMEA-15 — Snapshot chain grows uncontrolled

**Effect:** capacity/performance/recovery complexity.  
**Controls:** retention limits, consolidation monitoring.  
**Acceptance:** aged snapshot cleanup test.

## 235. FMEA-16 — Control plane loses quorum

**Effect:** management/reconciliation/scheduling impaired.  
**Controls:** quorum-aware placement and recovery.  
**Acceptance:** loss of one control-plane member and defined larger-failure drill.

## 236. FMEA-17 — Certificate expires

**Effect:** API/registry/cluster communications fail.  
**Controls:** expiry monitoring, automated rotation, runbook.  
**Acceptance:** staged rotation before production.

## 237. FMEA-18 — Runtime security defect

**Effect:** node compromise/escape risk or emergency maintenance.  
**Controls:** supported runtime branch, rapid patch process.  
**Acceptance:** patch one node, drain/upgrade/rollback evidence.

## 238. FMEA-19 — Bad image/template release

**Effect:** fleet-wide application failure.  
**Controls:** immutable versioning, staged rollout, rollback.  
**Acceptance:** rollback to previous digest/template.

## 239. FMEA-20 — Backup exists but restore dependency missing

**Effect:** nominal backup cannot restore service.  
**Controls:** end-to-end restore test including identity/network/secrets.  
**Acceptance:** isolated recovery exercise.

---

# Part XVII — BoQ and specification fields

## 240. VM platform BoQ must include host topology

Minimum fields:

- CPU model/socket/core topology
- installed and allocatable memory
- NUMA topology
- PCIe/NIC/HBA/device topology
- boot/storage layout
- management/OOB connectivity
- firmware baseline
- hypervisor/platform version and support term

## 241. VM software fields

Specify:

- hypervisor build/version
- management/control-plane components
- HA/migration feature scope
- API/automation support
- backup integration
- monitoring/log integration
- licensing metric
- upgrade/rollback policy

## 242. VM workload policy fields

Define:

- vCPU sizing/overcommit policy
- reservation/limit/share policy
- memory overcommit/reclamation policy
- NUMA/vNUMA policy
- hugepage/pinning rules
- virtual device model
- passthrough/SR-IOV policy
- template/guest-agent standard

## 243. Kubernetes node BoQ fields

Specify:

- OS/kernel distribution/version
- CPU/RAM/NUMA
- node system/kube reserve
- cgroup v2 status
- container runtime/version
- kubelet/Kubernetes version
- CNI plugin/version
- CSI driver/version
- device plugins/DRA drivers
- supported RuntimeClass configurations

## 244. Kubernetes control-plane fields

Specify:

- topology/member count
- etcd/control-state protection
- API load balancing
- certificate/PKI lifecycle
- backup/restore method
- logging/audit
- upgrade ownership
- management network dependency

## 245. Registry fields

Specify:

- OCI compatibility/conformance claim
- HA/replication
- storage backend
- retention/immutability
- identity/RBAC
- vulnerability/provenance integration
- backup/restore
- air-gap/export/import method

## 246. Network fields

Specify:

- CNI/virtual-switch architecture
- pod/VM/service CIDRs
- MTU
- overlay/native-routing behavior
- north-south and east-west paths
- network policy enforcement
- load balancer/gateway integration
- SR-IOV/passthrough paths
- failure domains

## 247. Storage fields

Specify:

- CSI/VM storage driver
- StorageClass/datastore/service tiers
- topology and multipath
- snapshot/clone behavior
- replication
- backup integration
- expansion
- encryption
- latency/IOPS/throughput acceptance

## 248. Availability fields

Specify separately:

- host/node failure behavior
- planned maintenance behavior
- VM live migration
- VM HA restart
- Pod reschedule
- application HA requirement
- control-plane HA
- storage/network failure behavior
- site DR

## 249. Security fields

Specify:

- management-plane segmentation
- node/hypervisor hardening
- privileged workload policy
- Pod Security profile
- seccomp/LSM/user-namespace policy
- registry trust/provenance
- secrets handling
- audit/log retention
- patch SLA

## 250. Acceptance fields

Every material feature needs a measurable acceptance test. “Supported” should be replaced by evidence of configuration, test conditions and observed result.

---

# Part XVIII — Decision matrices

## 251. VM-first workload indicators

VM is often the stronger default when:

- workload requires a full independent guest OS/kernel
- commercial software certification is tied to OS/VM topology
- appliance image is VM-based
- legacy operational model depends on VM-level backup/migration
- strong tenant/kernel separation outweighs startup/density goals
- application is difficult to repackage safely

These are indicators, not universal rules.

## 252. Container-first workload indicators

Container is often the stronger default when:

- application is designed for immutable/reproducible deployment
- horizontal replicas and declarative orchestration are natural
- fast rollout/rollback and CI/CD integration matter
- state is externalized or managed by a container-aware stateful design
- shared-kernel isolation satisfies security requirements
- portability across compatible runtime/orchestration environments matters

## 253. Sandbox-runtime indicators

VM-backed/sandboxed container runtime is useful when container workflow is desired but stronger workload isolation is required and the additional overhead/compatibility constraints are acceptable.

## 254. Kubernetes-managed VM indicators

KubeVirt-like architecture is useful when VM and container operations should converge around Kubernetes APIs/workflows and the organization accepts the operational coupling and support matrix.

## 255. Dedicated platform versus converged platform

Convergence can reduce tool sprawl but increases blast radius if one control plane owns all workload types. Dedicated platforms can isolate risk but duplicate skills and management. Decision should use operational capability and failure-domain analysis.

## 256. Performance versus mobility matrix

- default virtual/paravirtualized devices: more mobility, usually more software path
- SR-IOV/passthrough: lower overhead/predictable I/O, potentially less mobility
- CPU pinning/hugepages: more determinism, less placement flexibility
- aggressive overcommit: higher density, less deterministic performance

## 257. Density versus recovery matrix

Higher steady-state density reduces spare capacity available for host/node failure and maintenance. Economic optimization must include the capacity held for credible recovery.

## 258. Standardization versus newest feature

A stable, homogeneous cluster can be operationally safer than a heterogeneous fleet exposing every new CPU/device capability. New features should enter after compatibility and recovery testing.

---

# Part XIX — Golden visual candidates

## 259. VISUAL 01 — Execution Isolation Stack

`APPLICATION`  
↓  
`CONTAINER PROCESS / FULL GUEST OS`  
↓  
`OCI RUNTIME / HYPERVISOR`  
↓  
`HOST KERNEL / VIRTUAL DEVICE MODEL`  
↓  
`CPU · MEMORY · NUMA · IOMMU · NIC · STORAGE`

Overlay three paths:

- VM
- ordinary shared-kernel container
- VM-backed/sandboxed container

## 260. VISUAL 02 — VM vs Container Responsibility Matrix

Rows:

- kernel
- image/template
- CPU/memory
- network
- storage
- identity/secrets
- patching
- HA/restart
- backup
- portability
- security boundary

Columns:

- bare metal
- VM
- container
- sandboxed container
- Kubernetes-managed VM

## 261. VISUAL 03 — Resource & Locality Path

`WORKLOAD → vCPU/CPU REQUEST → PHYSICAL CPU → NUMA MEMORY → PCIe/IOMMU → NIC/STORAGE/ACCELERATOR`

Show where overcommit, pinning, hugepages, SR-IOV and DRA alter flexibility.

## 262. VISUAL 04 — Availability Ladder

`PROCESS RESTART → POD/VM RESTART → NODE/HOST FAILOVER → APPLICATION REPLICATION → STORAGE/NETWORK REDUNDANCY → SITE DR`

Golden message: higher layers are not implied by lower layers.

## 263. VISUAL 05 — Container Contract Chain

`SOURCE → BUILD → OCI IMAGE → REGISTRY/DISTRIBUTION → CRI/HIGH-LEVEL RUNTIME → OCI RUNTIME → POD/RUNTIMECLASS → CNI/CSI/DEVICE → NODE → OBSERVABILITY → UPDATE/ROLLBACK`

## 264. VISUAL 06 — Maintenance & Recovery Capacity

Show steady-state workload, reserved system capacity, maintenance evacuation reserve and one-node failure reserve. Demonstrate why 100% allocatable consumption is not HA capacity planning.

---

# Part XX — Proposed Full Briefing chapters

## 265. K10-00 — Sanallaştırma nedir; VM, container ve hypervisor neden aynı şey değildir?

Bare metal, full VM, OS-level containers, sandboxed runtimes and the correct abstraction boundaries.

## 266. K10-01 — vCPU, memory, NUMA ve overcommit nasıl gerçekten çalışır?

CPU scheduling, reservations/limits/pinning, memory reclamation, hugepages and locality.

## 267. K10-02 — Virtual network, storage, SR-IOV, passthrough ve live migration

Virtual I/O paths, virtio, IOMMU, storage semantics, mobility and device constraints.

## 268. K10-03 — Container internals, OCI image/runtime ve registry zinciri

Namespaces, cgroup v2, user namespaces, OCI specifications, runc/containerd and image lifecycle.

## 269. K10-04 — Kubernetes CRI, Pod, RuntimeClass, CNI, CSI ve resource management

Node/control-plane architecture, requests/limits, topology managers, DRA and interface boundaries.

## 270. K10-05 — VM/container availability, security ve stateful workload gerçekleri

HA versus application HA, snapshots/backups, PDB limits, stateful recovery and security boundaries.

## 271. K10-06 — Hybrid platform: Kubernetes üzerinde VM, sandboxed containers ve operasyon

KubeVirt, mixed workloads, migration, VM storage/network, upgrade and lifecycle.

## 272. K10-07 — Virtualization/container platformu nasıl seçilir, test edilir ve BoQ’da freeze edilir?

Decision matrices, capacity/headroom, FMEA, acceptance, TCO, lifecycle and procurement freeze.

---

# Part XXI — Source register

The source register intentionally separates specifications, current platform documentation and older but still useful security guidance. Current product/version capability must always be checked against the deployed implementation.

| ID | Class | Source | Use in K10 |
|---|---|---|---|
| R1 | PLATFORM DOC | Kubernetes — Kubernetes 1.37 release series — https://kubernetes.io/releases/1.37/ | Current Kubernetes release baseline as of research date |
| R2 | PLATFORM DOC | Kubernetes — Container Runtime Interface — https://kubernetes.io/docs/concepts/containers/cri/ | Kubelet-to-runtime CRI boundary |
| R3 | PLATFORM DOC | Kubernetes — RuntimeClass — https://kubernetes.io/docs/concepts/containers/runtime-class/ | Alternate runtime selection, scheduling and overhead |
| R4 | PLATFORM DOC | Kubernetes — About cgroup v2 — https://kubernetes.io/docs/concepts/architecture/cgroups/ | Current Kubernetes cgroup direction/requirements |
| R5 | PLATFORM DOC | Kubernetes — Resource managers — https://kubernetes.io/docs/concepts/resource-management/resource-managers/ | CPU/Topology resource-management baseline |
| R6 | PLATFORM DOC | Kubernetes — Dynamic Resource Allocation — https://kubernetes.io/docs/concepts/resource-management/dynamic-resource-allocation/ | Stable DRA device allocation |
| R7 | PLATFORM DOC | Kubernetes — User Namespaces — https://kubernetes.io/docs/concepts/workloads/pods/user-namespaces/ | Stable user-namespace isolation model |
| R8 | PLATFORM DOC | Kubernetes — Pod Security Standards — https://kubernetes.io/docs/concepts/security/pod-security-standards/ | Privileged/Baseline/Restricted controls |
| R9 | PLATFORM DOC | Kubernetes — Resource Management for Pods and Containers — https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/ | Requests/limits/Pod-level resource semantics |
| R10 | PLATFORM DOC | Kubernetes — Disruptions — https://kubernetes.io/docs/concepts/workloads/pods/disruptions/ | PDB and voluntary/involuntary disruption boundaries |
| R11 | PLATFORM DOC | Kubernetes — Volumes — https://kubernetes.io/docs/concepts/storage/volumes/ | CSI/PV volume integration context |
| R12 | PLATFORM DOC | Kubernetes — Volume Snapshots — https://kubernetes.io/docs/concepts/storage/volume-snapshots/ | CSI snapshot API and topology context |
| R13 | OPEN SPEC | Open Container Initiative — Runtime Specification — https://specs.opencontainers.org/runtime-spec/ | OCI runtime configuration/execution/lifecycle baseline |
| R14 | OPEN SPEC | OCI — Runtime Spec v1.3.0 release — https://opencontainers.org/posts/blog/2025-11-04-oci-runtime-spec-v1-3/ | Current released Runtime Spec version |
| R15 | OPEN SPEC | OCI — Image Specification — https://specs.opencontainers.org/image-spec/ | Image manifest/index/layer/config model |
| R16 | OPEN SPEC | OCI — Image and Distribution Specs v1.1 — https://opencontainers.org/posts/blog/2024-03-13-image-and-distribution-1-1/ | v1.1 artifact/referrer and distribution evolution |
| R17 | OPEN SPEC | OCI — Open Container Initiative overview — https://opencontainers.org/ | Runtime/Image/Distribution separation |
| R18 | PLATFORM DOC | Linux kernel — Control Group v2 — https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v2.html | Authoritative cgroup v2 design/interface |
| R19 | PLATFORM DOC | Linux kernel — KVM API — https://docs.kernel.org/virt/kvm/api.html | Hardware virtualization/KVM API baseline |
| R20 | OPEN SPEC | OASIS — Virtual I/O Device (VIRTIO) Version 1.3 — https://docs.oasis-open.org/virtio/virtio/v1.3/virtio-v1.3.html | Open paravirtualized-device interface baseline |
| R21 | PLATFORM DOC | QEMU — Migration — https://www.qemu.org/docs/master/devel/migration/ | Live-migration architecture and capability context |
| R22 | PLATFORM DOC | QEMU — VFIO device migration — https://www.qemu.org/docs/master/devel/migration/vfio.html | Passthrough/device migration constraints |
| R23 | PLATFORM DOC | libvirt — Domain XML format — https://libvirt.org/formatdomain.html | vCPU pinning, CPU models, NUMA and domain configuration |
| R24 | STANDARD | DMTF — Open Virtualization Format 2.1.1 — https://www.dmtf.org/standards/ovf | VM package/portability specification baseline |
| R25 | OPEN SPEC | CNI — Container Network Interface Specification — https://github.com/containernetworking/cni/blob/main/SPEC.md | Runtime-to-network-plugin contract; current spec document 1.1.0 |
| R26 | OPEN SPEC | CSI — Container Storage Interface releases — https://github.com/container-storage-interface/spec/releases | Current CSI specification release stream |
| R27 | PLATFORM DOC | containerd — Releases — https://containerd.io/releases/ | Runtime support/EOL and Kubernetes compatibility matrix |
| R28 | PLATFORM DOC | containerd — CRI documentation — https://containerd.io/docs/2.2/cri/ | containerd CRI architecture baseline |
| R29 | PLATFORM DOC | OpenContainers runc — Releases — https://github.com/opencontainers/runc/releases | Low-level runtime lifecycle/security evidence |
| R30 | PLATFORM DOC | KubeVirt — Release Notes — https://kubevirt.io/user-guide/release_notes/ | Current Kubernetes-managed VM release/support context |
| R31 | PLATFORM DOC | KubeVirt — Live Migration — https://kubevirt.io/user-guide/compute/live_migration/ | VM migration behavior/limitations in Kubernetes |
| R32 | PLATFORM DOC | KubeVirt — Project overview — https://kubevirt.io/ | VM and container workload convergence model |
| R33 | SECURITY GUIDANCE | NIST SP 800-125 — Guide to Security for Full Virtualization Technologies — https://csrc.nist.gov/pubs/sp/800/125/final | Hypervisor/full-virtualization security architecture |
| R34 | SECURITY GUIDANCE | NIST SP 800-190 — Application Container Security Guide — https://csrc.nist.gov/pubs/sp/800/190/final | Container component/threat model guidance |
| R35 | PLATFORM DOC | Kubernetes — Storage Capacity — https://kubernetes.io/docs/concepts/storage/storage-capacity/ | CSI topology/capacity-aware scheduling context |

---

# Part XXII — Research conclusions

## 273. VM and container solve different abstraction problems

VMs virtualize a machine/guest-OS boundary; ordinary containers virtualize/isolate processes around a shared kernel and package application dependencies. Modern platforms can combine them, but the operational and security contracts remain different.

## 274. Locality survives abstraction

vCPU, virtual memory, virtual NIC and virtual disk do not remove CPU cache, NUMA, memory bandwidth, PCIe, NIC or storage topology. Performance engineering must map the virtual object back to the physical path.

## 275. Availability is layered

Migration, VM restart, Pod reschedule, application replication, storage/network redundancy and site DR are separate mechanisms. A platform is not “HA” until the required workload failure scenarios are explicitly mapped and tested.

## 276. Containers shift lifecycle to images and control-plane contracts

OCI, registry, CRI, runtime, CNI, CSI and Kubernetes become a dependency chain. Standard interfaces improve portability, but deployed versions and implementation behavior still have to be frozen as one tested stack.

## 277. Density must include failover reserve

The economically correct consolidation ratio is not maximum steady-state occupancy. It is the highest density that still satisfies maintenance, one-node/host failure, performance and recovery objectives.

## 278. Security boundary should select runtime

Ordinary container, user-namespace/rootless container, sandboxed VM-backed runtime and full VM provide different isolation/compatibility trade-offs. Use the strongest boundary justified by threat model and workload constraints—not one universal platform rule.

## 279. Hybrid is legitimate

A mature data center can operate bare metal, VMs and containers simultaneously. The goal is not to force every workload into one abstraction; it is to standardize physical infrastructure, observability, security, backup and lifecycle while choosing the correct execution model per workload.

## 280. Golden K10 decision statement

**Freeze virtualization/container architecture only after workload isolation requirements, CPU/memory/NUMA locality, I/O path, runtime/orchestrator compatibility, state/recovery model, maintenance headroom, security boundary and end-to-end failure tests are accepted together. Do not procure a platform from consolidation ratio, VM count, container count or “Kubernetes support” alone.**

---

# Final marker

`DC_K10_GOLDEN_DEEP_RESEARCH = COMPLETE`

**Research sections:** `281 numbered sections (0–280)`  
**Source register:** `R1–R35`  
**FMEA seeds:** `20`  
**Full Narration plan:** `K10-00 … K10-07`  
**Ready for next production gate:** YES  
**Next production gate:** `DC-K10 Full Narration TR V2 + S3F Golden Audio Pipeline`
