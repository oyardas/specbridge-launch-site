(async function () {
  'use strict';

  const SOURCE_URL = 'src/kayas-v8-safe.bundle.js?v=20260803-v19-source';
  const SOURCE_BYTES = 1371713;
  const SOURCE_SHA256 = '003d42f6fa45b0d30edb7c20f59512b3455ceacc00783795b3c8196a3fa5227d';
  const status = document.getElementById('loadStatus');

  function setStatus(title, message) {
    if (!status) return;
    status.hidden = false;
    const strong = status.querySelector('strong');
    const span = status.querySelector('span');
    if (strong) strong.textContent = title;
    if (span) span.textContent = message;
  }

  function fail(message, error) {
    window.__KAYAS_LOADER_ERROR = { stage: 'v19-geometry-locked-loader', message: message };
    console.error('[KAYAS v19 loader]', message, error || '');
    setStatus('3D deneyim açılamadı', message);
  }

  async function sha256(text) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  }

  try {
    window.__KAYAS_MODEL_LOADING_V19 = true;
    setStatus('Authoritative v8 modeli hazırlanıyor…', 'Yerleşim geometrisi doğrulanıyor; koordinatlar değiştirilmiyor.');

    const response = await fetch(SOURCE_URL, {
      cache: 'no-store',
      credentials: 'same-origin'
    });
    if (!response.ok) throw new Error('Model kaynağı HTTP ' + response.status);
    const downloaded = await response.text();
    if (downloaded.length < SOURCE_BYTES) {
      throw new Error('Model kaynağı eksik: ' + downloaded.length + ' / ' + SOURCE_BYTES + ' karakter');
    }

    const source = downloaded.slice(0, SOURCE_BYTES);
    if (window.crypto && crypto.subtle) {
      const actualSha = await sha256(source);
      if (actualSha !== SOURCE_SHA256) {
        throw new Error('Authoritative v8 SHA-256 uyuşmazlığı: ' + actualSha.slice(0, 16));
      }
      window.__KAYAS_V19_SOURCE_SHA256 = actualSha;
    }

    const needle = "const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });\nrenderer.setPixelRatio(Math.min(devicePixelRatio, 1.65));\nrenderer.shadowMap.enabled = false;\nrenderer.outputColorSpace = SRGBColorSpace;\nrenderer.toneMapping = ACESFilmicToneMapping;\nrenderer.toneMappingExposure = 1;\nconst scene = new Scene();\nconst camera = new PerspectiveCamera(50, 1, .1, 1000);";

    const count = source.split(needle).length - 1;
    if (count !== 1) {
      throw new Error('3D motor başlangıç sözleşmesi bulunamadı: ' + count);
    }

    const bridge = needle + "\nwindow.__KAYAS_RENDERER__ = renderer;\nwindow.__KAYAS_SCENE__ = scene;\nwindow.__KAYAS_CAMERA__ = camera;\nwindow.__KAYAS_ENGINE_CAPTURED__ = true;\nwindow.dispatchEvent(new CustomEvent('kayas-engine-captured'));";

    const runtime = source.replace(needle, bridge) + "\nwindow.__KAYAS_MODEL_READY = true;\nwindow.__KAYAS_MODEL_MODE = 'authoritative-v8-geometry-locked-v19';\nwindow.__KAYAS_MODEL_SOURCE = 'same-origin-verified-v19';\nwindow.__KAYAS_MODEL_LOADING_V19 = false;\nwindow.dispatchEvent(new Event('resize'));\n";

    const blobUrl = URL.createObjectURL(new Blob([runtime], { type: 'text/javascript' }));
    const script = document.createElement('script');
    script.src = blobUrl;
    script.async = false;
    script.onload = function () {
      URL.revokeObjectURL(blobUrl);
      window.__KAYAS_MODEL_READY = true;
      window.__KAYAS_MODEL_LOADING_V19 = false;
      if (status) status.hidden = true;
      window.dispatchEvent(new Event('resize'));
      console.info('[KAYAS v19 loader] Authoritative geometry active.');
    };
    script.onerror = function (event) {
      URL.revokeObjectURL(blobUrl);
      fail('Doğrulanmış model JavaScript motoru başlatılamadı.', event);
    };
    document.body.appendChild(script);
  } catch (error) {
    window.__KAYAS_MODEL_LOADING_V19 = false;
    fail(error && error.message ? error.message : String(error), error);
  }
})();
