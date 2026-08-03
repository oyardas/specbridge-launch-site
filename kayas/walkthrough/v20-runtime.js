(function () {
  'use strict';

  const VERSION = '20260803-v20-cinematic';
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
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.fill();
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
          