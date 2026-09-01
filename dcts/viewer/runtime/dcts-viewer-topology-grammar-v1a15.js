(function(){
'use strict';
const BOOT=window.DCTS_VIEWER_BOOT||{};
const STATE={objects:new Map(),rels:new Map(),views:new Map(),loaded:false,projection:null,edges:[],nodes:new Map(),activeView:null};
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const norm=v=>String(v||'').trim().toUpperCase();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const base=()=>String(BOOT.packageBase||'').replace(/\/$/,'');
const oid=o=>o?.object_id||o?.TOPOLOGY_OBJECT_ID||'';
const nameOf=o=>o?.display_name||o?.DISPLAY_NAME||o?.name||o?.NAME||o?.product_family||o?.PRODUCT_FAMILY||o?.functional_role||o?.FUNCTIONAL_ROLE||'Object';
const roleOf=o=>o?.functional_role||o?.FUNCTIONAL_ROLE||o?.role||o?.ROLE_ID||'UNMAPPED_ROLE';
const domainOf=o=>norm(o?.domain||o?.DOMAIN||'UNMAPPED');
const statusOf=o=>norm(o?.status||o?.STATUS||o?.information_status||o?.INFORMATION_STATUS||'');
const qtyOf=o=>{const q=o?.quantity??o?.QUANTITY??o?.represented_object_quantity??o?.REPRESENTED_OBJECT_QUANTITY??o?.instance_count??o?.INSTANCE_COUNT;return q==null?'':`× ${q}`;};
const fromId=r=>r?.from_object_id||r?.FROM_OBJECT_ID||r?.source_object_id||r?.SOURCE_OBJECT_ID||'';
const toId=r=>r?.to_object_id||r?.TO_OBJECT_ID||r?.target_object_id||r?.TARGET_OBJECT_ID||'';
const typeOf=r=>norm(r?.type||r?.TYPE||r?.relationship_type||r?.RELATIONSHIP_TYPE||r?.relationship_type_hint||r?.RELATIONSHIP_TYPE_HINT||'RELATIONSHIP');
const relStatus=r=>norm(r?.status||r?.STATUS||r?.information_status||r?.INFORMATION_STATUS||'CONFIRMED');
async function json(u){const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error(`${r.status} ${u}`);return r.json();}
function res(b,p){return String(p||'').startsWith('/')?p:`${b}/${p}`;}
function currentHash(){const h=new URLSearchParams(location.hash.replace(/^#/,''));return{view:h.get('view')||'T00',mode:norm(h.get('mode')||'PRESENTATION'),design:h.get('design')!=='0'};}
function semantic(r,isIntent=false){if(isIntent)return'intent';const t=typeOf(r),l=norm(r?.layer||r?.LAYER);if(l==='OOB'||l==='MANAGEMENT'||t.includes('MANAGED')||t.includes('MONITOR'))return'management';if(l==='SECURITY'||t.includes('PROTECTED')||t.includes('SECURITY'))return'security';if(l==='BACKUP'||l==='DR'||t.includes('BACKUP')||t.includes('REPLICAT'))return'backup';if(l==='SERVICE'||t.includes('PROVIDES_SERVICE')||t==='HOSTS')return'service';return'data';}
function statusClass(s){s=norm(s);if(s.includes('OPEN'))return'open-confirmation-required';if(s.includes('WORKING'))return'working-assumption';if(s.includes('VENDOR'))return'vendor-proposal';return'confirmed';}
function accent(o){const d=domainOf(o);if(d==='SECURITY')return'#c94e5d';if(d==='NETWORK'||d==='OOB'||d==='EDGE')return'#2d78b7';if(d==='COMPUTE'||d==='HCI')return'#4c8a68';if(d==='STORAGE'||d==='BACKUP'||d==='DR')return'#2c8b8d';if(d==='SERVICE'||d==='TENANT'||d==='CLOUD')return'#9a7427';if(d==='MANAGEMENT'||d==='MONITORING'||d==='OPERATIONS'||d==='DCIM')return'#6a55a2';return'#5d7789';}
function icon(o){const lib=window.DCTS_ICON_LIBRARY;return lib?lib.svg({domain:domainOf(o),functional_role:roleOf(o),object_type:o?.object_type||o?.OBJECT_TYPE,display_name:nameOf(o),model:o?.model||o?.MODEL}):'';}

async function load(){
  const b=base();if(!b)return;
  try{
    const m=await json(`${b}/package-manifest.json`),r=m.resources||{};
    const [od,rd,vd]=await Promise.all([json(res(b,r.objects.path)),json(res(b,r.relationships.path)),json(res(b,r.views.path))]);
    (od.objects||od.NODES||[]).forEach(o=>STATE.objects.set(oid(o),o));
    (rd.relationships||rd.RELATIONSHIPS||[]).forEach(x=>STATE.rels.set(x.relationship_id||x.RELATIONSHIP_ID,x));
    (vd.views||vd.VIEWS||[]).forEach(v=>STATE.views.set(v.view_id||v.VIEW_ID,v));
    STATE.loaded=true;
  }catch(e){console.warn('[DCTS v1a15] topology grammar data load failed',e);}
}

function ensureProjection(){
  const vp=$('.viewport');if(!vp)return null;
  let p=$('#dctsV15Projection');if(!p){p=document.createElement('div');p.id='dctsV15Projection';p.className='dcts-v15-projection';vp.appendChild(p);}STATE.projection=p;return p;
}
function zone(cls,label,left,top,width,height){return `<div class="dcts-v15-zone ${cls}" style="left:${left}%;top:${top}%;width:${width}%;height:${height}%"><span class="dcts-v15-zone-label">${esc(label)}</span></div>`;}
function nodeHtml(o,pos){const st=statusOf(o)||'NOT ENCODED',a=accent(o),q=qtyOf(o);return `<article class="dcts-v15-node" data-v15-object="${esc(oid(o))}" style="left:${pos.x}%;top:${pos.y}%;--node-accent:${a}"><div class="dcts-v15-node-icon">${icon(o)}</div><div><div class="dcts-v15-node-title">${esc(nameOf(o))}</div><div class="dcts-v15-node-role">${esc(roleOf(o))}</div><div class="dcts-v15-node-meta"><span class="dcts-v15-status-dot ${statusClass(st)}"></span><span>${esc(st.replace(/_/g,' '))}</span>${q?`<span class="dcts-v15-node-qty">${esc(q)}</span>`:''}</div></div><button class="dcts-v15-expand" type="button" aria-label="Open semantic object scene">↗</button></article>`;}
function legend(){return `<div class="dcts-v15-legend"><span class="dcts-v15-key"><i class="dcts-v15-swatch"></i>Canonical / confirmed</span><span class="dcts-v15-key"><i class="dcts-v15-swatch assumption"></i>Assumption / proposal</span><span class="dcts-v15-key"><i class="dcts-v15-swatch management"></i>Management / OOB</span><span class="dcts-v15-key"><i class="dcts-v15-swatch intent"></i>Design intent</span></div>`;}
function note(view){const findingCount=(view?.finding_ids||view?.FINDING_IDS||[]).length;return `<div class="dcts-v15-topnote"><b>Topology-first projection.</b> Only current-view objects and declared relationships/intents are rendered. Missing ports, speed, A/B paths or links stay OPEN.${findingCount?` ${findingCount} finding(s) remain in the controlled view.`:''}</div>`;}

function t02Profile(view){
  const ids=new Set(view.object_ids||[]),P={};
  const set=(id,x,y)=>{if(ids.has(id))P[id]={x,y};};
  set('topobj_dc750ed177fb87984c3a',20,12);set('topobj_d22103a970df15ebc013',50,12);set('topobj_4a235cb934f5c5a46901',80,12);
  set('topobj_kayas_dc_network_fabric',50,34);
  set('topobj_kayas_service_iaas_40',13,66);set('topobj_kayas_service_managed_colo_80',36,66);
  set('topobj_kayas_colo_demarcation',60,60);set('topobj_kayas_service_colo_80',60,75);
  set('topobj_kayas_ai_network_fabric',85.5,60);set('topobj_kayas_ai_hd_zone',85.5,75);
  set('topobj_kayas_oob_plane_210',50,91);
  // Evidence-safe fallback: preserve normalized layout hints if a new T02 object is added later.
  (view.layout?.object_hints||[]).forEach(h=>{if(ids.has(h.object_id)&&!P[h.object_id])P[h.object_id]={x:8+Number(h.x||0)*84,y:7+Number(h.y||0)*86};});
  const Z=[zone('security','SECURITY / EDGE',3,3,94,18),zone('fabric','SHARED NETWORK FABRIC',25,24,72,23),zone('iaas','IAAS / CLOUD · 40',3,51,20,31),zone('managed','MANAGED COLOCATION · 80',26,51,20,31),zone('colo','COLOCATION · 80',49,51,22,31),zone('ai','AI / HIGH-DENSITY · 10',74,51,23,31),zone('oob','OOB / MANAGEMENT PLANE',3,85,94,12)];
  return{positions:P,zones:Z};
}
function t05Profile(view){
  const ids=new Set(view.object_ids||[]),P={};
  const set=(id,x,y)=>{if(ids.has(id))P[id]={x,y};};
  set('topobj_ca569b60f525d5fd277f',22,15);set('topobj_bbc53ea9c663404b7a82',50,15);set('topobj_60b6648480d5d86edc25',78,15);
  set('topobj_56b5cee0b4c39857a70a',50,42);
  set('topobj_f8b344bf31c75571769f',14,72);set('topobj_6c9587efb3d0b49bed8e',38,72);set('topobj_689f284af5e658a26b88',62,72);set('topobj_dc742080923da3053e85',86,72);
  const remaining=[...ids].filter(id=>!P[id]);remaining.forEach((id,i)=>P[id]={x:14+(i%4)*24,y:84+Math.floor(i/4)*10});
  const Z=[zone('management','MANAGEMENT / OPERATIONS CORE',3,3,94,24),zone('oob','OOB MANAGEMENT',3,30,94,22),zone('infrastructure','MANAGED INFRASTRUCTURE',3,55,94,39)];
  return{positions:P,zones:Z};
}

function edgeList(view,designOn){
  const ids=new Set(view.object_ids||[]),out=[];
  (view.relationship_ids||[]).forEach(id=>{const r=STATE.rels.get(id);if(r&&ids.has(fromId(r))&&ids.has(toId(r)))out.push({r,intent:false});});
  if(designOn)(view.presentation_intents||[]).forEach(r=>{if(ids.has(fromId(r))&&ids.has(toId(r)))out.push({r,intent:true});});
  return out;
}
function wireNodes(root){
  STATE.nodes.clear();$$('[data-v15-object]',root).forEach(n=>{
    const id=n.dataset.v15Object;STATE.nodes.set(id,n);
    n.addEventListener('mouseenter',()=>focus(id));n.addEventListener('mouseleave',clearFocus);
    n.addEventListener('click',e=>{if(e.target.closest('.dcts-v15-expand'))return;document.querySelector(`.node-card[data-object="${CSS.escape(id)}"]`)?.click();});
    n.addEventListener('dblclick',()=>openSemantic(id));
    n.querySelector('.dcts-v15-expand')?.addEventListener('click',e=>{e.stopPropagation();openSemantic(id);});
  });
}
function openSemantic(id){
  const under=document.querySelector(`.node-card[data-object="${CSS.escape(id)}"]`);under?.click();
  const b=under?.querySelector('.dcts-m14-openbtn');if(b)b.click();
}
function focus(id){
  const connected=new Set([id]);STATE.edges.forEach(e=>{if(e.from===id||e.to===id){e.path.classList.add('is-active');connected.add(e.from);connected.add(e.to);}else e.path.classList.add('is-muted');});
  STATE.nodes.forEach((n,nid)=>{if(connected.has(nid))n.classList.add('is-active');else n.classList.add('is-muted');});
}
function clearFocus(){STATE.edges.forEach(e=>e.path.classList.remove('is-active','is-muted'));STATE.nodes.forEach(n=>n.classList.remove('is-active','is-muted'));}
function anchor(a,b){const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect(),sr=a.closest('.dcts-v15-stage').getBoundingClientRect(),ac={x:ar.left-sr.left+ar.width/2,y:ar.top-sr.top+ar.height/2},bc={x:br.left-sr.left+br.width/2,y:br.top-sr.top+br.height/2},dx=bc.x-ac.x,dy=bc.y-ac.y;let sx=ac.x,sy=ac.y,tx=bc.x,ty=bc.y;if(Math.abs(dx)>Math.abs(dy)){sx+=Math.sign(dx)*ar.width/2;tx-=Math.sign(dx)*br.width/2;}else{sy+=Math.sign(dy)*ar.height/2;ty-=Math.sign(dy)*br.height/2;}return{sx,sy,tx,ty};}
function pathD(a,b){const {sx,sy,tx,ty}=anchor(a,b),dx=tx-sx,dy=ty-sy;if(Math.abs(dx)<36||Math.abs(dy)<36)return`M ${sx} ${sy} L ${tx} ${ty}`;if(Math.abs(dy)>=Math.abs(dx)){const my=sy+dy*.5;return`M ${sx} ${sy} L ${sx} ${my} L ${tx} ${my} L ${tx} ${ty}`;}const mx=sx+dx*.5;return`M ${sx} ${sy} L ${mx} ${sy} L ${mx} ${ty} L ${tx} ${ty}`;}
function drawEdges(root,view,designOn){
  STATE.edges=[];const svg=$('.dcts-v15-edge-svg',root);if(!svg)return;svg.innerHTML='';
  edgeList(view,designOn).forEach(({r,intent})=>{
    const f=fromId(r),t=toId(r),a=STATE.nodes.get(f),b=STATE.nodes.get(t);if(!a||!b)return;
    const p=document.createElementNS('http://www.w3.org/2000/svg','path');const sem=semantic(r,intent),st=intent?'intent':statusClass(relStatus(r));
    p.setAttribute('d',pathD(a,b));p.setAttribute('class',`dcts-v15-edge ${sem} ${st}${intent?' intent':''}`);p.dataset.from=f;p.dataset.to=t;
    const title=document.createElementNS('http://www.w3.org/2000/svg','title');title.textContent=`${typeOf(r).replace(/_/g,' ')} · ${relStatus(r)||'STATUS NOT ENCODED'}`;p.appendChild(title);svg.appendChild(p);STATE.edges.push({from:f,to:t,path:p,r});
  });
}

function render(){
  if(!STATE.loaded)return;const h=currentHash(),supported=h.mode==='PRESENTATION'&&(h.view==='T02'||h.view==='T05');
  document.body.classList.toggle('dcts-v15-projection-active',supported);if(!supported){STATE.activeView=null;return;}
  const view=STATE.views.get(h.view);if(!view)return;const p=ensureProjection();if(!p)return;STATE.activeView=h.view;
  const prof=h.view==='T02'?t02Profile(view):t05Profile(view),objects=(view.object_ids||[]).map(id=>STATE.objects.get(id)).filter(Boolean);
  const nodes=objects.map(o=>nodeHtml(o,prof.positions[oid(o)]||{x:50,y:50})).join('');
  p.innerHTML=`<div class="dcts-v15-board"><div class="dcts-v15-stage">${prof.zones.join('')}<svg class="dcts-v15-edge-svg"></svg>${nodes}${note(view)}${legend()}</div></div>`;
  wireNodes(p);requestAnimationFrame(()=>drawEdges(p,view,h.design));
  const ro=new ResizeObserver(()=>{if(STATE.activeView===h.view)requestAnimationFrame(()=>drawEdges(p,view,currentHash().design));});ro.observe(p);
  p._v15ResizeObserver?.disconnect?.();p._v15ResizeObserver=ro;
}
function syncSoon(){clearTimeout(syncSoon.t);syncSoon.t=setTimeout(render,80);}
async function boot(){let n=0;while(!$('.dcts-app')&&n++<120)await new Promise(r=>setTimeout(r,35));await load();render();window.addEventListener('hashchange',syncSoon);window.addEventListener('resize',syncSoon);document.addEventListener('click',e=>{if(e.target.closest('button'))setTimeout(syncSoon,90)},true);document.documentElement.dataset.dctsTopologyGrammar='v1a15';}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
