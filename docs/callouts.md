# Callouts

`.callout` sets a message apart from the text around it. Takes a palette color; a button inside takes the same one. Text, headings and links share one color that meets WCAG AA on the tint (links are underlined), and a soft button sits on the page background so it stays visible (a hollow one is see-through anyway). Success, warning and alert buttons are soft by default: the main action takes `.solid`.

The palette classes are `primary`, `secondary`, `success`, `warning` and `alert` (the error variant; a wrong name silently falls back to the default). Do not override a callout's colors inline: the box then stops following the theme while its text still does.

```html example
<div class="callout">
    <h3>Default</h3>
    <p>Subdued, for a side note. <a href="#">A link</a>.</p>
    <a class="button" href="#">Action</a>
    <a class="button hollow" href="#">Later</a>
</div>
<div class="callout primary">
    <h3>Primary</h3>
    <p>Information the reader needs. <a href="#">A link</a>.</p>
    <a class="button primary" href="#">Action</a>
    <a class="button hollow primary" href="#">Later</a>
</div>
<div class="callout secondary">
    <h3>Secondary</h3>
    <p>Background the reader may want. <a href="#">A link</a>.</p>
    <a class="button secondary" href="#">Action</a>
    <a class="button hollow secondary" href="#">Later</a>
</div>
<div class="callout brand">
    <h3>Brand</h3>
    <p>Something from this Space. <a href="#">A link</a>.</p>
    <a class="button brand" href="#">Action</a>
    <a class="button hollow brand" href="#">Later</a>
</div>
<div class="callout success">
    <h3>Success</h3>
    <p>Something worked. <a href="#">A link</a>.</p>
    <a class="button success solid" href="#">Action</a>
    <a class="button hollow success" href="#">Later</a>
</div>
<div class="callout warning">
    <h3>Warning</h3>
    <p>Something needs attention. <a href="#">A link</a>.</p>
    <a class="button warning solid" href="#">Action</a>
    <a class="button hollow warning" href="#">Later</a>
</div>
<div class="callout alert">
    <h3>Alert</h3>
    <p>Something went wrong. <a href="#">A link</a>.</p>
    <a class="button alert solid" href="#">Action</a>
    <a class="button hollow alert" href="#">Later</a>
</div>
```

## Sizes

A form's status message is a `.callout.small` (`role="status"`); `.large` adds room.

```html example
<p class="callout small alert" role="status">Your answer could not be saved.</p>
<p class="callout small success" role="status">Saved.</p>
<div class="callout large primary"><p>A large callout.</p></div>
```

## Dismissible

`data-closable` on the callout and a `.close-button` with `data-close` inside it: a click removes the callout (`js/app.js`).

```html example
<div class="callout warning" data-closable>
    <p>Dismiss me.</p>
    <button class="close-button" type="button" aria-label="Dismiss" data-close><span aria-hidden="true">&times;</span></button>
</div>
```
