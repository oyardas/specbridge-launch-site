(()=>{
const K=window.DC_KNOWLEDGE;
const m=K?.modules?.find(x=>x.id==='DC-K06');
if(!K||!m)return;
K.version='1.8';
K.updated='2026-09-02-dck06-golden-v2-live';
m.status='golden-v2-live';
m.tags=['UPS','energy storage','battery','BMS','VFI','bypass','VRLA','lithium-ion','NiCd','flywheel','supercapacitor','BESS','autonomy','generator','commissioning','lifecycle'];
const systemDomains=[
 ['SOURCE / INPUT','Utility · generator · alternate source · input power quality · source qualification'],
 ['POWER CONVERSION','Rectifier / converter · DC link · inverter · VFI / VI / VFD behavior'],
 ['BYPASS / MAINTENANCE','Static bypass · maintenance bypass · breaker sequence · isolation'],
 ['STORED ENERGY','VRLA · lithium-ion · NiCd · flywheel · supercapacitor · hybrid storage'],
 ['DC / BATTERY INTERFACE','DC window · strings/modules · protection · recharge · current limits'],
 ['OUTPUT / CRITICAL LOAD','Critical bus · downstream distribution · fault clearing · load step behavior'],
 ['CONTROL / OBSERVABILITY','UPS controls · BMS · telemetry · alarms · state transitions · runbooks'],
 ['FACILITY / BESS BOUNDARY','Generator recovery · cooling/TCS recovery · grid interaction · BESS reserve governance']
];
const technologyFit=[
 ['VFI double-conversion UPS','Mission-critical IT requiring strong input/output decoupling','Efficiency-mode exposure, bypass design and fault-current behavior'],
 ['VRLA battery','Mature short-duration UPS autonomy with established maintenance practice','Temperature sensitivity, aging, space/weight and periodic replacement'],
 ['Lithium-ion battery','High cycle capability, compact footprint and advanced telemetry','Thermal-event strategy, BMS dependency and tested system integration'],
 ['NiCd battery','Harsh environments and long service-life applications','CAPEX, environmental handling and technology-specific maintenance'],
 ['Flywheel / supercapacitor','Very short high-power ride-through with high cycle capability','Low energy duration; generator/source recovery must be extremely reliable'],
 ['BESS','Longer-duration or grid-interactive energy services outside classic UPS reserve','Control objective, reserve governance, protection, safety and revenue-vs-resilience conflict']
];
const autonomyChain=[
 ['Critical load definition','Which IT and cooling/control loads must survive the event?'],
 ['Failure event','Utility loss, upstream fault, source degradation or transfer condition'],
 ['Generator start','Engine start is only one event in the recovery chain'],
 ['Voltage / frequency stabilization','Alternate source must enter an acceptable operating window'],
 ['Source qualification','Controls must verify the source before load/rectifier acceptance'],
 ['Transfer / rectifier acceptance','UPS input-current limits, soft-start and bypass conditions matter'],
 ['Critical cooling / TCS recovery','Thermal continuity can constrain usable electrical autonomy'],
 ['Contingency reserve','Failed start, delayed transfer, degraded battery or operational margin'],
 ['Recharge / return-to-normal','Recharge power and sequencing must not destabilize the recovered system']
];
const commissioningChain=[
 ['Normal / full load','Efficiency, harmonics, output quality, battery state and thermal condition'],
 ['Stored-energy transition','Loss of normal source without critical-load interruption'],
 ['Generator supply','Frequency/voltage acceptance, rectifier ramp and recharge coordination'],
 ['UPS module loss','Remaining capacity, control stability and actual redundancy'],
 ['Static bypass','Transfer behavior, source dependency and fault-clearing path'],
 ['Maintenance bypass','Safe isolation, breaker interlocks and human-error containment'],
 ['Battery / BMS / string loss','Reduced autonomy, alarms, isolation and degraded-state visibility'],
 ['Common bus / controller fault','Contain shared failure domains that component counts can hide'],
 ['BESS / grid interaction','Resilience reserve cannot be consumed by external services without governance'],
 ['Return-to-normal','Stable retransfer, recharge and restoration of intended redundancy']
];
m.golden={
 version:'V2',researchStatus:'COMPLETE',quickAudioStatus:'LIVE',quickAudioQA:'1/1 PASS',fullAudioStatus:'LIVE',fullAudioQA:'8/8 PASS',
 quickDuration:334.296,quickDurationLabel:'5:34',fullDuration:2073.696,fullDurationLabel:'34:34',researchSections:85,sourceCount:36,targetFullMinutes:'34:34',
 quickNarrationFile:'narration/DC-K06_QUICK_NARRATION_TR_V1.md',quickManifest:'audio/production/tr/dc-k06-quick-v1/manifest.json',
 narrationFile:'narration/DC-K06_FULL_NARRATION_TR_V2.md',manifest:'audio/production/tr/dc-k06-v2/manifest.json',sourceCorrection:'research/DC-K06_SOURCE_REGISTER_CORRECTION.md',
 chapters:[
  ['K06-00','UPS neden sadece bir cihaz değildir?',244.584,'audio/production/tr/dc-k06-v2/k06-00-ups-neden-sadece-bir-cihaz-degildir.mp3','audio/production/tr/dc-k06-v2/k06-00-ups-neden-sadece-bir-cihaz-degildir.source.txt'],
  ['K06-01','VFI, VI, VFD, double conversion, bypass ve operating modes',256.56,'audio/production/tr/dc-k06-v2/k06-01-vfi-vi-vfd-double-conversion-bypass-ve-operating-modes.mp3','audio/production/tr/dc-k06-v2/k06-01-vfi-vi-vfd-double-conversion-bypass-ve-operating-modes.source.txt'],
  ['K06-02','Redundancy, fault current, generator compatibility ve selectivity',250.2,'audio/production/tr/dc-k06-v2/k06-02-redundancy-fault-current-generator-compatibility-ve-selectivity.mp3','audio/production/tr/dc-k06-v2/k06-02-redundancy-fault-current-generator-compatibility-ve-selectivity.source.txt'],
  ['K06-03','Autonomy nasıl gerçekten boyutlandırılır?',244.296,'audio/production/tr/dc-k06-v2/k06-03-autonomy-nasil-gercekten-boyutlandirilir.mp3','audio/production/tr/dc-k06-v2/k06-03-autonomy-nasil-gercekten-boyutlandirilir.source.txt'],
  ['K06-04','VRLA, lithium-ion, NiCd, flywheel ve supercapacitor',288.816,'audio/production/tr/dc-k06-v2/k06-04-vrla-lithium-ion-nicd-flywheel-ve-supercapacitor.mp3','audio/production/tr/dc-k06-v2/k06-04-vrla-lithium-ion-nicd-flywheel-ve-supercapacitor.source.txt'],
  ['K06-05','BMS, battery safety, thermal runaway ve lifecycle',287.184,'audio/production/tr/dc-k06-v2/k06-05-bms-battery-safety-thermal-runaway-ve-lifecycle.mp3','audio/production/tr/dc-k06-v2/k06-05-bms-battery-safety-thermal-runaway-ve-lifecycle.source.txt'],
  ['K06-06','UPS battery, BESS, grid interaction ve AI power smoothing',260.544,'audio/production/tr/dc-k06-v2/k06-06-ups-battery-bess-grid-interaction-ve-ai-power-smoothing.mp3','audio/production/tr/dc-k06-v2/k06-06-ups-battery-bess-grid-interaction-ve-ai-power-smoothing.source.txt'],
  ['K06-07','Commissioning, maintenance, TCO ve hangi mimari ne zaman?',241.512,'audio/production/tr/dc-k06-v2/k06-07-commissioning-maintenance-tco-ve-hangi-mimari-ne-zaman.mp3','audio/production/tr/dc-k06-v2/k06-07-commissioning-maintenance-tco-ve-hangi-mimari-ne-zaman.source.txt']
 ],
 systemDomains,technologyFit,autonomyChain,commissioningChain,
 serviceFamilies:systemDomains,
 responsibility:commissioningChain.slice(0,6).map(([a,b])=>[a,b,'State-based','Verify evidence']),
 facilityFit:technologyFit.map(([a,b,c])=>[a,b,c,'Project-specific','System integration dependent']),
 maturity:autonomyChain.slice(0,4).map(([a,b],i)=>['E'+(i+1),a,b]),
 goldenRule:'CRITICAL LOAD → SOURCE STATES → UPS FUNCTIONAL CLASS → POWER PATH / BYPASS → STORED-ENERGY TECHNOLOGY → AUTONOMY STATE CHAIN → PROTECTION / BMS / SAFETY → GENERATOR & COOLING RECOVERY → BESS BOUNDARY → COMMISSIONING → LIFECYCLE → FREEZE'
};
})();
