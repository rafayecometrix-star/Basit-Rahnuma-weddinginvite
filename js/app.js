/**
 * APP.JS — Main Initialization
 * Orchestrates all modules after DOM is ready.
 */

(function() {
  'use strict';

  function init() {
    // Discover button smooth scroll
    const discoverBtn = document.getElementById('discoverBtn');
    if (discoverBtn) {
      discoverBtn.addEventListener('click', () => {
        const countdown = document.getElementById('sectionCountdown');
        if (countdown) {
          countdown.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    console.log('💌 Wedding Invitation loaded successfully');
    console.log('📋 Config:', typeof WEDDING_CONFIG !== 'undefined' ? 'Loaded' : 'Not found');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
