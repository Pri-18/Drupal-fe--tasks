const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');

const paths = {
  scss: './sass/**/*.scss',
  css: './css',
};

function compileSass(done) {
  gulp
    .src(paths.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()])) // <-- FIXED autoprefixer
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.css));
  done();
}

function watchFiles() {
  gulp.watch(paths.scss, compileSass);
}

exports.sass = compileSass;
exports.default = gulp.series(compileSass, watchFiles);
