(()=>{
const K=window.DC_KNOWLEDGE;if(!K?.modules)return;
if(!K.modules.some(x=>x.id==='DC-K13'))K.modules.push({id:'DC-K13',track:'Storage',title:'Enterprise Storage & NVMe-oF',subtitle:'Enterprise storage architectures, NVMe subsystem semantics, NVMe-oF transports, multipath, resilience, performance and lifecycle',status:'research-audio',file:'research/DC-K13_ENTERPRISE_STORAGE_NVME_OF.md',audio:'audio/production/tr/dc-k13-quick-v1/k13-quick-enterprise-storage-ve-nvme-of-icin-dogru-karar-cercevesi.mp3',duration:373.704,tags:['enterprise storage','NVMe','NVMe-oF','TCP','RDMA','Fibre Channel','namespace','subsystem','multipath','ANA','scale-up','scale-out','latency','resilience'],questions:['Scale-up ve scale-out storage hangi koşullarda seçilir?','NVMe-oF transport seçimi hangi operasyon ve failure-domain kriterlerine dayanmalıdır?','Multipath, ANA ve degraded-state acceptance nasıl kanıtlanır?']});
if(Array.isArray(K.roadmap))K.roadmap=K.roadmap.filter(x=>x?.[0]!=='DC-K13');
})();
