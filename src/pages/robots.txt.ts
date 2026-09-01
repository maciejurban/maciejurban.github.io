import type { APIRoute } from 'astro';

import { absoluteUrl } from '../lib/links';
import { IS_PLACEHOLDER_CONTENT } from '../lib/site';

/**
 * Phase 1 keeps the whole site out of search while the copy is still `TK`.
 * Flip IS_PLACEHOLDER_CONTENT in src/lib/site.ts and this becomes a normal
 * allow-all robots.txt with a sitemap reference.
 */
export const GET: APIRoute = () => {
  const body = IS_PLACEHOLDER_CONTENT
    ? ['User-agent: *', 'Disallow: /', '']
    : ['User-agent: *', 'Allow: /', '', `Sitemap: ${absoluteUrl('/sitemap-index.xml')}`, ''];

  return new Response(body.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
