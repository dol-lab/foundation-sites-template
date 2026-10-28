# Buttons

`.button` plus a palette color, a fill (`.solid`, `.soft`, `.hollow`, `.clear`) and a size (`.tiny`, `.small`, `.large`). Join buttons with a [button group](button-group.md).

Three weights, so the main action stands out:

- **Neutral**, a plain `.button`: the card surface with a hairline border and a line of shadow. Most buttons.
- **Solid**, `.brand`, `.primary`, `.secondary` (or any color with `.solid`): the main action.
- **Soft**, `.success`, `.warning`, `.alert` (or any color with `.soft`): a tint with the label in the color's hue at the text's lightness, AA in both modes. A muted color (primary) gives a cool grey, not a pastel.

`.hollow` is an outline, for a secondary action next to a solid one; `.clear` has no surface until hovered. Hover darkens the surface; nothing moves. A disabled button (`.disabled` with `aria-disabled="true"`, or `[disabled]`) turns neutral with muted text instead of fading.

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
    <a href="#" class="button soft">Soft</a>
    <a href="#" class="button primary soft">Primary soft</a>
    <a href="#" class="button hollow">Hollow</a>
    <a href="#" class="button primary hollow">Primary hollow</a>
    <a href="#" class="button alert solid">Alert solid</a>
    <a href="#" class="button primary clear">Clear</a>
    <a href="#" class="button primary disabled" aria-disabled="true">Disabled</a>
    <button type="button" class="button primary dropdown">Dropdown</button>
</div>
```

## Sizes

Padding is in `em` and each size has its own height, so the proportions hold. Default matches an input's height.

```html example
<div>
    <a href="#" class="button tiny">Tiny</a>
    <a href="#" class="button small">Small</a>
    <a href="#" class="button">Default</a>
    <a href="#" class="button large">Large</a>
    <a href="#" class="button expanded">Expanded</a>
</div>
```

## Icon buttons

`.dots` (a menu), `.icon-button` (a link around an icon) and `.close-button` share one square box, an inset focus ring and `--f-icon-color`, darker on hover, keyboard focus or while their menu is open. `.close-button` sits in the top right corner of its positioned parent: a callout, a modal, here the preview.

```html example row
<button class="button p-0 m-0 clear dots" type="button" aria-label="More"></button>
<a class="icon-button" href="#" aria-label="Edit"><i class="far fa-edit" aria-hidden="true"></i></a>
<button class="close-button" type="button" aria-label="Close"><span aria-hidden="true">&times;</span></button>
```
