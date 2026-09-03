/**
 * BACKGROUND MUSIC
 * Optional music toggle with play/pause control.
 */

(function() {
  'use strict';

  const audio = document.getElementById('bgMusic');
  const btn = document.getElementById('musicBtn');

  if (!audio || !btn) return;

  let isPlaying = false;

  function checkMusicEnabled() {
    if (typeof WEDDING_CONFIG !== 'undefined' && WEDDING_CONFIG.theme) {
      if (!WEDDING_CONFIG.theme.enableMusic) {
        btn.classList.add('is-hidden');
        return false;
      }
      if (WEDDING_CONFIG.theme.musicFile) {
        audio.querySelector('source').src = WEDDING_CONFIG.theme.musicFile;
        audio.load();
      }
      btn.classList.remove('is-hidden');
      return true;
    }
    return false;
  }

  window.startMusic = function() {
    if (!checkMusicEnabled()) return;

    audio.volume = 0.3;
    const playPromise = audio.play();
    if (playPromise) {
      playPromise.then(() => {
        isPlaying = true;
        btn.classList.add('is-playing');
        btn.textContent = '🎵';
      }).catch(() => {
        // Autoplay blocked — user needs to tap music button
        isPlaying = false;
      });
    }
  };

  btn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      btn.classList.remove('is-playing');
      btn.textContent = '🔇';
    } else {
      audio.volume = 0.3;
      audio.play().then(() => {
        isPlaying = true;
        btn.classList.add('is-playing');
        btn.textContent = '🎵';
      }).catch(() => {});
    }
  });

  // Check on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkMusicEnabled);
  } else {
    checkMusicEnabled();
  }
})();
