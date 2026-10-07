# Purple Standard — design demos

Three Purple Standard design builds behind one hub page, packaged to be shown
on an iPad during in-person sales — including with no Wi-Fi and no cellular
signal.

**Live:** https://reevo-techy.github.io/purple-standard-demos/

| | Build | Pages |
|---|---|---|
| `sweet-treat/` | Sweet Treat Desserts | 7 |
| `fenwick-dental/`  | Fenwick Family Dental | 13 |
| `lantern-cafe/`  | Lantern Art Café | 7 |

---

## Putting it on the iPad

Do this once, **on Wi-Fi**, before heading out:

1. Open the live URL above in Safari on the iPad.
2. Wait for the line at the bottom to read **"Saved — works with no signal."**
   That is the service worker finishing its copy of all three sites (~3 MB).
3. Share button → **Add to Home Screen**. It installs as a standalone app
   called *Purple Standard*, with no Safari address bar around it.

After that, launch it from the home-screen icon. It opens and browses with
the device in airplane mode. Tap a card to open a site; the small
**Portfolio** pill in the bottom-right corner of any page returns to the hub.

The only thing that needs a connection is the Google Maps embed on the
Sweet Treat and Fenwick contact pages. Offline it shows a styled address card
instead of an error, and switches back to the live map when signal returns.

## How it is made offline-capable

These are design demos for fictional businesses. Four things make this
showcase copy work offline:

- **Fonts are self-hosted.** All five Google Fonts requests were downloaded
  and rewritten to local `woff2` files under `assets/fonts/`, with the
  Cyrillic / Greek / Vietnamese subsets pruned. Nothing calls
  `fonts.googleapis.com` any more.
- **GSAP is vendored.** Lantern Art Café loaded GSAP and ScrollTrigger from a
  CDN; both now sit in `lantern-cafe/js/`.
- **Maps are gated.** The iframes carry `data-map-src` instead of `src`, and
  `assets/demo.js` only promotes it to a real `src` when the device is online.
- **A service worker** (`sw.js`) precaches every file on the first visit.

`assets/demo.js` and the demo layer appended to each stylesheet are the only
additions to the site code itself, plus the `Portfolio` pill and a
`noindex` tag on every page.

## Notes on the content

The businesses are fictional, so the pages carry demo details only where a
page needs them to read properly:

- `[CONFIRM]` badges are hidden with CSS — the sentences they annotated read
  correctly without them.
- Where the unconfirmed value *was* the content (a price, a lead time, a
  phone number), that row was removed rather than guessed at.
- The illustration placeholders now read "Your photography here" instead of
  the internal note "Placeholder — replace with editorial photo".

Every page carries `<meta name="robots" content="noindex, nofollow">`.

## Rebuilding

Static files only — no build step, no dependencies. To change a site, edit it
in place and push; GitHub Pages redeploys on push to `main`.

If you change any file, regenerate `sw.js` so its cache version and precache
list match, otherwise iPads holding the old copy will keep serving it. The
generator lives outside this repo; the list is simply every file in the repo
except dotfiles and `sw.js` itself, and the version is a hash of their
contents.
