/**
 * Copies the woff2 files we actually use out of the @fontsource-variable
 * packages and into public/fonts/, where they are committed.
 *
 * The fonts are vendored rather than imported so that the built site never
 * makes an external font request and CI never depends on a font host being up.
 * Run this after bumping either @fontsource package; the copies are checked in,
 * so it is not part of the build.
 *
 *   node scripts/sync-fonts.mjs
 */
import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const target = join(root, 'public', 'fonts');

const FILES = [
  ['@fontsource-variable/newsreader', 'newsreader-latin-standard-normal.woff2'],
  ['@fontsource-variable/newsreader', 'newsreader-latin-standard-italic.woff2'],
  ['@fontsource-variable/newsreader', 'newsreader-latin-ext-standard-normal.woff2'],
  ['@fontsource-variable/newsreader', 'newsreader-latin-ext-standard-italic.woff2'],
  [
    '@fontsource-variable/atkinson-hyperlegible-next',
    'atkinson-hyperlegible-next-latin-wght-normal.woff2',
  ],
  [
    '@fontsource-variable/atkinson-hyperlegible-next',
    'atkinson-hyperlegible-next-latin-ext-wght-normal.woff2',
  ],
];

const LICENSES = [
  ['@fontsource-variable/newsreader', 'LICENSE-Newsreader.txt'],
  ['@fontsource-variable/atkinson-hyperlegible-next', 'LICENSE-AtkinsonHyperlegibleNext.txt'],
];

await mkdir(target, { recursive: true });

await Promise.all(
  FILES.map(([pkg, file]) =>
    copyFile(join(root, 'node_modules', pkg, 'files', file), join(target, file)),
  ),
);

await Promise.all(
  LICENSES.map(([pkg, name]) =>
    copyFile(join(root, 'node_modules', pkg, 'LICENSE'), join(target, name)),
  ),
);

console.log(`Synced ${FILES.length} font files and ${LICENSES.length} licences to public/fonts/`);
