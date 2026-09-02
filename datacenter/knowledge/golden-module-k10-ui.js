(()=>{
const K=window.DC_KNOWLEDGE,panel=document.querySelector('#goldenPanel'),readerId=document.querySelector('#readerId');
if(!K||!panel||!readerId)return;
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const activeModule=()=>{const id=(readerId.textContent||'').split(' · ')[0];return K.modules.find(x=>x.id===id)};
function tableRows(rows){return rows.map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('')}
function renderK10(m){
 const g=m.golden;
 const chapters=g.chapters.map(([id,t],i)=>`<div class="gold-chapter"><span>${esc(id)}</span><b>${esc(t)}</b><em>${i===0?'START':'CH '+String(i+1).padStart(2,'0')}</em></div>`).join('');
 const stack=g.executionStack.map(([a,b])=>`<div class="taxonomy-item"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
 return `<div class="golden-head" data-k10-golden-ui="${esc(K.updated)}">
  <div><span>DC-K10 · GOLDEN MODULE ${esc(g.version)}</span><h3>Engineer execution, isolation and recovery as one platform contract</h3><p>VM, container, hypervisor, runtime ve Kubernetes aynı katman değildir. Delivered platform quality; workload isolation, vCPU/memory/NUMA, I/O path, OCI/CRI/CNI/CSI contracts, security boundary, failure reserve ve test edilmiş recovery zincirinin birlikte kapanmasına bağlıdır.</p></div>
  <div class="golden-metrics"><b>${g.researchSections}</b><span>Research sections</span><b>${g.sourceCount}</b><span>Classified sources</span><b>${g.chapters.length}</b><span>Full Brief chapters</span></div>
 </div>
 <div class="golden-audio">
  <div class="golden-audio-card live"><span>QUICK BRIEF · LIVE · QA ${esc(g.quickAudioQA)}</span><b>${esc(g.quickDurationLabel)}</b><p>Bağımsız S3F virtualization/container karar özeti; Full Briefing’den kesilmiş değildir.</p><button type="button" data-gold-action="quick">▶ Quick Brief</button></div>
  <div class="golden-audio-card live full-live"><span>FULL BRIEFING · LIVE · QA ${esc(g.fullAudioQA)}</span><b>${esc(g.fullDurationLabel)}</b><p>${g.chapters.length} chapter · ${g.sourceWords} source words · S3F Sage Senior Adviser · transcript + word-ratio + tail QA.</p><button type="button" data-full-start>▶ Full Briefing</button></div>
 </div>
 <div class="golden-grid">
  <section class="golden-visual taxonomy"><header><span>VISUAL 01</span><h4>Execution Isolation Stack</h4></header><div class="taxonomy-grid">${stack}</div></section>
  <section class="golden-visual facility-fit"><header><span>VISUAL 02</span><h4>VM vs Container Responsibility Matrix</h4></header><div class="table-wrap"><table><thead><tr><th>Concern</th><th>VM</th><th>Container</th><th>Acceptance focus</th></tr></thead><tbody>${tableRows(g.responsibilityMatrix)}</tbody></table></div></section>
  <section class="golden-visual facility-fit"><header><span>VISUAL 03</span><h4>Resource & Locality Path</h4></header><div class="table-wrap"><table><thead><tr><th>From</th><th>To</th><th>Engineering risk</th><th>Acceptance focus</th></tr></thead><tbody>${tableRows(g.resourcePath)}</tbody></table></div></section>
  <section class="golden-visual facility-fit"><header><span>VISUAL 04</span><h4>Availability Ladder</h4></header><div class="table-wrap"><table><thead><tr><th>Layer</th><th>Mechanism</th><th>Protects against</th><th>Not sufficient for</th></tr></thead><tbody>${tableRows(g.availabilityLadder)}</tbody></table></div></section>
  <section class="golden-visual facility-fit"><header><span>VISUAL 05</span><h4>Container Contract Chain</h4></header><div class="table-wrap"><table><thead><tr><th>Contract / interface</th><th>Primary role</th><th>Golden boundary</th></tr></thead><tbody>${tableRows(g.contractChain)}</tbody></table></div></section>
  <section class="golden-visual facility-fit"><header><span>VISUAL 06</span><h4>Maintenance & Recovery Capacity</h4></header><div class="table-wrap"><table><thead><tr><th>Operating state</th><th>Demand</th><th>Capacity / control</th><th>Acceptance test</th></tr></thead><tbody>${tableRows(g.maintenanceCapacity)}</tbody></table></div></section>
 </div>
 <section class="golden-chapters"><header><div><span>FULL BRIEFING · LIVE</span><h4>${g.chapters.length} chapter · ${esc(g.fullDurationLabel)}</h4></div><small>Quick Brief karar çerçevesidir; Full Briefing execution isolation’dan resource locality, container contracts, availability, hybrid platform ve BoQ freeze’e kadar Golden derinlikte ilerler.</small></header><div class="chapter-grid">${chapters}</div></section>
 <div class="golden-rule"><b>Golden rule</b><span>${esc(g.goldenRule)}</span></div>`;
}
let rendering=false;
function specialize(){
 if(rendering||panel.hidden)return;
 const m=activeModule();
 if(!m||m.id!=='DC-K10'||!m.golden)return;
 const marker=`[data-k10-golden-ui="${K.updated}"]`;
 if(panel.querySelector(marker))return;
 rendering=true;panel.innerHTML=renderK10(m);rendering=false;
}
const obs=new MutationObserver(specialize);obs.observe(panel,{childList:true,attributes:true,attributeFilter:['hidden']});
setTimeout(specialize,0);
})();
