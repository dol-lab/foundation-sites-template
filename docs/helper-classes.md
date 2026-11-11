# Helper classes

Utility classes from `scss/custom-styles/_utilities.scss` and Foundation's prototype and flex helpers. They are not responsive: only the visibility classes take a breakpoint.

## Spacing

**Syntax:** `{property}{side}-{size}`, plus `gap-{size}`.

- **Property:** `m` (margin), `p` (padding)
- **Side:** `t` (top), `b` (bottom), `l` (left), `r` (right), `x` (horizontal), `y` (vertical), *(blank)* (all)
- **Auto margins:** `m-auto`, `mx-auto`, `my-auto`, `mt-auto`, `mr-auto`, `mb-auto`, `ml-auto`

The class names follow Tailwind, the values do not (Tailwind's `p-8` is 2rem, here it is 2.5rem): read the table below.

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

Legacy: Foundation's `.padding-{0-1}` / `.margin-{0-1}` (with sides, e.g. `.padding-top-1`) and `.gutter-*`. Use the scale for anything new.

## Layout

The grid, containers, breakpoints, `.prose-layout` and `.auto-grid`: [layout](layout.md).

| Category      | Classes                                                                  | Notes                                                  |
| ------------- | ------------------------------------------------------------------------ | ------------------------------------------------------ |
| **Display**   | `.display-inline-block`                                                  | Hide with `.hide`.                                     |
| **Widths**    | `.width-100`, `.max-width-100`, `.max-height-100`                        |                                                        |
| **Position**  | `.position-relative`                                                     |                                                        |
| **Overflow**  | `.overflow-hidden`, `.overflow-x-hidden`, `.overflow-y-hidden`           | `.card` also takes `.overflow-auto`, `.overflow-initial`. |

## Flexbox

**Container:** `.flex`

| Feature         | Classes                                                                      |
| --------------- | ---------------------------------------------------------------------------- |
| **Direction**   | `.flex-dir-row`, `.flex-dir-column`, `.flex-dir-*-reverse`                   |
| **Justify**     | `.flex-justify-between`; Foundation's `.align-left`, `.align-center`, `.align-right`, `.align-justify`, `.align-spaced` |
| **Align items** | `.flex-align-center`; Foundation's `.align-top`, `.align-middle`, `.align-bottom`, `.align-stretch` |
| **Align self**  | `.align-self-top`, `.align-self-middle`, `.align-self-bottom`, `.align-self-stretch` |
| **Wrap**        | `.flex-wrap`, `.flex-nowrap`                                                 |
| **Grow/Shrink** | `.flex-grow-0`, `.flex-grow-1`, `.flex-shrink-0`, `.flex-shrink-1`, `.flex-child-grow`, `.flex-child-shrink` |
| **Push apart**  | `.ml-auto`, `.mr-auto`, `.mx-auto` (auto margins on a child) |

## Typography and visibility

| Category       | Classes                                                                        |
| -------------- | ------------------------------------------------------------------------------ |
| **Alignment**  | `.text-left`, `.text-center`, `.text-right`                                    |
| **Size**       | `.small`, `.lead`, `.stat`, `.subheader`                                       |
| **Font**       | `.font-normal`, `.font-bold`                                                   |
| **Decoration** | `.hover-underline`                                                             |
| **Wrapping**   | `.text-truncate`, `.text-wrap`, `.line-clamp` (two lines, then an ellipsis)    |
| **Visibility** | `.hide`, `.invisible`, `.show-for-{size}`, `.hide-for-{size}`, `.show-for-{size}-only` (small to large), `.show-for-sr`, `.show-for-print`, `.hide-for-print` |

## Visual styles

- **Links:** `.brand-links` on a container gives the prose links inside it the brand colour.
- **Borders:** `.border-none`
- **Radius:** `.rounded` (`--f-radius`), `.rounded-small`, `.rounded-none`, `.rounded-full`
- **Shadows:** `.shadow` (the theme's drop shadow), `.shadow-none` (deprecated aliases: `.box-shadow`, `.no-box-shadow`)
- **Separators:** `.dot-list` puts a `·` after each child but the last; `.dot-list.dot-before` puts it before each but the first, so a wrapped line starts with it
- **Card rows:** `.card-item` on the rows of a `.card` sets every row but the first off by a hairline
- **Placeholder pattern:** `.cube-grid` fills the element with a pattern of cubes in the surface colors (a missing image; a `.clipped.feature-image` has it already). `--f-cube-size` sets a cube's width (default 75px).

### Interactive

- **Disabled:** `.disabled` (faded, no pointer events)
- **Clickable:** `.clickable` on `.card` / `.info-chip`: opt in where the whole element is interactive but nothing in the markup says so (a JS handler instead of an `[href]`).
- **Click through:** `.click-through` lets the mouse pass the element but not its children.
- **Reveal on focus:** `.show-on-focus-within` keeps the element visually hidden until something inside it has focus (a row of skip links).
