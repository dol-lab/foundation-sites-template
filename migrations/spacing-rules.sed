# ============================================================================
# Spacing Migration Patterns
# Order matters: most specific patterns first
# ============================================================================

# ============================================================================
# 1. Old Prototype Verbose Classes (padding-left-0 style)
# ============================================================================

# Padding verbose directional classes
s/\bpadding-left-0\b/pl-0/g
s/\bpadding-left-1\b/pl-4/g
s/\bpadding-left-2\b/pl-7/g
s/\bpadding-left-3\b/pl-9/g

s/\bpadding-right-0\b/pr-0/g
s/\bpadding-right-1\b/pr-4/g
s/\bpadding-right-2\b/pr-7/g
s/\bpadding-right-3\b/pr-9/g

s/\bpadding-top-0\b/pt-0/g
s/\bpadding-top-1\b/pt-4/g
s/\bpadding-top-2\b/pt-7/g
s/\bpadding-top-3\b/pt-9/g

s/\bpadding-bottom-0\b/pb-0/g
s/\bpadding-bottom-1\b/pb-4/g
s/\bpadding-bottom-2\b/pb-7/g
s/\bpadding-bottom-3\b/pb-9/g

s/\bpadding-horizontal-0\b/px-0/g
s/\bpadding-horizontal-1\b/px-4/g
s/\bpadding-horizontal-2\b/px-7/g
s/\bpadding-horizontal-3\b/px-9/g

s/\bpadding-vertical-0\b/py-0/g
s/\bpadding-vertical-1\b/py-4/g
s/\bpadding-vertical-2\b/py-7/g
s/\bpadding-vertical-3\b/py-9/g

# Margin verbose directional classes
s/\bmargin-left-0\b/ml-0/g
s/\bmargin-left-1\b/ml-4/g
s/\bmargin-left-2\b/ml-7/g
s/\bmargin-left-3\b/ml-9/g

s/\bmargin-right-0\b/mr-0/g
s/\bmargin-right-1\b/mr-4/g
s/\bmargin-right-2\b/mr-7/g
s/\bmargin-right-3\b/mr-9/g

s/\bmargin-top-0\b/mt-0/g
s/\bmargin-top-1\b/mt-4/g
s/\bmargin-top-2\b/mt-7/g
s/\bmargin-top-3\b/mt-9/g

s/\bmargin-bottom-0\b/mb-0/g
s/\bmargin-bottom-1\b/mb-4/g
s/\bmargin-bottom-2\b/mb-7/g
s/\bmargin-bottom-3\b/mb-9/g

s/\bmargin-horizontal-0\b/mx-0/g
s/\bmargin-horizontal-1\b/mx-4/g
s/\bmargin-horizontal-2\b/mx-7/g
s/\bmargin-horizontal-3\b/mx-9/g

s/\bmargin-vertical-0\b/my-0/g
s/\bmargin-vertical-1\b/my-4/g
s/\bmargin-vertical-2\b/my-7/g
s/\bmargin-vertical-3\b/my-9/g

# ============================================================================
# 2. Directional Padding Helpers (px-, py-, pt-, pr-, pb-, pl-)
# ============================================================================

s/\bpx-none\b/px-0/g
s/\bpx-small\b/px-1/g
s/\bpx-medium\b/px-3/g
s/\bpx-large\b/px-4/g

s/\bpy-none\b/py-0/g
s/\bpy-small\b/py-1/g
s/\bpy-medium\b/py-3/g
s/\bpy-large\b/py-4/g

s/\bpt-none\b/pt-0/g
s/\bpt-small\b/pt-1/g
s/\bpt-medium\b/pt-3/g
s/\bpt-large\b/pt-4/g

s/\bpr-none\b/pr-0/g
s/\bpr-small\b/pr-1/g
s/\bpr-medium\b/pr-3/g
s/\bpr-large\b/pr-4/g

s/\bpb-none\b/pb-0/g
s/\bpb-small\b/pb-1/g
s/\bpb-medium\b/pb-3/g
s/\bpb-large\b/pb-4/g

s/\bpl-none\b/pl-0/g
s/\bpl-small\b/pl-1/g
s/\bpl-medium\b/pl-3/g
s/\bpl-large\b/pl-4/g

# ============================================================================
# 3. Directional Margin Helpers (mx-, my-, mt-, mr-, mb-, ml-)
# ============================================================================

s/\bmx-none\b/mx-0/g
s/\bmx-small\b/mx-1/g
s/\bmx-medium\b/mx-3/g
s/\bmx-large\b/mx-4/g

s/\bmy-none\b/my-0/g
s/\bmy-small\b/my-1/g
s/\bmy-medium\b/my-3/g
s/\bmy-large\b/my-4/g

s/\bmt-none\b/mt-0/g
s/\bmt-small\b/mt-1/g
s/\bmt-medium\b/mt-3/g
s/\bmt-large\b/mt-4/g

s/\bmr-none\b/mr-0/g
s/\bmr-small\b/mr-1/g
s/\bmr-medium\b/mr-3/g
s/\bmr-large\b/mr-4/g

s/\bmb-none\b/mb-0/g
s/\bmb-small\b/mb-1/g
s/\bmb-medium\b/mb-3/g
s/\bmb-large\b/mb-4/g

s/\bml-none\b/ml-0/g
s/\bml-small\b/ml-1/g
s/\bml-medium\b/ml-3/g
s/\bml-large\b/ml-4/g

# ============================================================================
# 4. Main Padding Classes (must come after directional to avoid conflicts)
# ============================================================================

# Handle both padding-X and p-X variants
s/\b\(padding-none\|p-none\|no-padding\)\b/p-0/g
s/\b\(padding-small\|p-small\)\b/p-1/g
s/\b\(padding-medium\|p-medium\)\b/p-2/g
s/\b\(padding-large\|p-large\)\b/p-3/g

# Numeric padding classes
s/\bpadding-0\b/p-0/g
s/\bpadding-1\b/p-4/g
s/\bpadding-2\b/p-7/g
s/\bpadding-3\b/p-9/g

# Special classes
s/\bpadding-button\b/p-3/g
s/\bpadding-xlarge\b/p-5/g
s/\bpadding-xxlarge\b/p-6/g

# Short forms of special classes
s/\bp-button\b/p-3/g
s/\bp-xlarge\b/p-5/g
s/\bp-xxlarge\b/p-6/g

# ============================================================================
# 5. Main Margin Classes
# ============================================================================

s/\bmargin-none\b/m-0/g
s/\bmargin-small\b/m-1/g
s/\bmargin-medium\b/m-3/g
s/\bmargin-large\b/m-4/g

# Numeric margin classes
s/\bmargin-0\b/m-0/g
s/\bmargin-1\b/m-4/g
s/\bmargin-2\b/m-7/g
s/\bmargin-3\b/m-9/g

# Short forms of special margin classes
s/\bm-button\b/my-2 mx-3/g
s/\bm-xlarge\b/m-5/g
s/\bm-xxlarge\b/m-6/g

# Special margin classes
s/\bmargin-button\b/my-2 mx-3/g
s/\bmargin-xlarge\b/m-5/g
s/\bmargin-xxlarge\b/m-6/g
