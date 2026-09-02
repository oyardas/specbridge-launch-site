(()=>{
const K=window.DC_KNOWLEDGE;
if(!K?.modules)return;
if(!K.modules.some(x=>x.id==='DC-K10')){
 K.modules.push({
  id:'DC-K10',track:'Compute & Platform',title:'Virtualization & Containers',
  subtitle:'VM, hypervisor, container runtime, Kubernetes, OCI/CRI/CNI/CSI, NUMA, I/O, security, availability ve lifecycle',
  status:'research-audio',file:'research/DC-K10_VIRTUALIZATION_CONTAINERS.md',
  audio:'audio/production/tr/dc-k10-quick-v1/k10-quick-virtualization-ve-container-platformu-icin-dogru-karar-cercevesi.mp3',duration:371.448,
  tags:['virtualization','VM','hypervisor','container','OCI','Kubernetes','CRI','CNI','CSI','vCPU','NUMA','SR-IOV','availability','security','KubeVirt'],
  questions:['VM, container, hypervisor ve orchestrator neden aynı katman değildir?','vCPU, memory, NUMA ve overcommit performansı nasıl değiştirir?','HA, live migration, backup ve DR neden ayrı kabul zincirleridir?']
 });
}
if(Array.isArray(K.roadmap))K.roadmap=K.roadmap.filter(x=>x?.[0]!=='DC-K10');
})();
