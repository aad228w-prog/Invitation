/* ==========================================================================
   glints.js
   Adds the twinkling sparkle elements to frames, pots, portrait and silk.
   Positions come from Invitation.config.glints.
   ========================================================================== */
(function () {
  'use strict';

  const { $$ } = Invitation.utils;

  Invitation.addGlints = function addGlints() {
    Object.entries(Invitation.config.glints).forEach(([selector, points]) => {
      $$(selector).forEach((host) => {
        points.forEach(([left, top, delay]) => {
          const glint = document.createElement('span');
          glint.className = 'glint';
          glint.setAttribute('aria-hidden', 'true');
          glint.style.setProperty('--x', `${left}%`);
          glint.style.setProperty('--y', `${top}%`);
          glint.style.setProperty('--delay', `${delay}s`);
          host.appendChild(glint);
        });
      });
    });
  };
})();
