/* ============================================================
   Lantern Art Cafe — watercolour homepage engine
   Progressive enhancement over fully-readable HTML:
   nothing here is required to read the page. If GSAP is
   missing or motion is reduced, we simply reveal everything.
   ============================================================ */
(function () {
  "use strict";

  const root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";

  // ---- Fallback: reveal all, paint the masked words fully ----
  function revealEverything() {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-revealed"));
    document.querySelectorAll(".hero-ar, .life-ar").forEach((el) => {
      el.style.setProperty("--paint", "110%");
    });
    document.querySelectorAll(".brush-divider path").forEach((p) => {
      p.style.strokeDasharray = "none";
      p.style.strokeDashoffset = "0";
    });
  }

  if (reduce || !hasGSAP) {
    revealEverything();
    initRibbons(true); // static ribbons, no drift
    return;
  }

  const gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  const ScrollTrigger = window.ScrollTrigger;

  // Tween a CSS custom property (as a percentage) via an object proxy,
  // so mask reveals never depend on GSAP's CSS-var plumbing.
  function paint(el, from, to, vars) {
    const proxy = { v: from };
    el.style.setProperty("--paint", from + "%");
    return gsap.to(proxy, Object.assign({
      v: to,
      onUpdate: () => el.style.setProperty("--paint", proxy.v + "%"),
    }, vars));
  }

  /* --------------------------------------------------------
     1. LOAD SEQUENCE — the pigment hits the paper.
     The masked LANTERN word paints itself on its own track so it can
     never stall the text reveal.
     -------------------------------------------------------- */
  const heroAr = document.querySelector(".hero-ar");
  if (heroAr) paint(heroAr, 0, 110, { duration: 1.6, delay: 0.5, ease: "power2.inOut" });

  const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
  intro
    .from(".hero-blooms .wash", {
      scale: 0.2,
      opacity: 0,
      duration: 1.6,
      stagger: 0.12,
      ease: "power2.out",
      transformOrigin: "50% 50%",
    })
    .from(".hero-eyebrow", { y: 14, opacity: 0, duration: 0.7 }, "-=1.0")
    .from(".hero-title .word", { yPercent: 60, opacity: 0, duration: 0.9, stagger: 0.08 }, "-=0.6")
    .from(".hero-lead", { y: 16, opacity: 0, duration: 0.7 }, "-=0.5")
    .from(".hero-cue", { opacity: 0, duration: 0.6 }, "-=0.2");

  /* --------------------------------------------------------
     2. HERO WASH DRIFT — slow living pigment + parallax
     -------------------------------------------------------- */
  gsap.utils.toArray(".hero-blooms .wash").forEach((w, i) => {
    gsap.to(w, {
      xPercent: gsap.utils.random(-8, 8),
      yPercent: gsap.utils.random(-8, 8),
      duration: gsap.utils.random(9, 15),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: i * 0.4,
    });
    // parallax as you leave the hero
    gsap.to(w, {
      yPercent: (i % 2 ? 1 : -1) * gsap.utils.random(20, 45),
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
  });

  /* --------------------------------------------------------
     3. SECTION WASHES — pigment spreads as the section enters
     -------------------------------------------------------- */
  gsap.utils.toArray(".section-wash").forEach((wash) => {
    gsap.fromTo(
      wash,
      { scale: 0.55, opacity: 0 },
      {
        scale: 1,
        opacity: gsap.getProperty(wash, "opacity") || 0.6,
        ease: "none",
        scrollTrigger: {
          trigger: wash.closest(".section, .word-life, .visit") || wash,
          start: "top 85%",
          end: "top 25%",
          scrub: true,
        },
        transformOrigin: "50% 50%",
      }
    );
  });

  /* --------------------------------------------------------
     4. REVEALS — brush-wipe fade-up as content enters
     -------------------------------------------------------- */
  ScrollTrigger.batch(".reveal", {
    start: "top 84%",
    onEnter: (els) =>
      gsap.to(els, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        overwrite: true,
        onStart: () => els.forEach((e) => e.classList.add("is-revealed")),
      }),
  });

  /* --------------------------------------------------------
     5. BRUSH DIVIDERS — draw the stroke on as it scrolls by
     -------------------------------------------------------- */
  gsap.utils.toArray(".brush-divider path").forEach((path) => {
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: path.closest(".brush-divider"),
        start: "top 92%",
        end: "top 45%",
        scrub: true,
      },
    });
  });

  /* --------------------------------------------------------
     6. THE WORD LANTERN — paints itself across the viewport
     -------------------------------------------------------- */
  const life = document.querySelector(".life-ar");
  if (life) {
    paint(life, 0, 110, {
      ease: "none",
      scrollTrigger: { trigger: ".word-life", start: "top 70%", end: "center center", scrub: 0.6 },
    });
  }

  /* --------------------------------------------------------
     7. FRAME — gentle scrub tilt so the hung painting sways
     -------------------------------------------------------- */
  gsap.utils.toArray(".frame").forEach((frame) => {
    gsap.fromTo(
      frame,
      { rotation: -2.4, y: 40 },
      {
        rotation: -0.6,
        y: 0,
        ease: "none",
        scrollTrigger: { trigger: frame, start: "top 90%", end: "top 35%", scrub: true },
      }
    );
  });

  /* --------------------------------------------------------
     8. RIBBON marquees
     -------------------------------------------------------- */
  initRibbons(false);

  function initRibbons(staticOnly) {
    document.querySelectorAll(".ribbon-track").forEach((track, i) => {
      // duplicate content so the loop is seamless
      track.innerHTML += track.innerHTML;
      if (staticOnly || !hasGSAP) return;
      const dir = i % 2 === 0 ? -1 : 1;
      const width = track.scrollWidth / 2;
      gsap.to(track, {
        x: dir * -width,
        duration: 26,
        ease: "none",
        repeat: -1,
        modifiers: { x: (x) => (dir < 0 ? -((-parseFloat(x)) % width) : (parseFloat(x) % width) - width) + "px" },
      });
    });
  }

  /* --------------------------------------------------------
     9. NAV hide on scroll-down, show on scroll-up
     -------------------------------------------------------- */
  const bar = document.querySelector(".topbar");
  if (bar) {
    let last = 0;
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        if (y > last && y > 200) bar.style.transform = "translateY(-120%)";
        else bar.style.transform = "translateY(0)";
        last = y;
      },
    });
  }

  // Re-measure once fonts settle (masks + dividers depend on metrics)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
