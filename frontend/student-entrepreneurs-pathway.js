/* ==========================================================================
   Student Entrepreneurs — "Our Venture-Building Pathway" section
   Scroll-reveal (staggered fade-up) with reduced-motion & no-JS fallback.
   ========================================================================== */

(function () {
  'use strict';

  function initPathway() {
    var section = document.querySelector('.pg-pathway');
    if (!section) return;

    var reveals = section.querySelectorAll('.pg-pathway-reveal');
    if (!reveals.length) return;

    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function revealAll() {
      reveals.forEach(function (el) { el.classList.add('is-revealed'); });
    }

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealAll();
      return;
    }

    section.classList.add('pg-pathway-ready');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(function (el, i) {
      el.style.setProperty('--path-delay', Math.min(i * 55, 440) + 'ms');
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPathway);
  } else {
    initPathway();
  }
})();
