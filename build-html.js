// Builds the demo page: every *.src.html in the working directory becomes *.html
// with its @@include()s inlined and its examples expanded, and index.src.html also
// becomes llms.txt, the same content as markdown for agents. Needs only `marked`,
// so it runs without gulp or sass: `bun build-html.js`.
const { marked } = require("marked");

const fs = require("node:fs");
const path = require("node:path");

const INCLUDE_RE = /@@include\((['"])([^'"]+)\1\)/g;
const EXAMPLE_RE = /<!-- example -->\n?([\s\S]*?)[ \t]*<!-- \/example -->/g;
const CODE_RE = /<!-- code -->\n?([\s\S]*?)[ \t]*<!-- \/code -->/g;

const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Strips the indentation all lines share, and blank lines at either end.
 *
 * @param {string} src Lines of markup.
 * @return {string} The same lines, flush left.
 */
function dedent(src) {
  const lines = src.replace(/^\s*\n|\s+$/g, "").split("\n");
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^\s*/)[0].length));
  return lines.map((l) => l.slice(indent)).join("\n");
}

// The page's own layout wrapper is left out of the markup shown.
const DEMO_ROW_RE = /^<div class="demo-row"[^>]*>\n([\s\S]*)\n<\/div>$/;

/**
 * @param {string} body The markup of an example or code block.
 * @return {string} The markup to show: flush left, without the page's own wrapper.
 */
function shownCode(body) {
  const code = dedent(body);
  const row = code.match(DEMO_ROW_RE);
  return row ? dedent(row[1]) : code;
}

/**
 * @param {string} body Markup.
 * @return {string} The markup as an escaped, flush-left code block.
 */
function codeBlock(body) {
  return `<pre class="code-block"><code>${escapeHtml(shownCode(body))}</code></pre>`;
}

/**
 * Renders each <!-- example --> … <!-- /example --> block, followed by its own markup to copy,
 * so the code shown is always the code rendered. A <!-- code --> block is shown, not rendered.
 *
 * @param {string} html A partial.
 * @return {string} The partial with its examples expanded.
 */
function renderExamples(html) {
  return html
    .replace(
      EXAMPLE_RE,
      (_m, body) => `<div class="demo-example">
${body}</div>
<details class="demo-markup"><summary>Markup</summary>${codeBlock(body)}</details>
`,
    )
    .replace(CODE_RE, (_m, body) => codeBlock(body));
}

