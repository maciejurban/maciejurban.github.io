// @ts-check
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import { defineConfig } from 'astro/config';

/*
 * Keystatic's admin UI needs a server, and GitHub Pages does not have one.
 *
 * Both routes it injects (/keystatic and /api/keystatic) are `prerender: false`,
 * so registering the integration during `astro build` would force this project
 * to grow an adapter — the one thing the brief rules out. Registering it only
 * for `astro dev` keeps the production build `output: 'static'` with no adapter
 * and no /keystatic in `dist`, and costs nothing while writing.
 *
 * React is here for the same reason and only for the same reason: it is the
 * runtime Keystatic's editor is built in. No page in this site ships React.
 */
const isDevServer = process.argv[2] === 'dev';

// User site (maciejurban.github.io) → served from the domain root, so no `base`.
// If this ever moves to a project repo, set `base: '/<repo>'` here AND update
// the three font url()s in src/styles/fonts.css, which CSS cannot route through
// the href() helper.
export default defineConfig({
  site: 'https://maciejurban.github.io',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  integrations: [mdx(), ...(isDevServer ? [react(), keystatic()] : [])],
});
