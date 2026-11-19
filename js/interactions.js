/* ==========================================================================
   interactions.js
   Pointer-driven effects for desktop visitors with a mouse:
   cursor ring, portrait parallax and the 3D tilt on event frames.
   ========================================================================== */
(function () {
  'use strict';

  const { $, $$ } = Invitation.utils;

  /** Adds an event listener and remembers how to remove it again. */
  function listen(target, type, handler, onCleanup) {
    target.addEventListener(type, handler);
    onCleanup(() => target.removeEventListener(type, handler));
  }

  /** A small ring follows the pointer and grows over the event frames. */
  function followPointer(onCleanup) {
    const ring = $('#cursor-ring');
    const moveX = gsap.quickTo(ring, 'x', { duration: 0.4, ease: 'power3' });
    const moveY = gsap.quickTo(ring, 'y', { duration: 0.4, ease: 'power3' });
    let visible = false;

    listen(window, 'pointermove', (event) => {
      if (!visible) {
        visible = true;
        ring.style.opacity = 1;
      }
      moveX(event.clientX);
      moveY(event.clientY);

      const overFrame = Boolean(event.target.closest && event.target.closest('.event-frame'));
      gsap.to(ring, { scale: overFrame ? 2.4 : 1, duration: 0.4, overwrite: 'auto' });
      ring.style.backgroundColor = overFrame ? '#F3A71822' : 'transparent';

      /* The portrait shifts a few pixels against the pointer for depth */
      const offset = event.clientX / window.innerWidth - 0.5;
      gsap.to('.portrait__inner', { x: offset * -6, duration: 1.2, overwrite: 'auto' });
    }, onCleanup);

    onCleanup(() => { ring.style.opacity = 0; });
  }

  /** Frames tilt towards the pointer, and a soft light follows it. */
  function tiltFrames(onCleanup) {
    $$('.event-frame').forEach((frame) => {
      gsap.set(frame, { transformPerspective: 900 });

      const rotateX = gsap.quickTo(frame, 'rotationX', { duration: 0.7, ease: 'power3' });
      const rotateY = gsap.quickTo(frame, 'rotationY', { duration: 0.7, ease: 'power3' });
      const scale   = gsap.quickTo(frame, 'scale',     { duration: 0.7, ease: 'power3' });

      listen(frame, 'pointermove', (event) => {
        const box = frame.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width  - 0.5;
        const y = (event.clientY - box.top)  / box.height - 0.5;

        rotateY(x * 7);
        rotateX(-y * 7);
        scale(1.015);
        frame.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
        frame.style.setProperty('--my', `${(y + 0.5) * 100}%`);
      }, onCleanup);

      listen(frame, 'pointerleave', () => { rotateX(0); rotateY(0); scale(1); }, onCleanup);
    });
  }

  Invitation.interactions = {
    init({ onCleanup }) {
      followPointer(onCleanup);
      tiltFrames(onCleanup);
    }
  };
})();
