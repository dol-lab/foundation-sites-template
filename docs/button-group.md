# Button group

`.button-group` joins buttons (and a `select` or `input`) into one control: only its outer corners are rounded, and the buttons overlap so their borders collapse into one line. Fill, color and size classes on the group apply to every button in it; a button's own class beats the group's (Week and Delete below).

```html example row
<div class="button-group">
    <button class="button" type="button" aria-label="Bold"><i class="fa-solid fa-bold" aria-hidden="true"></i></button>
    <button class="button" type="button" aria-label="Italic"><i class="fa-solid fa-italic" aria-hidden="true"></i></button>
    <button class="button" type="button" aria-label="Link"><i class="fa-solid fa-link" aria-hidden="true"></i></button>
</div>
<div class="button-group hollow primary">
    <a href="#" class="button">Day</a>
    <a href="#" class="button solid" aria-current="true">Week</a>
    <a href="#" class="button">Month</a>
</div>
<div class="button-group secondary">
    <button class="button" type="button">Publish</button>
    <button class="button dropdown" type="button" aria-label="More ways to publish"></button>
</div>
<div class="button-group soft">
    <button class="button" type="button">Export</button>
    <button class="button alert" type="button">Delete</button>
</div>
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
    <a href="#" class="button">Posts</a>
    <a href="#" class="button">Events</a>
    <a href="#" class="button">Files</a>
</div>
<div class="button-group hollow stacked-for-small">
    <a href="#" class="button">Accept</a>
    <a href="#" class="button">Maybe</a>
    <a href="#" class="button">Decline</a>
</div>
```
