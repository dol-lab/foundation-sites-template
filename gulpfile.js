const gulp = require('gulp');
const sass = require('sass-embedded');
const browserSync = require('browser-sync').create();
const { marked } = require('marked');

const fs = require('node:fs');
const path = require('node:path');
const { fileURLToPath } = require('node:url');
const { Transform } = require('node:stream');

const includePaths = [
  'node_modules/foundation-sites/scss',
  'node_modules/motion-ui/src'
];

const INCLUDE_RE = /@@include\((['"])([^'"]+)\1\)/g;

// Render markdown to HTML, then decorate <code> values that look like colors
// (hex literals or --f-color-* custom properties) with an inline swatch so the
// docs visually reflect the color they reference. The sourceName is appended
// as a "rendered from …" caption so readers know where to edit.
function renderMarkdown(src, sourceName) {
  const html = marked.parse(src);
  const withFoundationClasses = html
    // Wrap tables so wide ones scroll horizontally instead of overflowing.
    .replace(/<table>/g, '<div class="table-scroll"><table>')
    .replace(/<\/table>/g, '</table></div>')
    // Foundation: .code-block for fenced code
    .replace(/<pre>/g, '<pre class="code-block">');
  const swatched = withFoundationClasses
    .replace(
      /<code>(#[0-9a-fA-F]{3,8})<\/code>/g,
      (_m, hex) => `<code class="has-swatch"><span class="swatch" style="--swatch:${hex}"></span>${hex}</code>`
    )
    .replace(
      /<code>(--f-color-[a-z0-9-]+)<\/code>/g,
      (_m, name) => `<code class="has-swatch"><span class="swatch" style="--swatch:var(${name})"></span>${name}</code>`
    );
  const caption = sourceName
    ? `<p class="docs-source"><small>rendered from <code>${sourceName}</code></small></p>`
    : '';
  return swatched + caption;
}

// Recursively inlines partial HTML files referenced with @@include().
// Files with a .md extension are rendered as markdown to HTML.
function inlineFile(absPath, stack = []) {
  const filePath = path.resolve(absPath);
  if (stack.includes(filePath)) {
    const cycle = [...stack, filePath].join(' -> ');
    throw new Error(`Circular include: ${cycle}`);
  }
  const baseDir = path.dirname(filePath);
  const raw = fs.readFileSync(filePath, 'utf8');
  let html = filePath.endsWith('.md')
    ? renderMarkdown(raw, path.basename(filePath))
    : raw;
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

// Gulp transform stream for converting *.src.html into *.html with inlined partials
function gulpInlinePartials() {
  return new Transform({
    objectMode: true,
    transform(file, _enc, cb) {
      if (file.isNull()) return cb(null, file);
      if (file.isStream()) {
        cb(new Error('Streams not supported'));
        return;
      }
      try {
        const sourceName = path.basename(file.path);
        const out = inlineFile(file.path, [sourceName]);
        file.contents = Buffer.from(`${out}`, 'utf8');
        file.path = file.path.replace(/\.src\.html$/, '.html');
        cb(null, file);
      } catch (e) {
        cb(e);
      }
    }
  });
}

// Deprecation noise from Foundation and the legacy @import tree. Steps 4 and 5
// of plan.md remove the causes; until then the build would print thousands of
// these.
const MUTED_WARNINGS = [
  'Sass @import rules are deprecated',
  'Deprecation',
  'Recommendation',
  'Global built-in functions are deprecated',
  "Sass's behavior for declarations that appear after nested"
];

const sassLogger = {
  warn: (warning) => {
    const text = warning && warning.message ? warning.message : String(warning);
    if (MUTED_WARNINGS.some((muted) => text.includes(muted))) return;
    console.warn(text);
  },
  debug: (message) => {
    const text = message && message.message ? message.message : String(message);
    console.debug(text);
  }
};

const OUT_DIR = 'css';

// Compile one SCSS entry point to css/, with an external sourcemap whose
// sources are relative to the scss/ directory (hence the ../scss/ sourceRoot).
async function sassBuild(entry) {
  const srcDir = path.dirname(entry);
  const cssName = `${path.basename(entry, '.scss')}.css`;
  const mapName = `${cssName}.map`;

  const result = await sass.compileAsync(entry, {
    loadPaths: includePaths,
    style: 'compressed',
    sourceMap: true,
    sourceMapIncludeSources: true,
    logger: sassLogger
  });

  const map = {
    version: 3,
    sourceRoot: `${path.relative(OUT_DIR, srcDir)}/`,
    sources: result.sourceMap.sources.map(
      (source) => path.relative(srcDir, fileURLToPath(source))
    ),
    names: result.sourceMap.names,
    mappings: result.sourceMap.mappings,
    sourcesContent: result.sourceMap.sourcesContent,
    file: cssName
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUT_DIR, cssName),
    `${result.css}\n/*# sourceMappingURL=${mapName} */\n`
  );
  fs.writeFileSync(path.join(OUT_DIR, mapName), JSON.stringify(map));

  // Inject the new CSS instead of reloading the page.
  if (browserSync.active) browserSync.reload(path.join(OUT_DIR, cssName));
}

// Build HTML pages from *.src.html sources with partial includes
function html(done) {
  const stream = gulp.src(['*.src.html'], { base: './' })
    .pipe(gulpInlinePartials())
    .pipe(gulp.dest('./'));
    
  stream.on('end', () => {
    if (browserSync.active) browserSync.reload();
    if (done) done();
  });
  
  stream.on('error', (err) => {
    if (done) done(err);
  });
}

// Development server with live reload and file watching
function serve(done) {
  browserSync.init({ 
    server: "./",
    open: false,
    notify: false
  }, (err) => {
    if (err) {
      done(err);
      return;
    }
    gulp.watch("scss/**/*.scss", gulp.series('sassFrontend', 'sassBackend'));
    gulp.watch(["*.src.html", "html-partials/**/*.html"], gulp.series('html'));
    gulp.watch(["*.html", "!*.src.html"]).on('change', browserSync.reload);
    done();
  });
}

// Gulp tasks
gulp.task('html', html);
gulp.task('sassFrontend', () => sassBuild('scss/app.scss'));
gulp.task('sassBackend', () => sassBuild('scss/app-backend.scss'));
gulp.task('sass', gulp.series('sassFrontend', 'sassBackend'));
gulp.task('serve', gulp.series('sassFrontend', 'sassBackend', 'html', serve));
gulp.task('default', gulp.series('sassFrontend', 'sassBackend', 'html', serve));
