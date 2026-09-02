(()=>{
const K=window.DC_KNOWLEDGE;
const m=K?.modules?.find(x=>x.id==='DC-K07');
if(!K||!m)return;
K.version='1.9';
K.updated='2026-09-02-dck07-golden-v2-live';
m.status='golden-v2-live';
m.tags=['facility','building','site risk','white space','structure','MMR','physical diversity','fire','water','security','AI','liquid cooling','retrofit','live-site','commissioning','lifecycle'];
const facilityLayers=[
 ['SITE / HAZARDS','Flood · seismic · extreme weather · adjacency · utility corridors · expansion land'],
 ['PERIMETER / SECURITY','Setback · vehicle control · visitor/contractor zoning · emergency access'],
 ['ENVELOPE / STRUCTURE','Roof · walls · slab · columns · seismic anchoring · equipment load paths'],
 ['COMPARTMENTS','Fire · water · security · availability zones · hazardous spaces'],
 ['LOGISTICS / REPLACEMENT','Loading · staging · freight route · crane access · lifecycle replacement'],
 ['WHITE SPACE / TECH ROOMS','Data halls · MMR · electrical · battery · cooling · controls · support'],
 ['A/B PHYSICAL SYSTEMS','Electrical · cooling · telecom · controls · risers · trenches · penetrations'],
 ['AI / LIQUID READINESS','Dense power · FWS/TCS · CDU · headers · leak zoning · service clearances'],
 ['OPERATIONS / EXPANSION','Commissioning · MOP/EOP · live-site phasing · future interfaces']
];
const adjacencyMatrix=[
 ['White space','Staging · MMR pathways · power/cooling distribution','Uncontrolled public/loading exposure','Operations and security','Controlled freight + service access'],
 ['MMR','Carrier entrances · diverse white-space routes','Single shared entrance/riser','Network resilience','Two-path outside/inside audit'],
 ['UPS / switchgear','Distribution path · service access','Water-risk zones where avoidable','Electrical resilience','Dry, replaceable technical zone'],
 ['Battery / BESS','Service and emergency access','Uncontrolled occupied areas','Fire/thermal/maintenance','Technology-specific hazard review'],
 ['Cooling plant','Heat rejection · hydraulic routes','Shared critical electrical exposure','Maintainability and water risk','Service-isolated plant zoning'],
 ['CDU / liquid zone','AI halls · FWS/TCS interfaces','Inaccessible trapped spaces','Liquid serviceability','Leak isolation + drainage'],
 ['Loading / staging','Secure external access · freight route','Direct uncontrolled white-space access','Logistics and security','Dirty-to-clean workflow'],
 ['NOC / controls','Secure staff access','Single local hazard domain where critical','Operations continuity','Control-domain resilience']
];
const physicalDiversity=[
 ['Electrical A/B','Separate rooms/risers/routes where target resilience requires','Shared switch room · riser · penetration · flood/fire zone','Trace source-to-rack physical path'],
 ['Cooling A/B','Independent serviceable hydraulic/air paths','Shared pipe gallery · valve zone · control dependency','Trace heat-source-to-rejection path'],
 ['Telecom A/B','Diverse carrier entrances · MMR · risers','Dual carriers on one duct/riser','Outside-plant + inside-plant audit'],
 ['Controls','Independent or fault-contained control domains','One PLC/BMS/network disables both trains','Control common-mode test'],
 ['Fire / water','Compartment boundaries coordinated with availability','One event reaches both critical paths','Event-zone overlay on A/B routes'],
 ['Logistics','Critical assets have credible service/replacement access','One blocked route makes both systems unreplaceable','Lifecycle replacement simulation']
];
const aiReadiness=[
 ['A1','Structure','Can slab + complete equipment route handle installed, rolling and point loads?'],
 ['A2','Power','Can dense power reach rack without copper, pathway or protection bottlenecks?'],
 ['A3','Cooling','Can target heat be captured and rejected under normal and degraded states?'],
 ['A4','Liquid','Are FWS/TCS boundaries, CDU zones, headers, valves and service space reserved?'],
 ['A5','Water risk','Are detection, isolation, containment, drainage and recovery coordinated?'],
 ['A6','Space','Are clear height, overhead services and maintenance clearances density-ready?'],
 ['A7','Network','Are high-density fiber pathways, MMR capacity and diverse routes sufficient?'],
 ['A8','Logistics','Can integrated AI racks/CDUs enter, turn, stage, service and be replaced?'],
 ['A9','Commissioning','Can realistic thermal, power, leak and failure states be tested?'],
 ['A10','Growth','Can future density generations be inserted without rebuilding the facility?']
];
m.golden={
 version:'V2',researchStatus:'COMPLETE',quickAudioStatus:'LIVE',quickAudioQA:'1/1 PASS',fullAudioStatus:'LIVE',fullAudioQA:'8/8 PASS',
 quickDuration:394.824,quickDurationLabel:'6:35',fullDuration:2262.816,fullDurationLabel:'37:43',researchSections:142,sourceCount:30,targetFullMinutes:'37:43',
 quickNarrationFile:'narration/DC-K07_QUICK_NARRATION_TR_V1.md',quickManifest:'audio/production/tr/dc-k07-quick-v1/manifest.json',
 narrationFile:'narration/DC-K07_FULL_NARRATION_TR_V2.md',manifest:'audio/production/tr/dc-k07-v2/manifest.json',
 chapters:[
  ['K07-00','Veri merkezi binası neden sadece bir shell değildir?',258.0,'audio/production/tr/dc-k07-v2/k07-00-veri-merkezi-binasi-neden-sadece-bir-shell-degildir.mp3','audio/production/tr/dc-k07-v2/k07-00-veri-merkezi-binasi-neden-sadece-bir-shell-degildir.source.txt'],
  ['K07-01','Site risk, building form ve functional zoning',313.392,'audio/production/tr/dc-k07-v2/k07-01-site-risk-building-form-ve-functional-zoning.mp3','audio/production/tr/dc-k07-v2/k07-01-site-risk-building-form-ve-functional-zoning.source.txt'],
  ['K07-02','White space, structure, slab, raised floor ve equipment logistics',303.144,'audio/production/tr/dc-k07-v2/k07-02-white-space-structure-slab-raised-floor-ve-equipment-logistics.mp3','audio/production/tr/dc-k07-v2/k07-02-white-space-structure-slab-raised-floor-ve-equipment-logistics.source.txt'],
  ['K07-03','A/B physical diversity, MMR, risers ve failure domains',277.8,'audio/production/tr/dc-k07-v2/k07-03-a-b-physical-diversity-mmr-risers-ve-failure-domains.mp3','audio/production/tr/dc-k07-v2/k07-03-a-b-physical-diversity-mmr-risers-ve-failure-domains.source.txt'],
  ['K07-04','Fire, water, security ve building compartments',282.84,'audio/production/tr/dc-k07-v2/k07-04-fire-water-security-ve-building-compartments.mp3','audio/production/tr/dc-k07-v2/k07-04-fire-water-security-ve-building-compartments.source.txt'],
  ['K07-05','AI, high density ve liquid-cooling facility readiness',284.64,'audio/production/tr/dc-k07-v2/k07-05-ai-high-density-ve-liquid-cooling-facility-readiness.mp3','audio/production/tr/dc-k07-v2/k07-05-ai-high-density-ve-liquid-cooling-facility-readiness.source.txt'],
  ['K07-06','Retrofit, live-site expansion ve lifecycle replacement',259.536,'audio/production/tr/dc-k07-v2/k07-06-retrofit-live-site-expansion-ve-lifecycle-replacement.mp3','audio/production/tr/dc-k07-v2/k07-06-retrofit-live-site-expansion-ve-lifecycle-replacement.source.txt'],
  ['K07-07','Commissioning, risk matrix ve hangi building architecture ne zaman?',283.464,'audio/production/tr/dc-k07-v2/k07-07-commissioning-risk-matrix-ve-hangi-building-architecture-ne-zaman.mp3','audio/production/tr/dc-k07-v2/k07-07-commissioning-risk-matrix-ve-hangi-building-architecture-ne-zaman.source.txt']
 ],
 facilityLayers,adjacencyMatrix,physicalDiversity,aiReadiness,
 serviceFamilies:facilityLayers,
 responsibility:physicalDiversity,
 facilityFit:adjacencyMatrix,
 maturity:aiReadiness,
 goldenRule:'BUSINESS / SLA → SITE RISK → PROJECT CONDITION → BUILDING FORM → FUNCTIONAL ZONING → STRUCTURAL ENVELOPE → PHYSICAL PATH DIVERSITY → FIRE / WATER / SECURITY COMPARTMENTS → LOGISTICS / REPLACEMENT → WHITE-SPACE & TECHNICAL ROOMS → AI / LIQUID READINESS → EXPANSION / LIVE-SITE PHASING → COMMISSIONING → OPERATIONS → FREEZE'
};
})();
