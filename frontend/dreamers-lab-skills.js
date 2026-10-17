/**
 * Dreamers Lab — What Students Learn Interactive Controller
 * Handles asymmetric skill card interactions, modal drawer reveals,
 * keyboard accessibility, and dynamic skill exploration switching.
 */

export const SKILLS_DATA = {
  '01': {
    id: '01',
    title: 'Entrepreneurial Thinking',
    category: 'Core Foundation',
    timing: 'Weeks 1–2 · Foundation',
    quote: 'Understand opportunities. Turn raw curiosity into purposeful action.',
    description: 'How to spot opportunities and turn ideas into action.',
    journeyConnection: 'Introduced right in Weeks 1–2 (Discover), where students learn to perceive everyday school and community frustrations not as complaints, but as invitations for invention.',
    practiceExample: 'A student notices 40-minute wait times for lab equipment sign-outs, logs a 3-day observational audit, and designs a peer-scheduling reservation system.',
    habits: ['Opportunity Spotting', 'Bias Towards Action', 'Constructive Initiative', 'Creative Confidence']
  },
  '02': {
    id: '02',
    title: 'Problem-Solving',
    category: 'Analytical Framework',
    timing: 'Weeks 3–4 · Exploration',
    quote: 'Deconstruct complexity into clear, actionable steps.',
    description: 'How to break complex challenges into manageable steps.',
    journeyConnection: 'Central to Weeks 3–4 (Ideate), where students utilize root-cause issue trees to uncover the real underlying human bottleneck before rushing into premature solutions.',
    practiceExample: 'Deconstructing school bio-waste into canteen prep waste, dining leftovers, and sorting compliance, isolating the primary bottleneck to post-meal sorting trays.',
    habits: ['First-Principles Analysis', 'Root-Cause Mapping', 'Hypothesis Testing', 'Systematic Prioritization']
  },
  '03': {
    id: '03',
    title: 'Creativity and Innovation',
    category: 'Ideation & Design',
    timing: 'Weeks 3–6 · Ideate & Validate',
    quote: 'Move past the first obvious idea to find truly remarkable answers.',
    description: 'How to generate, compare and improve possible solutions.',
    journeyConnection: 'Practiced across Weeks 3–6 through structured divergent brainstorming sprints, challenging students to develop 10+ distinct alternatives before synthesizing the most viable concept.',
    practiceExample: 'Brainstorming 15 low-cost ways to incentivize library book returns, combining physical shelf drop-boxes with a weekly student-run recommendation board.',
    habits: ['Divergent Thinking', 'Analogical Inspiration', 'Iterative Sketching', 'Unconventional Combinations']
  },
  '04': {
    id: '04',
    title: 'Communication',
    category: 'Empathy & Voice',
    timing: 'Weeks 5–6 & 10–12 · Discovery & Pitch',
    quote: 'Listen deeply to users, synthesize insights, and present with conviction.',
    description: 'How to interview users, explain ideas and present with confidence.',
    journeyConnection: 'Applied during user validation interviews (Weeks 5–6) and honed during Demo Day pitch coaching (Weeks 10–12). Students shift from passive reporting to compelling storytelling.',
    practiceExample: 'Conducting non-leading user interviews with 14 community residents, asking open-ended questions about their morning commute routines without pitching the app idea.',
    habits: ['Empathetic User Interviewing', 'Narrative Storytelling', 'Concise Verbal Synthesis', 'Stage Presence']
  },
  '05': {
    id: '05',
    title: 'Collaboration',
    category: 'Team Synergy',
    timing: 'Weeks 1–12 · Continuous Studio',
    quote: 'Harness diverse viewpoints to build something bigger than yourself.',
    description: 'How to work in teams, share responsibility and manage differences.',
    journeyConnection: 'Embedded across all 12 cohort weeks. Teams negotiate role delegation (researcher, prototyper, narrator), resolve healthy design disagreements, and conduct weekly standup reviews.',
    practiceExample: 'Formulating a team working agreement, dividing physical fabrication and mentor critique synthesis, and facilitating a 5-minute daily pulse check.',
    habits: ['Shared Accountability', 'Constructive Disagreement', 'Role Specialization', 'Psychological Safety']
  },
  '06': {
    id: '06',
    title: 'Critical Thinking',
    category: 'Validation & Rigor',
    timing: 'Weeks 5–6 · Validation Sprint',
    quote: 'Test assumptions against reality without letting ego get in the way.',
    description: 'How to question assumptions and use feedback.',
    journeyConnection: 'Exercised rigorously during Weeks 5–6 (Validate). Students identify their riskiest assumptions, evaluate mentor critique dispassionately, and practice rapid course correction.',
    practiceExample: 'When mentor feedback revealed elderly garden volunteers found mobile apps confusing, the team pivoted to high-contrast laminated physical guides instead.',
    habits: ['Assumption Auditing', 'Objectivity in Feedback', 'Evidence-Based Pivots', 'Intellectual Humility']
  },
  '07': {
    id: '07',
    title: 'Financial Literacy',
    category: 'Venture Viability',
    timing: 'Weeks 8–10 · Economics & Modeling',
    quote: 'Understand real costs, pricing psychology, and value creation.',
    description: 'Basic costs, pricing, revenue and business models.',
    journeyConnection: 'Introduced in Weeks 8–10 to demystify business numbers. Students compute bill-of-materials, operational overheads, sustainable pricing, and break-even targets for their ventures.',
    practiceExample: 'Calculating a unit cost of $1.40 for recycled student sketchbooks, setting a $3.50 value price, and mapping out a break-even threshold of 45 sold units.',
    habits: ['Unit Economics Literacy', 'Value-Based Pricing', 'Breakeven Calculation', 'Resource Stewardship']
  },
  '08': {
    id: '08',
    title: 'Digital Confidence',
    category: 'Modern Prototyping',
    timing: 'Weeks 7–9 · Studio Build',
    quote: 'Harness accessible digital tools to turn imagination into interactive reality.',
    description: 'How to explore accessible tools for prototyping and presenting ideas.',
    journeyConnection: 'Developed during Weeks 7–9 (Build). Students use accessible no-code tools, wireframing software, and digital presentation suites to make ideas tactile without prohibitive tech barriers.',
    practiceExample: 'Using Figma and Notion to build a clickable interactive mobile prototype in under 4 hours, ready for user feedback testing.',
    habits: ['No-Code Prototyping', 'Rapid Digital Wireframing', 'Tech Self-Efficacy', 'Interactive Demo Creation']
  }
};

