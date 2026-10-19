/**
 * dreamers-lab-apply-modal.js
 * Interactive modal logic for Dreamers Lab application preview
 */

export function initDreamersLabModal() {
  const modal = document.getElementById('dl-apply-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('dl-apply-modal-close');
  const openTriggers = document.querySelectorAll('[data-dl-open-apply]');

  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openTriggers.forEach((trigger) => {
    trigger.addEventListener('click', openModal);
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(e);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDreamersLabModal);
} else {
  initDreamersLabModal();
}
