(function(){
'use strict';

const VERSION='20260803-v24-investor-v1';
const VALID_VIEWS=new Set(['model','gallery','reports']);
const DEBUG_TOGGLE_IDS=['labelsToggle','zoningToggle','routeToggle','futureToggle','coolingToggle','powerToggle','fiberToggle','safetyToggle'];
const state={ready:false,view:'model',theme:'dark',hiddenObjects:0,treatedMaterials:0,logoImages:0,errors:[]};
const byId=id=>document.getElementById(id);
const qsa=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
const engine=()=>({THREE:window.THREE,scene:window.__KAYAS_SCENE__,renderer:window.__KAYAS_RENDERER__,camera:window.__KAYAS_CAMERA__});

function setMetricTruth(){
  const cells=qsa('.metric-grid>div');
  if(cells[4]){
    const value=cells[4].querySelector('strong');
    const note=cells[4].querySelector('span');
    if(value)value.textContent='20';
    if(note)note.textContent='IC8000 pod · 10 kabinet/pod';
  }
}

function setView(next){
  const view=VALID_VIEWS.has(next)?next:'model';
  state.view=view;
  document.body.dataset.activeView=view;
  qsa('[data-panel]').forEach(button=>{
    const active=button.dataset.panel===view;
    button.classList.toggle('is-active',active);
    button.setAttribute('aria-selected',String(active));
  });
  const drawer=byId('customerDrawer');
  qsa('.drawer-panel[data-content]').forEach(panel=>{panel.hidden=panel.dataset.content!==view;});
  if(drawer)drawer.hidden=view==='model';
  const title=byId('drawerTitle');
  if(title)title.textContent=view==='reports'?'Raporlar ve Dokümanlar':'Konsept Görseller';
}

function installExclusiveNavigation(){
  document.addEventListener('click',event=>{
    const tab=event.target.closest('[data-panel]');
    if(tab){
      event.preventDefault();
      event.stopImmediatePropagation();
      setView(tab.dataset.panel);
      return;
    }
    if(event.target.closest('#drawerClose')){
      event.preventDefault();
      event.stopImmediatePropagation();
      setView('model');
    }
  },true);
}

function applyTheme(next,persist=true){
  const theme=next==='light'?'light':'dark';
  state.theme=theme;
  document.documentElement.dataset.theme=theme;
  document.body.dataset.theme=theme;
  document.body.classList.toggle('is-night',theme==='dark');
  const night=byId('nightToggle');
  if(night)night.checked=theme==='dark';
  const button=byId('themeButton');
  if(button){button.textContent=theme==='dark'?'☀':'☾';button.setAttribute('aria-pressed',String(theme==='light'));}
  const {THREE,scene,renderer}=engine();
  if(THREE&&scene){
    const background=theme==='dark'?0x071421:0xe8eef4;
    scene.background=new THREE.Color(background);
    if(scene.fog&&scene.fog.color)scene.fog.color.set(background);
  }
  if(renderer){
    try{renderer.setClearColor(theme==='dark'?0x071421:0xe8eef4,1);}catch(_error){}
    if('toneMappingExposure' in renderer)renderer.toneMappingExposure=theme==='dark'?1.12:1.02;
  }
  if(persist){try{localStorage.setItem('kayas-theme',theme);}catch(_error){}}
}

function installThemeController(){
  let saved='dark';
  try{saved=localStorage.getItem('kayas-theme')||document.documentElement.dataset.theme||'dark';}catch(_error){}
  applyTheme(saved,false);
  document.addEventListener('click',event=>{
    if(!event.target.closest('#themeButton'))return;
    event.preventDefault();
    event.stopImmediatePropagation();
    applyTheme(state.theme==='dark'?'light':'dark');
  },true);
  const night=byId('nightToggle');
  if(night)night.addEventListener('change',()=>applyTheme(night.checked?'dark':'light'));
}

function setPanelCollapsed(collapsed){
  document.body.classList.toggle('panel-collapsed',!!collapsed);
  const edge=byId('panelEdgeToggle');
  if(edge)edge.textContent=collapsed?'›':'‹';
  try{localStorage.setItem('kayas-panel-collapsed',collapsed?'1':'0');}catch(_error){}
  window.dispatchEvent(new Event('resize'));
}

function installPanelController(){
  let collapsed=false;
  try{collapsed=localStorage.getItem('kayas-panel-collapsed')==='1';}catch(_error){}
  setPanelCollapsed(collapsed);
  document.addEventListener('click',event=>{
    if(!event.target.closest('#panelToggleHeader,#panelEdgeToggle'))return;
    event.preventDefault();
    event.stopImmediatePropagation();
    setPanelCollapsed(!document.body.classList.contains('panel-collapsed'));
  },true);
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&state.view!=='model')setView('model');
  });
}

