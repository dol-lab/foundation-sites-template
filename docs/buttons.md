# Buttons

`.button` plus a palette color, a fill (`.hollow`, `.clear`) and a size (`.tiny`, `.small`, `.large`).

## Colors

```html example
<div>
    <a href="#" class="button">Default</a>
    <a href="#" class="button brand">Brand</a>
    <a href="#" class="button primary">Primary</a>
    <a href="#" class="button secondary">Secondary</a>
    <a href="#" class="button success">Success</a>
    <a href="#" class="button warning">Warning</a>
    <a href="#" class="button alert">Alert</a>
</div>
```

## Fill

```html example
<div>
    <a href="#" class="button primary hollow">Hollow</a>
    <a href="#" class="button primary clear">Clear</a>
    <a href="#" class="button primary disabled" aria-disabled="true">Disabled</a>
    <button type="button" class="button primary dropdown">Dropdown</button>
</div>
```

## Sizes

```html example
<div>
    <a href="#" class="button tiny">Tiny</a>
    <a href="#" class="button small">Small</a>
    <a href="#" class="button">Default</a>
    <a href="#" class="button large">Large</a>
    <a href="#" class="button expanded">Expanded</a>
</div>
```

## Button group

```html example
<div class="button-group">
    <a href="#" class="button">One</a>
    <a href="#" class="button">Two</a>
    <a href="#" class="button">Three</a>
</div>
```

## Dots and close

```html example row
<button class="button p-0 m-0 clear dots" type="button" aria-label="More"></button>
<button class="close-button" type="button" aria-label="Close"><span aria-hidden="true">&times;</span></button>
```
