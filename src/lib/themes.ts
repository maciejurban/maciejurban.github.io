/**
 * The site's theme vocabulary, in a module with no Astro imports.
 *
 * Both the content schema and the Keystatic config need this list, and
 * keystatic.config.ts is evaluated in the browser — importing it from
 * src/content.config.ts would drag `astro:content` and `astro/loaders` into a
 * client bundle, which is a 500 on /keystatic rather than a build error.
 *
 * Five throughlines plus one cross-cutting theme. Closed set: a Zod enum in
 * src/content.config.ts makes an invented theme fail the build instead of
 * quietly creating a one-item category.
 */
export const THEMES = [
  'history-as-truth',
  'ownership-and-teams',
  'flexibility-cost',
  'medium-that-ships',
  'ai-and-structure',
  'semantics-before-ui',
] as const;

export type Theme = (typeof THEMES)[number];
