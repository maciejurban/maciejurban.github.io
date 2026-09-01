// @ts-check
import { defineConfig } from 'astro/config';

// User site (maciejurban.github.io) → served from the domain root, so no `base`.
// If this ever moves to a project repo, set `base: '/<repo>'` here AND make sure
// every internal link goes through `href()` in src/lib/links.ts.
export default defineConfig({
  site: 'https://maciejurban.github.io',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
});
