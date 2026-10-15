/**
 * About Mission & Vision — Staggered Entrance & Micro-Interactions
 */
(function() {
    function initMissionVision() {
        const section = document.querySelector('.mv-section');
        if (!section) return;

        // Check reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            section.classList.add('is-visible');
            return;
        }

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        section.classList.add('is-visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, {
                root: null,
                threshold: 0.15,
                rootMargin: '0px 0px -40px 0px'
            });

            observer.observe(section);
        } else {
            section.classList.add('is-visible');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMissionVision);
    } else {
        initMissionVision();
    }
})();
