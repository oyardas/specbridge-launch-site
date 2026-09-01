(function(){
'use strict';
const BOOT=window.DCTS_VIEWER_BOOT||{};
const S={objects:new Map(),rels:new Map(),intents:new Map(),loaded:false,lens:null,level:'OVERVIEW',domain:null,objectId:null,visibleIds:new Set()};
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const norm=v=>String(v||'').trim().toUpperCase();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const base=()=>String(BOOT.packageBase||'').replace(/\/$/,'');
async function json(u){const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error(`${r.status} ${u}`);return r.json();}
function res(b,p){return String(p||'').startsWith('/')?p:`${b}/${p}`;}
function fromId(r){return r?.from_object_id||r?.FROM_OBJECT_ID||r?.source_object_id||r?.SOURCE_OBJECT_ID||'';}
function toId(r){return r?.to_object_id||r?.TO_OBJECT_ID||r?.target_object_id||r?.TARGET_OBJECT_ID||'';}
function relType(r){return norm(r?.relationship_type||r?.RELATIONSHIP_TYPE||r?.type||r?.TYPE||r?.category||r?.CATEGORY||r?.layer||r?.LAYER);}
function relLabel(r){return r?.label||r?.LABEL||r?.relationship_type||r?.RELATIONSHIP_TYPE||r?.type||r?.TYPE||'RELATIONSHIP';}
function isConfirmed(r){const s=norm(r?.information_status||r?.INFORMATION_STATUS||r?.status||r?.STATUS);return !s||s==='CONFIRMED'||s.includes('CONFIRMED_EVIDENCE');}
function semantic(r,isIntent=false){if(isIntent)return'intent';const t=relType(r);if(t.includes('MANAGEMENT')||t.includes('OOB')||t.includes('MANAGED_BY')||t.includes('MONITORS'))return'management';if(t.includes('SECURITY')||t.includes('PROTECTED_BY'))return'security';if(t.includes('BACKUP')||t.includes('REPLICAT')||t.includes('BACKS_UP')||t.includes('DR'))return'backup';if(t.includes('SERVICE')||t.includes('PROVIDES')||t.includes('HOSTS'))return'service';return'data';}
function role(o){return o?.functional_role||o?.FUNCTIONAL_ROLE||o?.role||o?.ROLE_ID||'UNMAPPED_ROLE';}
function domain(o){return norm(o?.domain||o?.DOMAIN||'UNMAPPED');}
function nameOf(o){return o?.display_name||o?.DISPLAY_NAME||o?.name||o?.NAME||o?.title||o?.TITLE||o?.product_family||o?.PRODUCT_FAMILY||role(o);}
function modelOf(o){return o?.model||o?.MODEL||o?.product_family||o?.PRODUCT_FAMILY||o?.sku||o?.SKU||'Product detail not encoded';}
function qtyOf(o){const q=o?.quantity??o?.QUANTITY??o?.represented_object_quantity??o?.REPRESENTED_OBJECT_QUANTITY??o?.instance_count??o?.INSTANCE_COUNT;return q==null?'':`× ${q}`;}
function statusOf(o){return o?.status||o?.STATUS||o?.information_status||o?.INFORMATION_STATUS||'';}
function accentFor(o){const d=domain(o);if(d==='SECURITY')return'#b14f69';if(d==='NETWORK'||d==='OOB'||d==='EDGE')return'#2a739e';if(d==='COMPUTE'||d==='HCI')return'#3b8060';if(d==='STORAGE'||d==='BACKUP'||d==='DR')return'#2b898b';if(d==='CLOUD'||d==='SERVICE'||d==='TENANT')return'#9a7427';if(d==='MANAGEMENT'||d==='MONITORING'||d==='OPERATIONS'||d==='DCIM')return'#6753a0';return'#5f7f93';}
function icon(o){const lib=window.DCTS_ICON_LIBRARY;return lib?lib.svg({domain:domain(o),functional_role:role(o),object_type:o?.object_type||o?.OBJECT_TYPE,display_name:nameOf(o),model:modelOf(o)}):'';}
function currentView(){const active=$('.view-tab.on,.view-tab.active,.tab.on,.tab.active');const t=active?.textContent||location.hash.match(/view=(T\d+)/)?.[1]||'T02';return (t.match(/T\d+/)||['T02'])[0];}
function designPathsOn(){const b=$$('button').find(x=>/Design paths/i.test(x.textContent||''));return !b||/On/i.test(b.textContent||'')||b.classList.contains('on')||b.classList.contains('active');}

async function load(){
  const b=base();if(!b)return;
  try{
    const m=await json(`${b}/package-manifest.json`),rr=m.resources||{};
    const tasks=[];
    if(rr.objects?.path)tasks.push(json(res(b,rr.objects.path)).then(d=>(d.objects||d.NODES||[]).forEach(o=>S.objects.set(o.object_id||o.TOPOLOGY_OBJECT_ID,o))));
    if(rr.relationships?.path)tasks.push(json(res(b,rr.relationships.path)).then(d=>(d.relationships||d.RELATIONSHIPS||[]).forEach(r=>S.rels.set(r.relationship_id||r.RELATIONSHIP_ID,r))));
    if(rr.views?.path)tasks.push(json(res(b,rr.views.path)).then(d=>(d.views||d.VIEWS||[]).forEach(v=>(v.presentation_intents||v.PRESENTATION_INTENTS||[]).forEach(i=>S.intents.set(i.intent_id||i.INTENT_ID||i.id||i.ID,i)))));
    await Promise.all(tasks);S.loaded=true;
  }catch(e){console.warn('[DCTS v1a14] mockup workspace metadata load failed',e);}
}

function addChrome(){
  const center=$('.dcts-center');if(!center)return;
  if(!$('#dctsM14Tools')){
    const tools=document.createElement('div');tools.id='dctsM14Tools';tools.className='dcts-m14-tools';
    tools.innerHTML='<button type="button" data-a="fit">Fit</button><button type="button" data-a="overview">Overview</button>';
    tools.onclick=e=>{const a=e.target?.dataset?.a;if(a==='fit')$('#fitBtn')?.click();if(a==='overview'){closeLens();setTimeout(()=>$('#fitBtn')?.click(),40);}};
    center.appendChild(tools);
  }
  if(!$('#dctsM14Evidence')){
    const note=document.createElement('div');note.id='dctsM14Evidence';note.className='dcts-m14-evidence';note.innerHTML='<b>DCTS control:</b> Missing evidence stays OPEN. Layout and semantic zoom are non-semantic.';center.appendChild(note);
  }
  if(!$('#dctsM14Lens')){
    const lens=document.createElement('div');lens.id='dctsM14Lens';lens.className='dcts-m14-lens';
    lens.innerHTML='<div class="dcts-m14-lensbar"><span class="home">KAYAS</span><span class="sep">/</span><span class="title" id="dctsM14LensTitle">Topology</span><span class="sub" id="dctsM14LensSub"></span><span class="actions"><button type="button" data-a="back">Back</button><button type="button" data-a="overview">Overview</button></span></div><div class="dcts-m14-lensstage" id="dctsM14LensStage"></div>';
    lens.addEventListener('click',e=>{const a=e.target?.dataset?.a;if(a==='overview')closeLens();if(a==='back')backLens();});
    center.appendChild(lens);S.lens=lens;
  }else S.lens=$('#dctsM14Lens');
}

function annotateOpenButtons(){
  $$('.node-card[data-object]').forEach(card=>{
    if(!card.dataset.m14Bound){
      card.dataset.m14Bound='1';
      card.addEventListener('dblclick',e=>{e.stopPropagation();openObject(card.dataset.object,domain(S.objects.get(card.dataset.object)))});
      let b=card.querySelector('.dcts-m14-openbtn');
      if(!b){b=document.createElement('button');b.type='button';b.className='dcts-m14-openbtn';b.textContent='↗';b.title='Open semantic object scene';b.style.cssText='position:absolute;right:6px;bottom:5px;width:19px;height:19px;padding:0;border:1px solid #c8d7e0;border-radius:6px;background:#fff;color:var(--dcts-node-accent,#28679e);font-size:10px;line-height:17px;opacity:0;transition:opacity .15s;z-index:6;cursor:zoom-in';b.onclick=e=>{e.stopPropagation();card.click();openObject(card.dataset.object,domain(S.objects.get(card.dataset.object)));};card.appendChild(b);}
      card.addEventListener('mouseenter',()=>{const x=card.querySelector('.dcts-m14-openbtn');if(x)x.style.opacity='.9'});
      card.addEventListener('mouseleave',()=>{const x=card.querySelector('.dcts-m14-openbtn');if(x)x.style.opacity='0'});
    }
  });
}
function bindDomains(){
  $$('.domain-box').forEach(box=>{
    const label=box.querySelector(':scope > span');if(!label||label.dataset.m14Bound)return;label.dataset.m14Bound='1';
    label.title='Open domain scene';
    label.addEventListener('click',e=>{e.stopPropagation();const d=norm(box.dataset.dctsDomain||label.textContent.replace('↗','').trim());if(d)openDomain(d,label.textContent.replace('↗','').trim());});
  });
}

function visibleObjectIds(){return new Set($$('.node-card[data-object]').filter(n=>getComputedStyle(n).display!=='none').map(n=>n.dataset.object));}
function objectCardHTML(o,cls=''){
  const a=accentFor(o),st=statusOf(o),q=qtyOf(o);
  return `<div class="dcts-m14-focusnode ${cls}" data-m14-object="${esc(o.object_id||o.TOPOLOGY_OBJECT_ID)}" style="--node-accent:${a}"><div class="ico">${icon(o)}</div><b>${esc(nameOf(o))}</b><div class="role">${esc(role(o))}</div><div class="model">${esc(modelOf(o))}</div><div class="meta"><span>${esc(domain(o))}</span>${st?`<span>${esc(st)}</span>`:''}${q?`<span class="qty">${esc(q)}</span>`:''}</div></div>`;
}
function relsWithin(ids){return [...S.rels.values()].filter(r=>isConfirmed(r)&&ids.has(fromId(r))&&ids.has(toId(r)));}
function intentsWithin(ids){if(!designPathsOn())return[];return [...S.intents.values()].filter(r=>ids.has(fromId(r))&&ids.has(toId(r)));}
function boundsPositions(ids){
  const scene=$('.scene');const sr=scene?.getBoundingClientRect();const out=[];
  ids.forEach(id=>{const c=document.querySelector(`.node-card[data-object="${CSS.escape(id)}"]`);if(!c||!sr)return;const r=c.getBoundingClientRect();out.push({id,cx:r.left-sr.left+r.width/2,cy:r.top-sr.top+r.height/2});});
  return out;
}
function projectedLayout(ids){
  const raw=boundsPositions(ids),W=1070,H=380,CW=240,CH=106,P=44;const map=new Map();
  if(raw.length<2){raw.forEach((p,i)=>map.set(p.id,{x:W/2-CW/2,y:140+i*125}));return map;}
  const xs=raw.map(p=>p.cx),ys=raw.map(p=>p.cy),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),rx=Math.max(1,maxX-minX),ry=Math.max(1,maxY-minY);
  raw.forEach((p,i)=>{let x=P+(p.cx-minX)/rx*(W-CW-2*P),y=45+(p.cy-minY)/ry*(H-CH-70);map.set(p.id,{x,y});});
  // simple collision relaxation
  const arr=[...map.entries()];for(let pass=0;pass<8;pass++)for(let i=0;i<arr.length;i++)for(let j=i+1;j<arr.length;j++){const a=arr[i][1],b=arr[j][1];if(Math.abs(a.x-b.x)<CW+18&&Math.abs(a.y-b.y)<CH+18){b.y=Math.min(H-CH-18,b.y+CH*.55);if(Math.abs(a.y-b.y)<CH+10)b.x=Math.min(W-CW-18,b.x+CW*.38);}}
  return map;
}
function pathD(a,b){const sx=a.x+a.w/2,sy=a.y+a.h/2,tx=b.x+b.w/2,ty=b.y+b.h/2,dx=tx-sx,dy=ty-sy;if(Math.abs(dx)>=Math.abs(dy)){const c=dx*.46;return`M ${sx} ${sy} C ${sx+c} ${sy}, ${tx-c} ${ty}, ${tx} ${ty}`;}const c=dy*.46;return`M ${sx} ${sy} C ${sx} ${sy+c}, ${tx} ${ty-c}, ${tx} ${ty}`;}
function drawLensEdges(plane,relations,intents=[]){
  const svg=plane.querySelector('.dcts-m14-rel-svg');if(!svg)return;svg.innerHTML='';const pr=plane.getBoundingClientRect();const pos=new Map();
  $$('[data-m14-object]',plane).forEach(n=>{const r=n.getBoundingClientRect();pos.set(n.dataset.m14Object,{x:r.left-pr.left,y:r.top-pr.top,w:r.width,h:r.height});});
  const add=(r,isIntent)=>{const a=pos.get(fromId(r)),b=pos.get(toId(r));if(!a||!b)return;const cls=semantic(r,isIntent),d=pathD(a,b);const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('class',`dcts-m14-rel ${cls}`);p.setAttribute('d',d);svg.appendChild(p);const mx=(a.x+a.w/2+b.x+b.w/2)/2,my=(a.y+a.h/2+b.y+b.h/2)/2;const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('class','dcts-m14-rel-label');t.setAttribute('x',mx);t.setAttribute('y',my-5);t.setAttribute('text-anchor','middle');t.textContent=isIntent?'DESIGN INTENT':String(relLabel(r)).replace(/^[A-Z]+\./,'').replace(/_/g,' ').slice(0,36);svg.appendChild(t);};
  relations.forEach(r=>add(r,false));intents.forEach(r=>add(r,true));
}
function wireLensNodes(stage){
  $$('[data-m14-object]',stage).forEach(n=>n.addEventListener('click',()=>{const id=n.dataset.m14Object;const under=document.querySelector(`.node-card[data-object="${CSS.escape(id)}"]`);under?.click();openObject(id,S.domain);}));
}

function openDomain(d,title=d){
  if(!S.loaded)return;addChrome();S.visibleIds=visibleObjectIds();const ids=new Set([...S.visibleIds].filter(id=>domain(S.objects.get(id))===d));if(!ids.size)return;
  const objects=[...ids].map(id=>S.objects.get(id)).filter(Boolean),rels=relsWithin(ids),intents=intentsWithin(ids),layout=projectedLayout(ids),accent=accentFor(objects[0]);
  S.level='DOMAIN';S.domain=d;S.objectId=null;
  document.body.classList.remove('dcts-m14-object');document.body.classList.add('dcts-m14-domain');
  $('#dctsM14LensTitle').textContent=`${currentView()} · ${title}`;$('#dctsM14LensSub').textContent='Domain scene · click an object to enter';
  const stage=$('#dctsM14LensStage');
  stage.innerHTML=`<section class="dcts-m14-scene" style="--scene-accent:${accent}"><div class="dcts-m14-scenehead"><div class="bigicon">${icon(objects[0])}</div><div><b>${esc(title)}</b><small>Role-composed semantic scene · canonical graph remains immutable</small></div><div class="metric"><strong>${objects.length}</strong> visible objects<br>${rels.length} confirmed relationships</div></div><div class="dcts-m14-plane"><svg class="dcts-m14-rel-svg"></svg>${objects.map(o=>{const p=layout.get(o.object_id||o.TOPOLOGY_OBJECT_ID)||{x:60,y:70};return objectCardHTML(o).replace('style="',`style="left:${Math.round(p.x)}px;top:${Math.round(p.y)}px;`);}).join('')}<div class="dcts-m14-openstrip"><b>EVIDENCE BOUNDARY</b>${rels.length?`${rels.length} confirmed current-view relationship(s) are rendered.`:'No confirmed relationship exists between these visible objects in the current view.'} ${intents.length?`${intents.length} existing design/presentation intent path(s) are shown amber and remain non-canonical.`:'Missing connectivity remains OPEN-CONFIRMATION REQUIRED.'}</div></div></section>`;
  S.lens.classList.add('show');wireLensNodes(stage);requestAnimationFrame(()=>drawLensEdges(stage.querySelector('.dcts-m14-plane'),rels,intents));
}

function neighborData(id){
  const ids=S.visibleIds.size?S.visibleIds:visibleObjectIds(),incoming=[],outgoing=[];
  [...S.rels.values()].filter(isConfirmed).forEach(r=>{const f=fromId(r),t=toId(r);if(f===id&&ids.has(t)&&S.objects.has(t))outgoing.push({rel:r,obj:S.objects.get(t)});else if(t===id&&ids.has(f)&&S.objects.has(f))incoming.push({rel:r,obj:S.objects.get(f)});});
  return{incoming,outgoing};
}
function openObject(id,fallbackDomain=null){
  if(!S.loaded||!S.objects.has(id))return;addChrome();S.visibleIds=visibleObjectIds();const o=S.objects.get(id),nb=neighborData(id),a=accentFor(o);S.level='OBJECT';S.objectId=id;S.domain=fallbackDomain||S.domain||domain(o);
  document.body.classList.remove('dcts-m14-domain');document.body.classList.add('dcts-m14-object');
  $('#dctsM14LensTitle').textContent=`${currentView()} · ${nameOf(o)}`;$('#dctsM14LensSub').textContent='Object scene · confirmed current-view neighbors only';
  const stage=$('#dctsM14LensStage');
  const inCards=nb.incoming.slice(0,3).map((x,i)=>objectCardHTML(x.obj,'dcts-m14-neighbor in').replace('style="',`style="left:44px;top:${110+i*120}px;`)).join('');
  const outCards=nb.outgoing.slice(0,3).map((x,i)=>objectCardHTML(x.obj,'dcts-m14-neighbor out').replace('style="',`style="right:44px;left:auto;top:${110+i*120}px;`)).join('');
  const total=nb.incoming.length+nb.outgoing.length;
  stage.innerHTML=`<section class="dcts-m14-scene" style="--scene-accent:${a}"><div class="dcts-m14-scenehead"><div class="bigicon">${icon(o)}</div><div><b>${esc(nameOf(o))}</b><small>${esc(role(o))} · ${esc(domain(o))}</small></div><div class="metric"><strong>${total}</strong> confirmed neighbors<br>${esc(statusOf(o)||'status not encoded')}</div></div><div class="dcts-m14-plane"><svg class="dcts-m14-rel-svg"></svg>${inCards}${outCards}<div class="dcts-m14-object-center" data-m14-object="${esc(id)}" style="--node-accent:${a}"><div class="ico">${icon(o)}</div><b>${esc(nameOf(o))}</b><div class="role">${esc(role(o))}</div><div class="model">${esc(modelOf(o))}</div></div>${total===0?'<div class="dcts-m14-empty"><b>No confirmed current-view neighbors</b>No connection is invented for visual completeness. Missing topology evidence remains OPEN-CONFIRMATION REQUIRED.</div>':''}<div class="dcts-m14-object-note">Object focus preserves the same TOPOLOGY_OBJECT_ID. Relationship lines are confirmed current-view relationships only.</div><div class="dcts-m14-openstrip"><b>TRACEABILITY SAFE</b>Vendor/model/status remain object metadata. The scene does not create ports, bandwidth, A/B paths, VLAN/VRF/VNI, optics or management/storage links.</div></div></section>`;
  S.lens.classList.add('show');wireLensNodes(stage);
  requestAnimationFrame(()=>{const rels=[...nb.incoming.map(x=>x.rel),...nb.outgoing.map(x=>x.rel)];drawLensEdges(stage.querySelector('.dcts-m14-plane'),rels,[]);});
}
function closeLens(){S.level='OVERVIEW';S.objectId=null;document.body.classList.remove('dcts-m14-domain','dcts-m14-object');S.lens?.classList.remove('show');}
function backLens(){if(S.level==='OBJECT'&&S.domain)return openDomain(S.domain,S.domain);closeLens();}

function sync(){if(!S.loaded)return;addChrome();bindDomains();annotateOpenButtons();document.documentElement.dataset.dctsMockupFidelity='v1a14';}
async function boot(){let n=0;while(!$('.dcts-app')&&n++<120)await new Promise(r=>setTimeout(r,40));await load();sync();const root=$('.dcts-app')||document.body;let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;sync();});}).observe(root,{subtree:true,childList:true});window.addEventListener('hashchange',()=>{closeLens();setTimeout(sync,60)});window.addEventListener('resize',()=>{if(S.level==='DOMAIN'&&S.domain)setTimeout(()=>openDomain(S.domain,S.domain),80);});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&S.level!=='OVERVIEW')backLens();});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
