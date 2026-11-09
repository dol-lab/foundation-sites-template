# Icons

Icons are [Font Awesome 7 Free](https://fontawesome.com/search?ic=free): solid, regular and brands. The library does not ship it: Spaces loads it from spaces-markup (`fontawesome`), this page from cdnjs. An icon takes its color and size from the text around it.

## Styles

A style class and an icon class. `fa-solid` (or the older `fas`, `fa`) has every free icon, `fa-regular` (`far`) and `fa-brands` (`fab`) a subset.

```html example row
<i class="fa-solid fa-house" aria-hidden="true"></i>
<i class="fa-solid fa-calendar-days" aria-hidden="true"></i>
<i class="fa-regular fa-calendar-days" aria-hidden="true"></i>
<i class="fa-regular fa-bell" aria-hidden="true"></i>
<i class="fa-brands fa-github" aria-hidden="true"></i>
<i class="fa-brands fa-mastodon" aria-hidden="true"></i>
```

## With text

Every icon is 1.25em wide (`fa-width-auto` drops that), so icons in a list line up. Next to a label the icon is decoration: `aria-hidden="true"`.

```html example row
<button class="button" type="button"><i class="fa-solid fa-plus" aria-hidden="true"></i> New post</button>
<button class="button hollow" type="button">Next <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
<a href="#"><i class="fa-solid fa-paperclip" aria-hidden="true"></i> slides.pdf</a>
<span class="label success"><i class="fa-solid fa-check" aria-hidden="true"></i> Done</span>
```

## Without text

An icon alone needs a name: `aria-label` on the button or link, or a `.sr-only` text beside the icon.

```html example row
<button class="button" type="button" aria-label="Search"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i></button>
<a class="icon-button" href="#"><i class="fa-regular fa-pen-to-square" aria-hidden="true"></i><span class="sr-only">Edit</span></a>
<span class="badge alert"><i class="fa-solid fa-exclamation" aria-hidden="true"></i></span>
```

## Color and size

A palette class colors an icon in its `-text` shade. Sizes: `fa-xs`, `fa-sm`, `fa-lg`, `fa-xl`, `fa-2x` … `fa-10x`.

```html example row
<i class="fa-solid fa-circle-check success" aria-hidden="true"></i>
<i class="fa-solid fa-triangle-exclamation warning" aria-hidden="true"></i>
<i class="fa-solid fa-circle-xmark alert" aria-hidden="true"></i>
<i class="fa-solid fa-star fa-sm" aria-hidden="true"></i>
<i class="fa-solid fa-star fa-lg" aria-hidden="true"></i>
<i class="fa-solid fa-star fa-2x" aria-hidden="true"></i>
```

## Motion

`fa-spin` and Font Awesome's other animations stop under reduced motion. For a busy state use the [spinner](progress.md), which keeps turning.

```html example row
<i class="fa-solid fa-rotate fa-spin" aria-hidden="true"></i>
<i class="fa-regular fa-heart fa-beat" aria-hidden="true"></i>
<i class="fa-solid fa-arrows-rotate fa-rotate-90" aria-hidden="true"></i>
<i class="fa-solid fa-thumbs-up fa-flip-horizontal" aria-hidden="true"></i>
```
