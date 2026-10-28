# Modal

A `<dialog class="reveal">`, opened by any element with `data-open="<id>"` (or `showModal()`), closed by a `data-close` button inside it, Escape or a click on the backdrop. Scripts listen for the dialog's `close` event. Keyboard (native `showModal()`): opening focuses the first focusable element in the dialog (or the one with `autofocus`), Tab stays inside it and the page behind is inert, Escape closes it, and focus returns to the element that opened it.

Its width is capped at the feed's post-card width (a large-8 cell of the grid container), and a `.prose-layout` child spans the modal's side padding, so prose gets the same columns as in a post card; `.large` grows to the grid container. Below small every modal is full-screen.

```html example
<button class="button" type="button" data-open="demo-modal">Open modal</button>
<dialog class="reveal" id="demo-modal" aria-labelledby="demo-modal-title">
    <h2 id="demo-modal-title">Modal title</h2>
    <p class="lead">A short lead.</p>
    <p>The content of the modal.</p>
    <button class="close-button" data-close aria-label="Close" type="button">
        <span aria-hidden="true">&times;</span>
    </button>
</dialog>
```
