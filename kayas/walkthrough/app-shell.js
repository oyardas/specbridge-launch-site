(function(){
  'use strict';
  const AUTH_KEY='kayas_walkthrough_auth_until';
  const EXPECTED='13a9e92799eaf7515a82f73b4a2b3026a568dae3db4e35b5f4f4562b1d67bef7';
  const DOCUMENTS={
    field:{preview:'https://drive.google.com/file/d/1TKC5oYRlm7KZfAzpAHf2CeVHOv4wAX8E/preview',download:'https://drive.google.com/uc?export=download&id=1TKC5oYRlm7KZfAzpAHf2CeVHOv4wAX8E'},
    professional:{preview:'https://drive.google.com/file/d/1aeKUOlvBk8St3v2bBzZ1muS_RoleiQR6/preview',download:'https://drive.google.com/uc?export=download&id=1aeKUOlvBk8St3v2bBzZ1muS_RoleiQR6'},
    gantt:{preview:'https://docs.google.com/spreadsheets/d/1PsE1cOZDZsKGeXKBAFRRpCilVaHSxABm/edit',download:'https://drive.google.com/uc?export=download&id=1PsE1cOZDZsKGeXKBAFRRpCilVaHSxABm'}
  };

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
  [user,pass].filter(Boolean).forEach(el=>el.addEventListener('keydown',e=>{if(e.key==='Enter'&&loginButton)loginButton.click();}));

  const fullscreenButton=document.getElementById('fullscreenButton');
  if(fullscreenButton){fullscreenButton.addEventListener('click',()=>{const el=document.documentElement;if(!document.fullscreenElement){el.requestFullscreen&&el.requestFullscreen();}else{document.exitFullscreen&&document.exitFullscreen();}});}

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
    if(innerWidth<760&&!document.body.classList.contains('panel-collapsed')){
      const toggle=document.getElementById('panelToggleHeader');if(toggle)toggle.click();
    }
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
