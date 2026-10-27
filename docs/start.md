# Getting started

The styles of [Spaces](https://spaces.kisd.de): a themeable fork of [Foundation for Sites 6](https://get.foundation/sites/docs/). Every component on this page shows its markup below it. The source is on [GitHub](https://github.com/dol-lab/foundation-sites-template).

## Two builds

- `css/app.css` styles pages we own.
- `css/app-backend.css` goes into pages we don't own (wp-admin, the KISDarchiv theme). It only styles markup inside `.f`.

```html
<link rel="stylesheet" href="css/app.css">
```

## Theming

The palette follows the device's light or dark mode. Attributes on any element change it for that element and everything inside:

- `data-theme="light"` or `"dark"` forces a mode.
- `themed` with `--f-color-theme` tints the surfaces toward a hue. Every Space does this with its own color.
- `--f-color-brand-base` overrides the brand color, `--f-radius` every corner.

```html
<html themed style="--f-color-theme: #975938">
```

## For agents

[llms.txt](llms.txt) links every section of this page as markdown (`docs/<id>.md`): its prose and the markup of each example. Those files are the source of the page.

## Build

`bun install`, then `bun run build` (CSS), `bun run build:html` (this page and `llms.txt`) or `bun start` (both, then watch and serve). Edit `docs/`, `index.src.html` and `html-partials/`, never `index.html`.
