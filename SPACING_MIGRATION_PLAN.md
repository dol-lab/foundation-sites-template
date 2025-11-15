# Spacing Classes Migration Plan

## Overview
Migrating from mixed naming convention (padding-small/medium/large + padding-1/2/3) to a unified Tailwind-like system (p-0 through p-9) with proper ascending order.

## New Spacing Scale (Corrected - Ascending Order)

### Padding Classes
| Old Class | Old Value | New Class | New Value | Pixels |
|-----------|-----------|-----------|-----------|--------|
| `padding-none` / `p-none` | 0 | `p-0` | 0 | 0px |
| `padding-small` / `p-small` | 0.3125rem | `p-1` | 0.3125rem | 5px |
| N/A | N/A | `p-2` | 0.5rem | 8px |
| `padding-medium` / `p-medium` | 0.75rem | `p-3` | 0.75rem | 12px |
| `padding-large` / `p-large` / `padding-1` | 1rem | `p-4` | 1rem | 16px |
| `padding-xlarge` | 1.25rem | `p-5` | 1.25rem | 20px |
| `padding-xxlarge` | 1.5rem | `p-6` | 1.5rem | 24px |
| `padding-2` | 2rem | `p-7` | 2rem | 32px |
| N/A | N/A | `p-8` | 2.5rem | 40px |
| `padding-3` | 3rem | `p-9` | 3rem | 48px |

### Special Padding Classes
| Old Class | Old Value | New Class | New Value |
|-----------|-----------|-----------|-----------|
| `padding-button` | 0.5rem 0.75rem | `py-2 px-3` | vertical: 0.5rem, horizontal: 0.75rem |

### Margin Classes
| Old Class | New Class | Value | Pixels |
|-----------|-----------|-------|--------|
| `margin-none` | `m-0` | 0 | 0px |
| `margin-small` | `m-1` | 0.3125rem | 5px |
| N/A | `m-2` | 0.5rem | 8px |
| `margin-medium` | `m-3` | 0.75rem | 12px |
| `margin-large` / `margin-1` | `m-4` | 1rem | 16px |
| `margin-xlarge` | `m-5` | 1.25rem | 20px |
| `margin-xxlarge` | `m-6` | 1.5rem | 24px |
| `margin-2` | `m-7` | 2rem | 32px |
| N/A | `m-8` | 2.5rem | 40px |
| `margin-3` | `m-9` | 3rem | 48px |

### Directional Helper Classes

**Padding:**
- `px-{size}` → Horizontal padding (left + right)
- `py-{size}` → Vertical padding (top + bottom)
- `pt-{size}` → Padding top
- `pr-{size}` → Padding right
- `pb-{size}` → Padding bottom
- `pl-{size}` → Padding left

**Margin:**
- `mx-{size}` → Horizontal margin (left + right)
- `my-{size}` → Vertical margin (top + bottom)
- `mt-{size}` → Margin top
- `mr-{size}` → Margin right
- `mb-{size}` → Margin bottom
- `ml-{size}` → Margin left

**Special:**
- `mx-auto` → Horizontal margin auto (unchanged)
- `my-auto` → Vertical margin auto (unchanged)

---

## Regex Migration Patterns

### 1. Main Padding Classes (Corrected Mappings)

```regex
# padding-none → p-0
Find: \b(padding-none|p-none)\b
Replace: p-0

# padding-small → p-1 (5px)
Find: \b(padding-small|p-small)\b
Replace: p-1

# padding-medium → p-3 (12px) - CORRECTED from p-2
Find: \b(padding-medium|p-medium)\b
Replace: p-3

# padding-large → p-4 (16px) - CORRECTED from p-3
Find: \b(padding-large|p-large)\b
Replace: p-4

# padding-1 → p-4 (1rem = 16px) - CORRECTED from p-3
Find: \bpadding-1\b
Replace: p-4

# padding-2 → p-7 (2rem = 32px) - CORRECTED from p-4
Find: \bpadding-2\b
Replace: p-7

# padding-3 → p-9 (3rem = 48px) - CORRECTED from p-5
Find: \bpadding-3\b
Replace: p-9

# padding-xlarge → p-5 (20px) - NEW
Find: \bpadding-xlarge\b
Replace: p-5

# padding-xxlarge → p-6 (24px) - NEW
Find: \bpadding-xxlarge\b
Replace: p-6

# padding-button → py-2 px-3 (8px vertical, 12px horizontal) - NEW
Find: \bpadding-button\b
Replace: py-2 px-3
```

