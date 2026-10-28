# Modal

A `<dialog class="reveal">`, opened by any element with `data-open="<id>"` (or `showModal()`), closed by a `data-close` button inside it, Escape or a click on the backdrop. Scripts listen for the dialog's `close` event. Keyboard (native `showModal()`): opening focuses the first focusable element in the dialog (or the one with `autofocus`), Tab stays inside it and the page behind is inert, Escape closes it, and focus returns to the element that opened it.

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

## Space privacy

The Space details modal lets managers pick the Space's privacy from a `.radio-accordion` (spaces-core `Blogs_Privacy`): the checked option shows its description.

```html example
<button class="button" type="button" data-open="demo-privacy-modal">Space Privacy</button>
<dialog class="reveal" id="demo-privacy-modal" aria-labelledby="demo-privacy-title">
    <h2 id="demo-privacy-title">Space Privacy</h2>
    <ul class="change-privacy-list p-3 pt-0 radio-accordion icons icon-left success">
        <li class="radio-accordion-item">
            <div class="radio">
                <label class="label-wrapper" for="privacy_spaces_1">
                    <i class="fa fa-globe-europe" aria-hidden="true"></i>
                    <input type="radio" id="privacy_spaces_1" class="radio-input" name="blog_public" value="1">
                    <span>World</span>
                    <span class="radio-label ml-auto" aria-hidden="true"></span>
                </label>
            </div>
            <div class="card-section p-0 radio-accordion-content">
                <small>Visible to the world. Allow search engines to index this Space.</small>
            </div>
        </li>
        <li class="radio-accordion-item">
            <div class="radio">
                <label class="label-wrapper" for="privacy_spaces_-1">
                    <i class="fa fa-circle-nodes" aria-hidden="true"></i>
                    <input type="radio" id="privacy_spaces_-1" class="radio-input" name="blog_public" value="-1" checked>
                    <span>Platform Users</span>
                    <span class="radio-label ml-auto" aria-hidden="true"></span>
                </label>
            </div>
            <div class="card-section p-0 radio-accordion-content visible">
                <small>Visible only to registered users of the platform.</small>
            </div>
        </li>
        <li class="radio-accordion-item">
            <div class="radio">
                <label class="label-wrapper" for="privacy_spaces_-2">
                    <i class="fa fa-lock" aria-hidden="true"></i>
                    <input type="radio" id="privacy_spaces_-2" class="radio-input" name="blog_public" value="-2">
                    <span>Space Members</span>
                    <span class="radio-label ml-auto" aria-hidden="true"></span>
                </label>
            </div>
            <div class="card-section p-0 radio-accordion-content">
                <small>Only members of this Space can read posts. The Space and its description stay visible in public lists.</small>
            </div>
        </li>
    </ul>
    <button class="close-button" data-close aria-label="Close" type="button">
        <span aria-hidden="true">&times;</span>
    </button>
</dialog>
```
