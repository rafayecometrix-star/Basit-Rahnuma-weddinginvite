/* ============================================
   ROBUST SCRATCH-TO-REVEAL ENGINE
   Save the Date Foil with Auto-Reveal & Confetti
   ============================================ */

(function() {
  'use strict';

  function triggerConfettiBurst(x, y) {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 50,
        spread: 75,
        origin: { 
          x: (x || window.innerWidth / 2) / window.innerWidth, 
          y: (y || window.innerHeight / 2) / window.innerHeight 
        },
        colors: ['#D4A853', '#F8C8DC', '#FFF9F2', '#E8C87A', '#A32A53']
      });
    }
  }

  class ScratchCard {
    constructor(canvasId, options = {}) {
      this.canvasId = canvasId;
      this.canvas = document.getElementById(canvasId);
      this.options = options;
      this.isDrawing = false;
      this.isRevealed = false;
      this.strokeCount = 0;
      this.brushSize = options.brushSize || 36;

      if (this.canvas) {
        this.ctx = this.canvas.getContext('2d');
        this.setup();
      }
    }

    setup() {
      if (!this.canvas) return;
      this.resizeAndDraw();
      this.bindEvents();
    }

    resizeAndDraw() {
      if (this.isRevealed || !this.canvas) return;
      
      const parent = this.canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : this.canvas.getBoundingClientRect();
      
      const w = Math.max(rect.width, 240);
      const h = Math.max(rect.height, 160);

      this.canvas.width = w;
      this.canvas.height = h;
      this.canvas.style.width = w + 'px';
      this.canvas.style.height = h + 'px';

      this.drawFoil(w, h);
    }

    drawFoil(w, h) {
      if (this.isRevealed || !this.ctx) return;
      const ctx = this.ctx;

      ctx.save();
      ctx.globalCompositeOperation = 'source-over';

      // Shimmering Rose Gold Foil Gradient
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#E8C87A');
      grad.addColorStop(0.3, '#D4A853');
      grad.addColorStop(0.5, '#F8C8DC');
      grad.addColorStop(0.8, '#D4A853');
      grad.addColorStop(1, '#C59B40');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Gold shimmer sparkle dust
      for (let i = 0; i < 220; i++) {
        ctx.fillStyle = Math.random() > 0.4 ? 'rgba(255, 255, 255, 0.4)' : 'rgba(184, 134, 11, 0.25)';
        ctx.beginPath();
        ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 2 + 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Border line on foil
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(10, 10, w - 20, h - 20);

      // Text prompt
      ctx.fillStyle = '#4A1D24';
      ctx.font = '600 13px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowBlur = 6;
      ctx.fillText('✨ SCRATCH TO REVEAL ✨', w / 2, h / 2);
      ctx.shadowBlur = 0;

      ctx.restore();
    }

    bindEvents() {
      if (!this.canvas) return;

      const getPos = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
          x: clientX - rect.left,
          y: clientY - rect.top,
          globalX: clientX,
          globalY: clientY
        };
      };

      const start = (e) => {
        if (this.isRevealed) return;
        this.isDrawing = true;
        this.strokeCount++;
        const pos = getPos(e);
        this.scratch(pos.x, pos.y);
      };

      const move = (e) => {
        if (!this.isDrawing || this.isRevealed) return;
        e.preventDefault();
        const pos = getPos(e);
        this.scratch(pos.x, pos.y);

        if (this.strokeCount >= 3) {
          this.autoReveal(pos.globalX, pos.globalY);
        }
      };

      const end = (e) => {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        if (this.strokeCount >= 3) {
          const pos = e.changedTouches ? { globalX: e.changedTouches[0].clientX, globalY: e.changedTouches[0].clientY } : { globalX: window.innerWidth / 2, globalY: window.innerHeight / 2 };
          this.autoReveal(pos.globalX, pos.globalY);
        }
      };

      this.canvas.addEventListener('mousedown', start);
      this.canvas.addEventListener('mousemove', move);
      window.addEventListener('mouseup', end);

      this.canvas.addEventListener('touchstart', start, { passive: false });
      this.canvas.addEventListener('touchmove', move, { passive: false });
      window.addEventListener('touchend', end);
    }

    scratch(x, y) {
      if (!this.ctx) return;
      const ctx = this.ctx;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, this.brushSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    autoReveal(globalX, globalY) {
      if (this.isRevealed) return;
      this.isRevealed = true;

      this.canvas.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      this.canvas.style.opacity = '0';
      this.canvas.style.transform = 'scale(1.04)';
      this.canvas.style.pointerEvents = 'none';

      triggerConfettiBurst(globalX, globalY);

      if (this.options.onReveal) {
        this.options.onReveal();
      }
    }
  }

  let dateCardInstance = null;

  function initScratchCard() {
    dateCardInstance = new ScratchCard('date-scratch-canvas', {
      brushSize: 34
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScratchCard);
  } else {
    initScratchCard();
  }

  window.addEventListener('wedding:envelopeOpened', () => {
    setTimeout(() => {
      if (dateCardInstance) dateCardInstance.resizeAndDraw();
    }, 150);
  });

  window.addEventListener('resize', () => {
    if (dateCardInstance && !dateCardInstance.isRevealed) {
      dateCardInstance.resizeAndDraw();
    }
  });

})();
