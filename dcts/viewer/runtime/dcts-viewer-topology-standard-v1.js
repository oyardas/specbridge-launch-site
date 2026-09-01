(function(){
'use strict';
const VERSION='1.0.0';
const BOOT=window.DCTS_VIEWER_BOOT||{};
const STATE={manifest:null,config:null,objects:new Map(),rels:new Map(),views:new Map(),findings:new Map(),loaded:false,projection:null,nodes:new Map(),edges:[],activeView:null,designOn:true,focusId:null};
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const norm=v=>String(v||'').trim().toUpperCase();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const base=()=>String(BOOT.packageBase||'').replace(/\/$/,'');
const oid=o=>o?.object_id||o?.TOPOLOGY_OBJECT_ID||o?.id||'';
const rid=r=>r?.relationship_id||r?.RELATIONSHIP_ID||r?.id||'';
const fromId=r=>r?.from_object_id||r?.FROM_OBJECT_ID||r?.source_object_id||r?.SOURCE_OBJECT_ID||'';
const toId=r=>r?.to_object_id||r?.TO_OBJECT_ID||r?.target_object_id||r?.TARGET_OBJECT_ID||'';
const nameOf=o=>o?.display_name||o?.DISPLAY_NAME||o?.name||o?.NAME||o?.title||o?.TITLE||o?.product_family||o?.PRODUCT_FAMILY||o?.functional_role||o?.FUNCTIONAL_ROLE||'Object';
const roleOf=o=>o?.functional_role||o?.FUNCTIONAL_ROLE||o?.role||o?.ROLE_ID||'UNMAPPED_ROLE';
const domainOf=o=>norm(o?.domain||o?.DOMAIN||'UNMAPPED');
const statusOf=o=>norm(o?.status||o?.STATUS||o?.information_status||o?.INFORMATION_STATUS||'');
const qtyOf=o=>{const q=o?.quantity??o?.QUANTITY??o?.represented_object_quantity??o?.REPRESENTED_OBJECT_QUANTITY??o?.instance_count??o?.INSTANCE_COUNT;return q==null?'':`× ${q}`;};
const typeOf=r=>norm(r?.relationship_type||r?.RELATIONSHIP_TYPE||r?.type||r?.TYPE||r?.relationship_type_hint||r?.RELATIONSHIP_TYPE_HINT||r?.label||r?.LABEL||'RELATIONSHIP');
const relStatus=r=>norm(r?.information_status||r?.INFORMATION_STATUS||r?.status||r?.STATUS||'CONFIRMED');
const arr=(v,k)=>v?.[k]||v?.[k.toUpperCase()]||[];
async function json(u){const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error(`${r.status} ${u}`);return r.json();}
function res(b,p){return String(p||'').startsWith('/')?p:`${b}/${p}`;}
function hashState(){const h=new URLSearchParams(location.hash.replace(/^#/,''));return{view:h.get('view')||'T00',mode:norm(h.get('mode')||STATE.config?.default_mode||'PRESENTATION'),design:h.get('design')!=='0'};}
function statusClass(s){s=norm(s);if(s==='CUSTOMER INPUT'||s==='CUSTOMER_INPUT')return'customer-input';if(s.includes('OPEN'))return'open-confirmation-required';if(s.includes('WORKING'))return'working-assumption';if(s.includes('VENDOR'))return'vendor-proposal';if(s.includes('SUPERSEDED'))return'superseded';return'confirmed';}
function accent(o){const d=domainOf(o);if(['SECURITY'].includes(d))return'#c64f60';if(['NETWORK','EDGE','CARRIER','EXTERNAL','OOB'].includes(d))return'#2d78b7';if(['COMPUTE','HCI'].includes(d))return'#4d8b69';if(['STORAGE'].includes(d))return'#368897';if(['BACKUP','DR'].includes(d))return'#4d8b69';if(['SERVICE','TENANT','CLOUD'].includes(d))return'#9a7427';if(['MANAGEMENT','MONITORING','OPERATIONS','DCIM'].includes(d))return'#6b58a4';return'#5d7789';}
function icon(o){const lib=window.DCTS_ICON_LIBRARY;if(lib?.svg)return lib.svg({domain:domainOf(o),functional_role:roleOf(o),object_type:o?.object_type||o?.OBJECT_TYPE,display_name:nameOf(o),model:o?.model||o?.MODEL});return'<span aria-hidden="true" style="font-size:20px">◇</span>';}
function semantic(r,isIntent=false){if(isIntent)return'intent';const t=typeOf(r),l=norm(r?.layer||r?.LAYER);if(l==='OOB'||l==='MANAGEMENT'||t.includes('MANAGED')||t.includes('MONITOR')||t.includes('CONTROL'))return'management';if(l==='SECURITY'||t.includes('PROTECTED')||t.includes('SECURITY')||t.includes('FIREWALL'))return'security';if(l==='BACKUP'||l==='DR'||t.includes('BACKUP')||t.includes('REPLICAT')||t.includes('RECOVER'))return'backup';if(l==='SERVICE'||t.includes('PROVIDES_SERVICE')||t.includes('HOSTS')||t.includes('SERVICE'))return'service';return'data';}
function projectName(){return STATE.config?.project_name||STATE.config?.metadata?.project_name||STATE.manifest?.project_id||'DCTS Project';}

const TEMPLATES={
 T00:[
  ['perimeter','EXTERNAL / EDGE / SECURITY','security',['EXTERNAL','CARRIER','EDGE','SECURITY']],
  ['network','NETWORK / FABRIC','network',['NETWORK']],
  ['platform','COMPUTE / HCI / STORAGE / CLOUD','compute',['COMPUTE','HCI','STORAGE','CLOUD']],
  ['services','SERVICE / TENANT / DATA PROTECTION','service',['SERVICE','TENANT','BACKUP','DR']],
  ['operations','MANAGEMENT / OOB / OPERATIONS','management',['MANAGEMENT','OOB','MONITORING','DCIM','OPERATIONS']]
 ],
 T01:[
  ['edge','EXTERNAL / EDGE / SECURITY','security',['EXTERNAL','CARRIER','EDGE','SECURITY']],
  ['infra','DIGITAL INFRASTRUCTURE','network',['NETWORK','COMPUTE','HCI','STORAGE']],
  ['service','CLOUD / SERVICE / TENANT','service',['CLOUD','SERVICE','TENANT']],
  ['ops','OPERATIONS / PROTECTION','management',['MANAGEMENT','OOB','MONITORING','DCIM','OPERATIONS','BACKUP','DR']]
 ],
 T02:[
  ['edge','SECURITY / EDGE','security',['EXTERNAL','CARRIER','EDGE','SECURITY']],
  ['fabric','NETWORK / FABRIC','network',['NETWORK']],
  ['workload','SERVICE / ACCESS / WORKLOAD','service',['SERVICE','TENANT','CLOUD','COMPUTE','HCI','STORAGE']],
  ['mgmt','OOB / MANAGEMENT PLANE','management',['MANAGEMENT','OOB','MONITORING','DCIM','OPERATIONS','BACKUP','DR']]
 ],
 T03:[
  ['external','EXTERNAL / CARRIER / EDGE','neutral',['EXTERNAL','CARRIER','EDGE']],
  ['network','PHYSICAL NETWORK / SECURITY','network',['NETWORK','SECURITY']],
  ['platform','COMPUTE / HCI / STORAGE','compute',['COMPUTE','HCI','STORAGE']],
  ['mgmt','OOB / MANAGEMENT','management',['OOB','MANAGEMENT','MONITORING','DCIM','OPERATIONS','BACKUP','DR','CLOUD','SERVICE','TENANT']]
 ],
 T04:[
  ['compute','COMPUTE / HCI','compute',['COMPUTE','HCI']],
  ['storage','STORAGE','storage',['STORAGE']],
  ['protection','BACKUP / DR','backup',['BACKUP','DR']],
  ['platform','CLOUD / SERVICE / MANAGEMENT','management',['CLOUD','SERVICE','TENANT','MANAGEMENT','OOB','MONITORING','DCIM','OPERATIONS','NETWORK','SECURITY','EDGE','EXTERNAL','CARRIER']]
 ],
 T05:[
  ['core','MANAGEMENT / OPERATIONS CORE','management',['MANAGEMENT','MONITORING','DCIM','OPERATIONS','CLOUD']],
  ['oob','OOB MANAGEMENT','management',['OOB']],
  ['managed','MANAGED INFRASTRUCTURE','network',['NETWORK','SECURITY','COMPUTE','HCI','STORAGE','BACKUP','DR','SERVICE','TENANT','EDGE','EXTERNAL','CARRIER']]
 ],
 T06:[
  ['service','SERVICE / TENANT / CLOUD','service',['SERVICE','TENANT','CLOUD']],
  ['platform','COMPUTE / HCI / STORAGE','compute',['COMPUTE','HCI','STORAGE']],
  ['network','NETWORK / SECURITY','network',['NETWORK','SECURITY','EDGE','EXTERNAL','CARRIER']],
  ['ops','PROTECTION / MANAGEMENT','management',['BACKUP','DR','MANAGEMENT','OOB','MONITORING','DCIM','OPERATIONS']]
 ],
 T07:[
  ['perimeter','EXTERNAL / PERIMETER','neutral',['EXTERNAL','CARRIER','EDGE']],
  ['security','SECURITY CONTROLS / BOUNDARIES','security',['SECURITY']],
  ['protected','PROTECTED NETWORK / SERVICES','network',['NETWORK','COMPUTE','HCI','STORAGE','CLOUD','SERVICE','TENANT']],
  ['ops','SECURITY OPERATIONS / MANAGEMENT','management',['MANAGEMENT','OOB','MONITORING','DCIM','OPERATIONS','BACKUP','DR']]
 ],
 T08:[
  ['source','PROTECTED WORKLOADS / DATA','compute',['COMPUTE','HCI','STORAGE','SERVICE','TENANT','CLOUD','NETWORK','SECURITY']],
  ['backup','BACKUP / REPOSITORY','backup',['BACKUP']],
  ['dr','DR / RECOVERY','backup',['DR']],
  ['ops','PROTECTION OPERATIONS / MANAGEMENT','management',['MANAGEMENT','OOB','MONITORING','DCIM','OPERATIONS','EDGE','EXTERNAL','CARRIER']]
 ],
 T09:[
  ['compute','AI / GPU COMPUTE','compute',['COMPUTE','HCI']],
  ['fabric','AI / HIGH-SPEED FABRIC','network',['NETWORK','EDGE','CARRIER','EXTERNAL','SECURITY']],
  ['storage','AI / HIGH-THROUGHPUT STORAGE','storage',['STORAGE']],
  ['ops','AI OPERATIONS / MANAGEMENT / PROTECTION','management',['MANAGEMENT','OOB','MONITORING','DCIM','OPERATIONS','BACKUP','DR','CLOUD','SERVICE','TENANT']]
 ],
 T10:[
  ['sites','SITE / SERVICE CONTEXT','service',['EXTERNAL','CARRIER','EDGE','SERVICE','TENANT','CLOUD']],
  ['network','INTER-SITE NETWORK / SECURITY','network',['NETWORK','SECURITY']],
  ['data','COMPUTE / STORAGE / DATA PROTECTION','compute',['COMPUTE','HCI','STORAGE','BACKUP','DR']],
  ['ops','OPERATIONS / MANAGEMENT','management',['MANAGEMENT','OOB','MONITORING','DCIM','OPERATIONS']]
 ]
};
function template(viewId){return TEMPLATES[viewId]||TEMPLATES.T00;}
function laneModels(view){
  const defs=template(view.view_id||view.VIEW_ID),ids=arr(view,'object_ids'),hints=new Map(arr(view?.layout||{},'object_hints').map(h=>[h.object_id||h.OBJECT_ID,h]));
  const lanes=defs.map(d=>({id:d[0],label:d[1],tone:d[2],domains:new Set(d[3]),objects:[]}));
  const other={id:'other',label:'OTHER / CONTEXT',tone:'neutral',domains:new Set(),objects:[]};
  ids.map(id=>STATE.objects.get(id)).filter(Boolean).forEach(o=>{const d=domainOf(o),ln=lanes.find(x=>x.domains.has(d))||other;ln.objects.push(o);});
  const sortFn=(a,b)=>{const ha=hints.get(oid(a)),hb=hints.get(oid(b));if(ha&&hb){const ay=Number(ha.y??ha.Y??0),by=Number(hb.y??hb.Y??0);if(Math.abs(ay-by)>.02)return ay-by;return Number(ha.x??ha.X??0)-Number(hb.x??hb.X??0);}if(ha&&!hb)return-1;if(!ha&&hb)return 1;return `${domainOf(a)}|${roleOf(a)}|${nameOf(a)}`.localeCompare(`${domainOf(b)}|${roleOf(b)}|${nameOf(b)}`);};
  lanes.forEach(l=>l.objects.sort(sortFn));other.objects.sort(sortFn);if(other.objects.length)lanes.push(other);return lanes.filter(l=>l.objects.length);
}

async function load(){const b=base();if(!b)return;try{const m=await json(`${b}/package-manifest.json`);STATE.manifest=m;const r=m.resources||{};const jobs=[];let od,rd,vd,cd,fd;
  if(r.objects?.path)jobs.push(json(res(b,r.objects.path)).then(x=>od=x));
  if(r.relationships?.path)jobs.push(json(res(b,r.relationships.path)).then(x=>rd=x));
  if(r.views?.path)jobs.push(json(res(b,r.views.path)).then(x=>vd=x));
  if(r.project_config?.path)jobs.push(json(res(b,r.project_config.path)).then(x=>cd=x));
  if(r.findings?.path)jobs.push(json(res(b,r.findings.path)).then(x=>fd=x));
  await Promise.all(jobs);STATE.config=cd||{};(od?.objects||od?.NODES||[]).forEach(o=>STATE.objects.set(oid(o),o));(rd?.relationships||rd?.RELATIONSHIPS||[]).forEach(r=>STATE.rels.set(rid(r),r));(vd?.views||vd?.VIEWS||[]).forEach(v=>STATE.views.set(v.view_id||v.VIEW_ID,v));(fd?.findings||fd?.FINDINGS||[]).forEach(f=>STATE.findings.set(f.finding_id||f.FINDING_ID||f.id,f));STATE.loaded=true;document.documentElement.dataset.dctsTopologyStandard=VERSION;
 }catch(e){console.warn('[DCTS topology standard] package load failed',e);}}

function ensureProjection(){const vp=$('.viewport');if(!vp)return null;let p=$('#dctsTopologyStandard');if(!p){p=document.createElement('div');p.id='dctsTopologyStandard';p.className='dcts-std-projection';vp.appendChild(p);}STATE.projection=p;return p;}
function nodeHtml(o,lane){const st=statusOf(o)||'STATUS NOT ENCODED',q=qtyOf(o),a=accent(o);return `<article class="dcts-std-node" data-std-object="${esc(oid(o))}" data-std-lane="${esc(lane)}" tabindex="0" style="--node-accent:${a}"><div class="dcts-std-node-icon">${icon(o)}</div><div><div class="dcts-std-node-title">${esc(nameOf(o))}</div><div class="dcts-std-node-role">${esc(roleOf(o))}</div><div class="dcts-std-node-meta"><span class="dcts-std-status-dot ${statusClass(st)}"></span><span class="dcts-std-node-status">${esc(st.replace(/_/g,' '))}</span>${q?`<span class="dcts-std-node-qty">${esc(q)}</span>`:''}</div></div><button type="button" class="dcts-std-expand" title="Open object focus" aria-label="Open object focus">↗</button></article>`;}
function legend(){return `<div class="dcts-std-legend"><span class="dcts-std-key"><i class="dcts-std-swatch"></i>Canonical / confirmed</span><span class="dcts-std-key"><i class="dcts-std-swatch assumption"></i>Assumption / proposal</span><span class="dcts-std-key"><i class="dcts-std-swatch management"></i>Management / OOB</span><span class="dcts-std-key"><i class="dcts-std-swatch intent"></i>Design intent</span></div>`;}
function info(view){const fc=arr(view,'finding_ids').length;return `<button type="button" class="dcts-std-info" aria-label="Topology evidence policy">i</button><div class="dcts-std-info-pop"><b>DCTS topology visual standard v1.0</b><br>Only current-view canonical objects and declared relationships are asserted. Layout and zones are presentation metadata only. Missing connections, ports, speeds, A/B paths, VLAN/VRF/VNI, optics or management/storage paths remain OPEN-CONFIRMATION REQUIRED.${fc?`<br><br>${fc} controlled finding(s) remain associated with this view.`:''}</div>`;}
function focusShell(){return `<div class="dcts-std-focus"><div class="dcts-std-focusbar"><span class="focus-project"></span><span>/</span><strong class="focus-title"></strong><span class="grow"></span><button type="button" data-focus-action="back">Back</button><button type="button" data-focus-action="close">Overview</button></div><div class="dcts-std-focusstage"><div class="dcts-std-focuscanvas"><svg class="dcts-std-edge-svg"></svg><div class="dcts-std-focus-content"></div></div></div></div>`;}
function buildProjection(view){const p=ensureProjection();if(!p)return;const lanes=laneModels(view),nodes=lanes.flatMap(l=>l.objects.map(o=>nodeHtml(o,l.id))).join('');const zones=lanes.map(l=>`<section class="dcts-std-zone" data-std-zone="${esc(l.id)}" data-tone="${esc(l.tone)}"><span class="dcts-std-zone-label">${esc(l.label)}</span></section>`).join('');p.innerHTML=`<div class="dcts-std-board"><div class="dcts-std-stage">${zones}<svg class="dcts-std-edge-svg"></svg>${nodes}${legend()}${info(view)}${focusShell()}</div></div>`;wire(p);requestAnimationFrame(()=>layoutAndDraw(view,lanes));}

function layoutAndDraw(view,lanes){const stage=$('.dcts-std-stage',STATE.projection);if(!stage)return;const W=Math.max(stage.clientWidth,900),maxPerRow=W>=1320?6:W>=1080?5:4;let y=18;STATE.nodes.clear();$$('[data-std-object]',stage).forEach(n=>STATE.nodes.set(n.dataset.stdObject,n));
  lanes.forEach(l=>{const z=$(`[data-std-zone="${CSS.escape(l.id)}"]`,stage),count=l.objects.length,rows=Math.max(1,Math.ceil(count/maxPerRow)),zh=50+rows*82+10;z.style.left='20px';z.style.top=`${y}px`;z.style.width=`${W-40}px`;z.style.height=`${zh}px`;l.objects.forEach((o,i)=>{const n=STATE.nodes.get(oid(o)),row=Math.floor(i/maxPerRow),start=row*maxPerRow,items=Math.min(maxPerRow,count-start),col=i-start,usable=W-220,x=110+(col+.5)*(usable/items),ny=y+58+row*82;n.style.left=`${x}px`;n.style.top=`${ny}px`;});y+=zh+14;});
  stage.style.height=`${Math.max(620,y+34)}px`;const svg=$(':scope > .dcts-std-edge-svg',stage);if(svg){svg.setAttribute('width',W);svg.setAttribute('height',Math.max(620,y+34));svg.style.height=`${Math.max(620,y+34)}px`;}
  drawEdges(stage,view,STATE.designOn);}
function edgeList(view,designOn){const ids=new Set(arr(view,'object_ids')),out=[];arr(view,'relationship_ids').forEach(id=>{const r=STATE.rels.get(id);if(!r||relStatus(r).includes('SUPERSEDED'))return;const f=fromId(r),t=toId(r);if(ids.has(f)&&ids.has(t))out.push({r,intent:false});});if(designOn)arr(view,'presentation_intents').forEach(r=>{const f=fromId(r),t=toId(r);if(f&&t&&ids.has(f)&&ids.has(t))out.push({r,intent:true});});return out;}
function anchor(a,b){const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect(),sr=a.closest('.dcts-std-stage,.dcts-std-focuscanvas').getBoundingClientRect(),ac={x:ar.left-sr.left+ar.width/2,y:ar.top-sr.top+ar.height/2},bc={x:br.left-sr.left+br.width/2,y:br.top-sr.top+br.height/2},dx=bc.x-ac.x,dy=bc.y-ac.y;let sx=ac.x,sy=ac.y,tx=bc.x,ty=bc.y;if(Math.abs(dx)>Math.abs(dy)){sx+=Math.sign(dx)*ar.width/2;tx-=Math.sign(dx)*br.width/2;}else{sy+=Math.sign(dy)*ar.height/2;ty-=Math.sign(dy)*br.height/2;}return{sx,sy,tx,ty};}
function pathD(a,b){const {sx,sy,tx,ty}=anchor(a,b),dx=tx-sx,dy=ty-sy;if(Math.abs(dx)<30||Math.abs(dy)<30)return`M ${sx} ${sy} L ${tx} ${ty}`;if(Math.abs(dy)>=Math.abs(dx)){const my=sy+dy*.5;return`M ${sx} ${sy} L ${sx} ${my} L ${tx} ${my} L ${tx} ${ty}`;}const mx=sx+dx*.5;return`M ${sx} ${sy} L ${mx} ${sy} L ${mx} ${ty} L ${tx} ${ty}`;}
function drawEdges(stage,view,designOn){STATE.edges=[];const svg=$(':scope > .dcts-std-edge-svg',stage);if(!svg)return;svg.innerHTML='';edgeList(view,designOn).forEach(({r,intent})=>{const f=fromId(r),t=toId(r),a=STATE.nodes.get(f),b=STATE.nodes.get(t);if(!a||!b)return;const p=document.createElementNS('http://www.w3.org/2000/svg','path'),sem=semantic(r,intent),st=intent?'intent':statusClass(relStatus(r));p.setAttribute('d',pathD(a,b));p.setAttribute('class',`dcts-std-edge ${sem} ${st}${intent?' intent':''}`);p.dataset.from=f;p.dataset.to=t;const tt=document.createElementNS('http://www.w3.org/2000/svg','title');tt.textContent=intent?`${r.label||r.LABEL||typeOf(r)} · ${relStatus(r)||'STATUS NOT ENCODED'} · NOT CANONICAL`:`${typeOf(r).replace(/_/g,' ')} · ${relStatus(r)||'STATUS NOT ENCODED'}`;p.appendChild(tt);svg.appendChild(p);STATE.edges.push({from:f,to:t,path:p,r,intent});});}

function selectUnderlying(id){const u=document.querySelector(`.node-card[data-object="${CSS.escape(id)}"]`);if(u){u.click();return true}return false;}
function focusConnected(id){const connected=new Set([id]);STATE.edges.forEach(e=>{if(e.from===id||e.to===id){e.path.classList.add('is-active');connected.add(e.from);connected.add(e.to)}else e.path.classList.add('is-muted')});STATE.nodes.forEach((n,nid)=>{if(connected.has(nid))n.classList.add('is-active');else n.classList.add('is-muted')});}
function clearConnected(){STATE.edges.forEach(e=>e.path.classList.remove('is-active','is-muted'));STATE.nodes.forEach(n=>n.classList.remove('is-active','is-muted'));}
function wire(root){$$('[data-std-object]',root).forEach(n=>{const id=n.dataset.stdObject;n.addEventListener('mouseenter',()=>focusConnected(id));n.addEventListener('mouseleave',clearConnected);n.addEventListener('focus',()=>focusConnected(id));n.addEventListener('blur',clearConnected);n.addEventListener('click',e=>{if(e.target.closest('.dcts-std-expand'))return;selectUnderlying(id)});n.addEventListener('dblclick',e=>{e.preventDefault();openFocus(id)});n.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();selectUnderlying(id)}if(e.key===' '){e.preventDefault();openFocus(id)}});n.querySelector('.dcts-std-expand')?.addEventListener('click',e=>{e.stopPropagation();openFocus(id)});});
  $('.dcts-std-info',root)?.addEventListener('click',e=>{e.stopPropagation();$('.dcts-std-info-pop',root)?.classList.toggle('show')});root.addEventListener('click',e=>{if(!e.target.closest('.dcts-std-info')&&!e.target.closest('.dcts-std-info-pop'))$('.dcts-std-info-pop',root)?.classList.remove('show')});$$('[data-focus-action]',root).forEach(b=>b.addEventListener('click',()=>closeFocus()));}

function openFocus(id){const view=STATE.views.get(STATE.activeView),o=STATE.objects.get(id),focus=$('.dcts-std-focus',STATE.projection);if(!view||!o||!focus)return;STATE.focusId=id;selectUnderlying(id);focus.classList.add('show');$('.focus-project',focus).textContent=projectName();$('.focus-title',focus).textContent=`${view.view_id||view.VIEW_ID} · ${nameOf(o)}`;const content=$('.dcts-std-focus-content',focus),canvas=$('.dcts-std-focuscanvas',focus),svg=$('.dcts-std-edge-svg',canvas),canonical=edgeList(view,false),related=canonical.filter(x=>fromId(x.r)===id||toId(x.r)===id),design=STATE.designOn?edgeList(view,true).filter(x=>x.intent&&(fromId(x.r)===id||toId(x.r)===id)):[];
  const inMap=new Map(),outMap=new Map();related.forEach(x=>{const f=fromId(x.r),t=toId(x.r);if(t===id&&STATE.objects.has(f))inMap.set(f,x);if(f===id&&STATE.objects.has(t))outMap.set(t,x)});design.forEach(x=>{const f=fromId(x.r),t=toId(x.r);if(t===id&&STATE.objects.has(f)&&!inMap.has(f))inMap.set(f,x);if(f===id&&STATE.objects.has(t)&&!outMap.has(t))outMap.set(t,x)});
  const center=`<div class="dcts-std-focus-center" data-focus-center="${esc(id)}" style="--node-accent:${accent(o)}"><div class="ico">${icon(o)}</div><b>${esc(nameOf(o))}</b><small>${esc(roleOf(o))}<br>${esc(domainOf(o))} · ${esc(statusOf(o)||'STATUS NOT ENCODED')}</small></div>`;
  const neighbor=(obj,side,i)=>`<article class="dcts-std-node dcts-std-focus-neighbor" data-focus-object="${esc(oid(obj))}" data-focus-side="${side}" data-focus-index="${i}" style="--node-accent:${accent(obj)}"><div class="dcts-std-node-icon">${icon(obj)}</div><div><div class="dcts-std-node-title">${esc(nameOf(obj))}</div><div class="dcts-std-node-role">${esc(roleOf(obj))}</div><div class="dcts-std-node-meta"><span class="dcts-std-status-dot ${statusClass(statusOf(obj))}"></span><span class="dcts-std-node-status">${esc(statusOf(obj)||'STATUS NOT ENCODED')}</span></div></div></article>`;
  const incoming=[...inMap.keys()].map(x=>STATE.objects.get(x)),outgoing=[...outMap.keys()].map(x=>STATE.objects.get(x));content.innerHTML=center+incoming.map((x,i)=>neighbor(x,'in',i)).join('')+outgoing.map((x,i)=>neighbor(x,'out',i)).join('')+`<div class="dcts-std-focus-note">${related.length} canonical current-view relationship(s) touch this object.${design.length?` ${design.length} presentation intent(s) are additionally visible and remain NOT CANONICAL.`:''} No missing path is invented for visual completeness.</div>`;
  const W=Math.max(canvas.clientWidth,900),H=Math.max(canvas.clientHeight,560),place=(els,side)=>{const n=els.length;if(!n)return;els.forEach((el,i)=>{const rows=Math.ceil(n/4),row=Math.floor(i/4),items=Math.min(4,n-row*4),col=i-row*4;el.style.top=`${Math.max(95,H/2-(rows-1)*74/2+row*86)}px`;if(side==='in')el.style.left=`${75+(col+.5)*(W*.31/items)}px`;else el.style.left=`${W*.64+(col+.5)*(W*.31/items)}px`;});};place($$('[data-focus-side="in"]',focus),'in');place($$('[data-focus-side="out"]',focus),'out');$$('[data-focus-object]',focus).forEach(n=>n.addEventListener('click',()=>openFocus(n.dataset.focusObject)));
  svg.innerHTML='';const centerEl=$('[data-focus-center]',focus),draw=(map,side)=>map.forEach((x,nid)=>{const n=$(`[data-focus-object="${CSS.escape(nid)}"]`,focus);if(!n)return;const p=document.createElementNS('http://www.w3.org/2000/svg','path'),isIntent=x.intent,sem=semantic(x.r,isIntent),st=isIntent?'intent':statusClass(relStatus(x.r));p.setAttribute('class',`dcts-std-edge ${sem} ${st}${isIntent?' intent':''}`);p.setAttribute('d',side==='in'?pathD(n,centerEl):pathD(centerEl,n));const tt=document.createElementNS('http://www.w3.org/2000/svg','title');tt.textContent=isIntent?`${x.r.label||typeOf(x.r)} · NOT CANONICAL`:typeOf(x.r).replace(/_/g,' ');p.appendChild(tt);svg.appendChild(p)});draw(inMap,'in');draw(outMap,'out');}
function closeFocus(){STATE.focusId=null;$('.dcts-std-focus',STATE.projection)?.classList.remove('show');}

function render(){if(!STATE.loaded)return;const h=hashState(),view=STATE.views.get(h.view),enabled=view&&(view.enabled!==false)&&(view.ENABLED!==false),supported=h.mode==='PRESENTATION'&&enabled;STATE.designOn=h.design;document.body.classList.toggle('dcts-topology-standard-active',!!supported);document.body.dataset.dctsStandardView=supported?h.view:'';if(!supported){STATE.activeView=null;closeFocus();return;}STATE.activeView=h.view;buildProjection(view);}
async function boot(){let n=0;while(!$('.dcts-app')&&n++<160)await new Promise(r=>setTimeout(r,40));await load();render();let queued=false;const root=$('.dcts-app')||document.body;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;if(!STATE.projection||!document.body.classList.contains('dcts-topology-standard-active'))render();});}).observe(root,{subtree:true,childList:true});window.addEventListener('hashchange',()=>{closeFocus();setTimeout(render,30)});window.addEventListener('resize',()=>{if(STATE.activeView){const v=STATE.views.get(STATE.activeView),lanes=laneModels(v);requestAnimationFrame(()=>layoutAndDraw(v,lanes));}});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&STATE.focusId){e.preventDefault();closeFocus();}});}
window.DCTS_TOPOLOGY_STANDARD={version:VERSION,render:()=>render(),openObject:id=>openFocus(id),closeObject:()=>closeFocus(),state:STATE};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
