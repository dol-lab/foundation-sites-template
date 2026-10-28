# Progress

`.progress` with a `.progress-meter` whose width is the value. Takes a palette color.

```html example
<div class="progress" role="progressbar" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"><div class="progress-meter" style="width: 15%"></div></div>
<div class="progress primary" role="progressbar" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"><div class="progress-meter" style="width: 30%"></div></div>
<div class="progress secondary" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100"><div class="progress-meter" style="width: 45%"></div></div>
<div class="progress success" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"><div class="progress-meter" style="width: 60%"></div></div>
<div class="progress warning" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"><div class="progress-meter" style="width: 75%"></div></div>
<div class="progress alert" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"><div class="progress-meter" style="width: 90%"></div></div>
```

## Spinner

`.spinner` for a wait of unknown length: `.tiny`, `.small`, `.medium` (the switch heights) or `.large`, 1.5rem without one; `.quick` and `.slow` set the pace. It keeps turning under reduced motion, since a frozen one no longer says "busy". Give it `role="status"` and a label.

```html example row
<span class="spinner tiny" role="status" aria-label="Loading"></span>
<span class="spinner small" role="status" aria-label="Loading"></span>
<span class="spinner medium" role="status" aria-label="Loading"></span>
<span class="spinner large" role="status" aria-label="Loading"></span>
<span class="spinner slow" role="status" aria-label="Loading"></span>
```
