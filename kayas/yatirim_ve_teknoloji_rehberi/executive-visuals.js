(function(){
  'use strict';
  const guide=window.KAYAS_GUIDE;
  if(!guide)return;

  const G={
    entrance:['../assets/gallery/kayas_concept_01_entrance.webp','West entrance / existing access'],
    reception:['../assets/gallery/kayas_concept_02_reception.webp','Reception and security desk'],
    security:['../assets/gallery/kayas_concept_03_security.webp','Controlled access / mantrap'],
    foyer:['../assets/gallery/kayas_concept_04_foyer.webp','Foyer and future expansion showroom'],
    meeting:['../assets/gallery/kayas_concept_05_meeting.webp','Investor briefing area'],
    operator:['../assets/gallery/kayas_concept_06_operator.webp','Operator rooms'],
    noc:['../assets/gallery/kayas_concept_07_management.webp','NOC management center'],
    carrier:['../assets/gallery/kayas_concept_08_carrier.webp','Carrier meet-me room'],
    hall:['../assets/gallery/kayas_concept_09_datahall.webp','Main IC8000 data hall'],
    aisle:['../assets/gallery/kayas_concept_10_datahall.webp','IC8000 cold aisle'],
    service:['../assets/gallery/kayas_concept_11_datahall.webp','Rear service corridor'],
    expansion:['../assets/gallery/kayas_concept_12_expansion.webp','North future expansion area'],
    fiber:['../assets/gallery/kayas_concept_13_fiber.webp','South fiber room'],
    battery:['../assets/gallery/kayas_concept_14_battery.webp','Battery room and ventilation'],
    electrical:['../assets/gallery/kayas_concept_15_electrical.webp','Electrical distribution and bypass'],
    cooling:['../assets/gallery/kayas_concept_16_terrace.webp','East terrace cooling plant'],
    coolingWalk:['../assets/gallery/kayas_concept_17_terrace.webp','Mechanical maintenance walkway'],
    terrace:['../assets/gallery/kayas_concept_18_terrace.webp','Separated open terrace'],
    route:['../assets/gallery/kayas_concept_20_visitorroute.webp','Visitor observation route'],
    executive:['../assets/gallery/kayas_concept_21_management.webp','Executive management office'],
    nocAlt:['../assets/gallery/kayas_concept_22_management.webp','NOC operations center'],
    board:['../assets/gallery/kayas_concept_23_meeting.webp','Executive boardroom'],
    exterior:['../assets/gallery/kayas_concept_24_entrance.webp','Exterior evening view']
  };

  const P=[
    {key:'capacity',rx:/kapasite|kabinet|rack|ölçek|buyume|büyüme/i,imgs:['hall','aisle','service','expansion'],status:'CURRENT BASELINE',kpis:[['206','IT kabinet'],['196','Hava soğutmalı'],['10','Sıvı soğutmalı'],['1.972 MW','IT tasarım yükü']],chart:{type:'donut',center:'206',parts:[['196 hava',95.15],['10 sıvı',4.85]]},links:['elektrik','soğutma','takvim','risk']},
    {key:'electrical',rx:/elektrik|enerji|ups|trafo|jeneratör|güç|power/i,imgs:['electrical','battery','hall','cooling'],status:'H3C PROPOSAL / RECALCULATION REQUIRED',kpis:[['1.972 MW','Güncel IT yükü'],['2N','IT güç yolu hedefi'],['≈15 dk','Akü hedefi'],['16.5 MW','Customer input']],chart:{type:'flow',nodes:['Şebeke / Trafo','Şalt','UPS A/B','PDU / Busway','IT yükü']},links:['kapasite','soğutma','commission','risk']},
    {key:'cooling',rx:/soğutma|chiller|cdu|sıvı|cooling|thermal/i,imgs:['cooling','coolingWalk','aisle','hall'],status:'OPEN-CONFIRMATION REQUIRED',kpis:[['600 kW','Liquid rack toplamı'],['10','60 kW kabinet'],['≈8°C','Doğal su customer input'],['CDU','Sizing açık']],chart:{type:'flow',nodes:['Doğal su / Chiller','Isı eşanjörü','CDU','Kapalı IT loop','Liquid rack']},links:['elektrik','kapasite','ai','risk']},
    {key:'compute',rx:/compute|sunucu|server|hci|storage|uis|cas|onestor|sanallaştır/i,imgs:['hall','aisle','service','nocAlt'],status:'WORKING BOM / SIZING CONFIRMATION REQUIRED',kpis:[['19×','UIS 3000 G6'],['4×','R4900 G6'],['CAS','Virtualization'],['ONEStor','Distributed storage']],chart:{type:'donut',center:'23',parts:[['UIS nodes',82.61],['R4900',17.39]]},links:['cloud','network','backup','güvenlik']},
    {key:'cloud',rx:/cloud|cloudos|iaas|vdc|tenant|self.?service|servis katalog|quota/i,imgs:['nocAlt','noc','board','hall'],status:'SOLUTION ARCHITECTURE',kpis:[['Multi-tenant','VDC'],['Self-service','Catalog'],['Quota','Workflow'],['Metering','Chargeback ready']],chart:{type:'flow',nodes:['Tenant','Portal / Catalog','CloudOS','UIS / CAS / ONEStor','Metering']},links:['compute','backup','network','gelir']},
    {key:'network',rx:/network|ağ|fiber|evpn|vxlan|spine|leaf|mmr|carrier|oob/i,imgs:['fiber','carrier','nocAlt','hall'],status:'DESIGN TARGET / PHYSICAL DIVERSITY REQUIRED',kpis:[['Spine–Leaf','DC fabric'],['EVPN/VXLAN','Overlay'],['OOB','Ayrı yönetim'],['MMR-A/B','Teyit gerekli']],chart:{type:'flow',nodes:['Carrier A/B','MMR-A/B','Spine','Leaf','Compute / Storage']},links:['güvenlik','cloud','backup','risk']},
    {key:'security',rx:/güvenlik|security|firewall|ddos|soc|vpn|segment/i,imgs:['security','route','nocAlt','carrier'],status:'SECURITY ARCHITECTURE',kpis:[['Firewall','Perimeter'],['DDoS','Protection'],['Segmentasyon','East-West'],['VPN/MPLS','Secure access']],chart:{type:'flow',nodes:['Perimeter','DDoS / FW','Segmentation','SOC / NOC','Incident response']},links:['network','operasyon','backup','risk']},
    {key:'backup',rx:/backup|yedek|felaket|disaster|dr|recovery|rpo|rto|restore/i,imgs:['fiber','nocAlt','electrical','expansion'],status:'SERVICE DESIGN / TEST REQUIRED',kpis:[['Backup','Primary copy'],['Replication','Off-site'],['Restore','Tested'],['DRaaS','Service option']],chart:{type:'flow',nodes:['Production','Backup','Replica','DR site','Restore test']},links:['cloud','network','operasyon','risk']},
    {key:'operations',rx:/dcim|bms|ems|nms|noc|soc|operasyon|işletme|sla|monitor/i,imgs:['noc','nocAlt','operator','executive'],status:'DAY-2 OPERATING MODEL',kpis:[['DCIM','Facility'],['NMS','Network'],['NOC','7/24 target'],['SLA','Written scope']],chart:{type:'flow',nodes:['Telemetry','Correlation','NOC / SOC','Ticket / SLA','Escalation']},links:['güvenlik','network','destek','risk']},
    {key:'ai',rx:/ai\b|gpu|hpc|yapay zek|cluster/i,imgs:['hall','aisle','cooling','coolingWalk'],status:'FUTURE-READY / DEMAND-LED',kpis:[['10','Liquid racks'],['60 kW','Rack design'],['600 kW','AI/HPC zone'],['CDU','Required']],chart:{type:'flow',nodes:['GPU nodes','Leaf fabric','High-density rack','CDU','Cooling plant']},links:['soğutma','compute','network','gelir']},
    {key:'sustainability',rx:/sürdürülebilir|pue|wue|karbon|enerji verim|su kullan|sustain/i,imgs:['cooling','coolingWalk','terrace','expansion'],status:'MEASURE BEFORE CLAIM',kpis:[['PUE','Target to validate'],['WUE','Measure'],['≈8°C','Cooling opportunity'],['Metering','Required']],chart:{type:'flow',nodes:['Meter','Baseline','Optimize','Free cooling','Report']},links:['soğutma','elektrik','commission','risk']},
    {key:'tier',rx:/tier|standart|standard|commission|fat|sat|ist|sertifika/i,imgs:['electrical','cooling','route','nocAlt'],status:'TIER III TARGET — NOT CERTIFIED',kpis:[['Tier III','Design target'],['FAT','Factory'],['SAT','Site'],['IST','Integrated test']],chart:{type:'flow',nodes:['Design review','FAT','SAT','IST','Operational handover']},links:['elektrik','soğutma','operasyon','risk']},
    {key:'site',rx:/saha|lokasyon|yerleşim|bina|mimari|kat|teras|alan/i,imgs:['entrance','foyer','expansion','route'],status:'WORKING ASSUMPTION / ENGINEERING VERIFICATION REQUIRED',kpis:[['3. kat','Ana alan'],['≈2.000 m²','Çalışma alanı'],['Batı','Ana giriş'],['Kuzey','Genişleme']],chart:{type:'flow',nodes:['Batı giriş','Data hall','Güney destek','Doğu mekanik','Kuzey expansion']},links:['kapasite','elektrik','soğutma','risk']},
    {key:'schedule',rx:/takvim|gantt|milestone|açılış|risk|açık konu|open item|program/i,imgs:['expansion','electrical','cooling','fiber'],status:'PROGRAM CONTROL',kpis:[['17 Aug 2026','IC8000 PO hedefi'],['Aug 2026','Ticari kapanış'],['Feb 2027','Açılış hedefi'],['Open items','Critical path']],chart:{type:'timeline',nodes:['PO / SPQ','MEP freeze','Production & logistics','FAT/SAT/IST','Opening']},links:['kapasite','elektrik','soğutma','commission']},
    {key:'competition',rx:/rekabet|compet|h3c|destek|academy|akademi|demo|experience|gtm|referans/i,imgs:['meeting','board','executive','noc'],status:'INTEGRATION VALUE — NOT CATEGORY SUPERIORITY CLAIM',kpis:[['IC8000','Facility'],['UIS/CAS','Compute'],['CloudOS','Cloud'],['One escalation','Operating model']],chart:{type:'flow',nodes:['Facility','Compute / HCI','Cloud','Network / Security','Day-2 operations']},links:['compute','cloud','network','operasyon']},
    {key:'commercial',rx:/yatırım|pazar|gelir|ticari|finans|capex|opex|tco|fiyat|pricing|roi/i,imgs:['board','meeting','exterior','executive'],status:'BUDGETARY / VALIDATION REQUIRED',kpis:[['Colocation','Revenue'],['Private Cloud','Service'],['BaaS / DRaaS','Recurring'],['AI/GPU','Growth option']],chart:{type:'flow',nodes:['Rack / kW','Connectivity','Cloud / Storage','Managed services','AI / GPU']},links:['cloud','kapasite','takvim','rekabet']},
    {key:'default',rx:/.*/,imgs:['hall','electrical','cooling','nocAlt'],status:'EXECUTIVE REVIEW',kpis:[['206','IT kabinet baseline'],['1.972 MW','IT yükü'],['Tier III','Hedef'],['Feb 2027','Açılış hedefi']],chart:{type:'flow',nodes:['Requirement','Architecture','Evidence','Decision','Execution']},links:['kapasite','takvim','risk','operasyon']}
  ];

  function textOfChapter(c){return (c.title+' '+(c.blocks||[]).map(b=>b.type==='table'?(b.rows||[]).flat().join(' '):(b.text||'')).join(' ')).toLocaleLowerCase('tr-TR');}
  function profileFor(c){const s=textOfChapter(c);return P.find(p=>p.rx.test(s))||P[P.length-1];}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  function chapterByTitle(){const t=(document.getElementById('readerTitle')||{}).textContent||'';return guide.chapters.find(c=>c.title===t)||guide.chapters[0];}
  function idHash(id){return '#bolum-'+String(id).toLocaleLowerCase('tr-TR').replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ-]+/g,'-');}
  function findRelated(terms,current){
    const out=[];
    terms.forEach(term=>{
      const rx=new RegExp(term,'i');
      const c=guide.chapters.find(x=>x!==current&&rx.test(x.title))||guide.chapters.find(x=>x!==current&&rx.test(textOfChapter(x)));
      if(c&&!out.includes(c))out.push(c);
    });
    if(out.length<3){guide.chapters.forEach(c=>{if(c!==current&&!out.includes(c)&&out.length<3)out.push(c);});}
    return out.slice(0,4);
  }
  function chartHTML(chart){
    if(chart.type==='donut'){
      const parts=chart.parts||[];let acc=0;const stops=[];const colors=['var(--exec-accent)','var(--exec-cyan)','var(--exec-violet)'];
      parts.forEach((p,i)=>{const start=acc;acc+=p[1];stops.push(colors[i%colors.length]+' '+start+'% '+acc+'%');});
      return '<div class="mini-chart"><div class="mini-chart-title"><strong>Kapasite kompozisyonu</strong><span>çalışma baseline</span></div><div class="donut-wrap"><div class="donut" style="background:conic-gradient('+stops.join(',')+')"><strong>'+esc(chart.center)+'</strong></div><div class="donut-legend">'+parts.map((p,i)=>'<span><i></i>'+esc(p[0])+' · '+p[1].toFixed(1)+'%</span>').join('')+'</div></div></div>';
    }
    if(chart.type==='timeline'){
      return '<div class="mini-chart"><div class="mini-chart-title"><strong>Program akışı</strong><span>milestone chain</span></div><div class="exec-flow is-timeline">'+chart.nodes.map((n,i)=>'<div><b>'+String(i+1).padStart(2,'0')+'</b><span>'+esc(n)+'</span></div>').join('')+'</div></div>';
    }
    return '<div class="mini-chart"><div class="mini-chart-title"><strong>Yönetici mimari akışı</strong><span>conceptual</span></div><div class="exec-flow">'+chart.nodes.map((n,i)=>'<div><b>'+String(i+1).padStart(2,'0')+'</b><span>'+esc(n)+'</span></div>').join('')+'</div></div>';
  }

  let carouselTimer=null;
  function stopCarousel(){if(carouselTimer){clearInterval(carouselTimer);carouselTimer=null;}}
  function initCarousel(root){
    stopCarousel();
    const track=root.querySelector('.chapter-carousel-track');const slides=[...root.querySelectorAll('.chapter-slide')];const dots=[...root.querySelectorAll('.chapter-carousel-dots button')];const count=root.querySelector('.chapter-carousel-count');let i=0;
    function show(n){i=(n+slides.length)%slides.length;track.style.transform='translateX(-'+(i*100)+'%)';dots.forEach((d,j)=>d.classList.toggle('is-active',j===i));if(count)count.textContent=(i+1)+' / '+slides.length;}
    root.querySelector('[data-dir="prev"]').addEventListener('click',()=>show(i-1));root.querySelector('[data-dir="next"]').addEventListener('click',()=>show(i+1));dots.forEach((d,j)=>d.addEventListener('click',()=>show(j)));
    let sx=0;track.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;},{passive:true});track.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>45)show(i+(dx<0?1:-1));},{passive:true});
    root.querySelectorAll('.chapter-slide img').forEach(img=>img.addEventListener('click',()=>openFullscreen(img.src,img.alt)));
    carouselTimer=setInterval(()=>show(i+1),6500);root.addEventListener('mouseenter',stopCarousel,{once:true});
    show(0);
  }
  function ensureFullscreen(){
    let box=document.getElementById('execFullscreen');if(box)return box;
    box=document.createElement('div');box.id='execFullscreen';box.className='exec-fullscreen';box.hidden=true;box.innerHTML='<button type="button" aria-label="Kapat">×</button><img alt="KAYAS visual" />';document.body.appendChild(box);box.querySelector('button').addEventListener('click',()=>box.hidden=true);box.addEventListener('click',e=>{if(e.target===box)box.hidden=true;});return box;
  }
  function openFullscreen(src,alt){const box=ensureFullscreen();box.querySelector('img').src=src;box.querySelector('img').alt=alt||'KAYAS visual';box.hidden=false;}

  function renderExecutive(){
    const reader=document.getElementById('reader');const body=document.getElementById('readerBody');if(!reader||!body)return;
    const current=chapterByTitle();const profile=profileFor(current);let host=document.getElementById('chapterExecutiveVisuals');if(host)host.remove();
    host=document.createElement('section');host.id='chapterExecutiveVisuals';host.className='chapter-executive';host.setAttribute('aria-label','Bölüm yönetici görselleri');
    const images=profile.imgs.map(k=>G[k]).filter(Boolean);const related=findRelated(profile.links,current);
    const slides=images.map((it,idx)=>'<div class="chapter-slide"><img src="'+it[0]+'" alt="'+esc(it[1])+'" loading="'+(idx?'lazy':'eager')+'" /><div class="chapter-slide-copy"><strong>'+esc(it[1])+'</strong><span>Konsept görsel · uygulama projesi değildir</span></div></div>').join('');
    const dots=images.map((_,i)=>'<button type="button" class="'+(i===0?'is-active':'')+'" aria-label="Görsel '+(i+1)+'"></button>').join('');
    const kpis=profile.kpis.map(k=>'<div class="snapshot-kpi"><b>'+esc(k[0])+'</b><small>'+esc(k[1])+'</small></div>').join('');
    const deep=related.map(c=>'<a class="chapter-deep-link" href="'+idHash(c.id)+'"><span>'+esc(c.id)+'</span>'+esc(c.title)+' ↗</a>').join('');
    host.innerHTML='<div class="chapter-carousel"><div class="chapter-carousel-top"><span class="chapter-carousel-tag">'+esc(profile.key)+' · visual deck</span><span class="chapter-carousel-count">1 / '+images.length+'</span></div><div class="chapter-carousel-track">'+slides+'</div><div class="chapter-carousel-dots">'+dots+'</div><div class="chapter-carousel-controls"><button type="button" data-dir="prev" aria-label="Önceki görsel">‹</button><button type="button" data-dir="next" aria-label="Sonraki görsel">›</button></div></div><aside class="chapter-snapshot"><div class="snapshot-head"><h3>Executive Snapshot</h3><span>'+esc(current.title)+'</span></div><div class="snapshot-kpis">'+kpis+'</div>'+chartHTML(profile.chart)+'<div class="exec-status"><b>'+esc(profile.status)+'</b><span>Görsel ve grafikler karar destek amaçlıdır; teyit gerektiren mühendislik/ticari değerler bağlayıcı kabul edilmemelidir.</span></div></aside><div class="chapter-links"><div class="chapter-links-head"><strong>İlgili bölümler ve tıklanabilir kaynaklar</strong><span>deep-link / source navigation</span></div><div class="chapter-link-row">'+deep+'<a class="chapter-doc-link" href="assets/KAYAS_DC_Yatirim_ve_Teknoloji_Rehberi_v3.2_Editorial_Editable_Final.pdf" target="_blank" rel="noopener">PDF ↗</a><a class="chapter-doc-link" href="assets/KAYAS_DC_Yatirim_ve_Teknoloji_Rehberi_v3.2_Editorial_Editable_Final.docx" download>DOCX ↓</a><a class="chapter-doc-link" href="../">3D / Ana Portal ↗</a></div></div>';
    body.parentNode.insertBefore(host,body);initCarousel(host);
    const hash=idHash(current.id);if(location.hash!==hash)history.replaceState(null,'',hash);
  }

  function selectHash(){
    const m=location.hash.match(/^#bolum-(.+)$/);if(!m)return;const slug=m[1];
    const wanted=guide.chapters.find(c=>idHash(c.id)==='#bolum-'+slug);if(!wanted)return;
    const btn=[...document.querySelectorAll('.chapter-link')].find(b=>(b.querySelector('b')||{}).textContent===wanted.id);if(btn)btn.click();
  }

  const title=document.getElementById('readerTitle');if(!title)return;
  const obs=new MutationObserver(()=>setTimeout(renderExecutive,0));obs.observe(title,{childList:true,characterData:true,subtree:true});
  window.addEventListener('hashchange',()=>setTimeout(selectHash,0));
  document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a.chapter-deep-link');if(!a)return;setTimeout(selectHash,0);});
  setTimeout(()=>{selectHash();renderExecutive();},80);
})();
