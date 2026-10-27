# Forms

Wrap a field in its `<label>`. Fields stretch to the width of their cell.

```html example
<form class="grid-x grid-margin-x" onsubmit="return false">
    <label class="cell medium-6">Text
        <input type="text" placeholder="Placeholder">
    </label>
    <label class="cell medium-6">Disabled
        <input type="text" disabled placeholder="Disabled">
    </label>
    <label class="cell medium-6">Select
        <select>
            <option>Bachelor</option>
            <option>Master</option>
        </select>
    </label>
    <label class="cell medium-6">Input group
        <span class="input-group">
            <span class="input-group-label">€</span>
            <input class="input-group-field" type="number">
            <span class="input-group-button">
                <input type="submit" class="button success" value="Submit">
            </span>
        </span>
    </label>
    <label class="cell">Textarea
        <textarea rows="3"></textarea>
    </label>
</form>
```

## Checkboxes and radios

The native input is hidden; `.checkbox-label` draws it. A `.label-wrapper` makes the visible text part of the click target; inside it the drawn control is an `aria-hidden` `<span>`, as labels must not nest.

```html example
<label class="label-wrapper" for="demo-check-1">
    <span class="checkbox small success">
        <input class="checkbox-input" id="demo-check-1" type="checkbox" checked>
        <span class="checkbox-label" aria-hidden="true"></span>
    </span>
    <span>Checked</span>
</label>
<label class="label-wrapper" for="demo-check-2">
    <span class="checkbox small">
        <input class="checkbox-input" id="demo-check-2" type="checkbox">
        <span class="checkbox-label" aria-hidden="true"></span>
    </span>
    <span>Unchecked</span>
</label>
<label class="label-wrapper" for="demo-radio-1">
    <span class="radio small">
        <input class="radio-input" id="demo-radio-1" type="radio" name="demo-radio" checked>
        <span class="radio-label" aria-hidden="true"></span>
    </span>
    <span>Radio one</span>
</label>
<label class="label-wrapper" for="demo-radio-2">
    <span class="radio small">
        <input class="radio-input" id="demo-radio-2" type="radio" name="demo-radio">
        <span class="radio-label" aria-hidden="true"></span>
    </span>
    <span>Radio two</span>
</label>
```

## Switches

`.switch` takes a palette color and `.tiny`, `.small` or `.large`.

```html example row
<div class="switch">
    <input class="switch-input" role="switch" id="demo-switch-1" type="checkbox" checked>
    <label class="switch-paddle" for="demo-switch-1"><span class="show-for-sr">Default</span></label>
</div>
<div class="switch primary">
    <input class="switch-input" role="switch" id="demo-switch-2" type="checkbox" checked>
    <label class="switch-paddle" for="demo-switch-2"><span class="show-for-sr">Primary</span></label>
</div>
<div class="switch success">
    <input class="switch-input" role="switch" id="demo-switch-3" type="checkbox" checked>
    <label class="switch-paddle" for="demo-switch-3"><span class="show-for-sr">Success</span></label>
</div>
<div class="switch alert">
    <input class="switch-input" role="switch" id="demo-switch-4" type="checkbox" checked>
    <label class="switch-paddle" for="demo-switch-4"><span class="show-for-sr">Alert</span></label>
</div>
<div class="switch">
    <input class="switch-input" role="switch" id="demo-switch-5" type="checkbox">
    <label class="switch-paddle" for="demo-switch-5"><span class="show-for-sr">Off</span></label>
</div>
```

With a visible label, a `.label-wrapper` is the label, as for checkboxes, and the paddle is an `aria-hidden` `<span>`.

```html example
<label class="label-wrapper" for="demo-switch-6">
    <span class="switch small success">
        <input class="switch-input" role="switch" id="demo-switch-6" type="checkbox" checked>
        <span class="switch-paddle" aria-hidden="true"></span>
    </span>
    <span>Notify me</span>
</label>
<label class="label-wrapper" for="demo-switch-7">
    <span class="switch small">
        <input class="switch-input" role="switch" id="demo-switch-7" type="checkbox">
        <span class="switch-paddle" aria-hidden="true"></span>
    </span>
    <span>Show archived Spaces</span>
</label>
```

## Range

A native `<input type="range">`, tinted like a switch (`accent-color`).

```html example
<label>Volume
    <input type="range" min="0" max="100" value="40">
</label>
```
