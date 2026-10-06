/* ============================================
   MAIN APP ORCHESTRATOR
   Scroll Reveals, Navigation & Initialization
   ============================================ */

(function() {
  'use strict';

  function init() {
    // 1. Scroll Reveal Observer
    initScrollReveal();

    // 2. Discover Button Scroll
    const discoverBtn = document.getElementById('discoverBtn');
    if (discoverBtn) {
      discoverBtn.addEventListener('click', () => {
        const target = document.getElementById('our-nikah');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-on-scroll');
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(el => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
