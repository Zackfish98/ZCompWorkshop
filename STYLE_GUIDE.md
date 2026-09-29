# Two Step Collective — Style Guide

Working brand for a two-step dance instruction site (private lessons + 4-week group intensives). Visual identity is adapted from the "Two Step Collective" brand board (`BRAND GUIDE_BRAND GUIDE .jpg`) — bold, high-contrast, star-motif, poster-style branding, kept simple on a light cream background.

## Aesthetic

- High-contrast, graphic, "vintage poster" feel: solid 2px ink outlines, pill/badge shapes, flat color blocks.
- Star (★) is the recurring brand mark — used in the logo, badges, card accents, and the footer/section divider strip.
- Bold italic serif for anything that reads as a headline or logo; a clean grotesque sans for body copy and UI labels.
- Motion should feel purposeful, not decorative — the one big animated moment (the scroll-driven orbit section) is the centerpiece; everything else is static and calm.

## Color Palette

Defined as CSS custom properties in `css/styles.css` (`:root`):

| Variable | Hex | Use |
|---|---|---|
| `--bg` | `#f8f3e8` | page background (cream/paper) |
| `--ink` | `#191919` | primary text, outlines, dark UI surfaces |
| `--ink-soft` | `rgba(25,25,25,0.62)` | secondary/muted text |
| `--coral` | `#e16e57` | primary accent — CTA hovers, private-lesson tag |
| `--chartreuse` | `#e2e88c` | badge/pill fills, star icon color on dark backgrounds |
| `--seafoam` | `#a3c7c5` | group-lesson tag, center circle top |
| `--pink` | `#d66577` | available accent, not yet used in a component |
| `--orange` | `#f4a556` | available accent, not yet used in a component |
| `--olive` | `#c4bb7b` | available accent, not yet used in a component |
| `--blue` | `#2e72a4` | available accent, not yet used in a component |
| `--card-bg` | `#fffdfa` | card/input backgrounds |

The unused accents (pink, orange, olive, blue) are kept as variables so future sections/cards can pull from the same brand palette instead of introducing new colors.

## Typography

- **Display / headings / logo wordmark:** `Bitter`, bold italic — stands in for the brand board's "Decoy" font (not freely licensed).
- **Body / UI / labels / buttons:** `Space Grotesk` — stands in for the brand board's "Sporting Grotesque."
- Loaded via Google Fonts in `index.html`.
- Convention: headings (`h1`, `h2`) are always bold italic serif; anything uppercase-tracked (eyebrow pills, tags, buttons, nav labels) is Space Grotesk bold.

## Core Components

