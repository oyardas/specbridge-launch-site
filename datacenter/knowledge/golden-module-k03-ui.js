(()=>{
const K=window.DC_KNOWLEDGE,panel=document.querySelector('#goldenPanel'),readerId=document.querySelector('#readerId');
if(!K||!panel||!readerId)return;
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const fmt=s=>{s=Math.max(0,Math.round(Number(s)||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const activeModule=()=>{const id=(readerId.textContent||'').split(' · ')[0];return K.modules.find(x=>x.id===id)};
function renderK03(m){
 const g=m.golden;
 const chapters=g.chapters.map(([id,t],i)=>`<div class="gold-chapter"><span>${esc(id)}</span><b>${esc(t)}</b><em>${i===0?'START':'CH '+String(i+1).padStart(2,'0')}</em></div>`).join('');
 const interfaces=g.interfaceAxes.map(([a,b])=>`<div class="taxonomy-item"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
 const ecoRows=g.ecosystems.map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('');
 const couplingRows=g.couplingMatrix.map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('');
 const chain=g.decisionChain.map(([a,b],i)=>`<div class="responsibility-step"><i>${i+1}</i><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
 return `<div class="golden-head" data-k03-golden-ui="${esc(K.updated)}">
  <div><span>DC-K03 · GOLDEN MODULE ${esc(g.version)}</span><h3>Treat the rack as an engineering interface contract</h3><p>Rack seçimi yalnız U kapasitesi değildir. Equipment form factor, güç dağıtımı, thermal interface, yapısal yük, kablolama ve serviceability aynı fiziksel envelope içinde birlikte doğrulanmalıdır.</p></div>
  <div class="golden-metrics"><b>${g.researchSections}</b><span>Research sections</span><b>${g.sourceCount}</b><span>Authoritative sources</span><b>${g.chapters.length}</b><span>Full Brief chapters</span></div>
 </div>
 <div class="golden-audio">
  <div class="golden-audio-card live"><span>QUICK BRIEF · LIVE</span><b>${fmt(m.duration)}</b><p>Mevcut S3F hızlı açıklama; Full Briefing'den ayrı kalır.</p><button type="button" data-gold-action="quick">▶ Quick Brief</button></div>
  <div class="golden-audio-card live full-live"><span>FULL BRIEFING · LIVE · QA ${esc(g.fullAudioQA)}</span><b>${esc(g.fullDurationLabel)}</b><p>${g.chapters.length} chapter · S3F Sage Senior Adviser · transcript + word-ratio + tail QA.</p><button type="button" data-full-start>▶ Full Briefing</button></div>
 </div>
 <div class="golden-grid">
  <section class="golden-visual taxonomy"><header><span>VISUAL 01</span><h4>Rack Interface Stack</h4></header><div class="taxonomy-grid">${interfaces}</div></section>
  <section class="golden-visual facility-fit"><header><span>VISUAL 02</span><h4>Rack Ecosystem Fit</h4></header><div class="table-wrap"><table><thead><tr><th>Ecosystem</th><th>Reference model</th><th>Engineering interpretation</th></tr></thead><tbody>${ecoRows}</tbody></table></div></section>
  <section class="golden-visual facility-fit"><header><span>VISUAL 03</span><h4>Power · Cooling · Structure · Cabling Coupling</h4></header><div class="table-wrap"><table><thead><tr><th>Domain</th><th>Interface choices</th><th>Primary engineering watchpoint</th></tr></thead><tbody>${couplingRows}</tbody></table></div></section>
  <section class="golden-visual responsibility"><header><span>VISUAL 04</span><h4>Rack Standard Freeze Chain</h4></header><div class="responsibility-flow">${chain}</div></section>
 </div>
 <section class="golden-chapters"><header><div><span>FULL BRIEFING · LIVE</span><h4>${g.chapters.length} chapter · ${esc(g.fullDurationLabel)}</h4></div><small>Quick Brief mevcut hızlı açıklamadır; Full Briefing rack/cabinet engineering karar zincirini Golden derinlikte taşır.</small></header><div class="chapter-grid">${chapters}</div></section>
 <div class="golden-rule"><b>Golden rule</b><span>${esc(g.goldenRule)}</span></div>`;
}
let rendering=false;
function specialize(){
 if(rendering||panel.hidden)return;
 const m=activeModule();
 if(!m||m.id!=='DC-K03'||!m.golden)return;
 const marker=`[data-k03-golden-ui="${K.updated}"]`;
 if(panel.querySelector(marker))return;
 rendering=true;panel.innerHTML=renderK03(m);rendering=false;
}
const obs=new MutationObserver(specialize);obs.observe(panel,{childList:true,attributes:true,attributeFilter:['hidden']});
setTimeout(specialize,0);
})();
