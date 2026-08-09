(function () {
  'use strict';

  const VIEWER_ID = 'ic8000-viewer';
  // model-viewer orientation order is roll pitch yaw. The IC8000 face marked by
  // hotspot 5 is on model +Z, so a -90° pitch brings that face to screen +Y.
  const UPRIGHT_ORIENTATION = '0deg -90deg 0deg';

  function applyOrientation(viewer) {
    if (!viewer || viewer.dataset.uprightFixed === 'true') return;

    const fix = function () {
      viewer.setAttribute('orientation', UPRIGHT_ORIENTATION);
      viewer.dataset.uprightFixed = 'true';

      if (typeof viewer.updateFraming === 'function') {
        viewer.updateFraming();
      }

      viewer.cameraTarget = 'auto auto auto';
      viewer.cameraOrbit = '28deg 62deg 150%';
      viewer.fieldOfView = '28deg';
    };

    if (viewer.loaded) {
      fix();
    } else {
      viewer.addEventListener('load', fix, { once: true });
    }
  }

  function findAndFix() {
    const viewer = document.getElementById(VIEWER_ID);
    if (!viewer) return false;
    applyOrientation(viewer);
    return true;
  }

  function start() {
    if (findAndFix()) return;

    const root = document.getElementById('chapters') || document.body;
    if (!root || !window.MutationObserver) {
      window.setTimeout(findAndFix, 1000);
      return;
    }

    const observer = new MutationObserver(function () {
      if (findAndFix()) observer.disconnect();
    });

    observer.observe(root, { childList: true, subtree: true });
    window.setTimeout(function () {
      findAndFix();
      observer.disconnect();
    }, 15000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
