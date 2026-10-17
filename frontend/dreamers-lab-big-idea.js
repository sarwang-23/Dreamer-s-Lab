/* ==========================================================================
   Dreamers Lab — "The Big Idea" Interactive Scroll & Stage Engine
   ========================================================================== */

(function () {
  'use strict';

  function initBigIdeaSection() {
    const section = document.querySelector('.dl-idea-section');
    if (!section) return;

    /* ── 1. Scroll-Triggered Progressive Reveal ─────────────────── */
    const reveals = section.querySelectorAll('.dl-reveal');
    const quoteBlock = section.querySelector('.dl-idea-quote-block');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });

      reveals.forEach(el => observer.observe(el));

      // Separate observer for the emotional quote block to trigger self-drawing line
      if (quoteBlock) {
        const quoteObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              quoteBlock.classList.add('is-visible');
              quoteObserver.unobserve(quoteBlock);
            }
          });
        }, {
          threshold: 0.25
        });

        quoteObserver.observe(quoteBlock);
      }
    } else {
      // Fallback
      reveals.forEach(el => el.classList.add('is-revealed'));
      if (quoteBlock) quoteBlock.classList.add('is-visible');
    }

    /* ── 2. Interactive Card & Flow Synchronisation ─────────────── */
    const stageCards = section.querySelectorAll('.dl-stage-card');
    const flowNodes = section.querySelectorAll('.dl-flow-node');

    function setActiveFlowNode(stageIndex) {
      flowNodes.forEach((node, i) => {
        node.classList.toggle('is-active', i === stageIndex);
      });
    }

    stageCards.forEach((card, index) => {
      card.addEventListener('mouseenter', () => {
        setActiveFlowNode(index);
      });

      card.addEventListener('focus', () => {
        setActiveFlowNode(index);
      });
    });

    flowNodes.forEach((node, index) => {
      node.addEventListener('click', () => {
        setActiveFlowNode(index);
        const targetCard = stageCards[index];
        if (targetCard) {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBigIdeaSection);
  } else {
    initBigIdeaSection();
  }
})();
