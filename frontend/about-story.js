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
})();
