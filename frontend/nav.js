import './pages.css';

// Base-aware destinations so the header works from the homepage and from every
// nested page, regardless of where the site is deployed.
const BASE = import.meta.env.BASE_URL;
const url = (path = '') => `${BASE}${path}`;

const TOGGLE_ICON = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true" focusable="false"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;

function navMarkup() {
  return `
    <div class="nd-logo">
      <a class="nd-logo-link nd-logo-link--new" href="${url('')}" aria-label="Building Dreams home">
        <span class="nd-logo-wordmark">
          <span class="nd-logo-building">Building</span><span class="nd-logo-dreams"> Dreams</span>
        </span>
        <span class="nd-logo-subtitle">Converting Ideas into Successful Ventures</span>
      </a>
    </div>
    <button class="nd-menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation primary-navigation-actions" hidden>
      <span>Menu</span>
      ${TOGGLE_ICON}
    </button>
    <div class="nd-nav-links" id="primary-navigation">
      <a href="${url('dreamers-lab/')}">Schools</a>
      <a href="${url('universities/')}">Universities</a>
      <a href="${url('student-entrepreneurs/')}">Entrepreneurship</a>
      <a href="${url('pricing/')}">Pricing</a>
      <details class="nd-nav-dd">
        <summary>Community<span class="nd-nav-caret" aria-hidden="true"></span></summary>
        <div class="nd-nav-dd-menu">
          <a href="${url('community/')}">Mentors &amp; Community<span class="nd-nav-dd-note">Network &amp; founder ecosystem</span></a>
          <a href="${url('insights/')}">Insights<span class="nd-nav-dd-note">Guides, frameworks &amp; resources</span></a>
          <a href="${url('testimonials/')}">Testimonials<span class="nd-nav-dd-note">On-ground student journeys &amp; videos</span></a>
        </div>
      </details>
      <a href="${url('about/')}">About</a>
      <a href="${url('contact/')}">Contact</a>
    </div>
    <div class="nd-nav-actions" id="primary-navigation-actions">
      <a href="${url('get-started/')}" class="nd-btn-primary nd-nav-cta">Get Started</a>
    </div>`;
}

// Collapse the dropdown menus after following a link or clicking elsewhere.
function wireNav(nav) {
  if (nav.dataset.navReady === 'true') return;
  nav.dataset.navReady = 'true';

  // Ensure only one dropdown stays open at a time
  nav.querySelectorAll('.nd-nav-dd').forEach((dd) => {
    dd.addEventListener('toggle', () => {
      if (dd.open) {
        nav.querySelectorAll('.nd-nav-dd').forEach((other) => {
          if (other !== dd && other.open) other.open = false;
        });
      }
    });
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      nav.querySelectorAll('.nd-nav-dd[open]').forEach((dd) => { dd.open = false; });
    }
  });
  document.addEventListener('click', (event) => {
    nav.querySelectorAll('.nd-nav-dd[open]').forEach((dd) => {
      if (!dd.contains(event.target)) dd.open = false;
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    nav.querySelectorAll('.nd-nav-dd[open]').forEach((dd) => { dd.open = false; });
  });
}

/** Mount the shared header. Uses an existing navbar when a page renders one. */
export function mountNav() {
  const existing = document.querySelector('.nd-navbar');
  if (existing) {
    wireNav(existing);
    return existing;
  }

  const nav = document.createElement('nav');
  nav.className = 'nd-navbar';
  nav.setAttribute('aria-label', 'Main navigation');
  nav.innerHTML = navMarkup();
  document.body.prepend(nav);
  wireNav(nav);

  return nav;
}
