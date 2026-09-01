(function(){
'use strict';
const rawStatus=x=>String(x?.information_status||x?.INFORMATION_STATUS||x?.status||x?.STATUS||'').trim().toUpperCase();
function apply(){
  document.querySelectorAll('.dcts-std-node').forEach(n=>{
    const text=n.querySelector('.dcts-std-node-status');
    if(text&&text.textContent.trim().toUpperCase()==='STATUS NOT ENCODED'){
      const dot=n.querySelector('.dcts-std-status-dot');
      if(dot&&!dot.classList.contains('unknown')){
        dot.classList.remove('confirmed','customer-input','working-assumption','vendor-proposal','open-confirmation-required');
        dot.classList.add('unknown');
      }
    }
  });
  const api=window.DCTS_TOPOLOGY_STANDARD,edges=api?.state?.edges||[];
  edges.forEach(e=>{
    if(e.intent||rawStatus(e.r))return;
    if(!e.path.classList.contains('unknown')){
      e.path.classList.remove('confirmed','customer-input','working-assumption','vendor-proposal','open-confirmation-required');
      e.path.classList.add('unknown');
    }
    const title=e.path.querySelector('title');
    const type=String(e.r?.relationship_type||e.r?.RELATIONSHIP_TYPE||e.r?.type||e.r?.TYPE||e.r?.relationship_type_hint||e.r?.RELATIONSHIP_TYPE_HINT||'RELATIONSHIP').replace(/_/g,' ');
    const next=`${type} · STATUS NOT ENCODED`;
    if(title&&title.textContent!==next)title.textContent=next;
  });
}
let queued=false;
const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true});
window.addEventListener('hashchange',()=>setTimeout(schedule,30));
window.addEventListener('resize',schedule);
})();
