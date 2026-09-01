(()=>{
'use strict';
if(window.HAVEN_ROUTE_STATE)return;window.HAVEN_ROUTE_STATE=true;
function parentHash(){try{return parent.location.hash||''}catch(_){return''}}
function setParent(view){try{if(parent.location.hash!==`#view=${view}`)parent.history.replaceState(null,'',`#view=${view}`)}catch(_){}}
function findEngineering(view){return [...document.querySelectorAll('#tabs button')].find(b=>b.dataset.v===view||((b.textContent||'').match(/T0[0-8]/)||[])[0]===view)}
function apply(){const m=parentHash().match(/view=(H00|T0[0-8])/);if(!m)return;const v=m[1];if(v==='H00'){if(!document.body.classList.contains('hv-master-open'))document.getElementById('hvMasterBtn')?.click();return}const b=findEngineering(v);if(b&&!b.classList.contains('on'))b.click()}
function install(){const tabs=document.getElementById('tabs');if(tabs)tabs.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.id==='hvMasterBtn'){setParent('H00');return}const v=b.dataset.v||((b.textContent||'').match(/T0[0-8]/)||[])[0];if(v)setParent(v)},true);try{parent.addEventListener('hashchange',apply)}catch(_){}setTimeout(apply,30)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
