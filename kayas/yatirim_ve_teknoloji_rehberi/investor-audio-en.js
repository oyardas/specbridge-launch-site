(function(){
'use strict';
const SCRIPT_URL='audio/KAYAS_Investor_Edition_2026_EN_Narration.txt?v=20260809-en1';
const TITLES={
'00':'Executive Introduction','01':'Investment and Market Outlook','02':'Traditional, Micro-Module, and Prefabricated Modular Data Centers','03':'Data Center Electrical Infrastructure','04':'Uninterruptible Power Supply, UPS','05':'PDU, Busway, and Rack Power Distribution','06':'Batteries and Energy Storage','07':'Generators and Standby Power','08':'Cooling, Chillers, Liquid Cooling, and the 8°C Natural-Water Source','09':'Fiber and Network Infrastructure','10':'Cloud Services','11':'Colocation','12':'Tiering, Standards, and Commissioning','13':'Compute, Storage, and Hyperconverged Infrastructure','14':'Virtualization, Redundancy, and Growth','15':'Backup and Disaster Recovery','16':'DCIM, BMS, EMS, NMS, NOC, and SOC','17':'Physical and Cyber Security','18':'AI, GPU, and AI Clusters','19':'Sustainability','20':'Edge Data Centers','21':'Quantum Computing and Post-Quantum Cryptography','22':'CAPEX, OPEX, TCO, and Commercial Feasibility','23':'KAYAŞ Investment Roadmap','24':'Closing Summary'};
const VISUALS={
'00':['../assets/gallery/kayas_concept_24_entrance.webp','KAYAŞ investment vision — conceptual view'],
'01':['../assets/gallery/kayas_concept_24_entrance.webp','Investment vision and regional digital platform'],
'02':['../assets/gallery/kayas_concept_09_datahall.webp','Modular data-hall concept'],
'03':['../assets/gallery/kayas_concept_15_electrical.webp','Electrical distribution and bypass area'],
'04':['../assets/gallery/kayas_concept_15_electrical.webp','UPS and critical-power continuity'],
'05':['../assets/gallery/kayas_concept_11_datahall.webp','Rack-level power distribution and service corridor'],
'06':['../assets/gallery/kayas_concept_14_battery.webp','Battery and energy-storage area'],
'07':['../assets/gallery/kayas_concept_15_electrical.webp','Standby-power chain'],
'08':['../assets/gallery/kayas_concept_16_terrace.webp','Cooling plant and east-terrace concept'],
'09':['../assets/gallery/kayas_concept_13_fiber.webp','Fiber and carrier infrastructure'],
'10':['../assets/gallery/kayas_concept_07_management.webp','Cloud and management platform'],
'11':['../assets/gallery/kayas_concept_09_datahall.webp','Colocation data hall'],
'12':['../assets/gallery/kayas_concept_15_electrical.webp','Commissioning and technical verification'],
'13':['../assets/gallery/kayas_concept_09_datahall.webp','Compute, storage and HCI platform'],
'14':['../assets/gallery/kayas_concept_07_management.webp','Virtualization and centralized management'],
'15':['../assets/gallery/kayas_concept_07_management.webp','Backup and DR operations'],
'16':['../assets/gallery/kayas_concept_22_management.webp','Integrated NOC operations center'],
'17':['../assets/gallery/kayas_concept_03_security.webp','Physical and cyber security layers'],
'18':['../assets/gallery/kayas_concept_10_datahall.webp','High-density AI/GPU data hall'],
'19':['../assets/gallery/kayas_concept_16_terrace.webp','Energy and cooling sustainability'],
'20':['../assets/gallery/kayas_concept_12_expansion.webp','Edge and future-expansion strategy'],
'21':['../assets/gallery/kayas_concept_21_management.webp','Quantum and post-quantum strategy'],
'22':['../assets/gallery/kayas_concept_23_meeting.webp','TCO and investment decision surface'],
'23':['../assets/gallery/kayas_concept_24_entrance.webp','KAYAŞ investment roadmap'],
'24':['../assets/gallery/kayas_concept_24_entrance.webp','Closing investment vision']
};
const $=id=>document.getElementById(id);
const chaptersEl=$('chapters'),toc=$('tocGrid'),status=$('audioStatus');
let sections=[],activeSection=-1,queue=[],queuePos=0,paused=false,speed=1;
let currentUtterance=null;
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#039;'}[m]));}
function splitScript(text){
  const lines=text.replace(/\r/g,'').split('\n');
  const out=[];let current=null;
  function flush(){if(current&&current.text.trim())out.push(current);}
  for(const raw of lines){const line=raw.trim();
    let m=line.match(/^EXECUTIVE INTRODUCTION$/);if(m){flush();current={id:'00',heading:line,text:''};continue;}
    m=line.match(/^CHAPTER\s+(\d+)\s+—\s+(.+)$/);if(m){flush();current={id:String(m[1]).padStart(2,'0'),heading:line,text:''};continue;}
    if(line==='CLOSING SUMMARY'){flush();current={id:'24',heading:line,text:''};continue;}
    if(current&&line&&!/^End of English Audio Edition\.?$/i.test(line))current.text+=(current.text?'\n\n':'')+line;
  }flush();return out;
}
function visualHTML(s){const v=VISUALS[s.id];if(!v)return '';return '<figure class="chapter-visual"><img loading="lazy" src="'+v[0]+'" alt="'+esc(v[1])+'"><figcaption><strong>'+esc(v[1])+'</strong> · Conceptual illustration; not a final engineering drawing.</figcaption></figure>';}
function render(){
  toc.innerHTML=sections.map((s,i)=>'<a href="#audio-'+s.id+'"><b>'+(s.id==='00'?'INTRO':s.id==='24'?'END':s.id)+'</b><span>'+esc(TITLES[s.id]||s.heading)+'</span></a>').join('');
  chaptersEl.innerHTML=sections.map((s,i)=>'<section class="paper audio-chapter" id="audio-'+s.id+'" data-index="'+i+'"><div class="section-head"><div class="section-no">'+(s.id==='00'?'00':s.id==='24'?'24':s.id)+'</div><div><div class="eyebrow">'+(s.id==='00'?'EXECUTIVE AUDIO BRIEF':s.id==='24'?'CLOSING':'CHAPTER '+Number(s.id))+'</div><h1>'+esc(TITLES[s.id]||s.heading)+'</h1></div></div>'+visualHTML(s)+'<div class="chapter-audio"><button type="button" data-play="'+i+'">▶ Listen to this section</button><span>English narration · browser voice</span></div><div class="section-copy">'+s.text.split(/\n\n+/).map(p=>'<p>'+esc(p)+'</p>').join('')+'</div></section>').join('');
  document.querySelectorAll('[data-play]').forEach(b=>b.addEventListener('click',()=>playSingle(Number(b.dataset.play))));
}
function chooseVoice(){const voices=speechSynthesis.getVoices();return voices.find(v=>/^en-GB/i.test(v.lang)&&/natural|online/i.test(v.name))||voices.find(v=>/^en-US/i.test(v.lang)&&/natural|online/i.test(v.name))||voices.find(v=>/^en-GB/i.test(v.lang))||voices.find(v=>/^en-US/i.test(v.lang))||voices.find(v=>/^en/i.test(v.lang))||null;}
function sentenceChunks(text,max=2600){const parts=text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[text];const chunks=[];let c='';for(const p of parts){if((c+' '+p).length>max&&c){chunks.push(c.trim());c=p;}else c+=(c?' ':'')+p;}if(c.trim())chunks.push(c.trim());return chunks;}
function clearHighlight(){document.querySelectorAll('.audio-chapter.is-speaking').forEach(x=>x.classList.remove('is-speaking'));}
function stop(){speechSynthesis.cancel();queue=[];queuePos=0;activeSection=-1;paused=false;currentUtterance=null;clearHighlight();status.textContent='Narration stopped.';}
function speakQueue(){
  if(!queue.length||queuePos>=queue.length){stop();status.textContent='Narration complete.';return;}
  const item=queue[queuePos];activeSection=item.index;clearHighlight();const card=document.querySelector('.audio-chapter[data-index="'+item.index+'"]');if(card)card.classList.add('is-speaking');
  const u=new SpeechSynthesisUtterance(item.text);currentUtterance=u;u.lang='en-US';u.rate=speed;u.pitch=1;const voice=chooseVoice();if(voice)u.voice=voice;
  status.textContent='Playing: '+TITLES[sections[item.index].id]+' · part '+item.part+' of '+item.total;
  u.onend=()=>{if(paused)return;queuePos++;speakQueue();};u.onerror=()=>{queuePos++;speakQueue();};speechSynthesis.speak(u);
}
function makeQueue(indices){const q=[];indices.forEach(index=>{const s=sections[index],chunks=sentenceChunks((TITLES[s.id]||s.heading)+'. '+s.text);chunks.forEach((text,j)=>q.push({index,text,part:j+1,total:chunks.length}));});return q;}
function playSingle(index){stop();queue=makeQueue([index]);queuePos=0;document.querySelector('#audio-'+sections[index].id)?.scrollIntoView({behavior:'smooth',block:'start'});speakQueue();}
function playAll(){stop();queue=makeQueue(sections.map((_,i)=>i));queuePos=0;speakQueue();}
$('playAll').onclick=playAll;
$('pauseAudio').onclick=()=>{if(!speechSynthesis.speaking&&!speechSynthesis.paused)return;if(speechSynthesis.paused){speechSynthesis.resume();paused=false;$('pauseAudio').textContent='⏸ Pause';status.textContent='Narration resumed.';}else{speechSynthesis.pause();paused=true;$('pauseAudio').textContent='▶ Resume';status.textContent='Narration paused.';}};
$('stopAudio').onclick=()=>{stop();$('pauseAudio').textContent='⏸ Pause';};
$('audioSpeed').onchange=e=>{speed=Number(e.target.value)||1;status.textContent='Narration speed set to '+speed.toFixed(2)+'×. It will apply to the next spoken segment.';};
$('printButton').onclick=()=>window.print();
$('menuToggle').onclick=()=>{const n=$('topNav');const open=n.classList.toggle('is-open');$('menuToggle').setAttribute('aria-expanded',String(open));};
window.addEventListener('beforeunload',()=>speechSynthesis.cancel());
fetch(SCRIPT_URL,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.text();}).then(text=>{sections=splitScript(text);render();status.textContent='English narration ready · '+sections.length+' sections.';if('speechSynthesis'in window){speechSynthesis.getVoices();}}).catch(err=>{chaptersEl.innerHTML='<section class="paper"><h1>English narration could not be loaded</h1><p>'+esc(err.message)+'</p></section>';status.textContent='Audio script unavailable.';});
})();
