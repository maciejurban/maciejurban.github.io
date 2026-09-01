const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export const formatDate = (value: Date): string => dateFormatter.format(value);

/** For <time datetime="…">. */
export const isoDate = (value: Date): string => value.toISOString().slice(0, 10);

/** `history-as-truth` → `history as truth`. Themes are shown as plain text in Phase 1. */
export const formatTheme = (theme: string): string => theme.replaceAll('-', ' ');
