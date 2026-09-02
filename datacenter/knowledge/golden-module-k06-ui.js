(()=>{
const K=window.DC_KNOWLEDGE,panel=document.querySelector('#goldenPanel'),readerId=document.querySelector('#readerId');
if(!K||!panel||!readerId)return;
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const fmt=s=>{s=Math.max(0,Math.round(Number(s)||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const activeModule=()=>{const id=(readerId.textContent||'').split(' · ')[0];return K.modules.find(x=>x.id===id)};
function renderK06(m){
 const g=m.golden;
 const chapters=g.chapters.map(([id,t],i)=>`<div class="gold-chapter"><span>${esc(id)}</span><b>${esc(t)}</b><em>${i===0?'START':'CH '+String(i+1).padStart(2,'0')}</em></div>`).join('');
 const domains=g.systemDomains.map(([a,b])=>`<div class="taxonomy-item"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
 const fit=g.technologyFit.map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('');
 const autonomy=g.autonomyChain.map(([a,b],i)=>`<div class="responsibility-step"><i>${i+1}</i><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
 const commissioning=g.commissioningChain.map(([a,b],i)=>`<div class="responsibility-step"><i>${i+1}</i><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
 return `<div class="golden-head" data-k06-golden-ui="${esc(K.updated)}">
  <div><span>DC-K06 · GOLDEN MODULE ${esc(g.version)}</span><h3>UPS architecture is a continuity state machine, not a device count</h3><p>UPS seçimi; functional class, bypass/failure domains, stored-energy technology, autonomy state chain, generator ve cooling recovery, BMS/safety, BESS boundary ve commissioning birlikte doğrulanmadan tamamlanmış sayılmaz.</p></div>
  <div class="golden-metrics"><b>${g.researchSections}</b><span>Research sections</span><b>${g.sourceCount}</b><span>Authoritative sources</span><b>${g.chapters.length}</b><span>Full Brief chapters</span></div>
 </div>
 <div class="golden-audio">
  <div class="golden-audio-card live"><span>QUICK BRIEF · LIVE · QA ${esc(g.quickAudioQA)}</span><b>${esc(g.quickDurationLabel)}</b><p>Ayrı S3F hızlı karar özeti; Full Briefing ile aynı dosya değildir.</p><button type="button" data-gold-action="quick">▶ Quick Brief</button></div>
  <div class="golden-audio-card live full-live"><span>FULL BRIEFING · LIVE · QA ${esc(g.fullAudioQA)}</span><b>${esc(g.fullDurationLabel)}</b><p>${g.chapters.length} chapter · S3F Sage Senior Adviser · transcript + word-ratio + tail QA.</p><button type="button" data-full-start>▶ Full Briefing</button></div>
 </div>
 <div class="golden-grid">
  <section class="golden-visual taxonomy"><header><span>VISUAL 01</span><h4>UPS & Stored-Energy System Boundary</h4></header><div class="taxonomy-grid">${domains}</div></section>
  <section class="golden-visual facility-fit"><header><span>VISUAL 02</span><h4>Technology Fit Matrix</h4></header><div class="table-wrap"><table><thead><tr><th>Technology</th><th>Best fit</th><th>Main constraint</th></tr></thead><tbody>${fit}</tbody></table></div></section>
  <section class="golden-visual responsibility"><header><span>VISUAL 03</span><h4>Autonomy Is a State Chain</h4></header><div class="responsibility-flow">${autonomy}</div></section>
  <section class="golden-visual responsibility"><header><span>VISUAL 04</span><h4>State-Based UPS Commissioning</h4></header><div class="responsibility-flow">${commissioning}</div></section>
 </div>
 <section class="golden-chapters"><header><div><span>FULL BRIEFING · LIVE</span><h4>${g.chapters.length} chapter · ${esc(g.fullDurationLabel)}</h4></div><small>Quick Brief karar özetidir; Full Briefing UPS ve stored-energy sistemini source-to-load state chain olarak Golden derinlikte inceler.</small></header><div class="chapter-grid">${chapters}</div></section>
 <div class="golden-rule"><b>Golden rule</b><span>${esc(g.goldenRule)}</span></div>`;
}
let rendering=false;
function specialize(){
 if(rendering||panel.hidden)return;
 const m=activeModule();
 if(!m||m.id!=='DC-K06'||!m.golden)return;
 const marker=`[data-k06-golden-ui="${K.updated}"]`;
 if(panel.querySelector(marker))return;
 rendering=true;panel.innerHTML=renderK06(m);rendering=false;
}
const obs=new MutationObserver(specialize);obs.observe(panel,{childList:true,attributes:true,attributeFilter:['hidden']});
setTimeout(specialize,0);
})();
