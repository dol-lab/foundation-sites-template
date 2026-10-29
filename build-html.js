// Builds the demo page: every *.src.html in the working directory becomes *.html with its
// @@include()s inlined. An included docs/<id>.md becomes the section #<id>; its title and intro
// also go into llms.txt, an index of the docs for agents. The table of contents is built from the
// sections and the `<!-- group: … -->` comments between them. Needs only `marked` and
// `highlight.js`, so it runs without gulp or sass: `bun build-html.js`.
const hljs = require("highlight.js/lib/core");
const { Marked } = require("marked");

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const INCLUDE_RE = /@@include\((['"])([^'"]+)\1\)/g;
const SECTION_RE =
  /<!-- group: ([^>]+?) -->|<section class="cell demo-section" id="([^"]+)"[\s\S]*?<h2>([\s\S]*?)<\/h2>/g;

hljs.registerLanguage("html", require("highlight.js/lib/languages/xml"));
hljs.registerLanguage("css", require("highlight.js/lib/languages/css"));
hljs.registerLanguage("js", require("highlight.js/lib/languages/javascript"));

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

/**
 * @param {string} body Code.
 * @param {string} lang Its language; one hljs does not know is shown plain.
 * @param {boolean} [focusable] A tab stop, so a keyboard can scroll it (an example's code is editable instead).
 * @return {string} The code as a flush-left code block, highlighted at build time (.hljs-* in _demo.html).
 */
function codeBlock(body, lang, focusable = false) {
  const code = dedent(body);
  const html = hljs.getLanguage(lang) ? hljs.highlight(code, { language: lang }).value : escapeHtml(code);
  return `<pre class="code-block"${focusable ? ' tabindex="0"' : ""}><code>${html}</code></pre>`;
}

/**
 * Fences: ```html example renders the markup and shows it below (`row` lays it out in a
 * .demo-row), ```html demo renders page-only markup without showing it, any other is shown only.
 */
const marked = new Marked({
  walkTokens(token) {
    if (token.type === "heading") token.depth = Math.min(token.depth + 1, 6);
  },
  renderer: {
    code({ text, lang = "" }) {
      const [language, kind, row] = lang.split(/\s+/);
      if (kind === "demo") return `${text}\n`;
      if (kind !== "example") return codeBlock(text, language, true);
      const preview = row ? `<div class="demo-row">\n${text}\n</div>` : text;
      return `<figure class="demo-example">
<div class="demo-preview">
${preview}
</div>
<details class="demo-markup"><summary>Code</summary>${codeBlock(text, language)}</details>
</figure>
`;
    },
    link({ href, title, tokens }) {
      // A link to another section's .md (as it reads on GitHub) points at that section.
      const target = href.replace(/^([a-z0-9-]+)\.md(?:#.*)?$/, "#$1");
      return `<a href="${target}"${title ? ` title="${title}"` : ""}>${this.parser.parseInline(tokens)}</a>`;
    },
    codespan({ text }) {
      // A color value gets a swatch of that color.
      const color = text.match(/^#[0-9a-f]{3,8}$/i) ? text : text.match(/^--f-color-[a-z0-9-]+$/) ? `var(${text})` : "";
      if (color) return `<code class="has-swatch"><span class="swatch" style="--swatch:${color}"></span>${text}</code>`;
      // A value with spaces wraps between its words only (see .demo-word).
      const words = text.split(" ").map(escapeHtml);
      return `<code>${words.length > 1 ? words.map((w) => `<span class="demo-word">${w}</span>`).join(" ") : words[0]}</code>`;
    },
  },
});

/**
 * Splits a section's markdown into its title (the first `# ` line), intro (the paragraph after
 * it) and the rest.
 *
 * @param {string} src Markdown.
 * @param {string} file The file, for the error.
 * @return {{title: string, intro: string, body: string}} The parts, as markdown.
 */
function parseDoc(src, file) {
  const match = src.match(/^# (.+)\n+((?:(?!#|```|- |\|).+\n)*)([\s\S]*)$/);
  if (!match) throw new Error(`${file} must start with "# <title>"`);
  return { title: match[1], intro: match[2].trim(), body: match[3] };
}

/**
 * @param {string} file A docs/<id>.md.
 * @return {string} The section #<id>, rendered.
 */
function renderSection(file) {
  const { title, intro, body } = parseDoc(fs.readFileSync(file, "utf8"), file);
  const id = path.basename(file, ".md");
  const heading = `<h2>${marked.parseInline(title)}</h2>`;
  const rest = marked
    .parse(body)
    .replace(
      /<table>([\s\S]*?)<\/table>/g,
      '<div class="table-scroll"><table class="table demo-table">$1</table></div>',
    );
  const content = `${intro && `<p class="demo-intro">${marked.parseInline(intro)}</p>\n`}${rest}`;
  const card = `<div class="card static overflow-initial demo-doc">
<div class="card-section">
${heading}
${content}</div>
</div>`;
  return `<section class="cell demo-section" id="${id}">\n${card}\n</section>`;
}

// Recursively inlines the files referenced with @@include(); a .md file becomes a section.
function inlineFile(absPath, stack = []) {
  const filePath = path.resolve(absPath);
  if (stack.includes(filePath)) {
    const cycle = [...stack, filePath].join(" -> ");
    throw new Error(`Circular include: ${cycle}`);
  }
  const baseDir = path.dirname(filePath);
  let html = filePath.endsWith(".md") ? renderSection(filePath) : fs.readFileSync(filePath, "utf8");
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
 * @param {string} page The rendered page.
 * @return {{name: string, sections: {id: string, title: string}[]}[]} Its sections by group.
 */
function sectionGroups(page) {
  const groups = [];
  for (const [, group, id, title] of page.matchAll(SECTION_RE)) {
    if (group) groups.push({ name: group, sections: [] });
    else groups.at(-1)?.sections.push({ id, title });
  }
  return groups;
}

/**
 * @param {ReturnType<typeof sectionGroups>} groups The page's sections.
 * @return {string} The table of contents.
 */
function toc(groups) {
  return groups
    .map(
      ({ name, sections }) => `<div>
<h2 class="demo-label">${name}</h2>
<ul class="menu vertical">
${sections.map(({ id, title }) => `<li><a href="#${id}">${title}</a></li>`).join("\n")}
</ul>
</div>`,
    )
    .join("\n");
}

/**
 * The docs index for agents (llmstxt.org): per group a link to each section's markdown, with its intro.
 *
 * @param {ReturnType<typeof sectionGroups>} groups The page's sections.
 * @return {string} Markdown.
 */
function llmsText(groups) {
  const out = [
    "# Spaces Design System",
    "",
    "> The styles of Spaces, a themeable fork of Foundation for Sites 6. Load css/app.css; css/app-backend.css styles only markup inside `.f`. Colors are `--f-color-*` custom properties.",
    "",
    "Each link is one section of index.html as markdown: its prose, and every example's markup in an ```html example``` block (rendered on the page as it is written).",
  ];
  for (const { name, sections } of groups) {
    const docs = sections.filter(({ id }) => fs.existsSync(`docs/${id}.md`));
    if (!docs.length) continue;
    out.push("", `## ${name}`, "");
    for (const { id } of docs) {
      const { title, intro } = parseDoc(fs.readFileSync(`docs/${id}.md`, "utf8"), id);
      const notes = intro.replace(/\s+/g, " ").replace(/\]\(([a-z0-9-]+\.md)/g, "](docs/$1");
      out.push(`- [${title}](docs/${id}.md)${notes && `: ${notes}`}`);
    }
  }
  return `${out.join("\n")}\n`;
}

// A local stylesheet or script in a real tag (not in an escaped code example).
const ASSET_RE = /(<(?:link|script)\b[^>]*?\b(?:href|src)=")((?:css|js|assets)\/[^"?#]+\.(?:css|js))"/g;

/**
 * Appends a hash of each local stylesheet's and script's content to its URL, so a browser that
 * gets a new page also fetches the files that changed (GitHub Pages' cache headers are fixed).
 *
 * @param {string} html The page.
 * @return {string} The page with versioned asset URLs.
 */
function versionAssets(html) {
  return html.replace(ASSET_RE, (m, tag, url) => {
    if (!fs.existsSync(url)) return m;
    const hash = crypto.createHash("sha1").update(fs.readFileSync(url)).digest("hex").slice(0, 8);
    return `${tag}${url}?v=${hash}"`;
  });
}

/**
 * Writes *.html next to each *.src.html in the working directory, and llms.txt from index.src.html.
 *
 * @return {string[]} The files written.
 */
function buildHtml() {
  const written = [];
  for (const name of fs.readdirSync(".").filter((n) => n.endsWith(".src.html"))) {
    const out = name.replace(/\.src\.html$/, ".html");
    const page = inlineFile(name, [name]);
    const groups = sectionGroups(page);
    fs.writeFileSync(out, versionAssets(page.replace("@@toc", toc(groups))));
    written.push(out);
    if (name === "index.src.html") {
      fs.writeFileSync("llms.txt", llmsText(groups));
      written.push("llms.txt");
    }
  }
  return written;
}

module.exports = { buildHtml };

if (require.main === module) {
  console.log(`built ${buildHtml().join(", ")}`);
}
