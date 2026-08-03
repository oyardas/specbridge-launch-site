(function(){
'use strict';

const VERSION='20260803-v25-rack-detail';
const state={ready:false,racks:0,facades:0,logos:0,errors:[]};

function engine(){return {THREE:window.THREE,scene:window.__KAYAS_SCENE__};}
function objectName(object){return String(object&&object.name||'').toLowerCase();}

function makeFacadeTexture(THREE,logoImage){
  const canvas=document.createElement('canvas');
  canvas.width=256;canvas.height=512;
  const ctx=canvas.getContext('2d');
  const gradient=ctx.createLinearGradient(0,0,256,512);
  gradient.addColorStop(0,'#202a34');
  gradient.addColorStop(.45,'#0e151c');
  gradient.addColorStop(1,'#05090d');
  ctx.fillStyle=gradient;ctx.fillRect(0,0,256,512);

  ctx.strokeStyle='rgba(129,157,181,.28)';ctx.lineWidth=2;
  for(let y=62;y<474;y+=22){
    ctx.beginPath();ctx.moveTo(22,y);ctx.lineTo(234,y);ctx.stroke();
    ctx.fillStyle='rgba(95,125,148,.16)';ctx.fillRect(28,y+4,200,8);
  }

  ctx.strokeStyle='rgba(184,209,228,.26)';ctx.lineWidth=3;
  ctx.strokeRect(8,8,240,496);
  ctx.strokeStyle='rgba(0,0,0,.72)';ctx.lineWidth=10;
  ctx.strokeRect(15,15,226,482);

  if(logoImage&&logoImage.complete&&logoImage.naturalWidth>0){
    const maxW=88,maxH=28;
    const ratio=Math.min(maxW/logoImage.naturalWidth,maxH/logoImage.naturalHeight);
    const w=logoImage.naturalWidth*ratio,h=logoImage.naturalHeight*ratio;
    ctx.fillStyle='rgba(255,255,255,.94)';
    ctx.roundRect(18,18,104,38,7);ctx.fill();
    ctx.drawImage(logoImage,26+(88-w)/2,23+(28-h)/2,w,h);
  }else{
    ctx.fillStyle='#e0162f';ctx.font='700 24px Arial, sans-serif';ctx.fillText('H3C',26,47);
  }

  const texture=new THREE.CanvasTexture(canvas);
  if(THREE.SRGBColorSpace)texture.colorSpace=THREE.SRGBColorSpace;
  texture.anisotropy=8;
  texture.needsUpdate=true;
  return texture;
}

function addBox(THREE,parent,size,position,material,name){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(size[0],size[1],size[2]),material);
  mesh.position.set(position[0],position[1],position[2]);
  mesh.name=name;mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}

function addFacade(THREE,rack,texture){
  if(rack.userData&&rack.userData.kayasV25Detailed)return false;
  if(!rack.geometry)return false;
  rack.geometry.computeBoundingBox();
  const box=rack.geometry.boundingBox;
  if(!box)return false;
  const size=new THREE.Vector3();box.getSize(size);
  if(size.y<1.1||size.y>5.2||size.x<.35||size.x>2.4||size.z<.35||size.z>3.2)return false;

  const centerX=(box.min.x+box.max.x)/2;
  const centerY=(box.min.y+box.max.y)/2;
  const frontZ=box.max.z+Math.max(.006,size.z*.008);
  const insetW=size.x*.87;
  const insetH=size.y*.88;

  const group=new THREE.Group();
  group.name='kayas-v25-rack-detail';
  group.userData.kayasV25Detail=true;
  rack.add(group);

  const facadeMaterial=new THREE.MeshStandardMaterial({
    map:texture,color:0xffffff,roughness:.34,metalness:.58,envMapIntensity:1.05,polygonOffset:true,polygonOffsetFactor:-1
  });
  const facade=new THREE.Mesh(new THREE.PlaneGeometry(insetW,insetH),facadeMaterial);
  facade.position.set(centerX,centerY,frontZ);
  facade.name='kayas-v25-perforated-front-door';
  facade.receiveShadow=true;
  group.add(facade);

  const frameMaterial=new THREE.MeshPhysicalMaterial({color:0x111820,roughness:.25,metalness:.84,clearcoat:.18,clearcoatRoughness:.24});
  const frame=.035;
  addBox(THREE,group,[frame,insetH,.035],[centerX-insetW/2,centerY,frontZ+.012],frameMaterial,'kayas-v25-front-frame');
  addBox(THREE,group,[frame,insetH,.035],[centerX+insetW/2,centerY,frontZ+.012],frameMaterial,'kayas-v25-front-frame');
  addBox(THREE,group,[insetW,frame,.035],[centerX,centerY-insetH/2,frontZ+.012],frameMaterial,'kayas-v25-front-frame');
  addBox(THREE,group,[insetW,frame,.035],[centerX,centerY+insetH/2,frontZ+.012],frameMaterial,'kayas-v25-front-frame');

  const handleMaterial=new THREE.MeshPhysicalMaterial({color:0x7b8791,roughness:.18,metalness:.92,clearcoat:.12});
  addBox(THREE,group,[Math.max(.025,size.x*.025),insetH*.18,.05],[centerX+insetW*.37,centerY,frontZ+.045],handleMaterial,'kayas-v25-door-handle');

  const statusMaterial=new THREE.MeshStandardMaterial({color:0x102532,emissive:0x0c8fac,emissiveIntensity:1.1,roughness:.28,metalness:.18});
  addBox(THREE,group,[insetW*.32,Math.max(.035,insetH*.025),.03],[centerX,centerY+insetH*.42,frontZ+.038],statusMaterial,'kayas-v25-status-strip');

  rack.userData=rack.userData||{};
  rack.userData.kayasV25Detailed=true;
  state.racks+=1;state.facades+=1;state.logos+=1;
  return true;
}

function collectRacks(scene){
  const result=[];
  const seen=new Set();
  scene.traverse(object=>{
    if(!object||!object.isMesh||!object.geometry||seen.has(object.uuid))return;
    const name=objectName(object);
    if(!/(rack-body|cabinet-body|ic8000-rack|server-rack|rack cabinet|it cabinet)/.test(name))return;
    if(/door|handle|screen|led|frame|detail/.test(name))return;
    seen.add(object.uuid);result.push(object);
  });
  return result;
}

function install(){
  let attempts=0;
  const timer=setInterval(()=>{
    attempts+=1;
    if(window.__KAYAS_MODEL_READY!==true||window.__KAYAS_V24_STATUS?.ready!==true){
      if(attempts>520){clearInterval(timer);state.errors.push('MODEL_OR_V24_TIMEOUT');window.__KAYAS_V25_STATUS={...state,version:VERSION};}
      return;
    }
    const {THREE,scene}=engine();
    if(!THREE||!scene)return;
    clearInterval(timer);
    try{
      const logo=document.querySelector('.h3c-wordmark-logo img');
      const texture=makeFacadeTexture(THREE,logo);
      const racks=collectRacks(scene);
      racks.slice(0,220).forEach(rack=>addFacade(THREE,rack,texture));
      state.ready=true;
    }catch(error){state.errors.push(error.stack||error.message||String(error));}
    window.__KAYAS_V25_STATUS={...state,version:VERSION};
    window.dispatchEvent(new Event('resize'));
  },250);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
else install();
})();
