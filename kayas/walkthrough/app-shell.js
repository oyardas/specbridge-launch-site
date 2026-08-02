(function(){
  const AUTH_KEY='kayas_walkthrough_auth_until';
  const EXPECTED='13a9e92799eaf7515a82f73b4a2b3026a568dae3db4e35b5f4f4562b1d67bef7';
  const gate=document.getElementById('loginGate');
  const user=document.getElementById('loginUser');
  const pass=document.getElementById('loginPass');
  const error=document.getElementById('loginError');
  async function sha256(value){const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');}
  function unlock(){gate.classList.add('is-hidden');setTimeout(()=>window.dispatchEvent(new Event('resize')),100);}
  if(Number(localStorage.getItem(AUTH_KEY)||0)>Date.now()) unlock();
  document.getElementById('loginButton').addEventListener('click',async()=>{error.textContent='';const ok=await sha256(user.value.trim()+':'+pass.value);if(ok===EXPECTED){localStorage.setItem(AUTH_KEY,String(Date.now()+8*60*60*1000));unlock();}else{error.textContent='Kullanıcı adı veya şifre hatalı.';pass.select();}});
  [user,pass].forEach(el=>el.addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('loginButton').click();}));

  const control=document.getElementById('controlPanel');
  document.getElementById('menuButton').addEventListener('click',()=>control.classList.toggle('is-collapsed'));
  document.getElementById('fullscreenButton').addEventListener('click',()=>{const el=document.documentElement;if(!document.fullscreenElement){el.requestFullscreen&&el.requestFullscreen();}else{document.exitFullscreen&&document.exitFullscreen();}});
  const theme=document.getElementById('themeButton');
  function setTheme(mode){document.documentElement.dataset.theme=mode;localStorage.setItem('kayas_walkthrough_theme',mode);const night=document.getElementById('nightToggle');if(night){night.checked=mode==='dark';night.dispatchEvent(new Event('change',{bubbles:true}));}}
  theme.addEventListener('click',()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
  setTimeout(()=>setTheme(localStorage.getItem('kayas_walkthrough_theme')||'dark'),700);

  const steps=[
    ['entrance','01 / 07','Batı giriş ve güvenlik kabulü'],
    ['foyer','02 / 07','Yatırımcı fuayesi ve showroom'],
    ['walk','03 / 07','Ziyaretçi gözlem rotası'],
    ['datahall','04 / 07','H3C IC8000 veri salonu'],
    ['noc','05 / 07','NOC ve yönetim alanı'],
    ['terrace','06 / 07','5 metre doğu terası'],
    ['layers','07 / 07','Teknik katmanlar ve genişleme']
  ];
  let current=-1,timer=null,playing=false;
  const title=document.getElementById('tourTitle'),step=document.getElementById('tourStep'),progress=document.getElementById('tourProgress'),tourButton=document.getElementById('tourButton');
  function show(index){current=(index+steps.length)%steps.length;const [view,no,label]=steps[current];const b=document.querySelector('[data-view="'+view+'"]');if(b)b.click();step.textContent=no;title.textContent=label;progress.style.width=((current+1)/steps.length*100)+'%';if(innerWidth<760)control.classList.add('is-collapsed');}
  function stop(){playing=false;clearInterval(timer);timer=null;tourButton.innerHTML='▶ <span>Rehberli Tur</span>';}
  function start(){playing=true;show(current<0?0:current);clearInterval(timer);timer=setInterval(()=>{if(current===steps.length-1){stop();return;}show(current+1);},6500);tourButton.innerHTML='Ⅱ <span>Turu Durdur</span>';}
  tourButton.addEventListener('click',()=>playing?stop():start());
  document.getElementById('tourPrev').addEventListener('click',()=>{stop();show(current-1);});
  document.getElementById('tourNext').addEventListener('click',()=>{stop();show(current+1);});

  const activeKeys=new Set();
  function keyDown(code,button){if(activeKeys.has(code))return;activeKeys.add(code);button&&button.classList.add('is-pressed');window.dispatchEvent(new KeyboardEvent('keydown',{code,key:code,bubbles:true}));}
  function keyUp(code,button){activeKeys.delete(code);button&&button.classList.remove('is-pressed');window.dispatchEvent(new KeyboardEvent('keyup',{code,key:code,bubbles:true}));}
  document.querySelectorAll('[data-key]').forEach(btn=>{
    const code=btn.dataset.key;
    ['pointerdown','touchstart'].forEach(type=>btn.addEventListener(type,e=>{e.preventDefault();keyDown(code,btn);},{passive:false}));
    ['pointerup','pointercancel','pointerleave','touchend','touchcancel'].forEach(type=>btn.addEventListener(type,e=>{e.preventDefault();keyUp(code,btn);},{passive:false}));
  });
  window.addEventListener('blur',()=>document.querySelectorAll('[data-key]').forEach(btn=>keyUp(btn.dataset.key,btn)));

  setTimeout(()=>{const s=document.getElementById('loadStatus');if(s&&!s.hidden)s.hidden=true;},9000);
})();
