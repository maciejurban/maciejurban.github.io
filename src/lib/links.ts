/**
 * Every internal link in this site must be built here.
 *
 * Right now the site is a GitHub *user* site (maciejurban.github.io), served
 * from the domain root, so `BASE_URL` is `/` and `href()` is close to a no-op.
 * That is exactly why the indirection exists: the day this moves to a project
 * repo (or gains a base path for any other reason), hand-written
 * `href="/work"` strings break silently — every page 404s under the base and
 * nothing in the build complains. Going through `href()` makes that a
 * one-line config change instead of a site-wide search.
 *
 * Rule: no `href` attribute in a `.astro` file may start with a literal `/`.
 */

const BASE_URL: string = import.meta.env.BASE_URL;
const SITE_ORIGIN: string = import.meta.env.SITE ?? 'https://maciejurban.github.io';

const isExternal = (path: string): boolean =>
  /^[a-z][a-z0-9+.-]*:/i.test(path) || path.startsWith('//') || path.startsWith('#');

/** Prefix an internal path with the configured base. Passes external URLs through. */
export const href = (path: string): string => {
  if (isExternal(path)) return path;

  const base = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  const suffix = path.startsWith('/') ? path : `/${path}`;

  return `${base}${suffix}`;
};

/** Fully-qualified URL, for canonical tags, RSS items and OG metadata. */
export const absoluteUrl = (path: string): string =>
  isExternal(path) ? path : new URL(href(path), SITE_ORIGIN).toString();

export const caseHref = (slug: string): string => href(`/work/${slug}`);

export const essayHref = (slug: string): string => href(`/writing/${slug}`);

export const ROUTES = {
  home: () => href('/'),
  work: () => href('/work'),
  writing: () => href('/writing'),
  about: () => href('/about'),
  rss: () => href('/rss.xml'),
} as const;
