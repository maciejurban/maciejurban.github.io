# Design notes

**Status: Phase 1, provisional.** The build spec puts "final typography and
palette" out of scope for Phase 1. Everything here is chosen to make the
*structure* right and to give Phase 2 something concrete to argue with — not to
be the final visual answer.

---

## 1. The concept in one paragraph

**The margin carries the state.** Every long-form page hangs off a single
hairline rule running down the left of the text column, and the seven case
beats are *marked positions on that rule* — number outdented into the margin,
sitting on the line, so the case reads as a sequence of states rather than a
stack of sections. The rule is the same object on every page: on an essay it is
unmarked and just holds the column; on a case it is annotated. Nothing else in
the layout is a container — no cards, no panels, no boxes with shadows. Content
is separated by the rule, by space, and by type size, in that order. The site
is a document with a spine, which is the most literal possible reading of a
brief about state machines and about what happens to a system when things
change underneath it.

**The one bold place: the tension line.** It is set in the display serif at a
size just under the page title, at a deliberately narrow measure (~24ch) so it
breaks into three or four short lines like a stanza, with an accent-coloured
rule hanging to its left that lines up exactly with the beat rail below it.
That alignment is the point: the bold moment is not a flourish bolted onto the
page, it is *beat 1 of the same sequence*, drawn heavier. Every other element on
the site is restrained specifically so this one can be loud.

---

## 2. Tokens

All of it lives in `src/styles/tokens.css`, in one `:root` block.

### Colour — 5 named hex values, everything else derived

| Token | Value | Use |
|---|---|---|
| `--paper` | `#FBFBFC` | Page background. Cool near-white, not cream. |
| `--ink` | `#14161B` | Body copy, headings. |
| `--ink-muted` | `#565C69` | Meta, captions, the "TK" placeholders. |
| `--rule` | `#C9CCD4` | Hairlines, the spine rule, artifact frames. |
| `--accent` | `#1F5D4C` | Beat numbers, link underlines, focus ring, the tension rule. |

Derived with `color-mix()` rather than adding more hex values, so the palette
stays auditable in one place:

```css
--surface-sunk:  color-mix(in oklab, var(--rule) 35%, var(--paper));
--rule-strong:   color-mix(in oklab, var(--rule) 65%, var(--ink));
--accent-quiet:  color-mix(in oklab, var(--accent) 22%, var(--paper));
```

**Measured contrast** (computed, not asserted):

| Pair | Ratio | |
|---|---|---|
| `--ink` on `--paper` | 17.50 | AAA |
| `--ink-muted` on `--paper` | 6.49 | AA (AAA for large) |
| `--ink-muted` on `--surface-sunk` | 5.83 | AA |
| `--accent` on `--paper` | 7.44 | AAA |
| `--paper` on `--accent` | 7.44 | AAA |

`--rule` at 1.55:1 is decorative only. It never carries meaning on its own — the
beat *numbers* carry the structure, and they are `--accent` at 7.44:1. The focus
ring is `--accent`, which clears the 3:1 non-text requirement with room to spare.

### Type — two families, self-hosted

| Role | Family | Why |
|---|---|---|
| Editorial: titles, body, tension line, pull quotes | **Newsreader** (variable) | A workhorse reading serif with moderate stroke contrast and slightly odd, lively details. Reading is the primary action here and a serif earns its place at 17px over long text. Deliberately *not* a high-contrast display serif. |
| Structural: nav, beat numbers, meta, captions, artifact labels | **Atkinson Hyperlegible Next** (variable) | A sans whose entire design brief is disambiguating characters that usually collide. On a site arguing that semantics come before UI, a typeface designed for unambiguous reading is the right small-text voice — and it is clearly distinct from the serif without being the default UI sans. |

Both self-hosted in `public/fonts/` as woff2 (vendored out of `@fontsource*`
packages at install time, so there is no external CDN call at runtime and no
network step in CI). `font-display: swap` on both; the display face is
preloaded.

### Scale

Fluid where it needs to be, fixed where fluidity would just add jitter.

```
--text-xs    0.8125rem            meta, captions
--text-sm    0.9375rem            nav, beat labels
--text-base  1.0625rem  (17px)    body
--text-md    1.25rem              lead paragraph, essay dek
--text-lg    1.5rem               h2 / beat titles
--text-xl    1.875rem             h1 on index pages
--text-hero  clamp(2.25rem, 1.55rem + 2.9vw, 3.375rem)   page title
--text-tension clamp(1.6rem, 1.15rem + 1.9vw, 2.5rem)    the one bold place
```

