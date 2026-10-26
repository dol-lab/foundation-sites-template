# foundation-sites-template

A themeable fork of [Foundation for Sites 6](https://get.foundation/sites/docs/): Sass source plus the built `css/app.css` and `css/app-backend.css`. Consumers (spaces-markup, via composer) load the built files from `css/`; they never run this build.

## Build

```sh
bun install
bunx gulp sass   # builds both css files (about 2 s)
bun start        # watch, plus the demo page index.html (built from index.src.html + html-partials/)
bun run lint     # stylelint on scss/
```

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

- Delete the stale tracked builds in `scss/` (`app*.css*`), `yarn.lock`, `package-lock.json`, `.github/`, `migrations/`; then `bun install` to resync `bun.lock`.
- Demo markup: drop `.badge-space` and the top-bar and drilldown demos (now unstyled).
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
- Info chips: a static chip is flat (hairline ring, no fill, full-contrast label); a clickable one (`[href]`, `<button>`, `.clickable`) gets a surface and a shadow, and does not move on hover. `[href]` is the signal because chips are `<a>` even without a link. The ring is a `0 0 0 1px` shadow (no layout cost), the shadow uses `--f-color-shadow` (never a text-derived color, which glows on dark), and the state selectors sit in `:where()` so `.hollow` and `.clear` still win.
- `<details>` is unstyled unless it asks: `.details` (look and open animation), `.details-animated` (animation only), or any `<details>` inside `.user-generated`. Its `::details-content` is not matched by `*`, so the box model gets a rule of its own there (`_custom-normalize.scss`); without it everything inside a `<details>` is content-box.
- `js/app.js` folds `[data-collapse="<breakpoint>"]` (a `<details>` or a Foundation `.accordion`) from that breakpoint up to the next one, on load. A `<details>` holding the URL's `:target` stays open.
