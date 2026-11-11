# App header

`.app-header`: the site header, the bar at the top of this page. It holds one [dropdown menu](menus.md) (`.menu.dropdown` with `data-dropdown-menu`): the brand, entries whose `[popover]` child is their panel, and icon buttons. Below a breakpoint the bar collapses and a burger lists the other entries.

```html
<nav class="app-header collapse-below-large" id="app-header">
    <div class="grid-container">
        <ul class="menu grid-margin-x dropdown" data-dropdown-menu>
            <li class="navbar-icon"><a class="menu-anchor" href="/" aria-label="Home"><svg>…</svg><b>SPACES</b></a></li>
            <li>
                <a class="menu-anchor" href="#">Study</a>
                <ul class="vertical menu" popover="manual">…</ul>
            </li>
            <li class="menu-main-expand"><a class="menu-anchor" href="#">Labs</a><ul class="vertical menu" popover="manual">…</ul></li>
            <li class="search no-arrow navbar-icon"><button type="button" class="menu-anchor" aria-label="Open search"><i class="fa fa-search"></i></button></li>
            <li class="main-menu-burger hide-for-large navbar-icon p-0">
                <button type="button" class="menu-anchor sandwich-icon"><span class="sr-only">Open main menu</span></button>
            </li>
        </ul>
        <ul class="menu vertical app-header-burger hide-for-large">
            <li><details class="details-menu" name="app-header-burger"><summary>Study</summary><ul class="vertical menu">…</ul></details></li>
            <li><a class="menu-anchor" href="#">Help</a></li>
        </ul>
    </div>
</nav>
```

## Entries

- `.navbar-icon`: an entry that stays in the collapsed bar. With a `<span>` label before its icon, the wide bar shows the label and the collapsed bar the icon. Name a button without visible text with `aria-label`. A `.badge` in it sits on the icon's corner.
- `.menu-main-expand`: its panel spans the header's width (the Spaces and Labs panels on this page).
- `.no-arrow`: no caret after the link.
- `.avatar`: the account entry; its panel opens toward the left, so it stays on screen.
- `.search`: the search button; it pushes itself and the entries after it to the bar's end.
- `.main-menu-burger`: the burger button (`.sandwich-icon` draws the three lines).

## Collapsing and the burger

`.collapse-below-<breakpoint>` (e.g. `collapse-below-large`) collapses the bar below that [breakpoint](layout.md): only `.navbar-icon` entries stay, spread over the width. The other entries go into the burger, a `.menu.vertical.app-header-burger` after the bar, as `.details-menu` folds sharing one `name` (one open at a time) or plain links. The burger spans the screen and its rows line up with the bar's first entry. It is `display: none`: the consumer shows it (Spaces opens it from the burger button with a popover kept outside the header, so outside the backend build's `.f` scope), and makes it `inert` while closed. The header stacks at `--f-z-header`; its panels are in the top layer.
