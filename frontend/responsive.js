/** Progressive disclosure menu; navigation remains visible without JavaScript. */
export function initMobileNavigation() {
  const navbar = document.querySelector('.nd-navbar');
  const toggle = navbar?.querySelector('.nd-menu-toggle');
  const links = document.getElementById('primary-navigation');
  const actions = document.getElementById('primary-navigation-actions');
  if (!toggle || !links || !actions || navbar.dataset.menuReady) return;
  navbar.dataset.menuReady = 'true';

  const compact = window.matchMedia('(max-width: 960px)');
  const label = toggle.querySelector('span');

  function setOpen(open, restoreFocus = false) {
    const expanded = compact.matches && open;
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-label', expanded ? 'Close navigation menu' : 'Open navigation menu');
    label.textContent = expanded ? 'Close' : 'Menu';
    navbar.classList.toggle('is-menu-open', expanded);
    links.hidden = compact.matches && !expanded;
    actions.hidden = compact.matches && !expanded;
    if (restoreFocus && compact.matches) toggle.focus();
  }

  function syncLayout() {
    // Avoid leaving keyboard focus on a control hidden by a resize/rotation.
    const focused = document.activeElement;
    if (!compact.matches && focused === toggle) links.querySelector('a')?.focus();
    toggle.hidden = !compact.matches;
    setOpen(false, compact.matches && (links.contains(focused) || actions.contains(focused)));
  }

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  navbar.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link || !compact.matches || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    setOpen(false);
    const href = link.getAttribute('href');
    if (!href?.startsWith('#')) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    }
    target.focus({ preventScroll: true });
    // Leave fragment navigation and history to the browser.
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      event.preventDefault();
      setOpen(false, true);
    }
  });
  document.addEventListener('click', (event) => {
    if (!navbar.contains(event.target)) setOpen(false);
  });
  navbar.addEventListener('focusout', (event) => {
    if (event.relatedTarget && !navbar.contains(event.relatedTarget)) setOpen(false);
  });
  compact.addEventListener('change', syncLayout);
  syncLayout();
}
