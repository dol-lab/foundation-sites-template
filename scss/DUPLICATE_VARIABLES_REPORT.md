# SCSS Variable Duplicates Analysis Report

## Executive Summary

- **Total duplicate variables found:** 462
- **Variables in `_settings.scss` duplicated elsewhere:** 439
- **Variables in `_custom-settings.scss` duplicated elsewhere:** 20
- **Variables that can be safely removed from `_settings.scss`:** 259 (same value as defaults)
- **Variables that can be safely removed from `_custom-settings.scss`:** 10 (same value as defaults)

## Import Order (from app.scss)

1. `custom-functions` (functions used throughout)
2. `colors` (color settings)
3. `fonts` (font imports)
4. **`settings`** ← Foundation variable overrides (imported FIRST)
5. **`custom-settings`** ← Custom variables and overrides (imported SECOND)
6. `custom-foundation-imports` ← Component files with !default values

**Key Insight:** Variables in `_settings.scss` and `_custom-settings.scss` WITHOUT `!default` override the `!default` values in component files. This is the standard SCSS pattern.

## Understanding the Duplicates

### How SCSS !default Works
- Variables with `!default` in component files are **fallback defaults**
- Variables WITHOUT `!default` in settings files are **final values that override defaults**
- This is INTENTIONAL and follows Foundation's architecture

### Three Types of Duplicates

1. **Intentional Overrides** - Settings file has different value than default (KEEP THESE)
2. **Redundant Duplicates** - Settings file has same value as default (CAN REMOVE)
3. **Multiple Definitions** - Variable defined 3+ times across different component files

---

## 1. VARIABLES IN _custom-settings.scss (20 total)

### Breadcrumbs Variables (11 variables)

| Variable | _custom-settings.scss | Component File | Status |
|----------|----------------------|----------------|--------|
| `$breadcrumbs-margin` | Line 59: `0` | `_s-breadcrumbs.scss`: `0 0 $global-margin 0` | **OVERRIDE** |
| `$breadcrumbs-item-font-size` | Line 60: `0.875rem` | `_s-breadcrumbs.scss`: `rem-calc(11)` | **OVERRIDE** |
| `$breadcrumbs-item-color` | Line 61: `$color-text-2` | `_s-breadcrumbs.scss`: `$color-text-1` | **OVERRIDE** |
| `$breadcrumbs-item-color-current` | Line 62: `$color-text-1` | `_s-breadcrumbs.scss`: `$color-text-0` | **OVERRIDE** |
| `$breadcrumbs-item-color-disabled` | Line 63: `$color-text-2` | `_s-breadcrumbs.scss`: `$color-text-1` | **OVERRIDE** |
| `$breadcrumbs-item-margin` | Line 64: `0.5rem` | `_s-breadcrumbs.scss`: `0.75rem` | **OVERRIDE** |
| `$breadcrumbs-item-uppercase` | Line 65: `false` | `_s-breadcrumbs.scss`: `true` | **OVERRIDE** |
| `$breadcrumbs-item-separator` | Line 66: `true` | `_s-breadcrumbs.scss`: `true` | **CAN REMOVE** ✓ |
| `$breadcrumbs-item-separator-item` | Line 67: `"·"` | `_s-breadcrumbs.scss`: `'/'` | **OVERRIDE** |
| `$breadcrumbs-item-separator-item-rtl` | Line 68: `"·"` | `_s-breadcrumbs.scss`: `'\\'` | **OVERRIDE** |
| `$breadcrumbs-item-separator-color` | Line 69: `$breadcrumbs-item-color` | `_s-breadcrumbs.scss`: `$color-text-1` | **OVERRIDE** |

### Badge Space Variables (9 variables)

**ALL 9 CAN BE REMOVED** ✓ (They all have the same values as defaults)

| Variable | Line | Value |
|----------|------|-------|
| `$badge-space-background` | 75 | `var(--f-color-bg-2)` |
| `$badge-space-background-hover` | 76 | `var(--f-color-bg-0)` |
| `$badge-space-color` | 77 | `inherit` |
| `$badge-space-color-inline` | 78 | `var(--f-color-text-0)` |
| `$badge-space-color-hover` | 79 | `var(--f-color-text-0)` |
| `$badge-space-border-color` | 80 | `transparent` |
| `$badge-space-border-color-hover` | 81 | `var(--f-color-border-2)` |
| `$badge-space-icon-color-accent` | 82 | `var(--f-color-brand)` |
| `$badge-space-icon-color-base` | 83 | `var(--f-color-border-2)` |

---

## 2. VARIABLES IN _settings.scss (439 total)

### Breakdown by Component

| Component | Total Variables | Can Remove (Same as Default) |
|-----------|----------------|------------------------------|
| Global | 18 | 6 |
| Typography (header, paragraph, anchor, etc.) | 25 | 12 |
| Accordion | 24 | 10 |
| Button | 19 | 5 |
| Menu | 10 | 4 |
| Dropdown | 20 | 8 |
| Tab | 12 | 4 |
| Forms/Input | 26 | 14 |
| Badge | 6 | 1 |
| Breadcrumbs | 2 | 2 |
| Callout | 5 | 3 |
| Card | 8 | 4 |
| Grid | 11 | 5 |
| Orbit | 11 | 3 |
| Slider | 10 | 4 |
| Switch | 13 | 7 |
| Progress Bar | 5 | 2 |
| Reveal | 8 | 4 |
| Pagination | 16 | 8 |
| Off-canvas | 14 | 6 |
| Other | 236 | 147 |

