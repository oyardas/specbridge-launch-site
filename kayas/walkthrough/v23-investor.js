(function(){
'use strict';
const VERSION='20260803-v23-investor-v1';
const DEBUG_TOGGLES=['labelsToggle','zoningToggle','routeToggle','futureToggle','coolingToggle','powerToggle','fiberToggle','safetyToggle'];
const state={theme:'dark',view:'model',suppressed:0,ready:false};
const byId=id=>document.getElementById(id);
const qsa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const engine=()=>({THREE:window.THREE,scene:window.__KAYAS_SCENE__,renderer:window.__KAYAS_RENDERER__,camera:window.__KAYAS_CAMERA__});

function fixMetrics(){
  const cells=qsa('.metric-grid>div');
  if(cells[4]){
    const a=cells[4].querySelector('strong');
    const b=cells[4].querySelector('span');
    if(a)a.textContent='20';
    if(b)b.textContent='IC8000 pod · 10 kabinet/pod';
  }
}

function setView(view){
  if(!['model','gallery','reports'].includes(view))view='model';
  state.view=view;
  document.body.dataset.activeView=view;
  const drawer=byId('customerDrawer');
  qsa('[data-panel]').forEach(btn=>{
    const active=btn.dataset.panel===view;
    btn.classList.toggle('is-active',active);
    btn.setAttribute('aria-selected',String(active));
  });
  qsa('.drawer-panel[data-content]').forEach(panel=>panel.hidden=panel.dataset.content!==view);
  if(drawer)drawer.hidden=view==='model';
  const title=byId('drawerTitle');
  if(title)title.textContent=view==='reports'?'Raporlar ve Dokümanlar':'Konsept Görseller';
}

function installViewController(){
  qsa('[data-panel]').forEach(btn=>btn.addEventListener('click',ev=>{
    ev.preventDefault();
    ev.stopImmediatePropagation();
    setView(btn.dataset.panel||'model');
  },true));
  const close=byId('drawerClose');
  if(close)close.addEventListener('click',ev=>{
    ev.preventDefault();
    ev.stopImmediatePropagation();
    setView('model');
  },true);
}

function applyTheme(theme){
  theme=theme==='light'?'light':'dark';
  state.theme=theme;
  document.documentElement.dataset.theme=theme;
  document.body.dataset.theme=theme;
  document.body.classList.toggle('is-night',theme==='dark');
  try{localStorage.setItem('kayas-theme',theme);}catch(_e){}
  const button=byId('themeButton');
  if(button){
    button.textContent=theme==='dark'?'☀':'☾';
    button.title=theme==='dark'?'Açık temaya geç':'Koyu temaya geç';
  }
  const night=byId('nightToggle');
  if(night)night.checked=theme==='dark';
  const e=engine();
  if(e.THREE&&e.scene){
    const bg=theme==='dark'?0x071321:0xe5edf4;
    e.scene.background=new e.THREE.Color(bg);
    if(e.scene.fog&&e.scene.fog.color)e.scene.fog.color.set(bg);
  }
  if(e.renderer&&e.renderer.setClearColor){
    e.renderer.setClearColor(theme==='dark'?0x071321:0xe5edf4,1);
    if('toneMappingExposure' in e.renderer)e.renderer.toneMappingExposure=theme==='dark'?1.08:1.01;
  }
}

function installThemeController(){
  let saved='dark';
  try{saved=localStorage.getItem('kayas-theme')||'dark';}catch(_e){}
  applyTheme(saved);
  const button=byId('themeButton');
  if(button)button.addEventListener('click',ev=>{
    ev.preventDefault();
    ev.stopImmediatePropagation();
    applyTheme(state.theme==='dark'?'light':'dark');
  },true);
  const night=byId('nightToggle');
  if(night)night.addEventListener('change',ev=>{
    ev.stopImmediatePropagation();
    applyTheme(night.checked?'dark':'light');
  },true);
}

function installPanelController(){
  function toggle(ev){
    if(ev){ev.preventDefault();ev.stopImmediatePropagation();}
    const collapsed=document.body.classList.toggle('panel-collapsed');
    const edge=byId('panelEdgeToggle');
    if(edge)edge.textContent=collapsed?'›':'‹';
    [byId('panelToggleHeader'),edge].filter(Boolean).forEach(node=>node.setAttribute('aria-expanded',String(!collapsed)));
    try{localStorage.setItem('kayas-panel-collapsed',collapsed?'1':'0');}catch(_e){}
    setTimeout(()=>window.dispatchEvent(new Event('resize')),80);
  }
  [byId('panelToggleHeader'),byId('panelEdgeToggle')].filter(Boolean).forEach(node=>node.addEventListener('click',toggle,true));
  try{if(localStorage.getItem('kayas-panel-collapsed')==='1')document.body.classList.add('panel-collapsed');}catch(_e){}
}

function setPresentationDefaults(){
  DEBUG_TOGGLES.forEach(id=>{
    const input=byId(id);
    if(input&&input.checked){
      input.checked=false;
      input.dispatchEvent(new Event('change',{bubbles:true}));
    }
  });
  const walk=byId('walkModeToggle');
  if(walk&&walk.checked){
    walk.checked=false;
    walk.dispatchEvent(new Event('change',{bubbles:true}));
  }
}

function boxSize(THREE,obj){
  try{
    const box=new THREE.Box3().setFromObject(obj);
    if(box.isEmpty())return null;
    const size=new THREE.Vector3();
    box.getSize(size);
    return size;
  }catch(_e){return null;}
}

function suppressLowPoly(){
  const e=engine();
  if(!e.THREE||!e.scene)return false;
  let hidden=0;
  e.scene.traverse(obj=>{
    if(!obj||obj===e.scene||obj.userData&&obj.userData.kayasV23Reviewed)return;
    const name=String(obj.name||'').toLowerCase();
    const zone=String(obj.userData&&obj.userData.zoneId||'').toLowerCase();
    const type=obj.geometry&&obj.geometry.type||'';
    let hide=false;
    if(/visitor-route|wayfinding|route-arrow|route-marker|debug|helper|axis|arrowhelper|sphere-marker|pulse-marker/.test(name))hide=true;
    if(/kayas-v21-professional-person|kayas-v21-professional-plant|person-|plant-|planter|foliage|crown/.test(name))hide=true;
    if(zone==='design_layer'&&/(SphereGeometry|CylinderGeometry|CapsuleGeometry)/.test(type)){
      const s=boxSize(e.THREE,obj);
      if(s&&s.y>.25&&s.y<2.2)hide=true;
    }
    if(!hide&&type==='SphereGeometry'&&obj.material&&obj.material.color){
      const c=obj.material.color;
      const s=boxSize(e.THREE,obj);
      if(s&&s.y>.35&&s.y<2.6&&c.g>c.r*1.15&&c.g>c.b*1.05)hide=true;
    }
    if(hide&&obj.visible){obj.visible=false;hidden++;}
    obj.userData=obj.userData||{};
    obj.userData.kayasV23Reviewed=true;
  });
  state.suppressed+=hidden;
  return true;
}

function makeFloorTexture(THREE,dark){
  const canvas=document.createElement('canvas');
  canvas.width=canvas.height=256;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle=dark?'#616b76':'#dce3e9';
  ctx.fillRect(0,0,256,256);
  const g=ctx.createLinearGradient(0,0,256,256);
  g.addColorStop(0,dark?'rgba(255,255,255,.03)':'rgba(255,255,255,.25)');
  g.addColorStop(1,dark?'rgba(0,0,0,.08)':'rgba(70,90,105,.05)');
  ctx.fillStyle=g;
  ctx.fillRect(0,0,256,256);
  ctx.strokeStyle=dark?'rgba(210,225,238,.10)':'rgba(75,100,120,.12)';
  for(let i=0;i<=256;i+=32){
    ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,256);ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(256,i);ctx.stroke();
  }
  const texture=new THREE.CanvasTexture(canvas);
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
  texture.repeat.set(5,5);
  if('colorSpace' in texture)texture.colorSpace=THREE.SRGBColorSpace;
  return texture;
}

function tuneScene(){
  const e=engine();
  if(!e.THREE||!e.scene||!e.renderer)return false;
  const mobile=matchMedia('(max-width:900px)').matches;
  e.renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile?1.25:1.75));
  if(e.THREE.SRGBColorSpace)e.renderer.outputColorSpace=e.THREE.SRGBColorSpace;
  if(e.THREE.ACESFilmicToneMapping)e.renderer.toneMapping=e.THREE.ACESFilmicToneMapping;
  e.renderer.toneMappingExposure=state.theme==='dark'?1.08:1.01;
  if(e.renderer.shadowMap){
    e.renderer.shadowMap.enabled=!mobile;
    e.renderer.shadowMap.type=e.THREE.PCFSoftShadowMap;
  }
  const floorTexture=makeFloorTexture(e.THREE,state.theme==='dark');
  e.scene.traverse(obj=>{
    if(!obj||!obj.isMesh||!obj.material)return;
    obj.castShadow=!mobile;
    obj.receiveShadow=true;
    const name=String(obj.name||'').toLowerCase();
    const mats=Array.isArray(obj.material)?obj.material:[obj.material];
    mats.forEach(mat=>{
      if(!mat)return;
      if(/rack|cabinet|ic8000/.test(name)){mat.metalness=.72;mat.roughness=.24;}
      else if(/glass/.test(name)){
        mat.roughness=.08;mat.metalness=0;
        if('transmission' in mat)mat.transmission=.45;
        mat.transparent=true;mat.opacity=.28;
      }else if(/floor/.test(name)){
        mat.roughness=.62;mat.metalness=.03;
        if(!mat.map)mat.map=floorTexture;
      }else if(/wall/.test(name)){
        mat.roughness=.52;mat.metalness=.02;
      }
      mat.needsUpdate=true;
    });
  });
  if(!e.scene.getObjectByName('kayas-v23-hemi')){
    const hemi=new e.THREE.HemisphereLight(0xddeeff,0x1b2631,state.theme==='dark'?.50:.72);
    hemi.name='kayas-v23-hemi';e.scene.add(hemi);
    const key=new e.THREE.DirectionalLight(0xf7fbff,state.theme==='dark'?1.06:1.28);
    key.name='kayas-v23-key';key.position.set(-28,48,26);key.castShadow=!mobile;
    if(key.shadow){key.shadow.mapSize.set(mobile?1024:2048,mobile?1024:2048);key.shadow.bias=-.0002;key.shadow.normalBias=.025;}
    e.scene.add(key);
    const fill=new e.THREE.DirectionalLight(0x78b7ff,.30);
    fill.name='kayas-v23-fill';fill.position.set(34,24,-26);e.scene.add(fill);
  }
  return true;
}

