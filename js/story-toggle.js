/**
 * STORY TOGGLE
 * Accordion expand/collapse for the "Our Story" section.
 */

(function() {
  'use strict';

  function initStoryToggle() {
    const toggle = document.getElementById('storyToggle');
    const content = document.getElementById('storyContent');
    const toggleText = document.getElementById('storyToggleText');

    if (!toggle || !content) return;

    let isExpanded = false;

    toggle.addEventListener('click', () => {
      isExpanded = !isExpanded;

      if (isExpanded) {
        content.classList.add('is-expanded');
        toggleText.textContent = 'Hide Story';
      } else {
        content.classList.remove('is-expanded');
        toggleText.textContent = 'Our Story';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStoryToggle);
  } else {
    initStoryToggle();
  }
})();
