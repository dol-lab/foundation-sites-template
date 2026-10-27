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

Each section is written in `docs/<id>.md` and becomes `<section id="<id>">` where `index.src.html` includes it (`@@include('docs/<id>.md')`, plus `'folded'` for a long reference that starts closed). The `# ` title becomes the section's heading, the paragraph under it its intro, `##` a subheading. Fences:

- ` ```html example ` renders the markup and shows the same markup below it, so the code shown is the code rendered; ` ```html example row ` lays it out in a `.demo-row`.
- ` ```html demo ` renders page-only markup (swatches) without showing it.
- Any other fence is shown, not rendered.

A link to another section is written `[details](details.md)`, which works on GitHub and points at `#details` on the page. A `--f-color-*` or hex value in backticks gets a swatch.

`build-html.js` builds the table of contents from the sections and the `<!-- group: … -->` comments between them in `index.src.html`, and writes `llms.txt`: an index (llmstxt.org) linking each section's `.md` with its intro. `html-partials/` holds only the page frame (`_head-contents`, `_main-nav`, `_space-header`, `_index`, `_demo`, `_demo-controls`) and the markup captured from Spaces (`_space*.html`, shown in place after `docs/space.md`, a `.demo-captured` marker without style). `index.html` and `llms.txt` are gitignored and built by the Pages workflow, which also publishes `docs/`.

## Files

- `scss/app.scss`, `scss/app-backend.scss`: the two entry points (see below).
- `scss/components/`: one partial per component, named after its class (`_info-chip.scss` is `.info-chip`).
- `scss/custom-styles/`: tokens and palette (`_root-tokens`, `_root-variables`), base elements, type, utilities.
- `scss/custom-includes/`: Foundation's own components with our settings (`_s-*.scss`); `foundation-spaces/` is the Foundation source fork.
- `scss/_custom-styles.scss`: the include list for `components/` and `custom-styles/`, in cascade order.
- `scss/_custom-foundation-includes.scss`: which Foundation components are emitted, with opt-in flags.
- `scss/_colors.scss`: the palettes. `_custom-settings.scss`: our Sass settings. `_custom-functions.scss`: mixins, including `foundation-apply-theme()`.
- `docs/`: the demo page's sections; among them `variables.md` (every `--f-*` custom property), `helper-classes.md` (utility classes) and `dark-theme.md` (dark-mode troubleshooting).

## Adding a component

Create `scss/components/_name.scss`, wrap its rules in `@mixin styles { … }`, `@use` it in `scss/_custom-styles.scss` and add `@include name.styles;` at the matching place in the cascade. A partial that is not included prints nothing. Settings go at the top of the partial as `!default` variables or custom properties.

## Configuring

Pass settings with `@use … with (…)` to the partial that owns them, before the entry loads it:

```scss
@use "custom-foundation-includes" with ($include-top-bar: true);
@use "app";
```

Unused Foundation components (off-canvas, top-bar, title-bar, drilldown, media-object, float classes) are off by default; each flag in `_custom-foundation-includes.scss` names the classes it drops.

## Colors and theming

CSS custom properties are the source of truth; Sass only holds the palettes that generate them. Use the roles directly, also in Foundation settings (`$card-background: var(--f-color-bg-1)`), so components stay themeable at runtime:

- Surfaces: `--f-color-bg-0` (page), `-1` (cards), `-2` (raised).
- Text: `--f-color-text-0` (headings), `-1` (body), `-2` (muted). Borders: `--f-color-border-0..2`.
- Palette: `--f-color-{brand,primary,secondary,success,warning,alert}`, plus `-contrast` (text on it) and `-darker` (hover). The brand can be overridden at runtime with `--f-color-brand-base` / `--f-color-brand-base-contrast`.
- Radius: `--f-radius` is the one knob; `-small` and `-xsmall` follow it, `-full` is a pill (use it, not a large fixed radius).

Light/dark: the palette is written with `light-dark()` on `:root`, which sets `color-scheme: light dark`, so it follows the OS. `data-theme="light"` or `"dark"` forces a mode on any element and its subtree. `themed` plus `--f-color-theme` tints the surfaces toward a hue (`oklch(from …)`). Details in `docs/variables.md`.

