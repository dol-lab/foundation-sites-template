# CSS variables

Public custom properties start with `--f-`, a component's knob is `--f-<component>-…`; private ones start with `--_` (`--_f-*` on `:root`, short names such as `--_offset` inside a component) and are not for use outside their scope. The color roles are in [Colors](colors.md).

The Sass globals (`$global-radius`, `$global-radius-xsmall`, `$global-transition-*`) are `var(--f-…)`, so overriding a token reaches every component. Spacing the Sass does math on (`$global-margin`, `$global-padding`, `$global-menu-padding`, the grid gutters) has no runtime token.

| Variable | Default | Role |
| --- | --- | --- |
| `--f-spacing-0` … `-9` | `0` … `3rem` | The spacing scale, from `$spacing-scale`, used by the `m-*`, `p-*` and `gap-*` [helper classes](helper-classes.md) |
| `--f-radius` | `0.5rem` | The one radius knob: `-small` (half) and `-xsmall` (0.4) follow it, `-full` (`9999px`) is a pill (use it, not a large fixed radius) |
| `--f-avatar-radius` | `--f-radius` | An avatar's corner; `.avatar-stack` sets it to `-full` |
| `--f-gutter-small` | `8px` | Inline gutter, mirrors `$global-gutter-small`, which the grid compiles in |
| `--f-grid-container-max` | `75rem` | `.grid-container`'s max width, from `$global-width` (1200px, the xxlarge breakpoint) |
| `--f-grid-container-padding` | `0.5rem`, `0.75rem` from large | `.grid-container`'s padding per side |
| `--f-transition-short`, `-medium`, `-long` | `100ms`, `250ms`, `500ms` | Durations |
| `--f-transition-timing` | `ease-in-out` | Easing |
| `--f-transition-timing-cubic-bezier` | `cubic-bezier(0.8, 0, 0.2, 1.2)` | Easing that overshoots slightly |
| `--f-drop-shadow-small`, `--f-drop-shadow`, `--f-drop-shadow-large` | | Elevation, drawn in `--f-color-shadow`: change the color, not the shadows. `-small` for surfaces in the flow (hovered `.card.clickable`, open `.details-menu`), the others for layers above the page |
| `--f-avatar-xsmall` … `-xxlarge` | `24px` … `240px` | Avatar sizes, from `$avatar-sizes` |
| `--f-focus-color` | `--f-color-brand-text` at 70% | The focus ring's color, set with the brand (`brand-colors()`), so a brand set on an element follows. 70% is the lightest alpha with 3:1 on bg-0 to bg-2 in both modes for the Spaces red; a lighter brand needs more |
| `--f-focus-width`, `--f-focus-offset`, `--f-focus-radius` | `2px`, `2px`, `--f-radius` | The keyboard focus ring, an outline on `:focus-visible`. The radius applies where the element has none of its own. A container that clips its children sets `--f-focus-offset: var(--f-focus-inset)` (the negative width), so the rings inside it are drawn inside the element |
| `--f-button-soft-background`, `--f-button-soft-border` | unset: a light (dark) shade of the button's color, its border a step toward the text | A soft button's surface and border. A tinted container sets them (`.callout`: `bg-1` and its color), or a soft button's own tint would vanish on it |
| `--f-icon-color`, `--f-icon-hover-color` | `text-2` mixed 75% into `bg-1`; `text-0` mixed 40% toward black (white in dark) | Icon buttons on a card (`.icon-button`, `.dots`, `.add`): at rest the lightest color with 3:1 on `bg-1`, on hover, keyboard focus or an open menu close to `text-0`. Follow `themed`; a consumer's own icon buttons use them to match |
| `--f-opacity-disabled` | `0.5` | A disabled control, `.disabled`, `$switch-opacity-disabled`. Not text: a disabled `.button` and a `.breadcrumbs .disabled` item keep their opacity and mute their colors, for 4.5:1 |
| `--f-z-header`, `-overlay`, `-dropdown` | `1000`, `1005`, `2000` | Page layers, from `$z-index`: the app header, an overlay above it, and dropdowns. Modals, popovers and the tooltip are in the top layer, above all of them. Stacking inside a component keeps small numbers |
| `--f-breakpoint-small` … `-xxlarge` | `0em` … `75em` | Breakpoint widths, from `$breakpoints`, for scripts to build a `matchMedia` query. Read-only (a media query cannot use a custom property) |

These are read with a fallback and not declared, so set them where they apply:

| Variable | Default | Role |
| --- | --- | --- |
| `--f-avatar-stack-overlap` | `0.6rem` | How far avatars in an `.avatar-stack` overlap |
| `--f-auto-grid-min-width` | `250px` | `.auto-grid`'s minimum column width |
| `--f-prose-offset-left` | `clamp(0.75rem, 2vw, 2rem)` | `.prose-layout`'s left column target width |
| `--f-prose-ch-factor` | `1` | Scales `.prose-layout`'s 70ch column for a font with a narrow or wide `0` |

A narrower or wider `.grid-container` needs no rebuild. The tokens are seeded from `$grid-container` and `$grid-container-padding` (`scss/custom-includes/foundation-spaces/xy-grid/_xy-grid.scss`); `.grid-container.full` keeps `padding: 0`, and Sass math on the cell gutters (`_s-scroll-snap.scss`, `custom-styles/_utilities.scss`) does not follow a runtime override.

```css
.narrow-page .grid-container { --f-grid-container-max: 48rem; }
```
