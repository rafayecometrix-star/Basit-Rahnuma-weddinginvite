/**
 * SCROLL ANIMATIONS
 * Uses IntersectionObserver to trigger reveal animations on scroll.
 */

(function() {
  'use strict';

  window.initScrollAnimations = function() {
    const revealElements = document.querySelectorAll(
      '.reveal, .reveal--left, .reveal--right, .reveal--scale, .reveal-stagger'
    );

    if (!revealElements.length) return;

    // Check for reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      revealElements.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Only animate once
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    revealElements.forEach(el => observer.observe(el));
  };

  // Also handle parallax on scroll
  function initParallax() {
    const heroImg = document.getElementById('heroArchImg');
    if (!heroImg) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroSection = document.getElementById('sectionHero');
          if (heroSection) {
            const heroHeight = heroSection.offsetHeight;
            if (scrollY < heroHeight) {
              const translate = scrollY * 0.3;
              heroImg.style.transform = `translateY(${translate}px)`;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Delay initial check to let envelope finish
      setTimeout(initParallax, 100);
    });
  } else {
    initParallax();
  }
})();
