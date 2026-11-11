# AGENTS.md

Rules for coding agents in this repo. How the build, the demo page and the files work is in `README.md`; traps and design decisions are in its `## Notes`. Before you change something, read the README section you need and grep `## Notes` for your subject; do not read it whole.

## Reading

- Do not read `index.html`, `llms.txt`, `css/*.css(.map)` or `node_modules/`: they are built (`.ignore` keeps them out of ripgrep; never commit a second copy of a build output; `css/*.css` and `llms.txt` are committed on purpose, for consumers). `css/*.css` is one line, so grep it only with `-o` and a short pattern (`grep -bo` gives the cascade order).
- `html-partials/_main-nav.html` and `_space-sidebar.html`: grep, never read whole. `bun run outline <partial>` replaces reading a large partial.
- A change may already exist: grep README `## Notes` and `git log -S'<key string>'` for its subject first.

## Checking

### After an edit

- `bun run check <section-id|state…>` builds, lints and shoots, and prints only failures and changed shots with their changed region. `--scheme=light` or `--scheme=dark` shoots one scheme only, `--css-diff` adds `bun run css-diff`.
- Lint passes on the whole tree; keep it that way. `bun run lint` is stylelint on all SCSS and Prettier on JS (`bun run lint:fix`, `bun run format`). A lint exception in `stylelint.config.js` says why; anything else is fixed or disabled inline with a `-- reason`.
- `bun run shots [id…]` writes `shots/<id>@<width>.png` (375 and 1280px), `<id>@<width>-dark.png` and a `.json` of its elements; a changed shot keeps `.prev.png` and a `.diff.png`. Open a `.diff.png` crop only if the text does not answer the question, a full shot only if the crop does not. How shots keep from flapping: `shots.js` and `lib/browser.js`.
- A component without a section of its own gets a small `docs/<id>.md`, so `check <id>` shoots only it.
- Open menus and keyboard focus are states in `shots.config.js`: `hover: [selector…]` (before the clicks), `click` (selectors or `"x,y"` viewport points), `focus: <selector>` (focuses, then Shift+Tab, Tab). Add one rather than a scratch Playwright script. Target a parent, since an outline outside the element is not in its shot.

### Asking the page: `bun run probe`

Ask before you look: `probe` prints JSON and replaces scratch Playwright and CDP scripts. Every mode takes `--state=<name>` (from `shots.config.js`), then `--hover=<selector>` and `--click=<selector|x,y>` (repeatable, run in the order given; `x,y` clicks viewport coordinates, e.g. outside a popover to test light dismiss), and `--width=`, `--scheme=dark`.

- Which rule sets a value: `bun run probe '<selector>' <property…>` lists the matching rules with their SCSS line, plus box and computed values. `--hover='.button:visible'` for a hover color (`:visible` skips hidden first matches). `--width=375,800,1280` resizes the same page in turn (state applied once) and lists one entry per width under `widths`.
- Dark colors: `--scheme=dark`, not an in-page mode switch: right after one, `transition: all` still reports the old value.
- Overflow: `bun run probe --overflow ['<scope>'] --width=375,1280` lists per width `pageScrollsX` and every visible element wider than its box as `<element> <scrollWidth> > <clientWidth> <overflow-x> (in <parent>)`. `visible` ones are the suspects; `auto`/`hidden` boxes scroll or clip on purpose (their content is left out). Bleeds by design, not to fix: a nested `.grid-margin-x` (its negative margin reaches a few px into the outer gutter) and a `.details` summary (its hover tint `::before` covers the caret and the details' padding, about 19px).
- Jank of a touch drag (a sheet, a slider): `bun run probe --trace '<selector|x,y>' [--drag=0,300] [--steps=10]` (375px by default, Chromium only) drags a finger from the selector's visible center and lists per step the restyles, layouts, paints and `why`: Chromium's invalidation reasons with the script line that caused them and the selectors a change invalidated. Equal steps are merged; `release` runs until the sheet settles. Animations already running are paused first, so the demo's spinners do not hide the drag's own work. The steps carry no timestamps: a replay is a slow drag, never a flick.
- Firefox: `--browser=firefox` (Playwright's Firefox) prints box and computed values, no rules (no DevTools protocol). Shots are Chromium only; for a Firefox picture, shoot a scratch HTML page that links `css/app.css` with the system browser: `firefox --headless --no-remote --profile <empty scratch dir> --screenshot <png> file://<page>`.

### What the CSS output changed: `bun run css-diff`

- `bun run css-diff` prints the rules removed, added and changed (`~` with the changed declarations) in `css/app.css` against the last build that differed, so a parallel worker's edits stay apart if both build after each edit. Across several builds, or for a change meant to leave the output unchanged: copy `css/app.css` aside before, then `bun run css-diff <copy>` (`<old> <new>` for `app-backend.css`); it also flags rules that only moved.
- Before moving a rule up the cascade (e.g. an override into the Foundation rule it overrides): `bun run css-diff --between <selA> <selB> <prop>` lists the rules from the first rule with selector selA (the target spot) to the last with selB (the rule to move) that set prop or a shorthand/longhand of it, with their specificity; `--all` also shows rules not aimed at selB's subject.

## Checking in Spaces

Pages that use this library are checked from a Spaces site root with `wpb glance`: its `docs/testing.md`, "Checking a UI change".

## Writing

- Keep it simple and clean: one general rule over special cases, remove what nothing uses.
- Deprecated classes stay as aliases, marked in a comment and in `docs/helper-classes.md`, until their users are gone.
- Lasting knowledge (a trap, a seam, why a rule exists) about one component goes into a short why-comment at the top of its partial (or its `docs/<id>.md` if users need it); only cross-cutting traps (cascade, `.f` scope, tokens, build, breakpoints) go into `README.md` `## Notes`, folded into the matching entry.
