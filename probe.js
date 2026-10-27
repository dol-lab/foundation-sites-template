// What styles an element of the demo page, as JSON: box, computed values and the CSS rules
// that match it, with their SCSS source line (via css/*.map) or their line in index.html.
// `bun run probe '<selector>' [property…] [--width=375[,800…]] [--state=<shots.config.js name>] [--scheme=dark]`.
// With properties, only rules declaring them are listed, for inheriting ones also on ancestors.
// Several widths resize the same page in turn (state applied once) and list one entry per width under `widths`.
const fs = require("node:fs");
const path = require("node:path");
const { fileURLToPath } = require("node:url");
const { ROOT, STATES, HEIGHT, launch, openDemo, applyState } = require("./lib/browser");

const DEFAULT_PROPS = [
  "display",
  "position",
  "width",
  "height",
  "margin",
  "padding",
  "font-size",
  "line-height",
  "color",
  "background-color",
];
// Properties that inherit: only for these do rules on ancestors count.
const INHERITED =
  /^(--|color$|font|line-height|letter-spacing|word-spacing|text-(align|indent|transform|shadow|wrap|rendering)|white-space|visibility|cursor|list-style|direction|quotes|hyphens|tab-size|writing-mode|caret-color|accent-color|color-scheme)/;
const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

/**
 * Decodes a source map's mappings.
 *
 * @param {object} map Source map v3.
 * @return {Array<Array<number[]>>} Per generated line: [column, source, line, column] segments.
 */
function decodeMappings(map) {
  const state = [0, 0, 0];
  return map.mappings.split(";").map((line) => {
    let col = 0;
    return line
      .split(",")
      .filter(Boolean)
      .map((segment) => {
        const values = [];
        let value = 0;
        let shift = 0;
        for (const ch of segment) {
          const digit = B64.indexOf(ch);
          value += (digit & 31) << shift;
          shift += 5;
          if (!(digit & 32)) {
            values.push(value & 1 ? -(value >> 1) : value >> 1);
            value = shift = 0;
          }
        }
        col += values[0];
        if (values.length < 4) return [col];
        for (let i = 0; i < 3; i++) state[i] += values[i + 1];
        return [col, ...state];
      });
  });
}

const maps = {};

/**
 * @param {string} cssFile Path of a built stylesheet.
 * @param {number} line 0-based line in it.
 * @param {number} col 0-based column.
 * @return {string|null} scss/<file>:<line>, or null without a map.
 */
function sourceOf(cssFile, line, col) {
  if (!(cssFile in maps)) {
    const mapFile = cssFile + ".map";
    if (!fs.existsSync(mapFile)) return (maps[cssFile] = null);
    const map = JSON.parse(fs.readFileSync(mapFile, "utf8"));
    maps[cssFile] = { map, lines: decodeMappings(map) };
  }
  const entry = maps[cssFile];
  if (!entry) return null;
  const segment = (entry.lines[line] || []).filter((s) => s[0] <= col && s.length > 1).pop();
  if (!segment) return null;
  const file = path.join(path.dirname(cssFile), entry.map.sourceRoot || "", entry.map.sources[segment[1]]);
  return `${path.relative(ROOT, file)}:${segment[2] + 1}`;
}

/**
 * @param {string} name A declared property.
 * @param {string[]} props Requested properties.
 * @return {boolean} Whether it sets one of them (shorthands and longhands both count).
 */
const declares = (name, props) => props.some((p) => name === p || name.startsWith(p + "-") || p.startsWith(name + "-"));

