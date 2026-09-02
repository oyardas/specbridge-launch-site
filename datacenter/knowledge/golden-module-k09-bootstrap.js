(()=>{
const K=window.DC_KNOWLEDGE;
if(!K?.modules)return;
if(!K.modules.some(x=>x.id==='DC-K09')){
 K.modules.push({
  id:'DC-K09',track:'Compute & Server',title:'Accelerated Compute / GPU / DPU',
  subtitle:'GPU compute, HBM, PCIe/CXL locality, scale-up/scale-out, DPU offload, virtualization, scheduling, power ve liquid cooling',
  status:'research-audio',file:'research/DC-K09_ACCELERATED_COMPUTE_GPU_DPU.md',
  audio:'audio/production/tr/dc-k09-quick-v1/k09-quick-accelerated-compute-icin-dogru-karar-cercevesi.mp3',duration:379.488,
  tags:['accelerated compute','GPU','DPU','IPU','SmartNIC','FPGA','HBM','PCIe','CXL','NUMA','scale-up','scale-out','virtualization','scheduling','liquid cooling'],
  questions:['GPU, DPU, IPU ve SmartNIC neden aynı ürün sınıfı değildir?','Peak accelerator throughput neden delivered application performance değildir?','Scale-up, scale-out, locality, power ve cooling BoQ kararını nasıl değiştirir?']
 });
}
if(Array.isArray(K.roadmap))K.roadmap=K.roadmap.filter(x=>x?.[0]!=='DC-K09');
})();
