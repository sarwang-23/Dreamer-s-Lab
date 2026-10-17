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
          elements.photo.style.transform = `translate3d(${(currentX * 8).toFixed(1)}px, ${(currentY * 6).toFixed(1)}px, 0) rotate(-1.5deg)`;
        }
        if (elements.curiosity) {
          elements.curiosity.style.transform = `translate3d(${(currentX * -16).toFixed(1)}px, ${(currentY * -12).toFixed(1)}px, 0) rotate(3deg)`;
        }
        if (elements.problem) {
          elements.problem.style.transform = `translate3d(${(currentX * 14).toFixed(1)}px, ${(currentY * -10).toFixed(1)}px, 0) rotate(-2.5deg)`;
        }
        if (elements.prototype) {
          elements.prototype.style.transform = `translate3d(${(currentX * -18).toFixed(1)}px, ${(currentY * 16).toFixed(1)}px, 0) rotate(2deg)`;
        }
        if (elements.launch) {
          elements.launch.style.transform = `translate3d(${(currentX * -10).toFixed(1)}px, ${(currentY * -8).toFixed(1)}px, 0) rotate(-1.5deg)`;
        }

        animationFrameId = requestAnimationFrame(renderParallax);
      }

      animationFrameId = requestAnimationFrame(renderParallax);
    }

    /* ── 4. Interactive Stage Switcher & Storytelling ───────────── */
    const stagePills = Array.from(document.querySelectorAll('.dl-stage-pill'));
    const phaseIndicator = document.querySelector('.dl-canvas-phase-indicator');
    const stageCaption = document.querySelector('.dl-photo-stage-caption');
    const bottomCaption = document.querySelector('#dl-caption-text');
    const photoImg = document.querySelector('.dl-element-photo img');

    const stageData = {
      'curiosity': {
        name: '01 Curiosity',
        phaseTag: 'Stage 01 · Problem Hunting & Inquiry',
        phaseMeta: 'ACTIVE STAGE: 01 CURIOSITY',
        caption: 'Interactive Showcase — Team EcoLoop framed the core inquiry: converting canteen bio-waste into rich community garden soil.',
        image: '../assets/dreamers-students.jpg',
        element: elements.curiosity
      },
      'problem': {
        name: '02 Problem & Idea',
        phaseTag: 'Stage 02 · Field Audit & Community Data',
        phaseMeta: 'ACTIVE STAGE: 02 PROBLEM & IDEA',
        caption: 'Interactive Showcase — 28 field interviews validated that 84% of residents experience irregular waste pickup.',
        image: '../assets/story-experiment.jpg',
        element: elements.problem
      },
      'prototype': {
        name: '03 Prototype & Build',
        phaseTag: 'Stage 03 · Prototyping V1.2 & Build',
        phaseMeta: 'ACTIVE STAGE: 03 PROTOTYPE & BUILD',
        caption: 'Interactive Showcase — Students construct physical bio-loop prototypes, testing sensor mechanics and learning by doing.',
        image: '../assets/story-prototype.jpg',
        element: elements.prototype
      },
      'launch': {
        name: '04 Launch',
        phaseTag: 'Stage 04 · 12-Week Demo Day Showcase',
        phaseMeta: 'ACTIVE STAGE: 04 DEMO DAY SHOWCASE',
        caption: 'Interactive Showcase — Culmination at Demo Day: pitching the validated prototype to school mentors and ecosystem partners.',
        image: '../assets/dreamers-students.jpg',
        element: elements.launch
      }
    };

    function setActiveStage(stageKey) {
      if (!stageData[stageKey]) return;

      // Update pills state and ARIA
      stagePills.forEach(pill => {
        const isSelected = pill.dataset.stage === stageKey;
        pill.classList.toggle('is-active', isSelected);
        pill.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        pill.setAttribute('tabindex', isSelected ? '0' : '-1');
      });

      // Clear previous card highlights
      Object.values(elements).forEach(el => {
        if (el) el.classList.remove('is-highlighted');
      });

      // Highlight target card
      const targetPill = stagePills.find(pill => pill.dataset.stage === stageKey);
      const defaultData = stageData[stageKey] || {};
      const activeData = {
        name: (targetPill && targetPill.dataset.name) || defaultData.name,
        phaseTag: (targetPill && targetPill.dataset.phaseTag) || defaultData.phaseTag,
        phaseMeta: (targetPill && targetPill.dataset.phaseMeta) || defaultData.phaseMeta,
        caption: (targetPill && targetPill.dataset.caption) || defaultData.caption,
        image: (targetPill && targetPill.dataset.image) || defaultData.image,
        element: elements[stageKey]
      };
      if (activeData.element) {
        activeData.element.classList.add('is-highlighted');
      }

      // Update captions and indicators with smooth fade
      if (phaseIndicator) {
        phaseIndicator.style.opacity = '0.4';
        setTimeout(() => {
          phaseIndicator.textContent = activeData.phaseMeta;
          phaseIndicator.style.opacity = '1';
        }, 120);
      }

      if (stageCaption) {
        stageCaption.style.opacity = '0.4';
        setTimeout(() => {
          stageCaption.textContent = activeData.phaseTag;
          stageCaption.style.opacity = '1';
        }, 120);
      }

      if (bottomCaption) {
        bottomCaption.style.opacity = '0.4';
        setTimeout(() => {
          bottomCaption.textContent = activeData.caption;
          bottomCaption.style.opacity = '1';
        }, 120);
      }

      // Smooth documentary image transition
      if (photoImg && activeData.image && photoImg.getAttribute('src') !== activeData.image) {
        photoImg.style.transition = 'opacity 0.25s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        photoImg.style.opacity = '0.7';
        setTimeout(() => {
          photoImg.src = activeData.image;
          photoImg.style.opacity = '1';
        }, 180);
      }
    }

    // Attach click and hover events to pills
    stagePills.forEach((pill, index) => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const stage = pill.dataset.stage;
        setActiveStage(stage);
      });

      pill.addEventListener('mouseenter', () => {
        const stage = pill.dataset.stage;
        setActiveStage(stage);
      });

      // Accessible Arrow Navigation
      pill.addEventListener('keydown', (e) => {
        let targetIndex = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          targetIndex = (index + 1) % stagePills.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          targetIndex = (index - 1 + stagePills.length) % stagePills.length;
        }

        if (targetIndex !== null) {
          e.preventDefault();
          const targetPill = stagePills[targetIndex];
          targetPill.focus();
          setActiveStage(targetPill.dataset.stage);
        }
      });
    });

    // Inverse linkage: Clicking or hovering directly on cards updates the pill
    if (elements.curiosity) {
      elements.curiosity.addEventListener('click', () => setActiveStage('curiosity'));
      elements.curiosity.addEventListener('mouseenter', () => setActiveStage('curiosity'));
      elements.curiosity.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveStage('curiosity'); }
      });
    }
    if (elements.problem) {
      elements.problem.addEventListener('click', () => setActiveStage('problem'));
      elements.problem.addEventListener('mouseenter', () => setActiveStage('problem'));
      elements.problem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveStage('problem'); }
      });
    }
    if (elements.prototype) {
      elements.prototype.addEventListener('click', () => setActiveStage('prototype'));
      elements.prototype.addEventListener('mouseenter', () => setActiveStage('prototype'));
      elements.prototype.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveStage('prototype'); }
      });
    }
    if (elements.launch) {
      elements.launch.addEventListener('click', () => setActiveStage('launch'));
      elements.launch.addEventListener('mouseenter', () => setActiveStage('launch'));
      elements.launch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveStage('launch'); }
      });
    }

    // Set initial active state (Stage 01 Curiosity)
    setActiveStage('curiosity');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDreamersLabHero);
  } else {
    initDreamersLabHero();
  }
})();
