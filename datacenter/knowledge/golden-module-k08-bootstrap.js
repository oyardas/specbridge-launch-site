(()=>{
const K=window.DC_KNOWLEDGE;
if(!K?.modules)return;
if(!K.modules.some(x=>x.id==='DC-K08')){
 K.modules.push({
  id:'DC-K08',track:'Compute & Server',title:'x86 Server Fundamentals',
  subtitle:'CPU/socket, memory bandwidth, NUMA locality, PCIe/CXL, storage, network, BMC/UEFI, power, thermal ve lifecycle',
  status:'research-audio',file:'research/DC-K08_X86_SERVER_FUNDAMENTALS.md',
  audio:'audio/production/tr/dc-k08-quick-v1/k08-quick-x86-server-icin-dogru-karar-cercevesi.mp3',duration:348.624,
  tags:['x86','server','CPU','socket','NUMA','memory','PCIe','CXL','NVMe','network','BMC','UEFI','Redfish','RAS','power','thermal'],
  questions:['Core sayısı gerçek server performansını tek başına açıklar mı?','1S ve 2S hangi workload için doğru seçimdir?','NUMA, memory bandwidth ve I/O locality BoQ tasarımını nasıl değiştirir?']
 });
}
if(Array.isArray(K.roadmap))K.roadmap=K.roadmap.filter(x=>x?.[0]!=='DC-K08');
})();
