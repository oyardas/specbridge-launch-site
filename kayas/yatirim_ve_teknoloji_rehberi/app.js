(function(){
  'use strict';
  const guide=window.KAYAS_GUIDE;
  if(!guide){document.body.innerHTML='<main style="padding:40px;font-family:sans-serif">Guide data could not be loaded.</main>';return;}

  const AUTH_KEY='kayas_walkthrough_auth_until';
  const EXPECTED='13a9e92799eaf7515a82f73b4a2b3026a568dae3db4e35b5f4f4562b1d67bef7';
  const gate=document.getElementById('loginGate');
  const user=document.getElementById('loginUser');
  const pass=document.getElementById('loginPass');
  const error=document.getElementById('loginError');
  async function sha256(value){const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');}
  function storageGet(k){try{return localStorage.getItem(k);}catch(_){return null;}}
  function storageSet(k,v){try{localStorage.setItem(k,v);}catch(_){}}
  function unlock(){if(gate)gate.classList.add('is-hidden');}
  if(Number(storageGet(AUTH_KEY)||0)>Date.now())unlock();
  document.getElementById('loginButton').addEventListener('click',async()=>{
    error.textContent='';
    if(await sha256(user.value.trim()+':'+pass.value)===EXPECTED){storageSet(AUTH_KEY,String(Date.now()+8*60*60*1000));unlock();}
    else{error.textContent='Kullanıcı adı veya parola hatalı.';pass.select();}
  });
  [user,pass].forEach(el=>el.addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('loginButton').click();}));

  const nav=document.getElementById('chapterNav');
  const title=document.getElementById('readerTitle');
  const kicker=document.getElementById('readerKicker');
  const body=document.getElementById('readerBody');
  const searchInput=document.getElementById('searchInput');
  const searchNotice=document.getElementById('searchNotice');
  const mobileNavButton=document.getElementById('mobileNavButton');
  const sidebar=document.querySelector('.sidebar');
  let activeIndex=Math.max(0,guide.chapters.findIndex(c=>c.id==='01'));
  let filter='all';
  let query='';

  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  function norm(s){return String(s||'').toLocaleLowerCase('tr-TR');}
  function chapterText(c){return norm(c.title+' '+c.blocks.map(b=>b.type==='table'?b.rows.flat().join(' '):(b.text||'')).join(' '));}
  function highlight(s){
    if(!query)return esc(s);
    const escaped=esc(s);
    const terms=query.trim().split(/\s+/).filter(Boolean).map(t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
    if(!terms.length)return escaped;
    return escaped.replace(new RegExp('('+terms.join('|')+')','gi'),'<mark>$1</mark>');
  }
  function visibleChapters(){
    return guide.chapters.filter(c=>{
      if(filter!=='all'&&c.kind!==filter)return false;
      if(query&&!chapterText(c).includes(norm(query)))return false;
      return true;
    });
  }
  function buildNav(){
    nav.innerHTML='';
    const list=visibleChapters();
    list.forEach(c=>{
      const idx=guide.chapters.indexOf(c);
      const b=document.createElement('button');
      b.type='button';b.className='chapter-link'+(idx===activeIndex?' is-active':'');
      b.innerHTML='<b>'+esc(c.id)+'</b><span>'+highlight(c.title)+'</span>';
      b.addEventListener('click',()=>{activeIndex=idx;renderChapter();sidebar.classList.remove('is-open');document.getElementById('reader').scrollIntoView({behavior:'smooth',block:'start'});});
      nav.appendChild(b);
    });
    if(!list.length){nav.innerHTML='<p style="padding:14px;color:var(--muted);font-size:11px">Arama kriterine uygun bölüm bulunamadı.</p>';}
  }
  function tableHTML(rows){
    if(!rows||!rows.length)return '';
    let html='<div class="table-wrap"><table>';
    rows.forEach((row,ri)=>{
      html+='<tr>'+row.map(cell=>(ri===0?'<th>':'<td>')+highlight(cell)+(ri===0?'</th>':'</td>')).join('')+'</tr>';
    });
    return html+'</table></div>';
  }
  function renderBlocks(blocks){
    let html='',openList=false;
    function closeList(){if(openList){html+='</ul>';openList=false;}}
    blocks.forEach(b=>{
      if(b.type==='li'){
        if(!openList){html+='<ul>';openList=true;}
        html+='<li>'+highlight(b.text)+'</li>';
        return;
      }
      closeList();
      if(b.type==='h2')html+='<h3>'+highlight(b.text)+'</h3>';
      else if(b.type==='caption')html+='<p class="caption">'+highlight(b.text)+'</p>';
      else if(b.type==='table')html+=tableHTML(b.rows);
      else html+='<p>'+highlight(b.text)+'</p>';
    });
    closeList();
    return html;
  }
  function renderChapter(){
    const c=guide.chapters[activeIndex]||guide.chapters[0];
    kicker.textContent=(c.kind==='appendix'?'Ek':'Bölüm')+' '+c.id.replace('EK-','');
    title.textContent=c.title;
    body.innerHTML=renderBlocks(c.blocks);
    searchNotice.hidden=!query;
    if(query){const count=(chapterText(c).match(new RegExp(query.trim().replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))||[]).length;searchNotice.textContent='"'+query+'" araması bu bölümde '+count+' doğrudan eşleşme içeriyor. Arama, bölüm listesinde tam metin üzerinden filtre uygulanarak çalışır.';}
    buildNav();
  }
  function step(delta){
    const candidates=visibleChapters();
    if(!candidates.length)return;
    let pos=candidates.findIndex(c=>guide.chapters.indexOf(c)===activeIndex);
    if(pos<0)pos=0;else pos=(pos+delta+candidates.length)%candidates.length;
    activeIndex=guide.chapters.indexOf(candidates[pos]);
    renderChapter();
    document.getElementById('reader').scrollIntoView({behavior:'smooth',block:'start'});
  }

  document.getElementById('prevChapter').addEventListener('click',()=>step(-1));
  document.getElementById('nextChapter').addEventListener('click',()=>step(1));
  document.getElementById('startReading').addEventListener('click',()=>document.getElementById('reader').scrollIntoView({behavior:'smooth'}));
  document.getElementById('showDecisionMap').addEventListener('click',()=>document.getElementById('decisionPanel').scrollIntoView({behavior:'smooth'}));
  document.getElementById('themeButton').addEventListener('click',()=>document.body.classList.toggle('is-night'));
  document.getElementById('printButton').addEventListener('click',()=>window.print());
  mobileNavButton.addEventListener('click',()=>sidebar.classList.toggle('is-open'));

  document.querySelectorAll('.filter-chip').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-chip').forEach(x=>x.classList.remove('is-active'));btn.classList.add('is-active');filter=btn.dataset.filter;buildNav();
  }));
  searchInput.addEventListener('input',()=>{query=searchInput.value.trim();buildNav();renderChapter();});

  const gates=[
    ['Resmî elektrik bağlantı/tahsis gücü, gerilim ve fault level','Faz kapasitesi, trafo/şalt/UPS/jeneratör boyutu ve satışa açılabilir MW dondurulamaz.'],
    ['Bina statik/sismik/yangın uygunluğu','Üst kat yerleşim, akü, UPS, sıvı soğutma ve ekipman yükleri güvenle dondurulamaz.'],
    ['8°C su: debi, mevsimsellik, kimya ve izin','Economizer kapasitesi, WUE/PUE ve kaynak bağımlılığı doğrulanmadan iddia edilemez.'],
    ['İki fiber güzergâh ve MMR bağımsızlık kanıtı','Carrier-neutral ve DR/availability iddiaları için fiziksel bağımsızlık kanıtı gerekir.'],
    ['Tier/TS EN kapsamı + Commissioning master planı','Tier III hedefi, sertifika veya constructed-facility kanıtı değildir.'],
    ['Exact IT/H3C BoQ, lisans/HCL/lifecycle ve Türkiye destek','Performans, destek SLA ve 5/10 yıllık TCO yazılı kanıtla dondurulmalıdır.'],
    ['Anchor müşteri/pipeline, fiyat, doluluk ve tahsilat varsayımları','Bir sonraki fazın gelir, EBITDA ve finansman kararı bu veriler olmadan verilemez.']
  ];
  document.getElementById('evidenceGrid').innerHTML=gates.map(g=>'<div class="evidence-card"><strong>'+esc(g[0])+'</strong><span>'+esc(g[1])+'</span></div>').join('');

  buildNav();renderChapter();
})();
