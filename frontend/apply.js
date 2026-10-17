/* ==========================================================================
   Program Applications — Interactive Track Switcher & Form Manager
   ========================================================================== */

(function () {
  'use strict';

  function initApplicationPage() {
    const tabButtons = document.querySelectorAll('[data-track-tab]');
    const tabPanels = document.querySelectorAll('[data-track-panel]');
    if (!tabButtons.length || !tabPanels.length) return;

    function switchTrack(trackId) {
      tabButtons.forEach(btn => {
        const isActive = btn.dataset.trackTab === trackId;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      tabPanels.forEach(panel => {
        const isActive = panel.dataset.trackPanel === trackId;
        panel.classList.toggle('is-active', isActive);
      });

      // Update URL search param without page reload
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('track', trackId);
        window.history.replaceState({}, '', url.toString());
      } catch (e) {}
    }

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const track = btn.dataset.trackTab;
        switchTrack(track);
      });
    });

    // Check URL param or hash on initial load
    try {
      const params = new URLSearchParams(window.location.search);
      const trackParam = params.get('track');
      if (trackParam && document.querySelector(`[data-track-panel="${trackParam}"]`)) {
        switchTrack(trackParam);
      }
    } catch (e) {}

    // Handle form submissions to show the rich confirmation card
    document.querySelectorAll('.app-form-node').forEach(form => {
      form.addEventListener('submit', event => {
        event.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        const wrap = form.closest('.app-form-wrap');
        if (wrap) {
          wrap.classList.add('is-submitted');
          const confirmCard = wrap.querySelector('.app-confirmation-card');
          if (confirmCard) {
            confirmCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            confirmCard.focus();
          }
        }
      });
    });

    // Reset button inside confirmation card
    document.querySelectorAll('[data-reset-application]').forEach(btn => {
      btn.addEventListener('click', () => {
        const wrap = btn.closest('.app-form-wrap');
        if (wrap) {
          const form = wrap.querySelector('.app-form-node');
          if (form) form.reset();
          wrap.classList.remove('is-submitted');
          wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApplicationPage);
  } else {
    initApplicationPage();
  }
})();
