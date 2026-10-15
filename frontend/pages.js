/* ==========================================================================
   Interior page interactions.
   Demo forms are not connected to a backend yet, so they confirm in-page and
   never navigate away. Wire `action`/`method` and remove `data-demo-form` once
   a real submission service is in place.
   ========================================================================== */
(function () {
  'use strict';

  function setupDemoForms(root) {
    root.querySelectorAll('form[data-demo-form]').forEach((form) => {
      if (form.dataset.demoReady === 'true') return;
      form.dataset.demoReady = 'true';

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        form.classList.add('is-sent');
        const success = form.querySelector('.pg-form-success');
        if (success) {
          success.setAttribute('role', 'status');
          success.setAttribute('tabindex', '-1');
          success.focus({ preventScroll: true });
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  function setup() {
    setupDemoForms(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup, { once: true });
  } else {
    setup();
  }
})();
