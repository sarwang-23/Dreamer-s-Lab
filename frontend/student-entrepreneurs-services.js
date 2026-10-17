/* ==========================================================================
   Student Entrepreneurs — "What We Help You With" (Section 5)
   Subtle staggered fade-up via IntersectionObserver.
   ========================================================================== */

(function () {
  'use strict';

  function initServices() {
    var section = document.querySelector('.pg-services');
    if (!section) return;

    var reveals = section.querySelectorAll('.pg-svc-reveal');
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

    section.classList.add('pg-services-ready');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.16,
      rootMargin: '0px 0px -30px 0px'
    });

    reveals.forEach(function (el, i) {
      el.style.setProperty('--svc-delay', Math.min(i * 55, 440) + 'ms');
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServices);
  } else {
    initServices();
  }
})();