Line heights: `1.62` body, `1.22` display, `1.35` for the tension line.

### Spacing and measure

One rem-based scale, no arbitrary values in components:

```
--space-1  0.25rem   --space-5  2rem
--space-2  0.5rem    --space-6  3rem
--space-3  0.75rem   --space-7  4rem
--space-4  1rem      --space-8  6rem
```

```
--measure         66ch    body text — comfortably under the 80-char ceiling
--measure-narrow  24ch    the tension line
--rail            3.5rem  the gutter the beat numbers hang in
```

Layout grid on every long-form page:

```
[ --rail ][ --measure ][ 1fr ]
```

Below `48rem` the rail collapses to `0` and beat numbers move inline above
their titles. Below `22.5rem` (360px) nothing changes further — the layout has
one column at that point and stays there.

---

## 3. Wireframes

### Home

```
┌──────────────────────────────────────────────────────────────────────┐
│  Maciej Urban                        Work    Writing    About        │
├──────────────────────────────────────────────────────────────────────┤  ← hairline
│                                                                      │
│  ┃ I design the rules                                                │
│  ┃ behind the interface —                     ← tension/spine line   │
│  ┃ what happens when data,                      display serif        │
│  ┃ people, or org policy                        ~24ch measure        │
│  ┃ change halfway through                       accent rule at left  │
│  ┃ the workflow.                                                     │
│                                                                      │
│      TK — two sentences of identity. Body size, 66ch, no             │
│      centring, no lead-in label.                                     │
│                                                                      │
│      Designing a workflow that changes while you use it              │  ← featured case
│      A configurable review process is easy to demo and brutal        │    link is the title;
│      to keep truthful — the org's data keeps changing while          │    tension line below,
│      the reviews are still running.                                  │    no arrow glyph
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  How I think                                                         │  ← plain h2, no eyebrow
│                                                                      │
│  Ownership follows position                                          │
│  Feedback without ownership becomes a veto, and a veto without       │
│  accountability reorganizes the team around it.                      │
│  ─────────────────────────────────────────────────────────           │  ← hairline separator
│  Publish, don't sync                                                 │
│  Current state is a view. Store the history and derive the           │
│  present, or spend years reconciling two truths.                     │
│  ─────────────────────────────────────────────────────────           │
│  The best AI output is a product state change                        │
│  A perfect transcript is the wrong meeting product. …                │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  Work                                                                │
│                                                                      │
│  01   Designing a workflow that changes while you use it             │  ← number is the
│       A configurable review process is easy to demo and brutal …     │    manual `order`;
│       2025–2026 · TK role      ← NO. meta is two lines, not          │    it carries info
│                                  dot-joined. See §4.                 │
│  ───────────────────────────────────────────────────────────         │
│  02   Don't solve an incentive problem by corrupting the …           │
│  ───────────────────────────────────────────────────────────         │
│  03   Building the substrate before the assistant                    │
│  ───────────────────────────────────────────────────────────         │
│  04   When customizable becomes a second product          (short)    │  ← mini cases marked
│  05   Many empty states are missing domain states         (short)    │    by a word, not a pill
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  TK — one paragraph of about, then the contact line.                 │
│  Email · GitHub · LinkedIn        ← also NO. see §4. Stacked links.  │
└──────────────────────────────────────────────────────────────────────┘
```

### Case study

