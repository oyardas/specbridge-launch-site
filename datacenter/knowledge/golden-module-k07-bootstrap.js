(()=>{
const K=window.DC_KNOWLEDGE;
if(!K?.modules)return;
if(!K.modules.some(x=>x.id==='DC-K07')){
 K.modules.push({
  id:'DC-K07',track:'Facility & Building',title:'Facility & Building Architecture',
  subtitle:'Site risk, building form, physical diversity, fire/water/security, logistics, AI ve liquid-cooling readiness',
  status:'research-audio',file:'research/DC-K07_FACILITY_BUILDING_ARCHITECTURE.md',
  audio:'audio/production/tr/dc-k07-quick-v1/k07-quick-facility-building-architecture-icin-dogru-karar-cercevesi.mp3',duration:394.824,
  tags:['facility','building','site','white space','structure','MMR','physical diversity','fire','water','security','AI','liquid cooling','retrofit','commissioning'],
  questions:['Bina availability sisteminin fiziksel katmanı mıdır?','A/B yolları gerçekten fiziksel olarak ayrışıyor mu?','AI ve liquid-cooling için bina ne kadar hazır?']
 });
}
if(Array.isArray(K.roadmap))K.roadmap=K.roadmap.filter(x=>x?.[0]!=='DC-K07');
})();
