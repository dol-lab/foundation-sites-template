# Plan: a general Foundation fork for 2026

Goal: a themeable, general-purpose fork of Foundation 6. Rules written for one Spaces screen or plugin leave the template. What stays uses current CSS wherever that removes Sass machinery or duplicated theme blocks. Baseline: Dart Sass 1.92 via `sass-embedded`, bun.

Cheap for AIs to work with, as a rule for every step:

- Generated and binary files stay out of search: `.ignore` (read by ripgrep, so by Claude Code and Codex) lists `css/`, maps, `index.html`, `bun.lock`, `assets/`, `fonts/`. Never commit a second copy of a build output.
- One component per partial, named after its class (`_info-chip.scss` styles `.info-chip`), so finding the code is a filename lookup instead of a grep through a 1000-line file.
- The README starts with a file map (one line per directory or entry file), so an agent reads that instead of listing the tree.
- A knob is a `!default` variable or a custom property at the top of its partial, not spread across `_settings.scss`, `_custom-settings.scss` and the partial.

## Verification (every step)

- Build: `bunx gulp sass` (about 2 s, writes `css/app.css` and `css/app-backend.css`).
- Before a step, copy both files to a scratch dir; after it, diff them. A refactor step must compile byte-identical, or the diff is explained in the step's notes.
- A move step must leave the union of template and destination equivalent. Check with `scripts/wpb shot` (repo root) on: a Space start page, a single post, the Spaces overview, a profile, one wp-admin screen, and the KISDarchiv (`ark`) header.

## Where a Spaces-specific rule goes

| The rule styles | Destination | Reason |
| --- | --- | --- |
| Theme chrome: sidebar, widgets, space header, post cards in the stream | `themes/defaultspace/css/ds-main.css` | front-end only |
| Post content and blocks (`.wp-block-*`, `.editor-styles-wrapper`, `.user-generated`) | `themes/defaultspace/css/ds-content.css` | shared with the block editor |
| A spaces-markup template (space card, user card, avatar menu, chips with taxonomy) | `plugins/spaces-markup/assets/css/` | rendered in wp-admin and `ark` too, where ds-main.css is not loaded |
| One plugin's UI (`.sms-*`, `.spaces-editor-*`, global search, tagify, CKEditor) | that plugin's own CSS | ships with the plugin |
| wp-admin glue | `themes/defaultspace/css/ds-header-backend.css` | |
| Nothing (no hits in themes, plugins, templates) | deleted | |

Traps:

- Move the **compiled** rule (from `css/app.css`), not the SCSS: the destinations are plain CSS. Sass variables become `var(--f-…)` or literals, `-zf-each-breakpoint` becomes `@media`.
- `app-backend.css` scopes everything under `.f`. A rule needed in wp-admin or `ark` cannot go to ds-main.css.
- Two repos: the template is its own repo (`dol-lab/foundation-sites-template`, composer `dev-master` in spaces-markup). The removal must not reach an instance before its destination rules do: commit the destination side in spaces-kisd together with the `composer.lock` bump that pulls the removal. Other instances using the template need the same destination rules.

## Steps

Sequential: every step rebuilds the same `css/` files.

| # | Step | Size | Who |
| --- | --- | --- | --- |
| 1 | Hygiene | S | main |
| 2 | Inventory of Spaces-specific rules | M | agent (read-only) |
| 3 | Move them out, one destination at a time | L | agent per destination |
| 4 | Unused Foundation components off by default | S | agent |
| 5 | `@import` to `@use` / `@forward` | L | agent |
| 6 | Native CSS replaces Sass machinery | M | agent per sub-step |
| 7 | Docs | S | main |

### 1. Hygiene

- Delete the stale tracked build outputs `scss/app.css`, `scss/app-backend.css` and their maps (1.8 MB, from June, never loaded).
- One package manager: bun (the VS Code task already uses it). Delete `yarn.lock` and `package-lock.json`, regenerate `bun.lock` (it still lists `gulp-sass` and `gulp-sourcemaps`), drop the `volta` block.
- `package.json`: own name, author, repository and description instead of the upstream Foundation ones; pin `motion-ui` (it is `latest`). Done.
- `.ignore` for search tools. Done.
- Stylelint does not run: `.stylelintrc.json` extends `stylelint-config-prettier`, which is not installed (and is obsolete since stylelint 15 dropped formatting rules). Remove the extend.
- Demo markup (`index.src.html`, `html-partials/`) still uses classes that step 3 removes (`.badge-space`): prune it after each move.
- Delete the upstream `.github/` issue and PR templates.
- `migrations/` is the one-time spacing-class migration. Delete it once no old class names remain in themes and plugins (grep the patterns in `spacing-rules.sed`).

