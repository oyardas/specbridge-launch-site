const THREE=window.THREE;
const ROOMS=[{"id":"S-01","name":"NW Fire Stair","x":0,"z":0,"w":5,"d":7,"cat":"egress"},{"id":"C-01","name":"North Egress Strip","x":5,"z":0,"w":36,"d":3,"cat":"corridor"},{"id":"C-02","name":"North Buffer / Technical Strip","x":5,"z":3,"w":36,"d":4,"cat":"technical"},{"id":"T-01","name":"Meet-Me Room B","x":0,"z":7,"w":8,"d":10,"cat":"technical"},{"id":"O-01","name":"Carrier / Technical Support","x":0,"z":17,"w":8,"d":7,"cat":"operations"},{"id":"O-02","name":"NOC","x":0,"z":24,"w":8,"d":12,"cat":"operations"},{"id":"O-03","name":"Operators Room","x":0,"z":36,"w":8,"d":8,"cat":"operations"},{"id":"O-04","name":"Management Offices","x":0,"z":44,"w":8,"d":8,"cat":"operations"},{"id":"O-05","name":"Staff Lounge + Kitchenette","x":0,"z":52,"w":8,"d":10,"cat":"staff"},{"id":"O-06","name":"Staff WC + Locker","x":0,"z":62,"w":8,"d":8,"cat":"staff"},{"id":"O-07","name":"Store / Janitor","x":0,"z":70,"w":8,"d":7,"cat":"staff"},{"id":"C-03","name":"Operations Access Corridor","x":8,"z":7,"w":2,"d":70,"cat":"corridor"},{"id":"C-04","name":"West Observation / Service Strip","x":10,"z":7,"w":4,"d":70,"cat":"corridor"},{"id":"D-01","name":"VIP Opening Foyer / Conference Hall \u00b7 Future White-Space Reserve","x":14,"z":7,"w":27,"d":28,"cat":"future"},{"id":"C-05","name":"Cross Spine / Egress Corridor","x":14,"z":35,"w":27,"d":4,"cat":"corridor"},{"id":"D-02","name":"Phase-1 Active IC8000 Data Hall","x":14,"z":39,"w":27,"d":31,"cat":"data"},{"id":"C-06","name":"Controlled Technical Service Spine","x":14,"z":70,"w":27,"d":7,"cat":"corridor"},{"id":"T-02","name":"Meet-Me Room A","x":0,"z":77,"w":8,"d":8,"cat":"technical"},{"id":"B-01","name":"Large Meeting Room","x":0,"z":85,"w":8,"d":6,"cat":"business"},{"id":"B-02","name":"Visitor WC + Accessible WC","x":0,"z":91,"w":8,"d":5,"cat":"business"},{"id":"A-01","name":"2 Passenger Elevators","x":0,"z":96,"w":8,"d":14,"cat":"arrival"},{"id":"C-08","name":"South Visitor / Admin Corridor","x":8,"z":77,"w":2,"d":33,"cat":"corridor"},{"id":"B-03","name":"Small Meeting Room","x":10,"z":77,"w":7,"d":7,"cat":"business"},{"id":"A-02","name":"Secure Foyer / Waiting","x":10,"z":84,"w":7,"d":10,"cat":"arrival"},{"id":"A-03","name":"Access Control Vestibule","x":10,"z":94,"w":7,"d":4,"cat":"arrival"},{"id":"A-04","name":"Elevator Arrival Lobby","x":10,"z":98,"w":7,"d":8,"cat":"arrival"},{"id":"A-05","name":"Security Control Point","x":10,"z":106,"w":7,"d":4,"cat":"arrival"},{"id":"C-09","name":"Operations Access Buffer","x":17,"z":77,"w":3,"d":7,"cat":"corridor"},{"id":"S-02","name":"Mantrap / Anti-tailgating","x":17,"z":84,"w":3,"d":12,"cat":"arrival"},{"id":"C-10","name":"Pre-function / Hold","x":17,"z":96,"w":3,"d":7,"cat":"corridor"},{"id":"C-11","name":"Critical Cross Corridor","x":17,"z":103,"w":3,"d":7,"cat":"corridor"},{"id":"T-03","name":"Controlled Staging / Unpacking","x":20,"z":77,"w":7,"d":15,"cat":"logistics"},{"id":"T-04","name":"Freight Elevator + Lobby","x":20,"z":92,"w":7,"d":18,"cat":"logistics"},{"id":"C-12","name":"Technical Front Corridor","x":27,"z":77,"w":14,"d":3,"cat":"corridor"},{"id":"P-01","name":"UPS Room A","x":27,"z":80,"w":7,"d":9,"cat":"power"},{"id":"P-02","name":"UPS Room B","x":34,"z":80,"w":7,"d":9,"cat":"power"},{"id":"P-03","name":"Battery Room A","x":27,"z":89,"w":7,"d":8,"cat":"battery"},{"id":"P-04","name":"Battery Room B","x":34,"z":89,"w":7,"d":8,"cat":"battery"},{"id":"P-05","name":"Main Distribution / Bypass","x":27,"z":97,"w":14,"d":6,"cat":"power"},{"id":"P-06","name":"Aux Electrical / Riser","x":27,"z":103,"w":14,"d":7,"cat":"power"},{"id":"TR-01","name":"East 5 m Service Terrace","x":41,"z":0,"w":5,"d":110,"cat":"terrace"}];
const ROOM_MAP=Object.fromEntries(ROOMS.map(r=>[r.id,r]));
const OVERVIEW_ZONE_LIST=[
{id:'A-01',n:'01'},{id:'A-04',n:'02'},{id:'A-05',n:'03'},{id:'A-03',n:'04'},{id:'A-02',n:'05'},
{id:'B-01',n:'06'},{id:'B-02',n:'07'},{id:'B-03',n:'08'},{id:'S-02',n:'09'},{id:'C-10',n:'10'},
{id:'C-11',n:'11'},{id:'C-08',n:'12'},{id:'C-09',n:'13'},{id:'T-04',n:'14'},{id:'T-03',n:'15'},
{id:'C-12',n:'16'},{id:'P-01',n:'17'},{id:'P-02',n:'18'},{id:'P-03',n:'19'},{id:'P-04',n:'20'},
{id:'P-05',n:'21'},{id:'P-06',n:'22'},{id:'T-02',n:'23'},{id:'C-06',n:'24'},{id:'D-02',n:'25'},
{id:'C-05',n:'26'},{id:'D-01',n:'27'},{id:'C-04',n:'28'},{id:'C-03',n:'29'},{id:'O-07',n:'30'},
{id:'O-06',n:'31'},{id:'O-05',n:'32'},{id:'O-04',n:'33'},{id:'O-03',n:'34'},{id:'O-02',n:'35'},
{id:'O-01',n:'36'},{id:'T-01',n:'37'},{id:'C-02',n:'38'},{id:'C-01',n:'39'},{id:'S-01',n:'40'},{id:'TR-01',n:'41'}
];
const ZONE_DETAILS={
"A-01":{title:"Yolcu Asansörleri / Passenger Elevators",purpose:"3. katın bina köşesinde yer alan iki yolcu asansörüdür. Bu zon dış cephe sınırına dayanır; asansörlerin dış cephe tarafında devam eden oda, koridor veya başka bir hacim yoktur. Dolaşım yalnız iç tarafa, A-04 Asansör Varış Lobisi yönüne alınır.",importance:"Veri merkezi deneyimi güvenli ve kontrollü bir varışla başlar. Köşe konumunun doğru okunması, ziyaretçi akışını ve sonraki güvenlik zonlarını mimari plana uygun tutar.",why:"Yük asansöründen ayrıştırılmış yolcu erişimi güvenlik, konfor ve operasyonel disiplin için gereklidir; dış cephe sınırı görsel üretimde kesinlikle aşılmamalıdır."},
"A-04":{title:"Asansör Varış Lobisi / Elevator Arrival Lobby",purpose:"Asansörden çıkan ziyaretçinin üçüncü kattaki ilk yönlenme alanıdır. Burada dolaşım aksı, güvenlik kontrolü ve sonraki erişim adımları net biçimde okunmalıdır.",importance:"İlk izlenimi oluşturur ve ziyaretçinin yanlışlıkla teknik veya operasyon alanlarına yönelmesini önler.",why:"Asansör kapısı doğrudan güvenlik veya teknik alana açılmamalıdır; kontrollü ve okunabilir bir geçiş alanı gereklidir."},
"A-05":{title:"Güvenlik Kontrol Noktası / Security Control Point",purpose:"Ziyaretçi doğrulama, CCTV takibi, erişim izni ve istisna yönetimi için görevli güvenlik pozisyonudur.",importance:"Fiziksel güvenliğin insan tarafından yönetilen ilk kontrol katmanıdır ve otomatik kartlı geçiş sistemini tamamlar.",why:"Sadece kart okuyucu yeterli değildir; ziyaretçi, teslimat ve olağan dışı durumlar için operatör kontrollü bir nokta gerekir."},
"A-03":{title:"Erişim Kontrol Vestibülü / Access Control Vestibule",purpose:"Secure Foyer öncesinde kartlı geçiş, turnike veya kontrollü kapıların bulunduğu ara güvenlik hacmidir.",importance:"Kamusal/ziyaretçi tarafı ile kontrollü veri merkezi tarafı arasında net bir güvenlik sınırı oluşturur.",why:"Yetkisiz geçiş, tailgating ve kontrolsüz insan akışını azaltmak için fiziksel bir tampon zon gerekir."},
"A-02":{title:"Secure Foyer / Bekleme Alanı",purpose:"Güvenlik kontrolünden geçmiş yatırımcı, müşteri ve ziyaretçilerin toplantı veya yönlendirme öncesinde beklediği premium karşılama alanıdır.",importance:"Teknik tesisin kurumsal yüzünü oluşturur; ziyaretçiyi operasyon alanlarından ayırırken profesyonel müşteri deneyimi sağlar.",why:"Toplantı odası veya NOC önünde koridorda bekleme yapılmaması; ziyaretçinin güvenli ve konforlu bir alanda tutulması gerekir."},
"B-01":{title:"Büyük Toplantı Odası / Large Meeting Room",purpose:"Yatırımcı sunumları, müşteri görüşmeleri, teknik karar toplantıları ve yönetim oturumları için ana boardroom’dur.",importance:"KAYAS’ın yalnız teknik tesis değil, müşteri ve hizmet platformu olduğunu gösterecek temel ticari alanlardan biridir.",why:"Büyük toplantıların NOC veya operasyon alanlarını kesintiye uğratmadan yapılabilmesi için ayrı ve akustik olarak kontrollü alan gerekir."},
"B-02":{title:"Ziyaretçi WC + Erişilebilir WC",purpose:"Foyer ve toplantı alanlarına yakın konumlanan ziyaretçi WC ve erişilebilir WC fonksiyonudur.",importance:"Ziyaretçi rotasının teknik/personel alanlarına girmeden kendi içinde tamamlanmasını sağlar.",why:"Misafirlerin personel veya teknik servis zonlarına yönelmesini önlemek ve erişilebilirlik gereksinimlerini karşılamak için gereklidir."},
"B-03":{title:"Küçük Toplantı / Huddle Room",purpose:"4–6 kişilik kısa toplantılar, teknik alt oturumlar ve paralel müşteri görüşmeleri için küçük toplantı odasıdır.",importance:"Büyük boardroom’u gereksiz yere işgal etmeden hızlı teknik/ticari görüşmelere alan sağlar.",why:"Aynı anda birden fazla görüşme yapılabilmesi ve küçük ekiplerin operasyon alanlarını kullanmaması için gereklidir."},
"S-02":{title:"Mantrap / Anti-tailgating",purpose:"İki kapılı interlock mantığıyla çalışan yüksek güvenlikli geçiş alanıdır. Bir kapı kapanmadan diğerinin açılmaması hedeflenir.",importance:"Veri merkezi kritik zonlarına fiziksel erişimde en güçlü güvenlik katmanlarından biridir.",why:"Kart paylaşımı, tailgating ve kontrolsüz toplu geçiş riskini azaltmak için tek kapılı geçişten daha güvenli bir ara hacim gerekir."},
"C-10":{title:"Pre-function / Hold",purpose:"Mantrap veya kontrollü erişim öncesinde kısa süreli bekleme, grup düzenleme ve yönlendirme için kullanılan ara alandır.",importance:"Ziyaretçi grubunun güvenlik kapılarında yığılmasını önler ve erişim sıralamasını düzenler.",why:"Birden fazla ziyaretçi geldiğinde mantrap kapasitesini aşmadan akışı yönetebilmek için tampon alan gerekir."},
"C-11":{title:"Kritik Enine Koridor / Critical Cross Corridor",purpose:"Güvenlik, operasyon ve teknik zonlar arasında kontrollü yatay bağlantı sağlayan koridordur.",importance:"Farklı fonksiyonların birbirine kontrollü şekilde bağlanmasını ve alternatif hareket rotası oluşmasını sağlar.",why:"Tek bir lineer koridora bağımlılığı azaltmak ve güvenli iç dolaşımı sağlamak için enine bağlantı gerekir."},
"C-08":{title:"Güney Ziyaretçi / İdari Koridoru",purpose:"Arrival, foyer, meeting ve destek alanlarını birbirine bağlayan ana ziyaretçi/idari dolaşım hattıdır.",importance:"Ziyaretçi rotasını teknik servis trafiğinden ayırır ve sunum akışını daha temiz hale getirir.",why:"Müşteri hareketi ile ekipman/personel hareketinin aynı koridoru paylaşmaması güvenlik ve deneyim açısından önemlidir."},
"C-09":{title:"Operasyon Erişim Tamponu",purpose:"Ziyaretçi alanlarından operasyon/teknik bölgelere geçişte ara güvenlik ve dolaşım tamponudur.",importance:"Farklı güvenlik seviyelerinin doğrudan birbirine açılmasını engeller.",why:"Zonlar arasında kademeli erişim ve kontrollü kapı dizilimi için tampon hacim gerekir."},
"T-04":{title:"Yük Asansörü + Lobby",purpose:"Kabinet, sunucu, UPS ekipmanı ve ağır teknik malzemenin personel/ziyaretçi trafiğinden ayrı taşındığı lojistik erişim alanıdır.",importance:"Kurulum ve bakım sırasında büyük ekipmanın güvenli biçimde teknik kata ulaştırılmasını sağlar.",why:"Ağır ekipmanın yolcu asansörleri veya ziyaretçi lobisi üzerinden taşınması güvenlik, hasar ve operasyon riski yaratır."},
"T-03":{title:"Kontrollü Staging / Unpacking",purpose:"Tesise gelen ekipmanın açıldığı, hasar kontrolünün yapıldığı, etiketlendiği ve data hall’e girmeden önce hazırlandığı alandır.",importance:"Ambalaj atığı, toz ve lojistik karmaşanın white-space’e taşınmasını engeller.",why:"Sunucu ve kabinet ekipmanı doğrudan data hall içinde unpack edilmemeli; kontrollü staging operasyonel kaliteyi yükseltir."},
"C-12":{title:"Teknik Ön Koridor",purpose:"UPS, batarya ve elektrik odalarının önünde bakım ve personel erişimini sağlayan servis koridorudur.",importance:"Güç altyapısına müdahale sırasında data hall veya ziyaretçi akışını etkilemeden erişim sağlar.",why:"Elektrik odalarının doğrudan ana koridora açılması yerine kontrollü bir teknik servis bandı gerekir."},
"P-01":{title:"UPS Room A",purpose:"IT yükünün A güç yolunu destekleyen UPS sistemleri için ayrılan odadır. Mevcut model konsept seviyesindedir.",importance:"Kesintisiz enerji sürekliliğinin ve 2N hedefinin bir ayağını oluşturur.",why:"Şebeke kesintileri ve jeneratör geçişleri sırasında kritik IT yükünün enerjisiz kalmaması için UPS gereklidir."},
"P-02":{title:"UPS Room B",purpose:"IT yükünün B güç yolunu destekleyen ikinci UPS odasıdır. A tarafından fiziksel ve fonksiyonel ayrım hedeflenir.",importance:"Tek hata noktasını azaltır ve A yolundaki bakım/arızada alternatif güç yolunu korur.",why:"2N veya yüksek yedeklilik hedefinde iki bağımsız güç yolu için ayrı UPS zonu gerekir."},
"P-03":{title:"Battery Room A",purpose:"UPS-A için enerji depolama/batarya sistemlerinin güvenli şekilde konumlandığı odadır.",importance:"UPS’in kısa süreli enerji sürekliliğini sağlar ve jeneratör devreye girene kadar köprü görevi görür.",why:"Bataryaların ısı, yangın, bakım ve güvenlik gereksinimleri nedeniyle kontrollü ayrı hacimde tutulması gerekir."},
"P-04":{title:"Battery Room B",purpose:"UPS-B tarafının bağımsız batarya alanıdır.",importance:"A ve B güç yollarının fiziksel ayrılığını ve yedekliliğini destekler.",why:"Tek batarya odasının iki güç yolunu ortak hata alanına dönüştürmemesi için ayrı zon gerekir."},
"P-05":{title:"Ana Dağıtım / Bypass",purpose:"Ana elektrik dağıtımı, bypass ve ilgili switchgear fonksiyonlarının toplandığı teknik alandır.",importance:"Tesisin kritik elektrik topolojisinin dağıtım ve bakım merkezidir.",why:"Planlı bakım, arıza izolasyonu ve bypass operasyonlarının güvenli yapılabilmesi için özel elektrik odası gerekir."},
"P-06":{title:"Yardımcı Elektrik / Riser",purpose:"Yardımcı elektrik dağıtımı, riser ve dikey besleme altyapısını destekleyen alandır.",importance:"Ana güç sistemini destekleyen yardımcı devrelerin düzenli ve erişilebilir yönetimini sağlar.",why:"Dikey dağıtım ve yardımcı beslemelerin koridorlarda dağınık kalmaması için kontrollü teknik hacim gerekir."},
"T-02":{title:"Meet-Me Room A (MMR-A)",purpose:"Carrier fiberlerinin, cross-connect’lerin ve müşteri/operatör bağlantılarının sonlandığı birinci telekom demarkasyon odasıdır.",importance:"Dış operatör altyapısı ile veri merkezi ağı arasında kontrollü ve yönetilebilir bağlantı noktası oluşturur.",why:"Carrier kablolarının doğrudan data hall’e girmemesi; demarkasyon, güvenlik ve bakım için ayrı MMR gerekir."},
"C-06":{title:"Kontrollü Teknik Servis Omurgası",purpose:"Data Hall arkasındaki uzun teknik servis koridorudur; bakım personeli ve arka-ofis teknik hareketi için ana omurga olarak çalışır.",importance:"Teknik bakımın müşteri/ziyaretçi rotasını ve ana data hall koridorlarını minimum etkilemesini sağlar.",why:"MEP, servis ve bakım hareketleri için kontrollü back-of-house dolaşımı olmazsa operasyon sırasında kritik alanlar gereksiz yere trafiğe açılır."},
"D-02":{title:"Phase-1 Active IC8000 Data Hall",purpose:"Projenin ana aktif white-space alanıdır. Güncel baseline 196 hava soğutmalı + 10 sıvı soğutmalı olmak üzere 206 IT kabineti ve 1.972 kW tasarım IT yüküdür.",importance:"KAYAS’ın gelir üreten colocation/private cloud/managed service altyapısının ana fiziksel üretim alanıdır.",why:"IT kabinetleri, soğutma, güç, ağ ve güvenlik katmanlarının kontrollü bir white-space içinde işletilmesi veri merkezinin temel işlevidir."},
"C-05":{title:"Cross Spine / Egress Corridor",purpose:"Data Hall ile Future Hall arasında yatay dolaşım ve kaçış sağlayan koridordur.",importance:"Büyük iki hacmi birbirinden ayırırken güvenli alternatif dolaşım ve egress sağlar.",why:"Yangın/kaçış ve günlük operasyon için tek uçtan girişe bağımlı olmayan enine koridor gerekir."},
"D-01":{title:"VIP Opening / Conference Hall / Future White-Space",purpose:"İlk dönemde VIP açılış, konferans, demo ve POC etkinlikleri için; ileride ise white-space genişleme rezervi olarak kullanılacak büyük esnek alandır.",importance:"Yatırımın ticari lansman, müşteri kazanımı, demo/academy ve gelecekte kapasite büyümesi hedeflerini aynı alanla destekler.",why:"İlk fazda boş rezerv alanı atıl bırakmak yerine gelir/marka yaratacak etkinlik fonksiyonuna dönüştürmek; ileride büyüme esnekliğini korumak stratejiktir."},
"C-04":{title:"Batı Gözlem / Servis Şeridi",purpose:"Data Hall’un kontrollü biçimde gözlemlenebildiği ve servis erişimi sağlayan lineer şerittir.",importance:"Müşteriye teknik alanı göstermeyi mümkün kılarken white-space’e doğrudan giriş ihtiyacını azaltır.",why:"Demo ve yatırımcı turlarında güvenliği bozmadan veri salonu görünürlüğü sağlamak için kontrollü gözlem hattı değerlidir."},
"C-03":{title:"Operasyon Erişim Koridoru",purpose:"NOC, operator room, yönetim ofisleri ve staff support alanlarını bağlayan operasyon koridorudur.",importance:"24/7 personel hareketini ziyaretçi ve teknik lojistik akışından ayırır.",why:"Operasyon personelinin vardiya boyunca güvenli ve kısa erişim rotasına ihtiyacı vardır."},
"O-07":{title:"Store / Janitor",purpose:"Temizlik ekipmanı, sarf malzemesi ve küçük operasyon destek ürünleri için depo/housekeeping alanıdır.",importance:"Kritik teknik alanların düzenli ve temiz tutulmasına destek olur.",why:"Temizlik ve sarf malzemelerinin koridorlarda veya teknik odalarda tutulmaması gerekir."},
"O-06":{title:"Staff WC + Locker",purpose:"Operasyon personelinin WC, soyunma ve kişisel eşya dolabı ihtiyacını karşılayan alandır.",importance:"Uzun vardiyalarda personelin operasyon alanından uzaklaşmadan temel ihtiyaçlarını karşılamasını sağlar.",why:"24/7 işletmede personel destek alanları olmadığı takdirde operasyonel konfor ve disiplin düşer."},
"O-05":{title:"Staff Lounge + Kitchenette",purpose:"NOC ve teknik ekiplerin vardiya arasında dinlenme, yemek ve kısa mola ihtiyacını karşılayan alandır.",importance:"Uzun süreli 24/7 operasyonlarda personel performansını ve iş sürekliliğini destekler.",why:"Mola alanının NOC içinde olmaması; çalışma alanı ile dinlenme alanının ayrılması gerekir."},
"O-04":{title:"Management Offices",purpose:"Veri merkezi operasyon/yönetim ekipleri için ofis alanıdır.",importance:"Yönetim fonksiyonunu NOC’a yakın tutarken operasyon ekranlarından ve müşteri trafiğinden ayrıştırır.",why:"Planlama, müşteri görüşmesi ve idari işlerin NOC çalışma masalarında yürütülmemesi gerekir."},
"O-03":{title:"Operators Room",purpose:"NOC ile birlikte çalışan vardiya, teknik koordinasyon ve operasyon ekiplerinin destek çalışma alanıdır.",importance:"NOC’un ekran ve alarm odaklı yapısını destekleyerek ek çalışma kapasitesi sağlar.",why:"Her operasyon faaliyeti NOC ana salonunda yapılmamalı; analiz ve koordinasyon için ayrı çalışma alanı gerekir."},
"O-02":{title:"NOC / Network Operations Center",purpose:"Ağ, sistem, çevresel alarm ve veri merkezi operasyonlarının 7/24 izlendiği kontrol merkezidir.",importance:"Tesisin Day-2 işletmesinin kalbidir; alarm, incident, kapasite ve müşteri hizmetleri görünürlüğünü merkezileştirir.",why:"Dağıtık izleme yerine tek operasyon merkezi olaylara daha hızlı müdahale, görev ayrımı ve SLA yönetimi sağlar."},
"O-01":{title:"Carrier / Technical Support",purpose:"Carrier, fiber, ağ ve teknik destek operasyonlarıyla ilişkili çalışma alanıdır.",importance:"MMR ve NOC arasında operasyonel koordinasyonu kolaylaştırır.",why:"Carrier müdahalelerinin NOC veya data hall içinde doğrudan yürütülmesi yerine destek alanında yönetilmesi daha güvenlidir."},
"T-01":{title:"Meet-Me Room B (MMR-B)",purpose:"MMR-A’dan fiziksel olarak ayrılmış ikinci carrier/fiber demarkasyon odasıdır.",importance:"Fiber giriş ve carrier bağlantılarında ortak hata riskini azaltarak gerçek yedekliliğe katkı sağlar.",why:"Tek MMR tüm operatör bağlantılarını ortak yangın, su, kablo veya fiziksel erişim riskine maruz bırakır."},
"C-02":{title:"Kuzey Buffer / Technical Strip",purpose:"Kuzey cephesinde odalar ile egress bandı arasında teknik tampon/servis şerididir.",importance:"Yangın/kaçış bandının ve teknik servis sınırının daha kontrollü ayrılmasına yardım eder.",why:"Bina kenarında doğrudan oda sonlandırmak yerine servis ve güvenlik tamponu bırakmak bakım/egress açısından avantaj sağlar."},
"C-01":{title:"Kuzey Egress Şeridi",purpose:"Kuzey tarafındaki ana kaçış ve dolaşım bandıdır.",importance:"Acil durumda güvenli çıkış rotası ve alternatif dolaşım sağlar.",why:"Büyük veri merkezi katında erişilebilir, kesintisiz ve açık bir egress rotası zorunlu tasarım girdilerindendir."},
"S-01":{title:"Kuzeybatı Yangın Merdiveni",purpose:"Acil durumda dikey tahliye için kullanılan yangın/kaçış merdivenidir.",importance:"Can güvenliğinin temel bileşenidir ve üçüncü kattaki kullanıcıların bağımsız kaçış yolunu destekler.",why:"Asansörler acil tahliyede ana kaçış yöntemi değildir; yangına dayanımlı merdiven gereklidir."},
"TR-01":{title:"Doğu 5 m Servis Terası",purpose:"Binanın doğu cephesindeki yaklaşık 5 m × 110 m kapalı servis terasıdır; louver, dış ünite ve bakım erişimi için kullanılır.",importance:"Mekanik ekipmanın servis erişimini white-space ve iç koridorlardan ayırır.",why:"Dış üniteler ve bakım faaliyetleri için erişilebilir, güvenli, hava akışını engellemeyen ayrı dış servis bandı gerekir."},
};
const CAT_LABELS={arrival:'Arrival / Security',business:'Business / Meeting',operations:'Operations',staff:'Staff Support',technical:'Technical',corridor:'Corridor / Circulation',data:'Data Hall',future:'Future Use / Event',egress:'Life Safety / Egress',terrace:'Service Terrace'};
const ZONE_ARCH_LOCKS={
  "A-01":"Bina köşe zonudur. West ve South yönleri dış bina sınırıdır; bu iki yönde devam eden oda, koridor, kapı veya açıklık oluşturulamaz. Dolaşım yalnız iç tarafa, A-04/C-08 yönüne alınır.",
  "TR-01":"Enclosed floor'un doğu sınırının dışındaki 5 m servis terasıdır; iç zonların yerine geçmez ve enclosed-floor geometrisini genişletmez."
};
function getZoneArchLock(room,id){
  if(ZONE_ARCH_LOCKS[id]) return ZONE_ARCH_LOCKS[id];
  if(!room) return 'Master numbered layout bağlayıcıdır; planda olmayan mimari eleman eklenmez.';
  const b=[];
  if(room.x===0) b.push('West side: exterior building boundary');
  if(room.z===0) b.push('North side: exterior building boundary');
  if(room.z+room.d===110) b.push('South side: exterior building boundary');
  if(room.x+room.w===41) b.push('East side: enclosed-floor / service-terrace boundary');
  const edge=b.length?b.join(' · ')+'; ':'';
  return edge+'master numbered layout is authoritative. No room, corridor, door, opening or adjacent space may be invented.';
}

