(()=>{
const K=window.DC_KNOWLEDGE;
if(!K?.modules)return;
if(!K.modules.some(x=>x.id==='DC-K11')){
 K.modules.push({
  id:'DC-K11',track:'Compute & Platform',title:'Hyperconverged Infrastructure (HCI)',
  subtitle:'Distributed storage, quorum, failure domains, resilient usable capacity, network, lifecycle, backup/DR, sizing and TCO',
  status:'research-audio',file:'research/DC-K11_HCI.md',
  audio:'audio/production/tr/dc-k11-quick-v1/k11-quick-hci-icin-dogru-karar-cercevesi.mp3',duration:320.064,
  tags:['HCI','hyperconverged','distributed storage','quorum','witness','failure domain','replication','erasure coding','resilient usable capacity','rebuild','east-west','backup','DR','lifecycle','TCO'],
  questions:['HCI neden yalnızca server ve disk değildir?','Raw, usable ve resilient usable capacity neden aynı şey değildir?','Quorum, witness, failure domain ve rebuild reserve nasıl birlikte tasarlanır?']
 });
}
if(Array.isArray(K.roadmap))K.roadmap=K.roadmap.filter(x=>x?.[0]!=='DC-K11');
})();
