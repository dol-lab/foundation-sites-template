// Rule-level diff of two CSS files: `bun run css-diff [old.css] [new.css]`.
// Defaults: the previous build of css/app.css (kept by the gulp build in PREV_DIR) against
// css/app.css. Prints `-`/`+` for removed and added rules and `~` with the changed declarations
// for a rule whose selector stayed; nothing but a summary line if both hold the same rules.
// `bun run css-diff --between <selA> <selB> <prop> [file.css] [--all]`: the rules from the first
// rule with selector selA to the last one with selB that set prop (or a shorthand or longhand of
// it), in cascade order with their specificity, to see whether a rule moved from B up to A loses
// to one between. Without --all only rules aimed at selB's subject (a shared class, id or type).
const fs = require("node:fs");
const path = require("node:path");

const PREV_DIR = path.join(__dirname, "node_modules/.cache/css-prev");
const MAX_DECL = 160;

// Splits `text` at `sep` outside strings, comments, parentheses and braces.
// @param {string} text
// @param {string} sep A single character.
// @return {string[]}
function splitTop(text, sep) {
  const parts = [];
  let depth = 0;
  let quote = "";
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quote) {
      if (c === "\\") i++;
      else if (c === quote) quote = "";
    } else if (c === '"' || c === "'") quote = c;
    else if (c === "(" || c === "{") depth++;
    else if (c === ")" || c === "}") depth--;
    else if (c === sep && depth === 0) {
      parts.push(text.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(text.slice(start));
  return parts.map((p) => p.trim()).filter(Boolean);
}

// Flattens a stylesheet into rules: at-rule preludes and selectors joined to one key, plus the
// rule's own declarations (nested blocks become rules of their own).
// @param {string} css
// @param {string[]} [context] Preludes of the enclosing blocks.
// @param {object[]} [rules] Collects the result.
// @return {{key: string, sel: string, decls: string[]}[]}
function parse(css, context = [], rules = []) {
  const decls = [];
  let quote = "";
  let start = 0;
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (quote) {
      if (c === "\\") i++;
      else if (c === quote) quote = "";
    } else if (c === '"' || c === "'") quote = c;
    else if (c === "/" && css[i + 1] === "*") {
      const end = css.indexOf("*/", i + 2);
      if (css.slice(start, i).trim() === "") start = end + 2;
      i = end + 1;
    } else if (c === ";") {
      decls.push(...splitTop(css.slice(start, i), ";"));
      start = i + 1;
    } else if (c === "{") {
      let depth = 1;
      let j = i + 1;
      for (let q = ""; depth && j < css.length; j++) {
        const d = css[j];
        if (q) {
          if (d === "\\") j++;
          else if (d === q) q = "";
        } else if (d === '"' || d === "'") q = d;
        else if (d === "{") depth++;
        else if (d === "}") depth--;
      }
      parse(css.slice(i + 1, j - 1), [...context, css.slice(start, i).trim()], rules);
      i = j - 1;
      start = j;
    }
  }
  decls.push(...splitTop(css.slice(start), ";"));
  if (decls.length) rules.push({ key: context.join(" > ") || "(top level)", sel: context.at(-1) || "", decls });
  return rules;
}

