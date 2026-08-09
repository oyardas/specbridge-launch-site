(function(){
  'use strict';

  const RELEASE='v4.6 Investor Edition 2026';
  const EMAIL='admin@specbridge.co';

  const LEARNING={
    '04':{
      title:'UPS nasıl çalışır ve 50 Hz neden önemlidir?',
      intro:'UPS’in rolü yalnız enerji depolamak değildir; kritik yüke kontrollü gerilim ve frekans sağlarken şebeke kaybı ile jeneratör devreye girişi arasındaki boşluğu köprüler.',
      cards:[
        ['UPS nedir?','Şebeke bozulduğunda veya kaybolduğunda kritik IT yükünü kesintisiz besleyen güç elektroniği sistemidir.'],
        ['50 Hz ne demektir?','Türkiye’de nominal şebeke frekansı 50 Hz’dir. Bir tam AC çevrimi T = 1/f ≈ 20 ms sürer.'],
        ['UPS çıkışı neden daha kararlı?','Online UPS’te inverter kritik yüke yeni bir AC dalga üretir; giriş bozulsa bile çıkış frekansı ve dalga biçimi kontrollü tutulabilir.'],
        ['Veri merkezine etkisi','Gerilim çökmesi, kısa kesinti, transient veya frekans sapması sunucu ve ağ cihazlarında reset, hata veya veri kaybı oluşturabilir.']
      ],
      diagram:'ups'
    },
    '06':{
      title:'UPS bataryası ile BESS neden aynı yatırım değildir?',
      intro:'İki sistem de enerji depolar; ancak amaç, süre, güç elektroniği, kontrol ve ekonomik kullanım senaryoları farklıdır.',
      cards:[
        ['UPS bataryası','Kritik yük için saniye–dakika ölçeğinde ride-through sağlar ve UPS DC link’iyle doğrudan ilişkilidir.'],
        ['BESS','Dakika–saat ölçeğinde enerji esnekliği, peak shaving, renewable shifting veya bazı grid-service senaryolarını hedefleyebilir.'],
        ['Ortak konu','Batarya kimyası, BMS, yangın/thermal-runaway kontrolü, lifecycle ve replacement planı birlikte ele alınmalıdır.'],
        ['Kritik ayrım','BESS varlığı, Tier/topoloji ve islanding tasarlanmadıkça UPS veya jeneratörü otomatik olarak ikame etmez.']
      ],
      diagram:'bess'
    },
    '08':{
      title:'Soğutma zinciri ve 8°C doğal su nasıl birlikte çalışır?',
      intro:'IT gücü neredeyse tamamen ısıya dönüşür. Amaç bu ısıyı güvenilir biçimde IT alanından alıp dış ortama veya uygun doğal soğuk kaynağa taşımaktır.',
      cards:[
        ['Hava soğutma','Standart ve orta yoğunluklu rack’lerde in-row/CRAH/containment ile ısıyı havadan toplar.'],
        ['Direct-to-chip','Yüksek yoğunluklu CPU/GPU ısısını soğuk plaka ve kapalı sıvı devresiyle doğrudan toplar.'],
        ['CDU / eşanjör','IT tarafı ile facility-water tarafını hidrolik olarak ayırır; basınç, debi ve kalite sınırlarını yönetir.'],
        ['8°C doğal su','Fırsattır; fakat debi, kimya, mevsimsellik ve izin doğrulanmadan kritik kapasite olarak sayılamaz. Doğrudan IT loop’a verilmemelidir.']
      ],
      diagram:'cooling'
    },
    '09':{
      title:'Fiber ve data-center fabric nasıl çalışır?',
      intro:'Carrier erişimi, fiziksel güzergâh çeşitliliği ve iç spine-leaf fabric farklı katmanlardır; biri diğerinin yedeği değildir.',
      cards:[
        ['Carrier A/B','Gerçek çeşitlilik için bina girişleri ve güzergâhlar fiziksel olarak ayrıştırılmalıdır.'],
        ['MMR / ODF','Operatör devrelerinin demarkasyon ve cross-connect katmanıdır.'],
        ['Spine–leaf','East-west trafiği ölçeklemek için her leaf’in spine katmanına yüksek bant genişliğiyle bağlandığı fabric modelidir.'],
        ['AI fabric etkisi','GPU kümeleri düşük gecikme ve yüksek east-west throughput nedeniyle 400G/800G ve gelişen 1.6T sınıfı fiziksel yolu hızla önemli hale getirir.']
      ],
      diagram:'network'
    },
    '10':{
      title:'Cloud hizmeti fiziksel sunucudan nasıl ürünleşir?',
      intro:'Cloud, yalnız sanallaştırma değildir. Kaynak havuzu; katalog, quota, IAM, otomasyon, ölçüm ve SLA ile müşterinin tüketebileceği hizmete dönüşür.',
      cards:[
        ['Kaynak havuzu','Compute, storage ve network kapasitesi mantıksal havuzlara ayrılır.'],
        ['Orkestrasyon','Policy, workflow, image/template, lifecycle ve otomasyon kuralları kaynak tahsisini yönetir.'],
        ['Self-service','Tenant portalı veya API üzerinden talep, kota ve proje sınırları uygulanır.'],
        ['Measured service','Kullanım telemetry/metering ile izlenir; SLA, chargeback/billing ve audit için veri üretilir.']
      ],
      diagram:'cloud'
    },
    '11':{
      title:'Colocation’da müşteriye gerçekte ne satılır?',
      intro:'Rack fiziksel taşıyıcıdır; ticari ürün güvenilir güç, termal zarf, bağlantı, güvenlik, operasyon ve sözleşmeli hizmet seviyesinin bileşimidir.',
      cards:[
        ['Power','A/B besleme, contracted kW/MW, metering ve kapasite garantisi ürünün çekirdeğidir.'],
        ['Cooling','Air veya liquid cooling sınıfı ve normal/peak thermal envelope sözleşmede tanımlanmalıdır.'],
        ['Connectivity','MMR, carrier çeşitliliği, cross-connect ve internet/cloud erişimi hizmet değerini büyütür.'],
        ['Trust / SLA','Fiziksel güvenlik, NOC/remote hands, change control, incident response ve service credits birlikte güven ürününü oluşturur.']
      ],
      diagram:'colo'
    },
    '12':{
      title:'Tier, standart ve commissioning neden birlikte düşünülür?',
      intro:'Dayanıklılık bir ekipman listesi değil; topoloji, bakım senaryosu, uygulama kalitesi ve entegre testlerle kanıtlanan sistem davranışıdır.',
      cards:[
        ['Tier III','Uptime tanımında Concurrently Maintainable hedeftir; planlı bakım sırasında IT operasyonunun sürmesini amaçlar.'],
        ['Tier IV','Fault Tolerant topolojidir; tekil hata veya path interruption operasyonu etkilememelidir.'],
        ['Standartlar','TIA-942, EN/ISO/IEC aileleri tasarım, telekom, tesis ve KPI çerçeveleri sağlar.'],
        ['Commissioning','FAT → SAT → IST → ORR zinciri kurulan sistemin tasarlandığı gibi birlikte çalıştığını kanıtlar.']
      ],
      diagram:'tier'
    },
    '13':{
      title:'HCI nedir ve geleneksel 3-tier mimariyi nasıl sadeleştirir?',
      intro:'Geleneksel modelde server, storage ve SAN katmanları ayrı yönetilir. HCI, compute + software-defined storage + virtualization kaynaklarını scale-out node’larda birleştirir.',
      cards:[
        ['Geleneksel 3-tier','Network, server ve storage katmanları bağımsızdır; upgrade, zoning, backup ve yönetim arayüzleri ayrı olabilir.'],
        ['HCI node','x86 donanım + CPU/RAM + yerel diskler + hypervisor + HCI yazılım katmanı tek appliance/node içinde çalışır.'],
        ['Scale-out','Yeni node eklemek cluster compute ve storage kapasitesini birlikte büyütebilir; failure-domain ve quorum tasarımı önemlidir.'],
        ['Federation / DR','Birden fazla cluster/site merkezi yönetilebilir; replikasyon ve recovery politikaları platforma göre entegre edilebilir.']
      ],
      diagram:'hci'
    },
    '14':{
      title:'Sanallaştırma, HA ve scale-out nasıl birlikte çalışır?',
      intro:'Sanallaştırma kaynakları soyutlar; HA arıza etkisini sınırlar; scale-out ise yeni node ekleyerek kapasiteyi büyütür. Bunlar aynı kavram değildir.',
      cards:[
        ['Hypervisor','CPU, RAM, I/O ve storage kaynaklarını VM’lere paylaştırır.'],
        ['HA','Host/node arızasında workload sağlıklı node’da yeniden başlatılır veya uygun mimaride taşınır.'],
        ['Failure domain','Rack, PDU, ToR, cluster ve site sınırları metadata/policy ile doğru modellenmezse sahte yedeklilik oluşabilir.'],
        ['Scale-out','Yeni host/node kaynak havuzuna eklenir; kapasite artarken quorum, lisans ve operasyon sınırları da yönetilir.']
      ],
      diagram:'virtual'
    },
    '15':{
      title:'Backup, immutable copy ve DR arasındaki fark nedir?',
      intro:'Backup kopya üretir; recovery bu kopyanın güvenilir biçimde geri döndürülebildiğini kanıtlar; DR ise iş hizmetini alternatif ortamda tekrar çalıştırır.',
      cards:[
        ['Primary backup','Hızlı günlük restore ve operasyonel retention için kullanılır.'],
        ['Immutable / offline','Ransomware veya admin hesabı ele geçirilmesine karşı ayrı değiştirilemez/izole kopya katmanıdır.'],
        ['DR site / clean room','Ayrı failure-domain’de recovery compute, network, identity ve uygulama bağımlılıklarının çalışmasını hedefler.'],
        ['RPO / RTO','RPO kabul edilebilir veri kaybı penceresini, RTO ise hizmetin ne kadar sürede geri dönmesi gerektiğini tanımlar.']
      ],
      diagram:'backup'
    },
    '16':{
      title:'DCIM, BMS, EMS, NMS, NOC ve SOC birbirinden nasıl ayrılır?',
      intro:'Tek ekran hedefi, yerel kontrolün yerine geçmemelidir. Her katmanın source-of-truth, alarm, kimlik ve değişiklik yönetimi sınırı açık olmalıdır.',
      cards:[
        ['BMS / EMS','Cooling, electrical ve facility telemetry/control; yerel PLC/DDC/protection safety fonksiyonları bağımsız kalır.'],
        ['NMS / DCIM','Network topolojisi, asset, capacity, rack/power/cooling ilişkileri ve servis görünürlüğünü toplar.'],
        ['NOC','Availability, incident, change, capacity ve müşteri hizmet operasyonunu yürütür.'],
        ['SOC','Threat detection, SIEM, investigation, evidence ve security incident response katmanıdır.']
      ],
      diagram:'ops'
    },
    '18':{
      title:'CPU ile GPU arasındaki temel fark nedir?',
      intro:'CPU genel amaçlı ve düşük gecikmeli kontrol/seri işlerde güçlüdür; GPU çok sayıda paralel işlem birimiyle matris-vektör hesaplarını yüksek throughput ile yürütür.',
      cards:[
        ['CPU','Az sayıda daha güçlü ve karmaşık çekirdek; branch-heavy, OS, DB ve genel uygulama işlerinde esnektir.'],
        ['GPU','Çok sayıda paralel execution unit; AI training/inference, rendering ve HPC’de aynı tip işlemleri eşzamanlı yürütür.'],
        ['Neden AI için?','Neural network hesapları büyük ölçüde matris çarpımı ve paralel tensor operasyonlarından oluşur.'],
        ['Veri merkezine etkisi','GPU cluster yüksek rack kW, liquid cooling, hızlı storage ve yoğun east-west fabric ihtiyacını birlikte yükseltir.']
      ],
      diagram:'cpugpu'
    },
    '21':{
      title:'Klasik bit ile qubit neden aynı mantıkta değildir?',
      intro:'Klasik bit ölçüm anında 0 veya 1’dir. Qubit ise ölçümden önce 0 ve 1 temel durumlarının kompleks olasılık genlikleriyle tanımlanan bir süperpozisyonunda bulunabilir.',
      cards:[
        ['Klasik bit','Her anda mantıksal 0 veya 1 durumu ile hesaplanır; klasik kapılar deterministik/olasılıksal bit işlemleri yapar.'],
        ['Qubit','|ψ⟩ = α|0⟩ + β|1⟩. Ölçüm 0 veya 1 verir; olasılıklar |α|² ve |β|² ile ilişkilidir.'],
        ['Neden farklı sonuç verir?','Kuantum algoritmaları superposition, interference ve entanglement kullanarak bazı problem yapılarını klasik aramadan farklı biçimde işler.'],
        ['Bugünkü yatırım etkisi','Kuantum bilgisayar klasik sistemlerin genel ikamesi değildir. KAYAŞ için bugün daha uygulanabilir konu crypto inventory ve post-quantum cryptography / crypto-agility hazırlığıdır.']
      ],
      diagram:'quantum'
    }
  };

  function flow(nodes, cols){
    return '<div class="v46-flow" style="--cols:'+ (cols||nodes.length) +'">'+nodes.map(function(n){
      return '<div class="v46-node '+(n[2]||'')+'"><strong>'+n[0]+'</strong><span>'+n[1]+'</span></div>';
    }).join('')+'</div>';
  }

  function bars(rows){
    return '<div class="v46-bars">'+rows.map(function(r){return '<div class="v46-bar-row"><label>'+r[0]+'</label><div class="v46-track"><div class="v46-fill" style="--w:'+r[1]+'"></div></div><em>'+r[2]+'</em></div>';}).join('')+'</div>';
  }

  function waveSvg(){
    return '<svg class="v46-wave" viewBox="0 0 840 250" role="img" aria-label="50 Hz şebeke ve UPS çıkış dalga karşılaştırması">'+
      '<line class="grid" x1="38" y1="55" x2="802" y2="55"/><line class="base" x1="38" y1="125" x2="802" y2="125"/><line class="grid" x1="38" y1="195" x2="802" y2="195"/>'+
      '<text x="42" y="27" class="value">Şebeke / bozulma örneği</text><text x="515" y="27" class="value">UPS inverter çıkışı</text>'+
      '<path class="wave-bad" d="M45 125 C65 68 85 68 105 125 S145 182 165 125 S205 68 225 125 L250 125 L270 160 L288 94 L306 150 L322 109 L340 125 C360 68 380 68 400 125"/>'+
      '<path class="wave-good" d="M450 125 C470 68 490 68 510 125 S550 182 570 125 S610 68 630 125 S670 182 690 125 S730 68 750 125 S790 182 810 125"/>'+
      '<text x="42" y="225">Gerilim sag / transient / kısa kesinti</text><text x="515" y="225">Nominal 50 Hz · 1 çevrim ≈ 20 ms</text>'+
    '</svg>';
  }

  function diagram(type){
    switch(type){
      case 'ups': return '<div class="v46-split"><div class="v46-panel"><h4>Enerji akışı</h4>'+flow([
        ['Şebeke AC','Nominal 50 Hz'],['Doğrultucu','AC → DC','teal'],['DC link / Batarya','Ride-through','green'],['İnverter','DC → AC','teal'],['Kritik IT yükü','Kararlı AC','green']
      ],5)+'<div class="v46-note"><strong>Jeneratör:</strong> UPS yükü kesintisiz taşırken start eder ve gerilim/frekans stabilize olduktan sonra uzun süreli enerji kaynağı olur.</div></div><div class="v46-panel"><h4>Dalga biçimi ve frekans</h4>'+waveSvg()+'</div></div>';
      case 'bess': return '<div class="v46-split"><div class="v46-panel"><h4>UPS bataryası</h4>'+flow([['Şebeke','AC'],['UPS / DC link','Şarj + kontrol','teal'],['Batarya','Saniye–dakika','green'],['Kritik yük','Ride-through','green']],4)+'</div><div class="v46-panel"><h4>BESS</h4>'+flow([['Grid / PV','Enerji'],['PCS / inverter','AC ↔ DC','teal'],['Battery system','BMS','green'],['EMS / dispatch','Strategy','teal'],['Peak / DR','Grid service','amber']],5)+'</div></div><div style="margin-top:14px">'+bars([['UPS bataryası','28%','saniye–dakika'],['BESS','88%','dakika–saat']])+'</div>';
      case 'cooling': return flow([['IT ısısı','Air / cold plate'],['IT cooling loop','Kapalı devre','teal'],['CDU / Plate HX','Hidrolik ayrım','green'],['Facility loop','Pump / control','teal'],['Heat rejection','Chiller / dry cooler','amber']],5)+'<div class="v46-note"><strong>8°C doğal su yolu:</strong> doğal su → filtrasyon/şartlandırma → plakalı eşanjör → ayrıştırılmış kapalı ikincil devre. Doğal su IT/CDU devresine doğrudan bağlanmaz.</div><div style="margin-top:14px">'+bars([['Air cooling','25%','≈5–15 kW/rack'],['RDHx / hybrid','55%','≈15–30 kW/rack'],['Direct-to-chip','85%','30 kW+ / AI'],['Extreme density','100%','platform-specific']])+'</div>';
      case 'network': return '<div class="v46-split"><div class="v46-panel"><h4>Fiziksel carrier çeşitliliği</h4>'+flow([['Carrier A','Route A'],['MMR / ODF','Demarkasyon','teal'],['Core / Spine','Fabric','green']],3)+'<div style="height:8px"></div>'+flow([['Carrier B','Route B'],['MMR / ODF','Demarkasyon','teal'],['Core / Spine','Fabric','green']],3)+'</div><div class="v46-panel"><h4>İç data-center fabric</h4>'+flow([['Spine A/B','High capacity'],['Leaf pair','Rack access','teal'],['Compute / Storage','East-west'],['AI fabric','400/800G+','amber']],4)+'<div class="v46-note">Mantıksal EVPN/VXLAN veya AI fabric, fiziksel carrier-route çeşitliliğinin yerine geçmez.</div></div></div>';
      case 'cloud': return flow([['Physical resources','Compute / storage / network'],['Virtualization / Containers','Resource pool','teal'],['Cloud orchestration','Policy / workflow','green'],['Service catalog','IaaS / platform','teal'],['Tenant portal / API','Self-service','green'],['Metering / SLA','Billing / audit','amber']],6);
      case 'colo': return flow([['Rack / Cage','Physical allocation'],['Power','A/B + kW metering','teal'],['Cooling','Thermal class','teal'],['Connectivity','MMR / cross-connect','teal'],['Security + Ops','Access / NOC','green'],['SLA + Trust','Satılabilir hizmet','green']],6)+'<div class="v46-note"><strong>Ticari kapasite zinciri:</strong> Installed IT → Surviving Capacity → Sellable kW/MW → Contracted kW/MW → Billed Usage / Revenue.</div>';
      case 'tier': return flow([['Requirement','Tier III objective'],['Design','Topology + maintainability','teal'],['FAT / SAT','Component + site','green'],['IST','Failure / transfer scenarios','amber'],['ORR / Operations','Runbook + evidence','green']],5)+'<div class="v46-note"><strong>Claim sınırı:</strong> Tier III = Concurrently Maintainable. Bir uptime yüzdesi veya yalnız “N+1 ekipman listesi” değildir.</div>';
      case 'hci': return '<div class="v46-hci"><div class="v46-panel"><h4>Geleneksel 3-tier</h4><div class="v46-stack"><div class="v46-layer net">NETWORK</div><div class="v46-layer compute">SERVER / HYPERVISOR</div><div class="v46-layer storage">SAN SWITCH + STORAGE</div><div class="v46-layer">BACKUP / REPLICATION / ayrı yönetim araçları</div></div></div><div class="v46-hci-arrow">→</div><div class="v46-panel"><h4>HCI cluster</h4><div class="v46-nodes"><div class="v46-hci-node"><b>NODE 1</b>CPU/RAM<br>Local disks<br>Hypervisor<br>HCI SW</div><div class="v46-hci-node"><b>NODE 2</b>CPU/RAM<br>Local disks<br>Hypervisor<br>HCI SW</div><div class="v46-hci-node"><b>NODE 3</b>CPU/RAM<br>Local disks<br>Hypervisor<br>HCI SW</div></div><div class="v46-note"><strong>Scale-out:</strong> yeni node = ek compute/storage kapasitesi. Site A ↔ Site B replikasyonu ve federation tek yönetim yüzeyine bağlanabilir.</div></div></div><div class="v46-note"><strong>Kaynak notu:</strong> H3C Türkiye HCI video transcript’i geleneksel network/server/storage silo yapısından HCI appliance/federation yaklaşımına geçişi öğretici örnek olarak kullanır. Konsolidasyon veya data-reduction oranları workload ve ürün bazında doğrulanmadan KAYAŞ kabul kriteri değildir.</div>';
      case 'virtual': return flow([['Host 1','VM A / VM B'],['HA cluster','Health + quorum','teal'],['Host 2','Failover target','green'],['Scale-out','Yeni host/node','teal'],['Capacity pool','CPU/RAM/IO','green']],5)+'<div class="v46-note">HA, aynı cluster/site içindeki node arızasını yönetebilir; Availability Zone veya ayrı-site DR ile aynı şey değildir.</div>';
      case 'backup': return flow([['Production','App-consistent data'],['Primary backup','Fast restore','teal'],['Immutable / offline','Separate boundary','green'],['Remote DR / clean room','Recovery compute','amber'],['Restore / failback','Validated return','green']],5)+'<div style="margin-top:14px">'+bars([['RPO','36%','veri kaybı penceresi'],['RTO','72%','hizmete dönüş süresi']])+'</div><div class="v46-note">Bar uzunlukları kavramsaldır; gerçek RPO/RTO süreleri service tier ve müşteri SLA’sına göre belirlenir.</div>';
      case 'ops': return flow([['Sensors / PLC / devices','Telemetry + local control'],['BMS / EMS / NMS','Domain systems','teal'],['DCIM / correlation','Asset + capacity','green'],['NOC','Service operations','teal'],['SOC','Threat / evidence','amber']],5)+'<div class="v46-note">Critical controls yerel controller/protection katmanında çalışmaya devam etmelidir; üst seviye analytics arızası safety fonksiyonunu durdurmamalıdır.</div>';
      case 'cpugpu': return '<div class="v46-split"><div class="v46-panel"><h4>CPU — az sayıda güçlü çekirdek</h4><div class="v46-core-grid"><div class="v46-core cpu"></div><div class="v46-core cpu"></div><div class="v46-core cpu"></div><div class="v46-core cpu"></div></div><p>Genel amaç, branch-heavy kod, OS, veritabanı, orchestration ve düşük gecikmeli kontrol işleri.</p></div><div class="v46-panel"><h4>GPU — yüksek paralellik</h4><div class="v46-core-grid">'+Array.from({length:16}).map(function(){return '<div class="v46-core gpu"></div>';}).join('')+'</div><p>Binlerce paralel operasyon; tensor/matris hesapları, AI training/inference, rendering ve HPC.</p></div></div><div style="margin-top:14px">'+bars([['CPU paralellik','30%','düşük-orta'],['GPU paralellik','96%','çok yüksek'],['GPU rack etkisi','88%','güç + cooling + fabric']])+'</div>';
      case 'quantum': return '<div class="v46-bit-row"><div class="v46-bitbox"><h4>Klasik bit</h4><div class="v46-bits"><span class="v46-bit">0</span><span class="v46-bit">1</span></div><p>Temel durum iki mantıksal değerden biridir: 0 veya 1.</p></div><div class="v46-vs">VS</div><div class="v46-bitbox"><h4>Qubit</h4><div class="v46-qubit"><b class="q1">|1⟩</b><b class="q0">|0⟩</b><i></i></div><p>|ψ⟩ = α|0⟩ + β|1⟩; ölçüm 0 veya 1 üretir, fakat ölçüm öncesi durum süperpozisyon genlikleriyle tanımlanır.</p></div></div><div class="v46-note"><strong>Etkisi:</strong> Quantum advantage “aynı anda tüm cevapları ücretsiz hesaplamak” değildir. Fayda, belirli algoritmalarda superposition + interference + entanglement yapısının doğru problemi farklı bir hesaplama uzayında işlemesinden doğar. Bugün KAYAŞ için pratik yatırım konusu on-prem quantum değil, PQC/crypto-agility hazırlığıdır.</div>';
      default:return '';
    }
  }

  function currentId(){
    const kicker=document.getElementById('readerKicker');
    const t=(kicker&&kicker.textContent||'').toUpperCase();
    const m=t.match(/(?:BÖLÜM|BOLUM)\s*(\d{1,2})/);
    if(m)return m[1].padStart(2,'0');
    const navActive=document.querySelector('.chapter-nav .is-active,[aria-current="true"]');
    if(navActive){
      const mm=(navActive.textContent||'').match(/\b(\d{1,2})\b/);
      if(mm)return mm[1].padStart(2,'0');
    }
    return null;
  }

  function renderLearning(){
    const id=currentId();
    const holder=document.getElementById('v46LearningPanel');
    if(!holder)return;
    const item=LEARNING[id];
    if(!item){holder.hidden=true;holder.innerHTML='';return;}
    holder.hidden=false;
    holder.innerHTML='<section class="v46-learning">'+
      '<div class="v46-learning-head"><div><p class="eyebrow">TEMEL KAVRAMI GÖRSELLE ANLA</p><h3>'+item.title+'</h3><p>'+item.intro+'</p></div><span class="v46-status">ÖĞRETİCİ / VENDOR-NEUTRAL</span></div>'+
      '<div class="v46-explain-grid">'+item.cards.map(function(c){return '<article class="v46-explain-card"><b>'+c[0]+'</b><p>'+c[1]+'</p></article>';}).join('')+'</div>'+
      '<div class="v46-diagram-wrap"><div class="v46-diagram-title"><b>Basit çalışma mantığı</b><span>Konsept diyagram · nihai SLD/P&ID değildir</span></div><div class="v46-diagram">'+diagram(item.diagram)+'</div></div>'+
      '</section>';
  }

  function patchBranding(){
    document.title='KAYAŞ Veri Merkezi Yatırım Stratejisi ve Teknoloji Yol Haritası | Investor Edition 2026';
    const titleBlock=document.querySelector('.title-block');
    if(titleBlock){
      const st=titleBlock.querySelector('strong'); const sp=titleBlock.querySelector('span');
      if(st)st.textContent='Yatırım Stratejisi ve Teknoloji Yol Haritası';
      if(sp)sp.textContent='Investor Edition 2026 · web-native karar ve teknoloji inceleme yüzeyi';
    }
    const hero=document.querySelector('.hero-copy');
    if(hero){
      const eyebrow=hero.querySelector('.eyebrow'); if(eyebrow)eyebrow.textContent='KAYAŞ VERİ MERKEZİ · INVESTOR EDITION 2026';
      const h1=hero.querySelector('h1'); if(h1)h1.textContent='Yatırım Stratejisi ve Teknoloji Yol Haritası';
      const lead=hero.querySelector('.lead'); if(lead)lead.textContent='Yatırımcılar, yönetim ve teknik paydaşlar için kaynaklı, vendor-neutral, fazlı yatırım kararlarıyla teknik mimariyi aynı yüzeyde birleştiren 2026 yatırımcı sürümü.';
      if(!document.querySelector('.v46-release-strip')){
        const strip=document.createElement('div');strip.className='v46-release-strip';
        strip.innerHTML='<div><strong>'+RELEASE+'</strong><br>Canlı web sürümü · Ön fizibilite ve teknoloji stratejisi · Bağlayıcı teklif / kesin mühendislik / sertifika değildir.</div><span class="v46-chip">INVESTOR PREVIEW</span>';
        hero.appendChild(strip);
      }
    }
    const sourceHead=document.querySelector('#source-panel .section-heading');
    if(sourceHead){
      const h2=sourceHead.querySelector('h2'); if(h2)h2.textContent='Investor Edition — kontrollü yayın bilgisi';
      const tag=sourceHead.querySelector('.source-tag'); if(tag)tag.textContent=RELEASE;
    }
    const sourceGrid=document.querySelector('#source-panel .source-grid');
    if(sourceGrid)sourceGrid.style.display='none';
    const boundary=document.querySelector('#source-panel .document-boundary');
    if(boundary)boundary.innerHTML='<strong>Yayın sınırı</strong><p>Bu canlı rehber yatırım ve teknoloji kararlarını yapılandırır; bağlayıcı teklif, uygulama projesi, kesin mühendislik hesabı, kesin SLA, sertifika veya yatırım getirisi garantisi değildir. Tier III ifadesi hedeftir. Kontrollü PDF yatırımcı kopyası ayrıca dağıtılır. İletişim: <a href="mailto:'+EMAIL+'">'+EMAIL+'</a></p>';
  }

  function injectLearningHost(){
    const reader=document.getElementById('reader');
    const body=document.getElementById('readerBody');
    if(!reader||!body||document.getElementById('v46LearningPanel'))return;
    const holder=document.createElement('div');holder.id='v46LearningPanel';
    body.parentNode.insertBefore(holder,body);
    renderLearning();
  }

  function injectFooter(){
    if(document.querySelector('.v46-investor-footer'))return;
    const workspace=document.querySelector('.workspace');if(!workspace)return;
    const f=document.createElement('footer');f.className='v46-investor-footer';
    f.innerHTML='<span>KAYAŞ Veri Merkezi Yatırım Stratejisi ve Teknoloji Yol Haritası · '+RELEASE+'</span><a href="mailto:'+EMAIL+'">'+EMAIL+'</a>';
    workspace.appendChild(f);
  }

  function observeReader(){
    const kicker=document.getElementById('readerKicker');
    const title=document.getElementById('readerTitle');
    if(!kicker&&!title)return;
    const obs=new MutationObserver(function(){window.requestAnimationFrame(renderLearning);});
    if(kicker)obs.observe(kicker,{childList:true,subtree:true,characterData:true});
    if(title)obs.observe(title,{childList:true,subtree:true,characterData:true});
    document.querySelectorAll('#chapterNav button,#chapterNav a,#prevChapter,#nextChapter').forEach(function(el){el.addEventListener('click',function(){setTimeout(renderLearning,80);});});
  }

  function boot(){
    patchBranding();
    injectLearningHost();
    injectFooter();
    observeReader();
    renderLearning();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,120);});
  else setTimeout(boot,120);
})();
