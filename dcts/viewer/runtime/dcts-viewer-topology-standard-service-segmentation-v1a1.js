(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const norm=v=>String(v||'').trim().toUpperCase();
const oid=o=>o?.object_id||o?.TOPOLOGY_OBJECT_ID||o?.id||'';
const nameOf=o=>o?.display_name||o?.DISPLAY_NAME||o?.name||o?.NAME||'';
const roleOf=o=>o?.functional_role||o?.FUNCTIONAL_ROLE||o?.role||o?.ROLE_ID||'';
const qty=o=>o?.quantity??o?.QUANTITY??o?.represented_object_quantity??o?.REPRESENTED_OBJECT_QUANTITY??null;
const svc=o=>o?.extensions?.service_model||o?.EXTENSIONS?.service_model||o?.extensions?.SERVICE_MODEL||null;
const clean=s=>norm(s).replace(/[^A-Z0-9]+/g,' ');
function labelFor(code,objects){
  const m=svc(objects[0])||{},cap=m.cabinet_capacity??m.CABINET_CAPACITY??qty(objects[0]);
  const map={IAAS:'IAAS / CLOUD',MANAGED_COLO:'MANAGED COLOCATION',MANAGED_COLOCATION:'MANAGED COLOCATION',COLOCATION:'COLOCATION',COLO:'COLOCATION'};
  const base=map[norm(code)]||norm(code).replace(/_/g,' ');
  return cap!=null?`${base} · ${cap}`:base;
}
function companionMatch(o,code){
  if(svc(o))return false;
  const text=clean(`${nameOf(o)} ${roleOf(o)}`),c=norm(code);
  if(c==='IAAS')return /\bIAAS\b/.test(text);
  if(c==='MANAGED_COLO'||c==='MANAGED_COLOCATION')return text.includes('MANAGED COLOCATION')||text.includes('MANAGED COLO');
  if(c==='COLOCATION'||c==='COLO')return text.includes('COLOCATION')&&!text.includes('MANAGED COLOCATION');
  return text.includes(clean(c));
}
function aiMatch(o){const t=clean(`${nameOf(o)} ${roleOf(o)}`);return /\bAI\b/.test(t)||t.includes('HIGH DENSITY')||t.includes('GPU');}
function setRect(el,left,top,width,height){if(!el)return;Object.assign(el.style,{display:'block',left:`${left}px`,top:`${top}px`,width:`${width}px`,height:`${height}px`});}
function place(ids,rect,nodes,vertical=false){const list=ids.map(id=>nodes.get(id)).filter(Boolean);if(!list.length)return;if(vertical){list.forEach((n,i)=>{n.style.left=`${rect.left+rect.width/2}px`;n.style.top=`${rect.top+64+i*82}px`;});return;}const rows=Math.ceil(list.length/5);list.forEach((n,i)=>{const row=Math.floor(i/5),start=row*5,items=Math.min(5,list.length-start),col=i-start;n.style.left=`${rect.left+(col+.5)*(rect.width/items)}px`;n.style.top=`${rect.top+58+row*78}px`;});}
function anchor(a,b,stage){const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect(),sr=stage.getBoundingClientRect(),ac={x:ar.left-sr.left+ar.width/2,y:ar.top-sr.top+ar.height/2},bc={x:br.left-sr.left+br.width/2,y:br.top-sr.top+br.height/2},dx=bc.x-ac.x,dy=bc.y-ac.y;let sx=ac.x,sy=ac.y,tx=bc.x,ty=bc.y;if(Math.abs(dx)>Math.abs(dy)){sx+=Math.sign(dx)*ar.width/2;tx-=Math.sign(dx)*br.width/2;}else{sy+=Math.sign(dy)*ar.height/2;ty-=Math.sign(dy)*br.height/2;}return{sx,sy,tx,ty};}
function pathD(a,b,stage){const {sx,sy,tx,ty}=anchor(a,b,stage),dx=tx-sx,dy=ty-sy;if(Math.abs(dx)<30||Math.abs(dy)<30)return`M ${sx} ${sy} L ${tx} ${ty}`;if(Math.abs(dy)>=Math.abs(dx)){const my=sy+dy*.5;return`M ${sx} ${sy} L ${sx} ${my} L ${tx} ${my} L ${tx} ${ty}`;}const mx=sx+dx*.5;return`M ${sx} ${sy} L ${mx} ${sy} L ${mx} ${ty} L ${tx} ${ty}`;}
function redraw(api,stage){(api.state.edges||[]).forEach(e=>{const a=api.state.nodes.get(e.from),b=api.state.nodes.get(e.to);if(a&&b)e.path.setAttribute('d',pathD(a,b,stage));});}
function apply(){
  const api=window.DCTS_TOPOLOGY_STANDARD;if(!api||api.state.activeView!=='T02')return;
  const view=api.state.views.get('T02'),stage=$('.dcts-std-stage',api.state.projection);if(!view||!stage)return;
  const ids=(view.object_ids||view.OBJECT_IDS||[]).filter(id=>api.state.objects.has(id));
  const objects=ids.map(id=>api.state.objects.get(id)),serviceObjects=objects.filter(o=>svc(o)?.service_code||svc(o)?.SERVICE_CODE);
  const codes=[...new Set(serviceObjects.map(o=>norm(svc(o).service_code||svc(o).SERVICE_CODE)))];
  if(codes.length<2)return; // only segment when the package explicitly carries a multi-service model
  const groups=[],assigned=new Set();
  codes.forEach(code=>{const members=serviceObjects.filter(o=>norm(svc(o).service_code||svc(o).SERVICE_CODE)===code);objects.filter(o=>companionMatch(o,code)).forEach(o=>{if(!members.includes(o))members.push(o)});members.forEach(o=>assigned.add(oid(o)));groups.push({key:`svc-${code.toLowerCase()}`,label:labelFor(code,members),tone:'service',objects:members});});
  const ai=objects.filter(o=>!assigned.has(oid(o))&&aiMatch(o));if(ai.length){ai.forEach(o=>assigned.add(oid(o)));const q=ai.map(qty).filter(v=>v!=null).sort((a,b)=>a-b)[0];groups.push({key:'svc-ai',label:q!=null?`AI / HIGH-DENSITY · ${q}`:'AI / HIGH-DENSITY',tone:'compute',objects:ai});}
  const workloadDomains=new Set(['SERVICE','TENANT','CLOUD','COMPUTE','HCI','STORAGE']);
  const otherWork=objects.filter(o=>workloadDomains.has(norm(o.domain||o.DOMAIN))&&!assigned.has(oid(o)));
  if(otherWork.length)groups.push({key:'svc-other',label:'OTHER WORKLOAD / SERVICE',tone:'neutral',objects:otherWork});
  if(groups.length<2||groups.length>5)return;
  const W=Math.max(stage.clientWidth,900),pad=20,gap=12,edge=$('[data-std-zone="edge"]',stage),fabric=$('[data-std-zone="fabric"]',stage),workload=$('[data-std-zone="workload"]',stage),mgmt=$('[data-std-zone="mgmt"]',stage);
  if(!edge||!fabric||!workload||!mgmt)return;
  const edgeRect={left:pad,top:18,width:W-pad*2,height:118},fabricRect={left:Math.max(pad,W*.22),top:150,width:Math.min(W-pad*2,W*.74),height:118},segTop=282,segHeight=220,segWidth=(W-pad*2-gap*(groups.length-1))/groups.length,mgmtRect={left:pad,top:516,width:W-pad*2,height:96};
  setRect(edge,edgeRect.left,edgeRect.top,edgeRect.width,edgeRect.height);setRect(fabric,fabricRect.left,fabricRect.top,fabricRect.width,fabricRect.height);workload.style.display='none';setRect(mgmt,mgmtRect.left,mgmtRect.top,mgmtRect.width,mgmtRect.height);
  $$('[data-std-segment-zone]',stage).forEach(z=>z.remove());
  groups.forEach((g,i)=>{const left=pad+i*(segWidth+gap),z=document.createElement('section');z.className='dcts-std-zone';z.dataset.stdSegmentZone=g.key;z.dataset.tone=g.tone;z.innerHTML=`<span class="dcts-std-zone-label"></span>`;z.querySelector('span').textContent=g.label;stage.insertBefore(z,stage.querySelector('.dcts-std-edge-svg'));setRect(z,left,segTop,segWidth,segHeight);place(g.objects.map(oid),{left,top:segTop,width:segWidth,height:segHeight},api.state.nodes,true);});
  const edgeIds=objects.filter(o=>['EXTERNAL','CARRIER','EDGE','SECURITY'].includes(norm(o.domain||o.DOMAIN))).map(oid);
  const fabricIds=objects.filter(o=>norm(o.domain||o.DOMAIN)==='NETWORK'&&!assigned.has(oid(o))).map(oid);
  const mgmtIds=objects.filter(o=>['MANAGEMENT','OOB','MONITORING','DCIM','OPERATIONS','BACKUP','DR'].includes(norm(o.domain||o.DOMAIN))&&!assigned.has(oid(o))).map(oid);
  place(edgeIds,edgeRect,api.state.nodes,false);place(fabricIds,fabricRect,api.state.nodes,false);place(mgmtIds,mgmtRect,api.state.nodes,false);
  stage.style.height='636px';const svg=$(':scope > .dcts-std-edge-svg',stage);if(svg){svg.setAttribute('height','636');svg.style.height='636px';}
  stage.dataset.dctsServiceSegmentation='v1a1';requestAnimationFrame(()=>redraw(api,stage));
}
let queued=false;function schedule(delay=0){if(delay)return setTimeout(schedule,delay);if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(80),{once:true});else schedule(80);
new MutationObserver(()=>schedule()).observe(document.documentElement,{subtree:true,childList:true});
window.addEventListener('hashchange',()=>schedule(80));window.addEventListener('resize',()=>schedule(80));
})();
