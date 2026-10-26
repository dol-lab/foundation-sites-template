// The element tree of a partial, so a large one is navigated by structure instead of read:
// `bun run outline <partial> [depth]` (default 4) prints `tag#id.class  :line` per element,
// and the @@include()s. <partial> is a path or a name in html-partials/ (`space-sidebar`).
const fs = require("node:fs");
const path = require("node:path");

const VOID = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
]);
const RAW = new Set(["script", "style", "svg", "pre", "textarea"]);
const TOKEN_RE =
  /<!--[\s\S]*?-->|@@include\((['"])([^'"]+)\1\)|<\/([a-zA-Z][\w-]*)\s*>|<([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;

/**
 * @param {string} arg A path, or a partial's name with or without `_` and `.html`.
 * @return {string} The file to read.
 */
function resolve(arg) {
  if (fs.existsSync(arg)) return arg;
  const name = path
    .basename(arg)
    .replace(/^_?/, "_")
    .replace(/(\.html)?$/, ".html");
  return path.join(__dirname, "html-partials", name);
}

/**
 * @param {string} attrs The attribute part of a start tag.
 * @return {string} #id.class.class
 */
function label(attrs) {
  const id = attrs.match(/\sid=["']([^"']*)/)?.[1];
  const cls =
    attrs
      .match(/\sclass=["']([^"']*)/)?.[1]
      .trim()
      .split(/\s+/)
      .filter(Boolean) || [];
  return (id ? `#${id}` : "") + cls.map((c) => `.${c}`).join("");
}

const file = resolve(process.argv[2] || "");
if (!fs.existsSync(file)) {
  console.error("usage: bun run outline <partial> [depth]");
  process.exit(2);
}
const maxDepth = Number(process.argv[3]) || 4;
const src = fs.readFileSync(file, "utf8");
const lineAt = (index) => src.slice(0, index).split("\n").length;

const stack = [];
let raw = null;
for (const m of src.matchAll(TOKEN_RE)) {
  const [token, , include, closing, opening, attrs] = m;
  if (raw) {
    if (closing?.toLowerCase() === raw) {
      raw = null;
      stack.pop();
    }
    continue;
  }
  if (token.startsWith("<!--")) continue;
  if (include) {
    if (stack.length < maxDepth) console.log(`${"  ".repeat(stack.length)}@@include ${include}  :${lineAt(m.index)}`);
    continue;
  }
  if (closing) {
    // Tolerates unclosed elements: pop to the matching tag, if any.
    const at = stack.lastIndexOf(closing.toLowerCase());
    if (at !== -1) stack.length = at;
    continue;
  }
  const tag = opening.toLowerCase();
  if (stack.length < maxDepth) console.log(`${"  ".repeat(stack.length)}${tag}${label(attrs)}  :${lineAt(m.index)}`);
  if (VOID.has(tag) || attrs.trim().endsWith("/")) continue;
  stack.push(tag);
  if (RAW.has(tag)) raw = tag;
}
