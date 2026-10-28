# User card

`.card.card-user`: an avatar and the user's name in a `.user-card-header`, as tall as the avatar. The avatar fills the card's left edge: the card rounds its outer corners, its inner ones are square. `.user-name` and the avatar take their size from the card's size class (`.small`, `.large`, …). A card that is one link wraps its content in a `.card-anchor`.

```html example
<div class="card card-user small mb-2">
    <a class="card-anchor" href="#">
        <div class="user-card-header">
            <div class="avatar-container"><div class="clipped square"><img src="assets/img/pb-1.png" alt=""></div></div>
            <div class="card-header align-center">
                <div class="card-title flex-dir-column cell">
                    <span class="user-name text-truncate align-self-top">Ada Lovelace</span>
                    <span class="user-info text-truncate align-self-top"><small>Analytical Engine</small></span>
                </div>
            </div>
        </div>
    </a>
</div>
<div class="card card-user large">
    <div class="user-card-header">
        <div class="avatar-container"><div class="clipped square"><img src="assets/img/pb-2.png" alt=""></div></div>
        <div class="card-header align-center">
            <div class="card-title flex-dir-column cell">
                <span class="user-name text-truncate align-self-top">Grace Hopper</span>
                <span class="user-info text-truncate align-self-top"><small>Compilers</small></span>
            </div>
        </div>
    </div>
</div>
```

## Selectable

Where users can be selected, a `.checkbox` before the picture fills the avatar, and the avatar loses its rounded corners. Hovering the card or focusing the checkbox swaps the picture for it; once ticked, the row shows only the ticked box.

```html example
<div class="card card-user small">
    <div class="user-card-header">
        <div class="avatar-container">
            <div class="checkbox round success">
                <input class="checkbox-input" id="demo-user-1" type="checkbox">
                <label class="checkbox-label" for="demo-user-1"><span class="show-for-sr">Select Ada Lovelace</span></label>
            </div>
            <div class="clipped square"><img src="assets/img/pb-3.png" alt=""></div>
        </div>
        <div class="card-header align-center">
            <div class="card-title cell"><span class="user-name text-truncate align-self-top">Ada Lovelace</span></div>
        </div>
    </div>
</div>
<div class="card card-user small">
    <div class="user-card-header">
        <div class="avatar-container">
            <div class="checkbox round success">
                <input class="checkbox-input" id="demo-user-2" type="checkbox" checked>
                <label class="checkbox-label" for="demo-user-2"><span class="show-for-sr">Select Grace Hopper</span></label>
            </div>
            <div class="clipped square"><img src="assets/img/pb-4.png" alt=""></div>
        </div>
        <div class="card-header align-center">
            <div class="card-title cell"><span class="user-name text-truncate align-self-top">Grace Hopper</span></div>
        </div>
    </div>
</div>
```
