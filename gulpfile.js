const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass-embedded'));
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');

const includePaths = [
	'node_modules/foundation-sites/scss',
	'node_modules/motion-ui/src'
];


function sassBuild(path) {
	return gulp.src(path)
		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: includePaths,
			outputStyle: 'compressed',
			// Filter out specific deprecation warnings from Dart Sass
			logger: {
				warn: (warning) => {
					const text = warning && warning.message ? warning.message : String(warning);
					// Ignore the deprecated @import rule warning
					if (text.includes('Sass @import rules are deprecated')) {
						return;
					}
					if (text.includes('Global built-in functions are deprecated')) {
						return;
					}
					if (text.includes("Sass's behavior for declarations that appear after nested")) {
						return;
					}
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
};

function serve() {
	browserSync.init({ server: "./" });
	gulp.watch("scss/*.scss", gulp.series('sassFrontend', 'sassBackend'));
	gulp.watch("*.html").on('change', browserSync.reload);
}

gulp.task('sassFrontend', () => sassBuild(['scss/app.scss']));
gulp.task('sassBackend', () => sassBuild(['scss/app-backend.scss']));

gulp.task('sass', gulp.series('sassFrontend', 'sassBackend', serve));
gulp.task('serve', gulp.series('sassFrontend', 'sassBackend', serve));
gulp.task('default', gulp.series('sassFrontend', 'sassBackend', serve));