```
        rail          text column (66ch)                     wide only
     ┌────────┬──────────────────────────────────────┬──────────────────┐
     │        │ Designing a workflow that changes    │                  │
     │        │ while you use it                     │  Beats           │
     │        │                                      │  1 Tension       │
     │  ┃     │ ┃ A configurable review process      │  2 Base model    │  ← sticky
     │  ┃     │ ┃ is easy to demo and brutal to      │  3 The failure   │    anchor list
     │  ┃     │ ┃ keep truthful — the org's data     │  4 The model     │    CSS only
     │  ┃     │ ┃ keeps changing while the reviews   │  5 Exceptions    │
     │  ┃     │ ┃ are still running.                 │  6 What shipped  │
     │        │                                      │  7 Differently   │
     │        │ Role      TK                         │                  │
     │        │ Period    TK                         │                  │  ← meta as a
     │        │ Context   Javelo (Tellent), B2B …    │                  │    two-column
     │        │ Themes    history-as-truth           │                  │    list, one
     │        │           flexibility-cost           │                  │    pair per row
     │        │           semantics-before-ui        │                  │
     │────────┼──────────────────────────────────────┤                  │
     │        │                                      │                  │
     │  02 ●  │ The base model                       │                  │  ← number hangs
     │  │     │                                      │                  │    ON the rule
     │  │     │ TK — how the system works before …   │                  │
     │  │     │                                      │                  │
     │  │     │ ┌──────────────────────────────────┐ │                  │
     │  │     │ │                                  │ │                  │  ← <Artifact>:
     │  │     │ │        artifact 16 / 9           │ │                  │    labelled empty
     │  │     │ │                                  │ │                  │    frame, 1px rule,
     │  │     │ └──────────────────────────────────┘ │                  │    no shadow
     │  │     │ TK — the base model: entities, and   │                  │
     │  │     │ the rule that governs them.          │                  │
     │  │     │                                      │                  │
     │  03 ●  │ The failure that made the project    │                  │
     │  │     │ TK — …                               │                  │
     │  │     │                                      │                  │
     │  04 ●  │ The model that resolved it           │                  │
     │  │     │ TK — …                               │                  │
     │  │     │   ┃ TK — the one sentence a reader   │                  │  ← <Pullquote>:
     │  │     │   ┃ should still have in their head  │                  │    accent rule,
     │  │     │   ┃ a week later.                    │                  │    no quote marks
     │  │     │                                      │                  │
     │  05 ●  │ Exception flows                      │                  │
     │  │     │ 1. TK — TK                           │                  │
     │  │     │                                      │                  │
     │  │     │ ░ TK — the counter-argument. Why a   │                  │  ← <Aside>:
     │  │     │ ░ reasonable person would have       │                  │    sunk surface,
     │  │     │ ░ modelled this differently.         │                  │    indented, no icon
     │  │     │                                      │                  │
     │  06 ●  │ What shipped and what it did         │                  │
     │  │     │ TK — …                               │                  │
     │        │                                      │                  │
     │  07 ●  │ What I'd do differently              │                  │  ← visually distinct:
     │        │ TK — …                               │                  │    rule ends here,
     │        │                                      │                  │    beat sits on sunk
     │        │ ──────────────────────────────────── │                  │    surface, full
     │        │ Related: Publish, don't sync         │                  │    column width
     └────────┴──────────────────────────────────────┴──────────────────┘
```

Beat 1 is the tension block in the header — the hook *is* beat 1, so it is
numbered as one on the rail and is not repeated in the body. That is why case
MDX bodies start at `<Beat n={2}>`.

Beat 7 is the only beat that breaks the rail: the spine stops, the beat sits on
`--surface-sunk` and runs the full column. "What I'd do differently" is the one
section a sceptical reader is looking for, and the layout should stop pretending
it is just another step.

---

## 4. Anti-pattern check

Written out, one by one, against the brief's list.

1. **Cream background + high-contrast serif + terracotta accent.** Avoided on
   all three counts. The background is a *cool* near-white (`#FBFBFC`, blue-grey
   cast) rather than warm cream; Newsreader is a moderate-contrast reading serif,
   not a Didone display face; the accent is a deep oxidised green, which is on
   the opposite side of the wheel from terracotta. Checked deliberately because
   the first draft of any "thoughtful writing site" lands here by default.

2. **Near-black background with one acid accent.** Not used. Light mode only in
   Phase 1 (dark mode is explicitly out of scope), and the accent is
   low-luminance and desaturated rather than a signal colour.

3. **Everything chopped into identical rounded cards with the same soft grey
   shadow.** No cards anywhere. `border-radius` is `0` globally except the
   artifact frame, which gets `2px` so its dashed rule does not look like a
   rendering bug. There is not a single `box-shadow` in the stylesheet. List
   items on the index pages are separated by hairlines, not enclosed.
   The one enclosed thing on the site is `<Artifact>`, and it is enclosed because
   it is literally a picture frame with nothing in it yet.

4. **Tracked-out all-caps eyebrow labels above headings.** None. There is no
   `text-transform: uppercase` and no positive `letter-spacing` above `0.01em`
   anywhere. Section headings are plain `<h2>` in the serif at `--text-lg`.
   The case meta block uses sentence-case labels in a two-column list.

5. **Meta strings joined with middle dots.** Rejected — see the two "NO"
   annotations in the home wireframe, which are there because that is exactly
   what I drew first. Case meta renders as a `<dl>`: label in the sans at
   `--text-xs`, value in the serif, one pair per row. Footer links stack. The
   only meta that sits on one line is the essay date, which is one value and so
   needs no separator at all.

