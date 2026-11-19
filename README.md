# Arinjay Bahuguna – Mundan Ceremony Invitation

A single-page invitation. Open `index.html` in a browser; there is no build step.
(GSAP and the Google Fonts load from the internet; without them the page still shows, just without animation.)

## Folder structure

```
index.html                 The page content (semantic markup only)
css/
  01-tokens.css            Colours, fonts and image paths (change the look here)
  02-base.css              Reset, page defaults, text and "line mask" helpers
  03-invitation.css        The fixed-ratio canvas everything is placed on
  04-hero.css              Rays, pearl corners, pots, headline text, halo, portrait
  05-events.css            The three golden event frames
  06-closing.css           Closing message, floating pearl, silk border
  07-effects.css           Sparkles, particles canvas, progress bar, cursor ring
  08-mobile-performance.css  Drops costly effects on phones
  09-accessibility.css     Reduced-motion rules
js/
  config.js                Shared namespace + every tunable value
  utils.js                 Small helpers
  fit-text.js              Sizes script headings to their design widths
  glints.js                Adds the twinkling sparkles
  lazy-images.js           Loads below-the-fold artwork shortly before it is needed
  particles.js             Falling petals and rising gold dust (canvas)
  animations.js            GSAP entrance, reveal, sway and scroll animations
  interactions.js          Cursor ring, parallax and frame tilt (desktop mouse only)
  main.js                  Starts everything as soon as the scripts have loaded
tools/build-single-file.py One-file build for quick sharing (writes dist/invitation.html)
assets/images/             All artwork. name.webp / name.avif = desktop,
                           name-m.webp / name-m.avif = phones (about 8x smaller)
```

## How the layout works
The page is one canvas with a fixed `412 : 1568` ratio. Every element is positioned in `cqw`
units (1cqw = 1% of the canvas width), so the composition is identical at every screen size.
To move something, change its `top` / `left` / `width` in the matching CSS file.

## Common edits
- **Event details** → text inside each `<section class="event-frame">` in `index.html`.
- **Colours / fonts** → `css/01-tokens.css`.
- **Sparkle positions** → `glints` in `js/config.js`.
- **Animation timing** → the numbers at the top of each function in `js/animations.js`.

## Naming conventions
CSS follows BEM-style names: `block`, `block__element`, `block--modifier`
(e.g. `event-frame__title`, `pot--left`). JavaScript files share one `Invitation` namespace and
are loaded in the order listed in `index.html`.

## Speed (built for phones)
- **Small images for small screens.** Phones download the `-m` files (AVIF where supported, WebP otherwise):
  about 230 KB for the whole page, instead of about 2 MB. Desktop gets the large files.
  The choice is made in `css/01-tokens.css`, so the browser only fetches what it needs.
- **First screen first.** Hero artwork is preloaded; frames and the silk border load when
  the visitor is about half a screen away (`js/lazy-images.js`).
- **Animations never wait for fonts or images.** Motion starts as soon as the scripts load. Only the
  text lines wait (up to 1.2 s) for the web fonts, so they never flash in the wrong typeface.
- **Scripts are `defer`red** so the page paints while GSAP downloads.
- **Phones skip heavy effects** (blend-mode sweeps, filter shimmer): see `css/08-mobile-performance.css`.
- To go faster still: download GSAP (`gsap.min.js`, `ScrollTrigger.min.js`) into `js/vendor/` and point
  the two `<script>` tags at them, so the page needs no third-party script host.

## Code style
- 2-space indentation (see `.editorconfig`), one responsibility per file, comments explain *why*.
- CSS: BEM-style names, one component per file, sizes in `cqw` so everything scales together.
- JavaScript: small named functions, no globals except the single `Invitation` namespace.
- Text sizes are phone-first (about 16px / 13px for the headline lines on a 390px screen);
  `js/fit-text.js` shrinks any line that would ever overflow, whatever font the device uses.

## One-file build
`python3 tools/build-single-file.py` creates `dist/invitation.html` with everything inlined
(phone-sized images), useful for previews. Deploy the normal folder for best speed.
