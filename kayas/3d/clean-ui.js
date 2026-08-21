(function(){
'use strict';
const DETAILS=window.KAYAS_EN_DETAILS||{};
const arch={'A-01':'This is a building-corner zone. The west and south sides are exterior building boundaries; no continuation room, corridor, door, or opening may be created in either direction.','TR-01':'This is the 5 m service terrace outside the east boundary of the enclosed floor.'};
const generic='The master numbered layout is authoritative. No room, corridor, door, opening or adjacent space may be invented.';
const set=(id,v)=>{const e=typeof id==='string'?document.getElementById(id):id;if(e)e.textContent=v};
const ZONE_VIS_KEY='kayas_zone_details_visible';
let zoneDetailsVisible=true;
function readZonePref(){try{const v=sessionStorage.getItem(ZONE_VIS_KEY);if(v!==null)zoneDetailsVisible=v!=='0'}catch(_){} }
function saveZonePref(){try{sessionStorage.setItem(ZONE_VIS_KEY,zoneDetailsVisible?'1':'0')}catch(_){} }
function installZoneToggle(){
 const nav=document.querySelector('.nav'),zi=document.getElementById('zoneInfo');if(!nav||!zi)return;
 if(!document.getElementById('zoneDetailsToggle')){
  const b=document.createElement('button');b.id='zoneDetailsToggle';b.type='button';b.textContent='Hide Zone Details';b.setAttribute('aria-controls','zoneInfo');nav.appendChild(b);
  b.addEventListener('click',()=>{zoneDetailsVisible=!zoneDetailsVisible;saveZonePref();applyZoneVisibility(true)});
 }
 if(!document.getElementById('zoneDetailsToggleStyle')){
  const s=document.createElement('style');s.id='zoneDetailsToggleStyle';s.textContent='#zoneInfo.kayas-zone-manual-hidden{display:none!important}';document.head.appendChild(s);
 }
 applyZoneVisibility(false);
}
function applyZoneVisibility(forceShow){
 const zi=document.getElementById('zoneInfo'),b=document.getElementById('zoneDetailsToggle');if(!zi||!b)return;
 if(zoneDetailsVisible){
  zi.classList.remove('kayas-zone-manual-hidden');
  if(forceShow)zi.classList.remove('hidden');
  b.textContent='Hide Zone Details';b.setAttribute('aria-expanded','true');
 }else{
  zi.classList.add('kayas-zone-manual-hidden');
  b.textContent='Show Zone Details';b.setAttribute('aria-expanded','false');
 }
}
function patch(){
 document.documentElement.lang='en';document.title='KAYAS · 3rd Floor Zone Review';
 set(document.querySelector('.brand b'),'KAYAS · 3rd Floor Zone Review');
 set(document.querySelector('.brand span'),'Integrated Data Center & Digital Services Platform');
 set(document.querySelector('#zoneInfo .eyebrow'),'ZONE DETAILS');
 const hs=[...document.querySelectorAll('#zoneInfo .zone-section h4')];
 if(hs[0])set(hs[0],'IMPORTANCE TO THE DATA CENTER');if(hs[1])set(hs[1],'WHY THIS ZONE IS REQUIRED');if(hs[2])set(hs[2],'ARCHITECTURAL BOUNDARY');
 set(document.querySelector('#zoneInfo .zone-note'),'Selected zone function, importance and architectural constraints.');
 set(document.querySelector('#landing .kicker'),'KAYAS · 3RD FLOOR REVIEW');
 set(document.querySelector('#landing h1'),'KAYAS · 3rd Floor Zone Review');
 const lp=document.querySelector('#landing .landing-card > p');if(lp)lp.textContent='Interactive review of the 41-zone third-floor architecture, data hall, operations, support areas and service terrace.';
 const zt=document.getElementById('zoneTitle');if(zt)set(zt,'KAYAS · 3rd Floor Zone Review');
 const st=document.getElementById('status');if(st)set(st,'206 IT CABINETS · 1,972 kW');
 const tips=document.querySelector('.tips');if(tips)tips.textContent='Walk: W/A/S/D or arrows · Look: hold mouse and drag · Overview: drag to orbit and use the mouse wheel to zoom.';
 document.querySelectorAll('#landing .baseline span').forEach(x=>{if(/No humans|No guided|Rev|build/i.test(x.textContent))x.remove()});
 applyZoneVisibility(false);
}
function defaultZone(){
 set('zoneInfoTitle','Hover over a zone');set('zoneInfoSub','Selected zone information');
 set('zoneInfoDesc','Hover over a zone number in Overview to display its function. Click a label to pin the selection.');
 set('zoneInfoImportance','Select a zone to review why it matters to operations, security, customer experience or technical continuity.');
 set('zoneInfoWhy','Select a zone to review why this function is maintained as a distinct room or controlled area.');
 set('zoneInfoArch',generic);const m=document.getElementById('zoneMedia');if(m)m.dataset.placeholder='No approved photorealistic visual has been assigned to this zone yet.';
 set('zoneMediaBadge','VISUAL PENDING');const p=document.getElementById('zonePinNote');if(p)p.innerHTML='<b>Hover:</b> preview · <b>Click:</b> pin selection';
}
function apply(){
 const t=document.getElementById('zoneInfoTitle');if(!t)return;
 const m=(t.textContent||'').match(/([A-Z]{1,2}-\d{2})/);if(!m){defaultZone();return}
 const id=m[1],d=DETAILS[id];if(!d)return;
 set('zoneInfoTitle',id);set('zoneInfoSub',d.title);set('zoneInfoDesc',d.purpose);set('zoneInfoImportance',d.importance);set('zoneInfoWhy',d.why);set('zoneInfoArch',arch[id]||generic);
}
function boot(){
 readZonePref();patch();defaultZone();apply();installZoneToggle();
 const zi=document.getElementById('zoneInfo');if(zi)new MutationObserver(()=>{patch();apply();applyZoneVisibility(false)}).observe(zi,{subtree:true,childList:true,characterData:true});
 const st=document.getElementById('status');if(st)new MutationObserver(()=>set(st,'206 IT CABINETS · 1,972 kW')).observe(st,{subtree:true,childList:true,characterData:true});
 setTimeout(()=>{const l=document.getElementById('landing');if(l)l.classList.add('hidden');try{overview()}catch(_){}applyZoneVisibility(false)},100);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
