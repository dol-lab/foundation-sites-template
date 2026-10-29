# Avatars

`.avatar-container` with a size around a `.clipped.square`. The corner comes from `--f-avatar-radius` (default `--f-radius`, round in an `.avatar-stack`).

## Sizes

```html example row
<div class="avatar-container xsmall"><div class="clipped square"><img src="assets/img/pb-1.png" alt=""></div></div>
<div class="avatar-container small"><div class="clipped square"><img src="assets/img/pb-2.png" alt=""></div></div>
<div class="avatar-container medium"><div class="clipped square"><img src="assets/img/pb-3.png" alt=""></div></div>
<div class="avatar-container large"><div class="clipped square"><img src="assets/img/pb-4.png" alt=""></div></div>
```

## Interactive

An avatar that opens something has an `.avatar-trigger` in place of the `.clipped`: a link to the profile, or a `<span role="button">` without one. Its image shrinks on hover, focus and while `aria-expanded="true"`. In Spaces it opens spaces-markup's avatar menu.

```html example row
<div class="avatar-container small"><a class="avatar-trigger clipped square" href="#"><img alt="Profile of Ada" src="assets/img/pb-1.png"></a></div>
<div class="avatar-container small"><span class="avatar-trigger clipped square" role="button" tabindex="0"><img alt="Anonymous" src="assets/img/pb-2.png"></span></div>
```

## Avatar stack

Lists the newest last; each avatar wears a ring in the card color.

```html example
<ul class="avatar-stack small no-bullet flex mb-0">
    <li class="avatar-container" style="z-index: 4;"><a href="#" class="clipped square"><img alt="Ada Lovelace" src="assets/img/pb-4.png"></a></li>
    <li class="avatar-container" style="z-index: 3;"><a href="#" class="clipped square"><img alt="Grace Hopper" src="assets/img/pb-1.png"></a></li>
    <li class="avatar-container" style="z-index: 2;"><a href="#" class="clipped square"><img alt="Alan Turing" src="assets/img/pb-2.png"></a></li>
    <li class="avatar-container" style="z-index: 1;"><a href="#" class="clipped square"><img alt="Hedy Lamarr" src="assets/img/pb-3.png"></a></li>
</ul>
```
