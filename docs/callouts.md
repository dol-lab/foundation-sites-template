# Callouts

`.callout` sets a message apart from the text around it. Takes a palette color.

```html example
<div class="callout">
    <h3>Default</h3>
    <p>Subdued, for a side note. <a href="#">A link</a>.</p>
</div>
<div class="callout primary">
    <h3>Primary</h3>
    <p>Information the reader needs. <a href="#">A link</a>.</p>
    <a class="button primary" href="#">Action</a>
</div>
<div class="callout success">
    <h3>Success</h3>
    <p>Something worked.</p>
</div>
<div class="callout warning">
    <h3>Warning</h3>
    <p>Something needs attention.</p>
</div>
<div class="callout alert">
    <h3>Alert</h3>
    <p>Something went wrong.</p>
    <a class="button alert" href="#">Retry</a>
</div>
```

## Sizes

A form's status message is a `.callout.small` (`role="status"`); `.large` adds room.

```html example
<p class="callout small alert" role="status">Your answer could not be saved.</p>
<p class="callout small success" role="status">Saved.</p>
<div class="callout large primary"><p>A large callout.</p></div>
```
