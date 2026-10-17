/**
 * Dreamers Lab — What Students Create Interactive Controller
 * Controls project milestones navigation (Discover → Validate → Build → Present),
 * dynamic deliverable reveals, and keyboard accessibility.
 */

export const MILESTONES_DATA = {
  '01': {
    id: '01',
    label: 'Discover',
    timing: 'Weeks 1–2 · Foundation',
    title: 'Problem Discovery & Audience',
    description: 'Students audit friction in their school and community, conduct observational audits, and define precisely who experiences the bottleneck.',
    deliverableLabel: 'Tangible Student Deliverable',
    deliverableTitle: 'Problem Dossier & User Persona Map',
    deliverableDesc: 'A structured 1-page issue-tree brief isolating the root challenge and identifying target user profiles.'
  },
  '02': {
    id: '02',
    label: 'Validate',
    timing: 'Weeks 3–6 · Ideate & Validate',
    title: 'Field Research & Solution Framing',
    description: 'Teams conduct open-ended interviews with potential users, test risky assumptions dispassionately, and synthesize the strongest concept.',
    deliverableLabel: 'Tangible Student Deliverable',
    deliverableTitle: 'User Insights Deck & Solution Blueprint',
    deliverableDesc: 'Qualitative user feedback findings, divergent concept sketches, and evidence-based iteration logs.'
  },
  '03': {
    id: '03',
    label: 'Build',
    timing: 'Weeks 7–9 · Prototyping Studio',
    title: 'Prototyping & Economic Modeling',
    description: 'Imagination turns into reality using no-code digital builders and physical mockups, paired with fundamental cost and pricing literacy.',
    deliverableLabel: 'Tangible Student Deliverable',
    deliverableTitle: 'Working Prototype & Unit Economics Sheet',
    deliverableDesc: 'A testable interactive demo alongside a transparent breakdown of unit costs, margins, and break-even targets.'
  },
  '04': {
    id: '04',
    label: 'Present',
    timing: 'Weeks 10–12 · Pitch & Reflection',
    title: 'Demo Day Pitch & Self-Discovery',
    description: 'Students synthesize 12 weeks of learning into a compelling 3-minute pitch, present to mentors, and reflect on personal strengths and next steps.',
    deliverableLabel: 'Tangible Student Deliverable',
    deliverableTitle: 'Showcase Pitch Deck & Founder Portfolio',
    deliverableDesc: 'A mentor-critiqued presentation slide deck, recorded demo recording, and personalized skill reflection blueprint.'
  }
};

export function initDreamersLabOutcomes() {
  const section = document.querySelector('.dl-outcomes-section');
  if (!section) return;

  const tabs = section.querySelectorAll('.dl-milestone-tab');
  const panel = section.querySelector('.dl-milestone-panel');
  const stepIndicator = section.querySelector('.dl-milestone-step-indicator');
  const panelTiming = section.querySelector('.dl-panel-timing');
  const panelTitle = section.querySelector('.dl-panel-title');
  const panelDesc = section.querySelector('.dl-panel-desc');
  const deliverableTitle = section.querySelector('.dl-deliverable-title');
  const deliverableDesc = section.querySelector('.dl-deliverable-desc');
  const flowDots = section.querySelectorAll('.dl-journey-flow-dot');

  function selectMilestone(milestoneId) {
    const data = MILESTONES_DATA[milestoneId];
    if (!data) return;

    // Update active tab
    tabs.forEach(tab => {
      const isTarget = tab.getAttribute('data-milestone') === milestoneId;
      tab.classList.toggle('is-active', isTarget);
      tab.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    // Update progress dots
    const milestoneIndex = parseInt(milestoneId, 10) - 1;
    flowDots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx <= milestoneIndex);
    });

    // Animate panel update
    if (panel) {
      panel.style.animation = 'none';
      void panel.offsetWidth; // Reflow
      panel.style.animation = 'dlMilestoneFade 0.28s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    if (stepIndicator) stepIndicator.textContent = `Stage ${data.id} of 04`;
    if (panelTiming) panelTiming.textContent = data.timing;
    if (panelTitle) panelTitle.textContent = data.title;
    if (panelDesc) panelDesc.textContent = data.description;
    if (deliverableTitle) deliverableTitle.textContent = data.deliverableTitle;
    if (deliverableDesc) deliverableDesc.textContent = data.deliverableDesc;
  }

  // Bind tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const milestoneId = tab.getAttribute('data-milestone');
      selectMilestone(milestoneId);
    });

    tab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const milestoneId = tab.getAttribute('data-milestone');
        selectMilestone(milestoneId);
      }
    });
  });
}

// Auto init on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDreamersLabOutcomes);
} else {
  initDreamersLabOutcomes();
}
