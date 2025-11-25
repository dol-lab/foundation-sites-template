# Helper Classes Reference

## 1. Spacing

**Syntax:** `{property}{side}-{size}`

- **Property:** `m` (margin), `p` (padding)
- **Side:** `t` (top), `b` (bottom), `l` (left), `r` (right), `x` (horizontal), `y` (vertical), *(blank)* (all)

| Size  | Value     | Pixels | Usage   |
| ----- | --------- | ------ | ------- |
| **0** | 0         | 0px    | None    |
| **1** | 0.3125rem | 5px    | Tiny    |
| **2** | 0.5rem    | 8px    | Compact |
| **3** | 0.75rem   | 12px   | Small   |
| **4** | 1rem      | 16px   | Base    |
| **5** | 1.25rem   | 20px   | Extra   |
| **6** | 1.5rem    | 24px   | XL      |
| **7** | 2rem      | 32px   | Medium  |
| **8** | 2.5rem    | 40px   | XXL     |
| **9** | 3rem      | 48px   | Large   |

**Examples:** `p-4` (base padding), `mx-auto` (center block), `mt-2` (margin top compact).

## 2. Layout & Grid

| Category      | Classes                                                      | Notes                                                  |
| ------------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| **Display**   | `.display-block`, `.display-inline`, `.display-flex`, `.display-none` |                                                        |
| **Container** | `.grid-container`                                            | Add `.fluid` (full width + pad) or `.full` (no pad).   |
| **Grid Flex** | `.grid-x`                                                    | Add `.grid-padding-x` or `.grid-margin-x` for gutters. |
| **Cells**     | `.cell`                                                      | Add `.auto` (fill space) or `.shrink` (fit content).   |
| **Widths**    | `.width-100`, `.width-auto`, `.width-article`                |                                                        |

### Grid Columns

Format: `{breakpoint}-{columns}` (Total columns: 12)

- `small-12` (Full width on mobile)
- `medium-6` (Half width on tablet)
- `large-4` (Third width on desktop)

## 3. Flexbox Utilities

**Container:** `.flex`

| Feature         | Classes                                                      |
| --------------- | ------------------------------------------------------------ |
| **Direction**   | `.flex-dir-row`, `.flex-dir-column`, `.flex-dir-*-reverse`   |
| **Justify**     | `.justify-start`, `.justify-center`, `.justify-end`, `.justify-between`, `.justify-around` |
| **Align Items** | `.align-top`, `.align-middle`, `.align-bottom`, `.align-stretch` |
| **Align Self**  | `.align-self-top`, `.align-self-middle`, `.align-self-bottom` |
| **Wrap**        | `.flex-wrap`, `.flex-nowrap`                                 |
| **Grow/Shrink** | `.flex-grow-1`, `.flex-shrink-0`, `.flex-child-auto`, `.flex-child-grow` |

## 4. Typography & Visibility

| Category       | Classes                                                      |
| -------------- | ------------------------------------------------------------ |
| **Alignment**  | `.text-left`, `.text-center`, `.text-right`, `.text-justify` |
| **Size**       | `.small`, `.lead`, `.stat`, `.subheader`                     |
| **Weight**     | `.font-weight-normal`, `.font-weight-bold`                   |
| **Transform**  | `.text-uppercase`, `.text-lowercase`, `.text-capitalize`, `.text-truncate` |
| **Visibility** | `.show`, `.hide`, `.show-for-{size}`, `.hide-for-{size}`, `.show-for-print` |

## 5. Visual Styles

### Colors

- **Backgrounds:** `.bg-primary`, `.bg-secondary`, `.bg-success`, `.bg-warning`, `.bg-alert`
- **Text:** `.color-primary`, `.color-secondary`, `.color-success`, `.color-warning`, `.color-alert`

### Borders & Shadows

- **Borders:** `.border` (all), `.border-{side}`, `.border-none`
- **Radius:** `.radius` (base), `.radius-small`, `.radius-large`, `.radius-round`
- **Shadows:** `.shadow` (base), `.shadow-small`, `.shadow-large`, `.shadow-none`

### Interactive

- **Hover:** `.hover-shadow`, `.hover-lift`
- **Cursor:** `.cursor-pointer`, `.cursor-not-allowed`, `.disabled`

## 6. Responsive Breakpoints

Prefix any utility class with these breakpoints (e.g., `medium-p-4`, `large-text-center`).

| Prefix     | Min Width | Device                   |
| ---------- | --------- | ------------------------ |
| `small-`   | 0         | Mobile                   |
| `medium-`  | 480px     | Tablet Portrait          |
| `large-`   | 720px     | Tablet Landscape/Desktop |
| `xlarge-`  | 960px     | Large Desktop            |
| `xxlarge-` | 1200px    | Wide Screens             |

## Common Patterns

**Responsive Card**

```
<div class="card p-3 medium-p-4 shadow hover-lift">
  <h3 class="mb-2">Title</h3>
  <p class="mb-0 text-truncate">Description content...</p>
</div>
```

**Flex Header**

```
<header class="flex justify-between align-middle p-3 border-bottom">
  <h1 class="mb-0">Logo</h1>
  <div class="flex">
    <button class="button mr-2">Login</button>
    <button class="button primary">Sign Up</button>
  </div>
</header>
```

**Sidebar Layout**

```
<div class="flex">
  <aside class="flex-child-shrink width-article show-for-medium border-right">...</aside>
  <main class="flex-child-grow p-4">...</main>
</div>
```

### Best Practices

- **Semantic:** Use `<header>`, `<main>`, `<footer>` tags, then apply classes.
- **Mobile-First:** Write `p-2` (mobile default), then `medium-p-4` (overrides).
- **Spacing:** Avoid custom styles; strictly use the scale (0-9).