// ARCHITECTURE-LOCK RULE: only individually approved, topology-faithful visuals may be mapped here.
// Rejected, batch-generated or geometry-improvised renders are intentionally excluded.
const ZONE_VISUALS={};

const zoneOverlay=document.getElementById('zoneOverlay');
const zoneInfo=document.getElementById('zoneInfo');
const zoneInfoTitle=document.getElementById('zoneInfoTitle');
const zoneInfoSub=document.getElementById('zoneInfoSub');
const zoneInfoDesc=document.getElementById('zoneInfoDesc');
const zoneInfoImportance=document.getElementById('zoneInfoImportance');
const zoneInfoWhy=document.getElementById('zoneInfoWhy');
const zoneInfoArch=document.getElementById('zoneInfoArch');
const zoneInfoMeta=document.getElementById('zoneInfoMeta');
const zoneMedia=document.getElementById('zoneMedia');
const zoneMediaImg=document.getElementById('zoneMediaImg');
const zoneMediaBadge=document.getElementById('zoneMediaBadge');
const zonePinNote=document.getElementById('zonePinNote');
const zoneMarkers=[];
let activeZoneMarker=null, zonePinnedId=null;
function zonePanelDefault(){zoneInfoTitle.textContent='Bir bölgenin üzerine gelin';zoneInfoSub.textContent='Expanded right-side zone explanation panel';zoneInfoDesc.textContent='Overview üzerindeki yarı şeffaf numaralardan birinin üzerine geldiğinizde bu panel ilgili oda veya koridorun görevini açıklar. Bir etikete tıklarsanız seçim sabitlenir; onaylanan fotogerçekçi görsel, alanın görevi, veri merkezi içindeki önemi ve neden ayrı bir zon olarak gerektiği bu daha geniş panelde birlikte gösterilir.';zoneInfoImportance.textContent='Seçilen alanın işletme, güvenlik, müşteri deneyimi veya teknik süreklilik açısından neden önemli olduğu burada açıklanacaktır.';zoneInfoWhy.textContent='Bu fonksiyonun neden ayrı bir oda/zon olarak tasarlanması gerektiği burada açıklanacaktır.';zoneInfoArch.textContent='Master numbered layout bağlayıcıdır. Planda olmayan oda, koridor, kapı veya açıklık eklenmez.';zoneInfoMeta.innerHTML='<span>41 zone</span><span>Hover + click</span><span>Expanded panel</span>';zoneMedia.classList.add('empty');zoneMedia.dataset.placeholder='Bu alan için fotogerçekçi görsel henüz eklenmedi.';zoneMediaImg.hidden=true;zoneMediaImg.removeAttribute('src');zoneMediaBadge.textContent='VISUAL PENDING';zonePinNote.innerHTML='<b>Hover:</b> önizleme · <b>Click:</b> seçimi sabitle';}
function applyZoneVisual(id){const visual=ZONE_VISUALS[id];if(visual){zoneMedia.classList.remove('empty');zoneMediaImg.src=visual;zoneMediaImg.hidden=false;zoneMediaImg.alt=`${id} zone visual`;zoneMediaBadge.textContent='APPROVED VISUAL';}else{zoneMedia.classList.add('empty');zoneMediaImg.hidden=true;zoneMediaImg.removeAttribute('src');zoneMedia.dataset.placeholder=`${id} için fotogerçekçi oda/zon görseli henüz onaylanmadı.`;zoneMediaBadge.textContent='VISUAL PENDING';}}
function zonePanelShow(id){const room=ROOM_MAP[id],detail=ZONE_DETAILS[id]||{title:room?.name||id,purpose:'Açıklama hazırlanıyor.',importance:'Açıklama hazırlanıyor.',why:'Açıklama hazırlanıyor.'},item=OVERVIEW_ZONE_LIST.find(z=>z.id===id),cat=CAT_LABELS[room?.cat]||room?.cat||'Zone';zoneInfoTitle.textContent=`${item?item.n+' · ':''}${id}`;zoneInfoSub.textContent=detail.title;zoneInfoDesc.textContent=detail.purpose;zoneInfoImportance.textContent=detail.importance;zoneInfoWhy.textContent=detail.why;zoneInfoArch.textContent=getZoneArchLock(room,id);const area=room?(room.w*room.d).toFixed(0):'—';zoneInfoMeta.innerHTML=`<span>${cat}</span><span>${room?room.w+' × '+room.d+' m':'Concept zone'}</span><span>${area} m²</span>`;applyZoneVisual(id);zonePinNote.innerHTML=zonePinnedId===id?'<b>Seçili:</b> bu zone sabitlendi · tekrar tıklayarak bırakabilirsiniz':'<b>Hover:</b> önizleme · <b>Click:</b> seçimi sabitle';}
function renderZoneState(id,kind='hover'){zoneMarkers.forEach(m=>{m.el.classList.toggle('active',kind==='hover'&&m.id===id);m.el.classList.toggle('pinned',zonePinnedId===m.id)});activeZoneMarker=id;if(id)zonePanelShow(id);else zonePanelDefault();}
function previewZone(id){if(zonePinnedId&&zonePinnedId!==id){renderZoneState(id,'hover');return}renderZoneState(id,'hover');}
function leaveZone(){if(zonePinnedId)renderZoneState(zonePinnedId,'pinned');else renderZoneState(null);}
function pinZone(id){zonePinnedId=zonePinnedId===id?null:id;if(zonePinnedId)renderZoneState(zonePinnedId,'pinned');else renderZoneState(null);}
function createZoneMarkers(){zoneOverlay.innerHTML='';zoneMarkers.length=0;for(const item of OVERVIEW_ZONE_LIST){const room=ROOM_MAP[item.id];if(!room)continue;const el=document.createElement('button');el.className='zone-tag';el.type='button';el.textContent=item.n;el.dataset.code=item.id;el.setAttribute('aria-label',`${item.n} ${item.id} ${room.name}`);el.dataset.id=item.id;el.dataset.cat=room.cat||'zone';el.addEventListener('mouseenter',()=>previewZone(item.id));el.addEventListener('mouseleave',leaveZone);el.addEventListener('click',e=>{e.stopPropagation();pinZone(item.id)});zoneOverlay.appendChild(el);zoneMarkers.push({id:item.id,room,el,offsetY:room.cat==='data'?2.2:room.cat==='future'?2.1:1.6});}zonePanelDefault();}
function setZoneOverlayVisible(on){zoneOverlay.classList.toggle('hidden',!on);zoneInfo.classList.toggle('hidden',!on);if(!on){zonePinnedId=null;renderZoneState(null);}}
function updateZoneMarkers(){if(mode!=='overview'||zoneOverlay.classList.contains('hidden'))return;const rect=canvas.getBoundingClientRect();for(const m of zoneMarkers){const r=m.room;const v=new THREE.Vector3(r.x+r.w/2,m.offsetY,r.z+r.d/2).project(camera);const visible=v.z>-1&&v.z<1&&v.x>-1.15&&v.x<1.15&&v.y>-1.15&&v.y<1.15;if(!visible){m.el.style.display='none';continue;}const sx=(v.x*.5+.5)*rect.width;const sy=(-v.y*.5+.5)*rect.height;m.el.style.display='flex';m.el.style.left=`${sx}px`;m.el.style.top=`${sy}px`;}}
createZoneMarkers();

