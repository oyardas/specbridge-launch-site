(()=>{
const K=window.DC_KNOWLEDGE;
const m=K?.modules?.find(x=>x.id==='DC-K05');
if(!K||!m)return;
K.version='1.7';
K.updated='2026-09-02-dck05-golden-v2-live';
m.status='golden-v2-live';
m.tags=['cooling','air','DX','chilled water','RDHx','direct-to-chip','immersion','CDU','TCS','FWS','AI','hydraulics','commissioning'];
const thermalDomains=[
 ['WORKLOAD / ITE','IT environmental class · rack density · airflow · coolant requirement'],
 ['HEAT CAPTURE','Air · close-coupled · RDHx · cold plate · immersion'],
 ['RACK / ROW TRANSPORT','Server airflow · rack manifold · hoses/QD · row cooling'],
 ['TCS DOMAIN','Technology coolant · pumps · filters · chemistry · pressure/flow control'],
 ['CDU / HX BOUNDARY','Thermal transfer · pressure isolation · service responsibility'],
 ['FWS / REFRIGERANT DOMAIN','Chilled water · condenser water · refrigerant · facility pumps'],
 ['HEAT REJECTION','Chiller · dry cooler · cooling tower · adiabatic · economizer'],
 ['CONTROL / OBSERVABILITY','BMS/DCIM · leak · flow · dew point · alarms · operating procedures']
];
const architectureFit=[
 ['Room / perimeter air','Low–medium density, conventional enterprise/colo','Air mixing, fan energy, high-density scaling'],
 ['In-row / close-coupled','Medium–high density, modular rows','White-space, piping, condensate and common-header risk'],
 ['RDHx','Retrofit and higher-density air-cooled servers','Door weight, hose/serviceability, facility liquid dependency'],
 ['Direct-to-chip','High-density AI/HPC with OEM liquid support','Residual air heat, CDU/TCS interfaces, fluid compatibility'],
 ['Immersion','Specialized high-density or constrained use cases','Service model, component/fluid compatibility, operational change']
];
const interfaceMatrix=[
 ['ITE → TCS','Coolant supply temperature, flow, pressure drop and allowable chemistry','OEM mismatch or insufficient flow can throttle/overheat IT'],
 ['Rack → manifold/QD','Connection type, hose routing, dripless behavior, service clearance','Leak, wrong coupling or blocked service path'],
 ['TCS → CDU/HX','Pump capacity, approach temperature, filtration, controls and redundancy','Single CDU/control/header can become a blast radius'],
 ['CDU/HX → FWS','Heat-exchanger duty, pressure separation and control authority','Facility transient can propagate into technology loop'],
 ['FWS → heat rejection','Plant capacity, climate envelope, water/refrigerant strategy','Common plant/header failure or insufficient design condition'],
 ['Controls → operations','Sensors, setpoints, alarms, sequencing, MOP/EOP','Control hunting, hidden degraded state or human error']
];
const commissioningChain=[
 ['Normal design load','Rack inlet/coolant conditions, flow, delta-T and plant capacity'],
 ['Peak density zone','Worst-case rack/row and air-liquid heat split'],
 ['Single terminal loss','CRAH/in-row/RDHx/CDU component unavailable'],
 ['Pump / CDU fault','Remaining flow path, alarms and thermal ride-through'],
 ['Header / valve fault','Isolation granularity and common-mode containment'],
 ['Heat-rejection degradation','High ambient, tower/dry-cooler/chiller state and capacity margin'],
 ['Power transition','Generator/UPS state while critical cooling auxiliaries recover'],
 ['Leak / chemistry event','Detection, isolation, containment and service procedure'],
 ['Recovery / return-to-normal','Stable sequencing without control hunting or condensation'],
 ['Architecture freeze','P&ID + controls + alarm matrix + commissioning evidence agree']
];
m.golden={
 version:'V2',researchStatus:'COMPLETE',quickAudioStatus:'LIVE',fullAudioStatus:'LIVE',fullAudioQA:'8/8 PASS',
 fullDuration:2060.904,fullDurationLabel:'34:21',researchSections:74,sourceCount:37,targetFullMinutes:'34:21',
 narrationFile:'narration/DC-K05_FULL_NARRATION_TR_V2.md',manifest:'audio/production/tr/dc-k05-v2/manifest.json',
 chapters:[
  ['K05-00','Cooling architecture neden klima seçimi değildir?',251.664,'audio/production/tr/dc-k05-v2/k05-00-cooling-architecture-neden-klima-secimi-degildir.mp3','audio/production/tr/dc-k05-v2/k05-00-cooling-architecture-neden-klima-secimi-degildir.source.txt'],
  ['K05-01','Airflow, containment, CRAC/CRAH ve close-coupled cooling',257.616,'audio/production/tr/dc-k05-v2/k05-01-airflow-containment-crac-crah-ve-close-coupled-cooling.mp3','audio/production/tr/dc-k05-v2/k05-01-airflow-containment-crac-crah-ve-close-coupled-cooling.source.txt'],
  ['K05-02','DX, chilled water, economization ve heat rejection',255.216,'audio/production/tr/dc-k05-v2/k05-02-dx-chilled-water-economization-ve-heat-rejection.mp3','audio/production/tr/dc-k05-v2/k05-02-dx-chilled-water-economization-ve-heat-rejection.source.txt'],
  ['K05-03','Direct-to-chip, RDHx ve immersion farkları',260.592,'audio/production/tr/dc-k05-v2/k05-03-direct-to-chip-rdhx-ve-immersion-farklari.mp3','audio/production/tr/dc-k05-v2/k05-03-direct-to-chip-rdhx-ve-immersion-farklari.source.txt'],
  ['K05-04','FWS, TCS, CDU, manifold, QD ve coolant chemistry',257.184,'audio/production/tr/dc-k05-v2/k05-04-fws-tcs-cdu-manifold-qd-ve-coolant-chemistry.mp3','audio/production/tr/dc-k05-v2/k05-04-fws-tcs-cdu-manifold-qd-ve-coolant-chemistry.source.txt'],
  ['K05-05','Density, hydraulics, dew point ve AI thermal design',258.336,'audio/production/tr/dc-k05-v2/k05-05-density-hydraulics-dew-point-ve-ai-thermal-design.mp3','audio/production/tr/dc-k05-v2/k05-05-density-hydraulics-dew-point-ve-ai-thermal-design.source.txt'],
  ['K05-06','Resilience, controls, thermal ride-through ve commissioning',251.496,'audio/production/tr/dc-k05-v2/k05-06-resilience-controls-thermal-ride-through-ve-commissioning.mp3','audio/production/tr/dc-k05-v2/k05-06-resilience-controls-thermal-ride-through-ve-commissioning.source.txt'],
  ['K05-07','Energy, water, retrofit, TCO ve hangi mimari ne zaman?',268.8,'audio/production/tr/dc-k05-v2/k05-07-energy-water-retrofit-tco-ve-hangi-mimari-ne-zaman.mp3','audio/production/tr/dc-k05-v2/k05-07-energy-water-retrofit-tco-ve-hangi-mimari-ne-zaman.source.txt']
 ],
 thermalDomains,architectureFit,interfaceMatrix,commissioningChain,
 serviceFamilies:thermalDomains,
 responsibility:commissioningChain.slice(0,6).map(([a,b])=>[a,b,'State-based','Verify evidence']),
 facilityFit:architectureFit.map(([a,b,c])=>[a,b,c,'Project-specific','OEM/site dependent']),
 maturity:interfaceMatrix.slice(0,4).map(([a,b,c],i)=>['T'+(i+1),a,`${b} · ${c}`]),
 goldenRule:'WORKLOAD → ENVIRONMENTAL CLASS → RACK DENSITY → HEAT CAPTURE → AIR / LIQUID SPLIT → TCS / FWS BOUNDARY → HYDRAULICS → HEAT REJECTION → WATER / ENERGY → RESILIENCE → CONTROLS → COMMISSIONING → FREEZE'
};
})();
