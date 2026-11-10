# Badges and labels

A `.badge` is a round counter, a `.label` a short tag (Spaces: a member's status, a post's editor notes with an icon). Both take a palette color.

## Badges

```html example row
<span class="badge"><i class="fa fa-heart"></i></span>
<span class="badge primary">1</span>
<span class="badge secondary">2</span>
<span class="badge success">3</span>
<span class="badge warning">B</span>
<span class="badge alert">A</span>
<span class="badge activity">4</span>
<span class="badge activity">12</span>
```

## Labels

```html example row
<span class="label">Default</span>
<span class="label primary">Primary</span>
<span class="label secondary">Secondary</span>
<span class="label success">Success</span>
<span class="label warning">Warning</span>
<span class="label alert">Alert</span>
<span class="label activity">New</span>
<span class="label warning"><i class="fas fa-sticky-note"></i> 2</span>
```

A `.hollow` label is an outline with its text in the color (Spaces: a "New" label once it was seen).

```html example row
<span class="label hollow">Default</span>
<span class="label hollow primary">Primary</span>
<span class="label hollow success">Success</span>
<span class="label hollow alert">Alert</span>
<span class="label hollow activity">New</span>
```
