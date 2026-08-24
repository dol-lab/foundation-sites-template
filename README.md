# Foundation for Sites Template

This originally was built using [Foundation for Sites 6](http://foundation.zurb.com/sites). It includes a Sass compiler and a starter HTML file for you.

## Installation

To use this template, your computer needs:

- [NodeJS](https://nodejs.org/en/) (0.12 or greater)
- [Git](https://git-scm.com/)


```bash
cd projectname
npm install
```

Finally, run `npm run start` to run the Sass compiler. It will re-run every time you save a Sass file.


## To Do

* Revisit color-mix declarations. Most of them have fallbacks, some do not, especially when declared through scss variables.
* Revisit text sizing.
* Increase global border-radius settings.


### Colors

This template treats **CSS custom properties** as the source of truth for colors.
Most Sass "color variables" intentionally point at CSS variables (example: `$color-bg-1: var(--f-color-bg-1)` in `scss/_colors.scss`)
so components remain themeable at runtime.

```css
/* Background "layers" (page, cards, raised/highlighted surfaces) */

/* Light */
--f-color-bg-0: var(--f-color-neutral-300); /* page background */
--f-color-bg-1: var(--f-color-neutral-100); /* cards/widgets */
--f-color-bg-2: var(--f-color-neutral-200); /* raised/highlight */

/* Dark */
--f-color-bg-0: var(--f-color-neutral-100); /* page background */
--f-color-bg-1: var(--f-color-neutral-200); /* cards/widgets */
--f-color-bg-2: var(--f-color-neutral-300); /* raised/highlight */

/* Text roles (both themes) */
--f-color-text-0: var(--f-color-neutral-700); /* headings/strong */
--f-color-text-1: var(--f-color-neutral-600); /* body */
--f-color-text-2: var(--f-color-neutral-500); /* muted */
```

Color roles are assigned by `@include foundation-apply-theme("light"|"dark")` in `scss/custom-styles/_root-variables.scss`
(the mixin definition is in `scss/_custom-functions.scss`).

Border roles are `--f-color-border-0`, `--f-color-border-1`, `--f-color-border-2` (subtle -> stronger) and are derived from the
current theme's text color via `color-mix()`.

#### Palette Tokens

Foundation-like palette tokens are exposed as CSS variables and used by components/utilities:

- Base: `--f-color-brand`, `--f-color-primary`, `--f-color-secondary`, `--f-color-success`, `--f-color-warning`, `--f-color-alert`
- Contrast: `--f-color-<name>-contrast` (intended text/icon color on top of the base color)
- Hover: `--f-color-<name>-darker` (computed via CSS `color-mix()`; see the "To Do" note above)

The base palette values live in `scss/_colors.scss` (`$foundation-palette` and `$foundation-palette-contrast`).
`--f-color-brand` can also be overridden at runtime via `--f-color-brand-base` / `--f-color-brand-base-contrast` (see `scss/_custom-functions.scss`).

```css
.my-card {
  background: var(--f-color-bg-1);
  border: 1px solid var(--f-color-border-1);
  color: var(--f-color-text-1);
}

.my-card a {
  color: var(--f-color-brand);
}
```

#### Light/Dark Selection

- Default: follows `prefers-color-scheme` (dark theme is applied when the OS prefers dark and you did not force a mode).
- Force: set `data-theme="light"` or `data-theme="dark"` on `html`.

If something looks wrong in dark mode, see [DARK_THEME.md](DARK_THEME.md) — a symptom-first
troubleshooting checklist (hard-coded colors, specificity traps, admin/editor exclusions).

#### Optional Page-Wide Tinting

If you add the `themed` attribute and set `--f-color-theme` on `html`, some role colors are derived from that color
using `oklch(from ...)`, guarded by `@supports (color: oklch(from ...))`:

```html
<html themed style="--f-color-theme: #975938">
```

See `scss/custom-styles/_root-variables.scss` for the exact derived values.

#### Helper Classes

Utility classes for palette colors exist (background and text). See `HELPER_CLASSES.md` "Colors" for the list.

### Info Chips

`.info-chip` has two states, and elevation is what separates them:

- **Static** (default): no fill and no shadow, only a hairline border, `cursor: default`. The
  segment after the icon keeps a light tint (`bg-2` mixed halfway into `bg-1`) — that is the chip's
  anatomy (icon | key | value), not a state, and it stays a seam rather than a grey block.
  Full-contrast `--f-color-text-0` label: it is information, and information has to be readable.
- **Clickable**: its own `bg-1` surface, a firmer border, and a drop shadow; hover and focus deepen
  both. The chip does not move: chips sit in dense rows, where a moving one pulls the eye off the
  row it belongs to. Applied to `[href]` and `<button>` chips, plus `.clickable` for a chip whose
  handler is in JS. A chip merely sitting inside a link stays flat: the row around it is the click
  target.

The border is a `0 0 0 1px` ring shadow rather than a real border, so it costs no layout; its color
is `--_chip-ring`, which each state sets (8% of the text color static, 12% clickable, 24% hovered).
The drop shadow uses `--f-color-shadow` (the theme's own shadow color: black at 13% on light, 50% on
dark), never a text-derived color — a text-derived shadow is too heavy on light and inverts to a glow
on dark. On a dark card black-on-near-black barely registers, which is why hover also strengthens the
ring.

The fills are custom properties (`--_chip-bg`, `--_chip-key-bg`, `--_chip-separator`) set on the
chip itself, so a state (or `.hollow`) swaps them in one place instead of out-specifying the
`> span` rules. Both state selectors are wrapped in `:where()` to stay at `.info-chip`
specificity, which is what keeps `.hollow` and `.clear` winning over them.

Chips are `<a>` elements even when there is nothing to link to (see the `info-chip` Handlebars
template in spaces-markup), so `[href]` — not the tag — is the honest signal. A chip that shows a
pointer and then does nothing is the mistake this split is meant to prevent.
