(function(){
'use strict';
const BOOT=window.DCTS_VIEWER_BOOT||{};
const S={manifest:null,edgeMap:new Map(),views:new Map(),official:null,raf:0,selected:null,mode:'PRESENTATION'};
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const base=()=>String(BOOT.packageBase||'').replace(/\/$/,'');
const resourceUrl=(b,p)=>/^https?:/i.test(p)?p:(p.startsWith('/')?p:`${b}/${p}`);
const hashState=()=>{const p=new URLSearchParams(location.hash.replace(/^#/,''));return {view:p.get('view')||'T00',object:p.get('object'),mode:p.get('mode')||'PRESENTATION',lang:p.get('lang')||'en',design:p.get('design')!=='0'};};
async function getJson(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`${r.status} ${url}`);return r.json();}
function directionalType(type){
 const t=String(type||'').toUpperCase();
 return new Set(['UPLINKS_TO','DOWNLINKS_TO','MANAGED_BY','OOB_MANAGED_BY','MEMBER_OF','PROTECTED_BY','CONTROLS','MONITORS','STORES_DATA_FOR','BACKS_UP','REPLICATES_TO','PROVIDES_SERVICE_TO','HOSTS']).has(t);
}
async function loadMetadata(){
 const b=base();if(!b)return;
 try{
  S.manifest=await getJson(`${b}/package-manifest.json`);
  const rr=S.manifest.resources||{};
  const [relDoc,viewDoc]=await Promise.all([
   rr.relationships?.path?getJson(resourceUrl(b,rr.relationships.path)):Promise.resolve({relationships:[]}),
   rr.views?.path?getJson(resourceUrl(b,rr.views.path)):Promise.resolve({views:[]})
  ]);
  (relDoc.relationships||[]).forEach(r=>S.edgeMap.set(r.relationship_id,{id:r.relationship_id,kind:'canonical',from:r.from_object_id,to:r.to_object_id,status:r.status,layer:r.layer,type:r.type,directional:directionalType(r.type),raw:r}));
  (viewDoc.views||[]).forEach(v=>{
   S.views.set(v.view_id,v);
   (v.presentation_intents||[]).forEach(i=>{
    if(!S.edgeMap.has(i.intent_id))S.edgeMap.set(i.intent_id,{id:i.intent_id,kind:'intent',from:i.from_object_id,to:i.to_object_id,status:i.status,layer:String(i.layer||'LOGICAL').toUpperCase(),type:i.relationship_type_hint||i.label,directional:false,raw:i});
   });
  });
  const officialPath=rr.official_resources?.path||BOOT.officialResources||null;
  if(officialPath){try{S.official=await getJson(resourceUrl(b,officialPath));}catch(err){console.warn('[DCTS polish] official resources unavailable',err);}}
 }catch(err){console.warn('[DCTS polish] metadata load failed',err);}
}
function iconSvg(domain){
 const common='viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
 const d=String(domain||'').toUpperCase();
 if(d==='SECURITY')return `<svg ${common}><path d="M12 3 19 6v5c0 4.6-2.8 7.8-7 10-4.2-2.2-7-5.4-7-10V6l7-3Z"/><path d="m9.5 12 1.7 1.7 3.5-4"/></svg>`;
 if(d==='NETWORK'||d==='CARRIER'||d==='EDGE')return `<svg ${common}><circle cx="5" cy="12" r="2.2"/><circle cx="19" cy="6" r="2.2"/><circle cx="19" cy="18" r="2.2"/><path d="M7.2 11 16.8 7M7.2 13l9.6 4"/></svg>`;
 if(d==='COMPUTE'||d==='HCI')return `<svg ${common}><rect x="4" y="5" width="16" height="6" rx="1.5"/><rect x="4" y="13" width="16" height="6" rx="1.5"/><path d="M7 8h.01M7 16h.01M10 8h6M10 16h6"/></svg>`;
 if(d==='STORAGE')return `<svg ${common}><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>`;
 if(d==='CLOUD')return `<svg ${common}><path d="M7.5 18h9.2a4.3 4.3 0 0 0 .8-8.5A5.7 5.7 0 0 0 6.8 8.2 4.7 4.7 0 0 0 7.5 18Z"/></svg>`;
 if(d==='BACKUP'||d==='DR')return `<svg ${common}><path d="M5 8V4m0 0h4M5 4l3.3 3.3A7 7 0 1 1 5.8 13"/><path d="M12 9v4l3 2"/></svg>`;
 if(d==='MANAGEMENT'||d==='DCIM'||d==='OPERATIONS')return `<svg ${common}><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-5l-.4 3.1a7 7 0 0 0-1.7 1L5 6.1 3 9.5 5 11a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.4 3.1h5l.4-3.1a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z"/></svg>`;
 if(d==='OOB')return `<svg ${common}><rect x="4" y="5" width="16" height="14" rx="2"/><path d="m7 9 3 3-3 3M12 15h5"/></svg>`;
 if(d==='MONITORING')return `<svg ${common}><path d="M3 12h4l2.2-5 4.1 10 2.3-5H21"/><circle cx="12" cy="12" r="9"/></svg>`;
 if(d==='SERVICE'||d==='TENANT')return `<svg ${common}><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="8.5" y="13" width="7" height="7" rx="1.5"/></svg>`;
 if(d==='PHYSICAL')return `<svg ${common}><rect x="5" y="4" width="14" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>`;
 return `<svg ${common}><circle cx="12" cy="12" r="8"/><path d="M8 12h8M12 8v8"/></svg>`;
}
function domainOfCard(card){return card?.querySelector('.node-top span:nth-child(2)')?.textContent?.trim()||'OTHER';}
function injectIcons(){
 $$('.node-card').forEach(card=>{
  if(!card.dataset.polishIcon){const span=document.createElement('span');span.className='node-icon';span.innerHTML=iconSvg(domainOfCard(card));card.prepend(span);card.classList.add('has-node-icon');card.dataset.polishIcon='1';}
  if(!card.dataset.polishHover){card.addEventListener('mouseenter',()=>focusEdges(card.dataset.object));card.addEventListener('mouseleave',()=>focusEdges(hashState().object));card.dataset.polishHover='1';}
 });
}
function rectFor(card){if(!card)return null;return{x:card.offsetLeft||parseFloat(card.style.left)||0,y:card.offsetTop||parseFloat(card.style.top)||0,w:card.offsetWidth||205,h:card.offsetHeight||92};}
function center(r){return{x:r.x+r.w/2,y:r.y+r.h/2};}
function expanded(r,p=12){return{x:r.x-p,y:r.y-p,w:r.w+2*p,h:r.h+2*p};}
function segHitsRect(a,b,r){
 if(Math.abs(a.x-b.x)<.1){const x=a.x,y1=Math.min(a.y,b.y),y2=Math.max(a.y,b.y);return x>=r.x&&x<=r.x+r.w&&y2>=r.y&&y1<=r.y+r.h;}
 if(Math.abs(a.y-b.y)<.1){const y=a.y,x1=Math.min(a.x,b.x),x2=Math.max(a.x,b.x);return y>=r.y&&y<=r.y+r.h&&x2>=r.x&&x1<=r.x+r.w;}
 return false;
}
function ports(r){return[
 {side:'R',x:r.x+r.w,y:r.y+r.h/2,dx:1,dy:0},
 {side:'L',x:r.x,y:r.y+r.h/2,dx:-1,dy:0},
 {side:'B',x:r.x+r.w/2,y:r.y+r.h,dx:0,dy:1},
 {side:'T',x:r.x+r.w/2,y:r.y,dx:0,dy:-1}
];}
function cleanPts(pts){return pts.filter((p,i)=>i===0||Math.abs(p.x-pts[i-1].x)>.1||Math.abs(p.y-pts[i-1].y)>.1);}
function routeVariants(s,t){
 const lead=16,s1={x:s.x+s.dx*lead,y:s.y+s.dy*lead},t1={x:t.x+t.dx*lead,y:t.y+t.dy*lead},out=[];
 const push=pts=>out.push(cleanPts([s,...pts,t]));
 if(Math.abs(s1.x-t1.x)<.1||Math.abs(s1.y-t1.y)<.1)push([s1,t1]);
 push([s1,{x:t1.x,y:s1.y},t1]);
 push([s1,{x:s1.x,y:t1.y},t1]);
 const horizontalPair=s.dx!==0&&t.dx!==0,verticalPair=s.dy!==0&&t.dy!==0;
 if(horizontalPair){const m0=(s1.x+t1.x)/2;[-72,-36,0,36,72].forEach(o=>{const m=m0+o;push([s1,{x:m,y:s1.y},{x:m,y:t1.y},t1]);});}
 if(verticalPair){const m0=(s1.y+t1.y)/2;[-72,-36,0,36,72].forEach(o=>{const m=m0+o;push([s1,{x:s1.x,y:m},{x:t1.x,y:m},t1]);});}
 if(!horizontalPair&&!verticalPair){[-54,54].forEach(o=>{
  if(s.dx!==0){const m=s1.x+s.dx*Math.abs(o);push([s1,{x:m,y:s1.y},{x:m,y:t1.y},t1]);}
  else{const m=s1.y+s.dy*Math.abs(o);push([s1,{x:s1.x,y:m},{x:t1.x,y:m},t1]);}
 });}
 return out;
}
function facingPenalty(s,t,ac,bc){
 const v={x:bc.x-ac.x,y:bc.y-ac.y},sv=v.x*s.dx+v.y*s.dy,tv=(-v.x)*t.dx+(-v.y)*t.dy;
 return (sv<0?420:0)+(tv<0?420:0);
}
function scoreRoute(pts,obstacles,portPenalty=0){
 let score=portPenalty,bends=0;
 for(let i=0;i<pts.length-1;i++){
  const a=pts[i],b=pts[i+1];score+=Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
  obstacles.forEach(r=>{if(segHitsRect(a,b,r))score+=100000;});
  if(i>0){const p=pts[i-1],turn=(Math.abs(p.x-a.x)<.1)!==(Math.abs(a.x-b.x)<.1);if(turn)bends++;}
 }
 return score+bends*14;
}
function bestRoute(a,b,obstacles){
 const ac=center(a),bc=center(b);let best=null,bestScore=Infinity;
 ports(a).forEach(s=>ports(b).forEach(t=>routeVariants(s,t).forEach(pts=>{const sc=scoreRoute(pts,obstacles,facingPenalty(s,t,ac,bc));if(sc<bestScore){best=pts;bestScore=sc;}})));
 return best||[{x:ac.x,y:ac.y},{x:bc.x,y:bc.y}];
}
function roundedPath(pts,r=9){
 if(pts.length<2)return'';let d=`M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
 for(let i=1;i<pts.length-1;i++){
  const prev=pts[i-1],cur=pts[i],next=pts[i+1],v1={x:cur.x-prev.x,y:cur.y-prev.y},v2={x:next.x-cur.x,y:next.y-cur.y};
  const l1=Math.max(1,Math.abs(v1.x)+Math.abs(v1.y)),l2=Math.max(1,Math.abs(v2.x)+Math.abs(v2.y)),rr=Math.min(r,l1/2,l2/2);
  const p1={x:cur.x-(v1.x/l1)*rr,y:cur.y-(v1.y/l1)*rr},p2={x:cur.x+(v2.x/l2)*rr,y:cur.y+(v2.y/l2)*rr};
  d+=` L ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${cur.x.toFixed(1)} ${cur.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
 }
 const last=pts[pts.length-1];return d+` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
}
function flowPath(svg,p,meta,d){
 const flow=document.createElementNS('http://www.w3.org/2000/svg','path');
 flow.setAttribute('d',d);flow.setAttribute('vector-effect','non-scaling-stroke');flow.dataset.flowFor=meta.id;
 flow.classList.add('edge-flow',meta.kind==='intent'?'flow-intent':'flow-canonical',meta.directional?'flow-directional':'flow-undirected',`layer-${String(meta.layer||'LOGICAL').toLowerCase()}`);
 p.after(flow);
}
function refineEdges(){
 const svg=$('.edges');if(!svg)return;
 const cards=$$('.node-card'),cardMap=new Map(cards.map(c=>[c.dataset.object,c])),allRects=cards.map(c=>({id:c.dataset.object,r:expanded(rectFor(c),13)}));
 svg.querySelectorAll('.edge-flow').forEach(n=>n.remove());
 const marker=svg.querySelector('marker#arrow');if(marker){marker.setAttribute('markerWidth','4');marker.setAttribute('markerHeight','4');marker.setAttribute('refX','8.4');marker.setAttribute('refY','5');}
 [...svg.querySelectorAll('.edge[data-edge]')].forEach(p=>{
  const meta=S.edgeMap.get(p.dataset.edge);if(!meta||!meta.from||!meta.to)return;
  const a=rectFor(cardMap.get(meta.from)),b=rectFor(cardMap.get(meta.to));if(!a||!b)return;
  const obstacles=allRects.filter(x=>x.id!==meta.from&&x.id!==meta.to).map(x=>x.r),pts=bestRoute(a,b,obstacles),d=roundedPath(pts,8);
  p.setAttribute('d',d);p.setAttribute('vector-effect','non-scaling-stroke');p.classList.add('polished-edge');
  p.classList.toggle('edge-directional',meta.kind==='canonical'&&meta.directional);p.classList.toggle('edge-undirected',!(meta.kind==='canonical'&&meta.directional));
  if(meta.kind==='canonical'&&meta.directional)p.setAttribute('marker-end','url(#arrow)');else p.removeAttribute('marker-end');
  flowPath(svg,p,meta,d);
 });
 focusEdges(hashState().object);
}
function focusEdges(objectId){
 S.selected=objectId||null;const related=new Set();if(objectId)S.edgeMap.forEach((e,id)=>{if(e.from===objectId||e.to===objectId)related.add(id);});
 $$('.edge[data-edge]').forEach(p=>{const on=!objectId||related.has(p.dataset.edge);p.classList.toggle('edge-related',!!objectId&&on);p.classList.toggle('edge-muted',!!objectId&&!on);});
 $$('.edge-flow').forEach(p=>{const on=!objectId||related.has(p.dataset.flowFor);p.classList.toggle('edge-related',!!objectId&&on);p.classList.toggle('edge-muted',!!objectId&&!on);});
 $$('.node-card').forEach(c=>{if(!objectId){c.classList.remove('context-muted');return;}const on=c.dataset.object===objectId||related.size&&[...related].some(id=>{const e=S.edgeMap.get(id);return e&&(e.from===c.dataset.object||e.to===c.dataset.object);});c.classList.toggle('context-muted',!on);});
}
const language=()=>hashState().lang==='tr'?'tr':'en';
function validUrl(u){try{const x=new URL(u,location.href);return ['http:','https:'].includes(x.protocol)?x.href:null;}catch(_){return null;}}
const officialEntry=id=>S.official?.objects?.[id]||null;
function usableLinks(entry){return (entry?.links||[]).map(l=>({...l,href:validUrl(l.url)})).filter(l=>l.href);}
function ensureOfficialTab(){
 const tabs=$('.inspector-tabs');if(!tabs||!S.official)return;let btn=tabs.querySelector('[data-itab="official"]');
 if(!btn){btn=document.createElement('button');btn.dataset.itab='official';btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();renderOfficialResources();});tabs.appendChild(btn);}
 btn.textContent=language()==='tr'?'Resmî Kaynaklar':'Official Resources';
 const selected=hashState().object,entry=officialEntry(selected),links=usableLinks(entry),show=!!selected&&links.length>0;
 btn.hidden=!show;btn.disabled=!show;btn.title=show?'':(language()==='tr'?'Bu nesne için doğrulanmış resmî kaynak yok.':'No verified official resources for this object.');
 if(show)appendOfficialPeek(selected);
 else if(btn.classList.contains('on'))tabs.querySelector('[data-itab="overview"]')?.click();
}
function renderOfficialResources(){
 const id=hashState().object,body=$('#inspectorBody'),tabs=$('.inspector-tabs'),e=officialEntry(id),links=usableLinks(e),tr=language()==='tr';if(!body||!tabs||!id||!links.length)return;
 $$('.inspector-tabs button').forEach(b=>b.classList.toggle('on',b.dataset.itab==='official'));
 const cards=links.map(l=>`<a class="official-link" href="${esc(l.href)}" target="_blank" rel="noopener noreferrer"><span><small>${esc(l.type||'OFFICIAL')}</small>${esc(l.label||'Official resource')}</span><b>↗</b></a>`).join('');
 body.innerHTML=`<div class="official-head"><span class="official-status ${String(e.status||'').includes('OPEN')?'open':'verified'}">${esc(e.status||'VERIFIED')}</span><strong>${esc(e.scope||'Official vendor / manufacturer resources')}</strong>${e.vendor?`<small>${esc(e.vendor)}</small>`:''}</div><div class="official-links">${cards}</div>${e.note?`<div class="official-note">${esc(e.note)}</div>`:''}<p class="official-policy">${tr?'Bu bağlantılar resmî referans metadata’sıdır; canonical topoloji grafiğini değiştirmez.':'These links are official reference metadata; they do not modify the canonical topology graph.'}</p>`;
}
function appendOfficialPeek(id){
 const body=$('#inspectorBody');if(!body||body.querySelector('.official-peek'))return;const e=officialEntry(id);if(!usableLinks(e).length)return;
 const peek=document.createElement('button');peek.className='official-peek';peek.innerHTML=`<span>${language()==='tr'?'Doğrulanmış resmî kaynaklar mevcut':'Verified official resources available'}</span><b>↗</b>`;peek.onclick=renderOfficialResources;body.appendChild(peek);
}
function decorateT00(){
 const c=$('.t00-center');if(c&&!c.querySelector('.t00-orbit')){const o=document.createElement('span');o.className='t00-orbit';c.appendChild(o);}
 const map={T01:'SERVICE',T02:'NETWORK',T03:'PHYSICAL',T04:'COMPUTE',T05:'MANAGEMENT',T06:'SERVICE',T07:'SECURITY',T08:'BACKUP',T09:'COMPUTE',T10:'DR'};
 $$('.t00-card').forEach((card,i)=>{card.style.setProperty('--orbit-delay',`${(i*.18).toFixed(2)}s`);if(!card.querySelector('.t00-icon')){const code=card.querySelector('.code')?.textContent?.trim();const x=document.createElement('span');x.className='t00-icon';x.innerHTML=iconSvg(map[code]||'SERVICE');card.appendChild(x);}});
}
function currentView(){return S.views.get(hashState().view)||null;}
function updateDomainBoxes(){
 $$('.domain-box').forEach(box=>{const domain=box.querySelector('span')?.textContent?.trim();const nodes=$$('.node-card').filter(c=>domainOfCard(c)===domain);if(!nodes.length)return;const rs=nodes.map(rectFor);const minX=Math.min(...rs.map(r=>r.x)),minY=Math.min(...rs.map(r=>r.y)),maxX=Math.max(...rs.map(r=>r.x+r.w)),maxY=Math.max(...rs.map(r=>r.y+r.h));box.style.left=(minX-14)+'px';box.style.top=(minY-28)+'px';box.style.width=(maxX-minX+28)+'px';box.style.height=(maxY-minY+44)+'px';});
}
function applyExecutiveLayout(){
 const hs=hashState(),v=currentView();if(hs.view!=='T01'||!v||String(v.layout?.strategy||'AUTO').toUpperCase()!=='AUTO')return;
 const cards=$$('.node-card');if(!cards.length)return;
 const stageByDomain={EXTERNAL:0,CARRIER:0,EDGE:0,SECURITY:1,NETWORK:2,COMPUTE:3,HCI:3,STORAGE:3,CLOUD:4,SERVICE:4,TENANT:4,BACKUP:4,DR:4};
 const rail=new Set(['MANAGEMENT','OOB','MONITORING','DCIM','OPERATIONS']);const stages=[[],[],[],[],[]],railCards=[];
 cards.forEach(c=>{const d=domainOfCard(c).toUpperCase();if(rail.has(d))railCards.push(c);else stages[stageByDomain[d]??4].push(c);});
 const xs=[34,250,466,682,898],top=70,bottom=585;
 stages.forEach((list,si)=>{list.sort((a,b)=>domainOfCard(a).localeCompare(domainOfCard(b))||a.dataset.object.localeCompare(b.dataset.object));const gap=list.length>1?Math.max(96,Math.min(116,(bottom-top)/(list.length-1))):0;list.forEach((c,i)=>{c.style.left=xs[si]+'px';c.style.top=Math.round(top+i*gap)+'px';});});
 railCards.sort((a,b)=>domainOfCard(a).localeCompare(domainOfCard(b))||a.dataset.object.localeCompare(b.dataset.object));const cols=Math.min(4,Math.max(1,railCards.length)),startX=Math.max(34,Math.round((1180-(cols*205+(cols-1)*22))/2));railCards.forEach((c,i)=>{c.style.left=(startX+(i%cols)*227)+'px';c.style.top=(642+Math.floor(i/cols)*100)+'px';});
 updateDomainBoxes();
 const active=new Set();(v.relationship_ids||[]).forEach(id=>{const e=S.edgeMap.get(id);if(e?.kind==='canonical'){if(e.from)active.add(e.from);if(e.to)active.add(e.to);}});cards.forEach(c=>c.classList.toggle('canonical-active',active.has(c.dataset.object)));
}
function removeSceneNotices(){ $$('.scene-status-banner').forEach(n=>n.remove()); }
function addSceneNotices(){
 removeSceneNotices();const hs=hashState(),v=currentView(),scene=$('#scene');if(!scene||!v||hs.view==='T00')return;
 const rels=(v.relationship_ids||[]).map(id=>S.edgeMap.get(id)).filter(e=>e?.kind==='canonical'),physical=rels.filter(e=>String(e.layer).toUpperCase()==='PHYSICAL'),intents=v.presentation_intents||[];
 if(hs.view==='T03'&&physical.length===0){const n=document.createElement('div');n.className='scene-status-banner evidence-limited';n.innerHTML=`<strong>${language()==='tr'?'Fiziksel bağlantı henüz kanıtlanmadı.':'Physical connectivity is not yet evidenced.'}</strong><span>${language()==='tr'?'Cihazlar yalnızca kapsam bağlamı için gösterilir. Portlar, optikler, hızlar ve A/B yolları bilinçli olarak türetilmez.':'Devices are shown for scope context only. Ports, optics, speeds and A/B paths are intentionally not inferred.'}</span>`;scene.appendChild(n);return;}
 if(rels.length===0&&intents.length>0){const n=document.createElement('div');n.className='scene-status-banner intent-only';n.innerHTML=`<strong>${language()==='tr'?'Yalnızca tasarım / sunum intenti':'Design / presentation intent only'}</strong><span>${language()==='tr'?'Bu görünümde canonical ilişki kanıtlanmamıştır. Kesik yollar ikincil ve doğrulanmamış tasarım niyetidir.':'No canonical relationship is evidenced in this view. Dashed paths are secondary, non-confirmed design intent.'}</span>`;scene.appendChild(n);}
}
function syncMode(){const hs=hashState();S.mode=hs.mode;document.documentElement.dataset.dctsMode=S.mode;document.documentElement.dataset.dctsMotion='semantic';document.documentElement.dataset.dctsView=hs.view;}
function refresh(){cancelAnimationFrame(S.raf);S.raf=requestAnimationFrame(()=>{syncMode();injectIcons();decorateT00();applyExecutiveLayout();addSceneNotices();ensureOfficialTab();requestAnimationFrame(refineEdges);});}
function startObserver(){
 const target=$('.dcts-app')||document.body,obs=new MutationObserver(muts=>{if(muts.some(m=>m.type==='childList'&&[...m.addedNodes].some(n=>n.nodeType===1&&!n.classList?.contains('edge-flow')&&!n.classList?.contains('scene-status-banner'))))refresh();});
 obs.observe(target,{subtree:true,childList:true});
 window.addEventListener('hashchange',()=>setTimeout(refresh,0));window.addEventListener('resize',()=>setTimeout(refresh,140));
 document.addEventListener('click',e=>{if(e.target.closest('.tab,.node-card,#modeBtn,#intentBtn,#fitBtn,.inspector-tabs button'))setTimeout(refresh,30);},true);
}
async function boot(){
 let tries=0;while(!$('.dcts-app')&&tries++<100)await new Promise(r=>setTimeout(r,40));
 document.documentElement.classList.add('dcts-polish-v1a2','dcts-polish-v1a3');await loadMetadata();refresh();startObserver();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
