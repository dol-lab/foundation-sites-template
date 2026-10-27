# Colors

Custom properties are the source of truth. Use the roles, never a literal, so Space theming and dark mode reach every component. Pick a Space color above the header to see the surfaces follow it.

## Surfaces

The backgrounds are layers: the page, a card on it, and a surface on the card (radio tabs, a disabled field).

```html demo
<div class="demo-layers">
    <code>--f-color-bg-0</code><small>page</small>
    <div>
        <code>--f-color-bg-1</code><small>cards</small>
        <div><code>--f-color-bg-2</code><small>on a card</small></div>
    </div>
</div>
```

## Text, borders

```html demo
<div class="demo-swatches">
    <div class="demo-swatch" style="--swatch: var(--f-color-text-0)"><code>--f-color-text-0</code><small>headings</small></div>
    <div class="demo-swatch" style="--swatch: var(--f-color-text-1)"><code>--f-color-text-1</code><small>body</small></div>
    <div class="demo-swatch" style="--swatch: var(--f-color-text-2)"><code>--f-color-text-2</code><small>muted</small></div>
    <div class="demo-swatch" style="--swatch: var(--f-color-border-0)"><code>--f-color-border-0</code><small>hairline</small></div>
    <div class="demo-swatch" style="--swatch: var(--f-color-border-2)"><code>--f-color-border-2</code><small>firm</small></div>
</div>
```

More roles: `--f-color-border-1` (between the two), `--f-color-bg-1-untinted` (`bg-1` before a `themed` ancestor tints it), `--f-color-tint` (hover wash: `text-0` at 7%), `--f-color-shadow` (the color of the drop shadows: black at 13% light or 50% dark, tinted under `themed`) and `--f-color-neutral-100` … `-700` (the greys the roles are made of, from page to text; they swap in dark mode). The borders are `text-0` at 7, 12 and 16%.

## Palette

Each color has `-contrast` (text on it) and `-darker` (hover, a `color-mix` with black). They are defined in `scss/_colors.scss` and printed by `foundation-apply-theme()` in `scss/_custom-functions.scss`.

```html demo
<div class="demo-swatches">
    <div class="demo-swatch" style="--swatch: var(--f-color-brand)"><code>brand</code></div>
    <div class="demo-swatch" style="--swatch: var(--f-color-primary)"><code>primary</code></div>
    <div class="demo-swatch" style="--swatch: var(--f-color-secondary)"><code>secondary</code></div>
    <div class="demo-swatch" style="--swatch: var(--f-color-success)"><code>success</code></div>
    <div class="demo-swatch" style="--swatch: var(--f-color-warning)"><code>warning</code></div>
    <div class="demo-swatch" style="--swatch: var(--f-color-alert)"><code>alert</code></div>
</div>
```

Override the brand at runtime with `--f-color-brand-base` and `--f-color-brand-base-contrast`, on `:root` or inline on a `themed` element. `--f-color-brand` resolves where it is declared, so only those two redeclare it.

```css
html {
  --f-color-brand-base: oklch(0.6 0.18 25);
  --f-color-brand-base-contrast: white;
}
```

## Light and dark

The palette is written with `light-dark()` on `:root`, which carries `color-scheme: light dark`, so it follows the OS. `data-theme="light"` or `"dark"` sets `color-scheme` on any element, and the roles flip for that subtree (a `light-dark()` value resolves against the element that uses it). Native controls, scrollbars and `<select>` popups follow `color-scheme` too.

```html
<html data-theme="dark">
```

The backend build is always light: it prints the palette with `foundation-apply-theme("light")` and sets no `color-scheme` on a page it does not own. `app.css` is not loaded in wp-admin or the block-editor iframe, so those stay light without an exclusion.

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

## When dark mode looks broken

| Symptom | Cause |
| --- | --- |
| Light text on a white box | Hard-coded `background: #fff` with no `color` |
| Dark text on a dark box | Hard-coded `color: #333` with no `background` |
| Component ignores the theme | Hex values instead of `--f-color-*` roles |
| Shadow looks like a grey halo | Hard-coded `rgba(0,0,0,…)`; use `var(--f-drop-shadow)` |
| Borders vanish | Fixed grey; use `--f-color-border-0..2` |
| Your override loses or breaks dark mode | Specificity, see below |
| Always light in wp-admin or `ark` | Intended: the backend build is light only |

**The one rule:** never set `background` without `color`, or the reverse. Set both from roles, or neither.

### Use roles and components

```css
.thing {
  background: var(--f-color-bg-1);
  color: var(--f-color-text-1);
  border: 1px solid var(--f-color-border-1);
  box-shadow: var(--f-drop-shadow);
}
```

In PHP or inline styles, add a light fallback for when the stylesheet is absent: `var( --f-color-bg-1, #fff )`.

For a notice use a [callout](callouts.md) with a palette class, not colors of your own.

### Specificity

A fallback rule for a component that also carries theme classes must be less specific than the theme (`.my-notice` at 0,1,0 loses to `.callout.success` at 0,2,0). Source order does not help: a `<style>` printed in the footer comes after the stylesheet and wins at equal specificity. Only colors should yield; layout rules may be as specific as they need.

### Tinted surfaces

Inside a `themed` subtree the surfaces derive from its `--f-color-theme`, so `--f-color-bg-1` there is the tinted card, not the page. Pick a role by meaning, not by the color you saw once.

### Verifying

```js
document.documentElement.dataset.theme = "dark";
document.documentElement.dataset.theme = "light";
delete document.documentElement.dataset.theme; // back to the OS
```

Cover the OS path with DevTools' "Emulate prefers-color-scheme", and read computed values, not the Styles pane.
