/* KAYAS T02 node-link engineering canvas — preview only; canonical graph untouched. */
(function(){
'use strict';
if(window.KAYAS_NETWORK_NODE_LINK_V1A4)return;
window.KAYAS_NETWORK_NODE_LINK_V1A4=true;

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const IDS={
 perimeter:'topobj_dc750ed177fb87984c3a',
 adc:'topobj_d22103a970df15ebc013',
 egress:'topobj_4a235cb934f5c5a46901',
 interconnect:'topobj_f8b344bf31c75571769f',
 spine:'topobj_6c9587efb3d0b49bed8e',
 leaf:'topobj_689f284af5e658a26b88',
 storageSwitch:'topobj_dc742080923da3053e85',
 compute:'topobj_6de1118a2c5c7827fc65',
 storage:'topobj_6a8d3500c63b7ce61860',
 oob:'topobj_56b5cee0b4c39857a70a',
 controller:'topobj_bbc53ea9c663404b7a82',
 analytics:'topobj_60b6648480d5d86edc25'
};
const REL={
 'AINT-000':{label:'EXTERNAL INGRESS',name:'External Service Ingress',from:'External / Carrier / Internet',to:IDS.perimeter,kind:'design'},
 'AINT-001':{label:'SECURITY CHAIN',name:'Security Service Chain',from:IDS.perimeter,to:IDS.adc,kind:'design'},
 'AINT-002':{label:'SECURITY CHAIN',name:'Security Service Chain',from:IDS.adc,to:IDS.egress,kind:'design'},
 'AINT-003':{label:'SECURITY → NETWORK',name:'Security → Network Handoff',from:IDS.egress,to:IDS.interconnect,kind:'design'},
 'AINT-004':{label:'INTERCONNECT → FABRIC',name:'Interconnect → Fabric',from:IDS.interconnect,to:IDS.spine,kind:'design'},
 'AINT-005':{label:'OPEN FABRIC INTENT',name:'Spine → Leaf Fabric',from:IDS.spine,to:IDS.leaf,kind:'illustrative'},
 'AINT-006':{label:'STORAGE ACCESS',name:'Leaf → Storage Network',from:IDS.leaf,to:IDS.storageSwitch,kind:'design'},
 'AINT-007':{label:'COMPUTE ACCESS',name:'Compute Access',from:IDS.leaf,to:IDS.compute,kind:'design'},
 'AINT-008':{label:'STORAGE PATH',name:'Storage Data Path',from:IDS.storageSwitch,to:IDS.storage,kind:'design'},
 'AINT-013':{label:'OOB',name:'OOB → Fabric Intent',from:IDS.oob,to:IDS.spine,kind:'management'},
 'AINT-014':{label:'CONTROL',name:'Fabric Control Intent',from:IDS.controller,to:IDS.spine,kind:'management'},
 'AINT-015':{label:'TELEMETRY',name:'Fabric Telemetry Intent',from:IDS.analytics,to:IDS.spine,kind:'management'}
};
let lastRendered='', selected='';

function viewId(){try{return typeof view!=='undefined'?view:''}catch(_){return''}}
function O(id){try{return typeof obj==='function'?obj(id):null}catch(_){return null}}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function qty(o){const n=Number(o?.qty);return Number.isFinite(n)&&n>0?n:1}
function name(o,f=''){return o?.name||f||o?.role||'Object'}
function model(o){return o?.model||o?.sku||''}
function vendor(o){return o?.vendor||''}
function role(o){
 const r=String(o?.role||'').toUpperCase();
 if(r.includes('SPINE'))return'SPINE';
 if(r.includes('LEAF'))return'LEAF';
 if(r.includes('STORAGE_SWITCH'))return'STORAGE SW';
 if(r.includes('FIREWALL'))return'FIREWALL';
 if(r.includes('ADC'))return'ADC';
 if(r.includes('INTERCONNECT'))return'INTERCONNECT';
 if(r.includes('OOB'))return'OOB';
 if(r.includes('CONTROLLER'))return'CONTROLLER';
 if(r.includes('ANALYTICS'))return'ANALYTICS';
 if(r.includes('VIRTUALIZATION_HOST'))return'COMPUTE';
 if(r.includes('STORAGE'))return'STORAGE';
 return String(o?.domain||'DEVICE').toUpperCase();
}
function rclass(o){return role(o).toLowerCase().replace(/[^a-z0-9]+/g,'-')}

function memberNode(id,index,x,y,w=138,h=64,group=''){
 const o=O(id); if(!o)return'';
 return `<button class="kxnl-node role-${rclass(o)}" data-object="${esc(id)}" data-group="${esc(group||id)}" data-member="${index}" style="--x:${x}px;--y:${y}px;--w:${w}px;--h:${h}px" type="button">
   <span class="kxnl-role">${esc(role(o))}</span>
   <b>Member ${index}</b>
   <small>${esc(model(o))}</small>
   <em>VISUAL MEMBER</em>
 </button>`;
}
function endpointNode(id,x,y,w=250,h=68,group=''){
 const o=O(id); if(!o)return'';
 return `<button class="kxnl-node kxnl-endpoint role-${rclass(o)}" data-object="${esc(id)}" data-group="${esc(group||id)}" style="--x:${x}px;--y:${y}px;--w:${w}px;--h:${h}px" type="button">
   <span class="kxnl-role">${esc(role(o))}</span>
   <b>${esc(name(o))}</b>
   <small>${esc(model(o))}</small>
   <strong>×${qty(o)}</strong>
 </button>`;
}
function pair(id,x1,x2,y,group){return memberNode(id,1,x1,y,138,64,group)+memberNode(id,2,x2,y,138,64,group)}
function storageFour(){
 const id=IDS.storageSwitch;
 return memberNode(id,1,805,488,118,55,'storage-sw')+
        memberNode(id,2,935,488,118,55,'storage-sw')+
        memberNode(id,3,805,551,118,55,'storage-sw')+
        memberNode(id,4,935,551,118,55,'storage-sw');
}
function externalNode(){
 return `<button class="kxnl-external" data-context="external" style="--x:430px;--y:18px;--w:300px;--h:68px" type="button">
   <span>☁</span><div><b>External / Carrier / Internet</b><small>Carrier/router implementation details remain OPEN-CONFIRMATION REQUIRED.</small></div><em>OPEN</em>
 </button>`;
}
function groupLabel(text,x,y,w,sub=''){
 return `<div class="kxnl-group-label" style="--x:${x}px;--y:${y}px;--w:${w}px"><b>${esc(text)}</b>${sub?`<small>${esc(sub)}</small>`:''}</div>`;
}
function svgPath(id,d,cls,label,x,y,extra=''){
 return `<path class="kxnl-path ${cls}" data-intent="${id}" d="${d}" ${extra}></path>${label?`<text class="kxnl-edge-label ${cls}" data-intent="${id}" x="${x}" y="${y}" text-anchor="middle">${esc(label)}</text>`:''}`;
}
function buildSvg(){
 return `<svg class="kxnl-links" viewBox="0 0 1160 760" aria-label="Engineering connectivity relationships">
   ${svgPath('AINT-000','M580 86 V112 H160 V132','design','EXTERNAL INGRESS',320,106)}
   ${svgPath('AINT-001','M298 196 H445','design','SECURITY',372,188)}
   ${svgPath('AINT-002','M723 196 H800','design','SECURITY',762,188)}
   ${svgPath('AINT-003','M938 196 V235 H580 V255','design','HANDOFF',720,228)}
   ${svgPath('AINT-004','M580 319 V342 H580 V372','design','UPLINK INTENT',580,337)}
   ${svgPath('AINT-004B','M510 319 V342 H500 V372','illustrative','','0','0')}
   ${svgPath('AINT-004C','M650 319 V342 H660 V372','illustrative','','0','0')}
   ${svgPath('AINT-005','M425 436 L328 488','illustrative','','0','0')}
   ${svgPath('AINT-005','M425 436 L538 488','illustrative','','0','0')}
   ${svgPath('AINT-005','M755 436 L328 488','illustrative','','0','0')}
   ${svgPath('AINT-005','M755 436 L538 488','illustrative','','0','0')}
   <text class="kxnl-edge-label illustrative kxnl-fabric-label" data-intent="AINT-005" x="580" y="468" text-anchor="middle">OPEN FABRIC INTENT · MEMBER MAPPING UNCONFIRMED</text>
   ${svgPath('AINT-006','M608 520 H760','design','STORAGE ACCESS',684,511)}
   ${svgPath('AINT-007','M433 552 V625','design','COMPUTE ACCESS',433,602)}
   ${svgPath('AINT-008','M929 606 V625','design','STORAGE PATH',929,616)}
   ${svgPath('AINT-013','M185 718 V696 H580','management','OOB',250,691)}
   ${svgPath('AINT-014','M565 718 V696 H580','management','CONTROL',565,691)}
   ${svgPath('AINT-015','M840 718 V696 H580','management','TELEMETRY',840,691)}
   <path class="kxnl-path management kxnl-mgmt-trunk" data-intent="AINT-MGMT" d="M580 696 V436"></path>
   <text class="kxnl-edge-label management kxnl-mgmt-label" data-intent="AINT-MGMT" x="598" y="682">MGMT / OOB BUS · OPEN DESIGN</text>
 </svg>`;
}
function renderNodeLink(){
 if(viewId()!=='T02')return;
 const g=$('#groups'); if(!g)return;
 document.body.classList.remove('t02v14','kx-t06-capacity','kx-network-engineering');
 document.body.classList.add('kx-network-node-link');
 g.className='groups kxnl-root';
 g.innerHTML=`<section class="kxnl-stage">
   <header class="kxnl-title">
    <div><span>T02 · NETWORK LOGICAL</span><b>Engineering Node-Link Topology</b><small>Connection-first schematic · topology paths are primary; device quantities are visualized without inventing physical identity.</small></div>
    <div class="kxnl-summary"><span>0 evidenced physical links</span><span>OPEN design intents</span><span>Member mapping unconfirmed</span></div>
   </header>
   <main class="kxnl-canvas">
    ${buildSvg()}
    ${groupLabel('EXTERNAL / CARRIER',420,2,320)}
    ${groupLabel('SECURITY / APPLICATION DELIVERY',70,100,1020,'OPEN design chain')}
    ${groupLabel('EDGE / INTERCONNECT',435,238,290)}
    ${groupLabel('SPINE / FABRIC CORE',330,356,500,'Fabric members')}
    ${groupLabel('LEAF / STORAGE ACCESS',185,472,860,'Access and storage switching')}
    ${groupLabel('COMPUTE / STORAGE ENDPOINTS',260,612,650,'Aggregated endpoints')}
    ${groupLabel('MANAGEMENT / OOB / ANALYTICS',60,680,1040,'Separate management plane')}
    ${externalNode()}
    ${pair(IDS.perimeter,90,238,132,'perimeter')}
    ${pair(IDS.adc,445,593,132,'adc')}
    ${pair(IDS.egress,800,948,132,'egress')}
    ${pair(IDS.interconnect,440,590,255,'interconnect')}
    ${pair(IDS.spine,350,680,372,'spine')}
    ${pair(IDS.leaf,260,470,488,'leaf')}
    ${storageFour()}
    ${endpointNode(IDS.compute,300,625,270,60,'compute')}
    ${endpointNode(IDS.storage,790,625,270,60,'storage')}
    ${pair(IDS.oob,70,220,698,'oob')}
    ${endpointNode(IDS.controller,455,698,220,54,'controller')}
    ${endpointNode(IDS.analytics,735,698,220,54,'analytics')}
    <div class="kxnl-plane kxnl-security-plane"></div>
    <div class="kxnl-plane kxnl-management-plane"></div>
    <aside id="kxnlDrawer" class="kxnl-drawer" hidden></aside>
   </main>
   <footer class="kxnl-policy"><b>EVIDENCE BOUNDARY</b><span>Dashed/dotted paths are OPEN design/presentation intents. Member 1/2 labels are quantity-derived visual placeholders only.</span><strong>No HA/A-B identity, protocol, ports, speed, optics, EVPN/VXLAN, ring or physical cabling is asserted.</strong></footer>
 </section>`;
 patchChrome();
 bind();
 lastRendered='T02';
 setTimeout(()=>{try{$('#fitBtn')?.click()}catch(_){}},100);
}
function patchChrome(){
 $$('#tabs .tab,#tabs button').forEach(b=>{const t=(b.textContent||'').trim();if(t.startsWith('T02'))b.textContent='T02 Network Logical';if(t.startsWith('T06'))b.textContent='T06 Service & Capacity'});
 const bc=$('.breadcrumb .current');if(bc&&viewId()==='T02')bc.textContent='T02 · Network Logical / Engineering Node-Link Topology';
}
function drawer(){
 let d=$('#kxnlDrawer'); if(!d)return null; d.hidden=false; return d;
}
function closeDrawer(){const d=$('#kxnlDrawer');if(d)d.hidden=true;selected='';clearFocus()}
function objectDrawer(id){
 const o=O(id),d=drawer();if(!o||!d)return;
 const q=qty(o);
 d.innerHTML=`<button class="kxnl-drawer-close" type="button">×</button><span>INFRASTRUCTURE OBJECT</span><h3>${esc(name(o))}</h3><dl>
  <dt>Role</dt><dd>${esc(o.role||role(o))}</dd><dt>Vendor / Model</dt><dd>${esc([vendor(o),model(o)].filter(Boolean).join(' · ')||'—')}</dd>
  <dt>Quantity</dt><dd>${q}</dd><dt>Status</dt><dd>${esc(o.status||'—')}</dd>
 </dl><div class="kxnl-open-note"><b>Member visualization</b><p>The displayed member boxes are quantity-derived visual placeholders. Member identity, A/B designation, HA protocol and physical mapping remain OPEN-CONFIRMATION REQUIRED unless explicit evidence is added.</p></div>`;
 $('.kxnl-drawer-close',d).onclick=closeDrawer;
}
function relationshipDrawer(id){
 const m=REL[id],d=drawer();if(!m||!d)return;
 const from=typeof m.from==='string'&&m.from.startsWith('topobj_')?name(O(m.from)):m.from;
 const to=typeof m.to==='string'&&m.to.startsWith('topobj_')?name(O(m.to)):m.to;
 d.innerHTML=`<button class="kxnl-drawer-close" type="button">×</button><span>RELATIONSHIP / EVIDENCE</span><h3>${esc(m.label)}</h3><div class="kxnl-status">OPEN-CONFIRMATION REQUIRED · ${esc(id)}</div><dl>
  <dt>Semantic intent</dt><dd>${esc(m.name)}</dd><dt>From</dt><dd>${esc(from)}</dd><dt>To</dt><dd>${esc(to)}</dd>
  <dt>Rendering</dt><dd>${m.kind==='management'?'Management/OOB design relationship':m.kind==='illustrative'?'Illustrative design fabric':'Open design intent'}</dd>
  <dt>Confirmed physical evidence</dt><dd>0 evidenced physical links in current KAYAS baseline</dd>
 </dl><div class="kxnl-open-note"><b>Evidence boundary</b><p>This line does not assert member mapping, A/B identity, HA protocol, ports, speed, optics, EVPN/VXLAN, ring or physical cabling.</p></div>`;
 $('.kxnl-drawer-close',d).onclick=closeDrawer;
}
function focusIntent(id){
 selected=id;
 $$('.kxnl-path,.kxnl-edge-label').forEach(n=>{const same=n.dataset.intent===id||(id==='AINT-MGMT'&&String(n.dataset.intent||'').startsWith('AINT-01'));n.classList.toggle('kxnl-focus',same);n.classList.toggle('kxnl-dim',!same)});
}
function clearFocus(){ $$('.kxnl-path,.kxnl-edge-label').forEach(n=>n.classList.remove('kxnl-focus','kxnl-dim')) }
function bind(){
 const stage=$('.kxnl-stage');if(!stage||stage.dataset.bound==='1')return;stage.dataset.bound='1';
 stage.addEventListener('click',e=>{
   const n=e.target.closest('.kxnl-node');if(n){objectDrawer(n.dataset.object);return}
   const p=e.target.closest('.kxnl-path[data-intent],.kxnl-edge-label[data-intent]');
   if(p){const id=p.dataset.intent;if(REL[id]){focusIntent(id);relationshipDrawer(id)}}
 });
 stage.addEventListener('pointerover',e=>{if(selected)return;const p=e.target.closest('.kxnl-path[data-intent],.kxnl-edge-label[data-intent]');if(p&&REL[p.dataset.intent])focusIntent(p.dataset.intent)});
 stage.addEventListener('pointerout',e=>{if(selected)return;const p=e.target.closest('.kxnl-path[data-intent],.kxnl-edge-label[data-intent]');if(p)clearFocus()});
}
function sync(){
 if(viewId()==='T02'){
   const g=$('#groups');
   if(g&&!$('.kxnl-stage',g))renderNodeLink();
   else patchChrome();
 }else{
   document.body.classList.remove('kx-network-node-link');
   lastRendered='';
 }
}
function hook(){
 try{
  if(typeof render==='function'&&!render.__kxNodeLinkV1a4){
   const prev=render;
   const wrapped=function(){const out=prev.apply(this,arguments);setTimeout(sync,0);return out};
   wrapped.__kxNodeLinkV1a4=true;render=wrapped;
  }
 }catch(_){}
 document.addEventListener('click',e=>{if(e.target.closest('#tabs .tab,#tabs button,#fitBtn,#plusBtn,#minusBtn'))setTimeout(sync,0)},true);
 window.addEventListener('hashchange',()=>setTimeout(sync,0));
 window.addEventListener('resize',()=>{if(viewId()==='T02'&&lastRendered==='T02')setTimeout(()=>{try{$('#fitBtn')?.click()}catch(_){}},120)});
}
hook();
setTimeout(sync,0);
setTimeout(sync,300);
})();