### 2. Directional Padding Classes (Corrected Mappings)

```regex
# px-none → px-0
Find: \bpx-none\b
Replace: px-0

# px-small → px-1
Find: \bpx-small\b
Replace: px-1

# px-medium → px-3 - CORRECTED from px-2
Find: \bpx-medium\b
Replace: px-3

# px-large → px-4 - CORRECTED from px-3
Find: \bpx-large\b
Replace: px-4

# py-none → py-0
Find: \bpy-none\b
Replace: py-0

# py-small → py-1
Find: \bpy-small\b
Replace: py-1

# py-medium → py-3 - CORRECTED from py-2
Find: \bpy-medium\b
Replace: py-3

# py-large → py-4 - CORRECTED from py-3
Find: \bpy-large\b
Replace: py-4

# pt-none → pt-0
Find: \bpt-none\b
Replace: pt-0

# pt-small → pt-1
Find: \bpt-small\b
Replace: pt-1

# pt-medium → pt-3 - CORRECTED from pt-2
Find: \bpt-medium\b
Replace: pt-3

# pt-large → pt-4 - CORRECTED from pt-3
Find: \bpt-large\b
Replace: pt-4

# pr-none → pr-0
Find: \bpr-none\b
Replace: pr-0

# pr-small → pr-1
Find: \bpr-small\b
Replace: pr-1

# pr-medium → pr-3 - CORRECTED from pr-2
Find: \bpr-medium\b
Replace: pr-3

# pr-large → pr-4 - CORRECTED from pr-3
Find: \bpr-large\b
Replace: pr-4

# pb-none → pb-0
Find: \bpb-none\b
Replace: pb-0

# pb-small → pb-1
Find: \bpb-small\b
Replace: pb-1

# pb-medium → pb-3 - CORRECTED from pb-2
Find: \bpb-medium\b
Replace: pb-3

# pb-large → pb-4 - CORRECTED from pb-3
Find: \bpb-large\b
Replace: pb-4

# pl-none → pl-0
Find: \bpl-none\b
Replace: pl-0

# pl-small → pl-1
Find: \bpl-small\b
Replace: pl-1

# pl-medium → pl-3 - CORRECTED from pl-2
Find: \bpl-medium\b
Replace: pl-3

# pl-large → pl-4 - CORRECTED from pl-3
Find: \bpl-large\b
Replace: pl-4
```

### 3. Main Margin Classes (Corrected Mappings)

```regex
# margin-none → m-0
Find: \bmargin-none\b
Replace: m-0

# margin-small → m-1
Find: \bmargin-small\b
Replace: m-1

# margin-medium → m-3 - CORRECTED from m-2
Find: \bmargin-medium\b
Replace: m-3

# margin-large → m-4 - CORRECTED from m-3
Find: \bmargin-large\b
Replace: m-4

# margin-1 → m-4 (1rem = 16px) - CORRECTED from m-3
Find: \bmargin-1\b
Replace: m-4

# margin-2 → m-7 (2rem = 32px) - CORRECTED from m-4
Find: \bmargin-2\b
Replace: m-7

# margin-3 → m-9 (3rem = 48px) - CORRECTED from m-5
Find: \bmargin-3\b
Replace: m-9

# margin-xlarge → m-5 (20px) - NEW
Find: \bmargin-xlarge\b
Replace: m-5

# margin-xxlarge → m-6 (24px) - NEW
Find: \bmargin-xxlarge\b
Replace: m-6
```

### 4. Directional Margin Classes (Corrected Mappings)

