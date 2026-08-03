(function () {
  'use strict';

  const CONFIG = {
    maxScreens: 28,
    maxRackEnhancements: 220,
    maxPixelRatioDesktop: 2,
    maxPixelRatioMobile: 1.35,
    retryCount: 240,
    retryDelayMs: 100
  };

  const state = {
    installed: false,
    leds: [],
    screens: [],
    rackCount: 0,
    lastScaleUpdate: 0,
    reducedMotion: Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches),
    mobile: Boolean(window.matchMedia && window.matchMedia('(max-width: 900px)').matches)
  };

  function lexical(name) {
    try {
      return (0, eval)('typeof ' + name + ' !== "undefined" ? ' + name + ' : undefined');
    } catch (_error) {
      return undefined;
    }
  }

  function resolveEngine() {
    return {
      THREE: window.THREE || lexical('THREE'),
      scene: window.__KAYAS_SCENE__ || lexical('scene'),
      renderer: window.__KAYAS_RENDERER__ || lexical('renderer'),
      camera: window.__KAYAS_CAMERA__ || lexical('camera'),
      canvas: document.getElementById('scene')
    };
  }

  function seededValue(text) {
    let value = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      value ^= text.charCodeAt(index);
      value = Math.imul(value, 16777619);
    }
    return (value >>> 0) / 4294967295;
  }

  function materialList(object) {
    if (!object || !object.material) return [];
    return Array.isArray(object.material) ? object.material.filter(Boolean) : [object.material];
  }

  function createBadgeMaterial(THREE) {
    if (state.badgeMaterial) return state.badgeMaterial;
    const canvas = document.createElement('canvas');
    canvas.width = 384;
    canvas.height = 112;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(4,12,22,.92)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = 'rgba(255,255,255,.16)';
    context.lineWidth = 4;
    context.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);
    context.fillStyle = '#e31b23';
    context.font = '900 67px Arial Black, Arial, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('H3C', canvas.width / 2, canvas.height / 2 + 2);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    state.badgeMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      toneMapped: false,
      side: THREE.DoubleSide
    });
    return state.badgeMaterial;
  }

  function tuneRenderer(engine) {
    const { THREE, renderer } = engine;
    if (!renderer || !THREE) return;
    renderer.setPixelRatio(Math.min(
      window.devicePixelRatio || 1,
      state.mobile ? CONFIG.maxPixelRatioMobile : CONFIG.maxPixelRatioDesktop
    ));
    if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
    if ('toneMapping' in renderer) renderer.toneMapping = THREE.ACESFilmicToneMapping;
    if ('toneMappingExposure' in renderer) {
      renderer.toneMappingExposure = document.body.classList.contains('is-night') ? 1.08 : 1.0;
    }
    if (renderer.shadowMap) {
      renderer.shadowMap.enabled = !state.mobile;
      if (!state.mobile) renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
  }

  function tuneSceneMaterials(engine) {
    const { scene } = engine;
    if (!scene) return;
    let casters = 0;
    scene.traverse(function (object) {
      if (!object || !object.isMesh) return;
      const name = String(object.name || '').toLowerCase();
      materialList(object).forEach(function (material) {
        if (typeof material.roughness === 'number') {
          if (/rack|cabinet|metal|chiller|cooler|outdoor|unit/.test(name)) {
            material.roughness = Math.min(material.roughness, 0.34);
            material.metalness = Math.max(material.metalness || 0, 0.48);
          } else if (/floor|tile|terrace/.test(name)) {
            material.roughness = Math.min(Math.max(material.roughness, 0.44), 0.64);
          } else if (/wall|partition|room/.test(name)) {
            material.roughness = Math.max(material.roughness, 0.68);
          }
          material.needsUpdate = true;
        }
      });
      if (!state.mobile) {
        object.receiveShadow = /floor|wall|terrace|roof|table|desk/.test(name);
        if (casters < 850 && /rack|cabinet|wall|door|table|chair|unit|chiller|cooler/.test(name)) {
          object.castShadow = true;
          casters += 1;
        }
      }
    });
  }

  function installLighting(engine) {
    const { THREE, scene } = engine;
    if (!THREE || !scene) return;
    if (!scene.getObjectByName('kayas-v19-hemisphere')) {
      const hemi = new THREE.HemisphereLight(
        0xcce8ff,
        0x07111c,
        document.body.classList.contains('is-night') ? 0.56 : 0.72
      );
      hemi.name = 'kayas-v19-hemisphere';
      scene.add(hemi);
    }
    if (!scene.getObjectByName('kayas-v19-key-light')) {
      const key = new THREE.DirectionalLight(
        0xfff1d7,
        document.body.classList.contains('is-night') ? 1.12 : 0.9
      );
      key.name = 'kayas-v19-key-light';
      key.position.set(-28, 46, -18);
      key.castShadow = !state.mobile;
      if (key.shadow) {
        key.shadow.mapSize.set(state.mobile ? 512 : 2048, state.mobile ? 512 : 2048);
        key.shadow.camera.near = 2;
        key.shadow.camera.far = 160;
        key.shadow.bias = -0.00035;
      }
      scene.add(key);
    }
    if (!scene.getObjectByName('kayas-v19-fill-light')) {
      const fill = new THREE.DirectionalLight(0x74c6ff, 0.46);
      fill.name = 'kayas-v19-fill-light';
      fill.position.set(38, 24, 32);
      scene.add(fill);
    }
  }

  function cloneLedMaterial(object, kind) {
    if (!object.material || Array.isArray(object.material)) return null;
    const material = object.material.clone();
    object.material = material;
    const seed = seededValue(String(object.name || kind) + '|' + object.id);
    const amber = kind === 'amber';
    state.leds.push({
      material: material,
      phase: seed * Math.PI * 2,
      speed: 0.55 + seed * 1.85,
      minimum: amber ? 0.12 : 0.38,
      maximum: amber ? 2.8 : 2.45,
      amber: amber
    });
    return material;
  }

  function addRackEnhancement(engine, rack) {
    if (state.rackCount >= CONFIG.maxRackEnhancements || rack.getObjectByName('kayas-v19-rack-detail')) return;
    const { THREE } = engine;
    if (!THREE || !rack.geometry) return;
    rack.geometry.computeBoundingBox();
    const box = rack.geometry.boundingBox;
    if (!box) return;
    const width = Math.max(0.2, box.max.x - box.min.x);
    const height = Math.max(0.7, box.max.y - box.min.y);
    const depth = Math.max(0.3, box.max.z - box.min.z);
    const group = new THREE.Group();
    group.name = 'kayas-v19-rack-detail';
    const frontZ = box.min.z - 0.012;

    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x131b26,
      roughness: 0.28,
      metalness: 0.72
    });
    const meshMaterial = new THREE.MeshStandardMaterial({
      color: 0x07101a,
      roughness: 0.4,
      metalness: 0.56
    });
    const slotMaterial = new THREE.MeshStandardMaterial({
      color: 0x354252,
      roughness: 0.34,
      metalness: 0.65
    });

    const front = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.84, height * 0.86, 0.028),
      meshMaterial
    );
    front.position.set(0, 0, frontZ);
    front.castShadow = !state.mobile;
    group.add(front);

    for (let index = 0; index < 12; index += 1) {
      const y = -height * 0.36 + index * (height * 0.72 / 11);
      const slot = new THREE.Mesh(
        new THREE.BoxGeometry(width * 0.7, Math.max(0.006, height * 0.008), 0.018),
        slotMaterial
      );
      slot.position.set(-width * 0.03, y, frontZ - 0.022);
      group.add(slot);

      if (index % 2 === 0) {
        const color = index % 4 === 0 ? 0x45e58c : 0x3aa7ff;
        const emissive = index % 4 === 0 ? 0x00c567 : 0x197dff;
        const ledMaterial = new THREE.MeshStandardMaterial({
          color: color,
          emissive: emissive,
          emissiveIntensity: 1.4,
          roughness: 0.18,
          metalness: 0.1
        });
        const led = new THREE.Mesh(
          new THREE.BoxGeometry(width * 0.035, height * 0.016, 0.022),
          ledMaterial
        );
        led.name = 'kayas-v19-server-status-led';
        led.position.set(width * 0.33, y, frontZ - 0.034);
        group.add(led);
        cloneLedMaterial(led, index === 8 ? 'amber' : 'status');
      }
    }

    const warningMaterial = new THREE.MeshStandardMaterial({
      color: 0xffc75a,
      emissive: 0xe28a00,
      emissiveIntensity: 0.9,
      roughness: 0.2
    });
    const warning = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.027, height * 0.015, 0.024),
      warningMaterial
    );
    warning.name = 'kayas-v19-server-warning-led';
    warning.position.set(width * 0.26, height * 0.08, frontZ - 0.035);
    group.add(warning);
    cloneLedMaterial(warning, 'amber');

    const badge = new THREE.Mesh(
      new THREE.PlaneGeometry(width * 0.38, height * 0.075),
      createBadgeMaterial(THREE)
    );
    badge.position.set(-width * 0.16, height * 0.39, frontZ - 0.042);
    badge.rotation.y = Math.PI;
    group.add(badge);

    rack.add(group);
    state.rackCount += 1;
  }

  function enhanceRacks(engine) {
    const { scene } = engine;
    if (!scene) return;
    scene.traverse(function (object) {
      if (!object || !object.isMesh) return;
      const name = String(object.name || '').toLowerCase();
      if (/rack-body|cabinet-body/.test(name)) addRackEnhancement(engine, object);
    });
  }

  function dashboardTitle(name, index) {
    const key = String(name || '').toLowerCase();
    if (/meeting|presentation|board/.test(key)) return 'TOPLANTI · CANLI SUNUM';
    if (/noc|monitor|operation/.test(key)) return 'NOC · LIVE OPERATIONS';
    return index % 2 === 0 ? 'CAPACITY · PUE · POWER' : 'SECURITY · COOLING · SLA';
  }

  function makeLiveScreen(engine, object, index) {
    const { THREE } = engine;
    if (!object.material || Array.isArray(object.material)) return;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    const material = object.material.clone();
    material.map = texture;
    if ('emissiveMap' in material) material.emissiveMap = texture;
    if ('emissive' in material) material.emissive = new THREE.Color(0x4aa6ff);
    if ('emissiveIntensity' in material) material.emissiveIntensity = 1.05;
    material.toneMapped = false;
    material.needsUpdate = true;
    object.material = material;
    state.screens.push({
      canvas: canvas,
      context: canvas.getContext('2d'),
      texture: texture,
      title: dashboardTitle(object.name, index),
      seed: seededValue(String(object.name || 'screen') + '|' + object.id),
      index: index,
      lastFrame: -1
    });
  }

  function installLiveScreens(engine) {
    const { scene } = engine;
    if (!scene) return;
    const pattern = /(screen|dashboard|display|monitor|presentation)/i;
    let count = 0;
    scene.traverse(function (object) {
      if (count >= CONFIG.maxScreens || !object || !object.isMesh || !pattern.test(String(object.name || ''))) return;
      if (!object.geometry || !object.material || Array.isArray(object.material)) return;
      const type = String(object.geometry.type || '');
      if (!/PlaneGeometry|BoxGeometry/.test(type)) return;
      makeLiveScreen(engine, object, count);
      count += 1;
    });
  }

  function drawDashboard(item, now) {
    const frame = Math.floor(now / 180);
    if (frame === item.lastFrame) return;
    item.lastFrame = frame;
    const context = item.context;
    const width = item.canvas.width;
    const height = item.canvas.height;
    const phase = now * 0.001 * (0.58 + item.seed * 0.82) + item.seed * 8;
    const accent = item.index % 3 === 0 ? '#45d5d2' : item.index % 3 === 1 ? '#5b9cff' : '#72e39b';
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#061321');
    gradient.addColorStop(1, '#0b2944');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'rgba(255,255,255,.045)';
    for (let x = 0; x < width; x += 32) context.fillRect(x, 0, 1, height);
    for (let y = 0; y < height; y += 32) context.fillRect(0, y, width, 1);

    context.textAlign = 'left';
    context.font = '700 21px Arial';
    context.fillStyle = '#eef7ff';
    context.fillText(item.title, 24, 36);
    context.font = '600 13px Arial';
    context.fillStyle = accent;
    context.fillText('KAYAS · SPECBRIDGE AI · H3C', 24, 60);
    context.textAlign = 'right';
    context.fillStyle = '#9fb5c8';
    context.fillText(new Date().toLocaleTimeString('tr-TR', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }), width - 24, 34);
    context.textAlign = 'left';

    context.strokeStyle = accent;
    context.lineWidth = 4;
    context.beginPath();
    for (let x = 24; x <= width - 24; x += 8) {
      const ratio = (x - 24) / (width - 48);
      const y = 154 - Math.sin(phase + ratio * 8) * 24 - Math.sin(phase * 0.47 + ratio * 17) * 11;
      if (x === 24) context.moveTo(x, y); else context.lineTo(x, y);
    }
    context.stroke();

    const values = [
      62 + Math.round(Math.sin(phase) * 8),
      (1.28 + Math.sin(phase * 0.6) * 0.035).toFixed(2),
      '99.99%'
    ];
    const labels = ['ORTALAMA YÜK', 'PUE', 'ERİŞİLEBİLİRLİK'];
    for (let index = 0; index < 3; index += 1) {
      const x = 24 + index * 158;
      context.fillStyle = 'rgba(91,156,255,.12)';
      context.fillRect(x, 194, 142, 44);
      context.font = '700 10px Arial';
      context.fillStyle = '#8fa9bf';
      context.fillText(labels[index], x + 10, 211);
      context.font = '800 17px Arial';
      context.fillStyle = index === 2 ? '#72e39b' : '#ffffff';
      context.fillText(String(values[index]) + (index === 0 ? '%' : ''), x + 10, 232);
    }

    context.fillStyle = Math.sin(phase * 2.1) > -0.35 ? '#4bd08b' : '#ffc75a';
    context.beginPath();
    context.arc(width - 26, 57, 5, 0, Math.PI * 2);
    context.fill();
    item.texture.needsUpdate = true;
  }

  function installDynamicScale(engine) {
    const { THREE, camera, canvas } = engine;
    const line = document.getElementById('scaleLine');
    const middle = document.getElementById('scaleMid');
    const maximum = document.getElementById('scaleMax');
    if (!THREE || !camera || !canvas || !line || !middle || !maximum) return null;
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const pointA = new THREE.Vector3();
    const pointB = new THREE.Vector3();

    function screenToGround(x, y, target) {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      const ndc = new THREE.Vector2((x / rect.width) * 2 - 1, -(y / rect.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      return raycaster.ray.intersectPlane(plane, target);
    }

    function niceScale(metersPerPixel, idealPixels) {
      const target = Math.max(0.05, metersPerPixel * idealPixels);
      const exponent = Math.floor(Math.log10(target));
      let best = target;
      let score = Infinity;
      for (let exp = exponent - 1; exp <= exponent + 1; exp += 1) {
        const power = Math.pow(10, exp);
        [1, 2, 5].forEach(function (factor) {
          const value = factor * power;
          const pixels = value / metersPerPixel;
          if (pixels < 64 || pixels > 190) return;
          const candidate = Math.abs(pixels - idealPixels);
          if (candidate < score) {
            best = value;
            score = candidate;
          }
        });
      }
      return best;
    }

    return function updateScale(force) {
      const now = performance.now();
      if (!force && now - state.lastScaleUpdate < 160) return;
      state.lastScaleUpdate = now;
      const rect = canvas.getBoundingClientRect();
      const y = Math.max(20, rect.height - 70);
      const xA = Math.max(20, rect.width - 220);
      const samplePixels = 100;
      if (!screenToGround(xA, y, pointA) || !screenToGround(xA + samplePixels, y, pointB)) return;
      const metersPerPixel = pointA.distanceTo(pointB) / samplePixels;
      if (!Number.isFinite(metersPerPixel) || metersPerPixel <= 0) return;
      const meters = niceScale(metersPerPixel, 126);
      const pixels = Math.max(64, Math.min(190, meters / metersPerPixel));
      line.style.width = pixels.toFixed(1) + 'px';
      middle.textContent = String(Number((meters / 2).toPrecision(3)));
      maximum.textContent = String(Number(meters.toPrecision(3))) + ' m';
    };
  }

  function installBadge() {
    if (document.querySelector('.render-quality-badge')) return;
    const app = document.getElementById('app');
    if (!app) return;
    const badge = document.createElement('div');
    badge.className = 'render-quality-badge';
    badge.innerHTML = '<i></i><span>Canlı 3D · PBR · Dinamik ekranlar</span>';
    app.appendChild(badge);
  }

  function animate(engine, updateScale, now) {
    if (!state.reducedMotion) {
      const seconds = now * 0.001;
      state.leds.forEach(function (led) {
        let wave = 0.5 + 0.5 * Math.sin(seconds * led.speed + led.phase);
        if (led.amber) wave = Math.pow(Math.max(0, wave - 0.38) / 0.62, 3);
        if (typeof led.material.emissiveIntensity === 'number') {
          led.material.emissiveIntensity = led.minimum + (led.maximum - led.minimum) * wave;
        }
      });
      state.screens.forEach(function (screen) { drawDashboard(screen, now); });
    }
    if (updateScale) updateScale(false);
    window.requestAnimationFrame(function (time) { animate(engine, updateScale, time); });
  }

  function install(engine) {
    if (state.installed) return;
    state.installed = true;
    tuneRenderer(engine);
    tuneSceneMaterials(engine);
    installLighting(engine);
    enhanceRacks(engine);
    installLiveScreens(engine);
    const updateScale = installDynamicScale(engine);
    installBadge();

    const themeObserver = new MutationObserver(function () {
      tuneRenderer(engine);
      if (updateScale) updateScale(true);
    });
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('resize', function () { if (updateScale) updateScale(true); });
    if (updateScale) updateScale(true);
    window.requestAnimationFrame(function (time) { animate(engine, updateScale, time); });

    window.__KAYAS_V19_VISUAL_READY = true;
    window.__KAYAS_V19_COUNTS = {
      racks: state.rackCount,
      leds: state.leds.length,
      screens: state.screens.length
    };
    console.info('[KAYAS v19] visual runtime active', window.__KAYAS_V19_COUNTS);
  }

  function bootstrap(remaining) {
    const engine = resolveEngine();
    if (engine.THREE && engine.scene && engine.renderer && engine.camera && engine.canvas) {
      install(engine);
      return;
    }
    if (remaining <= 0) {
      window.__KAYAS_V19_VISUAL_ERROR = '3D motor bağlamı dış görsel katmana açılmadı.';
      console.error('[KAYAS v19]', window.__KAYAS_V19_VISUAL_ERROR, engine);
      return;
    }
    window.setTimeout(function () { bootstrap(remaining - 1); }, CONFIG.retryDelayMs);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { bootstrap(CONFIG.retryCount); });
  } else {
    bootstrap(CONFIG.retryCount);
  }
})();
