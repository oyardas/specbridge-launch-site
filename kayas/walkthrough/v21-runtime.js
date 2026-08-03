(function () {
  'use strict';

  const VERSION = '20260803-v21-professional';
  const state = {
    installed: false,
    replacedPeople: 0,
    replacedPlants: 0,
    enhancedRacks: 0,
    themedMaterials: 0,
    engine: null
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

  function makePhysical(THREE, options) {
    const material = new THREE.MeshPhysicalMaterial(Object.assign({
      roughness: .42,
      metalness: .06,
      clearcoat: .16,
      clearcoatRoughness: .3
    }, options || {}));
    material.userData = material.userData || {};
    material.userData.kayasV21 = true;
    return material;
  }

  function addMesh(parent, geometry, material, position, rotation, name) {
    const mesh = new window.THREE.Mesh(geometry, material);
    mesh.position.set(position[0], position[1], position[2]);
    if (rotation) mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
    mesh.name = name || 'kayas-v21-mesh';
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function addContactShadow(THREE, group, radius) {
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: .20,
      depthWrite: false,
      toneMapped: false
    });
    const shadow = new THREE.Mesh(new THREE.CircleGeometry(radius, 32), material);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = .006;
    shadow.name = 'kayas-v21-contact-shadow';
    group.add(shadow);
  }

  function createProfessionalPerson(THREE, height, seed) {
    const group = new THREE.Group();
    group.name = 'kayas-v21-professional-person';
    group.userData.kayasV21Replacement = true;

    const scale = Math.max(.72, Math.min(1.35, height / 1.76));
    const palette = [0x315d82, 0x424c5c, 0x6b4736, 0x254c45, 0x6d354b];
    const clothing = makePhysical(THREE, { color: palette[Math.floor(seed * palette.length) % palette.length], roughness: .58 });
    const trousers = makePhysical(THREE, { color: 0x202b36, roughness: .68 });
    const skin = makePhysical(THREE, { color: seed > .52 ? 0xb87852 : 0xd6a178, roughness: .7 });
    const shoes = makePhysical(THREE, { color: 0x10151b, roughness: .5, metalness: .08 });
    const accent = makePhysical(THREE, { color: 0xe8edf1, roughness: .6 });

    addMesh(group, new THREE.CapsuleGeometry(.205, .54, 6, 12), clothing, [0, 1.11, 0], [0, 0, 0], 'person-torso');
    addMesh(group, new THREE.SphereGeometry(.165, 20, 14), skin, [0, 1.61, 0], null, 'person-head');
    addMesh(group, new THREE.BoxGeometry(.13, .22, .03), accent, [0, 1.23, .205], null, 'person-badge');

    [-.115, .115].forEach(function (x) {
      addMesh(group, new THREE.CapsuleGeometry(.07, .43, 5, 10), trousers, [x, .47, 0], null, 'person-leg');
      addMesh(group, new THREE.BoxGeometry(.14, .08, .28), shoes, [x, .08, .06], null, 'person-shoe');
    });

    [-1, 1].forEach(function (side) {
      const arm = addMesh(group, new THREE.CapsuleGeometry(.055, .42, 5, 10), clothing, [side * .27, 1.12, 0], [0, 0, side * .14], 'person-arm');
      arm.rotation.z = side * .13;
      addMesh(group, new THREE.SphereGeometry(.065, 12, 10), skin, [side * .31, .84, .005], null, 'person-hand');
    });

    addContactShadow(THREE, group, .37);
    group.scale.setScalar(scale);
    group.rotation.y = (seed - .5) * .6;
    return group;
  }

  function createProfessionalPlant(THREE, height, seed) {
    const group = new THREE.Group();
    group.name = 'kayas-v21-professional-plant';
    group.userData.kayasV21Replacement = true;

    const normalizedHeight = Math.max(.55, Math.min(2.5, height));
    const potHeight = normalizedHeight * .25;
    const potRadius = normalizedHeight * .18;
    const pot = makePhysical(THREE, { color: seed > .5 ? 0x4b5964 : 0x8a8174, roughness: .52, metalness: .05, clearcoat: .28 });
    const soil = makePhysical(THREE, { color: 0x30231a, roughness: .94 });
    const trunk = makePhysical(THREE, { color: 0x594333, roughness: .85 });
    const greens = [0x2b6c48, 0x367d52, 0x225f3f, 0x4b8b5e].map(function (color) {
      return makePhysical(THREE, { color: color, roughness: .74, sheen: .18, sheenColor: new THREE.Color(0x79a98b) });
    });

    addMesh(group, new THREE.CylinderGeometry(potRadius * .86, potRadius, potHeight, 24), pot, [0, potHeight / 2, 0], null, 'plant-pot');
    addMesh(group, new THREE.CylinderGeometry(potRadius * .82, potRadius * .82, .035, 24), soil, [0, potHeight + .012, 0], null, 'plant-soil');
    addMesh(group, new THREE.CylinderGeometry(.035, .055, normalizedHeight * .52, 12), trunk, [0, potHeight + normalizedHeight * .25, 0], null, 'plant-trunk');

    const crownY = potHeight + normalizedHeight * .56;
    const clusterRadius = normalizedHeight * .22;
    const clusters = [
      [0, crownY + clusterRadius * .66, 0, 1.0],
      [-clusterRadius * .66, crownY, .02, .78],
      [clusterRadius * .68, crownY + .02, -.03, .82],
      [0, crownY - clusterRadius * .42, clusterRadius * .62, .75],
      [.04, crownY - clusterRadius * .35, -clusterRadius * .65, .72]
    ];
    clusters.forEach(function (entry, index) {
      const geometry = new THREE.IcosahedronGeometry(clusterRadius * entry[3], 2);
      const mesh = addMesh(group, geometry, greens[(index + Math.floor(seed * 3)) % greens.length], [entry[0], entry[1], entry[2]], null, 'plant-foliage');
      mesh.scale.y = 1.18;
    });

    addContactShadow(THREE, group, potRadius * 1.45);
    return group;
  }

  function worldBox(THREE, object) {
    try {
      object.updateWorldMatrix(true, true);
      const box = new THREE.Box3().setFromObject(object);
      if (box.isEmpty()) return null;
      return box;
    } catch (_error) {
      return null;
    }
  }

  function hasReplacementAncestor(object) {
    let parent = object.parent;
    while (parent) {
      if (parent.userData && parent.userData.kayasV21Replacement) return true;
      parent = parent.parent;
    }
    return false;
  }

  function semanticCandidates(engine) {
    const { scene } = engine;
    const people = [];
    const plants = [];
    const seen = new Set();

    scene.traverse(function (object) {
      if (!object || object === scene || !object.visible || hasReplacementAncestor(object)) return;
      const name = String(object.name || '').toLowerCase();
      if (!name || /label|marker|route|arrow|led|light|camera|screen|sphere-marker|node/.test(name)) return;

      let kind = null;
      if (/person|human|visitor|avatar|figure|receptionist|operator-person|staff/.test(name)) kind = 'person';
      else if (/plant|tree|shrub|foliage|greenery|potted/.test(name)) kind = 'plant';
      if (!kind) return;

      let root = object;
      while (root.parent && root.parent !== scene) {
        const parentName = String(root.parent.name || '').toLowerCase();
        if (kind === 'person' && /person|human|visitor|avatar|figure|receptionist|staff/.test(parentName)) root = root.parent;
        else if (kind === 'plant' && /plant|tree|shrub|foliage|greenery|potted/.test(parentName)) root = root.parent;
        else break;
      }
      if (seen.has(root.uuid)) return;
      seen.add(root.uuid);
      (kind === 'person' ? people : plants).push(root);
    });

    return { people: people, plants: plants };
  }

  function replacePrimitiveAssets(engine) {
    const { THREE, scene } = engine;
    const candidates = semanticCandidates(engine);

    candidates.people.slice(0, 60).forEach(function (object) {
      const box = worldBox(THREE, object);
      if (!box) return;
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);
      if (size.y < .75 || size.y > 4.2) return;
      const seed = Math.abs(Math.sin(center.x * 12.9898 + center.z * 78.233));
      const replacement = createProfessionalPerson(THREE, size.y, seed);
      replacement.position.set(center.x, box.min.y, center.z);
      replacement.userData.sourceObject = object.uuid;
      scene.add(replacement);
      object.visible = false;
      object.userData.kayasV21Hidden = true;
      state.replacedPeople += 1;
    });

    candidates.plants.slice(0, 80).forEach(function (object) {
      const box = worldBox(THREE, object);
      if (!box) return;
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);
      if (size.y < .35 || size.y > 4.5) return;
      const seed = Math.abs(Math.sin(center.x * 4.27 + center.z * 9.13));
      const replacement = createProfessionalPlant(THREE, size.y, seed);
      replacement.position.set(center.x, box.min.y, center.z);
      replacement.userData.sourceObject = object.uuid;
      scene.add(replacement);
      object.visible = false;
      object.userData.kayasV21Hidden = true;
      state.replacedPlants += 1;
    });
  }

  function enhanceRackFrames(engine) {
    const { THREE, scene } = engine;
    scene.traverse(function (object) {
      if (state.enhancedRacks >= 220 || !object || !object.isMesh || object.userData.kayasV21Rack) return;
      const name = String(object.name || '').toLowerCase();
      if (!/rack-body|cabinet-body|ic8000-rack|server-rack/.test(name)) return;
      if (!object.geometry) return;
      object.geometry.computeBoundingBox();
      const box = object.geometry.boundingBox;
      if (!box) return;
      const size = new THREE.Vector3();
      box.getSize(size);
      if (size.y < 1 || size.y > 5 || size.x < .25 || size.z < .25) return;

      const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x7591aa, transparent: true, opacity: .34, toneMapped: false });
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(object.geometry, 34), edgeMaterial);
      edges.name = 'kayas-v21-rack-precision-edges';
      object.add(edges);

      const handleMaterial = makePhysical(THREE, { color: 0x202a34, roughness: .28, metalness: .78 });
      const handleGeometry = new THREE.BoxGeometry(Math.max(.035, size.x * .035), size.y * .22, Math.max(.025, size.z * .018));
      const centerY = (box.min.y + box.max.y) / 2;
      const frontZ = box.max.z + size.z * .012;
      const backZ = box.min.z - size.z * .012;
      [-1, 1].forEach(function (side) {
        addMesh(object, handleGeometry, handleMaterial, [side * size.x * .34, centerY, frontZ], null, 'kayas-v21-rack-handle');
        addMesh(object, handleGeometry, handleMaterial, [side * size.x * .34, centerY, backZ], null, 'kayas-v21-rack-handle');
      });

      object.userData.kayasV21Rack = true;
      state.enhancedRacks += 1;
    });
  }

  function installProfessionalLighting(engine) {
    const { THREE, scene } = engine;
    if (scene.getObjectByName('kayas-v21-key-light')) return;

    const hemi = new THREE.HemisphereLight(0xdceeff, 0x17202a, document.body.classList.contains('is-night') ? .50 : .72);
    hemi.name = 'kayas-v21-hemi';
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xf4f9ff, document.body.classList.contains('is-night') ? 1.05 : 1.35);
    key.name = 'kayas-v21-key-light';
    key.position.set(-34, 52, 24);
    key.castShadow = true;
    if (key.shadow) {
      key.shadow.mapSize.set(2048, 2048);
      key.shadow.camera.near = 1;
      key.shadow.camera.far = 180;
      key.shadow.bias = -.00018;
      key.shadow.normalBias = .025;
    }
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x79bfff, .36);
    fill.name = 'kayas-v21-fill-light';
    fill.position.set(42, 28, -32);
    scene.add(fill);
  }

  function applyTheme(engine, theme) {
    const { THREE, scene, renderer } = engine;
    const isDark = theme !== 'light';
    if (renderer) {
      renderer.setClearColor(isDark ? 0x071321 : 0xe7eef4, 1);
      if ('toneMappingExposure' in renderer) renderer.toneMappingExposure = isDark ? 1.17 : 1.04;
      if (renderer.shadowMap) renderer.shadowMap.enabled = !window.matchMedia('(max-width: 900px)').matches;
    }
    if (scene) {
      scene.background = new THREE.Color(isDark ? 0x071321 : 0xe7eef4);
      if (scene.fog) scene.fog.color.set(isDark ? 0x071321 : 0xe7eef4);

      scene.traverse(function (object) {
        if (!object) return;
        if (object.isLight && /^kayas-v21-/.test(object.name || '')) {
          if (/hemi/.test(object.name)) object.intensity = isDark ? .50 : .72;
          else if (/key/.test(object.name)) object.intensity = isDark ? 1.05 : 1.35;
          else if (/fill/.test(object.name)) object.intensity = isDark ? .36 : .24;
        }
        if (!object.isMesh || !object.material) return;
        const name = String(object.name || '').toLowerCase();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach(function (material) {
          if (!material || material.userData && material.userData.kayasV21ReplacementMaterial) return;
          material.userData = material.userData || {};
          if (!material.userData.kayasV21BaseColor && material.color) material.userData.kayasV21BaseColor = material.color.getHex();
          if (/wall|partition|ceiling|room/.test(name) && material.color) {
            material.color.set(isDark ? 0xbec9d1 : 0xf0f2f3);
            material.roughness = .72;
            state.themedMaterials += 1;
          } else if (/floorplate|closed-floor|raised-floor|floor-grid|entry-floor/.test(name) && material.color) {
            material.color.set(isDark ? 0xc8d0d5 : 0xffffff);
          } else if (/glass|facade|observation/.test(name) && material.color) {
            material.color.set(isDark ? 0x86b5cf : 0xc6e1ef);
            if ('opacity' in material) material.opacity = isDark ? .25 : .34;
          }
          material.needsUpdate = true;
        });
      });
    }
  }

  function addBadge() {
    if (document.querySelector('.v21-render-badge')) return;
    const badge = document.createElement('div');
    badge.className = 'v21-render-badge';
    badge.innerHTML = '<i></i><span>Professional assets · dynamic H3C screens</span>';
    document.getElementById('app').appendChild(badge);
  }

  function install(engine) {
    if (state.installed) return;
    state.installed = true;
    state.engine = engine;

    installProfessionalLighting(engine);
    replacePrimitiveAssets(engine);
    enhanceRackFrames(engine);
    applyTheme(engine, window.__KAYAS_THEME__ || (document.body.classList.contains('is-night') ? 'dark' : 'light'));
    addBadge();

    window.addEventListener('kayas:themechange', function (event) {
      applyTheme(engine, event.detail && event.detail.theme || 'dark');
    });

    window.__KAYAS_V21_STATE__ = state;
    console.info('[KAYAS v21] professional layer active', {
      version: VERSION,
      replacedPeople: state.replacedPeople,
      replacedPlants: state.replacedPlants,
      enhancedRacks: state.enhancedRacks
    });
    window.dispatchEvent(new Event('resize'));
  }

  function waitForEngine(attempt) {
    const engine = resolveEngine();
    if (engine.THREE && engine.scene && engine.renderer && engine.camera && (window.__KAYAS_MODEL_READY__ || window.__KAYAS_MODEL_READY)) {
      install(engine);
      return;
    }
    if (attempt < 360) {
      setTimeout(function () { waitForEngine(attempt + 1); }, 100);
    } else {
      console.warn('[KAYAS v21] engine bridge not available; UI fixes remain active.');
    }
  }

  waitForEngine(0);
})();
