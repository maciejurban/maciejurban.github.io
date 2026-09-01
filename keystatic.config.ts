import { collection, config, fields } from '@keystatic/core';
import { block, wrapper } from '@keystatic/core/content-components';

import { THEMES } from './src/lib/themes';

/**
 * Keystatic runs in `local` storage mode and its routes are injected only when
 * the Astro dev server is running (see astro.config.mjs). GitHub Pages is
 * static-only and Keystatic's admin UI needs a server, so there is no /keystatic
 * in `dist`.
 *
 * Switching to a hosted admin later is a change to `storage` plus a separately
 * deployed admin app. Nothing in the content model below has to move: the
 * fields map one-to-one onto the Zod schemas in src/content.config.ts, and the
 * slug is the filename in both systems.
 */

const themeOptions = THEMES.map((theme) => ({
  label: theme.replaceAll('-', ' '),
  value: theme,
}));

const statusField = fields.select({
  label: 'Status',
  description: 'Drafts are visible in dev and excluded from the built site.',
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
  ],
  defaultValue: 'draft',
});

/** The four components available inside a case body. Deliberately only four. */
const caseComponents = {
  Beat: wrapper({
    label: 'Beat',
    description: 'One of the seven beats. Beat 1 is the tension in the header, so bodies start at 2.',
    schema: {
      n: fields.integer({
        label: 'Beat number',
        validation: { isRequired: true, min: 1, max: 7 },
      }),
      title: fields.text({ label: 'Beat title', validation: { isRequired: true } }),
      final: fields.checkbox({
        label: 'Closing beat',
        description: 'Breaks the spine and moves onto a sunk surface. Use only on beat 7.',
        defaultValue: false,
      }),
    },
  }),
  Artifact: block({
    label: 'Artifact',
    description: 'A labelled empty frame with a caption. Phase 2 replaces the frame with real media.',
    schema: {
      caption: fields.text({ label: 'Caption', validation: { isRequired: true } }),
      ratio: fields.select({
        label: 'Aspect ratio',
        options: [
          { label: '16 : 9', value: '16/9' },
          { label: '4 : 3', value: '4/3' },
          { label: '3 : 2', value: '3/2' },
          { label: '1 : 1', value: '1/1' },
        ],
        defaultValue: '16/9',
      }),
    },
  }),
  Aside: wrapper({
    label: 'Aside',
    description: 'Counter-arguments and honest caveats.',
    schema: {},
  }),
  Pullquote: wrapper({
    label: 'Pull quote',
    description: 'One sentence lifted out of the flow. Not a quote from someone else.',
    schema: {},
  }),
};

/** Essays get the two components that are not part of the beat structure. */
const essayComponents = {
  Aside: caseComponents.Aside,
  Pullquote: caseComponents.Pullquote,
};

export default config({
  storage: { kind: 'local' },

  ui: {
    brand: { name: 'Maciej Urban' },
    navigation: {
      Content: ['cases', 'essays'],
      Site: ['sitePages'],
    },
  },

  collections: {
    cases: collection({
      label: 'Cases',
      path: 'src/content/cases/*',
      slugField: 'title',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'kind', 'status'],
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            validation: { isRequired: true },
          },
          slug: {
            label: 'Slug',
            description: 'Kebab-case. This is the URL and the filename — changing it moves the file.',
          },
        }),
        tension: fields.text({
          label: 'Tension',
          description: 'One sentence, the hook. Lead with the problem, never the product.',
          multiline: true,
          validation: { isRequired: true },
        }),
        kind: fields.select({
          label: 'Kind',
          options: [
            { label: 'Full case', value: 'full' },
            { label: 'Mini case', value: 'mini' },
          ],
          defaultValue: 'full',
        }),
        order: fields.integer({
          label: 'Order',
          description: 'Manual sort in the case index. Also rendered as the case number.',
          validation: { isRequired: true, min: 1 },
        }),
        role: fields.text({ label: 'Role', validation: { isRequired: true } }),
        period: fields.text({ label: 'Period', validation: { isRequired: true } }),
        context: fields.text({
          label: 'Context',
          multiline: true,
          validation: { isRequired: true },
        }),
        themes: fields.multiselect({
          label: 'Themes',
          description: 'Closed vocabulary. Adding a theme means changing THEMES in src/content.config.ts.',
          options: themeOptions,
        }),
        relatedEssays: fields.array(
          fields.relationship({ label: 'Essay', collection: 'essays' }),
          {
            label: 'Related essays',
            itemLabel: (item) => item.value ?? 'Pick an essay',
          },
        ),
        status: statusField,
        summary: fields.text({
          label: 'Summary',
          description: 'Two or three sentences. Used on cards and as the meta description.',
          multiline: true,
          validation: { isRequired: true },
        }),
        updated: fields.date({ label: 'Updated', validation: { isRequired: true } }),
        content: fields.mdx({
          label: 'Body',
          components: caseComponents,
        }),
      },
    }),

    essays: collection({
      label: 'Essays',
      path: 'src/content/essays/*',
      slugField: 'title',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'published', 'status'],
      schema: {
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
          slug: {
            label: 'Slug',
            description: 'Kebab-case. This is the URL and the filename.',
          },
        }),
        dek: fields.text({
          label: 'Dek',
          description: 'The argument in one sentence.',
          multiline: true,
          validation: { isRequired: true },
        }),
        published: fields.date({ label: 'Published', validation: { isRequired: true } }),
        themes: fields.multiselect({ label: 'Themes', options: themeOptions }),
        relatedCases: fields.array(
          fields.relationship({ label: 'Case', collection: 'cases' }),
          {
            label: 'Related cases',
            itemLabel: (item) => item.value ?? 'Pick a case',
          },
        ),
        status: statusField,
        readingTime: fields.integer({
          label: 'Reading time (minutes)',
          description: 'Leave empty to compute it from the body at build time.',
        }),
        content: fields.mdx({
          label: 'Body',
          components: essayComponents,
        }),
      },
    }),

    /*
     * Modelled as a collection rather than singletons so that about.mdx stays
     * exactly where the content collection expects it. Keystatic singletons
     * write to `<path>/index.<ext>`, which would change the entry id and break
     * getSitePage('about').
     *
     * profile.json is intentionally not here: five values, edited roughly once,
     * and it is closer to configuration than content.
     */
    sitePages: collection({
      label: 'Site pages',
      path: 'src/content/site/*',
      slugField: 'title',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
          slug: {
            label: 'Slug',
            description: 'Must match a route. `about` is the only one wired up.',
          },
        }),
        description: fields.text({ label: 'Meta description', multiline: true }),
        status: statusField,
        content: fields.mdx({ label: 'Body', components: essayComponents }),
      },
    }),
  },
});
