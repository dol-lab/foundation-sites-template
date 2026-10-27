# Modal

Foundation's reveal: `.reveal` with `data-reveal`, opened by any element with `data-open="<id>"`, closed by `data-close`.

```html example
<button class="button" type="button" data-open="demo-modal">Open modal</button>
<div class="reveal" id="demo-modal" data-reveal>
    <h2>Modal title</h2>
    <p class="lead">A short lead.</p>
    <p>The content of the modal.</p>
    <button class="close-button" data-close aria-label="Close" type="button">
        <span aria-hidden="true">&times;</span>
    </button>
</div>
```
