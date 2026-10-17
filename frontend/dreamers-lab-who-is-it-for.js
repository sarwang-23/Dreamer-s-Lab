/**
 * Dreamers Lab — Who Is It For: Student Archetypes Interactive Controller
 * Handles audience card click details, accessible modal drawer, and keyboard controls.
 */

export const AUDIENCE_DATA = {
  '01': {
    id: '01',
    badge: '01 · EXPLORER',
    title: 'Curious About Innovation',
    quote: 'How do real startups turn a napkin sketch into a real product?',
    description: 'For students fascinated by business, tech, and creative ideas who want to see behind the curtain of modern entrepreneurship.',
    supportSummary: 'Dreamers Lab demystifies venture building from the ground up. Students learn through guided frameworks, mentor debriefs, and real-world case breakdowns rather than dry theoretical lectures.',
    cohortExperience: 'In Weeks 1–4, explorers learn how to observe their daily environment, identify overlooked problems, and map opportunities without needing a technical background.',
    keyTakeaway: 'Build foundational creative confidence and develop an entrepreneurial lens for understanding how the modern world works.'
  },
  '02': {
    id: '02',
    badge: '02 · SOLVER',
    title: 'Creative Problem Solvers',
    quote: 'I get frustrated seeing broken systems and want to fix them.',
    description: 'For critical thinkers who enjoy deconstructing complex puzzles, interviewing real people, and designing smarter alternatives.',
    supportSummary: 'We channel natural problem-solving instincts into disciplined design-thinking methods: root-cause isolation, user journey mapping, and hypothesis validation.',
    cohortExperience: 'In Weeks 3–6, problem solvers conduct structured user interviews, separate symptoms from causes, and brainstorm divergent solutions.',
    keyTakeaway: 'Master practical user research and structured analytical frameworks that apply across any academic discipline or career.'
  },
  '03': {
    id: '03',
    badge: '03 · MAKER',
    title: 'Idea-Rich Builders',
    quote: 'I have notebooks full of ideas, but don’t know how to start.',
    description: 'For students bursting with imagination who need structure, practical frameworks, and feedback to build their first functional prototype.',
    supportSummary: 'Dreamers Lab provides the studio momentum and milestone constraints to move ideas off the page and into reality with low-cost materials and no-code tools.',
    cohortExperience: 'In Weeks 7–9, builders create version 1.0 physical mockups or digital demos, run user tests, and refine based on mentor critique.',
    keyTakeaway: 'Experience the tangible satisfaction of shipping a real working prototype that people can see, touch, and test.'
  },
  '04': {
    id: '04',
    badge: '04 · LEADER',
    title: 'Future Leaders & Orators',
    quote: 'I want the poise to articulate ideas, rally teammates, and pitch with impact.',
    description: 'For students looking to build confidence, persuasive communication, high-impact storytelling, and team leadership skills.',
    supportSummary: 'Students receive direct speech and pitch coaching, learn how to structure compelling narrative arcs, and lead collaborative team sprints.',
    cohortExperience: 'In Weeks 10–12, leaders assemble high-impact pitch decks, rehearse concise verbal delivery, and present live on Demo Day to mentors and guests.',
    keyTakeaway: 'Develop lifelong stage presence, persuasive communication, and team facilitation skills.'
  },
  '05': {
    id: '05',
    badge: '05 · PATHFINDER',
    title: 'Future Pathway Explorers',
    quote: 'I want to test-drive entrepreneurship before committing to my college major.',
    description: 'For ambitious students seeking real-world proof of capability before choosing university courses, career trajectories, or college application portfolios.',
    supportSummary: 'Dreamers Lab yields a tangible, verified portfolio artifact. Students finish with a live demonstration, pitch deck, and documented reflection.',
    cohortExperience: 'Across the full 12 weeks, pathway explorers test different roles (research, prototyping, finance, narrative) to discover where their intrinsic strengths lie.',
    keyTakeaway: 'Graduate with a distinctive venture showcase piece that stands out on college and internship applications.'
  }
};

export function initWhoIsItFor() {
  const modalBackdrop = document.querySelector('.dl-who-modal-backdrop');
  if (!modalBackdrop) return;

  // Ensure modal backdrop is attached directly to <body> so overflow:hidden on parent sections never clips it
  if (modalBackdrop.parentElement && modalBackdrop.parentElement !== document.body) {
    document.body.appendChild(modalBackdrop);
  }

  const modalCloseBtn = modalBackdrop.querySelector('.dl-who-modal-close');
  const modalBadge = modalBackdrop.querySelector('.dl-who-modal-badge');
  const modalTitle = modalBackdrop.querySelector('.dl-who-modal-title');
  const modalQuote = modalBackdrop.querySelector('.dl-who-modal-quote');
  const modalSupportText = modalBackdrop.querySelector('.dl-who-modal-support');
  const modalExperienceText = modalBackdrop.querySelector('.dl-who-modal-experience');
  const modalTakeawayText = modalBackdrop.querySelector('.dl-who-modal-takeaway');

  let activeTriggerElement = null;

  function openProfileModal(profileId, triggerEl = null) {
    const data = AUDIENCE_DATA[profileId];
    if (!data || !modalBackdrop) return;

    activeTriggerElement = triggerEl;

    if (modalBadge) modalBadge.textContent = data.badge;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalQuote) modalQuote.textContent = `“${data.quote}”`;
    if (modalSupportText) modalSupportText.textContent = data.supportSummary;
    if (modalExperienceText) modalExperienceText.textContent = data.cohortExperience;
    if (modalTakeawayText) modalTakeawayText.textContent = data.keyTakeaway;

    modalBackdrop.classList.add('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      modalCloseBtn?.focus();
    }, 50);
  }

  function closeProfileModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (activeTriggerElement && typeof activeTriggerElement.focus === 'function') {
      activeTriggerElement.focus();
    }
  }

  // Bind accessibility attributes and keyboard events to cards
  const cards = document.querySelectorAll('.dl-who-card');
  cards.forEach(card => {
    const profileId = card.getAttribute('data-profile');
    if (!profileId) return;

    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-haspopup', 'dialog');
    card.setAttribute('aria-label', `Explore ${AUDIENCE_DATA[profileId]?.title || 'profile'} details`);

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProfileModal(profileId, card);
      }
    });
  });

  // Global document delegation for click events (guarantees click works anywhere on card or Explore button)
  document.addEventListener('click', (e) => {
    // 1. Close button or dismiss button
    if (e.target.closest('.dl-who-modal-close') || e.target.closest('.dl-who-modal-dismiss-btn')) {
      e.preventDefault();
      closeProfileModal();
      return;
    }

    // 2. Backdrop click (outside modal window)
    if (e.target === modalBackdrop) {
      closeProfileModal();
      return;
    }

    // 3. Card or Explore button click
    const card = e.target.closest('.dl-who-card');
    if (card) {
      const profileId = card.getAttribute('data-profile');
      if (profileId) {
        e.preventDefault();
        openProfileModal(profileId, card);
      }
    }
  });

  // Keyboard escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('is-open')) {
      closeProfileModal();
    }
  });

  // Expose helpers globally
  window.openProfileModal = openProfileModal;
  window.closeProfileModal = closeProfileModal;
}

// Auto initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWhoIsItFor);
} else {
  initWhoIsItFor();
}
