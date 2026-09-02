(()=>{
const K=window.DC_KNOWLEDGE;
const m=K?.modules?.find(x=>x.id==='DC-K04');
if(!K||!m)return;
K.version='1.6';
K.updated='2026-09-02-dck04-golden-v2-live';
m.status='golden-v2-live';
m.tags=['power','UPS','generator','MV','LV','A/B','busway','BESS','EPMS','protection','commissioning','AI'];
const powerDomains=[
 ['SOURCE DOMAIN','Utility · alternate utility · on-site generation · grid-interactive source'],
 ['MV DOMAIN','Incoming switchgear · sectionalization · protection · metering'],
 ['TRANSFORMATION DOMAIN','Transformers · impedance · protection · isolation'],
 ['LV / TRANSFER DOMAIN','Main switchboards · bus sections · ATS/TSE · paralleling'],
 ['CONTINUITY DOMAIN','UPS · batteries · flywheel · stored energy'],
 ['DISTRIBUTION DOMAIN','PDU · RPP · busway · STS where applicable'],
 ['RACK DOMAIN','rPDU · rack busbar · power shelf / DC busbar · IT PSU'],
 ['CONTROL / OBSERVABILITY','Protection relays · controls · EPMS · BMS/DCIM · procedures']
];
const availabilityMatrix=[
 ['Component redundancy','Extra capacity unit/module','Does not prove independent distribution path'],
 ['Path redundancy','Alternate physical/electrical route','Can still contain common-mode dependencies'],
 ['Concurrent maintainability','Planned removal while critical load remains supported','Requires topology plus procedures and capacity state'],
 ['Fault tolerance','Unexpected single fault does not interrupt required service','More demanding than planned-maintenance continuity'],
 ['Tier / Rated outcome','Whole-facility result','Cannot be inferred from N+1 UPS alone']
];
const commonModeMatrix=[
 ['Upstream source','Shared utility substation / feeder corridor','Trace source independence beyond the site label'],
 ['Transformation','Shared transformer or common MV/LV bus','Separate physical and electrical failure domains where required'],
 ['Bypass / transfer','Common bypass source, ATS/TSE or control power','Model every transfer and maintenance state'],
 ['Generation','Common paralleling bus, controller or fuel system','Include start, fuel and control common modes'],
 ['Distribution','Shared switchboard, busway, cable tray or fire zone','Verify route and compartment independence'],
 ['Operations','Shared MOP, settings error or operator action','Treat procedure and configuration as failure domains']
];
const commissioningChain=[
 ['Normal operation','Utility-fed topology, capacity and protection state'],
 ['Component unavailable','N+1 / module loss and remaining resilient capacity'],
 ['Path maintenance','Planned isolation, bypass and concurrent-maintenance sequence'],
 ['Generator island','Utility loss, start, source qualification and critical mechanical recovery'],
 ['UPS bypass','Static or maintenance bypass source, protection and remaining redundancy'],
 ['Fault state','Branch/bus/source fault containment and selectivity'],
 ['Recovery','Return-to-normal without unsafe parallel or control hunting'],
 ['Expansion tie-in','Future block integration without breaking accepted failure domains'],
 ['Architecture freeze','SLD + settings + MOP/EOP + EPMS evidence agree']
];
m.golden={
 version:'V2',researchStatus:'COMPLETE',quickAudioStatus:'LIVE',fullAudioStatus:'LIVE',fullAudioQA:'8/8 PASS',
 fullDuration:2129.088,fullDurationLabel:'35:29',researchSections:85,sourceCount:48,targetFullMinutes:'35:29',
 narrationFile:'narration/DC-K04_FULL_NARRATION_TR_V2.md',manifest:'audio/production/tr/dc-k04-v2/manifest.json',
 chapters:[
  ['K04-00','Power architecture neden bir failure-domain problemidir?',245.736,'audio/production/tr/dc-k04-v2/k04-00-power-architecture-neden-bir-failure-domain-problemidir.mp3','audio/production/tr/dc-k04-v2/k04-00-power-architecture-neden-bir-failure-domain-problemidir.source.txt'],
  ['K04-01','Utility, MV, transformer ve LV power blocks',262.848,'audio/production/tr/dc-k04-v2/k04-01-utility-mv-transformer-ve-lv-power-blocks.mp3','audio/production/tr/dc-k04-v2/k04-01-utility-mv-transformer-ve-lv-power-blocks.source.txt'],
  ['K04-02','Generator, transfer logic ve black-start',287.28,'audio/production/tr/dc-k04-v2/k04-02-generator-transfer-logic-ve-black-start.mp3','audio/production/tr/dc-k04-v2/k04-02-generator-transfer-logic-ve-black-start.source.txt'],
  ['K04-03','UPS topology, modes, static bypass ve maintenance bypass',266.592,'audio/production/tr/dc-k04-v2/k04-03-ups-topology-modes-static-bypass-ve-maintenance-bypass.mp3','audio/production/tr/dc-k04-v2/k04-03-ups-topology-modes-static-bypass-ve-maintenance-bypass.source.txt'],
  ['K04-04','Battery, stored energy ve BESS sınırı',248.52,'audio/production/tr/dc-k04-v2/k04-04-battery-stored-energy-ve-bess-siniri.mp3','audio/production/tr/dc-k04-v2/k04-04-battery-stored-energy-ve-bess-siniri.source.txt'],
  ['K04-05','PDU, RPP, busway, A/B, protection ve EPMS',271.992,'audio/production/tr/dc-k04-v2/k04-05-pdu-rpp-busway-a-b-protection-ve-epms.mp3','audio/production/tr/dc-k04-v2/k04-05-pdu-rpp-busway-a-b-protection-ve-epms.source.txt'],
  ['K04-06','AI high-density power, rack DC ve future voltage',267.072,'audio/production/tr/dc-k04-v2/k04-06-ai-high-density-power-rack-dc-ve-future-voltage.mp3','audio/production/tr/dc-k04-v2/k04-06-ai-high-density-power-rack-dc-ve-future-voltage.source.txt'],
  ['K04-07','Commissioning, lifecycle ve hangi mimari ne zaman?',279.048,'audio/production/tr/dc-k04-v2/k04-07-commissioning-lifecycle-ve-hangi-mimari-ne-zaman.mp3','audio/production/tr/dc-k04-v2/k04-07-commissioning-lifecycle-ve-hangi-mimari-ne-zaman.source.txt']
 ],
 powerDomains,availabilityMatrix,commonModeMatrix,commissioningChain,
 serviceFamilies:powerDomains,
 responsibility:commissioningChain.slice(0,6).map(([a,b])=>[a,b,'State-based','Verify evidence']),
 facilityFit:availabilityMatrix.map(([a,b,c])=>[a,b,c,'System-level','Project-specific']),
 maturity:commonModeMatrix.slice(0,4).map(([a,b,c],i)=>['P'+(i+1),a,`${b} · ${c}`]),
 goldenRule:'BUSINESS AVAILABILITY → LOAD → SOURCE → MV/LV → GENERATION / TRANSFER → UPS / STORED ENERGY → A/B INDEPENDENCE → DISTRIBUTION → PROTECTION → OBSERVABILITY → COMMISSIONING → FREEZE'
};
})();
