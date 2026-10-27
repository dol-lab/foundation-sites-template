# Space card

`.card` with a `.card-anchor` around a `.clipped.feature-image`: the Space's header image cropped to 80px, its name in a frosted `.clipped-title`, an icon (privacy) before the name. Without an image the frame shows a pattern in the surface colors. Keyboard focus outlines the whole card. The same frame with `.large` is a Space's own header (200px, two lines of title).

```html example
<div class="auto-grid gap-3" style="--f-auto-grid-min-width: 200px">
    <div class="card">
        <a class="card-anchor" href="#">
            <div class="clipped feature-image">
                <div class="clipped-title"><span>Typography &amp; Editorial Design</span></div>
                <img src="assets/img/spaces/course-typography.jpg" alt="" loading="lazy" decoding="async">
            </div>
        </a>
    </div>
    <div class="card">
        <a class="card-anchor" href="#">
            <div class="clipped feature-image">
                <div class="clipped-title"><i class="fa fa-lock" title="Private: only members read its posts"></i><span>Student Council</span></div>
                <img src="assets/img/spaces/student-council.jpg" alt="" loading="lazy" decoding="async">
            </div>
        </a>
    </div>
    <div class="card">
        <a class="card-anchor" href="#">
            <div class="clipped feature-image">
                <div class="clipped-title"><span>A Space without a header image</span></div>
            </div>
        </a>
    </div>
</div>
```

Spaces adds its own parts in spaces-markup and defaultspace: category chips over the image (`.space-category-chips`), the thumbnail as the full header's placeholder (`--header-image-preview`), status icons and a dot menu in the card's sections.
