/* ==========================================================================
   Dreamers Lab — Interactive Hero & 3D Workspace Engine
   Features:
   • 3D Parallax Mouse Tracking with Inertia / Damping
   • Magnetic Tactile CTA
   • Interactive Stage Switcher & Card Linking (Curiosity → Idea → Build → Launch)
   • Glassmorphic Sticky Header State
   • Micro-Interactions & Ambient Motion
   ========================================================================== */

(function () {
  'use strict';

  function initDreamersLabHero() {
    const heroSection = document.querySelector('.dl-hero-section');
    const canvas = document.querySelector('.dl-workspace-canvas');
    if (!heroSection || !canvas) return;

    /* ── 1. Glassmorphic Navigation Scroll State ─────────────────── */
    const navbar = document.querySelector('.dl-navbar');
    const navToggle = document.querySelector('.dl-nav-toggle');
    const mobileMenu = document.querySelector('.dl-mobile-menu');

    if (navbar) {
      const handleScroll = () => {
        if (window.scrollY > 24) {
          navbar.classList.add('is-scrolled');
        } else {
          navbar.classList.remove('is-scrolled');
        }
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }

    if (navToggle && mobileMenu) {
      navToggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', isOpen);
      });

      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    /* ── 2. Magnetic CTA Hover Effect ───────────────────────────── */
    const primaryBtn = document.querySelector('.dl-btn-primary');
    if (primaryBtn && window.matchMedia('(hover: hover)').matches) {
      primaryBtn.addEventListener('mousemove', (e) => {
        const rect = primaryBtn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        primaryBtn.style.transform = `translate3d(${x * 0.22}px, ${y * 0.22}px, 0) scale(1.02)`;
      });

      primaryBtn.addEventListener('mouseleave', () => {
        primaryBtn.style.transform = '';
      });
    }

    /* ── 3. 3D Parallax Mouse Tracking for Workspace ────────────── */
    const elements = {
      photo: document.querySelector('.dl-element-photo'),
      curiosity: document.querySelector('.dl-element-sticky-curiosity'),
      problem: document.querySelector('.dl-element-problem-card'),
      prototype: document.querySelector('.dl-element-prototype-card'),
      feedback: document.querySelector('.dl-element-feedback-note'),
      launch: document.querySelector('.dl-element-launch-badge'),
    };

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isMouseInside = false;
    let animationFrameId = null;

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      // Calculate normalized coords (-1 to +1) relative to center of canvas
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      targetX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (window.innerWidth * 0.45)));
      targetY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (window.innerHeight * 0.45)));
      isMouseInside = true;
    }

    function onMouseLeave() {
      targetX = 0;
      targetY = 0;
      isMouseInside = false;
    }

    // Only enable heavy mouse tracking on non-touch devices
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      heroSection.addEventListener('mousemove', onMouseMove, { passive: true });
      heroSection.addEventListener('mouseleave', onMouseLeave, { passive: true });

      function renderParallax() {
        // Smooth linear interpolation (lerp)
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;

        // Canvas slight 3D perspective tilt
        const rotY = currentX * 4;
        const rotX = -currentY * 4;
        canvas.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;

        // Parallax depth translations
        if (elements.photo) {
          elements.photo.style.transform = `translate3d(${(currentX * 10).toFixed(1)}px, ${(currentY * 8).toFixed(1)}px, 0) rotate(-1.5deg)`;
        }
        if (elements.curiosity) {
          elements.curiosity.style.transform = `translate3d(${(currentX * -18).toFixed(1)}px, ${(currentY * -14).toFixed(1)}px, 0) rotate(3.8deg)`;
        }
        if (elements.problem) {
          elements.problem.style.transform = `translate3d(${(currentX * 16).toFixed(1)}px, ${(currentY * -12).toFixed(1)}px, 0) rotate(-4.5deg)`;
        }
        if (elements.prototype) {
          elements.prototype.style.transform = `translate3d(${(currentX * -22).toFixed(1)}px, ${(currentY * 20).toFixed(1)}px, 0) rotate(2.2deg)`;
        }
        if (elements.feedback) {
          elements.feedback.style.transform = `translate3d(${(currentX * 14).toFixed(1)}px, ${(currentY * -16).toFixed(1)}px, 0) rotate(-3deg)`;
        }
        if (elements.launch) {
          elements.launch.style.transform = `translate3d(${(currentX * -12).toFixed(1)}px, ${(currentY * -10).toFixed(1)}px, 0) rotate(-1deg)`;
        }

        animationFrameId = requestAnimationFrame(renderParallax);
      }

      animationFrameId = requestAnimationFrame(renderParallax);
    }

    /* ── 4. Interactive Stage Switcher & Storytelling ───────────── */
    const stagePills = document.querySelectorAll('.dl-stage-pill');
    const stageMap = {
      'curiosity': elements.curiosity,
      'problem': elements.problem,
      'prototype': elements.prototype,
      'launch': elements.launch
    };

    function setActiveStage(stageKey) {
      stagePills.forEach(pill => {
        pill.classList.toggle('is-active', pill.dataset.stage === stageKey);
      });

      // Clear previous card highlights
      Object.values(elements).forEach(el => {
        if (el) el.classList.remove('is-highlighted');
      });

      // Highlight target card
      const targetCard = stageMap[stageKey];
      if (targetCard) {
        targetCard.classList.add('is-highlighted');
      }
    }

    stagePills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const stage = pill.dataset.stage;
        setActiveStage(stage);
      });

      pill.addEventListener('mouseenter', () => {
        const stage = pill.dataset.stage;
        setActiveStage(stage);
      });
    });

    // Inverse linkage: Clicking or hovering directly on cards updates the pill
    if (elements.curiosity) {
      elements.curiosity.addEventListener('mouseenter', () => setActiveStage('curiosity'));
    }
    if (elements.problem) {
      elements.problem.addEventListener('mouseenter', () => setActiveStage('problem'));
    }
    if (elements.prototype) {
      elements.prototype.addEventListener('mouseenter', () => setActiveStage('prototype'));
    }
    if (elements.launch) {
      elements.launch.addEventListener('mouseenter', () => setActiveStage('launch'));
    }

    /* ── 5. Dynamic Prototype Progress Simulation ────────────────── */
    const protoFill = document.querySelector('.dl-proto-fill');
    const protoStat = document.querySelector('.dl-proto-stat');
    if (protoFill && protoStat) {
      let isSimulating = false;
      function simulateTest() {
        if (isSimulating) return;
        isSimulating = true;
        protoFill.style.width = '35%';
        protoStat.textContent = '35%';
        setTimeout(() => {
          protoFill.style.width = '94%';
          protoStat.textContent = '94% TESTED';
          setTimeout(() => { isSimulating = false; }, 1200);
        }, 300);
      }

      if (elements.prototype) {
        elements.prototype.addEventListener('mouseenter', simulateTest);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDreamersLabHero);
  } else {
    initDreamersLabHero();
  }
})();
