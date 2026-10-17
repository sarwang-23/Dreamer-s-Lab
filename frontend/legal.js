/* ==========================================================================
   Building Dreams — Legal Document Scroll Spy & Sticky TOC
   ========================================================================== */

(function () {
  'use strict';

  function initLegalScrollSpy() {
    const tocLinks = document.querySelectorAll('.legal-toc-link');
    const clauses = document.querySelectorAll('.legal-clause');
    if (!tocLinks.length || !clauses.length) return;

    // Smooth scroll handling with header offset
    tocLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.replaceState(null, '', href);
        }
      });
    });

    // Scroll spy via IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            tocLinks.forEach(link => {
              const matches = link.getAttribute('href') === `#${id}`;
              link.classList.toggle('is-active', matches);
            });
          }
        });
      },
      {
        rootMargin: '-10% 0px -75% 0px',
        threshold: 0
      }
    );

    clauses.forEach(clause => observer.observe(clause));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLegalScrollSpy);
  } else {
    initLegalScrollSpy();
  }
})();
