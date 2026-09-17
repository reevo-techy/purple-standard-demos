/* ============================================================
   Purple Standard portfolio demo — shared runtime
   Loaded by every page in the showcase build (not part of any
   client deliverable).

   Two jobs:
     1. Load the Google Maps embeds only when the device is
        actually online. Offline, the styled address card that
        sits behind the iframe stays visible instead of Safari
        rendering a "cannot connect" box mid-page.
     2. Register the service worker that precaches all three
        sites so the whole portfolio works with no signal.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. online-only map embeds ---------- */

  function syncMaps() {
    var online = navigator.onLine !== false;
    var frames = document.querySelectorAll('iframe[data-map-src]');

    for (var i = 0; i < frames.length; i++) {
      var f = frames[i];
      var card = f.parentNode.querySelector('.map-offline');

      if (online) {
        // Assign once; re-assigning on every event would reload the map.
        if (!f.getAttribute('src')) {
          f.setAttribute('src', f.getAttribute('data-map-src'));
        }
        f.style.display = '';
        if (card) card.style.display = 'none';
      } else {
        // Drop the src so a half-loaded frame doesn't show an error page.
        f.removeAttribute('src');
        f.style.display = 'none';
        if (card) card.style.display = '';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncMaps);
  } else {
    syncMaps();
  }
  window.addEventListener('online', syncMaps);
  window.addEventListener('offline', syncMaps);

  /* ---------- 2. service worker ---------- */

  // The worker sits at the portfolio root so it claims scope over
  // sweet-treat/, fenwick-dental/ and lantern-cafe/ alike. That root is derived from this
  // script's own URL rather than hard-coded to "/", so the build works
  // unchanged at a domain root or under a subpath such as
  // /purple-standard-demos/.
  function portfolioRoot() {
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].src || '';
      var at = src.indexOf('assets/demo.js');
      if (at !== -1) return src.slice(0, at);
    }
    return null;
  }

  if ('serviceWorker' in navigator &&
      (location.protocol === 'https:' || location.hostname === 'localhost')) {
    var root = portfolioRoot();
    if (root) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register(root + 'sw.js', { scope: root })
          .catch(function (err) {
            if (window.console) console.warn('[purple-standard] SW registration failed:', err);
          });
      });
    }
  }
})();
