/**
 * testimonials.js
 * Interactive filtering and video playback management for Testimonials page
 */

document.addEventListener('DOMContentLoaded', () => {
  // ── 1. Audience Filter Switcher ──────────────────────────────────────────
  const filterBtns = document.querySelectorAll('[data-tm-filter]');
  const items = document.querySelectorAll('[data-tm-track]');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filter = btn.getAttribute('data-tm-filter');

      items.forEach((item) => {
        const track = item.getAttribute('data-tm-track');
        if (filter === 'all' || filter === track || track.includes(filter)) {
          item.style.display = 'flex';
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transition = 'opacity 0.25s ease';
          }, 10);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ── 2. Video Player Synchronisation (Pause others when one plays) ───────
  const videos = document.querySelectorAll('.tm-video-player');
  videos.forEach((video) => {
    video.addEventListener('play', () => {
      videos.forEach((otherVideo) => {
        if (otherVideo !== video && !otherVideo.paused) {
          otherVideo.pause();
        }
      });
    });
  });
});
