import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const root = dirname(fileURLToPath(import.meta.url));

// Dedicated pages that ship alongside the homepage. Each is a directory with
// its own index.html so the published URLs stay clean (e.g. /about/).
const pages = [
  'about',
  'dreamers-lab',
  'student-entrepreneurs',
  'universities',
  'community',
  'insights',
  'parents',
  'get-started',
  'contact',
  'apply',
  'faq',
  'privacy-policy',
  'terms',
];

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        ...Object.fromEntries(pages.map((page) => [page, resolve(root, page, 'index.html')])),
      },
    },
  },
});
