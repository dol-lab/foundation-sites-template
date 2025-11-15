#!/bin/bash

# ============================================================================
# Spacing Classes Migration Script
# ============================================================================
# This script migrates old spacing class names to the new Tailwind-like system
#
# Usage:
#   ./migrate-spacing.sh [directory] [file-pattern] [options]
#   <file-list> | ./migrate-spacing.sh [options]
#
# Examples:
#   ./migrate-spacing.sh ./src "*.html"              # Migrate HTML files in src/
#   ./migrate-spacing.sh . "*.{html,php,vue}" -d     # Dry run on multiple file types
#   ./migrate-spacing.sh ./templates "*.hbs" -b      # Create backups
#
#   # Pipe files (useful for git tracked files):
#   git ls-files '*.html' | ./migrate-spacing.sh -b -v
#   find . -name "*.vue" -type f | ./migrate-spacing.sh --dry-run
#   git diff --name-only | grep '\.html$' | ./migrate-spacing.sh
#
# Options:
#   -d, --dry-run    Show what would be changed without modifying files
#   -b, --backup     Create .bak backup files before modification
#   -v, --verbose    Show detailed output
#   -h, --help       Show this help message
#   --stdin          Force reading from stdin (auto-detected if piped)
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default options
DRY_RUN=false
CREATE_BACKUP=false
VERBOSE=false
USE_STDIN=false
DIRECTORY="."
FILE_PATTERN="*.html"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -b|--backup)
            CREATE_BACKUP=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        --stdin)
            USE_STDIN=true
            shift
            ;;
        -h|--help)
            head -n 27 "$0" | tail -n +3 | sed 's/^# //'
            exit 0
            ;;
        -*)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
        *)
            if [ -z "$DIRECTORY" ] || [ "$DIRECTORY" = "." ]; then
                DIRECTORY=$1
            elif [ "$FILE_PATTERN" = "*.html" ]; then
                FILE_PATTERN=$1
            fi
            shift
            ;;
    esac
done

# Auto-detect if stdin is being piped
if [ ! -t 0 ] && [ "$USE_STDIN" = false ]; then
    USE_STDIN=true
fi

# Validate directory (only if not using stdin)
if [ "$USE_STDIN" = false ] && [ ! -d "$DIRECTORY" ]; then
    echo -e "${RED}Error: Directory '$DIRECTORY' does not exist${NC}"
    exit 1
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Spacing Classes Migration Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Configuration:${NC}"

if [ "$USE_STDIN" = true ]; then
    echo -e "  Input:         stdin (piped)"
else
    echo -e "  Directory:     $DIRECTORY"
    echo -e "  Pattern:       $FILE_PATTERN"
fi

echo -e "  Dry run:       $DRY_RUN"
echo -e "  Create backup: $CREATE_BACKUP"
echo -e "  Verbose:       $VERBOSE"
echo ""

