(function () {
  'use strict';

  const VERSION = '20260803-v20-1-cinematic';
  const CONFIG = {
    maxScreensDesktop: 32,
    maxScreensMobile: 16,
    maxRackEnhancementsDesktop: 220,
    maxRackEnhancementsMobile: 100,
    maxPixelRatioDesktop: 2,
    maxPixelRatioMobile: 1.35,
    retryCount: 260,
    retryDelayMs: 100,
    dashboardSources: [
      'assets/dashboard/h3c-dashboard-3d.webp?v=' + VERSION,
      'assets/dashboard/h3c-dashboard-2d.webp?v=' + VERSION
    ]
  };

  const state = {
    installed: false,
    mobile: Boolean(window.matchMedia && window.matchMedia('(max-width: 900px)').matches),
    reducedMotion: Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches),
    leds: [],
    screens: [],
    rackCount: 0,
    screenCount: 0,
    materialsTuned: 0,
    lightsAdded: 0,
    dashboardImages: [],
    textures: {},
    lastScaleUpdate: 0,
    lastScreenFrame: 0
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

  function loadImage(src) {
    return new Promise(function (resolve) {
      const image = new Image();
      image.decoding = 'async';
      image.onload = function () { resolve(image); };
      image.onerror = function () {
        console.warn('[KAYAS v20] dashboard image unavailable:', src);
        resolve(null);
      };
      image.src = src;
    });
  }

  function preloadDashboardImages() {
    return Promise.all(CONFIG.dashboardSources.map(loadImage)).then(function (images) {
      state.dashboardImages = images.filter(Boolean);
      return state.dashboardImages;
    });
  }

  function canvasTexture(THREE, width, height, draw) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    draw(context, width, height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    return texture;
  }

  function buildProceduralTextures(THREE) {
    if (state.textures.tile) return state.textures;

    state.textures.tile = canvasTexture(THREE, 512, 512, function (ctx, width, height) {
      ctx.fillStyle = '#dfe5e9';
      ctx.fillRect(0, 0, width, height);
      const size = 64;
      for (let y = 0; y < height; y += size) {
        for (let x = 0; x < width; x += size) {
          const even = ((x / size) + (y / size)) % 2 === 0;
          ctx.fillStyle = even ? '#e8edef' : '#d9e0e4';
          ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
          const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
          gradient.addColorStop(0, 'rgba(255,255,255,.18)');
          gradient.addColorStop(1, 'rgba(91,108,121,.08)');
          ctx.fillStyle = gradient;
          ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
        }
      }
      ctx.strokeStyle = 'rgba(77,93,105,.18)';
      ctx.lineWidth = 2;
      for (let i = 0; i <= width; i += size) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
      }
    });

    state.textures.concrete = canvasTexture(THREE, 512, 512, function (ctx, width, height) {
      const image = ctx.createImageData(width, height);
      for (let index = 0; index < image.data.length; index += 4) {
        const noise = 188 + Math.floor(Math.random() * 22);
        image.data[index] = noise;
        image.data[index + 1] = noise + 2;
        image.data[index + 2] = noise + 4;
        image.data[index + 3] = 255;
      }
      ctx.putImageData(image, 0, 0);
      ctx.fillStyle = 'rgba(255,255,255,.10)';
      for (let i = 0; i < 60; i += 1) {
        ctx.fillRect(Math.random() * width, Math.random() * height, Math.random() * 80, 1);
      }
    });

    state.textures.perforated = canvasTexture(THREE, 256, 256, function (ctx, width, height) {
      ctx.fillStyle = '#080d13';
      ctx.fillRect(0, 0, width, height);
      for (let y = 7; y < height; y += 10) {
        for (let x = 7; x < width; x += 10) {
          ctx.fillStyle = 'rgba(91,125,151,.34)';
          ctx.beginPath();
          ctx.arc(x, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, 'rgba(255,255,255,.05)');
      gradient.addColorStop(.5, 'rgba(255,255,255,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,.22)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    });

    state.textures.brushedMetal = canvasTexture(THREE, 512, 256, function (ctx, width, height) {
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#18222d');
      gradient.addColorStop(.18, '#2e3945');
      gradient.addColorStop(.5, '#101820');
      gradient.addColorStop(.82, '#303b47');
      gradient.addColorStop(1, '#131c25');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = .12;
      for (let x = 0; x < width; x += 3) {
        ctx.fillStyle = x % 9 === 0 ? '#ffffff' : '#000000';
        ctx.fillRect(x, 0, 1, height);
      }
      ctx.globalAlpha = 1;
    });

    return state.textures;
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
    if ('toneMappingExposure' in renderer) renderer.toneMappingExposure = document.body.classList.contains('is-night') ? 1.18 : 1.03;
    if (renderer.shadowMap) {
      renderer.shadowMap.enabled = !state.mobile;
      renderer.shadowMap.autoUpdate = true;
      if (!state.mobile) renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    if ('physicallyCorrectLights' in renderer) renderer.physicallyCorrectLights = true;
  }

  function textureForObject(texture, object, repeatBase) {
    if (!texture || !object || !object.geometry) return texture;
    const clone = texture.clone();
    clone.needsUpdate = true;
    clone.wrapS = clone.wrapT = window.THREE.RepeatWrapping;
    object.geometry.computeBoundingBox();
    const box = object.geometry.boundingBox;
    if (box) {
      const width = Math.max(.5, box.max.x - box.min.x);
      const depth = Math.max(.5, box.max.z - box.min.z);
      clone.repeat.set(Math.max(1, width / repeatBase), Math.max(1, depth / repeatBase));
    }
    return clone;
  }

  function replaceGlassMaterial(THREE, object, original) {
    const color = original && original.color ? original.color.clone() : new THREE.Color(0xbcd8e8);
    const material = new THREE.MeshPhysicalMaterial({
      color: color,
      transparent: true,
      opacity: document.body.classList.contains('is-night') ? .27 : .34,
      transmission: .46,
      thickness: .08,
      roughness: .08,
      metalness: 0,
      clearcoat: .72,
      clearcoatRoughness: .12,
      side: THREE.DoubleSide,
      depthWrite: false,
      envMapIntensity: .85
    });
    material.name = 'kayas-v20-glass';
    object.material = material;
  }

  function tuneSceneMaterials(engine) {
    const { THREE, scene } = engine;
    if (!THREE || !scene) return;
    const textures = buildProceduralTextures(THREE);
    let casters = 0;

    scene.traverse(function (object) {
      if (!object || !object.isMesh) return;
      const name = String(object.name || '').toLowerCase();
      const zone = String(object.userData && object.userData.zoneId || '').toLowerCase();
      const materials = materialList(object);
      if (!materials.length) return;

      if (/glass|observation|facade/.test(name) && !/screen/.test(name)) {
        replaceGlassMaterial(THREE, object, materials[0]);
        state.materialsTuned += 1;
        return;
      }

      materials.forEach(function (material) {
        if (!material || material.userData && material.userData.kayasV20Tuned) return;
        if (!material.userData) material.userData = {};
        material.userData.kayasV20Tuned = true;

        if (/floorplate|closed-floor|raised-floor|floor-grid|east-terrace-floor|entry-floor|road|walkway/.test(name)) {
          if (/road|walkway|terrace/.test(name)) {
            material.map = textureForObject(textures.concrete, object, 5.5);
            material.color = new THREE.Color(/terrace/.test(name) ? 0xc8d0d5 : 0xb9c0c6);
            material.roughness = .72;
            material.metalness = .02;
          } else {
            material.map = textureForObject(textures.tile, object, 4.2);
            material.color = new THREE.Color(0xffffff);
            material.roughness = .48;
            material.metalness = .03;
          }
          material.needsUpdate = true;
          state.materialsTuned += 1;
        } else if (/rack|cabinet|battery|fiber|outdoor-unit|chiller|cooler|metal|mullion|rail|duct/.test(name)) {
          material.map = /rack-front|rack-body|battery-front|fiber-rack/.test(name) ? textures.brushedMetal : material.map;
          material.color = new THREE.Color(/rack|cabinet|battery|fiber/.test(name) ? 0x141d27 : 0x68737d);
          material.roughness = /rack|cabinet/.test(name) ? .25 : .37;
          material.metalness = /rack|cabinet|metal|mullion|rail|unit/.test(name) ? .72 : .48;
          material.envMapIntensity = 1.05;
          material.needsUpdate = true;
          state.materialsTuned += 1;
        } else if (/wall|partition|ceiling|room/.test(name)) {
          material.color = new THREE.Color(document.body.classList.contains('is-night') ? 0xc8d1d8 : 0xe9ecee);
          material.roughness = .76;
          material.metalness = 0;
          material.needsUpdate = true;
          state.materialsTuned += 1;
        } else if (/desk|table|counter|bench|chair/.test(name)) {
          if (/desk-top|conference-table|coffee-table|counter/.test(name)) {
            material.color = new THREE.Color(0x6c5541);
            material.roughness = .42;
            material.metalness = .06;
          } else {
            material.color = new THREE.Color(0x263544);
            material.roughness = .5;
            material.metalness = .22;
          }
          material.needsUpdate = true;
          state.materialsTuned += 1;
        } else if (/linear-light|desk-led|mantrap-led|blue-led|screen-top-led/.test(name)) {
          if ('emissive' in material) material.emissive = new THREE.Color(0x4daeff);
          if ('emissiveIntensity' in material) material.emissiveIntensity = 2.1;
          material.toneMapped = false;
          material.needsUpdate = true;
        }
      });

      if (!state.mobile) {
        object.receiveShadow = /floor|wall|terrace|road|table|desk|counter/.test(name);
        if (casters < 1150 && /rack|cabinet|wall|door|table|chair|unit|chiller|cooler|desk|counter/.test(name)) {
          object.castShadow = true;
          casters += 1;
        }
      }

      if (/ic8000_datahall|noc_management|future_foyer_expansion/.test(zone)) {
        object.userData.kayasV20PriorityZone = true;
      }
    });
  }

  function zoneCenters(scene) {
    const zones = new Map();
    const point = new window.THREE.Vector3();
    scene.traverse(function (object) {
      const zoneId = object && object.userData && object.userData.zoneId;
      if (!zoneId || !object.isMesh) return;
      object.getWorldPosition(point);
      if (!zones.has(zoneId)) zones.set(zoneId, { x: 0, y: 0, z: 0, count: 0 });
      const entry = zones.get(zoneId);
      entry.x += point.x; entry.y += point.y; entry.z += point.z; entry.count += 1;
    });
    zones.forEach(function (entry) {
      entry.x /= entry.count; entry.y /= entry.count; entry.z /= entry.count;
    });
    return zones;
  }

  function installLighting(engine) {
    const { THREE, scene } = engine;
    if (!THREE || !scene) return;

    const existingHemi = scene.getObjectByName('kayas-v20-hemisphere');
    if (!existingHemi) {
      const hemi = new THREE.HemisphereLight(0xd9ecff, 0x101722, document.body.classList.contains('is-night') ? .74 : .92);
      hemi.name = 'kayas-v20-hemisphere';
      scene.add(hemi);
      state.lightsAdded += 1;
    }

    if (!scene.getObjectByName('kayas-v20-key')) {
      const key = new THREE.DirectionalLight(0xfff4df, document.body.classList.contains('is-night') ? 1.45 : 1.12);
      key.name = 'kayas-v20-key';
      key.position.set(-34, 58, -22);
      key.castShadow = !state.mobile;
      if (key.shadow) {
        key.shadow.mapSize.set(state.mobile ? 512 : 2048, state.mobile ? 512 : 2048);
        key.shadow.camera.near = 1;
        key.shadow.camera.far = 190;
        key.shadow.camera.left = -70;
        key.shadow.camera.right = 70;
        key.shadow.camera.top = 80;
        key.shadow.camera.bottom = -80;
        key.shadow.bias = -0.00025;
        key.shadow.normalBias = .02;
      }
      scene.add(key);
      state.lightsAdded += 1;
    }

    if (!scene.getObjectByName('kayas-v20-fill')) {
      const fill = new THREE.DirectionalLight(0x74c8ff, .58);
      fill.name = 'kayas-v20-fill';
      fill.position.set(42, 26, 34);
      scene.add(fill);
      state.lightsAdded += 1;
    }

    if (!state.mobile) {
      const centers = zoneCenters(scene);
      [
        ['entry_security', 0xffe9ca, 90],
        ['future_foyer_expansion', 0xffe9ce, 115],
        ['noc_management', 0x9ed7ff, 80],
        ['ic8000_datahall', 0x98d6ff, 125]
      ].forEach(function (definition, index) {
        const center = centers.get(definition[0]);
        if (!center || scene.getObjectByName('kayas-v20-zone-light-' + index)) return;
        const light = new THREE.PointLight(definition[1], definition[2], 34, 2);
        light.name = 'kayas-v20-zone-light-' + index;
        light.position.set(center.x, 7.2, center.z);
        light.castShadow = false;
        scene.add(light);
        state.lightsAdded += 1;
      });
    }
  }

  function createBadgeMaterial(THREE) {
    if (state.badgeMaterial) return state.badgeMaterial;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 144;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#090f16');
    gradient.addColorStop(.55, '#111b26');
    gradient.addColorStop(1, '#05090e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255,255,255,.18)';
    ctx.lineWidth = 4;
    ctx.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);
    ctx.fillStyle = '#e31b23';
    ctx.font = '900 84px Arial Black, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('H3C', canvas.width / 2, canvas.height / 2 + 3);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    state.badgeMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false, side: THREE.DoubleSide });
    return state.badgeMaterial;
  }

  function registerLed(material, object, type, seedText) {
    const seed = seededValue(seedText + '|' + object.id);
    state.leds.push({
      material: material,
      phase: seed * Math.PI * 2,
      speed: type === 'amber' ? .46 + seed * .92 : .72 + seed * 2.15,
      minimum: type === 'amber' ? .05 : .34,
      maximum: type === 'amber' ? 3.4 : 2.7,
      type: type,
      seed: seed
    });
  }

  function addProfessionalRackFront(engine, rack, rackIndex) {
    const max = state.mobile ? CONFIG.maxRackEnhancementsMobile : CONFIG.maxRackEnhancementsDesktop;
    if (state.rackCount >= max || rack.getObjectByName('kayas-v20-rack-detail')) return;
    const { THREE } = engine;
    if (!THREE || !rack.geometry) return;

    rack.geometry.computeBoundingBox();
    const box = rack.geometry.boundingBox;
    if (!box) return;
    const width = Math.max(.3, box.max.x - box.min.x);
    const height = Math.max(.8, box.max.y - box.min.y);
    const frontZ = box.min.z - .018;
    const group = new THREE.Group();
    group.name = 'kayas-v20-rack-detail';

    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x1b2631, roughness: .22, metalness: .8, envMapIntensity: 1.2 });
    const doorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0b1118,
      map: state.textures.perforated,
      roughness: .32,
      metalness: .7,
      envMapIntensity: 1.1
    });
    const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0x293746, roughness: .26, metalness: .72 });
    const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x73808d, roughness: .2, metalness: .88 });

    const door = new THREE.Mesh(new THREE.BoxGeometry(width * .82, height * .84, .034), doorMaterial);
    door.position.set(0, 0, frontZ);
    door.castShadow = !state.mobile;
    group.add(door);

    const railWidth = width * .055;
    [-1, 1].forEach(function (side) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(railWidth, height * .9, .055), frameMaterial);
      rail.position.set(side * width * .43, 0, frontZ - .018);
      group.add(rail);
    });
    [-1, 1].forEach(function (side) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(width * .9, height * .035, .055), frameMaterial);
      rail.position.set(0, side * height * .445, frontZ - .018);
      group.add(rail);
    });

    const bladeCount = state.mobile ? 9 : 15;
    for (let index = 0; index < bladeCount; index += 1) {
      const y = -height * .35 + index * (height * .70 / Math.max(1, bladeCount - 1));
      const blade = new THREE.Mesh(new THREE.BoxGeometry(width * .64, Math.max(.018, height * .024), .038), bladeMaterial);
      blade.position.set(-width * .035, y, frontZ - .037);
      group.add(blade);

      const handle = new THREE.Mesh(new THREE.BoxGeometry(width * .12, Math.max(.01, height * .009), .045), handleMaterial);
      handle.position.set(-width * .26, y, frontZ - .063);
      group.add(handle);

      if (index % 2 === 0) {
        const type = index === bladeCount - 3 || (rackIndex + index) % 17 === 0 ? 'amber' : ((rackIndex + index) % 3 === 0 ? 'green' : 'blue');
        const color = type === 'amber' ? 0xffc857 : type === 'green' ? 0x55f49b : 0x48a9ff;
        const emissive = type === 'amber' ? 0xff8a00 : type === 'green' ? 0x00d877 : 0x1788ff;
        const ledMaterial = new THREE.MeshStandardMaterial({ color: color, emissive: emissive, emissiveIntensity: 1.35, roughness: .16, metalness: .08 });
        const led = new THREE.Mesh(new THREE.BoxGeometry(width * .026, height * .014, .05), ledMaterial);
        led.name = 'kayas-v20-led-' + type;
        led.position.set(width * .30, y, frontZ - .069);
        group.add(led);
        registerLed(ledMaterial, led, type, 'rack-' + rackIndex + '-' + index);
      }
    }

    const handle = new THREE.Mesh(new THREE.BoxGeometry(width * .026, height * .34, .06), handleMaterial);
    handle.position.set(width * .36, -height * .03, frontZ - .071);
    group.add(handle);

    const badge = new THREE.Mesh(new THREE.PlaneGeometry(width * .42, height * .075), createBadgeMaterial(THREE));
    badge.position.set(-width * .13, height * .39, frontZ - .077);
    badge.rotation.y = Math.PI;
    group.add(badge);

    const crownMaterial = new THREE.MeshStandardMaterial({ color: 0x151f2a, roughness: .2, metalness: .8 });
    const crown = new THREE.Mesh(new THREE.BoxGeometry(width * .94, height * .055, .14), crownMaterial);
    crown.position.set(0, height * .47, frontZ + .03);
    group.add(crown);

    rack.add(group);
    state.rackCount += 1;
  }

  function enhanceRacks(engine) {
    const { scene } = engine;
    if (!scene) return;
    let index = 0;
    scene.traverse(function (object) {
      if (!object || !object.isMesh) return;
      const name = String(object.name || '').toLowerCase();
      if (name === 'rack-body') {
        addProfessionalRackFront(engine, object, index);
        index += 1;
      }
    });
  }

  function dashboardMode(name, index) {
    const key = String(name || '').toLowerCase();
    if (/briefing|presentation|reception/.test(key)) return 'presentation';
    if (/noc|monitor|mosaic/.test(key)) return 'noc';
    if (/operator/.test(key)) return 'operator';
    return index % 2 ? 'capacity' : 'operations';
  }

  function makeLiveScreen(engine, object, index) {
    const { THREE } = engine;
    if (!object.material || Array.isArray(object.material)) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const material = object.material.clone();
    material.map = texture;
    if ('emissiveMap' in material) material.emissiveMap = texture;
    if ('emissive' in material) material.emissive = new THREE.Color(0x6fb9ff);
    if ('emissiveIntensity' in material) material.emissiveIntensity = 1.25;
    material.toneMapped = false;
    material.needsUpdate = true;
    object.material = material;

    state.screens.push({
      canvas: canvas,
      context: context,
      texture: texture,
      object: object,
      mode: dashboardMode(object.name, index),
      seed: seededValue(String(object.name || 'screen') + '|' + object.id),
      index: index,
      lastFrame: -1
    });
  }

  function installLiveScreens(engine) {
    const { scene } = engine;
    if (!scene) return;
    const maximum = state.mobile ? CONFIG.maxScreensMobile : CONFIG.maxScreensDesktop;
    const pattern = /(screen|dashboard|display|monitor|presentation|mosaic)/i;
    let count = 0;
    scene.traverse(function (object) {
      if (count >= maximum || !object || !object.isMesh || !pattern.test(String(object.name || ''))) return;
      if (!object.geometry || !object.material || Array.isArray(object.material)) return;
      const type = String(object.geometry.type || '');
      if (!/PlaneGeometry|BoxGeometry/.test(type)) return;
      makeLiveScreen(engine, object, count);
      count += 1;
    });
    state.screenCount = count;
  }

  function drawImageCover(ctx, image, width, height, now, seed, alpha) {
    if (!image) return;
    const motion = Math.sin(now * .00018 + seed * 7);
    const zoom = 1.035 + .025 * (0.5 + 0.5 * Math.sin(now * .00013 + seed * 11));
    const imageRatio = image.width / image.height;
    const canvasRatio = width / height;
    let sw = image.width;
    let sh = image.height;
    if (imageRatio > canvasRatio) sw = sh * canvasRatio;
    else sh = sw / canvasRatio;
    sw /= zoom; sh /= zoom;
    const maxX = Math.max(0, image.width - sw);
    const maxY = Math.max(0, image.height - sh);
    const sx = maxX * (.5 + motion * .32);
    const sy = maxY * (.5 + Math.cos(now * .00016 + seed * 5) * .22);
    ctx.globalAlpha = alpha;
    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, width, height);
    ctx.globalAlpha = 1;
  }

  function drawLiveOverlay(item, now) {
    const ctx = item.context;
    const width = item.canvas.width;
    const height = item.canvas.height;
    const phase = now * .001 * (.46 + item.seed * .5) + item.seed * 9;

    const imageCount = state.dashboardImages.length;
    const cycle = now / 9000 + item.seed * 2;
    const baseIndex = imageCount ? Math.floor(cycle) % imageCount : 0;
    const nextIndex = imageCount ? (baseIndex + 1) % imageCount : 0;
    const mix = imageCount > 1 ? .5 - .5 * Math.cos((cycle % 1) * Math.PI) : 0;

    ctx.fillStyle = '#071727';
    ctx.fillRect(0, 0, width, height);
    if (imageCount) {
      drawImageCover(ctx, state.dashboardImages[baseIndex], width, height, now, item.seed, 1);
      if (mix > .02) drawImageCover(ctx, state.dashboardImages[nextIndex], width, height, now + 1300, item.seed + .37, mix);
    }

    const vignette = ctx.createRadialGradient(width * .5, height * .45, width * .12, width * .5, height * .45, width * .7);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,9,18,.48)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    const scanY = (now * .055 + item.index * 37) % height;
    const scan = ctx.createLinearGradient(0, scanY - 22, 0, scanY + 22);
    scan.addColorStop(0, 'rgba(64,190,255,0)');
    scan.addColorStop(.5, 'rgba(64,190,255,.16)');
    scan.addColorStop(1, 'rgba(64,190,255,0)');
    ctx.fillStyle = scan;
    ctx.fillRect(0, scanY - 24, width, 48);

    const title = item.mode === 'presentation' ? 'KAYAS YATIRIMCI SUNUMU' : item.mode === 'noc' ? 'H3C · LIVE OPERATIONS' : item.mode === 'operator' ? 'OPERATÖR SERVİS GÖRÜNÜMÜ' : 'CAPACITY · PUE · POWER';
    ctx.fillStyle = 'rgba(2,14,25,.78)';
    ctx.fillRect(18, 16, width - 36, 54);
    ctx.strokeStyle = 'rgba(70,187,255,.4)';
    ctx.strokeRect(18.5, 16.5, width - 37, 53);
    ctx.font = '800 25px Arial';
    ctx.fillStyle = '#eff8ff';
    ctx.textAlign = 'left';
    ctx.fillText(title, 38, 50);
    ctx.font = '700 15px Arial';
    ctx.fillStyle = '#6ee5df';
    ctx.fillText('SPECBRIDGE AI · H3C IC8000', 38, 92);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#d9e9f6';
    ctx.fillText(new Date().toLocaleTimeString('tr-TR'), width - 38, 50);
    ctx.textAlign = 'left';

    const load = 68 + Math.round(Math.sin(phase) * 7);
    const pue = (1.27 + Math.sin(phase * .53) * .025).toFixed(2);
    const temp = (22.1 + Math.sin(phase * .72) * .8).toFixed(1);
    const cards = [
      ['IT YÜKÜ', load + '%', '#50b5ff'],
      ['PUE', pue, '#60e7b1'],
      ['ORT. SICAKLIK', temp + '°C', '#ffc85a'],
      ['ERİŞİLEBİLİRLİK', '99.99%', '#60e7b1']
    ];
    cards.forEach(function (card, index) {
      const cardWidth = 210;
      const x = 24 + index * (cardWidth + 14);
      const y = height - 82;
      ctx.fillStyle = 'rgba(3,20,34,.84)';
      ctx.fillRect(x, y, cardWidth, 58);
      ctx.strokeStyle = 'rgba(88,165,255,.34)';
      ctx.strokeRect(x + .5, y + .5, cardWidth - 1, 57);
      ctx.font = '700 12px Arial';
      ctx.fillStyle = '#95afc2';
      ctx.fillText(card[0], x + 12, y + 19);
      ctx.font = '900 22px Arial';
      ctx.fillStyle = card[2];
      ctx.fillText(card[1], x + 12, y + 46);
    });

    const alarm = Math.sin(phase * 1.9) > .78;
    ctx.fillStyle = alarm ? '#ffb547' : '#53db94';
    ctx.beginPath();
    ctx.arc(width - 35, 91, 7, 0, Math.PI * 2);
    ctx.fill();
    item.texture.needsUpdate = true;
  }

  function animateLed(led, seconds) {
    let wave = .5 + .5 * Math.sin(seconds * led.speed + led.phase);
    if (led.type === 'amber') {
      const gate = Math.sin(seconds * (.27 + led.seed * .25) + led.phase * .6);
      wave = gate > .72 ? Math.pow((gate - .72) / .28, 1.7) : .03;
    } else if (led.type === 'green') {
      wave = .62 + .38 * Math.sin(seconds * led.speed + led.phase);
    } else {
      wave = .36 + .64 * Math.pow(wave, 1.25);
    }
    if (typeof led.material.emissiveIntensity === 'number') {
      led.material.emissiveIntensity = led.minimum + (led.maximum - led.minimum) * Math.max(0, wave);
    }
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
      const target = Math.max(.05, metersPerPixel * idealPixels);
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
          if (candidate < score) { best = value; score = candidate; }
        });
      }
      return best;
    }

    return function updateScale(force) {
      const now = performance.now();
      if (!force && now - state.lastScaleUpdate < 150) return;
      state.lastScaleUpdate = now;
      const rect = canvas.getBoundingClientRect();
      const y = Math.max(20, rect.height - 70);
      const xA = Math.max(20, rect.width - 230);
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

  function installQualityBadge() {
    const existing = document.querySelector('.render-quality-badge');
    if (existing) existing.remove();
    const app = document.getElementById('app');
    if (!app) return;
    const badge = document.createElement('div');
    badge.className = 'render-quality-badge v20';
    badge.innerHTML = '<i></i><span>Cinematic PBR · H3C canlı ekranlar</span>';
    app.appendChild(badge);
  }

  function tuneBackground(engine) {
    const { THREE, scene } = engine;
    if (!THREE || !scene) return;
    scene.background = new THREE.Color(document.body.classList.contains('is-night') ? 0x0b1825 : 0xd9e5ef);
    if (scene.fog) {
      scene.fog.color.copy(scene.background);
      if ('near' in scene.fog) scene.fog.near = 105;
      if ('far' in scene.fog) scene.fog.far = 235;
    }
  }

  function animate(engine, updateScale, now) {
    const seconds = now * .001;
    if (!state.reducedMotion) {
      state.leds.forEach(function (led) { animateLed(led, seconds); });
      if (now - state.lastScreenFrame > 120) {
        state.lastScreenFrame = now;
        state.screens.forEach(function (screen) { drawLiveOverlay(screen, now); });
      }
    } else if (!state.lastScreenFrame) {
      state.lastScreenFrame = now;
      state.screens.forEach(function (screen) { drawLiveOverlay(screen, now); });
    }
    if (updateScale) updateScale(false);
    window.requestAnimationFrame(function (time) { animate(engine, updateScale, time); });
  }

  function install(engine) {
    if (state.installed) return;
    state.installed = true;
    buildProceduralTextures(engine.THREE);
    tuneRenderer(engine);
    tuneBackground(engine);
    tuneSceneMaterials(engine);
    installLighting(engine);
    enhanceRacks(engine);
    installLiveScreens(engine);
    const updateScale = installDynamicScale(engine);
    installQualityBadge();

    const observer = new MutationObserver(function () {
      tuneRenderer(engine);
      tuneBackground(engine);
      if (updateScale) updateScale(true);
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('resize', function () { if (updateScale) updateScale(true); });
    if (updateScale) updateScale(true);

    window.__KAYAS_V20_VISUAL_READY = true;
    window.__KAYAS_V20_COUNTS = {
      racks: state.rackCount,
      leds: state.leds.length,
      screens: state.screenCount,
      materials: state.materialsTuned,
      lights: state.lightsAdded,
      dashboardImages: state.dashboardImages.length
    };
    console.info('[KAYAS v20] cinematic visual runtime active', window.__KAYAS_V20_COUNTS);
    window.requestAnimationFrame(function (time) { animate(engine, updateScale, time); });
  }

  function bootstrap(remaining) {
    const engine = resolveEngine();
    const modelStable = window.__KAYAS_MODEL_READY === true && window.__KAYAS_MODEL_LOADING_V19 !== true;
    if (engine.THREE && engine.scene && engine.renderer && engine.camera && engine.canvas && modelStable) {
      window.setTimeout(function () {
        preloadDashboardImages().finally(function () { install(resolveEngine()); });
      }, 120);
      return;
    }
    if (remaining <= 0) {
      window.__KAYAS_V20_VISUAL_ERROR = '3D motor bağlamı profesyonel görsel katmana açılamadı.';
      console.error('[KAYAS v20]', window.__KAYAS_V20_VISUAL_ERROR, engine);
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
