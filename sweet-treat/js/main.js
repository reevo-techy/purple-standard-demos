/* ============================================================
   Sweet Treat Desserts — interactions
   Vanilla JS. Each block no-ops if its markup is absent.
   Respects prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2.4" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" ' +
    'stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ---- Mobile nav toggle ----------------------------------- */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.getElementById('navmenu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Scroll reveal --------------------------------------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- Sticky call bar: one pulse on first load ------------ */
  function initCallBar() {
    var bar = document.querySelector('.call-bar');
    if (!bar || reduced) return;
    setTimeout(function () {
      bar.classList.add('pulse');
      setTimeout(function () { bar.classList.remove('pulse'); }, 1200);
    }, 700);
  }

  /* ---- Sweet Treat's cake — a hand-built SVG centrepiece ---- *
     The cake IS the menu. It is generated from the TIERS config
     below (geometry + flavour palette + copy), drawn as an inline
     SVG cake-stand, and animated with GSAP:
       • Entrance — the stand fades up, tiers rise & stack with a
         soft overshoot, the cherry drops in. (Page load = rare, so
         a little delight is earned.)
       • Idle — a slow ±1.4° sway and a gentle cherry bob; both
         pause the moment you engage a tier.
       • Hover / focus — the tier lifts, the others dim, the detail
         panel cross-fades in its copy.
       • Touch — first tap PREVIEWS; a second tap on the same tier
         navigates. Tap outside to dismiss.
       • Keyboard — Enter/Space navigates instantly (no flourish).
     prefers-reduced-motion: no entrance / idle / lift — the cake
     renders statically and taps navigate immediately. */
  var CX = 280;
  var TIERS = [
    { key: 'cupcakes', href: 'pages/cupcakes.html', label: 'Cupcakes', fs: 25,
      topY: 310, hw: 190, h: 102, ry: 22,
      body: ['#D2E9FA', '#A9D3F3', '#7CB9E8'], top: ['#F2F9FF', '#DCEEFB', '#B0D6F4'], icing: '#EAF5FE',
      sprinkle: ['#1F38A8', '#F3B33F', '#7FCBA4'],
      kicker: 'Layer 01 — the base', title: 'Cupcakes',
      blurb: 'Where it started. Dozens of from-scratch cupcake flavours, ready at the counter or by the box.',
      cta: 'Explore cupcakes' },
    { key: 'desserts', href: 'pages/desserts.html', label: 'Desserts', fs: 23,
      topY: 226, hw: 158, h: 84, ry: 20,
      body: ['#FCE6B4', '#F5D488', '#E9BE5E'], top: ['#FFF8E2', '#FBEDC6', '#F2D48C'], icing: '#FEF3D6',
      sprinkle: ['#1F38A8', '#7FCBA4', '#7C96EE'],
      kicker: 'Layer 02', title: 'Desserts & Treats',
      blurb: 'The case by the till — squares, cookies, brownies and bars, all baked fresh from scratch.',
      cta: 'Explore desserts' },
    { key: 'cakes', href: 'pages/cakes.html', label: 'Custom Cakes', fs: 21,
      topY: 154, hw: 130, h: 72, ry: 18,
      body: ['#CFEBDB', '#ABDBC2', '#84C6A4'], top: ['#EDF9F1', '#D3ECDD', '#A7D9BD'], icing: '#E6F5EC',
      sprinkle: ['#1F38A8', '#F3B33F', '#7C96EE'],
      kicker: 'Layer 03', title: 'Custom Cakes',
      blurb: "Birthday and celebration cakes, made to order and decorated around whatever you're celebrating.",
      cta: 'Explore custom cakes' },
    { key: 'weddings', href: 'pages/weddings.html', label: 'Weddings', fs: 18,
      topY: 92, hw: 102, h: 62, ry: 16,
      body: ['#E4F1FC', '#CDE4F8', '#B0D2F0'], top: ['#F7FBFF', '#E2F0FC', '#C6E0F6'], icing: '#F0F7FE',
      sprinkle: ['#1F38A8', '#F3B33F', '#7FCBA4'],
      kicker: 'Layer 04 — the top tier', title: 'Wedding Cakes',
      blurb: 'The showpiece. Tiered wedding cakes planned with you, start to finish — and yes, a wedding cake from a nut-free kitchen.',
      cta: 'Explore wedding cakes' }
  ];
  var BYKEY = {};
  TIERS.forEach(function (t) { BYKEY[t.key] = t; });

  function buildCakeSVG() {
    var defs =
      '<linearGradient id="curve" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="#1E2F40" stop-opacity="0.30"/>' +
        '<stop offset="0.16" stop-color="#fff" stop-opacity="0.05"/>' +
        '<stop offset="0.5" stop-color="#fff" stop-opacity="0.28"/>' +
        '<stop offset="0.84" stop-color="#fff" stop-opacity="0.05"/>' +
        '<stop offset="1" stop-color="#1E2F40" stop-opacity="0.30"/></linearGradient>' +
      '<radialGradient id="plate-g" cx="0.5" cy="0.26" r="0.9">' +
        '<stop offset="0" stop-color="#FFFFFF"/><stop offset="0.6" stop-color="#F6EADF"/>' +
        '<stop offset="1" stop-color="#E7D3C2"/></radialGradient>' +
      '<linearGradient id="stem-g" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0" stop-color="#E7D3C2"/><stop offset="0.5" stop-color="#FFFDF8"/>' +
        '<stop offset="1" stop-color="#E7D3C2"/></linearGradient>' +
      '<radialGradient id="cherry-g" cx="0.36" cy="0.3" r="0.8">' +
        '<stop offset="0" stop-color="#C4D0FA"/><stop offset="0.45" stop-color="#7C96EE"/>' +
        '<stop offset="1" stop-color="#172880"/></radialGradient>';
    TIERS.forEach(function (t) {
      defs +=
        '<linearGradient id="body-' + t.key + '" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="' + t.body[0] + '"/>' +
          '<stop offset="0.52" stop-color="' + t.body[1] + '"/>' +
          '<stop offset="1" stop-color="' + t.body[2] + '"/></linearGradient>' +
        '<radialGradient id="top-' + t.key + '" cx="0.5" cy="0.32" r="0.75">' +
          '<stop offset="0" stop-color="' + t.top[0] + '"/>' +
          '<stop offset="0.46" stop-color="' + t.top[1] + '"/>' +
          '<stop offset="1" stop-color="' + t.top[2] + '"/></radialGradient>';
    });

    var stand = '<g id="cake-stand">' +
      '<ellipse cx="280" cy="489" rx="66" ry="13" fill="url(#plate-g)"/>' +
      '<path d="M 251 479 C 258 452 258 446 263 429 L 297 429 C 302 446 302 452 309 479 C 300 486 260 486 251 479 Z" fill="url(#stem-g)"/>' +
      '<path d="M 74 410 A 206 25 0 0 0 486 410 L 486 419 A 206 25 0 0 1 74 419 Z" fill="#E7D3C2"/>' +
      '<ellipse cx="280" cy="410" rx="206" ry="25" fill="url(#plate-g)"/>' +
      '<ellipse cx="280" cy="405" rx="150" ry="14" fill="#fff" opacity="0.5"/></g>';

    var cherry = '<g id="cherry">' +
      '<path d="M 280 66 C 286 54 296 50 302 46" fill="none" stroke="#7d8a55" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M 302 46 q 13 -5 19 4 q -13 6 -19 -4 Z" fill="#8BA35A"/>' +
      '<circle cx="280" cy="78" r="15" fill="url(#cherry-g)"/>' +
      '<ellipse cx="275" cy="72" rx="4.5" ry="3.2" fill="#fff" opacity="0.85"/></g>';

    var svg = '<svg class="cake-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 600" ' +
      'role="img" aria-label="Sweet Treat’s tiered cake — each layer links to part of the menu">' +
      '<defs>' + defs + '</defs>' +
      '<ellipse cx="280" cy="503" rx="165" ry="19" fill="#6B4A3A" opacity="0.16"/>' +
      '<g id="cake-stack">' + stand + TIERS.map(tierSVG).join('') + cherry + '</g></svg>';
    return svg;
  }

  function tierSVG(t) {
    var Lx = CX - t.hw, Rx = CX + t.hw, T = t.topY, B = t.topY + t.h, rb = 15;
    var bodyD = 'M ' + Lx + ' ' + T + ' L ' + Lx + ' ' + (B - 2) +
      ' Q ' + Lx + ' ' + (B + rb) + ' ' + CX + ' ' + (B + rb) +
      ' Q ' + Rx + ' ' + (B + rb) + ' ' + Rx + ' ' + (B - 2) + ' L ' + Rx + ' ' + T + ' Z';
    var body = '<path class="tier-body" fill="url(#body-' + t.key + ')" d="' + bodyD + '"/>' +
      '<path fill="url(#curve)" d="' + bodyD + '"/>';
    var top = '<ellipse cx="' + CX + '" cy="' + T + '" rx="' + t.hw + '" ry="' + t.ry + '" fill="url(#top-' + t.key + ')"/>' +
      '<ellipse cx="' + CX + '" cy="' + (T - t.ry * 0.32) + '" rx="' + (t.hw * 0.66) + '" ry="' + (t.ry * 0.5) + '" fill="#fff" opacity="0.4"/>';

    // piped buttercream drips hanging from the frosting rim
    var drips = '', pad = 14, span = 2 * t.hw - 2 * pad, n = Math.max(4, Math.round(span / 30)), step = span / n;
    var pat = [1, 0.62, 0.88, 0.5, 0.95, 0.7, 0.58];
    for (var i = 0; i <= n; i++) {
      var x = Lx + pad + step * i, dep = 10 + pat[i % pat.length] * 16, w = step * 0.42, y0 = T + t.ry * 0.5;
      drips += '<path fill="' + t.icing + '" d="M ' + (x - w) + ' ' + y0 +
        ' C ' + (x - w) + ' ' + (y0 + dep * 0.7) + ' ' + (x - w * 0.55) + ' ' + (y0 + dep) + ' ' + x + ' ' + (y0 + dep) +
        ' C ' + (x + w * 0.55) + ' ' + (y0 + dep) + ' ' + (x + w) + ' ' + (y0 + dep * 0.7) + ' ' + (x + w) + ' ' + y0 + ' Z"/>';
    }

    // a few funfetti sprinkles, biased away from the label
    var sprk = '', sp = [[-0.64, 0.32, 20], [0.6, 0.6, -26], [-0.32, 0.74, 44], [0.36, 0.28, -12]];
    for (var s = 0; s < sp.length; s++) {
      var sx = CX + sp[s][0] * t.hw, sy = T + t.ry + 12 + sp[s][1] * (t.h - t.ry - 22), col = t.sprinkle[s % t.sprinkle.length];
      sprk += '<rect x="' + (sx - 5) + '" y="' + (sy - 2) + '" width="10" height="4.2" rx="2.1" fill="' + col + '" transform="rotate(' + sp[s][2] + ' ' + sx + ' ' + sy + ')" opacity="0.9"/>';
    }

    var ly = T + t.ry + (t.h - t.ry) * 0.5 + 2;
    var awx = t.label.length * t.fs * 0.30 + 16;
    var label = '<text class="tier-text" x="' + CX + '" y="' + ly + '" text-anchor="middle" font-size="' + t.fs + '" dominant-baseline="middle">' + t.label + '</text>' +
      '<text class="tier-arw" x="' + (CX + awx) + '" y="' + ly + '" text-anchor="middle" font-size="' + t.fs + '" dominant-baseline="middle">→</text>';

    return '<a class="tier tier-' + t.key + '" data-tier="' + t.key + '" href="' + t.href + '" ' +
      'role="link" tabindex="0" aria-label="' + t.title + ' — explore"><g>' +
      body + top + drips + sprk + label + '</g></a>';
  }

  function initCake() {
    var stage = document.getElementById('cakescape');
    var panel = document.getElementById('cake-panel');
    if (!stage || !panel) return;

    var g = window.gsap;
    stage.insertAdjacentHTML('afterbegin', buildCakeSVG());
    var tiers = [].slice.call(stage.querySelectorAll('.tier'));
    tiers.forEach(function (a) { var t = BYKEY[a.dataset.tier]; a.__cy = t.topY + t.h / 2; });

    var kicker = document.getElementById('panel-kicker');
    var title  = document.getElementById('panel-title');
    var text   = document.getElementById('panel-text');
    var link   = document.getElementById('panel-link');
    var canHover = window.matchMedia('(hover: hover)').matches;
    var D = reduced ? 0 : 1;
    var current = null, launching = false, sway = null, bob = null;

    var def = {
      kicker: kicker.textContent, title: title.textContent,
      text: text.textContent, href: link.getAttribute('href'), cta: link.textContent.trim()
    };

    // ---- entrance + idle life (skipped entirely under reduced motion) ----
    if (g && !reduced) {
      g.set(tiers, { y: 36, opacity: 0, scale: 0.96, svgOrigin: function (i, el) { return CX + ' ' + el.__cy; } });
      g.set('#cherry', { y: -70, opacity: 0 });
      g.set('#cake-stand', { opacity: 0, scale: 0.92, svgOrigin: '280 432' });
      sway = g.to('#cake-stack', { rotation: 1.4, duration: 6.5, ease: 'sine.inOut', yoyo: true, repeat: -1, svgOrigin: '280 410', paused: true });
      bob  = g.to('#cherry', { y: -4, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true });
      g.timeline({ delay: 0.15 })
        .to('#cake-stand', { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' })
        .to(tiers, { y: 0, opacity: 1, scale: 1, duration: 0.62, ease: 'back.out(1.4)', stagger: 0.09 }, '-=0.25')
        .to('#cherry', { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(2.2)' }, '-=0.18')
        .add(function () { sway.play(); bob.play(); });
    }

    function writePanel(d) {
      kicker.textContent = d.kicker; title.textContent = d.title; text.textContent = d.text;
      link.setAttribute('href', d.href); link.innerHTML = d.cta + ' ' + ARROW;
    }
    function paint(d) {
      if (!g || reduced) { writePanel(d); return; }
      g.timeline({ overwrite: true })
        .to(panel, { autoAlpha: 0.4, y: 6, duration: 0.14, ease: 'power2.in' })
        .add(function () { writePanel(d); })
        .to(panel, { autoAlpha: 1, y: 0, duration: 0.26, ease: 'power2.out' });
    }

    function lift(a) {
      if (!g) return;
      var others = tiers.filter(function (t) { return t !== a; });
      g.to(a, { y: -10, scale: 1.045, opacity: 1, duration: 0.5 * D, ease: 'back.out(1.6)', overwrite: 'auto', svgOrigin: CX + ' ' + a.__cy });
      g.to(others, { opacity: 0.5, duration: 0.4 * D, ease: 'power3.out', overwrite: 'auto' });
    }
    function settle() {
      if (!g) return;
      g.to(tiers, { y: 0, scale: 1, opacity: 1, duration: 0.5 * D, ease: 'power3.out', overwrite: 'auto' });
    }

    function activate(a) {
      if (a === current) return;
      current = a;
      if (sway) sway.pause(); if (bob) bob.pause();
      tiers.forEach(function (t) { t.classList.toggle('is-active', t === a); });
      lift(a);
      var t = BYKEY[a.dataset.tier];
      paint({ kicker: t.kicker, title: t.title, text: t.blurb, href: t.href, cta: t.cta });
    }
    function reset() {
      if (launching || !current) return;
      current = null;
      tiers.forEach(function (t) { t.classList.remove('is-active'); });
      settle();
      if (!reduced) { if (sway) sway.resume(); if (bob) bob.resume(); }
      paint(def);
    }
    function launch(a) {
      if (!g || reduced) { window.location.href = a.href; return; }
      launching = true;
      g.to(a, { y: -26, scale: 1.09, duration: 0.4, ease: 'power2.in', overwrite: true, svgOrigin: CX + ' ' + a.__cy,
        onComplete: function () { window.location.href = a.href; } });
    }

    tiers.forEach(function (a) {
      if (canHover) a.addEventListener('pointerenter', function () { activate(a); });
      a.addEventListener('focus', function () { activate(a); });
      a.addEventListener('click', function (e) {
        if (e.detail === 0) return;                 // keyboard: navigate instantly
        if (!canHover) {                            // touch: peek first, then go
          e.preventDefault();
          if (a === current) launch(a); else activate(a);
          return;
        }
        e.preventDefault();                         // mouse: flourish, then go
        activate(a); launch(a);
      });
    });

    if (canHover) {
      stage.addEventListener('pointerleave', reset);
      stage.addEventListener('focusout', function (e) { if (!stage.contains(e.relatedTarget)) reset(); });
    } else {
      document.addEventListener('pointerdown', function (e) { if (!stage.contains(e.target)) reset(); });
    }
  }

  /* ---- Cake-order enquiry form: mailto: fallback ----------- *
     Until a real backend (Formspree / SimpleForm) is wired up,
     the form composes an email to the bakery. See README. */
  function initForm() {
    var form = document.getElementById('order-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      if (form.dataset.backend === 'live') return;
      e.preventDefault();
      var get = function (n) { var el = form.elements[n]; return el ? el.value.trim() : ''; };
      var subject = 'Cake order enquiry — ' + (get('occasion') || 'website');
      var body =
        'Name: ' + get('name') + '\n' +
        'Phone: ' + get('phone') + '\n' +
        'Email: ' + get('email') + '\n' +
        'Occasion: ' + get('occasion') + '\n' +
        'Date needed: ' + get('date') + '\n' +
        'Size / servings: ' + get('servings') + '\n' +
        'Allergies / dietary needs: ' + get('allergies') + '\n\n' +
        'Details:\n' + get('details') + '\n';
      // [CONFIRM] Replace with the bakery's real domain email.
      window.location.href = 'mailto:hello@sweettreatdesserts.co.uk'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initReveal();
    initCallBar();
    initCake();
    initForm();
  });
})();
