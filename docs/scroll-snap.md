# Scroll snap

A row that scrolls sideways and snaps each element to its start: `.scroll-snap-container-x` on the parent, `.scroll-snap-element` on the children. Each element is as wide as the row unless a width modifier says otherwise. Spaces uses it for the events widget. A row of links scrolls as Tab moves through them. A row of plain content is scrolled with the arrow keys once focused: Chromium and Firefox focus such a scroller themselves, Safari needs `tabindex="0"` on it (then also `role="region"` and an `aria-label`, as below).

```html example
<div class="scroll-snap-container-x width-medium fade-edges" tabindex="0" role="region" aria-label="Elements">
    <div class="scroll-snap-element"><div class="card"><div class="card-section">Element 1</div></div></div>
    <div class="scroll-snap-element"><div class="card"><div class="card-section">Element 2</div></div></div>
    <div class="scroll-snap-element"><div class="card"><div class="card-section">Element 3</div></div></div>
    <div class="scroll-snap-element"><div class="card"><div class="card-section">Element 4</div></div></div>
    <div class="scroll-snap-element"><div class="card"><div class="card-section">Element 5</div></div></div>
</div>
```

## Modifiers

All of them go on `.scroll-snap-container-x`.

- Where an element snaps: start by default, `.snap-align-center` or `.snap-align-end`.
- Element width, relative: `.width-small` (20%), `.width-medium` (40%), `.width-large` (60%), `.width-xlarge` (80%). Default: 100%.
- Element width, fixed: `.width-fixed-small` (240px), `.width-fixed-medium` (320px), `.width-fixed-large` (480px).
- `.fade-edges` fades the row out at its left and right edge (`--f-spacing-3` wide), on any background.

## Bleeding out of the grid

Inside a `.grid-container`, `.scroll-snap-grid-container` lets the row run to the window's edges while its first element stays aligned with the grid. `.reverse-grid-container` around it widens it to the full window.

```html
<div class="grid-container">
    <div class="reverse-grid-container">
        <div class="scroll-snap-container-x scroll-snap-grid-container">
            <div class="scroll-snap-element">…</div>
        </div>
    </div>
</div>
```
