// `bun has-check.js [file.css…]` (part of `bun run lint`; default css/app.css, css/app-backend.css): fails on a
// `:has()` or a `[style…]` followed by a combinator into a compound that names no class, id or attribute (`span`,
// `img`, `*`, `:not(.x)`; `body` is one element). Chromium then restyles every element that compound matches: for
// `:has()` page-wide on each DOM insertion, for `[style]` inside any element whose inline style changes, on each
// change (README, Notes). Put the `:has()` or `[style]` on the styled element, or give the target a class.
const fs = require("node:fs");
const path = require("node:path");

// Splits a complex selector into its compounds, at combinators outside parentheses, brackets and strings.
// @param {string} selector
// @return {string[]}
function compounds(selector) {
  const out = [""];
  let depth = 0;
  let quote = "";
  for (const c of selector) {
    if (quote) quote = c === quote ? "" : quote;
    else if (c === '"' || c === "'") quote = c;
    else if (c === "(" || c === "[") depth++;
    else if (c === ")" || c === "]") depth--;
    if (!quote && depth === 0 && /[\s>+~]/.test(c)) {
      if (out.at(-1)) out.push("");
      continue;
    }
    out[out.length - 1] += c;
  }
  return out.filter(Boolean);
}

// Splits a selector list at top-level commas.
// @param {string} list
// @return {string[]}
function selectors(list) {
  const out = [""];
  let depth = 0;
  for (const c of list) {
    if (c === "(" || c === "[") depth++;
    else if (c === ")" || c === "]") depth--;
    if (c === "," && depth === 0) out.push("");
    else out[out.length - 1] += c;
  }
  return out.map((s) => s.trim()).filter(Boolean);
}

// @param {string} compound
// @return {boolean} Whether the compound names a class, id or attribute (outside `:not()` and `:has()`).
function narrow(compound) {
  let rest = compound;
  while (/:(not|has)\(/.test(rest)) {
    const at = rest.search(/:(not|has)\(/);
    let depth = 0;
    let end = at;
    for (; end < rest.length; end++) {
      if (rest[end] === "(") depth++;
      else if (rest[end] === ")" && --depth === 0) break;
    }
    rest = rest.slice(0, at) + rest.slice(end + 1);
  }
  return /[.#[]/.test(rest) || /^body\b/.test(rest);
}

const files = process.argv.slice(2);
const targets = files.length ? files : ["css/app.css", "css/app-backend.css"].map((f) => path.join(__dirname, f));
let found = 0;
for (const file of targets) {
  const css = fs.readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  for (const [, prelude] of css.matchAll(/(?:^|[{};])\s*([^{}@;\s][^{};]*)\{/g)) {
    for (const selector of selectors(prelude)) {
      const parts = compounds(selector);
      if (parts.slice(0, -1).some((p) => /:has\(|\[style/.test(p)) && !narrow(parts.at(-1))) {
        console.log(`${path.basename(file)}: ${selector}`);
        found++;
      }
    }
  }
}
if (found) {
  console.log(
    `✗ ${found} selector(s) with :has() or [style] before a target without a class, id or attribute (see has-check.js)`,
  );
  process.exit(1);
}
