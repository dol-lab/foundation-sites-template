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

## Palette

Each color has `-contrast` (text on it) and `-darker` (hover).

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
