# Dark theme: troubleshooting

For "my component looks broken in dark mode". What exists is in [VARIABLES.md](VARIABLES.md).

## Checklist

| Symptom | Cause |
| --- | --- |
| Light text on a white box | Hard-coded `background: #fff` with no `color` |
| Dark text on a dark box | Hard-coded `color: #333` with no `background` |
| Component ignores the theme | Hex values instead of `--f-color-*` roles |
| Shadow looks like a grey halo | Hard-coded `rgba(0,0,0,…)`; use `var(--f-drop-shadow)` |
| Borders vanish | Fixed grey; use `--f-color-border-0..2` |
| Your override loses or breaks dark mode | Specificity, see below |
| Always light in wp-admin or `ark` | Intended: the backend build is light only |

**The one rule:** never set `background` without `color`, or the reverse. Set both from roles, or neither.

## Use roles and components

```css
.thing {
  background: var(--f-color-bg-1);
  color: var(--f-color-text-1);
  border: 1px solid var(--f-color-border-1);
  box-shadow: var(--f-drop-shadow);
}
```

In PHP or inline styles, add a light fallback for when the stylesheet is absent: `var( --f-color-bg-1, #fff )`.

A notice is a `.callout` plus a palette class (`primary`, `secondary`, `success`, `warning`, `alert`; the error variant is `alert`, a wrong name silently falls back). Do not override its colors inline: the box then stops following the theme while its text still does.

## How the mode is chosen

The palette is written with `light-dark()` on `:root`, which carries `color-scheme: light dark`, so it follows the OS. `data-theme="light"` or `"dark"` sets `color-scheme` on any element, and the roles flip for that subtree (a `light-dark()` value resolves against the element that uses it). Native controls, scrollbars and `<select>` popups follow `color-scheme` too. `app.css` is not loaded in wp-admin or the block-editor iframe, so those stay light without an exclusion.

## Specificity

A fallback rule for a component that also carries theme classes must be less specific than the theme (`.my-notice` at 0,1,0 loses to `.callout.success` at 0,2,0). Source order does not help: a `<style>` printed in the footer comes after the stylesheet and wins at equal specificity. Only colors should yield; layout rules may be as specific as they need.

## Tinted surfaces

Inside a `themed` subtree the surfaces derive from its `--f-color-theme`, so `--f-color-bg-1` there is the tinted card, not the page. Pick a role by meaning, not by the color you saw once.

## Verifying

```js
document.documentElement.dataset.theme = "dark";
document.documentElement.dataset.theme = "light";
delete document.documentElement.dataset.theme; // back to the OS
```

Cover the OS path with DevTools' "Emulate prefers-color-scheme", and read computed values, not the Styles pane.
