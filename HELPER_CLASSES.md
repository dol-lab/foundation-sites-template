# Helper Classes Reference

Complete reference for all utility/helper classes in this Foundation-based design system.

## Table of Contents

- [Spacing Classes](#spacing-classes)
- [Layout Classes](#layout-classes)
- [Flexbox Utilities](#flexbox-utilities)
- [Grid Utilities](#grid-utilities)
- [Typography](#typography)
- [Display & Visibility](#display--visibility)
- [Colors & Backgrounds](#colors--backgrounds)
- [Borders & Shadows](#borders--shadows)
- [Interactive States](#interactive-states)

---

## Spacing Classes

Our spacing system uses a Tailwind-like numeric scale for consistent spacing throughout your application.

### Spacing Scale

| Class | Value | Pixels | Use Case |
|-------|-------|--------|----------|
| `*-0` | 0 | 0px | No spacing |
| `*-1` | 0.3125rem | 5px | Tiny spacing |
| `*-2` | 0.5rem | 8px | Compact spacing (button vertical) |
| `*-3` | 0.75rem | 12px | Small spacing |
| `*-4` | 1rem | 16px | Base spacing |
| `*-5` | 1.25rem | 20px | Extra spacing |
| `*-6` | 1.5rem | 24px | XL spacing |
| `*-7` | 2rem | 32px | Medium spacing |
| `*-8` | 2.5rem | 40px | XXL spacing |
| `*-9` | 3rem | 48px | Large spacing |

### Padding Classes

#### All Sides
```html
<div class="p-0">No padding</div>
<div class="p-1">Tiny padding (5px)</div>
<div class="p-2">Compact padding (8px)</div>
<div class="p-3">Small padding (12px)</div>
<div class="p-4">Base padding (16px)</div>
<div class="p-5">Extra padding (20px)</div>
<div class="p-6">XL padding (24px)</div>
<div class="p-7">Medium padding (32px)</div>
<div class="p-8">XXL padding (40px)</div>
<div class="p-9">Large padding (48px)</div>
```

#### Directional Padding

**Horizontal (Left + Right)**
```html
<div class="px-2">Horizontal padding</div>
```

**Vertical (Top + Bottom)**
```html
<div class="py-3">Vertical padding</div>
```

**Individual Sides**
```html
<div class="pt-2">Padding top</div>
<div class="pr-2">Padding right</div>
<div class="pb-2">Padding bottom</div>
<div class="pl-2">Padding left</div>
```

**Combining Directional Padding**
```html
<div class="py-3 px-4">Different vertical and horizontal</div>
<div class="pt-2 pb-4 px-3">Custom all sides</div>
```

### Margin Classes

#### All Sides
```html
<div class="m-0">No margin</div>
<div class="m-1">Tiny margin (5px)</div>
<div class="m-2">Compact margin (8px)</div>
<div class="m-3">Small margin (12px)</div>
<div class="m-4">Base margin (16px)</div>
<div class="m-5">Extra margin (20px)</div>
<div class="m-6">XL margin (24px)</div>
<div class="m-7">Medium margin (32px)</div>
<div class="m-8">XXL margin (40px)</div>
<div class="m-9">Large margin (48px)</div>
```

#### Directional Margin

**Horizontal (Left + Right)**
```html
<div class="mx-2">Horizontal margin</div>
<div class="mx-auto">Center horizontally</div>
```

**Vertical (Top + Bottom)**
```html
<div class="my-3">Vertical margin</div>
<div class="my-auto">Center vertically (in flex)</div>
```

**Individual Sides**
```html
<div class="mt-2">Margin top</div>
<div class="mr-2">Margin right</div>
<div class="mb-2">Margin bottom</div>
<div class="ml-2">Margin left</div>
```

**Auto Margins**
```html
<div class="mx-auto">Centered block</div>
<div class="ml-auto">Push to right</div>
<div class="mr-auto">Push to left</div>
```

### Spacing Examples

**Card with Consistent Spacing**
```html
<div class="card p-3">
  <h3 class="mb-2">Card Title</h3>
  <p class="mb-0">Card content with no bottom margin</p>
</div>
```

**Button Group**
```html
<div class="button-group">
  <button class="button p-3">Primary</button>
  <button class="button p-3 ml-2">Secondary</button>
</div>
```

**Responsive Spacing**
```html
<!-- Different spacing at different breakpoints -->
<div class="p-2 medium-p-3 large-p-4">
  Responsive padding
</div>
```

---

## Layout Classes

### Display Utilities

```html
<div class="display-block">Block element</div>
<div class="display-inline">Inline element</div>
<div class="display-inline-block">Inline-block</div>
<div class="display-flex">Flex container</div>
<div class="display-grid">Grid container</div>
<div class="display-none">Hidden</div>
```

### Width Classes

```html
<div class="width-100">Full width (100%)</div>
<div class="width-auto">Auto width</div>
<div class="width-article">Article width (optimized for reading)</div>
```

### Container Classes

```html
<div class="grid-container">
  <!-- Max-width container (70rem) -->
</div>

<div class="grid-container fluid">
  <!-- Full-width container with padding -->
</div>

<div class="grid-container full">
  <!-- Full-width container without padding -->
</div>
```

---

## Flexbox Utilities

### Flex Container

```html
<div class="flex">
  <!-- Basic flex container -->
</div>

<div class="flex flex-dir-row">
  <!-- Flex row (default) -->
</div>

<div class="flex flex-dir-column">
  <!-- Flex column -->
</div>
```

### Flex Direction

```html
<div class="flex-dir-row">Row direction</div>
<div class="flex-dir-column">Column direction</div>
<div class="flex-dir-row-reverse">Reversed row</div>
<div class="flex-dir-column-reverse">Reversed column</div>
```

### Justify Content (Main Axis)

```html
<div class="flex justify-start">Items at start</div>
<div class="flex justify-center">Items centered</div>
<div class="flex justify-end">Items at end</div>
<div class="flex justify-between">Space between items</div>
<div class="flex justify-around">Space around items</div>
<div class="flex flex-justify-between">Alternative syntax</div>
```

### Align Items (Cross Axis)

```html
<div class="flex align-top">Align to top</div>
<div class="flex align-middle">Align to center</div>
<div class="flex align-bottom">Align to bottom</div>
<div class="flex align-stretch">Stretch items</div>
<div class="flex flex-align-center">Alternative syntax</div>
```

### Align Self (Individual Items)

```html
<div class="align-self-top">Align this item to top</div>
<div class="align-self-middle">Align this item to center</div>
<div class="align-self-bottom">Align this item to bottom</div>
<div class="align-flex-start">Alternative syntax</div>
<div class="align-flex-end">Alternative syntax</div>
```

### Flex Wrap

```html
<div class="flex flex-wrap">Allow wrapping</div>
<div class="flex flex-nowrap">Prevent wrapping</div>
```

### Flex Grow & Shrink

```html
<div class="flex-grow-0">Don't grow</div>
<div class="flex-grow-1">Allow growth</div>
<div class="flex-shrink-0">Don't shrink</div>
<div class="flex-shrink-1">Allow shrinking</div>
```

### Flex Child Utilities

```html
<div class="flex-child-auto">Auto-sized child</div>
<div class="flex-child-grow">Growing child</div>
<div class="flex-child-shrink">Shrinking child</div>
```

### Flex Spacers

```html
<div class="flex">
  <div>Left</div>
  <div class="flex-spacer-left">Pushed left</div>
</div>

<div class="flex">
  <div>Left</div>
  <div class="flex-spacer-right">Pushed right</div>
</div>

<div class="flex">
  <div class="flex-spacer-around">Centered with space</div>
</div>
```

### Complete Flex Example

```html
<div class="flex justify-between align-middle p-3">
  <div class="flex-child-grow">
    <h3 class="mb-0">Title</h3>
  </div>
  <div class="flex-child-shrink">
    <button class="button p-3">Action</button>
  </div>
</div>
```

---

## Grid Utilities

### Grid Container

```html
<div class="grid-x">
  <!-- Flex-based grid -->
</div>

<div class="grid-x grid-padding-x">
  <!-- Grid with horizontal padding -->
</div>

<div class="grid-x grid-margin-x">
  <!-- Grid with horizontal margins -->
</div>
```

### Grid Cells

```html
<div class="grid-x">
  <div class="cell">Full width cell</div>
  <div class="cell auto">Auto-sized cell</div>
  <div class="cell shrink">Shrink-to-fit cell</div>
</div>
```

### Column Sizes

**Small (Mobile First)**
```html
<div class="grid-x">
  <div class="cell small-12">Full width on small</div>
  <div class="cell small-6">Half width on small</div>
  <div class="cell small-4">Third width on small</div>
</div>
```

**Responsive Columns**
```html
<div class="grid-x">
  <div class="cell small-12 medium-6 large-4">
    <!-- Full on small, half on medium, third on large -->
  </div>
</div>
```

### Grid Example

```html
<div class="grid-container">
  <div class="grid-x grid-margin-x">
    <div class="cell small-12 medium-6 large-4 mb-3">
      <div class="card p-3">
        <h4 class="mb-2">Card 1</h4>
        <p class="mb-0">Content</p>
      </div>
    </div>
    <div class="cell small-12 medium-6 large-4 mb-3">
      <div class="card p-3">
        <h4 class="mb-2">Card 2</h4>
        <p class="mb-0">Content</p>
      </div>
    </div>
    <div class="cell small-12 medium-6 large-4 mb-3">
      <div class="card p-3">
        <h4 class="mb-2">Card 3</h4>
        <p class="mb-0">Content</p>
      </div>
    </div>
  </div>
</div>
```

---

## Typography

### Text Alignment

```html
<p class="text-left">Left aligned</p>
<p class="text-center">Center aligned</p>
<p class="text-right">Right aligned</p>
<p class="text-justify">Justified</p>
```

**Responsive Text Alignment**
```html
<p class="text-left medium-text-center large-text-right">
  Responsive alignment
</p>
```

### Font Sizes

```html
<span class="small">Small text (0.8rem)</span>
<span>Normal text</span>
<p class="lead">Lead paragraph (1.25rem)</p>
<span class="stat">Stat text (3rem)</span>
```

### Text Transforms

```html
<span class="text-uppercase">UPPERCASE</span>
<span class="text-lowercase">lowercase</span>
<span class="text-capitalize">Capitalized</span>
```

### Font Weights

```html
<span class="font-weight-normal">Normal (400)</span>
<span class="font-weight-bold">Bold (500)</span>
```

### Text Utilities

```html
<p class="text-truncate">Text that will be truncated with ellipsis...</p>
<p class="subheader">Subheader text</p>
```

---

## Display & Visibility

### Show/Hide Classes

```html
<div class="show">Always visible</div>
<div class="hide">Always hidden</div>
```

### Responsive Visibility

**Show for Specific Sizes**
```html
<div class="show-for-small-only">Small screens only</div>
<div class="show-for-medium">Medium and up</div>
<div class="show-for-large">Large and up</div>
```

**Hide for Specific Sizes**
```html
<div class="hide-for-small-only">Hidden on small</div>
<div class="hide-for-medium">Hidden on medium and up</div>
<div class="hide-for-large">Hidden on large and up</div>
```

### Print Utilities

```html
<div class="show-for-print">Visible when printing</div>
<div class="hide-for-print">Hidden when printing</div>
```

---

## Colors & Backgrounds

### Background Colors

```html
<div class="bg-primary">Primary background</div>
<div class="bg-secondary">Secondary background</div>
<div class="bg-success">Success background</div>
<div class="bg-warning">Warning background</div>
<div class="bg-alert">Alert background</div>
```

### Text Colors

```html
<span class="color-primary">Primary text</span>
<span class="color-secondary">Secondary text</span>
<span class="color-success">Success text</span>
<span class="color-warning">Warning text</span>
<span class="color-alert">Alert text</span>
```

---

## Borders & Shadows

### Border Utilities

```html
<div class="border">All borders</div>
<div class="border-top">Top border</div>
<div class="border-right">Right border</div>
<div class="border-bottom">Bottom border</div>
<div class="border-left">Left border</div>
<div class="border-none">No border</div>
```

### Border Radius

```html
<div class="radius">Standard radius</div>
<div class="radius-small">Small radius</div>
<div class="radius-large">Large radius</div>
<div class="radius-round">Fully rounded</div>
```

### Box Shadows

```html
<div class="shadow">Standard shadow</div>
<div class="shadow-small">Small shadow</div>
<div class="shadow-large">Large shadow</div>
<div class="shadow-none">No shadow</div>
```

---

## Interactive States

### Hover Effects

```html
<div class="hover-shadow">Shadow on hover</div>
<div class="hover-lift">Lift on hover</div>
```

### Cursor Utilities

```html
<div class="cursor-pointer">Pointer cursor</div>
<div class="cursor-not-allowed">Not allowed cursor</div>
<div class="cursor-default">Default cursor</div>
```

### Disabled State

```html
<button class="button disabled">Disabled button</button>
<div class="disabled">Disabled element</div>
```

---

## Responsive Breakpoints

All classes can be prefixed with breakpoint names for responsive behavior:

| Breakpoint | Min Width | Prefix | Example |
|------------|-----------|--------|---------|
| Small | 0 | `small-` | `small-p-2` |
| Medium | 30em (480px) | `medium-` | `medium-p-3` |
| Large | 45em (720px) | `large-` | `large-p-4` |
| XLarge | 60em (960px) | `xlarge-` | `xlarge-p-5` |
| XXLarge | 75em (1200px) | `xxlarge-` | `xxlarge-p-5` |

### Responsive Examples

```html
<!-- Different padding at different sizes -->
<div class="p-2 medium-p-3 large-p-4">
  Responsive padding
</div>

<!-- Different layouts at different sizes -->
<div class="grid-x">
  <div class="cell small-12 medium-6 large-4">
    <!-- Full width on mobile, half on tablet, third on desktop -->
  </div>
</div>

<!-- Show/hide at different sizes -->
<div class="show-for-small-only">Mobile only</div>
<div class="hide-for-small-only">Hidden on mobile</div>
```

---

## Common Patterns

### Centered Card

```html
<div class="grid-container">
  <div class="grid-x justify-center">
    <div class="cell small-12 medium-8 large-6">
      <div class="card p-4 my-5">
        <h2 class="text-center mb-3">Centered Card</h2>
        <p class="text-center mb-0">Content</p>
      </div>
    </div>
  </div>
</div>
```

### Header with Actions

```html
<div class="flex justify-between align-middle p-3 border-bottom">
  <h1 class="mb-0">Page Title</h1>
  <div class="flex align-middle">
    <button class="button p-3 mr-2">Secondary</button>
    <button class="button primary p-3">Primary</button>
  </div>
</div>
```

### Responsive Grid Cards

```html
<div class="grid-container">
  <div class="grid-x grid-margin-x">
    <div class="cell small-12 medium-6 large-4 mb-3">
      <div class="card p-3">
        <h3 class="mb-2">Card Title</h3>
        <p class="mb-3">Card description</p>
        <button class="button p-3 width-100">
          Learn More
        </button>
      </div>
    </div>
  </div>
</div>
```

### Sidebar Layout

```html
<div class="flex">
  <aside class="flex-child-shrink p-4 border-right"
         style="min-width: 250px">
    <!-- Sidebar content -->
  </aside>
  <main class="flex-child-grow p-4">
    <!-- Main content -->
  </main>
</div>
```

---

## Best Practices

### 1. Use Spacing Consistently

Stick to the spacing scale for visual harmony:

✅ **Good**
```html
<div class="p-3 mb-4">
  <h2 class="mb-2">Title</h2>
  <p class="mb-0">Content</p>
</div>
```

❌ **Avoid**
```html
<div style="padding: 17px; margin-bottom: 23px">
  <h2 style="margin-bottom: 9px">Title</h2>
  <p>Content</p>
</div>
```

### 2. Mobile-First Approach

Start with mobile layout, add larger breakpoints:

✅ **Good**
```html
<div class="p-2 medium-p-3 large-p-4">
  Content scales up
</div>
```

❌ **Avoid**
```html
<div class="large-p-4 medium-p-3 small-p-2">
  Don't start with desktop
</div>
```

### 3. Combine Utilities

Use multiple utilities together:

```html
<div class="flex justify-between align-middle p-3 border-bottom">
  <!-- Flexbox + spacing + border -->
</div>
```

### 4. Semantic HTML First

Use semantic HTML elements, enhance with utilities:

✅ **Good**
```html
<header class="flex justify-between align-middle p-3">
  <h1 class="mb-0">Site Title</h1>
</header>
```

❌ **Avoid**
```html
<div class="flex justify-between align-middle p-3">
  <div class="mb-0 text-large">Site Title</div>
</div>
```

---

## Migration from Old System

If you're migrating from the old spacing system:

| Old | New | Tool |
|-----|-----|------|
| `padding-small` | `p-1` | Use `migrate-spacing.sh` |
| `padding-medium` | `p-2` | Automated migration |
| `padding-large` | `p-3` | See MIGRATION_GUIDE.md |

**Quick Migration:**
```bash
# Migrate all HTML files
git ls-files '*.html' | ./migrate-spacing.sh --backup

# See QUICK_START_MIGRATION.md for more examples
```

---

## Additional Resources

- **SPACING_MIGRATION_PLAN.md** - Detailed regex patterns and mapping
- **MIGRATION_GUIDE.md** - Comprehensive migration guide
- **QUICK_START_MIGRATION.md** - Fast reference for migration
- **migrate-spacing.sh** - Automated migration script

---

## Need Help?

- Check examples above for common patterns
- Review the migration guides for updating old code
- All spacing uses modern CSS (logical properties where applicable)
- Utilities are designed to work together - combine them freely!

**Pro Tip:** Use browser DevTools to inspect elements and see which classes are applied. This helps you learn the system quickly!
