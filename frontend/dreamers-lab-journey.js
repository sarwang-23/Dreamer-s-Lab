/* ==========================================================================
   Dreamers Lab — The 12-Week Journey Horizontally Connected Controller
   Features:
   • Horizontally Connected Frames Carousel / Track
   • Smooth Left / Right Arrow Navigation
   • Top Continuous Horizontal Milestone Rail Sync
   • Drag-to-Scroll & Touch Swipe Support
   • Dynamic Progress Fill & Counter (Phase X of 5)
   ========================================================================== */

(function () {
  'use strict';

  function initHorizontalJourney() {
    const journeySection = document.querySelector('.dl-journey-section');
    if (!journeySection) return;

    const track = document.querySelector('.dl-h-track');
    const frames = Array.from(document.querySelectorAll('.dl-h-frame'));
    const railNodes = Array.from(document.querySelectorAll('.dl-rail-node'));
    const railLineFill = document.querySelector('.dl-rail-line-fill');
    const prevBtn = document.querySelector('.dl-journey-arrow-btn.is-prev');
    const nextBtn = document.querySelector('.dl-journey-arrow-btn.is-next');
    const counterText = document.querySelector('.dl-progress-text');
    const miniBarFill = document.querySelector('.dl-progress-bar-fill-mini');

    if (!track || !frames.length) return;

    let currentPhase = 1;
    const totalPhases = frames.length;

    // Helper: update active state UI
    function updateActiveState(phaseIndex) {
      currentPhase = Math.max(1, Math.min(totalPhases, phaseIndex));

      // Update rail nodes
      railNodes.forEach(node => {
        const p = parseInt(node.dataset.phase, 10);
        node.classList.toggle('is-active', p === currentPhase);
      });

      // Update frames
      frames.forEach(frame => {
        const p = parseInt(frame.dataset.phase, 10);
        frame.classList.toggle('is-active', p === currentPhase);
      });

      // Update rail line fill percentage
      if (railLineFill) {
        const fillPercent = ((currentPhase - 1) / (totalPhases - 1)) * 100;
        railLineFill.style.width = `${fillPercent}%`;
      }

      // Update mini counter and progress bar
      if (counterText) {
        counterText.textContent = `PHASE 0${currentPhase} OF 0${totalPhases}`;
      }
      if (miniBarFill) {
        miniBarFill.style.width = `${(currentPhase / totalPhases) * 100}%`;
      }

      // Update arrows disabled state
      if (prevBtn) prevBtn.disabled = (currentPhase === 1);
      if (nextBtn) nextBtn.disabled = (currentPhase === totalPhases);
    }

    // Scroll to specific frame
    function scrollToFrame(phaseIndex) {
      const targetFrame = frames[phaseIndex - 1];
      if (targetFrame) {
        const trackRect = track.getBoundingClientRect();
        const frameRect = targetFrame.getBoundingClientRect();
        const targetScrollLeft = track.scrollLeft + (frameRect.left - trackRect.left) - (trackRect.width / 2) + (frameRect.width / 2);

        track.scrollTo({
          left: Math.max(0, targetScrollLeft),
          behavior: 'smooth'
        });
        updateActiveState(phaseIndex);
      }
    }

    // Rail nodes click
    railNodes.forEach(node => {
      node.addEventListener('click', () => {
        const p = parseInt(node.dataset.phase, 10);
        scrollToFrame(p);
      });
    });

    // Arrow navigation
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentPhase > 1) {
          scrollToFrame(currentPhase - 1);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentPhase < totalPhases) {
          scrollToFrame(currentPhase + 1);
        }
      });
    }

    // Track scroll synchronization (detect which frame is closest to center)
    let isScrollingTimeout;
    track.addEventListener('scroll', () => {
      clearTimeout(isScrollingTimeout);
      isScrollingTimeout = setTimeout(() => {
        const trackCenter = track.getBoundingClientRect().left + track.offsetWidth / 2;
        let closestIndex = 1;
        let minDiff = Infinity;

        frames.forEach((frame, idx) => {
          const frameRect = frame.getBoundingClientRect();
          const frameCenter = frameRect.left + frameRect.width / 2;
          const diff = Math.abs(trackCenter - frameCenter);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = idx + 1;
          }
        });

        if (closestIndex !== currentPhase) {
          updateActiveState(closestIndex);
        }
      }, 60);
    }, { passive: true });

    // Drag-to-scroll implementation
    let isDown = false;
    let startX;
    let scrollLeft;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.classList.add('is-dragging');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      isDown = false;
      track.classList.remove('is-dragging');
    });

    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    });

    // Keyboard Arrow Navigation on the track
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' && currentPhase < totalPhases) {
        e.preventDefault();
        scrollToFrame(currentPhase + 1);
      } else if (e.key === 'ArrowLeft' && currentPhase > 1) {
        e.preventDefault();
        scrollToFrame(currentPhase - 1);
      }
    });

    // Initial state
    updateActiveState(1);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHorizontalJourney);
  } else {
    initHorizontalJourney();
  }
})();