function disableDebugLayers(){
  DEBUG_TOGGLE_IDS.forEach(id=>{
    const input=byId(id);
    if(!input)return;
    if(input.checked){
      input.checked=false;
      input.dispatchEvent(new Event('change',{bubbles:true}));
    }
  });
}

function nameOf(object){return String(object&&object.name||'').toLowerCase();}
function hasNameInParents(object,pattern){
  let node=object;
  while(node){if(pattern.test(nameOf(node)))return true;node=node.parent;}
  return false;
}

function suppressNonInvestorObjects(scene){
  const hidePattern=/(kayas-v21-professional-person|kayas-v21-professional-plant|kayas-v21-contact-shadow|person|human|visitor|avatar|figure|receptionist|staff|plant|tree|shrub|foliage|greenery|potted|route-arrow|route-line|visitor-route|waypoint|debug|gizmo|axis-helper|camera-helper|zone-overlay|future-overlay)/i;
  const preservePattern=/(screen|dashboard|monitor|rack|cabinet|ic8000|door|wall|floor|ceiling|glass|table|chair|reception-desk|mantrap|battery|fiber|hvac|chiller|cooler|light|led)/i;
  scene.traverse(object=>{
    if(!object||object===scene||!object.visible)return;
    const name=nameOf(object);
    if(!name)return;
    if(preservePattern.test(name)&&!/(route|debug|helper)/.test(name))return;
    if(hidePattern.test(name)||hasNameInParents(object,/kayas-v21-professional-(person|plant)/i)){
      object.visible=false;
      object.userData=object.userData||{};
      object.userData.kayasV24Hidden=true;
      state.hiddenObjects+=1;
    }
    if(/kayas-v21-rack-precision-edges/.test(name))object.visible=false;
  });
}

function tuneMaterial(material,kind,THREE){
  if(!material||material.userData&&material.userData.kayasV24Treated)return;
  if(Array.isArray(material)){material.forEach(item=>tuneMaterial(item,kind,THREE));return;}
  if(!('roughness' in material)&&!('metalness' in material)&&!material.isMeshPhysicalMaterial)return;
  if(kind==='rack'){
    if('roughness' in material)material.roughness=.30;
    if('metalness' in material)material.metalness=.72;
    if('envMapIntensity' in material)material.envMapIntensity=1.15;
  }else if(kind==='glass'){
    material.transparent=true;
    material.opacity=Math.min(Number.isFinite(material.opacity)?material.opacity:.32,.34);
    if('roughness' in material)material.roughness=.10;
    if('metalness' in material)material.metalness=.04;
    if('transmission' in material)material.transmission=Math.max(material.transmission||0,.62);
    if('ior' in material)material.ior=1.48;
    material.depthWrite=false;
  }else if(kind==='floor'){
    if('roughness' in material)material.roughness=.64;
    if('metalness' in material)material.metalness=.04;
    if('envMapIntensity' in material)material.envMapIntensity=.62;
  }else if(kind==='wall'){
    if('roughness' in material)material.roughness=.76;
    if('metalness' in material)material.metalness=.01;
  }else if(kind==='screen'){
    if('roughness' in material)material.roughness=.18;
    if('metalness' in material)material.metalness=.12;
    if(material.emissive&&THREE){material.emissiveIntensity=Math.max(material.emissiveIntensity||0,.9);}
  }else if(kind==='furniture'){
    if('roughness' in material)material.roughness=.48;
    if('metalness' in material)material.metalness=.18;
  }
  material.userData=material.userData||{};
  material.userData.kayasV24Treated=true;
  material.needsUpdate=true;
  state.treatedMaterials+=1;
}