// Render markdown to HTML, then decorate <code> values that look like colors
// (hex literals or --f-color-* custom properties) with an inline swatch so the
// docs visually reflect the color they reference. The sourceName is appended
// as a "rendered from …" caption so readers know where to edit.
function renderMarkdown(src, sourceName) {
  const html = marked.parse(src);
  const withFoundationClasses = html
    // Wrap tables so wide ones scroll horizontally instead of overflowing.
    .replace(/<table>/g, '<div class="table-scroll"><table>')
    .replace(/<\/table>/g, "</table></div>")
    // Foundation: .code-block for fenced code
    .replace(/<pre>/g, '<pre class="code-block">');
  const swatched = withFoundationClasses
    .replace(
      /<code>(#[0-9a-fA-F]{3,8})<\/code>/g,
      (_m, hex) => `<code class="has-swatch"><span class="swatch" style="--swatch:${hex}"></span>${hex}</code>`,
    )
    .replace(
      /<code>(--f-color-[a-z0-9-]+)<\/code>/g,
      (_m, name) => `<code class="has-swatch"><span class="swatch" style="--swatch:var(${name})"></span>${name}</code>`,
    );
  const caption = sourceName
    ? `<p class="docs-source"><small>rendered from <code>${sourceName}</code></small></p>`
    : "";
  return swatched + caption;
}

// Recursively inlines partial HTML files referenced with @@include().
// Files with a .md extension are rendered as markdown to HTML.
function inlineFile(absPath, stack = []) {
  const filePath = path.resolve(absPath);
  if (stack.includes(filePath)) {
    const cycle = [...stack, filePath].join(" -> ");
    throw new Error(`Circular include: ${cycle}`);
  }
  const baseDir = path.dirname(filePath);
  const raw = fs.readFileSync(filePath, "utf8");
  let html = filePath.endsWith(".md") ? renderMarkdown(raw, path.basename(filePath)) : renderExamples(raw);
  html = html.replace(INCLUDE_RE, (_m, _q, rel) => {
    const child = path.resolve(baseDir, rel);
    return inlineFile(child, [...stack, filePath]);
  });
  const relPath = path.relative(process.cwd(), filePath);
  const warning = `<!--
  ATTENTION: This is an included file.
  You are viewing the generated output.
  EDIT ${relPath} INSTEAD.
-->
  `.trim();
  return `\n\n${warning}\n${html}`;
}

/**
 * Inlines @@include()s without rendering anything; a markdown file is marked as such.
 *
 * @param {string} absPath The file.
 * @return {string} Its source with every include in place.
 */
function rawSource(absPath) {
  const filePath = path.resolve(absPath);
  const raw = fs.readFileSync(filePath, "utf8");
  if (filePath.endsWith(".md")) return `<!-- md -->\n${raw}\n<!-- /md -->`;
  return raw.replace(INCLUDE_RE, (_m, _q, rel) => rawSource(path.resolve(path.dirname(filePath), rel)));
}

/**
 * @param {string} html A fragment of prose.
 * @return {string} Its text, with inline code in backticks.
 */
function toText(html) {
  return html
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/g, "`$1`")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

// In page order: sections, headings, prose, swatches, examples, code and markdown. A
// .demo-captured (captured markup shown in place, up to the end of its section) is skipped.
const LLMS_PART_RE = new RegExp(
  [
    /<section[^>]*\bid="([^"]+)"/,
    /<h([234])[^>]*>([\s\S]*?)<\/h\2>/,
    /<p[^>]*>([\s\S]*?)<\/p>/,
    /<li>([\s\S]*?)<\/li>/,
    /<div class="demo-swatch"[^>]*>([\s\S]*?)<\/div>/,
    /<!-- (?:example|code) -->\n?([\s\S]*?)[ \t]*<!-- \/(?:example|code) -->/,
    /<!-- md -->\n([\s\S]*?)\n<!-- \/md -->/,
    /<div class="[^"]*\bdemo-captured\b[^"]*">[\s\S]*?(?=<\/section>)/,
  ]
    .map((re) => re.source)
    .join("|"),
  "g",
);

/**
 * The page as markdown: per section its title, id and intro, then each example's
 * heading and markup; the reference docs as they are. Prose between examples is left out.
 *
 * @param {string} src The page source (index.src.html).
 * @return {string} Markdown.
 */
function llmsText(src) {
  const page = rawSource(src);
  const main = page.slice(Math.max(0, page.search(/<main\b/)));
  const out = [
    "# Spaces Design System",
    "",
    "> The styles of Spaces, a themeable fork of Foundation for Sites 6. Load css/app.css; css/app-backend.css styles only markup inside `.f`. Colors are `--f-color-*` custom properties. Every example below is the markup rendered on index.html.",
  ];
  let id = "";
  for (const [, section, level, heading, para, item, swatch, code, md] of main.matchAll(LLMS_PART_RE)) {
    if (section) id = section;
    else if (level === "2") out.push("", `## ${toText(heading)}`, "", `Section: index.html#${id}`);
    else if (level) out.push("", `${"#".repeat(Number(level))} ${toText(heading)}`);
    else if (para) out.push("", toText(para));
    else if (item || swatch) {
      if (!out.at(-1).startsWith("- ")) out.push("");
      out.push(`- ${toText(item || swatch.replace("<small>", ": "))}`);
    } else if (code !== undefined) out.push("", "```html", shownCode(code), "```");
    else if (md) out.push("", md.trim().replace(/^#/gm, "###"));
  }
  return `${out.join("\n")}\n`;
}

/**
 * Writes *.html next to each *.src.html in the working directory, and llms.txt from index.src.html.
 *
 * @return {string[]} The files written.
 */
function buildHtml() {
  const written = fs
    .readdirSync(".")
    .filter((name) => name.endsWith(".src.html"))
    .map((name) => {
      const out = name.replace(/\.src\.html$/, ".html");
      fs.writeFileSync(out, inlineFile(name, [name]));
      return out;
    });
  if (fs.existsSync("index.src.html")) {
    fs.writeFileSync("llms.txt", llmsText("index.src.html"));
    written.push("llms.txt");
  }
  return written;
}

module.exports = { buildHtml };

if (require.main === module) {
  console.log(`built ${buildHtml().join(", ")}`);
}