```regex
# mx-none → mx-0
Find: \bmx-none\b
Replace: mx-0

# mx-small → mx-1
Find: \bmx-small\b
Replace: mx-1

# mx-medium → mx-3 - CORRECTED from mx-2
Find: \bmx-medium\b
Replace: mx-3

# mx-large → mx-4 - CORRECTED from mx-3
Find: \bmx-large\b
Replace: mx-4

# my-none → my-0
Find: \bmy-none\b
Replace: my-0

# my-small → my-1
Find: \bmy-small\b
Replace: my-1

# my-medium → my-3 - CORRECTED from my-2
Find: \bmy-medium\b
Replace: my-3

# my-large → my-4 - CORRECTED from my-3
Find: \bmy-large\b
Replace: my-4

# mt-none → mt-0
Find: \bmt-none\b
Replace: mt-0

# mt-small → mt-1
Find: \bmt-small\b
Replace: mt-1

# mt-medium → mt-3 - CORRECTED from mt-2
Find: \bmt-medium\b
Replace: mt-3

# mt-large → mt-4 - CORRECTED from mt-3
Find: \bmt-large\b
Replace: mt-4

# mr-none → mr-0
Find: \bmr-none\b
Replace: mr-0

# mr-small → mr-1
Find: \bmr-small\b
Replace: mr-1

# mr-medium → mr-3 - CORRECTED from mr-2
Find: \bmr-medium\b
Replace: mr-3

# mr-large → mr-4 - CORRECTED from mr-3
Find: \bmr-large\b
Replace: mr-4

# mb-none → mb-0
Find: \bmb-none\b
Replace: mb-0

# mb-small → mb-1
Find: \bmb-small\b
Replace: mb-1

# mb-medium → mb-3 - CORRECTED from mb-2
Find: \bmb-medium\b
Replace: mb-3

# mb-large → mb-4 - CORRECTED from mb-3
Find: \bmb-large\b
Replace: mb-4

# ml-none → ml-0
Find: \bml-none\b
Replace: ml-0

# ml-small → ml-1
Find: \bml-small\b
Replace: ml-1

# ml-medium → ml-3 - CORRECTED from ml-2
Find: \bml-medium\b
Replace: ml-3

# ml-large → ml-4 - CORRECTED from ml-3
Find: \bml-large\b
Replace: ml-4
```

### 5. Old Prototype Spacing Classes (Verbose Forms)

These were generated by the prototype spacing mixin with verbose names:

