/* ==========================================================================
   utils.js
   Tiny helpers used by several files.
   ========================================================================== */
(function () {
  'use strict';

  Invitation.utils = {
    /** First element matching a CSS selector. */
    $: (selector, root = document) => root.querySelector(selector),

    /** All elements matching a CSS selector, as a real array. */
    $$: (selector, root = document) => [...root.querySelectorAll(selector)],

    /** True when the visitor has asked their device for less motion. */
    prefersReducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,

    /**
     * Resolves when the web fonts have loaded, or after 1.2 s at the latest.
     * Only text waits for this; images and motion never do.
     */
    fontsReady: Promise.race([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, 1200))
    ])
  };
})();
