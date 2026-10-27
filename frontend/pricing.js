/**
 * pricing.js
 * Interactivity for Building Dreams Entrepreneurship Programs & Pricing Page
 */

document.addEventListener('DOMContentLoaded', () => {
  // ── 1. Audience Filter Buttons ──────────────────────────────────────────
  const filterBtns = document.querySelectorAll('[data-pr-filter]');
  const cards = document.querySelectorAll('[data-pr-track]');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filter = btn.getAttribute('data-pr-filter');

      cards.forEach((card) => {
        const track = card.getAttribute('data-pr-track');
        if (filter === 'all' || filter === track) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ── 2. Card Deep-Dive Accordion Drawers ─────────────────────────────────
  const drawerToggles = document.querySelectorAll('[data-drawer-toggle]');

  drawerToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const targetId = toggle.getAttribute('data-drawer-toggle');
      const drawer = document.getElementById(targetId);
      if (!drawer) return;

      const isOpen = drawer.classList.contains('is-open');

      if (isOpen) {
        drawer.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.querySelector('span').textContent = toggle.getAttribute('data-closed-text') || 'View Full Curriculum & Details';
      } else {
        drawer.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.querySelector('span').textContent = toggle.getAttribute('data-open-text') || 'Hide Curriculum & Details';
      }
    });
  });

  // ── 3. Quick Enrolment / Advisory Modal ─────────────────────────────────
  const modal = document.getElementById('pr-enrol-modal');
  const closeBtn = document.getElementById('pr-modal-close');
  const programSelect = document.getElementById('pr-modal-program');
  const triggers = document.querySelectorAll('[data-open-enrol]');

  function openModal(programKey) {
    if (!modal) return;
    if (programSelect && programKey) {
      programSelect.value = programKey;
    }
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const programKey = trigger.getAttribute('data-open-enrol');
      openModal(programKey);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Form submission is handled by bd-form-handler.js which securely sends
  // all enrolment entries to Google Sheets and sends confirmation notifications.
});
