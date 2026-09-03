/**
 * ENVELOPE ANIMATION
 * Handles the tap-to-open envelope interaction.
 */

(function() {
  'use strict';

  const envelopeScreen = document.getElementById('envelopeScreen');
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const invitation = document.getElementById('invitation');

  if (!envelopeScreen || !invitation) return;

  let isOpening = false;

  function openEnvelope() {
    if (isOpening) return;
    isOpening = true;

    // Add opening class — triggers slow realistic flap unfolding & card glide
    envelopeScreen.classList.add('is-opening');

    // Smooth transition into the invitation card
    setTimeout(() => {
      envelopeScreen.classList.add('is-opened');
      invitation.classList.remove('is-hidden');

      // Start background music if enabled
      if (typeof window.startMusic === 'function') {
        window.startMusic();
      }

      // Trigger initial scroll animations
      if (typeof window.initScrollAnimations === 'function') {
        window.initScrollAnimations();
      }

      // Re-initialize scratch canvas now that container is visible with real pixel dimensions
      if (typeof window.setupScratchCanvas === 'function') {
        window.setupScratchCanvas();
      }

      // Allow body scroll
      document.body.style.overflow = '';

      // Remove envelope from DOM after transition
      setTimeout(() => {
        envelopeScreen.remove();
      }, 900);
    }, 1800);
  }

  // Prevent body scroll while envelope is showing
  document.body.style.overflow = 'hidden';

  // Tap/click to open
  envelopeWrapper.addEventListener('click', openEnvelope);
  envelopeWrapper.addEventListener('touchend', function(e) {
    e.preventDefault();
    openEnvelope();
  });

  // Keyboard accessibility
  envelopeWrapper.setAttribute('tabindex', '0');
  envelopeWrapper.setAttribute('role', 'button');
  envelopeWrapper.setAttribute('aria-label', 'Tap to open wedding invitation');
  envelopeWrapper.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });
})();
