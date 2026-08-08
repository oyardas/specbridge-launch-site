(function(){
  'use strict';

  const PRIMERS={
    '01':{n:'Veri merkezi yatırımı; fiziksel tesis, enerji, bağlantı, IT platformları ve işletme kabiliyetinin birlikte ekonomik değer üretmesidir.',o:'Yatırımın başarısı yalnız bina veya kabinet sayısıyla değil; kullanılabilir güç, satılabilir kW/MW, doluluk, SLA ve müşteri talebiyle ölçülür.',t:'Colocation, enterprise/private DC, hyperscale/wholesale, cloud ve managed-service odaklı modeller.',c:'Enerji ve saha hazırlanır → MEP/IT altyapısı kurulur → kapasite müşteriye sözleşmeyle tahsis edilir → operasyon ve SLA üzerinden gelir üretilir.'},
    '02':{n:'Veri merkezi fiziksel altyapısının geleneksel saha yapımı, mikro-modül veya prefabrik/fabrika üretimli modüllerle kurulması yaklaşımıdır.',o:'Kurulum süresi, standardizasyon, saha riski, CAPEX zamanlaması ve gelecekte kapasite ekleme biçimini doğrudan etkiler.',t:'Geleneksel site-built, mikro-modül/pod, prefabrik modüler (PFM), konteyner/complete module.',c:'Ortak güç-soğutma-fiber omurgasına tekrarlanabilir IT/MEP blokları bağlanır; talep büyüdükçe yeni modüller devreye alınır.'},
    '03':{n:'Şebekeden IT rack’ine kadar elektriğin güvenli, seçici, ölçülebilir ve yedekli biçimde taşındığı tüm güç zinciridir.',o:'Veri merkezindeki en kritik süreklilik katmanıdır; güç yolu tasarımı satılabilir MW, Tier hedefi, bakım ve arıza etkisini belirler.',t:'OG/AG giriş, trafo, şalt, UPS, jeneratör, PDU/busway, rack PDU, A/B yol, koruma ve ölçüm.',c:'Şebeke enerjisi dönüştürülür ve dağıtılır; UPS kısa kesintileri köprüler, jeneratör uzun kesintide yükü devralır, A/B yollar kritik IT yükünü besler.'},
    '04':{n:'UPS (Uninterruptible Power Supply), şebeke bozulması veya kesilmesi sırasında kritik IT yükünü kesintisiz besleyen güç elektroniği sistemidir.',o:'Milisaniye seviyesindeki kesintilerin sunucu, storage ve ağ cihazlarını durdurmasını önler; jeneratör devreye girene kadar ride-through sağlar.',t:'Static double-conversion UPS, modular UPS, rotary/DRUPS; enerji depolamada VRLA, Li-ion/LFP veya kinetik çözümler.',c:'Şebeke normalde UPS üzerinden yükü besler → kesintide inverter enerji depolamadan devam eder → jeneratör stabil hale gelince yük uzun süreli kaynağa aktarılır.'},
    '05':{n:'UPS çıkışındaki gücü salon ve kabinet seviyesine taşıyan son-metre dağıtım katmanıdır.',o:'Rack yoğunluğu, A/B besleme, ölçüm, bakım esnekliği ve müşteri bazlı enerji faturalamasının temelidir.',t:'Floor PDU, overhead busway, tap-off box, rack PDU; basic, metered ve intelligent PDU.',c:'UPS/PDU çıkışı busway veya kabloyla dağıtılır → tap-off rack hattını besler → A/B rack PDU cihazın iki güç girişine enerji sağlar ve tüketimi ölçer.'},
    '06':{n:'Elektrik enerjisinin batarya veya farklı depolama teknolojileriyle daha sonra kullanılmak üzere saklanmasıdır.',o:'UPS bataryası kısa süreli kesintisizliğe, BESS ise enerji esnekliği, peak shaving, yenilenebilir entegrasyonu ve bazı grid-use-case’lerine hizmet eder.',t:'VRLA, Li-ion/LFP UPS bataryaları; container/cabinet BESS, PCS/inverter, BMS ve EMS.',c:'Enerji depolama sistemi şarj olur → kontrol sistemi SoC ve güvenliği izler → ihtiyaç anında inverter üzerinden yük veya şebekeye kontrollü güç verir.'},
    '07':{n:'Şebeke uzun süre kullanılamadığında kritik veri merkezi yüklerini besleyen motor-jeneratör tabanlı yedek güç katmanıdır.',o:'UPS’in kısa ride-through süresinden sonra iş sürekliliğini saatler veya yakıt tedariki sürdükçe devam ettirir.',t:'Diesel/gas genset, N+1 veya daha yüksek yedeklilik, ATS/STS/şalt entegrasyonu, merkezi veya day-tank yakıt sistemleri.',c:'Şebeke kaybolur → UPS yükü taşır → jeneratör start eder ve stabilize olur → şalt/ATS yükü jeneratöre geçirir → yakıt ve bakım planı sürekliliği sağlar.'},
    '08':{n:'IT ekipmanının ürettiği ısının hava, su veya dielektrik sıvı üzerinden uzaklaştırılması ve çevreye atılması sürecidir.',o:'Enerji tüketimi, rack yoğunluğu, PUE/WUE, IT güvenilirliği ve AI/HPC kapasitesini belirleyen ana MEP sistemidir.',t:'In-row/CRAH/CRAC, air-cooled veya water-cooled chiller, dry/adiabatic cooling, rear-door HX, direct-to-chip + CDU, immersion.',c:'IT’den alınan ısı kapalı devreye aktarılır → eşanjör/chiller/heat-rejection sistemi ısıyı dışarı atar → soğutulmuş akışkan tekrar IT tarafına döner. Doğal su doğrudan IT devresine bağlanmaz.'},
    '09':{n:'Veri merkezinin operatörlere, internete, müşterilere ve kendi rack/fabric yapısına yüksek hızlı optik bağlantı sağlayan fiziksel ve mantıksal ağ katmanıdır.',o:'Carrier çeşitliliği, düşük gecikme, cloud/colo ürünleri ve AI cluster fabric kapasitesi doğrudan fiber ve DC network tasarımına bağlıdır.',t:'MMR, carrier cross-connect, ODF, spine-leaf, EVPN/VXLAN, OOB yönetim; 100G/400G/800G ve gelişen 1.6T bağlantılar.',c:'Carrier fiberi bağımsız güzergâhlardan MMR’a gelir → cross-connect/core-spine katmanına bağlanır → leaf üzerinden compute/storage/rack’lere dağıtılır.'},
    '10':{n:'Compute, storage ve network kaynaklarının yazılım, otomasyon ve self-service katmanıyla hizmet olarak sunulmasıdır.',o:'Fiziksel veri merkezi kapasitesini daha yüksek katma değerli IaaS/private cloud/managed hizmet gelirine dönüştürür.',t:'Private cloud, hybrid cloud, managed cloud; IaaS, PaaS, DBaaS, container/Kubernetes servisleri.',c:'Fiziksel kaynaklar sanallaştırılır/havuzlanır → cloud yönetimi katalog, quota ve workflow uygular → tenant portalı kaynak tüketir → metering/SLA üzerinden hizmet yönetilir.'},
    '11':{n:'Müşterinin kendi IT ekipmanını veya dedicated altyapısını üçüncü taraf veri merkezinde güç, soğutma, bağlantı ve güvenlik hizmetleriyle barındırmasıdır.',o:'KAYAŞ’ın ilk ticari omurgalarından biridir; gelir rack sayısından çok contracted kW/MW, bağlantı, SLA ve ek hizmetlerden oluşur.',t:'Retail colo, wholesale/dedicated hall, cage/private suite, cross-connect, remote hands ve managed services.',c:'Müşteriye alan + güç kapasitesi + bağlantı tahsis edilir → tesis operasyonu çevresel ve enerji sürekliliğini sağlar → SLA, ölçüm ve destek hizmetleri faturalandırılır.'},
    '12':{n:'Tiering veri merkezi altyapısının dayanıklılık/topoloji seviyesini; standartlar tasarım ve işletme gerekliliklerini; commissioning ise kurulan sistemlerin birlikte doğrulanmasını tanımlar.',o:'Yedekli ekipman satın almak tek başına güvenilir tesis üretmez; tasarım, kurulum, test ve operasyon kanıtının uçtan uca doğrulanması gerekir.',t:'Uptime Tier I–IV, ANSI/TIA-942, EN 50600/TS EN 50600 ailesi; FAT, SAT, IST, ORR ve acceptance süreçleri.',c:'Gereksinimler tasarıma çevrilir → ekipman ve sistemler FAT/SAT ile doğrulanır → Integrated Systems Test arıza ve geçiş senaryolarını sınar → operasyon ekibine kontrollü devredilir.'},
    '13':{n:'Compute işlem gücünü, storage veriyi, HCI ise compute + software-defined storage + virtualization kaynaklarını ölçeklenebilir node’larda birleştirir.',o:'Cloud, sanallaştırma, veri tabanı, enterprise uygulamalar ve bazı AI iş yüklerinin performans, kapasite ve failure-domain temelini oluşturur.',t:'Rack server, blade/modular compute, SAN/NAS/object/SDS; 2/3/4+ node HCI cluster ve scale-out mimariler.',c:'Node’lardaki CPU/RAM/disk kaynakları yazılımla havuzlanır → sanallaştırma VM/container çalıştırır → veri node’lara dağıtılır ve replike edilir → yeni node eklenerek kapasite büyür.'},
    '14':{n:'Sanallaştırma fiziksel donanım kaynaklarını mantıksal iş yüklerine ayırır; yedeklilik arıza etkisini sınırlar; büyüme ise kapasitenin kontrollü artırılmasıdır.',o:'Donanım arızası, bakım veya talep artışında hizmetin kesilmeden sürmesini ve kaynakların daha verimli kullanılmasını sağlar.',t:'Hypervisor, VM/container, HA cluster, live migration, replication, scale-up/scale-out, availability zone ve DR.',c:'İş yükleri kaynak havuzunda çalışır → health/HA sistemi node arızasını algılar → iş yükünü sağlıklı node’a yeniden başlatır/taşır → talep arttıkça node veya kaynak eklenir.'},
    '15':{n:'Backup verinin geri getirilebilir kopyasını oluşturur; Disaster Recovery (DR) ise kritik hizmeti büyük kesinti veya site kaybı sonrasında yeniden çalıştırma kabiliyetidir.',o:'Ransomware, kullanıcı hatası, donanım arızası ve site felaketlerinde veri ve iş sürekliliğinin son savunma katmanıdır.',t:'Full/incremental backup, immutable/object-lock, offline/air-gap kopya, replication, local/remote DR site ve cloud backup.',c:'Veri periyodik olarak kopyalanır → en az bir kopya değiştirilemez/izole tutulur → restore testleri doğrulanır → felakette RPO/RTO hedeflerine göre DR ortamı devreye alınır.'},
    '16':{n:'DCIM/BMS/EMS/NMS veri merkezi tesis ve IT telemetrisini toplar; NOC/SOC operasyon ve güvenlik olaylarını yöneten organizasyonel/teknik kontrol katmanlarıdır.',o:'Enerji, soğutma, kapasite, ağ ve güvenlik olaylarını tekil cihaz ekranlarından çıkarıp bütünsel işletme görünürlüğüne dönüştürür.',t:'DCIM, Building Management System, Energy Management System, Network Management System, NOC, SOC ve SIEM/automation entegrasyonları.',c:'Sensör ve platform verileri merkezi izleme katmanlarına akar → alarm/olay korelasyonu yapılır → operatör aksiyon alır veya kontrollü otomasyon uygulanır → KPI ve kapasite trendleri raporlanır.'},
    '17':{n:'Fiziksel güvenlik tesis, oda, cage ve rack erişimini; siber güvenlik ise ağ, kimlik, sistem ve veriyi yetkisiz erişim ve saldırılardan korur.',o:'Veri merkezi güveni yalnız firewall değil, insan girişinden privileged access ve SOC olay müdahalesine kadar katmanlı kontrole dayanır.',t:'Perimeter/CCTV/mantrap/access control; IAM/MFA/PAM, segmentation, firewall, IDS/IPS, SIEM/SOC, Zero Trust ve crypto-agility.',c:'Kimlik doğrulanır → fiziksel/mantıksal erişim en az yetkiyle verilir → trafik ve olaylar sürekli izlenir → anomali tespitinde containment ve incident response süreçleri çalışır.'},
    '18':{n:'AI/GPU cluster, çok sayıda accelerator/GPU sunucusunun yüksek hızlı fabric, yüksek performanslı storage ve yoğun güç/soğutma altyapısıyla tek hesaplama kümesi olarak çalışmasıdır.',o:'AI training ve büyük inference iş yükleri klasik enterprise rack yoğunluğunun çok üzerine çıkarak elektrik, cooling ve fiber tasarımını birlikte değiştirir.',t:'GPU compute node, 800G-class fabric, parallel storage, orchestration/scheduler, direct-to-chip/CDU ve yüksek yoğunluklu power zone.',c:'Veri yüksek hızlı storage’dan GPU node’larına taşınır → GPU’lar fabric üzerinden paralel hesaplama yapar → scheduler kaynakları paylaştırır → sıvı soğutma ve güç telemetrisi yoğunluğu kontrol eder.'},
    '19':{n:'Sürdürülebilir veri merkezi; enerji, su, karbon, malzeme ve yaşam döngüsü etkilerini ölçerek hizmet kapasitesini daha düşük çevresel etkiyle üretmeyi hedefler.',o:'Enerji maliyeti, regülasyon, müşteri ESG beklentisi, su riski ve uzun vadeli işletme verimliliği yatırım kararını etkiler.',t:'PUE, WUE, CUE/karbon görünürlüğü, REF/yenilenebilir enerji, heat reuse, free cooling ve enerji yönetimi.',c:'Enerji/su/karbon ölçülür → kayıp ve verimsizlik kaynakları belirlenir → cooling/power/IT optimizasyonu uygulanır → yenilenebilir enerji ve ısı geri kullanım seçenekleri ekonomik olarak değerlendirilir.'},
    '20':{n:'Edge veri merkezi, compute/storage/network kapasitesini merkezi tesisten kullanıcı, cihaz veya veri kaynağına daha yakın dağıtan küçük/orta ölçekli altyapıdır.',o:'Düşük gecikme, veri yerelliği, bant genişliği tasarrufu ve bağlantı kesintisinde yerel çalışmanın gerekli olduğu kullanım senaryolarına hizmet eder.',t:'Regional edge, metro edge, telco edge, industrial/OT edge ve micro data center.',c:'Gecikmeye duyarlı veri yerelde işlenir → gerekli sonuç/veri merkezi cloud’a senkronize edilir → merkezi yönetim dağıtık edge düğümlerinin güvenlik, sürüm ve kapasitesini kontrol eder.'},
    '21':{n:'Kuantum bilgisayar belirli problem sınıflarında qubit tabanlı hesaplama kullanır; post-quantum cryptography (PQC) ise kuantum saldırılarına dayanıklı klasik kriptografi ailesidir.',o:'KAYAŞ için yakın dönem yatırım konusu kuantum donanımı değil; uzun ömürlü veri ve sistemlerde crypto-agility ve PQC geçiş hazırlığıdır.',t:'Superconducting, trapped-ion, photonic ve annealing quantum sistemleri; NIST PQC algoritmaları, hybrid migration ve key/certificate inventory.',c:'Quantum sistem qubit durumlarını kontrol ederek özel algoritmaları çalıştırır. PQC tarafında ise mevcut şifreleme envanteri çıkarılır → crypto-agile mimari kurulur → standart algoritmalar kontrollü geçişle devreye alınır.'},
    '22':{n:'CAPEX yatırım harcamasını, OPEX işletme giderini, TCO ise seçilen dönem boyunca toplam ekonomik maliyeti; ticari fizibilite de gelir/EBITDA/nakit akışı tarafını analiz eder.',o:'Teknik olarak iyi bir tesis ancak güç, doluluk, fiyat, enerji maliyeti, finansman ve fazlama varsayımlarıyla ekonomik olarak sürdürülebilir hale gelir.',t:'CAPEX, fixed/variable OPEX, nominal ve discounted TCO; revenue, EBITDA, NPV, IRR, payback ve sensitivity senaryoları.',c:'Kapsam ve varsayımlar tanımlanır → CAPEX/OPEX ayrı modellenir → doluluk ve satılabilir kW gelir modeline bağlanır → iskonto ve hassasiyet analiziyle yatırım kararı test edilir.'},
    '23':{n:'Yatırım yol haritası, teknik ve ticari yatırımların hangi sırayla ve hangi kanıt kapısı sağlandığında devreye alınacağını gösteren fazlama planıdır.',o:'Gelecekte gerekebilecek tüm teknolojiyi bugün satın almak yerine, omurgayı erken hazırlayıp aktif CAPEX’i talep ve kanıtla açarak sermaye riskini azaltır.',t:'Bugün yapılmalı, altyapısı bugün hazırlanmalı, müşteri talebiyle yapılmalı; 3/5/10 yıllık teknoloji ve kapasite kapıları.',c:'Power/site/fiber kanıtları kapanır → Faz-1 MEP ve ticari servisler açılır → doluluk/kontrat/enerji kapasitesi takip edilir → eşik sağlandığında sonraki blok veya yüksek yoğunluklu teknoloji devreye alınır.'}
  };

  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  function activeChapterId(){
    const k=document.getElementById('readerKicker');
    const txt=(k&&k.textContent||'').trim();
    const m=txt.match(/(\d{1,2})/);
    return m?m[1].padStart(2,'0'):null;
  }
  function primerHTML(id){
    const p=PRIMERS[id]; if(!p)return '';
    return '<section class="v44-primer v44-reveal" data-v44-primer="'+id+'">'+
      '<div class="v44-primer-head"><div><span class="primer-kicker">Konuya hızlı giriş</span><h3>Önce temel kavramı netleştirelim</h3></div><span class="v44-primer-badge">4 temel soru</span></div>'+
      '<div class="v44-primer-grid">'+
      '<article class="v44-primer-card v44-reveal"><b>Nedir?</b><p>'+esc(p.n)+'</p></article>'+
      '<article class="v44-primer-card v44-reveal"><b>Veri merkezindeki önemi</b><p>'+esc(p.o)+'</p></article>'+
      '<article class="v44-primer-card v44-reveal"><b>Başlıca türleri / bileşenleri</b><p>'+esc(p.t)+'</p></article>'+
      '<article class="v44-primer-card v44-reveal"><b>Basit çalışma mantığı</b><p>'+esc(p.c)+'</p></article>'+
      '</div></section>';
  }

  function injectPrimer(){
    const body=document.getElementById('readerBody'); if(!body)return;
    const id=activeChapterId(); if(!id||!PRIMERS[id])return;
    const existing=body.querySelector('.v44-primer');
    if(existing&&existing.getAttribute('data-v44-primer')===id)return;
    if(existing)existing.remove();
    body.insertAdjacentHTML('afterbegin',primerHTML(id));
    prepareReveal(body.querySelector('.v44-primer'));
  }

  function dashboardHTML(){return `
    <section class="v44-dashboard" id="v44Dashboard">
      <div class="v44-dashboard-head"><div><span class="live-chart-tag">2026 yatırımcı veri panosu</span><h2>Enerji, kapasite, verimlilik ve operasyon sinyalleri</h2><p>Canlı HTML/SVG grafikler; statik ekran görüntüsü değildir.</p></div><span class="v44-primer-badge">IEA · JLL · CBRE · Uptime</span></div>
      <div class="v44-chart-grid">
        <article class="v44-chart v44-reveal"><div class="v44-chart-head"><h3>Küresel veri merkezi elektriği</h3><span>IEA · TWh/yıl</span></div><svg viewBox="0 0 520 265" role="img" aria-label="2024 415 TWh, 2030 945 TWh"><line class="axis" x1="55" x2="485" y1="205" y2="205"/><rect class="bar-a" x="120" y="115" width="105" height="90" rx="7"/><rect class="bar-b" x="315" y="15" width="105" height="190" rx="7"/><text class="value" text-anchor="middle" x="172" y="102">415</text><text class="value" text-anchor="middle" x="367" y="30">945</text><text class="label" text-anchor="middle" x="172" y="231">2024</text><text class="label" text-anchor="middle" x="367" y="231">2030</text><text class="axis-label" transform="rotate(-90 17 135)" x="17" y="135">TWh / yıl</text></svg><p class="v44-chart-note"><b>IEA:</b> base case ≈415 TWh → ≈945 TWh.</p></article>
        <article class="v44-chart v44-reveal"><div class="v44-chart-head"><h3>Küresel kapasite</h3><span>JLL · GW</span></div><svg viewBox="0 0 520 265" role="img" aria-label="2025 103 GW, 2030 200 GW"><line class="axis" x1="55" x2="485" y1="205" y2="205"/><rect class="bar-a" x="120" y="107" width="105" height="98" rx="7"/><rect class="bar-b" x="315" y="15" width="105" height="190" rx="7"/><text class="value" text-anchor="middle" x="172" y="94">103</text><text class="value" text-anchor="middle" x="367" y="30">200</text><text class="label" text-anchor="middle" x="172" y="231">2025</text><text class="label" text-anchor="middle" x="367" y="231">2030</text><text class="axis-label" transform="rotate(-90 17 135)" x="17" y="135">GW</text></svg><p class="v44-chart-note"><b>JLL:</b> yaklaşık 103 GW → 200 GW sektör kapasite görünümü.</p></article>
        <article class="v44-chart v44-reveal"><div class="v44-chart-head"><h3>Küresel arz ve vacancy</h3><span>CBRE · Q1 2025 → Q1 2026</span></div><svg viewBox="0 0 520 275" role="img" aria-label="Supply 12.8 to 16 GW; vacancy 8.2 to 6.7 percent"><line class="axis" x1="55" x2="485" y1="212" y2="212"/><rect class="bar-a" x="110" y="70" width="95" height="142" rx="7"/><rect class="bar-b" x="320" y="34" width="95" height="178" rx="7"/><path class="line-a" d="M157 75 L367 120"/><circle class="dot-a" cx="157" cy="75" r="5"/><circle class="dot-a" cx="367" cy="120" r="5"/><text class="value" text-anchor="middle" x="157" y="57">12.8 GW</text><text class="value" text-anchor="middle" x="367" y="22">16.0 GW</text><text class="value" text-anchor="middle" x="157" y="101">8.2%</text><text class="value" text-anchor="middle" x="367" y="146">6.7%</text><text class="label" text-anchor="middle" x="157" y="238">Q1 2025</text><text class="label" text-anchor="middle" x="367" y="238">Q1 2026</text></svg><p class="v44-chart-note"><b>CBRE:</b> arz artarken vacancy düşüyor; power availability ana darboğazlardan biri.</p></article>
        <article class="v44-chart v44-reveal"><div class="v44-chart-head"><h3>PUE benchmark</h3><span>Uptime 2025</span></div><svg viewBox="0 0 520 275" role="img" aria-label="PUE 1.54, 1.48, 1.44"><line class="axis" x1="55" x2="485" y1="212" y2="212"/><rect class="bar-a" x="80" y="70" width="85" height="142" rx="7"/><rect class="bar-b" x="218" y="91" width="85" height="121" rx="7"/><rect class="bar-c" x="356" y="107" width="85" height="105" rx="7"/><text class="value" text-anchor="middle" x="122" y="57">1.54</text><text class="value" text-anchor="middle" x="260" y="78">1.48</text><text class="value" text-anchor="middle" x="398" y="94">1.44</text><text class="label" text-anchor="middle" x="122" y="238">Tüm örneklem</text><text class="label" text-anchor="middle" x="260" y="238">Yeni tesisler</text><text class="label" text-anchor="middle" x="398" y="238">20 MW+</text></svg><p class="v44-chart-note"><b>Uptime:</b> yeni ve büyük tesislerde ortalama PUE daha düşük olabiliyor.</p></article>
      </div><div class="v44-web-note"><strong>Yayın notu:</strong> Bu grafikler yatırımcı okuması için yeniden çizilmiş görsel özetlerdir; kaynak, dönem ve varsayım detayları ilgili rehber bölümlerindeki kaynak kayıtlarıyla birlikte değerlendirilmelidir.</div>
    </section>`;}

  function injectDashboard(){
    if(document.getElementById('v44Dashboard'))return;
    const metrics=document.querySelector('.metrics-grid');
    if(metrics)metrics.insertAdjacentHTML('afterend',dashboardHTML());
    const dash=document.getElementById('v44Dashboard'); if(dash)prepareReveal(dash);
  }

  function parseCounter(raw){
    const text=String(raw||'').trim();
    if(!text||text.includes('/')||/tier|open|beta|n\+/i.test(text))return null;
    const m=text.match(/^([^\d-]*)(-?\d[\d.,]*)(.*)$/); if(!m)return null;
    let num=m[2];
    const dot=num.lastIndexOf('.'),comma=num.lastIndexOf(',');
    if(comma>dot)num=num.replace(/\./g,'').replace(',','.');else num=num.replace(/,/g,'');
    const value=parseFloat(num); if(!Number.isFinite(value))return null;
    const dec=(String(num).split('.')[1]||'').length;
    return {prefix:m[1],value,dec,suffix:m[3],original:text};
  }
  function counterText(meta,v){return meta.prefix+v.toLocaleString('tr-TR',{minimumFractionDigits:meta.dec,maximumFractionDigits:meta.dec})+meta.suffix;}
  function animateCounter(el){
    if(!el||el.dataset.v44CounterDone==='1')return;
    const meta=parseCounter(el.textContent); if(!meta)return;
    el.dataset.v44CounterDone='1'; const start=performance.now(),dur=1150;
    function tick(now){const t=Math.min(1,(now-start)/dur),e=1-Math.pow(1-t,3);el.textContent=t<1?counterText(meta,meta.value*e):meta.original;if(t<1)requestAnimationFrame(tick);}requestAnimationFrame(tick);
  }

  let revealObserver=null;
  function prepareReveal(root){
    if(!root)return;
    const nodes=[root,...root.querySelectorAll('.v44-reveal,.v44-primer-card,.v44-chart,.decision-card,.evidence-card,.metrics-grid article,.exec-visual-card,.chapter-visual-card')];
    nodes.forEach((el,i)=>{if(!el.classList.contains('v44-reveal'))el.classList.add('v44-reveal');el.style.setProperty('--v44-delay',Math.min(i,9)*55+'ms');if(revealObserver)revealObserver.observe(el);});
  }
  function setupReveal(){
    if(!('IntersectionObserver' in window)){document.querySelectorAll('.v44-reveal').forEach(el=>el.classList.add('is-visible'));return;}
    revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('is-visible');e.target.querySelectorAll('.value,strong').forEach(animateCounter);if(e.target.matches('.metrics-grid article'))animateCounter(e.target.querySelector('strong'));revealObserver.unobserve(e.target);}),{threshold:.16,rootMargin:'0px 0px -8% 0px'});
    prepareReveal(document.body);
    document.querySelectorAll('.v44-chart svg').forEach(svg=>{svg.querySelectorAll('rect[class^="bar-"]').forEach((r,i)=>r.style.setProperty('--bar-delay',i*90+'ms'));svg.querySelectorAll('.line-a').forEach(path=>{try{path.style.setProperty('--line-length',path.getTotalLength());}catch(_){}});});
  }

  function updateVersionLabels(){
    const title=document.querySelector('.title-block span'); if(title)title.textContent='v4.4 web-native karar ve teknik inceleme yüzeyi';
    const src=document.querySelector('.source-panel .source-tag'); if(src&&src.textContent.includes('v3.2'))src.textContent='Web Edition v4.4 · kaynak belge v3.2 + research enhancements';
    const heroLead=document.querySelector('.hero .lead'); if(heroLead)heroLead.textContent='KAYAŞ rehberinin web-native sürümü; 23 bölüm, temel konu anlatımları, yatırım kararları, kanıt kapıları, canlı grafikler ve teknik/operasyonel çözüm eşleştirmelerini tek yüzeyde sunar.';
    document.title='KAYAS Veri Merkezi | Yatırım ve Teknoloji Rehberi v4.4';
  }

  function watchReader(){
    const body=document.getElementById('readerBody'); if(!body)return;
    let busy=false;
    const obs=new MutationObserver(()=>{if(busy)return;busy=true;requestAnimationFrame(()=>{injectPrimer();prepareReveal(body);busy=false;});});
    obs.observe(body,{childList:true});
    injectPrimer();
  }

  function boot(){
    updateVersionLabels();
    injectDashboard();
    setupReveal();
    watchReader();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
