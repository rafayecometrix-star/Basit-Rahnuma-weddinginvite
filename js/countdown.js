/**
 * COUNTDOWN TIMER
 * Live countdown to the wedding date from config.
 */

(function() {
  'use strict';

  function startCountdown() {
    const daysEl = document.getElementById('countDays');
    const hoursEl = document.getElementById('countHours');
    const minutesEl = document.getElementById('countMinutes');

    if (!daysEl || !hoursEl || !minutesEl) return;

    const targetDate = typeof WEDDING_CONFIG !== 'undefined' 
      ? new Date(WEDDING_CONFIG.couple.weddingDate).getTime()
      : new Date('2026-09-27T17:30:00').getTime();

    function update() {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      // Animate digit change
      animateDigit(daysEl, String(days).padStart(2, '0'));
      animateDigit(hoursEl, String(hours).padStart(2, '0'));
      animateDigit(minutesEl, String(minutes).padStart(2, '0'));
    }

    function animateDigit(el, newValue) {
      if (el.textContent !== newValue) {
        el.style.transition = 'transform 0.3s var(--ease-spring), opacity 0.3s';
        el.style.transform = 'translateY(-10px)';
        el.style.opacity = '0';
        setTimeout(() => {
          el.textContent = newValue;
          el.style.transform = 'translateY(10px)';
          requestAnimationFrame(() => {
            el.style.transform = 'translateY(0)';
            el.style.opacity = '1';
          });
        }, 150);
      }
    }

    // Initial update
    update();

    // Update every minute
    setInterval(update, 60000);

    // Also update every second for the first minute (smoother first impression)
    let initialUpdates = 0;
    const initialInterval = setInterval(() => {
      update();
      initialUpdates++;
      if (initialUpdates >= 60) clearInterval(initialInterval);
    }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startCountdown);
  } else {
    startCountdown();
  }
})();