```regex
# padding-top-0 → pt-0 (already exists, just documenting)
Find: \bpadding-top-0\b
Replace: pt-0

# padding-top-1 → pt-3 (old system: 1 * 1rem = 1rem = p-3)
Find: \bpadding-top-1\b
Replace: pt-3

# padding-top-2 → pt-4
Find: \bpadding-top-2\b
Replace: pt-4

# padding-top-3 → pt-5
Find: \bpadding-top-3\b
Replace: pt-5

# padding-right-0 → pr-0
Find: \bpadding-right-0\b
Replace: pr-0

# padding-right-1 → pr-3
Find: \bpadding-right-1\b
Replace: pr-3

# padding-right-2 → pr-4
Find: \bpadding-right-2\b
Replace: pr-4

# padding-right-3 → pr-5
Find: \bpadding-right-3\b
Replace: pr-5

# padding-bottom-0 → pb-0
Find: \bpadding-bottom-0\b
Replace: pb-0

# padding-bottom-1 → pb-3
Find: \bpadding-bottom-1\b
Replace: pb-3

# padding-bottom-2 → pb-4
Find: \bpadding-bottom-2\b
Replace: pb-4

# padding-bottom-3 → pb-5
Find: \bpadding-bottom-3\b
Replace: pb-5

# padding-left-0 → pl-0
Find: \bpadding-left-0\b
Replace: pl-0

# padding-left-1 → pl-3
Find: \bpadding-left-1\b
Replace: pl-3

# padding-left-2 → pl-4
Find: \bpadding-left-2\b
Replace: pl-4

# padding-left-3 → pl-5
Find: \bpadding-left-3\b
Replace: pl-5

# padding-horizontal-0 → px-0
Find: \bpadding-horizontal-0\b
Replace: px-0

# padding-horizontal-1 → px-3
Find: \bpadding-horizontal-1\b
Replace: px-3

# padding-horizontal-2 → px-4
Find: \bpadding-horizontal-2\b
Replace: px-4

# padding-horizontal-3 → px-5
Find: \bpadding-horizontal-3\b
Replace: px-5

# padding-vertical-0 → py-0
Find: \bpadding-vertical-0\b
Replace: py-0

# padding-vertical-1 → py-3
Find: \bpadding-vertical-1\b
Replace: py-3

# padding-vertical-2 → py-4
Find: \bpadding-vertical-2\b
Replace: py-4

# padding-vertical-3 → py-5
Find: \bpadding-vertical-3\b
Replace: py-5

# Same for margins...
# margin-top-0 → mt-0
Find: \bmargin-top-0\b
Replace: mt-0

# margin-top-1 → mt-3
Find: \bmargin-top-1\b
Replace: mt-3

# margin-top-2 → mt-4
Find: \bmargin-top-2\b
Replace: mt-4

# margin-top-3 → mt-5
Find: \bmargin-top-3\b
Replace: mt-5

# margin-right-0 → mr-0
Find: \bmargin-right-0\b
Replace: mr-0

# margin-right-1 → mr-3
Find: \bmargin-right-1\b
Replace: mr-3

# margin-right-2 → mr-4
Find: \bmargin-right-2\b
Replace: mr-4

# margin-right-3 → mr-5
Find: \bmargin-right-3\b
Replace: mr-5

# margin-bottom-0 → mb-0
Find: \bmargin-bottom-0\b
Replace: mb-0

# margin-bottom-1 → mb-3
Find: \bmargin-bottom-1\b
Replace: mb-3

# margin-bottom-2 → mb-4
Find: \bmargin-bottom-2\b
Replace: mb-4

# margin-bottom-3 → mb-5
Find: \bmargin-bottom-3\b
Replace: mb-5

# margin-left-0 → ml-0
Find: \bmargin-left-0\b
Replace: ml-0

# margin-left-1 → ml-3
Find: \bmargin-left-1\b
Replace: ml-3

# margin-left-2 → ml-4
Find: \bmargin-left-2\b
Replace: ml-4

# margin-left-3 → ml-5
Find: \bmargin-left-3\b
Replace: ml-5

# margin-horizontal-0 → mx-0
Find: \bmargin-horizontal-0\b
Replace: mx-0

# margin-horizontal-1 → mx-3
Find: \bmargin-horizontal-1\b
Replace: mx-3

# margin-horizontal-2 → mx-4
Find: \bmargin-horizontal-2\b
Replace: mx-4

# margin-horizontal-3 → mx-5
Find: \bmargin-horizontal-3\b
Replace: mx-5

# margin-vertical-0 → my-0
Find: \bmargin-vertical-0\b
Replace: my-0

# margin-vertical-1 → my-3
Find: \bmargin-vertical-1\b
Replace: my-3

# margin-vertical-2 → my-4
Find: \bmargin-vertical-2\b
Replace: my-4

# margin-vertical-3 → my-5
Find: \bmargin-vertical-3\b
Replace: my-5
```

---

## Implementation Steps

### Phase 1: Update SCSS Files

1. **Update `scss/_custom-settings.scss`:**
   - Replace `$padding-sizes` map with numeric `$spacing-scale`
   - Use single values (not multi-value for different axes)

2. **Update `scss/_custom-styles.scss`:**
   - Replace loops generating `.padding-{name}` with `.p-{number}`
   - Replace loops generating `.margin-{name}` with `.m-{number}`
   - Update directional helpers to use numbers

3. **Remove/Update `scss/custom-includes/foundation-spaces/prototype/_spacing.scss`:**
   - Either remove entirely or update to match new scale
   - Remove old verbose class generation (padding-top-1, etc.)

### Phase 2: Migrate HTML/Template Files

1. **Find all HTML/template files:**
   ```bash
   find . -type f \( -name "*.html" -o -name "*.hbs" -o -name "*.php" \)
   ```

