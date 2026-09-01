(function(){
'use strict';
const BOOT=window.DCTS_VIEWER_BOOT||{};
const S={objects:new Map(),views:new Map(),intents:new Map(),profile:null,filter:'all',scheduled:false,observer:null};
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const base=()=>String(BOOT.packageBase||'').replace(/\/$/,'');
const url=(b,p)=>/^https?:/i.test(String(p||''))?p:(String(p||'').startsWith('/')?p:`${b}/${p}`);
const state=()=>{const q=new URLSearchParams(location.hash.replace(/^#/,''));return{view:q.get('view')||'T00',mode:q.get('mode')||'PRESENTATION',lang:q.get('lang')||'en',object:q.get('object')||null,member:q.get('member')||null};};
const tr=()=>state().lang==='tr';
async function json(u){const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error(`${r.status} ${u}`);return r.json();}
async function load(){
 const b=base();if(!b)return;
 const m=await json(`${b}/package-manifest.json?dctsrev=v1a11`),rr=m.resources||{};
 const pp=BOOT.engineeringProfile||rr.engineering_profiles?.path;if(!pp)return;
 const [od,vd,pd]=await Promise.all([
  json(url(b,rr.objects.path)),json(url(b,rr.views.path)),json(url(b,pp)+(String(pp).includes('?')?'&':'?')+'dctsrev=v1a11')
 ]);
 (od.objects||[]).forEach(o=>S.objects.set(o.object_id,o));
 (vd.views||[]).forEach(v=>{S.views.set(v.view_id,v);(v.presentation_intents||[]).forEach(i=>S.intents.set(i.intent_id,i));});
 S.profile=(pd.profiles||{}).T02||null;
}
function active(){const s=state();return s.view==='T02'&&s.mode==='ENGINEERING'&&!!S.profile;}
function lane(id){return (S.profile?.layout?.lanes||[]).find(x=>x.id===id)||{object_ids:[]};}
function objs(id){return lane(id).object_ids.map(x=>S.objects.get(x)).filter(Boolean);}
function role(o){const r=String(o?.functional_role||'').toUpperCase();for(const [n,l] of [['STORAGE_SWITCH','STORAGE SW'],['OOB_SWITCH','OOB'],['SPINE','SPINE'],['LEAF','LEAF'],['FIREWALL','FIREWALL'],['.ADC','ADC'],['INTERCONNECT','INTERCONNECT'],['CONTROLLER','CONTROLLER'],['ANALYTICS','ANALYTICS'],['VIRTUALIZATION_HOST','COMPUTE'],['DISTRIBUTED_STORAGE_NODE','STORAGE']])if(r.includes(n))return l;return (r.split('.').filter(Boolean).pop()||o?.object_type||'DEVICE').replaceAll('_',' ');}
function rc(o){return role(o).toLowerCase().replace(/[^a-z0-9]+/g,'-');}
function qty(o){const q=Number(o?.quantity);return Number.isFinite(q)&&q>0?q:1;}
function shortName(o){return String(o?.display_name||o?.name||o?.object_id||'').replace(/\s+(Pair|Switches|Nodes|Hosts)$/i,'').trim();}
function groupHead(o){return `<div class="eng11-group-head"><span>${esc(role(o))}</span><b>${esc(shortName(o))}</b><em>QTY ${qty(o)} · ${esc(o.status||'')}</em></div>`;}
function member(o,i,total){return `<button class="eng11-member role-${esc(rc(o))}" type="button" data-object="${esc(o.object_id)}" data-member="${i}"><span>${esc(role(o))}</span><b>${esc(tr()?`Görsel Üye ${i}`:`Visual Member ${i}`)}</b><small>${esc(o.model||o.sku||'')}</small><em>${i}/${total}</em></button>`;}
function deviceGroup(o,expand=true){const q=qty(o);if(!expand||q>4){return `<section class="eng11-group endpoint role-${esc(rc(o))}" data-cluster="${esc(o.object_id)}">${groupHead(o)}<button type="button" class="eng11-endpoint" data-object="${esc(o.object_id)}"><b>${esc(o.display_name||shortName(o))}</b><small>${esc(o.model||o.sku||'')}</small><strong>×${q}</strong></button></section>`;}
 return `<section class="eng11-group role-${esc(rc(o))}" data-cluster="${esc(o.object_id)}">${groupHead(o)}<div class="eng11-members ${q===4?'grid4':''}">${Array.from({length:q},(_,k)=>member(o,k+1,q)).join('')}</div><div class="eng11-open-note">${tr()?'Üye kimliği ve eşleme: OPEN-CONFIRMATION REQUIRED':'Member identity/mapping: OPEN-CONFIRMATION REQUIRED'}</div></section>`;}
function context(){const c=(S.profile?.context_nodes||[])[0];return c?`<div class="eng11-cloud" data-cluster="${esc(c.context_id)}"><span>☁</span><div><b>${esc(c.display_name||'External / Carrier / Internet')}</b><small>${esc(tr()?'Carrier/router uygulaması açık.':'Carrier/router implementation remains open.')}</small></div><em>OPEN</em></div>`:'';}
function markup(){
 const sec=objs('security'),edge=objs('edge')[0],spine=objs('fabric')[0],access=objs('access'),work=objs('workload'),mgmt=objs('mgmt');
 const leaf=access.find(o=>role(o)==='LEAF')||access[0],ss=access.find(o=>role(o)==='STORAGE SW')||access[1],compute=work.find(o=>role(o)==='COMPUTE')||work[0],storage=work.find(o=>role(o)==='STORAGE')||work[1];
 const oob=mgmt.find(o=>role(o)==='OOB'),controller=mgmt.find(o=>role(o)==='CONTROLLER'),analytics=mgmt.find(o=>role(o)==='ANALYTICS');
 return `<div class="eng11-stage"><div class="eng11-toolbar"><div><b>${tr()?'T02 · AĞ MÜHENDİSLİĞİ TOPOLOJİSİ':'T02 · NETWORK ENGINEERING TOPOLOGY'}</b><span>${tr()?'Bağlantı öncelikli · üye gösterimleri quantity-derived placeholderdır':'Connection-first · member views are quantity-derived placeholders'}</span></div><div class="eng11-legend"><span><i class="canonical"></i>Canonical</span><span><i class="open"></i>Open design</span><span><i class="mgmt"></i>Mgmt/OOB</span></div><div class="eng11-filters">${[['all',tr()?'Tümü':'All'],['design',tr()?'Tasarım':'Design'],['management','Mgmt/OOB'],['canonical','Canonical']].map(([k,l])=>`<button type="button" data-filter="${k}" class="${S.filter===k?'on':''}">${l}</button>`).join('')}<em>0C · 12D · 0P</em></div></div>
 <div class="eng11-canvas"><svg class="eng11-links" aria-hidden="true"></svg>
  <div class="eng11-zone z-external"><label>EXTERNAL / CARRIER</label>${context()}</div>
  <div class="eng11-zone z-security"><label>SECURITY / APPLICATION DELIVERY</label><div class="eng11-row security-row">${sec.map(o=>deviceGroup(o)).join('')}</div></div>
  <div class="eng11-zone z-edge"><label>EDGE / INTERCONNECT</label>${edge?deviceGroup(edge):''}</div>
  <div class="eng11-zone z-spine"><label>SPINE / FABRIC CORE</label>${spine?deviceGroup(spine):''}</div>
  <div class="eng11-zone z-access"><label>LEAF / STORAGE ACCESS</label><div class="eng11-row access-row">${leaf?deviceGroup(leaf):''}${ss?deviceGroup(ss):''}</div></div>
  <div class="eng11-zone z-work"><label>COMPUTE / STORAGE ENDPOINTS</label><div class="eng11-row work-row">${compute?deviceGroup(compute,false):''}${storage?deviceGroup(storage,false):''}</div></div>
  <div class="eng11-zone z-mgmt"><label>MANAGEMENT / OOB / ANALYTICS</label><div class="eng11-row mgmt-row">${oob?deviceGroup(oob):''}${controller?deviceGroup(controller):''}${analytics?deviceGroup(analytics):''}</div></div>
  <aside class="eng11-drawer"></aside>
 </div>
 <div class="eng11-footer"><b>${tr()?'KANIT SINIRI':'EVIDENCE BOUNDARY'}</b><span>${esc(tr()?(S.profile?.evidence_policy?.note_tr||''):(S.profile?.evidence_policy?.note||''))}</span><strong>${tr()?'Ring / HA / A-B / port / hız / optik yalnız explicit evidence ile gösterilir.':'Ring / HA / A-B / ports / speed / optics require explicit evidence.'}</strong></div></div>`;
}
function rect(stage,sel){const n=$(sel,stage),c=$('.eng11-canvas',stage);if(!n||!c)return null;const cr=c.getBoundingClientRect(),r=n.getBoundingClientRect();return{x:r.left-cr.left,y:r.top-cr.top,w:r.width,h:r.height,cx:r.left-cr.left+r.width/2,cy:r.top-cr.top+r.height/2};}
function cluster(stage,id){return rect(stage,`[data-cluster="${CSS.escape(id)}"]`);}
function members(stage,id){const c=$('.eng11-canvas',stage),cr=c.getBoundingClientRect();return $$(`.eng11-member[data-object="${CSS.escape(id)}"]`,stage).map(n=>{const r=n.getBoundingClientRect();return{x:r.left-cr.left,y:r.top-cr.top,w:r.width,h:r.height,cx:r.left-cr.left+r.width/2,cy:r.top-cr.top+r.height/2};});}
function path(svg,d,kind,from='',to='',intent=''){const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',d);p.classList.add('eng11-link',kind);p.dataset.kind=kind;p.dataset.from=from;p.dataset.to=to;p.dataset.intent=intent;svg.appendChild(p);return p;}
function txt(svg,x,y,v,kind='open'){const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',x);t.setAttribute('y',y);t.setAttribute('text-anchor','middle');t.classList.add('eng11-label',kind);t.textContent=v;svg.appendChild(t);return t;}
function ortho(a,b){const sy=b.cy>=a.cy?a.y+a.h:a.y,ty=b.cy>=a.cy?b.y:b.y+b.h,sx=a.cx,tx=b.cx,my=(sy+ty)/2;return{d:`M ${sx} ${sy} V ${my} H ${tx} V ${ty}`,x:(sx+tx)/2,y:my};}
function horiz(a,b){const sx=b.cx>=a.cx?a.x+a.w:a.x,tx=b.cx>=a.cx?b.x:b.x+b.w,sy=a.cy,ty=b.cy,mx=(sx+tx)/2;return{d:`M ${sx} ${sy} H ${mx} V ${ty} H ${tx}`,x:mx,y:(sy+ty)/2};}
function intent(stage,svg,id,label,kind='open'){const i=S.intents.get(id);if(!i)return;const f=i.from_object_id||i.from_context,t=i.to_object_id||i.to_context,a=cluster(stage,f),b=cluster(stage,t);if(!a||!b)return;const g=Math.abs(b.cx-a.cx)>Math.abs(b.cy-a.cy)*1.25?horiz(a,b):ortho(a,b);path(svg,g.d,kind,f,t,id);txt(svg,g.x,g.y-8,label,kind);}
function mesh(stage,svg){const sp=objs('fabric')[0],ac=objs('access'),lf=ac.find(o=>role(o)==='LEAF')||ac[0];if(!sp||!lf)return;const s=members(stage,sp.object_id),l=members(stage,lf.object_id);if(!s.length||!l.length)return;for(const a of s)for(const b of l)path(svg,`M ${a.cx} ${a.y+a.h} L ${b.cx} ${b.y}`,'fabric-open',sp.object_id,lf.object_id,'AINT-005');const y=(Math.max(...s.map(x=>x.y+x.h))+Math.min(...l.map(x=>x.y)))/2;txt(svg,(s[0].cx+s[s.length-1].cx+l[0].cx+l[l.length-1].cx)/4,y-8,tr()?'OPEN DESIGN FABRIC · ÜYE EŞLEMESİ DOĞRULANMADI':'OPEN DESIGN FABRIC · MEMBER MAPPING UNCONFIRMED','fabric-open');}
function draw(){const stage=$('.eng11-stage');if(!stage)return;const svg=$('.eng11-links',stage);if(!svg)return;svg.innerHTML='';
 intent(stage,svg,'AINT-000','OPEN · EXTERNAL INGRESS');intent(stage,svg,'AINT-001','OPEN');intent(stage,svg,'AINT-002','OPEN');intent(stage,svg,'AINT-003','OPEN · SECURITY HANDOFF');intent(stage,svg,'AINT-004','OPEN · FABRIC UPLINK');mesh(stage,svg);intent(stage,svg,'AINT-006','OPEN · STORAGE ACCESS');intent(stage,svg,'AINT-007','OPEN · COMPUTE ACCESS');intent(stage,svg,'AINT-008','OPEN · STORAGE PATH');intent(stage,svg,'AINT-013','MGMT/OOB','management');intent(stage,svg,'AINT-014','CONTROL','management');intent(stage,svg,'AINT-015','TELEMETRY','management');filter(stage);
}
function filter(stage){$$('.eng11-link',stage).forEach(p=>{let show=true;if(S.filter==='design')show=p.dataset.kind!=='management';else if(S.filter==='management')show=p.dataset.kind==='management';else if(S.filter==='canonical')show=false;p.classList.toggle('filtered',!show);});$$('.eng11-label',stage).forEach(t=>{let show=true;if(S.filter==='design')show=!t.classList.contains('management');else if(S.filter==='management')show=t.classList.contains('management');else if(S.filter==='canonical')show=false;t.classList.toggle('filtered',!show);});}
function detail(o,member){const q=qty(o);return `<div class="eng11-drawer-head"><div><small>${esc(role(o))}</small><h3>${esc(o.display_name||shortName(o))}</h3></div><button type="button" data-close>×</button></div><div class="eng11-drawer-grid"><div><span>Vendor / Model</span><b>${esc([o.vendor,o.model].filter(Boolean).join(' · ')||'—')}</b></div><div><span>Quantity</span><b>${q}</b></div><div><span>Visual member</span><b>${esc(member||'Group')}</b></div><div><span>Object status</span><b>${esc(o.status||'—')}</b></div></div><div class="eng11-drawer-note">${tr()?'Visual member yalnız quantity-derived placeholderdır. Fiziksel kimlik, HA/A-B, port, hız, optik ve gerçek eşleme OPEN-CONFIRMATION REQUIRED.':'Visual member is quantity-derived only. Physical identity, HA/A-B, ports, speed, optics and real mapping are OPEN-CONFIRMATION REQUIRED.'}</div>`;}
function openDrawer(stage,id,member){const o=S.objects.get(id),d=$('.eng11-drawer',stage);if(!o||!d)return;d.innerHTML=detail(o,member);d.classList.add('open');d.querySelector('[data-close]')?.addEventListener('click',()=>{d.classList.remove('open');d.innerHTML='';});}
function render(){const scene=$('#scene');if(!scene)return;document.documentElement.dataset.dctsEngineeringTopology11=active()?'active':'inactive';if(!active()){scene.querySelector('.eng11-stage')?.remove();return;}scene.querySelector('.eng10-stage')?.classList.add('eng11-superseded');scene.querySelector('.engineering-diagram-stage')?.classList.add('eng11-superseded');scene.querySelector('.engineering-schematic-stage')?.classList.add('eng11-superseded');let stage=scene.querySelector('.eng11-stage');if(!stage){const wrap=document.createElement('div');wrap.innerHTML=markup();stage=wrap.firstElementChild;scene.appendChild(stage);stage.addEventListener('click',e=>{const f=e.target.closest('[data-filter]');if(f){S.filter=f.dataset.filter;$$('[data-filter]',stage).forEach(x=>x.classList.toggle('on',x===f));filter(stage);return;}const n=e.target.closest('[data-object]');if(n)openDrawer(stage,n.dataset.object,n.dataset.member||null);});}requestAnimationFrame(()=>requestAnimationFrame(draw));}
function schedule(){if(S.scheduled)return;S.scheduled=true;requestAnimationFrame(()=>{S.scheduled=false;render();});}
async function boot(){let i=0;while(!$('.dcts-app')&&i++<120)await new Promise(r=>setTimeout(r,40));try{await load();}catch(e){console.warn('[DCTS v1a11] load failed',e);return;}document.documentElement.classList.add('dcts-engineering-topology-v1a11');schedule();const root=$('.dcts-app')||document.body;S.observer=new MutationObserver(schedule);S.observer.observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});window.addEventListener('hashchange',()=>{S.filter='all';schedule();});window.addEventListener('resize',schedule);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();