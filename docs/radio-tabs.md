# Radio tabs

`.radio-tabs`: a segmented control for one choice out of a few, made of radio buttons. A `<fieldset>` named by `aria-label` (or a `<legend>`) holds one `<label class="radio-tabs-option">` per choice: an icon, the radio, then the label text in a `<span>`. The radio fills its option and is invisible, so the whole option is the hit target; a pill slides to the checked option. Keyboard: the group is one Tab stop and the arrow keys move the choice (native radios), the focused option gets the ring.

```html example
<fieldset class="radio-tabs radio-tabs-full" aria-label="Sort by">
    <label class="radio-tabs-option"><i class="fa fa-clock"></i><input type="radio" name="demo-sort" value="new" checked><span>Newest</span></label>
    <label class="radio-tabs-option"><i class="fa fa-fire"></i><input type="radio" name="demo-sort" value="hot"><span>Active</span></label>
    <label class="radio-tabs-option"><i class="fa fa-font"></i><input type="radio" name="demo-sort" value="az"><span>A to Z</span></label>
</fieldset>
```

## Variants

- Content: `.radio-tabs-full` (icon and text), `.radio-tabs-icons` (icon only: the text is `display: none`, so the label's `aria-label` names the radio), `.radio-tabs-text` (text only).
- `.hollow`: an outlined container instead of a filled one.
- `.small`: compact.
- `.stretch`: spans its container, the options share the width.

```html example
<fieldset class="radio-tabs radio-tabs-icons small hollow" aria-label="Color theme">
    <label class="radio-tabs-option" aria-label="Light"><i class="fa fa-sun"></i><input type="radio" name="demo-mode" value="light"><span>Light</span></label>
    <label class="radio-tabs-option" aria-label="Dark"><i class="fa fa-moon"></i><input type="radio" name="demo-mode" value="dark"><span>Dark</span></label>
    <label class="radio-tabs-option" aria-label="System"><i class="fa fa-desktop"></i><input type="radio" name="demo-mode" value="system" checked><span>System</span></label>
</fieldset>
<fieldset class="radio-tabs radio-tabs-text stretch mt-4" aria-label="View">
    <label class="radio-tabs-option"><input type="radio" name="demo-view" value="list" checked><span>List</span></label>
    <label class="radio-tabs-option"><input type="radio" name="demo-view" value="grid"><span>Grid</span></label>
</fieldset>
```
