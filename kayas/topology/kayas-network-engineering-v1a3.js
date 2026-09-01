/* KAYAS T02 engineering connection grammar — preview only; canonical graph untouched. */
(function(){
'use strict';
if(window.KAYAS_NETWORK_ENGINEERING_V1A3)return;
window.KAYAS_NETWORK_ENGINEERING_V1A3=true;

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const IDS={
  perimeter:'topobj_dc750ed177fb87984c3a',adc:'topobj_d22103a970df15ebc013',egress:'topobj_4a235cb934f5c5a46901',
  interconnect:'topobj_f8b344bf31c75571769f',spine:'topobj_6c9587efb3d0b49bed8e',leaf:'topobj_689f284af5e658a26b88',
  storageSwitch:'topobj_dc742080923da3053e85',compute:'topobj_6de1118a2c5c7827fc65',storage:'topobj_6a8d3500c63b7ce61860',
  oob:'topobj_56b5cee0b4c39857a70a',controller:'topobj_bbc53ea9c663404b7a82',analytics:'topobj_60b6648480d5d86edc25'
};
const META={
 'AINT-000':{label:'EXTERNAL INGRESS',kind:'design',from:'External / Carrier / Internet',to:IDS.perimeter,relation:'External Service Ingress'},
 'AINT-001':{label:'SECURITY',kind:'design',from:IDS.perimeter,to:IDS.adc,relation:'Security Service Chain'},
 'AINT-002':{label:'SECURITY',kind:'design',from:IDS.adc,to:IDS.egress,relation:'Security Service Chain'},
 'AINT-003':{label:'HANDOFF',kind:'design',from:IDS.egress,to:IDS.interconnect,relation:'Security → Network Handoff'},
 'AINT-004':{label:'UPLINK',kind:'design',from:IDS.interconnect,to:IDS.spine,relation:'Interconnect → Fabric'},
 'AINT-005':{label:'FABRIC',kind:'illustrative',from:IDS.spine,to:IDS.leaf,relation:'Spine → Leaf Fabric'},
 'AINT-006':{label:'STORAGE ACCESS',kind:'design',from:IDS.leaf,to:IDS.storageSwitch,relation:'Leaf → Storage Network'},
 'AINT-007':{label:'COMPUTE ACCESS',kind:'design',from:IDS.leaf,to:IDS.compute,relation:'Compute Access'},
 'AINT-008':{label:'STORAGE PATH',kind:'design',from:IDS.storageSwitch,to:IDS.storage,relation:'Storage Data Path'},
 'AINT-013':{label:'OOB',kind:'management',from:IDS.oob,to:IDS.spine,relation:'OOB → Fabric Intent'},
 'AINT-014':{label:'CONTROL',kind:'management',from:IDS.controller,to:IDS.spine,relation:'Fabric Control Intent'},
 'AINT-015':{label:'TELEMETRY',kind:'management',from:IDS.analytics,to:IDS.spine,relation:'Fabric Telemetry Intent'}
};
let raf=0,mo=null,ro=null,selectedIntent='';
function viewId(){try{return typeof view!=='undefined'?view:''}catch(_){return''}}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function object(id){try{return typeof obj==='function'?obj(id):null}catch(_){return null}}
function objectName(v){if(!v)return'';if(typeof v==='string'&&v.startsWith('topobj_')){const o=object(v);return o?.name||o?.role||v}return String(v)}
function canvasGeom(node,canvas){if(!node||!canvas)return null;const cr=canvas.getBoundingClientRect(),r=node.getBoundingClientRect(),sx=canvas.offsetWidth/(cr.width||canvas.offsetWidth||1),sy=canvas.offsetHeight/(cr.height||canvas.offsetHeight||1);return{x:(r.left-cr.left)*sx,y:(r.top-cr.top)*sy,w:r.width*sx,h:r.height*sy,cx:(r.left-cr.left+r.width/2)*sx,cy:(r.top-cr.top+r.height/2)*sy}}
function cluster(id){const c=$('.kxne-canvas');if(!c)return null;return canvasGeom(c.querySelector(`[data-cluster="${CSS.escape(id)}"]`),c)}
function svgEl(n,a={}){const e=document.createElementNS('http://www.w3.org/2000/svg',n);Object.entries(a).forEach(([k,v])=>e.setAttribute(k,v));return e}
function title(text){const t=svgEl('title');t.textContent=text;return t}

function cleanupReview(){const svg=$('.kxne-links');if(!svg)return;$$('[data-review^="v1a3-"]',svg).forEach(n=>n.remove())}
function managementBus(){
 if(viewId()!=='T02')return;
 const svg=$('.kxne-links'),canvas=$('.kxne-canvas'),zone=$('.z-management');if(!svg||!canvas||!zone)return;
 ['AINT-013','AINT-014','AINT-015'].forEach(id=>{const p=svg.querySelector(`.kxne-path[data-intent="${id}"]`);if(p)p.style.display='none'});
 const z=canvasGeom(zone,canvas),sp=cluster(IDS.spine),sources=[IDS.oob,IDS.controller,IDS.analytics].map(cluster);if(!z||!sp||sources.some(x=>!x))return;
 const busY=z.y+13,left=Math.max(z.x+34,Math.min(...sources.map(x=>x.cx))-20),right=Math.min(z.x+z.w-34,Math.max(...sources.map(x=>x.cx))+20),trunkX=Math.min(canvas.offsetWidth-78,z.x+z.w-42),spineX=sp.x+sp.w;
 const bus=svgEl('path',{d:`M ${left} ${busY} H ${right}`,'class':'kxne-path management kxne-bus','data-review':'v1a3-mgmt-bus','data-intent':'AINT-MGMT-BUS'});bus.appendChild(title('Management/OOB presentation bus · individual OOB, CONTROL and TELEMETRY intents remain separate · OPEN-CONFIRMATION REQUIRED'));svg.appendChild(bus);
 const trunk=svgEl('path',{d:`M ${right} ${busY} H ${trunkX} V ${sp.cy} H ${spineX}`,'class':'kxne-path management kxne-bus-trunk','data-review':'v1a3-mgmt-trunk','data-intent':'AINT-MGMT-BUS'});trunk.appendChild(title('Management/OOB presentation trunk to fabric context · not a physical cable'));svg.appendChild(trunk);
 [['AINT-013',sources[0]],['AINT-014',sources[1]],['AINT-015',sources[2]]].forEach(([id,g])=>{const m=META[id],p=svgEl('path',{d:`M ${g.cx} ${g.y} V ${busY}`,'class':'kxne-path management kxne-bus-stub','data-review':`v1a3-${id}`,'data-intent':id});p.appendChild(title(`${id} · ${m.relation} · OPEN-CONFIRMATION REQUIRED`));svg.appendChild(p);const tx=svgEl('text',{x:g.cx,y:busY-5,'text-anchor':'middle','class':'kxne-label management kxne-bus-label','data-review':`v1a3-label-${id}`,'data-intent':id});tx.textContent=m.label;svg.appendChild(tx)});
 const lbl=svgEl('text',{x:(left+right)/2,y:busY-5,'text-anchor':'middle','class':'kxne-label management kxne-bus-title','data-review':'v1a3-mgmt-title','data-intent':'AINT-MGMT-BUS'});lbl.textContent='MGMT / OOB BUS';svg.appendChild(lbl);
}
function fabricLabel(){
 const svg=$('.kxne-links');if(!svg)return;
 const bus=svg.querySelector('[data-review="fabric-bus"]');if(!bus)return;
 bus.classList.add('kxne-bus');bus.dataset.intent='AINT-005';
 const note=$('.kxne-fabric-note');if(note){note.textContent='OPEN FABRIC INTENT · MEMBER MAPPING NOT ASSERTED';note.dataset.intent='AINT-005';note.setAttribute('role','button');note.tabIndex=0}
}
function shortLabels(){
 const svg=$('.kxne-links');if(!svg)return;
 $$('.kxne-label.design',svg).forEach(n=>{const id=n.getAttribute('data-intent');if(id&&META[id])n.textContent=META[id].label});
}
function installHitTargets(){
 const svg=$('.kxne-links');if(!svg)return;
 $$('[data-review^="v1a3-hit-"]',svg).forEach(n=>n.remove());
 const seen=new Set();
 $$('.kxne-path[data-intent]',svg).forEach(p=>{
   const id=p.dataset.intent;if(!id||id==='AINT-MGMT-BUS'||seen.has(`${id}:${p.getAttribute('d')}`))return;seen.add(`${id}:${p.getAttribute('d')}`);
   const h=svgEl('path',{d:p.getAttribute('d'),'class':'kxne-link-hit','data-review':`v1a3-hit-${id}`,'data-intent':id,'tabindex':'0','role':'button','aria-label':`${META[id]?.relation||id} relationship details`});svg.appendChild(h)
 });
}
function setFocus(id,on){
 const svg=$('.kxne-links');if(!svg)return;
 const active=on?id:'';selectedIntent=active||selectedIntent;
 const focusId=active||selectedIntent;
 $$('.kxne-path[data-intent],.kxne-link-hit,.kxne-label[data-intent]',svg).forEach(n=>{const same=n.dataset.intent===focusId||(focusId&&focusId==='AINT-MGMT-BUS'&&String(n.dataset.intent||'').startsWith('AINT-01'));n.classList.toggle('kxne-rel-focus',!!focusId&&same);n.classList.toggle('kxne-rel-dim',!!focusId&&!same)});
 $$('.kxne-cluster,.kxne-external').forEach(n=>n.classList.remove('kxne-rel-node','kxne-rel-node-dim'));
 if(focusId&&META[focusId]){const m=META[focusId];const ids=[m.from,m.to].filter(v=>typeof v==='string'&&v.startsWith('topobj_'));$$('.kxne-cluster').forEach(n=>n.classList.add('kxne-rel-node-dim'));ids.forEach(x=>{const n=$(`[data-cluster="${CSS.escape(x)}"]`);if(n){n.classList.remove('kxne-rel-node-dim');n.classList.add('kxne-rel-node')}});if(!String(m.from).startsWith('topobj_'))$('.kxne-external')?.classList.add('kxne-rel-node')}
 if(!focusId){$$('.kxne-cluster').forEach(n=>n.classList.remove('kxne-rel-node-dim','kxne-rel-node'));$('.kxne-external')?.classList.remove('kxne-rel-node')}
}
function inspector(){let p=$('#kxneLinkInspector');if(p)return p;const right=$('.right');if(!right)return null;p=document.createElement('section');p.id='kxneLinkInspector';p.className='kxne-link-inspector';p.hidden=true;const tabs=$('.itabs',right);(tabs?.parentNode||right).insertBefore(p,tabs?.nextSibling||right.firstChild);return p}
function showInspector(id){const m=META[id];if(!m)return;selectedIntent=id;setFocus(id,true);const p=inspector();if(!p)return;const from=objectName(m.from),to=objectName(m.to);p.hidden=false;p.innerHTML=`<div class="kxne-li-head"><div><span>RELATIONSHIP / EVIDENCE</span><b>${esc(m.label)}</b></div><button type="button" aria-label="Close relationship inspector">×</button></div><div class="kxne-li-status"><strong>OPEN-CONFIRMATION REQUIRED</strong><span>${esc(id)}</span></div><dl><dt>Semantic intent</dt><dd>${esc(m.relation)}</dd><dt>From</dt><dd>${esc(from)}</dd><dt>To</dt><dd>${esc(to)}</dd><dt>Rendering</dt><dd>${m.kind==='management'?'Management/OOB presentation relationship':m.kind==='illustrative'?'Illustrative fabric intent bus':'Open design intent'}</dd><dt>Canonical physical evidence</dt><dd>0 evidenced physical links in KAYAS T02/T03 baseline</dd></dl><div class="kxne-li-note"><b>Evidence boundary</b><p>This path is a presentation/design relationship only. It does not assert member mapping, A/B identity, HA protocol, ports, speed, optics, EVPN/VXLAN or physical cabling.</p></div>`;p.querySelector('button').onclick=()=>{p.hidden=true;selectedIntent='';setFocus('',false)}
}
function bindInteractions(){
 const svg=$('.kxne-links');if(!svg||svg.dataset.v1a3Bound==='1')return;svg.dataset.v1a3Bound='1';svg.style.pointerEvents='auto';
 svg.addEventListener('pointerover',e=>{const h=e.target.closest?.('.kxne-link-hit');if(h&&!selectedIntent)setFocus(h.dataset.intent,true)});
 svg.addEventListener('pointerout',e=>{const h=e.target.closest?.('.kxne-link-hit');if(h&&!selectedIntent)setFocus('',false)});
 svg.addEventListener('click',e=>{const h=e.target.closest?.('.kxne-link-hit');if(h){e.preventDefault();e.stopPropagation();showInspector(h.dataset.intent)}});
 svg.addEventListener('keydown',e=>{const h=e.target.closest?.('.kxne-link-hit');if(h&&(e.key==='Enter'||e.key===' ')){e.preventDefault();showInspector(h.dataset.intent)}});
 const note=$('.kxne-fabric-note');if(note&&!note.dataset.v1a3Bound){note.dataset.v1a3Bound='1';note.addEventListener('click',()=>showInspector('AINT-005'));note.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showInspector('AINT-005')}})}
}
function enhance(){if(viewId()!=='T02')return;cleanupReview();managementBus();fabricLabel();shortLabels();installHitTargets();bindInteractions();if(selectedIntent)setFocus(selectedIntent,true)}
function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>requestAnimationFrame(enhance))}
function hook(){try{if(typeof render==='function'&&!render.__kxV1a3){const prev=render,wrapped=function(){const out=prev.apply(this,arguments);setTimeout(schedule,0);return out};wrapped.__kxV1a3=true;render=wrapped}}catch(_){}
 try{mo?.disconnect();mo=new MutationObserver(schedule);mo.observe($('#groups')||document.body,{childList:true,subtree:true})}catch(_){}
 try{ro?.disconnect();const v=$('.scene-viewport');if(v&&window.ResizeObserver){ro=new ResizeObserver(schedule);ro.observe(v)}}catch(_){}
}
hook();window.addEventListener('resize',schedule);window.addEventListener('hashchange',schedule);setTimeout(schedule,0);setTimeout(schedule,300);
})();
