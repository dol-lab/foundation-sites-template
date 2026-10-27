# Breadcrumbs

`.breadcrumbs` is a path from parent to child, its links separated by a chevron; the last item is the current page, `.disabled` one that cannot be visited. A plain list of siblings (post meta, a row of names) is a `.dot-list` and keeps the dot.

```html example
<nav aria-label="You are here">
    <ul class="breadcrumbs">
        <li><a href="#">Spaces</a></li>
        <li><a href="#">Courses</a></li>
        <li class="disabled">Summer term</li>
        <li><span class="show-for-sr">Current: </span>Typography</li>
    </ul>
</nav>
```

## As a row title

Spaces also borrows `.breadcrumbs` for a title that is not on a card: a list with one item that names the cards below it. The `[breadcrumb title="…"]` shortcode prints it, and so does the title of a widget shown without a card (the event calendar).

```html example
<div class="grid-x grid-margin-y">
    <div class="cell flex align-middle">
        <ul class="breadcrumbs p-0">
            <li><strong>Upcoming events</strong></li>
        </ul>
    </div>
    <div class="cell card"><div class="card-section">Opening of the summer show</div></div>
    <div class="cell card"><div class="card-section">Workshop: risograph printing</div></div>
</div>
```

## Info chips

A path of chips, such as a term and its ancestors, is a `ul.breadcrumbs.info-chips` with one chip per `<li>`: the separator belongs to the item, since a chip clips its content, and the chip keeps its own look. Spaces prints a taxonomy archive's terms this way above the stream.

```html example
<ul class="breadcrumbs info-chips small">
    <li>
        <a class="info-chip" href="#"><span class="tag-icon"><i class="fas fa-tag"></i></span><span class="key">Design</span><span class="value">42</span></a>
    </li>
    <li>
        <a class="info-chip" href="#"><span class="tag-icon"><i class="fas fa-tag"></i></span><span class="key">Typography</span><span class="value">12</span></a>
    </li>
</ul>
```
