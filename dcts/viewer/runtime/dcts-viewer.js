(function(){
'use strict';

const BOOT=window.DCTS_VIEWER_BOOT||{};
const STATUS={
 'CONFIRMED':'confirmed','CUSTOMER INPUT':'customer','VENDOR PROPOSAL':'vendor','WORKING ASSUMPTION':'assumption','OPEN-CONFIRMATION REQUIRED':'open','SUPERSEDED':'superseded'
};
const LAYER={PHYSICAL:'physical',LOGICAL:'logical',SERVICE:'service',MANAGEMENT:'management',OOB:'oob',SECURITY:'security',BACKUP:'backup',DR:'dr'};
const UI={
 en:{presentation:'Presentation',engineering:'Engineering',designPaths:'Design paths',narrate:'Narrate',stop:'Stop',print:'Print',return:'Return',overview:'Overview',engineeringTab:'Engineering',evidence:'Evidence & Traceability',select:'Select an infrastructure object',noSelection:'Select an object to inspect its role, relationships, evidence and validation state.',objects:'Objects',relationships:'Canonical relationships',intents:'Design / presentation intents',findings:'Findings',confirmed:'Confirmed',open:'Open / unresolved',role:'Role',domain:'Domain',type:'Type',class:'Class',vendor:'Vendor',model:'Model',sku:'SKU',quantity:'Quantity',status:'Status',canonicalId:'Canonical ID',sourceRefs:'Source references',legacyRefs:'Legacy references',related:'Related relationships',affected:'Validation findings',viewSummary:'View summary',evidenceSafe:'Evidence-safe topology: presentation intents never become canonical relationships.',loading:'Loading DCTS project package…',loadError:'DCTS package could not be loaded.',language:'Language',fit:'Fit',noEvidence:'No linked evidence records.',noFindings:'No findings linked to this object/view.',noRelationships:'No canonical relationships linked to this object/view.',presentationIntent:'Presentation intent'},
 tr:{presentation:'Sunum',engineering:'Mühendislik',designPaths:'Tasarım yolları',narrate:'Seslendir',stop:'Durdur',print:'Yazdır',return:'Geri dön',overview:'Genel Bakış',engineeringTab:'Mühendislik',evidence:'Kanıt ve İzlenebilirlik',select:'Bir altyapı nesnesi seçin',noSelection:'Rol, ilişkiler, kanıt ve doğrulama durumunu incelemek için bir nesne seçin.',objects:'Nesneler',relationships:'Canonical ilişkiler',intents:'Tasarım / sunum intentleri',findings:'Bulgular',confirmed:'Doğrulanmış',open:'Açık / çözülmemiş',role:'Rol',domain:'Domain',type:'Tip',class:'Sınıf',vendor:'Üretici',model:'Model',sku:'SKU',quantity:'Adet',status:'Durum',canonicalId:'Canonical ID',sourceRefs:'Kaynak referansları',legacyRefs:'Legacy referanslar',related:'İlişkili bağlantılar',affected:'Doğrulama bulguları',viewSummary:'Görünüm özeti',evidenceSafe:'Evidence-safe topoloji: sunum intentleri canonical ilişkiye dönüşmez.',loading:'DCTS proje paketi yükleniyor…',loadError:'DCTS paketi yüklenemedi.',language:'Dil',fit:'Sığdır',noEvidence:'Bağlı kanıt kaydı yok.',noFindings:'Bu nesne/görünüme bağlı bulgu yok.',noRelationships:'Bu nesne/görünüme bağlı canonical ilişki yok.',presentationIntent:'Sunum intenti'},
 dv:{presentation:'Presentation',engineering:'Engineering',designPaths:'Design paths',narrate:'Narrate',stop:'Stop',print:'Print',return:'Return',overview:'Overview',engineeringTab:'Engineering',evidence:'Evidence & Traceability',select:'Select an infrastructure object',noSelection:'Select an object to inspect its role, relationships, evidence and validation state.',objects:'Objects',relationships:'Canonical relationships',intents:'Design / presentation intents',findings:'Findings',confirmed:'Confirmed',open:'Open / unresolved',role:'Role',domain:'Domain',type:'Type',class:'Class',vendor:'Vendor',model:'Model',sku:'SKU',quantity:'Quantity',status:'Status',canonicalId:'Canonical ID',sourceRefs:'Source references',legacyRefs:'Legacy references',related:'Related relationships',affected:'Validation findings',viewSummary:'View summary',evidenceSafe:'Evidence-safe topology: presentation intents never become canonical relationships.',loading:'Loading DCTS project package…',loadError:'DCTS package could not be loaded.',language:'Language',fit:'Fit',noEvidence:'No linked evidence records.',noFindings:'No findings linked to this object/view.',noRelationships:'No canonical relationships linked to this object/view.',presentationIntent:'Presentation intent'}
};

const state={pkg:null,viewId:null,mode:null,lang:null,selectedId:null,showIntents:true,inspectorTab:'overview',scale:1};
const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const t=k=>(UI[state.lang]||UI.en)[k]||UI.en[k]||k;

function normalizeBase(v){return String(v||'').replace(/\/$/,'');}
function resourceUrl(base,path){return /^https?:/.test(path)?path:(path.startsWith('/')?path:`${base}/${path}`);}
async function getJson(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`${r.status} ${url}`);return r.json();}
async function loadPackage(){
 const base=normalizeBase(BOOT.packageBase);
 if(!base)throw new Error('DCTS_VIEWER_BOOT.packageBase is required');
 const manifest=await getJson(`${base}/package-manifest.json`);
 const names=['project_config','objects','relationships','evidence','findings','views'];
 const loaded={manifest};
 await Promise.all(names.map(async n=>{
   const meta=manifest.resources&&manifest.resources[n];
   if(!meta||!meta.path)throw new Error(`Missing resource ${n}`);
   loaded[n]=await getJson(resourceUrl(base,meta.path));
 }));
 for(const optional of ['narratives','translations','official_resources','theme']){
   const meta=manifest.resources&&manifest.resources[optional];
   if(meta&&meta.path){try{loaded[optional]=await getJson(resourceUrl(base,meta.path));}catch(_){loaded[optional]=null;}}
 }
 return prepare(loaded,base);
}
function prepare(x,base){
 const config=x.project_config, objects=x.objects.objects||[], relationships=x.relationships.relationships||[], evidence=x.evidence.evidence||[], findings=x.findings.findings||[], views=x.views.views||[];
 const byId=new Map(objects.map(o=>[o.object_id,o]));
 const relById=new Map(relationships.map(r=>[r.relationship_id,r]));
 const evidenceById=new Map(evidence.map(e=>[e.evidence_id,e]));
 const findingById=new Map(findings.map(f=>[f.finding_id,f]));
 const viewById=new Map(views.map(v=>[v.view_id,v]));
 return {...x,base,config,objects,relationships,evidence,findings,views,byId,relById,evidenceById,findingById,viewById};
}

function mount(){
 document.body.innerHTML=`
 <div class="dcts-app" id="dctsApp">
  <header class="dcts-header">
   <div class="dcts-brand"><div class="dcts-mark">D</div><div><b id="projectName">DCTS Viewer</b><small id="projectMeta">v1.0 shared engine</small></div></div>
   <nav id="viewTabs" class="dcts-tabs" aria-label="Topology views"></nav>
   <div class="dcts-actions">
    <button id="modeBtn" class="action"></button>
    <button id="intentBtn" class="action"></button>
    <select id="langSelect" class="action select" aria-label="Language"></select>
    <button id="voiceBtn" class="action"></button>
    <button id="fitBtn" class="action"></button>
    <button id="printBtn" class="action"></button>
    <a id="returnBtn" class="action link" href="#"></a>
   </div>
  </header>
  <main class="dcts-main">
   <aside class="dcts-left">
    <section class="panel hero"><div class="eyebrow" id="viewCode"></div><h1 id="viewTitle"></h1><p id="viewSubtitle"></p></section>
    <section class="panel"><h3>${esc(t('viewSummary'))}</h3><div id="viewStats" class="stats"></div><p id="viewNarrative" class="narrative"></p></section>
    <section class="panel"><h3>${esc(t('findings'))}</h3><div id="viewFindings"></div></section>
    <div class="evidence-safe">${esc(t('evidenceSafe'))}</div>
   </aside>
   <section class="dcts-center">
    <div class="crumb" id="crumb"></div>
    <div class="viewport" id="viewport"><div class="scene-wrap" id="sceneWrap"><div class="scene" id="scene"></div></div></div>
    <div class="legend" id="legend"></div>
   </section>
   <aside class="dcts-right">
    <div class="inspector-head"><div><div class="eyebrow" id="inspectorEyebrow">DCTS INSPECTOR</div><h2 id="inspectorTitle">${esc(t('select'))}</h2></div><button id="clearSelection" class="ghost">×</button></div>
    <div class="inspector-tabs"><button data-itab="overview" class="on"></button><button data-itab="engineering"></button><button data-itab="evidence"></button></div>
    <div id="inspectorBody" class="inspector-body"><p class="muted">${esc(t('noSelection'))}</p></div>
   </aside>
  </main>
  <div class="loading" id="loading"><div class="spinner"></div><span>${esc(t('loading'))}</span></div>
 </div>`;
 bindStatic();
}
function bindStatic(){
 $('#modeBtn').addEventListener('click',()=>{state.mode=state.mode==='PRESENTATION'?'ENGINEERING':'PRESENTATION';renderAll(true);});
 $('#intentBtn').addEventListener('click',()=>{state.showIntents=!state.showIntents;renderAll(true);});
 $('#langSelect').addEventListener('change',e=>{state.lang=e.target.value;renderAll(true);});
 $('#voiceBtn').addEventListener('click',toggleVoice);
 $('#fitBtn').addEventListener('click',fitScene);
 $('#printBtn').addEventListener('click',()=>window.print());
 $('#clearSelection').addEventListener('click',()=>{state.selectedId=null;state.inspectorTab='overview';renderInspector();writeHash();});
 $$('.inspector-tabs button').forEach(b=>b.addEventListener('click',()=>{state.inspectorTab=b.dataset.itab;renderInspector();}));
 window.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.selectedId){state.selectedId=null;renderInspector();writeHash();}});
 window.addEventListener('hashchange',()=>{if(applyHash())renderAll(false);});
 window.addEventListener('resize',debounce(fitScene,120));
}
function debounce(fn,ms){let h;return(...a)=>{clearTimeout(h);h=setTimeout(()=>fn(...a),ms);};}

