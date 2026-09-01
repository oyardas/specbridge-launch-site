(function(){
'use strict';
const BOOT=window.DCTS_VIEWER_BOOT||{};
const S={objects:new Map(),views:new Map(),profile:null,intents:new Map(),filter:'all',scheduled:false,observer:null};
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const base=()=>String(BOOT.packageBase||'').replace(/\/$/,'');
const url=(b,p)=>/^https?:/i.test(p)?p:(String(p||'').startsWith('/')?p:`${b}/${p}`);
const hashState=()=>{const q=new URLSearchParams(location.hash.replace(/^#/,''));return{view:q.get('view')||'T00',mode:q.get('mode')||'PRESENTATION',lang:q.get('lang')||'en',design:q.get('design')!=='0',object:q.get('object')||null,member:q.get('member')||null};};
const tr=()=>hashState().lang==='tr';
async function getJson(u){const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error(`${r.status} ${u}`);return r.json();}
async function load(){
 const b=base(); if(!b)return;
 const manifest=await getJson(`${b}/package-manifest.json?dctsrev=v1a10`), rr=manifest.resources||{};
 const profilePath=BOOT.engineeringProfile||rr.engineering_profiles?.path; if(!profilePath)return;
 const [od,vd,pd]=await Promise.all([
   getJson(url(b,rr.objects.path)),
   getJson(url(b,rr.views.path)),
   getJson(url(b,profilePath)+(String(profilePath).includes('?')?'&':'?')+'dctsrev=v1a10')
 ]);
 (od.objects||[]).forEach(o=>S.objects.set(o.object_id,o));
 (vd.views||[]).forEach(v=>{S.views.set(v.view_id,v);(v.presentation_intents||[]).forEach(i=>S.intents.set(i.intent_id,i));});
 S.profile=(pd.profiles||{}).T02||null;
}
function active(){const h=hashState();return h.view==='T02'&&h.mode==='ENGINEERING'&&!!S.profile;}
function obj(id){return S.objects.get(id)||(S.profile?.context_nodes||[]).find(x=>x.context_id===id)||null;}
function lane(id){return (S.profile?.layout?.lanes||[]).find(x=>x.id===id)||{id,object_ids:[]};}
function role(o){const r=String(o?.functional_role||'').toUpperCase();for(const [needle,label] of [['STORAGE_SWITCH','STORAGE SW'],['OOB_SWITCH','OOB'],['SPINE','SPINE'],['LEAF','LEAF'],['FIREWALL','FIREWALL'],['.ADC','ADC'],['INTERCONNECT','INTERCONNECT'],['CONTROLLER','CONTROLLER'],['ANALYTICS','ANALYTICS'],['VIRTUALIZATION_HOST','COMPUTE'],['DISTRIBUTED_STORAGE_NODE','STORAGE']])if(r.includes(needle))return label;return (r.split('.').filter(Boolean).pop()||o?.object_type||'DEVICE').replaceAll('_',' ');}
function roleClass(o){return role(o).toLowerCase().replace(/[^a-z0-9]+/g,'-');}
function quantity(o){const q=Number(o?.quantity);return Number.isFinite(q)&&q>0?q:1;}
function statusClass(s){const x=String(s||'OPEN-CONFIRMATION REQUIRED').toUpperCase();if(x==='CONFIRMED')return'confirmed';if(x==='VENDOR PROPOSAL')return'vendor';if(x==='WORKING ASSUMPTION')return'assumption';if(x==='CUSTOMER INPUT')return'customer';return'open';}
function statusShort(s){const x=String(s||'OPEN-CONFIRMATION REQUIRED').toUpperCase();if(x==='OPEN-CONFIRMATION REQUIRED')return'OPEN';if(x==='WORKING ASSUMPTION')return'ASSUMPTION';if(x==='VENDOR PROPOSAL')return'PROPOSAL';if(x==='CUSTOMER INPUT')return'CUSTOMER';return x;}
function pairLabel(o){const n=String(o?.display_name||'').replace(/\s+(Pair|Switches|Nodes|Hosts)$/i,'').trim();return n||role(o);}
function memberNode(o,index,total){
 const id=o.object_id, model=o.model||o.sku||'', memberText=total===1?(o.display_name||role(o)):(tr()?`Görsel Üye ${index}`:`Visual Member ${index}`);
 return `<button type="button" class="eng10-member role-${esc(roleClass(o))} status-${statusClass(o.status)}" data-object="${esc(id)}" data-member="${index}" title="${esc(`${o.display_name||id} · ${memberText} · quantity-derived placeholder`)}">
   <span class="eng10-member-role">${esc(role(o))}</span>
   <strong>${esc(memberText)}</strong>
   <small>${esc(model)}</small>
   <em>${esc(index)}/${esc(total)}</em>
 </button>`;
}
function expandedCluster(o,opts={}){
 const q=quantity(o), expand=opts.expand!==false && q<=4, cls=`eng10-cluster role-${esc(roleClass(o))}`;
 const name=pairLabel(o); let body='';
 if(expand){body=`<div class="eng10-members ${q===4?'grid4':''}">${Array.from({length:q},(_,i)=>memberNode(o,i+1,q)).join('')}</div>`;}
 else{
   const shown=Math.min(q,4);body=`<button type="button" class="eng10-endpoint role-${esc(roleClass(o))}" data-object="${esc(o.object_id)}"><span>${esc(role(o))}</span><strong>${esc(o.display_name||name)}</strong><small>${esc(o.model||o.sku||'')}</small><b>×${q}</b><div class="eng10-stack">${Array.from({length:shown},()=>'<i></i>').join('')}${q>shown?`<em>+${q-shown}</em>`:''}</div></button>`;
 }
 return `<section class="${cls}" data-cluster="${esc(o.object_id)}"><header><span>${esc(role(o))}</span><b>${esc(name)}</b><small>${esc(o.vendor||'')}</small></header>${body}<footer><span>${esc(statusShort(o.status))}</span><b>QTY ${q}</b></footer></section>`;
}
function contextNode(){const c=(S.profile?.context_nodes||[])[0];if(!c)return'';return `<div class="eng10-cloud" data-cluster="${esc(c.context_id)}"><span>☁</span><div><b>${esc(c.display_name||'External / Carrier / Internet')}</b><small>${esc(tr()?'Carrier/router uygulama ayrıntıları açık.':'Carrier/router implementation details remain open.')}</small></div><em>OPEN</em></div>`;}
function laneObjects(id){return lane(id).object_ids.map(obj).filter(Boolean);}
function markup(){
 const sec=laneObjects('security'), edge=laneObjects('edge')[0], fabric=laneObjects('fabric')[0], access=laneObjects('access'), work=laneObjects('workload'), mgmt=laneObjects('mgmt');
 const leaf=access.find(o=>role(o)==='LEAF')||access[0], storageSw=access.find(o=>role(o)==='STORAGE SW')||access[1];
 const compute=work.find(o=>role(o)==='COMPUTE')||work[0], storage=work.find(o=>role(o)==='STORAGE')||work[1];
 const oob=mgmt.find(o=>role(o)==='OOB'), controller=mgmt.find(o=>role(o)==='CONTROLLER'), analytics=mgmt.find(o=>role(o)==='ANALYTICS');
 return `<div class="eng10-stage">
   <div class="eng10-toolbar"><div><b>${tr()?'T02 · AĞ MÜHENDİSLİĞİ TOPOLOJİSİ':'T02 · NETWORK ENGINEERING TOPOLOGY'}</b><span>${tr()?'Üye-ayrıştırılmış bağlantı görünümü · tüm üye kimlikleri quantity-derived görsel placeholderdır':'Member-decomposed connectivity view · all member identities are quantity-derived visual placeholders'}</span></div><div class="eng10-legend"><span><i class="canonical"></i>Canonical</span><span><i class="design"></i>Design intent</span><span><i class="illustrative"></i>${tr()?'Illustrative fabric':'Illustrative fabric'}</span><span><i class="mgmt"></i>Mgmt/OOB</span></div><div class="eng10-filter">${[['all',tr()?'Tümü':'All'],['design',tr()?'Tasarım':'Design'],['management','Mgmt/OOB'],['canonical','Canonical']].map(([k,l])=>`<button data-filter="${k}" class="${S.filter===k?'on':''}">${l}</button>`).join('')}<em>0C · 12D · 0P</em></div></div>
   <div class="eng10-canvas">
     <svg class="eng10-links" aria-hidden="true"></svg>
     <section class="eng10-domain external"><label>EXTERNAL / CARRIER</label>${contextNode()}</section>
     <section class="eng10-domain security"><label>SECURITY / APPLICATION DELIVERY</label><div class="eng10-chain">${sec.map(o=>expandedCluster(o)).join('<div class="eng10-chain-gap"></div>')}</div></section>
     <section class="eng10-domain edge"><label>EDGE / INTERCONNECT</label>${edge?expandedCluster(edge):''}</section>
     <section class="eng10-domain fabric"><label>SPINE / FABRIC CORE</label>${fabric?expandedCluster(fabric):''}<div class="eng10-fabric-note">${tr()?'ILLUSTRATIVE DESIGN FABRIC · ÜYE EŞLEMESİ DOĞRULANMADI':'ILLUSTRATIVE DESIGN FABRIC · MEMBER MAPPING UNCONFIRMED'}</div></section>
     <section class="eng10-domain access"><label>LEAF / STORAGE ACCESS</label><div class="eng10-access-grid">${leaf?expandedCluster(leaf):''}${storageSw?expandedCluster(storageSw):''}</div></section>
     <section class="eng10-domain workload"><label>COMPUTE / STORAGE ENDPOINTS</label><div class="eng10-work-grid">${compute?expandedCluster(compute,{expand:false}):''}${storage?expandedCluster(storage,{expand:false}):''}</div></section>
     <section class="eng10-domain mgmt"><label>MANAGEMENT / OOB / ANALYTICS</label>${oob?expandedCluster(oob):''}${controller?expandedCluster(controller):''}${analytics?expandedCluster(analytics):''}</section>
   </div>
   <aside class="eng10-drawer"></aside>
   <div class="eng10-footer"><b>${tr()?'KANIT SINIRI':'EVIDENCE BOUNDARY'}</b><span>${esc(tr()?(S.profile?.evidence_policy?.note_tr||''):(S.profile?.evidence_policy?.note||''))}</span><strong>${tr()?'Member 1/2 etiketleri fiziksel kimlik değildir · A/B, HA, port, hız, optik ve gerçek member mapping yalnız explicit evidence ile eklenir.':'Member 1/2 labels are not physical identities · A/B, HA, ports, speed, optics and actual member mapping require explicit evidence.'}</strong></div>
 </div>`;
}
function rect(stage,selector){const n=$(selector,stage),c=$('.eng10-canvas',stage);if(!n||!c)return null;const cr=c.getBoundingClientRect(),r=n.getBoundingClientRect();return{x:r.left-cr.left,y:r.top-cr.top,w:r.width,h:r.height,cx:r.left-cr.left+r.width/2,cy:r.top-cr.top+r.height/2};}
function clusterRect(stage,id){return rect(stage,`[data-cluster="${CSS.escape(id)}"]`);}
function memberRects(stage,id){return $$(`.eng10-member[data-object="${CSS.escape(id)}"]`,stage).map(n=>{const c=$('.eng10-canvas',stage),cr=c.getBoundingClientRect(),r=n.getBoundingClientRect();return{x:r.left-cr.left,y:r.top-cr.top,w:r.width,h:r.height,cx:r.left-cr.left+r.width/2,cy:r.top-cr.top+r.height/2};});}
function intentBy(id){return S.intents.get(id)||null;}
function drawPath(svg,d,cls,meta={}){const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',d);p.classList.add('eng10-link',...cls.split(' ').filter(Boolean));Object.entries(meta).forEach(([k,v])=>p.dataset[k]=v);svg.appendChild(p);return p;}
function text(svg,x,y,value,cls='design'){const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',x);t.setAttribute('y',y);t.setAttribute('text-anchor','middle');t.classList.add('eng10-link-label',cls);t.textContent=value;svg.appendChild(t);return t;}
function orth(a,b){const down=b.cy>=a.cy,sy=down?a.y+a.h:a.y,ty=down?b.y:b.y+b.h,sx=a.cx,tx=b.cx,my=(sy+ty)/2;return{d:`M ${sx} ${sy} V ${my} H ${tx} V ${ty}`,x:(sx+tx)/2,y:my};}
function horizontal(a,b){const right=b.cx>=a.cx,sx=right?a.x+a.w:a.x,tx=right?b.x:b.x+b.w,sy=a.cy,ty=b.cy,mx=(sx+tx)/2;return{d:`M ${sx} ${sy} H ${mx} V ${ty} H ${tx}`,x:mx,y:(sy+ty)/2};}
function drawIntent(stage,svg,intentId,label,kind='design'){
 const i=intentBy(intentId);if(!i)return;const from=i.from_object_id||i.from_context,to=i.to_object_id||i.to_context,a=clusterRect(stage,from),b=clusterRect(stage,to);if(!a||!b)return;const g=Math.abs(b.cx-a.cx)>Math.abs(b.cy-a.cy)*1.2?horizontal(a,b):orth(a,b);drawPath(svg,g.d,kind,{kind,from,to,intent:intentId});text(svg,g.x,g.y-7,label,kind);
}
function drawFabric(stage,svg){
 const spine=laneObjects('fabric')[0], access=laneObjects('access'), leaf=access.find(o=>role(o)==='LEAF')||access[0];if(!spine||!leaf)return;
 const s=memberRects(stage,spine.object_id),l=memberRects(stage,leaf.object_id);if(!s.length||!l.length)return;
 for(const a of s)for(const b of l){const sy=a.y+a.h,ty=b.y,sx=a.cx,tx=b.cx;drawPath(svg,`M ${sx} ${sy} L ${tx} ${ty}`,'illustrative',{kind:'illustrative',from:spine.object_id,to:leaf.object_id,intent:'AINT-005'});}
 const x=(s.reduce((n,r)=>n+r.cx,0)/s.length+l.reduce((n,r)=>n+r.cx,0)/l.length)/2,y=(Math.max(...s.map(r=>r.y+r.h))+Math.min(...l.map(r=>r.y)))/2;text(svg,x,y,tr()?'DESIGN FABRIC · MEMBER MAPPING DOĞRULANMADI':'DESIGN FABRIC · MEMBER MAPPING UNCONFIRMED','illustrative');
}
function draw(){const stage=$('.eng10-stage');if(!stage)return;const svg=$('.eng10-links',stage);if(!svg)return;svg.innerHTML='';
 drawIntent(stage,svg,'AINT-000',tr()?'DESIGN · EXTERNAL INGRESS':'DESIGN · EXTERNAL INGRESS');
 drawIntent(stage,svg,'AINT-001','DESIGN');drawIntent(stage,svg,'AINT-002','DESIGN');drawIntent(stage,svg,'AINT-003',tr()?'DESIGN · SECURITY HANDOFF':'DESIGN · SECURITY HANDOFF');drawIntent(stage,svg,'AINT-004',tr()?'DESIGN · FABRIC UPLINK':'DESIGN · FABRIC UPLINK');
 drawFabric(stage,svg);
 drawIntent(stage,svg,'AINT-006',tr()?'DESIGN · STORAGE ACCESS':'DESIGN · STORAGE ACCESS');drawIntent(stage,svg,'AINT-007',tr()?'DESIGN · COMPUTE ACCESS':'DESIGN · COMPUTE ACCESS');drawIntent(stage,svg,'AINT-008',tr()?'DESIGN · STORAGE PATH':'DESIGN · STORAGE PATH');
 drawIntent(stage,svg,'AINT-013','MGMT/OOB','management');drawIntent(stage,svg,'AINT-014','CONTROL','management');drawIntent(stage,svg,'AINT-015','TELEMETRY','management');applyFilter(stage);
}
function applyFilter(stage){const h=hashState();$$('.eng10-link',stage).forEach(p=>{let show=h.design;const kind=p.dataset.kind||'design';if(S.filter==='management')show=kind==='management';else if(S.filter==='design')show=kind==='design'||kind==='illustrative';else if(S.filter==='canonical')show=false;p.classList.toggle('filtered',!show);});$$('.eng10-link-label',stage).forEach(t=>{let show=h.design;if(S.filter==='management')show=t.classList.contains('management');else if(S.filter==='design')show=!t.classList.contains('management');else if(S.filter==='canonical')show=false;t.classList.toggle('filtered',!show);});}
function drawer(stage,o,member){const d=$('.eng10-drawer',stage);if(!d)return;if(!o){d.classList.remove('open');d.innerHTML='';return;}const q=quantity(o),m=member?Number(member):null;d.innerHTML=`<div class="eng10-drawer-head"><div><small>${esc(role(o))}</small><h3>${esc(o.display_name||o.object_id)}</h3>${m?`<p>${tr()?'Görsel üye placeholder':'Visual member placeholder'} ${m}/${q}</p>`:''}</div><button data-close>×</button></div><div class="eng10-drawer-grid"><div><span>Vendor / Model</span><b>${esc([o.vendor,o.model].filter(Boolean).join(' · ')||'—')}</b></div><div><span>Quantity</span><b>${q}</b></div><div><span>Functional role</span><b>${esc(o.functional_role||role(o))}</b></div><div><span>Status</span><b>${esc(o.status||'—')}</b></div></div><div class="eng10-warning">${esc(tr()?'Bu üye etiketi canonical cihaz kimliği değildir; yalnız BoQ quantity alanından türetilmiş görsel ayrıştırmadır. Gerçek member adı, A/B, HA, port, hız ve optik OPEN-CONFIRMATION REQUIRED durumundadır.':'This member label is not a canonical device identity; it is a visual decomposition derived only from BoQ quantity. Actual member name, A/B, HA, ports, speed and optics remain OPEN-CONFIRMATION REQUIRED.')}</div>`;d.classList.add('open');$('[data-close]',d).onclick=()=>select(null,null);}
function select(id,member){const q=new URLSearchParams(location.hash.replace(/^#/,''));if(id){q.set('object',id);if(member)q.set('member',member);else q.delete('member');}else{q.delete('object');q.delete('member');}history.replaceState(null,'','#'+q.toString());drawer($('.eng10-stage'),id?S.objects.get(id):null,member);}
function highlight(stage,id){$$('.eng10-member,.eng10-endpoint,.eng10-link',stage).forEach(x=>x.classList.remove('related','muted'));if(!id)return;$$('.eng10-link',stage).forEach(p=>{const hit=p.dataset.from===id||p.dataset.to===id;p.classList.toggle('related',hit);p.classList.toggle('muted',!hit);});$$('.eng10-member,.eng10-endpoint',stage).forEach(n=>{const hit=n.dataset.object===id;n.classList.toggle('related',hit);n.classList.toggle('muted',!hit);});}
function bind(stage){stage.addEventListener('click',e=>{const f=e.target.closest('[data-filter]');if(f){S.filter=f.dataset.filter;$$('[data-filter]',stage).forEach(x=>x.classList.toggle('on',x===f));applyFilter(stage);return;}const n=e.target.closest('[data-object]');if(n)select(n.dataset.object,n.dataset.member||null);});stage.addEventListener('mouseover',e=>{const n=e.target.closest('[data-object]');if(n)highlight(stage,n.dataset.object);});stage.addEventListener('mouseout',e=>{const n=e.target.closest('[data-object]');if(n&&!n.contains(e.relatedTarget))highlight(stage,null);});}
function render(){document.documentElement.dataset.dctsEngineeringTopology=active()?'active':'inactive';const scene=$('#scene');if(!scene)return;let stage=scene.querySelector('.eng10-stage');if(!active()){stage?.remove();return;}scene.querySelector('.engineering-diagram-stage')?.classList.add('eng10-superseded');scene.querySelector('.engineering-schematic-stage')?.classList.add('eng10-superseded');scene.querySelector('.engineering-profile-stage')?.classList.add('eng10-superseded');if(!stage){scene.insertAdjacentHTML('beforeend',markup());stage=scene.querySelector('.eng10-stage');bind(stage);}requestAnimationFrame(()=>requestAnimationFrame(draw));const h=hashState();drawer(stage,h.object?S.objects.get(h.object):null,h.member);}
function schedule(){if(S.scheduled)return;S.scheduled=true;requestAnimationFrame(()=>{S.scheduled=false;render();});}
async function boot(){let tries=0;while(!$('.dcts-app')&&tries++<140)await new Promise(r=>setTimeout(r,40));try{await load();}catch(e){console.warn('[DCTS engineering topology v1a10] load failed',e);return;}document.documentElement.classList.add('dcts-engineering-topology-v1a10');schedule();const root=$('.dcts-app')||document.body;S.observer=new MutationObserver(()=>schedule());S.observer.observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});window.addEventListener('hashchange',()=>{S.filter='all';schedule();});window.addEventListener('resize',schedule);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();