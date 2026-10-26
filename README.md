# foundation-sites-template

A themeable fork of [Foundation for Sites 6](https://get.foundation/sites/docs/): Sass source plus the built `css/app.css` and `css/app-backend.css`. Consumers (spaces-markup, via composer) load the built files from `css/`; they never run this build.

## Build

The package manager is [bun](https://bun.sh) (`packageManager` in `package.json`); `bun.lock` is the only lockfile. Do not add a `package-lock.json` or `yarn.lock`.

```sh
bun install
bun run build       # both css files (about 2 s)
bun run build:html  # the demo page index.html and llms.txt, from index.src.html + html-partials/
bun start           # both builds, then watch and serve
bun run lint        # stylelint on scss/
```

The demo page is published to GitHub Pages on every push to `master` (`.github/workflows/pages.yml`).

## The demo page

`index.src.html` lists the sections; each is a partial `html-partials/_content-<id>.html` holding one `<section class="cell demo-section" id="<id>">`, linked from the table of contents in `_index.html`. `build-html.js` inlines `@@include('…')` (a `.md` file is rendered with marked) and expands two markers:

- `<!-- example -->…<!-- /example -->` renders the markup and shows the same markup below it, so the code shown is the code rendered. A `<div class="demo-row">` wrapper is left out of the shown code.
- `<!-- code -->…<!-- /code -->` shows the markup without rendering it.

It also writes `llms.txt`, the page as markdown for agents: per section the title, id, intro and prose, each example's markup as a fenced block, then the reference `.md` files. A `.demo-captured` (captured Spaces markup shown in place, `_space-*.html`; a marker without style) is left out of it. Both outputs are gitignored and built by the Pages workflow.

## Files

- `scss/app.scss`, `scss/app-backend.scss`: the two entry points (see below).
- `scss/components/`: one partial per component, named after its class (`_info-chip.scss` is `.info-chip`).
- `scss/custom-styles/`: tokens and palette (`_root-tokens`, `_root-variables`), base elements, type, utilities.
- `scss/custom-includes/`: Foundation's own components with our settings (`_s-*.scss`); `foundation-spaces/` is the Foundation source fork.
- `scss/_custom-styles.scss`: the include list for `components/` and `custom-styles/`, in cascade order.
- `scss/_custom-foundation-includes.scss`: which Foundation components are emitted, with opt-in flags.
- `scss/_colors.scss`: the palettes. `_custom-settings.scss`: our Sass settings. `_custom-functions.scss`: mixins, including `foundation-apply-theme()`.
- `VARIABLES.md`: every `--f-*` custom property. `HELPER_CLASSES.md`: utility classes. `DARK_THEME.md`: dark-mode troubleshooting.

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
- Radius: `--f-radius` is the one knob; `-small`, `-xsmall` and `-full` follow it.

Light/dark: the palette is written with `light-dark()` on `:root`, which sets `color-scheme: light dark`, so it follows the OS. `data-theme="light"` or `"dark"` forces a mode on any element and its subtree. `themed` plus `--f-color-theme` tints the surfaces toward a hue (`oklch(from …)`). Details in `VARIABLES.md`.

## The two builds

`app.css` styles pages we own. `app-backend.css` is loaded into pages we do not own (wp-admin screens, and the KISDarchiv theme `ark`, which prints the Spaces header), so every component rule is wrapped in `.f` and only markup carrying that class is styled. The entries do this by including each partial's `styles` mixin inside `.f`.

## To Do

- Delete the stale tracked builds in `scss/` (`app*.css*`), the Foundation issue and PR templates in `.github/`, and `migrations/`.
- Move `.sms-*` (`custom-styles/_animations-focus.scss`) to the Milestones plugin.
- Drop the aliases `.s-fg-a-c1-parent` (for `.brand-links`) and `.main-menu` (for `.app-header`) once no markup uses them.
- Verify `rgb(from light-dark(…))` in Firefox and Safari; fix the existing `bun run lint` errors.

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
- Info chips: a static chip is flat (hairline ring, no fill, full-contrast label); a clickable one (`[href]`, `<button>`, `.clickable`) gets a surface and a shadow, and does not move on hover. `[href]` is the signal because chips are `<a>` even without a link. The ring is a `0 0 0 1px` shadow (no layout cost), the shadow uses `--f-color-shadow` (never a text-derived color, which glows on dark), and the state selectors sit in `:where()` so `.hollow` and `.clear` still win.
- `<details>` is unstyled unless it asks: `.details` (look and open animation), `.details-animated` (animation only), or any `<details>` inside `.user-generated`. Its `::details-content` is not matched by `*`, so the box model gets a rule of its own there (`_custom-normalize.scss`); without it everything inside a `<details>` is content-box.
- `.details-menu` folds a menu into a `<details>` with the look of `.accordion-menu` (raised card while open) and no JS; it replaces Foundation's accordion menu. Its caret is the summary's `::after` (`.caret`), a fixed box so nested levels keep one column; a nested open fold gives back its half `--offset` in the summary's padding. A `summary.small` takes the small font size, as in `.details`.
- `js/app.js` folds `[data-collapse="<breakpoint>"]` (a `<details>` or a Foundation `.accordion`) from that breakpoint through the next one (`MediaQuery.upTo()` includes it): `small` folds below large. It acts on load and when the viewport enters or leaves that range, not on every breakpoint change, so a user who reopens it inside the range is not overruled. On leaving it reopens only what it folded (`data-collapsed`, cleared when the user opens it). A `<details>` holding the URL's `:target` stays open.
- The breakpoints are not Foundation's: medium 30em (480px), large 45em (720px), xlarge 60em, xxlarge 75em (`util/_breakpoint.scss`). Hand-written media queries must use these.
- Foundation's dropdown menu turns a `<ul>` that is a direct child of a menu `<li>` into a submenu, so content with its own list (tabs in a header panel) is wrapped in a `<div>`. In a `.menu`, an `<hr>` in its own `<li>` is a divider with a small margin: the items' padding spaces it.
- Headings have no top margin: the block above sets the gap, and a table or list sets none. The library does not add one in `.user-generated`: Spaces puts that class on a post's outer `.card-divider` (title and header inside) and opens `.page-content` with a hidden `h1.reader-only`, so a sibling rule would also space those. The demo's rendered markdown spaces its headings in `_demo.html`.
- Page-only CSS and JS live in `html-partials/_demo.html`, prefixed `demo-` (`ds-` is defaultspace's prefix). The controls card atop `#start` (`_content-start.html`, right under the header so an image swap stays in view) swaps the Space header's image, sets `--f-color-theme` (from that image's `data-color`, or the picker) and `--f-color-brand-base` with a black or white `-contrast`, and toggles `themed`. The index card holds a copy of the avatar menu's color mode, so it stays in reach while scrolling: every `[data-color-mode]` radio group is kept in sync. Nothing page-only goes into `scss/`; the page uses library classes, so a missing style there is a gap in the library.
- Code style: `bun run lint` must pass (stylelint on all SCSS, Prettier on JS; `bun run lint:fix` fixes what it can). Each rule exception in `stylelint.config.js` says why; anything else is fixed or disabled inline with a `-- reason`. JS follows `.prettierrc.json` (`bun run format`). SCSS is checked by stylelint only and listed in `.prettierignore`: Prettier rewrites a private function call such as `-theme-pick(…)` into `- theme-pick(…)`, a minus sign that Sass compiles silently into the custom properties.
- Agent tooling (no screenshot needed for most questions): `bun run check [id…]` builds CSS and page, lints and shoots, printing only failures and changed shots. `bun run probe '<selector>' [property…] [--width=375] [--state=<name>]` prints box, computed values and the matching rules with their SCSS line, as JSON. `bun run outline <partial> [depth]` prints a partial's element tree with line numbers.
- `bun run shots [id…]` writes one PNG per `section[id]` and `nav[id]` (the header) at 375 and 1280px to `shots/`, plus the click states in `shots.config.js` (open header menus), and a `<stem>.json` of the shot's elements (box, computed style that differs from the tag's default, class, text). A changed shot prints its changed regions with the element each lies in, then what changed in the elements as text; pixels that changed with no element changing print as `noise` (hidden by `check`). It keeps `.prev.png` and a `.diff.png` (old | new, one row per region) until it changes again; shots over 1600px are split into `-1`, `-2`, …. Chromium renders an element differently depending on where it sits in the viewport and shifts one taller than the viewport while capturing it, so each target is scrolled to the top, nudged onto whole pixels (`translate`) and given a viewport it fits in; without that shots flap on unchanged source. Element keys skip Foundation's generated ids (`6ys753-…`), which change on every load. The body gradient is turned off for shots: it shows through sections and depends on their offset. Lazy images are forced eager, jQuery slides awaited and running CSS transitions finished (`finishAnimations()`: Foundation sets `aria-expanded` after load, which turns carets while the snapshot is taken), or shots flap. Playwright is not a dependency here: it resolves from spaces-markup's `node_modules` (this package lives in its `vendor/`), browser from `CHROME` or `/usr/bin/chromium`.
- `gulpfile.js` compiles with `charset: false`: otherwise Sass counts a BOM in the source map that the returned CSS lacks, and every mapping (DevTools, `probe`) points one column early, into the previous rule.
- `index.html` is gitignored. `build-html.js` builds it with only `marked`, so the Pages workflow runs it without gulp or sass and deploys the committed `css/`: rebuild and commit `css/` before pushing a style change, or the published page shows the old CSS.
