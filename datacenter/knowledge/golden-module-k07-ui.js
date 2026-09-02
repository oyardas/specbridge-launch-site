(()=>{
const K=window.DC_KNOWLEDGE,panel=document.querySelector('#goldenPanel'),readerId=document.querySelector('#readerId');
if(!K||!panel||!readerId)return;
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const activeModule=()=>{const id=(readerId.textContent||'').split(' · ')[0];return K.modules.find(x=>x.id===id)};
function renderK07(m){
 const g=m.golden;
 const chapters=g.chapters.map(([id,t],i)=>`<div class="gold-chapter"><span>${esc(id)}</span><b>${esc(t)}</b><em>${i===0?'START':'CH '+String(i+1).padStart(2,'0')}</em></div>`).join('');
 const layers=g.facilityLayers.map(([a,b])=>`<div class="taxonomy-item"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
 const adjacency=g.adjacencyMatrix.map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('');
 const diversity=g.physicalDiversity.map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('');
 const ai=g.aiReadiness.map(([id,a,b],i)=>`<div class="responsibility-step"><i>${esc(id||String(i+1))}</i><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
 return `<div class="golden-head" data-k07-golden-ui="${esc(K.updated)}">
  <div><span>DC-K07 · GOLDEN MODULE ${esc(g.version)}</span><h3>The building is the physical resilience layer</h3><p>Site risk, structural envelope, A/B physical diversity, fire/water/security compartments, logistics, lifecycle replacement ve AI/liquid readiness birlikte doğrulanmadan facility architecture tamamlanmış sayılmaz.</p></div>
  <div class="golden-metrics"><b>${g.researchSections}</b><span>Research sections</span><b>${g.sourceCount}</b><span>Authoritative sources</span><b>${g.chapters.length}</b><span>Full Brief chapters</span></div>
 </div>
 <div class="golden-audio">
  <div class="golden-audio-card live"><span>QUICK BRIEF · LIVE · QA ${esc(g.quickAudioQA)}</span><b>${esc(g.quickDurationLabel)}</b><p>Ayrı S3F board-level karar özeti; Full Briefing’den kesilmiş bir dosya değildir.</p><button type="button" data-gold-action="quick">▶ Quick Brief</button></div>
  <div class="golden-audio-card live full-live"><span>FULL BRIEFING · LIVE · QA ${esc(g.fullAudioQA)}</span><b>${esc(g.fullDurationLabel)}</b><p>${g.chapters.length} chapter · S3F Sage Senior Adviser · transcript + word-ratio + tail QA.</p><button type="button" data-full-start>▶ Full Briefing</button></div>
 </div>
 <div class="golden-grid">
  <section class="golden-visual taxonomy"><header><span>VISUAL 01</span><h4>Facility Layer Stack</h4></header><div class="taxonomy-grid">${layers}</div></section>
  <section class="golden-visual facility-fit"><header><span>VISUAL 02</span><h4>Functional Adjacency Matrix</h4></header><div class="table-wrap"><table><thead><tr><th>Space</th><th>Prefer near</th><th>Prefer separated</th><th>Reason</th><th>Golden control</th></tr></thead><tbody>${adjacency}</tbody></table></div></section>
  <section class="golden-visual facility-fit"><header><span>VISUAL 03</span><h4>Physical Diversity Audit</h4></header><div class="table-wrap"><table><thead><tr><th>Domain</th><th>Target separation</th><th>Common-mode exposure</th><th>Audit</th></tr></thead><tbody>${diversity}</tbody></table></div></section>
  <section class="golden-visual responsibility"><header><span>VISUAL 04</span><h4>AI Facility Readiness Scorecard</h4></header><div class="responsibility-flow">${ai}</div></section>
 </div>
 <section class="golden-chapters"><header><div><span>FULL BRIEFING · LIVE</span><h4>${g.chapters.length} chapter · ${esc(g.fullDurationLabel)}</h4></div><small>Quick Brief karar zinciridir; Full Briefing building architecture’ı site-to-operations physical resilience sistemi olarak Golden derinlikte inceler.</small></header><div class="chapter-grid">${chapters}</div></section>
 <div class="golden-rule"><b>Golden rule</b><span>${esc(g.goldenRule)}</span></div>`;
}
let rendering=false;
function specialize(){
 if(rendering||panel.hidden)return;
 const m=activeModule();
 if(!m||m.id!=='DC-K07'||!m.golden)return;
 const marker=`[data-k07-golden-ui="${K.updated}"]`;
 if(panel.querySelector(marker))return;
 rendering=true;panel.innerHTML=renderK07(m);rendering=false;
}
const obs=new MutationObserver(specialize);obs.observe(panel,{childList:true,attributes:true,attributeFilter:['hidden']});
setTimeout(specialize,0);
})();
