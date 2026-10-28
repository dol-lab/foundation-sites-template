# Buttons

`.button` plus a palette color, a fill (`.hollow`, `.clear`) and a size (`.tiny`, `.small`, `.large`). Join buttons with a [button group](button-group.md).

A plain `.button` is a soft neutral fill; use `.secondary` for a dark solid one. Hollow labels take their color's hue (plain: primary's) at the text's lightness, so they stay AA in both modes.

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

## Dots and close

Icon buttons on a card (`.dots`, an `.icon-button` link around an icon) take `--f-icon-color`, darker on hover, keyboard focus or while their menu is open.

```html example row
<button class="button p-0 m-0 clear dots" type="button" aria-label="More"></button>
<a class="icon-button" href="#" aria-label="Edit"><i class="far fa-edit" aria-hidden="true"></i></a>
<button class="close-button" type="button" aria-label="Close"><span aria-hidden="true">&times;</span></button>
```
