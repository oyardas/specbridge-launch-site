const SERVICES = window.KAYAS_SERVICES || [];
const FAMILIES = window.KAYAS_FAMILIES || [];

let activeFamily = "ALL";
let activeId = 1;

function esc(s) {
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

function familyCounts() {
  const c={ALL:SERVICES.length};
  SERVICES.forEach(s=>c[s.family]=(c[s.family]||0)+1);
  return c;
}

function renderFamilies() {
  const counts=familyCounts();
  const grid=document.getElementById('familyGrid');
  const all=[["ALL","Tüm servis modelleri"],...FAMILIES];
  grid.innerHTML=all.map(([name,desc])=>`
    <div class="family ${activeFamily===name?'active':''}" onclick="setFamily('${name.replace(/'/g,"\'")}')">
      <strong>${name==="ALL"?"Tüm Modeller":esc(name)} <span style="float:right;color:var(--accent)">${counts[name]||0}</span></strong>
      <small>${esc(desc)}</small>
    </div>`).join('');
}

function setFamily(f) {
  activeFamily=f;
  renderFamilies();
  renderList();
  const filtered=getFiltered();
  if(filtered.length) {activeId=filtered[0].id; renderDetail();}
}

function getFiltered() {
  const q=document.getElementById('search')?.value?.toLowerCase().trim() || "";
  return SERVICES.filter(s => (activeFamily==="ALL" || s.family===activeFamily) &&
    (!q || [s.name,s.family,s.tagline,s.difference,...s.infrastructure,...s.service,...s.revenue].join(" ").toLowerCase().includes(q)));
}

function renderList() {
  const list=document.getElementById('serviceList');
  const items=getFiltered();
  list.innerHTML=items.map(s=>`
    <button class="service-item ${s.id===activeId?'active':''}" onclick="selectService(${s.id})">
      <span class="n">${String(s.id).padStart(2,'0')}</span><b>${esc(s.name)}</b>
      <small>${esc(s.family)}</small>
    </button>`).join('') || '<div style="padding:18px;color:var(--muted)">Sonuç bulunamadı.</div>';
}

function selectService(id) {
  activeId=id;
  renderList();
  renderDetail();
  if(window.innerWidth<1100) document.getElementById('detail').scrollIntoView({behavior:'smooth',block:'start'});
}

function listHtml(arr) {
  return '<ul>'+arr.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
}

function metric(label,value) {
  return `<div class="metric"><div class="label">${label}</div><b>${value} / 100</b><div class="bar"><i style="width:${value}%"></i></div></div>`;
}

function topoSvg(s) {
  let mid = "KAYAŞ SERVICE";
  let bottom = "KAYAŞ DATA CENTER";
  let extra = "";
  if(s.family==="Facility & Colocation") mid = s.name.toUpperCase();
  if(s.family==="Cloud Services") mid = "CLOUD / ORCHESTRATION";
  if(s.family==="AI & HPC") mid = "AI / HPC PLATFORM";
  if(s.family==="Data Protection & Storage") mid = "DATA PROTECTION PLATFORM";
  if(s.family==="Connectivity & Interconnection") mid = "INTERCONNECTION FABRIC";
  if(s.family==="Managed Operations & Security") mid = "NOC / SOC / MANAGED OPS";
  if(s.family==="Platform & Ecosystem") mid = "DIGITAL SERVICE PLATFORM";
  if(s.name.includes("DR")) extra = "REPLICATION / FAILOVER";
  else if(s.name.includes("GPU") || s.name.includes("AI Cloud")) extra = "GPU · AI FABRIC · HPC STORAGE";
  else if(s.name.includes("Cross Connect")) extra = "DEDICATED FIBER";
  else if(s.name.includes("Internet Exchange")) extra = "PEERING FABRIC";
  else if(s.name.includes("Cloud Connect")) extra = "PRIVATE CLOUD ON-RAMP";
  else if(s.name.includes("Backup")) extra = "BACKUP REPOSITORY";
  else if(s.name.includes("Cyber")) extra = "IMMUTABLE VAULT / CLEAN ROOM";
  else if(s.name.includes("Private Cloud")) extra = "DEDICATED COMPUTE · STORAGE · NETWORK";
  else extra = s.service.slice(0,3).join(" · ").toUpperCase();

  return `
  <svg viewBox="0 0 900 300" role="img" aria-label="${esc(s.name)} topology">
    <defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#52d7c7"/></marker></defs>
    <style>.b{fill:#0e1d2b;stroke:#31506b;stroke-width:1.5} .a{fill:#102829;stroke:#52d7c7;stroke-width:1.6} .t{fill:#edf4fb;font:600 15px Segoe UI,Arial} .s{fill:#9eb0c2;font:12px Segoe UI,Arial} .l{stroke:#52d7c7;stroke-width:2;marker-end:url(#arrow)}</style>
    <rect x="40" y="95" width="190" height="90" rx="14" class="b"/><text x="135" y="130" text-anchor="middle" class="t">CUSTOMER</text><text x="135" y="154" text-anchor="middle" class="s">Apps · Data · Policy</text>
    <line x1="230" y1="140" x2="350" y2="140" class="l"/>
    <rect x="350" y="75" width="230" height="130" rx="16" class="a"/><text x="465" y="118" text-anchor="middle" class="t">${esc(mid)}</text><text x="465" y="150" text-anchor="middle" class="s">${esc(extra)}</text><text x="465" y="174" text-anchor="middle" class="s">Revenue + SLA + Operations</text>
    <line x1="580" y1="140" x2="700" y2="140" class="l"/>
    <rect x="700" y="95" width="160" height="90" rx="14" class="b"/><text x="780" y="130" text-anchor="middle" class="t">${esc(bottom)}</text><text x="780" y="154" text-anchor="middle" class="s">Power · Cooling · Security</text>
  </svg>`;
}

function renderDetail() {
  const s=SERVICES.find(x=>x.id===activeId) || SERVICES[0];
  document.getElementById('detail').innerHTML=`
    <article class="detail-card">
      <div class="detail-title">
        <div>
          <span class="badge">${esc(s.family)}</span>
          <h3>${String(s.id).padStart(2,'0')} · ${esc(s.name)}</h3>
          <p class="tagline">${esc(s.tagline)}</p>
        </div>
        <div class="phase">${esc(s.phase)}</div>
      </div>
      <div class="metrics">
        ${metric("Kayaş sorumluluk indeksi",s.resp)}
        ${metric("Servis karmaşıklığı",s.complexity)}
        ${metric("Katma değer potansiyeli",s.value)}
      </div>
      <div class="detail-grid">
        <section class="info"><h4>Temel fark</h4><p>${esc(s.difference)}</p></section>
        <section class="info"><h4>Gerekli altyapı</h4>${listHtml(s.infrastructure)}</section>
        <section class="info"><h4>Müşteriye verilen hizmet</h4>${listHtml(s.service)}</section>
        <section class="info"><h4>Gelir modeli</h4>${listHtml(s.revenue)}</section>
        <section class="info"><h4>Kayaş yönetim & sorumluluğu</h4><p>${esc(s.kayas)}</p></section>
        <section class="info"><h4>Müşteri yönetim & sorumluluğu</h4><p>${esc(s.customer)}</p></section>
      </div>
      <div class="topology">${topoSvg(s)}</div>
    </article>`;
}

document.getElementById('search').addEventListener('input',()=>{renderList(); const f=getFiltered(); if(f.length && !f.some(x=>x.id===activeId)){activeId=f[0].id;renderDetail();}});
renderFamilies(); renderList(); renderDetail();
