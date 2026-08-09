(function(){
  'use strict';
  const guide=window.KAYAS_GUIDE;
  const body=document.getElementById('readerBody');
  const nav=document.getElementById('chapterNav');
  const title=document.getElementById('readerTitle');
  const kicker=document.getElementById('readerKicker');
  const searchInput=document.getElementById('searchInput');
  const searchNotice=document.getElementById('searchNotice');
  const sidebar=document.querySelector('.sidebar');
  const mobileNavButton=document.getElementById('mobileNavButton');

  if(!guide||!Array.isArray(guide.chapters)||!body||!nav){
    document.querySelector('.workspace').innerHTML='<section class="reader" style="max-width:980px;margin:40px auto"><h2>Rehber verisi yüklenemedi</h2><p>guide-data.js yüklenemedi. Lütfen sayfayı Ctrl+F5 ile yenileyin.</p></section>';
    return;
  }

  const VISUALS={
    '01':['../assets/gallery/kayas_concept_24_entrance.webp','KAYAŞ veri merkezi yatırım vizyonu — konsept görsel'],
    '02':['../assets/gallery/kayas_concept_09_datahall.webp','Modüler / mikro-modül veri salonu — konsept görsel'],
    '03':['../assets/gallery/kayas_concept_15_electrical.webp','Elektrik dağıtım alanı — konsept görsel'],
    '04':['../assets/gallery/kayas_concept_15_electrical.webp','UPS ve güç sürekliliği alanı — konsept görsel'],
    '05':['../assets/gallery/kayas_concept_11_datahall.webp','Rack güç dağıtımı ve servis koridoru — konsept görsel'],
    '06':['../assets/gallery/kayas_concept_14_battery.webp','Akü / enerji depolama alanı — konsept görsel'],
    '07':['../assets/gallery/kayas_concept_15_electrical.webp','Standby güç zinciri — konsept görsel'],
    '08':['../assets/gallery/kayas_concept_16_terrace.webp','Soğutma tesisi / doğu teras — konsept görsel'],
    '09':['../assets/gallery/kayas_concept_13_fiber.webp','Fiber ve carrier altyapısı — konsept görsel'],
    '10':['../assets/gallery/kayas_concept_07_management.webp','Cloud ve yönetim katmanı — konsept görsel'],
    '11':['../assets/gallery/kayas_concept_09_datahall.webp','Colocation veri salonu — konsept görsel'],
    '12':['../assets/gallery/kayas_concept_15_electrical.webp','Commissioning ve teknik doğrulama — konsept görsel'],
    '13':['../assets/gallery/kayas_concept_09_datahall.webp','Compute, storage ve HCI altyapısı — konsept görsel'],
    '14':['../assets/gallery/kayas_concept_07_management.webp','Sanallaştırma ve merkezi yönetim — konsept görsel'],
    '15':['../assets/gallery/kayas_concept_07_management.webp','Backup ve DR operasyon görünümü — konsept görsel'],
    '16':['../assets/gallery/kayas_concept_22_management.webp','NOC / entegre operasyon merkezi — konsept görsel'],
    '17':['../assets/gallery/kayas_concept_03_security.webp','Fiziksel ve siber güvenlik katmanları — konsept görsel'],
    '18':['../assets/gallery/kayas_concept_10_datahall.webp','AI/GPU yüksek yoğunluklu veri salonu — konsept görsel'],
    '19':['../assets/gallery/kayas_concept_16_terrace.webp','Enerji ve soğutma sürdürülebilirliği — konsept görsel'],
    '20':['../assets/gallery/kayas_concept_12_expansion.webp','Edge / gelecek genişleme yaklaşımı — konsept görsel'],
    '21':['../assets/gallery/kayas_concept_21_management.webp','Quantum ve post-quantum strateji — konsept görsel'],
    '22':['../assets/gallery/kayas_concept_23_meeting.webp','TCO ve yatırım karar yüzeyi — konsept görsel'],
    '23':['../assets/gallery/kayas_concept_24_entrance.webp','KAYAŞ yatırım yol haritası — konsept görsel']
  };

  let activeIndex=Math.max(0,guide.chapters.findIndex(c=>c.id==='01'));
  let filter='all';
  let query='';

  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  function norm(s){return String(s||'').toLocaleLowerCase('tr-TR');}
  function chapterText(c){return norm((c.title||'')+' '+(c.blocks||[]).map(b=>b.type==='table'?(b.rows||[]).flat().join(' '):(b.text||'')).join(' '));}
  function highlight(s){
    const clean=esc(s);
    if(!query)return clean;
    const terms=query.trim().split(/\s+/).filter(Boolean).map(t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
    if(!terms.length)return clean;
    try{return clean.replace(new RegExp('('+terms.join('|')+')','gi'),'<mark>$1</mark>');}catch(_){return clean;}
  }
  function visibleChapters(){return guide.chapters.filter(c=>(filter==='all'||c.kind===filter)&&(!query||chapterText(c).includes(norm(query))));}
  function tableHTML(rows){
    if(!rows||!rows.length)return '';
    return '<div class="table-wrap"><table>'+rows.map((row,ri)=>'<tr>'+row.map(cell=>(ri===0?'<th>':'<td>')+highlight(cell)+(ri===0?'</th>':'</td>')).join('')+'</tr>').join('')+'</table></div>';
  }
  function renderBlocks(blocks){
    let html='',open=false;
    const close=()=>{if(open){html+='</ul>';open=false;}};
    (blocks||[]).forEach(b=>{
      if(b.type==='li'){if(!open){html+='<ul>';open=true;}html+='<li>'+highlight(b.text)+'</li>';return;}
      close();
      if(b.type==='h2')html+='<h3>'+highlight(b.text)+'</h3>';
      else if(b.type==='caption')html+='<p class="caption">'+highlight(b.text)+'</p>';
      else if(b.type==='table')html+=tableHTML(b.rows);
      else if(b.text)html+='<p>'+highlight(b.text)+'</p>';
    });
    close();return html;
  }
  function visualHTML(c){
    const v=VISUALS[c.id];if(!v)return '';
    return '<figure class="v46-chapter-visual"><img src="'+v[0]+'" alt="'+esc(v[1])+'"><figcaption><strong>'+esc(v[1])+'</strong><span>Temsili/konsept görsel; uygulama projesi değildir.</span></figcaption></figure>';
  }
  function buildNav(){
    nav.innerHTML='';const list=visibleChapters();
    list.forEach(c=>{const idx=guide.chapters.indexOf(c);const b=document.createElement('button');b.type='button';b.className='chapter-link'+(idx===activeIndex?' is-active':'');b.innerHTML='<b>'+esc(c.id)+'</b><span>'+highlight(c.title)+'</span>';b.onclick=()=>{activeIndex=idx;renderChapter();sidebar&&sidebar.classList.remove('is-open');document.getElementById('reader').scrollIntoView({behavior:'smooth',block:'start'});history.replaceState(null,'','#bolum-'+String(c.id).toLowerCase());};nav.appendChild(b);});
    if(!list.length)nav.innerHTML='<p style="padding:14px;color:var(--muted);font-size:11px">Arama kriterine uygun bölüm bulunamadı.</p>';
  }
  function renderChapter(){
    const c=guide.chapters[activeIndex]||guide.chapters[0];
    kicker.textContent=(c.kind==='appendix'?'Ek':'Bölüm')+' '+String(c.id).replace('EK-','');
    title.textContent=c.title;
    body.innerHTML=visualHTML(c)+renderBlocks(c.blocks);
    searchNotice.hidden=!query;
    if(query)searchNotice.textContent='Arama aktif: “'+query+'”. Bölüm listesi tam metin üzerinden filtreleniyor.';
    buildNav();
    window.dispatchEvent(new CustomEvent('kayas:chapter-rendered',{detail:{id:c.id,title:c.title}}));
  }
  function step(delta){const list=visibleChapters();if(!list.length)return;let p=list.findIndex(c=>guide.chapters.indexOf(c)===activeIndex);p=p<0?0:(p+delta+list.length)%list.length;activeIndex=guide.chapters.indexOf(list[p]);renderChapter();document.getElementById('reader').scrollIntoView({behavior:'smooth',block:'start'});}

  document.getElementById('prevChapter').onclick=()=>step(-1);
  document.getElementById('nextChapter').onclick=()=>step(1);
  document.getElementById('startReading').onclick=()=>document.getElementById('reader').scrollIntoView({behavior:'smooth'});
  document.getElementById('showDecisionMap').onclick=()=>document.getElementById('decisionPanel').scrollIntoView({behavior:'smooth'});
  document.getElementById('themeButton').onclick=()=>document.body.classList.toggle('is-night');
  document.getElementById('printButton').onclick=()=>window.print();
  if(mobileNavButton)mobileNavButton.onclick=()=>sidebar&&sidebar.classList.toggle('is-open');
  document.querySelectorAll('.filter-chip').forEach(btn=>btn.onclick=()=>{document.querySelectorAll('.filter-chip').forEach(x=>x.classList.remove('is-active'));btn.classList.add('is-active');filter=btn.dataset.filter||'all';buildNav();});
  if(searchInput)searchInput.oninput=()=>{query=searchInput.value.trim();buildNav();renderChapter();};

  const gates=[
    ['Resmî güç bağlantısı / fault level','Faz kapasitesi ve satılabilir MW bu kanıtla dondurulur.'],
    ['Statik / sismik / yangın','Üst kat yerleşim ve ağır MEP ekipmanı için karar kapısıdır.'],
    ['8°C su debi / kimya / izin','Doğal soğuk kaynak ancak doğrulanmış eşanjörlü mimariyle kullanılabilir.'],
    ['İki bağımsız fiber güzergâhı','Carrier-neutral ve yüksek erişilebilirlik iddiaları fiziksel kanıt ister.'],
    ['Tier / Commissioning planı','Tier III hedeftir; test ve sertifikasyon kanıtı ayrıca gerekir.'],
    ['Exact BoQ / lisans / lifecycle','Performans, destek ve TCO yazılı ürün kanıtıyla kapanmalıdır.']
  ];
  const eg=document.getElementById('evidenceGrid');if(eg)eg.innerHTML=gates.map(g=>'<div class="evidence-card"><strong>'+esc(g[0])+'</strong><span>'+esc(g[1])+'</span></div>').join('');

  const hash=location.hash.match(/bolum-([0-9]{1,2}|ek-[a-z])/i);
  if(hash){const wanted=hash[1].toUpperCase().replace(/^([0-9])$/,'0$1');const idx=guide.chapters.findIndex(c=>String(c.id).toUpperCase()===wanted);if(idx>=0)activeIndex=idx;}
  buildNav();renderChapter();
})();
