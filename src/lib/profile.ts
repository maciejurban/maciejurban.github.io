import { z } from 'zod';

import profileJson from '../content/site/profile.json';

/**
 * Validated at module load so a malformed profile.json fails the build rather
 * than rendering an empty footer.
 *
 * Phase 1: several values are still `TK`. `visibleLinks` drops any link whose
 * URL has not been filled in, so a placeholder never ships as a dead anchor.
 */
const profileSchema = z.object({
  name: z.string(),
  role: z.string(),
  spine: z.string(),
  identity: z.string(),
  email: z.string(),
  links: z.array(
    z.object({
      label: z.string(),
      url: z.string(),
    }),
  ),
});

export type Profile = z.infer<typeof profileSchema>;

export const profile: Profile = profileSchema.parse(profileJson);

const isPlaceholder = (value: string): boolean => value.trim().startsWith('TK');

export const visibleLinks = profile.links.filter((link) => !isPlaceholder(link.url));

export const hasRealEmail = !isPlaceholder(profile.email);
