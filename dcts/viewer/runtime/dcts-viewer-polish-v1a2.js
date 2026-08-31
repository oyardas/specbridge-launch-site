(function(){
'use strict';
const BOOT=window.DCTS_VIEWER_BOOT||{};
const S={manifest:null,edgeMap:new Map(),official:null,raf:0,selected:null,mode:'PRESENTATION'};
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const base=()=>String(BOOT.packageBase||'').replace(/\/$/,'');
const resourceUrl=(b,p)=>/^https?:/i.test(p)?p:(p.startsWith('/')?p:`${b}/${p}`);
const hashState=()=>{const p=new URLSearchParams(location.hash.replace(/^#/,''));return {view:p.get('view')||'T00',object:p.get('object'),mode:p.get('mode')||'PRESENTATION',lang:p.get('lang')||'en'};};
async function getJson(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`${r.status} ${url}`);return r.json();}
async function loadMetadata(){
 const b=base(); if(!b)return;
 try{
  S.manifest=await getJson(`${b}/package-manifest.json`);
  const rr=S.manifest.resources||{};
  const [relDoc,viewDoc]=await Promise.all([
   rr.relationships?.path?getJson(resourceUrl(b,rr.relationships.path)):Promise.resolve({relationships:[]}),
   rr.views?.path?getJson(resourceUrl(b,rr.views.path)):Promise.resolve({views:[]})
  ]);
  (relDoc.relationships||[]).forEach(r=>S.edgeMap.set(r.relationship_id,{id:r.relationship_id,kind:'canonical',from:r.from_object_id,to:r.to_object_id,status:r.status,layer:r.layer}));
  (viewDoc.views||[]).forEach(v=>(v.presentation_intents||[]).forEach(i=>{
    if(!S.edgeMap.has(i.intent_id))S.edgeMap.set(i.intent_id,{id:i.intent_id,kind:'intent',from:i.from_object_id,to:i.to_object_id,status:i.status,layer:'LOGICAL'});
  }));
  const officialPath=BOOT.officialResources||rr.official_resources?.path||null;
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
 return `<svg ${common}><circle cx="12" cy="12" r="8"/><path d="M8 12h8M12 8v8"/></svg>`;
}
function injectIcons(){
 $$('.node-card').forEach(card=>{
  if(card.dataset.polishIcon)return;
  const domain=card.querySelector('.node-top span:nth-child(2)')?.textContent?.trim()||'OTHER';
  const span=document.createElement('span');span.className='node-icon';span.innerHTML=iconSvg(domain);card.prepend(span);card.classList.add('has-node-icon');card.dataset.polishIcon='1';
  if(!card.dataset.polishHover){
   card.addEventListener('mouseenter',()=>focusEdges(card.dataset.object));
   card.addEventListener('mouseleave',()=>focusEdges(hashState().object));
   card.dataset.polishHover='1';
  }
 });
}
function rectFor(card){if(!card)return null;return{x:parseFloat(card.style.left)||0,y:parseFloat(card.style.top)||0,w:card.offsetWidth||180,h:card.offsetHeight||92};}
function expanded(r,p=11){return{x:r.x-p,y:r.y-p,w:r.w+2*p,h:r.h+2*p};}
function segHitsRect(a,b,r){
 if(a.x===b.x){const x=a.x,y1=Math.min(a.y,b.y),y2=Math.max(a.y,b.y);return x>=r.x&&x<=r.x+r.w&&y2>=r.y&&y1<=r.y+r.h;}
 if(a.y===b.y){const y=a.y,x1=Math.min(a.x,b.x),x2=Math.max(a.x,b.x);return y>=r.y&&y<=r.y+r.h&&x2>=r.x&&x1<=r.x+r.w;}
 return false;
}
function routeCandidates(a,b){
 const ac={x:a.x+a.w/2,y:a.y+a.h/2},bc={x:b.x+b.w/2,y:b.y+b.h/2},horizontal=Math.abs(bc.x-ac.x)>=Math.abs(bc.y-ac.y),out=[];
 if(horizontal){
  const right=bc.x>=ac.x,s={x:right?a.x+a.w:a.x,y:ac.y},e={x:right?b.x:b.x+b.w,y:bc.y},m0=(s.x+e.x)/2;
  [-72,-36,0,36,72].forEach(off=>{const m=m0+off;out.push({pts:[s,{x:m,y:s.y},{x:m,y:e.y},e]});});
 }else{
  const down=bc.y>=ac.y,s={x:ac.x,y:down?a.y+a.h:a.y},e={x:bc.x,y:down?b.y:b.y+b.h},m0=(s.y+e.y)/2;
  [-72,-36,0,36,72].forEach(off=>{const m=m0+off;out.push({pts:[s,{x:s.x,y:m},{x:e.x,y:m},e]});});
 }
 return out;
}
function scoreRoute(route,obstacles){
 let score=0,len=0;
 for(let i=0;i<route.pts.length-1;i++){const a=route.pts[i],b=route.pts[i+1];len+=Math.abs(a.x-b.x)+Math.abs(a.y-b.y);obstacles.forEach(r=>{if(segHitsRect(a,b,r))score+=100000;});}
 return score+len;
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
function refineEdges(){
 const svg=$('.edges');if(!svg)return;
 const cards=$$('.node-card'),cardMap=new Map(cards.map(c=>[c.dataset.object,c])),allRects=cards.map(c=>({id:c.dataset.object,r:expanded(rectFor(c),12)}));
 svg.querySelectorAll('.edge-flow').forEach(n=>n.remove());
 const marker=svg.querySelector('marker#arrow');if(marker){marker.setAttribute('markerWidth','3.3');marker.setAttribute('markerHeight','3.3');marker.setAttribute('refX','8.5');}
 [...svg.querySelectorAll('.edge[data-edge]')].forEach(p=>{
  const meta=S.edgeMap.get(p.dataset.edge);if(!meta||!meta.from||!meta.to)return;
  const a=rectFor(cardMap.get(meta.from)),b=rectFor(cardMap.get(meta.to));if(!a||!b)return;
  const obstacles=allRects.filter(x=>x.id!==meta.from&&x.id!==meta.to).map(x=>x.r),candidates=routeCandidates(a,b);
  candidates.sort((x,y)=>scoreRoute(x,obstacles)-scoreRoute(y,obstacles));
  const d=roundedPath(candidates[0].pts,8);p.setAttribute('d',d);p.setAttribute('vector-effect','non-scaling-stroke');p.classList.add('polished-edge');
  if(meta.kind==='canonical'){
   const flow=p.cloneNode(false);flow.removeAttribute('marker-end');flow.removeAttribute('data-edge');flow.dataset.flowFor=meta.id;
   flow.classList.remove('edge','edge-canonical','status-confirmed','status-open','status-vendor','status-assumption','status-superseded');flow.classList.add('edge-flow');flow.setAttribute('d',d);p.after(flow);
  }
 });
 focusEdges(hashState().object);
}
function focusEdges(objectId){
 S.selected=objectId||null;const related=new Set();if(objectId)S.edgeMap.forEach((e,id)=>{if(e.from===objectId||e.to===objectId)related.add(id);});
 $$('.edge[data-edge]').forEach(p=>{const on=!objectId||related.has(p.dataset.edge);p.classList.toggle('edge-related',!!objectId&&on);p.classList.toggle('edge-muted',!!objectId&&!on);});
 $$('.edge-flow').forEach(p=>{const on=!objectId||related.has(p.dataset.flowFor);p.classList.toggle('edge-related',!!objectId&&on);p.classList.toggle('edge-muted',!!objectId&&!on);});
}
const language=()=>hashState().lang==='tr'?'tr':'en';
function ensureOfficialTab(){
 const tabs=$('.inspector-tabs');if(!tabs||!S.official)return;let btn=tabs.querySelector('[data-itab="official"]');
 if(!btn){btn=document.createElement('button');btn.dataset.itab='official';btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();renderOfficialResources();});tabs.appendChild(btn);}
 btn.textContent=language()==='tr'?'Resmî Kaynaklar':'Official Resources';const selected=hashState().object;btn.disabled=!selected;btn.title=selected?'':'Select an object first';if(selected)appendOfficialPeek(selected);
}
function validUrl(u){try{const x=new URL(u,location.href);return ['http:','https:'].includes(x.protocol)?x.href:null;}catch(_){return null;}}
const officialEntry=id=>S.official?.objects?.[id]||null;
function renderOfficialResources(){
 const id=hashState().object,body=$('#inspectorBody'),tabs=$('.inspector-tabs');if(!body||!tabs)return;
 $$('.inspector-tabs button').forEach(b=>b.classList.toggle('on',b.dataset.itab==='official'));const e=officialEntry(id),tr=language()==='tr';
 if(!id){body.innerHTML=`<p class="muted">${tr?'Önce bir altyapı nesnesi seçin.':'Select an infrastructure object first.'}</p>`;return;}
 if(!e||!(e.links||[]).length){body.innerHTML=`<div class="official-empty">${tr?'Bu nesne için doğrulanmış resmî kaynak eşlemesi yok.':'No verified official resource is mapped to this object.'}</div>`;return;}
 const links=(e.links||[]).map(l=>{const u=validUrl(l.url);return u?`<a class="official-link" href="${esc(u)}" target="_blank" rel="noopener noreferrer"><span>${esc(l.label||'Official resource')}</span><b>↗</b></a>`:'';}).join('');
 body.innerHTML=`<div class="official-head"><span class="official-status ${String(e.status||'').includes('OPEN')?'open':'verified'}">${esc(e.status||'VERIFIED')}</span><strong>${esc(e.scope||'Official vendor / manufacturer resources')}</strong>${e.vendor?`<small>${esc(e.vendor)}</small>`:''}</div><div class="official-links">${links}</div>${e.note?`<div class="official-note">${esc(e.note)}</div>`:''}<p class="official-policy">${tr?'Bu bağlantılar resmî referans metadata’sıdır; canonical topoloji grafiğini değiştirmez.':'These links are official reference metadata; they do not modify the canonical topology graph.'}</p>`;
}
function appendOfficialPeek(id){
 const body=$('#inspectorBody');if(!body||body.querySelector('.official-peek'))return;const e=officialEntry(id);if(!e||!(e.links||[]).length)return;
 const peek=document.createElement('button');peek.className='official-peek';peek.innerHTML=`<span>${language()==='tr'?'Doğrulanmış resmî kaynaklar mevcut':'Verified official resources available'}</span><b>↗</b>`;peek.onclick=renderOfficialResources;body.appendChild(peek);
}
function syncMode(){S.mode=hashState().mode;document.documentElement.dataset.dctsMode=S.mode;document.documentElement.dataset.dctsMotion='semantic';}
function decorateT00(){
 const c=$('.t00-center');if(c&&!c.querySelector('.t00-orbit')){const o=document.createElement('span');o.className='t00-orbit';c.appendChild(o);}
 $$('.t00-card').forEach((card,i)=>card.style.setProperty('--orbit-delay',`${(i*.18).toFixed(2)}s`));
}
function refresh(){cancelAnimationFrame(S.raf);S.raf=requestAnimationFrame(()=>{syncMode();injectIcons();decorateT00();ensureOfficialTab();requestAnimationFrame(refineEdges);});}
function startObserver(){
 const target=$('.dcts-app')||document.body,obs=new MutationObserver(muts=>{if(muts.some(m=>m.type==='childList'&&[...m.addedNodes].some(n=>n.nodeType===1&&!n.classList?.contains('edge-flow'))))refresh();});
 obs.observe(target,{subtree:true,childList:true});
 window.addEventListener('hashchange',()=>setTimeout(refresh,0));window.addEventListener('resize',()=>setTimeout(refresh,140));
 document.addEventListener('click',e=>{if(e.target.closest('.tab,.node-card,#modeBtn,#intentBtn,#fitBtn'))setTimeout(refresh,20);},true);
}
async function boot(){
 let tries=0;while(!$('.dcts-app')&&tries++<100)await new Promise(r=>setTimeout(r,40));
 document.documentElement.classList.add('dcts-polish-v1a2');await loadMetadata();refresh();startObserver();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();