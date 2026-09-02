(()=>{
const K=window.DC_KNOWLEDGE,panel=document.querySelector('#goldenPanel'),readerId=document.querySelector('#readerId');
if(!K||!panel||!readerId)return;
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const fmt=s=>{s=Math.max(0,Math.round(Number(s)||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const activeModule=()=>{const id=(readerId.textContent||'').split(' · ')[0];return K.modules.find(x=>x.id===id)};
function renderK05(m){
 const g=m.golden;
 const chapters=g.chapters.map(([id,t],i)=>`<div class="gold-chapter"><span>${esc(id)}</span><b>${esc(t)}</b><em>${i===0?'START':'CH '+String(i+1).padStart(2,'0')}</em></div>`).join('');
 const domains=g.thermalDomains.map(([a,b])=>`<div class="taxonomy-item"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
 const fit=g.architectureFit.map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('');
 const interfaces=g.interfaceMatrix.map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('');
 const chain=g.commissioningChain.map(([a,b],i)=>`<div class="responsibility-step"><i>${i+1}</i><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
 return `<div class="golden-head" data-k05-golden-ui="${esc(K.updated)}">
  <div><span>DC-K05 · GOLDEN MODULE ${esc(g.version)}</span><h3>Cooling architecture is an end-to-end thermal contract</h3><p>Air veya liquid teknoloji seçimi tek başına çözüm değildir. Workload, heat capture, TCS/FWS boundary, hydraulics, heat rejection, resilience, controls ve commissioning aynı thermal chain içinde doğrulanmalıdır.</p></div>
  <div class="golden-metrics"><b>${g.researchSections}</b><span>Research sections</span><b>${g.sourceCount}</b><span>Authoritative sources</span><b>${g.chapters.length}</b><span>Full Brief chapters</span></div>
 </div>
 <div class="golden-audio">
  <div class="golden-audio-card live"><span>QUICK BRIEF · LIVE</span><b>${fmt(m.duration)}</b><p>Mevcut S3F hızlı açıklama; Full Briefing'den ayrı ve değişmeden korunur.</p><button type="button" data-gold-action="quick">▶ Quick Brief</button></div>
  <div class="golden-audio-card live full-live"><span>FULL BRIEFING · LIVE · QA ${esc(g.fullAudioQA)}</span><b>${esc(g.fullDurationLabel)}</b><p>${g.chapters.length} chapter · S3F Sage Senior Adviser · transcript + word-ratio + tail QA.</p><button type="button" data-full-start>▶ Full Briefing</button></div>
 </div>
 <div class="golden-grid">
  <section class="golden-visual taxonomy"><header><span>VISUAL 01</span><h4>Thermal Domain Stack</h4></header><div class="taxonomy-grid">${domains}</div></section>
  <section class="golden-visual facility-fit"><header><span>VISUAL 02</span><h4>Cooling Architecture Fit</h4></header><div class="table-wrap"><table><thead><tr><th>Architecture</th><th>Best fit</th><th>Main constraint</th></tr></thead><tbody>${fit}</tbody></table></div></section>
  <section class="golden-visual facility-fit"><header><span>VISUAL 03</span><h4>FWS ↔ TCS Interface Audit</h4></header><div class="table-wrap"><table><thead><tr><th>Interface</th><th>What must be frozen</th><th>Failure risk</th></tr></thead><tbody>${interfaces}</tbody></table></div></section>
  <section class="golden-visual responsibility"><header><span>VISUAL 04</span><h4>State-Based Thermal Commissioning</h4></header><div class="responsibility-flow">${chain}</div></section>
 </div>
 <section class="golden-chapters"><header><div><span>FULL BRIEFING · LIVE</span><h4>${g.chapters.length} chapter · ${esc(g.fullDurationLabel)}</h4></div><small>Quick Brief mevcut hızlı açıklamadır; Full Briefing silicon-to-outdoor thermal chain'i Golden derinlikte taşır.</small></header><div class="chapter-grid">${chapters}</div></section>
 <div class="golden-rule"><b>Golden rule</b><span>${esc(g.goldenRule)}</span></div>`;
}
let rendering=false;
function specialize(){
 if(rendering||panel.hidden)return;
 const m=activeModule();
 if(!m||m.id!=='DC-K05'||!m.golden)return;
 const marker=`[data-k05-golden-ui="${K.updated}"]`;
 if(panel.querySelector(marker))return;
 rendering=true;panel.innerHTML=renderK05(m);rendering=false;
}
const obs=new MutationObserver(specialize);obs.observe(panel,{childList:true,attributes:true,attributeFilter:['hidden']});
setTimeout(specialize,0);
})();
