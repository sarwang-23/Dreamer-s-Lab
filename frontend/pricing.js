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

  // Handle modal form submission
  const enrolForm = document.getElementById('pr-enrol-form');
  if (enrolForm) {
    enrolForm.addEventListener('submit', (e) => {
      // Allow bd-form-handler.js or standard validation
      const name = enrolForm.querySelector('[name="name"]')?.value;
      const email = enrolForm.querySelector('[name="email"]')?.value;
      const prog = programSelect?.options[programSelect.selectedIndex]?.text || 'Entrepreneurship Program';

      // If form doesn't prevent default, provide smooth UX
      const statusBox = document.getElementById('pr-modal-status');
      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.style.color = '#10483D';
        statusBox.style.background = 'rgba(16,72,61,0.08)';
        statusBox.style.padding = '0.75rem';
        statusBox.style.borderRadius = '8px';
        statusBox.style.marginBottom = '1rem';
        statusBox.textContent = `Thank you, ${name || 'Founder'}! Your enrolment inquiry for ${prog} has been received. Our venture team will reach out to ${email} within 24 hours.`;
        enrolForm.reset();
        setTimeout(closeModal, 3500);
      }
    });
  }
});
