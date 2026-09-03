/**
 * SCRATCH TO REVEAL
 * Interactive metallic foil scratch card with touch, mouse, and pointer events.
 * Automatically dissolves and reveals photo with celebratory confetti after just a couple scratches.
 */

(function() {
  'use strict';

  let canvas, ctx;
  let isDrawing = false;
  let scratchedPercent = 0;
  let revealed = false;
  let initialized = false;
  let scratchStrokeCount = 0;

  window.setupScratchCanvas = function() {
    canvas = document.getElementById('scratchCanvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d', { willReadFrequently: true });
    const rect = canvas.getBoundingClientRect();

    const w = rect.width || canvas.offsetWidth || 200;
    const h = rect.height || canvas.offsetHeight || 260;

    if (w === 0 || h === 0) return;

    // Retina sharp canvas
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.scale(dpr, dpr);

    // Reset state
    revealed = false;
    scratchStrokeCount = 0;
    canvas.classList.remove('scratch-canvas--dissolve');
    canvas.style.display = 'block';
    canvas.style.opacity = '1';

    // Fill with luxury champagne gold scratch coating
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#D8C698');
    grad.addColorStop(0.3, '#EDE3C8');
    grad.addColorStop(0.7, '#C9B37E');
    grad.addColorStop(1, '#DFCBA0');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle metallic texture stipple
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 150; i++) {
      ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
    }
    ctx.fillStyle = 'rgba(120, 90, 40, 0.2)';
    for (let i = 0; i < 150; i++) {
      ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
    }

    // Set composite operation for erasing
    ctx.globalCompositeOperation = 'destination-out';

    if (!initialized) {
      initialized = true;
      attachEvents();
    }
  };

  function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : (e.changedTouches ? e.changedTouches[0].clientX : 0));
    const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : (e.changedTouches ? e.changedTouches[0].clientY : 0));
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function scratchAt(pos) {
    if (!ctx || revealed) return;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 28, 0, Math.PI * 2);
    ctx.fill();
  }

  function triggerAutoReveal() {
    if (revealed) return;
    revealed = true;

    const hint = document.getElementById('scratchHint');
    if (hint) hint.classList.add('is-hidden');

    // Add shimmering dissolve animation to canvas
    canvas.classList.add('scratch-canvas--dissolve');

    // Fade out and clear after animation
    setTimeout(() => {
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = 'none';
    }, 850);

    // Celebrate with confetti
    if (typeof window.triggerConfetti === 'function') {
      setTimeout(() => window.triggerConfetti(90), 200);
    }
  }

  function checkProgress() {
    if (revealed) return;

    scratchStrokeCount++;
    // Auto-reveal after just 2-3 scratch interactions or touches
    if (scratchStrokeCount >= 2) {
      triggerAutoReveal();
      return;
    }

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparent = 0;
      const total = pixels.length / 4;

      for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] === 0) transparent++;
      }

      scratchedPercent = (transparent / (total / 4)) * 100;
      if (scratchedPercent > 10) {
        triggerAutoReveal();
      }
    } catch (e) {
      // Fallback
      if (scratchStrokeCount >= 2) {
        triggerAutoReveal();
      }
    }
  }

  function attachEvents() {
    const hint = document.getElementById('scratchHint');

    // Pointer Events (supports Mouse, Touch, and Pen uniformly)
    canvas.addEventListener('pointerdown', (e) => {
      if (revealed) return;
      isDrawing = true;
      if (hint) hint.classList.add('is-hidden');
      scratchAt(getCoordinates(e));
      checkProgress();
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDrawing || revealed) return;
      scratchAt(getCoordinates(e));
    });

    window.addEventListener('pointerup', () => {
      if (isDrawing) {
        isDrawing = false;
        checkProgress();
      }
    });

    window.addEventListener('pointercancel', () => {
      isDrawing = false;
    });

    // Touch fallbacks
    canvas.addEventListener('touchstart', (e) => {
      if (revealed) return;
      isDrawing = true;
      if (hint) hint.classList.add('is-hidden');
      scratchAt(getCoordinates(e));
      checkProgress();
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      if (!isDrawing || revealed) return;
      scratchAt(getCoordinates(e));
    }, { passive: true });

    canvas.addEventListener('touchend', () => {
      if (isDrawing) {
        isDrawing = false;
        checkProgress();
      }
    });

    // Direct click tap
    canvas.addEventListener('click', (e) => {
      if (revealed) return;
      scratchAt(getCoordinates(e));
      checkProgress();
    });
  }

  // Handle resize
  window.addEventListener('resize', () => {
    if (!revealed) {
      setTimeout(window.setupScratchCanvas, 200);
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(window.setupScratchCanvas, 300);
  });
})();
