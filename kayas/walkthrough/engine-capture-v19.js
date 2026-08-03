(function () {
  'use strict';

  let storedThree = window.THREE;
  let patched = false;

  function setCaptured(renderer, scene, camera) {
    if (renderer) window.__KAYAS_RENDERER__ = renderer;
    if (scene) window.__KAYAS_SCENE__ = scene;
    if (camera) window.__KAYAS_CAMERA__ = camera;
    if (window.__KAYAS_RENDERER__ && window.__KAYAS_SCENE__ && window.__KAYAS_CAMERA__) {
      if (!window.__KAYAS_ENGINE_CAPTURED__) {
        window.__KAYAS_ENGINE_CAPTURED__ = true;
        window.dispatchEvent(new CustomEvent('kayas-engine-captured'));
        console.info('[KAYAS v19] Three.js engine captured without geometry mutation.');
      }
    }
  }

  function replaceConstructor(namespace, key, decorate) {
    const Original = namespace && namespace[key];
    if (typeof Original !== 'function' || Original.__KAYAS_CAPTURE_WRAPPED__) return false;

    function WrappedConstructor() {
      const args = Array.prototype.slice.call(arguments);
      const instance = Reflect.construct(Original, args, Original);
      decorate(instance);
      return instance;
    }

    try { Object.setPrototypeOf(WrappedConstructor, Original); } catch (_error) {}
    WrappedConstructor.prototype = Original.prototype;
    Object.defineProperty(WrappedConstructor, '__KAYAS_CAPTURE_WRAPPED__', { value: true });

    try {
      Object.defineProperty(namespace, key, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: WrappedConstructor
      });
      return namespace[key] === WrappedConstructor;
    } catch (_error) {
      try {
        namespace[key] = WrappedConstructor;
        return namespace[key] === WrappedConstructor;
      } catch (_ignored) {
        return false;
      }
    }
  }

  function patchThree(namespace) {
    if (!namespace || patched || namespace.__KAYAS_ENGINE_CAPTURE_PATCHED__) return;

    const sceneWrapped = replaceConstructor(namespace, 'Scene', function (instance) {
      setCaptured(null, instance, null);
    });

    const cameraWrapped = replaceConstructor(namespace, 'PerspectiveCamera', function (instance) {
      setCaptured(null, null, instance);
    });

    const rendererWrapped = replaceConstructor(namespace, 'WebGLRenderer', function (instance) {
      window.__KAYAS_RENDERER__ = instance;
      const originalRender = instance && instance.render;
      if (typeof originalRender === 'function' && !originalRender.__KAYAS_CAPTURE_WRAPPED__) {
        const wrappedRender = function (scene, camera) {
          setCaptured(instance, scene, camera);
          return originalRender.apply(instance, arguments);
        };
        Object.defineProperty(wrappedRender, '__KAYAS_CAPTURE_WRAPPED__', { value: true });
        instance.render = wrappedRender;
      }
      setCaptured(instance, null, null);
    });

    try {
      Object.defineProperty(namespace, '__KAYAS_ENGINE_CAPTURE_PATCHED__', { value: true });
    } catch (_error) {}

    patched = sceneWrapped || cameraWrapped || rendererWrapped;
    window.__KAYAS_ENGINE_CAPTURE_PATCH_RESULT__ = {
      sceneWrapped: sceneWrapped,
      cameraWrapped: cameraWrapped,
      rendererWrapped: rendererWrapped
    };
  }

  if (storedThree) patchThree(storedThree);

  try {
    Object.defineProperty(window, 'THREE', {
      configurable: true,
      enumerable: true,
      get: function () { return storedThree; },
      set: function (value) {
        storedThree = value;
        patchThree(value);
      }
    });
  } catch (_error) {
    const timer = window.setInterval(function () {
      if (window.THREE) {
        window.clearInterval(timer);
        patchThree(window.THREE);
      }
    }, 10);
    window.setTimeout(function () { window.clearInterval(timer); }, 30000);
  }
})();
