const gulp = require("gulp");
const sass = require("sass-embedded");
const browserSync = require("browser-sync").create();
const { buildHtml } = require("./build-html");

const fs = require("node:fs");
const path = require("node:path");
const { fileURLToPath } = require("node:url");

const includePaths = ["node_modules/foundation-sites/scss", "node_modules/motion-ui/src"];

// Deprecation noise from motion-ui (node_modules), which still uses @import and
// global built-in functions. scss/ itself compiles without warnings.
const MUTED_WARNINGS = [
  "Sass @import rules are deprecated",
  "Deprecation",
  "Recommendation",
  "Global built-in functions are deprecated",
  "Sass's behavior for declarations that appear after nested",
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
  },
};

const OUT_DIR = "css";

// Compile one SCSS entry point to css/, with an external sourcemap whose
// sources are relative to the scss/ directory (hence the ../scss/ sourceRoot).
async function sassBuild(entry) {
  const srcDir = path.dirname(entry);
  const cssName = `${path.basename(entry, ".scss")}.css`;
  const mapName = `${cssName}.map`;

  const result = await sass.compileAsync(entry, {
    loadPaths: includePaths,
    style: "compressed",
    // With a charset, Sass counts a BOM in the map that the returned CSS lacks: every mapping is one column off.
    charset: false,
    sourceMap: true,
    sourceMapIncludeSources: true,
    logger: sassLogger,
  });

  const map = {
    version: 3,
    sourceRoot: `${path.relative(OUT_DIR, srcDir)}/`,
    sources: result.sourceMap.sources.map((source) => path.relative(srcDir, fileURLToPath(source))),
    names: result.sourceMap.names,
    mappings: result.sourceMap.mappings,
    sourcesContent: result.sourceMap.sourcesContent,
    file: cssName,
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, cssName), `${result.css}\n/*# sourceMappingURL=${mapName} */\n`);
  fs.writeFileSync(path.join(OUT_DIR, mapName), JSON.stringify(map));

  // Inject the new CSS instead of reloading the page.
  if (browserSync.active) browserSync.reload(path.join(OUT_DIR, cssName));
}

// Build HTML pages from *.src.html sources with partial includes
function html(done) {
  try {
    buildHtml();
  } catch (err) {
    done(err);
    return;
  }
  if (browserSync.active) browserSync.reload();
  done();
}

// Development server with live reload and file watching
function serve(done) {
  browserSync.init(
    {
      server: "./",
      open: false,
      notify: false,
    },
    (err) => {
      if (err) {
        done(err);
        return;
      }
      gulp.watch("scss/**/*.scss", gulp.series("sassFrontend", "sassBackend"));
      gulp.watch(["*.src.html", "*.md", "html-partials/**/*.html"], gulp.series("html"));
      gulp.watch(["*.html", "!*.src.html"]).on("change", browserSync.reload);
      done();
    },
  );
}

// Gulp tasks
gulp.task("html", html);
gulp.task("sassFrontend", () => sassBuild("scss/app.scss"));
gulp.task("sassBackend", () => sassBuild("scss/app-backend.scss"));
gulp.task("sass", gulp.series("sassFrontend", "sassBackend"));
gulp.task("serve", gulp.series("sassFrontend", "sassBackend", "html", serve));
gulp.task("default", gulp.series("sassFrontend", "sassBackend", "html", serve));
