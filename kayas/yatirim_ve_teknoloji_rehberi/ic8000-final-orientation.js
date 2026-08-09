(function () {
  'use strict';

  const ROOT_ID = 'kayas-ic8000-3d';
  const VIEWER_ID = 'ic8000-viewer';
  const ORIENTATION = '-90deg 0deg 0deg';
  const ORIGINAL_HOTSPOTS = {
    '5': { position: '0m -250m 1120m', normal: '0m 0m 1m' },
    '8': { position: '0m 1775m -150m', normal: '0m 1m 0m' }
  };

  function setActiveFive(root) {
    root.querySelectorAll('[data-annotation-id]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-annotation-id') === '5');
    });
    root.querySelectorAll('[data-annotation-target]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-annotation-target') === '5');
    });
  }

  function restoreHotspots(root) {
    Object.keys(ORIGINAL_HOTSPOTS).forEach(function (id) {
      const hotspot = root.querySelector('[data-annotation-id="' + id + '"]');
      if (!hotspot) return;
      hotspot.setAttribute('data-position', ORIGINAL_HOTSPOTS[id].position);
      hotspot.setAttribute('data-normal', ORIGINAL_HOTSPOTS[id].normal);
    });
  }

  function applyFinalOrientation() {
    const root = document.getElementById(ROOT_ID);
    const viewer = document.getElementById(VIEWER_ID);
    if (!root || !viewer) return false;

    restoreHotspots(root);
    setActiveFive(root);

    viewer.setAttribute('orientation', ORIENTATION);

    const finish = function () {
      restoreHotspots(root);
      viewer.setAttribute('orientation', ORIENTATION);
      if (typeof viewer.updateFraming === 'function') viewer.updateFraming();
      viewer.cameraTarget = 'auto auto auto';
      viewer.cameraOrbit = '28deg 62deg 150%';
      viewer.fieldOfView = '28deg';
      viewer.autoRotate = true;
      setActiveFive(root);
    };

    if (viewer.loaded) finish();
    else viewer.addEventListener('load', finish, { once: true });

    // The main annotation script still contains the temporary hotspot-5 position.
    // Correct camera targeting after list clicks without moving the hotspot itself.
    root.addEventListener('click', function (event) {
      const button = event.target.closest('[data-annotation-target="5"]');
      if (!button) return;
      window.setTimeout(function () {
        viewer.cameraTarget = ORIGINAL_HOTSPOTS['5'].position;
      }, 0);
    }, true);

    return true;
  }

  function start() {
    if (applyFinalOrientation()) return;
    const host = document.getElementById('chapters') || document.body;
    const observer = new MutationObserver(function () {
      if (applyFinalOrientation()) observer.disconnect();
    });
    observer.observe(host, { childList: true, subtree: true });
    window.setTimeout(function () {
      applyFinalOrientation();
      observer.disconnect();
    }, 15000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
