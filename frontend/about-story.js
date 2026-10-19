/* ==========================================================================
   ABOUT STORY — Interactive Scroll Reveals & Micro-Motion
   Progressive enhancement for "Our Story — Why Building Dreams Exists"
   ========================================================================== */
(function () {
  'use strict';

  var section = document.querySelector('.story-section');
  if (!section) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    section.classList.add('is-visible');
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          section.classList.add('is-visible');
          observer.disconnect();
        }
      });
    },
    { threshold: 0.15 }
  );

  observer.observe(section);

  // ── "What You Can Build" Modal Banner Controller ──
  var modal = document.getElementById('wycb-modal');
  var openBtn = document.getElementById('open-what-you-can-build');
  var closeBtn = document.getElementById('wycb-modal-close');

  if (modal) {
    function openModal(e) {
      if (e) e.preventDefault();
      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (openBtn) openBtn.focus();
    }

    if (openBtn) {
      openBtn.addEventListener('click', openModal);
    }

    // Also support any element with [data-open-wycb]
    var extraTriggers = document.querySelectorAll('[data-open-wycb]');
    Array.prototype.forEach.call(extraTriggers, function (btn) {
      btn.addEventListener('click', openModal);
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(e);
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });
  }
})();