### Top Redundant Variables in _settings.scss (Can Be Removed)

These variables are duplicated with **identical values** to their defaults:

**Accordion (10 variables):**
- Line 328: `$accordion-background: $color-bg-1`
- Line 329: `$accordion-plusminus: true`
- Line 330: `$accordion-plus-content: "\002B"`
- Line 331: `$accordion-minus-content: "\2013"`
- Line 332: `$accordion-title-font-size: rem-calc(12)`
- Line 333: `$accordion-item-color: $color-text-0`
- Line 334: `$accordion-item-background-hover: $color-bg-2`
- Line 335: `$accordion-item-padding: 1.25rem 1rem`
- Line 340: `$accordion-content-padding: 1rem`
- And more...

**Button (5 variables):**
- Line 385: `$button-font-family: inherit`
- Line 392: `$button-fill: solid`
- Line 395: `$button-border: 1px solid transparent`

**Typography (12 variables):**
- Line 263: `$anchor-text-decoration: none`
- Line 264: `$anchor-text-decoration-hover: none`
- Line 303: `$code-font-family: $font-family-monospace`
- Line 304: `$code-font-weight: $global-weight-normal`

**Forms (14 variables):**
- Line 317: `$abide-inputs: true`
- Line 318: `$abide-labels: true`
- Line 529: `$form-label-font-size: rem-calc(14)`

**And 234 more variables...**

See full list in the Python script output above.

---

## 3. Variables with 3+ Definitions

Some variables are defined in multiple component files:

- `$button-hollow-border-width`: 3 definitions (lines 394, 396 in _settings.scss + component file)
- `$global-font-size`: 3 definitions (_settings.scss + 2 foundation-spaces files)
- `$form-button-radius`: 3 definitions (_settings.scss + 2 component files)

---

## Recommendations

### Immediate Actions (Safe Removals)

**1. Remove from `_custom-settings.scss` (Lines 75-83):**
```scss
// DELETE THESE - All 9 badge-space variables (lines 75-83)
// They have the same values as defaults in _s-badge-space.scss
$badge-space-background: var(--f-color-bg-2);
$badge-space-background-hover: var(--f-color-bg-0);
$badge-space-color: inherit;
$badge-space-color-inline: var(--f-color-text-0);
$badge-space-color-hover: var(--f-color-text-0);
$badge-space-border-color: transparent;
$badge-space-border-color-hover: var(--f-color-border-2);
$badge-space-icon-color-accent: var(--f-color-brand);
$badge-space-icon-color-base: var(--f-color-border-2);
```

**Also remove from `_custom-settings.scss`:**
```scss
// DELETE THIS - Line 66
$breadcrumbs-item-separator: true;  // Same as default
```

**2. Review and remove from `_settings.scss`:**

There are **259 variables** that can be safely removed from `_settings.scss` because they have identical values to their defaults.

**Strategy:**
- Start with complete components (e.g., all accordion variables that match defaults)
- Test after each batch removal
- Focus on recently added/modified components first

### Variables to KEEP (Important Overrides)

**Keep in `_custom-settings.scss`:**
- All breadcrumbs variables EXCEPT `$breadcrumbs-item-separator` (10 variables)
- Any custom variables not in component files (e.g., `$button-height`, `$padding-sizes`, etc.)

**Keep in `_settings.scss`:**
- All variables where the value DIFFERS from the component default
- Examples:
  - `$body-background: $color-bg-2` (overrides `$white`)
  - `$button-background: $color-text-0` (overrides `$color-text-1`)
  - `$switch-height: 1rem` (overrides `2rem`)

### Long-term Strategy

1. **Audit Component by Component**: Review each component's variables and decide:
   - Is this override intentional?
   - Does it need to be different from the default?
   - Can it be removed?

2. **Document Intentional Overrides**: Add comments explaining WHY certain variables override defaults

3. **Consider Moving Settings**: Some variables might be better placed in component files themselves

---

## Files Analyzed

- `/home/user/foundation-sites-template/scss/_settings.scss` (932 lines, ~400+ variables)
- `/home/user/foundation-sites-template/scss/_custom-settings.scss` (83 lines, 32 variables)
- All component files in `/home/user/foundation-sites-template/scss/custom-includes/`

---

## Next Steps

1. **Start with `_custom-settings.scss`**: Remove the 10 redundant variables (safest)
2. **Test thoroughly**: Ensure no visual regressions
3. **Move to `_settings.scss`**: Remove variables component by component
4. **Document**: Add comments for remaining overrides explaining their purpose

---

*Report generated on 2025-11-14*
*Total time to analyze: Complete scan of all .scss files in repository*
