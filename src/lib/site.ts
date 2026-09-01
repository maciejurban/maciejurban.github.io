import { profile } from './profile';

export const SITE = {
  title: profile.name,
  /** Fallback meta description for pages that do not supply their own. */
  description: profile.spine,
  lang: 'en',
  locale: 'en_GB',
} as const;

/**
 * Phase 1 ships placeholder copy at a public URL so that every route exists in
 * `dist` and can actually be clicked. It should not turn up in search results
 * while the bodies still say TK.
 *
 * Phase 3 flips this to `false` and deletes the disallow in
 * src/pages/robots.txt.ts. It is one flag on purpose.
 */
export const IS_PLACEHOLDER_CONTENT = true;

export const NAV_ITEMS = [
  { label: 'Work', path: '/work' },
  { label: 'Writing', path: '/writing' },
  { label: 'About', path: '/about' },
] as const;
