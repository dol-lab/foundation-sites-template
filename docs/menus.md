# Menus and dropdowns

`.menu` is a row of links, `.vertical` a column. `.details-menu` folds a menu into a native `<details>`, `data-dropdown-menu` opens panels on hover or click, `.popover` is a pane of rows opened by a button.

## Menu

```html example
<ul class="menu">
    <li class="menu-text">Menu title</li>
    <li class="is-active"><a href="#">Active</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Contact</a></li>
</ul>
```

## Dropdown menu

A top-level item's `popover="manual"` child is its panel, opened below it by `js/app.js` (delegated, so menus added later work). One panel is open at a time.

- Pointer: hovering the item opens it, leaving closes it unless it was opened by a click or clicked inside; a click on the item's link toggles it (its `href` is not followed).
- Keyboard: Enter or Space on the item's link opens it, Tab walks into it in document order, Escape closes it and returns focus to the link, tabbing out closes it.
- Escape, a click outside or focus leaving the item close it. The link gets `aria-expanded`; find-in-page opens a closed panel that holds the match (browsers with `hidden="until-found"`).
- Scripts: `showPopover()` opens one; it fires `toggle`, which does not bubble (listen with capture).

```html example
<ul class="dropdown menu" data-dropdown-menu>
    <li>
        <a href="#">Item 1</a>
        <ul class="vertical menu" popover="manual">
            <li><a href="#">Item 1A</a></li>
            <li><a href="#">Item 1B</a></li>
            <li><a href="#">Item 1C</a></li>
        </ul>
    </li>
    <li><a href="#">Item 2</a></li>
    <li><a href="#">Item 3</a></li>
</ul>
```

## Popover

A native `popover` opened by `popovertarget`, here by `.dots`, the button Spaces puts in the corner of a card. The button's `anchor-name` and the pane's `position-anchor` tie the two, so the pane sits below it; the browser closes it on Escape or a click outside. Keyboard: Enter or Space on the button opens it, Tab walks into it (the browser puts it right after the button), Escape closes it and returns focus to the button. Spaces' own context menus (post, comment, profile, avatar) are not these: spaces-markup builds them (`includes/Menu.php`, `assets/js/menu.js`) on a `.card`.

```html example
<div class="flex align-right">
    <button class="button p-0 m-0 clear dots" type="button" aria-label="Actions" popovertarget="demo-popover" style="anchor-name: --demo-popover"></button>
</div>
<ul class="popover card" id="demo-popover" popover style="position-anchor: --demo-popover">
    <li class="card-divider p-3"><a href="#">Edit</a></li>
    <li class="card-divider p-3"><a href="#">Share</a></li>
    <li class="card-divider p-3"><a href="#" class="alert">Delete</a></li>
</ul>
```

## Details menu

A `.details-menu` is a flat row while closed and a raised card while open; nested ones keep their carets in one column. Find-in-page opens it, `name="…"` makes a group exclusive. Enter or Space on the summary toggles it; Escape closes the innermost open one around the focus and focuses its summary (`js/app.js`, before a dropdown panel or dialog around it sees the key). Spaces folds the member list, a member's "Change role to" and the header's burger this way.

A parent that is also a link sits in `li.details-link`: the `<a>` comes before the `<details>` and lies over its row, the summary only folds (a link inside a summary would be nested in a button). The summary repeats the title in an `aria-hidden` span so the row wraps as the link does, and is named by `aria-label`. Spaces' main menu in the sidebar is built this way.

```html example
<ul class="menu vertical card">
    <li class="details-link">
        <a href="#">Teaching</a>
        <details class="details-menu" open>
            <summary aria-label="Teaching"><span aria-hidden="true">Teaching</span></summary>
            <ul class="menu vertical">
                <li><a href="#">Schedule</a></li>
                <li class="details-link">
                    <a href="#">Modules</a>
                    <details class="details-menu" open>
                        <summary aria-label="Modules"><span aria-hidden="true">Modules</span></summary>
                        <ul class="menu vertical">
                            <li><a href="#">Module manual</a></li>
                            <li><a href="#">Examination regulations</a></li>
                        </ul>
                    </details>
                </li>
            </ul>
        </details>
    </li>
    <li>
        <details class="details-menu">
            <summary>Change role to</summary>
            <ul class="menu vertical">
                <li><a href="#">Member</a></li>
                <li><a href="#">Editor</a></li>
            </ul>
        </details>
    </li>
</ul>
```
