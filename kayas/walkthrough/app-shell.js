(function(){
  'use strict';
  const AUTH_KEY='kayas_walkthrough_auth_until';
  const PANEL_KEY='kayas_walkthrough_panel_collapsed';
  const EXPECTED='13a9e92799eaf7515a82f73b4a2b3026a568dae3db4e35b5f4f4562b1d67bef7';
  const DOCUMENTS={
    field:{preview:'https://drive.google.com/file/d/1F1yVDXgLKkmBB6pjOvssrsbANlOCQYve/preview',download:'https://drive.google.com/uc?export=download&id=1F1yVDXgLKkmBB6pjOvssrsbANlOCQYve'},
    professional:{preview:'https://drive.google.com/file/d/1Hm0wu8zRUpKadyibZ33xpG8hAQ24B9kg/preview',download:'https://drive.google.com/uc?export=download&id=1Hm0wu8zRUpKadyibZ33xpG8hAQ24B9kg'},
    gantt:{preview:'https://docs.google.com/spreadsheets/d/1EZEXAmANDyrx3SdmzWCiCZb5feKEqTF4/edit',download:'https://drive.google.com/uc?export=download&id=1EZEXAmANDyrx3SdmzWCiCZb5feKEqTF4'}
  };

  function ensureV19Assets(){
    if(!document.getElementById('kayas-v19-css')){
      const link=document.createElement('link');
      link.id='kayas-v19-css';
      link.rel='stylesheet';
      link.href='v19-enhancements.css?v=20260803-v19';
      document.head.appendChild(link);
    }
    if(!document.getElementById('kayas-v19-runtime')){
      const script=document.createElement('script');
      script.id='kayas-v19-runtime';
      script.src='v19-runtime.js?v=20260803-v19';
      script.defer=true;
      script.onerror=()=>console.error('[KAYAS v19] runtime yüklenemedi');
      document.body.appendChild(script);
    }
  }
  ensureV19Assets();

  const brandStyle=document.createElement('style');
  brandStyle.textContent='body.is-night .specbridge-icon,body.is-night .specbridge-login-logo,body.is-night .loading-brand{filter:grayscale(1) brightness(0) invert(1);opacity:.98}body:not(.is-night) .specbridge-icon,body:not(.is-night) .specbridge-login-logo,body:not(.is-night) .loading-brand{filter:none;opacity:1}';
  document.head.appendChild(brandStyle);

  function configureDocuments(){
    const items=document.querySelectorAll('.report-item[data-report-title]');
    items.forEach(item=>{
      const title=item.getAttribute('data-report-title')||'';
      let doc=null;
      if(title==='Saha Fizibilite Raporu')doc=DOCUMENTS.field;
      else if(title==='Modüler Veri Merkezi Dışı Gereksinimler'||title==='Açılış Hazırlık Planı')doc=DOCUMENTS.professional;
      else if(title==='Master Uygulama Takvimi')doc=DOCUMENTS.gantt;
      if(!doc)return;
      item.setAttribute('data-report-src',doc.preview);
      item.setAttribute('data-report-download',doc.download);
    });
    const frame=document.getElementById('reportFrame');
    const open=document.getElementById('reportOpen');
    const download=document.getElementById('reportDownload');
    if(frame)frame.src=DOCUMENTS.field.preview;
    if(open)open.href=DOCUMENTS.field.preview;
    if(download)download.href=DOCUMENTS.field.download;
  }
  configureDocuments();

  const gate=document.getElementById('loginGate');
  const user=document.getElementById('loginUser');
  const pass=document.getElementById('loginPass');
  const error=document.getElementById('loginError');
  async function sha256(value){const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');}
  function unlock(){if(gate)gate.classList.add('is-hidden');setTimeout(()=>window.dispatchEvent(new Event('resize')),120);}
  if(Number(localStorage.getItem(AUTH_KEY)||0)>Date.now())unlock();
  const loginButton=document.getElementById('loginButton');
  if(loginButton){loginButton.addEventListener('click',async()=>{error.textContent='';const ok=await sha256(user.value.trim()+':'+pass.value);if(ok===EXPECTED){localStorage.setItem(AUTH_KEY,String(Date.now()+8*60*60*1000));unlock();}else{error.textContent='Kullanıcı adı veya şifre hatalı.';pass.select();}});}
  [user,pass].filter(Boolean).forEach(el=>el.addEventListener('keydown',event=>{if(event.key==='Enter'&&loginButton)loginButton.click();}));

  const fullscreenButton=document.getElementById('fullscreenButton');
  if(fullscreenButton){fullscreenButton.addEventListener('click',()=>{const el=document.documentElement;if(!document.fullscreenElement){el.requestFullscreen&&el.requestFullscreen();}else{document.exitFullscreen&&document.exitFullscreen();}});}

  const panel=document.getElementById('controlPanel');
  const panelToggleHeader=document.getElementById('panelToggleHeader');
  const panelEdgeToggle=document.getElementById('panelEdgeToggle');
  function syncPanelControls(){
    const collapsed=document.body.classList.contains('panel-collapsed');
    if(panelToggleHeader){
      panelToggleHeader.setAttribute('aria-expanded',String(!collapsed));
      panelToggleHeader.setAttribute('aria-pressed',String(collapsed));
      panelToggleHeader.setAttribute('title',collapsed?'Kontrol panelini aç':'Kontrol panelini gizle');
    }
    if(panelEdgeToggle){
      panelEdgeToggle.setAttribute('aria-expanded',String(!collapsed));
      panelEdgeToggle.textContent=collapsed?'›':'‹';
      panelEdgeToggle.setAttribute('title',collapsed?'Kontrol panelini aç':'Kontrol panelini gizle');
    }
    if(panel)panel.setAttribute('aria-hidden',String(collapsed));
  }
  function setPanelCollapsed(collapsed,{persist=true}={}){
    document.body.classList.toggle('panel-collapsed',Boolean(collapsed));
    if(persist){
      try{localStorage.setItem(PANEL_KEY,collapsed?'1':'0');}catch(_error){}
    }
    syncPanelControls();
    requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
    setTimeout(()=>window.dispatchEvent(new Event('resize')),310);
  }
  function togglePanel(event){
    if(event){event.preventDefault();event.stopPropagation();}
    setPanelCollapsed(!document.body.classList.contains('panel-collapsed'));
  }
  if(panelToggleHeader)panelToggleHeader.addEventListener('click',togglePanel,{capture:true});
  if(panelEdgeToggle)panelEdgeToggle.addEventListener('click',togglePanel,{capture:true});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&!document.body.classList.contains('panel-collapsed'))setPanelCollapsed(true);
  });
  let initialCollapsed=innerWidth<900;
  try{
    const saved=localStorage.getItem(PANEL_KEY);
    if(saved==='1'||saved==='0')initialCollapsed=saved==='1';
  }catch(_error){}
  setPanelCollapsed(initialCollapsed,{persist:false});

  const steps=[
    ['entrance','01 / 08','Batı giriş, resepsiyon ve mantrap'],
    ['foyer','02 / 08','Yatırımcı fuayesi ve büyük toplantı alanı'],
    ['walk','03 / 08','Kontrollü ziyaretçi güzergâhı'],
    ['datahall','04 / 08','H3C IC8000 veri salonu'],
    ['noc','05 / 08','NOC, yönetim ve operatör alanları'],
    ['terrace','06 / 08','5 metre doğu terası ve dış üniteler'],
    ['layers','07 / 08','Enerji, fiber ve soğutma katmanları'],
    ['top','08 / 08','110 m × 46 m genel üst görünüm']
  ];
  let current=-1,timer=null,playing=false;
  const title=document.getElementById('tourTitle');
  const step=document.getElementById('tourStep');
  const progress=document.getElementById('tourProgress');
  const tourButton=document.getElementById('tourButton');
  function show(index){
    current=(index+steps.length)%steps.length;
    const [view,no,label]=steps[current];
    const button=document.querySelector('[data-view="'+view+'"]');
    if(button)button.click();
    if(step)step.textContent=no;
    if(title)title.textContent=label;
    if(progress)progress.style.width=((current+1)/steps.length*100)+'%';
    if(innerWidth<760&&!document.body.classList.contains('panel-collapsed'))setPanelCollapsed(true);
  }
  function stop(){playing=false;clearInterval(timer);timer=null;if(tourButton)tourButton.innerHTML='▶ <span>Rehberli Tur</span>';}
  function start(){playing=true;show(current<0?0:current);clearInterval(timer);timer=setInterval(()=>{if(current===steps.length-1){stop();return;}show(current+1);},6500);if(tourButton)tourButton.innerHTML='Ⅱ <span>Turu Durdur</span>';}
  if(tourButton)tourButton.addEventListener('click',()=>playing?stop():start());
  const prev=document.getElementById('tourPrev'),next=document.getElementById('tourNext');
  if(prev)prev.addEventListener('click',()=>{stop();show(current-1);});
  if(next)next.addEventListener('click',()=>{stop();show(current+1);});

  const activeKeys=new Set();
  function keyDown(code,button){if(activeKeys.has(code))return;activeKeys.add(code);button&&button.classList.add('is-pressed');window.dispatchEvent(new KeyboardEvent('keydown',{code,key:code,bubbles:true}));}
  function keyUp(code,button){activeKeys.delete(code);button&&button.classList.remove('is-pressed');window.dispatchEvent(new KeyboardEvent('keyup',{code,key:code,bubbles:true}));}
  document.querySelectorAll('[data-key]').forEach(button=>{
    const code=button.dataset.key;
    ['pointerdown','touchstart'].forEach(type=>button.addEventListener(type,event=>{event.preventDefault();keyDown(code,button);},{passive:false}));
    ['pointerup','pointercancel','pointerleave','touchend','touchcancel'].forEach(type=>button.addEventListener(type,event=>{event.preventDefault();keyUp(code,button);},{passive:false}));
  });
  window.addEventListener('blur',()=>document.querySelectorAll('[data-key]').forEach(button=>keyUp(button.dataset.key,button)));

  setTimeout(()=>{const loading=document.getElementById('loadStatus');if(loading&&!loading.hidden)loading.hidden=true;},14000);
})();