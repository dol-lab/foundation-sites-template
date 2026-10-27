# Details

A native `<details>` is unstyled until it asks: `.details` for the look and the open animation, `.details-animated` for the animation only. Inside `.user-generated` every `<details>` is styled. Find-in-page opens them, and one holding the URL's `:target` starts open.

```html example
<details class="details" open>
    <summary>Study schedule and examination regulations</summary>
    <ul>
        <li><a href="#">Schedule »Integrated Design«</a></li>
        <li><a href="#">Module manual</a></li>
    </ul>
</details>
<details class="details">
    <summary>Study Journal</summary>
    <p>Closed until clicked.</p>
</details>
```

## Folding by breakpoint

`data-collapse="<breakpoint>"` on a `<details>` or an `.accordion` folds it on load from that breakpoint through the next one (`small`: below large), unless it holds the URL's target (`js/app.js`).

```html example
<details class="details" data-collapse="small" open>
    <summary>Folded below large</summary>
    <p>Open from large up.</p>
</details>
```
