# Layout

A page is a `.grid-container` holding Foundation's XY grid; a text page puts its text in a `.prose-layout` column; a list of equal items is an `.auto-grid`. The breakpoints are the library's own, not Foundation's.

## Breakpoints

| Name      | Min width | Token                       |
| --------- | --------- | --------------------------- |
| `small`   | 0         | `--f-breakpoint-small`      |
| `medium`  | 480px     | `--f-breakpoint-medium`     |
| `large`   | 720px     | `--f-breakpoint-large`      |
| `xlarge`  | 960px     | `--f-breakpoint-xlarge`     |
| `xxlarge` | 1200px    | `--f-breakpoint-xxlarge`    |

Hand-written media queries use these widths (in em: 30em, 45em, 60em, 75em). Scripts read a token from `<html>` with `getComputedStyle()` and pass it to `matchMedia()` as `(min-width: …)`. Grid columns and the visibility classes (`.hide-for-large`, …) stop at large: xlarge and xxlarge have no classes.

## Container and grid

`.grid-container` centers the page at most 1200px wide (`--f-grid-container-max`) with a side padding of 8px, 12px from large (`--f-grid-container-padding`). `.fluid` spans the full width with the padding, `.full` without it.

Inside, `.grid-x` is a row of `.cell`s. `.grid-margin-x` and `.grid-margin-y` add gutters between them (8px, 12px from large). A cell is full width by default; `{breakpoint}-{columns}` sets its share of 12 columns from that breakpoint up (`medium-6` is half from medium), `.auto` fills the space left and `.shrink` fits its content (both also per breakpoint: `large-auto`).

```html example wide
<div class="grid-x grid-margin-x grid-margin-y demo-layout">
    <div class="cell medium-6 large-4">medium-6 large-4</div>
    <div class="cell medium-6 large-8">medium-6 large-8</div>
    <div class="cell shrink">shrink</div>
    <div class="cell auto">auto</div>
</div>
```

## Auto grid

`.auto-grid` fills its width with as many equal columns as fit, each at least `--f-auto-grid-min-width` (250px) wide, and one column on a narrower screen. Add a gap with `gap-{size}` ([helper classes](helper-classes.md)). Space cards and the cards on this page use it.

```html example wide
<div class="auto-grid gap-4 demo-layout" style="--f-auto-grid-min-width: 150px">
    <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div>
</div>
```

## Prose layout

`.prose-layout` is a grid of three columns: its children sit in the middle one, at most 70 characters wide, with a fluid margin on either side. `.alignwide` spans a child across the box minus a small inset, `.alignfull` edge to edge. Text must be in an element (`p`, a heading): bare text has no column. Knobs: `--f-prose-offset-left` (the left margin's target width) and `--f-prose-ch-factor` (for a font whose zero is unusually narrow or wide). This page lays out each section with it.

```html example wide
<div class="prose-layout demo-layout">
    <p>A paragraph in the reading column.</p>
    <p class="alignwide">.alignwide</p>
    <p class="alignfull">.alignfull</p>
</div>
```

In what members write (`.user-generated`), images are rounded and links in running text are underlined.

## Page title

`.page-title` is a page's heading row (a little top padding; a link in it is not underlined), `.page-content` the content below it (1rem above and below).
