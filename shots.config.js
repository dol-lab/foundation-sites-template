// Interaction states for `bun run shots`: name → { click: [selector…], target?, widths? }.
// The selectors are clicked in order on a fresh page (Playwright syntax, `:text-is()` works),
// then `target` is shot, or the viewport (900px high) without one. `widths` limits the state
// to some of 375 and 1280, e.g. for items that only show in the large-screen header.
module.exports = {
  "header-spaces": {
    click: ["#app-header li.menu-main-expand.navbar-icon > a"],
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
};
