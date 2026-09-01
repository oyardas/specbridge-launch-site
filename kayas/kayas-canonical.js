(()=>{
'use strict';
if(window.KAYAS_CANONICAL_RUNTIME)return;
window.KAYAS_CANONICAL_RUNTIME=true;
const DATA_URL='/kayas/data/kayas-project-data.json?v=20260901-es1';
const LANG_KEY='kayas_experience_lang';
const qs=new URLSearchParams(location.search);
const requested=(qs.get('lang')||'').toLowerCase();
if(requested==='tr'||requested==='en'){try{localStorage.setItem(LANG_KEY,requested)}catch(_){}}
function getLang(){try{const l=(localStorage.getItem(LANG_KEY)||'').toLowerCase();if(l==='tr'||l==='en')return l}catch(_){}return document.documentElement.lang?.toLowerCase().startsWith('tr')?'tr':'en'}
function path(obj,p){return p.split('.').reduce((v,k)=>v&&v[k]!==undefined?v[k]:undefined,obj)}
function fmt(v,type){if(v===undefined||v===null)return'';if(type==='int')return Number(v).toLocaleString('en-US',{maximumFractionDigits:0});if(type==='mw')return Number(v).toFixed(2)+' MW';if(type==='kw')return Number(v).toLocaleString('en-US')+' kW';return String(v)}
function applyBindings(root=document){const d=window.KAYAS_DATA;if(!d)return;root.querySelectorAll?.('[data-kayas]').forEach(el=>{const v=path(d,el.dataset.kayas);if(v===undefined)return;el.textContent=fmt(v,el.dataset.kayasFormat)});root.querySelectorAll?.('[data-kayas-en],[data-kayas-tr]').forEach(el=>{const l=getLang(),v=el.dataset[l==='tr'?'kayasTr':'kayasEn'];if(v!==undefined)el.textContent=v});}
function setLang(lang){if(lang!=='tr'&&lang!=='en')return;try{localStorage.setItem(LANG_KEY,lang)}catch(_){}document.documentElement.dataset.kayasLang=lang;applyBindings(document);window.dispatchEvent(new CustomEvent('kayas:language',{detail:{lang}}));}
function normalizeKnownStale(root=document){const d=window.KAYAS_DATA;if(!d||!root.querySelectorAll)return;const c=d.capacity;const walker=document.createTreeWalker(root.body||root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);const replacements=[['206 IT CABINETS · 1,972 kW',`${c.itCabinetsTotal} IT CABINETS · ${c.workingDesignITLoadKW.toLocaleString('en-US')} kW`],['≈206','210'],['1.972 MW','2.00 MW'],['≈1.97 MW','2.00 MW'],['1,972 kW','2,000 kW']];nodes.forEach(n=>{let s=n.nodeValue;for(const [a,b] of replacements)if(s.includes(a))s=s.split(a).join(b);if(s!==n.nodeValue)n.nodeValue=s});}
async function load(){try{const r=await fetch(DATA_URL,{cache:'no-store'});if(!r.ok)throw new Error('canonical '+r.status);const d=await r.json();window.KAYAS_DATA=d;document.documentElement.dataset.kayasLang=getLang();applyBindings();normalizeKnownStale();window.dispatchEvent(new CustomEvent('kayas:data',{detail:d}));return d}catch(e){console.error('[KAYAS canonical]',e);window.dispatchEvent(new CustomEvent('kayas:data-error',{detail:e}));return null}}
window.KAYAS={getLang,setLang,load,applyBindings,normalizeKnownStale,data:()=>window.KAYAS_DATA||null};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
