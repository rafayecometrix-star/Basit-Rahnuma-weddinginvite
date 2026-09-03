/**
 * PHOTO CAROUSEL (4:5 Ratio, Borderless, Auto-scrolling, Hand/Touch & Mouse Swipeable)
 */

(function() {
  'use strict';

  let currentIndex = 0;
  let slides = [];
  let dots = [];
  let autoPlayTimer = null;
  let speed = 3200;
  let isPaused = false;

  window.initPhotoCarousel = function(photoUrls, customSpeed) {
    const track = document.getElementById('storyCarouselTrack');
    const dotsContainer = document.getElementById('carouselDots');
    const carousel = document.getElementById('storyCarousel');

    if (!track || !photoUrls || !photoUrls.length) return;

    if (customSpeed && !isNaN(customSpeed)) {
      speed = parseInt(customSpeed, 10);
    }

    // Build borderless 4:5 slides
    track.innerHTML = photoUrls.map((url, i) => `
      <div class="story__carousel-slide" data-index="${i}">
        <div class="carousel-image-card">
          <img src="${url}" alt="Wedding celebration photo ${i + 1}" loading="lazy" />
        </div>
      </div>
    `).join('');

    // Build indicator dots
    if (dotsContainer) {
      dotsContainer.innerHTML = photoUrls.map((_, i) => `
        <button class="carousel-dot ${i === 0 ? 'is-active' : ''}" data-index="${i}" aria-label="Slide ${i + 1}"></button>
      `).join('');
      dots = Array.from(dotsContainer.querySelectorAll('.carousel-dot'));
      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          goToSlide(parseInt(dot.getAttribute('data-index'), 10));
          resetTimer();
        });
      });
    }

    slides = Array.from(track.querySelectorAll('.story__carousel-slide'));
    currentIndex = 0;
    updateCarousel();

    // Touch and mouse drag swipe support
    let startX = 0;
    let currentTranslate = 0;
    let isDragging = false;

    // Touch
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isPaused = true;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 35) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
      isPaused = false;
      resetTimer();
    }, { passive: true });

    // Mouse drag
    track.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      isPaused = true;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
    });

    window.addEventListener('mouseup', (e) => {
      if (isDragging) {
        isDragging = false;
        const diff = startX - e.clientX;
        if (Math.abs(diff) > 35) {
          if (diff > 0) nextSlide();
          else prevSlide();
        }
        isPaused = false;
        resetTimer();
      }
    });

    // Pause on hover
    if (carousel) {
      carousel.addEventListener('mouseenter', () => { isPaused = true; });
      carousel.addEventListener('mouseleave', () => { isPaused = false; });
    }

    // Start auto-play
    startTimer();
  };

  function updateCarousel() {
    const track = document.getElementById('storyCarouselTrack');
    if (!track || !slides.length) return;

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === currentIndex);
    });
  }

  function nextSlide() {
    if (!slides.length) return;
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }

  function prevSlide() {
    if (!slides.length) return;
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  }

  function goToSlide(index) {
    if (index >= 0 && index < slides.length) {
      currentIndex = index;
      updateCarousel();
    }
  }

  function startTimer() {
    stopTimer();
    autoPlayTimer = setInterval(() => {
      if (!isPaused) {
        nextSlide();
      }
    }, speed);
  }

  function stopTimer() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  function resetTimer() {
    startTimer();
  }
})();
