# Tooltip

`data-tooltip` with a `title` shows the title in a popover above the element (below it without room) on hover, keyboard focus and tap; Escape, a click elsewhere or scrolling hides it. On first contact `js/app.js` moves the `title` to `data-tooltip` and `aria-description`, so the browser's own tooltip stays hidden. Keyboard users reach only a trigger that takes focus (a link, a button or `tabindex="0"`); one inside a link or button never does.

```html example row
<button class="button hollow" type="button" data-tooltip title="Saved 3 minutes ago">Save</button>
<span data-tooltip tabindex="0" title="August 8, 2025">3 weeks ago</span>
```

For more than a line, `data-tooltip-content="<id>"` names a `hidden` element whose children the tooltip shows instead; the trigger gets an `aria-describedby` pointing at it unless it has one. The tooltip ignores the pointer, so put no links or buttons in it.

```html example row
<button class="button hollow" type="button" data-tooltip data-tooltip-content="tip-roles">Roles</button>
<div hidden id="tip-roles"><p><strong>Authors</strong></p><ul><li>write posts</li><li>upload files</li></ul></div>
```
