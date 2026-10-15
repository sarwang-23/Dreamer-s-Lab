/**
 * About Philosophy, Differentials, Founder & Promise
 * Lightweight IntersectionObserver for Staggered Viewport Reveals
 */
(function() {
    function initEditorialSections() {
        const sections = document.querySelectorAll('.ab-editorial-section');
        if (!sections.length) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            sections.forEach(sec => sec.classList.add('is-visible'));
            return;
        }

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, {
                root: null,
                threshold: 0.12,
                rootMargin: '0px 0px -40px 0px'
            });

            sections.forEach(sec => observer.observe(sec));
        } else {
            sections.forEach(sec => sec.classList.add('is-visible'));
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEditorialSections);
    } else {
        initEditorialSections();
    }
})();
