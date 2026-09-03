/**
 * RSVP FORM
 * Form validation, stepper counter, and localStorage submission.
 */

(function() {
  'use strict';

  function initRSVP() {
    const form = document.getElementById('rsvpForm');
    const successEl = document.getElementById('rsvpSuccess');
    const stepperMinus = document.getElementById('stepperMinus');
    const stepperPlus = document.getElementById('stepperPlus');
    const stepperValue = document.getElementById('stepperValue');
    const guestCountGroup = document.getElementById('guestCountGroup');
    const transportGroup = document.getElementById('transportGroup');

    if (!form) return;

    let guestCount = 1;
    const maxGuests = (typeof WEDDING_CONFIG !== 'undefined' && WEDDING_CONFIG.rsvp) 
      ? WEDDING_CONFIG.rsvp.maxGuests || 10 
      : 10;

    // ─── Stepper ───
    if (stepperMinus && stepperPlus && stepperValue) {
      stepperMinus.addEventListener('click', () => {
        if (guestCount > 1) {
          guestCount--;
          stepperValue.textContent = guestCount;
        }
      });

      stepperPlus.addEventListener('click', () => {
        if (guestCount < maxGuests) {
          guestCount++;
          stepperValue.textContent = guestCount;
        }
      });
    }

    // ─── Show/Hide conditional fields based on attending ───
    const attendingRadios = form.querySelectorAll('input[name="attending"]');
    attendingRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const isAttending = e.target.value === 'yes';
        if (guestCountGroup) guestCountGroup.style.display = isAttending ? '' : 'none';
      });
    });

    // ─── Form Submit ───
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('rsvpName');
      const name = nameInput?.value?.trim();

      if (!name) {
        nameInput.focus();
        nameInput.style.borderColor = '#c0392b';
        setTimeout(() => { nameInput.style.borderColor = ''; }, 2000);
        return;
      }

      const attending = form.querySelector('input[name="attending"]:checked')?.value || 'yes';
      const message = document.getElementById('rsvpMessage')?.value?.trim() || '';

      const response = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        name,
        attending,
        guestCount: attending === 'yes' ? guestCount : 0,
        message,
        timestamp: new Date().toISOString()
      };

      // Save to localStorage
      const responses = JSON.parse(localStorage.getItem('wedding_rsvp_responses') || '[]');
      responses.push(response);
      localStorage.setItem('wedding_rsvp_responses', JSON.stringify(responses));

      // Hide form, show success
      form.style.display = 'none';
      if (successEl) {
        successEl.classList.add('is-visible');
      }

      // Trigger confetti
      if (typeof window.triggerConfetti === 'function') {
        setTimeout(() => window.triggerConfetti(), 400);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRSVP);
  } else {
    initRSVP();
  }
})();
