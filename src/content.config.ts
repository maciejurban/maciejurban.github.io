import { glob } from 'astro/loaders';
import { defineCollection, reference } from 'astro:content';
import { z } from 'zod';

/**
 * Closed vocabulary. Five throughlines plus one cross-cutting theme.
 * Adding to this list is a deliberate editorial decision, not a shortcut —
 * a Zod enum means an invented theme fails the build instead of quietly
 * creating a one-item category.
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

const themeSchema = z.enum(THEMES);

const statusSchema = z.enum(['draft', 'published']);

/**
 * The slug is the filename, deliberately not a frontmatter field. Two sources
 * of truth for a URL is a drift bug waiting to happen, and Keystatic derives
 * its slug from the filename too, so the two stay in agreement for free.
 */
const cases = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    /** One sentence, the hook. Leads with the problem, never the product. */
    tension: z.string(),
    kind: z.enum(['full', 'mini']),
    /** Manual sort in the case index. */
    order: z.number().int(),
    role: z.string(),
    /** e.g. '2025–2026' */
    period: z.string(),
    context: z.string(),
    themes: z.array(themeSchema).min(1),
    relatedEssays: z.array(reference('essays')).default([]),
    status: statusSchema,
    /** 2–3 sentences, used for cards and the meta description. */
    summary: z.string(),
    updated: z.coerce.date(),
  }),
});

const essays = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/essays' }),
  schema: z.object({
    title: z.string(),
    /** One-line subtitle — the argument in a sentence. */
    dek: z.string(),
    published: z.coerce.date(),
    themes: z.array(themeSchema).min(1),
    relatedCases: z.array(reference('cases')).default([]),
    status: statusSchema,
    /** Minutes. Computed from the body at build time when absent. */
    readingTime: z.number().int().positive().optional(),
  }),
});

/** Singleton pages: about.mdx, now.mdx. */
const site = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/site' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    status: statusSchema.default('published'),
  }),
});

export const collections = { cases, essays, site };