## The two builds

`app.css` styles pages we own. `app-backend.css` is loaded into pages we do not own (wp-admin screens, and the KISDarchiv theme `ark`, which prints the Spaces header), so every component rule is wrapped in `.f` and only markup carrying that class is styled. The entries do this by including each partial's `styles` mixin inside `.f`.

## To Do

- Delete the Foundation issue and PR templates in `.github/` and `migrations/`.
- Move `.sms-*` (`custom-styles/_animations-focus.scss`) to the Milestones plugin.
- Drop the aliases `.s-fg-a-c1-parent` (for `.brand-links`) and `.main-menu` (for `.app-header`) once no markup uses them.
- Verify `rgb(from light-dark(…))` in Firefox and Safari.

## Notes

- Outside `.f` in the backend build: tokens (custom properties belong on `:root`; nested they become `.f :root` and never match), the palette (always light, applied to `:root` directly, no `color-scheme` set on the host page), and normalize (it loads before the host's stylesheets, so their element rules win on order). The exception is `box-sizing`: `_custom-normalize.scss` takes `$box-sizing-root` / `$box-sizing-all`, and the backend sets them to `.f` / `.f *` so a foreign page's layout is not resized.
- The backend build ends with a block that turns off the dark variants of `select` and `.show-/.hide-for-dark-mode`, which still key off `prefers-color-scheme` on the host's `:root`.
- `.f`-scoped rules are one class stronger than the host's own: a consumer stylesheet that must win in `ark` or wp-admin needs a matching selector (e.g. `.f div` beats a bare `.space-title`).
- Vendor prefixes are hand-written; there is no autoprefixer. The ones current Safari still needs: `-webkit-user-select`, `-webkit-text-size-adjust`, `-webkit-text-decoration` (shorthand).
- motion-ui is loaded with `@use` but still uses `@import` internally; its deprecation warnings are muted in `gulpfile.js`.
- `.ignore` keeps built and binary files out of ripgrep-based search (editors, coding agents). Never commit a second copy of a build output.
- An avatar's corner is `--f-avatar-radius`, falling back to `--f-radius`; `.avatar-stack` sets it round, a card's first avatar takes the card's corner. Set the property, never the inner elements' `border-radius`.
- `.tabs.line` draws one underline as the bar's `::after`, anchored to the active tab (`anchor-name`, scoped per bar with `anchor-scope`), so it slides. Foundation's clearfix gives that `::after` `display: table`, which shrinks an empty box to 0 wide: it needs `display: block`. Without `anchor-scope` support the per-tab `box-shadow` stays.
- A Sass color passed into a `border-color` shorthand (`css-triangle`) must not be `inherit`: CSS-wide keywords cannot share a shorthand with other values, and the whole declaration is dropped.
- Info chips: a static chip is flat (hairline ring, no fill, full-contrast label); a clickable one (`[href]`, `<button>`, `.clickable`) gets a surface and a shadow, and does not move on hover. `[href]` is the signal because chips are `<a>` even without a link. The ring is a `0 0 0 1px` shadow (no layout cost), the shadow uses `--f-color-shadow` (never a text-derived color, which glows on dark), and the state selectors sit in `:where()` so `.hollow` and `.clear` still win. A path of chips is `ul.breadcrumbs.info-chips` with a chip per `<li>`: the separator has to be the item's `::after`, because the chip clips its own, and `.breadcrumbs`' link color skips `.info-chip`.
- Keyboard focus is one rule in `_animations-focus.scss`: `:focus-visible` gets an inset outline, `$global-focus` (2px, `$global-focus-color` = text color). Not a box-shadow ring: that is clipped by any `overflow: hidden` parent and lost where an element sets its own shadow. A rule that sets `outline: none` on `:focus` beats it (`:focus` plus a class or element is more specific), so never reset the outline on `:focus`; text inputs and `select` keep their own focus style (border and shadow) this way on purpose. A control whose input is hidden (checkbox, radio, switch, radio tabs) outlines its wrapper with `$global-focus`. An element with `transition: all` animates the outline too, so a script reads the computed outline a frame after focusing.
- Modal (`.reveal`): `--f-drop-shadow-large` plus a `--f-color-border-0` hairline (the edge stays in dark mode where the shadow fades), padding 1.5rem. A direct `.close-button` sits level with a leading heading, which keeps clear of it.
- Reduced motion is one rule in `_animations-focus.scss`, not one per component: every transition and animation ends after 0.01ms (not 0s: Foundation's Motion waits for `transitionend`), except `.spinner`. jQuery ignores CSS, so `js/app.js` sets `$.fx.off` from the same media query.
- `.button` is `inline-flex` (centered label at `min-height`, a `0.5em` gap for an icon, so markup needs no space or margin between them), weight 500. The dropdown arrow is a flex item after the label, not a float. A `.clear` button gets a faint tint of its color on hover and focus.
- Checkbox, radio and switch are a hidden `<input>` plus a drawn control (`.checkbox-label`, `.radio-label`, `.switch-paddle`). On its own the drawn control is the input's `<label for>`; inside a `label.label-wrapper` (which makes the row's text clickable) it is an `aria-hidden` `<span>`, since labels must not nest and the outer label already names the input. The styles key on these classes and the input's state (`input:checked ~ .switch-paddle`), never on the `label` element, so both forms render alike.
- `<details>` is unstyled unless it asks: `.details` (look and open animation), `.details-animated` (animation only), or any `<details>` inside `.user-generated`. Its `::details-content` is not matched by `*`, so the box model gets a rule of its own there (`_custom-normalize.scss`); without it everything inside a `<details>` is content-box.
- `.details-menu` folds a menu into a `<details>` with the look of `.accordion-menu` (raised card while open) and no JS; it replaces Foundation's accordion menu. Its caret is the summary's `::after` (`.caret`), a fixed box so nested levels keep one column; a nested open fold gives back its half `--offset` in the summary's padding. A `summary.small` takes the small font size, as in `.details`. A parent that is also a link is `li.details-link > a + details.details-menu`, not an `<a>` in the summary (that nests a link in a button, and a click navigates instead of folding): the link lies over the summary row, and the summary repeats the title in an `aria-hidden` span (named by `aria-label`) so the row wraps and grows with it. The link leaves the summary a square strip for the caret (`--strip`, a one-line row's height via `lh`), and the summary's gap grows with the caret's padding so its hidden title wraps where the link's does; the insets follow the summary's padding in every state (closed, open, nested open), so a change to one needs the other. Two targets, told apart before any hover by a ring around the caret (a summary that only folds has none; its block margins are negative half its height, so a ring taller than a line adds no height), and two hovers with one tint: the link tints its own box and the summary only the strip, and `_s-menu.scss` keeps its `li:hover > a` rule off a `.details-link` (the `<li>` also holds the caret and the open fold). A `.details-link` summary shows keyboard focus as the outline around its caret only.
- `js/app.js` folds `[data-collapse="<breakpoint>"]` (a `<details>` or a Foundation `.accordion`) from that breakpoint through the next one (`MediaQuery.upTo()` includes it): `small` folds below large. It acts on load and when the viewport enters or leaves that range, not on every breakpoint change, so a user who reopens it inside the range is not overruled. On leaving it reopens only what it folded (`data-collapsed`, cleared when the user opens it). A `<details>` holding the URL's `:target` stays open.
- The breakpoints are not Foundation's: medium 30em (480px), large 45em (720px), xlarge 60em, xxlarge 75em (`util/_breakpoint.scss`). Hand-written media queries must use these.
- Foundation's dropdown menu turns a `<ul>` that is a direct child of a menu `<li>` into a submenu, so content with its own list (tabs in a header panel) is wrapped in a `<div>`. In a `.menu`, an `<hr>` in its own `<li>` is a divider with a small margin: the items' padding spaces it.
- Headings have no top margin: the block above sets the gap, and a table or list sets none. The library does not add one in `.user-generated`: Spaces puts that class on a post's outer `.card-divider` (title and header inside) and opens `.page-content` with a hidden `h1.reader-only`, so a sibling rule would also space those. The demo's rendered markdown spaces its headings in `_demo.html`.
- Page-only CSS and JS live in `html-partials/_demo.html`, prefixed `demo-` (`ds-` is defaultspace's prefix). The controls card atop `#start` (`_demo-controls.html`, right under the header so an image swap stays in view) swaps the Space header's image, sets `--f-color-theme` (from that image's `data-color`, or the picker) and `--f-color-brand-base` with a black or white `-contrast`, and toggles `themed`. The favicon is an SVG that `paintFavicon()` draws in the resolved `--f-color-brand` and its contrast (on load, on a brand or color-mode change); `assets/favicon.ico` stays as the fallback without JS. The index card holds a copy of the avatar menu's color mode, so it stays in reach while scrolling: every `[data-color-mode]` radio group is kept in sync. Nothing page-only goes into `scss/`; the page uses library classes, so a missing style there is a gap in the library.
- Code style: `bun run lint` must pass (stylelint on all SCSS, Prettier on JS; `bun run lint:fix` fixes what it can). Each rule exception in `stylelint.config.js` says why; anything else is fixed or disabled inline with a `-- reason`. JS follows `.prettierrc.json` (`bun run format`). SCSS is checked by stylelint only and listed in `.prettierignore`: Prettier rewrites a private function call such as `-theme-pick(…)` into `- theme-pick(…)`, a minus sign that Sass compiles silently into the custom properties.
- Agent tooling (no screenshot needed for most questions): `bun run check [id…]` builds CSS and page, lints and shoots, printing only failures and changed shots. `bun run probe '<selector>' [property…] [--width=375] [--state=<name>]` prints box, computed values and the matching rules with their SCSS line, as JSON. `bun run outline <partial> [depth]` prints a partial's element tree with line numbers.
- `bun run shots [id…]` writes one PNG per `section[id]` and `nav[id]` (the header) at 375 and 1280px to `shots/`, plus the click states in `shots.config.js` (open header menus), and a `<stem>.json` of the shot's elements (box, computed style that differs from the tag's default, class, text). A changed shot prints its changed regions with the element each lies in, then what changed in the elements as text; pixels that changed with no element changing print as `noise` (hidden by `check`). It keeps `.prev.png` and a `.diff.png` (old | new, one row per region) until it changes again; shots over 1600px are split into `-1`, `-2`, …. Chromium renders an element differently depending on where it sits in the viewport and shifts one taller than the viewport while capturing it, so each target is scrolled to the top, nudged onto whole pixels (`translate`) and given a viewport it fits in; without that shots flap on unchanged source. Element keys skip Foundation's generated ids (`6ys753-…`), which change on every load. The body gradient is turned off for shots: it shows through sections and depends on their offset. Lazy images are forced eager and the page runs with reduced motion (the library's rule ends every transition, `js/app.js` turns off jQuery's slides), plus one frame after a click for the transitions to end, or shots flap. Playwright is not a dependency here: it resolves from spaces-markup's `node_modules` (this package lives in its `vendor/`), browser from `CHROME` or `/usr/bin/chromium`.
- `gulpfile.js` compiles with `charset: false`: otherwise Sass counts a BOM in the source map that the returned CSS lacks, and every mapping (DevTools, `probe`) points one column early, into the previous rule.
- `index.html` is gitignored. `build-html.js` builds it with only `marked`, so the Pages workflow runs it without gulp or sass and deploys the committed `css/`: rebuild and commit `css/` before pushing a style change, or the published page shows the old CSS. GitHub Pages' headers cannot be set: it sends every file with `Cache-Control: max-age=600` plus `ETag`/`Last-Modified`, so a browser may show a cached `index.html` for up to 10 minutes after a deploy and then revalidates it. So the page does not pair a new `index.html` with a stale stylesheet or script, `build-html.js` appends a content hash (`?v=…`) to every local `css/`, `js/` and `assets/` `.css`/`.js` URL in a `<link>` or `<script>` tag; files loaded from inside them (fonts, images) are not versioned.
