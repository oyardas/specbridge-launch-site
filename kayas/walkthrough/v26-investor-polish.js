(function(){
'use strict';
const VERSION='20260803-v26-investor-polish';
const state={ready:false,hiddenPrimitive:0,hiddenDebug:0,topViewApplied:false,errors:[]};
const PRESERVE=/(rack|cabinet|ic8000|server|screen|monitor|dashboard|led|light|lamp|camera|hvac|chiller|cooler|fan|door|handle|wall|floor|ceiling|glass|table|desk|chair|reception|mantrap|battery|fiber|pipe|duct|sprinkler)/i;
const DEBUG=/(route|arrow|waypoint|debug|gizmo|axis|helper|marker|overlay|future|zone-color|visitor-path)/i;
function nameOf(o){return String(o&&o.name||'');}
function parentNames(o){let s='';for(let n=o;n;n=n.parent)s+=' '+nameOf(n);return s;}
function bboxSize(THREE,o){try{o.geometry.computeBoundingBox();const b=o.geometry.boundingBox;if(!b)return null;const v=new THREE.Vector3();b.getSize(v);return v;}catch(_e){return null;}}
function hide(o,kind){if(!o||!o.visible)return;o.visible=false;o.userData=o.userData||{};o.userData.kayasV26Hidden=kind;if(kind==='primitive')state.hiddenPrimitive++;else state.hiddenDebug++;}
function cleanScene(THREE,scene){
 scene.traverse(o=>{
   if(!o||o===scene||!o.visible)return;
   const names=parentNames(o);
   if(DEBUG.test(names)){hide(o,'debug');return;}
   if(PRESERVE.test(names)||!o.isMesh||!o.geometry)return;
   const type=String(o.geometry.type||'');
   if(!/(SphereGeometry|ConeGeometry|CapsuleGeometry|IcosahedronGeometry|OctahedronGeometry|DodecahedronGeometry)/.test(type))return;
   const size=bboxSize(THREE,o);if(!size)return;
   const max=Math.max(size.x,size.y,size.z),min=Math.min(size.x,size.y,size.z);
   if(max>.12&&max<3.25&&min>.02)hide(o,'primitive');
 });
}
function disableInvestorOverlays(){
 ['labelsToggle','zoningToggle','routeToggle','futureToggle','coolingToggle','powerToggle','fiberToggle','safetyToggle'].forEach(id=>{
   const el=document.getElementById(id);if(!el)return;
   if(el.checked){el.checked=false;el.dispatchEvent(new Event('change',{bubbles:true}));}
 });
}
function applyTopView(){
 const button=document.querySelector('[data-view="top"]');
 if(!button)return false;
 try{button.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));state.topViewApplied=true;return true;}catch(_e){return false;}
}
function tuneRenderer(THREE,renderer){
 if(!renderer)return;
 try{renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,window.innerWidth<900?1.25:1.85));}catch(_e){}
 if(THREE.ACESFilmicToneMapping)renderer.toneMapping=THREE.ACESFilmicToneMapping;
 if(THREE.SRGBColorSpace&&'outputColorSpace'in renderer)renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMappingExposure=document.documentElement.dataset.theme==='light'?1.0:1.08;
 if(renderer.shadowMap){renderer.shadowMap.enabled=window.innerWidth>=900;if(THREE.PCFSoftShadowMap)renderer.shadowMap.type=THREE.PCFSoftShadowMap;}
}
function refineMaterials(scene){
 scene.traverse(o=>{
   if(!o||!o.isMesh||!o.material)return;
   const names=parentNames(o).toLowerCase();
   const mats=Array.isArray(o.material)?o.material:[o.material];
   mats.forEach(m=>{
     if(!m||m.userData&&m.userData.kayasV26)return;
     if(/wall|partition/.test(names)&&'roughness'in m){m.roughness=.82;if('metalness'in m)m.metalness=.01;}
     else if(/floor|tile|terrace/.test(names)&&'roughness'in m){m.roughness=.58;if('metalness'in m)m.metalness=.04;}
     else if(/glass|window/.test(names)){m.transparent=true;m.opacity=Math.min(Number.isFinite(m.opacity)?m.opacity:.3,.28);m.depthWrite=false;if('roughness'in m)m.roughness=.08;if('transmission'in m)m.transmission=Math.max(m.transmission||0,.72);}
     else if(/rack|cabinet|ic8000/.test(names)&&'roughness'in m){m.roughness=.27;if('metalness'in m)m.metalness=.78;}
     m.userData=m.userData||{};m.userData.kayasV26=true;m.needsUpdate=true;
   });
 });
}
function install(){
 document.body.classList.add('k26-investor-polish');
 disableInvestorOverlays();
 let attempts=0;
 const timer=setInterval(()=>{
   attempts++;
   disableInvestorOverlays();
   const THREE=window.THREE,scene=window.__KAYAS_SCENE__,renderer=window.__KAYAS_RENDERER__;
   if(window.__KAYAS_MODEL_READY!==true||!THREE||!scene||!renderer){
     if(attempts>520){clearInterval(timer);state.errors.push('MODEL_READY_TIMEOUT');window.__KAYAS_V26_STATUS={...state,version:VERSION};}
     return;
   }
   clearInterval(timer);
   try{cleanScene(THREE,scene);refineMaterials(scene);tuneRenderer(THREE,renderer);setTimeout(applyTopView,450);state.ready=true;}catch(e){state.errors.push(e.stack||e.message||String(e));}
   window.__KAYAS_V26_STATUS={...state,version:VERSION};
   window.dispatchEvent(new Event('resize'));
 },250);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
