(()=>{
const K=window.DC_KNOWLEDGE;
const m=K?.modules?.find(x=>x.id==='DC-K01');
const g=m?.golden;
if(!m||!g||g.fullAudioStatus!=='LIVE'||!Array.isArray(g.chapters)||g.chapters.length!==8)return;
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const fmt=s=>{s=Math.max(0,Math.round(Number(s)||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const chapters=g.chapters.map((c,i)=>({index:i,id:c[0],title:c[1],duration:Number(c[2])||0,audio:c[3],source:c[4]}));
const total=chapters.reduce((n,c)=>n+c.duration,0);
const offsets=[];let acc=0;chapters.forEach(c=>{offsets.push(acc);acc+=c.duration});
const key='dcKnowledgeDCK01FullV2';
const quick=$('#moduleAudio'),quickPlayer=$('#player'),panel=$('#goldenPanel');
const full=new Audio();full.preload='metadata';
let idx=0,lastSave=0,pendingSeek=null;
let saved={idx:0,time:0,rate:1,auto:true};
try{saved={...saved,...JSON.parse(localStorage.getItem(key)||'{}')}}catch(_){ }
idx=Math.max(0,Math.min(chapters.length-1,Number(saved.idx)||0));

const shell=document.createElement('div');
shell.className='full-player';shell.id='dck01FullPlayer';shell.dataset.open='false';
shell.innerHTML=`<div class="full-info"><span id="fullCode">DC-K01 · FULL BRIEFING</span><b id="fullTitle">${esc(chapters[idx].title)}</b><small id="fullStatus">S3F Senior Adviser · 8/8 QA PASS</small></div><div class="full-main"><div class="full-progress"><input id="fullSeek" type="range" min="0" max="1000" value="0" aria-label="Full Briefing ilerleme çubuğu"><div><span id="fullTime">0:00 / ${fmt(total)}</span><span id="fullChapter">1 / 8</span></div></div><div class="full-transport"><button id="fullPrev" type="button" title="Önceki chapter">← Bölüm</button><button id="fullBack" type="button" title="15 saniye geri">−15</button><button id="fullPlay" class="play" type="button">▶ Dinle</button><button id="fullForward" type="button" title="15 saniye ileri">+15</button><button id="fullNext" type="button" title="Sonraki chapter">Bölüm →</button></div></div><div class="full-options"><label>Hız<select id="fullRate"><option value="0.85">0.85×</option><option value="1">1.0×</option><option value="1.15">1.15×</option><option value="1.3">1.30×</option></select></label><label class="auto"><input id="fullAuto" type="checkbox"> Otomatik sonraki</label><button id="fullClose" type="button" aria-label="Full playerı kapat">×</button></div>`;
document.body.appendChild(shell);
const seek=$('#fullSeek'),time=$('#fullTime'),chapterLabel=$('#fullChapter'),play=$('#fullPlay'),rate=$('#fullRate'),auto=$('#fullAuto');
rate.value=String(saved.rate||1);auto.checked=saved.auto!==false;full.playbackRate=Number(rate.value)||1;

function globalTime(){return offsets[idx]+(Number.isFinite(full.currentTime)?full.currentTime:0)}
function save(force=false){const now=Date.now();if(!force&&now-lastSave<3500)return;lastSave=now;localStorage.setItem(key,JSON.stringify({idx,time:Number.isFinite(full.currentTime)?full.currentTime:0,rate:Number(rate.value)||1,auto:auto.checked,updated:now,complete:idx===chapters.length-1&&full.duration&&full.currentTime/full.duration>.97}))}
function paintRows(){panel?.querySelectorAll('.gold-chapter').forEach((el,i)=>el.classList.toggle('playing',i===idx&&shell.dataset.open==='true'))}
function update(){const gt=Math.min(total,globalTime());seek.value=Math.round(total?gt/total*1000:0);time.textContent=`${fmt(gt)} / ${fmt(total)}`;chapterLabel.textContent=`${idx+1} / ${chapters.length}`;play.textContent=full.paused?'▶ Dinle':'❚❚ Duraklat';$('#fullCode').textContent=`DC-K01 · ${chapters[idx].id} · FULL BRIEFING`;$('#fullTitle').textContent=chapters[idx].title;$('#fullStatus').textContent=(full.paused?'Hazır':'Oynatılıyor')+' · S3F Senior Adviser · 8/8 QA PASS';paintRows();try{if('mediaSession'in navigator)navigator.mediaSession.playbackState=full.paused?'paused':'playing'}catch(_){}}
function media(){if(!('mediaSession'in navigator))return;try{navigator.mediaSession.metadata=new MediaMetadata({title:`${chapters[idx].id} · ${chapters[idx].title}`,artist:'SpecBridge · S3F Senior Adviser',album:'DC-K01 · Data Center Hizmet Modelleri · Full Briefing'});navigator.mediaSession.setActionHandler('play',()=>full.play());navigator.mediaSession.setActionHandler('pause',()=>full.pause());navigator.mediaSession.setActionHandler('seekbackward',d=>seekGlobal(globalTime()-(d.seekOffset||15),!full.paused));navigator.mediaSession.setActionHandler('seekforward',d=>seekGlobal(globalTime()+(d.seekOffset||15),!full.paused));navigator.mediaSession.setActionHandler('seekto',d=>{if(Number.isFinite(d.seekTime))full.currentTime=Math.max(0,Math.min(full.duration||chapters[idx].duration,d.seekTime))});navigator.mediaSession.setActionHandler('previoustrack',()=>setChapter(Math.max(0,idx-1),true,false,0));navigator.mediaSession.setActionHandler('nexttrack',()=>setChapter(Math.min(chapters.length-1,idx+1),true,false,0))}catch(_){}}
function setChapter(n,autoplay=true,resume=false,at=0){n=Math.max(0,Math.min(chapters.length-1,n));const c=chapters[n];const wasPlaying=!full.paused;full.pause();quick?.pause();if(quickPlayer)quickPlayer.dataset.open='false';idx=n;shell.dataset.open='true';full.src=c.audio;full.playbackRate=Number(rate.value)||1;pendingSeek=resume&&Number(saved.idx)===n?Math.max(0,Number(saved.time)||0):Math.max(0,Number(at)||0);full.addEventListener('loadedmetadata',()=>{if(pendingSeek!==null){full.currentTime=Math.min(Math.max(0,pendingSeek),Math.max(0,(full.duration||c.duration)-.05));pendingSeek=null}update();save(true);if(autoplay||wasPlaying)full.play().catch(()=>{})},{once:true});media();update()}
function seekGlobal(sec,autoplay=!full.paused){sec=Math.max(0,Math.min(total,Number(sec)||0));let n=chapters.length-1;for(let i=0;i<chapters.length;i++){if(sec<offsets[i]+chapters[i].duration){n=i;break}}const local=Math.max(0,sec-offsets[n]);if(n===idx&&full.src){full.currentTime=Math.min(local,full.duration||chapters[n].duration);if(autoplay&&full.paused)full.play().catch(()=>{});update();return}setChapter(n,autoplay,false,local)}
function startFull(){const s=(()=>{try{return JSON.parse(localStorage.getItem(key)||'{}')}catch(_){return {}}})();saved={...saved,...s};const n=Math.max(0,Math.min(chapters.length-1,Number(saved.idx)||0));setChapter(n,true,true,0)}

function enhance(){if(!panel||panel.hidden)return;const card=panel.querySelector('.golden-audio-card.pending');if(card){card.classList.remove('pending');card.classList.add('live','full-live');card.innerHTML=`<span>FULL BRIEFING · LIVE · QA 8/8 PASS</span><b>${fmt(total)}</b><p>8 chapter · S3F mastered Turkish narration · transcript + tail QA.</p><button type="button" data-full-start>▶ Full Briefing</button>`}panel.querySelectorAll('.gold-chapter').forEach((el,i)=>{if(el.dataset.fullEnhanced)return;el.dataset.fullEnhanced='1';el.classList.add('playable');const meta=document.createElement('small');meta.className='chapter-duration';meta.textContent=fmt(chapters[i].duration);el.appendChild(meta);const btn=document.createElement('button');btn.type='button';btn.className='chapter-play';btn.textContent='▶';btn.setAttribute('aria-label',`${chapters[i].id} bölümünü dinle`);el.appendChild(btn);el.addEventListener('click',()=>setChapter(i,true,false,0))});paintRows()}
const obs=new MutationObserver(enhance);if(panel)obs.observe(panel,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});enhance();
panel?.addEventListener('click',e=>{if(e.target.closest('[data-full-start]'))startFull()});
quick?.addEventListener('play',()=>{if(!full.paused)full.pause()});
full.addEventListener('timeupdate',()=>{update();save(false)});full.addEventListener('play',()=>{quick?.pause();if(quickPlayer)quickPlayer.dataset.open='false';shell.dataset.open='true';update();media()});full.addEventListener('pause',()=>{save(true);update()});full.addEventListener('loadedmetadata',update);full.addEventListener('ended',()=>{save(true);if(auto.checked&&idx<chapters.length-1)setChapter(idx+1,true,false,0);else update()});
play.onclick=()=>{if(!full.src){startFull();return}if(full.paused)full.play().catch(()=>{});else full.pause()};
seek.oninput=()=>seekGlobal(total*(Number(seek.value)/1000),!full.paused);
$('#fullBack').onclick=()=>seekGlobal(globalTime()-15,!full.paused);$('#fullForward').onclick=()=>seekGlobal(globalTime()+15,!full.paused);$('#fullPrev').onclick=()=>setChapter(Math.max(0,idx-1),true,false,0);$('#fullNext').onclick=()=>setChapter(Math.min(chapters.length-1,idx+1),true,false,0);
rate.onchange=()=>{full.playbackRate=Number(rate.value)||1;save(true)};auto.onchange=()=>save(true);$('#fullClose').onclick=()=>{full.pause();shell.dataset.open='false';paintRows()};
window.addEventListener('beforeunload',()=>save(true));update();
})();
