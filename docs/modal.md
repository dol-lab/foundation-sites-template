# Modal

A `<dialog class="reveal">`, opened by any element with `data-open="<id>"` (or `showModal()`), closed by a `data-close` button inside it, Escape or a click on the backdrop. Scripts listen for the dialog's `close` event. Keyboard (native `showModal()`): opening focuses the first focusable element in the dialog (or the one with `autofocus`), Tab stays inside it and the page behind is inert, Escape closes it, and focus returns to the element that opened it.

Its width is capped at 500px; a wider modal says so with `.large`, which grows to the grid container. A `.prose-layout` child spans the modal's side padding. On a phone (below medium) a modal is a sheet: full width, on the bottom edge, as tall as its content, with a handle on top (a `.collapse` sheet gets a strip for it). Swiped down while scrolled to its top, it follows the finger and closes past a third of its height or on a flick; a touch on a field, on a list that scrolls inside it, or on content with its own `touch-action` (a cropper) does not drag it. A modal stays in the visible part of the screen, so the on-screen keyboard does not cover a sheet. `.full` makes it full-screen at any width, without the swipe. Opening fades and lifts it into place (a sheet slides up); closing runs in reverse in Chromium and closes at once in browsers without the CSS `overlay` property.

The close button is a `.close-button` child of the modal, last in the markup (so opening does not focus it); it sits in the top corner as a 40px target. A float of its size holds that corner, so whatever comes first wraps around it: lead with a heading or text. A first child that lays out its own box (flex, grid, a `.card`) narrows beside the corner for its whole height; such a modal marks its header row `.reveal-header` (see Header row below).

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

A modal that is no `<dialog>`, such as React Aria's: `.reveal-overlay` on the overlay is the backdrop, `.reveal` on the dialog is the same box, and a wrapper between them (React Aria's `Modal`) takes no box. It opens and closes on `data-entering` / `data-exiting`, which React Aria sets and waits for. It stacks at `--f-z-overlay`, so popovers opened from it need `--f-z-dropdown`. A swipe closes it with an Escape key press.

```jsx
<ModalOverlay className="reveal-overlay" isDismissable>
    <Modal>
        <Dialog className="reveal" aria-labelledby="title">
            {({ close }) => (
                <>
                    <h2 id="title">Modal title</h2>
                    <p>The content of the modal.</p>
                    <Button className="close-button" onPress={close} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </Button>
                </>
            )}
        </Dialog>
    </Modal>
</ModalOverlay>
```

## Header row

A modal with a header row of its own (a tab bar, a search field) above a list marks the row `.reveal-header`. The close button centers on the row, wherever it is in the modal, and the row keeps clear of it. As a child of the modal, the row stays put and what follows it scrolls; a row deeper down (inside a script's wrappers) leaves that layout to the page. Such a modal is usually `.collapse`, so the row and the list reach its edges; on a phone the sheet then gets a strip for its handle. The sheet is dragged by its handle and header: a swipe on the list scrolls the list.

```html example
<button class="button" type="button" data-open="demo-modal-header">Open modal with a header row</button>
<dialog class="reveal collapse" id="demo-modal-header" aria-label="Spaces">
    <ul class="tabs line reveal-header" data-tabs id="demo-modal-tabs">
        <li class="tabs-title is-active"><a href="#demo-modal-panel-1" aria-selected="true">Mine</a></li>
        <li class="tabs-title"><a href="#demo-modal-panel-2">Featured</a></li>
    </ul>
    <div class="tabs-content" data-tabs-content="demo-modal-tabs">
        <ul class="tabs-panel is-active menu vertical" id="demo-modal-panel-1">
            <li><a href="#">Item 1</a></li>
            <li><a href="#">Item 2</a></li>
            <li><a href="#">Item 3</a></li>
            <li><a href="#">Item 4</a></li>
            <li><a href="#">Item 5</a></li>
            <li><a href="#">Item 6</a></li>
            <li><a href="#">Item 7</a></li>
            <li><a href="#">Item 8</a></li>
            <li><a href="#">Item 9</a></li>
            <li><a href="#">Item 10</a></li>
            <li><a href="#">Item 11</a></li>
            <li><a href="#">Item 12</a></li>
            <li><a href="#">Item 13</a></li>
            <li><a href="#">Item 14</a></li>
            <li><a href="#">Item 15</a></li>
            <li><a href="#">Item 16</a></li>
            <li><a href="#">Item 17</a></li>
            <li><a href="#">Item 18</a></li>
            <li><a href="#">Item 19</a></li>
            <li><a href="#">Item 20</a></li>
        </ul>
        <div class="tabs-panel p-4" id="demo-modal-panel-2">
            <p>A short panel: the modal shrinks to it.</p>
        </div>
    </div>
    <button class="close-button" data-close aria-label="Close" type="button">
        <span aria-hidden="true">&times;</span>
    </button>
</dialog>
```
