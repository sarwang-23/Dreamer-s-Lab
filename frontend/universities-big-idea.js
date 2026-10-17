/* ==========================================================================
   Universities & Accelerators — "The Campus Challenge" Interactive Scroll & Card Engine
   ========================================================================== */

(function () {
  'use strict';

  function initUniversitiesBigIdea() {
    const section = document.querySelector('.univ-idea-section');
    if (!section) return;

    /* ── 1. Scroll-Triggered Progressive Reveal ─────────────────── */
    const reveals = section.querySelectorAll('.univ-reveal');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      reveals.forEach(el => observer.observe(el));
    } else {
      reveals.forEach(el => el.classList.add('is-revealed'));
    }

    /* ── 2. Interactive Card & Flow Synchronisation ─────────────── */
    const stageCards = section.querySelectorAll('.univ-stage-card');
    const flowNodes = section.querySelectorAll('.univ-flow-node');

    function setActiveFlowNode(stageIndex) {
      flowNodes.forEach((node, i) => {
        node.classList.toggle('is-active', i === stageIndex);
      });
    }

    stageCards.forEach((card, index) => {
      card.addEventListener('mouseenter', () => {
        setActiveFlowNode(index);
      });

      card.addEventListener('click', () => {
        const isAlreadyExpanded = card.classList.contains('is-expanded');
        stageCards.forEach(c => c.classList.remove('is-expanded'));
        if (!isAlreadyExpanded) {
          card.classList.add('is-expanded');
        }
        setActiveFlowNode(index);
      });
    });

    // Default open first card
    if (stageCards[0]) {
      stageCards[0].classList.add('is-expanded');
      setActiveFlowNode(0);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUniversitiesBigIdea);
  } else {
    initUniversitiesBigIdea();
  }
})();
