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

## 🎯 Migration Mapping

| Before | After | Value |
|--------|-------|-------|
| `padding-small` | `p-1` | 5px |
| `padding-medium` | `p-2` | 12px |
| `padding-large` | `p-3` | 16px |
| `padding-1` | `p-3` | 16px |
| `padding-2` | `p-4` | 32px |
| `padding-3` | `p-5` | 48px |
| `px-small` | `px-1` | 5px |
| `py-medium` | `py-2` | 12px |
| `margin-large` | `m-3` | 16px |

**✨ New sizes available:** `p-0`, `p-6`, `p-7`, `p-8`, `p-9` (and all directional variants)

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

### 1. Copy SCSS Configuration

From `scss/_custom-settings.scss`:

```scss
$spacing-scale: (
  0: 0,
  1: 0.3125rem,  // 5px
  2: 0.75rem,    // 12px
  3: 1rem,       // 16px
  4: 2rem,       // 32px
  5: 3rem,       // 48px
  6: 0.5rem,     // 8px
  7: 1.25rem,    // 20px
  8: 1.5rem,     // 24px
  9: 2.5rem,     // 40px
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