const DOORS=[{"id":"arrival-slide","ori":"z","pos":98.0,"a":11.55,"b":15.45,"type":"slide","label":"Arrival sliding door"},{"id":"access-slide","ori":"z","pos":94.0,"a":11.55,"b":15.45,"type":"slide","label":"Access Control sliding door"},{"id":"foyer-mantrap","ori":"x","pos":17.0,"a":89.8,"b":92.2,"type":"slide","label":"Secure Foyer to Mantrap"},{"id":"mantrap-1","ori":"z","pos":92.8,"a":17.2,"b":19.8,"type":"interlock","label":"Mantrap Gate 1"},{"id":"mantrap-2","ori":"z","pos":89.3,"a":17.2,"b":19.8,"type":"interlock","label":"Mantrap Gate 2"},{"id":"mantrap-exit","ori":"z","pos":84.1,"a":17.2,"b":19.8,"type":"interlock","label":"Mantrap Exit"},{"id":"meeting-door","ori":"x","pos":8.0,"a":87.0,"b":89.2,"type":"slide","label":"Meeting Room"},{"id":"noc-door","ori":"x","pos":8.0,"a":29.0,"b":31.2,"type":"slide","label":"NOC"},{"id":"mmr-door","ori":"x","pos":8.0,"a":12.0,"b":14.2,"type":"slide","label":"Meet-Me"},{"id":"obs-door","ori":"x","pos":10.0,"a":54.0,"b":56.2,"type":"slide","label":"Observation Corridor"},{"id":"data-north","ori":"z","pos":39.0,"a":26.3,"b":28.7,"type":"slide","label":"Data Hall North"},{"id":"data-south","ori":"z","pos":70.0,"a":26.3,"b":28.7,"type":"slide","label":"Data Hall South"},{"id":"staging-freight","ori":"z","pos":92.0,"a":22.2,"b":24.8,"type":"slide","label":"Freight / Staging"},{"id":"ups-a-door","ori":"z","pos":80.0,"a":29.2,"b":31.6,"type":"slide","label":"UPS A"},{"id":"ups-b-door","ori":"z","pos":80.0,"a":36.2,"b":38.6,"type":"slide","label":"UPS B"},{"id":"vip-door","ori":"z","pos":35.0,"a":25.3,"b":29.7,"type":"slide","label":"VIP / Future Hall"},{"id":"terrace-cross","ori":"x","pos":41.0,"a":36.0,"b":38.2,"type":"slide","label":"East Terrace North Access"},{"id":"terrace-spine","ori":"x","pos":41.0,"a":72.2,"b":74.6,"type":"slide","label":"East Terrace Service Access"}];
const PODS=[{"id":"P01","x":20.7,"z":42.3,"w":6.0,"d":3.6,"rowA":10,"rowB":10},{"id":"P02","x":28.3,"z":42.3,"w":6.0,"d":3.6,"rowA":10,"rowB":10},{"id":"P03","x":20.7,"z":47.5,"w":6.0,"d":3.6,"rowA":10,"rowB":10},{"id":"P04","x":28.3,"z":47.5,"w":6.0,"d":3.6,"rowA":10,"rowB":10},{"id":"P05","x":20.7,"z":52.7,"w":6.0,"d":3.6,"rowA":10,"rowB":10},{"id":"P06","x":28.3,"z":52.7,"w":6.0,"d":3.6,"rowA":10,"rowB":10},{"id":"P07","x":20.7,"z":57.9,"w":6.0,"d":3.6,"rowA":10,"rowB":9},{"id":"P08","x":28.3,"z":57.9,"w":6.0,"d":3.6,"rowA":9,"rowB":10},{"id":"P09","x":20.7,"z":63.1,"w":6.0,"d":3.6,"rowA":10,"rowB":9},{"id":"P10","x":28.3,"z":63.1,"w":6.0,"d":3.6,"rowA":9,"rowB":10}];
const BASELINE=Object.freeze({itCabinets:206,air:196,liquid:10,itLoadKw:1972});
const DATA={mode:'PROCEDURAL_ARCH_LOCK'};

const canvas=document.getElementById('gl');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(1.0,devicePixelRatio||1));
renderer.setSize(innerWidth,innerHeight,false);
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.10;
renderer.shadowMap.enabled=false;
const scene=new THREE.Scene();scene.background=new THREE.Color(0xb9c7d0);
const camera=new THREE.PerspectiveCamera(61,innerWidth/innerHeight,.05,190);
scene.add(new THREE.HemisphereLight(0xf8fbff,0x31404a,1.72));
const sun=new THREE.DirectionalLight(0xffffff,2.35);sun.position.set(24,34,94);sun.castShadow=false;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-50;sun.shadow.camera.right=50;sun.shadow.camera.top=75;sun.shadow.camera.bottom=-75;sun.shadow.camera.near=1;sun.shadow.camera.far=110;scene.add(sun);
const coolFill=new THREE.DirectionalLight(0xc5e9ff,.65);coolFill.position.set(-20,12,20);scene.add(coolFill);
const warmFill=new THREE.DirectionalLight(0xfff1dc,.32);warmFill.position.set(18,10,108);scene.add(warmFill);