(async () => {
  const opts = Object.fromEntries(
    process.argv
      .slice(2)
      .filter((a) => a.startsWith("--"))
      .map((a) => a.slice(2).split("=")),
  );
  const [selector, ...props] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  if (!selector) {
    console.error(
      "usage: bun run probe '<selector>' [property…] [--width=375[,800…]] [--state=<name>] [--scheme=dark]",
    );
    process.exit(2);
  }
  if (opts.state && !STATES[opts.state]) {
    console.error(`no state ${opts.state} in shots.config.js`);
    process.exit(2);
  }

  const widths = (opts.width || "1280").split(",").map(Number);
  const browser = await launch();
  try {
    const page = await openDemo(browser, widths[0], opts.scheme);
    if (opts.state) await applyState(page, STATES[opts.state]);
    const el = page.locator(selector);
    const count = await el.count();
    if (!count) {
      console.error(`${selector}: no match`);
      process.exit(1);
    }

    // Matched rules come from the DevTools protocol, which knows their stylesheet and position.
    const cdp = await page.context().newCDPSession(page);
    const sheets = {};
    cdp.on("CSS.styleSheetAdded", ({ header }) => (sheets[header.styleSheetId] = header));
    await cdp.send("DOM.enable");
    await cdp.send("CSS.enable");
    const marker = "data-probe-target";
    await el.first().evaluate((node, m) => node.setAttribute(m, ""), marker);

    const results = [];
    for (const [i, width] of widths.entries()) {
      if (i) {
        await page.setViewportSize({ width, height: HEIGHT });
        // Foundation and the demo throttle their resize handlers.
        await page.waitForTimeout(300);
      }
      results.push({ width, ...(await probe(cdp, sheets, el, marker)) });
    }
    const out = results.length > 1 ? { widths: results } : results[0];
    console.log(JSON.stringify({ selector, count, ...out }, null, 2));
  } finally {
    await browser.close();
  }

  /**
   * @param {object} cdp The page's DevTools session.
   * @param {object} sheets Stylesheet headers by id.
   * @param {object} el Locator of the element.
   * @param {string} marker Attribute set on it.
   * @return {Promise<object>} Its element, box, computed values and matching rules.
   */
  async function probe(cdp, sheets, el, marker) {
    const shown = props.length ? props : DEFAULT_PROPS;
    const info = await el.first().evaluate((node, names) => {
      const r = node.getBoundingClientRect();
      const cs = getComputedStyle(node);
      return {
        element: node.outerHTML.slice(0, node.outerHTML.indexOf(">") + 1),
        box: { x: Math.round(r.x), y: Math.round(r.y + scrollY), width: r.width, height: r.height },
        computed: Object.fromEntries(names.map((n) => [n, cs.getPropertyValue(n)])),
      };
    }, shown);

    const { root } = await cdp.send("DOM.getDocument", { depth: 0 });
    const { nodeId } = await cdp.send("DOM.querySelector", { nodeId: root.nodeId, selector: `[${marker}]` });
    const matched = await cdp.send("CSS.getMatchedStylesForNode", { nodeId });

    const describe = (match, inherited) => {
      const { rule } = match;
      if (rule.origin !== "regular") return null;
      const wanted = inherited ? props.filter((p) => INHERITED.test(p)) : props;
      const decls = rule.style.cssProperties.filter((p) => p.range && (!props.length || declares(p.name, wanted)));
      if (props.length && !decls.length) return null;
      const sheet = sheets[rule.styleSheetId] || {};
      const sel = rule.selectorList.selectors[match.matchingSelectors[0]] || rule.selectorList.selectors[0];
      const start = sel.range || rule.style.range;
      let source;
      if (sheet.isInline) {
        source = `index.html:${start.startLine + 1} (inline <style>)`;
      } else if (sheet.sourceURL?.startsWith("file:")) {
        const cssFile = fileURLToPath(sheet.sourceURL);
        source =
          sourceOf(cssFile, start.startLine, start.startColumn) ||
          `${path.relative(ROOT, cssFile)}:${start.startLine + 1}`;
      } else {
        source = sheet.sourceURL || "?";
      }
      return {
        selector: sel.text,
        source,
        ...(inherited ? { inheritedFrom: inherited } : {}),
        declarations: decls.map((p) => `${p.name}: ${p.value}${p.important ? " !important" : ""}`).join("; "),
      };
    };

    // Most specific first, as in DevTools.
    const rules = [...matched.matchedCSSRules]
      .reverse()
      .map((m) => describe(m))
      .filter(Boolean);
    if (props.length) {
      for (const [depth, level] of (matched.inherited || []).entries()) {
        const up = "parent" + (depth ? `+${depth}` : "");
        rules.push(
          ...[...level.matchedCSSRules]
            .reverse()
            .map((m) => describe(m, up))
            .filter(Boolean),
        );
      }
    }
    return { ...info, rules };
  }
})();
