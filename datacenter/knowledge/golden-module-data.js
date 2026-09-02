(()=>{
const K=window.DC_KNOWLEDGE;
const m=K?.modules?.find(x=>x.id==='DC-K03');
if(!K||!m)return;
K.version='1.5';
K.updated='2026-09-02-dck03-golden-v2-live';
m.status='golden-v2-live';
m.tags=['rack','cabinet','OCP','ORv3','MGX','ORW','power','airflow','liquid cooling','serviceability','AI'];
const interfaceAxes=[
 ['MECHANICAL INTERFACE','19-inch / U · OpenU · MGX-adapted · Open Rack Wide'],
 ['ENCLOSURE FORM','Open rack · Enclosed cabinet · Secure colo cabinet · Rack-scale appliance'],
 ['POWER DELIVERY','A/B AC rPDU · High-current 3-phase · Power shelf + DC busbar'],
 ['THERMAL INTERFACE','Air · RDHx · Direct-to-chip · Rack manifold / CDU'],
 ['OPERATING MODEL','Enterprise · Colocation · Hyperscale · HPC · AI factory · Edge']
];
const ecosystems=[
 ['19-INCH','IEC 60297 ecosystem','Broad enterprise / colo compatibility; cabinet width and depth remain project decisions'],
 ['ORV3','OCP Open Rack V3','OpenU, rack-level DC busbar and liquid-interface oriented ecosystem'],
 ['MGX','AI rack adaptation','19-inch pitch can coexist with ORv3-derived power, manifold and rack-scale integration'],
 ['ORW','Open Rack Wide','2026 wide-rack class for next-generation high-power, liquid and dense-interconnect envelopes']
];
const couplingMatrix=[
 ['Power','A/B AC · 3-phase · DC busbar','Failure-domain independence, current capacity and rear-space occupancy'],
 ['Cooling','Air · RDHx · Direct-to-chip · CDU/TCS','Heat path, hose routing, residual-air load and service isolation'],
 ['Structure','Static · dynamic · rolling · seismic','Fully loaded mass, point load, transport path and anchoring'],
 ['Cabling','Power A/B · copper · fiber · rack-scale interconnect','Bend radius, airflow obstruction, slack and service access'],
 ['Operations','Monitoring · isolation · lifting · maintenance','Safe change, capacity control and repeatable service procedure']
];
const decisionChain=[
 ['Workload','Equipment population, SLA and lifecycle intent'],
 ['Equipment interface','19-inch, OpenU, MGX-adapted or wide-rack ecosystem'],
 ['Mechanical envelope','Height, width, usable depth, doors and service extraction'],
 ['Power envelope','A/B path, current, connectors, PDU or DC busbar'],
 ['Thermal interface','Air, RDHx, direct-to-chip, manifold and residual air'],
 ['Structure','Loaded weight, floor/point/rolling load and seismic condition'],
 ['Cabling & service','Power/data zones, bend radius, QD/PDU access and lifting'],
 ['Operations','Monitoring, isolation, security and maintenance ownership'],
 ['Rack standard freeze','Version-controlled engineering envelope and acceptance contract']
];
m.golden={
 version:'V2',researchStatus:'COMPLETE',quickAudioStatus:'LIVE',fullAudioStatus:'LIVE',fullAudioQA:'8/8 PASS',
 fullDuration:2067.36,fullDurationLabel:'34:27',researchSections:58,sourceCount:32,targetFullMinutes:'34:27',
 narrationFile:'narration/DC-K03_FULL_NARRATION_TR_V2.md',manifest:'audio/production/tr/dc-k03-v2/manifest.json',
 chapters:[
  ['K03-00','Rack neden artık metal bir kutu değildir?',254.784,'audio/production/tr/dc-k03-v2/k03-00-rack-neden-artik-metal-bir-kutu-degildir.mp3','audio/production/tr/dc-k03-v2/k03-00-rack-neden-artik-metal-bir-kutu-degildir.source.txt'],
  ['K03-01','On dokuz inch, OpenU, ORv3, MGX ve ORW nasıl ayrılır?',271.32,'audio/production/tr/dc-k03-v2/k03-01-on-dokuz-inch-openu-orv3-mgx-ve-orw-nasil-ayrilir.mp3','audio/production/tr/dc-k03-v2/k03-01-on-dokuz-inch-openu-orv3-mgx-ve-orw-nasil-ayrilir.source.txt'],
  ['K03-02','Derinlik, ağırlık, floor load ve serviceability neden birlikte hesaplanır?',252.168,'audio/production/tr/dc-k03-v2/k03-02-derinlik-agirlik-floor-load-ve-serviceability-neden-birlikte-hesaplanir.mp3','audio/production/tr/dc-k03-v2/k03-02-derinlik-agirlik-floor-load-ve-serviceability-neden-birlikte-hesaplanir.source.txt'],
  ['K03-03',"Rack power architecture: A/B PDU'dan DC busbar'a",258.96,'audio/production/tr/dc-k03-v2/k03-03-rack-power-architecture-a-b-pdu-dan-dc-busbar-a.mp3','audio/production/tr/dc-k03-v2/k03-03-rack-power-architecture-a-b-pdu-dan-dc-busbar-a.source.txt'],
  ['K03-04','Airflow, kapak ve kablo yönetimi termal tasarımın parçasıdır',259.824,'audio/production/tr/dc-k03-v2/k03-04-airflow-kapak-ve-kablo-yonetimi-termal-tasarimin-parcasidir.mp3','audio/production/tr/dc-k03-v2/k03-04-airflow-kapak-ve-kablo-yonetimi-termal-tasarimin-parcasidir.source.txt'],
  ['K03-05','Liquid-ready rack ne demektir?',257.808,'audio/production/tr/dc-k03-v2/k03-05-liquid-ready-rack-ne-demektir.mp3','audio/production/tr/dc-k03-v2/k03-05-liquid-ready-rack-ne-demektir.source.txt'],
  ['K03-06',"Rack-scale AI sistemi conventional cabinet'ten nasıl farklıdır?",258.624,'audio/production/tr/dc-k03-v2/k03-06-rack-scale-ai-sistemi-conventional-cabinet-ten-nasil-farklidir.mp3','audio/production/tr/dc-k03-v2/k03-06-rack-scale-ai-sistemi-conventional-cabinet-ten-nasil-farklidir.source.txt'],
  ['K03-07','Proje rack standardı nasıl seçilir ve freeze edilir?',253.872,'audio/production/tr/dc-k03-v2/k03-07-proje-rack-standardi-nasil-secilir-ve-freeze-edilir.mp3','audio/production/tr/dc-k03-v2/k03-07-proje-rack-standardi-nasil-secilir-ve-freeze-edilir.source.txt']
 ],
 interfaceAxes,ecosystems,couplingMatrix,decisionChain,
 serviceFamilies:interfaceAxes,
 responsibility:decisionChain.slice(0,6).map(([a,b])=>[a,b,'Interface-driven','Project-specific']),
 facilityFit:ecosystems.map(([a,b,c])=>[a,b,c,'Project-specific','Verify interfaces']),
 maturity:couplingMatrix.slice(0,4).map(([a,b,c],i)=>['R'+(i+1),a,`${b} · ${c}`]),
 goldenRule:'WORKLOAD → EQUIPMENT FORM FACTOR → POWER DENSITY → COOLING METHOD → CABLING → SERVICE ACCESS → FLOOR / STRUCTURAL LIMITS → RACK ARCHITECTURE'
};
})();
