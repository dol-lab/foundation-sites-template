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

## Space privacy

The Space details modal lets managers pick the Space's privacy from a `.radio-accordion` (spaces-core `Blogs_Privacy`): the checked option shows its description.

```html example
<button class="button" type="button" data-open="demo-privacy-modal">Space Privacy</button>
<div class="reveal" id="demo-privacy-modal" data-reveal>
    <h2>Space Privacy</h2>
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
</div>
```