function initState(){
 const c=state.pkg.config;
 state.lang=(c.languages||[]).includes(c.default_language)?c.default_language:(c.languages&&c.languages[0])||'en';
 state.mode=(c.viewer_modes||[]).includes(c.default_mode)?c.default_mode:'PRESENTATION';
 const enabled=(c.enabled_views||[]).filter(v=>state.pkg.viewById.has(v));
 state.viewId=enabled.includes('T00')?'T00':enabled[0]||state.pkg.views[0]?.view_id;
 state.showIntents=true;
 applyHash();
}
function parseHash(){const p=new URLSearchParams(location.hash.replace(/^#/,''));return {view:p.get('view'),object:p.get('object'),mode:p.get('mode'),lang:p.get('lang'),design:p.get('design')};}
function applyHash(){
 if(!state.pkg)return false;
 const h=parseHash();let changed=false;
 const enabled=state.pkg.config.enabled_views||[];
 if(h.view&&enabled.includes(h.view)&&state.pkg.viewById.has(h.view)&&h.view!==state.viewId){state.viewId=h.view;changed=true;}
 if(h.object&&state.pkg.byId.has(h.object)&&h.object!==state.selectedId){state.selectedId=h.object;changed=true;}
 if(!h.object&&state.selectedId){state.selectedId=null;changed=true;}
 if(h.mode&&['PRESENTATION','ENGINEERING'].includes(h.mode)&&h.mode!==state.mode){state.mode=h.mode;changed=true;}
 if(h.lang&&(state.pkg.config.languages||[]).includes(h.lang)&&h.lang!==state.lang){state.lang=h.lang;changed=true;}
 if(h.design!==null){const val=h.design!=='0';if(val!==state.showIntents){state.showIntents=val;changed=true;}}
 return changed;
}
function writeHash(){
 const p=new URLSearchParams();p.set('view',state.viewId);if(state.selectedId)p.set('object',state.selectedId);p.set('mode',state.mode);p.set('lang',state.lang);p.set('design',state.showIntents?'1':'0');
 const next='#'+p.toString();if(location.hash!==next)history.replaceState(null,'',next);
}

function renderAll(updateHash=true){
 if(!state.pkg)return;
 renderHeader();renderViewMeta();renderScene();renderInspector();renderLegend();
 requestAnimationFrame(()=>requestAnimationFrame(fitScene));
 if(updateHash)writeHash();
}
function renderHeader(){
 const c=state.pkg.config;
 $('#projectName').textContent=c.project_name;
 $('#projectMeta').textContent=`DCTS Viewer v1.0 · ${c.project_revision||state.pkg.manifest.package_revision}`;
 const tabs=$('#viewTabs');tabs.innerHTML='';
 for(const id of c.enabled_views||[]){const v=state.pkg.viewById.get(id);if(!v||!v.enabled)continue;const b=document.createElement('button');b.className='tab'+(id===state.viewId?' on':'');b.dataset.view=id;b.innerHTML=`<span>${esc(id)}</span><small>${esc(shortTitle(v.title))}</small>`;b.onclick=()=>{state.viewId=id;state.selectedId=null;state.inspectorTab='overview';renderAll(true);};tabs.appendChild(b);}
 $('#modeBtn').textContent=state.mode==='PRESENTATION'?t('engineering'):t('presentation');
 $('#modeBtn').classList.toggle('on',state.mode==='ENGINEERING');
 $('#intentBtn').textContent=`${t('designPaths')}: ${state.showIntents?'On':'Off'}`;$('#intentBtn').classList.toggle('on',state.showIntents);
 const ls=$('#langSelect');ls.innerHTML='';for(const l of c.languages||[c.default_language||'en']){const o=document.createElement('option');o.value=l;o.textContent=l.toUpperCase();o.selected=l===state.lang;ls.appendChild(o);}ls.style.display=(c.languages||[]).length>1?'inline-block':'none';
 $('#voiceBtn').textContent=(window.speechSynthesis&&window.speechSynthesis.speaking)?t('stop'):t('narrate');$('#voiceBtn').style.display=c.narration&&c.narration.enabled?'inline-block':'none';
 $('#fitBtn').textContent=t('fit');$('#printBtn').textContent=t('print');
 const ret=$('#returnBtn');ret.textContent=t('return');ret.href=c.return_url||'#';ret.style.display=c.return_url?'inline-flex':'none';
 $$('.inspector-tabs button')[0].textContent=t('overview');$$('.inspector-tabs button')[1].textContent=t('engineeringTab');$$('.inspector-tabs button')[2].textContent=t('evidence');
 $$('.inspector-tabs button').forEach(b=>b.classList.toggle('on',b.dataset.itab===state.inspectorTab));
}
function shortTitle(s){return String(s||'').replace('Overview / Navigation Map','Overview').replace('Management / OOB / Operations','Operations').replace('Compute / HCI / Storage','Compute').replace('Service / Tenant','Services').replace('Physical Connectivity','Physical').replace('Network Logical','Network').replace('Executive Architecture','Executive').replace('Backup / DR','Backup/DR');}
function currentView(){return state.pkg.viewById.get(state.viewId);}
function viewObjects(v=currentView()){return (v.object_ids||[]).map(id=>state.pkg.byId.get(id)).filter(Boolean);}
function viewRels(v=currentView()){return (v.relationship_ids||[]).map(id=>state.pkg.relById.get(id)).filter(Boolean);}
function viewFindings(v=currentView()){return (v.finding_ids||[]).map(id=>state.pkg.findingById.get(id)).filter(Boolean);}

function renderViewMeta(){
 const v=currentView(), objs=viewObjects(v), rels=viewRels(v), intents=v.presentation_intents||[], findings=viewFindings(v);
 document.querySelector('.dcts-center')?.setAttribute('data-view',state.viewId);
 $('#viewCode').textContent=state.viewId;
 $('#viewTitle').textContent=v.title;
 $('#viewSubtitle').textContent=v.subtitle||viewPurpose(state.viewId);
 $('#crumb').innerHTML=`<b>${esc(state.pkg.config.project_name)}</b><span>›</span><span>${esc(state.viewId)}</span><span>›</span><span>${esc(v.title)}</span><span class="mode-pill">${esc(state.mode)}</span>`;
 $('#viewStats').innerHTML=stat(t('objects'),objs.length)+stat(t('relationships'),rels.length)+stat(t('intents'),intents.length)+stat(t('findings'),findings.length);
 $('#viewNarrative').textContent=buildNarrative(v,objs,rels,intents,findings);
 const box=$('#viewFindings');box.innerHTML='';if(!findings.length)box.innerHTML=`<p class="muted">${esc(t('noFindings'))}</p>`;else findings.slice(0,state.mode==='PRESENTATION'?4:12).forEach(f=>box.appendChild(findingCard(f)));
 document.documentElement.dataset.watermark=(state.pkg.config.watermark&&state.pkg.config.watermark.enabled)?'on':'off';
 document.documentElement.style.setProperty('--dcts-watermark',`"${String(state.pkg.config.watermark?.text||'').replace(/"/g,'')}"`);
}
function stat(label,val){return `<div class="stat"><b>${esc(val)}</b><span>${esc(label)}</span></div>`;}
function viewPurpose(id){return ({T00:'Master architecture and navigation map.',T01:'Executive architecture narrative and major platform domains.',T02:'Logical network, segmentation and service relationships.',T03:'Evidence-supported physical connectivity only.',T04:'Compute, HCI and storage platform architecture.',T05:'Management, OOB, monitoring and operations.',T06:'Service and tenant relationships.',T07:'Security boundaries and controls.',T08:'Backup, recovery and DR architecture.',T09:'AI / GPU fabric extension.',T10:'Multi-site / DR extension.'})[id]||'';}
function buildNarrative(v,objs,rels,intents,findings){
 if(state.pkg.narratives){const n=state.pkg.narratives[state.viewId]||state.pkg.narratives.views?.[state.viewId];if(typeof n==='string')return n;if(n&&n[state.lang])return n[state.lang];if(n&&n.en)return n.en;}
 const domains=[...new Set(objs.map(o=>o.domain))];
 if(state.lang==='tr')return `${v.title} görünümü ${objs.length} nesne ve ${rels.length} canonical ilişki içeriyor. ${domains.length?`Başlıca domainler: ${domains.join(', ')}.`:''} ${intents.length?`${intents.length} sunum/tasarım intenti canonical graph dışında tutuluyor.`:''} ${findings.length?`${findings.length} kontrollü bulgu bu görünümle ilişkili.`:''}`;
 return `${v.title} contains ${objs.length} objects and ${rels.length} canonical relationships. ${domains.length?`Primary domains: ${domains.join(', ')}.`:''} ${intents.length?`${intents.length} presentation/design intents remain outside the canonical graph.`:''} ${findings.length?`${findings.length} controlled findings are associated with this view.`:''}`;
}
function findingCard(f){const d=document.createElement('div');d.className='finding '+slug(f.severity);d.innerHTML=`<div class="finding-top"><b>${esc(f.severity)}</b><span>${esc(f.status||'')}</span></div><strong>${esc(f.title)}</strong>${f.impact?`<p>${esc(f.impact)}</p>`:''}`;return d;}
function slug(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-');}

function renderScene(){
 const scene=$('#scene');scene.innerHTML='';
 if(state.viewId==='T00'){renderT00(scene);return;}
 const v=currentView(), objs=viewObjects(v), rels=viewRels(v), intents=state.showIntents?(v.presentation_intents||[]):[];
 const W=1180,H=780;scene.style.width=W+'px';scene.style.height=H+'px';
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.classList.add('edges');scene.appendChild(svg);
 const layer=document.createElement('div');layer.className='node-layer';scene.appendChild(layer);
 const positions=layoutPositions(v,objs,W,H);
 const groups=domainBounds(objs,positions);
 groups.forEach(g=>{const el=document.createElement('div');el.className='domain-box';el.style.left=g.x+'px';el.style.top=g.y+'px';el.style.width=g.w+'px';el.style.height=g.h+'px';el.innerHTML=`<span>${esc(g.domain)}</span>`;layer.appendChild(el);});
 objs.forEach(o=>{const p=positions.get(o.object_id);const n=nodeCard(o);n.style.left=p.x+'px';n.style.top=p.y+'px';layer.appendChild(n);});
 requestAnimationFrame(()=>requestAnimationFrame(()=>drawEdges(svg,positions,rels,intents)));
}
function renderT00(scene){
 const W=1180,H=780;scene.style.width=W+'px';scene.style.height=H+'px';
 const wrap=document.createElement('div');wrap.className='t00-map';scene.appendChild(wrap);
 const center=document.createElement('div');center.className='t00-center';center.innerHTML=`<div class="dcts-kicker">DCTS PROJECT PACKAGE</div><h2>${esc(state.pkg.config.project_name)}</h2><p>${esc(state.pkg.config.project_revision||state.pkg.manifest.package_revision)}</p><div class="t00-metrics"><span>${state.pkg.objects.length} ${esc(t('objects'))}</span><span>${state.pkg.relationships.length} ${esc(t('relationships'))}</span><span>${state.pkg.findings.length} ${esc(t('findings'))}</span></div>`;wrap.appendChild(center);
 const views=(state.pkg.config.enabled_views||[]).filter(id=>id!=='T00').map(id=>state.pkg.viewById.get(id)).filter(Boolean);
 const radiusX=430,radiusY=275,cx=590,cy=390;
 views.forEach((v,i)=>{const a=(-Math.PI/2)+(Math.PI*2*i/views.length);const x=cx+Math.cos(a)*radiusX-105,y=cy+Math.sin(a)*radiusY-55;const card=document.createElement('button');card.className='t00-card';card.style.left=x+'px';card.style.top=y+'px';const oc=(v.object_ids||[]).length,rc=(v.relationship_ids||[]).length;card.innerHTML=`<span class="code">${esc(v.view_id)}</span><strong>${esc(v.title)}</strong><small>${oc} objects · ${rc} canonical rel.</small>`;card.onclick=()=>{state.viewId=v.view_id;state.selectedId=null;renderAll(true);};wrap.appendChild(card);});
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 1180 780');svg.classList.add('t00-links');wrap.prepend(svg);
 views.forEach((v,i)=>{const a=(-Math.PI/2)+(Math.PI*2*i/views.length);const x=cx+Math.cos(a)*(radiusX-100),y=cy+Math.sin(a)*(radiusY-70);const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',`M ${cx} ${cy} Q ${(cx+x)/2} ${(cy+y)/2} ${x} ${y}`);svg.appendChild(p);});
}

function layoutPositions(v,objs,W,H){
 const m=new Map(), hints=v.layout&&v.layout.object_hints||[];
 if(v.layout&&v.layout.strategy==='NORMALIZED_HINTS'&&hints.length){const hm=new Map(hints.map(h=>[h.object_id,h]));objs.forEach((o,i)=>{const h=hm.get(o.object_id);if(h)m.set(o.object_id,{x:Math.round(45+(Math.min(.86,Math.max(0,h.x||0)))*(W-260)),y:Math.round(38+(Math.min(.86,Math.max(0,h.y||0)))*(H-150))});else m.set(o.object_id,fallbackGrid(i,W,H));});return m;}
 const domainOrder=['EXTERNAL','CARRIER','EDGE','SECURITY','NETWORK','COMPUTE','HCI','STORAGE','CLOUD','BACKUP','DR','MANAGEMENT','OOB','MONITORING','DCIM','OPERATIONS','SERVICE','TENANT'];
 const grouped=new Map();objs.forEach(o=>{if(!grouped.has(o.domain))grouped.set(o.domain,[]);grouped.get(o.domain).push(o);});
 const domains=[...grouped.keys()].sort((a,b)=>domainOrder.indexOf(a)-domainOrder.indexOf(b));
 const cols=Math.min(4,Math.max(1,Math.ceil(Math.sqrt(domains.length))));const cellW=(W-70)/cols;const rows=Math.ceil(domains.length/cols);const cellH=(H-70)/rows;
 domains.forEach((d,di)=>{const list=grouped.get(d),col=di%cols,row=Math.floor(di/cols),baseX=35+col*cellW,baseY=38+row*cellH;list.forEach((o,oi)=>{const innerCols=list.length>2?2:1;const ic=oi%innerCols,ir=Math.floor(oi/innerCols);m.set(o.object_id,{x:Math.round(baseX+18+ic*(cellW/innerCols)),y:Math.round(baseY+38+ir*116)});});});
 return m;
}
function fallbackGrid(i,W,H){const cols=4;return{x:60+(i%cols)*270,y:60+Math.floor(i/cols)*130};}
function domainBounds(objs,pos){const g=new Map();objs.forEach(o=>{const p=pos.get(o.object_id);if(!p)return;const x=p.x,y=p.y,w=205,h=92;if(!g.has(o.domain))g.set(o.domain,{domain:o.domain,minX:x,minY:y,maxX:x+w,maxY:y+h});else{const b=g.get(o.domain);b.minX=Math.min(b.minX,x);b.minY=Math.min(b.minY,y);b.maxX=Math.max(b.maxX,x+w);b.maxY=Math.max(b.maxY,y+h);}});return[...g.values()].map(b=>({domain:b.domain,x:b.minX-14,y:b.minY-28,w:b.maxX-b.minX+28,h:b.maxY-b.minY+44}));}
function nodeCard(o){const b=document.createElement('button');b.className=`node-card status-${STATUS[o.status]||'open'} domain-${slug(o.domain)}`+(o.object_id===state.selectedId?' selected':'');b.dataset.object=o.object_id;b.innerHTML=`<div class="node-top"><span class="domain-dot"></span><span>${esc(o.domain)}</span><span class="status-chip">${esc(o.status)}</span></div><strong>${esc(o.display_name)}</strong><small>${esc(o.model||o.object_type||'')}</small><div class="node-foot"><span>${esc(o.vendor||'')}</span><span>${o.quantity!==null&&o.quantity!==undefined?'× '+esc(o.quantity):''}</span></div>${state.mode==='ENGINEERING'?`<code>${esc(o.object_id)}</code>`:''}`;b.onclick=()=>{state.selectedId=o.object_id;state.inspectorTab='overview';renderInspector();$$('.node-card').forEach(n=>n.classList.toggle('selected',n.dataset.object===state.selectedId));writeHash();};return b;}
function drawEdges(svg,pos,rels,intents){svg.innerHTML='';const defs=document.createElementNS('http://www.w3.org/2000/svg','defs');defs.innerHTML='<marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker>';svg.appendChild(defs);
 const all=[...rels.map(r=>({kind:'canonical',id:r.relationship_id,from:r.from_object_id,to:r.to_object_id,label:r.type,status:r.status,layer:r.layer,raw:r})),...intents.map(i=>({kind:'intent',id:i.intent_id,from:i.from_object_id,to:i.to_object_id,label:i.label,status:i.status,layer:'LOGICAL',raw:i}))];
 all.forEach(e=>{if(!e.from||!e.to||!pos.has(e.from)||!pos.has(e.to))return;const a=pos.get(e.from),b=pos.get(e.to),ax=a.x+102,ay=a.y+46,bx=b.x+102,by=b.y+46;const midX=(ax+bx)/2;const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',`M ${ax} ${ay} C ${midX} ${ay}, ${midX} ${by}, ${bx} ${by}`);p.classList.add('edge',`edge-${e.kind}`,`layer-${LAYER[e.layer]||'logical'}`,`status-${STATUS[e.status]||'open'}`);p.setAttribute('marker-end','url(#arrow)');p.dataset.edge=e.id;svg.appendChild(p);
   if(state.mode==='ENGINEERING'){const tx=document.createElementNS('http://www.w3.org/2000/svg','text');tx.setAttribute('x',String(midX));tx.setAttribute('y',String((ay+by)/2-4));tx.classList.add('edge-label');tx.textContent=e.kind==='intent'?`${t('presentationIntent')}: ${e.label}`:e.label;svg.appendChild(tx);}
 });
}

function renderLegend(){
 $('#legend').innerHTML=`<span><i class="swatch solid"></i>${esc(t('confirmed'))}</span><span><i class="swatch dashed"></i>${esc(t('open'))}</span><span><i class="swatch intent"></i>${esc(t('intents'))}</span><span class="legend-mode">${esc(state.mode)}</span>`;
}
function renderInspector(){
 renderHeader();
 const body=$('#inspectorBody'), title=$('#inspectorTitle');
 if(!state.selectedId||!state.pkg.byId.has(state.selectedId)){title.textContent=t('select');body.innerHTML=`<p class="muted">${esc(t('noSelection'))}</p>`;return;}
 const o=state.pkg.byId.get(state.selectedId);title.textContent=o.display_name;
 const rels=state.pkg.relationships.filter(r=>r.from_object_id===o.object_id||r.to_object_id===o.object_id);
 const findings=state.pkg.findings.filter(f=>(f.object_ids||[]).includes(o.object_id));
 const evidence=(o.source_refs||[]).map(id=>state.pkg.evidenceById.get(id)).filter(Boolean);
 if(state.inspectorTab==='overview')body.innerHTML=overviewHtml(o);
 else if(state.inspectorTab==='engineering')body.innerHTML=engineeringHtml(o,rels,findings);
 else body.innerHTML=evidenceHtml(o,evidence);
}
function row(k,v){return `<div class="kv-row"><span>${esc(k)}</span><b>${v===null||v===undefined||v===''?'—':esc(v)}</b></div>`;}
function overviewHtml(o){return `<div class="status-banner status-${STATUS[o.status]||'open'}">${esc(o.status)}</div><div class="kv-grid">${row(t('domain'),o.domain)}${row(t('role'),o.functional_role)}${row(t('type'),o.object_type)}${row(t('class'),o.object_class)}${row(t('vendor'),o.vendor)}${row(t('model'),o.model)}${row(t('sku'),o.sku)}${row(t('quantity'),o.quantity)}${state.mode==='ENGINEERING'?row(t('canonicalId'),o.object_id):''}</div>${o.notes?`<div class="note">${esc(o.notes)}</div>`:''}`;}
function engineeringHtml(o,rels,findings){let h=`<div class="kv-grid">${row(t('canonicalId'),o.object_id)}${row(t('status'),o.status)}${row(t('role'),o.functional_role)}</div><h4>${esc(t('related'))}</h4>`;if(!rels.length)h+=`<p class="muted">${esc(t('noRelationships'))}</p>`;else rels.forEach(r=>{const other=state.pkg.byId.get(r.from_object_id===o.object_id?r.to_object_id:r.from_object_id);h+=`<div class="rel-card"><div><b>${esc(r.type)}</b><span>${esc(r.layer)} · ${esc(r.status)}</span></div><p>${esc(other?.display_name||'Unknown endpoint')}</p>${attrsHtml(r.attributes)}</div>`;});h+=`<h4>${esc(t('affected'))}</h4>`;if(!findings.length)h+=`<p class="muted">${esc(t('noFindings'))}</p>`;else findings.forEach(f=>{h+=`<div class="finding ${slug(f.severity)}"><div class="finding-top"><b>${esc(f.severity)}</b><span>${esc(f.status)}</span></div><strong>${esc(f.title)}</strong>${f.impact?`<p>${esc(f.impact)}</p>`:''}</div>`;});return h;}
function attrsHtml(a){if(!a)return'';const vals=Object.entries(a).filter(([,v])=>v!==null&&v!==undefined&&v!=='');if(!vals.length)return'';return `<div class="attrs">${vals.map(([k,v])=>`<span><em>${esc(k)}</em>${esc(v)}</span>`).join('')}</div>`;}
function evidenceHtml(o,evs){let h=`<h4>${esc(t('sourceRefs'))}</h4><div class="chips">${(o.source_refs||[]).map(x=>`<span>${esc(x)}</span>`).join('')||'—'}</div><h4>${esc(t('legacyRefs'))}</h4><div class="chips">${(o.legacy_refs||[]).map(x=>`<span>${esc(x)}</span>`).join('')||'—'}</div><h4>${esc(t('evidence'))}</h4>`;if(!evs.length)h+=`<p class="muted">${esc(t('noEvidence'))}</p>`;else evs.forEach(e=>{h+=`<div class="evidence-card"><b>${esc(e.source_type)}</b><span>${esc(e.source_file)} · ${esc(e.source_revision)}</span>${e.locator?`<small>${esc(e.locator)}</small>`:''}${e.claim?`<p>${esc(e.claim)}</p>`:''}</div>`;});return h;}

function fitScene(){
 const vp=$('#viewport'), scene=$('#scene'), wrap=$('#sceneWrap');if(!vp||!scene||!wrap)return;const sw=parseFloat(scene.style.width)||1180,sh=parseFloat(scene.style.height)||780;const w=Math.max(300,vp.clientWidth-28),h=Math.max(240,vp.clientHeight-28);const s=Math.min(1,w/sw,h/sh);state.scale=Math.max(.52,s);wrap.style.width=(sw*state.scale)+'px';wrap.style.height=(sh*state.scale)+'px';scene.style.transform=`scale(${state.scale})`;}
function toggleVoice(){
 if(!('speechSynthesis'in window))return;if(window.speechSynthesis.speaking){window.speechSynthesis.cancel();renderHeader();return;}
 const text=$('#viewNarrative')?.textContent||currentView()?.title||'';const u=new SpeechSynthesisUtterance(text);u.lang=state.lang==='tr'?'tr-TR':state.lang==='dv'?'dv-MV':'en-US';u.rate=.94;u.onend=renderHeader;u.onerror=renderHeader;window.speechSynthesis.speak(u);renderHeader();}

async function start(){
 mount();
 try{state.pkg=await loadPackage();initState();$('#loading').classList.add('off');renderAll(false);writeHash();}
 catch(err){console.error(err);$('#loading').innerHTML=`<div class="load-error"><b>${esc(t('loadError'))}</b><code>${esc(err.message||err)}</code></div>`;}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
