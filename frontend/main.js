// Shared entry point: include this once in every website page/layout.
// Module imports also keep the existing interactions in Vite production builds.
import './script.js';
import './closing-cta.js';
import './pages.js';
import './dreamers-lab-who-is-it-for.js';
import './dreamers-lab-skills.js';
import { mountFooter } from './footer.js';
import { mountNav } from './nav.js';
import { initMobileNavigation } from './responsive.js';

mountNav();
mountFooter();
initMobileNavigation();
