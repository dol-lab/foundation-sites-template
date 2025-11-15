# Quick Start: Spacing Migration

Fast reference for migrating spacing classes to the new system.

## ⚡ For This Project

```bash
# Already migrated! ✓
# All HTML files have been updated
# SCSS is configured for the new system
```

## 🚀 For Your Other Projects

### 1. Copy Migration Tools

```bash
# Copy these files to your project:
- migrate-spacing.sh
- MIGRATION_GUIDE.md (optional, for reference)
```

### 2. Test First (Always!)

```bash
# Dry run to preview changes
./migrate-spacing.sh ./your-templates "*.html" --dry-run --verbose
```

### 3. Migrate with Backups

```bash
# Migrate HTML files with backup
./migrate-spacing.sh ./your-templates "*.html" --backup

# Migrate multiple file types
./migrate-spacing.sh ./src "*.{html,php,vue}" --backup
```

### 4. Verify & Test

```bash
# Check what changed
git diff

# Build and test
npm run build
npm run test
```

---

## 📋 Common Commands

### Preview Changes

```bash
# See what would change without modifying files
./migrate-spacing.sh . "*.html" -d

# With detailed output
./migrate-spacing.sh . "*.html" -d -v
```

### Safe Migration

```bash
# Always use --backup for safety
./migrate-spacing.sh ./templates "*.html" -b

# Multiple directories
./migrate-spacing.sh ./templates "*.html" -b
./migrate-spacing.sh ./components "*.vue" -b
./migrate-spacing.sh ./includes "*.php" -b
```

### Rollback if Needed

```bash
# Restore from backups
find . -name "*.bak" -exec sh -c 'mv "$1" "${1%.bak}"' _ {} \;

# Or use git
git checkout .
```

---

## 🎯 Migration Mapping (CORRECTED - Ascending Order)

### Standard Classes

| Before | After | Value | Pixels |
|--------|-------|-------|--------|
| `padding-small` | `p-1` | 0.3125rem | 5px |
| `padding-medium` | `p-3` | 0.75rem | 12px |
| `padding-large` | `p-4` | 1rem | 16px |
| `padding-1` | `p-4` | 1rem | 16px |
| `padding-2` | `p-7` | 2rem | 32px |
| `padding-3` | `p-9` | 3rem | 48px |
| `px-small` | `px-1` | 0.3125rem | 5px |
| `px-medium` | `px-3` | 0.75rem | 12px |
| `py-medium` | `py-3` | 0.75rem | 12px |
| `margin-large` | `m-4` | 1rem | 16px |

### Special Classes (Now Included!)

| Before | After | Notes |
|--------|-------|-------|
| `padding-button` | `py-2 px-3` | 0.5rem (8px) vertical, 0.75rem (12px) horizontal |
| `p-button` | `py-2 px-3` | Short form |
| `padding-xlarge` | `p-5` | 1.25rem (20px) simplified |
| `p-xlarge` | `p-5` | Short form |
| `padding-xxlarge` | `p-6` | 1.5rem (24px) simplified |
| `p-xxlarge` | `p-6` | Short form |
| `margin-button` | `my-2 mx-3` | Same as padding-button |
| `margin-xlarge` | `m-5` | Same as padding-xlarge |
| `margin-xxlarge` | `m-6` | Same as padding-xxlarge |

**✨ Complete spacing scale:** `p-0` (0), `p-1` (5px), `p-2` (8px), `p-3` (12px), `p-4` (16px), `p-5` (20px), `p-6` (24px), `p-7` (32px), `p-8` (40px), `p-9` (48px)

---

## 💡 Examples

### Example 1: Simple HTML Project

```bash
# Preview
./migrate-spacing.sh . "*.html" --dry-run

# Migrate
./migrate-spacing.sh . "*.html" --backup

# Check
git diff
```

### Example 2: Laravel Project