6. **`→` appended to link text.** No arrow glyphs in link text, anywhere. Links
   are identified by an accent underline with a `2px` offset. The featured-case
   link is the case title itself, not a "Read the case →" affordance.

7. **Fade-and-slide-up entrance animation on every section.** There is no
   animation in the build at all — no entrance transitions, no scroll-driven
   effects, no `@keyframes`. The beat rail's active state is plain `:target`,
   which makes it a URL fact rather than a scroll effect, so there is nothing to
   degrade. A scroll-linked highlight was considered and dropped: driving it
   across elements needs `timeline-scope`, which is one engine deep, and the
   widely-supported version of the idea would have been decorative motion —
   exactly what this item rules out. `prefers-reduced-motion: reduce` is still
   honoured globally, as a floor rather than a fix.

8. **A monospace face used decoratively for small labels.** No monospace in the
   design at all. Beat numbers, nav and captions are Atkinson Hyperlegible Next,
   a proportional sans. Monospace would have been the lazy way to make a site
   about systems "look technical", which is decoration standing in for rigor —
   the exact thing the brief says the reader is evaluating.

---

## 5. What makes this specific rather than a default

The default version of this site is a centred 65ch column of serif text with
generous whitespace and section headings — perfectly good, and completely
interchangeable with every other thoughtful-designer site. What makes this one
specific is that the *page has a spine and the spine is load-bearing*: one
hairline runs the length of the article, the seven beats are marked positions on
it, the tension line's accent rule aligns with it to declare itself as beat 1,
and beat 7 is the single place where the spine stops — because "what I'd do
differently" is the beat that steps outside the sequence and looks back at it.
A reader who skims for ninety seconds sees a numbered sequence with a visible
end and can tell instantly how long the argument is and where it turns. A reader
who stays fifteen minutes gets the same structure as navigation. The device is
one line and five numbers; it costs no components, no JS and no illustration,
and it encodes the thing the site is actually about — that a system is a
sequence of states, and the interesting design work is at the transitions.

---

## 6. Deviations from the build spec, and why

- **Astro 7.2.10, not Astro 5.** The spec asks for "Astro 5 (latest stable)";
  5 was latest when the spec was written and 7 is latest now. Keystatic 6
  declares `astro: 5 || 6 || 7`, so nothing downstream is affected. Taking the
  parenthetical as the real instruction.
- **TypeScript pinned to `^6`.** The native TS 7 compiler does not yet expose
  the programmatic API `astro check` needs. Pin removable once it does.
- **`noindex` while Phase 1 is deployed.** See README. Placeholder essays are
  publicly reachable so that every route exists in `dist`; a `robots.txt`
  disallow and a `noindex` meta keep them out of search results until the copy
  is real. One flag, flipped in Phase 3.
- **The slug is the filename**, not a frontmatter field, so it cannot drift.
- **Two cases are `published`, not all five `draft`.** §5 says every case is a
  draft, but §8 requires a case-study page in `dist` — "all ten routes
  reachable", and a Lighthouse score for a case page, which cannot be measured
  on a page that was filtered out of the build. One full case and one mini case
  are published so both variants are exercised in production; three stay drafts,
  along with one essay, so the filter is demonstrably doing something. The
  `noindex` flag above is what makes publishing placeholder copy safe.
- **`build.format: 'file'`, not `'directory'`.** With directory output GitHub
  Pages 301-redirects `/work` → `/work/`, and every link on the site is written
  without a trailing slash. `file` output makes Pages serve `/work` directly.
  The cost is that `Astro.url.pathname` gains a `.html` in the build but not in
  dev, which `normalisePath()` in src/lib/links.ts strips before anything
  publishes or compares a path.
- **`<Aside>` and `<Pullquote>` must be written as block elements** — tag on its
  own line, blank line around the content. On one line, MDX parses them as
  inline JSX and Keystatic (which declares them as block wrappers) refuses to
  open the entry.

---

## 7. Verified

Measured on the deployed site, not asserted:

- Lighthouse on `/work/flexible-reviews`: **performance 99, accessibility 100,
  best practices 100**. The only remaining flags are GitHub Pages' own
  cache-control headers, which are not configurable on Pages.
- All ten routes return 200 with no redirect hop. Draft entries and
  `/keystatic` return 404.
- Zero `<script>` tags and zero `.js` files in `dist`. Total CSS 5 KB.
- No horizontal overflow at 360px.
- Heading order h1 → h2 with no skips; `main`, `article`, `nav`, `header` and
  `footer` landmarks all present with labelled navs.
