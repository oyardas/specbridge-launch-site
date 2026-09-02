(()=>{
const K=window.DC_KNOWLEDGE,panel=document.querySelector('#goldenPanel'),readerId=document.querySelector('#readerId');
if(!K||!panel||!readerId)return;
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const activeModule=()=>{const id=(readerId.textContent||'').split(' · ')[0];return K.modules.find(x=>x.id===id)};
function renderK08(m){
 const g=m.golden;
 const chapters=g.chapters.map(([id,t],i)=>`<div class="gold-chapter"><span>${esc(id)}</span><b>${esc(t)}</b><em>${i===0?'START':'CH '+String(i+1).padStart(2,'0')}</em></div>`).join('');
 const layers=g.platformLayers.map(([a,b])=>`<div class="taxonomy-item"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
 const workload=g.workloadMatrix.map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('');
 const locality=g.localityAudit.map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('');
 const decisions=g.decisionChain.map(([id,a,b],i)=>`<div class="responsibility-step"><i>${esc(id||String(i+1))}</i><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
 return `<div class="golden-head" data-k08-golden-ui="${esc(K.updated)}">
  <div><span>DC-K08 · GOLDEN MODULE ${esc(g.version)}</span><h3>Engineer the server as a balanced platform, not a CPU SKU</h3><p>Core count, RAM capacity veya en yeni protocol generation tek başına doğru server seçimi değildir. CPU topology, memory bandwidth, NUMA locality, PCIe/CXL lane budget, storage, network, firmware, power, thermal ve lifecycle birlikte kapanmalıdır.</p></div>
  <div class="golden-metrics"><b>${g.researchSections}</b><span>Research points</span><b>${g.sourceCount}</b><span>Authoritative sources</span><b>${g.chapters.length}</b><span>Full Brief chapters</span></div>
 </div>
 <div class="golden-audio">
  <div class="golden-audio-card live"><span>QUICK BRIEF · LIVE · QA ${esc(g.quickAudioQA)}</span><b>${esc(g.quickDurationLabel)}</b><p>Ayrı S3F board-level sizing özeti; Full Briefing’den kesilmiş bir dosya değildir.</p><button type="button" data-gold-action="quick">▶ Quick Brief</button></div>
  <div class="golden-audio-card live full-live"><span>FULL BRIEFING · LIVE · QA ${esc(g.fullAudioQA)}</span><b>${esc(g.fullDurationLabel)}</b><p>${g.chapters.length} chapter · S3F Sage Senior Adviser · transcript + word-ratio + tail QA.</p><button type="button" data-full-start>▶ Full Briefing</button></div>
 </div>
 <div class="golden-grid">
  <section class="golden-visual taxonomy"><header><span>VISUAL 01</span><h4>Server Platform Stack</h4></header><div class="taxonomy-grid">${layers}</div></section>
  <section class="golden-visual facility-fit"><header><span>VISUAL 02</span><h4>Workload-to-Balance Matrix</h4></header><div class="table-wrap"><table><thead><tr><th>Workload</th><th>Compute</th><th>Memory</th><th>I/O</th><th>Acceptance</th></tr></thead><tbody>${workload}</tbody></table></div></section>
  <section class="golden-visual facility-fit"><header><span>VISUAL 03</span><h4>NUMA & I/O Locality Audit</h4></header><div class="table-wrap"><table><thead><tr><th>Domain</th><th>Golden target</th><th>Failure pattern</th><th>Audit</th></tr></thead><tbody>${locality}</tbody></table></div></section>
  <section class="golden-visual responsibility"><header><span>VISUAL 04</span><h4>Platform Acceptance Chain</h4></header><div class="responsibility-flow">${decisions}</div></section>
 </div>
 <section class="golden-chapters"><header><div><span>FULL BRIEFING · LIVE</span><h4>${g.chapters.length} chapter · ${esc(g.fullDurationLabel)}</h4></div><small>Quick Brief sizing karar zinciridir; Full Briefing x86 platformunu CPU’dan lifecycle/BoQ freeze’e kadar Golden derinlikte inceler.</small></header><div class="chapter-grid">${chapters}</div></section>
 <div class="golden-rule"><b>Golden rule</b><span>${esc(g.goldenRule)}</span></div>`;
}
let rendering=false;
function specialize(){
 if(rendering||panel.hidden)return;
 const m=activeModule();
 if(!m||m.id!=='DC-K08'||!m.golden)return;
 const marker=`[data-k08-golden-ui="${K.updated}"]`;
 if(panel.querySelector(marker))return;
 rendering=true;panel.innerHTML=renderK08(m);rendering=false;
}
const obs=new MutationObserver(specialize);obs.observe(panel,{childList:true,attributes:true,attributeFilter:['hidden']});
setTimeout(specialize,0);
})();
