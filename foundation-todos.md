# foundation-sites-template: work plan

Repo: `web/app/plugins/spaces-markup/vendor/dol-lab/foundation-sites-template` (its own git repo, `origin` = `dol-lab/foundation-sites-template`). Consumer: `spaces-markup` (composer `dev-master`, lock pinned to `50c5115`).

## Process (read this first, every agent)

One agent per phase. The user starts the next agent when the current one has handed over.

1. Read only: this file, `README.md` (`## Notes`), and the files listed under your phase. Do not read `index.html`, `llms.txt`, `css/*.css(.map)` or `node_modules/`. `_main-nav.html` and `_space-sidebar.html`: grep, never read whole.
2. Work through your phase top to bottom. Items are grouped so each phase touches one set of files.
3. After an edit: `bun run check <section-id|state…>` (builds, lints, shoots; prints only failures and changed shots with their changed region). Lint passes on the whole tree; keep it that way.
4. Ask before you look: `bun run probe '<selector>' <property…>` answers "which rule sets this" with the SCSS line; `bun run outline <partial>` replaces reading a large partial. Open a `.diff.png` crop only if the text does not answer the question, a full shot only if the crop does not. Open menus are states in `shots.config.js`; add one rather than a scratch Playwright script. Consumer pages in spaces-kisd: `wpb glance` (spaces-kisd `docs/dev-environment.md`). Verifying a consumer change: before the edit, `wpb glance shot <url> -s <sel> [-d "<clicks>"]` (and `text` for labels and names); after it, the same command. Open an image only if it reports a change. Hidden UI (tabs, folds) needs its clicks in `-d`, and member-only UI needs `--user <member>`.
5. Hand over: tick items (`[x]`), add at most 5 lines under `Handover` of your phase (what changed, what is unverified, traps), move new open questions to `## Open questions`. Fold lasting knowledge into `README.md` `## Notes` (or the consumer's README), not here.
6. Print a one-line commit message (`type(foundation-sites-template): …`). In each repo you touched: stage your files and put the message in VS Code's Source Control box with `vscm` (both per spaces-kisd `AGENTS.md`). Never commit. Stop.

If a phase turns out larger than one context, split it here and hand over the rest.

## Phases

### Phase 6c: Cleanup and reduced motion

- [x] Respect reduced motion: transitions in the library (carets, `.details*` open animation, `.tabs.line`, `highlight-on-load`, …) and Foundation's jQuery slides play under `prefers-reduced-motion: reduce`; only `_tabs.scss` and `_avatar.scss` honour it. One global rule rather than one per component; then `finishAnimations()` in `lib/browser.js` may be dropped (shots already run with reduced motion).
- [x] General cleanup the user asked for ("really clean"): refactor consumers where a library rule is worked around. Each refactor goes with its consumer change in the same deploy. Known cases:
  - [x] spaces-markup `avatar-menu.css` duplicates the library's `.avatar-trigger` rules; check whether its `.accordion-menu .is-accordion-submenu` override still matches now that the main menu prints `.details-menu`.
  - [x] The avatar corner: spaces-markup `sm-shared-styles.css` and defaultspace `ds-main.css` (`.post-card .avatar-container`) set the `--f-radius` default the library already sets.
  - [x] defaultspace `.taxonomy-breadcrumb` draws its own `>` on info chips instead of using `.breadcrumbs` (dead rule removed; the separator itself stays, see Q11).
  - Moved to Phase 6d: the nested `<label>` in checkbox, radio and switch.
- [ ] Optional, native replacements (not started): reveal → `<dialog>` (spaces-core `Avatar.php` + `js/cropper/init-cropper.js`, kisd-course-selection `class-course-space-ui.php` + `course-space.js`, defaultspace event-organiser, `functions-delete-reason.php`, `ds-main.js` `zf.reveal`); dropdown → `popover` (spaces-editor `SpacesEditorPost.vue`, the did-you-know widget's `.dropdown-pane`).
- Handover:
  - Reduced motion: one global rule in `_animations-focus.scss` (0.01ms, `.spinner` exempt) and `$.fx.off` in `js/app.js`; the per-component rules in `_tabs.scss`/`_avatar.scss` are gone. `finishAnimations()` dropped; `applyState()` keeps its 100ms wait (Foundation's dropdown hover timer, not motion) plus one frame. Six `check` runs without a changed shot.
  - Fixed a pre-existing Prettier failure in `js/app.js` (nested ternary indent).
  - Not verified in Spaces (consumer pages): Foundation reveal/dropdown open and close under reduced motion (should still fire their end events).
  - Item 2: `avatar-menu.css` deleted (every rule was the library's; its enqueue, the browser fixture and `run.mjs` no longer load it); only loss is the shrink on hovering the container outside the trigger. `.activity-card` sets `--f-avatar-radius` instead of styling `.clipped` (it overrode the card-corner rule: the card has no radius); `.post-card`'s copy of the default is gone. Dead `.taxonomy-breadcrumb .fa-angle-right` removed. spaces-markup PHPUnit, defaultspace PHPUnit, spaces-markup browser tests (51) pass; activity card checked by shot; post-card avatar not shot (glance timed out on `/public/`), reasoned from specificity only.

### Phase 6d: Nested `<label>` in checkbox, radio, switch

- [x] Checkbox, radio and switch nest a `<label>` inside `label.label-wrapper` (invalid HTML) in the demo and in spaces-core, spaces-feature-toggles, defaultspace star toggle, spaces-invitation, scoped-notify. The drawn control could be a `<span>`, but `_s-switch.scss` keys its texts on `input:checked + label` and `_checkbox.scss` on `.label-wrapper > label`: change the library first (accept both), then each consumer, then drop the `label` form in the release after deploy (Phase 9 step 4). Check which consumers are their own repos.
- Handover:
  - Library: `_s-switch.scss` keys its texts on `input:checked + .switch-paddle`, `_checkbox.scss` on `.label-wrapper > .checkbox-label/.radio-label`; nothing keys on the `label` element now, so the standalone `<label for>` form stays valid and there is nothing to drop in Phase 9 step 4. Demo (`_content-forms.html`, `_space-sidebar.html`) uses `<span aria-hidden>` inside wrappers. `check`: only the forms prose changed.
  - Consumers (inside a `.label-wrapper` only): defaultspace `functions-starsystem.php`, spaces-feature-toggles, spaces-core `Blogs_Privacy.php` (dead `$hidden` removed), spaces-invitation `views/settings_option.html` (not in the list above), scoped-notify `Notification_Ui.php` (own repo: push upstream). spaces-chat's `label-wrapper` holds a native checkbox, no drawn control. Accessible names were doubled before ("Deaktiviert Deaktiviert"), now single.
  - Verified by glance (`/blended/` settings tab): invitation radios, feature switches, scoped-notify radios (as a member). Not seen: `Blogs_Privacy` radios and the star toggle (no page found that renders them); same markup pattern, spaces-core and defaultspace PHPUnit pass.
  - Deploy order matters slightly: with the old library CSS, a span `.radio-label` in a wrapper loses its 0.5rem left padding (was `.label-wrapper > label`).

### Phase 7: `.clipped-title` in spaces-markup

- [x] `.space-title` in spaces-markup: adopt `.clipped-title` (the library carries Spaces' card look: `.card.space-card > a.card-anchor > .clipped.space-header > .space-title + img.header-image`). Touches the handlebars template, its compiled PHP and `src/blocks/spaces-overview/components/SpaceCard.tsx`, then `npm run build` in spaces-markup; afterwards drop the `.space-title`/`.space-header` CSS from spaces-markup. Read `spaces-markup/readme.md` and `DEVELOPMENT.md` first. Run spaces-markup PHPUnit and `composer lint` on touched PHP.
- Handover:
  - Frame is `.clipped.feature-image.space-header` (`space-header` kept as hook: view transition, link preview, Customizer, skeleton), title `.clipped-title`; the large header needs `header_class: large` (defaultspace `ds_get_space_blog_header()`, child-home sidebar). `get_space_tile_and_privacy()` prints icon + name as siblings, privacy class moved to the icon (defaultspace `ds-main.css` rule follows). cards.css lost all title/header rules, incl. the dead `.activity-card > .space-header`.
  - Customizer partial now `.current .clipped-title a`, which holds only the name (before, a refresh wiped the icon).
  - Verified: `/blended/` header unchanged at 1280/390, profile Space cards by shot. Not seen: React `SpaceCard` (spaces-overview block, no page found), `ark`'s `.f` build, the search skeleton. Lost: the old 2px padding around the clamped large title.
  - Unrelated, left: defaultspace `ds-header-backend.css` styles `.space-title`/`.clipped.space-header` in wp-admin, but nothing renders a Space card there any more.

### Phase 8: Docs source and llms.txt (DRY)

- [x] Prose lives in `.md` files rendered into the page (`@@include` already renders `.md`), so an agent reads the `.md` and not the HTML. Merge `VARIABLES.md`, `HELPER_CLASSES.md`, `DARK_THEME.md` into that scheme instead of duplicating them in partials.
- [x] `llms.txt` stays a build output generated from the same sources (no hand-written second copy). Decide whether it should link to the `.md` files instead of inlining them (size: 40 KB now).
- Handover:
  - One `docs/<id>.md` per section (user's choice), examples as ` ```html example ` fences; the build wraps the section card, makes the TOC from `<!-- group: … -->` comments in `index.src.html`, and writes `llms.txt` as an index of links to `docs/*.md` with intros (about 6 KB). Format in README `## The demo page`. The three reference docs are `docs/variables.md`, `helper-classes.md`, `dark-theme.md`; Pages now publishes `docs/`.
  - Page changes: the controls card is its own cell (`_demo-controls.html`) before `#start`, its script moved into `_demo.html`; the captures are `section#space-markup` after `docs/space.md`, and the TOC links "A Space" instead of Post cards/Sidebar; the avatar sizes example lost its `--f-avatar-radius: 50%` (was on the stripped `.demo-row`); the typography example carries its own `.user-generated.brand-links`; prose links are brand-colored (demo CSS); reference docs are no longer `.user-generated`.
  - Verified by `check` and crops (buttons, typography, colors, start, variables); the second run is clean. Not looked at: every 375px crop.

### Phase 8b: Clean up the HTML partials

- [x] What is left in `html-partials/` is the page frame and the captures (`_space-post.html`, `_space-sidebar.html`, `_main-nav.html`). Dedupe repeated markup where it makes sense, remove dead wrappers and leftover attributes from the captures. Not where it would hide markup a reader is meant to see, and keep captures matching what Spaces prints.
- Handover:
  - `_space-sidebar.html` was captured after Foundation's init: dropped what Foundation adds itself (`role`, `aria-selected/controls/expanded/labelledby/multiselectable`, panel `aria-hidden`, `tabindex`, generated ids and `data-*` values, `is-accordion-submenu*`/`submenu` classes, `data-n`) and trailing spaces in class lists. Kept everything Spaces prints, incl. its unclassed widget `<div>`, `fa fa-fa`, `data-featherlight`, WP classes in the post card. `_main-nav.html`, `_space-post.html` and the frame left as they were: no dead wrappers found; the repeated Space cards stay spelled out (no include parameters, and a template would hide the markup).
  - Kept `style="display: none;"` on the closed Media accordion: `.card-divider { display: flex }` beats `.accordion-content { display: none }` on order, so without it the item renders open (Q12).
  - `check space-markup`: no change besides `highlight-on-load` timing. Other changed shots in a full `check` (variables, dark-theme, header) are Phase 8's brand-colored prose links, not this phase. Not looked at: the open settings tab and privacy submenu (no shot state).

### Q11: `.breadcrumbs.info-chips`

- [x] Library: `ul.breadcrumbs.info-chips` (chip per `<li>`, `·` separator on the item, row sets the chip size, the breadcrumbs link color skips `.info-chip`); demo example in `docs/breadcrumbs.md`, note in `README.md`.
- [x] Consumers (all in spaces-kisd, none an own repo): defaultspace prints `<ul class="breadcrumbs info-chips small">` with `<li>` chips, its `.taxonomy-breadcrumb` CSS and the `has_child` / `has-child` flag are gone; th-spaces-customize keys on `.breadcrumbs.info-chips.communities`; spaces-audience (sibling audiences, not a path) uses a plain `div.info-chips.small`.

Handover:
- Verified: library check/probe (chip color, size, no list margin), defaultspace, spaces-audience and th-spaces-customize PHPUnit green.
- Unverified: a live taxonomy archive and the audience note in Spaces (no `wpb glance` run); the audience row gains `small` (was unsized).
- Library not staged (its index already held `html-partials/_space-sidebar.html`); spaces-kisd files staged.

### Phase 9: Publish and deploy

Order matters: the library goes first, consumers follow, nothing is removed before consumers stop using it. The demo is published by the Pages workflow (not a committed `index.html`). spaces-markup keeps `dev-master`; its `vendor/` reaches production through `spaces-markup/composer.json`.

- removes aliases and the Foundation accordion code no consumer uses any more (flags in `_custom-foundation-includes.scss`). Still in use: the accordion plugin by child-member `page-members.php` (`data-responsive-accordion-tabs`), the accordion menu by spaces-markup `main-menu.compiled.php` and spaces-frame (`data-responsive-menu` at small widths). -- refactor consumers.

- [x] GitHub Actions: `actions/deploy-pages@v4` and `actions/upload-artifact` target the deprecated Node.js 20 (forced onto Node.js 24); bump them.

### Phase 10: Tabs and accordion demos

- [x] Tabs: the title-only examples (styles, sizes, long titles, label is active, image) had no `data-tabs`, so Foundation never initialised them and a click only jumped to `#`.
- [x] Accordion menu / accordion: both stay, Spaces still prints them; prose points to `.details` / `.details-menu` for anything new.
- Handover:
  - `docs/tabs.md`: each title-only `.tabs` got `data-tabs`, an id and per-title hrefs (`#demo-tab-<name>-<n>`, no panels; Foundation tolerates the missing targets). Checked by a scratch Playwright click on every bar: all switch, no console errors; first example's panels switch too.
  - `docs/accordion.md` names its one Spaces use (`data-responsive-accordion-tabs`, child-member `page-members.php`); `docs/menus.md` accordion menu: "Anywhere else use the details menu above" (used by spaces-markup `main-menu.compiled.php` and spaces-frame). Drop both in Phase 9 once consumers move.
  - `check accordion menus tabs`: only the prose changed in the shots.
  - Not fixed: a plain `.tabs` active title is invisible in the demo (Q14).

### Phase 11: Buttons and focus in `.details-menu`

- [x] Buttons look dated: regular weight, a label pinned high by a `line-height` hack, a floated dropdown arrow, and a `.clear` button with no hover surface. Now `inline-flex` (label centered at `min-height`, `0.5em` icon gap), weight 500, arrow as a flex item (`.arrow-only` rule dropped), `.clear` tints on hover/focus, `border-color` transitions.
- [x] Keyboard focus in nested `.details-menu`: inset 2px outline in `--f-color-text-0` on summaries and links; a `.details-link` summary rings its caret instead.
- Handover:
  - Why the focus was hard to see: the global ring is a `Highlight` box-shadow, clipped by the fold's `overflow: hidden` and replaced by an open summary's `inset 0 -1px` border (Q15).
  - Verified: `check` (only sub-pixel shifts outside `#buttons`), focus by a scratch Playwright script on the demo's details menu (all four targets show the ring). Hover states not shot.
  - Unverified in Spaces: `inline-flex` on every `.button` (consumer markup with a space or margin between icon and label gets the gap on top; `display: block` overrides now lose centering only).

### Phase 12: Demo page frame, favicon, controls

- [x] `.demo-example` / `.demo-markup` frame: could not reproduce a gap (all 42 examples: markup flush under the preview, inside the clipped frame, light and dark, 375/1280); the frame border was at 7% and nearly invisible, now `--f-color-border-1` (Q16).
- [x] Favicon in the brand color: `paintFavicon()` in `_demo.html`.
- [x] Page controls: one toolbar (label row with the switch or Reset over a swatch row), round color swatches with their hex in an `<output>`, larger thumbs ringed in brand, hairlines between groups from 60em; image row on its own line below.
- Handover:
  - Favicon checked by Playwright (initial brand, picked color, dark mode; no page errors); the fill can be `oklab(…)` (resolved color), fine in Chromium/Firefox, not tested in Safari.
  - Controls checked by `check demo-controls` at 375/1280; not seen between 960 and 1100px (three columns in a narrower main column), nor the `::-moz-color-swatch` look in Firefox.

### Phase 13: Global focus outline (Q15), modal design

- [x] Q15: one `:focus-visible` rule (`_animations-focus.scss`): inset 2px outline, `$global-focus` / `$global-focus-color` (text color). Dropped the `a11y-focus(-inset)` mixins, the tabs and card-divider rings, the `.details-menu` copy, and the `outline: none` on `a:focus` and `.button:focus` (they beat the global rule). Checkbox, radio, switch, radio tabs use the token.
- [x] Modal: `--f-drop-shadow-large`, `--f-color-border-0` hairline, padding 1.5rem, close button level with a leading heading (which keeps clear of it). Shot state `modal-open`.
- Handover:
  - Verified: `check` (no change outside the modal), a scratch Playwright Tab walk over the demo (every focusable gets the outline; text inputs, `select`, `textarea` keep their own border/shadow focus).
  - Unverified: modal in dark mode and at 375 beyond the shot (full screen there), the `.sms-*` (Meilensteine) rules now outline instead of ring, and Spaces pages (any consumer `:focus { outline: none }` with a class now hides the ring there, Q17).

### Pages: cache-busting and action bumps

- [x] Demo (Pages): browsers must get a new `index.html` when there is one, not a cached copy (check what GitHub Pages sends, cache-bust `css/`/`js/` URLs per build).
- [x] Phase 9 item "GitHub Actions: bump them" (see there).
- Handover:
  - `build-html.js` `versionAssets()` appends `?v=<sha1 of the file, 8 chars>` to local `.css`/`.js` URLs in `<link>`/`<script>` tags (escaped code examples untouched); per content rather than per build, so unchanged files stay cached. `index.html` itself cannot be forced: Pages sends `max-age=600` (from docs and common knowledge, not fetched), README note.
  - `pages.yml`: `upload-pages-artifact@v5` (wraps `upload-artifact@v7`) and `deploy-pages@v5` (node24), versions read from the actions' release API; `checkout@v5` and `setup-bun@v2` already run on node24. Unverified: a real Pages run.
  - `check` clean (68 unchanged), `probe` still maps rules to SCSS with the query string.

### spaces-markup `cards.css`

- [x] Each rule checked against the library; nothing moved into it (what is left is the user card template, which spaces-markup's readme keeps local; Q18).
- Handover:
  - Dropped: `.description-excerpt` (printed nowhere; also its copy in `sm-shared-styles.css`), the old `Highlight` focus rings on `.space-card` / `.masonry-item` and the `!important` card-anchor shadow reset (the library's `:focus-visible` outline applies), the dead `.spinner-container` in a user card's avatar, `[type=checkbox] + label` (library sets it).
  - User card: 12 per-size `min-height`/checkbox rules replaced by stretching the header row (avatar `align-self: flex-start`) and an `inset: 0` checkbox at 100%, so it follows the library's avatar sizes.
  - Verified by glance before/after (no change): `/blended/` members tab with a hovered checkbox (1280/390), `/cognitiveaerobics/` members list (1280; 390 timed out), a profile card and its report masonry; computed header height = avatar height. spaces-markup PHPUnit and browser tests (51) pass.
  - Unverified: the handlebars `user-card` (team, no page found) and a user card whose header wraps below the avatar (it no longer keeps the avatar's height); Space-card focus outline not seen (Q19).

### Fix inconsistencies

- [x] Docs that no longer matched the code, pill radii as tokens, the last box-shadow focus ring, one setting name.
- Handover:
  - `docs/helper-classes.md` rewritten from the built CSS: about 30 listed classes did not exist (`.justify-*`, `.border-{side}`, `.radius-*`, `.shadow-small/large`, `.hover-lift`, `.bg-*`, `.color-*`, `medium-p-4`: prototype breakpoints are off). Every class it names now matches a rule in `css/app.css`.
  - `docs/variables.md` and README: `--f-radius-full` is a pill, not "follows `--f-radius`"; `--f-color-shadow`, `--f-color-brand-contrast` named; dead `#1-spacing` anchor; em-dashes. README: `bun run lint` also runs Prettier, and lint errors / `scss/*.css` To Do items were already done.
  - `.info-chip.round` (2rem), `.switch-with-labels` paddle (20px), `.radio` dot (1em) use `--f-radius-full` (all were already pills); `.details-link` caret focus is the global outline, not a 2px box-shadow; `$info-border-shadow` is `$info-chip-ring-shadow`.
  - `check`: only the two doc sections changed, plus pixel noise (2 px in the avatar menu switch). Unverified: the caret outline by keyboard (no focus state in `shots.config.js`).

## Open questions (for the user)

- Q9: A post's `themed` + `--f-color-theme` does not visibly tint the card (it did not before Phase 2 either). Expected, or a gap? -- expected
- Q10: In `_checkbox.scss`, `.checkbox-label.small .checkbox-label` never matches (meant `.checkbox.small`); fixing it thins small checkbox rings in Spaces. Fix or drop the rule?
- Q11: defaultspace `.taxonomy-breadcrumb .has-child::after` draws a `>` absolutely positioned outside the chip (the chip clips, so the separator cannot be a normal `::after`). Library `.breadcrumbs` needs `<li>` items, uses `·`, and its `a` color/underline would hit the chips. Options: wrap chips in `<li>` and teach the library `.breadcrumbs.info-chips` (touches defaultspace, its test, spaces-audience, th-spaces-customize), or leave it. Which? -- teach library (done, see Phases: Q11)

- Q12: The sidebar capture no longer matches Spaces: defaultspace now prints the settings menu via `ds_render_accordion()` and the privacy list as `ul.change-privacy-list.p-3.pt-0`, and nothing in Spaces prints a `.card.accordion` widget any more. Recapture the sidebar from a live Space? Separately: should `.accordion-content` win over `.card-divider`'s `display: flex` while closed (library fix), so the inline `display: none` can go? -- yes. kiss.
- Q13: The term breadcrumb's separator is now the library's `·` (was an angle-right `>`), which reads less like a hierarchy. Keep `·`, or give `.breadcrumbs.info-chips` (or all breadcrumbs) a chevron?
- Q14: A plain `.tabs` (no `.line`/`.bar`) marks the active title only with `--f-color-bg-2` and `text-0` (vs `text-1`). On the demo's preview (also `bg-2`) the active tab is invisible (sizes, long titles, label is active). Give plain tabs a stronger active state in the library (e.g. the `.line` underline or a ring), or change only the demo surface?
- Q15: The global keyboard ring (`$global-focus`, `0 0 0 2px Highlight` as a box-shadow) is faint on most systems and clipped by any `overflow: hidden` parent. Phase 11 fixed it inside `.details-menu` only (inset text-color outline). Use the same outline everywhere? -- probably yes (outline everywhere) (done, see Phases: Phase 13)
- Q16: The `.demo-example` / `.demo-markup` regression did not reproduce in Chromium (code bar flush under the stage, inside one frame). I only made the frame border stronger (`border-1`). If it still looks apart: which browser or section, or a screenshot?
- Q17: spaces-editor `src/lib/spaces-editor-post.scss` (~line 240) still draws the old `inset 0 0 0 2px Highlight` ring on `[data-whatintent="keyboard"] …:focus` for the post title, editor and dots menu. Switch it to the library's outline (`outline: 2px solid var(--f-color-text-0); outline-offset: -2px`), or drop it so the global rule applies? Not touched (outside this repo).

- Q18: spaces-markup's user card (avatar that turns into a selection checkbox on hover, name sizes per size class) stays in `cards.css`, as its readme keeps template rules local. Make it a library component with a demo section instead?
- Q19: The library's inset `:focus-visible` outline on a Space card's `.card-anchor` may be painted under its positioned `.clipped` image (the old ring sat on the card). Computed outline is set; not seen in a shot (the programmatic focus showed no ring before or after). Check with a real Tab in Spaces, or give `.card:has(> .card-anchor:focus-visible)` the outline in the library?

- Q20: Left as is (debatable or visible): the deprecated accordion menu still draws `--f-color-neutral-400/500` shadows instead of the border roles; `.radio-tabs` has a fixed `1em` radius beside `--f-radius`; `.sandwich-icon` keeps `20px` (box not measurable in the demo); `.align-flex-start/end` set `justify-content` while `.flex-align-center` sets `align-items`; `.card.static` (spaces-markup `menu.js`, demo menus/tabs) has no rule in the library. Align any of these?

## Todo
