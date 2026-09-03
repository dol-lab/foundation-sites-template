# Refactoring plan

Ordered by payoff divided by effort, so the top of the list is what to do next.
Measured 2026-09-02 against Dart Sass 1.92.1, `scss/app.scss` + `scss/app-backend.scss`.

## Constraint

`app-backend.scss` nests `@import "custom-foundation-includes"` and
`@import "custom-styles"` inside `.f`, which is what makes the styles usable in
wp-admin. **That stays.** Since `@use` cannot appear inside a rule, step 4 has to
wrap those two partials' bodies in mixins and `@include` them under `.f`.

## Steps

| # | Step | Effort | Payoff | Status |
| --- | --- | --- | --- | --- |
| 1 | Dart Sass 2.0 blockers: `/` division, `!global` | XS (10 sites) | build survives Sass 2 | done |
| 2 | Switch off unused xy-grid class groups | XS (1 line) | -51 KB, 15% of the stylesheet | done |
| 3 | `gulp-sass` off the legacy JS API | S (one gulp task) | build survives Sass 2 | next |
| 4 | Global built-ins to `sass:map` / `sass:math` / `sass:list` | M (271 sites, automated) | build survives Sass 3 | |
| 5 | `@import` to `@use` / `@forward` | L (159 sites) | build survives Sass 3 | |
| 6 | Drop unused components from the include list | S | ~15 KB, less to maintain | |
| 7 | Sass `mix()` to CSS `color-mix()` | S | consistency with the 633 existing calls | |
| 8 | Heading sizes to `clamp()` | M | deletes 3 breakpoint blocks of h1-h6 | |
| 9 | Container queries for self-sizing components | L | fewer breakpoint couplings | |

### 1. Dart Sass 2.0 blockers (done)

9 `slash-div` sites (`_s-badge.scss`, `custom-styles/_forms-inputs.scss`,
`custom-styles/_components.scss`) and 1 `new-global` (`_s-scroll-snap.scss:215`,
where `!global` is not needed at all: `$index` is read on the next line).

Use `math.div()` throughout rather than mixing it with `* 0.5`, and add
`@use "sass:math"` to the two files that lack it.

Verified: compiled CSS byte-identical, both warnings now at 0 in both entry
points. Worth knowing for steps 4 and 5: `@use "sass:math"` in a partial that is
`@import`ed inside `.f` compiles fine. Only a `@use` written literally inside the
rule is rejected.

### 2. Unused xy-grid class groups (done)

`_custom-foundation-includes.scss` includes `foundation-xy-grid-classes` bare, so
it emits every group. These have no hits in the themes or the spaces-* plugins:
`*-margin-collapse` / `*-padding-collapse` (19.5 KB on its own), `grid-padding-x`
/ `grid-padding-y`, `grid-frame` / `cell-block`, and the block grid (`.small-up-N`,
one hit).

`$collapse`, `$frame-grid`, `$block-grid` and `$offset` are off. That is 130 class
tokens and 15% of both stylesheets (app.css 337 KB to 285 KB, app-backend.css
343 KB to 289 KB), with nothing else added or removed.

`$padding-grid` stays on although the platform does not use it: `.grid-padding-x`
appears in `html-partials/_content-labels.html`, so the template's own demo needs
it.

There is no per-project override point to put these in. spaces-markup enqueues the
built `css/app.css` straight out of `vendor/`, so a consumer never runs this
build. The flags have to live here, which is why each one carries a comment naming
the classes it drops.

### 3. `gulp-sass` off the legacy JS API

`gulpfile.js` uses `gulp-sass` over `sass-embedded`, which reaches Dart Sass
through the legacy JS API. That API goes away in Dart Sass 2.0 as well, so it is
the same deadline as step 1 and it is invisible in the `sass` CLI warnings: only
`npx gulp sass` prints it.

Replace the `gulp-sass` pipe in `sassBuild()` with a direct
`sassEmbedded.compileAsync()` call, keeping the existing `includePaths`,
`outputStyle` and sourcemap behaviour.

Verify: rebuild and diff `css/`, output must be byte-identical.

### 4. Global built-ins

271 sites, mostly `map-get`, `nth`, `mix`, `type-of`. `sass-migrator module`
rewrites them. Cheapest done together with step 4, since the migrator wants to do
both at once, but it can run alone.

### 5. `@import` to `@use` / `@forward`

159 sites. The mechanical part is `sass-migrator module`. The manual part is the
constraint above plus the implicit-global-scope habit the current files rely on:
`_settings.scss` and `_colors.scss` variables are visible everywhere today, and
under modules every partial has to `@use` them explicitly, with `!default` chains
becoming `@use ... with (...)`.

Do it after step 4, one entry point at a time, diffing the compiled CSS.

### 6. Unused components

No hits for the class names or their `data-*` attributes anywhere in the themes or
spaces-* markup: off-canvas (507 lines of scss), top-bar, title-bar,
drilldown-menu, media-object, the float classes. `index.html` demos some of them
and other projects use this template, so this is a question about the default
include list, not a delete.

### 7. `mix()` to `color-mix()`

61 Sass `mix()` calls left beside 633 CSS `color-mix()`. Not a blind swap: Sass
`mix($a, $b, 30%)` weights `$a` and interpolates in sRGB, so the equivalent is
`color-mix(in srgb, $a 30%, $b)`. Anything that has to stay a compile-time colour
(a value fed to a Sass colour function later) has to keep `color.mix()`.

### 8. `clamp()` for headings

`custom-includes/foundation-spaces/typography/_base.scss` emits h1-h6 three times
with hand-written factors (`23 * 0.8`, `23 * 0.9`, `23`). One `clamp()` per level
replaces the whole map and its breakpoint blocks. `clamp()` is currently used once
in the entire codebase.

### 9. Container queries

0 container queries today against 14 raw `@media` plus 14 `-zf-each-breakpoint`
loops. Worth it for components that reflow by their own width (cards, chips, the
scroll-snap container). Not for the grid class matrix, which is viewport-bound by
definition. Incremental, no deadline.
