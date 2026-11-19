/* ==========================================================================
   lazy-images.js
   Frames and the silk border sit far down the page, so their artwork is only
   downloaded when the visitor is about half a screen away from them. Marking an
   element `.is-near` releases its images (see the `.lazy` rules in the CSS).
   ========================================================================== */
(function () {
  'use strict';

  const { $$ } = Invitation.utils;

  Invitation.lazyImages = function lazyImages() {
    const targets = $$('.event-frame, .silk');

    /* Very old browsers: just load everything */
    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-near'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-near');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '60% 0px' }); /* start about half a screen early */

    targets.forEach((el) => observer.observe(el));
  };
})();