function tuneMaterials(scene,THREE){
  scene.traverse(object=>{
    if(!object||!object.isMesh||!object.material)return;
    const name=nameOf(object);
    let kind='';
    if(/rack|cabinet|ic8000|server|metal-frame/.test(name))kind='rack';
    else if(/glass|window|partition-glass/.test(name))kind='glass';
    else if(/floor|raised-floor|terrace|tile/.test(name))kind='floor';
    else if(/wall|partition|ceiling/.test(name))kind='wall';
    else if(/screen|dashboard|monitor|display/.test(name))kind='screen';
    else if(/desk|table|chair|sofa|counter|reception/.test(name))kind='furniture';
    if(kind)tuneMaterial(object.material,kind,THREE);
    object.castShadow=kind==='rack'||kind==='furniture';
    object.receiveShadow=kind!=='glass'&&kind!=='screen';
  });
}

function tuneRenderer(renderer,THREE){
  if(!renderer||!THREE)return;
  try{renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,window.innerWidth<900?1.35:2));}catch(_error){}
  if('outputColorSpace' in renderer&&THREE.SRGBColorSpace)renderer.outputColorSpace=THREE.SRGBColorSpace;
  if('toneMapping' in renderer&&THREE.ACESFilmicToneMapping)renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=state.theme==='dark'?1.12:1.02;
  if(renderer.shadowMap){renderer.shadowMap.enabled=window.innerWidth>=900;if(THREE.PCFSoftShadowMap)renderer.shadowMap.type=THREE.PCFSoftShadowMap;}
}

function installBalancedLight(scene,THREE){
  if(scene.getObjectByName('kayas-v24-hemi'))return;
  const hemi=new THREE.HemisphereLight(0xd8ecff,0x182431,state.theme==='dark'?.34:.52);
  hemi.name='kayas-v24-hemi';
  scene.add(hemi);
  const key=new THREE.DirectionalLight(0xf4f8ff,state.theme==='dark'?.54:.72);
  key.name='kayas-v24-key';
  key.position.set(-28,46,24);
  key.castShadow=window.innerWidth>=900;
  if(key.shadow){key.shadow.mapSize.set(2048,2048);key.shadow.bias=-.00015;key.shadow.normalBias=.025;}
  scene.add(key);
}

function bindAssetFallbacks(){
  const install=image=>{
    if(image.dataset.k24FallbackBound)return;
    image.dataset.k24FallbackBound='1';
    image.addEventListener('error',()=>{
      image.style.display='none';
      const parent=image.parentElement;
      if(parent&&!parent.querySelector('.asset-error')){
        const note=document.createElement('div');
        note.className='asset-error';
        note.textContent='Görsel kaynağı yüklenemedi. Aynı-origin kaynak doğrulaması gerekiyor.';
        parent.appendChild(note);
      }
    });
  };
  qsa('.gallery-hero-image img,.gallery-grid img').forEach(install);
  const observer=new MutationObserver(()=>qsa('.gallery-hero-image img,.gallery-grid img').forEach(install));
  const drawer=byId('customerDrawer');
  if(drawer)observer.observe(drawer,{childList:true,subtree:true});
}

function checkBrand(){
  const logos=qsa('.h3c-wordmark-logo');
  state.logoImages=logos.filter(node=>{
    const image=node.querySelector('img');
    return !!(image&&image.complete&&image.naturalWidth>0);
  }).length;
  logos.forEach(node=>{
    const image=node.querySelector('img');
    if(!image){node.classList.add('is-fallback');node.textContent='H3C';}
  });
}

function applyScenePresentation(){
  const {THREE,scene,renderer}=engine();
  if(!THREE||!scene||!renderer)return false;
  disableDebugLayers();
  suppressNonInvestorObjects(scene);
  tuneMaterials(scene,THREE);
  tuneRenderer(renderer,THREE);
  installBalancedLight(scene,THREE);
  applyTheme(state.theme,false);
  return true;
}

function finalize(){
  document.body.classList.add('k24-investor-mode');
  setMetricTruth();
  setView('model');
  disableDebugLayers();
  bindAssetFallbacks();
  let attempts=0;
  const timer=setInterval(()=>{
    attempts+=1;
    checkBrand();
    if(window.__KAYAS_MODEL_READY===true&&applyScenePresentation()){
      clearInterval(timer);
      state.ready=true;
      window.__KAYAS_V24_STATUS=Object.assign({},state,{version:VERSION});
      window.dispatchEvent(new Event('resize'));
    }else if(attempts>480){
      clearInterval(timer);
      state.errors.push('MODEL_READY_TIMEOUT');
      window.__KAYAS_V24_STATUS=Object.assign({},state,{version:VERSION});
    }
  },250);
}

function install(){
  installExclusiveNavigation();
  installThemeController();
  installPanelController();
  finalize();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
else install();
})();
