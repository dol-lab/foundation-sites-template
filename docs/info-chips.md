# Info chips

A static chip is flat: a hairline ring, no fill. A clickable one gets a surface and a shadow, and its markup has to say so: `[href]`, `<button>`, or `.clickable` when the handler is in JS. A chip inside a link stays flat, because the row is the click target. Spaces prints every chip as an `<a>`, with an `href` only when it links, in an `.info-chips.small`.

```html example
<div class="info-chips small">
    <a class="info-chip">
        <span class="tag-icon"><i class="fas fa-tag"></i></span>
        <span class="key">Static</span>
        <span class="value">12</span>
    </a>
    <a class="info-chip" href="#">
        <span class="tag-icon"><i class="fas fa-tag"></i></span>
        <span class="key">Link</span>
        <span class="value">12</span>
    </a>
    <span class="info-chip clickable">
        <span class="tag-icon"><i class="fas fa-tag"></i></span>
        <span class="key">Clickable (JS)</span>
        <span class="value">12</span>
    </span>
</div>
```

## Round and hollow

`.round` changes only the shape. `.hollow` is an outline: no fill on any segment and a firmer ring. Use the default chip for information in a row of text or a card; use `.hollow` where a tint would clash, on a tinted or colored surface or as a tag inside an input (the profile's Tagify tags in Spaces).

```html example
<div class="info-chips">
    <span class="info-chip round"><span class="key">Static</span><span class="value">round</span></span>
    <a class="info-chip round" href="#"><span class="key">Link</span><span class="value">round</span></a>
    <span class="info-chip hollow round"><span class="key">Static</span><span class="value">hollow</span></span>
    <a class="info-chip hollow round" href="#"><span class="key">Link</span><span class="value">hollow</span></a>
</div>
```

## Palette color

```html example
<div class="info-chips success">
    <span class="info-chip"><span class="key">Static</span><span class="value">success</span></span>
    <a class="info-chip" href="#"><span class="key">Link</span><span class="value">success</span></a>
</div>
```
