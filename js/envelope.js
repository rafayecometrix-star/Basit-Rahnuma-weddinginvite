/* ============================================
   ENVELOPE OPENING CONTROLLER
   3D 4-Flap Unfolding & Reveal Physics
   ============================================ */

(function() {
  'use strict';

  const envelopeScreen = document.getElementById('envelopeScreen');
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const waxSeal = document.getElementById('waxSeal');
  const invitation = document.getElementById('invite-content');

  let hasOpened = false;

  function openEnvelope() {
    if (hasOpened) return;
    hasOpened = true;

    // Step 1: Flap rotates 3D upward & seal dissolves
    if (envelopeScreen) {
      envelopeScreen.classList.add('is-opening');
    }
    const tapGuide = document.getElementById('envelopeTapGuide');
    if (tapGuide) {
      tapGuide.style.display = 'none';
    }

    // Trigger celebration sparkle burst
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 45,
        spread: 75,
        origin: { y: 0.5 },
        colors: ['#D4A853', '#F8C8DC', '#FFF9F2', '#E8C87A', '#A32A53']
      });
    }

    // Play music if enabled
    if (window.WeddingMusic && typeof window.WeddingMusic.startMusic === 'function') {
      window.WeddingMusic.startMusic();
    }

    // Step 2: Unhide invitation content and notify scratch engine
    if (invitation) {
      invitation.classList.remove('is-hidden');
      invitation.classList.add('is-visible');
      document.body.classList.remove('is-loading');
      window.dispatchEvent(new CustomEvent('wedding:envelopeOpened'));
    }

    // Step 3: When top flap has fully unfolded, fade out envelope
    setTimeout(() => {
      if (envelopeScreen) {
        envelopeScreen.classList.add('is-opened');
      }
    }, 2400);

    // Remove overlay from DOM
    setTimeout(() => {
      if (envelopeScreen && envelopeScreen.parentNode) {
        envelopeScreen.parentNode.removeChild(envelopeScreen);
      }
    }, 3800);
  }

  if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', openEnvelope);
  }
  if (waxSeal) {
    waxSeal.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });
  }

  window.openWeddingEnvelope = openEnvelope;
})();