export function initDreamersLabSkills() {
  const modalBackdrop = document.querySelector('.dl-skill-modal-backdrop');
  if (!modalBackdrop) return;

  // Mount modal backdrop directly to <body> so overflow:hidden on parent sections never clips it
  if (modalBackdrop.parentElement && modalBackdrop.parentElement !== document.body) {
    document.body.appendChild(modalBackdrop);
  }

  const modalCloseBtn = modalBackdrop.querySelector('.dl-modal-close-btn');
  const modalNumber = modalBackdrop.querySelector('.dl-modal-badge');
  const modalCategory = modalBackdrop.querySelector('.dl-modal-category');
  const modalTitle = modalBackdrop.querySelector('.dl-modal-title');
  const modalQuote = modalBackdrop.querySelector('.dl-modal-quote');
  const modalConnectionText = modalBackdrop.querySelector('.dl-modal-connection-text');
  const modalExampleText = modalBackdrop.querySelector('.dl-modal-example-text');
  const modalHabitsContainer = modalBackdrop.querySelector('.dl-modal-habits-tray');

  let activeTriggerElement = null;

  // Open modal for a specific skill
  function openSkillModal(skillId, triggerEl = null) {
    const skill = SKILLS_DATA[skillId];
    if (!skill || !modalBackdrop) return;

    activeTriggerElement = triggerEl;

    if (modalNumber) modalNumber.textContent = skill.id;
    if (modalCategory) modalCategory.textContent = skill.category;
    if (modalTitle) modalTitle.textContent = skill.title;
    if (modalQuote) modalQuote.textContent = `“${skill.quote}”`;
    if (modalConnectionText) modalConnectionText.textContent = skill.journeyConnection;
    if (modalExampleText) modalExampleText.textContent = skill.practiceExample;

    if (modalHabitsContainer) {
      modalHabitsContainer.innerHTML = skill.habits
        .map(h => `<span class="dl-modal-habit-chip"><span class="chip-dot" aria-hidden="true"></span>${h}</span>`)
        .join('');
    }

    modalBackdrop.classList.add('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    setTimeout(() => {
      modalCloseBtn?.focus();
    }, 50);
  }

  // Close modal
  function closeSkillModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (activeTriggerElement && typeof activeTriggerElement.focus === 'function') {
      activeTriggerElement.focus();
    }
  }

  // Bind accessibility attributes and keyboard events to cards
  const skillCards = document.querySelectorAll('.dl-skill-card');
  skillCards.forEach(card => {
    const skillId = card.getAttribute('data-skill');
    if (!skillId) return;

    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-haspopup', 'dialog');
    card.setAttribute('aria-label', `Explore ${SKILLS_DATA[skillId]?.title || 'skill'} details`);

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openSkillModal(skillId, card);
      }
    });
  });

  // Global document delegation for click events (guarantees click works anywhere on card or Explore button)
  document.addEventListener('click', (e) => {
    // 1. Close button or dismiss button
    if (e.target.closest('.dl-modal-close-btn') || e.target.closest('.dl-modal-dismiss-btn')) {
      e.preventDefault();
      closeSkillModal();
      return;
    }

    // 2. Backdrop click (outside modal window)
    if (e.target === modalBackdrop) {
      closeSkillModal();
      return;
    }

    // 3. Skill card or Explore skill button / arrow
    const card = e.target.closest('.dl-skill-card');
    if (card) {
      const skillId = card.getAttribute('data-skill');
      if (skillId) {
        e.preventDefault();
        openSkillModal(skillId, card);
      }
    }
  });

  // Keyboard escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('is-open')) {
      closeSkillModal();
    }
  });

  // Expose helpers globally
  window.openSkillModal = openSkillModal;
  window.closeSkillModal = closeSkillModal;
}

// Auto-init on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDreamersLabSkills);
} else {
  initDreamersLabSkills();
}
