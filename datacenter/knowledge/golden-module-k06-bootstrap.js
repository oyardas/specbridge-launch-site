(()=>{
const K=window.DC_KNOWLEDGE;
if(!K?.modules)return;
if(!K.modules.some(x=>x.id==='DC-K06')){
 K.modules.push({
  id:'DC-K06',track:'Power & Energy',title:'UPS & Energy Storage',
  subtitle:'UPS topologies, autonomy, battery technologies, BMS, safety, BESS ve lifecycle',
  status:'research-audio',file:'research/DC-K06_UPS_ENERGY_STORAGE.md',
  audio:'audio/production/tr/dc-k06-quick-v1/k06-quick-ups-ve-enerji-depolamada-dogru-karar-cercevesi.mp3',duration:334.296,
  tags:['UPS','energy storage','battery','BMS','VRLA','lithium-ion','NiCd','flywheel','supercapacitor','BESS','autonomy','commissioning'],
  questions:['UPS neden yalnız bir cihaz değildir?','Autonomy nasıl gerçekten boyutlandırılır?','UPS battery ile BESS arasındaki sınır nedir?']
 });
}
if(Array.isArray(K.roadmap))K.roadmap=K.roadmap.filter(x=>x?.[0]!=='DC-K06');
})();
