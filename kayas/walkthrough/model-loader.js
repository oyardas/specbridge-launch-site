(function () {
  'use strict';

  const status = document.getElementById('loadStatus');
  const SOURCES = [
    'https://drive.usercontent.google.com/download?id=19zW6DgqhSjWrRFnxDjs58NhTa5aykdGc&export=download&authuser=0&confirm=t',
    'https://drive.google.com/uc?export=download&id=19zW6DgqhSjWrRFnxDjs58NhTa5aykdGc&confirm=t'
  ];

  function setStatus(title, message) {
    if (!status) return;
    status.hidden = false;
    const strong = status.querySelector('strong');
    const span = status.querySelector('span');
    if (strong) strong.textContent = title;
    if (span) span.textContent = message;
  }

  function finish(source) {
    window.__KAYAS_MODEL_READY = true;
    window.__KAYAS_MODEL_MODE = 'authoritative-v8-direct';
    window.__KAYAS_MODEL_SOURCE = source;
    if (status) status.hidden = true;
    window.dispatchEvent(new Event('resize'));
    console.info('[KAYAS] Authoritative v8 model active:', source);
  }

  function fail(errors) {
    const message = 'Tam v8 model dosyası yüklenemedi: ' + errors.join(' | ');
    window.__KAYAS_LOADER_ERROR = { stage: 'authoritative-direct-script', message };
    console.error('[KAYAS]', message);
    setStatus('3D deneyim açılamadı', message);
  }

  function trySource(index, errors) {
    if (index >= SOURCES.length) {
      fail(errors);
      return;
    }

    const url = SOURCES[index];
    setStatus(
      'Tam v8 modeli yükleniyor…',
      'Doğrulanmış tek dosyalı kaynak deneniyor (' + (index + 1) + '/' + SOURCES.length + ').'
    );

    let runtimeError = null;
    const capture = function (event) {
      runtimeError = event && event.message ? event.message : 'JavaScript çalışma zamanı hatası';
    };
    window.addEventListener('error', capture, { once: true });

    const script = document.createElement('script');
    script.src = url;
    script.async = false;
    script.referrerPolicy = 'no-referrer';
    script.onload = function () {
      window.removeEventListener('error', capture);
      if (runtimeError) {
        errors.push('Kaynak ' + (index + 1) + ' çalışma hatası: ' + runtimeError);
        script.remove();
        trySource(index + 1, errors);
        return;
      }
      finish(url);
    };
    script.onerror = function () {
      window.removeEventListener('error', capture);
      errors.push('Kaynak ' + (index + 1) + ' ağ veya MIME hatası');
      script.remove();
      trySource(index + 1, errors);
    };
    document.body.appendChild(script);
  }

  setStatus('Tam v8 modeli hazırlanıyor…', 'Parçalı model yükleme kaldırıldı.');
  trySource(0, []);
})();