#!/bin/bash

# ============================================================================
# Spacing Classes Migration Script
# ============================================================================
# This script migrates old spacing class names to the new Tailwind-like system
#
# Usage:
#   ./migrate-spacing.sh [directory] [file-pattern] [options]
#
# Examples:
#   ./migrate-spacing.sh ./src "*.html"              # Migrate HTML files in src/
#   ./migrate-spacing.sh . "*.html,*.php,*.vue" -d   # Dry run on multiple file types
#   ./migrate-spacing.sh ./templates "*.hbs" -b      # Create backups
#   ./migrate-spacing.sh ./app "*.jsx,*.tsx" --max-depth 2 # Limit recursion depth
#   ./migrate-spacing.sh ./src "*.html" --no-recursive # Non-recursive (current dir only)
#   ./migrate-spacing.sh . "*.html,*.vue,*.ts,*.tsx,*.handlebars" --git # Only git-tracked files
#   ./migrate-spacing.sh . "*.html" -f custom-rules.sed # Use custom sed rules file
#
# Options:
#   -d, --dry-run       Show what would be changed without modifying files
#   -b, --backup        Create .bak backup files before modification
#   -v, --verbose       Show detailed output
#   -f, --rules FILE    Use custom sed rules file (default: spacing-rules.sed)
#   -g, --git-only, --git   Only process files tracked by git
#   -r, --recursive     Recursive search (DEFAULT - this is explicit flag)
#   --no-recursive      Search only in specified directory (not subdirectories)
#   --max-depth N       Limit recursion to N levels deep
#   -h, --help          Show this help message
#
# Note: For multiple file types, use comma-separated extensions:
#   "*.html,*.php,*.vue" instead of "*.{html,php,vue}"
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
RECURSIVE=true
MAX_DEPTH=""
GIT_ONLY=false
DIRECTORY=""
FILE_PATTERN="*.html"
SED_RULES_FILE=""

# Parse arguments
POSITIONAL_ARGS=()
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
        -r|--recursive)
            RECURSIVE=true
            shift
            ;;
        --no-recursive)
            RECURSIVE=false
            shift
            ;;
        --max-depth)
            MAX_DEPTH="$2"
            shift 2
            ;;
        -f|--rules|--sed-file)
            SED_RULES_FILE="$2"
            shift 2
            ;;
        -g|--git-only|--git)
            GIT_ONLY=true
            shift
            ;;
        -h|--help)
            head -n 28 "$0" | tail -n +3 | sed 's/^# //'
            exit 0
            ;;
        -*)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
        *)
            POSITIONAL_ARGS+=("$1")
            shift
            ;;
    esac
done

