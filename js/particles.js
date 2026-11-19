/* ==========================================================================
   particles.js
   Gold dust that rises and cream-pink petals that fall, drawn on one canvas
   fixed over the page. Sprites are drawn once and reused for speed.
   ========================================================================== */
(function () {
  'use strict';

  const { $ } = Invitation.utils;

  const SPRITE_SIZE = 64;

  /** Draws a small sprite once, so each frame only has to copy it. */
  function makeSprite(draw) {
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = SPRITE_SIZE;
    draw(sprite.getContext('2d'));
    return sprite;
  }

  const goldDustSprite = () => makeSprite((g) => {
    const glow = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    glow.addColorStop(0,    '#FFFFFF');
    glow.addColorStop(0.25, '#FFE59A');
    glow.addColorStop(0.6,  '#F3A71866');
    glow.addColorStop(1,    '#F3A71800');
    g.fillStyle = glow;
    g.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  });

  const petalSprite = () => makeSprite((g) => {
    g.translate(32, 32);
    const fill = g.createLinearGradient(-10, -26, 10, 26);
    fill.addColorStop(0,   '#FFFDF5');
    fill.addColorStop(0.6, '#FBE3DC');
    fill.addColorStop(1,   '#F4C3C6');
    g.fillStyle = fill;
    g.beginPath();
    g.moveTo(0, -26);
    g.bezierCurveTo(20, -14, 18, 16, 0, 26);
    g.bezierCurveTo(-18, 16, -20, -14, 0, -26);
    g.fill();
  });

  /** Every fourth particle is a falling petal; the rest are rising gold dust. */
  function createParticle(index, width, height) {
    const isPetal = index % 4 === 0;
    return {
      isPetal,
      x: Math.random() * width,
      y: Math.random() * height,
      size: isPetal ? 9 + Math.random() * 8 : 6 + Math.random() * 16,
      speedY: isPetal ? 14 + Math.random() * 16 : -(8 + Math.random() * 16),
      phase: Math.random() * Math.PI * 2,
      swaySpeed: 0.3 + Math.random() * 0.6,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 1.2,
      alpha: 0.45 + Math.random() * 0.45
    };
  }

  Invitation.startParticles = function startParticles() {
    const canvas = $('#particles');
    const ctx = canvas.getContext('2d');
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const dust = goldDustSprite();
    const petal = petalSprite();

    let width, height, particles;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize);

    const count = width < Invitation.config.phoneMaxWidth ? 22 : 46; /* fewer on phones */
    particles = Array.from({ length: count }, (_, i) => createParticle(i, width, height));

    function move(p, dt) {
      p.y += p.speedY * dt;
      p.phase += p.swaySpeed * dt;
      p.x += Math.sin(p.phase) * 18 * dt;
      p.rotation += p.spin * dt;

      /* Wrap around the screen edges */
      if (p.isPetal && p.y > height + 30)  { p.y = -30;         p.x = Math.random() * width; }
      if (!p.isPetal && p.y < -20)         { p.y = height + 20; p.x = Math.random() * width; }
      if (p.x < -30) p.x = width + 30;
      if (p.x > width + 30) p.x = -30;
    }

    function draw(p) {
      if (p.isPetal) {
        ctx.globalAlpha = p.alpha;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.cos(p.phase * 1.6))); /* petal tumbling */
        ctx.drawImage(petal, -p.size / 2, -p.size * 0.7, p.size, p.size * 1.4);
        ctx.restore();
      } else {
        const twinkle = 0.55 + 0.45 * Math.sin(p.phase * 3 + p.rotation);
        ctx.globalAlpha = p.alpha * twinkle;
        ctx.drawImage(dust, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
    }

    let running = true;
    let lastTime = performance.now();

    function frame(now = performance.now()) {
      if (!running) return;
      const dt = Math.min(0.05, (now - lastTime) / 1000); /* cap so a tab switch can't jump */
      lastTime = now;

      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => { move(p, dt); draw(p); });
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }

    /* Pause while the tab is hidden to save battery */
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running) {
        lastTime = performance.now();
        frame();
      }
    });

    frame();
  };
})();
