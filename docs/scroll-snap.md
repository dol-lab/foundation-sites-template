# Scroll snap

A row that scrolls sideways and snaps each element into place: `.scroll-snap-container-x` on the parent, `.scroll-snap-element` on the children. Any element can be one, also a grid cell such as `.medium-6`.

```html example
<div class="scroll-snap-container-x snap-align-center width-medium">
    <div class="scroll-snap-element"><div class="card"><div class="card-section">Element 1</div></div></div>
    <div class="scroll-snap-element"><div class="card"><div class="card-section">Element 2</div></div></div>
    <div class="scroll-snap-element"><div class="card"><div class="card-section">Element 3</div></div></div>
    <div class="scroll-snap-element"><div class="card"><div class="card-section">Element 4</div></div></div>
    <div class="scroll-snap-element"><div class="card"><div class="card-section">Element 5</div></div></div>
</div>
```

## Modifiers

All of them go on `.scroll-snap-container-x`.

- Where an element snaps: `.snap-align-start`, `.snap-align-center`, `.snap-align-end`.
- Element width, relative: `.width-small` (20%), `.width-medium` (40%), `.width-large` (60%), `.width-xlarge` (80%). Default: 100%.
- Element width, fixed: `.width-fixed-small` (240px), `.width-fixed-medium` (320px), `.width-fixed-large` (480px).
- Per breakpoint: `.<breakpoint>-scroll-snap` stacks the elements below the breakpoint and scrolls from there up; `.<breakpoint>-no-scroll-snap` stops scrolling from there up.

## Arrows

Wrap the container in `.left-right-navigation` for arrows that show on hover.

```html
<div class="left-right-navigation">
    <div class="scroll-snap-container-x">…</div>
</div>
```

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
