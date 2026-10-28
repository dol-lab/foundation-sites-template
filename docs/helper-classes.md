# Helper classes

Utility classes from `scss/custom-styles/_utilities.scss` and Foundation's prototype and flex helpers. They are not responsive: only the visibility classes take a breakpoint.

## Spacing

**Syntax:** `{property}{side}-{size}`, plus `gap-{size}`.

- **Property:** `m` (margin), `p` (padding)
- **Side:** `t` (top), `b` (bottom), `l` (left), `r` (right), `x` (horizontal), `y` (vertical), *(blank)* (all)
- **Auto margins:** `m-auto`, `mx-auto`, `my-auto`, `mt-auto`, `mr-auto`, `mb-auto`, `ml-auto`

A side beats an axis, an axis beats all sides: `pl-1` overrides `p-2`. `.p-0` also empties a `.menu` or dropdown-menu link. A `.card-section` or `.card-divider` whose content should fill it edge to edge (borderless fields, buttons squared toward the neighbouring sections) takes `.flush` instead.

| Size  | Value     | Pixels |
| ----- | --------- | ------ |
| **0** | 0         | 0px    |
| **1** | 0.3125rem | 5px    |
| **2** | 0.5rem    | 8px    |
| **3** | 0.75rem   | 12px   |
| **4** | 1rem      | 16px   |
| **5** | 1.25rem   | 20px   |
| **6** | 1.5rem    | 24px   |
| **7** | 2rem      | 32px   |
| **8** | 2.5rem    | 40px   |
| **9** | 3rem      | 48px   |

Legacy: `.padding-button`, `.padding-xlarge`, `.padding-xxlarge`, Foundation's `.padding-{0-3}` / `.margin-{0-3}` (with sides, e.g. `.padding-top-1`) and `.gutter-*`. Use the scale for anything new.

## Layout and grid

| Category      | Classes                                                                  | Notes                                                  |
| ------------- | ------------------------------------------------------------------------ | ------------------------------------------------------ |
| **Display**   | `.display-block`, `.display-inline`, `.display-inline-block`, `.display-table`, `.display-table-cell` | Hide with `.hide`.                                     |
| **Container** | `.grid-container`                                                        | Add `.fluid` (full width + pad) or `.full` (no pad).   |
| **Grid Flex** | `.grid-x`                                                                | Add `.grid-padding-x` or `.grid-margin-x` for gutters. |
| **Cells**     | `.cell`                                                                  | Add `.auto` (fill space) or `.shrink` (fit content).   |
| **Widths**    | `.width-25`, `.width-50`, `.width-75`, `.width-100`, `.width-article`    | Heights: `.height-25` … `.height-100`.                 |
| **Position**  | `.position-relative`, `.position-absolute`, `.position-fixed`, `.position-static` |                                                        |
| **Overflow**  | `.overflow-hidden`, `.overflow-visible`, `.overflow-x-scroll`, … | `.card` also takes `.overflow-auto`, `.overflow-initial`. |

### Grid columns

Format: `{breakpoint}-{columns}` (12 columns): `small-12` (full width on mobile), `medium-6` (half from medium), `large-4` (a third from large).

## Flexbox

**Container:** `.flex` (or Foundation's `.flex-container`)

| Feature         | Classes                                                                      |
| --------------- | ---------------------------------------------------------------------------- |
| **Direction**   | `.flex-dir-row`, `.flex-dir-column`, `.flex-dir-*-reverse`                   |
| **Justify**     | `.flex-justify-between`; Foundation's `.align-left`, `.align-center`, `.align-right`, `.align-justify`, `.align-spaced` |
| **Align items** | `.flex-align-center`; Foundation's `.align-top`, `.align-middle`, `.align-bottom`, `.align-stretch` |
| **Align self**  | `.align-self-top`, `.align-self-middle`, `.align-self-bottom`, `.align-self-stretch` |
| **Wrap**        | `.flex-wrap`, `.flex-nowrap`                                                 |
| **Grow/Shrink** | `.flex-grow-0`, `.flex-grow-1`, `.flex-shrink-0`, `.flex-shrink-1`, `.flex-child-auto`, `.flex-child-grow`, `.flex-child-shrink` |
| **Push apart**  | `.ml-auto`, `.mr-auto`, `.mx-auto` (auto margins on a child) |

## Typography and visibility

| Category       | Classes                                                                        |
| -------------- | ------------------------------------------------------------------------------ |
| **Alignment**  | `.text-left`, `.text-center`, `.text-right`, `.text-justify`                   |
| **Size**       | `.small`, `.lead`, `.stat`, `.subheader`                                       |
| **Font**       | `.font-normal`, `.font-bold`, `.font-italic`, `.font-wide`                     |
| **Transform**  | `.text-uppercase`, `.text-lowercase`, `.text-capitalize`                       |
| **Decoration** | `.text-underline`, `.text-overline`, `.text-line-through`, `.hover-underline`  |
| **Wrapping**   | `.text-truncate`, `.text-nowrap`, `.text-wrap`                                 |
| **Visibility** | `.hide`, `.invisible`, `.show-for-{size}`, `.hide-for-{size}`, `.show-for-{size}-only`, `.show-for-sr`, `.show-on-focus`, `.show-for-print`, `.hide-for-print`, `.show-for-dark-mode`, `.hide-for-dark-mode` |

## Visual styles

- **Links:** `.brand-links` on a container gives the prose links inside it the brand colour.
- **Borders:** `.bordered`, `.border-none`
- **Radius:** `.rounded` (`--f-radius`), `.rounded-small`, `.rounded-none`, `.rounded-full`
- **Shadows:** `.shadow` (the theme's drop shadow), `.box-shadow-large`, `.no-box-shadow` (`.box-shadow` is a deprecated alias of `.shadow`)
- **Separators:** `.dot-list` puts a `·` after each child but the last; `.dot-list.dot-before` puts it before each but the first, so a wrapped line starts with it

### Interactive

- **Disabled:** `.disabled` (faded, no pointer events)
- **Clickable:** `.clickable` on `.card` / `.info-chip`: opt in where the whole element is interactive but nothing in the markup says so (a JS handler instead of an `[href]`).
- **Click through:** `.click-through` lets the mouse pass the element but not its children.
- **Reveal on focus:** `.show-on-focus-within` keeps the element visually hidden until something inside it has focus (a row of skip links).

## Breakpoints

Used by the grid columns and the visibility classes.

| Prefix     | Min width |
| ---------- | --------- |
| `small-`   | 0         |
| `medium-`  | 480px     |
| `large-`   | 720px     |
| `xlarge-`  | 960px     |
| `xxlarge-` | 1200px    |
