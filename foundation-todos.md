# foundation-sites-template: work plan

Repo: `web/app/plugins/spaces-markup/vendor/dol-lab/foundation-sites-template` (its own git repo, `origin` = `dol-lab/foundation-sites-template`). Consumer: `spaces-markup` (composer `dev-master`, lock pinned to `50c5115`).

## Process (read this first, every agent)

One agent per phase. The user starts the next agent when the current one has handed over.

1. Read only: this file, `README.md` (`## Notes`), and the files listed under your phase. Do not read `index.html`, `llms.txt`, `css/*.css(.map)` or `node_modules/`. `_main-nav.html` and `_space-sidebar.html`: grep, never read whole.
2. Work through your phase top to bottom. Items are grouped so each phase touches one set of files.
3. After an edit: `bun run check <section-id|state…>` (builds, lints, shoots; prints only failures and changed shots with their changed region). Lint passes on the whole tree; keep it that way.
4. Ask before you look: `bun run probe '<selector>' <property…>` answers "which rule sets this" with the SCSS line; `bun run outline <partial>` replaces reading a large partial. Open a `.diff.png` crop only if the text does not answer the question, a full shot only if the crop does not. Open menus are states in `shots.config.js`; add one rather than a scratch Playwright script. Consumer pages in spaces-kisd: `wpb glance` (spaces-kisd `docs/dev-environment.md`).
5. Hand over: tick items (`[x]`), add at most 5 lines under `Handover` of your phase (what changed, what is unverified, traps), move new open questions to `## Open questions`. Fold lasting knowledge into `README.md` `## Notes` (or the consumer's README), not here.
6. Print a one-line commit message (`type(foundation-sites-template): …`). Do not commit, do not stage (uncommitted work from earlier agents is fine). Stop.

If a phase turns out larger than one context, split it here and hand over the rest.

## Phases

### Phase 6c: Cleanup and reduced motion

- [x] Respect reduced motion: transitions in the library (carets, `.details*` open animation, `.tabs.line`, `highlight-on-load`, …) and Foundation's jQuery slides play under `prefers-reduced-motion: reduce`; only `_tabs.scss` and `_avatar.scss` honour it. One global rule rather than one per component; then `finishAnimations()` in `lib/browser.js` may be dropped (shots already run with reduced motion).
- [ ] General cleanup the user asked for ("really clean"): refactor consumers where a library rule is worked around. Each refactor goes with its consumer change in the same deploy. Known cases:
  - spaces-markup `avatar-menu.css` duplicates the library's `.avatar-trigger` rules; check whether its `.accordion-menu .is-accordion-submenu` override still matches now that the main menu prints `.details-menu`.
  - The avatar corner: spaces-markup `sm-shared-styles.css` and defaultspace `ds-main.css` (`.post-card .avatar-container`) set the `--f-radius` default the library already sets.
  - defaultspace `.taxonomy-breadcrumb` draws its own `>` on info chips instead of using `.breadcrumbs`.
  - Checkbox, radio and switch nest a `<label>` inside `label.label-wrapper` (invalid HTML) in the demo and in spaces-core, spaces-feature-toggles, defaultspace star toggle, spaces-invitation, scoped-notify. The drawn control could be a `<span>`, but `_s-switch.scss` keys its texts on `input:checked + label`.
- [ ] Optional, native replacements (not started): reveal → `<dialog>` (spaces-core `Avatar.php` + `js/cropper/init-cropper.js`, kisd-course-selection `class-course-space-ui.php` + `course-space.js`, defaultspace event-organiser, `functions-delete-reason.php`, `ds-main.js` `zf.reveal`); dropdown → `popover` (spaces-editor `SpacesEditorPost.vue`, the did-you-know widget's `.dropdown-pane`).
- Handover:
  - Reduced motion: one global rule in `_animations-focus.scss` (0.01ms, `.spinner` exempt) and `$.fx.off` in `js/app.js`; the per-component rules in `_tabs.scss`/`_avatar.scss` are gone. `finishAnimations()` dropped; `applyState()` keeps its 100ms wait (Foundation's dropdown hover timer, not motion) plus one frame. Six `check` runs without a changed shot.
  - Fixed a pre-existing Prettier failure in `js/app.js` (nested ternary indent).
  - Not verified in Spaces (consumer pages): Foundation reveal/dropdown open and close under reduced motion (should still fire their end events).
  - Items 2 and 3 are untouched: they change consumers in several repos (the `<label>` nesting alone touches 6), so the next agent takes them.

### Phase 7: `.clipped-title` in spaces-markup

- [ ] `.space-title` in spaces-markup: adopt `.clipped-title` (the library carries Spaces' card look: `.card.space-card > a.card-anchor > .clipped.space-header > .space-title + img.header-image`). Touches the handlebars template, its compiled PHP and `src/blocks/spaces-overview/components/SpaceCard.tsx`, then `npm run build` in spaces-markup; afterwards drop the `.space-title`/`.space-header` CSS from spaces-markup. Read `spaces-markup/readme.md` and `DEVELOPMENT.md` first. Run spaces-markup PHPUnit and `composer lint` on touched PHP.
- Handover:

### Phase 8: Docs source and llms.txt (DRY)

- [ ] Prose lives in `.md` files rendered into the page (`@@include` already renders `.md`), so an agent reads the `.md` and not the HTML. Merge `VARIABLES.md`, `HELPER_CLASSES.md`, `DARK_THEME.md` into that scheme instead of duplicating them in partials.
- [ ] Clean up and dedupe the HTML partials where it makes sense: repeated markup (cards, menus, example frames, controls) into one shared partial or `@@include` with parameters, dead wrappers and leftover attributes from the captures removed. Not where a dedupe would hide the markup a reader is meant to see in an example.
- [ ] `llms.txt` stays a build output generated from the same sources (no hand-written second copy). Decide whether it should link to the `.md` files instead of inlining them (size: 40 KB now).
- Handover:

### Phase 9: Publish and deploy

Order matters: the library goes first, consumers follow, nothing is removed before consumers stop using it. The demo is published by the Pages workflow (not a committed `index.html`). spaces-markup keeps `dev-master`; its `vendor/` reaches production through `spaces-markup/composer.json`.

1. foundation-sites-template: `bun run build` and commit `css/` together with the scss (Pages deploys the committed `css/`). Push `master`.
2. spaces-markup (in spaces-kisd): `composer update dol-lab/foundation-sites-template` in `web/app/plugins/spaces-markup`, commit `composer.lock` together with the consumer changes (defaultspace, child themes, spaces-markup `npm run build` output).
3. spaces-kisd: deploy as usual.
4. Only after that deploy: a second library release that removes aliases and the Foundation accordion code no consumer uses any more (flags in `_custom-foundation-includes.scss`). Still in use: the accordion plugin by child-member `page-members.php` (`data-responsive-accordion-tabs`), the accordion menu by spaces-markup `main-menu.compiled.php` and spaces-frame (`data-responsive-menu` at small widths).

- [ ] GitHub Actions: `actions/deploy-pages@v4` and `actions/upload-artifact` target the deprecated Node.js 20 (forced onto Node.js 24); bump them.
- [ ] Release checklist done, in the order above.

## Open questions (for the user)

- Q9: A post's `themed` + `--f-color-theme` does not visibly tint the card (it did not before Phase 2 either). Expected, or a gap?
- Q10: In `_checkbox.scss`, `.checkbox-label.small .checkbox-label` never matches (meant `.checkbox.small`); fixing it thins small checkbox rings in Spaces. Fix or drop the rule?

## Todo

- Buttons look dated: find out why (shape, weight, shadow, color, hover) and modernise them.
- Keyboard focus in nested `.details-menu` (summary, caret strip of a `.details-link`, links): tabbing works but the focus is hard to see. One simple, clearly visible `:focus-visible` style (KISS).
- Demo: `.demo-example` and its `.demo-markup` are drawn apart now; before they sat together as one frame (markup as the example's footer). Fix the regression.
- Demo (Pages): browsers must get a new `index.html` when there is one, not a cached copy (check what GitHub Pages sends, cache-bust `css/`/`js/` URLs per build).
- Demo: changing the brand color should also recolor the favicon, if possible (e.g. an SVG favicon regenerated from `--f-color-brand`).
