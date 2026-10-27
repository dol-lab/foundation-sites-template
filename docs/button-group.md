# Button group

`.button-group` joins buttons (and a `select` or `input`) into one control: only its outer corners are rounded. Solid fills are parted by a 1px gap, hollow ones overlap so their borders collapse into one line. Fill, color and size classes on the group apply to every button in it.

## Solid

```html example
<div class="button-group">
    <a href="#" class="button">One</a>
    <a href="#" class="button">Two</a>
    <a href="#" class="button">Three</a>
</div>
<div class="button-group secondary small">
    <a href="#" class="button">One</a>
    <a href="#" class="button">Two</a>
    <a href="#" class="button alert">Delete</a>
</div>
```

## Hollow

```html example
<div class="button-group hollow">
    <a href="#" class="button">One</a>
    <a href="#" class="button">Two</a>
    <a href="#" class="button">Three</a>
</div>
<div class="button-group hollow primary small">
    <a href="#" class="button">One</a>
    <a href="#" class="button">Two</a>
    <a href="#" class="button">Three</a>
</div>
```

## With a select

```html example
<div class="button-group">
    <select aria-label="Role">
        <option>Change role to…</option>
        <option>Member</option>
    </select>
    <button class="button" type="button">Apply</button>
</div>
```

## Expanded and stacked

`.expanded` gives every button the same width. `.stacked` stacks them, `.stacked-for-small` and `.stacked-for-medium` only below medium and large.

```html example
<div class="button-group expanded">
    <a href="#" class="button">One</a>
    <a href="#" class="button">Two</a>
    <a href="#" class="button">Three</a>
</div>
<div class="button-group hollow stacked-for-small">
    <a href="#" class="button">One</a>
    <a href="#" class="button">Two</a>
    <a href="#" class="button">Three</a>
</div>
```
