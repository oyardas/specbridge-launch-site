(()=>{
const K=window.DC_KNOWLEDGE,panel=document.querySelector('#goldenPanel'),readerId=document.querySelector('#readerId');
if(!K||!panel||!readerId)return;
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const activeModule=()=>{const id=(readerId.textContent||'').split(' · ')[0];return K.modules.find(x=>x.id===id)};
function renderK09(m){
 const g=m.golden;
 const chapters=g.chapters.map(([id,t],i)=>`<div class="gold-chapter"><span>${esc(id)}</span><b>${esc(t)}</b><em>${i===0?'START':'CH '+String(i+1).padStart(2,'0')}</em></div>`).join('');
 const roles=g.roleStack.map(([a,b])=>`<div class="taxonomy-item"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
 const movement=g.dataMovement.map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('');
 const scale=g.scaleMatrix.map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('');
 const responsibilities=g.responsibility.map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('');
 const decisions=g.decisionChain.map(([id,a,b],i)=>`<div class="responsibility-step"><i>${esc(id||String(i+1))}</i><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
 return `<div class="golden-head" data-k09-golden-ui="${esc(K.updated)}">
  <div><span>DC-K09 · GOLDEN MODULE ${esc(g.version)}</span><h3>Engineer accelerated compute as an end-to-end data-movement system</h3><p>GPU adedi, HBM kapasitesi veya peak FLOPS/TOPS tek başına delivered application performance değildir. Workload, software/precision, HBM bandwidth, host locality, PCIe/CXL, scale-up, DPU/storage, scale-out, scheduling, rack power ve thermal çözüm birlikte doğrulanmalıdır.</p></div>
  <div class="golden-metrics"><b>${g.researchSections}</b><span>Research sections</span><b>${g.sourceCount}</b><span>Classified sources</span><b>${g.chapters.length}</b><span>Full Brief chapters</span></div>
 </div>
 <div class="golden-audio">
  <div class="golden-audio-card live"><span>QUICK BRIEF · LIVE · QA ${esc(g.quickAudioQA)}</span><b>${esc(g.quickDurationLabel)}</b><p>Bağımsız S3F accelerator decision brief; Full Briefing’den kesilmiş değildir.</p><button type="button" data-gold-action="quick">▶ Quick Brief</button></div>
  <div class="golden-audio-card live full-live"><span>FULL BRIEFING · LIVE · QA ${esc(g.fullAudioQA)}</span><b>${esc(g.fullDurationLabel)}</b><p>${g.chapters.length} chapter · ${g.sourceWords} source words · S3F Sage Senior Adviser · transcript + word-ratio + tail QA.</p><button type="button" data-full-start>▶ Full Briefing</button></div>
 </div>
 <div class="golden-grid">
  <section class="golden-visual taxonomy"><header><span>VISUAL 01</span><h4>Accelerator Role Stack</h4></header><div class="taxonomy-grid">${roles}</div></section>
  <section class="golden-visual facility-fit"><header><span>VISUAL 02</span><h4>Data-Movement Topology</h4></header><div class="table-wrap"><table><thead><tr><th>From</th><th>To</th><th>Role</th><th>Acceptance focus</th></tr></thead><tbody>${movement}</tbody></table></div></section>
  <section class="golden-visual facility-fit"><header><span>VISUAL 03</span><h4>Scale-Up vs Scale-Out Matrix</h4></header><div class="table-wrap"><table><thead><tr><th>Domain</th><th>Bandwidth domain</th><th>Latency</th><th>Failure boundary</th><th>Network dependency</th></tr></thead><tbody>${scale}</tbody></table></div></section>
  <section class="golden-visual facility-fit"><header><span>VISUAL 04</span><h4>GPU / DPU Responsibility Matrix</h4></header><div class="table-wrap"><table><thead><tr><th>Function</th><th>Primary domain</th><th>Engineering responsibility</th></tr></thead><tbody>${responsibilities}</tbody></table></div></section>
  <section class="golden-visual responsibility"><header><span>VISUAL 05</span><h4>Accelerator Acceptance Chain</h4></header><div class="responsibility-flow">${decisions}</div></section>
 </div>
 <section class="golden-chapters"><header><div><span>FULL BRIEFING · LIVE</span><h4>${g.chapters.length} chapter · ${esc(g.fullDurationLabel)}</h4></div><small>Quick Brief karar çerçevesidir; Full Briefing accelerator taxonomy’den benchmark, TCO ve BoQ freeze’e kadar Golden derinlikte ilerler.</small></header><div class="chapter-grid">${chapters}</div></section>
 <div class="golden-rule"><b>Golden rule</b><span>${esc(g.goldenRule)}</span></div>`;
}
let rendering=false;
function specialize(){
 if(rendering||panel.hidden)return;
 const m=activeModule();
 if(!m||m.id!=='DC-K09'||!m.golden)return;
 const marker=`[data-k09-golden-ui="${K.updated}"]`;
 if(panel.querySelector(marker))return;
 rendering=true;panel.innerHTML=renderK09(m);rendering=false;
}
const obs=new MutationObserver(specialize);obs.observe(panel,{childList:true,attributes:true,attributeFilter:['hidden']});
setTimeout(specialize,0);
})();
