# Accordion

Foundation's accordion: `data-accordion` on the list, `.is-active` on the item that starts open. Spaces still uses it through `data-responsive-accordion-tabs` (tabs that turn into an accordion on small screens). Anywhere else prefer [details](details.md): no JS, and its content can be found with find-in-page or linked to.

```html example
<ul class="accordion" data-accordion data-allow-all-closed="true">
    <li class="accordion-item" data-accordion-item>
        <a href="#" class="accordion-title">First item</a>
        <div class="accordion-content" data-tab-content>
            <p>Each item has a title and its content.</p>
        </div>
    </li>
    <li class="accordion-item is-active" data-accordion-item>
        <a href="#" class="accordion-title">Second item, open</a>
        <div class="accordion-content" data-tab-content>
            <p>Content can hold anything, buttons too.</p>
            <div class="button-group">
                <a href="#" class="button primary">Yes</a>
                <a href="#" class="button">No</a>
            </div>
        </div>
    </li>
</ul>
```
