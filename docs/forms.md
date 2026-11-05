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

`.switch` takes a palette color and `.tiny`, `.small` or `.large` (16, 20 and 32px high, 24px without one). Off is an outlined pill with a small knob, on a filled pill with a larger knob on the far side, so the state does not rest on color alone; without a palette class the fill is the text color. Every size is at least 24px to click, and in forced colors it takes system colors.

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
<div class="switch brand">
    <input class="switch-input" role="switch" id="demo-switch-brand" type="checkbox" checked>
    <label class="switch-paddle" for="demo-switch-brand"><span class="show-for-sr">Brand</span></label>
</div>
<div class="switch secondary">
    <input class="switch-input" role="switch" id="demo-switch-secondary" type="checkbox" checked>
    <label class="switch-paddle" for="demo-switch-secondary"><span class="show-for-sr">Secondary</span></label>
</div>
<div class="switch warning">
    <input class="switch-input" role="switch" id="demo-switch-warning" type="checkbox" checked>
    <label class="switch-paddle" for="demo-switch-warning"><span class="show-for-sr">Warning</span></label>
</div>
<div class="switch">
    <input class="switch-input" role="switch" id="demo-switch-5" type="checkbox">
    <label class="switch-paddle" for="demo-switch-5"><span class="show-for-sr">Off</span></label>
</div>
```

```html example row
<div class="switch tiny">
    <input class="switch-input" role="switch" id="demo-switch-tiny" type="checkbox" checked>
    <label class="switch-paddle" for="demo-switch-tiny"><span class="show-for-sr">Tiny</span></label>
</div>
<div class="switch small">
    <input class="switch-input" role="switch" id="demo-switch-small" type="checkbox" checked>
    <label class="switch-paddle" for="demo-switch-small"><span class="show-for-sr">Small</span></label>
</div>
<div class="switch large">
    <input class="switch-input" role="switch" id="demo-switch-large" type="checkbox" checked>
    <label class="switch-paddle" for="demo-switch-large"><span class="show-for-sr">Large</span></label>
</div>
<div class="switch">
    <input class="switch-input" role="switch" id="demo-switch-disabled-off" type="checkbox" disabled>
    <label class="switch-paddle" for="demo-switch-disabled-off"><span class="show-for-sr">Disabled, off</span></label>
</div>
<div class="switch success">
    <input class="switch-input" role="switch" id="demo-switch-disabled-on" type="checkbox" checked disabled>
    <label class="switch-paddle" for="demo-switch-disabled-on"><span class="show-for-sr">Disabled, on</span></label>
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

`.switch-with-labels` is a wide two-sided switch with an icon on each end and a description for each side; the input's state shows one of them. Spaces uses it on the nav-menus screen.

```html example
<div class="switch switch-with-labels">
    <input class="switch-input" role="switch" id="demo-switch-labels" type="checkbox">
    <label class="switch-paddle" for="demo-switch-labels">
        <i class="fa fa-newspaper switch-label-left" aria-hidden="true"></i>
        <i class="fa fa-book switch-label-right" aria-hidden="true"></i>
    </label>
    <label for="demo-switch-labels" class="switch-label-description-left">Dynamic content: posts and categories</label>
    <label for="demo-switch-labels" class="switch-label-description-right">Static content: pages</label>
</div>
```

## Range

A native `<input type="range">`, drawn like a switch: a round knob on a line that fills up to it. It takes a palette color.

```html example
<label>Volume
    <input type="range" min="0" max="100" value="40">
</label>
<label>Brightness
    <input class="primary" type="range" min="0" max="100" value="70">
</label>
<label>Disabled
    <input type="range" min="0" max="100" value="20" disabled>
</label>
```
