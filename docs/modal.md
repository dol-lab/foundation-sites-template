# Modal

A `<dialog class="reveal">`, opened by any element with `data-open="<id>"` (or `showModal()`), closed by a `data-close` button inside it, Escape, a click on the backdrop (pressed and released there) or a swipe down on a phone. All four ask the dialog to close (`requestClose()`), so its `cancel` event is the one guard: `preventDefault()` there keeps it open, e.g. while a form has unsaved changes. Escape asks too rather than leaving it to the browser, which lets a page cancel only one Escape per user action; a script that handles Escape itself inside a modal (a list closing first) calls `preventDefault()`, as only that keeps the modal open. Scripts listen for the dialog's `close` event. Keyboard (native `showModal()`): opening focuses the first focusable element in the dialog (or the one with `autofocus`), Tab stays inside it and the page behind is inert, Escape closes it, and focus returns to the element that opened it.

Its width is capped at 500px; a wider modal says so with `.large`, which grows to the grid container. A `.prose-layout` child spans the modal's side padding. On a phone (below medium) a modal is a sheet: full width, on the bottom edge, as tall as its content but at least a third of the screen, with a handle on top (a `.collapse` sheet gets a strip for it). Swiped down while scrolled to its top, it follows the finger, the backdrop lightening with it, and closes past half of its height, or on a hard flick past a quarter; a touch on a textarea or select, on a list that scrolls inside it, or on content with its own `touch-action` (a cropper) does not drag it. A modal stays in the visible part of the screen, so the on-screen keyboard does not cover a sheet. `.full` makes it full-screen at any width, without the swipe. Opening fades and lifts it into place (a sheet slides up); closing runs in reverse in Chromium and closes at once in browsers without the CSS `overlay` property.

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

Overlays a script opens from a modal render inside it, as the page outside is inert: a popover (top layer) anywhere in the dialog, a positioned overlay (React Aria's popovers and tooltips, through `UNSAFE_PortalProvider`) into a `.reveal-layer` child. The layer covers the screen and takes no pointer events itself, so its overlays are not clipped by the modal's scroll (on a phone the sheet is their containing block, so there they are). A sheet does not drag from a popover or the layer.

A modal that is no `<dialog>`, such as React Aria's (deprecated: React modals are `<dialog>`s too, see spaces-markup's `RevealModal`): `.reveal-overlay` on the overlay is the backdrop, `.reveal` on the dialog is the same box, and a wrapper between them (React Aria's `Modal`) takes no box. It opens and closes on `data-entering` / `data-exiting`, which React Aria sets and waits for. It stacks at `--f-z-overlay`, so popovers opened from it need `--f-z-dropdown`. A swipe closes it with an Escape key press.

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

## Expandable sheet

On a phone, `.expandable` opens the sheet at half the visible screen with its top row in view, and expands it to full height on a short swipe up, or when a text field in it takes the focus (the on-screen keyboard is coming). A short swipe down returns it to half and hands the keyboard back; only a long swipe from there (past half of what shows) or a hard flick closes it. At half, a swipe anywhere moves the sheet, so a list in it scrolls once it is expanded. A tap on the handle strip moves it to the other stop, for those who cannot swipe. `data-expanded` is the state: a script moves the sheet by setting or removing it. `--f-sheet-peek` (a length, on the modal or an ancestor) changes how much shows before expanding. `showModal()` focuses the first control (Chromium ignores `autofocus` on the `<dialog>`), so a sheet that leads with a text field opens expanded, which is where it belongs once the keyboard is up. To open one at half, focus no field on opening (a React Aria modal: none on a touch screen). From medium up it is a plain modal.

```html example
<button class="button" type="button" data-open="demo-modal-expandable">Open expandable sheet</button>
<dialog class="reveal collapse expandable" id="demo-modal-expandable" aria-labelledby="demo-modal-expandable-title">
    <h3 class="reveal-header p-3 mb-0" id="demo-modal-expandable-title">Recent</h3>
    <ul class="menu vertical">
        <li><a href="#">Result 1</a></li>
        <li><a href="#">Result 2</a></li>
        <li><a href="#">Result 3</a></li>
        <li><a href="#">Result 4</a></li>
        <li><a href="#">Result 5</a></li>
        <li><a href="#">Result 6</a></li>
        <li><a href="#">Result 7</a></li>
        <li><a href="#">Result 8</a></li>
        <li><a href="#">Result 9</a></li>
        <li><a href="#">Result 10</a></li>
        <li><a href="#">Result 11</a></li>
        <li><a href="#">Result 12</a></li>
        <li><a href="#">Result 13</a></li>
        <li><a href="#">Result 14</a></li>
        <li><a href="#">Result 15</a></li>
        <li><a href="#">Result 16</a></li>
        <li><a href="#">Result 17</a></li>
        <li><a href="#">Result 18</a></li>
        <li><a href="#">Result 19</a></li>
        <li><a href="#">Result 20</a></li>
    </ul>
    <button class="close-button" data-close aria-label="Close" type="button">
        <span aria-hidden="true">&times;</span>
    </button>
</dialog>
```
