/* KAYAS T02/T06 visual review refinement — preview only, canonical graph untouched. */
(function(){
'use strict';
if(window.KAYAS_NETWORK_ENGINEERING_V1A2)return;
window.KAYAS_NETWORK_ENGINEERING_V1A2=true;

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
let raf=0, fitTimer=0, mo=null, ro=null;

function currentView(){
  try{return typeof view!=='undefined'?view:''}catch(_){return''}
}
function patchBreadcrumb(){
  const bc=$('#breadcrumb')||$('.breadcrumb');
  if(!bc)return;
  const v=currentView();
  if(v==='T02'){
    bc.innerHTML='<b>KAYAS</b><span>/</span><span class="current">T02 · Network Logical / Engineering Connectivity</span>';
  }else if(v==='T06'){
    bc.innerHTML='<b>KAYAS</b><span>/</span><span class="current">T06 · Service &amp; Capacity Model</span>';
  }
}
function canvasGeom(node,canvas){
  if(!node||!canvas)return null;
  const cr=canvas.getBoundingClientRect(),r=node.getBoundingClientRect();
  const sx=canvas.offsetWidth/(cr.width||canvas.offsetWidth||1);
  const sy=canvas.offsetHeight/(cr.height||canvas.offsetHeight||1);
  return {
    x:(r.left-cr.left)*sx,y:(r.top-cr.top)*sy,w:r.width*sx,h:r.height*sy,
    cx:(r.left-cr.left+r.width/2)*sx,cy:(r.top-cr.top+r.height/2)*sy
  };
}
function cluster(id){
  const canvas=$('.kxne-canvas');
  const n=canvas?.querySelector(`[data-cluster="${CSS.escape(id)}"]`);
  return canvasGeom(n,canvas);
}
function members(id){
  const canvas=$('.kxne-canvas');
  if(!canvas)return[];
  return $$(`.kxne-member[data-object="${CSS.escape(id)}"]`,canvas).map(n=>canvasGeom(n,canvas)).filter(Boolean);
}
function titleFor(text){
  const t=document.createElementNS('http://www.w3.org/2000/svg','title');
  t.textContent=text;
  return t;
}
function svgPath(d,cls,review,title){
  const p=document.createElementNS('http://www.w3.org/2000/svg','path');
  p.setAttribute('d',d); p.setAttribute('class',cls); p.dataset.review=review;
  p.appendChild(titleFor(title));
  return p;
}

const IDS={
  spine:'topobj_6c9587efb3d0b49bed8e',
  leaf:'topobj_689f284af5e658a26b88',
  oob:'topobj_56b5cee0b4c39857a70a',
  controller:'topobj_bbc53ea9c663404b7a82',
  analytics:'topobj_60b6648480d5d86edc25'
};

function rebuildFabricBus(){
  if(currentView()!=='T02')return;
  const svg=$('.kxne-links'),canvas=$('.kxne-canvas');
  if(!svg||!canvas)return;
  $$('[data-intent="AINT-005"].illustrative',svg).forEach(n=>n.remove());
  $$('[data-review^="fabric-"]',svg).forEach(n=>n.remove());

  const sp=members(IDS.spine),lf=members(IDS.leaf);
  if(!sp.length||!lf.length)return;
  const top=Math.max(...sp.map(g=>g.y+g.h));
  const bottom=Math.min(...lf.map(g=>g.y));
  const busY=top+(bottom-top)*0.48;
  const xs=[...sp.map(g=>g.cx),...lf.map(g=>g.cx)];
  const minX=Math.min(...xs)-18,maxX=Math.max(...xs)+18;
  const title='AINT-005 · Spine → Leaf fabric intent · member-to-member mapping is not asserted · OPEN-CONFIRMATION REQUIRED';

  svg.appendChild(svgPath(`M ${minX} ${busY} H ${maxX}`,'kxne-path illustrative','fabric-bus',title));
  sp.forEach((g,i)=>svg.appendChild(svgPath(`M ${g.cx} ${g.y+g.h} V ${busY}`,'kxne-path illustrative',`fabric-spine-${i+1}`,title)));
  lf.forEach((g,i)=>svg.appendChild(svgPath(`M ${g.cx} ${busY} V ${g.y}`,'kxne-path illustrative',`fabric-leaf-${i+1}`,title)));
  const note=$('.kxne-fabric-note');
  if(note)note.textContent='FABRIC INTENT · MEMBER-TO-MEMBER MAPPING NOT ASSERTED';
}
function routeMgmt(intent,sourceId,side,lane){
  const svg=$('.kxne-links'),canvas=$('.kxne-canvas');
  if(!svg||!canvas)return;
  const p=svg.querySelector(`.kxne-path[data-intent="${intent}"]`);
  const a=cluster(sourceId),b=cluster(IDS.spine);
  if(!p||!a||!b)return;
  const startX=a.cx,startY=a.y;
  const channelY=Math.max(0,startY-9-(lane*7));
  const corridorX=side==='left' ? 48+(lane*10) : canvas.offsetWidth-48-(lane*14);
  const targetX=side==='left'?b.x:b.x+b.w,targetY=b.cy;
  p.setAttribute('d',`M ${startX} ${startY} V ${channelY} H ${corridorX} V ${targetY} H ${targetX}`);
  p.dataset.review='management-corridor';
}
function refineRoutes(){
  if(currentView()!=='T02')return;
  rebuildFabricBus();
  routeMgmt('AINT-013',IDS.oob,'left',0);
  routeMgmt('AINT-014',IDS.controller,'right',1);
  routeMgmt('AINT-015',IDS.analytics,'right',0);
  $$('.kxne-label.management').forEach(n=>n.style.display='none');
}
function fitT02(){
  clearTimeout(fitTimer);
  if(currentView()!=='T02')return;
  fitTimer=setTimeout(()=>{
    try{$('#fitBtn')?.click()}catch(_){}
  },90);
}
function sync(){
  patchBreadcrumb();
  if(currentView()==='T02'){
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>requestAnimationFrame(()=>{refineRoutes();fitT02()}));
  }
}
function hookRender(){
  try{
    if(typeof render==='function'&&!render.__kxV1a2){
      const prev=render;
      const wrapped=function(){const out=prev.apply(this,arguments);setTimeout(sync,0);return out};
      wrapped.__kxV1a2=true;
      render=wrapped;
    }
  }catch(_){}
}
function observe(){
  try{
    mo?.disconnect();
    mo=new MutationObserver(()=>sync());
    const root=$('#groups')||document.body;
    mo.observe(root,{childList:true,subtree:true});
  }catch(_){}
  try{
    ro?.disconnect();
    const c=$('.scene-viewport');
    if(c&&window.ResizeObserver){ro=new ResizeObserver(()=>sync());ro.observe(c)}
  }catch(_){}
}
hookRender();
observe();
document.addEventListener('click',()=>setTimeout(sync,0),true);
window.addEventListener('resize',sync);
window.addEventListener('hashchange',sync);
setTimeout(sync,0);
setTimeout(sync,250);
})();