function makeCanvasTexture(kind){
 const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');
 const rnd=(a,b)=>a+Math.random()*(b-a);
 const dot=(px,py,r,a)=>{x.fillStyle=`rgba(255,255,255,${a})`;x.beginPath();x.arc(px,py,r,0,Math.PI*2);x.fill()};
 if(kind==='visitorFloor'){
   const g=x.createLinearGradient(0,0,512,512);g.addColorStop(0,'#cbc5bc');g.addColorStop(.55,'#b8b1a8');g.addColorStop(1,'#d5d0c7');x.fillStyle=g;x.fillRect(0,0,512,512);
   for(let i=0;i<2600;i++){const v=180+rnd(-18,18);x.fillStyle=`rgba(${v},${v-4},${v-8},.055)`;x.fillRect(rnd(0,512),rnd(0,512),rnd(.5,1.8),rnd(.5,1.8))}
   x.strokeStyle='rgba(92,92,88,.22)';x.lineWidth=3;for(let p=0;p<=512;p+=128){x.beginPath();x.moveTo(p,0);x.lineTo(p,512);x.stroke();x.beginPath();x.moveTo(0,p);x.lineTo(512,p);x.stroke()}
   x.strokeStyle='rgba(255,255,255,.08)';x.lineWidth=1.2;for(let i=0;i<18;i++){x.beginPath();let sx=rnd(0,512),sy=rnd(0,512);x.moveTo(sx,sy);for(let k=0;k<4;k++){sx+=rnd(-70,70);sy+=rnd(-70,70);x.lineTo(sx,sy)}x.stroke()}
 }else if(kind==='techFloor'){
   x.fillStyle='#aeb7bc';x.fillRect(0,0,512,512);
   for(let yy=0;yy<512;yy+=64){for(let xx=0;xx<512;xx+=64){x.fillStyle=((xx+yy)/64)%2===0?'rgba(214,220,223,.34)':'rgba(112,122,128,.16)';x.fillRect(xx+2,yy+2,60,60);x.strokeStyle='rgba(74,84,90,.48)';x.lineWidth=2;x.strokeRect(xx+1,yy+1,62,62);for(const ox of [8,56])for(const oy of [8,56]){x.fillStyle='rgba(82,90,96,.55)';x.beginPath();x.arc(xx+ox,yy+oy,2.2,0,Math.PI*2);x.fill()}}}
   for(let i=0;i<1300;i++){x.fillStyle='rgba(50,60,65,.04)';x.fillRect(rnd(0,512),rnd(0,512),1,1)}
 }else if(kind==='wall'){
   const g=x.createLinearGradient(0,0,0,512);g.addColorStop(0,'#ece8e1');g.addColorStop(1,'#d9d3c9');x.fillStyle=g;x.fillRect(0,0,512,512);
   for(let i=0;i<4200;i++){const a=rnd(.010,.026);const grey=205+rnd(-18,12);x.fillStyle=`rgba(${grey},${grey-2},${grey-3},${a})`;x.fillRect(rnd(0,512),rnd(0,512),rnd(.8,2.3),rnd(.8,2.3))}
   x.fillStyle='rgba(120,110,98,.055)';for(let i=0;i<16;i++)x.fillRect(rnd(0,512),0,rnd(12,32),512);
 }else if(kind==='wallTech'){
   const g=x.createLinearGradient(0,0,0,512);g.addColorStop(0,'#dce1e3');g.addColorStop(1,'#c6ced2');x.fillStyle=g;x.fillRect(0,0,512,512);
   x.strokeStyle='rgba(88,96,102,.18)';x.lineWidth=2;for(let p=0;p<=512;p+=96){x.beginPath();x.moveTo(0,p);x.lineTo(512,p);x.stroke()}
   for(let i=0;i<2600;i++){x.fillStyle='rgba(82,90,96,.022)';x.fillRect(rnd(0,512),rnd(0,512),1.2,1.2)}
 }else if(kind==='ceiling'){
   x.fillStyle='#efeee8';x.fillRect(0,0,512,512);x.strokeStyle='rgba(98,102,104,.16)';x.lineWidth=1.2;for(let p=0;p<=512;p+=128){x.beginPath();x.moveTo(p,0);x.lineTo(p,512);x.stroke();x.beginPath();x.moveTo(0,p);x.lineTo(512,p);x.stroke()} for(let i=0;i<1000;i++){x.fillStyle='rgba(120,120,118,.018)';x.fillRect(rnd(0,512),rnd(0,512),1,1)}
 }else if(kind==='ceilingTech'){
   x.fillStyle='#d3d9dc';x.fillRect(0,0,512,512);x.strokeStyle='rgba(76,84,88,.20)';x.lineWidth=1.2;for(let p=0;p<=512;p+=96){x.beginPath();x.moveTo(p,0);x.lineTo(p,512);x.stroke();x.beginPath();x.moveTo(0,p);x.lineTo(512,p);x.stroke()} x.fillStyle='rgba(255,255,255,.06)';for(let p=22;p<512;p+=96)x.fillRect(0,p,512,10)
 }else if(kind==='wood'){
   const g=x.createLinearGradient(0,0,512,0);g.addColorStop(0,'#6f5240');g.addColorStop(.5,'#866450');g.addColorStop(1,'#5b4336');x.fillStyle=g;x.fillRect(0,0,512,512);
   for(let y=0;y<512;y+=6){x.strokeStyle=`rgba(${90+rnd(-12,18)},${62+rnd(-10,10)},${40+rnd(-8,8)},.28)`;x.lineWidth=rnd(.6,1.4);x.beginPath();x.moveTo(0,y+rnd(-2,2));for(let xx=0;xx<=512;xx+=64)x.lineTo(xx,y+rnd(-3,3));x.stroke()}
 }else if(kind==='fabricLight'){
   x.fillStyle='#c8c1b8';x.fillRect(0,0,512,512);for(let p=0;p<512;p+=8){x.fillStyle='rgba(255,255,255,.035)';x.fillRect(p,0,2,512);x.fillStyle='rgba(80,82,84,.026)';x.fillRect(0,p,512,2)}
 }else if(kind==='fabricDark'){
   x.fillStyle='#4a5660';x.fillRect(0,0,512,512);for(let p=0;p<512;p+=8){x.fillStyle='rgba(255,255,255,.025)';x.fillRect(p,0,2,512);x.fillStyle='rgba(10,16,20,.05)';x.fillRect(0,p,512,2)}
 }else if(kind==='brushed'){
   const g=x.createLinearGradient(0,0,512,0);g.addColorStop(0,'#59666f');g.addColorStop(.5,'#77858e');g.addColorStop(1,'#52606a');x.fillStyle=g;x.fillRect(0,0,512,512);for(let i=0;i<4000;i++){x.fillStyle='rgba(255,255,255,.028)';x.fillRect(rnd(0,512),rnd(0,512),rnd(8,40),1)}
 }
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;return t;
}
const TEX={visitor:makeCanvasTexture('visitorFloor'),tech:makeCanvasTexture('techFloor'),wall:makeCanvasTexture('wall'),wallTech:makeCanvasTexture('wallTech'),ceiling:makeCanvasTexture('ceiling'),ceilingTech:makeCanvasTexture('ceilingTech'),wood:makeCanvasTexture('wood'),fabricLight:makeCanvasTexture('fabricLight'),fabricDark:makeCanvasTexture('fabricDark'),brushed:makeCanvasTexture('brushed')};
const MAT={
 wall:new THREE.MeshStandardMaterial({color:0xf3efe8,map:TEX.wall,roughness:.89,metalness:0}),
 wallTech:new THREE.MeshStandardMaterial({color:0xd8dde0,map:TEX.wallTech,roughness:.78,metalness:.03}),
 glass:new THREE.MeshPhysicalMaterial({color:0xb8d7e3,roughness:.08,metalness:.02,transparent:true,opacity:.32,transmission:.28,thickness:.02,side:THREE.DoubleSide}),
 frame:new THREE.MeshStandardMaterial({color:0x414c53,map:TEX.brushed,roughness:.36,metalness:.78}),
 ceiling:new THREE.MeshStandardMaterial({color:0xf1efe9,map:TEX.ceiling,roughness:.94}),
 ceilingTech:new THREE.MeshStandardMaterial({color:0xd6dde0,map:TEX.ceilingTech,roughness:.88,metalness:.03}),
 metal:new THREE.MeshStandardMaterial({color:0x69757d,map:TEX.brushed,roughness:.34,metalness:.82}),
 dark:new THREE.MeshStandardMaterial({color:0x2b3339,roughness:.68,metalness:.16}),
 wood:new THREE.MeshStandardMaterial({color:0x765744,map:TEX.wood,roughness:.70,metalness:.02}),
 upholstery:new THREE.MeshStandardMaterial({color:0xc5beb4,map:TEX.fabricLight,roughness:.97}),
 upholsteryDark:new THREE.MeshStandardMaterial({color:0x4b5862,map:TEX.fabricDark,roughness:.95}),
 screen:new THREE.MeshStandardMaterial({color:0x0d1820,emissive:0x4ba2d4,emissiveIntensity:.72,roughness:.20,metalness:.08}),
 accent:new THREE.MeshStandardMaterial({color:0x235f7b,roughness:.48,metalness:.24}),
 blue:new THREE.MeshStandardMaterial({color:0x2d7092,roughness:.42,metalness:.46,emissive:0x14394e,emissiveIntensity:.15}),
 red:new THREE.MeshStandardMaterial({color:0xc92830,roughness:.52,metalness:.16})
};

function categoryFloorMat(r){const tech=['data','technical','power','battery','logistics','corridor','egress'].includes(r.cat);const map=(tech?TEX.tech:TEX.visitor).clone();map.needsUpdate=true;map.repeat.set(Math.max(1,r.w/(tech?.62:1.35)),Math.max(1,r.d/(tech?.62:1.35)));return new THREE.MeshStandardMaterial({color:tech?0xd6dde0:0xd8d1c7,map,roughness:tech?.64:.52,metalness:tech?.08:.04});}
function ceilingHeight(r){if(r.id==='D-02')return 4.25;if(r.cat==='data')return 4.25;if(r.cat==='future')return 3.9;if(['technical','power','battery','logistics'].includes(r.cat))return 3.65;return 3.20;}

const architecture=new THREE.Group();scene.add(architecture);
const ceilings=new THREE.Group();ceilings.name='REV16_CEILINGS';architecture.add(ceilings);
const overviewHide=[];
const collision=[];
for(const r of ROOMS){
 if(r.cat==='terrace')continue;
 const floor=new THREE.Mesh(new THREE.BoxGeometry(r.w,.08,r.d),categoryFloorMat(r));floor.position.set(r.x+r.w/2,.01,r.z+r.d/2);floor.receiveShadow=true;architecture.add(floor);
 const ch=ceilingHeight(r);const ceil=new THREE.Mesh(new THREE.BoxGeometry(r.w,.07,r.d),['data','technical','power','battery','logistics'].includes(r.cat)?MAT.ceilingTech:MAT.ceiling);ceil.position.set(r.x+r.w/2,ch,r.z+r.d/2);ceil.receiveShadow=true;ceil.userData.room=r.id;ceilings.add(ceil);
}

// Build a single non-duplicated wall network by unioning collinear room boundaries.
function collectEdges(){const V=new Map(),H=new Map();function add(map,k,a,b){const arr=map.get(k)||[];arr.push([Math.min(a,b),Math.max(a,b)]);map.set(k,arr)}for(const r of ROOMS){if(r.cat==='terrace')continue;add(V,r.x,r.z,r.z+r.d);add(V,r.x+r.w,r.z,r.z+r.d);add(H,r.z,r.x,r.x+r.w);add(H,r.z+r.d,r.x,r.x+r.w)}return {V,H}}
function unionIntervals(arr){arr=arr.sort((a,b)=>a[0]-b[0]);const out=[];for(const it of arr){if(!out.length||it[0]>out[out.length-1][1]+.001)out.push([...it]);else out[out.length-1][1]=Math.max(out[out.length-1][1],it[1])}return out}
function subtractOpenings(a,b,opens){let segs=[[a,b]];for(const o of opens){const next=[];for(const [s,e] of segs){if(o[1]<=s||o[0]>=e)next.push([s,e]);else{if(o[0]>s+.02)next.push([s,Math.max(s,o[0])]);if(o[1]<e-.02)next.push([Math.min(e,o[1]),e])}}segs=next}return segs.filter(x=>x[1]-x[0]>.12)}
function doorOpenings(ori,pos){return DOORS.filter(d=>d.ori===ori&&Math.abs(d.pos-pos)<.02).map(d=>[d.a-.03,d.b+.03])}
function wallBox(ori,pos,a,b,glass=false,height=3.35){const len=b-a,th=.14;const g=ori==='x'?new THREE.BoxGeometry(th,height,len):new THREE.BoxGeometry(len,height,th);const m=glass?MAT.glass:MAT.wall;const mesh=new THREE.Mesh(g,m);mesh.position.set(ori==='x'?pos:(a+b)/2,height/2,ori==='x'?(a+b)/2:pos);mesh.castShadow=!glass;mesh.receiveShadow=!glass;architecture.add(mesh);if(!glass)collision.push({minx:mesh.position.x-(ori==='x'?th/2:len/2),maxx:mesh.position.x+(ori==='x'?th/2:len/2),minz:mesh.position.z-(ori==='x'?len/2:th/2),maxz:mesh.position.z+(ori==='x'?len/2:th/2)});return mesh}
const edges=collectEdges();
for(const [xs,arr] of edges.V){const x=+xs;for(const [a,b] of unionIntervals(arr)){const opens=doorOpenings('x',x);for(const [s,e] of subtractOpenings(a,b,opens)){const glass=Math.abs(x-14)<.02 && e>7 && s<70;wallBox('x',x,s,e,glass,glass?3.05:3.40)}}}
for(const [zs,arr] of edges.H){const z=+zs;for(const [a,b] of unionIntervals(arr)){const opens=doorOpenings('z',z);for(const [s,e] of subtractOpenings(a,b,opens)){wallBox('z',z,s,e,false,3.40)}}}

// Upper shell around the data hall to reach the 4.25 m technical ceiling.
const dr=ROOMS.find(r=>r.id==='D-02');
function upperWall(ori,pos,a,b){const len=b-a,g=ori==='x'?new THREE.BoxGeometry(.14,.85,len):new THREE.BoxGeometry(len,.85,.14);const m=new THREE.Mesh(g,MAT.wallTech);m.position.set(ori==='x'?pos:(a+b)/2,3.825,ori==='x'?(a+b)/2:pos);architecture.add(m)}
upperWall('z',dr.z,dr.x,dr.x+dr.w);upperWall('z',dr.z+dr.d,dr.x,dr.x+dr.w);upperWall('x',dr.x+dr.w,dr.z,dr.z+dr.d);

// Door frames + closed-by-default leaves. Doors open only when the viewer approaches.
const doorActors=[];
const visitorGlassDoorIds=new Set(['arrival-slide','access-slide','foyer-mantrap','mantrap-1','mantrap-2','obs-door','meeting-door','noc-door','vip-door']);
for(const d of DOORS){
 const w=d.b-d.a,h=2.45,isX=d.ori==='x',g=new THREE.Group();g.name='DOOR_'+d.id;
 const mk=(geo,x,y,z)=>{const m=new THREE.Mesh(geo,MAT.frame);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m};
 if(isX){
   mk(new THREE.BoxGeometry(.12,h,.08),d.pos,h/2,d.a);
   mk(new THREE.BoxGeometry(.12,h,.08),d.pos,h/2,d.b);
   mk(new THREE.BoxGeometry(.12,.09,w),d.pos,h,d.a+w/2);
 }else{
   mk(new THREE.BoxGeometry(.08,h,.12),d.a,h/2,d.pos);
   mk(new THREE.BoxGeometry(.08,h,.12),d.b,h/2,d.pos);
   mk(new THREE.BoxGeometry(w,.09,.12),d.a+w/2,h,d.pos);
 }
 const leafW=w*.50+.018;
 const leafMat=visitorGlassDoorIds.has(d.id)?MAT.glass:MAT.wallTech;
 let l,r,closedL,closedR,openL,openR;
 if(isX){
   const geo=new THREE.BoxGeometry(.045,h-.12,leafW);
   l=new THREE.Mesh(geo,leafMat);r=new THREE.Mesh(geo,leafMat);
   closedL=d.a+w*.25;closedR=d.b-w*.25;openL=d.a-w*.25;openR=d.b+w*.25;
   l.position.set(d.pos,h/2-.03,closedL);r.position.set(d.pos,h/2-.03,closedR);
 }else{
   const geo=new THREE.BoxGeometry(leafW,h-.12,.045);
   l=new THREE.Mesh(geo,leafMat);r=new THREE.Mesh(geo,leafMat);
   closedL=d.a+w*.25;closedR=d.b-w*.25;openL=d.a-w*.25;openR=d.b+w*.25;
   l.position.set(closedL,h/2-.03,d.pos);r.position.set(closedR,h/2-.03,d.pos);
 }
 l.castShadow=!visitorGlassDoorIds.has(d.id);r.castShadow=l.castShadow;
 l.receiveShadow=true;r.receiveShadow=true;g.add(l);g.add(r);
 // Center gasket removes the persistent visible slit while closed.
 const gasket=isX?new THREE.Mesh(new THREE.BoxGeometry(.055,h-.18,.035),MAT.frame):new THREE.Mesh(new THREE.BoxGeometry(.035,h-.18,.055),MAT.frame);
 gasket.position.set(isX?d.pos:(d.a+d.b)/2,h/2-.03,isX?(d.a+d.b)/2:d.pos);g.add(gasket);
 architecture.add(g);
 doorActors.push({d,g,l,r,gasket,isX,closedL,closedR,openL,openR,open:0});
}
function updateDoors(dt){
 let nearestInterlock=null,nearestInterlockDist=1e9;
 if(mode==='walk'){
   for(const a of doorActors){if(a.d.type!=='interlock')continue;const cx=a.isX?a.d.pos:(a.d.a+a.d.b)/2,cz=a.isX?(a.d.a+a.d.b)/2:a.d.pos,dd=Math.hypot(player.x-cx,player.z-cz);if(dd<nearestInterlockDist){nearestInterlockDist=dd;nearestInterlock=a}}
 }
 for(const a of doorActors){
   const cx=a.isX?a.d.pos:(a.d.a+a.d.b)/2,cz=a.isX?(a.d.a+a.d.b)/2:a.d.pos;
   const dist=mode==='walk'?Math.hypot(player.x-cx,player.z-cz):999;
   let desired=dist<1.75?1:0;
   if(a.d.type==='interlock' && a!==nearestInterlock)desired=0;
   const k=1-Math.exp(-dt*(desired?7.5:5.2));a.open+=(desired-a.open)*k;
   const lp=a.closedL+(a.openL-a.closedL)*a.open,rp=a.closedR+(a.openR-a.closedR)*a.open;
   if(a.isX){a.l.position.z=lp;a.r.position.z=rp}else{a.l.position.x=lp;a.r.position.x=rp}
   a.gasket.visible=a.open<.08;
 }
}