function installGalleryFallback(){
  const bind=()=>qsa('.gallery-hero-image img,.gallery-grid img').forEach(img=>{
    if(img.dataset.v23Bound)return;
    img.dataset.v23Bound='1';
    img.addEventListener('error',()=>{
      img.style.display='none';
      const parent=img.parentElement;
      if(parent&&!parent.querySelector('.asset-error')){
        const note=document.createElement('div');
        note.className='asset-error';
        note.textContent='Görsel yüklenemedi';
        parent.appendChild(note);
      }
    });
  });
  bind();
  new MutationObserver(bind).observe(document.body,{subtree:true,childList:true});
}

function chooseOverview(){
  const top=qsa('[data-view="top"]')[0];
  if(top)top.click();
}

function startSceneUpgrade(){
  let attempts=0;
  const timer=setInterval(()=>{
    attempts++;
    setPresentationDefaults();
    const a=suppressLowPoly();
    const b=tuneScene();
    if(a&&b){
      clearInterval(timer);
      setTimeout(chooseOverview,350);
      applyTheme(state.theme);
      state.ready=true;
      window.__KAYAS_V23__={version:VERSION,ready:true,suppressed:state.suppressed};
    }else if(attempts>160){
      clearInterval(timer);
      window.__KAYAS_V23__={version:VERSION,ready:false,suppressed:state.suppressed};
    }
  },250);
}

function install(){
  fixMetrics();
  installViewController();
  installThemeController();
  installPanelController();
  installGalleryFallback();
  setView('model');
  startSceneUpgrade();
  document.documentElement.dataset.kayasVersion=VERSION;
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
else install();
})();
