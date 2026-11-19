/* ==========================================================================
   config.js
   Creates the shared `Invitation` namespace and holds every tunable value,
   so the other files contain logic only.
   ========================================================================== */
(function () {
  'use strict';

  window.Invitation = {};

  Invitation.config = {
    /* Viewports at or below this width are treated as phones (px) */
    phoneMaxWidth: 700,

    /* How each event frame opens as it scrolls into view (CSS clip-path values) */
    frameWipes: [
      'inset(0% 50% 0% 50%)', /* opens from the centre outwards */
      'inset(0% 100% 0% 0%)', /* wipes in from the left */
      'inset(50% 0% 50% 0%)'  /* opens from the middle vertically */
    ],

    /* Sparkle positions as [left %, top %, animation delay in seconds] */
    glints: {
      '.event-frame':    [[6, 14, 0], [95, 10, 0.9], [5, 86, 1.8], [94, 88, 2.7], [28, 5, 0.5], [72, 95, 1.4]],
      '.pot--left':      [[42, 70, 0.4], [64, 56, 1.9]],
      '.pot--right':     [[40, 66, 1.2], [62, 74, 2.6]],
      '.portrait__inner': [[36, 13, 0.8], [64, 52, 2.2]],
      '.silk':           [[90, 62, 0.3], [24, 80, 1.7], [66, 88, 2.9]]
    }
  };
})();
