# Colors

Custom properties are the source of truth. Use the roles, never a literal, so Space theming and dark mode reach every component. The settings below the index change the Space color and the brand, the button on the header image cycles images with their Space colors: the surfaces follow.

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

Each color has `-contrast` (text on it, AA 4.5:1 in both modes) and `-darker` (hover, a `color-mix` with black). They are defined in `scss/_colors.scss` and printed by `foundation-apply-theme()` in `scss/_custom-functions.scss`. The same values serve both modes, so as small text on a dark page they fall below 4.5; a runtime brand needs a contrast pair of its own that passes.

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

Brand-colored text on the page takes `--f-color-brand-text` (prose links in `.brand-links`): the brand in light mode, darkened to at most oklch lightness 0.5 so it keeps 5:1 on every light surface, and lifted to `hollow-label()`'s lightness in dark mode, where the brand itself is below AA.

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

The `themed` attribute plus an inline `--f-color-theme` tints the surfaces and text of an element toward that hue. The rule matches the `style` attribute, so a value set from a stylesheet does not tint. On `<html>` the body also gets a radial gradient in `--f-bg-gradient-color`. Spaces themes only `<html>` (the Space's color); any other element can be tinted the same way, apart from the page's theme.

```html
<html themed style="--f-color-theme: #975938">
<article class="card" themed style="--f-color-theme: #367855">…</article>
```

Each color tints both modes: light keeps its hue at a high lightness with little chroma, dark at a low one; text, borders, tint and shadow follow. The formulas are in `scss/custom-styles/_root-variables.scss`.

```html demo
<div class="demo-tints">
    <div class="demo-layers" themed style="--f-color-theme: #975938"><code class="has-swatch"><span class="swatch" style="--swatch: var(--f-color-theme)"></span>#975938</code> page<div>card<div>on a card</div></div></div>
    <div class="demo-layers" themed style="--f-color-theme: #d4b106"><code class="has-swatch"><span class="swatch" style="--swatch: var(--f-color-theme)"></span>#d4b106</code> page<div>card<div>on a card</div></div></div>
    <div class="demo-layers" themed style="--f-color-theme: #2e9e4f"><code class="has-swatch"><span class="swatch" style="--swatch: var(--f-color-theme)"></span>#2e9e4f</code> page<div>card<div>on a card</div></div></div>
    <div class="demo-layers" themed style="--f-color-theme: #1798b0"><code class="has-swatch"><span class="swatch" style="--swatch: var(--f-color-theme)"></span>#1798b0</code> page<div>card<div>on a card</div></div></div>
    <div class="demo-layers" themed style="--f-color-theme: #3b5bdb"><code class="has-swatch"><span class="swatch" style="--swatch: var(--f-color-theme)"></span>#3b5bdb</code> page<div>card<div>on a card</div></div></div>
    <div class="demo-layers" themed style="--f-color-theme: #c2368f"><code class="has-swatch"><span class="swatch" style="--swatch: var(--f-color-theme)"></span>#c2368f</code> page<div>card<div>on a card</div></div></div>
</div>
```

Inside a `themed` element `--f-color-bg-1` is the tinted card, not the page: pick a role by what it is, not by the color it shows.

## Using the roles

Set `background` and `color` together, both from roles, or neither. One without the other is what breaks dark mode: a hard-coded white box with inherited light text, or dark text on an inherited dark surface.

```css
.thing {
  background: var(--f-color-bg-1);
  color: var(--f-color-text-1);
  border: 1px solid var(--f-color-border-1);
  box-shadow: var(--f-drop-shadow);
}
```

In PHP or inline styles, add a light fallback for when the stylesheet is absent: `var( --f-color-bg-1, #fff )`. For a notice use a [callout](callouts.md) with a palette class, not colors of your own.

### Overriding a component's colors

If your element also has palette classes, keep your color rule weaker than them, so the palette still applies: `.my-notice` (one class) yields to `.callout.success` (two). Load order does not help, since a `<style>` printed in the footer comes after the stylesheet and wins every tie. Layout rules are not affected and may be as specific as they need.

### Verifying

```js
document.documentElement.dataset.theme = "dark";
document.documentElement.dataset.theme = "light";
delete document.documentElement.dataset.theme; // back to the OS
```

Cover the OS path with DevTools' "Emulate prefers-color-scheme", and read computed values, not the Styles pane.
