# Tooltip

`data-tooltip` with a `title` shows the title in a small popover above the element (below it without room) on hover, keyboard focus and tap; Escape, a click elsewhere or scrolling hides it. `js/app.js` runs it, delegated, so later markup works: on first contact the `title` moves to `data-tooltip` and to `aria-description`, so the browser's own tooltip does not show as well. Keyboard users only reach a trigger that takes focus: a link or button, or else `tabindex="0"`. A trigger inside a link or button never gets focus itself, so its text is for pointers only.

```html example row
<button class="button hollow" type="button" data-tooltip title="Saved 3 minutes ago">Save</button>
<span data-tooltip tabindex="0" title="August 8, 2025">3 weeks ago</span>
```

For more than a line of text, `data-tooltip-content="<id>"` names a `hidden` element whose children the tooltip shows instead of the `title`; unless the trigger has an `aria-describedby`, it gets one pointing at that element, so screen readers read the same text. The content is copied on each show and cannot be clicked (the tooltip has `pointer-events: none`): no links or buttons in it.

```html example row
<button class="button hollow" type="button" data-tooltip data-tooltip-content="tip-roles">Roles</button>
<div hidden id="tip-roles"><p><strong>Authors</strong></p><ul><li>write posts</li><li>upload files</li></ul></div>
```
