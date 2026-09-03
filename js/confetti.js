/**
 * CONFETTI EFFECT
 * Canvas-based confetti particle burst for scratch-reveal and RSVP success.
 */

(function() {
  'use strict';

  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animating = false;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  const colors = ['#6B94B8', '#C4954A', '#3C5A2A', '#8AACCC', '#D4AF37', '#F0F5F6', '#5C7A3A', '#E8D5B7'];

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = -10;
      this.size = Math.random() * 8 + 3;
      this.speedX = (Math.random() - 0.5) * 4;
      this.speedY = Math.random() * 3 + 2;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 10;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = 1;
      this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
      this.gravity = 0.05;
      this.wobble = Math.random() * 10;
      this.wobbleSpeed = Math.random() * 0.05 + 0.01;
    }

    update() {
      this.x += this.speedX + Math.sin(this.wobble) * 0.5;
      this.speedY += this.gravity;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
      this.wobble += this.wobbleSpeed;
      this.opacity -= 0.005;

      if (this.opacity < 0) this.opacity = 0;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      if (this.shape === 'rect') {
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter(p => p.opacity > 0 && p.y < canvas.height + 20);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    if (particles.length > 0) {
      requestAnimationFrame(animate);
    } else {
      animating = false;
    }
  }

  window.triggerConfetti = function(count = 80) {
    for (let i = 0; i < count; i++) {
      const p = new Particle();
      // Spread start position
      p.x = canvas.width * 0.2 + Math.random() * canvas.width * 0.6;
      p.y = canvas.height * 0.3 + Math.random() * canvas.height * 0.1;
      p.speedY = -(Math.random() * 5 + 3); // Shoot up first
      p.speedX = (Math.random() - 0.5) * 8;
      particles.push(p);
    }

    if (!animating) {
      animating = true;
      animate();
    }
  };
})();
