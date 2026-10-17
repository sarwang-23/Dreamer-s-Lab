import './footer.css';

// Base-aware URLs so the shared footer resolves from the homepage and from
// every dedicated page, wherever the site is deployed.
const HOME = import.meta.env.BASE_URL;
const url = (path = '') => `${HOME}${path}`;

const NAVIGATION = [
  { title: 'Programs', links: [
    ['Dreamers Lab', url('dreamers-lab/')],
    ['Student Entrepreneurs', url('student-entrepreneurs/')],
    ['University Programs', url('universities/')],
  ] },
  { title: 'Explore', links: [
    ['About Us', url('about/')],
    ['Mentors & Community', url('community/')],
    ['Insights & Resources', url('insights/')],
    ['For Parents', url('parents/')],
  ] },
  { title: 'Get Involved', links: [
    ['Apply to a Program', url('apply/')],
    ['Become a Mentor', `${url('community/')}#become-a-mentor`],
    ['Partner With Us', `${url('universities/')}#partnership`],
    ['Contact', url('get-started/')],
  ] },
  { title: 'Information', links: [
    ['FAQs', url('faq/')],
    ['Privacy Policy', url('privacy-policy/')],
    ['Terms of Use', url('terms/')],
  ] },
];

// Only add verified official profile URLs. Unconfigured channels are plain
// text, never fake links or keyboard stops. This is the sole social config.
const SOCIAL_LINKS = [
  { label: 'LinkedIn', url: null },
  { label: 'Instagram', url: null },
  { label: 'YouTube', url: null },
];

const ARROW = `<svg class="bd-footer__arrow" viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true" focusable="false"><path d="M3 10h13m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const JOURNEY = `<svg class="bd-footer__journey" viewBox="0 0 340 240" fill="none" aria-hidden="true" focusable="false">
  <g class="bd-footer__orbits" stroke="#B9DCD0" stroke-width=".65">
    <ellipse cx="176" cy="120" rx="136" ry="72" transform="rotate(-24 176 120)" opacity=".17"/>
    <ellipse cx="176" cy="120" rx="97" ry="100" transform="rotate(28 176 120)" opacity=".10"/>
    <path d="M34 193 282 49M98 38l148 167" stroke-dasharray="2 7" opacity=".14"/>
  </g>
  <path d="M36 180c44 1 42-66 90-63 33 2 54 47 83 29 24-14-15-46 6-63 16-13 37-6 64-28" stroke="#B9DCD0" stroke-opacity=".14" stroke-width="1"/>
  <path class="bd-footer__journey-path" pathLength="1" d="M36 180c44 1 42-66 90-63 33 2 54 47 83 29 24-14-15-46 6-63 16-13 37-6 64-28" stroke="#B9DCD0" stroke-opacity=".7" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="36" cy="180" r="9" stroke="#DDF1E9" stroke-opacity=".26"/>
  <circle cx="36" cy="180" r="3" fill="#DDF1E9"/>
  <circle cx="126" cy="117" r="3" fill="#073A32" stroke="#DDF1E9" stroke-opacity=".8"/>
  <circle cx="209" cy="146" r="2" fill="#B9DCD0"/>
  <g class="bd-footer__destination-halo">
    <circle cx="279" cy="55" r="27" fill="#FF6835" fill-opacity=".04"/>
    <circle cx="279" cy="55" r="17" fill="#FF6835" fill-opacity=".09"/>
  </g>
  <circle cx="279" cy="55" r="10" stroke="#FF6835" stroke-opacity=".45" stroke-width=".75"/>
  <path d="m279 46 2.3 6.7L288 55l-6.7 2.3L279 64l-2.3-6.7L270 55l6.7-2.3Z" fill="#FF6835"/>
  <circle cx="98" cy="38" r="1.5" fill="#DDF1E9" opacity=".4"/>
  <circle cx="246" cy="205" r="1.5" fill="#DDF1E9" opacity=".4"/>
  <g fill="#B9DCD0" font-family="Outfit, sans-serif" font-size="8" letter-spacing="2.2" opacity=".85">
    <text x="21" y="211">DISCOVER</text><text x="143" y="177">BUILD</text><text x="232" y="23">VENTURE</text>
  </g>
</svg>`;

const BACKDROP = `<svg class="bd-footer__constellation" viewBox="0 0 1440 860" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true" focusable="false">
  <g stroke="currentColor" stroke-width=".75">
    <ellipse cx="1320" cy="620" rx="490" ry="280" transform="rotate(-34 1320 620)"/>
    <ellipse cx="1320" cy="620" rx="410" ry="230" transform="rotate(-34 1320 620)"/>
    <path d="M800 860c160-260 340-60 420-330s60-320 220-420"/>
    <path d="m880 730 180-60 160-140 140 10" stroke-dasharray="2 9"/>
  </g>
  <g fill="currentColor"><circle cx="880" cy="730" r="3"/><circle cx="1060" cy="670" r="3"/><circle cx="1220" cy="530" r="4"/></g>
