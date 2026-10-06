/* ============================================
   INTERACTIVE RSVP CONTROLLER
   3 Card Choices, Stepper, Validation & Celebration
   ============================================ */

(function() {
  'use strict';

  const form = document.getElementById('rsvp-form');
  const attendanceOptions = document.querySelectorAll('.rsvp__attendance-option');
  const attendingInput = document.getElementById('rsvp-attending');
  const minusBtn = document.getElementById('guest-minus');
  const plusBtn = document.getElementById('guest-plus');
  const countEl = document.getElementById('guest-count');
  const guestsInput = document.getElementById('rsvp-guests');
  const successCard = document.getElementById('rsvp-success');

  let guestCount = 1;

  // 1. Attendance card selection
  attendanceOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      attendanceOptions.forEach(o => o.classList.remove('is-selected'));
      opt.classList.add('is-selected');
      const val = opt.getAttribute('data-value');
      if (attendingInput) attendingInput.value = val;
    });
  });

  // 2. Guest stepper
  if (minusBtn && plusBtn && countEl && guestsInput) {
    minusBtn.addEventListener('click', () => {
      if (guestCount > 1) {
        guestCount--;
        countEl.textContent = guestCount;
        guestsInput.value = guestCount;
      }
    });

    plusBtn.addEventListener('click', () => {
      if (guestCount < 10) {
        guestCount++;
        countEl.textContent = guestCount;
        guestsInput.value = guestCount;
      }
    });
  }

  // 3. Form submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('rsvp-name');
      if (!nameInput || !nameInput.value.trim()) {
        alert('Please enter your full name.');
        return;
      }

      const rsvpData = {
        name: nameInput.value.trim(),
        contact: (document.getElementById('rsvp-contact')?.value || '').trim(),
        attending: attendingInput?.value || 'yes',
        guests: guestCount,
        message: (document.getElementById('rsvp-message')?.value || '').trim(),
        submittedAt: new Date().toISOString()
      };

      // Store locally
      try {
        const existing = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
        existing.push(rsvpData);
        localStorage.setItem('wedding_rsvps', JSON.stringify(existing));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }

      // Hide form & show success
      form.style.display = 'none';
      if (successCard) {
        successCard.classList.add('is-visible');
      }

      // Trigger Confetti Celebration Burst
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 65,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#D4A853', '#A32A53', '#F8C8DC', '#FFF9F2', '#E8C87A']
        });
      }
    });
  }
})();
