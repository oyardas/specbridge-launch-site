(async function () {
  'use strict';

  const status = document.getElementById('loadStatus');
  const ORIGINAL_SHA256 = '003d42f6fa45b0d30edb7c20f59512b3455ceacc00783795b3c8196a3fa5227d';
  const PATCHED_SHA256 = '3d31f4ec24f4554a742ca7de7a53d34de5dfdb812ad102a929c6967aa96e34b5';
  const MODEL_PARTS = [
    'model-01.txt', 'model-02.txt', 'model-03.txt', 'model-04.txt',
    'model-05.txt', 'model-06.txt', 'model-07.txt'
  ];
  const ASSET_VERSION = '20260803-v14';

  function setStatus(title, message) {
    if (!status) return;
    status.hidden = false;
    const strong = status.querySelector('strong');
    const span = status.querySelector('span');
    if (strong) strong.textContent = title;
    if (span) span.textContent = message;
  }

  function fail(message, error) {
    console.error('[KAYAS loader]', message, error || '');
    window.__KAYAS_LOADER_ERROR = {
      message,
      stage: window.__KAYAS_LOADER_STAGE || 'unknown'
    };
    setStatus('3D deneyim açılamadı', message);
  }

  window.addEventListener('unhandledrejection', function (event) {
    const reason = event.reason;
    const message = reason && reason.message ? reason.message : String(reason || 'Bilinmeyen modül hatası');
    if (!window.__KAYAS_MODEL_READY) fail('3D modül hatası: ' + message, reason);
  });

  async function sha256(text) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
  }

  function xhrText(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'text';
      xhr.timeout = 45000;
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.responseText);
        else reject(new Error('HTTP ' + xhr.status + ' · ' + url));
      };
      xhr.onerror = () => reject(new Error('Ağ hatası · ' + url));
      xhr.ontimeout = () => reject(new Error('Zaman aşımı · ' + url));
      xhr.send();
    });
  }

  async function loadText(url) {
    try {
      const response = await fetch(url, {
        cache: 'no-store',
        credentials: 'same-origin'
      });
      if (!response.ok) throw new Error('HTTP ' + response.status + ' · ' + url);
      return await response.text();
    } catch (fetchError) {
      console.warn('[KAYAS loader] fetch başarısız, XHR deneniyor:', url, fetchError);
      try {
        return await xhrText(url);
      } catch (xhrError) {
        throw new Error(url + ' alınamadı; fetch=' + (fetchError.message || fetchError) + '; xhr=' + (xhrError.message || xhrError));
      }
    }
  }

  function applyUnifiedPatch(source, patchText) {
    const src = source.replace(/\r\n/g, '\n').split('\n');
    const lines = patchText.replace(/\r\n/g, '\n').split('\n');
    const output = [];
    let srcIndex = 0;
    let patchIndex = 0;
    let hunkCount = 0;

    while (patchIndex < lines.length) {
      const header = lines[patchIndex].match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
      if (!header) {
        patchIndex += 1;
        continue;
      }
      hunkCount += 1;
      const oldStart = Number(header[1]) - 1;
      while (srcIndex < oldStart) output.push(src[srcIndex++]);
      patchIndex += 1;

      while (patchIndex < lines.length && !lines[patchIndex].startsWith('@@ ')) {
        const line = lines[patchIndex];
        if (line.startsWith('--- ') || line.startsWith('+++ ')) {
          patchIndex += 1;
          continue;
        }
        if (line === '\\ No newline at end of file') {
          patchIndex += 1;
          continue;
        }
        const marker = line[0];
        const text = line.slice(1);
        if (marker === ' ') {
          if (src[srcIndex] !== text) throw new Error('Patch context mismatch · kaynak satır ' + (srcIndex + 1));
          output.push(src[srcIndex++]);
        } else if (marker === '-') {
          if (src[srcIndex] !== text) throw new Error('Patch deletion mismatch · kaynak satır ' + (srcIndex + 1));
          srcIndex += 1;
        } else if (marker === '+') {
          output.push(text);
        } else if (line !== '') {
          throw new Error('Desteklenmeyen patch komutu');
        }
        patchIndex += 1;
      }
    }

    if (!hunkCount) throw new Error('Patch hunk bulunamadı');
    while (srcIndex < src.length) output.push(src[srcIndex++]);
    return output.join('\n');
  }

  async function reconstructV8Source() {
    if (typeof DecompressionStream !== 'function') {
      throw new Error('Bu 3D model için güncel Chrome, Edge veya Safari gereklidir.');
    }

    window.__KAYAS_LOADER_STAGE = 'model-parts';
    const parts = [];
    for (let index = 0; index < MODEL_PARTS.length; index += 1) {
      const file = MODEL_PARTS[index];
      setStatus('Orijinal v8 modeli hazırlanıyor…', (index + 1) + ' / ' + MODEL_PARTS.length + ' · ' + file);
      try {
        parts.push(await loadText('src/chunks/' + file + '?v=' + ASSET_VERSION));
      } catch (error) {
        throw new Error(file + ' yüklenemedi: ' + error.message);
      }
    }

    window.__KAYAS_LOADER_STAGE = 'decompression';
    const encoded = parts.join('').replace(/\s+/g, '');
    if (!encoded.startsWith('H4sI')) throw new Error('Model paketi geçersiz veya eksik.');

    let raw;
    try {
      raw = atob(encoded);
    } catch (error) {
      throw new Error('Model Base64 çözümlemesi başarısız.');
    }

    const bytes = new Uint8Array(raw.length);
    for (let index = 0; index < raw.length; index += 1) bytes[index] = raw.charCodeAt(index);
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    const source = await new Response(stream).text();

    if (window.crypto && crypto.subtle) {
      window.__KAYAS_LOADER_STAGE = 'source-integrity';
      const actual = await sha256(source);
      if (actual !== ORIGINAL_SHA256) throw new Error('v8 bütünlük kontrolü başarısız: ' + actual.slice(0, 12));
    }
    return source;
  }

  function prepareRuntimeSource(source) {
    const importPattern = /import\s+\*\s+as\s+THREE\s+from\s+['"]https:\/\/cdn\.jsdelivr\.net\/npm\/three@0\.180\.0\/\+esm['"]\s*;?/;
    const fallbackBootstrap = `let THREE;\nconst __threeCandidates = [\n  new URL('vendor/three.module.min.js?v=${ASSET_VERSION}', window.location.href).href,\n  'https://unpkg.com/three@0.180.0/build/three.module.js',\n  'https://esm.sh/three@0.180.0',\n  'https://cdn.jsdelivr.net/npm/three@0.180.0/+esm'\n];\nconst __threeErrors = [];\nfor (const __url of __threeCandidates) {\n  try {\n    THREE = await import(__url);\n    console.info('[KAYAS] Three.js loaded from', __url);\n    break;\n  } catch (__error) {\n    __threeErrors.push(__url + ' => ' + (__error && __error.message ? __error.message : String(__error)));\n  }\n}\nif (!THREE) throw new Error('Three.js yüklenemedi: ' + __threeErrors.join(' | '));`;

    if (importPattern.test(source)) return source.replace(importPattern, fallbackBootstrap);

    const dynamicPattern = /import\(['"]https:\/\/cdn\.jsdelivr\.net\/npm\/three@0\.180\.0\/\+esm['"]\)/g;
    if (dynamicPattern.test(source)) {
      return source.replace(dynamicPattern, `(async()=>{for(const u of [new URL('vendor/three.module.min.js?v=${ASSET_VERSION}',window.location.href).href,'https://unpkg.com/three@0.180.0/build/three.module.js','https://esm.sh/three@0.180.0','https://cdn.jsdelivr.net/npm/three@0.180.0/+esm']){try{return await import(u)}catch(e){console.warn('[KAYAS] Three.js source failed',u,e)}}throw new Error('Three.js kaynaklarının tümü başarısız')})()`);
    }

    console.warn('[KAYAS loader] Three.js import satırı bulunamadı; kaynak olduğu gibi yürütülüyor.');
    return source;
  }

  function execute(source, mode) {
    window.__KAYAS_LOADER_STAGE = 'execution';
    const runtimeSource = prepareRuntimeSource(source) + '\nwindow.__KAYAS_MODEL_READY = true;';
    const url = URL.createObjectURL(new Blob([runtimeSource], { type: 'text/javascript' }));
    const script = document.createElement('script');
    script.type = 'module';
    script.src = url;
    script.onload = () => {
      URL.revokeObjectURL(url);
      if (status) status.hidden = true;
      window.__KAYAS_MODEL_MODE = mode;
      window.__KAYAS_MODEL_READY = true;
      window.dispatchEvent(new Event('resize'));
      console.info('[KAYAS loader] 3D motor aktif:', mode);
    };
    script.onerror = (event) => {
      URL.revokeObjectURL(url);
      fail('3D JavaScript modülü başlatılamadı. Harici Three.js kaynakları erişilemiyor olabilir.', event);
    };
    document.body.appendChild(script);
  }

  try {
    setStatus('3D model yükleniyor…', 'Yedi parçalı v8 kaynak paketi hazırlanıyor.');
    const original = await reconstructV8Source();

    window.__KAYAS_LOADER_STAGE = 'patch';
    try {
      setStatus('Görsel geliştirmeler uygulanıyor…', 'Dinamik ölçek ve IC8000 detayları etkinleştiriliyor.');
      const patchText = await loadText('kayas-v10.patch?v=' + ASSET_VERSION);
      const patched = applyUnifiedPatch(original, patchText);
      if (window.crypto && crypto.subtle) {
        const actual = await sha256(patched);
        if (actual !== PATCHED_SHA256) throw new Error('Patch bütünlük kontrolü: ' + actual.slice(0, 12));
      }
      execute(patched, 'v8-geometry-v10-enhanced');
    } catch (patchError) {
      console.warn('[KAYAS loader] Geliştirme patch’i yüklenemedi; orijinal v8 sahne açılıyor.', patchError);
      setStatus('Orijinal v8 model açılıyor…', 'Geliştirme katmanı alınamadı; bina modeli güvenli modda başlatılıyor.');
      execute(original, 'v8-safe-fallback');
    }
  } catch (error) {
    fail(error && error.message ? error.message : String(error), error);
  }
})();