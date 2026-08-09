(function () {
  'use strict';

  const ROOT_ID = 'kayas-ic8000-3d';
  const MODEL_SRC = './assets/3d/IC8000_Colored_Textured.glb';
  const CHAPTER_TITLE = 'Geleneksel, Mikro-Modül ve Prefabrik Modüler Veri Merkezi';

  const annotations = [
    {
      id: '1',
      title: 'IT Kabinet Sıraları',
      position: '0m -1775m -150m',
      normal: '0m -1m 0m',
      body: 'Sunucu, storage ve network ekipmanlarının yerleştirildiği ana IT alanıdır. Rack yoğunluğu, A/B güç dağıtımı, hava akışı ve erişilebilirlik birlikte tasarlanmalıdır.'
    },
    {
      id: '2',
      title: 'In-Row / Yakın Soğutma Bölgesi',
      position: '1610m 0m 920m',
      normal: '1m 0m 0m',
      body: 'Mikro-modül mimarisinde kabinet sıralarına yakın soğutma, kontrollü hava akışı ve daha kısa ısı taşıma yolu sağlayabilir. İşaret, mimari işlevi anlatan görsel yönlendirmedir; nihai ekipman konumu üretici submittal ve MEP tasarımıyla doğrulanmalıdır.'
    },
    {
      id: '3',
      title: 'Koridor ve Hava Akışı Yönetimi',
      position: '0m 0m 450m',
      normal: '0m 0m 1m',
      body: 'Karşılıklı kabinet sıraları arasındaki kontrollü koridor, sıcak ve soğuk hava akımlarının karışmasını azaltmak için kullanılır. Nihai containment tipi ve basınç/hava debisi değerleri detay tasarımda belirlenmelidir.'
    },
    {
      id: '4',
      title: 'Güç Dağıtımı ve MEP Entegrasyonu',
      position: '-1610m 0m 920m',
      normal: '-1m 0m 0m',
      body: 'Mikro-modül, UPS/PDU veya busway üzerinden gelen A/B güç yolları ile tesisin mekanik-elektrik altyapısına bağlanır. Bu nokta konsept entegrasyonu gösterir; kesin PDU, busway ve kablo güzergâhları proje BoQ ve shop drawing ile teyit edilmelidir.'
    },
    {
      id: '5',
      title: 'Üst Kablolama / Dağıtım Bölgesi',
      position: '0m -250m 1120m',
      normal: '0m 0m 1m',
      body: 'Fiber, bakır kablolama ve bazı üstten dağıtım bileşenleri erişim, ayrışma ve bakım disiplinine göre planlanır. Data, güç ve yönetim yollarının fiziksel ayrımı detay projede doğrulanmalıdır.'
    },
    {
      id: '6',
      title: 'Kapalı Mikro-Modül Yapısı',
      position: '1450m 1000m 1050m',
      normal: '1m 0m 0m',
      body: 'Enclosure/containment yaklaşımı, tekrarlanabilir bir beyaz alan bloğu oluşturarak hava yönetimini, fiziksel ayrışmayı ve fazlı kurulumu destekler. KAYAŞ için değer, aynı omurgaya yeni podların talep oluştukça eklenebilmesidir.'
    },
    {
      id: '7',
      title: 'İzleme ve Yönetim Katmanı',
      position: '-1450m 1000m 1050m',
      normal: '-1m 0m 0m',
      body: 'Sıcaklık, nem, güç, alarm ve çevresel telemetri DCIM/BMS/NMS katmanlarına taşınabilir. İşaret belirli bir fiziksel sensörü değil, mikro-modülün merkezi izleme entegrasyonu kabiliyetini temsil eder.'
    },
    {
      id: '8',
      title: 'Modüler Ölçeklenme',
      position: '0m 1775m -150m',
      normal: '0m 1m 0m',
      body: 'KAYAŞ açısından temel yatırım ilkesi tek seferde tüm kapasiteyi kurmak değil; ortak güç, soğutma ve fiber omurgasını hazırlayıp satılabilir kW/MW ve müşteri talebine göre tekrarlanabilir modüller eklemektir.'
    }
  ];

  function normalizeText(value) {
    return String(value || '')
      .toLocaleLowerCase('tr-TR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ı/g, 'i')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function findChapter02() {
    const root = document.getElementById('chapters');
    if (!root) return null;

    const directChildren = Array.from(root.children);
    const titleNeedle = normalizeText(CHAPTER_TITLE);
    const strongNeedles = ['geleneksel', 'mikro modul', 'prefabrik'];

    let match = directChildren.find((el) => {
      const txt = normalizeText(el.textContent);
      return txt.includes(titleNeedle) || strongNeedles.every((needle) => txt.includes(needle));
    });
    if (match) return match;

    const candidates = Array.from(root.querySelectorAll('section, article, .paper'));
    match = candidates.find((el) => {
      const heading = el.querySelector('h1, h2, h3');
      const txt = normalizeText(heading ? heading.textContent : '');
      return txt.includes(titleNeedle) || strongNeedles.every((needle) => txt.includes(needle));
    });
    return match || null;
  }

  function makeHotspots() {
    return annotations.map((item) => (
      '<button type="button" class="ic8000-hotspot" ' +
      'slot="hotspot-' + item.id + '" ' +
      'data-annotation-id="' + item.id + '" ' +
      'data-position="' + item.position + '" ' +
      'data-normal="' + item.normal + '" ' +
      'aria-label="' + item.id + '. ' + item.title.replace(/"/g, '&quot;') + '">' +
      '<span>' + item.id + '</span>' +
      '</button>'
    )).join('');
  }

  function makeList() {
    return annotations.map((item) => (
      '<li><button type="button" data-annotation-target="' + item.id + '">' +
      '<span class="ic8000-list-no">' + item.id + '</span>' +
      '<span>' + item.title + '</span>' +
      '</button></li>'
    )).join('');
  }

  function buildMarkup() {
    return '' +
      '<section id="' + ROOT_ID + '" class="ic8000-3d-block" aria-labelledby="ic8000-3d-title">' +
        '<div class="ic8000-head">' +
          '<div>' +
            '<div class="ic8000-kicker">KAYAŞ İÇİN H3C ÇÖZÜM EŞLEŞTİRMESİ · ETKİLEŞİMLİ 3D</div>' +
            '<h3 id="ic8000-3d-title">H3C IC8000 Mikro-Modül — Açıklamalı 3D Model</h3>' +
            '<p>Modeli döndürün, yakınlaştırın ve numaralı noktalara tıklayarak mikro-modül mimarisinin temel işlevlerini inceleyin.</p>' +
          '</div>' +
          '<div class="ic8000-toolbar" aria-label="3D model kontrolleri">' +
            '<button type="button" id="ic8000-reset">Görünümü Sıfırla</button>' +
            '<button type="button" id="ic8000-fullscreen">Tam Ekran</button>' +
          '</div>' +
        '</div>' +
        '<div class="ic8000-disclaimer"><strong>Teknik sınır:</strong> Hotspot konumları yatırımcı anlatımı için görsel yönlendirmedir; exact equipment placement, BoQ, MEP interface veya üretici submittal yerine geçmez.</div>' +
        '<div class="ic8000-grid">' +
          '<div class="ic8000-stage" id="ic8000-stage">' +
            '<model-viewer id="ic8000-viewer" ' +
              'src="' + MODEL_SRC + '" ' +
              'alt="H3C IC8000 mikro-modül veri merkezi 3D modeli" ' +
              'camera-controls touch-action="pan-y" auto-rotate rotation-per-second="8deg" ' +
              'shadow-intensity="1" exposure="1" environment-image="neutral" tone-mapping="neutral" ' +
              'interaction-prompt="auto" loading="lazy" reveal="auto" ' +
              'camera-orbit="35deg 68deg 145%" field-of-view="30deg" ' +
              'min-camera-orbit="auto auto 70%" max-camera-orbit="auto auto 300%">' +
              makeHotspots() +
              '<div class="ic8000-loading" slot="progress-bar">3D model yükleniyor…</div>' +
            '</model-viewer>' +
            '<div class="ic8000-hint">Sürükle: döndür · Fare tekeri/pinch: yakınlaştır · Nokta: açıklamayı aç</div>' +
          '</div>' +
          '<aside class="ic8000-panel" aria-live="polite">' +
            '<div class="ic8000-panel-label">Bileşen / Mimari İşlev</div>' +
            '<h4 id="ic8000-info-title">1. ' + annotations[0].title + '</h4>' +
            '<p id="ic8000-info-body">' + annotations[0].body + '</p>' +
            '<ol class="ic8000-list" id="ic8000-list">' + makeList() + '</ol>' +
          '</aside>' +
        '</div>' +
        '<div class="ic8000-print-fallback">' +
          '<strong>Web sürümünde etkileşimli 3D model bulunur.</strong>' +
          '<p>PDF/yazdırma görünümünde ana mimari açıklamalar metin halinde korunur.</p>' +
        '</div>' +
      '</section>';
  }

  function selectAnnotation(id, focusCamera) {
    const item = annotations.find((entry) => entry.id === String(id));
    const viewer = document.getElementById('ic8000-viewer');
    if (!item || !viewer) return;

    document.querySelectorAll('#' + ROOT_ID + ' [data-annotation-id]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.getAttribute('data-annotation-id') === item.id);
    });
    document.querySelectorAll('#' + ROOT_ID + ' [data-annotation-target]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.getAttribute('data-annotation-target') === item.id);
    });

    const title = document.getElementById('ic8000-info-title');
    const body = document.getElementById('ic8000-info-body');
    if (title) title.textContent = item.id + '. ' + item.title;
    if (body) body.textContent = item.body;

    if (focusCamera) {
      viewer.cameraTarget = item.position;
      viewer.autoRotate = false;
    }
  }

  function wireInteractions() {
    const block = document.getElementById(ROOT_ID);
    const viewer = document.getElementById('ic8000-viewer');
    const stage = document.getElementById('ic8000-stage');
    if (!block || !viewer || !stage) return;

    block.querySelectorAll('[data-annotation-id]').forEach((button) => {
      button.addEventListener('click', () => selectAnnotation(button.getAttribute('data-annotation-id'), false));
    });

    block.querySelectorAll('[data-annotation-target]').forEach((button) => {
      button.addEventListener('click', () => selectAnnotation(button.getAttribute('data-annotation-target'), true));
    });

    const reset = document.getElementById('ic8000-reset');
    if (reset) {
      reset.addEventListener('click', () => {
        viewer.cameraTarget = '0m 0m 0m';
        viewer.cameraOrbit = '35deg 68deg 145%';
        viewer.fieldOfView = '30deg';
        viewer.autoRotate = true;
        selectAnnotation('1', false);
      });
    }

    const fullscreen = document.getElementById('ic8000-fullscreen');
    if (fullscreen) {
      fullscreen.addEventListener('click', async () => {
        try {
          if (!document.fullscreenElement && stage.requestFullscreen) {
            await stage.requestFullscreen();
          } else if (document.exitFullscreen) {
            await document.exitFullscreen();
          }
        } catch (_) {
          /* Fullscreen is a progressive enhancement. */
        }
      });
    }

    viewer.addEventListener('error', () => {
      const title = document.getElementById('ic8000-info-title');
      const body = document.getElementById('ic8000-info-body');
      if (title) title.textContent = '3D model yüklenemedi';
      if (body) body.textContent = 'Model dosyasının yayın yolu veya tarayıcı WebGL desteği kontrol edilmelidir.';
      block.classList.add('has-model-error');
    });

    selectAnnotation('1', false);
  }

  function inject() {
    if (document.getElementById(ROOT_ID)) return true;
    const chapter = findChapter02();
    if (!chapter) return false;

    const holder = document.createElement('div');
    holder.innerHTML = buildMarkup();
    chapter.appendChild(holder.firstElementChild);

    if (window.customElements && customElements.whenDefined) {
      customElements.whenDefined('model-viewer').then(wireInteractions).catch(wireInteractions);
    } else {
      wireInteractions();
    }
    return true;
  }

  function start() {
    if (inject()) return;
    const root = document.getElementById('chapters');
    if (!root || !window.MutationObserver) {
      window.setTimeout(inject, 800);
      return;
    }

    const observer = new MutationObserver(() => {
      if (inject()) observer.disconnect();
    });
    observer.observe(root, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 12000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
