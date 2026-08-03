(async function () {
  'use strict';

  const SOURCE_URL = 'src/kayas-v8-safe.bundle.js?v=20260803-v19-source2';
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
    window.__KAYAS_MODEL_LOADING_V19 = false;
    console.error('[KAYAS v19 loader]', message, error || '');
    setStatus('3D deneyim açılamadı', message);
  }

  async function sha256Bytes(bytes) {
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  }

  try {
    window.__KAYAS_MODEL_LOADING_V19 = true;
    window.__KAYAS_LOADER_ERROR = null;
    setStatus('Authoritative v8 modeli hazırlanıyor…', 'Yerleşim geometrisi doğrulanıyor; koordinatlar değiştirilmiyor.');

    const response = await fetch(SOURCE_URL, {
      cache: 'no-store',
      credentials: 'same-origin'
    });
    if (!response.ok) throw new Error('Model kaynağı HTTP ' + response.status);

    const downloadedBuffer = await response.arrayBuffer();
    const downloadedBytes = new Uint8Array(downloadedBuffer);
    if (downloadedBytes.byteLength < SOURCE_BYTES) {
      throw new Error('Model kaynağı eksik: ' + downloadedBytes.byteLength + ' / ' + SOURCE_BYTES + ' bayt');
    }

    const sourceBytes = downloadedBytes.slice(0, SOURCE_BYTES);
    if (window.crypto && crypto.subtle) {
      const actualSha = await sha256Bytes(sourceBytes);
      if (actualSha !== SOURCE_SHA256) {
        throw new Error('Authoritative v8 SHA-256 uyuşmazlığı: ' + actualSha.slice(0, 16));
      }
      window.__KAYAS_V19_SOURCE_SHA256 = actualSha;
    }

    const source = new TextDecoder('utf-8', { fatal: true }).decode(sourceBytes);
    const marker = "const camera = new PerspectiveCamera(50, 1, .1, 1000);";
    const count = source.split(marker).length - 1;
    if (count !== 1) {
      throw new Error('Kamera başlangıç sözleşmesi bulunamadı: ' + count);
    }

    const bridge = marker + "\nwindow.__KAYAS_RENDERER__ = renderer;\nwindow.__KAYAS_SCENE__ = scene;\nwindow.__KAYAS_CAMERA__ = camera;\nwindow.__KAYAS_ENGINE_CAPTURED__ = true;\nwindow.dispatchEvent(new CustomEvent('kayas-engine-captured'));";

    const runtime = source.replace(marker, bridge) + "\nwindow.__KAYAS_MODEL_READY = true;\nwindow.__KAYAS_MODEL_MODE = 'authoritative-v8-geometry-locked-v19';\nwindow.__KAYAS_MODEL_SOURCE = 'same-origin-verified-v19';\nwindow.__KAYAS_MODEL_LOADING_V19 = false;\nwindow.dispatchEvent(new Event('resize'));\n";

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
      console.info('[KAYAS v19 loader] Authoritative geometry active.', window.__KAYAS_V19_SOURCE_SHA256);
    };
    script.onerror = function (event) {
      URL.revokeObjectURL(blobUrl);
      fail('Doğrulanmış model JavaScript motoru başlatılamadı.', event);
    };
    document.body.appendChild(script);
  } catch (error) {
    fail(error && error.message ? error.message : String(error), error);
  }
})();
