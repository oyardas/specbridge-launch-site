(()=>{
const K=window.DC_KNOWLEDGE;
const m=K?.modules?.find(x=>x.id==='DC-K10');
if(!K||!m)return;
K.version='2.0';
K.updated='2026-09-02-dck10-golden-v2-live';
m.status='golden-v2-live';
m.tags=['virtualization','VM','hypervisor','container','OCI','Kubernetes','CRI','CNI','CSI','vCPU','NUMA','overcommit','SR-IOV','passthrough','RuntimeClass','KubeVirt','HA','backup','DR','security','lifecycle','TCO'];
const executionStack=[
 ['WORKLOAD / SERVICE','Application SLA · state · latency · throughput · compliance'],
 ['ORCHESTRATION / CONTROL','Virtualization manager · Kubernetes · scheduler · policy · admission'],
 ['EXECUTION ISOLATION','VM + guest OS · container + OCI runtime · sandboxed runtime'],
 ['RESOURCE / I-O','vCPU · memory · NUMA · vNIC · SR-IOV / passthrough · storage / CSI'],
 ['HOST / FAILURE DOMAIN','Hypervisor or host kernel · physical CPU/memory/NIC/storage · node/rack/cluster']
];
const responsibilityMatrix=[
 ['Isolation boundary','Independent guest kernel and virtual hardware boundary','Processes normally share the host kernel','Validate threat model; do not equate namespace isolation with a VM boundary'],
 ['Boot / lifecycle','Guest OS boots and is patched as an OS instance','Image starts as processes through the runtime','Measure start/recovery time and patch responsibility separately'],
 ['CPU / memory','vCPU topology, reservation, pinning, NUMA and guest memory','Requests/limits, cgroups, CPU manager and pod placement','Validate contention and locality under representative load'],
 ['I/O','vNIC/vHBA, virtual switch, passthrough or SR-IOV','CNI/CSI plus runtime/device integration','Performance shortcuts can reduce mobility or change failure scope'],
 ['Portability','VM image plus firmware/device compatibility','OCI image plus runtime/kernel/platform compatibility','Portable packaging does not guarantee identical runtime behavior'],
 ['Recovery','VM restart, migration, guest/application clustering','Pod restart/reschedule plus application state recovery','Restart is not HA, backup or DR by itself']
];
const resourcePath=[
 ['Scheduler / placement','Physical CPU + NUMA domain','Remote memory, oversubscription or cross-socket traffic','Prove pinning/reservation/locality policy under load'],
 ['VM / container memory','Host memory','Assigned memory is not the same as resident or working-set memory','Measure pressure, reclaim, ballooning/swap behavior where applicable'],
 ['Virtual / pod network','NIC / fabric','Virtual switching, CNI, SR-IOV and passthrough have different overhead/mobility trade-offs','Validate bandwidth, latency, failover and migration compatibility'],
 ['Guest / pod storage','Storage path','CSI, virtual disk, multipath and direct-device choices change state and recovery behavior','Test consistency, path failure, restore and performance together'],
 ['Direct device access','IOMMU / PCIe root / device','Passthrough or SR-IOV can tighten locality while reducing mobility','Map reset scope, NUMA root, driver/firmware and failure ownership']
];
const availabilityLadder=[
 ['Process / container restart','Runtime or orchestrator restarts workload','Process/container failure','Application state loss, node loss or site loss without additional design'],
 ['Pod reschedule / VM restart HA','Scheduler or cluster restarts on another node','Node/host failure when capacity and state permit','Application-level continuity and data consistency'],
 ['Application clustering','Application coordinates replicas, quorum and state','Service/process/node failures within designed domain','Backup retention or site disaster unless explicitly designed'],
 ['Backup / restore','Independent recovery copy and tested restore process','Deletion, corruption and selected cyber/data-loss scenarios','Low RTO continuity unless architecture supports it'],
 ['DR / site recovery','Replicated/recoverable service across defined disaster boundary','Site/region-scale event per tested plan','Unspecified dependencies, stale runbooks or untested RTO/RPO']
];
const contractChain=[
 ['OCI Image','Package filesystem + image configuration','Defines image format; not execution or orchestration'],
 ['OCI Distribution','Move images through registry APIs','Defines distribution contract; not container runtime behavior'],
 ['OCI Runtime','Create/start container from an OCI bundle','Low-level execution contract; not Kubernetes orchestration'],
 ['CRI','Kubelet ↔ container runtime integration','Kubernetes runtime interface; distinct from OCI Runtime Spec'],
 ['CNI','Pod/network attachment contract','Network plugin interface; implementation and dataplane remain platform choices'],
 ['CSI','Container storage integration contract','Storage plugin interface; does not define backend durability or DR'],
 ['RuntimeClass','Select runtime configuration for a Pod','Can choose sandbox/runtime behavior; stronger isolation is not automatic']
];
const maintenanceCapacity=[
 ['Normal production','Serve workload with target headroom','Steady-state utilization envelope','Latency/throughput/SLO under representative load'],
 ['Single host failure','Absorb displaced VM/Pod demand','Failure reserve across CPU, memory, network and storage','Fail node under load and prove recovery without resource collapse'],
 ['Planned maintenance','Drain/migrate while preserving service','Admission, evacuation and temporary capacity reserve','Measure drain/migration time and blocked workloads'],
 ['Rolling upgrade','Mixed-version operation within support matrix','Compatibility and surge capacity','Validate control plane, runtime, CNI/CSI/storage sequence'],
 ['Storage/network degradation','Continue or fail safely through path loss','Redundancy, timeout and retry policy','Inject path/link failure and measure application impact'],
 ['Restore / DR event','Recover state and dependencies','Backup/replication integrity plus operational runbook','Prove RTO/RPO from an actual recovery test']
];
const decisionChain=[
 ['D1','Workload / isolation','Classify state, SLA, trust boundary, device needs and lifecycle'],
 ['D2','Execution model','Select VM, container, sandboxed container or justified hybrid model'],
 ['D3','CPU / memory','Define vCPU, reservation, limits, overcommit, pinning and memory policy'],
 ['D4','NUMA / locality','Map CPU, memory, NIC, storage and direct-device locality'],
 ['D5','Network / storage','Validate virtual/pod network, CNI, CSI, multipath and data path'],
 ['D6','Mobility trade-off','Check live migration/reschedule against SR-IOV and passthrough choices'],
 ['D7','Contracts / versions','Freeze supported hypervisor/runtime/Kubernetes/OCI/CNI/CSI compatibility'],
 ['D8','Security','Validate host hardening, image provenance, runtime policy and isolation boundary'],
 ['D9','Availability','Separate restart, HA, application clustering, backup and DR responsibilities'],
 ['D10','Failure reserve','Size capacity for host loss, maintenance, drain, upgrade and degradation'],
 ['D11','Recovery tests','Execute failure, restore and lifecycle tests under representative workload'],
 ['D12','TCO / BoQ freeze','Freeze exact software editions, support matrix, capacity policy and acceptance criteria']
];
m.golden={
 version:'V2',researchStatus:'COMPLETE',quickAudioStatus:'LIVE',quickAudioQA:'1/1 PASS',fullAudioStatus:'LIVE',fullAudioQA:'8/8 PASS',
 quickDuration:371.448,quickDurationLabel:'6:11',fullDuration:2543.232,fullDurationLabel:'42:23',researchSections:281,sourceCount:35,sourceWords:4427,targetFullMinutes:'42:23',
 quickNarrationFile:'narration/DC-K10_QUICK_NARRATION_TR_V1.md',quickManifest:'audio/production/tr/dc-k10-quick-v1/manifest.json',
 narrationFile:'narration/DC-K10_FULL_NARRATION_TR_V2.md',manifest:'audio/production/tr/dc-k10-v2/manifest.json',
 chapters:[
  ['K10-00','Sanallaştırma nedir; VM, container ve hypervisor neden aynı şey değildir?',298.8,'audio/production/tr/dc-k10-v2/k10-00-sanallastirma-nedir-vm-container-ve-hypervisor-neden-ayni-sey-degildir.mp3','audio/production/tr/dc-k10-v2/k10-00-sanallastirma-nedir-vm-container-ve-hypervisor-neden-ayni-sey-degildir.source.txt'],
  ['K10-01','vCPU, memory, NUMA ve overcommit nasıl gerçekten çalışır?',310.488,'audio/production/tr/dc-k10-v2/k10-01-vcpu-memory-numa-ve-overcommit-nasil-gercekten-calisir.mp3','audio/production/tr/dc-k10-v2/k10-01-vcpu-memory-numa-ve-overcommit-nasil-gercekten-calisir.source.txt'],
  ['K10-02','Virtual network, storage, SR-IOV, passthrough ve live migration',316.368,'audio/production/tr/dc-k10-v2/k10-02-virtual-network-storage-sr-iov-passthrough-ve-live-migration.mp3','audio/production/tr/dc-k10-v2/k10-02-virtual-network-storage-sr-iov-passthrough-ve-live-migration.source.txt'],
  ['K10-03','Container internals, OCI image/runtime ve registry zinciri',311.832,'audio/production/tr/dc-k10-v2/k10-03-container-internals-oci-image-runtime-ve-registry-zinciri.mp3','audio/production/tr/dc-k10-v2/k10-03-container-internals-oci-image-runtime-ve-registry-zinciri.source.txt'],
  ['K10-04','Kubernetes CRI, Pod, RuntimeClass, CNI, CSI ve resource management',329.568,'audio/production/tr/dc-k10-v2/k10-04-kubernetes-cri-pod-runtimeclass-cni-csi-ve-resource-management.mp3','audio/production/tr/dc-k10-v2/k10-04-kubernetes-cri-pod-runtimeclass-cni-csi-ve-resource-management.source.txt'],
  ['K10-05','VM/container availability, security ve stateful workload gerçekleri',301.512,'audio/production/tr/dc-k10-v2/k10-05-vm-container-availability-security-ve-stateful-workload-gercekleri.mp3','audio/production/tr/dc-k10-v2/k10-05-vm-container-availability-security-ve-stateful-workload-gercekleri.source.txt'],
  ['K10-06','Hybrid platform: Kubernetes üzerinde VM, sandboxed containers ve operasyon',329.4,'audio/production/tr/dc-k10-v2/k10-06-hybrid-platform-kubernetes-uzerinde-vm-sandboxed-containers-ve-operasyon.mp3','audio/production/tr/dc-k10-v2/k10-06-hybrid-platform-kubernetes-uzerinde-vm-sandboxed-containers-ve-operasyon.source.txt'],
  ['K10-07','Virtualization/container platformu nasıl seçilir, test edilir ve BoQ’da freeze edilir?',345.264,'audio/production/tr/dc-k10-v2/k10-07-virtualization-container-platformu-nasil-secilir-test-edilir-ve-boqda-fr.mp3','audio/production/tr/dc-k10-v2/k10-07-virtualization-container-platformu-nasil-secilir-test-edilir-ve-boqda-fr.source.txt']
 ],
 executionStack,responsibilityMatrix,resourcePath,availabilityLadder,contractChain,maintenanceCapacity,decisionChain,
 serviceFamilies:executionStack,
 facilityFit:responsibilityMatrix,
 maturity:decisionChain,
 goldenRule:'WORKLOAD / ISOLATION → EXECUTION MODEL → vCPU / MEMORY → NUMA / LOCALITY → NETWORK / STORAGE / DEVICE PATH → MOBILITY TRADE-OFF → OCI / CRI / CNI / CSI + SUPPORT MATRIX → SECURITY → HA / BACKUP / DR → FAILURE & MAINTENANCE RESERVE → RECOVERY TESTS UNDER LOAD → LIFECYCLE / TCO → BoQ FREEZE'
};
})();
