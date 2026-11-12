# Copy button

A `.copyable` holds a value and, after it, a `<button data-copy="<value>">`: hovering the value shows the button, which copies the value and says `data-copied` for two seconds (`data-copy-state="done"` meanwhile). Keyboard focus shows it too. Where the main pointer cannot hover (a phone) the button is hidden: a long press selects the text there. `aria-live="polite"` on the button makes a screen reader announce the change of label.

```html example
<span class="copyable">
    <a href="mailto:ada@example.org">ada@example.org</a>
    <button type="button" class="button tiny clear" data-copy="ada@example.org" data-copied="Copied" aria-live="polite"><i class="fa-regular fa-copy" aria-hidden="true"></i> Copy</button>
</span>
```

A `[data-copy]` button outside a `.copyable` copies as well and is always shown.
