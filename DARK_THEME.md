# Dark Theme: Troubleshooting Guide

Companion to [VARIABLES.md](VARIABLES.md) (which documents *what exists*). This
one is for the other direction: **"my component looks broken in dark mode — why?"**

Written for whoever (human or AI) picks this up next. Start at
[the checklist](#the-30-second-checklist).

---

## The 30-second checklist

Symptoms, most common cause first:

| Symptom                                    | Cause                                                          |
| ------------------------------------------ | -------------------------------------------------------------- |
| Light text on a white box (unreadable)     | Hard-coded `background: #fff` with no `color` set               |
| Dark text on a dark box                    | Hard-coded `color: #333` (or `#000`) with no `background` set   |
| Component ignores the theme entirely       | Hard-coded hex values instead of `--f-color-*` roles            |
| Shadow looks like a grey halo              | Hard-coded `rgba(0,0,0,…)`; use `var(--f-drop-shadow)`          |
| Borders vanish                             | `border-color` from a fixed grey; use `--f-color-border-0..2`   |
| Component is correct, *your* override isn't | Specificity — see [§4](#4-specificity-your-override-vs-the-theme) |
| Correct in the site, wrong in wp-admin     | Admin/editor contexts are deliberately excluded — see [§3](#3-where-the-roles-are-applied) |

**The one rule:** never set `background` without `color`, or `color` without
`background`. Setting only one leaves the other inherited from a theme that may
have flipped underneath you. Either set both from `--f-color-*` roles, or set
neither and let the component's own theme rules do it.

---

## 1. Consume roles, not colors

Colors live in CSS custom properties so they can flip at runtime. Sass color
variables deliberately point at them (`$color-bg-1: var(--f-color-bg-1)`).

```css
/* ✗ breaks in dark mode */
.thing {
  background: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* ✓ follows the theme */
.thing {
  background: var(--f-color-bg-1);
  color: var(--f-color-text-1);
  border: 1px solid var(--f-color-border-1);
  box-shadow: var(--f-drop-shadow);
}
```

Roles you want most of the time: `--f-color-bg-0..2`, `--f-color-text-0..2`,
`--f-color-border-0..2`, `--f-drop-shadow`. Full table in
[VARIABLES.md §1](VARIABLES.md#1-color-roles).

### Rendering outside the stylesheet (PHP, JS, inline styles)

Custom properties work in inline styles and in `<style>` blocks printed at
runtime, so plugin output has no excuse to hard-code. When the stylesheet might
not be loaded at all, use the fallback argument:

```php
background: var( --f-color-bg-1, #fff );
color: var( --f-color-text-1, #1d2327 );
```

Light-mode values as fallbacks are fine — if the variable is missing, Foundation
is missing, and there is no dark theme to clash with.

## 2. Prefer an existing component over re-styling

Most "make it themeable" work is already done. A notice/banner is a
`.callout` plus a palette class, and it is theme-correct for free:

```html
<div class="callout success">Saved.</div>
<div class="callout alert">Something went wrong.</div>
```

Palette classes: `primary`, `secondary`, `success`, `warning`, `alert`. Note the
error variant is **`alert`**, not `error` or `danger` — a wrong name silently
falls back to the default token rather than erroring.

`.callout` derives its background, border, and text color from
`--f-color-<name>` via `color-mix()`, so all five variants work in both themes.
The palette itself differs per mode (`$foundation-palette` vs
`$foundation-palette-darktheme`), which is why hard-coding the "same" green as a
hex is not equivalent.

**The classic mistake:** adding `class="callout success"` and then overriding it
with an inline `style="background: #fff"`. Now the box is white in both themes
while the text color still comes from the theme. Pick one system.

## 3. Where the roles are applied

Selection cascade, first match wins (see
`scss/custom-styles/_root-variables.scss`):

1. **Forced:** `<html data-theme="light">` / `<html data-theme="dark">`
2. **OS preference:** `prefers-color-scheme: dark` when no `data-theme` is set
3. **Default:** light

Two details that cause "it works for me" bug reports:

- **In OS-preference mode the roles land on `body`, not `:root`.** The selector
  is `:root:not([data-theme]) body:not(…)`. Anything that reads the variables
  above `<body>`, or renders outside it, gets light values while the page looks
  dark. Forced `data-theme` mode applies at the root and does not have this
  split.
- **Admin and editor contexts are excluded on purpose** — the OS-preference rule
  skips `.editor-styles-wrapper`, `.wp-editor`, and `.wp-admin`, so the Gutenberg
  iframe and TinyMCE don't get a dark canvas the editor doesn't expect. A
  component that only misbehaves in wp-admin is usually hitting this, not a bug.

`foundation-apply-theme()` also sets `color-scheme`, which is what makes native
form controls, scrollbars, and `<select>` popups follow along. If those look
wrong in an isolated subtree, that subtree is likely missing the theme roles
entirely.

## 4. Specificity: your override vs. the theme

When you add fallback styling to a component that *also* carries theme classes,
keep your rule **less specific** so the theme still wins when it is loaded:

```css
/* Fallback — 0,1,0. Only applies when Foundation is absent. */
.my-notice {
  background: #fff;
  color: #1d2327;
}

/* Foundation's .callout.success is 0,2,0 and beats it. */
```

Source order does not save you here: a `<style>` block printed in the footer
comes *after* the enqueued stylesheet, so an equal-specificity rule of yours
would win and silently break dark mode. Use specificity, not order, to express
"this is only a fallback." Conversely, put your own **layout** rules (position,
flex, spacing) behind an id or a compound selector so they reliably apply — it
is only the *colors* that should yield.

## 5. Tinted surfaces (`--f-color-theme`)

If a component sits inside a `themed` subtree, its background is derived from
that subtree's `--f-color-theme`, in both modes. Two consequences:

- Don't assume `--f-color-bg-1` is the *page* background — inside a tinted card
  it is the card's. Pick the role by meaning, not by the color you saw once.
- The whole derivation is wrapped in
  `@supports (color: oklch(from red l c h))`. Browsers without relative `oklch()`
  fall back to the flat palette, so verify there before calling it a bug.

Details and the light/dark derivation table:
[VARIABLES.md §3](VARIABLES.md#3-page-wide-tinting-via---f-color-theme).

## 6. How to actually verify a fix

Check **both** modes, and check the forced and OS-preference paths separately —
per §3 they apply the roles at different elements.

```js
// In DevTools: force a mode without touching OS settings.
document.documentElement.dataset.theme = "dark";
document.documentElement.dataset.theme = "light";
delete document.documentElement.dataset.theme; // back to OS preference
```

Then use DevTools' "Emulate prefers-color-scheme" to cover path 2. Inspect the
element and read the *computed* value of the custom properties — a rule that
looks right in the Styles pane may be losing to a more specific one, and the
computed value is what tells you.
