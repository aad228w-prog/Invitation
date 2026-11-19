/* ==========================================================================
   main.js
   Starts everything as soon as the scripts have loaded.
   Load order (see index.html): config → utils → fit-text → glints →
   lazy-images → particles → animations → interactions → main.
   ========================================================================== */
(function () {
  'use strict';

  const { fitText, addGlints, lazyImages } = Invitation;
  const { prefersReducedMotion, fontsReady } = Invitation.utils;
  const { phoneMaxWidth } = Invitation.config;

  let started = false;

  function start() {
    if (started) return;
    started = true;

    fitText();
    addGlints();
    lazyImages();

    /* No animation library, or the visitor wants less motion: show a calm, static page */
    const canAnimate = !prefersReducedMotion && window.gsap && window.ScrollTrigger;
    if (!canAnimate) {
      document.documentElement.classList.remove('js');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    Invitation.startParticles();

    /* Re-runs (with clean-up) whenever the screen size or pointer type changes */
    gsap.matchMedia().add(
      {
        isDesktop: `(min-width: ${phoneMaxWidth + 1}px)`,
        hasFinePointer: '(hover: hover) and (pointer: fine)'
      },
      (context) => {
        const { isDesktop, hasFinePointer } = context.conditions;
        const cleanups = [];
        const onCleanup = (fn) => cleanups.push(fn);

        Invitation.animations.init({ isDesktop });
        if (isDesktop && hasFinePointer) Invitation.interactions.init({ onCleanup });

        ScrollTrigger.refresh();
        return () => cleanups.forEach((fn) => fn());
      }
    );
  }

  /* Start straight away: images and motion never wait for fonts.
     Script headings are re-fitted as soon as the real fonts arrive (their text is
     still hidden until then, see animations.js). */
  start();
  fontsReady.then(fitText);
  window.addEventListener('resize', fitText);
})();
