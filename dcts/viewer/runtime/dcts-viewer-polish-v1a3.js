(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const state=()=>{const p=new URLSearchParams(location.hash.replace(/^#/,''));return {lang:p.get('lang')||'en',mode:p.get('mode')||'PRESENTATION'};};
function labelForPath(path){
 let n=path.nextElementSibling;
 while(n&&!(n.classList&&n.classList.contains('edge')&&n.hasAttribute('data-edge'))){
  if(n.classList&&n.classList.contains('edge-label'))return n;
  n=n.nextElementSibling;
 }
 return null;
}
function syncEdgeLabels(){
 $$('.edges .edge[data-edge]').forEach(path=>{
  const label=labelForPath(path);if(!label)return;
  try{
   const length=path.getTotalLength();if(!Number.isFinite(length)||length<=0)return;
   const pt=path.getPointAtLength(length/2);
   label.setAttribute('x',pt.x.toFixed(1));
   label.setAttribute('y',(pt.y-6).toFixed(1));
   label.setAttribute('text-anchor','middle');
   label.dataset.edgeLabelFor=path.dataset.edge||'';
  }catch(_){/* SVG geometry not ready yet */}
 });
}
function semanticLegendHtml(){
 const tr=state().lang==='tr';
 const title=tr?'Bağlantı Semantiği':'Connection Semantics';
 const confirmed=tr?'Canonical · doğrulanmış':'Canonical · confirmed';
 const open=tr?'Canonical · açık':'Canonical · open';
 const vendor=tr?'Canonical · üretici önerisi':'Canonical · vendor proposal';
 const assumption=tr?'Canonical · çalışma varsayımı':'Canonical · working assumption';
 const intent=tr?'Tasarım / sunum intenti':'Design / presentation intent';
 const arrow=tr?'Ok yalnızca yönü semantik olarak tanımlı canonical ilişkilerde kullanılır.':'Arrowheads appear only where canonical relationship semantics are directional.';
 return `<div class="semantic-legend-title">${title}</div>
 <div class="semantic-legend-status">
  <span><i class="semantic-line confirmed"></i>${confirmed}</span>
  <span><i class="semantic-line open"></i>${open}</span>
  <span><i class="semantic-line vendor"></i>${vendor}</span>
  <span><i class="semantic-line assumption"></i>${assumption}</span>
  <span><i class="semantic-line intent"></i>${intent}</span>
 </div>
 <div class="semantic-legend-layers" aria-label="Relationship layers">
  <span data-layer="physical">Physical</span><span data-layer="logical">Logical</span><span data-layer="service">Service</span><span data-layer="management">Management</span><span data-layer="oob">OOB</span><span data-layer="security">Security</span><span data-layer="backup">Backup</span><span data-layer="dr">DR</span>
 </div>
 <div class="semantic-legend-note">${arrow}</div>`;
}
function decorateLegend(){
 const legend=$('#legend');if(!legend)return;
 let panel=legend.querySelector('.dcts-semantic-legend');
 if(!panel){panel=document.createElement('div');panel.className='dcts-semantic-legend';legend.appendChild(panel);}
 const html=semanticLegendHtml();if(panel.innerHTML!==html)panel.innerHTML=html;
 panel.dataset.mode=state().mode;
}
function refresh(){requestAnimationFrame(()=>requestAnimationFrame(()=>{syncEdgeLabels();decorateLegend();}));}
function startObserver(){
 const root=$('.dcts-app')||document.body;
 const obs=new MutationObserver(muts=>{
  if(muts.some(m=>m.type==='childList'||m.type==='attributes'))refresh();
 });
 obs.observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','d']});
 window.addEventListener('hashchange',refresh);
 window.addEventListener('resize',refresh);
 document.addEventListener('click',e=>{if(e.target.closest('.tab,.node-card,#modeBtn,#intentBtn,#fitBtn,.inspector-tabs button'))setTimeout(refresh,40);},true);
}
async function boot(){
 let tries=0;while(!$('.dcts-app')&&tries++<100)await new Promise(r=>setTimeout(r,40));
 document.documentElement.classList.add('dcts-polish-v1a4');
 refresh();startObserver();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