// @param {string} file
// @return {{key: string, decls: string[], text: string}[]}
function read(file) {
  const css = fs.readFileSync(file, "utf8").replace(/\/\*# sourceMappingURL=.*?\*\/\s*$/, "");
  return parse(css).map((r) => ({ ...r, text: `${r.key}{${r.decls.join(";")}}` }));
}

// @param {string} decl
// @return {string}
const short = (decl) => (decl.length > MAX_DECL ? `${decl.slice(0, MAX_DECL)}…` : decl);

// Removes the rules both lists hold (as a multiset) and returns what is left of each.
// @param {object[]} a
// @param {object[]} b
// @return {[object[], object[]]}
function unmatched(a, b) {
  const counts = new Map();
  b.forEach((r) => counts.set(r.text, (counts.get(r.text) || 0) + 1));
  const restA = a.filter((r) => {
    const n = counts.get(r.text);
    if (!n) return true;
    counts.set(r.text, n - 1);
    return false;
  });
  const left = new Map(counts);
  const restB = b.filter((r) => {
    const n = left.get(r.text);
    if (!n) return false;
    left.set(r.text, n - 1);
    return true;
  });
  return [restA, restB];
}

// @param {string} sel
// @return {string} `sel` with the spaces around combinators dropped, as the build prints it.
const norm = (sel) =>
  sel
    .replace(/\s*([>+~,])\s*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

// Splits a selector into its compounds (outside parentheses).
// @param {string} sel
// @return {string[]}
function compounds(sel) {
  const parts = [""];
  let depth = 0;
  for (const c of norm(sel)) {
    if (c === "(") depth++;
    else if (c === ")") depth--;
    if (!depth && " >+~".includes(c)) parts.push("");
    else parts[parts.length - 1] += c;
  }
  return parts.filter(Boolean);
}

// The classes, ids and type of a compound, without pseudo-classes and their arguments.
// @param {string} compound
// @return {string[]}
const tokens = (compound) => compound.replace(/::?[\w-]+(\([^)]*\))?/g, "").match(/[.#]?[\w-]+|\[[^\]]*\]/g) || [];

// Specificity as [ids, classes, types]: `:where()` counts nothing, `:is()`, `:not()` and `:has()`
// their most specific argument, other pseudo-classes one class.
// @param {string} sel One selector of a list.
// @return {number[]}
function specificity(sel) {
  const s = [0, 0, 0];
  const add = (t) => t.forEach((n, i) => (s[i] += n));
  const rest = sel.replace(/:(where|is|not|has)\(((?:[^()]|\([^()]*\))*)\)/g, (m, fn, args) => {
    if (fn !== "where")
      add(
        splitTop(args, ",")
          .map(specificity)
          .sort((x, y) => y[0] - x[0] || y[1] - x[1] || y[2] - x[2])[0] || [0, 0, 0],
      );
    return "";
  });
  s[0] += (rest.match(/#[\w-]+/g) || []).length;
  s[1] += (rest.match(/\.[\w-]+|\[[^\]]*\]|(?<!:):(?!:)[\w-]+/g) || []).length;
  s[2] += (rest.match(/(^|[ >+~(])[a-z][\w-]*|::[\w-]+/gi) || []).length;
  return s;
}

// Prints the rules from the first rule with selector `a` to the last one with `b` that set `prop`
// or a related property (`padding` matches `padding-left` and the other way round), each with its
// specificity. Without `all`, only rules whose subject compound shares a class, id or type with
// the subject of `b`, the rule to move.
// @param {string} a
// @param {string} b
// @param {string} prop
// @param {string} file
// @param {boolean} all
function between(a, b, prop, file, all) {
  const rules = read(file);
  const has = (rule, sel) => splitTop(rule.sel, ",").includes(norm(sel));
  const from = rules.findIndex((r) => has(r, a));
  const to = rules.findLastIndex((r, i) => i > from && has(r, b));
  if (from < 0 || to < 0) {
    console.log(`no rule with selector ${from < 0 ? a : `${b} after ${a}`} in ${path.relative(__dirname, file)}`);
    process.exit(1);
  }
  const subject = new Set(tokens(compounds(b).at(-1)));
  const related = (d) => {
    const p = d.slice(0, d.indexOf(":")).trim();
    return p === prop || p.startsWith(`${prop}-`) || (prop.startsWith(`${p}-`) && !/^border-.*radius/.test(prop));
  };
  rules.slice(from, to + 1).forEach((r, i) => {
    const decls = r.decls.filter(related);
    const sels = splitTop(r.sel, ",").filter(
      (sel) => all || i === 0 || i === to - from || tokens(compounds(sel).at(-1)).some((t) => subject.has(t)),
    );
    if (!decls.length || !sels.length) return;
    const at = r.key.slice(0, -r.sel.length).replace(/ > $/, "");
    const list = sels.map((sel) => `${sel} (${specificity(sel)})`).join(", ");
    console.log(`${at ? `${at} > ` : ""}${list} { ${decls.map(short).join("; ")} }`);
  });
}

if (process.argv[2] === "--between") {
  const args = process.argv.slice(3);
  const [a, b, prop, file = path.join(__dirname, "css/app.css")] = args.filter((x) => x !== "--all");
  if (!prop) {
    console.log("usage: css-diff --between <selA> <selB> <prop> [file.css] [--all]");
    process.exit(1);
  }
  between(a, b, prop, file, args.includes("--all"));
  process.exit(0);
}

const [oldFile = path.join(PREV_DIR, "app.css"), newFile = path.join(__dirname, "css/app.css")] = process.argv.slice(2);
const rel = (file) => (path.relative(__dirname, file).startsWith("..") ? file : path.relative(__dirname, file));
if (!fs.existsSync(oldFile)) {
  console.log(`no ${rel(oldFile)}: a build keeps it once it changes the CSS`);
  process.exit(0);
}
const before = read(oldFile);
const after = read(newFile);
const [removed, added] = unmatched(before, after);

// Pair what is left by key, in order: a pair is a changed rule, the rest added or removed.
const out = [];
const byKey = new Map();
added.forEach((r) => byKey.set(r.key, [...(byKey.get(r.key) || []), r]));
for (const r of removed) {
  const match = byKey.get(r.key)?.shift();
  if (!match) {
    out.push(`- ${r.key} { ${r.decls.map(short).join("; ")} }`);
    continue;
  }
  match.paired = true;
  const gone = r.decls.filter((d) => !match.decls.includes(d)).map((d) => `-${short(d)}`);
  const come = match.decls.filter((d) => !r.decls.includes(d)).map((d) => `+${short(d)}`);
  out.push(`~ ${r.key} { ${[...gone, ...come].join("; ") || "same declarations, other order"} }`);
}
added.filter((r) => !r.paired).forEach((r) => out.push(`+ ${r.key} { ${r.decls.map(short).join("; ")} }`));

out.forEach((l) => console.log(l));
const count = (sign) => out.filter((l) => l.startsWith(sign)).length;
const order = !out.length && before.map((r) => r.text).join() !== after.map((r) => r.text).join();
console.log(
  `${rel(oldFile)} → ${rel(newFile)}: ` +
    `${count("~")} changed, ${count("-")} removed, ${count("+")} added rules` +
    (order ? ", same rules in another order (cascade may differ)" : ""),
);
