# Tabs

Foundation's tabs: `.tabs` with `data-tabs` and an id, and a `.tabs-content` naming that id. Each `.tabs-title` links to its `.tabs-panel` by id (or names it in `data-tabs-target`). Mark the initial title and panel `.is-active`. Once initialised, the active title is styled by its link's `aria-selected`, which Foundation sets whatever the active class: a tab bar inside a dropdown menu sets `data-link-active-class` and `data-panel-active-class` to `is-active-tab`, since the menu strips `li.is-active` when it closes.

```html example
<ul class="tabs line" data-tabs id="demo-tabs">
    <li class="tabs-title is-active"><a href="#demo-panel-1" aria-selected="true">Text</a></li>
    <li class="tabs-title"><a href="#demo-panel-2">Image</a></li>
    <li class="tabs-title"><a href="#demo-panel-3">Count <span class="badge small">42</span></a></li>
</ul>
<div class="tabs-content" data-tabs-content="demo-tabs">
    <div class="tabs-panel is-active py-3" id="demo-panel-1">
        <p>The first panel.</p>
    </div>
    <div class="tabs-panel py-3" id="demo-panel-2">
        <img class="thumbnail" src="assets/img/annie-spratt-KAR7AFxfQug-unsplash.jpg" alt="Flowers in a vase">
    </div>
    <div class="tabs-panel py-3" id="demo-panel-3">
        <p>A title can carry a badge.</p>
    </div>
</div>
```

## Styles

The examples below show the titles only: they switch, but have no `.tabs-content`. Plain `.tabs` underline the active tab, and the underline slides to the next one on a change (a jump under reduced motion). `.line` adds a hairline above the panel, `.bar` fills the active title instead, separates the titles and suits a card's top edge, `.expanded` spreads them over the width. The active title is `.is-active` or carries `aria-selected` (Foundation sets it on the link, React Aria on the title).

```html example
<ul class="tabs line expanded" data-tabs id="demo-tabs-line">
    <li class="tabs-title is-active"><a href="#demo-tab-line-1" aria-selected="true">Line</a></li>
    <li class="tabs-title"><a href="#demo-tab-line-2">Expanded</a></li>
</ul>
```

```html example
<div class="card">
    <ul class="tabs bar expanded" data-tabs id="demo-tabs-bar">
        <li class="tabs-title is-active"><a href="#demo-tab-bar-1" aria-selected="true">Bar</a></li>
        <li class="tabs-title"><a href="#demo-tab-bar-2">In a card</a></li>
    </ul>
</div>
```

## Sizes

`.small` and `.large` change the font size.

```html example
<ul class="tabs small" data-tabs id="demo-tabs-small">
    <li class="tabs-title is-active"><a href="#demo-tab-small-1" aria-selected="true">Small</a></li>
    <li class="tabs-title"><a href="#demo-tab-small-2">Tab 2</a></li>
</ul>
<ul class="tabs large" data-tabs id="demo-tabs-large">
    <li class="tabs-title is-active"><a href="#demo-tab-large-1" aria-selected="true">Large</a></li>
    <li class="tabs-title"><a href="#demo-tab-large-2">Tab 2</a></li>
</ul>
```

## Long titles and icons

Wrap the title in a `<span>`: a long one is truncated, and an icon keeps its place next to it.

```html example
<ul class="tabs" data-tabs id="demo-tabs-long" style="max-width: 20rem">
    <li class="tabs-title is-active"><a href="#demo-tab-long-1" aria-selected="true"><i class="fa fa-rocket"></i> <span>A very long title that will not fit</span></a></li>
    <li class="tabs-title"><a href="#demo-tab-long-2"><span>Another long title</span></a></li>
</ul>
```

## Label is active

Where space is short, `.label-is-active` shows only the icons and the active tab's label. Every title needs an icon and its label in a `<span>`.

```html example
<ul class="tabs label-is-active" data-tabs id="demo-tabs-label">
    <li class="tabs-title is-active"><a href="#demo-tab-label-1" aria-selected="true"><i class="fa fa-rocket"></i> <span>Rockets</span></a></li>
    <li class="tabs-title"><a href="#demo-tab-label-2"><i class="fa fa-satellite"></i> <span>Satellites</span></a></li>
    <li class="tabs-title"><a href="#demo-tab-label-3"><i class="fa fa-user-astronaut"></i> <span>Astronauts</span></a></li>
</ul>
```
