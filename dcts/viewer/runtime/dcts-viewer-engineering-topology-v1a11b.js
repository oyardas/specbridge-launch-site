(function(){
'use strict';
function fix(){
 const stage=document.querySelector('.eng11-stage');if(!stage)return;
 stage.querySelectorAll('.z-mgmt .eng11-group').forEach(g=>{
  const members=g.querySelectorAll('.eng11-member');
  if(members.length!==1)return;
  const n=members[0],name=g.querySelector('.eng11-group-head b')?.textContent?.trim();
  if(name){const b=n.querySelector('b');if(b)b.textContent=name;}
  n.removeAttribute('data-member');
  n.classList.add('single-canonical-object');
 });
}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;fix();});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true});
window.addEventListener('hashchange',schedule);
})();