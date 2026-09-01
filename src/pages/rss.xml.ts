import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';

import { getEssays } from '../lib/content';
import { absoluteUrl } from '../lib/links';
import { SITE } from '../lib/site';

/**
 * Essays only. Cases are not periodical and a feed reader is the wrong place
 * for them.
 *
 * `getEssays()` applies the same draft filter as every other read, so a draft
 * cannot leak into the feed — including in `astro dev`, where the filter is
 * relaxed for pages but the feed is regenerated from the same source.
 */
export const GET: APIRoute = async (context) => {
  const essays = await getEssays();
  const published = essays.filter((essay) => essay.data.status === 'published');

  return rss({
    title: `${SITE.title} — essays`,
    description: SITE.description,
    site: context.site ?? absoluteUrl('/'),
    trailingSlash: false,
    items: published.map((essay) => ({
      title: essay.data.title,
      description: essay.data.dek,
      pubDate: essay.data.published,
      link: absoluteUrl(`/writing/${essay.id}`),
      categories: [...essay.data.themes],
    })),
    customData: `<language>${SITE.lang}</language>`,
  });
};
