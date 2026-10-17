/* ==========================================================================
   Student Entrepreneurs — "Program Formats" Scroll Engine
   ========================================================================== */

(function () {
  'use strict';

  function initFormatsSection() {
    var section = document.querySelector('.pg-formats-section');
    if (!section) return;

    var reveals = section.querySelectorAll('.pg-formats-reveal');
    if (!reveals.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });

      reveals.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      reveals.forEach(function (el) {
        el.classList.add('is-revealed');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFormatsSection);
  } else {
    initFormatsSection();
  }
})();
