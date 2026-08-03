(function(){
'use strict';

const VERSION='20260803-v24-investor-model';
const state={installed:false,racks:0,screens:0,leds:[],screenTextures:[],suppressed:0,frames:0,lastScreen:0};
const MOBILE=Boolean(window.matchMedia&&window.matchMedia('(max-width:900px)').matches);
const MAX_RACKS=MOBILE?90:220;
const MAX_SCREENS=MOBILE?12:30;

function lexical(name){try{return(0,eval)('typeof '+name+'!=="undefined"?'+name+':undefined');}catch(_e){return undefined;}}
function engine(){return{THREE:window.THREE||lexical('THREE'),scene:window.__KAYAS_SCENE__||lexical('scene'),renderer:window.__KAYAS_RENDERER__||lexical('renderer'),camera:window.__KAYAS_CAMERA__||lexical('camera')};}
function materials(o){if(!o||!o.material)return[];return Array.isArray(o.material)?o.material.filter(Boolean):[o.material];}
function nameOf(o){return String(o&&o.name||'').toLowerCase();}
function boxOf(THREE,o){try{o.geometry&&o.geometry.computeBoundingBox();return o.geometry&&o.geometry.boundingBox?o.geometry.boundingBox.clone():null;}catch(_e){return null;}}
function sizeOf(THREE,b){const s=new THREE.Vector3();b.getSize(s);return s;}
function hash(text){let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return(h>>>0)/4294967295;}
function add(parent,geometry,material,pos,name){const THREE=window.THREE;const m=new THREE.Mesh(geometry,material);m.position.set(pos[0],pos[1],pos[2]);m.name=name||'kayas-v24-mesh';m.castShadow=!MOBILE;m.receiveShadow=true;parent.add(m);return m;}

function physical(THREE,options){const m=new THREE.MeshPhysicalMaterial(Object.assign({roughness:.38,metalness:.2,clearcoat:.16,clearcoatRoughness:.25},options||{}));m.userData=m.userData||{};m.userData.kayasV24=true;return m;}
function basic(THREE,options){const m=new THREE.MeshBasicMaterial(Object.assign({toneMapped:false},options||{}));m.userData=m.userData||{};m.userData.kayasV24=true;return m;}

function suppressInvestorClutter(scene){
  scene.traverse(function(o){
    if(!o||!o.visible)return;
    const n=nameOf(o);
    if(!n)return;
    if(/rack|cabinet|ic8000|server|screen|monitor|dashboard|wall|floor|glass|door|desk|counter|table|chair|reception|mantrap|battery|fiber|hvac|chiller|cooler/.test(n))return;
    const lowPoly=/kayas-v21-professional-person|kayas-v21-professional-plant|person|human|visitor|avatar|figure|receptionist|staff|plant|tree|shrub|foliage|greenery|potted/.test(n);
    const debug=/route-arrow|visitor-route|direction-arrow|debug|gizmo|axis|waypoint|sphere-marker|zone-overlay|quality-badge/.test(n);
    if(lowPoly||debug){o.visible=false;o.userData=o.userData||{};o.userData.kayasV24Suppressed=true;state.suppressed++;}
  });
  ['labelsToggle','zoningToggle','routeToggle','futureToggle','coolingToggle','powerToggle','fiberToggle','safetyToggle'].forEach(function(id){
    const el=document.getElementById(id);if(el&&el.checked){el.checked=false;el.dispatchEvent(new Event('change',{bubbles:true}));}
  });
}

function createLogoTexture(THREE){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=160;
  const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='#f7f9fb';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='#e3132c';ctx.font='900 112px Arial, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('H3C',256,84);
  const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;t.needsUpdate=true;return t;
}

function enhanceRack(THREE,o,index,logoTexture){
  if(state.racks>=MAX_RACKS||o.userData&&o.userData.kayasV24Rack)return;
  const n=nameOf(o);
  if(!/rack-body|cabinet-body|ic8000-rack|server-rack|rack cabinet|rack-cabinet/.test(n))return;
  const b=boxOf(THREE,o);if(!b)return;const s=sizeOf(THREE,b);
  if(s.y<1.2||s.y>5.2||s.x<.25||s.x>3.2||s.z<.25||s.z>3.2)return;
  const front=b.max.z+s.z*.012;const y=(b.min.y+b.max.y)/2;
  const frame=physical(THREE,{color:0x111a23,roughness:.28,metalness:.72,clearcoat:.28});
  const glass=physical(THREE,{color:0x102436,transparent:true,opacity:.58,transmission:.12,roughness:.16,metalness:.25,clearcoat:.76,depthWrite:false});
  const blade=physical(THREE,{color:0x18242f,roughness:.36,metalness:.68});
  const rail=.035*Math.max(.75,s.x);
  add(o,new THREE.BoxGeometry(rail,s.y*.94,s.z*.025),frame,[b.min.x+s.x*.04,y,front],'kayas-v24-rack-rail');
  add(o,new THREE.BoxGeometry(rail,s.y*.94,s.z*.025),frame,[b.max.x-s.x*.04,y,front],'kayas-v24-rack-rail');
  add(o,new THREE.BoxGeometry(s.x*.90,s.y*.90,s.z*.022),glass,[(b.min.x+b.max.x)/2,y,front+s.z*.01],'kayas-v24-rack-glass-door');
  const rows=MOBILE?12:20;
  for(let r=0;r<rows;r++){
    const yy=b.min.y+s.y*(.09+(r/(rows-1))*.78);
    add(o,new THREE.BoxGeometry(s.x*.76,s.y*.018,s.z*.035),blade,[(b.min.x+b.max.x)/2,yy,front+s.z*.025],'kayas-v24-server-blade');
    if(r%2===0){
      const seed=hash(o.uuid+':'+r);
      const color=seed>.91?0xffa928:(seed>.47?0x31d77a:0x2b8cff);
      const ledMat=basic(THREE,{color:color,transparent:true,opacity:.58});
      const led=add(o,new THREE.SphereGeometry(Math.max(.008,s.x*.008),8,6),ledMat,[b.max.x-s.x*.11,yy,front+s.z*.052],'kayas-v24-led');
      state.leds.push({mesh:led,material:ledMat,phase:seed*Math.PI*2,speed:.65+hash(o.uuid+'s'+r)*2.4,base:.2+hash(o.uuid+'b'+r)*.42,alert:color===0xffa928});
    }
  }
  const logoMat=basic(THREE,{map:logoTexture,transparent:true});
  add(o,new THREE.PlaneGeometry(s.x*.42,s.y*.075),logoMat,[(b.min.x+b.max.x)/2,b.max.y-s.y*.075,front+s.z*.060],'kayas-v24-h3c-logo');
  const handle=physical(THREE,{color:0x5c6873,roughness:.2,metalness:.88});
  add(o,new THREE.BoxGeometry(s.x*.025,s.y*.18,s.z*.035),handle,[b.max.x-s.x*.08,y,front+s.z*.055],'kayas-v24-rack-handle');
  o.userData=o.userData||{};o.userData.kayasV24Rack=true;state.racks++;
}

function dashboardCanvas(seed){
  const c=document.createElement('canvas');c.width=768;c.height=432;c.dataset.seed=String(seed);return c;
}
function drawDashboard(item,time){
  const c=item.canvas,ctx=c.getContext('2d'),w=c.width,h=c.height;const seed=item.seed;
  const t=time*.001;
  const grad=ctx.createLinearGradient(0,0,w,h);grad.addColorStop(0,'#031527');grad.addColorStop(.55,'#0b3155');grad.addColorStop(1,'#071b2e');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
  ctx.fillStyle='#e3132c';ctx.font='900 34px Arial';ctx.fillText('H3C',28,46);
  ctx.fillStyle='#d9f1ff';ctx.font='700 18px Arial';ctx.fillText('DATA CENTER INTELLIGENT OPERATIONS',135,42);
  ctx.strokeStyle='rgba(91,206,255,.22)';ctx.lineWidth=1;for(let x=0;x<w;x+=48){ctx.beginPath();ctx.moveTo(x,66);ctx.lineTo(x,h);ctx.stroke();}for(let y=66;y<h;y+=42){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
  const pue=1.28+.06*Math.sin(t*.55+seed*8);const load=62+11*Math.sin(t*.36+seed*11);const temp=21.5+1.2*Math.sin(t*.28+seed*5);
  ctx.fillStyle='rgba(5,22,38,.82)';ctx.strokeStyle='rgba(74,190,255,.42)';ctx.lineWidth=2;ctx.fillRect(24,82,210,152);ctx.strokeRect(24,82,210,152);
  ctx.fillStyle='#91dcff';ctx.font='600 15px Arial';ctx.fillText('PUE',42,108);ctx.fillStyle='#fff';ctx.font='800 58px Arial';ctx.fillText(pue.toFixed(2),42,177);ctx.fillStyle='#4ff0a0';ctx.font='600 14px Arial';ctx.fillText('OPTIMAL RANGE',43,207);
  const cards=[['IT LOAD',load.toFixed(0)+'%'],['TEMP',temp.toFixed(1)+'°C'],['ACTIVE ALARMS',String(Math.max(0,Math.round(2+2*Math.sin(t*.22+seed))))]];
  cards.forEach(function(d,i){const x=252+i*164;ctx.fillStyle='rgba(5,22,38,.82)';ctx.fillRect(x,82,146,92);ctx.strokeStyle='rgba(74,190,255,.35)';ctx.strokeRect(x,82,146,92);ctx.fillStyle='#8ecce9';ctx.font='600 13px Arial';ctx.fillText(d[0],x+13,106);ctx.fillStyle='#fff';ctx.font='800 30px Arial';ctx.fillText(d[1],x+13,148);});
  ctx.fillStyle='rgba(5,22,38,.82)';ctx.fillRect(252,190,474,188);ctx.strokeStyle='rgba(74,190,255,.35)';ctx.strokeRect(252,190,474,188);
  ctx.fillStyle='#8ecce9';ctx.font='600 14px Arial';ctx.fillText('CAPACITY & TEMPERATURE TREND',270,217);
  const baseY=338;ctx.lineWidth=3;[['#4ff0a0',.7],['#52b8ff',1.1],['#ffae3d',1.6]].forEach(function(line,j){ctx.strokeStyle=line[0];ctx.beginPath();for(let x=270;x<=706;x+=8){const ratio=(x-270)/436;const y=baseY-j*25-Math.sin(ratio*12+t*line[1]+seed*6)*10-Math.sin(ratio*27+seed)*4;if(x===270)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();});
  ctx.fillStyle='#9ab9cb';ctx.font='12px Arial';ctx.fillText(new Date().toLocaleTimeString('tr-TR'),615,410);
}

function enhanceScreen(THREE,o,index){
  if(state.screens>=MAX_SCREENS||o.userData&&o.userData.kayasV24Screen)return;
  const n=nameOf(o);if(!/screen|monitor|display|dashboard|video-wall|videowall/.test(n))return;
  if(!o.isMesh||!o.geometry)return;const b=boxOf(THREE,o);if(!b)return;const s=sizeOf(THREE,b);
  if(s.x<.22||s.y<.12||s.x>18||s.y>8)return;
  const canvas=dashboardCanvas(index);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;texture.needsUpdate=true;
  const mat=basic(THREE,{map:texture,color:0xffffff});
  o.material=mat;o.userData=o.userData||{};o.userData.kayasV24Screen=true;state.screenTextures.push({canvas:canvas,texture:texture,seed:hash(o.uuid)});state.screens++;
}

function tuneScene(THREE,scene,renderer){
  if(renderer){renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,MOBILE?1.35:2));if('toneMapping' in renderer)renderer.toneMapping=THREE.ACESFilmicToneMapping;if('toneMappingExposure' in renderer)renderer.toneMappingExposure=document.documentElement.dataset.theme==='light'?1.02:1.16;if(renderer.shadowMap){renderer.shadowMap.enabled=!MOBILE;renderer.shadowMap.type=THREE.PCFSoftShadowMap;}}
  let casters=0;
  scene.traverse(function(o){if(!o||!o.isMesh)return;const n=nameOf(o);materials(o).forEach(function(m){if(!m||m.userData&&m.userData.kayasV24Tuned)return;m.userData=m.userData||{};m.userData.kayasV24Tuned=true;if(/glass|facade|observation/.test(n)&&!/screen/.test(n)){m.transparent=true;m.opacity=document.documentElement.dataset.theme==='light'?.34:.26;m.depthWrite=false;if('roughness' in m)m.roughness=.10;if('metalness' in m)m.metalness=.03;}else if(/floor|tile|raised/.test(n)){if('roughness' in m)m.roughness=.62;if('metalness' in m)m.metalness=.04;}else if(/wall|partition|ceiling/.test(n)){if('roughness' in m)m.roughness=.72;if('metalness' in m)m.metalness=0;}else if(/rack|cabinet|ic8000|server/.test(n)){if('roughness' in m)m.roughness=.28;if('metalness' in m)m.metalness=.72;}});if(!MOBILE&&casters<650&&/rack|cabinet|desk|counter|table|door|wall/.test(n)){o.castShadow=true;o.receiveShadow=true;casters++;}});
}

function install(){
  const e=engine();if(!e.THREE||!e.scene||!e.renderer)return false;const THREE=e.THREE;
  suppressInvestorClutter(e.scene);tuneScene(THREE,e.scene,e.renderer);
  const logoTexture=createLogoTexture(THREE);let ri=0,si=0;
  e.scene.traverse(function(o){if(!o)return;enhanceRack(THREE,o,ri++,logoTexture);enhanceScreen(THREE,o,si++);});
  state.installed=true;window.__KAYAS_V24_STATUS__={version:VERSION,installed:true,racks:state.racks,screens:state.screens,leds:state.leds.length,suppressed:state.suppressed};
  document.documentElement.dataset.kayasVisualVersion='v24';
  return true;
}

function animate(now){
  if(state.installed){state.leds.forEach(function(l){let p=(Math.sin(now*.001*l.speed+l.phase)+1)/2;if(l.alert)p=Math.pow(p,7);l.material.opacity=Math.min(.96,l.base+p*.62);});if(now-state.lastScreen>80){state.lastScreen=now;state.screenTextures.forEach(function(item){drawDashboard(item,now);item.texture.needsUpdate=true;});}}
  requestAnimationFrame(animate);
}

let attempts=0;const timer=setInterval(function(){attempts++;if((window.__KAYAS_MODEL_READY===true&&install())||attempts>360)clearInterval(timer);},100);
window.addEventListener('kayas:themechange',function(){const e=engine();if(e.THREE&&e.scene&&e.renderer)tuneScene(e.THREE,e.scene,e.renderer);});
requestAnimationFrame(animate);
})();
