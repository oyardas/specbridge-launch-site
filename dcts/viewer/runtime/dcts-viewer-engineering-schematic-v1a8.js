(function(){
'use strict';
const BOOT=window.DCTS_VIEWER_BOOT||{};
const S={objects:new Map(),relationships:new Map(),views:new Map(),profiles:null,filter:'all',scheduled:false,observer:null};
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[m]));
const base=()=>String(BOOT.packageBase||'').replace(/\/$/,'');
const url=(b,p)=>/^https?:/i.test(p)?p:(String(p||'').startsWith('/')?p:`${b}/${p}`);
const hs=()=>{const q=new URLSearchParams(location.hash.replace(/^#/,''));return{view:q.get('view')||'T00',mode:q.get('mode')||'PRESENTATION',lang:q.get('lang')||'en',object:q.get('object')||null};};
const tr=()=>hs().lang==='tr';
async function json(u){const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error(`${r.status} ${u}`);return r.json();}
async function load(){
 const b=base(); if(!b)return;
 const m=await json(`${b}/package-manifest.json`),rr=m.resources||{};
 if(!rr.engineering_profiles?.path)return;
 const [od,rd,vd,pd]=await Promise.all([json(url(b,rr.objects.path)),json(url(b,rr.relationships.path)),json(url(b,rr.views.path)),json(url(b,rr.engineering_profiles.path))]);
 (od.objects||[]).forEach(o=>S.objects.set(o.object_id,o));
 (rd.relationships||[]).forEach(r=>S.relationships.set(r.relationship_id,r));
 (vd.views||[]).forEach(v=>S.views.set(v.view_id,v));
 S.profiles=pd.profiles||{};
}
function profile(){const st=hs(),p=S.profiles?.[st.view];return st.mode==='ENGINEERING'&&p?.schematic?p:null;}
function intents(){const m=new Map();S.views.forEach(v=>(v.presentation_intents||[]).forEach(i=>m.set(i.intent_id,i)));return m;}
function obj(id,p){return S.objects.get(id)||(p.context_nodes||[]).find(x=>x.context_id===id)||null;}
function role(o){const r=String(o?.functional_role||'').toUpperCase();for(const [n,l] of [['STORAGE_SWITCH','STORAGE SW'],['OOB_SWITCH','OOB'],['SPINE','SPINE'],['LEAF','LEAF'],['FIREWALL','FIREWALL'],['.ADC','ADC'],['INTERCONNECT','INTERCONNECT'],['CONTROLLER','CONTROLLER'],['ANALYTICS','ANALYTICS'],['VIRTUALIZATION_HOST','COMPUTE'],['DISTRIBUTED_STORAGE_NODE','STORAGE']])if(r.includes(n))return l;return (r.split('.').filter(Boolean).pop()||o?.object_type||'DEVICE').replaceAll('_',' ').slice(0,18);}
function statusClass(s){const x=String(s||'OPEN-CONFIRMATION REQUIRED').toUpperCase();if(x==='CONFIRMED')return'confirmed';if(x==='VENDOR PROPOSAL')return'vendor';if(x==='WORKING ASSUMPTION')return'assumption';if(x==='CUSTOMER INPUT')return'customer';return'open';}
function selectObject(id){if(!S.objects.has(id))return;const q=new URLSearchParams(location.hash.replace(/^#/,''));q.set('object',id);history.replaceState(null,'','#'+q.toString());window.dispatchEvent(new HashChangeEvent('hashchange'));}
function memberGlyphs(o){const q=Number(o?.quantity)||1,max=Math.min(q,4),extra=Math.max(0,q-max);return `<div class="engs-members" title="Quantity visualization only; HA/peer semantics are not implied.">${Array.from({length:max},(_,i)=>`<span>${q>1?i+1:''}</span>`).join('')}${extra?`<em>+${extra}</em>`:''}</div>`;}
function objectCard(id,p){
 const o=obj(id,p); if(!o)return '';
 const context=!S.objects.has(id),q=Number(o.quantity)||null;
 return `<button type="button" class="engs-object ${context?'engs-context':''} status-${statusClass(o.status)}" data-anchor="${esc(id)}" ${context?'disabled':''}>
   <div class="engs-object-top"><b>${esc(context?'EXTERNAL / CARRIER':role(o))}</b><span>${esc(o.status||'OPEN-CONFIRMATION REQUIRED')}</span></div>
   <div class="engs-object-body"><strong>${esc(o.display_name||o.name||id)}</strong><small>${esc(context?(o.description||'External context'):(o.model||o.object_type||''))}</small></div>
   ${context?'<div class="engs-cloud">☁</div>':memberGlyphs(o)}
   <div class="engs-object-foot"><span>${esc(context?'CONTEXT':(o.vendor||o.domain||''))}</span>${q&&q>1?`<span>QTY ${q} · HA UNCONFIRMED</span>`:''}</div>
 </button>`;
}
function makeGroup(g,p){
 const el=document.createElement('section');el.className=`engs-group engs-tone-${g.tone||'network'}`;el.dataset.group=g.id;
 el.style.left=`${g.x*100}%`;el.style.top=`${g.y*100}%`;el.style.width=`${g.w*100}%`;el.style.height=`${g.h*100}%`;
 const label=tr()?(g.label_tr||g.label):g.label;
 el.innerHTML=`<div class="engs-group-head"><b>${esc(label||g.id)}</b>${g.note?`<span>${esc(g.note)}</span>`:''}</div><div class="engs-group-body">${(g.object_ids||[]).map(id=>objectCard(id,p)).join('')}</div>`;
 el.addEventListener('click',e=>{const n=e.target.closest('.engs-object[data-anchor]');if(n&&!n.disabled)selectObject(n.dataset.anchor);});
 return el;
}
function anchor(stage,svg,id){const n=stage.querySelector(`.engs-object[data-anchor="${CSS.escape(id)}"]`);if(!n)return null;const sr=svg.getBoundingClientRect(),r=n.getBoundingClientRect();return{x:r.left-sr.left,y:r.top-sr.top,w:r.width,h:r.height,cx:r.left-sr.left+r.width/2,cy:r.top-sr.top+r.height/2};}
function edgeInfo(link,p,im){
 if(link.relationship_id){const r=S.relationships.get(link.relationship_id);if(!r)return null;return{...link,kind:'canonical',status:r.status,layer:r.layer||'LOGICAL',label:link.label||r.type,from:link.from||r.from_object_id,to:link.to||r.to_object_id};}
 if(link.intent_id){const i=im.get(link.intent_id);if(!i)return null;return{...link,kind:'intent',status:i.status,layer:i.layer||'LOGICAL',label:link.label||(i.label||i.relationship_type_hint),from:link.from||(i.from_object_id||i.from_context),to:link.to||(i.to_object_id||i.to_context)};}
 return{...link,kind:link.kind||'intent',status:link.status||'OPEN-CONFIRMATION REQUIRED',layer:link.layer||'LOGICAL'};
}
function pathBetween(a,b){
 const horizontal=Math.abs(b.cx-a.cx)>Math.abs(b.cy-a.cy)*1.35;
 if(horizontal){const sx=b.cx>=a.cx?a.x+a.w:a.x, tx=b.cx>=a.cx?b.x:b.x+b.w, sy=a.cy,ty=b.cy,mx=(sx+tx)/2;return{d:`M ${sx} ${sy} H ${mx} V ${ty} H ${tx}`,lx:mx,ly:(sy+ty)/2};}
 const sy=b.cy>=a.cy?a.y+a.h:a.y, ty=b.cy>=a.cy?b.y:b.y+b.h, sx=a.cx,tx=b.cx,my=(sy+ty)/2;return{d:`M ${sx} ${sy} V ${my} H ${tx} V ${ty}`,lx:(sx+tx)/2,ly:my};
}
function draw(stage,p){
 const svg=stage.querySelector('.engs-edges');if(!svg)return;svg.innerHTML='';const im=intents();
 (p.schematic.links||[]).forEach((l,idx)=>{const e=edgeInfo(l,p,im);if(!e)return;const a=anchor(stage,svg,e.from),b=anchor(stage,svg,e.to);if(!a||!b)return;const geo=pathBetween(a,b);
   const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',geo.d);path.classList.add('engs-edge',`kind-${e.kind}`,`status-${statusClass(e.status)}`,`layer-${String(e.layer||'LOGICAL').toLowerCase()}`);path.dataset.from=e.from;path.dataset.to=e.to;path.dataset.kind=e.kind;path.dataset.layer=String(e.layer||'LOGICAL').toLowerCase();path.dataset.edge=e.intent_id||e.relationship_id||String(idx);svg.appendChild(path);
   const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',geo.lx);t.setAttribute('y',geo.ly-7);t.classList.add('engs-edge-label',`kind-${e.kind}`);t.dataset.edge=path.dataset.edge;t.textContent=e.kind==='intent'?`DESIGN · ${e.label}`:e.label;t.setAttribute('text-anchor','middle');svg.appendChild(t);
 });
 applyFilter(stage);
}
function toolbar(stage,p){
 const box=document.createElement('div');box.className='engs-toolbar';const design=(p.schematic.links||[]).filter(x=>x.intent_id||x.kind==='intent').length,canonical=(p.schematic.links||[]).filter(x=>x.relationship_id||x.kind==='canonical').length;
 box.innerHTML=`<div><b>${tr()?'MÜHENDİSLİK ŞEMATİK TOPOLOJİSİ':'ENGINEERING SCHEMATIC TOPOLOGY'}</b><span>${esc(tr()?(p.schematic.subtitle_tr||p.subtitle_tr||''):(p.schematic.subtitle||p.subtitle||''))}</span></div><div class="engs-filter">${[['all',tr()?'Tümü':'All'],['canonical','Canonical'],['design',tr()?'Tasarım':'Design'],['management','Mgmt/OOB']].map(([k,l])=>`<button data-filter="${k}" class="${S.filter===k?'on':''}">${l}</button>`).join('')}</div><div class="engs-metrics"><span>${canonical} canonical</span><span>${design} design/open</span><span>${esc(tr()?'0 kanıtlı fiziksel link':'0 evidenced physical links')}</span></div>`;
 box.addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;S.filter=b.dataset.filter;$$('[data-filter]',box).forEach(x=>x.classList.toggle('on',x===b));applyFilter(stage);});stage.appendChild(box);
}
function applyFilter(stage){$$('.engs-edge',stage).forEach(e=>{let show=true;if(S.filter==='canonical')show=e.dataset.kind==='canonical';else if(S.filter==='design')show=e.dataset.kind==='intent';else if(S.filter==='management')show=['management','oob'].includes(e.dataset.layer);e.classList.toggle('filtered-out',!show);stage.querySelector(`.engs-edge-label[data-edge="${CSS.escape(e.dataset.edge)}"]`)?.classList.toggle('filtered-out',!show);});}
function highlight(stage,id){if(!id){$$('.engs-edge,.engs-object',stage).forEach(x=>x.classList.remove('related','muted'));return;}const related=new Set([id]);$$('.engs-edge',stage).forEach(e=>{const hit=e.dataset.from===id||e.dataset.to===id;e.classList.toggle('related',hit);e.classList.toggle('muted',!hit);if(hit){related.add(e.dataset.from);related.add(e.dataset.to);}});$$('.engs-object',stage).forEach(n=>{const hit=related.has(n.dataset.anchor);n.classList.toggle('related',hit);n.classList.toggle('muted',!hit);});}
function notice(stage,p){const n=document.createElement('div');n.className='engs-notice';n.innerHTML=`<b>${tr()?'KANIT SINIRI':'EVIDENCE BOUNDARY'}</b><span>${esc(tr()?(p.evidence_policy?.note_tr||''):(p.evidence_policy?.note||''))}</span><strong>${esc(tr()?'Ring / HA / A-B / port / hız / optik kanıt olmadan çizilmez.':'Ring / HA / A-B / ports / speed / optics are not drawn without evidence.')}</strong>`;stage.appendChild(n);}
function render(){const p=profile(),scene=$('#scene');if(!scene)return;let stage=scene.querySelector('.engineering-schematic-stage');document.documentElement.dataset.dctsEngineeringSchematic=p?'active':'inactive';if(!p){stage?.remove();return;}scene.querySelector('.engineering-profile-stage')?.classList.add('engs-superseded');if(stage){requestAnimationFrame(()=>draw(stage,p));return;}
 stage=document.createElement('div');stage.className='engineering-schematic-stage';const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('engs-edges');stage.appendChild(svg);toolbar(stage,p);const canvas=document.createElement('div');canvas.className='engs-canvas';(p.schematic.groups||[]).forEach(g=>canvas.appendChild(makeGroup(g,p)));stage.appendChild(canvas);notice(stage,p);scene.appendChild(stage);
 stage.addEventListener('mouseover',e=>{const n=e.target.closest('.engs-object[data-anchor]');if(n)highlight(stage,n.dataset.anchor);});stage.addEventListener('mouseout',e=>{const n=e.target.closest('.engs-object[data-anchor]');if(n&&!n.contains(e.relatedTarget))highlight(stage,null);});requestAnimationFrame(()=>requestAnimationFrame(()=>draw(stage,p)));
}
function schedule(){if(S.scheduled)return;S.scheduled=true;requestAnimationFrame(()=>{S.scheduled=false;render();});}
async function boot(){let tries=0;while(!$('.dcts-app')&&tries++<120)await new Promise(r=>setTimeout(r,40));try{await load();}catch(e){console.warn('[DCTS schematic] load failed',e);return;}document.documentElement.classList.add('dcts-engineering-schematic-v1a8');schedule();const root=$('.dcts-app')||document.body;S.observer=new MutationObserver(()=>schedule());S.observer.observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});window.addEventListener('hashchange',()=>{S.filter='all';schedule();});window.addEventListener('resize',schedule);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
