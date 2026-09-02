# CSS Variables Reference

CSS custom properties are the **source of truth** for theming. Sass color
variables intentionally point at them (e.g. `$color-bg-1: var(--f-color-bg-1)`)
so components stay themeable at runtime.

All custom properties are prefixed `--f-*`. Underscore-prefixed ones (`--_f-*`)
are internal scratch variables — don't depend on them outside their scope.

## 1. Color Roles

Roles, not raw colors. Components should consume roles so the theme can be
switched in one place.

| Variable                 | Purpose                                |
| ------------------------ | -------------------------------------- |
| `--f-color-bg-0`         | Page background                        |
| `--f-color-bg-1`         | Cards / widgets                        |
| `--f-color-bg-2`         | Raised / highlighted surface           |
| `--f-color-text-0`       | Headings / strong text                 |
| `--f-color-text-1`       | Body text                              |
| `--f-color-text-2`       | Muted text                             |
| `--f-color-border-0..2`  | Subtle → stronger borders (color-mixed from text) |
| `--f-color-brand`        | Primary brand accent                   |
| `--f-color-brand-darker` | Hover/active variant (via `color-mix`) |

### Palette tokens

Foundation-style semantic palette — each has a `-contrast` (text on top) and
`-darker` (hover) sibling:

`--f-color-primary`, `--f-color-secondary`, `--f-color-success`,
`--f-color-warning`, `--f-color-alert`.

Defined in `scss/_colors.scss` (`$foundation-palette`), assigned to roles by
`@include foundation-apply-theme("light"|"dark")` in
`scss/custom-styles/_root-variables.scss`.

## 2. Theming: Light / Dark

Selection cascade (first match wins):

1. **Forced:** `<html data-theme="light">` or `data-theme="dark"`.
2. **OS preference:** `prefers-color-scheme: dark` when no `data-theme` is set.
3. **Default:** light.

```html
<!-- follow OS -->
<html>

<!-- force dark -->
<html data-theme="dark">
```

## 3. Page-Wide Tinting via `--f-color-theme`

Set `--f-color-theme` on `<html>` (or any element) together with the `themed`
attribute to tint the surrounding `bg-*` / `text-*` roles toward that hue.
The derivation uses `oklch(from var(--f-color-theme) ...)` so the same input
color produces a coherent palette in both modes.

```html
<html themed style="--f-color-theme: #975938">
```

Per-card tinting works the same way — see the post cards in `index.html`:

```html
<article class="card" themed style="--f-color-theme: #367855;">…</article>
```

### How dark mode reacts to it

Same `--f-color-theme` input, two derivations (see
`scss/custom-styles/_root-variables.scss`):

| Role               | Light                                          | Dark                                          |
| ------------------ | ---------------------------------------------- | --------------------------------------------- |
| `--f-color-bg-0`   | `oklch(from theme 0.96 min(c/6, 0.01) h)`      | `oklch(from theme 0.19 min(c*0.6, 0.035) h)`  |
| `--f-color-bg-1`   | `oklch(from theme 0.995 min(c/6, 0.01) h)`     | `oklch(from theme 0.23 min(c*0.6, 0.019) h)`  |
| `--f-color-bg-2`   | `oklch(from theme 0.97 min(c/5, 0.025) h)`     | `oklch(from theme 0.32 min(c*0.6, 0.02) h)`   |
| `--f-color-text-*` | `oklch(from theme 0.4–0.5 calc(c/3..c/9) h)`   | `color-mix` of dim theme into neutral-600/700 |

In short: **light theme pulls lightness up + chroma way down**, **dark theme
pulls lightness down + dampens chroma**. Hue is preserved either way.

The whole block is guarded by
`@supports (color: oklch(from red l c h))` — browsers without `oklch(from …)`
fall back to the un-tinted theme palette.

### Background gradient

When `--f-color-theme` is set, the body gets a radial gradient using
`--f-bg-gradient-color`, derived from the theme color (lighter in light mode,
darker in dark mode).

## 4. Spacing Scale

Exposed at `:root` as `--f-spacing-0` … `--f-spacing-9`. Source map:
`$spacing-scale` in `scss/_custom-settings.scss`. See
[HELPER_CLASSES.md](HELPER_CLASSES.md#1-spacing) for the corresponding
`m-*` / `p-*` utility classes.

## 5. Layout / Misc

| Variable                              | Purpose                          |
| ------------------------------------- | -------------------------------- |
| `--f-radius`, `--f-radius-small`      | Border-radius defaults           |
| `--f-gutter-small`, `--f-gutter-large`| Grid / inline gutters            |
| `--f-grid-container-max`              | `.grid-container` max-width (70rem) |
| `--f-grid-container-padding`          | `.grid-container` padding per side, responsive |
| `--f-padding`, `--f-margin`           | Default component spacing        |
| `--f-menu-padding`                    | Menu item padding                |
| `--f-transition-short/medium/long`    | 100ms / 250ms / 500ms            |
| `--f-transition-timing`               | `ease-in-out` (or cubic-bezier)  |
| `--f-drop-shadow`, `--f-drop-shadow-large` | Standard elevation shadows  |
| `--user-card-{xsmall…xxlarge}`        | Avatar sizes (24px … 240px)      |

### Grid container

`.grid-container` reads its `max-width` and side padding from
`--f-grid-container-max` / `--f-grid-container-padding`, so a narrower or wider
container needs no rebuild:

```css
.narrow-page .grid-container { --f-grid-container-max: 48rem; }
```

The SCSS variables (`$grid-container`, `$grid-container-padding` in
`scss/custom-includes/foundation-spaces/xy-grid/_xy-grid.scss`) remain the
source of truth and seed the tokens. `.grid-container.full` still hardcodes
`padding: 0`, and cell gutters (`$grid-margin-gutters`) are still compiled
values: code doing Sass math on them (`_s-scroll-snap.scss`,
`_navigation-menus.scss`) will not follow a runtime override of the tokens.

## 6. Overriding in Practice

```css
/* Component-scoped override */
.my-card {
  background: var(--f-color-bg-1);
  border: 1px solid var(--f-color-border-1);
  color: var(--f-color-text-1);
  border-radius: var(--f-radius);
  padding: var(--f-spacing-4);
}

/* Page-wide brand override (runtime) */
html {
  --f-color-brand-base: oklch(0.6 0.18 25);
  --f-color-brand-base-contrast: white;
}
```