// Architectural lights: emissive strips plus a small number of real point lights.
const ledMat=new THREE.MeshStandardMaterial({color:0xf5fbff,emissive:0xe5f7ff,emissiveIntensity:2.2,roughness:.25});
function led(x,z,len=2.4,ry=0,y=3.05){const m=new THREE.Mesh(new THREE.BoxGeometry(len,.035,.07),ledMat);m.position.set(x,y,z);m.rotation.y=ry;architecture.add(m)}
for(const z of [87,89])led(4,z,4.7,0,3.02);for(const z of [87,90.5])led(13.5,z,4.8,Math.PI/2,3.02);
for(let z=42.5;z<=67;z+=4.8){led(27.5,z,7.2,0,4.05);}
const hallLight1=new THREE.PointLight(0xeaf8ff,20,28,2);hallLight1.position.set(27.5,3.85,52);scene.add(hallLight1);const hallLight2=hallLight1.clone();hallLight2.position.z=63;scene.add(hallLight2);
const foyerLight=new THREE.PointLight(0xfff2de,10,14,2);foyerLight.position.set(13.5,2.9,89);scene.add(foyerLight);const meetingLight=new THREE.PointLight(0xfff3df,10,13,2);meetingLight.position.set(4,2.8,88);scene.add(meetingLight);
const arrivalLight=new THREE.PointLight(0xfff3e4,9,14,2);arrivalLight.position.set(13.4,2.9,103.5);scene.add(arrivalLight);const nocLight=new THREE.PointLight(0xe8f2ff,8,13,2);nocLight.position.set(4.0,2.9,29.5);scene.add(nocLight);const futureLight=new THREE.PointLight(0xfff0dc,11,22,2);futureLight.position.set(27.5,3.0,20.0);scene.add(futureLight);const loungeLight=new THREE.PointLight(0xfff1de,6.5,12,2);loungeLight.position.set(4.0,2.8,56.5);scene.add(loungeLight);const officeLight=new THREE.PointLight(0xf4f7ff,6.0,12,2);officeLight.position.set(4.0,2.8,48.0);scene.add(officeLight);const powerLight=new THREE.PointLight(0xeaf5ff,7.5,18,2);powerLight.position.set(34.0,3.0,99.0);scene.add(powerLight);const terraceLight=new THREE.PointLight(0xe5f6ff,5.0,18,2);terraceLight.position.set(43.5,3.2,55.0);scene.add(terraceLight);

// East service terrace shell (concept only): floor, canopy, louver screen and upward-discharge units.
const tr=ROOMS.find(r=>r.id==='TR-01');const trFloor=new THREE.Mesh(new THREE.BoxGeometry(tr.w,.12,tr.d),new THREE.MeshStandardMaterial({color:0xa6acad,map:TEX.tech,roughness:.72,metalness:.04}));trFloor.position.set(43.5,.02,55);architecture.add(trFloor);const canopy=new THREE.Mesh(new THREE.BoxGeometry(5,.12,110),MAT.frame);canopy.position.set(43.5,3.75,55);architecture.add(canopy);overviewHide.push(canopy);
for(let z=2;z<109;z+=1.05){const blade=new THREE.Mesh(new THREE.BoxGeometry(.09,.08,.8),MAT.frame);blade.position.set(45.92,2.0,z);blade.rotation.x=.25;architecture.add(blade)}
const terraceDoorCenters=DOORS.filter(d=>d.ori==='x'&&Math.abs(d.pos-41)<.05).map(d=>(d.a+d.b)/2);
for(let z=5;z<106;z+=8){
 if(terraceDoorCenters.some(c=>Math.abs(z-c)<3.25))continue; // keep access and maintenance clearance
 const unit=new THREE.Group();unit.name='TERRACE_OUTDOOR_UNIT';
 const body=new THREE.Mesh(new THREE.BoxGeometry(1.25,1.75,1.10),MAT.wallTech);body.position.y=.875;body.castShadow=true;body.receiveShadow=true;unit.add(body);
 const top=new THREE.Mesh(new THREE.CylinderGeometry(.43,.43,.09,28),MAT.dark);top.position.y=1.81;unit.add(top);
 const grille=new THREE.Mesh(new THREE.TorusGeometry(.36,.018,8,28),MAT.frame);grille.rotation.x=Math.PI/2;grille.position.y=1.865;unit.add(grille);
 unit.position.set(42.45,.10,z);architecture.add(unit);
}

// Furniture primitives.
function roundedBox(w,h,d,r,mat){
 const rr=Math.max(.01,Math.min(r,w*.25,h*.45));
 const s=new THREE.Shape(),x0=-w/2,y0=-h/2,x1=w/2,y1=h/2;
 s.moveTo(x0+rr,y0);s.lineTo(x1-rr,y0);s.quadraticCurveTo(x1,y0,x1,y0+rr);
 s.lineTo(x1,y1-rr);s.quadraticCurveTo(x1,y1,x1-rr,y1);
 s.lineTo(x0+rr,y1);s.quadraticCurveTo(x0,y1,x0,y1-rr);
 s.lineTo(x0,y0+rr);s.quadraticCurveTo(x0,y0,x0+rr,y0);
 const g=new THREE.ExtrudeGeometry(s,{depth:d,steps:1,curveSegments:5,bevelEnabled:true,bevelSegments:2,bevelSize:Math.min(.025,rr*.22),bevelThickness:Math.min(.025,rr*.22)});
 g.translate(0,0,-d/2);g.computeVertexNormals();return new THREE.Mesh(g,mat);
}
function sofa(width=1.9,mat=MAT.upholstery){const g=new THREE.Group(),seat=roundedBox(width,.20,.78,.08,mat);seat.position.y=.43;g.add(seat);const back=roundedBox(width,.68,.14,.06,mat);back.position.set(0,.76,-.32);g.add(back);for(const sx of[-width/2+.08,width/2-.08]){const arm=roundedBox(.16,.52,.72,.055,mat);arm.position.set(sx,.56,0);g.add(arm)}for(const sx of[-width/2+.14,width/2-.14])for(const sz of[-.25,.25]){const leg=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.32,12),MAT.metal);leg.position.set(sx,.16,sz);g.add(leg)}return g}
function loungeChair(){return sofa(.82,MAT.upholsteryDark)}
function coffeeTable(w=1.05,d=.56,h=.38){const g=new THREE.Group(),top=roundedBox(w,.055,d,.055,MAT.wood);top.position.y=h;g.add(top);for(const sx of[-w/2+.08,w/2-.08])for(const sz of[-d/2+.08,d/2-.08]){const leg=new THREE.Mesh(new THREE.CylinderGeometry(.015,.015,h,10),MAT.metal);leg.position.set(sx,h/2,sz);g.add(leg)}return g}
function boardTable(){const g=new THREE.Group(),top=roundedBox(3.1,.085,1.18,.11,MAT.wood);top.position.y=.77;g.add(top);const base=roundedBox(.72,.70,.38,.055,MAT.dark);base.position.y=.35;g.add(base);return g}
function sideTable(d=.42,h=.50){const g=new THREE.Group(),top=roundedBox(d,.045,d,.05,MAT.wood);top.position.y=h;g.add(top);const stem=new THREE.Mesh(new THREE.CylinderGeometry(.028,.034,h,12),MAT.metal);stem.position.y=h/2;g.add(stem);const foot=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.02,18),MAT.dark);foot.position.y=.01;g.add(foot);return g}
function consoleUnit(w=1.45,h=.82,d=.42){const g=new THREE.Group(),body=roundedBox(w,h,d,.06,new THREE.MeshStandardMaterial({color:0xd7d1c8,roughness:.88}));body.position.y=h/2;g.add(body);const top=roundedBox(w+.02,.03,d+.02,.03,MAT.wood);top.position.y=h+.015;g.add(top);return g}
function receptionDesk(w=1.75,d=.68,h=1.03){const g=new THREE.Group(),body=roundedBox(w,h,d,.07,new THREE.MeshStandardMaterial({color:0xd8d3cb,roughness:.9}));body.position.y=h/2;g.add(body);const accent=roundedBox(w,.20,.12,.04,MAT.accent);accent.position.set(0,.70,-d/2+.07);g.add(accent);const top=roundedBox(w+.02,.035,d+.02,.035,MAT.wood);top.position.y=h+.02;g.add(top);return g}
function workDesk(w=1.55,d=.74,h=.74){const g=new THREE.Group(),top=roundedBox(w,.045,d,.05,new THREE.MeshStandardMaterial({color:0xd8d8d4,roughness:.88}));top.position.y=h;g.add(top);for(const sx of[-w/2+.10,w/2-.10])for(const sz of[-d/2+.10,d/2-.10]){const leg=new THREE.Mesh(new THREE.BoxGeometry(.045,h,.045),MAT.metal);leg.position.set(sx,h/2,sz);g.add(leg)}return g}
function lowBench(w=1.45){const g=new THREE.Group(),seat=roundedBox(w,.11,.45,.05,new THREE.MeshStandardMaterial({color:0xcfc8bf,roughness:.92}));seat.position.y=.46;g.add(seat);for(const sx of[-w/2+.12,w/2-.12])for(const sz of[-.14,.14]){const leg=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.44,10),MAT.metal);leg.position.set(sx,.22,sz);g.add(leg)}return g}
function equipmentCabinet(w=.78,d=.88,h=2.05){const g=new THREE.Group(),body=roundedBox(w,h,d,.04,new THREE.MeshStandardMaterial({color:0xc5c9cc,roughness:.72,metalness:.18}));body.position.y=h/2;g.add(body);const door=new THREE.Mesh(new THREE.BoxGeometry(w-.04,h-.08,.02),new THREE.MeshStandardMaterial({color:0xe0e3e5,roughness:.68}));door.position.set(0,h/2,.44);g.add(door);return g}
function extinguisher(){const g=new THREE.Group(),body=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.42,16),MAT.red);body.position.y=.22;g.add(body);const top=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,.08,14),MAT.dark);top.position.y=.46;g.add(top);const hose=new THREE.Mesh(new THREE.TorusGeometry(.08,.008,6,18,Math.PI),MAT.dark);hose.rotation.z=Math.PI/2;hose.position.set(.06,.42,0);g.add(hose);return g}
function ceilingPanel(w=1.2,d=.32,h=.045,glow=0xfff2db){const g=new THREE.Group();const body=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color:0xf4f1ea,roughness:.72,metalness:.06}));g.add(body);const diff=new THREE.Mesh(new THREE.BoxGeometry(w-.06,h*.55,d-.06),new THREE.MeshStandardMaterial({color:0xffffff,emissive:glow,emissiveIntensity:.86,roughness:.18}));diff.position.y=.004;g.add(diff);return g}
function lowCabinet(w=1.5,d=.42,h=.86){const g=new THREE.Group(),body=roundedBox(w,h,d,.06,new THREE.MeshStandardMaterial({color:0xd9d4cb,roughness:.88}));body.position.y=h/2;g.add(body);const top=roundedBox(w+.02,.03,d+.02,.03,MAT.wood);top.position.y=h+.02;g.add(top);return g}
function shelfUnit(w=1.1,d=.42,h=2.0){const g=new THREE.Group();for(const sx of[-w/2+.03,w/2-.03]){const post=new THREE.Mesh(new THREE.BoxGeometry(.05,h,.05),MAT.metal);post.position.set(sx,h/2,0);g.add(post)}for(const z of[-d/2+.03,d/2-.03]){const post1=new THREE.Mesh(new THREE.BoxGeometry(.05,h,.05),MAT.metal);post1.position.set(-w/2+.03,h/2,z);g.add(post1);const post2=post1.clone();post2.position.x=w/2-.03;g.add(post2)}for(const y of[.18,.72,1.26,1.80]){const sh=new THREE.Mesh(new THREE.BoxGeometry(w,.035,d),new THREE.MeshStandardMaterial({color:0xd4d7d8,roughness:.78,metalness:.06}));sh.position.y=y;g.add(sh)}return g}
function lockerBank(n=4){const g=new THREE.Group(),w=.42*n,h=1.92,d=.48;const body=roundedBox(w,h,d,.03,new THREE.MeshStandardMaterial({color:0xd1d5d8,roughness:.74,metalness:.16}));body.position.y=h/2;g.add(body);for(let i=1;i<n;i++){const div=new THREE.Mesh(new THREE.BoxGeometry(.02,h-.08,d+.01),MAT.metal);div.position.set(-w/2+i*.42,h/2,0);g.add(div)}return g}
function kitchenette(w=1.8){const g=new THREE.Group(),base=roundedBox(w,.90,.62,.05,new THREE.MeshStandardMaterial({color:0xd8d3cb,roughness:.86}));base.position.y=.45;g.add(base);const top=roundedBox(w+.02,.04,.64,.04,new THREE.MeshStandardMaterial({color:0xb7b9bb,roughness:.32,metalness:.22}));top.position.y=.92;g.add(top);const backsplash=new THREE.Mesh(new THREE.BoxGeometry(w,.42,.03),new THREE.MeshStandardMaterial({color:0xe9ecee,roughness:.78}));backsplash.position.set(0,1.12,-.29);g.add(backsplash);return g}
function crateStack(w=1.0,d=.8,h=.88){const g=new THREE.Group(),b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color:0xbea584,roughness:.84}));b.position.y=h/2;g.add(b);const band=new THREE.Mesh(new THREE.BoxGeometry(w+.02,.08,d+.02),MAT.dark);band.position.y=.18;g.add(band);const band2=band.clone();band2.position.y=h-.18;g.add(band2);return g}
function wasteBin(){const g=new THREE.Group(),b=new THREE.Mesh(new THREE.CylinderGeometry(.15,.13,.34,16),new THREE.MeshStandardMaterial({color:0x676f74,roughness:.52,metalness:.64}));b.position.y=.17;g.add(b);return g}
function screenTexture(title,sub){const c=document.createElement('canvas');c.width=1024;c.height=576;const x=c.getContext('2d');const gr=x.createLinearGradient(0,0,1024,576);gr.addColorStop(0,'#0c2a3c');gr.addColorStop(1,'#07131d');x.fillStyle=gr;x.fillRect(0,0,1024,576);x.fillStyle='#ffffff';x.font='700 62px Segoe UI';x.fillText(title,72,210);x.fillStyle='#6dd9ff';x.font='500 28px Segoe UI';x.fillText(sub,74,270);x.fillStyle='#d71920';x.fillRect(74,320,250,8);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
function wallScreen(w,h,title,sub){const g=new THREE.Group(),frame=new THREE.Mesh(new THREE.BoxGeometry(w+.08,h+.08,.055),MAT.dark);g.add(frame);const mm=MAT.screen.clone();mm.map=screenTexture(title,sub);mm.needsUpdate=true;const s=new THREE.Mesh(new THREE.BoxGeometry(w,h,.03),mm);s.position.z=.025;g.add(s);return g}
function wallArt(w,h,c1='#274c63',c2='#92795f'){const c=document.createElement('canvas');c.width=700;c.height=420;const x=c.getContext('2d');x.fillStyle='#e9e7e1';x.fillRect(0,0,700,420);x.fillStyle=c1;x.fillRect(50,50,260,320);x.fillStyle=c2;x.beginPath();x.arc(480,205,120,0,Math.PI*2);x.fill();x.strokeStyle='#273039';x.lineWidth=14;x.beginPath();x.moveTo(300,360);x.lineTo(620,70);x.stroke();const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const mat=new THREE.MeshStandardMaterial({map:t,roughness:.9});const g=new THREE.Group();const f=new THREE.Mesh(new THREE.BoxGeometry(w+.08,h+.08,.05),MAT.dark);g.add(f);const a=new THREE.Mesh(new THREE.BoxGeometry(w,h,.025),mat);a.position.z=.028;g.add(a);return g}
function clock(){const g=new THREE.Group(),face=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.035,32),new THREE.MeshStandardMaterial({color:0xf5f5f1,roughness:.95}));face.rotation.x=Math.PI/2;g.add(face);const ring=new THREE.Mesh(new THREE.TorusGeometry(.22,.018,8,32),MAT.dark);ring.rotation.x=Math.PI/2;ring.position.z=.02;g.add(ring);return g}
function place(o,x,y,z,ry=0,parent=architecture){o.position.set(x,y,z);o.rotation.y=ry;parent.add(o);return o}

