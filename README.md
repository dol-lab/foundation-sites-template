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

Each section is written in `docs/<id>.md` and becomes `<section id="<id>">` where `index.src.html` includes it (`@@include('docs/<id>.md')`). The `# ` title becomes the section's heading, the paragraph under it its intro, `##` a subheading. Fences:

- ` ```html example ` renders the markup and shows the same markup below it, so the code shown is the code rendered; ` ```html example row ` lays it out in a `.demo-row`.
- ` ```html demo ` renders page-only markup (swatches) without showing it.
- Any other fence is shown, not rendered.

A link to another section is written `[details](details.md)`, which works on GitHub and points at `#details` on the page. A `--f-color-*` or hex value in backticks gets a swatch.

`build-html.js` builds the table of contents from the sections and the `<!-- group: … -->` comments between them in `index.src.html`, and writes `llms.txt`: an index (llmstxt.org) linking each section's `.md` with its intro. `html-partials/` holds only the page frame (`_head-contents`, `_main-nav`, `_space-header`, `_index`, `_demo`) and the markup captured from Spaces (`_space*.html`, shown in place after `docs/space.md`, a `.demo-captured` marker without style). `index.html` and `llms.txt` are gitignored and built by the Pages workflow, which also publishes `docs/`.

## Files

- `scss/app.scss`, `scss/app-backend.scss`: the two entry points (see below). Both load `scss/_bundle.scss`, the shared include list in cascade order.
- `scss/components/`: one partial per component, named after its class (`_info-chip.scss` is `.info-chip`).
- `scss/custom-styles/`: tokens and palette (`_root-tokens`, `_root-variables`), base elements, type, utilities, motion (shared animations, reduced motion), focus.
- `scss/custom-includes/`: Foundation's own components with our settings (`_s-*.scss`); `foundation-spaces/` is the Foundation source fork.
- `scss/_custom-styles.scss`: the include list for `components/` and `custom-styles/`, in cascade order.
- `scss/_custom-foundation-includes.scss`: which Foundation components are emitted, with opt-in flags.
- `scss/_colors.scss`: the palettes. `_custom-settings.scss`: our Sass settings. `_custom-functions.scss`: mixins, including `foundation-apply-theme()`.
- `js/app.js`: the only script, for the demo page and Spaces (tabs, dropdown menus, modals, closables, tooltips, find-in-page, `data-collapse`). It needs no jQuery and no init call: handlers are delegated, so markup added later works as is. Foundation's own JS is not shipped; a `data-<plugin>` attribute of a Foundation plugin does nothing.
- `docs/`: the demo page's sections; among them `colors.md` (color roles, light and dark, tinting, dark-mode troubleshooting), `variables.md` (every other `--f-*` custom property) and `helper-classes.md` (utility classes).

## Adding a component

Create `scss/components/_name.scss`, wrap its rules in `@mixin styles { … }`, `@use` it in `scss/_custom-styles.scss` and add `@include name.styles;` at the matching place in the cascade. A partial that is not included prints nothing. Settings go at the top of the partial as `!default` variables or custom properties; `_custom-settings.scss` keeps only what several partials share. Private custom properties start with `--_`, a public knob is `--f-<component>-…`.

## Configuring

Pass settings with `@use … with (…)` to the partial that owns them, before the entry loads it:

```scss
@use "custom-includes/s-button" with ($button-padding: 1rem);
@use "app";
```

The fork keeps only the Foundation components it builds (`_custom-foundation-includes.scss`): off-canvas, top-bar, title-bar, drilldown, media-object, sticky, table, the float grid, the float classes and Motion UI are gone. Take one from Foundation 6.9 if a project needs it.

## Colors and theming

CSS custom properties are the source of truth; Sass only holds the palettes that generate them (`scss/_colors.scss`). Use the roles directly, also in Foundation settings (`$card-background: var(--f-color-bg-1)`), so components stay themeable at runtime. Roles, palette, light and dark, tinting and dark-mode troubleshooting: `docs/colors.md`; every other token: `docs/variables.md`.

## The two builds