- **Brand tab** (`.brand-tab`) — fixed pill badge, top-left, ink background, star + wordmark. Persistent logo across the whole scroll. Additional badges stack directly underneath using the same class plus a `-secondary` modifier (e.g. `.brand-tab-secondary`, which just overrides `top` to sit below the one above it and adds a coral hover state since it's a link). This is the pattern for any future "jump to a data viz page" links from the main site — don't invent a new nav style, just stack another pill.
- **Star strip** (`.star-strip`) — repeating checkerboard-star SVG pattern, used as a section divider (after the hero, before the footer).
- **Pills/badges** (`.eyebrow-pill`, `.option-tag`, `.option-save`) — rounded-full, 2px ink border, bold uppercase label. The standard way to call out a short piece of metadata.
- **Orbit section** (`#journey`) — scroll-driven centerpiece: a fixed circular object (placeholder for a future dance video) that phrases orbit in front of and behind as the user scrolls. See inline comments in `js/script.js` for the mechanics.
- **Option cards** (`.option-card`) — bordered, rounded cards for Private Lessons / Group Sessions, each with a star badge, price, and CTA button.
- **Buttons** (`.option-cta`, `.submit-btn`) — pill-shaped, ink fill by default, coral on hover.
- **Signup form** (`#signup-form`) — Name/Email/Phone, then three `.field-group` fieldsets (Lesson Type, Preferred Neighborhood, Potential Availability), then an optional message. `.field-group` is the generic fieldset style (no visible border, muted uppercase-ish legend) — reuse it for any future grouped-radio/checkbox question rather than styling a fieldset one-off. Submissions are pushed to Firebase Realtime Database (see `js/firebase-config.js` + the submit handler in `js/script.js`) — one record per signup via `.push()`, plus a small `.firebase-status` line that shows whether the config is actually connected.
- **Footer** — inverted (ink background, cream text) to bookend the page with the same contrast as the brand board's dark sections.

## Data viz pages (course exercises)

`ClassTimeline.html` and `DanceStylesSituated.html` (both at the repo root) are D3.js course exercises re-skinned to match the brand, linked from the main site via the footer ("View Class Timeline") and the second brand tab ("Dance Styles Situated"). Their actual chart logic lives in matching `.js` files inside `Data visualization/` (`test.js`, `dance-network.js`) — the HTML files are just brand-styled shells around them.

Since these pages live outside `index.html` and don't load `css/styles.css`, each one repeats the same small set of things directly in a `<style>` block:
- the same hex values as the `:root` variables in `css/styles.css` (kept in sync by hand — there's no build step tying them together, so if the main palette changes, these need updating too)
- the Bitter + Space Grotesk Google Fonts link
- a `.back-link` pill (mirrors `.brand-tab`) pointing back to `index.html`
- a bordered, rounded container (`#d3-container-*`) that the chart draws into

Because D3 sets colors directly in JS (`.attr('fill', ...)`, `.style('fill', ...)`) rather than through CSS, "brand-styling" a chart means hand-matching every hardcoded color in the script to the palette above — there's no automatic link between the stylesheet and anything D3 draws into an SVG. Fonts are the one exception: SVG `<text>` inherits `font-family` from its CSS ancestors, so setting it once on `<body>` is enough to cover chart labels too.

`dance-network.js` also demonstrates the "single edge-list CSV" pattern for a network graph: rather than the course's usual `nodes.csv` + `edges.csv` pair, it derives the node list automatically from the unique names in a `DanceStyles.csv`'s `source`/`target` columns. Worth knowing if a future graph exercise only has one relationship CSV instead of two.

`howdyAI.html` (song analyzer, calls the Anthropic API directly from the browser) and `community.html` (aggregated results) follow the exact same shell pattern as the D3 pages above — same `:root` copy, same fonts, same `.back-link`. Verdict badges reuse the existing palette instead of literal red/yellow/green: `--chartreuse` = YES, `--orange` = MAYBE, `--coral` = NO.

**API key:** the site no longer ships an Anthropic key. The key that used to be committed in `js/anthropic-key.js` was removed, and that filename is now gitignored. On the live site the song analyzer shows an "offline" message instead of calling the API. To run it locally, copy `js/anthropic-key.example.js` to `js/anthropic-key.js` and add a `<script>` tag for it before `js/howdyAI.js`. Never push a real key. A static GitHub Pages site can't hide one, so bringing the analyzer back live would need a small serverless proxy (e.g. a Cloudflare Worker) that holds the key server-side.

`TwoStepBootCamp.html` is the public landing page for the 4-week Boot Camp. It uses the same standalone shell as the pages above, but the layout is a single screen with no scrolling. It has three columns: topic buttons on the left, a looping, muted dancer video in the center (`#video-box`), and an unboxed info panel on the right. The video has no box. Instead, vertical star strips (`.star-strip-v`, the same checkerboard-star pattern as the main site's `.star-strip`, just tiled vertically) run from the top of the page down each side of the video. They land on a single full-width `.star-strip` directly above the Welcome copy. The video's width snaps to multiples of 80px (`--video-w`), and the horizontal strip's tiles shift to match, so the vertical strips always sit exactly on a column of squares and the checkerboard continues where they meet. Keep that in mind if you change the strip size or the video width math. The video is cropped from the After Effects render `EZ TwoStep (1).mov` (crop 812×688 at x 260, y 32). It keeps its transparent background, so the dancers sit right on the cream page. It ships in two formats because no single format keeps transparency in every browser: `media/bootcamp-dancers.mov` (HEVC with alpha, for Safari) and `media/bootcamp-dancers.webm` (VP9 with alpha, for Chrome and Firefox). If you re-render, re-export both. The info panel shows a chartreuse star by default, matching the stars in the video. Clicking a topic replaces the star with that topic's `<section>`, and clicking the same topic again brings the star back (`js/bootcamp.js`). All the copy lives in the HTML, so text edits don't touch the JS. Below 1100px wide the page switches to a stacked, scrolling layout. From top to bottom it shows the back link, the video, the star strip, the Welcome copy, the topic buttons as wrapping outlined pills, and then the selected topic's text. The default star is hidden in this layout. `.stage` switches to `display: contents` so its children can be reordered with `order`. Between 640px and 1099px (tablets), the vertical strips come back around a fixed 560px video. Below 640px (phones), the video runs edge to edge with no strips. The page isn't linked from `index.html` yet.

Nav badges now stack three deep (`.brand-tab`, `.brand-tab-secondary`, `.brand-tab-tertiary` on the main site) — each one is `top: +58px` from the last. A fourth would follow the same increment.

## Notes for future changes

- Keep new UI elements inside this palette/type system rather than introducing new colors or fonts.
- The brand board's "TPC" monogram cleverly folds a star into the letterforms; that trick doesn't map onto "TSC" (Two Step Collective's initials), so the site currently uses a plain star + wordmark lockup instead of a custom monogram.
- Pricing: Private Lessons $125/lesson, Group 4-week intensive $375 (75% of 4x private, i.e. a 25% bundled discount) — surfaced on the option cards.
