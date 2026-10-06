/* ============================================
   BACKGROUND MUSIC CONTROLLER
   Floating Music Button & Seamless Looping
   ============================================ */

(function() {
  'use strict';

  const audio = document.getElementById('bgMusic');
  const toggleBtn = document.getElementById('music-toggle');
  let isPlaying = false;

  function play() {
    if (!audio) return;
    audio.play().then(() => {
      isPlaying = true;
      if (toggleBtn) {
        toggleBtn.classList.add('is-playing');
        toggleBtn.innerHTML = '🎵';
      }
    }).catch((err) => {
      console.log('Audio autoplay prevented or audio file absent:', err);
    });
  }

  function pause() {
    if (!audio) return;
    audio.pause();
    isPlaying = false;
    if (toggleBtn) {
      toggleBtn.classList.remove('is-playing');
      toggleBtn.innerHTML = '🔇';
    }
  }

  function toggle() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggle);
  }

  window.WeddingMusic = {
    startMusic: play,
    stopMusic: pause,
    toggleMusic: toggle
  };
})();
