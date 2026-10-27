# CSS variables

Custom properties are the source of truth for theming: there are no Sass aliases for the color roles, so write `var(--f-color-bg-1)` directly, also in Foundation's settings, and components stay themeable at runtime. Public ones start with `--f-`, a component's knob is `--f-<component>-…`; private ones start with `--_` (`--_f-*` on `:root`, short names such as `--_offset` inside a component) and are not for use outside their scope.

## Color roles

Components use roles, not raw colors, so a theme changes them in one place.

| Variable | Role |
| --- | --- |
| `--f-color-bg-0` | Page background |
| `--f-color-bg-1` | Cards and widgets |
| `--f-color-bg-1-untinted` | `bg-1` before a `themed` ancestor tints it |
| `--f-color-bg-2` | Raised or highlighted surface |
| `--f-color-text-0` | Headings and strong text |
| `--f-color-text-1` | Body text |
| `--f-color-text-2` | Muted text |
| `--f-color-border-0`, `-1`, `-2` | Lines from subtle to stronger: `text-0` at 7, 12 and 16% |
| `--f-color-tint` | Hover wash: `text-0` at 7% |
| `--f-color-shadow` | The color of the drop shadows: black at 13% (light) or 50% (dark), tinted under `themed` |
| `--f-color-neutral-100` … `-700` | The greys the roles are made of, from page to text; they swap in dark mode |

The palette colors `--f-color-brand`, `--f-color-primary`, `--f-color-secondary`, `--f-color-success`, `--f-color-warning` and `--f-color-alert` each come with `-contrast` (text on it) and `-darker` (hover, a `color-mix` with black). They are defined in `scss/_colors.scss` and printed by `foundation-apply-theme()` in `scss/_custom-functions.scss`. The brand is overridden at runtime with `--f-color-brand-base` and `--f-color-brand-base-contrast`, on `:root` or inline on a `themed` element.

## Light and dark

The palette is written with `light-dark()` on `:root`, which sets `color-scheme: light dark`, so it follows the OS. `data-theme="light"` or `"dark"` forces a mode on any element and its subtree.

```html
<html data-theme="dark">
```

The backend build is always light: it prints the palette with `foundation-apply-theme("light")` and sets no `color-scheme` on a page it does not own. More in [Dark theme](dark-theme.md).

## Tinting with --f-color-theme

The `themed` attribute plus an inline `--f-color-theme` tints the surfaces and text of an element toward that hue. The rule matches the `style` attribute, so a value set from a stylesheet does not tint. On `<html>` the body also gets a radial gradient in `--f-bg-gradient-color`; a card is tinted the same way (see the post cards in [Space](space.md)).

```html
<html themed style="--f-color-theme: #975938">
<article class="card" themed style="--f-color-theme: #367855">…</article>
```

The same color gives a coherent palette in both modes: light pulls lightness up and chroma far down, dark pulls lightness down and dampens chroma, and the hue stays. The derivations, from `scss/custom-styles/_root-variables.scss`:

| Role | Light | Dark |
| --- | --- | --- |
| `--f-color-bg-0` | `oklch(from theme 0.96 min(c / 6, 0.01) h)` | `oklch(from theme 0.19 min(c * 0.6, 0.035) h)` |
| `--f-color-bg-1` | `oklch(from theme 0.995 min(c / 6, 0.01) h)` | `oklch(from theme 0.23 min(c * 0.6, 0.019) h)` |
| `--f-color-bg-2` | `oklch(from theme 0.97 min(c / 6, 0.012) h)` | `oklch(from theme 0.32 min(c * 0.6, 0.02) h)` |
| `--f-color-text-0`, `-1`, `-2` | `oklch(from theme 0.4, 0.45, 0.5` at `c / 3`, `c / 6`, `c / 9` `h)` | the dimmed theme mixed into `neutral-700` (12, 18%) and `neutral-600` (20%) |
| `--f-bg-gradient-color` | `oklch(from theme max(l, 0.83) min(c, 0.12) h)` | `oklch(from theme min(l, 0.3) min(c, 0.15) h)` |

Borders, tint and shadow derive from these, so they follow.

## Spacing

`--f-spacing-0` … `--f-spacing-9`, from `$spacing-scale` in `scss/_custom-settings.scss`. The `m-*`, `p-*` and `gap-*` classes use the same scale: see [Helper classes](helper-classes.md).

## Layout and motion

The Sass globals (`$global-radius`, `$global-radius-xsmall`, `$global-transition-*`) are `var(--f-…)`, so overriding a token reaches every component. Spacing the Sass does math on (`$global-margin`, `$global-padding`, `$global-menu-padding`, the grid gutters) has no runtime token.

| Variable | Default | Role |
| --- | --- | --- |
| `--f-radius` | `0.5rem` | The one radius knob: `-small` (half) and `-xsmall` (0.4) follow it, `-full` (`9999px`) is a pill |
| `--f-avatar-radius` | `--f-radius` | An avatar's corner; `.avatar-stack` sets it to `-full` |
| `--f-gutter-small` | `8px` | Inline gutter, mirrors `$global-gutter-small`, which the grid compiles in |
| `--f-grid-container-max` | `70rem` | `.grid-container`'s max width |
| `--f-grid-container-padding` | `0.5rem`, `0.75rem` from large | `.grid-container`'s padding per side |
| `--f-transition-short`, `-medium`, `-long` | `100ms`, `250ms`, `500ms` | Durations |
| `--f-transition-timing` | `ease-in-out` | Easing |
| `--f-transition-timing-cubic-bezier` | `cubic-bezier(0.8, 0, 0.2, 1.2)` | Easing that overshoots slightly |
| `--f-drop-shadow`, `--f-drop-shadow-large` | | Elevation, drawn in `--f-color-shadow`: change the color, not the shadows |
| `--f-avatar-xsmall` … `-xxlarge` | `24px` … `240px` | Avatar sizes, from `$avatar-sizes` |
| `--f-opacity-disabled` | `0.5` | A disabled control, `.disabled`, `$button-opacity-disabled`, `$switch-opacity-disabled` |

These are read with a fallback and not declared, so set them where they apply:

| Variable | Default | Role |
| --- | --- | --- |
| `--f-avatar-stack-overlap` | `0.6rem` | How far avatars in an `.avatar-stack` overlap |
| `--f-auto-grid-min-width` | `250px` | `.auto-grid`'s minimum column width |
| `--f-prose-offset-left` | `clamp(0.75rem, 2vw, 2rem)` | `.prose-layout`'s left column target width; `--target-offset-left` is the old name, still read |
| `--f-prose-ch-factor` | `1` | Scales `.prose-layout`'s 70ch column for a font with a narrow or wide `0` |

A narrower or wider `.grid-container` needs no rebuild. The tokens are seeded from `$grid-container` and `$grid-container-padding` (`scss/custom-includes/foundation-spaces/xy-grid/_xy-grid.scss`); `.grid-container.full` keeps `padding: 0`, and Sass math on the cell gutters (`_s-scroll-snap.scss`, `custom-styles/_utilities.scss`) does not follow a runtime override.

```css
.narrow-page .grid-container { --f-grid-container-max: 48rem; }
```

## Overriding

```css
.my-card {
  background: var(--f-color-bg-1);
  border: 1px solid var(--f-color-border-1);
  color: var(--f-color-text-1);
  border-radius: var(--f-radius);
  padding: var(--f-spacing-4);
}

html {
  --f-color-brand-base: oklch(0.6 0.18 25);
  --f-color-brand-base-contrast: white;
}
```
