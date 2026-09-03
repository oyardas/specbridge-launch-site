(()=>{
const K=window.DC_KNOWLEDGE;if(!K?.modules)return;
if(!K.modules.some(x=>x.id==='DC-K12'))K.modules.push({id:'DC-K12',track:'Storage',title:'Storage Fundamentals',subtitle:'Block, file, object, media, protocols, capacity, resilience, performance, protection, lifecycle and BoQ freeze',status:'research-audio',file:'research/DC-K12_STORAGE_FUNDAMENTALS.md',audio:'audio/production/tr/dc-k12-quick-v1/k12-quick-storage-icin-dogru-karar-cercevesi.mp3',duration:378.288,tags:['storage','block','file','object','HDD','SSD','NVMe','NVMe-oF','iSCSI','NFS','SMB','Fibre Channel','RAID','erasure coding','capacity','IOPS','latency','backup','DR'],questions:['Block, file ve object ne zaman seçilir?','Raw, usable, resilient usable ve effective capacity neden ayrılmalıdır?','IOPS, throughput ve tail latency nasıl birlikte kabul edilir?']});
if(Array.isArray(K.roadmap))K.roadmap=K.roadmap.filter(x=>x?.[0]!=='DC-K12');
})();