# Count files to process
if [ "$USE_STDIN" = true ]; then
    # Read from stdin into array
    mapfile -t FILE_LIST
    FILE_COUNT=${#FILE_LIST[@]}
else
    FILE_COUNT=$(find "$DIRECTORY" -type f -name "$FILE_PATTERN" 2>/dev/null | wc -l)
fi

if [ "$FILE_COUNT" -eq 0 ]; then
    echo -e "${YELLOW}Warning: No files to process${NC}"
    exit 0
fi

echo -e "${GREEN}Found $FILE_COUNT file(s) to process${NC}"
echo ""

# Create temporary sed script
TEMP_SED=$(mktemp)
cat > "$TEMP_SED" << 'EOF'
# ============================================================================
# Spacing Migration Patterns
# Order matters: most specific patterns first
# ============================================================================

# ============================================================================
# 1. Old Prototype Verbose Classes (padding-left-0 style)
# ============================================================================

# Padding verbose directional classes
s/\bpadding-left-0\b/pl-0/g
s/\bpadding-left-1\b/pl-3/g
s/\bpadding-left-2\b/pl-4/g
s/\bpadding-left-3\b/pl-5/g

s/\bpadding-right-0\b/pr-0/g
s/\bpadding-right-1\b/pr-3/g
s/\bpadding-right-2\b/pr-4/g
s/\bpadding-right-3\b/pr-5/g

s/\bpadding-top-0\b/pt-0/g
s/\bpadding-top-1\b/pt-3/g
s/\bpadding-top-2\b/pt-4/g
s/\bpadding-top-3\b/pt-5/g

s/\bpadding-bottom-0\b/pb-0/g
s/\bpadding-bottom-1\b/pb-3/g
s/\bpadding-bottom-2\b/pb-4/g
s/\bpadding-bottom-3\b/pb-5/g

s/\bpadding-horizontal-0\b/px-0/g
s/\bpadding-horizontal-1\b/px-3/g
s/\bpadding-horizontal-2\b/px-4/g
s/\bpadding-horizontal-3\b/px-5/g

s/\bpadding-vertical-0\b/py-0/g
s/\bpadding-vertical-1\b/py-3/g
s/\bpadding-vertical-2\b/py-4/g
s/\bpadding-vertical-3\b/py-5/g

# Margin verbose directional classes
s/\bmargin-left-0\b/ml-0/g
s/\bmargin-left-1\b/ml-3/g
s/\bmargin-left-2\b/ml-4/g
s/\bmargin-left-3\b/ml-5/g

s/\bmargin-right-0\b/mr-0/g
s/\bmargin-right-1\b/mr-3/g
s/\bmargin-right-2\b/mr-4/g
s/\bmargin-right-3\b/mr-5/g

s/\bmargin-top-0\b/mt-0/g
s/\bmargin-top-1\b/mt-3/g
s/\bmargin-top-2\b/mt-4/g
s/\bmargin-top-3\b/mt-5/g

s/\bmargin-bottom-0\b/mb-0/g
s/\bmargin-bottom-1\b/mb-3/g
s/\bmargin-bottom-2\b/mb-4/g
s/\bmargin-bottom-3\b/mb-5/g

s/\bmargin-horizontal-0\b/mx-0/g
s/\bmargin-horizontal-1\b/mx-3/g
s/\bmargin-horizontal-2\b/mx-4/g
s/\bmargin-horizontal-3\b/mx-5/g

s/\bmargin-vertical-0\b/my-0/g
s/\bmargin-vertical-1\b/my-3/g
s/\bmargin-vertical-2\b/my-4/g
s/\bmargin-vertical-3\b/my-5/g

# ============================================================================
# 2. Directional Padding Helpers (px-, py-, pt-, pr-, pb-, pl-)
# ============================================================================

s/\bpx-none\b/px-0/g
s/\bpx-small\b/px-1/g
s/\bpx-medium\b/px-2/g
s/\bpx-large\b/px-3/g

s/\bpy-none\b/py-0/g
s/\bpy-small\b/py-1/g
s/\bpy-medium\b/py-2/g
s/\bpy-large\b/py-3/g

s/\bpt-none\b/pt-0/g
s/\bpt-small\b/pt-1/g
s/\bpt-medium\b/pt-2/g
s/\bpt-large\b/pt-3/g

s/\bpr-none\b/pr-0/g
s/\bpr-small\b/pr-1/g
s/\bpr-medium\b/pr-2/g
s/\bpr-large\b/pr-3/g

s/\bpb-none\b/pb-0/g
s/\bpb-small\b/pb-1/g
s/\bpb-medium\b/pb-2/g
s/\bpb-large\b/pb-3/g

s/\bpl-none\b/pl-0/g
s/\bpl-small\b/pl-1/g
s/\bpl-medium\b/pl-2/g
s/\bpl-large\b/pl-3/g

# ============================================================================
# 3. Directional Margin Helpers (mx-, my-, mt-, mr-, mb-, ml-)
# ============================================================================

s/\bmx-none\b/mx-0/g
s/\bmx-small\b/mx-1/g
s/\bmx-medium\b/mx-2/g
s/\bmx-large\b/mx-3/g

s/\bmy-none\b/my-0/g
s/\bmy-small\b/my-1/g
s/\bmy-medium\b/my-2/g
s/\bmy-large\b/my-3/g

s/\bmt-none\b/mt-0/g
s/\bmt-small\b/mt-1/g
s/\bmt-medium\b/mt-2/g
s/\bmt-large\b/mt-3/g

s/\bmr-none\b/mr-0/g
s/\bmr-small\b/mr-1/g
s/\bmr-medium\b/mr-2/g
s/\bmr-large\b/mr-3/g

s/\bmb-none\b/mb-0/g
s/\bmb-small\b/mb-1/g
s/\bmb-medium\b/mb-2/g
s/\bmb-large\b/mb-3/g

s/\bml-none\b/ml-0/g
s/\bml-small\b/ml-1/g
s/\bml-medium\b/ml-2/g
s/\bml-large\b/ml-3/g

# ============================================================================
# 4. Main Padding Classes (must come after directional to avoid conflicts)
# ============================================================================

# Handle both padding-X and p-X variants
s/\b\(padding-none\|p-none\)\b/p-0/g
s/\b\(padding-small\|p-small\)\b/p-1/g
s/\b\(padding-medium\|p-medium\)\b/p-2/g
s/\b\(padding-large\|p-large\)\b/p-3/g

# Numeric padding classes
s/\bpadding-0\b/p-0/g
s/\bpadding-1\b/p-3/g
s/\bpadding-2\b/p-4/g
s/\bpadding-3\b/p-5/g

# Special classes
s/\bpadding-button\b/py-6 px-2/g
s/\bpadding-xlarge\b/p-7/g
s/\bpadding-xxlarge\b/p-8/g

# Short forms of special classes
s/\bp-button\b/py-6 px-2/g
s/\bp-xlarge\b/p-7/g
s/\bp-xxlarge\b/p-8/g

# ============================================================================
# 5. Main Margin Classes
# ============================================================================

s/\bmargin-none\b/m-0/g
s/\bmargin-small\b/m-1/g
s/\bmargin-medium\b/m-2/g
s/\bmargin-large\b/m-3/g

# Numeric margin classes
s/\bmargin-0\b/m-0/g
s/\bmargin-1\b/m-3/g
s/\bmargin-2\b/m-4/g
s/\bmargin-3\b/m-5/g

# Short forms of special margin classes
s/\bm-button\b/my-6 mx-2/g
s/\bm-xlarge\b/m-7/g
s/\bm-xxlarge\b/m-8/g

# Special margin classes
s/\bmargin-button\b/my-6 mx-2/g
s/\bmargin-xlarge\b/m-7/g
s/\bmargin-xxlarge\b/m-8/g

EOF

# Function to process a single file
process_file() {
    local file="$1"
    
    # Skip backup files
    if [[ "$file" == *.bak ]]; then
        return
    fi
    
    # Skip if file doesn't exist
    if [ ! -f "$file" ]; then
        [ "$VERBOSE" = true ] && echo -e "${YELLOW}⚠ Skipped (not found): $file${NC}"
        return
    fi
    
    # Create backup if requested
    if [ "$CREATE_BACKUP" = true ] && [ "$DRY_RUN" = false ]; then
        cp "$file" "$file.bak"
        [ "$VERBOSE" = true ] && echo -e "${YELLOW}Created backup: $file.bak${NC}"
    fi
    
    # Run sed
    if [ "$DRY_RUN" = true ]; then
        # Dry run: show differences
        TEMP_OUTPUT=$(mktemp)
        sed -f "$TEMP_SED" "$file" > "$TEMP_OUTPUT"
        
        if ! diff -q "$file" "$TEMP_OUTPUT" > /dev/null 2>&1; then
            echo -e "${YELLOW}Would modify: $file${NC}"
            
            if [ "$VERBOSE" = true ]; then
                echo -e "${BLUE}Changes:${NC}"
                diff -u "$file" "$TEMP_OUTPUT" | grep -E "^[\+\-]" | grep -v "^[\+\-]{3}" | head -20
                echo ""
            fi
            
            FILES_MODIFIED=$((FILES_MODIFIED + 1))
        fi
        
        rm "$TEMP_OUTPUT"
    else
        # Actual modification
        TEMP_OUTPUT=$(mktemp)
        sed -f "$TEMP_SED" "$file" > "$TEMP_OUTPUT"
        
        if ! diff -q "$file" "$TEMP_OUTPUT" > /dev/null 2>&1; then
            mv "$TEMP_OUTPUT" "$file"
            echo -e "${GREEN}✓ Modified: $file${NC}"
            
            if [ "$VERBOSE" = true ] && [ "$CREATE_BACKUP" = true ]; then
                CHANGES=$(diff -U 0 "$file.bak" "$file" 2>/dev/null | grep -c "^[-+]" || echo "0")
                echo -e "  ${BLUE}Changes: $((CHANGES / 2))${NC}"
            fi
            
            FILES_MODIFIED=$((FILES_MODIFIED + 1))
        else
            rm "$TEMP_OUTPUT"
            [ "$VERBOSE" = true ] && echo -e "${BLUE}○ No changes: $file${NC}"
        fi
    fi
}

# Statistics
FILES_MODIFIED=0

# Process files
echo -e "${BLUE}Processing files...${NC}"
echo ""

if [ "$USE_STDIN" = true ]; then
    # Process files from stdin
    for file in "${FILE_LIST[@]}"; do
        process_file "$file"
    done
else
    # Process files from find
    while IFS= read -r file; do
        process_file "$file"
    done < <(find "$DIRECTORY" -type f -name "$FILE_PATTERN")
fi

# Cleanup
rm "$TEMP_SED"

# Summary
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Migration Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}DRY RUN - No files were modified${NC}"
    echo -e "${GREEN}Files that would be modified: $FILES_MODIFIED${NC}"
else
    echo -e "${GREEN}Files modified: $FILES_MODIFIED${NC}"
    
    if [ "$CREATE_BACKUP" = true ] && [ "$FILES_MODIFIED" -gt 0 ]; then
        echo -e "${YELLOW}Backup files created with .bak extension${NC}"
        echo -e "${YELLOW}To restore: for f in *.bak; do mv \"\$f\" \"\${f%.bak}\"; done${NC}"
    fi
fi

echo ""

# Exit code
if [ "$FILES_MODIFIED" -gt 0 ]; then
    if [ "$DRY_RUN" = true ]; then
        echo -e "${YELLOW}Run without --dry-run to apply changes${NC}"
    else
        echo -e "${GREEN}✓ Migration completed successfully!${NC}"
    fi
    exit 0
else
    echo -e "${BLUE}No files needed modification${NC}"
    exit 0
fi
