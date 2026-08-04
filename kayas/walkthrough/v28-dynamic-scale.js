(function(){
'use strict';

const VERSION='20260804-v28-dynamic-scale';
const state={ready:false,updates:0,lastMeters:0,lastPixels:0,errors:[]};
let raf=0,lastSignature='';

function publish(){window.__KAYAS_V28_STATUS={...state,version:VERSION};}
function byId(id){return document.getElementById(id);}
function niceDistance(raw){
  if(!Number.isFinite(raw)||raw<=0)return 10;
  const power=Math.pow(10,Math.floor(Math.log10(raw)));
  const scaled=raw/power;
  const nice=scaled>=5?5:scaled>=2?2:1;
  return nice*power;
}
function cameraMetersPerPixel(camera,viewportHeight){
  if(!camera||viewportHeight<=0)return null;
  if(camera.isOrthographicCamera){
    const zoom=Math.max(.0001,Number(camera.zoom)||1);
    return Math.abs((camera.top-camera.bottom)/zoom)/viewportHeight;
  }
  if(camera.isPerspectiveCamera){
    const distance=Math.max(1,Math.abs(Number(camera.position&&camera.position.y)||18));
    const fov=(Number(camera.fov)||50)*Math.PI/180;
    return (2*distance*Math.tan(fov/2))/viewportHeight;
  }
  return null;
}
function update(){
  const control=byId('scaleControl'),line=byId('scaleLine'),mid=byId('scaleMid'),max=byId('scaleMax');
  const camera=window.__KAYAS_CAMERA__,canvas=byId('scene');
  if(!control||!line||!mid||!max||!camera||!canvas)return false;
  const viewHeight=Math.max(1,canvas.clientHeight||window.innerHeight||1);
  const mpp=cameraMetersPerPixel(camera,viewHeight);
  if(!mpp)return false;
  const targetPixels=Math.min(180,Math.max(92,(canvas.clientWidth||window.innerWidth||800)*.13));
  const meters=niceDistance(mpp*targetPixels);
  const pixels=Math.max(64,Math.min(220,meters/mpp));
  const signature=[meters.toFixed(3),Math.round(pixels),document.body.dataset.activeView||'model'].join('|');
  if(signature===lastSignature)return true;
  lastSignature=signature;
  line.style.width=Math.round(pixels)+'px';
  max.textContent=(meters>=1000?(meters/1000).toFixed(meters%1000?1:0)+' km':meters.toFixed(meters<10?1:0)+' m');
  const half=meters/2;
  mid.textContent=half>=1000?(half/1000).toFixed(half%1000?1:0):half.toFixed(half<10?1:0);
  control.hidden=(document.body.dataset.activeView||'model')!=='model';
  state.ready=true;state.updates++;state.lastMeters=meters;state.lastPixels=Math.round(pixels);publish();
  return true;
}
function loop(){
  try{update();}catch(error){state.errors.push(error.message||String(error));publish();}
  raf=requestAnimationFrame(loop);
}
function install(){
  window.addEventListener('resize',update,{passive:true});
  document.addEventListener('click',event=>{if(event.target.closest('[data-panel],[data-view],#panelToggleHeader,#panelEdgeToggle'))setTimeout(update,80);},true);
  loop();
}
window.addEventListener('beforeunload',()=>{if(raf)cancelAnimationFrame(raf);},{once:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
