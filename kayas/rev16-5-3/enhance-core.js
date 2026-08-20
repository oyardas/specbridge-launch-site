(function(){
'use strict';
const DETAILS=window.KAYAS_EN_DETAILS||{};
const SPECIAL_ARCH={
  'A-01':'This is a building-corner zone. The west and south sides are exterior building boundaries; no continuation room, corridor, door, or opening may be created in either direction. Circulation is permitted only inward toward A-04/C-08.',
  'TR-01':'This is the 5 m service terrace outside the east boundary of the enclosed floor. It does not replace interior zones and does not extend the enclosed-floor geometry.'
};
const GENERIC_ARCH='The master numbered layout is authoritative. No room, corridor, door, opening or adjacent space may be invented.';
function setText(el,v){if(el&&el.textContent!==v)el.textContent=v;}
function patchStatic(){
 document.documentElement.lang='en';document.title='KAYAS · 3rd Floor Zone Review';
 setText(document.querySelector('.brand b'),'KAYAS · 3rd Floor Zone Review');
 setText(document.querySelector('.brand span'),'Integrated Data Center & Digital Services Platform');
 const eye=document.querySelector('#zoneInfo .eyebrow');setText(eye,'ZONE DETAILS');
 const heads=[...document.querySelectorAll('#zoneInfo .zone-section h4')];
 if(heads[0])setText(heads[0],'IMPORTANCE TO THE DATA CENTER');
 if(heads[1])setText(heads[1],'WHY THIS ZONE IS REQUIRED');
 if(heads[2])setText(heads[2],'ARCHITECTURAL BOUNDARY / LOCK');
 setText(document.querySelector('#zoneInfo .zone-note'),'This panel shows the selected zone visual, description, and importance.');
 setText(document.querySelector('#landing .kicker'),'KAYAS · 3RD FLOOR REVIEW');
 setText(document.querySelector('#landing h1'),'Rev16.5.3 · Architecture-Locked Zone Framework');
 const lp=document.querySelector('#landing .landing-card > p');
 if(lp)setText(lp,'The 41-zone master numbered layout is the authoritative spatial source. Zone tags and the right-side information panel remain, and each zone is governed by explicit architectural-boundary rules so visual production cannot invent rooms, corridors, doors, or continuation spaces beyond the approved plan.');
 const zt=document.getElementById('zoneTitle');if(zt&&/^Rev16\.5\.2/.test(zt.textContent))setText(zt,'Rev16.5.3 · Architecture-Locked Zone Information Panel');
 const st=document.getElementById('status');if(st&&!/LOADING|BUILDING/i.test(st.textContent))setText(st,'READY · REV16.5.3 ENGLISH EDITION');
}
function defaultZone(){
 setText(document.getElementById('zoneInfoTitle'),'Hover over a zone');
 setText(document.getElementById('zoneInfoSub'),'Selected zone information');
 setText(document.getElementById('zoneInfoDesc'),'Hover over any semi-transparent zone number in Overview to display its function here. Click a label to pin the selection; approved visuals, function, importance, and architectural constraints are shown in this panel.');
 setText(document.getElementById('zoneInfoImportance'),'Select a zone to review why it matters to operations, security, customer experience, or technical continuity.');
 setText(document.getElementById('zoneInfoWhy'),'Select a zone to review why this function should be maintained as a distinct room or controlled area.');
 setText(document.getElementById('zoneInfoArch'),GENERIC_ARCH);
 const media=document.getElementById('zoneMedia');if(media)media.dataset.placeholder='No approved photorealistic visual has been assigned to this zone yet.';
 setText(document.getElementById('zoneMediaBadge'),'VISUAL PENDING');
 const pin=document.getElementById('zonePinNote');if(pin)pin.innerHTML='<b>Hover:</b> preview · <b>Click:</b> pin selection';
}
function applyZone(){
 const title=document.getElementById('zoneInfoTitle');if(!title)return;
 const m=(title.textContent||'').match(/(?:\d+\s*·\s*)?([A-Z]{1,2}-\d{2})/);
 if(!m){defaultZone();return;}
 const id=m[1],d=DETAILS[id];if(!d)return;
 const pre=(title.textContent.match(/^\d+\s*·/)||[''])[0];setText(title,(pre?pre+' ':'')+id);
 setText(document.getElementById('zoneInfoSub'),d.title);setText(document.getElementById('zoneInfoDesc'),d.purpose);setText(document.getElementById('zoneInfoImportance'),d.importance);setText(document.getElementById('zoneInfoWhy'),d.why);setText(document.getElementById('zoneInfoArch'),SPECIAL_ARCH[id]||GENERIC_ARCH);
 const media=document.getElementById('zoneMedia');if(media)media.dataset.placeholder=id+' has no approved photorealistic zone visual assigned yet.';
 setText(document.getElementById('zoneMediaBadge'),'VISUAL PENDING');
 const pin=document.getElementById('zonePinNote');if(pin&&/Seç|önizleme|sabitle/i.test(pin.textContent))pin.innerHTML='<b>Hover:</b> preview · <b>Click:</b> pin selection';
}
function installPanels(){
 const nav=document.querySelector('.nav');if(!nav)return;
 if(!document.getElementById('execBtn')){const b=document.createElement('button');b.id='execBtn';b.className='project-nav';b.textContent='Executive';nav.appendChild(b);}
 if(!document.getElementById('reportsBtn')){const b=document.createElement('button');b.id='reportsBtn';b.className='project-nav';b.textContent='Reports';nav.appendChild(b);}
 if(!document.getElementById('executivePanel')&&window.KAYAS_EXECUTIVE_HTML)document.body.insertAdjacentHTML('beforeend',window.KAYAS_EXECUTIVE_HTML);
 if(!document.getElementById('reportsPanel')&&window.KAYAS_REPORTS_HTML)document.body.insertAdjacentHTML('beforeend',window.KAYAS_REPORTS_HTML);
 const panels=[document.getElementById('executivePanel'),document.getElementById('reportsPanel')];
 function closeAll(){panels.forEach(p=>p&&p.classList.add('hidden'));document.querySelectorAll('.project-nav').forEach(b=>b.classList.remove('active'));}
 function open(id,btn){closeAll();const p=document.getElementById(id);if(p)p.classList.remove('hidden');if(btn)btn.classList.add('active');}
 document.getElementById('execBtn').onclick=function(){open('executivePanel',this)};document.getElementById('reportsBtn').onclick=function(){open('reportsPanel',this)};
 document.querySelectorAll('[data-close-project-panel]').forEach(b=>b.onclick=closeAll);document.querySelectorAll('.nav button:not(.project-nav)').forEach(b=>b.addEventListener('click',closeAll));
 const cards=document.querySelector('#landing .cards');if(cards&&!document.getElementById('cardExecutive')){const e=document.createElement('button');e.className='card';e.id='cardExecutive';e.innerHTML='<small>01 · MANAGEMENT</small><b>Executive Summary</b><p>Investment thesis, current decision baseline, solution stack, revenue model, open decisions, and milestones.</p>';e.onclick=()=>document.getElementById('execBtn').click();const r=document.createElement('button');r.className='card';r.id='cardReports';r.innerHTML='<small>02 · DOCUMENTS</small><b>Reports & Presentations</b><p>Project report, master requirements, investor guide, controlled internal materials, and document status.</p>';r.onclick=()=>document.getElementById('reportsBtn').click();cards.prepend(r);cards.prepend(e);}
 document.querySelectorAll('#reportsPanel a[href="#"]').forEach(a=>{const s=document.createElement('span');s.className='disabled';s.textContent='Controlled package only';a.replaceWith(s);});
}
function boot(){patchStatic();installPanels();defaultZone();applyZone();const zi=document.getElementById('zoneInfo');if(zi)new MutationObserver(()=>{patchStatic();applyZone();}).observe(zi,{subtree:true,childList:true,characterData:true});const st=document.getElementById('status');if(st)new MutationObserver(()=>{if(!/LOADING|BUILDING/i.test(st.textContent))setText(st,'READY · REV16.5.3 ENGLISH EDITION');}).observe(st,{subtree:true,childList:true,characterData:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
