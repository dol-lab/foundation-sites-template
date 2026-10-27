# Menus and dropdowns

`.menu` is a row of links, `.vertical` a column. `.details-menu` folds a menu into a native `<details>`, `data-dropdown-menu` opens nested menus on hover, `.dropdown-pane` is a panel opened by a toggle.

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

Find-in-page opens a closed submenu that holds the match (browsers with `hidden="until-found"`).

```html example
<ul class="dropdown menu" data-dropdown-menu>
    <li>
        <a href="#">Item 1</a>
        <ul class="menu">
            <li><a href="#">Item 1A</a></li>
            <li><a href="#">Item 1B</a></li>
            <li><a href="#">Item 1C</a></li>
        </ul>
    </li>
    <li><a href="#">Item 2</a></li>
    <li><a href="#">Item 3</a></li>
</ul>
```

## Dropdown pane

Opened here by `.dots`, the button Spaces puts in the corner of a card. Spaces' own context menus (post, comment, profile, avatar) are not dropdown panes: spaces-markup builds them (`includes/Menu.php`, `assets/js/menu.js`) on a `.card.static`.

```html example
<button class="button p-0 m-0 clear dots" type="button" aria-label="Actions" data-toggle="demo-dropdown-pane"></button>
<ul class="dropdown-pane card static" id="demo-dropdown-pane" data-dropdown data-position="bottom" data-alignment="left">
    <li class="card-divider p-3"><a href="#">Edit</a></li>
    <li class="card-divider p-3"><a href="#">Share</a></li>
    <li class="card-divider p-3"><a href="#" class="alert">Delete</a></li>
</ul>
```

## Details menu

A `.details-menu` is a flat row while closed and a raised card while open; nested ones keep their carets in one column. No JS: find-in-page opens it, `name="…"` makes a group exclusive. Spaces folds the member list, a member's "Change role to" and the header's burger this way.

A parent that is also a link sits in `li.details-link`: the `<a>` comes before the `<details>` and lies over its row, the summary only folds (a link inside a summary would be nested in a button). The summary repeats the title in an `aria-hidden` span so the row wraps as the link does, and is named by `aria-label`. Spaces' main menu in the sidebar is built this way.

```html example
<ul class="menu vertical card static">
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
