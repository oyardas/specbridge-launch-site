(()=>{
const K=window.DC_KNOWLEDGE,$=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
const fmt=s=>{s=Math.max(0,Math.round(Number(s)||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const audio=$('#moduleAudio'),player=$('#player'),playBtn=$('#audioPlay'),seek=$('#audioSeek'),time=$('#audioTime'),pct=$('#audioPercent'),rate=$('#audioRate'),autoNext=$('#autoNext');
let filter='All',current=null,currentIndex=-1,readerModule=null,narrationLoaded=null,lastSave=0;
const progressKey='dcKnowledgeProgressV1',lastKey='dcKnowledgeLastModuleV1';
const readProgress=()=>{try{return JSON.parse(localStorage.getItem(progressKey)||'{}')}catch(e){return {}}};
const writeProgress=p=>localStorage.setItem(progressKey,JSON.stringify(p));
const moduleProgress=m=>{const p=readProgress()[m.id];if(!p||!p.duration)return 0;return Math.max(0,Math.min(1,p.time/p.duration))};

const tools=$('.reader-tools');
tools.insertAdjacentHTML('afterend','<section class="golden-panel" id="goldenPanel" hidden></section>');
const goldenPanel=$('#goldenPanel'),toolLabel=$('.reader-tools>span');

const tracks=['All',...new Set(K.modules.map(m=>m.track))],filters=$('#filters');
tracks.forEach(t=>{const b=document.createElement('button');b.className='filter'+(t==='All'?' on':'');b.type='button';b.textContent=t;b.onclick=()=>{filter=t;[...filters.children].forEach(x=>x.classList.toggle('on',x===b));render()};filters.appendChild(b)});

function render(){
 const q=$('#search').value.trim().toLowerCase();
 const list=K.modules.filter(m=>(filter==='All'||m.track===filter)&&(!q||[m.id,m.title,m.subtitle,m.track,...m.tags].join(' ').toLowerCase().includes(q)));
 $('#cards').innerHTML=list.map(m=>{
   const p=moduleProgress(m),done=p>.97,g=m.golden;
   const mark=g?`GOLDEN ${esc(g.version)} · QUICK ${fmt(m.duration)}`:`S3F · ${fmt(m.duration)}`;
   const badge=g?'GOLDEN RESEARCH V2':done?'DİNLENDİ':'RESEARCH + AUDIO';
   const openLabel=g?'Golden Module →':'Oku →';
   return `<article class="card${g?' golden-card':''}" data-id="${m.id}">
     <div class="card-top"><span class="id">${m.id} · ${esc(m.track)}</span><span class="audio-mark">${mark}</span></div>
     <h3>${esc(m.title)}</h3><p>${esc(m.subtitle)}</p>
     <ul>${m.questions.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
     ${g?`<div class="golden-mini"><b>${g.researchSections}</b><span>research section</span><b>${g.sourceCount}</b><span>official source</span><b>${g.chapters.length}</b><span>full chapter</span></div>`:''}
     <div class="card-progress" title="Quick Brief dinleme ilerlemesi"><i style="width:${Math.round(p*100)}%"></i></div>
     <div class="meta"><span class="badge">${badge}</span><div class="card-actions"><button class="card-listen" type="button">${current?.id===m.id&&!audio.paused?'❚❚ Duraklat':p>0?'▶ Quick Devam':'▶ Quick Brief'}</button><button class="card-open" type="button">${openLabel}</button></div></div>
   </article>`
 }).join('')||'<p>Sonuç bulunamadı.</p>';
}
$('#search').addEventListener('input',render);
$('#cards').addEventListener('click',e=>{const card=e.target.closest('.card');if(!card)return;const m=K.modules.find(x=>x.id===card.dataset.id);if(!m)return;if(e.target.closest('.card-listen')){if(current?.id===m.id&&!audio.paused)audio.pause();else playModule(m,true,true)}else if(e.target.closest('.card-open')||e.target===card||e.target.closest('h3,p,ul,.card-top,.golden-mini'))openModule(m.id)});
$('#roadmap').innerHTML=K.roadmap.map(([id,t])=>`<div class="road-item"><b>${id}</b><span>${esc(t)}</span><em>PLANNED</em></div>`).join('');

function inline(s){return esc(s).replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>').replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')}
function md(src){
 const lines=src.replace(/\r/g,'').split('\n');let out='',inCode=false,code=[],inList=false,i=0;
 const closeList=()=>{if(inList){out+='</ul>';inList=false}};
 while(i<lines.length){
   let l=lines[i];
   if(l.startsWith('```')){closeList();if(inCode){out+=`<pre><code>${esc(code.join('\n'))}</code></pre>`;code=[];inCode=false}else inCode=true;i++;continue}
   if(inCode){code.push(l);i++;continue}
   if(/^\|.*\|$/.test(l)&&i+1<lines.length&&/^\|?\s*:?-+/.test(lines[i+1])){
     closeList();let rows=[l];i+=2;while(i<lines.length&&/^\|.*\|$/.test(lines[i]))rows.push(lines[i++]);
     const cells=rows.map(r=>r.split('|').slice(1,-1).map(x=>x.trim()));
     out+='<div class="table-wrap"><table><thead><tr>'+cells[0].map(x=>`<th>${inline(x)}</th>`).join('')+'</tr></thead><tbody>'+cells.slice(1).map(r=>'<tr>'+r.map(x=>`<td>${inline(x)}</td>`).join('')+'</tr>').join('')+'</tbody></table></div>';continue
   }
   if(/^#### /.test(l)){closeList();out+=`<h4>${inline(l.slice(5))}</h4>`}
   else if(/^### /.test(l)){closeList();out+=`<h3>${inline(l.slice(4))}</h3>`}
   else if(/^## /.test(l)){closeList();out+=`<h2>${inline(l.slice(3))}</h2>`}
   else if(/^# /.test(l)){closeList();out+=`<h1>${inline(l.slice(2))}</h1>`}
   else if(/^[-*] /.test(l)){if(!inList){out+='<ul>';inList=true}out+=`<li>${inline(l.slice(2))}</li>`}
   else if(/^\d+\. /.test(l)){closeList();out+=`<p class="numbered">${inline(l)}</p>`}
   else if(/^> /.test(l)){closeList();out+=`<blockquote>${inline(l.slice(2))}</blockquote>`}
   else if(/^---\s*$/.test(l)){closeList();out+='<hr>'}
   else if(!l.trim()){closeList()}
   else{closeList();out+=`<p>${inline(l)}</p>`}
   i++
 }
 closeList();return out
}

function goldenHTML(m){
 const g=m.golden;if(!g)return '';
 const chapters=g.chapters.map(([id,t],i)=>`<div class="gold-chapter"><span>${id}</span><b>${esc(t)}</b><em>${i===0?'START':'CH '+String(i+1).padStart(2,'0')}</em></div>`).join('');
 const families=g.serviceFamilies.map(([a,b])=>`<div class="taxonomy-item"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
 const resp=g.responsibility.map(([a,b,c,d],i)=>`<div class="responsibility-step"><i>${i+1}</i><b>${esc(a)}</b><span>Facility: ${esc(b)}</span><span>IT: ${esc(c)}</span><span>App: ${esc(d)}</span></div>`).join('');
 const fitRows=g.facilityFit.map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('');
 const maturity=g.maturity.map(([l,t,s])=>`<div class="maturity-step"><span>${esc(l)}</span><b>${esc(t)}</b><small>${esc(s)}</small></div>`).join('');
 return `<div class="golden-head">
   <div><span>DC-K01 · GOLDEN MODULE ${esc(g.version)}</span><h3>Service model architecture before facility architecture</h3><p>Hizmet, sorumluluk, SLA, workload ve ticari birim tanımlanmadan fiziksel mimari dondurulmamalıdır.</p></div>
   <div class="golden-metrics"><b>${g.researchSections}</b><span>Research sections</span><b>${g.sourceCount}</b><span>Official sources</span><b>${g.chapters.length}</b><span>Full Brief chapters</span></div>
 </div>
 <div class="golden-audio">
   <div class="golden-audio-card live"><span>QUICK BRIEF · LIVE</span><b>~${fmt(m.duration)}</b><p>Mevcut S3F hızlı açıklama.</p><button type="button" data-gold-action="quick">▶ Quick Brief</button></div>
   <div class="golden-audio-card pending"><span>FULL BRIEFING · AUDIO QA</span><b>${esc(g.targetFullMinutes)} dk</b><p>8 chapter master script hazır. Audio, 8/8 transcript + tail QA geçmeden yayınlanmayacak.</p><button type="button" disabled>QA BEKLENİYOR</button></div>
 </div>
 <div class="golden-grid">
   <section class="golden-visual taxonomy"><header><span>VISUAL 01</span><h4>Canonical Service Taxonomy</h4></header><div class="taxonomy-grid">${families}</div></section>
   <section class="golden-visual responsibility"><header><span>VISUAL 02</span><h4>Responsibility Spectrum</h4></header><div class="responsibility-flow">${resp}</div></section>
   <section class="golden-visual facility-fit"><header><span>VISUAL 03</span><h4>Service → Facility Architecture</h4></header><div class="table-wrap"><table><thead><tr><th>Service</th><th>Isolation</th><th>Power density</th><th>Fabric</th><th>MMR / Interconnect</th></tr></thead><tbody>${fitRows}</tbody></table></div></section>
   <section class="golden-visual maturity"><header><span>VISUAL 04</span><h4>Provider Maturity Ladder</h4></header><div class="maturity-ladder">${maturity}</div></section>
 </div>
 <section class="golden-chapters"><header><div><span>FULL BRIEFING PLAN</span><h4>8 chapter · ${esc(g.targetFullMinutes)} dk target</h4></div><small>Quick Brief ayrı kalır; Full Briefing araştırma derinliğini taşır.</small></header><div class="chapter-grid">${chapters}</div></section>
 <div class="golden-rule"><b>Golden rule</b><span>TARGET CUSTOMER → SERVICE / REVENUE MODEL → RESPONSIBILITY → SLA / RISK → WORKLOAD → CAPACITY / DENSITY → FACILITY + IT ARCHITECTURE → BoQ</span></div>`;
}

function savePosition(force=false){if(!current||!Number.isFinite(audio.currentTime))return;const now=Date.now();if(!force&&now-lastSave<4000)return;lastSave=now;const p=readProgress(),dur=Number.isFinite(audio.duration)?audio.duration:current.duration;p[current.id]={time:audio.currentTime,duration:dur,updated:now,complete:dur>0&&audio.currentTime/dur>.97};writeProgress(p);localStorage.setItem(lastKey,current.id)}
function updateAudioUI(){const dur=Number.isFinite(audio.duration)?audio.duration:(current?.duration||0),cur=Number.isFinite(audio.currentTime)?audio.currentTime:0,ratio=dur?cur/dur:0;seek.value=Math.round(ratio*1000);time.textContent=fmt(cur)+' / '+fmt(dur);pct.textContent=Math.round(ratio*100)+'%';playBtn.textContent=audio.paused?'▶ Dinle':'❚❚ Duraklat';$('#readerListen').textContent=readerModule&&current?.id===readerModule.id&&!audio.paused?'❚❚ Duraklat':readerModule?.golden?'▶ Quick Brief':'▶ Dinle';$('#playerStatus').textContent=(audio.paused?'Hazır':'Oynatılıyor')+' · S3F Senior Adviser · AI-generated voice'}
function setMediaSession(m){if(!('mediaSession'in navigator))return;try{navigator.mediaSession.metadata=new MediaMetadata({title:m.title,artist:'SpecBridge · S3F Senior Adviser',album:'Data Center Knowledge Library'});navigator.mediaSession.setActionHandler('play',()=>audio.play());navigator.mediaSession.setActionHandler('pause',()=>audio.pause());navigator.mediaSession.setActionHandler('seekbackward',d=>audio.currentTime=Math.max(0,audio.currentTime-(d.seekOffset||15)));navigator.mediaSession.setActionHandler('seekforward',d=>audio.currentTime=Math.min(audio.duration||m.duration,audio.currentTime+(d.seekOffset||15)));navigator.mediaSession.setActionHandler('previoustrack',()=>changeModule(-1,true));navigator.mediaSession.setActionHandler('nexttrack',()=>changeModule(1,true))}catch(e){}}
function selectModule(m,resume=true){if(!m)return;const same=current?.id===m.id;if(!same){savePosition(true);audio.pause();current=m;currentIndex=K.modules.findIndex(x=>x.id===m.id);audio.src=m.audio;$('#playerCode').textContent=m.id+' · '+m.track;$('#playerTitle').textContent=m.title;player.dataset.open='true';setMediaSession(m);const saved=readProgress()[m.id];audio.addEventListener('loadedmetadata',()=>{if(resume&&saved?.time>2&&saved.time<(audio.duration||m.duration)-8)audio.currentTime=saved.time;updateAudioUI()},{once:true})}else player.dataset.open='true';audio.playbackRate=Number(rate.value)||1;updateAudioUI();return same}
function playModule(m,autoplay=true,resume=true){selectModule(m,resume);if(autoplay)audio.play().catch(()=>{});localStorage.setItem(lastKey,m.id);render()}
function changeModule(delta,autoplay=true){if(!current){playModule(K.modules[0],autoplay,true);return}const next=Math.max(0,Math.min(K.modules.length-1,currentIndex+delta));if(next===currentIndex){if(delta>0)audio.currentTime=audio.duration||current.duration;else audio.currentTime=0;return}playModule(K.modules[next],autoplay,true)}
audio.addEventListener('timeupdate',()=>{updateAudioUI();savePosition(false)});audio.addEventListener('loadedmetadata',updateAudioUI);audio.addEventListener('play',()=>{updateAudioUI();render();localStorage.setItem(lastKey,current?.id||'')});audio.addEventListener('pause',()=>{savePosition(true);updateAudioUI();render()});audio.addEventListener('ended',()=>{savePosition(true);render();if(autoNext.checked&&currentIndex<K.modules.length-1)changeModule(1,true)});
playBtn.onclick=()=>{if(!current)playModule(K.modules[0],true,true);else if(audio.paused)audio.play().catch(()=>{});else audio.pause()};
seek.oninput=()=>{if(Number.isFinite(audio.duration))audio.currentTime=audio.duration*(Number(seek.value)/1000)};
$('#audioBack').onclick=()=>audio.currentTime=Math.max(0,audio.currentTime-15);$('#audioForward').onclick=()=>audio.currentTime=Math.min(audio.duration||current?.duration||0,audio.currentTime+15);$('#audioPrev').onclick=()=>changeModule(-1,true);$('#audioNext').onclick=()=>changeModule(1,true);
rate.value=localStorage.getItem('dcKnowledgeRate')||'1';rate.onchange=()=>{audio.playbackRate=Number(rate.value)||1;localStorage.setItem('dcKnowledgeRate',rate.value)};
autoNext.checked=localStorage.getItem('dcKnowledgeAutoNext')!=='false';autoNext.onchange=()=>localStorage.setItem('dcKnowledgeAutoNext',String(autoNext.checked));
$('#playerClose').onclick=()=>{audio.pause();player.dataset.open='false'};
$('#listenAll').onclick=()=>playModule(K.modules[0],true,true);
$('#resumeBtn').onclick=()=>{const id=localStorage.getItem(lastKey),m=K.modules.find(x=>x.id===id)||K.modules.find(x=>moduleProgress(x)>0)||K.modules[0];playModule(m,true,true)};

async function openModule(id){
 const m=K.modules.find(x=>x.id===id);if(!m)return;
 readerModule=m;narrationLoaded=null;
 $('#readerId').textContent=m.id+' · '+m.track;$('#readerTitle').textContent=m.title;$('#readerBody').innerHTML='<p>Research yükleniyor…</p>';
 $('#narrationPanel').hidden=true;$('#showNarration').textContent=m.golden?'Quick Ses Metni':'Ses Metni';
 toolLabel.textContent=m.golden?`Golden Module ${m.golden.version} · Deep Research`:'Deep Research Baseline';
 $('#readerListen').textContent=current?.id===m.id&&!audio.paused?'❚❚ Duraklat':m.golden?'▶ Quick Brief':'▶ Dinle';
 if(m.golden){goldenPanel.hidden=false;goldenPanel.innerHTML=goldenHTML(m)}else{goldenPanel.hidden=true;goldenPanel.innerHTML=''}
 $('#reader').showModal();history.replaceState(null,'','#'+id);
 try{const r=await fetch(m.file+'?v='+K.updated);if(!r.ok)throw new Error(r.status);$('#readerBody').innerHTML=md(await r.text())}catch(e){$('#readerBody').innerHTML='<p>Research dosyası yüklenemedi.</p>'}
}
goldenPanel.addEventListener('click',e=>{if(e.target.closest('[data-gold-action="quick"]')&&readerModule)playModule(readerModule,true,true)});

$('#readerListen').onclick=()=>{if(!readerModule)return;if(current?.id===readerModule.id&&!audio.paused)audio.pause();else playModule(readerModule,true,true)};
$('#showNarration').onclick=async()=>{
 if(!readerModule)return;const panel=$('#narrationPanel');
 if(!panel.hidden){panel.hidden=true;$('#showNarration').textContent=readerModule.golden?'Quick Ses Metni':'Ses Metni';return}
 panel.hidden=false;$('#showNarration').textContent='Ses Metnini Kapat';
 if(narrationLoaded===readerModule.id)return;
 $('#narrationText').textContent='Ses metni yükleniyor…';
 try{const path=readerModule.audio.replace(/\.mp3$/i,'.source.txt'),r=await fetch(path+'?v='+K.updated);if(!r.ok)throw new Error(r.status);const txt=await r.text();$('#narrationText').innerHTML=txt.split(/\n\s*\n/).filter(Boolean).map(x=>`<p>${esc(x.trim())}</p>`).join('');narrationLoaded=readerModule.id}catch(e){$('#narrationText').textContent='Ses metni yüklenemedi.'}
};
function closeReader(){if($('#reader').open)$('#reader').close();history.replaceState(null,'',location.pathname);readerModule=null;goldenPanel.hidden=true}
$('#closeReader').onclick=closeReader;$('#reader').addEventListener('click',e=>{if(e.target===$('#reader'))closeReader()});
$('#copyLink').onclick=async()=>{await navigator.clipboard.writeText(location.origin+location.pathname+location.hash);$('#copyLink').textContent='Kopyalandı';setTimeout(()=>$('#copyLink').textContent='Modül Linkini Kopyala',1200)};
$('#themeBtn').onclick=()=>{document.documentElement.classList.toggle('light');localStorage.setItem('dcKnowledgeTheme',document.documentElement.classList.contains('light')?'light':'dark')};if(localStorage.getItem('dcKnowledgeTheme')==='light')document.documentElement.classList.add('light');
document.addEventListener('keydown',e=>{if(/INPUT|SELECT|TEXTAREA|BUTTON/.test(e.target.tagName))return;if(e.code==='Space'){e.preventDefault();playBtn.click()}else if(e.key==='ArrowLeft'&&current){audio.currentTime=Math.max(0,audio.currentTime-15)}else if(e.key==='ArrowRight'&&current){audio.currentTime=Math.min(audio.duration||current.duration,audio.currentTime+15)}});
window.addEventListener('beforeunload',()=>savePosition(true));render();updateAudioUI();const start=location.hash.slice(1);if(start&&K.modules.some(m=>m.id===start))openModule(start);
})();