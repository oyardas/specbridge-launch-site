(function(){
  'use strict';
  const AUTH_KEY='kayas_walkthrough_auth_until';
  const EXPECTED='13a9e92799eaf7515a82f73b4a2b3026a568dae3db4e35b5f4f4562b1d67bef7';
  const gate=document.getElementById('loginGate');
  const user=document.getElementById('loginUser');
  const pass=document.getElementById('loginPass');
  const error=document.getElementById('loginError');
  async function sha256(value){const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');}
  function unlock(){if(gate)gate.classList.add('is-hidden');setTimeout(()=>window.dispatchEvent(new Event('resize')),120);}
  function storageGet(key){try{return localStorage.getItem(key);}catch(_){return null;}}
  function storageSet(key,value){try{localStorage.setItem(key,value);}catch(_){/* session remains unlocked without persistence */}}
  if(Number(storageGet(AUTH_KEY)||0)>Date.now()) unlock();
  const loginButton=document.getElementById('loginButton');
  if(loginButton){loginButton.addEventListener('click',async()=>{error.textContent='';const ok=await sha256(user.value.trim()+':'+pass.value);if(ok===EXPECTED){storageSet(AUTH_KEY,String(Date.now()+8*60*60*1000));unlock();}else{error.textContent='Incorrect username or password.';pass.select();}});}
  [user,pass].filter(Boolean).forEach(el=>el.addEventListener('keydown',e=>{if(e.key==='Enter'&&loginButton)loginButton.click();}));

  const fullscreenButton=document.getElementById('fullscreenButton');
  if(fullscreenButton){fullscreenButton.addEventListener('click',()=>{const el=document.documentElement;if(!document.fullscreenElement){el.requestFullscreen&&el.requestFullscreen();}else{document.exitFullscreen&&document.exitFullscreen();}});}

  const scenes=[
    {view:'overview',step:'01 / 12',kind:'Overview',title:'KAYAS data center investment vision',narrative:'The layout spans 110 meters in length and 46 meters in total depth. The 5-meter east terrace is clearly separated from the enclosed data center volume.',zone:'ic8000_datahall',profile:'clean',move:3.6,hold:6.8,image:'assets/gallery/kayas_concept_09_datahall.webp'},
    {view:'entrance',step:'02 / 12',kind:'Visitor Experience',title:'West entrance, reception and branded arrival zone',narrative:'The visitor journey starts from the existing west entrance. Reception, security desk and the KAYAS–H3C branded welcome zone are combined into a single controlled arrival experience.',zone:'entry_security',profile:'clean',move:3.0,hold:7.0,image:'assets/gallery/kayas_concept_01_entrance.webp'},
    {view:'security',step:'03 / 12',kind:'Physical Security',title:'Mantrap and glazed observation corridor',narrative:'The dual-door mantrap, card-access point and glazed observation area let visitors experience the facility in a controlled way without entering the critical data hall.',zone:'visitor_observation',profile:'secure',move:3.1,hold:7.2,image:'assets/gallery/kayas_concept_03_security.webp'},
    {view:'foyer',step:'04 / 12',kind:'Investor Center',title:'Foyer, showroom and large meeting area',narrative:'In phase 1 this space supports investor presentations, customer meetings and an IC8000 showroom function. In later phases it can convert into enclosed data center expansion space.',zone:'future_foyer_expansion',profile:'clean',move:3.3,hold:7.4,image:'assets/gallery/kayas_concept_04_foyer.webp'},
    {view:'walk',step:'05 / 12',kind:'Controlled Route',title:'Visitor route and operational separation',narrative:'Visitor, staff and technical service movements are clearly separated. The blue route indicates the secure circulation path from reception to the observation area.',zone:'controlled_corridor',profile:'visitor',move:3.2,hold:7.0,image:'assets/gallery/kayas_concept_20_visitorroute.webp'},
    {view:'datahall',step:'06 / 12',kind:'Main Data Hall',title:'20 H3C IC8000 pods and 200 total cabinets',narrative:'The phase-1 concept includes 20 IC8000 pods with 10 cabinets each, targeting 200 cabinets in total. The layout remains fully inside the enclosed data center volume, outside the 5-meter terrace band.',zone:'ic8000_datahall',profile:'clean',move:3.4,hold:8.0,image:'assets/gallery/kayas_concept_09_datahall.webp'},
    {view:'datahallAisle',step:'07 / 12',kind:'Cabinet Level',title:'IC8000 cold-aisle experience',narrative:'Cabinet rows, enclosed cold-aisle logic and the modular pod approach create a clear operational concept. Air-cooled phase-1 capacity can coexist with future liquid-cooled areas for AI workloads.',zone:'ic8000_datahall',profile:'clean',move:3.2,hold:8.2,image:'assets/gallery/kayas_concept_10_datahall.webp'},
    {view:'noc',step:'08 / 12',kind:'Operations',title:'NOC, management and operator areas',narrative:'The screen-wall NOC acts as the shared operations center for the data hall, power, mechanical infrastructure and security systems. Operator rooms are positioned in separate service areas.',zone:'noc_management',profile:'clean',move:3.2,hold:7.4,image:'assets/gallery/kayas_concept_22_management.webp'},
    {view:'technical',step:'09 / 12',kind:'Technical Backbone',title:'Fiber, battery and electrical distribution band',narrative:'Along the south technical band, the meet-me room, dedicated battery room, ventilation connection and power/bypass distribution functions are physically separated.',zone:'fiber_room',profile:'technical',move:3.2,hold:7.8,image:'assets/gallery/kayas_concept_13_fiber.webp'},
    {view:'terrace',step:'10 / 12',kind:'Mechanical Service',title:'5-meter east terrace and outdoor units',narrative:'The 5-meter open service band on the east façade is reserved for chillers, dry coolers, maintenance access and battery-room ventilation. The main data center functions remain inside the enclosed volume.',zone:'chiller_drycooler',profile:'clean',move:3.5,hold:7.8,image:'assets/gallery/kayas_concept_16_terrace.webp'},
    {view:'layers',step:'11 / 12',kind:'Engineering Layers',title:'Power, fiber and cooling backbones',narrative:'The concept power, fiber and cooling routes can be reviewed together. These layers will be finalized during detailed design through MEP documents, single-line diagrams, CFD studies and Tier III design packages.',zone:'cooling_layer',profile:'engineering',move:3.8,hold:8.0,image:'assets/gallery/kayas_concept_15_electrical.webp'},
    {view:'top',step:'12 / 12',kind:'Closing',title:'Scalable regional digital service platform',narrative:'KAYAS can be positioned not only as a data center, but also as a regional reference platform for demos, academy programs, managed cloud services and a broader digital ecosystem.',zone:'ic8000_datahall',profile:'overview',move:4.0,hold:9.0,image:'assets/gallery/kayas_concept_24_entrance.webp'}
  ];
  let current=-1,playing=false,advanceTimer=null,progressFrame=null,sceneStarted=0,sceneDuration=1,voiceEnabled=true,speed=1;
  let speechToken=0,voicePending=false,professionalMode=true;
  const title=document.getElementById('tourTitle');
  const step=document.getElementById('tourStep');
  const kind=document.getElementById('tourSceneKind');
  const narrative=document.getElementById('tourNarrative');
  const progress=document.getElementById('tourProgress');
  const tourButton=document.getElementById('tourButton');
  const tourPlay=document.getElementById('tourPlay');
  const tourRestart=document.getElementById('tourRestart');
  const tourVoice=document.getElementById('tourVoice');
  const tourSpeed=document.getElementById('tourSpeed');
  const tourExit=document.getElementById('tourExit');
  const tourDots=document.getElementById('tourDots');
  const professionalSceneLayer=document.getElementById('professionalSceneLayer');
  const professionalSceneImage=document.getElementById('professionalSceneImage');
  const professionalSceneKind=document.getElementById('professionalSceneKind');
  const professionalSceneTitle=document.getElementById('professionalSceneTitle');
  const professionalSceneNarrative=document.getElementById('professionalSceneNarrative');
  const professionalSceneToggle=document.getElementById('professionalSceneToggle');
  const tourModeToggle=document.getElementById('tourModeToggle');

  function getApp(){return window.KAYAS_APP&&typeof window.KAYAS_APP.goToView==='function'?window.KAYAS_APP:null;}
  function waitForApp(callback,attempts=80){const app=getApp();if(app){callback(app);return;}if(attempts<=0)return;setTimeout(()=>waitForApp(callback,attempts-1),125);}
  function clearTourTimers(){clearTimeout(advanceTimer);advanceTimer=null;if(progressFrame)cancelAnimationFrame(progressFrame);progressFrame=null;speechToken+=1;voicePending=false;if('speechSynthesis'in window)speechSynthesis.cancel();}
  function updateButtons(){
    const icon=playing?'Ⅱ':'▶';
    if(tourPlay){tourPlay.textContent=icon;tourPlay.setAttribute('aria-label',playing?'Pause the tour':'Play the tour');}
    if(tourButton)tourButton.innerHTML=(playing?'Ⅱ':'▶')+' <span>'+(playing?'Pause Tour':current>=0?'Resume Tour':'Cinematic Tour')+'</span>';
    document.body.classList.toggle('tour-paused',!playing&&current>=0);
  }
  function buildDots(){
    if(!tourDots)return;tourDots.innerHTML='';
    scenes.forEach((scene,index)=>{const b=document.createElement('button');b.type='button';b.className='tour-dot';b.title=scene.step+' · '+scene.title;b.setAttribute('aria-label',scene.step+' '+scene.title);b.addEventListener('click',()=>{const resume=playing;show(index,resume);});tourDots.appendChild(b);});
  }
  function updateDots(){if(!tourDots)return;Array.from(tourDots.children).forEach((dot,index)=>{dot.classList.toggle('is-active',index===current);dot.classList.toggle('is-complete',current>=0&&index<current);});}
  function progressLoop(){
    const elapsed=performance.now()-sceneStarted;
    let pct=Math.max(0,Math.min(100,elapsed/sceneDuration*100));
    if(voicePending&&pct>=98)pct=98;
    if(progress)progress.style.width=pct.toFixed(2)+'%';
    if(playing&&(pct<100||voicePending))progressFrame=requestAnimationFrame(progressLoop);
  }
  function estimateSpeechMs(scene){
    const words=(scene.title+' '+scene.narrative).trim().split(/\s+/).filter(Boolean).length;
    const wordsPerMinute=132*Math.max(.72,Math.min(1.18,speed));
    return Math.max(5000,(words/wordsPerMinute)*60000+1300);
  }
  function selectEnglishVoice(){
    if(!('speechSynthesis'in window))return null;
    const voices=speechSynthesis.getVoices();
    return voices.find(v=>/^en-GB/i.test(v.lang))||voices.find(v=>/^en-US/i.test(v.lang))||voices.find(v=>/^en/i.test(v.lang))||null;
  }
  function speak(scene,onDone){
    if(!voiceEnabled||!('speechSynthesis'in window)){onDone&&onDone('disabled');return estimateSpeechMs(scene);}
    const token=++speechToken;
    voicePending=true;
    speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(scene.title+'. '+scene.narrative);
    utterance.lang='en-US';utterance.rate=Math.max(.78,Math.min(1.08,.92*speed));utterance.pitch=1;utterance.volume=.92;
    const selectedVoice=selectEnglishVoice();if(selectedVoice)utterance.voice=selectedVoice;
    const finish=(reason)=>{if(token!==speechToken)return;voicePending=false;onDone&&onDone(reason);};
    utterance.onend=()=>finish('ended');
    utterance.onerror=()=>finish('error');
    speechSynthesis.speak(utterance);
    return estimateSpeechMs(scene);
  }
  function updateProfessionalScene(scene){
    if(!professionalSceneLayer)return;
    professionalSceneLayer.hidden=false;
    professionalSceneLayer.classList.add('is-changing');
    window.setTimeout(()=>{
      if(professionalSceneImage&&scene.image)professionalSceneImage.src=scene.image;
      if(professionalSceneKind)professionalSceneKind.textContent=scene.kind;
      if(professionalSceneTitle)professionalSceneTitle.textContent=scene.title;
      if(professionalSceneNarrative)professionalSceneNarrative.textContent=scene.narrative;
      professionalSceneLayer.classList.remove('is-changing');
    },170);
  }
  function applyProfessionalMode(){
    document.body.classList.toggle('professional-mode',professionalMode);
    const nextLabel=professionalMode?'Interactive 3D':'Cinematic View';
    if(professionalSceneToggle){professionalSceneToggle.textContent=nextLabel;professionalSceneToggle.setAttribute('aria-pressed',professionalMode?'false':'true');}
    if(tourModeToggle){tourModeToggle.textContent=nextLabel;tourModeToggle.setAttribute('aria-pressed',professionalMode?'false':'true');tourModeToggle.title=professionalMode?'Switch to Interactive 3D':'Return to Cinematic View';}
  }
  function toggleTourMode(){professionalMode=!professionalMode;applyProfessionalMode();}
  function enterCinematic(){
    document.body.classList.add('tour-cinematic');
    applyProfessionalMode();
    const drawer=document.getElementById('customerDrawer');if(drawer&&!drawer.hidden){const close=document.getElementById('drawerClose');if(close)close.click();}
    if(innerWidth<900&&!document.body.classList.contains('panel-collapsed')){document.body.classList.add('panel-collapsed');}
  }
  function show(index,continuePlaying=playing){
    clearTourTimers();
    current=(index+scenes.length)%scenes.length;
    playing=Boolean(continuePlaying);
    enterCinematic();
    const scene=scenes[current];
    if(step)step.textContent=scene.step;
    if(kind)kind.textContent=scene.kind;
    if(title)title.textContent=scene.title;
    if(narrative)narrative.textContent=scene.narrative;
    if(progress)progress.style.width='0%';
    updateProfessionalScene(scene);
    updateDots();updateButtons();
    waitForApp(app=>app.goToView(scene.view,{duration:scene.move/speed,zone:scene.zone,profile:scene.profile}));
    sceneStarted=performance.now();
    const baseDuration=(scene.move+scene.hold)*1000/speed;
    const estimatedSpeech=voiceEnabled?estimateSpeechMs(scene):0;
    sceneDuration=Math.max(baseDuration,estimatedSpeech+700);
    progressFrame=requestAnimationFrame(progressLoop);
    const advance=()=>{
      if(!playing)return;
      if(current===scenes.length-1){pause();if(title)title.textContent='Tour complete · KAYAS investor experience';if(kind)kind.textContent='12 / 12';if(progress)progress.style.width='100%';setTimeout(()=>exitTour(),900);return;}
      show(current+1,true);
    };
    if(playing&&voiceEnabled){
      const minimumEnd=sceneStarted+baseDuration;
      speak(scene,()=>{
        if(!playing)return;
        const remaining=Math.max(450,minimumEnd-performance.now()+450);
        clearTimeout(advanceTimer);
        advanceTimer=setTimeout(advance,remaining);
        sceneDuration=Math.max(sceneDuration,performance.now()-sceneStarted+remaining);
      });
      advanceTimer=setTimeout(advance,Math.max(sceneDuration+6000,baseDuration+9000));
    }else{
      if(voiceEnabled)speak(scene);
      if(playing)advanceTimer=setTimeout(advance,sceneDuration);
    }
  }
  function play(){if(playing)return;playing=true;show(current<0?0:current,true);}
  function pause(){playing=false;clearTourTimers();updateButtons();}
  function exitTour(){pause();document.body.classList.remove('tour-cinematic','tour-paused','professional-mode','panel-collapsed');if(professionalSceneLayer)professionalSceneLayer.hidden=true;if(progress)progress.style.width='0%';if(step)step.textContent='Ready';if(kind)kind.textContent='12-scene investor route';if(title)title.textContent='KAYAS cinematic 3D walkthrough';if(narrative)narrative.textContent='Start the automated tour from the entrance to the technical backbone, or select scenes manually.';current=-1;updateDots();const drawerCloseButton=document.getElementById('drawerClose');if(drawerCloseButton)drawerCloseButton.click();waitForApp(app=>{app.stopCameraMotion('tour-exit');app.applyLayerProfile('clean');});}

  buildDots();updateButtons();applyProfessionalMode();if(tourVoice){tourVoice.setAttribute('aria-pressed','true');tourVoice.textContent='🔊 Voice On';tourVoice.title='Mute English narration';}
  if(tourButton)tourButton.addEventListener('click',()=>playing?pause():play());
  if(tourPlay)tourPlay.addEventListener('click',()=>playing?pause():play());
  const prev=document.getElementById('tourPrev'),next=document.getElementById('tourNext');
  if(prev)prev.addEventListener('click',()=>show(current<0?scenes.length-1:current-1,playing));
  if(next)next.addEventListener('click',()=>show(current<0?0:current+1,playing));
  if(tourRestart)tourRestart.addEventListener('click',()=>show(0,true));
  if(tourExit)tourExit.addEventListener('click',exitTour);
  if(tourVoice)tourVoice.addEventListener('click',()=>{voiceEnabled=!voiceEnabled;tourVoice.setAttribute('aria-pressed',voiceEnabled?'true':'false');tourVoice.textContent=voiceEnabled?'🔊 Voice On':'🔇 Muted';tourVoice.title=voiceEnabled?'Mute English narration':'Enable English narration';if(current>=0)show(current,playing);else if('speechSynthesis'in window)speechSynthesis.cancel();});
  if(professionalSceneToggle)professionalSceneToggle.addEventListener('click',toggleTourMode);
  if(tourModeToggle)tourModeToggle.addEventListener('click',toggleTourMode);
  if('speechSynthesis'in window){speechSynthesis.onvoiceschanged=()=>selectEnglishVoice();}
  if(tourSpeed)tourSpeed.addEventListener('change',()=>{speed=Number(tourSpeed.value)||1;if(playing&&current>=0)show(current,true);});
  window.addEventListener('kayas:manualcontrol',()=>{if(playing)pause();});
  window.addEventListener('keydown',event=>{
    const tag=(event.target&&event.target.tagName||'').toLowerCase();if(tag==='input'||tag==='textarea'||tag==='select')return;
    if(event.code==='Space'){event.preventDefault();playing?pause():play();}
    else if(event.code==='BracketLeft'){show(current<0?0:current-1,playing);}
    else if(event.code==='BracketRight'){show(current<0?0:current+1,playing);}
    else if(event.code==='KeyR'&&document.body.classList.contains('tour-cinematic'))show(0,true);
    else if(event.code==='KeyV'&&tourVoice)tourVoice.click();
    else if(event.code==='Escape'&&document.body.classList.contains('tour-cinematic'))exitTour();
  });
  const params=new URLSearchParams(location.search);if(params.get('autoplay')==='1'||params.get('tour')==='autoplay'){setTimeout(play,1800);}

  const activeKeys=new Set();
  function keyDown(code,button){if(activeKeys.has(code))return;activeKeys.add(code);button&&button.classList.add('is-pressed');window.dispatchEvent(new KeyboardEvent('keydown',{code,key:code,bubbles:true}));}
  function keyUp(code,button){activeKeys.delete(code);button&&button.classList.remove('is-pressed');window.dispatchEvent(new KeyboardEvent('keyup',{code,key:code,bubbles:true}));}
  document.querySelectorAll('[data-key]').forEach(btn=>{
    const code=btn.dataset.key;
    ['pointerdown','touchstart'].forEach(type=>btn.addEventListener(type,e=>{e.preventDefault();keyDown(code,btn);},{passive:false}));
    ['pointerup','pointercancel','pointerleave','touchend','touchcancel'].forEach(type=>btn.addEventListener(type,e=>{e.preventDefault();keyUp(code,btn);},{passive:false}));
  });
  window.addEventListener('blur',()=>document.querySelectorAll('[data-key]').forEach(btn=>keyUp(btn.dataset.key,btn)));

  setTimeout(()=>{const s=document.getElementById('loadStatus');if(s&&!s.hidden)s.hidden=true;},14000);
})();