### 2. Inventory

For every selector in `scss/custom-styles/`, `scss/custom-includes/` and `_custom-settings.scss` that names a Spaces, WordPress or plugin thing (candidates: `.space-card`, `.post-card`, `.activity-card`, `.user-card`, `.badge-space`, `.sms-*`, `.spaces-editor-*`, `.tagify`, `.ck-*`, `.global-search-*`, `.sf-user-image`, `.create-space-*`, `.superadmin-only`, `.is-superadmin`, `.notifications-item`, `.remove-user`, `.user-space-info`, `.mqa-display`, `.map_canvas`, `.info-chip-taxonomy`, `.highlight-on-load`, `.wp-block-*`, `.editor-styles-wrapper`, `.wp-admin`): file and line range, where it is used (grep `web/app/themes` and `web/app/plugins/spaces-*`, `kisd-*`, `th-*`, including `.hbs`/`.handlebars`, `.php`, `.js`, `.tsx`), whether wp-admin or `ark` renders it, and its destination from the table above. Result: the appendix below.

Generic patterns that only carry a Spaces name stay in the template under a generic name (with the old name kept as an alias until step 3 updates the markup). Decide per rule; the inventory flags candidates.

### 3. Move out

One agent per destination row, in this order: deleted (dead rules), plugin CSS, spaces-markup, ds-content.css, ds-main.css. Each run: remove from SCSS, add the compiled rule to the destination (folded into its existing section, matching its style: plain CSS, nesting allowed in ds-main.css only), rebuild, diff, screenshot.

After the last destination, split what remains of `_cards.scss`, `_forms-inputs.scss`, `_navigation-menus.scss` and `_components.scss` into one partial per component (see the AI rule above), compiled CSS byte-identical.

Done: 37 partials in `scss/components/` (`_card-item` and `_avatar-stack` moved there too); five interleaved rules moved next to their component (`.no-box-shadow`, `.input-group`, `input.clear`/`.help-text`/`.form-error`, `.button`, `.menu.icon-left > li > a`), each over rules that set none of its properties, so the CSS has the same rules and bytes in a different order.

A renamed class is applied across the whole Spaces project (themes and tracked plugins), not only where the moved rule happened to match; the old name is an alias in the template until no markup needs it, then it is dropped. Aliases: `.main-menu` (for `.app-header`), `.s-fg-a-c1-parent` (for `.brand-links`, still used by kisd-*, fridge, event-organiser and stored post content).

### 4. Unused Foundation components

No hits in themes or Spaces markup: off-canvas, top-bar, title-bar, drilldown-menu, media-object, float classes. Other projects use the template and `index.html` demos some of them, so make them opt-in flags in `_custom-foundation-includes.scss` (off by default, a comment naming the classes each flag drops), as already done for the xy-grid groups.

Done: `$include-*` flags at the top of `_custom-foundation-includes.scss`, all off; no hits in themes or plugins (`clearfix`/`float-center` hits come from WordPress, `ark` and mail CSS, and the float classes were never compiled). `css/app.css` 240578 bytes (-15849), `css/app-backend.css` 242887 (-16389).

### 5. `@import` to `@use` / `@forward`

After step 3, so there is less to migrate. `app-backend.scss` nests the component and style partials inside `.f`, and `@use` cannot appear inside a rule: wrap those partials' bodies in mixins and `@include` them under `.f`. `_settings.scss` and `_colors.scss` are implicit globals today; every partial has to `@use` them, and `!default` chains become `@use … with (…)`. One entry point at a time, compiled CSS byte-identical.

