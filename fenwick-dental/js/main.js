/* ============================================================
   Fenwick Family Dental — interactions
   Vanilla JS. Runs on every page; each block no-ops if its
   markup is absent. Respects prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  /* ---- FAQ accordion --------------------------------------- */
  function initFaq() {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      var q = item.querySelector('.faq-q');
      var a = item.querySelector('.faq-a');
      if (!q || !a) return;
      q.addEventListener('click', function () {
        var open = q.getAttribute('aria-expanded') === 'true';
        // close siblings for a clean single-open accordion
        items.forEach(function (other) {
          var oq = other.querySelector('.faq-q');
          var oa = other.querySelector('.faq-a');
          if (oq && oa) { oq.setAttribute('aria-expanded', 'false'); oa.style.maxHeight = null; }
        });
        if (!open) {
          q.setAttribute('aria-expanded', 'true');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---- Team carousel --------------------------------------- */
  function initCarousel() {
    var rail = document.querySelector('.team-rail');
    if (!rail) return;
    var prev = document.querySelector('[data-rail="prev"]');
    var next = document.querySelector('[data-rail="next"]');
    var card = rail.querySelector('.team-card');
    if (!card) return;
    var step = function () { return card.offsetWidth + 24; };

    function update() {
      if (!prev || !next) return;
      prev.disabled = rail.scrollLeft < 8;
      next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;
    }
    if (prev) prev.addEventListener('click', function () {
      rail.scrollBy({ left: -step(), behavior: reduced ? 'auto' : 'smooth' });
    });
    if (next) next.addEventListener('click', function () {
      rail.scrollBy({ left: step(), behavior: reduced ? 'auto' : 'smooth' });
    });
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
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
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- Trust-strip star: one twinkle on first view --------- */
  function initTwinkle() {
    var star = document.querySelector('.twinkle');
    if (!star || reduced || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('go'); io.disconnect(); }
      });
    }, { threshold: 0.6 });
    io.observe(star);
  }

  /* ---- Booking portal -------------------------------------- *
     Self-contained 4-step demo wizard on contact.html#book.
     No backend: availability is generated client-side and the
     confirmation is simulated. In production this whole block is
     replaced by the practice's real booking platform embed
     (NexHealth / Setmore / Dentrix) — the markup no-ops elsewhere. */
  function initBooking() {
    var root = document.getElementById('booking');
    if (!root) return;

    var SERVICES = [
      { id: 'general',    name: 'General & Family', mins: 60, blurb: 'Checkups, fillings, everyday care', icon: 'M12 3l7 4v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V7l7-4z' },
      { id: 'hygiene',    name: 'Cleanings & Hygiene', mins: 45, blurb: 'Cleaning, polish & gum care', icon: 'M12 2c2 3 3 5 3 8a3 3 0 01-6 0c0-3 1-5 3-8zM7 13c-2 2-3 4-3 7M17 13c2 2 3 4 3 7' },
      { id: 'invisalign', name: 'Invisalign', mins: 30, blurb: 'Clear aligner consultation', icon: 'M4 9c2-2 4-2 8-2s6 0 8 2M4 15c2 2 4 2 8 2s6 0 8-2M8 9v6M12 9v6M16 9v6' },
      { id: 'implants',   name: 'Dental Implants', mins: 45, blurb: 'Replace a missing tooth', icon: 'M12 3c2.5 0 4 2 4 4.5 0 2-.6 3-1 5.5l-.8 5c-.2 1.2-1.2 1.2-1.4 0L12 15M12 3c-2.5 0-4 2-4 4.5 0 2 .6 3 1 5.5' },
      { id: 'whitening',  name: 'Zoom Whitening', mins: 90, blurb: 'Brighten your smile in one visit', icon: 'M12 3v3M5 6l2 2M19 6l-2 2M4 13c0 4 3.5 8 8 8s8-4 8-8c0-2-8-3-8-3s-8 1-8 3z' },
      { id: 'emergency',  name: 'Emergency', mins: 30, blurb: 'In pain? We’ll fit you in fast', icon: 'M13 2L4.5 13H11l-1 9 8.5-12H12l1-8z' }
    ];
    var CLINICIANS = ['First available', 'Dr. Nadia Kessler'];

    // State
    var state = { step: 1, service: null, newPatient: false, clinician: 'First available', date: null, time: null };

    // Elements
    var panels = root.querySelectorAll('.bp-panel');
    var stepEls = root.querySelectorAll('.bp-step');
    var backBtn = document.getElementById('bp-back');
    var nextBtn = document.getElementById('bp-next');
    var svcWrap = document.getElementById('bp-services');
    var newPatient = document.getElementById('bp-newpatient');
    var clinWrap = document.getElementById('bp-clinicians');
    var datesWrap = document.getElementById('bp-dates');
    var timesWrap = document.getElementById('bp-times');
    var timesFor = document.getElementById('bp-times-for');
    var summary = document.getElementById('bp-summary');
    var success = document.getElementById('bp-success');
    var reviewHead = document.getElementById('bp-review-head');
    var confEl = document.getElementById('bp-conf');
    var actions = document.getElementById('bp-actions');

    root.hidden = false; // reveal now that JS is driving it

    /* -- Build service cards -- */
    SERVICES.forEach(function (s) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'bp-service';
      b.setAttribute('role', 'option');
      b.setAttribute('aria-pressed', 'false');
      b.dataset.id = s.id;
      b.innerHTML =
        '<span class="bp-service-ico" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="' + s.icon + '"/></svg></span>' +
        '<span class="bp-service-name">' + s.name + '</span>' +
        '<span class="bp-service-meta">' + s.blurb + ' · ~' + s.mins + ' min</span>';
      b.addEventListener('click', function () {
        state.service = s.id;
        svcWrap.querySelectorAll('.bp-service').forEach(function (el) {
          el.setAttribute('aria-pressed', String(el === b));
        });
        syncNext();
      });
      svcWrap.appendChild(b);
    });
    newPatient.addEventListener('change', function () { state.newPatient = newPatient.checked; });

    /* -- Build clinician chips -- */
    CLINICIANS.forEach(function (name, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'bp-chip';
      b.textContent = name;
      b.setAttribute('aria-pressed', String(i === 0));
      b.addEventListener('click', function () {
        state.clinician = name;
        clinWrap.querySelectorAll('.bp-chip').forEach(function (el) {
          el.setAttribute('aria-pressed', String(el === b));
        });
        if (state.date) renderTimes(); // roster change can shuffle availability
      });
      clinWrap.appendChild(b);
    });

    /* -- Generate the next 10 open days (skip Sundays) -- */
    var DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var openDays = [];
    var cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    cursor.setDate(cursor.getDate() + 1); // start tomorrow
    while (openDays.length < 10) {
      if (cursor.getDay() !== 0) openDays.push(new Date(cursor)); // 0 = Sunday closed
      cursor.setDate(cursor.getDate() + 1);
    }
    openDays.forEach(function (d) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'bp-date';
      b.setAttribute('aria-pressed', 'false');
      b.dataset.key = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
      b.innerHTML =
        '<span class="bp-date-dow">' + DOW[d.getDay()] + '</span>' +
        '<span class="bp-date-num">' + d.getDate() + '</span>' +
        '<span class="bp-date-mon">' + MON[d.getMonth()] + '</span>';
      b.addEventListener('click', function () {
        state.date = d;
        state.time = null;
        datesWrap.querySelectorAll('.bp-date').forEach(function (el) {
          el.setAttribute('aria-pressed', String(el === b));
        });
        renderTimes();
        syncNext();
      });
      datesWrap.appendChild(b);
    });

    /* -- Deterministic "open slot" availability (no RNG) --
       Hours: Mon–Thu 9–19, Fri 9–16, Sat 9–14. Half-hour slots.
       A slot is "taken" via a stable hash of clinician+date+time so
       the grid looks real and never reshuffles on re-render. */
    function hoursFor(day) {
      if (day === 5) return [9, 16];   // Fri
      if (day === 6) return [9, 14];   // Sat
      return [9, 19];                  // Mon–Thu
    }
    function hash(str) {
      var h = 0;
      for (var i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) & 0xffff; }
      return h;
    }
    function slotsFor(date, clinician) {
      var bounds = hoursFor(date.getDay());
      var out = [];
      for (var m = bounds[0] * 60; m < bounds[1] * 60; m += 30) {
        var hh = Math.floor(m / 60), mm = m % 60;
        var ampm = hh < 12 ? 'AM' : 'PM';
        var h12 = ((hh + 11) % 12) + 1;
        var label = h12 + ':' + (mm === 0 ? '00' : '30') + ' ' + ampm;
        var key = clinician + '|' + date.getDate() + '|' + m;
        if (hash(key) % 10 < 6) out.push(label); // ~40% shown as taken
      }
      return out;
    }
    function renderTimes() {
      var slots = slotsFor(state.date, state.clinician);
      timesWrap.innerHTML = '';
      timesFor.textContent = ' · ' + DOW[state.date.getDay()] + ' ' + MON[state.date.getMonth()] + ' ' + state.date.getDate();
      if (!slots.length) {
        timesWrap.innerHTML = '<p class="bp-empty">No online slots left this day. Please pick another date or call us.</p>';
        return;
      }
      slots.forEach(function (label) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'bp-time';
        b.textContent = label;
        b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', function () {
          state.time = label;
          timesWrap.querySelectorAll('.bp-time').forEach(function (el) {
            el.setAttribute('aria-pressed', String(el === b));
          });
          syncNext();
        });
        timesWrap.appendChild(b);
      });
    }

    /* -- Step 3 validation -- */
    var f = {
      name:  document.getElementById('bp-name'),
      phone: document.getElementById('bp-phone'),
      email: document.getElementById('bp-email'),
      lang:  document.getElementById('bp-lang'),
      notes: document.getElementById('bp-notes')
    };
    function showError(input, msg) {
      clearError(input);
      input.setAttribute('aria-invalid', 'true');
      var p = document.createElement('p');
      p.className = 'bp-error';
      p.textContent = msg;
      input.parentNode.appendChild(p);
    }
    function clearError(input) {
      input.removeAttribute('aria-invalid');
      var ex = input.parentNode.querySelector('.bp-error');
      if (ex) ex.remove();
    }
    [f.name, f.phone, f.email].forEach(function (input) {
      input.addEventListener('input', function () { clearError(input); });
    });
    function validateDetails() {
      var ok = true;
      if (!f.name.value.trim()) { showError(f.name, 'Please tell us your name.'); ok = false; }
      if (!f.phone.value.trim() || f.phone.value.replace(/\D/g, '').length < 7) { showError(f.phone, 'Enter a phone number we can reach you at.'); ok = false; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value.trim())) { showError(f.email, 'Enter a valid email address.'); ok = false; }
      return ok;
    }

    /* -- Whether the current step lets you continue -- */
    function stepValid() {
      if (state.step === 1) return !!state.service;
      if (state.step === 2) return !!(state.date && state.time);
      return true; // step 3 validates on Continue; step 4 has its own button
    }
    function syncNext() { nextBtn.disabled = !stepValid(); }

    /* -- Summary on step 4 -- */
    function serviceName(id) {
      var s = SERVICES.filter(function (x) { return x.id === id; })[0];
      return s ? s.name : '';
    }
    function fmtDate(d) { return DOW[d.getDay()] + ', ' + MON[d.getMonth()] + ' ' + d.getDate(); }
    function buildSummary() {
      var rows = [
        ['Service', serviceName(state.service) + (state.newPatient ? ' (new patient)' : '')],
        ['Clinician', state.clinician],
        ['When', fmtDate(state.date) + ' at ' + state.time],
        ['Name', f.name.value.trim()],
        ['Phone', f.phone.value.trim()],
        ['Email', f.email.value.trim()],
        ['Language', f.lang.value]
      ];
      if (f.notes.value.trim()) rows.push(['Notes', f.notes.value.trim()]);
      summary.innerHTML = rows.map(function (r) {
        return '<div><dt>' + r[0] + '</dt><dd>' + escapeHtml(r[1]) + '</dd></div>';
      }).join('');
    }
    function escapeHtml(str) {
      return String(str).replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
      });
    }

    /* -- Step navigation -- */
    function go(step) {
      state.step = step;
      root.dataset.step = String(step);
      panels.forEach(function (p) { p.hidden = Number(p.dataset.panel) !== step; });
      stepEls.forEach(function (el) {
        var n = Number(el.dataset.step);
        el.dataset.state = n === step ? 'active' : (n < step ? 'done' : 'todo');
      });
      backBtn.hidden = step === 1;
      nextBtn.textContent = step === 4 ? 'Confirm booking' : 'Continue';
      if (step === 4) { nextBtn.disabled = false; buildSummary(); }
      else { syncNext(); }
      // Keep the portal top in view when advancing.
      if (!reduced) root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    nextBtn.addEventListener('click', function () {
      if (state.step === 3 && !validateDetails()) return;
      if (state.step === 4) { confirmBooking(); return; }
      go(state.step + 1);
    });
    backBtn.addEventListener('click', function () {
      if (state.step > 1) go(state.step - 1);
    });

    /* -- Simulated confirmation -- */
    function confirmBooking() {
      var seed = hash(f.email.value + state.time + state.date.getDate());
      var code = 'FFD-' + (1000 + (seed % 9000));
      confEl.textContent = 'Confirmation ' + code;
      summary.hidden = false; // keep summary visible above success
      reviewHead.querySelector('h3').textContent = 'Appointment confirmed';
      reviewHead.querySelector('p').textContent = 'A copy of these details is on its way to your inbox.';
      success.hidden = false;
      actions.hidden = true;
      if (!reduced) success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    go(1);
  }

  function boot() {
    initNav();
    initFaq();
    initCarousel();
    initReveal();
    initTwinkle();
    initBooking();
  }
  // Run once the DOM is ready — and immediately if it already is
  // (guards against the script executing after DOMContentLoaded).
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
