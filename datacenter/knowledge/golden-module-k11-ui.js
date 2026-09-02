(()=>{
const K=window.DC_KNOWLEDGE,panel=document.querySelector('#goldenPanel'),readerId=document.querySelector('#readerId');
if(!K||!panel||!readerId)return;
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const activeModule=()=>{const id=(readerId.textContent||'').split(' · ')[0];return K.modules.find(x=>x.id===id)};
function tableRows(rows){return rows.map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('')}
function renderK11(m){
 const g=m.golden;
 const chapters=g.chapters.map(([id,t],i)=>`<div class="gold-chapter"><span>${esc(id)}</span><b>${esc(t)}</b><em>${i===0?'START':'CH '+String(i+1).padStart(2,'0')}</em></div>`).join('');
 const stack=g.architectureStack.map(([a,b])=>`<div class="taxonomy-item"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
 return `<div class="golden-head" data-k11-golden-ui="${esc(K.updated)}">
  <div><span>DC-K11 · GOLDEN MODULE ${esc(g.version)}</span><h3>Engineer HCI as one distributed-systems contract</h3><p>HCI; server, disk veya yalnız virtualization değildir. Doğru kabul zinciri workload SLA’dan node resource coupling, data placement, quorum/failure domains, resilient usable capacity, east-west network, protection, lifecycle ve degraded-state performance’a kadar birlikte kapanmalıdır.</p></div>
  <div class="golden-metrics"><b>${g.researchSections}</b><span>Research sections</span><b>${g.chapters.length}</b><span>Full Brief chapters</span><b>${g.sourceWords}</b><span>Full source words</span></div>
 </div>
 <div class="golden-audio">
  <div class="golden-audio-card live"><span>QUICK BRIEF · LIVE · QA ${esc(g.quickAudioQA)}</span><b>${esc(g.quickDurationLabel)}</b><p>Bağımsız S3F HCI karar özeti; Full Briefing’den kesilmiş değildir.</p><button type="button" data-gold-action="quick">▶ Quick Brief</button></div>
  <div class="golden-audio-card live full-live"><span>FULL BRIEFING · LIVE · QA ${esc(g.fullAudioQA)}</span><b>${esc(g.fullDurationLabel)}</b><p>${g.chapters.length} chapter · ${g.sourceWords} source words · S3F Sage Senior Adviser · transcript + word-ratio + tail QA.</p><button type="button" data-full-start>▶ Full Briefing</button></div>
 </div>
 <div class="golden-grid">
  <section class="golden-visual taxonomy"><header><span>VISUAL 01</span><h4>HCI Architecture Stack</h4></header><div class="taxonomy-grid">${stack}</div></section>
  <section class="golden-visual facility-fit"><header><span>VISUAL 02</span><h4>Capacity Truth Model</h4></header><div class="table-wrap"><table><thead><tr><th>Capacity term</th><th>Meaning</th><th>Golden boundary</th></tr></thead><tbody>${tableRows(g.capacityModel)}</tbody></table></div></section>
  <section class="golden-visual facility-fit"><header><span>VISUAL 03</span><h4>Failure Domain Matrix</h4></header><div class="table-wrap"><table><thead><tr><th>Domain</th><th>Loss</th><th>Required control</th><th>Acceptance</th></tr></thead><tbody>${tableRows(g.failureMatrix)}</tbody></table></div></section>
  <section class="golden-visual facility-fit"><header><span>VISUAL 04</span><h4>East-West Network Contract</h4></header><div class="table-wrap"><table><thead><tr><th>Traffic class</th><th>Purpose</th><th>Engineering rule</th></tr></thead><tbody>${tableRows(g.networkPath)}</tbody></table></div></section>
  <section class="golden-visual facility-fit"><header><span>VISUAL 05</span><h4>Lifecycle & Degraded-State Capacity</h4></header><div class="table-wrap"><table><thead><tr><th>State</th><th>Demand</th><th>Golden control</th></tr></thead><tbody>${tableRows(g.lifecycleStates)}</tbody></table></div></section>
  <section class="golden-visual facility-fit"><header><span>VISUAL 06</span><h4>HCI Decision Chain</h4></header><div class="table-wrap"><table><thead><tr><th>Gate</th><th>Decision</th><th>Acceptance focus</th></tr></thead><tbody>${tableRows(g.decisionChain)}</tbody></table></div></section>
 </div>
 <section class="golden-chapters"><header><div><span>FULL BRIEFING · LIVE</span><h4>${g.chapters.length} chapter · ${esc(g.fullDurationLabel)}</h4></div><small>Full Briefing; HCI taxonomy’den distributed storage, quorum, network, VM/Kubernetes, backup/DR, lifecycle, sizing, TCO ve BoQ freeze’e kadar ilerler.</small></header><div class="chapter-grid">${chapters}</div></section>
 <div class="golden-rule"><b>Golden rule</b><span>${esc(g.goldenRule)}</span></div>`;
}
let rendering=false;
function specialize(){
 if(rendering||panel.hidden)return;
 const m=activeModule();
 if(!m||m.id!=='DC-K11'||!m.golden)return;
 const marker=`[data-k11-golden-ui="${K.updated}"]`;
 if(panel.querySelector(marker))return;
 rendering=true;panel.innerHTML=renderK11(m);rendering=false;
}
const obs=new MutationObserver(specialize);obs.observe(panel,{childList:true,attributes:true,attributeFilter:['hidden']});
setTimeout(specialize,0);
})();