// Arrival + access staging.
place(sofa(1.75),11.20,0,102.0,Math.PI/2);place(loungeChair(),14.55,0,100.8,Math.PI);place(loungeChair(),14.55,0,103.2,Math.PI);place(coffeeTable(.92,.50,.36),13.0,0,102.0);place(sideTable(),14.2,0,101.95);place(wasteBin(),16.05,0,105.55);
place(consoleUnit(1.08,.82,.36),10.35,0,104.75,Math.PI/2);place(wallArt(1.05,.64),10.10,1.72,101.8,Math.PI/2);place(clock(),10.10,2.42,99.9,Math.PI/2);place(wallScreen(1.15,.66,'KAYAS','Arrival lobby · visitor circulation'),16.88,1.72,102.0,-Math.PI/2);
place(receptionDesk(1.52,.64,1.02),13.55,0,108.15,Math.PI);place(wallScreen(1.10,.62,'KAYAS','Security control point'),16.88,1.74,108.0,-Math.PI/2);place(consoleUnit(1.0,.80,.34),10.35,0,107.2,Math.PI/2);place(lowBench(1.25),13.45,0,95.9,Math.PI);place(wallArt(1.05,.62,'#1f3a4d','#9a7d57'),10.10,1.70,95.8,Math.PI/2);
place(ceilingPanel(1.85,.34),13.55,3.02,101.7);place(ceilingPanel(1.75,.34),13.55,3.02,105.6);place(ceilingPanel(1.25,.30),13.55,3.02,108.0);

// Foyer staging — premium waiting zone.
place(sofa(1.95),11.25,0,89.0,Math.PI/2);place(loungeChair(),14.65,0,87.2,Math.PI);place(loungeChair(),14.65,0,90.0,Math.PI);place(coffeeTable(),13.05,0,88.8);place(sideTable(),14.15,0,88.85);place(consoleUnit(1.32,.82,.38),16.45,0,92.6,Math.PI/2);place(wasteBin(),16.0,0,93.55);
place(wallArt(1.35,.78),10.10,1.75,87.8,Math.PI/2);place(wallScreen(1.20,.66,'KAYAS','Secure visitor experience'),16.88,1.72,86.65,-Math.PI/2);place(clock(),10.10,2.45,91.6,Math.PI/2);
place(ceilingPanel(1.95,.34),13.55,3.02,87.8);place(ceilingPanel(1.95,.34),13.55,3.02,91.1);

// Meeting staging.
place(boardTable(),4.0,0,88.0);place(consoleUnit(1.55,.82,.40),7.55,0,85.95,-Math.PI/2);place(coffeeTable(.86,.42,.68),7.55,0,88.0,-Math.PI/2);place(lowCabinet(1.25,.38,.82),.72,0,86.0,Math.PI/2);
place(wallScreen(1.75,.98,'KAYAS','Investor briefing · digital service platform'),4.0,1.72,85.12,0);place(wallArt(1.20,.68),6.15,1.74,90.88,Math.PI);place(clock(),1.25,2.42,90.88,Math.PI);place(wasteBin(),7.15,0,90.05);
place(ceilingPanel(2.0,.36),4.0,3.02,87.2);place(ceilingPanel(2.0,.36),4.0,3.02,88.8);

// Small meeting room.
place(boardTable(),13.5,0,80.5,Math.PI/2);place(wallScreen(1.40,.80,'KAYAS','Internal workshop / huddle'),13.5,1.72,77.12,0);place(lowCabinet(1.10,.36,.80),16.45,0,79.0,Math.PI/2);place(clock(),10.15,2.40,83.1,Math.PI/2);place(ceilingPanel(1.6,.30),13.5,3.02,80.5);

// NOC staging.
place(workDesk(2.15,.82,.74),2.3,0,28.2);place(workDesk(2.15,.82,.74),2.3,0,31.8);place(workDesk(2.15,.82,.74),5.7,0,28.2);place(workDesk(2.15,.82,.74),5.7,0,31.8);
place(consoleUnit(1.40,.82,.42),7.45,0,34.0,-Math.PI/2);place(wallScreen(2.10,1.05,'KAYAS NOC','Operations · Monitoring · Alerts'),4.0,1.74,24.12,0);place(wallArt(1.10,.62,'#1b3e58','#5b86a3'),.12,1.72,33.0,Math.PI/2);place(clock(),.12,2.44,26.8,Math.PI/2);place(wasteBin(),7.15,0,25.3);
place(ceilingPanel(1.85,.30),2.1,3.07,27.3);place(ceilingPanel(1.85,.30),5.9,3.07,27.3);place(ceilingPanel(1.85,.30),2.1,3.07,32.7);place(ceilingPanel(1.85,.30),5.9,3.07,32.7);

// Operators room + management offices.
place(workDesk(1.65,.78,.74),2.3,0,39.6);place(workDesk(1.65,.78,.74),5.7,0,39.6);place(lowCabinet(1.2,.38,.82),7.3,0,42.0,-Math.PI/2);place(wallScreen(1.55,.78,'KAYAS Ops','Shift room'),4.0,1.70,36.12,0);place(ceilingPanel(1.8,.30),4.0,3.02,40.0);
place(workDesk(1.55,.74,.74),2.2,0,47.8);place(workDesk(1.55,.74,.74),5.8,0,47.8);place(consoleUnit(1.4,.82,.40),4.0,0,51.0,Math.PI);place(wallArt(1.15,.66,'#2c485c','#b58b63'),.12,1.72,48.0,Math.PI/2);place(ceilingPanel(1.8,.30),4.0,3.02,48.0);

// Staff lounge, WC/locker and store.
place(sofa(1.55),2.0,0,56.0,Math.PI/2);place(sofa(1.55),5.8,0,56.0,-Math.PI/2);place(coffeeTable(.90,.52,.35),4.0,0,56.0);place(kitchenette(1.85),4.1,0,61.4,Math.PI);place(wallScreen(1.15,.62,'KAYAS','Staff lounge / kitchenette'),4.0,1.72,52.12,0);place(ceilingPanel(1.8,.30),4.0,3.02,56.0);place(ceilingPanel(1.4,.28),4.0,3.02,60.2);
place(lockerBank(4),1.25,0,66.0,Math.PI/2);place(lockerBank(4),6.75,0,66.0,-Math.PI/2);place(ceilingPanel(1.6,.28),4.0,3.02,66.0);
place(shelfUnit(1.2,.42,1.95),1.1,0,73.0,Math.PI/2);place(shelfUnit(1.2,.42,1.95),6.9,0,73.0,-Math.PI/2);place(crateStack(.95,.70,.92),4.1,0,74.2);place(ceilingPanel(1.4,.28),4.0,3.02,73.5);

// Observation gallery / west strip.
place(lowBench(1.35),12.0,0,54.9,Math.PI/2);place(sideTable(.32,.48),12.0,0,57.1);place(wallArt(1.05,.62,'#284760','#7e8a95'),10.10,1.72,57.2,Math.PI/2);place(wallScreen(1.08,.60,'KAYAS','Observation corridor'),13.88,1.72,50.2,-Math.PI/2);place(ceilingPanel(1.7,.24),12.0,3.02,52.0,Math.PI/2);place(ceilingPanel(1.7,.24),12.0,3.02,58.5,Math.PI/2);

// Future opening hall / conference reserve.
place(sofa(2.05),18.8,0,15.6,Math.PI/2);place(sofa(2.05),18.8,0,25.2,Math.PI/2);place(loungeChair(),22.0,0,14.1,Math.PI);place(loungeChair(),22.0,0,16.9,Math.PI);place(loungeChair(),22.0,0,23.7,Math.PI);place(loungeChair(),22.0,0,26.7,Math.PI);place(coffeeTable(1.05,.56,.38),20.4,0,15.6);place(coffeeTable(1.05,.56,.38),20.4,0,25.2);place(sideTable(.40,.50),17.0,0,20.5);place(consoleUnit(1.55,.82,.40),40.2,0,19.0,-Math.PI/2);place(receptionDesk(1.30,.56,1.00),27.5,0,12.0,Math.PI);place(lowBench(1.5),39.7,0,16.4,-Math.PI/2);place(lowBench(1.5),39.7,0,22.2,-Math.PI/2);
place(wallScreen(2.20,1.18,'KAYAS','VIP opening hall / future event zone'),27.5,1.74,7.12,0);place(wallArt(1.40,.80,'#274c63','#c29b66'),40.88,1.75,29.5,-Math.PI/2);place(clock(),14.12,2.45,31.5,Math.PI/2);
for(const z of[11.5,17.0,22.5,28.0])place(ceilingPanel(2.4,.36),27.5,3.70,z);

// Technical rooms, staging and freight lobby.
place(equipmentCabinet(.82,.86,2.05),2.2,0,10.8);place(equipmentCabinet(.82,.86,2.05),4.0,0,10.8);place(equipmentCabinet(.82,.86,2.05),5.8,0,10.8);place(wallScreen(1.20,.62,'KAYAS','MMR-B'),4.0,1.72,7.12,0);place(ceilingPanel(1.6,.28),4.0,3.32,12.0);
place(equipmentCabinet(.82,.86,2.05),2.2,0,20.6);place(equipmentCabinet(.82,.86,2.05),4.0,0,20.6);place(equipmentCabinet(.82,.86,2.05),5.8,0,20.6);place(lowCabinet(1.2,.38,.82),6.8,0,17.9,-Math.PI/2);place(ceilingPanel(1.6,.28),4.0,3.32,20.5);
place(equipmentCabinet(.84,.88,2.05),2.2,0,80.5);place(equipmentCabinet(.84,.88,2.05),4.0,0,80.5);place(equipmentCabinet(.84,.88,2.05),5.8,0,80.5);place(wallScreen(1.20,.62,'KAYAS','MMR-A'),4.0,1.72,77.12,0);place(ceilingPanel(1.6,.28),4.0,3.32,80.5);
place(crateStack(1.0,.76,.92),22.3,0,82.6);place(crateStack(1.0,.76,.92),24.2,0,82.6);place(shelfUnit(1.25,.48,1.95),26.2,0,87.0,Math.PI/2);place(ceilingPanel(1.6,.28),23.5,3.45,81.8);place(ceilingPanel(1.6,.28),23.5,3.45,87.6);
place(lowBench(1.4),23.5,0,95.5);place(consoleUnit(1.2,.82,.40),26.2,0,100.0,Math.PI/2);place(ceilingPanel(1.6,.28),23.5,3.45,97.5);place(ceilingPanel(1.6,.28),23.5,3.45,104.0);

// Controlled technical spine.
place(equipmentCabinet(.82,.86,2.05),18.0,0,72.3);place(equipmentCabinet(.82,.86,2.05),19.2,0,72.3);place(equipmentCabinet(.82,.86,2.05),35.8,0,72.3);place(extinguisher(),14.55,0,75.8);place(wallScreen(1.18,.64,'KAYAS','Technical service spine'),27.5,1.72,76.88,Math.PI);place(ceilingPanel(2.0,.24),27.5,3.48,73.5,Math.PI/2);

// Power / battery rooms and electrical rooms.
place(equipmentCabinet(.86,.92,2.05),28.7,0,83.1);place(equipmentCabinet(.86,.92,2.05),30.1,0,83.1);place(equipmentCabinet(.86,.92,2.05),31.5,0,83.1);place(shelfUnit(1.0,.42,1.95),33.2,0,87.1,Math.PI/2);
place(equipmentCabinet(.86,.92,2.05),35.7,0,83.1);place(equipmentCabinet(.86,.92,2.05),37.1,0,83.1);place(equipmentCabinet(.86,.92,2.05),38.5,0,83.1);place(shelfUnit(1.0,.42,1.95),34.8,0,87.1,-Math.PI/2);
place(equipmentCabinet(.86,.92,1.86),28.7,0,92.2);place(equipmentCabinet(.86,.92,1.86),30.1,0,92.2);place(equipmentCabinet(.86,.92,1.86),35.7,0,92.2);place(equipmentCabinet(.86,.92,1.86),37.1,0,92.2);
place(equipmentCabinet(.86,.92,1.95),28.7,0,100.5);place(equipmentCabinet(.86,.92,1.95),30.1,0,100.5);place(equipmentCabinet(.86,.92,1.95),35.7,0,100.5);place(equipmentCabinet(.86,.92,1.95),37.1,0,100.5);place(equipmentCabinet(.86,.92,1.95),32.9,0,106.4);
place(wallScreen(1.10,.60,'KAYAS','UPS room A'),27.12,1.72,84.2,Math.PI/2);place(wallScreen(1.10,.60,'KAYAS','UPS room B'),40.88,1.72,84.2,-Math.PI/2);place(wallScreen(1.18,.62,'KAYAS','Main distribution / bypass'),34.0,1.72,97.12,0);
for(const p of [[30.5,84.8],[37.5,84.8],[30.5,92.8],[37.5,92.8],[34.0,100.3],[34.0,106.4]])place(ceilingPanel(1.6,.26),p[0],3.40,p[1]);