# Process positional arguments
if [ ${#POSITIONAL_ARGS[@]} -ge 1 ]; then
    DIRECTORY="${POSITIONAL_ARGS[0]}"
fi

if [ ${#POSITIONAL_ARGS[@]} -ge 2 ]; then
    FILE_PATTERN="${POSITIONAL_ARGS[1]}"
fi

# Set default directory if not specified
if [ -z "$DIRECTORY" ]; then
    DIRECTORY="."
fi

# Validate directory
if [ ! -d "$DIRECTORY" ]; then
    echo -e "${RED}Error: Directory '$DIRECTORY' does not exist${NC}"
    exit 1
fi

# Validate max-depth
if [ -n "$MAX_DEPTH" ] && ! [[ "$MAX_DEPTH" =~ ^[0-9]+$ ]]; then
    echo -e "${RED}Error: --max-depth must be a positive number${NC}"
    exit 1
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Spacing Classes Migration Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Configuration:${NC}"
echo -e "  Directory:     $DIRECTORY"
echo -e "  Pattern:       $FILE_PATTERN"
echo -e "  Rules file:    ${SED_RULES_FILE:-spacing-rules.sed (default)}"
echo -e "  Recursive:     $RECURSIVE"
if [ -n "$MAX_DEPTH" ]; then
    echo -e "  Max depth:     $MAX_DEPTH"
fi
echo -e "  Git only:      $GIT_ONLY"
echo -e "  Dry run:       $DRY_RUN"
echo -e "  Create backup: $CREATE_BACKUP"
echo -e "  Verbose:       $VERBOSE"
echo ""

# Build find command or use git ls-files based on options
if [ "$GIT_ONLY" = true ]; then
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${RED}Error: --git-only specified but not in a git repository${NC}"
        exit 1
    fi

    # Build git ls-files command
    GIT_CMD="git ls-files"

    # Convert comma-separated pattern to multiple -o -name arguments for grep
    # Split pattern by comma and build grep pattern
    IFS=',' read -ra PATTERNS <<< "$FILE_PATTERN"
    GREP_PATTERN=""
    for pattern in "${PATTERNS[@]}"; do
        # Remove leading/trailing whitespace and asterisk
        pattern=$(echo "$pattern" | sed 's/^[[:space:]]*\*\.//;s/[[:space:]]*$//')
        if [ -z "$GREP_PATTERN" ]; then
            GREP_PATTERN="\.$pattern\$"
        else
            GREP_PATTERN="$GREP_PATTERN|\.$pattern\$"
        fi
    done

    # Add directory filtering if not current directory
    if [ "$DIRECTORY" != "." ]; then
        GIT_CMD="$GIT_CMD | grep '^$DIRECTORY/'"
    fi

    # Add pattern filtering
    if [ -n "$GREP_PATTERN" ]; then
        GIT_CMD="$GIT_CMD | grep -E '$GREP_PATTERN'"
    fi

    FIND_CMD="$GIT_CMD"
else
    # Traditional find command
    FIND_CMD="find \"$DIRECTORY\""

    if [ "$RECURSIVE" = false ]; then
        FIND_CMD="$FIND_CMD -maxdepth 1"
    elif [ -n "$MAX_DEPTH" ]; then
        FIND_CMD="$FIND_CMD -maxdepth $MAX_DEPTH"
    fi

    # Handle comma-separated patterns
    if [[ "$FILE_PATTERN" == *","* ]]; then
        # Split by comma and build find expression
        IFS=',' read -ra PATTERNS <<< "$FILE_PATTERN"
        FIND_CMD="$FIND_CMD -type f \\("
        first=true
        for pattern in "${PATTERNS[@]}"; do
            # Remove leading/trailing whitespace
            pattern=$(echo "$pattern" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
            if [ "$first" = true ]; then
                FIND_CMD="$FIND_CMD -name \"$pattern\""
                first=false
            else
                FIND_CMD="$FIND_CMD -o -name \"$pattern\""
            fi
        done
        FIND_CMD="$FIND_CMD \\)"
    else
        # Single pattern
        FIND_CMD="$FIND_CMD -type f -name \"$FILE_PATTERN\""
    fi
fi

# Count files to process
FILE_COUNT=$(eval "$FIND_CMD" 2>/dev/null | wc -l)

if [ "$FILE_COUNT" -eq 0 ]; then
    echo -e "${YELLOW}Warning: No files found matching pattern '$FILE_PATTERN' in '$DIRECTORY'${NC}"
    if [ "$RECURSIVE" = false ]; then
        echo -e "${YELLOW}Note: Running in non-recursive mode. Use -r or --recursive to search subdirectories.${NC}"
    fi
    exit 0
fi

echo -e "${GREEN}Found $FILE_COUNT file(s) to process${NC}"
if [ "$VERBOSE" = true ]; then
    echo ""
    echo -e "${BLUE}Files to process:${NC}"
    eval "$FIND_CMD" | head -20
    if [ "$FILE_COUNT" -gt 20 ]; then
        echo -e "${BLUE}... and $((FILE_COUNT - 20)) more${NC}"
    fi
fi
echo ""

# Custom file specified, validate it exists
if [ ! -f "$SED_RULES_FILE" ]; then
    echo -e "${RED}Error: Rules file '$SED_RULES_FILE' not found${NC}"
    exit 1
fi
[ "$VERBOSE" = true ] && echo -e "${GREEN}Using custom rules file: $SED_RULES_FILE${NC}"

# Statistics
TOTAL_CHANGES=0
FILES_MODIFIED=0

# Process files
echo -e "${BLUE}Processing files...${NC}"
echo ""

eval "$FIND_CMD" | while read -r file; do
    # Skip backup files
    if [[ "$file" == *.bak ]]; then
        continue
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
        sed -f "$SED_RULES_FILE" "$file" > "$TEMP_OUTPUT"

        if ! diff -q "$file" "$TEMP_OUTPUT" > /dev/null 2>&1; then
            echo -e "${YELLOW}Would modify: $file${NC}"

            if [ "$VERBOSE" = true ]; then
                echo -e "${BLUE}Changes:${NC}"
                diff -u "$file" "$TEMP_OUTPUT" | grep -E "^[\+\-]" | grep -v "^[\+\-]{3}" | head -20
                echo ""
            fi

            # Count changes
            CHANGES=$(diff -U 0 "$file" "$TEMP_OUTPUT" | grep -c "^[-+]" || true)
            TOTAL_CHANGES=$((TOTAL_CHANGES + CHANGES / 2))
            FILES_MODIFIED=$((FILES_MODIFIED + 1))
        fi

        rm "$TEMP_OUTPUT"
    else
        # Actual modification
        TEMP_OUTPUT=$(mktemp)
        sed -f "$SED_RULES_FILE" "$file" > "$TEMP_OUTPUT"

        if ! diff -q "$file" "$TEMP_OUTPUT" > /dev/null 2>&1; then
            mv "$TEMP_OUTPUT" "$file"
            echo -e "${GREEN}✓ Modified: $file${NC}"

            if [ "$VERBOSE" = true ]; then
                if [ -f "$file.bak" ]; then
                    CHANGES=$(diff -U 0 "$file.bak" "$file" 2>/dev/null | grep -c "^[-+]" || echo "0")
                    echo -e "  ${BLUE}Changes: $((CHANGES / 2))${NC}"
                fi
            fi

            FILES_MODIFIED=$((FILES_MODIFIED + 1))
        else
            rm "$TEMP_OUTPUT"
            [ "$VERBOSE" = true ] && echo -e "${BLUE}○ No changes: $file${NC}"
        fi
    fi
done

# Cleanup
if [ -n "$TEMP_SED" ] && [ -f "$TEMP_SED" ]; then
    rm "$TEMP_SED"
fi

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

    if [ "$CREATE_BACKUP" = true ]; then
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