Done; `sass-migrator module` plus scripted fixes, no `@import` left (motion-ui is one `@use`, its own imports stay in node_modules). Style partials (`components/`, `custom-styles/`, `_custom-foundation-includes.scss`) print nothing on load: their CSS is `@mixin styles`, which `_custom-styles.scss` and both entries include, `app-backend.scss` inside `.f` (`meta.load-css()` was rejected: it turns `[data-whatinput] &` into `.f [data-whatinput] …`). Module loops were broken by moving members (`strip-unit` to util/math, `$-zf-flex-justify` to util/flex, `add-foundation-colors` into util/color, `$form-spacing` to forms/text, `grid-column()` to grid/size, `button-sizes` to `_s-button.scss`); Foundation's private `-zf-*` members are public, `$foundation-palette` comes from `_colors.scss` only, `_settings.scss` and `_custom-foundation-imports.scss` are gone. A consumer configures the partial that owns a knob before anything loads it, then loads the entry: `@use "…/custom-foundation-includes" with ($include-top-bar: true); @use "…/app";`. CSS same rules and bytes; the one difference is the selector order inside `.reveal,.reveal.tiny,.reveal.small,.reveal.large` (one rule, cross-module `@extend` of `%reveal-centered`).

### 6. Native CSS

Each sub-step on its own, each diffed:

- a. Palette via `light-dark()` and `color-scheme`, replacing the duplicated `prefers-color-scheme` / `[data-theme]` blocks in `_root-variables.scss`. The back-end build stays light: it must not set `color-scheme` on a host page's `:root`. Replace the auto switch's WordPress exclusion (`body:not(.editor-styles-wrapper):not(.wp-editor):not(.wp-admin)`) with a generic opt-out such as `[data-theme-auto="off"]`.
- b. Drop the `@supports` fallbacks for `color-mix()` and relative color syntax (`oklch(from …)`): both are Baseline. Resolves the README To Do on color-mix.
- c. The 61 Sass `mix()` calls to `color-mix(in srgb, $a <w>, $b)`, except where the result feeds another Sass color function.
- d. Headings: one `clamp()` per level replaces the three breakpoint blocks in `typography/_base.scss`. Resolves the To Do on text sizing.
- e. Border radius: one `--f-radius` token scale; resolves the To Do on radius.
- f. Autoprefixer: if `last 2 versions` makes it emit nothing, remove it and `browserslist`.
- g. Container queries for components that reflow by their own width (cards, chips, scroll-snap). Incremental, no deadline.
- Not planned: `@layer`. Putting Foundation in a layer would make every unlayered WordPress and plugin rule beat it, including in wp-admin; evaluate only if specificity fights become the main cost.

### 7. Docs

One README: what the template is, how to build, the two builds, tokens and theming, and a `## Notes` section for traps. Fold `VARIABLES.md`, `HELPER_CLASSES.md` and `DARK_THEME.md` in where they overlap, keep them as references where they do not. The Info Chips section describes a component: shorten it to the decisions (static vs clickable, ring shadow, `:where()`). Remove the To Do list once step 6 resolves it. Delete this plan when done.

## Appendix: inventory

Paths are relative to `scss/`. "Used in" searched `.php .hbs .handlebars .js .ts .tsx .vue .html` (and `.css` where noted) in `web/app/themes` and `plugins/{spaces-*,kisd-*,th-*}`, without `vendor/`, `node_modules/`, `build/`, `dist/`, compiled templates and tests. WordPress or library output (`post_class()`, `paginate_links()`, Gutenberg, CKEditor, Tagify) counts as used even without a literal hit.

Where the build is loaded: front end gets `app.css` (spaces-frame enqueues it). `app-backend.css` (scoped to `.f`) loads in `ark` (which renders the spaces-frame header and so the `main-menu` template inside `.f`), on the Customizer controls and on `nav-menus.php`. The spaces-markup React bundle is also enqueued in wp-admin.

### delete

Done; skipped rows: none.

