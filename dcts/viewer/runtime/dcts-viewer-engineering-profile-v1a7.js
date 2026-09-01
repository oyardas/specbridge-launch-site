(function(){
'use strict';
const BOOT=window.DCTS_VIEWER_BOOT||{};
const S={objects:new Map(),relationships:new Map(),views:new Map(),profiles:null,active:null,filter:'all',observer:null,scheduled:false};
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const base=()=>String(BOOT.packageBase||'').replace(/\/$/,'');
const url=(b,p)=>/^https?:/i.test(p)?p:(String(p||'').startsWith('/')?p:`${b}/${p}`);
const hs=()=>{const q=new URLSearchParams(location.hash.replace(/^#/,''));return{view:q.get('view')||'T00',mode:q.get('mode')||'PRESENTATION',lang:q.get('lang')||'en',object:q.get('object')||null};};
const tr=()=>hs().lang==='tr';
async function json(u){const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error(`${r.status} ${u}`);return r.json();}
async function load(){
 const b=base();if(!b)return;
 const manifest=await json(`${b}/package-manifest.json`),rr=manifest.resources||{};
 if(!rr.engineering_profiles?.path)return;
 const [od,rd,vd,pd]=await Promise.all([
  json(url(b,rr.objects.path)),json(url(b,rr.relationships.path)),json(url(b,rr.views.path)),json(url(b,rr.engineering_profiles.path))
 ]);
 (od.objects||[]).forEach(o=>S.objects.set(o.object_id,o));
 (rd.relationships||[]).forEach(r=>S.relationships.set(r.relationship_id,r));
 (vd.views||[]).forEach(v=>S.views.set(v.view_id,v));
 S.profiles=pd.profiles||{};
}
function allIntents(){const m=new Map();S.views.forEach(v=>(v.presentation_intents||[]).forEach(i=>m.set(i.intent_id,i)));return m;}
function profile(){const st=hs(),p=S.profiles?.[st.view];return st.mode==='ENGINEERING'&&p&&(!p.mode||p.mode==='ENGINEERING')?p:null;}
function role(o){
 const r=String(o?.functional_role||'').toUpperCase();
 for(const [needle,label] of [['BORDER_LEAF','BORDER LEAF'],['STORAGE_SWITCH','STORAGE SW'],['OOB_SWITCH','OOB SWITCH'],['SPINE','SPINE'],['LEAF','LEAF'],['FIREWALL','FIREWALL'],['.ADC','ADC'],['ROUTER','ROUTER'],['INTERCONNECT','INTERCONNECT'],['CONTROLLER','CONTROLLER'],['ANALYTICS','ANALYTICS'],['VIRTUALIZATION_HOST','COMPUTE HOST'],['DISTRIBUTED_STORAGE_NODE','STORAGE NODE']])if(r.includes(needle))return label;
 return (r.split('.').filter(Boolean).pop()||o?.object_type||o?.domain||'OBJECT').replaceAll('_',' ').slice(0,20);
}
function statusClass(s){const v=String(s||'OPEN-CONFIRMATION REQUIRED').toUpperCase();if(v==='CONFIRMED')return'confirmed';if(v==='VENDOR PROPOSAL')return'vendor';if(v==='WORKING ASSUMPTION')return'assumption';if(v==='CUSTOMER INPUT')return'customer';return'open';}
function objectData(id,p){
 if(S.objects.has(id))return S.objects.get(id);
 return (p.context_nodes||[]).find(x=>x.context_id===id)||null;
}
function displayName(o){return o?.display_name||o?.name||o?.context_id||'Context';}
function qty(o){const n=Number(o?.quantity);return Number.isFinite(n)&&n>1?n:null;}
function buildLanes(stage,p){
 const laneMap=new Map();
 (p.layout?.lanes||[]).forEach((lane,li)=>{
  const band=document.createElement('section');band.className=`engp-lane engp-lane-${esc(lane.id)}`;band.dataset.lane=lane.id;
  const head=document.createElement('div');head.className='engp-lane-head';head.innerHTML=`<b>${esc(tr()?(lane.label_tr||lane.label):lane.label)}</b>${lane.note?`<span>${esc(lane.note)}</span>`:''}`;band.appendChild(head);
  const nodes=document.createElement('div');nodes.className='engp-lane-nodes';band.appendChild(nodes);
  (lane.object_ids||[]).forEach(id=>{
   const o=objectData(id,p);if(!o)return;
   const b=document.createElement('button');b.type='button';b.className=`engp-node status-${statusClass(o.status)}`;b.dataset.object=id;b.dataset.lane=lane.id;
   const q=qty(o);const context=!S.objects.has(id);
   b.innerHTML=`<div class="engp-node-top"><span class="engp-role">${esc(context?'EXTERNAL CONTEXT':role(o))}</span><span class="engp-status">${esc(o.status||'OPEN-CONFIRMATION REQUIRED')}</span></div><div class="engp-node-main"><span class="engp-device-glyph">${q?'▣ ▣':'▣'}</span><span><strong>${esc(displayName(o))}</strong><small>${esc(context?(o.description||'Non-canonical context'):(o.model||o.object_type||''))}</small></span></div><div class="engp-node-foot"><span>${esc(context?'CONTEXT':(o.vendor||o.domain||''))}</span>${q?`<span class="engp-qty">QTY ${q}</span>`:''}</div>`;
   if(!context)b.addEventListener('click',()=>selectObject(id));
   b.addEventListener('mouseenter',()=>highlight(stage,id));b.addEventListener('mouseleave',()=>highlight(stage,null));
   nodes.appendChild(b);
  });
  laneMap.set(lane.id,band);stage.appendChild(band);
 });
 return laneMap;
}
function selectObject(id){const q=new URLSearchParams(location.hash.replace(/^#/,''));q.set('object',id);history.replaceState(null,'','#'+q.toString());window.dispatchEvent(new HashChangeEvent('hashchange'));}
function edgeDefs(p){
 const intents=allIntents(),out=[];
 (p.relationship_ids||[]).forEach(id=>{const r=S.relationships.get(id);if(r)out.push({id,kind:'canonical',from:r.from_object_id,to:r.to_object_id,label:r.type,status:r.status,layer:r.layer,attributes:r.attributes||{}});});
 (p.presentation_intent_ids||[]).forEach(id=>{const i=intents.get(id);if(i)out.push({id,kind:'intent',from:i.from_object_id||i.from_context,to:i.to_object_id||i.to_context,label:i.label||i.relationship_type_hint||id,status:i.status,layer:i.layer||'LOGICAL',attributes:{}});});
 return out;
}
function nodeCenter(stage,id,side){const n=stage.querySelector(`.engp-node[data-object="${CSS.escape(id)}"]`);if(!n)return null;const sr=stage.getBoundingClientRect(),r=n.getBoundingClientRect();return{x:r.left-sr.left+r.width/2,y:(side==='from'?r.bottom:r.top)-sr.top};}
function draw(stage,p){
 const svg=stage.querySelector('.engp-edges');if(!svg)return;svg.innerHTML='';
 const edges=edgeDefs(p);edges.forEach((e,idx)=>{
  const a=nodeCenter(stage,e.from,'from'),b=nodeCenter(stage,e.to,'to');if(!a||!b)return;
  let mid=(a.y+b.y)/2;if(Math.abs(b.y-a.y)<80)mid=a.y+34+(idx%3)*12;
  const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',`M ${a.x.toFixed(1)} ${a.y.toFixed(1)} V ${mid.toFixed(1)} H ${b.x.toFixed(1)} V ${b.y.toFixed(1)}`);path.classList.add('engp-edge',`kind-${e.kind}`,`status-${statusClass(e.status)}`,`layer-${String(e.layer||'LOGICAL').toLowerCase()}`);path.dataset.edge=e.id;path.dataset.from=e.from||'';path.dataset.to=e.to||'';svg.appendChild(path);
  const label=document.createElementNS('http://www.w3.org/2000/svg','text');label.setAttribute('x',((a.x+b.x)/2).toFixed(1));label.setAttribute('y',(mid-6).toFixed(1));label.classList.add('engp-edge-label',`kind-${e.kind}`);label.dataset.edge=e.id;label.textContent=e.kind==='intent'?`DESIGN · ${e.label}`:canonicalLabel(e);svg.appendChild(label);
 });
 applyFilter(stage);
}
function canonicalLabel(e){const a=e.attributes||{},m=[];if(a.link_quantity&&a.link_speed)m.push(`${a.link_quantity} × ${a.link_speed}`);else if(a.link_speed)m.push(a.link_speed);if(a.media)m.push(a.media);m.push(e.label);return m.join(' · ');}
function highlight(stage,id){const edges=$$('.engp-edge',stage),nodes=$$('.engp-node',stage);if(!id){edges.forEach(x=>x.classList.remove('related','muted'));nodes.forEach(x=>x.classList.remove('related','muted'));return;}const rel=new Set([id]);edges.forEach(e=>{const hit=e.dataset.from===id||e.dataset.to===id;e.classList.toggle('related',hit);e.classList.toggle('muted',!hit);if(hit){rel.add(e.dataset.from);rel.add(e.dataset.to);}});nodes.forEach(n=>{const hit=rel.has(n.dataset.object);n.classList.toggle('related',hit);n.classList.toggle('muted',!hit);});}
function toolbar(stage,p){
 const c=edgeDefs(p).filter(e=>e.kind==='canonical').length,d=edgeDefs(p).filter(e=>e.kind==='intent').length;
 const box=document.createElement('div');box.className='engp-toolbar';
 box.innerHTML=`<div><b>${tr()?'MÜHENDİSLİK BAĞLANTI PROFİLİ':'ENGINEERING CONNECTIVITY PROFILE'}</b><span>${esc(tr()?(p.subtitle_tr||p.subtitle||''):(p.subtitle||''))}</span></div><div class="engp-filter-buttons">${[['all',tr()?'Tümü':'All'],['canonical','Canonical'],['design',tr()?'Tasarım':'Design'],['management','Mgmt/OOB']].map(([k,l])=>`<button type="button" data-engp-filter="${k}" class="${S.filter===k?'on':''}">${l}</button>`).join('')}</div><div class="engp-counts"><span>${c} canonical</span><span>${d} design/open</span></div>`;
 box.addEventListener('click',e=>{const b=e.target.closest('[data-engp-filter]');if(!b)return;S.filter=b.dataset.engpFilter;$$('[data-engp-filter]',box).forEach(x=>x.classList.toggle('on',x===b));applyFilter(stage);});
 stage.appendChild(box);
}
function applyFilter(stage){
 $$('.engp-edge',stage).forEach(e=>{let show=true;if(S.filter==='canonical')show=e.classList.contains('kind-canonical');else if(S.filter==='design')show=e.classList.contains('kind-intent');else if(S.filter==='management')show=e.classList.contains('layer-management')||e.classList.contains('layer-oob');e.classList.toggle('filtered-out',!show);const l=stage.querySelector(`.engp-edge-label[data-edge="${CSS.escape(e.dataset.edge)}"]`);l?.classList.toggle('filtered-out',!show);});
}
function notices(stage,p){
 const n=document.createElement('div');n.className='engp-notices';const flags=p.evidence_policy||{};
 n.innerHTML=`<b>${tr()?'KANIT POLİTİKASI':'EVIDENCE POLICY'}</b><span>${esc(tr()?(flags.note_tr||flags.note||''):(flags.note||''))}</span><span class="engp-warning">${esc(tr()?'Ring / HA / port / hız / optik yalnız explicit evidence varsa gösterilir.':'Ring / HA / ports / speed / optics appear only with explicit evidence.')}</span>`;stage.appendChild(n);
}
function render(){
 const p=profile(),scene=$('#scene');document.documentElement.dataset.dctsEngineeringProfile=p?'active':'inactive';if(!scene)return;
 let stage=scene.querySelector('.engineering-profile-stage');if(!p){stage?.remove();S.active=null;return;}
 const key=`${hs().view}:${hs().mode}:${p.profile_id||'profile'}`;if(stage&&S.active===key){requestAnimationFrame(()=>draw(stage,p));return;}
 stage?.remove();S.active=key;stage=document.createElement('div');stage.className='engineering-profile-stage';stage.dataset.profile=p.profile_id||'';
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('engp-edges');stage.appendChild(svg);toolbar(stage,p);buildLanes(stage,p);notices(stage,p);scene.appendChild(stage);requestAnimationFrame(()=>requestAnimationFrame(()=>draw(stage,p)));
}
function schedule(){if(S.scheduled)return;S.scheduled=true;requestAnimationFrame(()=>{S.scheduled=false;render();});}
function observe(){const root=$('.dcts-app')||document.body;S.observer=new MutationObserver(m=>{if(m.some(x=>x.type==='childList'||x.type==='attributes'))schedule();});S.observer.observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});window.addEventListener('hashchange',()=>{S.filter='all';schedule();});window.addEventListener('resize',schedule);}
async function boot(){let tries=0;while(!$('.dcts-app')&&tries++<120)await new Promise(r=>setTimeout(r,40));try{await load();}catch(err){console.warn('[DCTS engineering profile] load failed',err);return;}if(!S.profiles)return;document.documentElement.classList.add('dcts-engineering-profile-v1a7');schedule();observe();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
