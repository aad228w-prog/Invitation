/* ==========================================================================
   fit-text.js
   Keeps text exactly the right width, whatever fonts the visitor's device uses.

   Mark an element with:
     data-fit-size        the font size to start from (in cqw)
   and one of:
     data-fit-width       end up exactly this wide (script headings)
     data-fit-max-width   never be wider than this (body text); it is only shrunk
   Widths are a percentage of the invitation's width.
   ========================================================================== */
(function () {
  'use strict';

  const { $, $$ } = Invitation.utils;

  Invitation.fitText = function fitText() {
    const canvasWidth = $('#invitation').getBoundingClientRect().width;

    $$('[data-fit-size]').forEach((element) => {
      const startSize = parseFloat(element.dataset.fitSize);
      const exactWidth = parseFloat(element.dataset.fitWidth);
      const maxWidth = parseFloat(element.dataset.fitMaxWidth);

      /* Measure at the starting size, as a percentage of the canvas width */
      element.style.fontSize = `${startSize}cqw`;
      const measured = element.getBoundingClientRect().width / canvasWidth * 100;
      if (!measured) return;

      const target = exactWidth || (measured > maxWidth ? maxWidth : measured);
      element.style.fontSize = `${startSize * target / measured}cqw`;
    });
  };
})();
