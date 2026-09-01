(function(){
'use strict';

const BOOT=window.DCTS_VIEWER_BOOT||{};
const S={
  manifest:null,
  objects:new Map(),
  relationships:new Map(),
  views:new Map(),
  filter:'all',
  raf:0,
  syntheticResize:false
};
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const base=()=>String(BOOT.packageBase||'').replace(/\/$/,'');
const resourceUrl=(b,p)=>/^https?:/i.test(p)?p:(String(p||'').startsWith('/')?p:`${b}/${p}`);
const hs=()=>{const p=new URLSearchParams(location.hash.replace(/^#/,''));return{
  view:p.get('view')||'T00',
  object:p.get('object')||null,
  mode:p.get('mode')||'PRESENTATION',
  lang:p.get('lang')||'en',
  design:p.get('design')!=='0'
};};
const tr=()=>hs().lang==='tr';
async function getJson(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`${r.status} ${url}`);return r.json();}

async function loadMetadata(){
  const b=base(); if(!b)return;
  try{
    S.manifest=await getJson(`${b}/package-manifest.json`);
    const rr=S.manifest.resources||{};
    const [objDoc,relDoc,viewDoc]=await Promise.all([
      rr.objects?.path?getJson(resourceUrl(b,rr.objects.path)):Promise.resolve({objects:[]}),
      rr.relationships?.path?getJson(resourceUrl(b,rr.relationships.path)):Promise.resolve({relationships:[]}),
      rr.views?.path?getJson(resourceUrl(b,rr.views.path)):Promise.resolve({views:[]})
    ]);
    (objDoc.objects||[]).forEach(o=>S.objects.set(o.object_id,o));
    (relDoc.relationships||[]).forEach(r=>S.relationships.set(r.relationship_id,r));
    (viewDoc.views||[]).forEach(v=>S.views.set(v.view_id,v));
  }catch(err){console.warn('[DCTS engineering] metadata load failed',err);}
}

function roleLabel(o){
  const r=String(o?.functional_role||'').toUpperCase();
  if(r.includes('BORDER_LEAF'))return 'BORDER LEAF';
  if(r.includes('STORAGE_SWITCH'))return 'STORAGE SW';
  if(r.includes('OOB_SWITCH'))return 'OOB';
  if(r.includes('SPINE'))return 'SPINE';
  if(r.includes('LEAF'))return 'LEAF';
  if(r.includes('FIREWALL'))return 'FIREWALL';
  if(r.includes('.ADC'))return 'ADC';
  if(r.includes('ROUTER'))return 'ROUTER';
  if(r.includes('ACCESS'))return 'ACCESS';
  if(r.includes('INTERCONNECT'))return 'INTERCONNECT';
  if(r.includes('CONTROLLER'))return 'CONTROLLER';
  if(r.includes('ANALYTICS'))return 'ANALYTICS';
  const parts=r.split('.').filter(Boolean);
  return (parts[parts.length-1]||o?.object_type||o?.domain||'OBJECT').replaceAll('_',' ').slice(0,18);
}
function laneFor(o){
  const d=String(o?.domain||'').toUpperCase(),r=String(o?.functional_role||'').toUpperCase();
  if(['MANAGEMENT','OOB','MONITORING','DCIM','OPERATIONS'].includes(d))return 'mgmt';
  if(d==='SECURITY')return 'security';
  if(['EXTERNAL','CARRIER','EDGE'].includes(d)||r.includes('ROUTER')||r.includes('BORDER_LEAF')||r.includes('INTERCONNECT'))return 'edge';
  if(r.includes('SPINE')||r.includes('.CORE')||r.endsWith('CORE'))return 'fabric';
  if(r.includes('LEAF')||r.includes('ACCESS')||r.includes('STORAGE_SWITCH'))return 'access';
  if(['COMPUTE','HCI','STORAGE','CLOUD','BACKUP','DR','SERVICE','TENANT'].includes(d))return 'workload';
  return 'other';
}
const laneTitle=k=>({
  security:tr()?'GÜVENLİK / SERVİSLER':'SECURITY / SERVICES',
  edge:tr()?'EDGE / BORDER / INTERCONNECT':'EDGE / BORDER / INTERCONNECT',
  fabric:tr()?'SPINE / FABRIC CORE':'SPINE / FABRIC CORE',
  access:tr()?'LEAF / ACCESS':'LEAF / ACCESS',
  workload:tr()?'COMPUTE / STORAGE / SERVİSLER':'COMPUTE / STORAGE / SERVICES',
  mgmt:tr()?'YÖNETİM / OOB':'MANAGEMENT / OOB',
  other:tr()?'DİĞER KAPSAM':'OTHER SCOPE'
})[k]||k.toUpperCase();

function cardRect(c){return{x:parseFloat(c.style.left)||c.offsetLeft||0,y:parseFloat(c.style.top)||c.offsetTop||0,w:c.offsetWidth||205,h:c.offsetHeight||92};}
function updateDomainBoxes(){
  $$('.domain-box').forEach(box=>{
    const domain=box.querySelector('span')?.textContent?.trim();
    const nodes=$$('.node-card').filter(c=>String(S.objects.get(c.dataset.object)?.domain||'')===domain);
    if(!nodes.length)return;
    const rs=nodes.map(cardRect);
    const minX=Math.min(...rs.map(r=>r.x)),minY=Math.min(...rs.map(r=>r.y)),maxX=Math.max(...rs.map(r=>r.x+r.w)),maxY=Math.max(...rs.map(r=>r.y+r.h));
    box.style.left=(minX-12)+'px';box.style.top=(minY-25)+'px';box.style.width=(maxX-minX+24)+'px';box.style.height=(maxY-minY+38)+'px';
  });
}
function clearLanes(){ $$('.engineering-lane').forEach(n=>n.remove()); }
function addLane(scene,key,y,h=106){
  const n=document.createElement('div');n.className=`engineering-lane lane-${key}`;n.style.top=(y-25)+'px';n.style.height=h+'px';
  n.innerHTML=`<span>${esc(laneTitle(key))}</span>`;scene.prepend(n);
}
function distribute(list,y,W=1180){
  if(!list.length)return;
  const cardW=205,max=5,gap=24;
  list.forEach((c,i)=>{
    const row=Math.floor(i/max),col=i%max,countThis=Math.min(max,list.length-row*max);
    const rowTotal=countThis*cardW+(countThis-1)*gap,rowStart=Math.max(26,Math.round((W-rowTotal)/2));
    c.style.left=(rowStart+col*(cardW+gap))+'px';
    c.style.top=(y+row*98)+'px';
    c.dataset.engPositioned='1';
  });
}
function applyNetworkEngineeringLayout(){
  const state=hs(),v=S.views.get(state.view),scene=$('#scene');
  if(!scene||state.view!=='T02'||state.mode!=='ENGINEERING'||!v)return false;
  if(String(v.layout?.strategy||'AUTO').toUpperCase()!=='AUTO')return false;
  const cards=$$('.node-card');
  if(!cards.length||cards.every(c=>c.dataset.engPositioned==='1'))return false;
  clearLanes();
  const buckets={security:[],edge:[],fabric:[],access:[],workload:[],mgmt:[],other:[]};
  cards.forEach(c=>{const o=S.objects.get(c.dataset.object);(buckets[laneFor(o)]||buckets.other).push(c);});
  Object.values(buckets).forEach(list=>list.sort((a,b)=>{
    const oa=S.objects.get(a.dataset.object),ob=S.objects.get(b.dataset.object);
    return roleLabel(oa).localeCompare(roleLabel(ob))||String(oa?.display_name||'').localeCompare(String(ob?.display_name||''));
  }));
  const order=['security','edge','fabric','access','workload','mgmt','other'].filter(k=>buckets[k].length);
  let y=44;
  order.forEach(k=>{
    const rows=Math.ceil(buckets[k].length/5),h=92+(rows-1)*98;
    addLane(scene,k,y,h+30);distribute(buckets[k],y);
    y+=h+34;
  });
  scene.style.height=Math.max(780,y+20)+'px';
  updateDomainBoxes();
  setTimeout(()=>{
    S.syntheticResize=true;
    window.dispatchEvent(new Event('resize'));
    setTimeout(()=>{S.syntheticResize=false;},220);
  },20);
  return true;
}

function decorateNodes(){
  const state=hs();
  const engineering=state.mode==='ENGINEERING'&&['T02','T03','T05'].includes(state.view);
  $$('.node-card').forEach(c=>{
    const o=S.objects.get(c.dataset.object);if(!o)return;
    c.classList.toggle('engineering-node',engineering);
    let role=c.querySelector('.eng-role-badge');
    if(engineering){
      if(!role){role=document.createElement('span');role.className='eng-role-badge';c.appendChild(role);}
      role.textContent=roleLabel(o);
      let qty=c.querySelector('.eng-qty-badge');
      if(Number(o.quantity)>1){
        if(!qty){qty=document.createElement('span');qty.className='eng-qty-badge';c.appendChild(qty);}
        qty.textContent=`QTY ${o.quantity}`;
      }else qty?.remove();
    }else{
      role?.remove();c.querySelector('.eng-qty-badge')?.remove();
    }
  });
}

function currentView(){return S.views.get(hs().view)||null;}
function canonicalForView(){
  const v=currentView();return (v?.relationship_ids||[]).map(id=>S.relationships.get(id)).filter(Boolean);
}
function intentsForView(){return currentView()?.presentation_intents||[];}
function intentMap(){return new Map(intentsForView().map(i=>[i.intent_id,i]));}
function canonicalMap(){return new Map(canonicalForView().map(r=>[r.relationship_id,r]));}

function statusToken(s){
  const x=String(s||'').toUpperCase();
  if(x==='CONFIRMED')return 'CONFIRMED';
  if(x==='VENDOR PROPOSAL')return 'VENDOR';
  if(x==='WORKING ASSUMPTION')return 'ASSUMPTION';
  if(x==='OPEN-CONFIRMATION REQUIRED')return 'OPEN';
  if(x==='CUSTOMER INPUT')return 'CUSTOMER';
  if(x==='SUPERSEDED')return 'SUPERSEDED';
  return x||'OPEN';
}
function linkMetric(r){
  const a=r?.attributes||{},parts=[];
  if(a.link_quantity&&a.link_speed)parts.push(`${a.link_quantity} × ${a.link_speed}`);
  else if(a.link_quantity)parts.push(`${a.link_quantity} links`);
  else if(a.link_speed)parts.push(String(a.link_speed));
  if(a.media)parts.push(String(a.media));
  if(a.path_role&&String(a.path_role).toUpperCase()!=='UNSPECIFIED')parts.push(String(a.path_role));
  return parts.join(' · ');
}
function labelForEdge(path){
  let n=path.nextElementSibling;
  while(n){
    if(n.classList?.contains('edge-label'))return n;
    if(n.classList?.contains('edge')&&n.hasAttribute('data-edge'))break;
    n=n.nextElementSibling;
  }
  return null;
}
function decorateEdges(){
  const state=hs(),cm=canonicalMap(),im=intentMap(),engineering=state.mode==='ENGINEERING';
  $$('.edges .edge[data-edge]').forEach(p=>{
    const id=p.dataset.edge,r=cm.get(id),i=im.get(id),label=labelForEdge(p);
    if(r){
      p.dataset.engKind='canonical';p.dataset.engLayer=String(r.layer||'LOGICAL').toLowerCase();p.dataset.engStatus=statusToken(r.status).toLowerCase();
      const metric=linkMetric(r);if(metric){p.dataset.linkQuantity=String(r.attributes?.link_quantity||'');p.classList.add('edge-bundle');}
      if(label&&engineering){
        const prefix=metric?`${metric} · `:'';
        label.textContent=`${prefix}${r.type}`;
        label.dataset.kind='canonical';label.dataset.layer=String(r.layer||'LOGICAL').toLowerCase();label.dataset.status=statusToken(r.status).toLowerCase();
      }
    }else if(i){
      p.dataset.engKind='intent';p.dataset.engLayer=String(i.layer||'LOGICAL').toLowerCase();p.dataset.engStatus=statusToken(i.status).toLowerCase();
      if(label&&engineering){
        label.textContent=`DESIGN · ${i.label||i.relationship_type_hint||'INTENT'}`;
        label.dataset.kind='intent';label.dataset.layer=String(i.layer||'LOGICAL').toLowerCase();label.dataset.status=statusToken(i.status).toLowerCase();
      }
    }
  });
}

function toolbarHtml(){
  const state=hs(),isTr=state.lang==='tr';
  const labels=isTr?{
    all:'Tümü',canonical:'Canonical',physical:'Fiziksel',logical:'Mantıksal',management:'Yönetim/OOB',design:'Tasarım'
  }:{all:'All',canonical:'Canonical',physical:'Physical',logical:'Logical',management:'Mgmt/OOB',design:'Design'};
  return `<div class="eng-toolbar-head"><b>${isTr?'BAĞLANTI FİLTRESİ':'CONNECTIVITY FILTER'}</b><span>${isTr?'Yalnızca görünümü filtreler; canonical graph değişmez.':'View-only filter; canonical graph is unchanged.'}</span></div>
  <div class="eng-toolbar-buttons">${['all','canonical','physical','logical','management','design'].map(k=>`<button type="button" data-eng-filter="${k}" class="${S.filter===k?'on':''}">${labels[k]}</button>`).join('')}</div>
  <div class="eng-toolbar-policy">${isTr?'HA / ring / port / hız yalnız kanıt varsa gösterilir.':'HA / ring / port / speed are shown only when evidenced.'}</div>`;
}
function applyFilter(){
  document.documentElement.dataset.dctsEdgeFilter=S.filter;
  $$('.engineering-toolbar [data-eng-filter]').forEach(b=>b.classList.toggle('on',b.dataset.engFilter===S.filter));
}
function ensureToolbar(){
  const state=hs(),scene=$('#scene');if(!scene)return;
  const show=state.mode==='ENGINEERING'&&['T02','T03','T05'].includes(state.view);
  let bar=scene.querySelector('.engineering-toolbar');
  if(!show){bar?.remove();delete document.documentElement.dataset.dctsEdgeFilter;return;}
  if(!bar){
    bar=document.createElement('div');bar.className='engineering-toolbar';scene.appendChild(bar);
    bar.addEventListener('click',e=>{const b=e.target.closest('[data-eng-filter]');if(!b)return;S.filter=b.dataset.engFilter||'all';bar.innerHTML=toolbarHtml();applyFilter();});
  }
  const html=toolbarHtml();if(bar.innerHTML!==html)bar.innerHTML=html;applyFilter();
}

function topologyFlags(){
  const explicit=[];
  canonicalForView().forEach(r=>{
    const hay=[r.type,...Object.values(r.attributes||{})].join(' ').toUpperCase();
    if(/\bRING\b|ERPS|RRPP/.test(hay))explicit.push('RING');
    if(/\bHA\b|M-?LAG|MLAG|IRF|STACK|PEER/.test(hay))explicit.push('HA/PEER');
    if(/EVPN/.test(hay))explicit.push('EVPN');
    if(/VXLAN/.test(hay))explicit.push('VXLAN');
  });
  return [...new Set(explicit)];
}
function ensureTopologyFlags(){
  const state=hs(),scene=$('#scene');if(!scene)return;
  let box=scene.querySelector('.engineering-topology-flags');
  const flags=state.mode==='ENGINEERING'?topologyFlags():[];
  if(!flags.length){box?.remove();return;}
  if(!box){box=document.createElement('div');box.className='engineering-topology-flags';scene.appendChild(box);}
  box.innerHTML=`<b>${tr()?'KANITLI TOPOLOJİ':'EVIDENCED TOPOLOGY'}</b>${flags.map(f=>`<span>${esc(f)}</span>`).join('')}`;
}

function connectedIntents(id){return intentsForView().filter(i=>i.from_object_id===id||i.to_object_id===id);}
function connectedCanonical(id){return canonicalForView().filter(r=>r.from_object_id===id||r.to_object_id===id);}
function endpointName(id){return S.objects.get(id)?.display_name||id||'—';}
function physicalDetail(r,id){
  const other=r.from_object_id===id?r.to_object_id:r.from_object_id,metric=linkMetric(r)||'Confirmed physical relationship';
  const a=r.attributes||{};
  const portKeys=['from_port','to_port','port','source_port','destination_port','interface','interfaces'];
  const hasPort=portKeys.some(k=>a[k]);
  return `<div class="eng-link-card">
    <div><b>${esc(metric)}</b><span>${esc(endpointName(other))}</span></div>
    <small>${esc(r.type)} · ${esc(r.status)}</small>
    ${hasPort?'':`<em>${tr()?'Port eşlemesi canonical attribute içinde verilmemiş.':'Endpoint port mapping is not present in canonical attributes.'}</em>`}
  </div>`;
}
function inspectorPanelHtml(o){
  const cr=connectedCanonical(o.object_id),ints=connectedIntents(o.object_id),phys=cr.filter(r=>String(r.layer).toUpperCase()==='PHYSICAL');
  const layers=[...new Set(cr.map(r=>String(r.layer||'LOGICAL').toUpperCase()))];
  return `<section class="engineering-connectivity-panel">
    <div class="eng-panel-title"><span>${esc(roleLabel(o))}</span><b>${tr()?'BAĞLANTI KANITI':'CONNECTIVITY EVIDENCE'}</b></div>
    <div class="eng-panel-metrics">
      <span><b>${cr.length}</b>${tr()?'Canonical':'Canonical'}</span>
      <span><b>${phys.length}</b>${tr()?'Fiziksel':'Physical'}</span>
      <span><b>${ints.length}</b>${tr()?'Tasarım':'Design'}</span>
    </div>
    ${layers.length?`<div class="eng-layer-chips">${layers.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`:''}
    ${Number(o.quantity)>1?`<div class="eng-evidence-note">${tr()?`Bu normalized nesne BoQ miktarı ${o.quantity} olan bir grubu temsil eder. Üye cihazlar, HA eşleri ve portlar kanıt olmadan ayrıştırılmaz.`:`This normalized object represents a BoQ quantity of ${o.quantity}. Member devices, HA peers and ports are not decomposed without evidence.`}</div>`:''}
    <h5>${tr()?'Doğrulanmış fiziksel bağlantılar':'Confirmed physical links'}</h5>
    ${phys.length?phys.map(r=>physicalDetail(r,o.object_id)).join(''):`<div class="eng-no-physical">${tr()?'Bu nesne için bu görünümde doğrulanmış fiziksel link attribute’u yok.':'No confirmed physical link attributes are evidenced for this object in this view.'}</div>`}
    ${ints.length?`<h5>${tr()?'Tasarım / açık bağlantı niyetleri':'Design / unresolved connectivity intents'}</h5><div class="eng-intent-list">${ints.slice(0,8).map(i=>`<span>${esc(i.label||i.relationship_type_hint||'INTENT')} <small>${esc(i.status||'')}</small></span>`).join('')}</div>`:''}
  </section>`;
}
function enhanceInspector(){
  const state=hs(),body=$('#inspectorBody');if(!body)return;
  body.querySelector('.engineering-connectivity-panel')?.remove();
  if(state.mode!=='ENGINEERING'||!state.object||!['T02','T03','T05'].includes(state.view))return;
  const o=S.objects.get(state.object);if(!o)return;
  body.insertAdjacentHTML('afterbegin',inspectorPanelHtml(o));
}

function ensureEngineeringNotice(){
  const state=hs(),scene=$('#scene');if(!scene)return;
  let n=scene.querySelector('.engineering-safety-note');
  const show=state.mode==='ENGINEERING'&&['T02','T03','T05'].includes(state.view);
  if(!show){n?.remove();return;}
  if(!n){n=document.createElement('div');n.className='engineering-safety-note';scene.appendChild(n);}
  n.textContent=tr()
    ?'Mühendislik görünümü: bağlantı ve redundancy yalnız canonical kanıt veya açıkça etiketlenmiş tasarım intenti ile gösterilir. QTY değeri HA anlamına gelmez.'
    :'Engineering view: connectivity and redundancy are shown only from canonical evidence or explicitly labelled design intent. QTY does not imply HA.';
}

function syncDatasets(){
  const state=hs();document.documentElement.dataset.dctsEngineeringView=(state.mode==='ENGINEERING'&&['T02','T03','T05'].includes(state.view))?'on':'off';
}
function refresh(){
  cancelAnimationFrame(S.raf);
  S.raf=requestAnimationFrame(()=>requestAnimationFrame(()=>{
    syncDatasets();
    decorateNodes();
    const moved=applyNetworkEngineeringLayout();
    ensureToolbar();ensureTopologyFlags();ensureEngineeringNotice();
    decorateEdges();enhanceInspector();applyFilter();
    if(moved)setTimeout(()=>{decorateEdges();enhanceInspector();},190);
  }));
}
function startObserver(){
  const root=$('.dcts-app')||document.body;
  const obs=new MutationObserver(muts=>{
    if(muts.some(m=>m.type==='childList'&&[...m.addedNodes].some(n=>n.nodeType===1&&!n.classList?.contains('engineering-lane')&&!n.classList?.contains('engineering-toolbar')&&!n.classList?.contains('engineering-connectivity-panel')&&!n.classList?.contains('engineering-safety-note'))))refresh();
  });
  obs.observe(root,{subtree:true,childList:true});
  window.addEventListener('hashchange',()=>setTimeout(refresh,0));
  window.addEventListener('resize',()=>{if(!S.syntheticResize)setTimeout(refresh,120);});
  document.addEventListener('click',e=>{
    if(e.target.closest('.tab,.node-card,#modeBtn,#intentBtn,#fitBtn,.inspector-tabs button,#clearSelection'))setTimeout(refresh,45);
  },true);
}
async function boot(){
  let tries=0;while(!$('.dcts-app')&&tries++<100)await new Promise(r=>setTimeout(r,40));
  document.documentElement.classList.add('dcts-engineering-v1a6');
  await loadMetadata();refresh();startObserver();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
