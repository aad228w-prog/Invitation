/* ==========================================================================
   animations.js
   GSAP animations: entrance, scroll reveals, idle sway, scroll-linked motion.
   Every function here assumes GSAP and ScrollTrigger are loaded.
   ========================================================================== */
(function () {
  'use strict';

  const { $, $$, fontsReady } = Invitation.utils;
  const { frameWipes } = Invitation.config;

  /* ---- Text --------------------------------------------------------------- */

  /** Slides each line of a text block up out of its mask when it scrolls into view. */
  function revealLines(selector, { delay = 0, start = 'top 92%' } = {}) {
    const block = $(selector);
    const lines = $$('.line-mask__text', block);

    gsap.set(block, { opacity: 1 });
    gsap.set(lines, { yPercent: 110 });

    const tween = gsap.to(lines, {
      yPercent: 0, duration: 1.4, stagger: 0.14, ease: 'power4.out', delay, paused: true
    });

    /* Text waits for the web fonts so it never appears in the wrong typeface */
    ScrollTrigger.create({ trigger: block, start, once: true, onEnter: () => fontsReady.then(() => tween.play()) });
  }

  function revealAllText() {
    revealLines('.devotional',         { delay: 0.5 });
    revealLines('.invitation-message', { delay: 0.7 });
    revealLines('.title-ceremony',     { delay: 0.9 });
    revealLines('.title-name',         { delay: 0.1,  start: 'top 90%' });
    revealLines('.closing-title',      { delay: 0.1,  start: 'top 90%' });
    revealLines('.closing-note',       { delay: 0.35, start: 'top 95%' });
  }

  /* ---- Pots and feathers ------------------------------------------------------ */

  /** The pots drop in from above and settle with a springy swing. */
  function dropInPots() {
    gsap.fromTo('.pot',
      { opacity: 0, y: -80, rotation: 7 },
      { opacity: 1, y: 0, rotation: 0, duration: 2.4, stagger: 0.15, ease: 'elastic.out(1, .5)', delay: 0.3 }
    );
  }

  /**
   * Endless gentle swing around each element's transform-origin.
   * Neighbouring elements swing in opposite directions. The loop pauses
   * while the element is off-screen.
   */
  function sway(selector, { amplitude, duration, delay = 0, skew = 0.5 }) {
    $$(selector).forEach((element, index) => {
      const angle = amplitude * (index % 2 ? -1 : 1);

      const loop = gsap.timeline({ repeat: -1, delay: delay + index * 0.4 })
        .to(element, { rotation:  angle, skewX:  angle * skew, duration: duration / 2, ease: 'sine.inOut' })
        .to(element, { rotation: -angle, skewX: -angle * skew, duration,               ease: 'sine.inOut' })
        .to(element, { rotation: 0,      skewX: 0,             duration: duration / 2, ease: 'sine.inOut' });

      ScrollTrigger.create({
        trigger: element.closest('.event-frame, .silk, .portrait, .pots') || element,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (self.isActive ? loop.play() : loop.pause())
      });
    });
  }

  function startIdleMotion() {
    sway('.pot',                         { amplitude: 5.5,  duration: 2.6, delay: 2.8, skew: 0 });
    sway('.event-frame__feather--left',  { amplitude: 3.4,  duration: 3.4 });
    sway('.event-frame__feather--right', { amplitude: -3.4, duration: 4,   delay: 0.6 });
    sway('.silk__feather',               { amplitude: 2.8,  duration: 3.6 });
    sway('.portrait__feather',           { amplitude: 4,    duration: 2.6 });
  }

  /* ---- Portrait and halo ------------------------------------------------------------ */

  /** The portrait is revealed upwards while its photo settles from a slight zoom. */
  function revealPortrait(isDesktop) {
    const reveal = gsap.fromTo('.portrait',
      { opacity: 1, clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)', duration: 2, ease: 'expo.out', paused: true,
        onComplete: () => gsap.set('.portrait', { clearProps: 'clipPath' })
      }
    );

    const settle = gsap.fromTo('.portrait__inner',
      { scale: 1.18, transformOrigin: '50% 100%' },
      {
        scale: 1, duration: 2.4, ease: 'expo.out', paused: true,
        onComplete: () => { if (isDesktop) driftPortraitOnScroll(); }
      }
    );

    ScrollTrigger.create({
      trigger: '.portrait', start: 'top 92%', once: true,
      onEnter: () => { reveal.delay(0.9).play(); settle.delay(0.9).play(); }
    });
  }

  /** Slow zoom and lift of the portrait over the first screens of scrolling. */
  function driftPortraitOnScroll() {
    gsap.to('.portrait__inner', {
      scale: 1.06, y: -26, ease: 'none',
      scrollTrigger: { trigger: '#invitation', start: 'top top', end: '+=900', scrub: 0.8 }
    });
  }

  function fadeInHalo() {
    gsap.fromTo('.halo',
      { opacity: 0, scale: 0.82 },
      { opacity: 1, scale: 1, duration: 2.6, ease: 'expo.out', delay: 1.1 }
    );
  }

  /* ---- Event frames ------------------------------------------------------------------- */

  /** Each frame opens with its own wipe; its text lines slide up once the fonts are ready. */
  function revealEventFrames() {
    $$('.event-frame').forEach((frame, index) => {
      const allLines  = $$('.line-mask__text', frame);
      const bodyLines = $$('.body-text .line-mask__text', frame);

      gsap.set(allLines, { yPercent: 110 });

      const wipe = gsap.fromTo(frame,
        { opacity: 1, clipPath: frameWipes[index], scale: 0.94, y: 36 },
        {
          clipPath: 'inset(0% 0% 0% 0%)', scale: 1, y: 0, duration: 1.6, ease: 'expo.out', paused: true,
          onComplete: () => gsap.set(frame, { clearProps: 'clipPath' })
        });

      const text = gsap.timeline({ paused: true, delay: 0.55 })
        .to(allLines, { yPercent: 0, duration: 1.1, stagger: 0.09, ease: 'power4.out' }, 0)
        .fromTo(bodyLines, { letterSpacing: '.08em' }, { letterSpacing: '0em', duration: 1.5, ease: 'power3.out' }, 0);

      ScrollTrigger.create({
        trigger: frame, start: 'top 85%', once: true,
        onEnter: () => { wipe.play(); fontsReady.then(() => text.play()); }
      });
    });
  }

  /** Frames lean slightly with scroll speed, then settle (desktop only). */
  function skewFramesWithScrollSpeed() {
    const skewTo = $$('.event-frame').map((frame) =>
      gsap.quickTo(frame, 'skewY', { duration: 0.6, ease: 'power3.out' })
    );

    ScrollTrigger.create({
      onUpdate: (self) => {
        const skew = gsap.utils.clamp(-1.6, 1.6, self.getVelocity() / -600);
        skewTo.forEach((apply) => apply(skew));
      }
    });
    ScrollTrigger.addEventListener('scrollEnd', () => skewTo.forEach((apply) => apply(0)));
  }

  /* ---- Page-level ----------------------------------------------------------------------- */

  /** The silk border rises into place as the end of the page approaches. */
  function riseSilk() {
    gsap.fromTo('.silk',
      { opacity: 0, yPercent: 14 },
      {
        opacity: 1, yPercent: 0, ease: 'none',
        scrollTrigger: { trigger: '.silk', start: 'top bottom', end: 'bottom bottom', scrub: true }
      }
    );
  }

  function trackScrollProgress() {
    gsap.to('#scroll-progress', {
      scaleX: 1, ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
    });
  }

  /* ---- Public entry point ------------------------------------------------------------------ */

  Invitation.animations = {
    init({ isDesktop }) {
      dropInPots();
      startIdleMotion();
      revealAllText();
      revealPortrait(isDesktop);
      fadeInHalo();
      revealEventFrames();
      riseSilk();
      trackScrollProgress();
      if (isDesktop) skewFramesWithScrollSpeed();
    }
  };
})();