```bash
# Blade templates
./migrate-spacing.sh ./resources/views "*.blade.php" -b -v

# Components
./migrate-spacing.sh ./resources/views/components "*.blade.php" -b -v
```

### Example 3: Vue.js Project

```bash
# All Vue components
./migrate-spacing.sh ./src/components "*.vue" -b

# Test
npm run build
npm run test
```

### Example 4: Large Multi-Framework Project

```bash
# Phase 1: Preview all files
./migrate-spacing.sh . "*.{html,vue,jsx,php}" --dry-run > preview.txt

# Phase 2: Migrate by type with backups
./migrate-spacing.sh . "*.html" -b
./migrate-spacing.sh . "*.vue" -b
./migrate-spacing.sh . "*.jsx" -b
./migrate-spacing.sh . "*.php" -b

# Phase 3: Test and commit
npm run test
git add -A
git commit -m "feat: migrate spacing classes"
```

---

## ⚙️ SCSS Integration

After running the migration script, update your SCSS:

### 1. Copy SCSS Configuration (CORRECTED - Ascending Order)

From `scss/_custom-settings.scss`:

```scss
$spacing-scale: (
  0: 0,              // 0px
  1: 0.3125rem,      // 5px - was padding-small
  2: 0.5rem,         // 8px - compact spacing (button vertical padding)
  3: 0.75rem,        // 12px - was padding-medium
  4: 1rem,           // 16px - was padding-large and padding-1 (base size)
  5: 1.25rem,        // 20px - was xlarge base
  6: 1.5rem,         // 24px - was xxlarge base
  7: 2rem,           // 32px - was padding-2
  8: 2.5rem,         // 40px - extra large spacing
  9: 3rem,           // 48px - was padding-3
);
```

### 2. Generate Utility Classes

From `scss/_custom-styles.scss` (see full file for complete implementation):

```scss
@each $size-number, $size in $spacing-scale {
  .p-#{$size-number} { padding: $size; }
  .m-#{$size-number} { margin: $size; }
  .px-#{$size-number} { padding-inline: $size; }
  .py-#{$size-number} { padding-block: $size; }
  // ... etc
}
```

---

## 🔍 Troubleshooting

### "Script won't run"

```bash
# Make executable
chmod +x migrate-spacing.sh
```

### "No files found"

```bash
# Check your pattern
ls -la *.html  # Test if files match pattern

# Try absolute path
./migrate-spacing.sh /full/path/to/directory "*.html"
```

### "Changes look wrong"

```bash
# Use dry-run to review first
./migrate-spacing.sh . "*.html" -d -v > preview.txt
cat preview.txt
```

### "Need to customize patterns"

Edit `migrate-spacing.sh` and modify the sed script section (around line 50-220).

---

## 📚 Need More Help?

- **Detailed Guide:** See `MIGRATION_GUIDE.md` for comprehensive documentation
- **Mapping Reference:** See `SPACING_MIGRATION_PLAN.md` for all class mappings
- **Script Source:** Edit `migrate-spacing.sh` to customize behavior

---

## ✅ Pre-Migration Checklist

Before running on production code:

- [ ] Create a feature branch
- [ ] Run dry-run first
- [ ] Review preview output
- [ ] Test on small subset
- [ ] Use `--backup` flag
- [ ] Have rollback plan ready
- [ ] Communicate with team

## ✅ Post-Migration Checklist

After running the script:

- [ ] Review `git diff`
- [ ] Run build process
- [ ] Run automated tests
- [ ] Visual QA testing
- [ ] Check responsive behavior
- [ ] Test in multiple browsers
- [ ] Remove backup files (after verification)
- [ ] Commit changes
- [ ] Update team documentation

---

## 🎉 You're Ready!

The migration script handles all the heavy lifting. Just:

1. **Test** with `--dry-run`
2. **Migrate** with `--backup`
3. **Verify** with git diff and testing
4. **Commit** when satisfied

Good luck with your migration! 🚀
