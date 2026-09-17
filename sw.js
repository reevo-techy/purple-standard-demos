/* ============================================================
   Purple Standard portfolio — offline service worker

   Precaches all three sites on first visit so the whole
   portfolio opens with no Wi-Fi and no cellular signal.

   Strategy: cache-first for everything in the precache list
   (these are static demo builds — they only change on redeploy,
   and a redeploy changes CACHE below, which drops the old one).
   ============================================================ */

const CACHE = 'purple-standard-demos-4ce283c8fc';

const PRECACHE = [
  "./",
  "assets/demo.js",
  "assets/fonts/amiri-J7aRnpd8CGxBHpUgtLMS7JNKIjk-f9eddb2e.woff2",
  "assets/fonts/amiri-J7aRnpd8CGxBHpUrtLMS7JNKIjk-65668d5b.woff2",
  "assets/fonts/amiri-J7aRnpd8CGxBHpUutLMS7JNK-87f7952a.woff2",
  "assets/fonts/amiri-J7acnpd8CGxBHp2VkaY6zp5gGDAbnCA-63a2d7e2.woff2",
  "assets/fonts/amiri-J7acnpd8CGxBHp2VkaY_zp5gGDAb-aced4c09.woff2",
  "assets/fonts/amiri-J7acnpd8CGxBHp2VkaYxzp5gGDAbnCA-db933273.woff2",
  "assets/fonts/amiri-J7afnpd8CGxBHpUrhL8Y67FIEjgjpQ-584b2443.woff2",
  "assets/fonts/amiri-J7afnpd8CGxBHpUrhLEY67FIEjg-48f94ca5.woff2",
  "assets/fonts/amiri-J7afnpd8CGxBHpUrhLQY67FIEjgjpQ-519a4992.woff2",
  "assets/fonts/baloo2-nunito-caveat-6d0d2e.css",
  "assets/fonts/baloo2-wXKrE3kTposypRyd51bcAM4olXcLtA-03ca576c.woff2",
  "assets/fonts/baloo2-wXKrE3kTposypRyd51jcAM4olXc-195f2e7b.woff2",
  "assets/fonts/caveat-Wnz6HAc5bAfYB2Q7ZjYYiAzcPA-18bea307.woff2",
  "assets/fonts/caveat-Wnz6HAc5bAfYB2Q7aDYYiAzcPDKo-29385594.woff2",
  "assets/fonts/fraunces-6NU58FyLNQOQZAnv9ZwNjucMHVn85Ni7emAe9lKqZTnbB-gzTK0K1ChjdPeQ7ZXk8kD6-ad",
  "assets/fonts/fraunces-6NU58FyLNQOQZAnv9ZwNjucMHVn85Ni7emAe9lKqZTnbB-gzTK0K1ChjdfeQ7ZXk8kD6-81",
  "assets/fonts/fraunces-6NU58FyLNQOQZAnv9ZwNjucMHVn85Ni7emAe9lKqZTnbB-gzTK0K1ChjeveQ7ZXk8g-952f",
  "assets/fonts/fraunces-6NU78FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0KxC9TeP2Xz5c-175f6e9",
  "assets/fonts/fraunces-6NU78FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0KxCBTeP2Xz5fU8w-8a8d",
  "assets/fonts/fraunces-6NU78FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0KxCFTeP2Xz5fU8w-ffbb",
  "assets/fonts/fraunces-6NUs8FyLNQOQZAnv9ZwNjucMHVn85Ni7emAe9lKqZTnbB-gzTK0K1ChJdt9hFwpX9W37ll9",
  "assets/fonts/fraunces-inter-caveat-amiri-3ece18.css",
  "assets/fonts/fraunces-inter-caveat-amiri-46a6b3.css",
  "assets/fonts/hankengrotesk-ieVn2YZDLWuGJpnzaiwFXS9tYtpT59CxCis4UvI-6748e3a4.woff2",
  "assets/fonts/hankengrotesk-ieVn2YZDLWuGJpnzaiwFXS9tYtpd59CxCis4-271d5973.woff2",
  "assets/fonts/inter-UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw-1dc044f4.woff2",
  "assets/fonts/inter-UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa25L7W0Q5n-wU-521e24d1.woff2",
  "assets/fonts/newsreader-cY9AfjOCX1hbuyalUrK4397yjIJFJpc-662a6e2a.woff2",
  "assets/fonts/newsreader-cY9AfjOCX1hbuyalUrK439DyjIJFJpeBZQ-5ca53eda.woff2",
  "assets/fonts/newsreader-cY9CfjOCX1hbuyalUrK439vCgIhCBJWxZCPp-3184335d.woff2",
  "assets/fonts/newsreader-cY9CfjOCX1hbuyalUrK439vCjohCBJWxZA-0e959a34.woff2",
  "assets/fonts/newsreader-hankengrotesk-caveat-amiri-b4d78f.css",
  "assets/fonts/newsreader-hankengrotesk-notosansarabic-notosansgurm-d220b9.css",
  "assets/fonts/notosansarabic-nwpCtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlj41v4rqxzLI-ac866b8d",
  "assets/fonts/notosansarabic-nwpCtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlj47v4rqxzLIhjE-69207",
  "assets/fonts/notosansarabic-nwpCtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlj4wv4rqxzLIhjE-a97c7",
  "assets/fonts/notosansarabic-nwpCtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlj5Jv4rqxzLIhjE-189ae",
  "assets/fonts/notosansarabic-nwpCtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlj5bv4rqxzLIhjE-32eae",
  "assets/fonts/notosansgurmukhi-w8gyH3EvQP81sInb43inmyN9zZ7hb7ATbSWo4q8dJ74a3cVrSlYXn3KMYO8ieQ-",
  "assets/fonts/notosansgurmukhi-w8gyH3EvQP81sInb43inmyN9zZ7hb7ATbSWo4q8dJ74a3cVrSlgXn3KMYO8-2f6",
  "assets/fonts/notosansgurmukhi-w8gyH3EvQP81sInb43inmyN9zZ7hb7ATbSWo4q8dJ74a3cVrSnsXn3KMYO8ieQ-",
  "assets/fonts/nunito-XRXV3I6Li01BKofINeaBTMnFcQ-c67f9657.woff2",
  "assets/fonts/nunito-XRXV3I6Li01BKofIO-aBTMnFcQIG-141ac426.woff2",
  "assets/icons/apple-touch-icon.png",
  "assets/icons/favicon.svg",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "assets/shots/fenwick-dental.webp",
  "assets/shots/lantern-cafe.webp",
  "assets/shots/sweet-treat.webp",
  "fenwick-dental/css/styles.css",
  "fenwick-dental/images/case-study.svg",
  "fenwick-dental/images/cosmetic-track.webp",
  "fenwick-dental/images/family-track.webp",
  "fenwick-dental/images/hero-clinician-patient.webp",
  "fenwick-dental/images/svc-cleanings.webp",
  "fenwick-dental/images/svc-emergency.webp",
  "fenwick-dental/images/svc-general.webp",
  "fenwick-dental/images/svc-implants.webp",
  "fenwick-dental/images/svc-invisalign.webp",
  "fenwick-dental/images/svc-whitening.webp",
  "fenwick-dental/images/team-hygienist-1.svg",
  "fenwick-dental/images/team-hygienist-2.svg",
  "fenwick-dental/images/team-kessler.svg",
  "fenwick-dental/images/team-whitfield.svg",
  "fenwick-dental/index.html",
  "fenwick-dental/js/includes.js",
  "fenwick-dental/js/main.js",
  "fenwick-dental/pages/cdcp-insurance.html",
  "fenwick-dental/pages/cleanings-hygiene.html",
  "fenwick-dental/pages/contact.html",
  "fenwick-dental/pages/dental-implants.html",
  "fenwick-dental/pages/emergency-dentistry.html",
  "fenwick-dental/pages/general-family-dentistry.html",
  "fenwick-dental/pages/invisalign.html",
  "fenwick-dental/pages/new-patients.html",
  "fenwick-dental/pages/privacy.html",
  "fenwick-dental/pages/services.html",
  "fenwick-dental/pages/team.html",
  "fenwick-dental/pages/teeth-whitening.html",
  "index.html",
  "lantern-cafe/css/room.css",
  "lantern-cafe/css/styles.css",
  "lantern-cafe/css/watercolour.css",
  "lantern-cafe/data/events.json",
  "lantern-cafe/data/exhibitions.json",
  "lantern-cafe/images/event-night.svg",
  "lantern-cafe/images/exhibit-01.webp",
  "lantern-cafe/images/exhibit-placeholder.webp",
  "lantern-cafe/images/exhibit-thumb-01.webp",
  "lantern-cafe/images/exhibit-thumb-02.webp",
  "lantern-cafe/images/exhibit-thumb-03.webp",
  "lantern-cafe/images/exhibit-thumb-04.webp",
  "lantern-cafe/images/hero-cafe.svg",
  "lantern-cafe/images/menu-coffee.svg",
  "lantern-cafe/images/menu-food.svg",
  "lantern-cafe/images/menu-sweets.svg",
  "lantern-cafe/images/menu-tea.svg",
  "lantern-cafe/images/room-daylight.webp",
  "lantern-cafe/images/shopfront.webp",
  "lantern-cafe/index.html",
  "lantern-cafe/index.room.html",
  "lantern-cafe/js/ScrollTrigger.min.js",
  "lantern-cafe/js/gsap.min.js",
  "lantern-cafe/js/includes.js",
  "lantern-cafe/js/main.js",
  "lantern-cafe/js/room.js",
  "lantern-cafe/js/watercolour.js",
  "lantern-cafe/pages/about.html",
  "lantern-cafe/pages/events.html",
  "lantern-cafe/pages/gallery.html",
  "lantern-cafe/pages/menu.html",
  "lantern-cafe/pages/visit.html",
  "manifest.webmanifest",
  "robots.txt",
  "sweet-treat/css/styles.css",
  "sweet-treat/images/cake-1.webp",
  "sweet-treat/images/cake-2.webp",
  "sweet-treat/images/cake-3.webp",
  "sweet-treat/images/cake-4.webp",
  "sweet-treat/images/cupcake-1.webp",
  "sweet-treat/images/cupcake-2.webp",
  "sweet-treat/images/cupcake-3.webp",
  "sweet-treat/images/cupcake-4.webp",
  "sweet-treat/images/dessert-1.webp",
  "sweet-treat/images/dessert-2.webp",
  "sweet-treat/images/dessert-3.webp",
  "sweet-treat/images/dessert-4.webp",
  "sweet-treat/images/kitchen.webp",
  "sweet-treat/images/peek-cake.webp",
  "sweet-treat/images/peek-cupcakes.webp",
  "sweet-treat/images/peek-wedding.webp",
  "sweet-treat/images/shopfront.webp",
  "sweet-treat/images/wedding-1.webp",
  "sweet-treat/images/wedding-2.webp",
  "sweet-treat/images/wedding-3.webp",
  "sweet-treat/images/wedding-4.webp",
  "sweet-treat/index.html",
  "sweet-treat/js/gsap.min.js",
  "sweet-treat/js/includes.js",
  "sweet-treat/js/main.js",
  "sweet-treat/pages/about.html",
  "sweet-treat/pages/cakes.html",
  "sweet-treat/pages/cupcakes.html",
  "sweet-treat/pages/desserts.html",
  "sweet-treat/pages/visit.html",
  "sweet-treat/pages/weddings.html"
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);

    // addAll() rejects the whole batch if any single request fails,
    // which would leave the visit with no offline copy at all. Add
    // them individually and report how it went instead.
    const results = await Promise.allSettled(
      PRECACHE.map((url) =>
        cache.add(new Request(url, { cache: 'reload' }))
      )
    );

    const failed = results.filter((r) => r.status === 'rejected').length;
    await self.skipWaiting();

    const clients = await self.clients.matchAll({ includeUncontrolled: true });
    for (const client of clients) {
      client.postMessage({
        type: failed ? 'precache-failed' : 'precache-done',
        total: PRECACHE.length,
        failed
      });
    }
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(
      names.filter((n) => n !== CACHE).map((n) => caches.delete(n))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Never intercept the Google Maps embed — it is online-only by design
  // and demo.js already hides it when there is no connection.
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) return cached;

    try {
      const fresh = await fetch(req);
      if (fresh && fresh.ok && fresh.type === 'basic') {
        const cache = await caches.open(CACHE);
        cache.put(req, fresh.clone());
      }
      return fresh;
    } catch (err) {
      // Offline and not in the cache: for a page request, fall back to
      // the portfolio hub rather than Safari's error page.
      if (req.mode === 'navigate') {
        const hub = await caches.match(new URL('index.html', self.registration.scope));
        if (hub) return hub;
      }
      throw err;
    }
  })());
});
