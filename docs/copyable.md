# Copy button

A `.copyable` holds a value and, after it, a `<button data-copy="<value>">`: hovering the value shows the button, which copies the value and shows a check and sets `data-copied` as its `aria-label` for two seconds (a button with text shows `data-copied` as its text instead) (`data-copy-state="done"` meanwhile). Keyboard focus shows it too. Where the main pointer cannot hover (a phone) the button is hidden: a long press selects the text there. `aria-live="polite"` on the button makes a screen reader announce the change of label. The button is icon-only: give it an `aria-label`.

```html example
<span class="copyable">
    <a href="mailto:ada@example.org">ada@example.org</a>
    <button type="button" class="button tiny clear" data-copy="ada@example.org" data-copied="Copied" aria-label="Copy" aria-live="polite"><i class="fa-regular fa-copy" aria-hidden="true"></i></button>
</span>
```

The button's tooltip is its `aria-label` ("Copy" without one), so that one string is all to translate; `data-tooltip` or `title` overrides it.

A `[data-copy]` button outside a `.copyable` copies as well and is always shown.
