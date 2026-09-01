(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
let queued=false;

function hashState(){
  const q=new URLSearchParams(location.hash.replace(/^#/,''));
  return {view:(q.get('view')||'T00').toUpperCase(),mode:(q.get('mode')||'PRESENTATION').toUpperCase()};
}
function setViewAttr(){
  const h=hashState();
  if(h.mode==='PRESENTATION'&&(h.view==='T02'||h.view==='T05')) document.body.dataset.dctsFinalView=h.view;
  else delete document.body.dataset.dctsFinalView;
}
function marker(svg,id,color){
  const ns='http://www.w3.org/2000/svg';
  let defs=svg.querySelector('defs[data-v16]');
  if(!defs){defs=document.createElementNS(ns,'defs');defs.dataset.v16='1';svg.prepend(defs);}
  if(defs.querySelector('#'+id))return;
  const m=document.createElementNS(ns,'marker');
  m.setAttribute('id',id);m.setAttribute('viewBox','0 0 10 10');m.setAttribute('refX','8.4');m.setAttribute('refY','5');m.setAttribute('markerWidth','4.2');m.setAttribute('markerHeight','4.2');m.setAttribute('orient','auto-start-reverse');
  const p=document.createElementNS(ns,'path');p.setAttribute('d','M 0 1.5 L 8.5 5 L 0 8.5 z');p.setAttribute('fill',color);p.setAttribute('opacity','.72');m.appendChild(p);defs.appendChild(m);
}
function semanticMarker(path){
  if(path.classList.contains('intent'))return'dcts-v16-arrow-intent';
  if(path.classList.contains('management'))return'dcts-v16-arrow-management';
  if(path.classList.contains('security'))return'dcts-v16-arrow-security';
  if(path.classList.contains('service'))return'dcts-v16-arrow-service';
  if(path.classList.contains('backup'))return'dcts-v16-arrow-backup';
  return'dcts-v16-arrow-data';
}
function ensureMarkers(svg){
  marker(svg,'dcts-v16-arrow-data','#2d78b7');
  marker(svg,'dcts-v16-arrow-management','#6a55a2');
  marker(svg,'dcts-v16-arrow-security','#c94e5d');
  marker(svg,'dcts-v16-arrow-service','#2c8b8d');
  marker(svg,'dcts-v16-arrow-backup','#4c8a68');
  marker(svg,'dcts-v16-arrow-intent','#b97824');
}
function anchor(a,b,stage){
  const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect(),sr=stage.getBoundingClientRect();
  const ac={x:ar.left-sr.left+ar.width/2,y:ar.top-sr.top+ar.height/2},bc={x:br.left-sr.left+br.width/2,y:br.top-sr.top+br.height/2};
  const dx=bc.x-ac.x,dy=bc.y-ac.y;let sx=ac.x,sy=ac.y,tx=bc.x,ty=bc.y;
  if(Math.abs(dx)>Math.abs(dy)){sx+=Math.sign(dx)*ar.width/2;tx-=Math.sign(dx)*br.width/2;}else{sy+=Math.sign(dy)*ar.height/2;ty-=Math.sign(dy)*br.height/2;}
  return{sx,sy,tx,ty};
}
function pathD(a,b,stage){
  const {sx,sy,tx,ty}=anchor(a,b,stage),dx=tx-sx,dy=ty-sy;
  if(Math.abs(dx)<28||Math.abs(dy)<28)return`M ${sx} ${sy} L ${tx} ${ty}`;
  if(Math.abs(dy)>=Math.abs(dx)){const my=sy+dy*.5;return`M ${sx} ${sy} L ${sx} ${my} L ${tx} ${my} L ${tx} ${ty}`;}
  const mx=sx+dx*.5;return`M ${sx} ${sy} L ${mx} ${sy} L ${mx} ${ty} L ${tx} ${ty}`;
}
function reflowEdges(root){
  const stage=$('.dcts-v15-stage',root),svg=$('.dcts-v15-edge-svg',root);if(!stage||!svg)return;
  ensureMarkers(svg);
  $$('.dcts-v15-edge',svg).forEach(p=>{
    const f=p.dataset.from,t=p.dataset.to;if(!f||!t)return;
    const a=$(`[data-v15-object="${CSS.escape(f)}"]`,root),b=$(`[data-v15-object="${CSS.escape(t)}"]`,root);if(!a||!b)return;
    p.setAttribute('d',pathD(a,b,stage));
    p.setAttribute('marker-end',`url(#${semanticMarker(p)})`);
    const title=p.querySelector('title');
    if(p.classList.contains('intent')&&title&&!title.textContent.startsWith('DESIGN INTENT')) title.textContent=`DESIGN INTENT · NOT CANONICAL · ${title.textContent}`;
  });
}
function addInfo(root){
  const stage=$('.dcts-v15-stage',root);if(!stage||$('.dcts-v16-info',stage))return;
  const b=document.createElement('button');b.type='button';b.className='dcts-v16-info';b.textContent='i';b.title='Topology projection rules';
  const pop=document.createElement('div');pop.className='dcts-v16-info-pop';pop.innerHTML='<b>Evidence-safe topology projection.</b><br>Only current-view objects and declared relationships are rendered. Design intent remains non-canonical. Missing ports, speeds, optics, A/B paths, VLAN/VRF/VNI or undeclared links remain OPEN-CONFIRMATION REQUIRED.';
  b.addEventListener('click',e=>{e.stopPropagation();pop.classList.toggle('show');});
  document.addEventListener('click',()=>pop.classList.remove('show'));
  stage.appendChild(b);stage.appendChild(pop);
}
function polish(){
  setViewAttr();
  const root=$('#dctsV15Projection');if(!root||!document.body.dataset.dctsFinalView)return;
  addInfo(root);
  requestAnimationFrame(()=>reflowEdges(root));
  document.documentElement.dataset.dctsFinalPolish='v1a16';
}
function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;polish();});}
function boot(){
  polish();
  const target=$('.viewport')||document.body;
  new MutationObserver(queue).observe(target,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});
  window.addEventListener('hashchange',()=>setTimeout(polish,40));
  window.addEventListener('resize',()=>setTimeout(polish,50));
  document.addEventListener('click',()=>setTimeout(polish,30),true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
