const gulp = require("gulp");
const sass = require("sass-embedded");
const browserSync = require("browser-sync").create();
const { buildHtml } = require("./build-html");

const fs = require("node:fs");
const path = require("node:path");
const { fileURLToPath } = require("node:url");

const OUT_DIR = "css";

// Compile one SCSS entry point to css/, with an external sourcemap whose
// sources are relative to the scss/ directory (hence the ../scss/ sourceRoot).
async function sassBuild(entry) {
  const srcDir = path.dirname(entry);
  const cssName = `${path.basename(entry, ".scss")}.css`;
  const mapName = `${cssName}.map`;

  const result = await sass.compileAsync(entry, {
    style: "compressed",
    // With a charset, Sass counts a BOM in the map that the returned CSS lacks: every mapping is one column off.
    charset: false,
    sourceMap: true,
    sourceMapIncludeSources: true,
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
      gulp.watch(["*.src.html", "docs/*.md", "html-partials/**/*.html"], gulp.series("html"));
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
