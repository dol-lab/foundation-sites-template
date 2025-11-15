# Remaining CSS Variable Migrations

## Completed Sections (Migrated to Component Files)
- Section 0: Custom Settings → foundation-spaces/_global.scss
- Section 1: Global → foundation-spaces/_global.scss
- Section 2: Breakpoints → util/_breakpoint.scss
- Section 3: The Grid → grid/_grid.scss
- Section 4: Base Typography → typography/_base.scss
- Section 5: Typography Helpers → typography/_helpers.scss
- Section 9: Badge → _s-badge.scss
- Section 12: Button Group → _s-button-group.scss
- Section 15: Close Button → components/_close-button.scss

## Remaining Sections to Migrate

### Section 16: Drilldown
**Target File:** `/home/user/foundation-sites-template/scss/custom-includes/foundation-spaces/components/_drilldown.scss`

Variables to update:
- `$drilldown-transition`: transform $global-transition-short $global-transition-timing
- `$drilldown-arrows`: true
- `$drilldown-padding`: $global-menu-padding
- `$drilldown-nested-margin`: 0
- `$drilldown-background`: $color-bg-1
- `$drilldown-submenu-padding`: $drilldown-padding
- `$drilldown-submenu-background`: $color-bg-1
- `$drilldown-arrow-color`: currentcolor
- `$drilldown-arrow-size`: 6px

### Section 17: Dropdown
**Target File:** `/home/user/foundation-sites-template/scss/custom-includes/foundation-spaces/components/_dropdown.scss`

Variables to update:
- `$dropdown-padding`: 0
- `$dropdown-background`: $color-bg-1
- `$dropdown-border`: none
- `$dropdown-font-size`: 0.75rem
- `$dropdown-width`: 250px
- `$dropdown-radius`: $global-radius
- `$dropdown-sizes`: (tiny: 100px, small: 200px, large: 400px)

### Section 18: Dropdown Menu
**Target File:** `/home/user/foundation-sites-template/scss/custom-includes/foundation-spaces/components/_dropdown-menu.scss`

Variables to update:
- `$dropdownmenu-arrows`: true
- `$dropdownmenu-arrow-color`: $anchor-color
- `$dropdownmenu-arrow-size`: 6px
- `$dropdownmenu-arrow-padding`: 1.5rem
- `$dropdownmenu-min-width`: 200px
- `$dropdownmenu-background`: $color-text-0
- `$dropdownmenu-submenu-background`: $dropdownmenu-background
- `$dropdownmenu-padding`: $global-menu-padding
- `$droppdownmenu-nested-margin`: 0
- `$dropdownmenu-submenu-padding`: 0.75rem 0.9rem
- `$dropdownmenu-border`: 1px solid $color-border-0
- `$dropdown-menu-item-color-active`: none
- `$dropdown-menu-item-background-active`: $color-bg-2

### Section 19: Flexbox Utilities
**Target File:** `/home/user/foundation-sites-template/scss/custom-includes/foundation-spaces/components/_flex.scss`

Variables to update:
- `$flex-source-ordering-count`: 6
- `$flexbox-responsive-breakpoints`: true

### Section 21: Label
**Target File:** `/home/user/foundation-sites-template/scss/custom-includes/_s-label.scss`

Variables to update:
- `$label-background-default`: $color-text-1
- `$label-color-default`: $color-bg-1
- `$label-palette`: $foundation-palette
- `$label-font-size`: $paragraph-font-size
- `$label-padding`: 0.5rem 0.75rem
- `$label-radius`: $global-radius

### Section 22: Media Object
**Target File:** `/home/user/foundation-sites-template/scss/custom-includes/foundation-spaces/components/_media-object.scss`

Variables to update:
- `$mediaobject-margin-bottom`: $global-margin
- `$mediaobject-section-padding`: $global-padding
- `$mediaobject-image-width-stacked`: 100%

### Section 23: Menu
**Target File:** `/home/user/foundation-sites-template/scss/custom-includes/_s-menu.scss`

Variables to update:
- `$menu-margin`: 0
- `$menu-nested-margin`: $global-menu-nested-margin
- `$menu-items-padding`: $global-menu-padding
- `$menu-simple-margin`: 1rem
- `$menu-item-color-active`: $color-text-0
- `$menu-item-background-active`: $color-bg-2
- `$menu-icon-spacing`: 0.5rem
- `$menu-item-background-hover`: $color-bg-2
- `$menu-state-back-compat`: true
- `$menu-centered-back-compat`: true
- `$menu-icons-back-compat`: true

