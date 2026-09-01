(function(){
'use strict';
const norm=v=>String(v||'').trim().toUpperCase();
function hashState(){
  const h=new URLSearchParams(location.hash.replace(/^#/,''));
  return {view:h.get('view')||'T00',mode:norm(h.get('mode')||'PRESENTATION')};
}
function projection(){return document.getElementById('dctsTopologyStandard');}
function hide(p){
  if(!p)return;
  p.setAttribute('aria-hidden','true');
  p.style.setProperty('display','none','important');
}
function show(p){
  if(!p)return;
  p.removeAttribute('aria-hidden');
  p.style.removeProperty('display');
}
function reconcile(forceRender=false){
  const h=hashState(),api=window.DCTS_TOPOLOGY_STANDARD,p=projection();
  if(h.mode!=='PRESENTATION'){
    hide(p);
    if(api?.state)api.state.activeView=null;
    api?.closeObject?.();
    return;
  }
  if(!api?.state?.loaded){hide(p);return;}
  if(api.state.activeView===h.view){show(p);return;}
  hide(p);
  if(forceRender){
    api.render?.();
    const fresh=projection();
    if(api.state.activeView===h.view)show(fresh);else hide(fresh);
  }
}
let queued=false;
const schedule=()=>{
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;reconcile(false);});
};
function onHashChange(){
  reconcile(false);
  setTimeout(()=>reconcile(true),60);
}
function boot(){
  reconcile(false);
  setTimeout(()=>reconcile(true),80);
  const root=document.querySelector('.dcts-app')||document.body||document.documentElement;
  new MutationObserver(schedule).observe(root,{subtree:true,childList:true});
  window.addEventListener('hashchange',onHashChange);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
