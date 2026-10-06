/* ============================================
   CANVAS PARTICLE SYSTEM — Gentle Falling Rose Petals & Golden Leaves
   Drifting smoothly from top-left across the page
   ============================================ */

(function() {
  'use strict';

  let canvas, ctx;
  let width, height;
  let particles = [];
  let animFrame;
  const isMobile = window.innerWidth < 600;
  const PARTICLE_COUNT = isMobile ? 20 : 38;

  function init() {
    canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);

    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle(true));
    }

    animate();
  }

  function resize() {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticle(isInitial = false) {
    const isLeaf = Math.random() < 0.22;
    return {
      type: isLeaf ? 'leaf' : 'petal',
      x: isInitial ? (Math.random() * (width + 200) - 100) : (Math.random() * (width * 0.7) - 100),
      y: isInitial ? (Math.random() * height) : (-30 - Math.random() * 50),
      size: Math.random() * 7 + (isLeaf ? 9 : 7),
      speedX: Math.random() * 0.55 + 0.3,
      speedY: Math.random() * 0.65 + 0.4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.2,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.01,
      swayAmplitude: Math.random() * 0.8 + 0.4,
      opacity: Math.random() * 0.35 + 0.4,
      color: isLeaf ? 'rgba(164, 188, 156, ' : (Math.random() > 0.5 ? 'rgba(248, 200, 220, ' : 'rgba(244, 167, 193, ')
    };
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = p.opacity;

    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
    ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
    ctx.closePath();

    ctx.fillStyle = p.color + p.opacity + ')';
    ctx.fill();

    // Subtle center vein
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, -p.size * 0.7);
    ctx.lineTo(0, p.size * 0.7);
    ctx.stroke();

    ctx.restore();
  }

  function drawLeaf(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = p.opacity * 0.85;

    ctx.beginPath();
    ctx.ellipse(0, 0, p.size * 0.4, p.size, 0, 0, Math.PI * 2);
    ctx.fillStyle = p.color + (p.opacity * 0.75) + ')';
    ctx.fill();

    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.sway += p.swaySpeed;
      p.x += p.speedX + Math.sin(p.sway) * p.swayAmplitude;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      if (p.type === 'leaf') {
        drawLeaf(p);
      } else {
        drawPetal(p);
      }

      // Reset when off-screen
      if (p.y > height + 40 || p.x > width + 100) {
        particles[i] = createParticle(false);
      }
    }

    animFrame = requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