| Lines | Selector | Used in | Backend/ark |
| --- | --- | --- | --- |
| custom-styles/_cards.scss:286-302 | `.wide`, `.wide .large`, `.wide .space-title` | none (no `wide` class in markup) | no |
| custom-styles/_cards.scss:596-626 | `.avatar-array`, `.avatar-item` | none | no |
| custom-styles/_cards.scss:645-647 | `.activity-card-new` | none (markup uses `.activity-card--new`, styled in sm-shared-styles.css) | no |
| custom-styles/_cards.scss:688-690 | `.post-card .activity-blog` | none | no |
| custom-styles/_cards.scss:702-705 | `.activity-card-footer` (half of the selector, `.post-card-footer` goes to ds-main) | none | no |
| custom-styles/_cards.scss:739-748 | `.additional-comments` | none | no |
| custom-styles/_cards.scss:750-760 | `.post-tags` | none | no |
| custom-styles/_cards.scss:762-784 | `.comment-reply-content`, `-text`, `-submit` | none (ds-main.js only binds WP's `.comment-reply-link`) | no |
| custom-styles/_cards.scss:786-789 | `.report-card .report-header`, `.page-section .page-header` | empty rule, compiles to nothing | no |
| custom-styles/_cards.scss:1108-1117 | `.activity-container`, `.textwidget .activity-container` | none (only `.featured-activity-container` exists) | no |
| custom-styles/_components.scss:11-24 | `.description-excerpt-checkbox` | none | no |
| custom-styles/_components.scss:277-293 | `.global-search-modal .v-center .sf-user-image` | none | no |
| custom-styles/_components.scss:297-301 | `.no-found` | none | no |
| custom-styles/_components.scss:384 | `.create-space-container` (selector only, `.card > .accordion` stays) | none | no |
| custom-styles/_forms-inputs.scss:18-29 | `.dropdown-pane[id^="user-"][id$="-dropdown"]`, `.remove-user`, `.change-role > a` | no element carries such an id; `.remove-user` none | no |
| custom-styles/_forms-inputs.scss:262-264 | `.user-space-info` | none | no |
| custom-styles/_forms-inputs.scss:885-961 | `.chips .input`, `.list-dropdown`, `.chips-list`, `.chips-item`, `.chips-button` | none (no `class="chips"`, no `chips-*` child classes) | no |
| custom-styles/_navigation-menus.scss:62-75 | `.reply-button` | none | no |
| custom-styles/_navigation-menus.scss:356-360 | `.main-menu .submenu .notifications-item` | none | no |
| custom-styles/_navigation-menus.scss:708, 734-767 | `.search-icon` | none | no |
| custom-styles/_general-base.scss:56-63 | `.map_canvas`, `.mqa-display` | none (Foundation upstream embed fix) | no |
| custom-includes/_s-badge-space.scss:1-109 (+ `_custom-foundation-imports.scss:37`, `_custom-foundation-includes.scss:41`) | `.badge-space`, `.badge-space.inline` | none (nor `#space-container-path`) | no |

### plugin

| Lines | Selector | Used in | Backend/ark |
| --- | --- | --- | --- |
| custom-styles/_animations-focus.scss:102-114 | `.spaces-editor-post-title`, `.spaces-editor-container .ck-editor__editable`, `.spaces-editor-dots-dropdown` | spaces-editor | no (front-end editor) |
| custom-styles/_animations-focus.scss:116-123 | `.spaces-editor-terms .tagify.tagify--focus` | spaces-editor (EditorPostTaxonomy.vue) | no |
| custom-styles/_cards.scss:811 | `.ck-editor__main` (alias in the `.prose-layout` group) | CKEditor output in spaces-editor; also styled in ds-main.css | no |
| custom-styles/_animations-focus.scss:167-186 | `.sms-single-toggle-size`, `.sms-widget`, `.sms-options`, `.sms-single-bottom-container`, `.sms-single-option` | none here: the Milestones plugin is not installed (`spaces-milestones-bridge/` is empty) | unknown |

Done (spaces-editor); `.sms-*` waits for the Milestones repo.

### spaces-markup

Done; general patterns stay as `.card > :is(.clipped, img, picture, video, figure):first-child` (top radius), `.avatar-stack` (`_avatar-stack.scss`) and `.card-item` (`_card-item.scss`); `.avatar-container` stays too (generic name, used by the stack). Card templates went to `spaces-markup/assets/css/cards.css` (new, front end for every visitor, not wp-admin), activity/global-search rules to `sm-shared-styles.css`, the main menu with `.search-container`, `.superadmin-only`, `#menu-state` and the burger states to `spaces-frame/css/spaces-frame.css`. The user card renders on the front end only; the global search and activity modals render in `ark` but are portaled outside `.f`, so they are unstyled there.

| Lines | Selector | Used in | Backend/ark |
| --- | --- | --- | --- |
| custom-styles/_cards.scss:237-284 | `.space-title` | space-card.handlebars, SpaceCard.tsx; ds-customizer.css, ds-header-backend.css; spaces-scoped-notify mail | yes (Customizer) |
| custom-styles/_cards.scss:1011-1037 | `.clipped.space-header` | space-card.handlebars, SpaceCard.tsx, defaultspace post cards | yes (Customizer) |
| custom-styles/_components.scss:7-9 | `.description-excerpt` | space-card.handlebars, Markup.php, kisd-course-selection | unknown |
| custom-styles/_animations-focus.scss:93-95 | `.space-card:has(:focus-visible)` | spaces-markup, defaultspace, child-home, child-member, kisd-course-selection | unknown |
| custom-styles/_cards.scss:304-474 | `.card-user` (+ `.user-card-header`, accordion states, `.avatar-container` inside) | user-card.handlebars, child-member (get_spaces_members.php, functions-profile.php) | unknown |
| custom-styles/_cards.scss:548-577 | `.user-name` | MemberCard.tsx, AddMemberSearch.tsx, child-member, spaces-editor-api.js | unknown |
| custom-styles/_cards.scss:490-546 | `.avatar-container` | Avatar.tsx, Shortcode_Avatar.php, user-card, ActivityCard, spaces-editor, defaultspace | yes (avatar menu in ark header) |
| custom-styles/_cards.scss:636-700 | `.post-card, .activity-card` (+ `.comment-avatar-list`, `.activity-description`, `.has-post-thumbnail`, `.user`, `.dropdown-pane`) | ActivityCard.tsx; post-card from defaultspace functions-markup-post.php | unknown (React) |
| custom-styles/_cards.scss:707-716 | `.main-menu .activity-card` | ActivityCard via ModalActivities | unknown |
| custom-styles/_components.scss:225-276, 294-295 | `.global-search-modal`, `.global-search-suggestion` | ModalGlobalSearch.tsx, search skeletons | unknown (React) |
| custom-styles/_navigation-menus.scss:826-829 | `.user.global-search-suggestion:hover` | ModalGlobalSearch.tsx | unknown |
| custom-styles/_navigation-menus.scss:104-212, 222-224, 226-313, 330-399, 831-833 | `.main-menu …`, `#main-menu-toggle-state`, `#menu-state`, `.navbar-icon`, `.menu-anchor`, `.menu-main-expand`, `.main-menu-burger` | main-menu.handlebars, Shortcodes.php, spaces-frame, spaces-chat, spaces-tour | yes (ark header) |
| custom-styles/_navigation-menus.scss:214-220 | `.superadmin-only`, `body.is-superadmin` | body class from spaces-markup.php; spaces-frame | yes (ark header) |
| custom-styles/_navigation-menus.scss:769-824 | `.search-container` | Shortcodes.php | unknown |
| custom-styles/_navigation-menus.scss:849-850, 858-859 | `#main-menu-toggle-state ~ nav .sandwich-icon`, `#menu-state ~ nav .sandwich-icon` | main-menu.handlebars | yes (ark header) |
| custom-styles/_animations-focus.scss:85-91 | `.menu-main-expand .create-space-button`, `.menu-main-expand .tabs-title a` | CreateSpaceModal.tsx, Create_Space.php, spaces-frame.css, spaces-tour | yes (ark header) |
| custom-styles/_forms-inputs.scss:258-260 | `.section_footer > .info-chips` | Markup.php card sections, ActivityCard, defaultspace, kisd-course-selection | unknown |
| custom-styles/_root-variables.scss:106-110 | `.info-chip-taxonomy .value` | spaces-markup, spaces-audience, th-spaces-customize, defaultspace | unknown |
| custom-styles/_animations-focus.scss:151-165 | `.masonry-item` | Markup.php (emits it), ds-main.js, child-member profile.js | no |

### ds-content

Done; `.user-generated` / `.editor-styles-wrapper`, `.post-excerpt > .fe-read-more` and `.wp-block-details::details-content` are in `ds-content.css` (flat). The create-space modal's category help now carries `.details` (CategoryField.tsx), which stays in the template, so it does not depend on ds-content.css. The never-matching `.is-style-defaultfigure` (a `&figure` typo) was dropped.

| Lines | Selector | Used in | Backend/ark |
| --- | --- | --- | --- |
| custom-styles/_cards.scss:857-923 | `.user-generated`, `.editor-styles-wrapper` (+ `.wp-block-image`, `.wp-block-group`, `.is-style-*`, `.post-content`) | user-generated: defaultspace, child themes, spaces-markup, kisd-*, spaces-tour; editor-styles-wrapper: Gutenberg | yes (block editor) |
| custom-styles/_cards.scss:810 | `.post-excerpt > .fe-read-more` (alias in the `.prose-layout` group) | defaultspace | no |
| custom-styles/_components.scss:516, 527 | `.wp-block-details::details-content` (`.details` half stays) | core block output; spaces-markup CategoryField.tsx (create-space modal) | yes (block editor) |

### ds-main

Done; to `ds-main.css`: `.post-card-anchor` (+ keyboard focus with `.edit-button + button`), the `.page-card, .post-card` heading scale, `.post-card-footer` (+ its `.info-chips`), `.card .tagify.tagify--focus`, `.pagination .page-numbers`, `.sidebar`, and the post-card leftovers of the `_cards.scss:636-700` Decision (avatar corners, `.dropdown-pane` width, `.has-post-thumbnail` corner, `.avatar-stack` max-width). The `.activity-card` avatar corner went to spaces-markup `sm-shared-styles.css` (activity cards have no `.dropdown-pane` or `.has-post-thumbnail`, so those halves were dropped). Profile rows (`.card-user .expand-button`, `.profile .accordion-item`, `.user-email`, `.accordion … .expand-button`, `.clipped .add-new`, `.card .edit-profile`, `.grid-container.space`) to `defaultspace-child-member/style.css` per the Decision.

| Lines | Selector | Used in | Backend/ark |
| --- | --- | --- | --- |
| custom-styles/_cards.scss:97-99 | `.post-card-anchor` | defaultspace functions-markup-post.php, ds-main.js; kisd-course-selection | no |
| custom-styles/_cards.scss:631-634 | `.page-card`, `.post-card` (header-list) | defaultspace content-page.php, swap-menu-hooks.php | no |
| custom-styles/_cards.scss:702-705 | `.post-card-footer` | defaultspace | no |
| custom-styles/_forms-inputs.scss:97-99 | `.post-card-footer .info-chips:last-child` | defaultspace | no |
| custom-styles/_animations-focus.scss:125-133 | `.card .post-card-anchor`, `.card .edit-button + button` (`.card .card-divider > a` stays) | defaultspace | no |
| custom-styles/_animations-focus.scss:143-149 | `.card .tagify.tagify--focus` | Tagify enqueued by defaultspace; th-spaces-customize | no |
| custom-styles/_components.scss:394-425 | `.pagination .page-numbers` | defaultspace ds_paginate_links (WP class); ark uses `.pagination` only | no |
| custom-styles/_general-base.scss:136-138 | `.sidebar` | defaultspace and many widget plugins | no |
| custom-styles/_general-base.scss:114-116 | `.grid-container.space` | child-member page-members.php | no |
| custom-styles/_cards.scss:376-390, 476-488 | `.card-user .expand-button`, `.profile .accordion-item`, `.user-email` | child-member functions-profile.php | no |
| custom-styles/_components.scss:350-381 | `.accordion .accordion-item .expand-button` | child-member functions-profile.php | no |
| custom-styles/_cards.scss:1078-1093 | `.clipped .add-new` | child-member | no |
| custom-styles/_animations-focus.scss:135-141 | `.card .edit-profile` | child-member | no |

### ds-header-backend

None found: no rule in the scanned files is wp-admin glue only. The one wp-admin exclusion sits inside the dark-theme switch (see stay-generic).

### stay-generic

Done; `$user-card-sizes` / `$user-card-default-size` / `--user-card-*` are `$avatar-sizes` / `$avatar-default-size` / `--f-avatar-*` (no alias: the one consumer, spaces-frame.css, was updated). `.s-fg-a-c1-parent` is `.brand-links`, the old class kept as an alias for kisd-*, fridge, event-organiser-scheduler-widget and stored post content (child-entry's login text); themes and spaces-* use the new class. The `_root-variables.scss` WP exclusion waits for step 6a. The other rows already have generic names.

| Lines | Selector | Used in | Backend/ark |
| --- | --- | --- | --- |
| _custom-settings.scss:45-53, custom-styles/_root-tokens.scss:46-48 | `$user-card-sizes`, `$user-card-default-size`, `--user-card-*` (propose `$avatar-sizes`, `--f-avatar-<size>`) | template-wide: avatar, card-section, user-name, `.main-menu --header-height` | yes |
| custom-styles/_cards.scss:579-594 | `.avatar` and size modifiers (name already generic) | many; WP `get_avatar()` also emits `img.avatar` | yes |
| custom-styles/_cards.scss:809-855 | `.prose-layout` (with `.alignfull`, `.alignwide`) | defaultspace, child-member, spaces-markup | unknown |
| custom-styles/_cards.scss:224-235 | `.page-title`, `.page-content` (already generic) | ark (20 templates), child-member, spaces-markup page-section | yes (ark) |
| custom-styles/_typography.scss:74-103 | `.s-fg-a-c1-parent a` (propose `.brand-links`) | defaultspace, child themes, spaces-markup, kisd-*, spaces-scoped-notify | unknown |
| custom-styles/_root-variables.scss:21-27 | `body:not(.editor-styles-wrapper):not(.wp-editor):not(.wp-admin)` in the auto dark switch (propose a generic opt-out such as `[data-theme-auto="off"]`) | WP body classes | yes (wp-admin) |
| custom-styles/_root-variables.scss:50-104 | `:root[themed][style*="--f-color-theme"]` | `themed` set by defaultspace, spaces-color-theming, spaces-core | no |
| custom-styles/_root-variables.scss:112-148 | `.highlight-on-load` (name already generic) | defaultspace, child-member | no |
| custom-styles/_navigation-menus.scss:707-733, 835-893 | `.sandwich-icon`, `.flat-arrow-down-icon` (minus the menu-state lines above) | main-menu.handlebars, Shortcodes.php, child-entry | yes (ark header) |

### Decisions

- `.sms-*`: move to the Milestones plugin's CSS (other instances use it).
- `.main-menu` and its satellites: to `spaces-frame/css/spaces-frame.css`, which spaces-frame loads wherever it prints the header, `ark` included.
  Done; the general header came back as `.app-header` (`components/_app-header.scss`, alias `.main-menu`; the main-menu template and `_main-nav.html` carry both classes), so the demo is styled again. spaces-frame.css keeps the burger open state, `.superadmin-only`, the space cards' `.card-anchor`, the search container and create-space button, plus `.main-menu hr` and `.accordion-menu > .navbar-icon`, which in `ark` must keep losing to `.f` rules (see its README).
- Profile-only rules: to `defaultspace-child-member/style.css`.
- `_cards.scss:636-700`: extract the general patterns first, then split the rest. General rules that stay in the template: media as a card's first child clips to the card's top radius (`.card > :first-child`, no class needed); `.avatar-stack` (overlapping avatars, ring in the card color, `--avatar-overlap`) replacing `.comment-avatar-list`; a list separator for consecutive items in a card. Markup in defaultspace and spaces-markup gets the new class where needed (old class kept as alias until then). Leftovers: `.activity-description` to spaces-markup, the `.dropdown-pane` width and `.has-post-thumbnail` avatar corner to ds-main.css. Apply the same question to every move row: if the rule is a general pattern wearing a Spaces name, it becomes a framework rule instead of moving.

### Share of css/app.css

Measured on the build before step 3: leaf rules naming one of the classes above made up about 13.5% of `css/app.css` (39 kB of 287 kB); by destination delete 2.4%, plugin 0.9%, spaces-markup 6.5%, ds-content 2.3%, ds-main 2.3%.

After step 3: `css/app.css` 256427 bytes (from 286803, -10.6%), `css/app-backend.css` 259276 (from 290860, -10.9%). Still in the template: `.sms-*` (waits for the Milestones repo) and the `.s-fg-a-c1-parent` alias.