// Terrace lighting / service clarity.
for(const z of[12,30,48,66,84,102])place(ceilingPanel(1.4,.22,.04,0xe7f6ff),43.5,3.55,z,Math.PI/2);

// Minimal GLB loader for embedded, offline project assets.
const COMP={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array};const SIZE={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT4:16};
function parseGLB(ab){const dv=new DataView(ab);if(dv.getUint32(0,true)!==0x46546c67)throw Error('Not a GLB');let off=12,json=null,bin=null;while(off<ab.byteLength){const len=dv.getUint32(off,true),type=dv.getUint32(off+4,true);off+=8;const chunk=ab.slice(off,off+len);off+=len;if(type===0x4E4F534A)json=JSON.parse(new TextDecoder().decode(chunk).replace(/\0+$/,''));else if(type===0x004E4942)bin=chunk}return {json,bin}}
function dataUriBuffer(uri){const b64=uri.slice(uri.indexOf(',')+1),s=atob(b64),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u.buffer}async function loadGLB(uri){const ab=dataUriBuffer(uri);const {json:j,bin}=parseGLB(ab);const textures=[];if(j.images){for(let i=0;i<j.images.length;i++){const im=j.images[i];let url;if(im.bufferView!==undefined){const bv=j.bufferViews[im.bufferView];url=URL.createObjectURL(new Blob([bin.slice(bv.byteOffset||0,(bv.byteOffset||0)+bv.byteLength)],{type:im.mimeType||'image/png'}))}else url=im.uri;const tex=await new Promise((res,rej)=>new THREE.TextureLoader().load(url,t=>res(t),undefined,rej));tex.flipY=false;tex.colorSpace=THREE.SRGBColorSpace;textures[i]=tex;if(url.startsWith('blob:'))URL.revokeObjectURL(url)}}
 function accessor(ai){const a=j.accessors[ai],bv=j.bufferViews[a.bufferView],T=COMP[a.componentType],n=SIZE[a.type],bo=(bv.byteOffset||0)+(a.byteOffset||0);const arr=new T(bin,bo,a.count*n);return new THREE.BufferAttribute(arr,n,!!a.normalized)}
 const materials=(j.materials||[]).map(mat=>{const p=mat.pbrMetallicRoughness||{},f=p.baseColorFactor||[1,1,1,1],m=new THREE.MeshStandardMaterial({color:new THREE.Color(f[0],f[1],f[2]),opacity:f[3],transparent:f[3]<.999,roughness:p.roughnessFactor??.8,metalness:p.metallicFactor??0,side:mat.doubleSided?THREE.DoubleSide:THREE.FrontSide});if(p.baseColorTexture){const ti=j.textures[p.baseColorTexture.index]?.source;if(ti!==undefined)m.map=textures[ti]}return m});
 const meshObjs=(j.meshes||[]).map(me=>{const g=new THREE.Group();for(const pr of me.primitives||[]){const geo=new THREE.BufferGeometry();for(const [sem,ai] of Object.entries(pr.attributes||{})){const name=sem==='POSITION'?'position':sem==='NORMAL'?'normal':sem==='TEXCOORD_0'?'uv':sem==='COLOR_0'?'color':null;if(name)geo.setAttribute(name,accessor(ai))}if(pr.indices!==undefined)geo.setIndex(accessor(pr.indices));if(!geo.getAttribute('normal'))geo.computeVertexNormals();geo.computeBoundingBox();geo.computeBoundingSphere();const mat=materials[pr.material]||new THREE.MeshStandardMaterial({color:0x9aa2a6,roughness:.8,vertexColors:!!geo.getAttribute('color')});if(geo.getAttribute('color'))mat.vertexColors=true;const mesh=new THREE.Mesh(geo,mat);g.add(mesh)}return g});
 const nodes=(j.nodes||[]).map(n=>{const o=n.mesh!==undefined?meshObjs[n.mesh].clone(true):new THREE.Group();o.name=n.name||'';if(n.matrix)o.matrix.fromArray(n.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale);else{if(n.translation)o.position.fromArray(n.translation);if(n.rotation)o.quaternion.fromArray(n.rotation);if(n.scale)o.scale.fromArray(n.scale)}return o});for(let i=0;i<(j.nodes||[]).length;i++)for(const ch of j.nodes[i].children||[])nodes[i].add(nodes[ch]);const root=new THREE.Group(),sc=j.scenes?.[j.scene||0]||j.scenes?.[0];for(const ni of sc?.nodes||[])root.add(nodes[ni]);return root}
function normalizeIC(root){const w=new THREE.Group();w.add(root);w.scale.setScalar(.001);w.rotation.x=-Math.PI/2;w.updateMatrixWorld(true);let b=new THREE.Box3().setFromObject(w),c=b.getCenter(new THREE.Vector3());w.position.x-=c.x;w.position.z-=c.z;w.position.y-=b.min.y;w.updateMatrixWorld(true);return w}
function normalizeHeight(root,targetH,overrideMat=null){root.updateMatrixWorld(true);let b=new THREE.Box3().setFromObject(root),h=b.max.y-b.min.y,s=targetH/Math.max(.001,h);root.scale.multiplyScalar(s);root.updateMatrixWorld(true);b=new THREE.Box3().setFromObject(root);let c=b.getCenter(new THREE.Vector3());root.position.x-=c.x;root.position.z-=c.z;root.position.y-=b.min.y;if(overrideMat)root.traverse(o=>{if(o.isMesh)o.material=overrideMat});root.updateMatrixWorld(true);return root}
function instanceSource(source,placements,parent=scene){source.updateMatrixWorld(true);source.traverse(o=>{if(!o.isMesh)return;const im=new THREE.InstancedMesh(o.geometry,o.material,placements.length);im.instanceMatrix.setUsage(THREE.StaticDrawUsage);for(let i=0;i<placements.length;i++){const p=placements[i],pm=new THREE.Matrix4().makeRotationY(p.ry||0);pm.setPosition(p.x,p.y||0,p.z);const m=new THREE.Matrix4().multiplyMatrices(pm,o.matrixWorld);im.setMatrixAt(i,m)}im.frustumCulled=true;parent.add(im)});}

function dataPodPlacements(){const full=[],short=[];const cols=[18.0,29.0],rows=[41.5,46.8,52.1,57.4,62.7];let k=0;for(let r=0;r<5;r++)for(let c=0;c<2;c++){const pod=PODS[k++],z=rows[r]+1.81,x0=cols[c],a={x:x0+1.757,z,ry:0},b={x:x0+5.271,z,ry:0};full.push(a);const total=pod.rowA+pod.rowB;if(total===20)full.push(b);else short.push({...b,ry:pod.rowA===9?Math.PI:0})}return {full,short}}
function createLiquidRacks(){const group=new THREE.Group();const geom=new THREE.BoxGeometry(.62,2.18,1.16);for(let i=0;i<10;i++){const rack=new THREE.Mesh(geom,MAT.blue);rack.position.set(38.5,1.09,43.0+i*1.72);rack.castShadow=true;rack.receiveShadow=true;group.add(rack);const face=new THREE.Mesh(new THREE.BoxGeometry(.50,.28,.02),MAT.screen);face.position.set(38.5,1.52,42.41+i*1.72);group.add(face)}const pipeMat1=new THREE.MeshStandardMaterial({color:0x4b9ebc,roughness:.38,metalness:.48});for(const x of[38.0,39.0]){const p=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,17.2,12),pipeMat1);p.rotation.x=Math.PI/2;p.position.set(x,2.75,50.75);group.add(p)}scene.add(group)}
function addDataInfrastructure(){for(let r=0;r<5;r++){const z=43.31+r*5.3;for(const x of[21.5,32.5]){const bus=new THREE.Mesh(new THREE.BoxGeometry(7.2,.14,.18),MAT.metal);bus.position.set(x,3.38,z);scene.add(bus);const tray=new THREE.Mesh(new THREE.BoxGeometry(7.2,.05,.62),new THREE.MeshStandardMaterial({color:0x777f83,roughness:.62,metalness:.65,wireframe:false}));tray.position.set(x,3.58,z);scene.add(tray)}}const label=wallScreen(2.1,.82,'IC8000 DATA HALL','196 air-cooled cabinets · 10 micro-module corridors');label.position.set(40.85,2.15,54.5);label.rotation.y=-Math.PI/2;scene.add(label)}

function proceduralRackMaterial(){return new THREE.MeshStandardMaterial({color:0x303940,roughness:.62,metalness:.28});}
function createProceduralIC8000Pods(){
 const rackMat=proceduralRackMaterial(), faceMat=new THREE.MeshStandardMaterial({color:0x111b21,roughness:.35,metalness:.25}), logoMat=MAT.red;
 const rackGeom=new THREE.BoxGeometry(.56,2.12,1.08), faceGeom=new THREE.BoxGeometry(.50,1.80,.025), logoGeom=new THREE.BoxGeometry(.34,.08,.03);
 for(const pod of PODS){
   const rowZ=[pod.z+.62,pod.z+pod.d-.62];
   const counts=[pod.rowA,pod.rowB];
   for(let r=0;r<2;r++){
     const count=counts[r], usable=5.72, spacing=usable/10, start=pod.x+.14+(10-count)*spacing/2;
     for(let i=0;i<count;i++){
       const x=start+spacing*(i+.5), z=rowZ[r];
       const rack=new THREE.Mesh(rackGeom,rackMat);rack.position.set(x,1.06,z);rack.castShadow=true;rack.receiveShadow=true;scene.add(rack);
       const frontZ=z+(r===0?.553:-.553);const face=new THREE.Mesh(faceGeom,faceMat);face.position.set(x,1.06,frontZ);scene.add(face);
       if(i===Math.floor(count/2)){const lg=new THREE.Mesh(logoGeom,logoMat);lg.position.set(x,1.82,frontZ+(r===0?.02:-.02));scene.add(lg);}
     }
   }
   const frameMat=new THREE.MeshStandardMaterial({color:0x69757d,roughness:.38,metalness:.72});
   for(const z of [pod.z+.03,pod.z+pod.d-.03]){const beam=new THREE.Mesh(new THREE.BoxGeometry(pod.w,.07,.07),frameMat);beam.position.set(pod.x+pod.w/2,2.42,z);scene.add(beam);}
   for(const x of [pod.x+.03,pod.x+pod.w-.03]){const beam=new THREE.Mesh(new THREE.BoxGeometry(.07,.07,pod.d),frameMat);beam.position.set(x,2.42,pod.z+pod.d/2);scene.add(beam);}
 }
}
function makeChair(){const g=new THREE.Group();const seat=new THREE.Mesh(new THREE.BoxGeometry(.52,.10,.52),MAT.upholsteryDark);seat.position.y=.50;g.add(seat);const back=new THREE.Mesh(new THREE.BoxGeometry(.52,.58,.10),MAT.upholsteryDark);back.position.set(0,.82,.22);g.add(back);for(const x of[-.20,.20])for(const z of[-.20,.20]){const l=new THREE.Mesh(new THREE.BoxGeometry(.035,.48,.035),MAT.dark);l.position.set(x,.24,z);g.add(l)}return g}
function makePlant(){const g=new THREE.Group();const pot=new THREE.Mesh(new THREE.CylinderGeometry(.20,.16,.34,16),new THREE.MeshStandardMaterial({color:0x77736d,roughness:.86}));pot.position.y=.17;g.add(pot);const green=new THREE.MeshStandardMaterial({color:0x376847,roughness:.88});for(let i=0;i<9;i++){const leaf=new THREE.Mesh(new THREE.ConeGeometry(.10,.65,8),green);leaf.position.set(Math.cos(i*.7)*.10,.58+((i%3)*.08),Math.sin(i*.7)*.10);leaf.rotation.z=(i%2?.32:-.32);g.add(leaf)}return g}
function placeClones(source,placements){for(const p of placements){const o=source.clone(true);o.position.set(p.x,0,p.z);o.rotation.y=p.ry||0;scene.add(o)}}
async function installAssets(){
 createProceduralIC8000Pods();createLiquidRacks();addDataInfrastructure();
 const ch=makeChair();
 const meeting=[];for(const x of[2.85,3.65,4.45,5.25]){meeting.push({x,z:86.95,ry:0},{x,z:89.05,ry:Math.PI})}meeting.push({x:2.0,z:88,ry:Math.PI/2},{x:6.0,z:88,ry:-Math.PI/2});
 const noc=[{x:1.5,z:29.1,ry:0},{x:3.1,z:29.1,ry:0},{x:4.9,z:29.1,ry:0},{x:6.4,z:29.1,ry:0},{x:1.5,z:30.9,ry:Math.PI},{x:3.1,z:30.9,ry:Math.PI},{x:4.9,z:30.9,ry:Math.PI},{x:6.4,z:30.9,ry:Math.PI}];
 const small=[{x:12.8,z:79.6,ry:Math.PI/2},{x:12.8,z:81.4,ry:Math.PI/2},{x:14.2,z:79.6,ry:-Math.PI/2},{x:14.2,z:81.4,ry:-Math.PI/2}];
 const offices=[{x:2.2,z:48.6,ry:Math.PI},{x:5.8,z:48.6,ry:Math.PI},{x:2.3,z:40.4,ry:Math.PI},{x:5.7,z:40.4,ry:Math.PI},{x:13.3,z:107.5,ry:Math.PI}];placeClones(ch,meeting.concat(noc,small,offices));
 const pl=makePlant();const pp=[{x:15.7,z:91.8,ry:.3},{x:10.9,z:86.2,ry:-.3},{x:6.8,z:89.7,ry:.2},{x:1.0,z:85.0,ry:-.3},{x:15.8,z:103.8,ry:.1},{x:10.8,z:98.8,ry:-.2},{x:15.9,z:109.1,ry:.15},{x:7.1,z:34.8,ry:.15},{x:13.1,z:58.7,ry:-.2},{x:23.9,z:14.0,ry:.1},{x:23.9,z:26.8,ry:-.1},{x:39.6,z:30.5,ry:.15},{x:10.9,z:105.8,ry:.1},{x:16.0,z:84.8,ry:-.2},{x:1.0,z:52.8,ry:.2},{x:6.9,z:52.8,ry:-.15},{x:16.0,z:77.8,ry:.1}];placeClones(pl,pp);
}

