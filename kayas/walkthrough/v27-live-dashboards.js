(function(){
'use strict';

const VERSION='20260804-v27-live-dashboards-r1';
const state={ready:false,screens:0,textures:0,frames:0,lastFrameAt:0,errors:[]};
const dashboards=[];
let raf=0;

function engine(){return {THREE:window.THREE,scene:window.__KAYAS_SCENE__};}
function nameOf(o){return String(o&&o.name||'').toLowerCase();}
function publish(){window.__KAYAS_V27_STATUS={...state,version:VERSION};}

function drawDashboard(entry,time){
  const {canvas,ctx,index,texture}=entry;
  const w=canvas.width,h=canvas.height;
  const dark=document.documentElement.dataset.theme!=='light';
  const bg=dark?'#06111d':'#eef4f8';
  const panel=dark?'#0d2234':'#ffffff';
  const text=dark?'#eaf6ff':'#173247';
  const muted=dark?'#7fa4bd':'#587389';
  const cyan='#16b9d4',green='#35d07f',amber='#f2b84b',red='#e0162f';
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  const grad=ctx.createLinearGradient(0,0,w,0);grad.addColorStop(0,red);grad.addColorStop(.55,'#ff4a5e');grad.addColorStop(1,cyan);
  ctx.fillStyle=grad;ctx.fillRect(0,0,w,10);
  ctx.fillStyle=panel;ctx.fillRect(18,24,w-36,h-42);
  ctx.fillStyle=text;ctx.font='700 34px Arial, sans-serif';ctx.fillText('H3C iDC Operations',34,66);
  ctx.fillStyle=muted;ctx.font='18px Arial, sans-serif';ctx.fillText('KAYAS Data Center · Live Infrastructure View',34,92);
  const phase=time*.001+index*.73;
  const pue=(1.22+Math.sin(phase*.55)*.035).toFixed(2);
  const temp=(22.4+Math.sin(phase*.72)*.8).toFixed(1);
  const load=Math.round(68+Math.sin(phase*.43)*7);
  const alarms=Math.max(0,Math.round(1+Math.sin(phase*.31+1.4)));
  const cards=[['PUE',pue,green],['Hall Temp',temp+'°C',cyan],['IT Load',load+'%',amber],['Active Alarms',String(alarms),alarms>1?red:green]];
  const cardW=(w-86)/4;
  cards.forEach((c,i)=>{
    const x=34+i*(cardW+6),y=116;
    ctx.fillStyle=dark?'#102c42':'#f4f8fb';ctx.fillRect(x,y,cardW,92);
    ctx.fillStyle=muted;ctx.font='17px Arial, sans-serif';ctx.fillText(c[0],x+14,y+25);
    ctx.fillStyle=c[2];ctx.font='700 30px Arial, sans-serif';ctx.fillText(c[1],x+14,y+65);
  });
  const chartX=34,chartY=238,chartW=w-68,chartH=176;
  ctx.fillStyle=dark?'#0a1d2c':'#f7fafc';ctx.fillRect(chartX,chartY,chartW,chartH);
  ctx.strokeStyle=dark?'rgba(126,164,190,.18)':'rgba(65,93,112,.14)';ctx.lineWidth=1;
  for(let i=1;i<5;i++){const y=chartY+i*chartH/5;ctx.beginPath();ctx.moveTo(chartX,y);ctx.lineTo(chartX+chartW,y);ctx.stroke();}
  function line(color,offset,amp){ctx.strokeStyle=color;ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<=48;i++){const x=chartX+i*chartW/48;const y=chartY+chartH*.55+Math.sin(phase+offset+i*.23)*amp+Math.sin(i*.07+offset)*8;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();}
  line(cyan,0,26);line(green,1.8,18);line(amber,3.2,12);
  ctx.fillStyle=muted;ctx.font='16px Arial, sans-serif';ctx.fillText('Cooling efficiency',chartX+12,chartY+24);ctx.fillText('Power load',chartX+188,chartY+24);ctx.fillText('Network throughput',chartX+320,chartY+24);
  const footerY=h-30;
  ctx.fillStyle=muted;ctx.font='15px Arial, sans-serif';ctx.fillText('Tier III design target · 20 pods · 200 cabinets',34,footerY);
  ctx.textAlign='right';ctx.fillText(new Date().toLocaleTimeString('tr-TR',{hour12:false}),w-34,footerY);ctx.textAlign='left';
  texture.needsUpdate=true;
}

function makeTexture(THREE,index){
  const canvas=document.createElement('canvas');canvas.width=768;canvas.height=480;
  const ctx=canvas.getContext('2d');
  if(!ctx)throw new Error('DASHBOARD_2D_CONTEXT_UNAVAILABLE');
  const texture=new THREE.CanvasTexture(canvas);
  if(THREE.SRGBColorSpace)texture.colorSpace=THREE.SRGBColorSpace;
  texture.anisotropy=8;texture.needsUpdate=true;
  const entry={canvas,ctx,index,texture};dashboards.push(entry);drawDashboard(entry,0);state.textures++;
  return texture;
}

function collectScreens(scene){
  const found=[];
  scene.traverse(o=>{
    if(!o||!o.isMesh||!o.material)return;
    const n=nameOf(o);
    if(!/(screen|dashboard|monitor|display|video-wall|noc-display)/.test(n))return;
    if(/frame|stand|bezel|mount|label/.test(n))return;
    found.push(o);
  });
  return found;
}

function applyToScreen(THREE,mesh,index){
  if(mesh.userData&&mesh.userData.kayasV27Dashboard)return false;
  const texture=makeTexture(THREE,index);
  const materials=Array.isArray(mesh.material)?mesh.material:[mesh.material];
  const replacements=materials.map(old=>{
    const material=new THREE.MeshStandardMaterial({map:texture,color:0xffffff,roughness:.16,metalness:.08,emissive:0xffffff,emissiveMap:texture,emissiveIntensity:.72,toneMapped:true});
    if(old&&old.side!==undefined)material.side=old.side;
    return material;
  });
  mesh.material=replacements.length===1?replacements[0]:replacements;
  mesh.userData=mesh.userData||{};mesh.userData.kayasV27Dashboard=true;
  state.screens++;
  return true;
}

function animate(time){
  state.frames++;
  state.lastFrameAt=Math.round(time);
  const mobile=window.matchMedia&&window.matchMedia('(max-width: 900px)').matches;
  const redrawEvery=mobile?8:3;
  if(!document.hidden&&state.frames%redrawEvery===0)dashboards.forEach(entry=>drawDashboard(entry,time));
  if(state.frames%30===0)publish();
  raf=requestAnimationFrame(animate);
}

function install(){
  let attempts=0;
  const timer=setInterval(()=>{
    attempts++;
    if(window.__KAYAS_MODEL_READY!==true||window.__KAYAS_V26_STATUS?.ready!==true){
      if(attempts>600){clearInterval(timer);state.errors.push('MODEL_OR_V26_TIMEOUT');publish();}
      return;
    }
    const {THREE,scene}=engine();if(!THREE||!scene)return;
    clearInterval(timer);
    try{
      const screens=collectScreens(scene);
      screens.slice(0,48).forEach((screen,index)=>applyToScreen(THREE,screen,index));
      if(state.screens===0)state.errors.push('NO_SCREEN_MESHES_FOUND');
      else{state.ready=true;publish();animate(performance.now());}
    }catch(error){state.errors.push(error.stack||error.message||String(error));publish();}
  },250);
}

window.addEventListener('beforeunload',()=>{if(raf)cancelAnimationFrame(raf);},{once:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
