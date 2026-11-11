# foundation-sites-template

A themeable fork of [Foundation for Sites 6](https://get.foundation/sites/docs/): Sass source plus the built `css/app.css` and `css/app-backend.css`. Consumers (spaces-markup, via composer) load the built files from `css/`; they never run this build.

## Build

The package manager is [bun](https://bun.sh) (`packageManager` in `package.json`); `bun.lock` is the only lockfile. Do not add a `package-lock.json` or `yarn.lock`.

```sh
bun install
bun run build       # both css files (about 2 s)
bun run build:html  # the demo page index.html and llms.txt, from index.src.html, docs/ and html-partials/
bun start           # both builds, then watch and serve
bun run lint        # stylelint on scss/, Prettier on the JS
```

The demo page is published to GitHub Pages on every push to `master` (`.github/workflows/pages.yml`).

## The demo page

Each section is written in `docs/<id>.md` and becomes `<section id="<id>">` where `index.src.html` includes it (`@@include('docs/<id>.md')`), laid out as defaultspace prints a page (`.page-card`, the text in a `.prose-layout` column, tables `.alignwide`). The `# ` title becomes the page's `h1`, the paragraph under it its intro, `##` an `h2`. Fences:

- ` ```html example ` renders the markup and shows the same markup below it, so the code shown is the code rendered; ` ```html example row ` lays it out in a `.demo-row`.
- ` ```html demo ` renders page-only markup (swatches) without showing it.
- `wide` after `example` or `demo` spans it across the card (`.alignwide`), for a row or grid of several things (Space cards, swatches); prose and single components stay in the column.
- Any other fence is shown, not rendered.

An example's code is editable once opened: the preview follows the edit, and highlight.js (from cdnjs, loaded on the first edit) colors the code again on leaving it. Without it the code stays plain; a reload restores the example.

A link to another section is written `[details](details.md)`, which works on GitHub and points at `#details` on the page. A `--f-color-*` or hex value in backticks gets a swatch.

`build-html.js` builds the table of contents from the sections and the `<!-- group: … -->` comments between them in `index.src.html`, and writes `llms.txt`: an index (llmstxt.org) linking each section's `.md` with its intro. `html-partials/` holds only the page frame (`_head-contents`, `_main-nav`, `_space-header`, `_index`, `_demo`) and the markup captured from Spaces (`_space*.html`, shown in place after `docs/space.md`, a `.demo-captured` marker without style). `index.html` is gitignored and built by the Pages workflow, which also publishes `docs/`. `llms.txt` is committed like `css/`, so a zip install (Spaces) has the index too: `bun start` and `bun run check` rebuild it when a doc changes.

## Files

- `scss/app.scss`, `scss/app-backend.scss`: the two entry points (see below). Both load `scss/_bundle.scss`, the one include list, in cascade order.
- `scss/components/`: one partial per component, named after its class (`_info-chip.scss` is `.info-chip`, `_form-label.scss` is a form `label`), including the ones forked from Foundation.
- `scss/custom-styles/`: tokens and palette (`_root-tokens`, `_root-variables`), base elements, type, utilities, motion (shared animations, reduced motion), focus.
- `scss/foundation-spaces/`: what is left of the Foundation source: `util/`, the XY grid, normalize, typography and the helper classes (`prototype/`, deprecated).
- `scss/_colors.scss`: the palettes. `_custom-settings.scss`: our Sass settings. `_custom-functions.scss`: mixins, including `foundation-apply-theme()`.
- `js/app.js`: the only script, for the demo page and Spaces (tabs, dropdown menus, modals, closables, tooltips, find-in-page, `data-collapse`). It needs no jQuery and no init call: handlers are delegated, so markup added later works as is. Foundation's own JS is not shipped; a `data-<plugin>` attribute of a Foundation plugin does nothing.
- `docs/`: the demo page's sections; among them `colors.md` (color roles, light and dark, tinting, dark-mode troubleshooting), `variables.md` (every other `--f-*` custom property) and `helper-classes.md` (utility classes).

## Adding a component

Create `scss/components/_name.scss`, wrap its rules in `@mixin styles { … }`, `@use` it in `scss/_bundle.scss` and add `@include name.styles;` at the matching place in the cascade. A partial that is not included prints nothing. Settings go at the top of the partial as `!default` variables or custom properties; `_custom-settings.scss` keeps only what several partials share. Private custom properties start with `--_`, a public knob is `--f-<component>-…`.

## Configuring

Pass settings with `@use … with (…)` to the partial that owns them, before the entry loads it:

```scss
@use "components/button" with ($button-padding: 1rem);
@use "app";
```

The fork keeps only the Foundation components it builds (`_bundle.scss`): off-canvas, top-bar, title-bar, drilldown, media-object, sticky, table, the float grid, the float classes and Motion UI are gone. Take one from Foundation 6.9 if a project needs it.

## Colors and theming

CSS custom properties are the source of truth; Sass only holds the palettes that generate them (`scss/_colors.scss`). Use the roles directly, also in Foundation settings (`$card-background: var(--f-color-bg-1)`), so components stay themeable at runtime. Roles, palette, light and dark, tinting and dark-mode troubleshooting: `docs/colors.md`; every other token: `docs/variables.md`.

## The two builds

`app.css` styles pages we own. `app-backend.css` is loaded into pages we do not own (wp-admin screens, and the KISDarchiv theme `ark`, which prints the Spaces header), so every component rule is wrapped in `.f` and only markup carrying that class is styled. The backend entry does this by including `bundle.styles` (every partial's `styles` mixin) inside `.f`.

## Notes

Single-component traps are why-comments at the top of the component's partial; tooling is in `AGENTS.md`.

- A custom property resolves where it is declared, so a token derived from one the `themed` rule changes is redeclared there through the mixin that prints it (`brand-colors`, `drop-shadows`, `text-tints` in `_custom-functions.scss`); a new derived token goes into one of them, or it keeps the untinted value inside a tinted card.
- Palette colors are one mechanism (`palette-classes()` in `_custom-functions.scss`): a color class or an inline `--f-c` sets `--f-c`, `-contrast`, `-darker`, `-text`, and components read them. `--f-c` inherits, so a component reads it only under `:is(#{palette-selector()})` on itself or the parent that carries the class (`.progress`, `.switch`, `.button-group`), never bare, or an unrelated colored ancestor would recolor it. `:is()` keeps the old `.x.brand` weight; the token rules are `:where()`, so a component rule that sets `--f-c` (the uncolored `.callout`, forced colors on `.switch`) must exclude the palette or outweigh it.
- Outside `.f` in the backend build: tokens (custom properties belong on `:root`; nested they become `.f :root` and never match), the palette (always light, applied to `:root` directly, no `color-scheme` set on the host page), and normalize (it loads before the host's stylesheets, so their element rules win on order). The exception is `box-sizing`: the backend narrows `$box-sizing-root` / `$box-sizing-all` to `.f` / `.f *`, so a foreign page's layout is not resized. The build ends with a block that turns off the dark variant of `select`, which still keys off `prefers-color-scheme` on the host's `:root`.
- `:has()` stays in the compound it styles (`.x:has(> .y)`): followed by a combinator (`.x:has(…) span`, `li:has(> [popover]) > a`) it makes Chromium restyle every element the last compound names, page-wide, on each DOM insertion anywhere. For a sibling, put it on the earlier one (`li > a:has(~ [popover])`); for descendants, set a custom property on the `:has()` element and let them inherit it (radio tabs, user card). Each `:root` token also costs on every DOM change: with any `:has()` loaded, Chromium restyles all ancestors of a change, `<html>` included. An attribute selector on `style` (`[style*="--f-c:"]`, the inline palette color) works the same way within its element: before a combinator into a bare tag (`li[style] > a`), every such tag inside an element restyles whenever its inline style changes (React's inline styles, React Aria's on `<html>`, a dragged sheet), so those rules leave the inline color out (`palette-selector($inline: false)`). `bun run lint` fails on a `:has()` or `[style]` before a target without a class, id or attribute (`has-check.js`, on the built CSS). The same goes for state on `<html>`: a custom property a script changes there restyles the whole page (`js/app.js` sets the modals' `--f-viewport-*` on the open modal), and so does an attribute there that a rule follows with `*` (`[data-focus-mode="pointer"] *`): name the targets instead (`_focus.scss`).
- Anchor positioning (`anchor-name`, `anchor()`) inside an element whose `translate` changes on every frame (a sheet a finger drags) costs Chromium a layout of the whole document per frame; neither `contain` nor a Web Animation avoids it. So what anchors (the tab underline, the radio tabs pill, the modal's close button on a header row) takes its unanchored look while an ancestor is `[data-dragging]`, behind `:where(:not([data-dragging] *))` so the specificity stays. A new anchored component that may sit in a modal does the same.
- `.f`-scoped rules are one class stronger than the host's own: a consumer stylesheet that must win in `ark` or wp-admin needs a matching selector (e.g. `.f div` beats a bare `.space-title`).
- The breakpoints are not Foundation's: medium 30em (480px), large 45em (720px), xlarge 60em, xxlarge 75em (`util/_breakpoint.scss`). Hand-written media queries must use these. Scripts read them from the `--f-breakpoint-<name>` tokens with `matchMedia`, not Foundation's MediaQuery.
- Keyboard focus is one rule (`_focus.scss`): a `:focus-visible` outline set by the `--f-focus-*` tokens (width, offset, radius; the color `--f-focus-color` is text-0 at 60%, neutral so a ring never reads as an error), outside the element. A click into a text field or contenteditable matches `:focus-visible` too, so `js/app.js` sets `data-focus-mode` on `<html>`: `keyboard` or `pointer` when focus moves (by the last interaction before it; script focus follows the interaction that caused it), `typing` once a key edits the focused text field. A text field shows the ring only in `keyboard`: clicked or typed into, its focus border and caret mark it (the ring is for finding the field, not for writing in it), and Tab back brings the ring. A ring on a wrapper of a field keys on it: `[data-focus-mode="keyboard"] .wrapper:has(:focus-visible)`. what-input is not used: its intent flips to keyboard on a key in a contenteditable. A container that clips its children (overflow, scroller, card edge) sets `--f-focus-offset: var(--f-focus-inset)` so its rings are drawn inside; consumers do the same, never their own outline. A consumer rule that sets `outline: none` on `:focus` beats it, so never reset the outline on `:focus`. `normalize.scss` hides a host's `:focus:not(:focus-visible)` outline. Script reads of the outline need a frame: `transition: all` animates it.
- Reduced motion is one rule (`_motion.scss`), not one per component: every transition and animation ends after 0.01ms (not 0s: scripts wait for `transitionend`), except `.spinner`. `data-motion="reduce"` or `"full"` on an element (a user setting, usually `<html>`; the demo's switches) overrides the device's choice for its subtree; the selectors stay compounds so the `.f` scope still matches. Where the page has jQuery, `js/app.js` makes its `$.fx.off` a getter over both.
- Stacking: page layers read `--f-z-header` / `-overlay` / `-dropdown` (from `$z-index`), so Spaces can stack against them. Modals (`dialog.reveal`, `showModal()`), `.popover[popover]` panes, dropdown menu panels and the tooltip are in the top layer, above every z-index; a modal makes the rest of the page inert, so an overlay opened from inside one must be rendered into the dialog (a positioned one into its `.reveal-layer`, `docs/modal.md`). A modal that is no `<dialog>` (`.reveal-overlay`, React Aria's) is not in the top layer: it stacks at `--f-z-overlay`, and what opens from it at `--f-z-dropdown`. Stacking inside a component keeps small literal numbers (avatar 20 and the `10 + n` spaces-markup `Markup.php` writes inline into avatar stacks are local).
- Vendor prefixes are hand-written; there is no autoprefixer. The ones current Safari still needs: `-webkit-user-select`, `-webkit-text-size-adjust`, `-webkit-text-decoration` (shorthand).
- A Sass color passed into a `border-color` shorthand (`css-triangle`) must not be `inherit`: CSS-wide keywords cannot share a shorthand with other values, and the whole declaration is dropped.
- Pages: the workflow runs only `build-html.js` (`index.html`, `llms.txt`), not the Sass build, and deploys the committed `css/`: rebuild and commit `css/` before pushing a style change. GitHub Pages caches every file for 10 minutes and its headers cannot be set, so local `.css`/`.js` URLs get a content hash (`?v=…`); files loaded from inside them (fonts, images) are not versioned.
