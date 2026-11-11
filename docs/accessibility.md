# Accessibility

Rules a page and a consumer stylesheet follow so the library's focus ring, motion setting, layers and contrast keep working. Each component's keys are in its own section ([tabs](tabs.md), [menus](menus.md), [modal](modal.md), [tooltip](tooltip.md), [radio tabs](radio-tabs.md)).

## Focus

Keyboard focus is one ring for everything: an outline on `:focus-visible`, drawn outside the element and set by tokens.

| Token              | Value                       | Use                                                          |
| ------------------ | --------------------------- | ------------------------------------------------------------ |
| `--f-focus-color`  | text-0 at 60%               | neutral, 3:1 on bg-0 to bg-2 in both modes                   |
| `--f-focus-width`  | 2px                         |                                                              |
| `--f-focus-offset` | 1px                         | the gap to the element; set it to `--f-focus-inset` to draw inside |
| `--f-focus-inset`  | minus the width             |                                                              |
| `--f-focus-radius` | `--f-radius`                | for an element without a radius of its own                   |

- **Never** set `outline: none` on `:focus` (or `:focus-visible`): it beats the ring. To change the ring, set the tokens.
- A container that clips its children (`overflow`, a scroller, a card's edge) sets `--f-focus-offset: var(--f-focus-inset)`, so the rings inside it are drawn within its box. Cards, tabs, details menus, scroll-snap rows, avatars and icon buttons do this already.
- A wrapper that shows a hidden input (checkbox, switch, radio tabs) gets the ring itself. A consumer wrapper of a field keys on `[data-focus-mode="keyboard"] .wrapper:has(:focus-visible)`.
- Text fields show the ring only when reached by keyboard: clicked or typed into, their focus border and caret mark them. `js/app.js` sets `data-focus-mode` (`keyboard`, `pointer`, `typing`) on `<html>` for this.
- Every control is reachable by Tab (a `<button>` or a link, not a clickable `div`), no positive `tabindex`.

```html example row
<button class="button">Tab to me</button>
<div class="card"><a class="card-section" href="#accessibility">A link spanning a card: ring inside</a></div>
```

## Names

An icon without text needs a name: `aria-label` on its button or link, or a `.sr-only` text beside it ([icons](icons.md)). `.sr-only` hides text visually and keeps it for screen readers (Foundation's `.show-for-sr` does the same); `.show-on-focus-within` reveals a hidden row of skip links once one has focus. Fields have a `<label>`, help and error texts are tied to them ([forms](forms.md)).

## Reduced motion

One rule (`_motion.scss`) ends every transition and animation after 0.01ms when the device asks for reduced motion; a component needs no rule of its own (scripts still get `transitionend`). `.spinner` keeps turning. `data-motion="reduce"` or `"full"` on an element, usually `<html>` from a user setting, overrides the device for its subtree. A script that animates by itself (`scrollIntoView`, the Web Animations API) checks `prefers-reduced-motion` and `data-motion` on `<html>` first.

## Layers

Modals (`<dialog class="reveal">` with `showModal()`), popover panes, dropdown menu panels and the tooltip open in the browser's top layer, above every `z-index`. A modal makes the rest of the page inert, so an overlay opened from inside one (a React Aria modal, a picker) must be rendered into the dialog, or it cannot be reached. Page layers stack with `--f-z-header`, `--f-z-overlay`, `--f-z-dropdown`; use these rather than large numbers.

## Contrast

Text takes `--f-color-text-0` to `-2`; text in a palette color takes its `-text` token (`--f-color-alert-text`), which keeps 4.5:1 on every surface in both modes ([colors](colors.md)). Icon buttons use `--f-icon-color` (3:1 at rest). Color alone never carries a meaning: links in running text are underlined, an invalid field also has an error text.
