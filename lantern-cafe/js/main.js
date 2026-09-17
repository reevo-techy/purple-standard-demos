/* ============================================================
   Lantern Art Cafe — interactions
   Vanilla JS. Each block no-ops if its markup is absent.
   Respects prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Derive base path from this script's location, so fetches work when served
     from any subpath (e.g., /purple-standard-demos/lantern-cafe/) and offline. */
  var scriptSrc = document.currentScript?.src || '';
  var baseUrl = scriptSrc ? new URL('../', scriptSrc).href : '';
  function dataUrl(path) {
    return baseUrl ? new URL('data/' + path, baseUrl).href : 'data/' + path;
  }

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

  /* ---- The Two Walls toggle ------------------------------- *
     Flips the page's emphasis between "Cafe view" and
     "Gallery view" — same content, re-weighted via CSS
     custom properties on <html data-view>. Persists in
     localStorage. Defaults: cafe in the morning (until 16:00),
     gallery in the evening, unless the user has already chosen. */
  function initTwoWalls() {
    var ctrl = document.querySelector('.two-walls');
    if (!ctrl) return;
    var STORE_KEY = 'lantern:view';
    var html = document.documentElement;

    var stored = null;
    try { stored = localStorage.getItem(STORE_KEY); } catch (_) {}
    var defaultView = (new Date().getHours() >= 16) ? 'gallery' : 'cafe';
    var view = (stored === 'cafe' || stored === 'gallery') ? stored : defaultView;
    setView(view, false);

    ctrl.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-view-set]');
      if (!btn) return;
      setView(btn.getAttribute('data-view-set'), true);
    });

    function setView(next, persist) {
      html.setAttribute('data-view', next);
      ctrl.querySelectorAll('button[data-view-set]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-view-set') === next));
      });
      if (persist) {
        try { localStorage.setItem(STORE_KEY, next); } catch (_) {}
      }
    }
  }

  /* ---- Current exhibition (homepage hero + Now Showing) ---- */
  function initExhibition() {
    var slots = document.querySelectorAll('[data-exhibition-slot]');
    if (!slots.length) return;
    fetch(dataUrl('exhibitions.json'), { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data.current) {
          slots.forEach(function (slot) {
            slot.outerHTML = '<p class="hand" style="font-size:1.2rem;color:var(--ink-soft)">Between shows — submit yours.</p>';
          });
          var band = document.querySelector('.showing');
          if (band) band.classList.add('showing--between');
          return;
        }
        var ex = data.current;
        slots.forEach(function (slot) {
          var kind = slot.getAttribute('data-exhibition-slot');
          if (kind === 'title')   slot.textContent = ex.title || '';
          if (kind === 'artist')  slot.textContent = ex.artist || '';
          if (kind === 'dates')   slot.textContent = formatDates(ex.startDate, ex.endDate);
          if (kind === 'image')   {
            slot.setAttribute('src', ex.image || 'images/exhibit-placeholder.webp');
            slot.setAttribute('alt', (ex.title ? ex.title + ' — ' : '') + (ex.artist || 'current exhibition'));
          }
          if (kind === 'statement') slot.textContent = ex.statement || '';
          if (kind === 'medium')  slot.textContent = ex.medium || '';
        });
      })
      .catch(function () { /* graceful: server may be file://; markup defaults shown */ });
  }

  function formatDates(a, b) {
    if (!a) return '';
    var fmt = function (iso) {
      var d = new Date(iso + 'T00:00:00');
      if (isNaN(d)) return iso;
      return d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
    };
    var year = (new Date(a + 'T00:00:00')).getFullYear();
    return fmt(a) + ' — ' + fmt(b) + ', ' + year;
  }

  /* ---- This-week calendar strip --------------------------- */
  function initWeekStrip() {
    var strip = document.querySelector('.week-strip');
    if (!strip) return;
    var today = new Date(); today.setHours(0,0,0,0);
    var days = [];
    for (var i = 0; i < 7; i++) {
      var d = new Date(today); d.setDate(today.getDate() + i);
      days.push(d);
    }

    // Pre-render the 7 day cards so the band has shape even without JS-fetched data.
    strip.innerHTML = days.map(function (d, i) {
      return dayCard(d, i === 0, null);
    }).join('');

    fetch(dataUrl('events.json'), { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : { events: [] }; })
      .then(function (data) {
        var events = (data && data.events) || [];
        strip.innerHTML = days.map(function (d, i) {
          var iso = d.toISOString().slice(0, 10);
          var todays = events.filter(function (e) { return e.date === iso; });
          return dayCard(d, i === 0, todays);
        }).join('');
      })
      .catch(function () { /* file:// — leave the default cards */ });
  }

  function dayCard(d, isToday, events) {
    var dow = d.toLocaleDateString('en-CA', { weekday: 'short' });
    var dom = d.getDate();
    var body;
    if (events && events.length) {
      body = events.map(function (e) {
        return '<div class="ev">' +
                  '<div class="ev-title">' + escapeHtml(e.title || 'Event') + '</div>' +
                  (e.time ? '<div class="ev-time">' + escapeHtml(e.time) + '</div>' : '') +
                  (e.artist ? '<div class="ev-art">' + escapeHtml(e.artist) + '</div>' : '') +
                '</div>';
      }).join('');
    } else {
      body = '<div class="ev ev--open">Open as usual<br>kitchen til 8pm</div>';
    }
    return '<div class="week-day' + (isToday ? ' is-today' : '') + '">' +
              '<span class="dow">' + dow + (isToday ? ' · today' : '') + '</span>' +
              '<span class="date">' + dom + '</span>' +
              body +
           '</div>';
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c];
    });
  }

  /* ---- Form: mailto: fallback ----------------------------- *
     Until a real form backend (Formspree / SimpleForm) is wired
     up, the two enquiry forms compose an email to the cafe.
     Swap the form's action for the provider endpoint and set
     data-backend="live" to disable the fallback — see README. */
  function initForms() {
    document.querySelectorAll('form[data-enquiry]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        if (form.dataset.backend === 'live') return;
        e.preventDefault();
        var kind = form.getAttribute('data-enquiry');
        var fields = Array.from(form.elements).filter(function (el) {
          return el.name && el.type !== 'submit';
        });
        var body = fields.map(function (el) {
          var label = (form.querySelector('label[for="' + el.id + '"]') || {}).textContent || el.name;
          return label.replace(/\s+/g,' ').trim() + ': ' + (el.value || '').trim();
        }).join('\n');
        var subject = (kind === 'book')
          ? 'Book the space enquiry — Lantern'
          : 'Show your work enquiry — Lantern';
        var to = 'hello@lanternartcafe.ca';
        window.location.href = 'mailto:' + to +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(body);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initTwoWalls();      // run before reveal so toggle is responsive immediately
    initReveal();
    initExhibition();
    initWeekStrip();
    initForms();
  });
})();