2. **Apply regex replacements in order:**
   - Start with most specific patterns first
   - Use word boundaries (`\b`) to avoid partial matches
   - Process directional classes before main classes

3. **Recommended order:**
   1. Old prototype verbose classes (padding-top-1, etc.)
   2. Directional helpers (px-, py-, pt-, pr-, pb-, pl-)
   3. Main classes (padding-small, p-small, etc.)
   4. Repeat for margins

### Phase 3: Testing

1. **Visual regression testing:**
   - Check all pages for spacing issues
   - Verify responsive breakpoint classes still work

2. **CSS validation:**
   - Ensure no duplicate class definitions
   - Verify all old classes are removed

3. **Build verification:**
   - Compile SCSS without errors
   - Check final CSS file size

---

## Special Cases & Notes

### Multi-value Padding/Margin
The old system used multi-value padding for some classes:
- `padding-medium: 0.75rem 0.9rem` (different vertical/horizontal)
- `padding-large: 1rem 1.25rem`

**Migration Strategy:** Simplify to single values. If specific designs need different vertical/horizontal spacing, use two classes:
```html
<!-- Old -->
<div class="padding-medium">...</div>

<!-- New (simplified) -->
<div class="p-2">...</div>

<!-- Or if you need different spacing -->
<div class="py-2 px-2">...</div>
```

### XLarge, XXLarge, and Button Sizes
These special sizes have complex multi-value spacing:
- `xlarge: 1.25rem 2rem 1.5rem`
- `xxlarge: 1.5rem 2.5rem 1.75rem`
- `button: 0.5rem 0.75rem`

**Options:**
1. **Remove entirely** - Not used widely
2. **Create p-6, p-7, p-8** with single values
3. **Keep as named classes** - `.p-button`, `.p-xlarge` for special cases

**Recommendation:** Check usage first, then decide.

### Responsive Classes
If the old system had responsive variants (e.g., `.medium-padding-small`), you'll need similar patterns:

```regex
# Example for medium breakpoint
Find: \bmedium-padding-small\b
Replace: medium-p-1

Find: \bmedium-padding-medium\b
Replace: medium-p-2
```

### Modern CSS Features Used

1. **Logical Properties:**
   - `padding-inline` instead of `padding-left` + `padding-right`
   - `padding-block` instead of `padding-top` + `padding-bottom`
   - `margin-inline`, `margin-block` similarly

2. **Custom Properties (CSS Variables):**
   - Could define `--spacing-1: 0.3125rem` etc.
   - Makes dynamic theming easier

3. **Container Queries Ready:**
   - Structure allows easy addition of container-based spacing

---

## Rollback Plan

If issues arise:

1. **Git revert** the SCSS changes
2. **Keep migration plan** for future attempt
3. **Gradual migration:** Support both old and new classes temporarily

---

## Checklist

- [ ] Update `_custom-settings.scss`
- [ ] Update `_custom-styles.scss`
- [ ] Update/remove `prototype/_spacing.scss`
- [ ] Migrate all HTML files
- [ ] Migrate all template files (HBS, PHP, etc.)
- [ ] Test on all breakpoints
- [ ] Visual QA all pages
- [ ] Update documentation
- [ ] Remove old class definitions
- [ ] Final build and verification
- [ ] Commit and push

---

## Files to Check for Usage

```bash
# Find all usages of old padding classes
grep -r "padding-small" --include="*.html" --include="*.hbs" --include="*.php"
grep -r "padding-medium" --include="*.html" --include="*.hbs" --include="*.php"
grep -r "padding-large" --include="*.html" --include="*.hbs" --include="*.php"
grep -r "padding-[0-3]" --include="*.html" --include="*.hbs" --include="*.php"

# Find all usages of old margin classes
grep -r "margin-small" --include="*.html" --include="*.hbs" --include="*.php"
grep -r "margin-medium" --include="*.html" --include="*.hbs" --include="*.php"
grep -r "margin-large" --include="*.html" --include="*.hbs" --include="*.php"
```