// Movement / camera.
let mode='overview',drag=false,lastX=0,lastY=0;let yaw=Math.PI,pitch=-.03,targetYaw=yaw,targetPitch=pitch;const keys=new Set();const velocity=new THREE.Vector3();const player={x:13.6,y:1.65,z:90.5,r:.28};
const overviewTarget=new THREE.Vector3(23,1.25,55);let overviewAz=.76,overviewEl=.57,overviewDist=82,overviewDrag=false,overviewLastX=0,overviewLastY=0,overviewTouched=false;
function setOverviewVisibility(on){ceilings.visible=!on;for(const o of overviewHide)o.visible=!on}
function updateOverviewCamera(){const ce=Math.cos(overviewEl);camera.position.set(overviewTarget.x+Math.sin(overviewAz)*ce*overviewDist,overviewTarget.y+Math.sin(overviewEl)*overviewDist,overviewTarget.z+Math.cos(overviewAz)*ce*overviewDist);camera.lookAt(overviewTarget)}
function yawPitchTo(target){const dx=target.x-player.x,dz=target.z-player.z,dy=target.y-player.y;targetYaw=Math.atan2(dx,dz);targetPitch=Math.atan2(dy,Math.hypot(dx,dz));yaw=targetYaw;pitch=targetPitch}
function setWalkPose(x,z,lookX,lookZ,title,desc){mode='walk';document.body.classList.add('walk');document.body.classList.remove('overview-mode');setOverviewVisibility(false);setZoneOverlayVisible(false);camera.fov=61;camera.updateProjectionMatrix();player.x=x;player.z=z;camera.position.set(x,player.y,z);yawPitchTo({x:lookX,y:1.25,z:lookZ});velocity.set(0,0,0);document.getElementById('zoneTitle').textContent=title;document.getElementById('zoneText').textContent=desc;document.querySelectorAll('.nav button').forEach(b=>b.classList.remove('active'))}
function overview(){mode='overview';document.body.classList.remove('walk');document.body.classList.add('overview-mode');setOverviewVisibility(true);setZoneOverlayVisible(true);camera.fov=49;camera.updateProjectionMatrix();updateOverviewCamera();document.getElementById('zoneTitle').textContent='Rev16.5 · Interactive 3D Cutaway Overview';document.getElementById('zoneText').textContent='Overview tags remain softly visible. Hover previews the selected zone; click pins it and keeps the full explanation panel open beneath the live plan.'}
function collides(x,z){const r=player.r;if(x<.25||x>45.75||z<.25||z>109.75)return true;for(const b of collision)if(x>b.minx-r&&x<b.maxx+r&&z>b.minz-r&&z<b.maxz+r)return true;for(const a of doorActors){if(a.open>.68)continue;const d=a.d;if(a.isX){if(Math.abs(x-d.pos)<r+.10&&z>d.a-r&&z<d.b+r)return true}else{if(Math.abs(z-d.pos)<r+.10&&x>d.a-r&&x<d.b+r)return true}}return false}
canvas.addEventListener('pointerdown',e=>{if(mode!=='walk')return;drag=true;lastX=e.clientX;lastY=e.clientY;canvas.classList.add('dragging');canvas.setPointerCapture?.(e.pointerId)});canvas.addEventListener('pointerup',e=>{drag=false;canvas.classList.remove('dragging');canvas.releasePointerCapture?.(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!drag||mode!=='walk')return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;targetYaw-=dx*.0032;targetPitch=Math.max(-1.15,Math.min(1.0,targetPitch-dy*.0027))});
canvas.addEventListener('pointerdown',e=>{if(mode!=='overview')return;overviewDrag=true;overviewTouched=true;overviewLastX=e.clientX;overviewLastY=e.clientY;canvas.setPointerCapture?.(e.pointerId)});
canvas.addEventListener('pointerup',e=>{if(mode!=='overview')return;overviewDrag=false;canvas.releasePointerCapture?.(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(mode!=='overview'||!overviewDrag)return;const dx=e.clientX-overviewLastX,dy=e.clientY-overviewLastY;overviewLastX=e.clientX;overviewLastY=e.clientY;overviewAz-=dx*.0055;overviewEl=Math.max(.20,Math.min(1.12,overviewEl+dy*.0042));updateOverviewCamera()});
canvas.addEventListener('wheel',e=>{if(mode!=='overview')return;e.preventDefault();overviewTouched=true;overviewDist=Math.max(42,Math.min(128,overviewDist*(1+Math.sign(e.deltaY)*.075)));updateOverviewCamera()},{passive:false});window.addEventListener('keydown',e=>{keys.add(e.code);if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault()});window.addEventListener('keyup',e=>keys.delete(e.code));
function angleLerp(a,b,t){let d=(b-a+Math.PI)%(Math.PI*2)-Math.PI;if(d<-Math.PI)d+=Math.PI*2;return a+d*t}
function updatePlayer(dt){if(mode!=='walk')return;const fwd=((keys.has('KeyW')||keys.has('ArrowUp'))?1:0)-((keys.has('KeyS')||keys.has('ArrowDown'))?1:0),side=((keys.has('KeyD')||keys.has('ArrowRight'))?1:0)-((keys.has('KeyA')||keys.has('ArrowLeft'))?1:0);let dx=0,dz=0;if(fwd||side){const l=Math.hypot(fwd,side),ff=fwd/l,ss=side/l;/* Rev16.0.2 viewer-relative movement:
   forward = (sin(yaw), cos(yaw))
   right   = (-cos(yaw), sin(yaw))
   so D/Right moves to the viewer's actual right and A/Left to the actual left. */
dx=Math.sin(yaw)*ff-Math.cos(yaw)*ss;dz=Math.cos(yaw)*ff+Math.sin(yaw)*ss}const speed=3.15,acc=1-Math.exp(-dt*9.5),damp=Math.exp(-dt*6.5);if(dx||dz){velocity.x+=(dx*speed-velocity.x)*acc;velocity.z+=(dz*speed-velocity.z)*acc}else{velocity.x*=damp;velocity.z*=damp}let nx=player.x+velocity.x*dt,nz=player.z;if(!collides(nx,nz))player.x=nx;else velocity.x=0;nz=player.z+velocity.z*dt;if(!collides(player.x,nz))player.z=nz;else velocity.z=0;yaw=angleLerp(yaw,targetYaw,1-Math.exp(-dt*14));pitch+=(targetPitch-pitch)*(1-Math.exp(-dt*14));camera.position.set(player.x,player.y,player.z);camera.rotation.order='YXZ';
/* Rev16.0.1 orientation contract:
   yaw represents the direction the viewer is facing in plan/world coordinates.
   Three.js cameras look down local -Z, therefore add PI to the Y rotation.
   pitch is already signed as target vertical angle, so use it directly. */
camera.rotation.y=yaw+Math.PI;camera.rotation.x=pitch;camera.rotation.z=0}

function roomAt(x,z){return ROOMS.find(r=>x>=r.x&&x<=r.x+r.w&&z>=r.z&&z<=r.z+r.d)}
function updateHud(){if(mode!=='walk')return;const r=roomAt(player.x,player.z);if(!r)return;const title=document.getElementById('zoneTitle');if(title.dataset.room!==r.id){title.dataset.room=r.id;title.textContent=r.id+' · '+r.name;let extra='';if(r.id==='D-02')extra=' 196 air-cooled + 10 liquid-cooled IT cabinets; design IT load 1,972 kW. Exact auxiliary cabinet inclusion and CDU sizing remain confirmation items.';document.getElementById('zoneText').textContent=`${r.w} × ${r.d} m · ${(r.w*r.d).toFixed(0)} m² concept zone.${extra}`}}
function drawMini(){const c=document.getElementById('mini');if(!c||!c.parentElement||getComputedStyle(c.parentElement).display==='none')return;const x=c.getContext('2d'),dpr=Math.min(1,devicePixelRatio||1),tw=Math.max(1,Math.floor(c.clientWidth*dpr)),th=Math.max(1,Math.floor(c.clientHeight*dpr));if(c.width!==tw)c.width=tw;if(c.height!==th)c.height=th;const W=c.width,H=c.height;x.setTransform(dpr,0,0,dpr,0,0);const w=c.clientWidth,h=c.clientHeight,p=8,s=Math.min((w-2*p)/46,(h-2*p)/110),ox=(w-46*s)/2,oz=(h-110*s)/2;x.fillStyle='#0c1b25';x.fillRect(0,0,w,h);for(const r of ROOMS){x.fillStyle=r.id==='D-02'?'#204a5f':r.id==='A-02'?'#4b3f35':r.id==='B-01'?'#4b4631':r.cat==='terrace'?'#2f4c4b':'#182d39';x.fillRect(ox+r.x*s,oz+r.z*s,r.w*s,r.d*s);x.strokeStyle='#4b6575';x.strokeRect(ox+r.x*s,oz+r.z*s,r.w*s,r.d*s)}if(mode==='walk'){const px=ox+player.x*s,pz=oz+player.z*s;x.fillStyle='#76ddff';x.beginPath();x.arc(px,pz,4,0,Math.PI*2);x.fill();x.strokeStyle='#fff';x.beginPath();x.moveTo(px,pz);x.lineTo(px+Math.sin(yaw)*12,pz+Math.cos(yaw)*12);x.stroke()}x.fillStyle='#dceaf1';x.font='700 9px Segoe UI';x.fillText('N ↑',ox+20*s,oz-2)}

let last=performance.now();function frame(now){const dt=Math.min(.033,(now-last)/1000);last=now;updateDoors(dt);updatePlayer(dt);if(mode==='overview'&&!overviewTouched){overviewAz+=dt*.045;updateOverviewCamera()}updateHud();drawMini();updateZoneMarkers();renderer.render(scene,camera);requestAnimationFrame(frame)}
function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}window.addEventListener('resize',resize);

function openLanding(){document.getElementById('landing').classList.remove('hidden');mode='overview';document.body.classList.remove('walk');overview();setZoneOverlayVisible(false)}
let kayasAssetsPromise=null;window.ensureKAYASAssets=()=>{if(!kayasAssetsPromise){document.getElementById('status').textContent='LOADING DATA HALL EQUIPMENT';kayasAssetsPromise=installAssets().then(()=>{document.getElementById('status').textContent='206 IT CABINETS · 1,972 kW';return true}).catch(e=>{console.error(e);kayasAssetsPromise=null;document.getElementById('status').textContent='3D SHELL READY';return false})}return kayasAssetsPromise};document.getElementById('homeBtn').onclick=openLanding;
document.getElementById('overviewBtn').onclick=()=>{document.getElementById('landing').classList.add('hidden');overview()};
document.getElementById('arrivalBtn').onclick=()=>{document.getElementById('landing').classList.add('hidden');setWalkPose(13.5,103.8,13.2,101.3,'A-04 / A-03 / A-05 · Arrival, Access & Security','Human-eye review of the elevator arrival lobby, access-control vestibule and security control point. Focus: calm visitor arrival, clear circulation, signage and controlled access.')};
document.getElementById('foyerBtn').onclick=()=>{document.getElementById('landing').classList.add('hidden');setWalkPose(13.7,91.0,12.4,88.5,'A-02 · Secure Foyer / Waiting','Premium visitor-facing foyer with lounge furniture, planting, wall signage, closed-by-default controlled doors and a more complete waiting-area composition.')};
document.getElementById('meetingBtn').onclick=()=>{document.getElementById('landing').classList.add('hidden');setWalkPose(6.7,89.2,4.0,88.0,'B-01 · Large Meeting Room','Investor meeting room with board table, office-chair geometry, north presentation wall, credenza and human-eye meeting-room framing.')};
document.getElementById('nocBtn').onclick=()=>{document.getElementById('landing').classList.add('hidden');setWalkPose(4.1,34.0,4.0,27.0,'O-02 · NOC','Operations room viewed at human eye height. Focus: operator desks, monitor wall, support storage and realistic room occupancy without humans.')};
document.getElementById('obsBtn').onclick=()=>{document.getElementById('landing').classList.add('hidden');setWalkPose(12.1,59.8,12.0,53.8,'C-04 · Observation Gallery','West observation / service strip viewed at human eye height. Focus: visitor pause point, wall graphics and corridor readability.')};
document.getElementById('futureBtn').onclick=()=>{document.getElementById('landing').classList.add('hidden');setWalkPose(21.5,28.0,27.5,18.0,'D-01 · Future Opening Hall / Conference Reserve','Premium future hall concept viewed at human eye height. Focus: lounge groups, event/presentation wall and VIP opening use potential.')};
document.getElementById('dataBtn').onclick=()=>{window.ensureKAYASAssets();document.getElementById('landing').classList.add('hidden');setWalkPose(27.5,68.2,27.5,56.0,'D-02 · Active IC8000 Data Hall','Architecture-locked procedural cabinet geometry arranged as 10 micro-module corridors. The model represents exactly 196 air-cooled cabinets plus 10 liquid-cooled cabinets; final H3C equipment allocation and auxiliary-cabinet scope remain confirmation required.')};
document.getElementById('powerBtn').onclick=()=>{document.getElementById('landing').classList.add('hidden');setWalkPose(31.0,84.6,30.8,82.0,'P-01 / P-02 / P-03 / P-04 · Power & Battery Rooms','Human-eye review of UPS and battery-room massing, equipment rows and clearance intent. This remains a concept placeholder, not final engineering sizing.')};
document.getElementById('terraceBtn').onclick=()=>{document.getElementById('landing').classList.add('hidden');setWalkPose(43.3,54.0,43.3,65.0,'TR-01 · East Service Terrace','Covered east terrace viewed at human eye height. Focus: louvers, upward-discharge outdoor units and kept-clear service-door access.')};
for(const [id,fn] of [['cardOverview',()=>document.getElementById('overviewBtn').click()],['cardArrival',()=>document.getElementById('arrivalBtn').click()],['cardFoyer',()=>document.getElementById('foyerBtn').click()],['cardMeeting',()=>document.getElementById('meetingBtn').click()],['cardNoc',()=>document.getElementById('nocBtn').click()],['cardObservation',()=>document.getElementById('obsBtn').click()],['cardFuture',()=>document.getElementById('futureBtn').click()],['cardData',()=>document.getElementById('dataBtn').click()],['cardPower',()=>document.getElementById('powerBtn').click()],['cardTerrace',()=>document.getElementById('terraceBtn').click()]])document.getElementById(id).onclick=fn;

(async()=>{try{overview();requestAnimationFrame(frame);await new Promise(r=>setTimeout(r,120));document.getElementById('loading').classList.add('hidden');document.getElementById('landing').classList.remove('hidden');document.getElementById('status').textContent='206 IT CABINETS · 1,972 kW';}catch(e){console.error(e);document.querySelector('#loading .loadbox b').textContent='KAYAS 3D could not initialize';document.querySelector('#loading .loadbox span').textContent=e.message||String(e)}})();
