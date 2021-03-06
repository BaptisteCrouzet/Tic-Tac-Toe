const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const lzmajs = require('gulp-lzmajs');
const uglify = require('gulp-uglify-es').default;
const moreCSS = require('gulp-more-css');
const sass = require('gulp-sass');
const webserver = require('gulp-webserver');

// For sass files
gulp.task('sass', function() {
  return gulp
    .src('assets/scss/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('dist/css'));
});

// Optimize images
gulp.task('images-optimize', function() {
  return gulp.src('assets/img/*').pipe(gulp.dest('dist/images')).pipe(
    imagemin({
      interlaced: true,
      progressive: true,
      optimizationLevel: 5,
      svgoPlugins: [
        {
          removeViewBox: true
        }
      ]
    })
  );
});

// Minify all css files
gulp.task('minify-css', function() {
  return gulp.src('assets/css/*.css').pipe(moreCSS()).pipe(gulp.dest('dist/css'));
});

// Minify and compile all js files in one file
gulp.task('compress', function() {
  return gulp
    .src('assets/js/*.js')
    .pipe(concat('all.min.js'))
    .pipe(uglify())
    .pipe(lzmajs(9))
    .pipe(gulp.dest('dist/js'));
});

// Autoprefix styles
gulp.task('autoprefixer', function() {
  const sourcemaps = require('gulp-sourcemaps');
  return gulp.src('./src/*.css').pipe(sourcemaps.init()).pipe(sourcemaps.write('.')).pipe(gulp.dest('./dest'));
});

gulp.task('webserver', function() {
  gulp.src('/').pipe(
    webserver({
      livereload: true,
      directoryListing: true,
      open: 'localhost:8000',
      fallback: 'index.html'
    })
  );
});

gulp.task('watch', function() {
  gulp.watch('assets/scss/*.scss', gulp.series('sass'));
  gulp.watch('assets/img/*', gulp.series('images-optimize'));
  gulp.watch('assets/css/*.css', gulp.series('minify-css'));
  gulp.watch('assets/css/*.css', gulp.series('autoprefixer'));
  gulp.watch('assets/js/*.js', gulp.series('compress'));
  gulp.watch(
    [ 'assets/css/*.css', 'assets/js/*.js', 'assets/scss/*.scss', 'assets/img/*' ],
    {
      delay: 1000
    },
    gulp.series('webserver')
  );
});
