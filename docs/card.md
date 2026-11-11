# Card

`.card`: a surface in `--f-color-bg-1` with the theme's radius that clips its content. Its parts stack in a column: a `.card-header` holding a `.card-title`, then `.card-section`s (they grow) and `.card-divider`s (a hairline above each, none on the first child). Sections and dividers are padded by spacing step 3 and lay out their content in a column; `.flex-dir-row` turns them. Media as the card's first child (`.clipped`, `img`, `picture`, `video`, `figure`) takes the card's top corners.

```html example wide
<div class="auto-grid gap-4">
    <div class="card">
        <div class="clipped letterbox"><img src="assets/img/k-k-Y0DTcx1pGpc-unsplash.jpg" alt=""></div>
        <div class="card-header"><h3 class="card-title">Header and title</h3></div>
        <div class="card-section"><p>A section grows to fill the card.</p></div>
        <div class="card-divider small">A divider sets itself off by a hairline.</div>
    </div>
    <div class="card">
        <div class="card-section"><p>A card of one section.</p></div>
        <div class="card-divider flush"><textarea rows="2" placeholder="A flush divider: the field fills it edge to edge"></textarea></div>
    </div>
</div>
```

## Modifiers

- `.card-anchor` as the card's only child makes the whole card one link; the focus ring is drawn around the card.
- `.clickable` gives the card a pointer and the small drop shadow on hover. Opt in only where the whole card acts (a `.card-anchor`, or a script instead of an `[href]`): a card that shows a pointer and does nothing breaks a promise.
- `.flush` on a section or divider: no padding, and a field directly inside loses its border, for content that fills the row edge to edge.
- `.small` on a section or divider: a tighter line height for a one-line note.
- `.muted`: half opacity.
- `.overflow-initial`: the card stops clipping, so a menu inside can leave it. `.overflow-auto` scrolls instead.
- A link, button, `details` or `summary` that is a direct child spans the card's edge, so its focus ring is drawn inside (see [accessibility](accessibility.md)).

```html example wide
<div class="auto-grid gap-4">
    <div class="card clickable">
        <a class="card-anchor" href="#card">
            <div class="clipped letterbox tint"><img src="assets/img/redd-francisco-c7xBEFBJhkg-unsplash.jpg" alt=""></div>
            <div class="card-section"><p>The whole card is one link: hover it, or reach it with Tab.</p></div>
        </a>
    </div>
    <div class="card muted">
        <div class="card-section"><p>A muted card.</p></div>
    </div>
</div>
```

## Clipped media

`.clipped` frames an image and crops it: `.square` (1:1) and `.letterbox` (16:9) are aspect-ratio boxes that taller content grows, `.height-50` to `.height-400` (steps of 50) fix the height in pixels. `.tint` lays a veil of the text color over the image, so text on it stays legible (`.tint-inverse` one of the page color); it deepens while its link is hovered or active. `.feature-image` is a Space's header image (80px on a card, `.large` 200px on the Space), with a `.clipped-title` over it; without an image it shows the `.cube-grid` pattern.

```html example wide
<div class="auto-grid gap-4">
    <div class="clipped square rounded"><img src="assets/img/pb-foundation.jpg" alt=""></div>
    <div class="clipped height-150 rounded"><img src="assets/img/chris-lutke-RJ0AtWtDlKM-unsplash.jpg" alt=""></div>
    <div class="card">
        <div class="clipped feature-image"><span class="clipped-title">No image</span></div>
        <div class="card-section"><p>A feature image on a card.</p></div>
    </div>
</div>
```