`app.css` styles pages we own. `app-backend.css` is loaded into pages we do not own (wp-admin screens, and the KISDarchiv theme `ark`, which prints the Spaces header), so every component rule is wrapped in `.f` and only markup carrying that class is styled. The backend entry does this by including `bundle.styles` (every partial's `styles` mixin) inside `.f`.

## Notes

Single-component traps are why-comments at the top of the component's partial; tooling is in `AGENTS.md`.

- A custom property resolves where it is declared, so a token derived from one the `themed` rule changes is redeclared there through the mixin that prints it (`brand-colors`, `drop-shadows`, `text-tints` in `_custom-functions.scss`); a new derived token goes into one of them, or it keeps the untinted value inside a tinted card.
- Outside `.f` in the backend build: tokens (custom properties belong on `:root`; nested they become `.f :root` and never match), the palette (always light, applied to `:root` directly, no `color-scheme` set on the host page), and normalize (it loads before the host's stylesheets, so their element rules win on order). The exception is `box-sizing`: the backend narrows `$box-sizing-root` / `$box-sizing-all` to `.f` / `.f *`, so a foreign page's layout is not resized. The build ends with a block that turns off the dark variants of `select` and `.show-/.hide-for-dark-mode`, which still key off `prefers-color-scheme` on the host's `:root`.
- `.f`-scoped rules are one class stronger than the host's own: a consumer stylesheet that must win in `ark` or wp-admin needs a matching selector (e.g. `.f div` beats a bare `.space-title`).
- The breakpoints are not Foundation's: medium 30em (480px), large 45em (720px), xlarge 60em, xxlarge 75em (`util/_breakpoint.scss`). Hand-written media queries must use these. Scripts read them from the `--f-breakpoint-<name>` tokens with `matchMedia`, not Foundation's MediaQuery.
- Keyboard focus is one rule (`_focus.scss`): a `:focus-visible` outline set by the `--f-focus-*` tokens (width, offset, radius; the color `--f-focus-color` is brand-text at 70%, set with the brand), outside the element. A click into a text field matches `:focus-visible` too, so after a mouse or touch interaction fields show only their focus border. A container that clips its children (overflow, scroller, card edge) sets `--f-focus-offset: var(--f-focus-inset)` so its rings are drawn inside; consumers do the same, never their own outline. A consumer rule that sets `outline: none` on `:focus` beats it, so never reset the outline on `:focus`. The what-input reset (`normalize.scss`) hides only `:focus:not(:focus-visible)` after mouse or touch: its intent stays "mouse" while keys go into a field, so keying a ring on `[data-whatintent=keyboard]` misses Tab out of a mouse-focused field; key it on `:focus-visible`. Script reads of the outline need a frame: `transition: all` animates it.
- Reduced motion is one rule (`_motion.scss`), not one per component: every transition and animation ends after 0.01ms (not 0s: scripts wait for `transitionend`), except `.spinner`. `data-motion="reduce"` or `"full"` on an element (a user setting, usually `<html>`; the demo's switches) overrides the device's choice for its subtree; the selectors stay compounds so the `.f` scope still matches. Where the page has jQuery, `js/app.js` makes its `$.fx.off` a getter over both.
- Stacking: page layers read `--f-z-header` / `-overlay` / `-dropdown` (from `$z-index`), so Spaces can stack against them. Modals (`dialog.reveal`, `showModal()`), `.popover[popover]` panes, dropdown menu panels and the tooltip are in the top layer, above every z-index; a modal makes the rest of the page inert, so an overlay opened from inside one (a React Aria modal, say) must be rendered into the dialog. Stacking inside a component keeps small literal numbers (avatar 20 and the `10 + n` spaces-markup `Markup.php` writes inline into avatar stacks are local). The position prototype (`.position-fixed-top`, …) keeps Foundation's numbers.
- Vendor prefixes are hand-written; there is no autoprefixer. The ones current Safari still needs: `-webkit-user-select`, `-webkit-text-size-adjust`, `-webkit-text-decoration` (shorthand).
- A Sass color passed into a `border-color` shorthand (`css-triangle`) must not be `inherit`: CSS-wide keywords cannot share a shorthand with other values, and the whole declaration is dropped.
- Pages: `build-html.js` needs only `marked` and `highlight.js`, so the workflow builds `index.html` without gulp or sass and deploys the committed `css/`: rebuild and commit `css/` before pushing a style change. GitHub Pages caches every file for 10 minutes and its headers cannot be set, so local `.css`/`.js` URLs get a content hash (`?v=…`); files loaded from inside them (fonts, images) are not versioned.
