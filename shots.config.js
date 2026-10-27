// Interaction states for `bun run shots`: name → { click: [selector…], focus?, target?, widths? }.
// The selectors are clicked in order on a fresh page (Playwright syntax, `:text-is()` works),
// then `focus` gets keyboard focus, then `target` is shot, or the viewport (900px high) without one. `widths` limits the state
// to some of 375 and 1280, e.g. for items that only show in the large-screen header.
module.exports = {
  "header-spaces": {
    click: ["#app-header li.menu-main-expand.navbar-icon > a"],
    widths: [1280],
  },
  "space-card-focus": {
    click: ["#app-header li.menu-main-expand.navbar-icon > a"],
    focus: "#spaces-mine .card-anchor",
    target: "#spaces-mine .auto-grid",
    widths: [1280],
  },
  "user-card-focus": {
    click: [],
    focus: "#demo-user-1",
    target: "#user-card .demo-preview:has(#demo-user-1)",
    widths: [1280],
  },
  "header-study": {
    click: ['#app-header a.menu-anchor:text-is("Study")'],
    widths: [1280],
  },
  "header-labs": {
    click: ['#app-header a.menu-anchor:text-is("Labs")'],
    widths: [1280],
  },
  "header-avatar": {
    click: ["#app-header li.avatar > a"],
  },
  "demo-controls": {
    click: [],
    target: "#demo-controls",
  },
  "markup-open": {
    click: ["#buttons .demo-markup > summary"],
    target: "#buttons .demo-example",
  },
  "button-group-solid-focus": {
    click: [],
    focus: "#button-group .button-group:not(.hollow) > :nth-child(2)",
    target: "#button-group .demo-example",
    widths: [1280],
  },
  "button-group-hollow-focus": {
    click: [],
    focus: "#button-group .button-group.hollow > :nth-child(2)",
    target: "#button-group .demo-example:has(.hollow)",
    widths: [1280],
  },
  "modal-open": {
    click: ['[data-open="demo-modal"]'],
  },
};
