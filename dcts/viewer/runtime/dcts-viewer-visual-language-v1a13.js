(function(){
'use strict';
const BOOT=window.DCTS_VIEWER_BOOT||{};
const S={objects:new Map(),rels:new Map(),intents:new Map(),loaded:false,scheduled:false};
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const base=()=>String(BOOT.packageBase||'').replace(/\/$/,'');
const norm=v=>String(v||'').trim().toUpperCase();
async function json(u){const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error(`${r.status} ${u}`);return r.json();}
function res(b,p){return String(p||'').startsWith('/')?p:`${b}/${p}`;}

async function load(){
  const b=base();if(!b)return;
  try{
    const m=await json(`${b}/package-manifest.json`),rr=m.resources||{};
    const [od,rd,vd]=await Promise.all([
      json(res(b,rr.objects.path)),json(res(b,rr.relationships.path)),json(res(b,rr.views.path))
    ]);
    (od.objects||[]).forEach(o=>S.objects.set(o.object_id,o));
    (rd.relationships||[]).forEach(r=>S.rels.set(r.relationship_id,r));
    (vd.views||[]).forEach(v=>(v.presentation_intents||[]).forEach(i=>S.intents.set(i.intent_id,i)));
    S.loaded=true;
  }catch(err){console.warn('[DCTS v1a13] visual-language metadata load failed',err);}
}

function kind(o){
  const d=norm(o?.domain),r=norm(o?.functional_role),t=norm(o?.object_type);
  if(d==='SECURITY')return'security';
  if(d==='NETWORK'||d==='OOB'||d==='EDGE')return'network';
  if(d==='HCI'&&(r.includes('CLUSTER')||t==='CLUSTER'))return'cluster';
  if(d==='COMPUTE'||d==='HCI')return'compute';
  if(d==='STORAGE'||d==='BACKUP'||d==='DR')return'storage';
  if(d==='CLOUD'||d==='SERVICE'||d==='TENANT')return'service';
  if(d==='MANAGEMENT'||d==='MONITORING'||d==='OPERATIONS'||d==='DCIM')return'operations';
  if(d==='EXTERNAL'||d==='CARRIER')return'external';
  if(d==='FACILITY'||d==='PHYSICAL')return'facility';
  return'network';
}

function ensureIcon(card,o){
  const lib=window.DCTS_ICON_LIBRARY;if(!lib)return;
  let slot=card.querySelector('.dcts-node-icon-slot');
  if(!slot){slot=document.createElement('span');slot.className='dcts-node-icon-slot';slot.setAttribute('aria-hidden','true');card.appendChild(slot);}
  const role=lib.canonicalRole(o);
  if(slot.dataset.dctsIconRole!==role){slot.innerHTML=lib.svg(o);slot.dataset.dctsIconRole=role;}
  card.dataset.dctsIconV1='1';card.dataset.dctsIconRole=role;
}

function annotateNodes(){
  $$('.node-card[data-object]').forEach(card=>{
    const o=S.objects.get(card.dataset.object);if(!o)return;
    card.dataset.dctsKind=kind(o);card.dataset.dctsDomain=norm(o.domain);card.dataset.dctsRole=norm(o.functional_role);
    ensureIcon(card,o);
    if(!card.dataset.dctsV13Bound){
      card.dataset.dctsV13Bound='1';
      card.addEventListener('pointerenter',()=>focusNode(card.dataset.object));
      card.addEventListener('pointerleave',()=>restoreSelectionFocus());
    }
  });
  $$('.engp-node[data-object]').forEach(card=>{
    const o=S.objects.get(card.dataset.object);if(!o)return;
    card.dataset.dctsKind=kind(o);card.dataset.dctsDomain=norm(o.domain);card.dataset.dctsRole=norm(o.functional_role);
  });
}

function annotateDomains(){
  $$('.domain-box').forEach(box=>{
    const d=norm(box.querySelector(':scope > span')?.textContent);
    if(d)box.dataset.dctsDomain=d;
  });
}

function semantic(e,kindName){
  if(kindName==='intent')return'intent';
  const layer=norm(e?.layer),type=norm(e?.type||e?.relationship_type||e?.label);
  if(layer==='MANAGEMENT'||layer==='OOB'||type.includes('MANAGED_BY')||type.includes('MONITORS'))return'management';
  if(layer==='SECURITY'||type.includes('PROTECTED_BY'))return'security';
  if(layer==='BACKUP'||layer==='DR'||type.includes('BACKS_UP')||type.includes('REPLICATES_TO'))return'backup';
  if(layer==='SERVICE'||type.includes('PROVIDES_SERVICE_TO'))return'service';
  if(layer==='PHYSICAL')return'physical';
  return'data';
}

function annotateEdges(){
  $$('.edge[data-edge]').forEach(path=>{
    const id=path.dataset.edge;
    const r=S.rels.get(id),i=S.intents.get(id),e=r||i;if(!e)return;
    const k=r?'canonical':'intent';
    const from=r?r.from_object_id:i.from_object_id,to=r?r.to_object_id:i.to_object_id;
    path.dataset.dctsFrom=from||'';path.dataset.dctsTo=to||'';path.dataset.dctsSemantic=semantic(e,k);
  });
}

function clearFocus(){
  $$('.node-card').forEach(n=>n.classList.remove('dcts-related','dcts-muted'));
  $$('.edge').forEach(e=>e.classList.remove('dcts-related','dcts-muted'));
  $$('.domain-box').forEach(b=>b.classList.remove('dcts-muted'));
  document.body.classList.remove('dcts-path-focus');
}

function focusNode(id){
  if(!id)return clearFocus();
  const related=new Set([id]);
  $$('.edge[data-edge]').forEach(e=>{
    const hit=e.dataset.dctsFrom===id||e.dataset.dctsTo===id;
    e.classList.toggle('dcts-related',hit);e.classList.toggle('dcts-muted',!hit);
    if(hit){if(e.dataset.dctsFrom)related.add(e.dataset.dctsFrom);if(e.dataset.dctsTo)related.add(e.dataset.dctsTo);}
  });
  const activeDomains=new Set();
  $$('.node-card[data-object]').forEach(n=>{
    const hit=related.has(n.dataset.object);n.classList.toggle('dcts-related',hit);n.classList.toggle('dcts-muted',!hit);
    if(hit&&n.dataset.dctsDomain)activeDomains.add(n.dataset.dctsDomain);
  });
  $$('.domain-box[data-dcts-domain]').forEach(b=>b.classList.toggle('dcts-muted',!activeDomains.has(b.dataset.dctsDomain)));
  document.body.classList.add('dcts-path-focus');
}

function restoreSelectionFocus(){
  const s=$('.node-card.selected[data-object]');if(s)focusNode(s.dataset.object);else clearFocus();
}

function ensureCanvasButton(){
  const actions=$('.dcts-actions');if(!actions||$('#dctsCanvasBtn'))return;
  const b=document.createElement('button');b.id='dctsCanvasBtn';b.type='button';b.className='action';b.textContent='Canvas';b.title='Toggle full topology canvas';
  const fit=$('#fitBtn');actions.insertBefore(b,fit||null);
  b.addEventListener('click',()=>{
    const on=document.body.classList.toggle('dcts-canvas-focus');b.classList.toggle('on',on);b.textContent=on?'Panels':'Canvas';
    setTimeout(()=>$('#fitBtn')?.click(),80);
  });
}

function sync(){
  if(!S.loaded)return;ensureCanvasButton();annotateNodes();annotateDomains();annotateEdges();
  document.documentElement.dataset.dctsVisualLanguage='v1a13b';
}
function schedule(){if(S.scheduled)return;S.scheduled=true;requestAnimationFrame(()=>{S.scheduled=false;sync();});}

async function boot(){
  let tries=0;while(!$('.dcts-app')&&tries++<120)await new Promise(r=>setTimeout(r,40));
  await load();sync();
  const root=$('.dcts-app')||document.body;
  new MutationObserver(m=>{if(m.some(x=>x.type==='childList'))schedule();}).observe(root,{subtree:true,childList:true});
  document.addEventListener('click',e=>{
    if(e.target.closest('.node-card,#clearSelection,.tab'))setTimeout(()=>{schedule();restoreSelectionFocus();},35);
  },true);
  window.addEventListener('hashchange',()=>setTimeout(()=>{schedule();restoreSelectionFocus();},40));
  window.addEventListener('resize',schedule);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