</svg>`;

function navigationGroup({ title, links }) {
  return `<div class="bd-footer__group">
    <h3 class="bd-footer__label">${title}</h3>
    <ul role="list">${links.map(([label, href]) => `<li><a class="bd-footer__link" href="${href}"><span>${label}</span>${ARROW}</a></li>`).join('')}</ul>
  </div>`;
}

function connectGroup() {
  const list = document.createElement('ul');
  list.setAttribute('role', 'list');

  SOCIAL_LINKS.forEach(({ label, url }) => {
    const item = document.createElement('li');
    // Fail closed for missing or invalid social destinations.
    let verified = false;
    try { verified = new URL(url).protocol === 'https:'; } catch { /* Unconfigured. */ }
    const element = document.createElement(verified ? 'a' : 'span');
    element.className = verified ? 'bd-footer__link' : 'bd-footer__unlinked';
    const text = document.createElement('span');
    text.textContent = label;
    element.append(text);
    if (verified) {
      element.href = url;
      element.target = '_blank';
      element.rel = 'noopener noreferrer';
      element.setAttribute('aria-label', `Building Dreams on ${label} (opens in a new tab)`);
      element.insertAdjacentHTML('beforeend', ARROW);
    } else {
      const note = document.createElement('span');
      note.className = 'bd-footer__sr-only';
      note.textContent = ' (profile link unavailable)';
      element.append(note);
    }
    item.append(element);
    list.append(item);
  });
  return list;
}

// Content remains visible when observers or animation are unavailable.
function enhanceMotion(footer) {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;

  const pending = new Set(footer.querySelectorAll('.bd-footer__journey, .bd-footer__signature'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      target.classList.add('is-in-view');
      observer.unobserve(target);
      pending.delete(target);
    });
    if (!pending.size) {
      observer.disconnect();
      preference.removeEventListener('change', stop);
    }
  }, { threshold: 0.2 });
  const stop = () => {
    if (!preference.matches) return;
    observer.disconnect();
    preference.removeEventListener('change', stop);
  };
  preference.addEventListener('change', stop);
  pending.forEach((target) => observer.observe(target));
}

function focusDestination(target) {
  if (!target.hasAttribute('tabindex')) {
    target.setAttribute('tabindex', '-1');
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  }
  target.focus({ preventScroll: true });
}

/** Mount one global footer. Safe to call again from a shared/nested layout. */
export function mountFooter() {
  const existing = document.querySelector('footer.bd-footer');
  if (existing) return existing;

  const footer = document.createElement('footer');
  footer.id = 'site-footer';
  footer.className = 'bd-footer';
  footer.setAttribute('aria-label', 'Building Dreams');
  footer.innerHTML = `
    ${BACKDROP}
    <div class="bd-footer__inner">
      <div class="bd-footer__masthead">
        <a class="bd-footer__brand" href="${HOME}" aria-label="Building Dreams home">
          <svg viewBox="0 0 28 28" width="28" height="28" fill="none" aria-hidden="true" focusable="false"><path d="M4 22C4 12 15 23 15 12S24 9 24 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="4" cy="22" r="2.5" fill="currentColor"/><path d="m24 0 1 2 2 1-2 1-1 2-1-2-2-1 2-1Z" fill="currentColor"/></svg>
          <span>Building Dreams<span class="bd-footer__brand-dot">.</span></span>
        </a>
        <span class="bd-footer__eyebrow">A world of possibility.</span>
      </div>

      <div class="bd-footer__opening">
        <h2 class="bd-footer__statement">
          <span class="bd-footer__sentence"><span class="bd-footer__phrase">Turning <em>curiosity</em></span> <span class="bd-footer__phrase">into capability.</span></span>
          <span class="bd-footer__sentence"><span class="bd-footer__phrase">Turning ideas</span> <span class="bd-footer__phrase">into <em>ventures.</em></span></span>
        </h2>
        ${JOURNEY}
      </div>

      <nav class="bd-footer__navigation" aria-label="Footer navigation">
        ${NAVIGATION.map(navigationGroup).join('')}
        <div class="bd-footer__group bd-footer__connect"><h3 class="bd-footer__label">Connect</h3></div>
      </nav>

      <div class="bd-footer__closing">
        <p class="bd-footer__signature"><span class="bd-footer__signature-lead"><span>Dream.</span> <span>Build.</span></span> <em>Launch.</em></p>
      </div>

      <div class="bd-footer__colophon">
        <small>&copy; ${new Date().getFullYear()} Building Dreams</small>
        <div class="bd-footer__utility">
          <a href="${url('privacy-policy/')}">Privacy Policy</a>
          <a href="${url('terms/')}">Terms of Use</a>
          <a href="${url('faq/')}">FAQs</a>
          <a class="bd-footer__back" href="#top">Back to top <span aria-hidden="true">&uarr;</span></a>
        </div>
      </div>
    </div>`;
  footer.querySelector('.bd-footer__connect').append(connectGroup());

  // Native anchors retain history, keyboard behavior and modified clicks.
  // Make existing section targets focusable for keyboard navigation as well.
  footer.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.classList.contains('bd-footer__back')) {
      event.preventDefault();
      // Always scroll this page, including when mounted on a nested route.
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      focusDestination(document.getElementById('top') || document.body);
      window.scrollTo({ top: 0, left: 0, behavior: reduce ? 'instant' : 'smooth' });
      return;
    }

    const destination = new URL(link.getAttribute('href'), location.href);
    if (destination.origin !== location.origin || destination.pathname !== location.pathname || !destination.hash) return;
    const target = document.getElementById(destination.hash.slice(1));
    if (target) {
      focusDestination(target);
    }
  });

  const host = document.querySelector('[data-site-footer]');
  if (host) host.append(footer);
  else document.body.append(footer);
  enhanceMotion(footer);
  return footer;
}
