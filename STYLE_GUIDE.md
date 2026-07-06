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

- **Brand tab** (`.brand-tab`) — fixed pill badge, top-left, ink background, star + wordmark. Persistent logo across the whole scroll.
- **Star strip** (`.star-strip`) — repeating checkerboard-star SVG pattern, used as a section divider (after the hero, before the footer).
- **Pills/badges** (`.eyebrow-pill`, `.option-tag`, `.option-save`) — rounded-full, 2px ink border, bold uppercase label. The standard way to call out a short piece of metadata.
- **Orbit section** (`#journey`) — scroll-driven centerpiece: a fixed circular object (placeholder for a future dance video) that phrases orbit in front of and behind as the user scrolls. See inline comments in `js/script.js` for the mechanics.
- **Option cards** (`.option-card`) — bordered, rounded cards for Private Lessons / Group Sessions, each with a star badge, price, and CTA button.
- **Buttons** (`.option-cta`, `.submit-btn`) — pill-shaped, ink fill by default, coral on hover.
- **Footer** — inverted (ink background, cream text) to bookend the page with the same contrast as the brand board's dark sections.

## Notes for future changes

- Keep new UI elements inside this palette/type system rather than introducing new colors or fonts.
- The brand board's "TPC" monogram cleverly folds a star into the letterforms; that trick doesn't map onto "TSC" (Two Step Collective's initials), so the site currently uses a plain star + wordmark lockup instead of a custom monogram.
- Pricing: Private Lessons $125/lesson, Group 4-week intensive $375 (75% of 4x private, i.e. a 25% bundled discount) — surfaced on the option cards.
