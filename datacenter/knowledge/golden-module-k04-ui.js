(()=>{
const K=window.DC_KNOWLEDGE,panel=document.querySelector('#goldenPanel'),readerId=document.querySelector('#readerId');
if(!K||!panel||!readerId)return;
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const fmt=s=>{s=Math.max(0,Math.round(Number(s)||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const activeModule=()=>{const id=(readerId.textContent||'').split(' · ')[0];return K.modules.find(x=>x.id===id)};
function renderK04(m){
 const g=m.golden;
 const chapters=g.chapters.map(([id,t],i)=>`<div class="gold-chapter"><span>${esc(id)}</span><b>${esc(t)}</b><em>${i===0?'START':'CH '+String(i+1).padStart(2,'0')}</em></div>`).join('');
 const domains=g.powerDomains.map(([a,b])=>`<div class="taxonomy-item"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
 const availability=g.availabilityMatrix.map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('');
 const common=g.commonModeMatrix.map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('');
 const chain=g.commissioningChain.map(([a,b],i)=>`<div class="responsibility-step"><i>${i+1}</i><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
 return `<div class="golden-head" data-k04-golden-ui="${esc(K.updated)}">
  <div><span>DC-K04 · GOLDEN MODULE ${esc(g.version)}</span><h3>Power architecture is a state-based failure-domain system</h3><p>UPS ve jeneratör adetleri tek başına availability kanıtı değildir. Source, transfer, stored energy, A/B independence, protection, observability ve commissioning aynı end-to-end power contract içinde doğrulanmalıdır.</p></div>
  <div class="golden-metrics"><b>${g.researchSections}</b><span>Research sections</span><b>${g.sourceCount}</b><span>Authoritative sources</span><b>${g.chapters.length}</b><span>Full Brief chapters</span></div>
 </div>
 <div class="golden-audio">
  <div class="golden-audio-card live"><span>QUICK BRIEF · LIVE</span><b>${fmt(m.duration)}</b><p>Mevcut S3F hızlı açıklama; Full Briefing'den ayrı ve değişmeden korunur.</p><button type="button" data-gold-action="quick">▶ Quick Brief</button></div>
  <div class="golden-audio-card live full-live"><span>FULL BRIEFING · LIVE · QA ${esc(g.fullAudioQA)}</span><b>${esc(g.fullDurationLabel)}</b><p>${g.chapters.length} chapter · S3F Sage Senior Adviser · transcript + word-ratio + tail QA.</p><button type="button" data-full-start>▶ Full Briefing</button></div>
 </div>
 <div class="golden-grid">
  <section class="golden-visual taxonomy"><header><span>VISUAL 01</span><h4>Power Domain Stack</h4></header><div class="taxonomy-grid">${domains}</div></section>
  <section class="golden-visual facility-fit"><header><span>VISUAL 02</span><h4>Redundancy & Availability Are Not Synonyms</h4></header><div class="table-wrap"><table><thead><tr><th>Concept</th><th>What it proves</th><th>What it does not prove</th></tr></thead><tbody>${availability}</tbody></table></div></section>
  <section class="golden-visual facility-fit"><header><span>VISUAL 03</span><h4>A/B Common-Mode Audit</h4></header><div class="table-wrap"><table><thead><tr><th>Domain</th><th>Common-mode example</th><th>Control</th></tr></thead><tbody>${common}</tbody></table></div></section>
  <section class="golden-visual responsibility"><header><span>VISUAL 04</span><h4>State-Based Commissioning Chain</h4></header><div class="responsibility-flow">${chain}</div></section>
 </div>
 <section class="golden-chapters"><header><div><span>FULL BRIEFING · LIVE</span><h4>${g.chapters.length} chapter · ${esc(g.fullDurationLabel)}</h4></div><small>Quick Brief mevcut hızlı açıklamadır; Full Briefing utility-to-rack failure-domain karar zincirini Golden derinlikte taşır.</small></header><div class="chapter-grid">${chapters}</div></section>
 <div class="golden-rule"><b>Golden rule</b><span>${esc(g.goldenRule)}</span></div>`;
}
let rendering=false;
function specialize(){
 if(rendering||panel.hidden)return;
 const m=activeModule();
 if(!m||m.id!=='DC-K04'||!m.golden)return;
 const marker=`[data-k04-golden-ui="${K.updated}"]`;
 if(panel.querySelector(marker))return;
 rendering=true;panel.innerHTML=renderK04(m);rendering=false;
}
const obs=new MutationObserver(specialize);obs.observe(panel,{childList:true,attributes:true,attributeFilter:['hidden']});
setTimeout(specialize,0);
})();
