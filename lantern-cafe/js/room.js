/* ============================================================
   Lantern Art Cafe — "The Long Room" engine
   - Walks a pinned 3D hall (GSAP ScrollTrigger) when the device
     and the user's motion preference allow it.
   - Otherwise stays a calm hero + a semantic room index.
   - Panels ("inside a painting") work in every mode.
   Vanilla JS, no build. Degrades if GSAP fails to load.
   ============================================================ */
(function () {
  'use strict';

  var html = document.documentElement;
  html.classList.remove('no-js');
  html.classList.add('js');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarseSmall = window.matchMedia('(pointer: coarse)').matches &&
                    window.matchMedia('(max-width: 720px)').matches;
  var hasGSAP = typeof window.gsap !== 'undefined' &&
                typeof window.ScrollTrigger !== 'undefined';

  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  /* ---------- helpers ---------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function parseISO(s) {
    var p = (s || '').split('-');
    return { m: MONTHS[(+p[1] || 1) - 1], d: +p[2] || 1, y: +p[0] || 0, iso: s };
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ============================================================
     DATA — enhance the panels from the JSON files when reachable.
     Falls back silently to the copy already in the HTML.
     ============================================================ */
  function renderExhibitions(data) {
    var cur = data && data.current;
    var thumbs = document.getElementById('exhibit-thumbs');
    if (thumbs && cur && cur.thumbs && cur.thumbs.length) {
      thumbs.innerHTML = '';
      cur.thumbs.forEach(function (src) {
        var t = el('span', 'thumb');
        t.style.setProperty('--art', "url('" + src + "')");
        thumbs.appendChild(t);
      });
    }
    var past = document.getElementById('past-list');
    if (past && data && data.past && data.past.length) {
      past.innerHTML = '';
      data.past.forEach(function (p) {
        past.appendChild(el('li', null,
          '<b>' + esc((p.title || '').replace(/^\[CONFIRM\]\s*/, '')) + '</b>' +
          '<span>' + esc((p.artist || '').replace(/^\[CONFIRM\]\s*/, '')) +
          (p.when ? ' · ' + esc(p.when) : '') + '</span>'));
      });
    }
  }

  function renderEvents(data) {
    var list = document.getElementById('events-list');
    if (list && data && data.events && data.events.length) {
      var evs = data.events.slice().sort(function (a, b) {
        return (a.date || '').localeCompare(b.date || '');
      }).slice(0, 6);
      list.innerHTML = '';
      evs.forEach(function (ev) {
        var d = parseISO(ev.date);
        var li = el('li');
        li.appendChild(el('span', 'ev-date',
          d.d + '<small>' + d.m + '</small>'));
        var body = el('div');
        body.appendChild(el('span', 'ev-title', esc(ev.title || '')));
        if (ev.artist) body.appendChild(el('div', 'ev-artist', esc(ev.artist)));
        body.appendChild(el('div', 'ev-meta', esc(ev.time || '')));
        li.appendChild(body);
        list.appendChild(li);
      });
    }
    var rec = document.getElementById('recurring-list');
    if (rec && data && data.recurring && data.recurring.length) {
      rec.innerHTML = '';
      data.recurring.forEach(function (r) {
        rec.appendChild(el('li', null,
          '<b>' + esc(r.title || '') + '</b><span>' + esc(r.when || '') + '</span>'));
      });
    }
  }

  function loadJSON(url, cb) {
    // fetch fails on file://; that's fine, panels keep their HTML copy.
    if (!window.fetch) return;
    fetch(url).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d) cb(d); })
      .catch(function () {});
  }

  loadJSON('data/exhibitions.json', renderExhibitions);
  loadJSON('data/events.json', renderEvents);

  /* ============================================================
     PANELS — stepping inside a painting (works in all modes)
     ============================================================ */
  var layer = document.getElementById('panel-layer');
  var panels = [].slice.call(document.querySelectorAll('.panel'));
  var backdrops = [document.getElementById('stage'),
                   document.getElementById('room-index')].filter(Boolean);
  var currentPanel = null;
  var lastTrigger = null;
  var enteringFrame = null;

  function focusables(root) {
    return [].slice.call(root.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(function (n) { return n.offsetParent !== null || n === document.activeElement; });
  }

  function openPanel(id, trigger, frame) {
    var panel = document.getElementById('panel-' + id);
    if (!panel) return;
    if (currentPanel === panel) return;   // already open — ignore double-fire
    lastTrigger = trigger || document.activeElement;
    enteringFrame = frame || null;

    panels.forEach(function (p) {
      if (p !== panel) { p.hidden = true; p.classList.remove('is-active'); }
    });
    layer.hidden = false;
    panel.hidden = false;
    html.classList.add('panel-open');
    backdrops.forEach(function (b) { b.setAttribute('aria-hidden', 'true'); });

    // The "dolly into the frame" — the clicked painting rushes forward.
    if (enteringFrame && !reduced) enteringFrame.classList.add('is-entering');

    // next frame so the transition runs from the hidden state
    requestAnimationFrame(function () {
      layer.classList.add('is-open');
      panel.classList.add('is-active');
    });

    currentPanel = panel;
    var close = panel.querySelector('.panel-close');
    if (close) close.focus();
    document.addEventListener('keydown', onKeydown, true);
  }

  function closePanel() {
    if (!currentPanel) return;
    var panel = currentPanel;
    currentPanel = null;
    layer.classList.remove('is-open');
    panel.classList.remove('is-active');
    document.removeEventListener('keydown', onKeydown, true);

    var finish = function () {
      panel.hidden = true;
      layer.hidden = true;
      html.classList.remove('panel-open');
      backdrops.forEach(function (b) { b.removeAttribute('aria-hidden'); });
      if (enteringFrame) { enteringFrame.classList.remove('is-entering'); enteringFrame = null; }
      if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
    };
    if (reduced) finish();
    else setTimeout(finish, 460);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') { e.preventDefault(); closePanel(); return; }
    if (e.key === 'Tab' && currentPanel) {
      var f = focusables(currentPanel);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  // Close via scrim / close button
  layer.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) { e.preventDefault(); closePanel(); }
  });

  // Any element that opens a panel
  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-open], [data-goto]');
    if (!opener || layer.contains(opener)) {
      // still allow in-panel data-goto (switch panels)
      var goto = e.target.closest('[data-goto]');
      if (goto && layer.contains(goto)) {
        e.preventDefault();
        openPanel(goto.getAttribute('data-goto'), goto, null);
      }
      return;
    }
    var id = opener.getAttribute('data-open') || opener.getAttribute('data-goto');
    if (!id) return;
    e.preventDefault();
    var frame = opener.classList.contains('frame') ? opener : null;
    openPanel(id, opener, frame);
  });

  /* ============================================================
     HALL NAV (brass strip)
     ============================================================ */
  var nav = document.querySelector('.hallnav');
  if (nav) {
    var toggle = nav.querySelector('.hallnav-toggle');
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      var b = e.target.closest('[data-goto]');
      if (b) { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* ============================================================
     THE WALK — immersive 3D hall (progressive enhancement)
     ============================================================ */
  function initHall() {
    var stage = document.getElementById('stage');
    var world = document.getElementById('world');
    var welcome = document.getElementById('welcome');
    var farwall = document.getElementById('farwall');
    var frames = [].slice.call(document.querySelectorAll('.frame'));
    if (!stage || !world || !frames.length) return;

    gsap.registerPlugin(ScrollTrigger);
    html.classList.add('is-immersive');

    // Real mouse clicks on 3D-transformed frames hit-test to .world in Chrome,
    // so resolve the frontmost painting under the pointer ourselves.
    world.addEventListener('click', function (e) {
      if (currentPanel) return;
      var stack = document.elementsFromPoint(e.clientX, e.clientY);
      for (var i = 0; i < stack.length; i++) {
        var fr = stack[i].closest && stack[i].closest('.frame');
        if (fr && !fr.classList.contains('is-past')) {
          e.preventDefault();
          openPanel(fr.getAttribute('data-open'), fr, fr);
          return;
        }
      }
    });

    // Each frame's depth along the hall (from its --z).
    frames.forEach(function (f) {
      f.dataset.depth = parseFloat(getComputedStyle(f).getPropertyValue('--z')) || 0;
    });
    var maxDepth = Math.max.apply(null, frames.map(function (f) { return +f.dataset.depth; }));
    var maxCamz = maxDepth + 780;          // travel a little past the last frame
    var navBtns = [].slice.call(document.querySelectorAll('.hallnav [data-goto]'));

    function render(progress) {
      var camz = progress * maxCamz;
      world.style.transform = 'translateZ(' + camz + 'px)';
      html.style.setProperty('--progress', progress.toFixed(4));

      // café-warm near the door, gallery-cool deeper in
      html.setAttribute('data-view', progress > 0.52 ? 'gallery' : 'cafe');

      // welcome dissolves as you step in (first ~7%)
      var w = Math.max(0, 1 - progress / 0.07);
      if (welcome) {
        welcome.style.opacity = w;
        welcome.style.filter = 'blur(' + ((1 - w) * 6).toFixed(2) + 'px)';
        welcome.style.pointerEvents = w < 0.1 ? 'none' : '';
      }

      // which frame is under the spotlight (nearest to the viewer plane)
      var nearest = null, nd = Infinity;
      frames.forEach(function (f) {
        var combined = camz - (+f.dataset.depth);   // 0 == centred
        var past = combined > 560;
        f.classList.toggle('is-past', past);
        // atmospheric haze: deep frames recede so the hall reads clean
        if (past) f.style.opacity = '';
        else f.style.opacity = (combined >= -700 ? 1
          : Math.max(0.16, 1 + (combined + 700) / 2600)).toFixed(3);
        var dist = Math.abs(combined);
        if (dist < nd) { nd = dist; nearest = f; }
      });
      frames.forEach(function (f) { f.classList.toggle('is-focus', f === nearest && nd < 520); });

      // reflect the focused room in the nav
      var id = nearest && nd < 520 ? nearest.getAttribute('data-open') : null;
      navBtns.forEach(function (b) {
        b.setAttribute('aria-current', String(b.getAttribute('data-goto') === id));
      });

      // the far wall arrives at the end
      if (farwall) farwall.classList.toggle('is-here', progress > 0.94);
    }

    var st = ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: function () { return '+=' + maxCamz; },
      pin: stage,
      pinSpacing: true,
      onUpdate: function (self) { render(self.progress); },
      onRefreshInit: function () { render(0); }
    });
    render(0);

    // Nav / internal "goto": in the hall, walk to that painting instead
    // of opening it cold — then it's centred and lit for you.
    function walkTo(id) {
      var target = frames.filter(function (f) { return f.getAttribute('data-open') === id; })[0];
      if (!target) return false;
      var p = (+target.dataset.depth) / maxCamz;
      var top = st.start + p * (st.end - st.start);
      window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
      return true;
    }
    // Intercept hall-nav clicks to walk rather than open (capture before the
    // global opener). Panel-internal gotos still open directly.
    if (nav) {
      nav.addEventListener('click', function (e) {
        var b = e.target.closest('[data-goto]');
        if (!b) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        var id = b.getAttribute('data-goto');
        nav.classList.remove('is-open');
        if (!walkTo(id)) openPanel(id, b, null);
      }, true);
    }

    // keyboard: arrows / space page you down the hall (native scroll already
    // handles most; we just make sure focus isn't trapped in the pinned stage)
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  var immersive = hasGSAP && !reduced && !coarseSmall;
  if (immersive) {
    try { initHall(); }
    catch (err) { /* if anything goes wrong, the static room index remains */ }
  }

})();
