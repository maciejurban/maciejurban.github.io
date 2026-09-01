import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type CaseEntry = CollectionEntry<'cases'>;
export type EssayEntry = CollectionEntry<'essays'>;
export type SiteEntry = CollectionEntry<'site'>;

/**
 * Draft handling lives here and nowhere else.
 *
 * Drafts are visible while writing (`astro dev`) and absent from the built
 * site. Doing this per-page guarantees that one page eventually forgets, so
 * every read of a collection in this project goes through the helpers below.
 */
const isVisible = (entry: { data: { status: 'draft' | 'published' } }): boolean =>
  import.meta.env.DEV || entry.data.status === 'published';

const byCaseOrder = (first: CaseEntry, second: CaseEntry): number =>
  first.data.order - second.data.order;

const byNewestFirst = (first: EssayEntry, second: EssayEntry): number =>
  second.data.published.valueOf() - first.data.published.valueOf();

export const getCases = async (): Promise<CaseEntry[]> => {
  const cases = await getCollection('cases', isVisible);

  return cases.sort(byCaseOrder);
};

export const getFullCases = async (): Promise<CaseEntry[]> => {
  const cases = await getCases();

  return cases.filter((caseEntry) => caseEntry.data.kind === 'full');
};

export const getMiniCases = async (): Promise<CaseEntry[]> => {
  const cases = await getCases();

  return cases.filter((caseEntry) => caseEntry.data.kind === 'mini');
};

/** The home page hero links to one case: the first full case by manual order. */
export const getFeaturedCase = async (): Promise<CaseEntry | undefined> => {
  const fullCases = await getFullCases();

  return fullCases[0];
};

export const getEssays = async (): Promise<EssayEntry[]> => {
  const essays = await getCollection('essays', isVisible);

  return essays.sort(byNewestFirst);
};

export const getSitePage = async (id: string): Promise<SiteEntry | undefined> => {
  const page = await getEntry('site', id);

  return page && isVisible(page) ? page : undefined;
};

/**
 * Resolve a list of collection references, dropping anything that is a draft.
 * A published case must never link out to a page that does not exist in the
 * built site.
 */
const resolveVisible = async <T extends CaseEntry | EssayEntry>(
  references: { collection: T['collection']; id: string }[],
): Promise<T[]> => {
  const entries = await Promise.all(
    references.map((relatedReference) => getEntry(relatedReference as never)),
  );

  return entries.filter(
    (entry): entry is T => Boolean(entry) && isVisible(entry as T),
  );
};

export const getRelatedEssays = async (caseEntry: CaseEntry): Promise<EssayEntry[]> =>
  resolveVisible<EssayEntry>(caseEntry.data.relatedEssays);

export const getRelatedCases = async (essayEntry: EssayEntry): Promise<CaseEntry[]> =>
  resolveVisible<CaseEntry>(essayEntry.data.relatedCases);

const WORDS_PER_MINUTE = 220;

/**
 * Reading time is a frontmatter override first, a computed estimate second.
 * Counts the raw MDX body, which slightly over-counts because of component
 * tags — acceptable for a one-decimal-place signal, and it never lies in the
 * other direction.
 */
export const getReadingTime = (essay: EssayEntry): number => {
  if (essay.data.readingTime) return essay.data.readingTime;

  const words = (essay.body ?? '').trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};

export type BeatRef = {
  n: number;
  title: string;
  /** Anchor id, matching the one Beat.astro renders. */
  id: string;
};

const BEAT_PATTERN = /<Beat\s+n=\{(\d+)\}\s+title="([^"]*)"/g;

/**
 * The beat rail is built by reading the beats out of the MDX body rather than
 * from a hardcoded list, so the navigation can never drift from the content.
 *
 * Beat 1 is prepended: it is the tension block in the page header, numbered on
 * the rail but not written in the body, so there is exactly one copy of the
 * hook. Mini cases have no `<Beat>` tags at all and get an empty rail.
 */
export const parseBeats = (caseEntry: CaseEntry): BeatRef[] => {
  const matches = [...(caseEntry.body ?? '').matchAll(BEAT_PATTERN)];

  if (matches.length === 0) return [];

  const bodyBeats = matches.map((match) => ({
    n: Number(match[1]),
    title: match[2],
    id: `beat-${match[1]}`,
  }));

  return [{ n: 1, title: 'Tension', id: 'beat-1' }, ...bodyBeats];
};
