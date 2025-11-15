# Spacing Classes Migration Guide

Complete guide for migrating large codebases from old spacing classes to the new Tailwind-like system.

## Table of Contents

- [Quick Start](#quick-start)
- [Migration Script Usage](#migration-script-usage)
- [Manual Migration](#manual-migration)
- [Testing After Migration](#testing-after-migration)
- [Troubleshooting](#troubleshooting)
- [Rollback Instructions](#rollback-instructions)

---

## Quick Start

### 1. Test on a Small Sample First

Always test on a subset of files before running on your entire codebase:

```bash
# Dry run to see what would change
./migrate-spacing.sh ./src/components "*.html" --dry-run --verbose

# If results look good, run with backup
./migrate-spacing.sh ./src/components "*.html" --backup
```

### 2. Review the Changes

```bash
# View what changed
git diff

# Review specific file
git diff src/components/Header.html
```

### 3. Test Your Application

- Run your build process
- Visual testing on key pages
- Check responsive behavior
- Validate with QA team

---

## Migration Script Usage

### Basic Syntax

```bash
./migrate-spacing.sh [directory] [file-pattern] [options]
```

### Options

| Option | Description |
|--------|-------------|
| `-d, --dry-run` | Preview changes without modifying files |
| `-b, --backup` | Create `.bak` backup files before modification |
| `-v, --verbose` | Show detailed output for each file |
| `-h, --help` | Display help message |

### Examples

#### Example 1: Dry Run on HTML Files

```bash
./migrate-spacing.sh ./templates "*.html" --dry-run --verbose
```

Output:
```
========================================
Spacing Classes Migration Script
========================================

Configuration:
  Directory:     ./templates
  Pattern:       *.html
  Dry run:       true
  Create backup: false
  Verbose:       true

Found 42 file(s) to process

Would modify: ./templates/header.html
Changes:
- <div class="padding-small">
+ <div class="p-1">
- <span class="margin-medium">
+ <span class="m-2">

...
```

#### Example 2: Migrate with Backups

```bash
./migrate-spacing.sh ./src "*.{html,vue,jsx}" --backup
```

Creates:
- `Header.html.bak`
- `Footer.vue.bak`
- `Button.jsx.bak`

#### Example 3: Migrate Specific Directory

```bash
# Just templates
./migrate-spacing.sh ./templates "*.hbs"

# Just components
./migrate-spacing.sh ./components "*.vue"

# Just PHP files
./migrate-spacing.sh ./includes "*.php"
```

#### Example 4: Multiple File Types

```bash
# Using brace expansion
./migrate-spacing.sh . "*.{html,php,vue,jsx,tsx}"

# Or run multiple times
./migrate-spacing.sh . "*.html" --backup
./migrate-spacing.sh . "*.php" --backup
./migrate-spacing.sh . "*.vue" --backup
```

---

## Large Codebase Strategy

### Step-by-Step Approach

#### Phase 1: Preparation (Day 1)

1. **Create a feature branch**
   ```bash
   git checkout -b migrate-spacing-classes
   ```

2. **Inventory your codebase**
   ```bash
   # Count files to migrate
   find . -name "*.html" -o -name "*.php" | wc -l

   # Find all spacing class usage
   grep -r "padding-\(small\|medium\|large\)" --include="*.html" | wc -l
   grep -r "margin-\(small\|medium\|large\)" --include="*.html" | wc -l
   ```

3. **Run comprehensive dry run**
   ```bash
   ./migrate-spacing.sh . "*.html" --dry-run > migration-preview.txt
   ```

4. **Review preview**
   - Check `migration-preview.txt`
   - Look for any unexpected patterns
   - Identify files that need manual attention

#### Phase 2: Migration by Module (Days 2-3)

Migrate in logical chunks to reduce risk:

```bash
# Day 2: Core components
./migrate-spacing.sh ./src/components "*.{html,vue}" --backup --verbose

# Test build
npm run build
npm run test

# Day 2: Templates
./migrate-spacing.sh ./templates "*.hbs" --backup --verbose

# Test build
npm run build
npm run test

# Day 3: Views
./migrate-spacing.sh ./views "*.php" --backup --verbose

# Test
php artisan test
```

#### Phase 3: Verification (Day 4)

1. **Visual regression testing**
   ```bash
   # Using BackstopJS, Percy, or similar
   npm run test:visual
   ```

2. **Manual QA**
   - Check all major pages
   - Test responsive breakpoints
   - Verify spacing looks correct

3. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: migrate spacing classes to Tailwind-like system"
   ```

---

## Manual Migration

For files that need special attention or complex cases:

### Search and Replace in Your IDE

**VS Code:**
1. Press `Cmd+Shift+F` (Mac) or `Ctrl+Shift+F` (Windows)
2. Enable regex mode (icon: `.*`)
3. Use these patterns:

```regex
Find:    \bpadding-small\b
Replace: p-1

Find:    \bpadding-medium\b
Replace: p-2

Find:    \bmargin-large\b
Replace: m-3
```

**PHPStorm / WebStorm:**
1. Press `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. Enable regex mode
3. Use scope to limit to specific directories

### Migration Checklist

For each module/directory:

- [ ] Run dry run to preview changes
- [ ] Create backups
- [ ] Run migration script
- [ ] Review git diff
- [ ] Run build process
- [ ] Test in browser
- [ ] Check responsive behavior
- [ ] Commit changes

---

## Testing After Migration

### 1. Build Verification

```bash
# SCSS compilation
npm run build

# Check for errors
echo $?  # Should output 0
```

### 2. Visual Testing

Create a test page with all spacing classes:

```html
<!-- test-spacing.html -->
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="css/app.css">
</head>
<body>
  <h1>Spacing Test Page</h1>

  <h2>Padding Classes</h2>
  <div class="p-0" style="background: #f0f0f0;">p-0</div>
  <div class="p-1" style="background: #e0e0e0;">p-1</div>
  <div class="p-2" style="background: #d0d0d0;">p-2</div>
  <div class="p-3" style="background: #c0c0c0;">p-3</div>
  <div class="p-4" style="background: #b0b0b0;">p-4</div>
  <div class="p-5" style="background: #a0a0a0;">p-5</div>

  <h2>Directional Padding</h2>
  <div class="px-2 py-1" style="background: #f0f0f0;">px-2 py-1</div>
  <div class="pt-3 pb-1" style="background: #e0e0e0;">pt-3 pb-1</div>

  <h2>Margin Classes</h2>
  <div class="m-1" style="background: #f0f0f0;">m-1</div>
  <div class="m-2" style="background: #e0e0e0;">m-2</div>
  <div class="mx-auto" style="width: 200px; background: #d0d0d0;">mx-auto</div>

  <!-- Add more tests as needed -->
</body>
</html>
```

### 3. Automated Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Visual regression
npm run test:visual
```

### 4. Browser Testing

Test in multiple browsers:
- ✓ Chrome/Edge
- ✓ Firefox
- ✓ Safari
- ✓ Mobile Safari (iOS)
- ✓ Chrome Mobile (Android)

---

## Troubleshooting

### Issue: Classes Not Applied

**Problem:** New classes like `p-1` don't work

**Solution:**
```bash
# Rebuild CSS
npm run build

# Clear browser cache
# Hard refresh: Cmd+Shift+R (Mac) or Ctrl+F5 (Windows)

# Verify classes exist in compiled CSS
grep "\.p-1" css/app.css
```

### Issue: Spacing Looks Different

**Problem:** Spacing changed after migration

**Cause:** Old `padding-medium` used multi-value padding (e.g., `0.75rem 0.9rem`)

**Solution:**
```html
<!-- Old -->
<div class="padding-medium">

<!-- New (if you need different vertical/horizontal) -->
<div class="py-2 px-2">
<!-- or adjust numbers as needed -->
```

### Issue: Special Classes Not Migrated

**Problem:** `padding-button`, `padding-xlarge` still in code

**Solution:** Edit `migrate-spacing.sh` and uncomment these lines:

```bash
# Around line 180-185 in the sed script
s/\bpadding-button\b/py-6 px-2/g
s/\bpadding-xlarge\b/p-7/g
s/\bpadding-xxlarge\b/p-8/g
```

Then re-run the migration.

### Issue: Responsive Classes Not Working

**Problem:** Classes like `medium-padding-small` not migrated

**Solution:** Add custom patterns to the sed script:

```bash
# Add to migrate-spacing.sh around line 220
s/\bsmall-padding-small\b/small-p-1/g
s/\bmedium-padding-small\b/medium-p-1/g
s/\bmedium-padding-medium\b/medium-p-2/g
s/\blarge-padding-medium\b/large-p-2/g
```

---

## Rollback Instructions

### If Using Backups

```bash
# Restore all .bak files
find . -name "*.bak" -exec sh -c 'mv "$1" "${1%.bak}"' _ {} \;

# Or restore specific directory
cd templates/
for f in *.bak; do mv "$f" "${f%.bak}"; done
```

### If Using Git

```bash
# Discard all changes
git checkout .

# Discard specific files
git checkout -- src/components/Header.html

# Revert commit
git revert <commit-hash>
```

### If You Need to Roll Back Production

1. Deploy previous version
2. Restore from git tag
   ```bash
   git checkout v1.0.0  # Your last stable tag
   git checkout -b hotfix-rollback-spacing
   ```

---

## Advanced Usage

### Custom Migration Patterns

Edit `migrate-spacing.sh` to add your own patterns:

```bash
# Add after line 200+
# Custom company-specific classes
s/\bpadding-card\b/p-2/g
s/\bpadding-section\b/p-5/g
s/\bmargin-element\b/m-3/g
```

### Integration with CI/CD

Run migration as part of your pipeline:

```yaml
# .github/workflows/migrate.yml
name: Migrate Spacing Classes

on:
  workflow_dispatch:

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run migration
        run: |
          chmod +x migrate-spacing.sh
          ./migrate-spacing.sh . "*.html" --backup
      - name: Create PR
        uses: peter-evans/create-pull-request@v5
        with:
          commit-message: "feat: migrate spacing classes"
          title: "Automated spacing classes migration"
```

### Batch Processing Large Codebases

For very large codebases (1000+ files):

```bash
#!/bin/bash
# migrate-large.sh

# Process in batches of 100 files
find ./src -name "*.html" -print0 | \
  xargs -0 -n 100 -P 4 ./migrate-spacing.sh

# -n 100: 100 files per batch
# -P 4: 4 parallel processes
```

---

## Checklist for Large Teams

### Before Starting

- [ ] Notify team of upcoming changes
- [ ] Create migration branch
- [ ] Document current spacing system
- [ ] Set up testing environment
- [ ] Schedule QA time

### During Migration

- [ ] Run dry run on sample files
- [ ] Review and adjust script if needed
- [ ] Migrate in phases (not all at once)
- [ ] Test after each phase
- [ ] Keep team updated on progress

### After Migration

- [ ] Run full test suite
- [ ] Visual regression testing
- [ ] Browser compatibility testing
- [ ] Performance testing (CSS size)
- [ ] Update documentation
- [ ] Remove old SCSS code (after grace period)
- [ ] Train team on new system

---

## Support

For issues or questions:

1. Check `SPACING_MIGRATION_PLAN.md` for detailed mapping
2. Review this guide's troubleshooting section
3. Test changes in isolated environment first
4. Keep backups until migration is verified

---

## Migration Mapping Quick Reference

| Old Class | New Class | Value |
|-----------|-----------|-------|
| `padding-none` | `p-0` | 0 |
| `padding-small` | `p-1` | 0.3125rem |
| `padding-medium` | `p-2` | 0.75rem |
| `padding-large` | `p-3` | 1rem |
| `padding-1` | `p-3` | 1rem |
| `padding-2` | `p-4` | 2rem |
| `padding-3` | `p-5` | 3rem |
| `padding-button` | `py-6 px-2` | 0.5rem 0.75rem |

Same applies to margins (`m-*` instead of `p-*`)

All directional classes work the same: `px-1`, `py-2`, `pt-3`, `pr-1`, `pb-2`, `pl-3`, etc.
