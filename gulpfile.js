const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass-embedded'));
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');

const fs = require('node:fs');
const path = require('node:path');
const { Transform } = require('node:stream');

const includePaths = [
  'node_modules/foundation-sites/scss',
  'node_modules/motion-ui/src'
];

const INCLUDE_RE = /@@include\((['"])([^'"]+)\1\)/g;

// Recursively inlines partial HTML files referenced with @@include()
function inlineFile(absPath, stack = []) {
  const filePath = path.resolve(absPath);
  if (stack.includes(filePath)) {
    const cycle = [...stack, filePath].join(' -> ');
    throw new Error(`Circular include: ${cycle}`);
  }
  const baseDir = path.dirname(filePath);
  let html = fs.readFileSync(filePath, 'utf8');
  html = html.replace(INCLUDE_RE, (_m, _q, rel) => {
    const child = path.resolve(baseDir, rel);
    return inlineFile(child, [...stack, filePath]);
  });
  return html;
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
        const out = inlineFile(file.path);
        file.contents = Buffer.from(out, 'utf8');
        file.path = file.path.replace(/\.src\.html$/, '.html');
        cb(null, file);
      } catch (e) {
        cb(e);
      }
    }
  });
}

// Compile SCSS to CSS with sourcemaps and deprecation-warning filtering
function sassBuild(pathGlobs) {
  return gulp.src(pathGlobs)
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths,
      outputStyle: 'compressed',
      // Filter out specific deprecation warnings from Dart Sass
      logger: {
        warn: (warning) => {
          const text = warning && warning.message ? warning.message : String(warning);
          if (text.includes('Sass @import rules are deprecated')) return;
          if (text.includes('Deprecation')) return;
          if (text.includes('Recommendation')) return;
          if (text.includes('Global built-in functions are deprecated')) return;
          if (text.includes("Sass's behavior for declarations that appear after nested")) return;
          console.warn(text);
        },
        debug: (message) => {
          const text = message && message.message ? message.message : String(message);
          console.debug(text);
        }
      }
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream());
}

// Build HTML pages from *.src.html sources with partial includes
function html() {
  return gulp.src(['*.src.html'], { base: './' })
    .pipe(gulpInlinePartials())
    .pipe(gulp.dest('./'))
    .on('end', () => browserSync.reload());
}

// Development server with live reload and file watching
function serve() {
  browserSync.init({ server: "./" });
  gulp.watch("scss/**/*.scss", gulp.series('sassFrontend', 'sassBackend'));
  gulp.watch(["*.src.html", "html-partials/**/*.html"], gulp.series('html'));
  gulp.watch(["*.html", "!*.src.html"]).on('change', browserSync.reload);
}

// Gulp tasks
gulp.task('html', html);
gulp.task('sassFrontend', () => sassBuild(['scss/app.scss']));
gulp.task('sassBackend', () => sassBuild(['scss/app-backend.scss']));
gulp.task('sass', gulp.series('sassFrontend', 'sassBackend'));
gulp.task('serve', gulp.series('sassFrontend', 'sassBackend', 'html', serve));
gulp.task('default', gulp.series('sassFrontend', 'sassBackend', 'html', serve));