### Section 24: Meter
**Target File:** `/home/user/foundation-sites-template/scss/custom-includes/foundation-spaces/forms/_meter.scss`

Variables to update:
- `$meter-height`: 1rem
- `$meter-radius`: $global-radius
- `$meter-background`: $color-bg-1
- `$meter-fill-good`: var(--f-color-success)
- `$meter-fill-medium`: var(--f-color-warning)
- `$meter-fill-bad`: var(--f-color-alert)

### Section 25: Off-canvas
**Target File:** `/home/user/foundation-sites-template/scss/custom-includes/foundation-spaces/components/_off-canvas.scss`

Variables to update:
- `$offcanvas-sizes`: (small: 250px)
- `$offcanvas-vertical-sizes`: (small: 250px)
- `$offcanvas-background`: $color-bg-2
- `$offcanvas-shadow`: 0 0 10px color-mix-opacity(#{$color-text-0}, 70%, 30%)
- `$offcanvas-inner-shadow-size`: 20px
- `$offcanvas-inner-shadow-color`: color-mix-opacity(#{$color-text-0}, 25%, 75%)
- `$offcanvas-overlay-zindex`: 11
- `$offcanvas-push-zindex`: 12
- `$offcanvas-overlap-zindex`: 13
- `$offcanvas-reveal-zindex`: 12
- `$offcanvas-transition-length`: $global-transition-long
- `$offcanvas-transition-timing`: $global-transition-timing
- `$offcanvas-fixed-reveal`: true
- `$offcanvas-exit-background`: color-mix-opacity(#{$color-bg-0}, 25%, 75%)
- `$maincontent-class`: "off-canvas-content"

### Section 26: Orbit
**Target File:** `/home/user/foundation-sites-template/scss/custom-includes/_s-orbit.scss`

Variables to update:
- `$orbit-bullet-background`: color-mix-opacity(#{$color-text-0}, 10%, 90%)
- `$orbit-bullet-background-active`: $color-text-0
- `$orbit-bullet-diameter`: 0.75rem
- `$orbit-bullet-margin`: 0.25rem
- `$orbit-bullet-margin-top`: 0.5rem
- `$orbit-bullet-margin-bottom`: 0.5rem
- `$orbit-caption-background`: color-mix-opacity(#{$color-bg-1}, 75%, 35%)
- `$orbit-caption-padding`: 0.25rem
- `$orbit-control-background`: $color-bg-0
- `$orbit-control-padding`: 1rem
- `$orbit-control-zindex`: 10

### Section 27: Pagination
**Target File:** `/home/user/foundation-sites-template/scss/custom-includes/foundation-spaces/components/_pagination.scss`

Variables to update:
- `$pagination-margin-bottom`: 0
- `$pagination-item-color`: $color-text-1
- `$pagination-item-spacing`: 0.125rem
- `$pagination-item-background-hover`: $color-bg-1
- `$pagination-item-background-current`: $color-bg-1
- `$pagination-item-color-current`: $color-text-0
- `$pagination-item-color-disabled`: color-mix-opacity(#{$color-text-1}, 50%, 50%)
- `$pagination-ellipsis-color`: $color-text-0

### Section 28: Progress Bar
**Target File:** `/home/user/foundation-sites-template/scss/custom-includes/_s-progress-bar.scss`

Variables to update:
- `$progress-height`: 1rem
- `$progress-background`: color-mix-blend(#{$color-text-1}, 7%, #{$color-bg-1}, 93%)
- `$progress-margin-bottom`: $global-margin
- `$progress-meter-background`: var(--f-color-brand)
- `$progress-radius`: $global-radius

### Sections 29-46: Prototype Classes
**Target Files:** `/home/user/foundation-sites-template/scss/custom-includes/foundation-spaces/prototype/*.scss`

All prototype sections reference `$global-prototype-breakpoints` which is already set to `false` in _global.scss, and most other values match defaults or reference color variables. These can be migrated to their respective prototype component files.

### Section 47: Reveal
**Target File:** `/home/user/foundation-sites-template/scss/custom-includes/_s-reveal.scss`

Variables to update:
- `$reveal-background`: $color-bg-1
- `$reveal-width`: calc(100% - 2 * #{$global-gutter-large})
- `$reveal-max-width`: map-get($breakpoints, large)
- `$reveal-padding`: $global-padding
- `$reveal-border`: none
- `$reveal-radius`: $global-radius
- `$reveal-zindex`: 1005
- `$reveal-overlay-background`: color-mix-opacity(#{$color-text-0}, 14%, 86%)

### Section 48: Slider
**Target File:** `/home/user/foundation-sites-template/scss/custom-includes/_s-slider.scss`

Variables to update:
- `$slider-width-vertical`: 0.5rem
- `$slider-transition`: all $global-transition-medium $global-transition-timing
- `$slider-height`: 0.25rem
- `$slider-background`: color-mix-opacity(#{$color-text-0}, 14%, 86%)
- `$slider-fill-background`: color-mix-opacity(#{$color-text-0}, 30%, 70%)
- `$slider-handle-height`: 1.4rem
- `$slider-handle-width`: 1rem
- `$slider-handle-background`: $color-text-0
- `$slider-opacity-disabled`: 0.25
- `$slider-radius`: $global-radius

### Section 52: Thumbnail
**Target File:** `/home/user/foundation-sites-template/scss/custom-includes/foundation-spaces/components/_thumbnail.scss`

Variables to update:
- `$thumbnail-border`: 4px solid $color-border-0
- `$thumbnail-margin-bottom`: $global-margin
- `$thumbnail-shadow`: none
- `$thumbnail-shadow-hover`: $global-drop-shadow
- `$thumbnail-transition`: box-shadow $global-transition-medium $global-transition-timing
- `$thumbnail-radius`: $global-radius

### Section 53: Title Bar
**Target File:** `/home/user/foundation-sites-template/scss/custom-includes/foundation-spaces/components/_title-bar.scss`

Variables to update:
- `$titlebar-background`: $color-bg-1
- `$titlebar-color`: $color-text-1
- `$titlebar-padding`: 0.5rem
- `$titlebar-text-font-weight`: bold
- `$titlebar-icon-color`: $color-text-2
- `$titlebar-icon-color-hover`: $color-text-1
- `$titlebar-icon-spacing`: 0.25rem

### Section 54: Tooltip
**Target File:** `/home/user/foundation-sites-template/scss/custom-includes/foundation-spaces/components/_tooltip.scss`

Variables to update:
- `$has-tip-cursor`: help
- `$has-tip-font-weight`: $global-weight-normal
- `$has-tip-border-bottom`: none
- `$tooltip-background-color`: $color-text-0
- `$tooltip-color`: $color-bg-1
- `$tooltip-padding`: 0.75rem
- `$tooltip-max-width`: 12rem
- `$tooltip-font-size`: $small-font-size
- `$tooltip-pip-width`: 0.75rem
- `$tooltip-pip-height`: $tooltip-pip-width * 0.866
- `$tooltip-radius`: $global-radius

### Section 55: Top Bar
**Target File:** `/home/user/foundation-sites-template/scss/custom-includes/foundation-spaces/components/_top-bar.scss`

Variables to update:
- `$topbar-padding`: 0.5rem
- `$topbar-background`: $color-bg-1
- `$topbar-submenu-background`: $topbar-background
- `$topbar-title-spacing`: 0.5rem 1rem 0.5rem 0
- `$topbar-input-width`: 200px
- `$topbar-unstack-breakpoint`: medium

### Section 56: Xy Grid
**Target File:** `/home/user/foundation-sites-template/scss/custom-includes/foundation-spaces/xy-grid/_grid.scss` or `_xy-grid.scss`

Variables to update:
- `$xy-grid`: true
- `$grid-container`: $global-width
- `$grid-columns`: 12
- `$grid-margin-gutters`: (small: $global-gutter-small, medium: $global-gutter-small, large: $global-gutter-large, xlarge: $global-gutter-large, xxlarge: $global-gutter-large)
- `$grid-padding-gutters`: $grid-margin-gutters
- `$grid-container-padding`: (small: 2 * $global-gutter-small, medium: 2 * $global-gutter-small, large: 2 * $global-gutter-large, xlarge: 2 * $global-gutter-large, xxlarge: 2 * $global-gutter-large)
- `$grid-container-max`: $global-width
- `$xy-block-grid-max`: 8

## Summary

**Total Sections:** 56
**Completed:** 9 sections
**Remaining:** 47 sections (many are prototype classes with minimal/no overrides)

## Next Steps

For each remaining section:
1. Open the target component file
2. Find the corresponding `!default` variable declarations
3. Update the default value to match the override value from `_settings.scss`
4. Delete the section from `_settings.scss`
5. Replace with comment: `// [Section Name] settings have been moved to [file path]`

After all sections are migrated, `_settings.scss` should only contain:
- Import statements at the top
- Comment placeholders indicating where each section's settings were moved
