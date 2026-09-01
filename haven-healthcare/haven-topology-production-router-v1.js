(()=>{
'use strict';
if(window.HAVEN_TOPOLOGY_PRODUCTION_ROUTER)return;
window.HAVEN_TOPOLOGY_PRODUCTION_ROUTER=true;
const BASE='/haven-healthcare/topology/';
const LANG_KEY='haven_experience_lang';
function lang(){try{const v=(localStorage.getItem(LANG_KEY)||'en').toLowerCase();return ['en','tr','dv'].includes(v)?v:'en'}catch(_){return'en'}}
function viewFromButton(b){
  if(!b)return null;
  const v=String(b.dataset?.v||'').toUpperCase();
  if(/^T0[0-8]$/.test(v))return v;
  const m=String(b.textContent||'').toUpperCase().match(/\bT0[0-8]\b/);
  return m?m[0]:null;
}
function open(view){
  const hash=`#view=${encodeURIComponent(view)}&mode=PRESENTATION&lang=${encodeURIComponent(lang())}&design=1`;
  try{window.top.location.href=BASE+hash}catch(_){window.location.href=BASE+hash}
}
document.addEventListener('click',e=>{
  const b=e.target?.closest?.('#tabs button');
  const view=viewFromButton(b);
  if(!view)return;
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  open(view);
},true);
window.HAVEN_OPEN_DCTS_TOPOLOGY=open;
})();
