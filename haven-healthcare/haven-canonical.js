(()=>{
'use strict';
if(window.HAVEN_CANONICAL_RUNTIME)return;
window.HAVEN_CANONICAL_RUNTIME=true;
const DATA_URL='/haven-healthcare/data/haven-project-data.json?v=20260901-es1';
const LANG_KEY='haven_experience_lang';
function getLang(){try{const l=(localStorage.getItem(LANG_KEY)||'').toLowerCase();if(['en','tr','dv'].includes(l))return l}catch(_){}return 'en'}
function setLang(lang){if(!['en','tr','dv'].includes(lang))return;try{localStorage.setItem(LANG_KEY,lang)}catch(_){}window.dispatchEvent(new CustomEvent('haven:language',{detail:{lang}}))}
function path(obj,p){return p.split('.').reduce((v,k)=>v&&v[k]!==undefined?v[k]:undefined,obj)}
function fmt(v,type){if(v===undefined||v===null)return'';if(type==='int')return Number(v).toLocaleString('en-US',{maximumFractionDigits:0});return String(v)}
function applyBindings(root=document){const d=window.HAVEN_DATA;if(!d||!root.querySelectorAll)return;root.querySelectorAll('[data-haven]').forEach(el=>{const v=path(d,el.dataset.haven);if(v!==undefined)el.textContent=fmt(v,el.dataset.havenFormat)})}
function normalizeFrame(frame){const d=window.HAVEN_DATA;if(!d||!frame)return;try{const w=frame.contentWindow,doc=frame.contentDocument;if(!w||!doc)return;w.HAVEN_DATA=d;const n=w.HN;if(n){if(n.CCTV_ZONE){n.CCTV_ZONE[2]=`${d.healthcareServices.cctv.endpoints} IP cameras / NVR / storage`;n.CCTV_ZONE[3]=`${d.healthcareServices.cctv.endpoints} cameras`}if(n.VOICE_IPTV_ZONE){n.VOICE_IPTV_ZONE[2]=`Voice + IPTV / STB / TV services`;n.VOICE_IPTV_ZONE[3]=`${d.healthcareServices.iptv.endpoints} IPTV endpoints`}if(n.WIFI_AP_ESTATE)n.WIFI_AP_ESTATE[3]=`${d.infrastructure.wifiAccessPoints.active} active + ${d.infrastructure.wifiAccessPoints.spare} spare`;if(n.ACCESS_LAYER)n.ACCESS_LAYER[3]=`${d.infrastructure.accessSwitches.active} active + ${d.infrastructure.accessSwitches.spare} spare`;if(n.IDF_ESTATE)n.IDF_ESTATE[3]=`${d.infrastructure.idfEstate.preliminary} preliminary`;if(n.HCI_CLUSTER)n.HCI_CLUSTER[3]=`${d.infrastructure.hci.nodes} nodes`;if(n.PACS_STORAGE)n.PACS_STORAGE[3]=`${d.infrastructure.pacsStorage.nodes} nodes`}}
catch(e){console.error('[HAVEN canonical frame]',e)}}
async function load(){try{const r=await fetch(DATA_URL,{cache:'no-store'});if(!r.ok)throw new Error('canonical '+r.status);const d=await r.json();window.HAVEN_DATA=d;window.dispatchEvent(new CustomEvent('haven:data',{detail:d}));applyBindings();return d}catch(e){console.error('[HAVEN canonical]',e);window.dispatchEvent(new CustomEvent('haven:data-error',{detail:e}));return null}}
window.HAVEN={getLang,setLang,load,applyBindings,normalizeFrame,data:()=>window.HAVEN_DATA||null};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
