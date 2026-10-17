/* ==========================================================================
   Universities & Accelerators — Interactive Hero & 3D Workspace Engine
   Features:
   • 3D Parallax Mouse Tracking with Inertia / Damping
   • Magnetic Tactile CTA
   • Interactive Stage Switcher & Card Linking (Discovery → Pre-Incubation → Incubation → Acceleration)
   • Micro-Interactions & Ambient Motion
   ========================================================================== */

(function () {
  'use strict';

  function initUniversitiesHero() {
    const heroSection = document.querySelector('.univ-hero-section');
    const canvas = document.querySelector('.univ-workspace-canvas');
    if (!heroSection || !canvas) return;

    /* ── 1. Magnetic CTA Hover Effect ───────────────────────────── */
    const primaryBtn = document.querySelector('.univ-btn-primary');
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

    /* ── 2. 3D Parallax Mouse Tracking for Workspace ────────────── */
    const elements = {
      photo: document.querySelector('.univ-element-photo'),
      discovery: document.querySelector('.univ-element-sticky-discovery'),
      audit: document.querySelector('.univ-element-audit-card'),
      pipeline: document.querySelector('.univ-element-pipeline-card'),
      mentor: document.querySelector('.univ-element-mentor-note'),
      launch: document.querySelector('.univ-element-launch-badge'),
    };

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isMouseInside = false;
    let animationFrameId = null;

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
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

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      canvas.addEventListener('mousemove', onMouseMove);
      canvas.addEventListener('mouseleave', onMouseLeave);
      heroSection.addEventListener('mousemove', (e) => {
        if (!isMouseInside) {
          const rect = canvas.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          targetX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (window.innerWidth * 0.75))) * 0.5;
          targetY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (window.innerHeight * 0.75))) * 0.5;
        }
      });
    }

    function renderParallax() {
      // Damping / easing
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (elements.photo) {
        elements.photo.style.transform = `translate3d(${currentX * -18}px, ${currentY * -14}px, 0) rotate(-1.5deg)`;
      }
      if (elements.discovery) {
        elements.discovery.style.transform = `translate3d(${currentX * 24}px, ${currentY * 20}px, 0) rotate(3.5deg)`;
      }
      if (elements.audit) {
        elements.audit.style.transform = `translate3d(${currentX * -28}px, ${currentY * 22}px, 0) rotate(-2.5deg)`;
      }
      if (elements.pipeline) {
        elements.pipeline.style.transform = `translate3d(${currentX * 22}px, ${currentY * -18}px, 0) rotate(1deg)`;
      }
      if (elements.mentor) {
        elements.mentor.style.transform = `translate3d(${currentX * -14}px, ${currentY * 18}px, 0) rotate(2deg)`;
      }
      if (elements.launch) {
        elements.launch.style.transform = `translate3d(calc(-50% + ${currentX * 12}px), ${currentY * -10}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(renderParallax);
    }

    renderParallax();

    /* ── 3. Stage Switcher & Element Highlighting ─────────────────── */
    const stagePills = document.querySelectorAll('.univ-stage-pill');
    const stageMap = {
      discovery: elements.discovery,
      preincubation: elements.audit,
      incubation: elements.pipeline,
      acceleration: elements.launch,
    };

    function activateStage(stageName) {
      stagePills.forEach(pill => {
        const isActive = pill.dataset.stage === stageName;
        pill.classList.toggle('is-active', isActive);
        pill.setAttribute('aria-selected', isActive);
      });

      // Clear highlights
      Object.values(elements).forEach(el => {
        if (el) el.classList.remove('is-highlighted');
      });

      const targetEl = stageMap[stageName];
      if (targetEl) {
        targetEl.classList.add('is-highlighted');
      }
    }

    stagePills.forEach(pill => {
      pill.addEventListener('click', () => {
        const stage = pill.dataset.stage;
        activateStage(stage);
      });
    });

    // Default activate discovery
    activateStage('discovery');

    // Auto rotate stages gently if user hasn't interacted
    let autoRotateIndex = 0;
    const stages = ['discovery', 'preincubation', 'incubation', 'acceleration'];
    let userHasInteracted = false;

    stagePills.forEach(p => {
      p.addEventListener('mouseenter', () => { userHasInteracted = true; });
      p.addEventListener('click', () => { userHasInteracted = true; });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.univ-navbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
          navbar.classList.add('is-scrolled');
        } else {
          navbar.classList.remove('is-scrolled');
        }
      }, { passive: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUniversitiesHero);
  } else {
    initUniversitiesHero();
  }
})();
