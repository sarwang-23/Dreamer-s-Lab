import './footer.css';

// Base-aware URLs so the shared footer resolves from the homepage and from
// every dedicated page, wherever the site is deployed.
const HOME = import.meta.env.BASE_URL;
const url = (path = '') => `${HOME}${path}`;

const NAVIGATION = [
  {
    title: 'Programs',
    links: [
      ['Program Pricing & Overview', url('pricing/')],
      ['Dreamers Lab', url('dreamers-lab/')],
      ['Student Entrepreneurs', url('student-entrepreneurs/')],
      ['University Programs', url('universities/')],
    ],
  },
  {
    title: 'Explore',
    links: [
      ['About Us', url('about/')],
      ['Mentors & Community', url('community/')],
      ['Insights & Resources', url('insights/')],
      ['For Parents', url('parents/')],
    ],
  },
  {
    title: 'Get Involved',
    links: [
      ['Apply to a Program', url('apply/')],
      ['Become a Mentor', `${url('community/')}#become-a-mentor`],
      ['Partner With Us', `${url('universities/')}#partnership`],
      ['Contact', url('get-started/')],
    ],
  },
  {
    title: 'Information',
    links: [
      ['FAQs', url('faq/')],
      ['Privacy Policy', url('privacy-policy/')],
      ['Terms of Use', url('terms/')],
    ],
  },
];

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/company/buildingdreams',
    icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z"/></svg>`,
  },
  {
    label: 'Instagram',
    url: 'https://www.instagram.com/buildingdreams',
    icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`,
  },
  {
    label: 'YouTube',
    url: 'https://www.youtube.com/@buildingdreams',
    icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  },
];

const ARROW = `<svg class="bd-footer__arrow" viewBox="0 0 20 20" width="14" height="14" fill="none" aria-hidden="true" focusable="false"><path d="M4 10h12m-4-4 4 4-4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// Centered, refined Venture Journey graphic
const JOURNEY = `<svg class="bd-footer__journey" viewBox="0 0 540 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="bd-journey-grad" x1="70" y1="85" x2="470" y2="38" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#DDF1E9" stop-opacity="0.3"/>
      <stop offset="45%" stop-color="#B9DCD0" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#FF6835"/>
    </linearGradient>
    <radialGradient id="bd-venture-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF6835" stop-opacity="0.28"/>
      <stop offset="60%" stop-color="#FF6835" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#FF6835" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Celestial background orbits -->
  <g class="bd-footer__orbits" stroke="#B9DCD0" stroke-width="0.75" pointer-events="none">
    <ellipse cx="270" cy="70" rx="240" ry="52" stroke-dasharray="4 8" opacity="0.10" transform="rotate(-2 270 70)"/>
    <ellipse cx="270" cy="70" rx="170" ry="42" stroke="#FF6835" stroke-dasharray="3 7" opacity="0.08" transform="rotate(3 270 70)"/>
    <path d="M40 115 L500 25" stroke="#B9DCD0" stroke-dasharray="2 9" opacity="0.08"/>
  </g>

  <!-- Flowing trajectory arcs -->
  <path d="M70 85 C 160 85, 190 55, 270 55 C 350 55, 380 38, 470 38" stroke="#B9DCD0" stroke-opacity="0.12" stroke-width="1.2"/>
  <path class="bd-footer__journey-path" pathLength="1" d="M70 85 C 160 85, 190 55, 270 55 C 350 55, 380 38, 470 38" stroke="url(#bd-journey-grad)" stroke-width="1.8" stroke-linecap="round"/>

  <!-- Milestone 1: DISCOVER -->
  <g class="bd-footer__node bd-footer__node--discover">
    <circle cx="70" cy="85" r="14" stroke="#DDF1E9" stroke-opacity="0.18" stroke-width="1"/>
    <circle cx="70" cy="85" r="4" fill="#DDF1E9"/>
    <text x="70" y="118" text-anchor="middle" fill="#B9DCD0" font-family="'Outfit', sans-serif" font-size="9" font-weight="600" letter-spacing="2.2" opacity="0.85">DISCOVER</text>
  </g>

  <!-- Milestone 2: BUILD -->
  <g class="bd-footer__node bd-footer__node--build">
    <circle cx="270" cy="55" r="14" stroke="#B9DCD0" stroke-opacity="0.22" stroke-width="1"/>
    <circle cx="270" cy="55" r="4.5" fill="#073A32" stroke="#B9DCD0" stroke-width="1.5"/>
    <text x="270" y="88" text-anchor="middle" fill="#B9DCD0" font-family="'Outfit', sans-serif" font-size="9" font-weight="600" letter-spacing="2.2" opacity="0.85">BUILD</text>
  </g>

  <!-- Milestone 3: VENTURE Destination -->
  <g class="bd-footer__node bd-footer__node--venture">
    <circle class="bd-footer__destination-halo" cx="470" cy="38" r="32" fill="url(#bd-venture-glow)"/>
    <circle cx="470" cy="38" r="12" stroke="#FF6835" stroke-opacity="0.5" stroke-width="1"/>
    <path class="bd-footer__destination-star" d="m470 27 2.4 7.6 7.6 2.4-7.6 2.4-2.4 7.6-2.4-7.6-7.6-2.4 7.6-2.4Z" fill="#FF6835"/>
    <text x="470" y="70" text-anchor="middle" fill="#FF9B6F" font-family="'Outfit', sans-serif" font-size="9" font-weight="700" letter-spacing="2.4">VENTURE</text>
  </g>
</svg>`;

const BACKDROP = `<svg class="bd-footer__constellation" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true" focusable="false">
  <g stroke="#B9DCD0" stroke-width="0.7">
    <ellipse cx="720" cy="180" rx="680" ry="240" opacity="0.035" stroke-dasharray="5 10"/>
    <ellipse cx="1200" cy="580" rx="420" ry="260" opacity="0.04" transform="rotate(-28 1200 580)"/>
    <ellipse cx="240" cy="620" rx="380" ry="220" opacity="0.035" transform="rotate(22 240 620)"/>
    <path d="M120 780 C 440 620, 1000 640, 1320 840" stroke-dasharray="3 8" opacity="0.04"/>
  </g>
  <g fill="#DDF1E9" opacity="0.25">
    <circle cx="180" cy="160" r="1.8"/>
    <circle cx="1260" cy="220" r="2.2"/>
    <circle cx="340" cy="740" r="1.5"/>
    <circle cx="1120" cy="680" r="2"/>
    <circle cx="720" cy="120" r="1.8"/>
  </g>
  <g fill="#FF6835" opacity="0.30">
    <circle cx="940" cy="190" r="2"/>
    <circle cx="480" cy="220" r="1.6"/>
    <circle cx="1320" cy="720" r="2"/>
  </g>
</svg>`;

function navigationGroup({ title, links }) {
  return `<div class="bd-footer__group">
    <h3 class="bd-footer__label">${title}</h3>
    <ul class="bd-footer__list" role="list">
      ${links
        .map(
          ([label, href]) => `
        <li class="bd-footer__item">
          <a class="bd-footer__link" href="${href}">
            <span class="bd-footer__link-text">${label}</span>
            ${ARROW}
          </a>
        </li>`
        )
        .join('')}
    </ul>
  </div>`;
}

function renderSocials() {
  return SOCIAL_LINKS.map(({ label, url: targetUrl, icon }) => {
    const isLinked = typeof targetUrl === 'string' && targetUrl.length > 0;
    if (isLinked) {
      return `
        <a class="bd-footer__social-btn" href="${targetUrl}" target="_blank" rel="noopener noreferrer" aria-label="Building Dreams on ${label} (opens in new tab)">
          <span class="bd-footer__social-icon" aria-hidden="true">${icon}</span>
          <span class="bd-footer__social-text">${label}</span>
          <span class="bd-footer__social-arrow" aria-hidden="true">&#8599;</span>
        </a>`;
    }
    return `
      <span class="bd-footer__social-btn bd-footer__social-btn--muted" aria-label="${label}">
        <span class="bd-footer__social-icon" aria-hidden="true">${icon}</span>
        <span class="bd-footer__social-text">${label}</span>
      </span>`;
  }).join('');
}

// Enhance motion gracefully while respecting accessibility
function enhanceMotion(footer) {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;

  const pending = new Set(
    footer.querySelectorAll(
      '.bd-footer__hero, .bd-footer__journey, .bd-footer__signature, .bd-footer__navigation'
    )
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.classList.add('is-in-view');
        observer.unobserve(target);
        pending.delete(target);
      });
      if (!pending.size) {
        observer.disconnect();
      }
    },
    { threshold: 0.15 }
  );

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
  footer.setAttribute('aria-label', 'Building Dreams Footer');
  footer.innerHTML = `
    ${BACKDROP}
    <div class="bd-footer__ambient-glow bd-footer__ambient-glow--top" aria-hidden="true"></div>
    <div class="bd-footer__ambient-glow bd-footer__ambient-glow--center" aria-hidden="true"></div>
    <div class="bd-footer__ambient-glow bd-footer__ambient-glow--bottom" aria-hidden="true"></div>

    <div class="bd-footer__inner">

      <!-- 1. CENTERED HERO AREA -->
      <div class="bd-footer__hero">
        
        <!-- Brand Header (Centered) -->
        <div class="bd-footer__brand-wrap">
          <a class="bd-footer__brand" href="${HOME}" aria-label="Building Dreams home">
            <span class="bd-footer__brand-wordmark">
              <span class="bd-footer__brand-building">Building</span><span class="bd-footer__brand-dreams"> Dreams</span><span class="bd-footer__brand-dot">.</span>
            </span>
            <span class="bd-footer__brand-subtitle">Converting Ideas into Successful Ventures</span>
          </a>


        </div>

        <!-- Centered Primary Headline with controlled breaks & orange accents -->
        <h2 class="bd-footer__statement">
          <span class="bd-footer__statement-line">
            Turning <em class="bd-footer__accent">curiosity</em> into capability.
          </span>
          <span class="bd-footer__statement-line">
            Turning ideas into <em class="bd-footer__accent">ventures.</em>
          </span>
        </h2>

        <!-- Centered Venture Journey Arc -->
        <div class="bd-footer__journey-container">
          ${JOURNEY}
        </div>

      </div>

      <!-- 2. FOUR CLEAN NAVIGATION COLUMNS -->
      <nav class="bd-footer__navigation" aria-label="Footer navigation">
        ${NAVIGATION.map(navigationGroup).join('')}
      </nav>

      <!-- 3. INTENTIONAL CONNECT BAR -->
      <div class="bd-footer__connect-bar">
        <div class="bd-footer__connect-label-group">
          <span class="bd-footer__connect-pulse" aria-hidden="true"></span>
          <span class="bd-footer__connect-title">Connect with Building Dreams</span>
        </div>
        <div class="bd-footer__connect-items" role="list">
          ${renderSocials()}
        </div>
      </div>

      <!-- 4. SIGNATURE EDITORIAL "DREAM. BUILD. LAUNCH." COMPOSITION -->
      <div class="bd-footer__signature-section" aria-label="Dream. Build. Launch.">
        <div class="bd-footer__signature-backdrop" aria-hidden="true">
          <svg class="bd-footer__signature-svg" viewBox="0 0 1200 160" preserveAspectRatio="none" fill="none">
            <path d="M0 130 Q 600 10 1200 130" stroke="rgba(185, 220, 208, 0.08)" stroke-width="1.5" stroke-dasharray="6 8"/>
            <ellipse cx="600" cy="80" rx="360" ry="50" stroke="rgba(255, 104, 53, 0.05)" stroke-width="1"/>
          </svg>
        </div>
        <div class="bd-footer__signature">
          <span class="bd-footer__sig-word bd-footer__sig-dream">Dream.</span>
          <span class="bd-footer__sig-divider" aria-hidden="true">&bull;</span>
          <span class="bd-footer__sig-word bd-footer__sig-build">Build.</span>
          <span class="bd-footer__sig-divider" aria-hidden="true">&bull;</span>
          <span class="bd-footer__sig-word bd-footer__sig-launch"><em>Launch.</em></span>
        </div>
      </div>

      <!-- 5. REFINED COLOPHON & UTILITY BAR -->
      <div class="bd-footer__colophon">
        <div class="bd-footer__colophon-left">
          <small class="bd-footer__copyright">&copy; ${new Date().getFullYear()} Building Dreams. All rights reserved.</small>
        </div>
        <div class="bd-footer__utility">
          <a class="bd-footer__utility-link" href="${url('privacy-policy/')}">Privacy Policy</a>
          <span class="bd-footer__utility-sep" aria-hidden="true">&bull;</span>
          <a class="bd-footer__utility-link" href="${url('terms/')}">Terms of Use</a>
          <span class="bd-footer__utility-sep" aria-hidden="true">&bull;</span>
          <a class="bd-footer__utility-link" href="${url('faq/')}">FAQs</a>
          <a class="bd-footer__back" href="#top" aria-label="Back to top of page">
            <span>Back to top</span>
            <span class="bd-footer__back-arrow" aria-hidden="true">&uarr;</span>
          </a>
        </div>
      </div>

    </div>`;

  // Native anchors retain history, keyboard behavior and accessible scrolling.
  footer.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (
      !link ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;

    if (link.classList.contains('bd-footer__back')) {
      event.preventDefault();
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      focusDestination(document.getElementById('top') || document.body);
      window.scrollTo({ top: 0, left: 0, behavior: reduce ? 'instant' : 'smooth' });
      return;
    }

    const hrefAttr = link.getAttribute('href');
    if (!hrefAttr || hrefAttr.startsWith('http') || hrefAttr.startsWith('mailto')) return;

    try {
      const destination = new URL(hrefAttr, location.href);
      if (
        destination.origin === location.origin &&
        destination.pathname === location.pathname &&
        destination.hash
      ) {
        const target = document.getElementById(destination.hash.slice(1));
        if (target) {
          focusDestination(target);
        }
      }
    } catch {
      /* Relative navigation fallback */
    }
  });

  const host = document.querySelector('[data-site-footer]');
  if (host) host.append(footer);
  else document.body.append(footer);

  enhanceMotion(footer);
  return footer;
}
