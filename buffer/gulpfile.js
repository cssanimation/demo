var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync'),
    cssshrink = require('gulp-cssshrink'),
    cp = require('child_process'),
    changed = require('gulp-changed'),
    imagemin = require('gulp-imagemin'),
    size = require('gulp-size');


gulp.task('styles', function() {
  gulp.src('./src/sass/**/*.scss')
    .pipe(sass({style: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('stylesheets'))
    .pipe(rename({suffix: '.min'}))
    //.pipe(minifycss())
    //.pipe(cssshrink())
    .pipe(gulp.dest('stylesheets'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('scripts', function() {
  return gulp.src(['./src/javascripts/**/*.js'])
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    .pipe(plumber())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('javascripts'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('javascripts'))
    .pipe(browserSync.reload({stream:true}));
});

// Optimizes the images that exists
gulp.task('images', function () {
  return gulp.src('src/images/**')
    .pipe(changed('images'))
    .pipe(imagemin({
      // Lossless conversion to progressive JPGs
      progressive: true,
      // Interlace GIFs for progressive rendering
      interlaced: true
    }))
    .pipe(gulp.dest('images'))
    .pipe(size({title: 'images'}));
});

gulp.task('html', function() {
  gulp.src('./src/**/*.html')
    .pipe(gulp.dest(''))
});

gulp.task('browser-sync', ['styles', 'scripts'], function() {
  browserSync({
    server: {
      baseDir: "./",
      injectChanges: true // this is new
    }
  });
});

gulp.task('watch', function() {
  // Watch .html files
  gulp.watch('src/**/*.html', ['html', browserSync.reload]);
  gulp.watch("*.html").on('change', browserSync.reload);
  // Watch .sass files
  gulp.watch('src/sass/**/*.scss', ['styles', browserSync.reload]);
  // Watch .js files
  gulp.watch('src/javascripts/*.js', ['scripts', browserSync.reload]);
  // Watch image files
  gulp.watch('src/images/**/*', ['images', browserSync.reload]);
});

gulp.task('default', function() {
    gulp.start('styles', 'scripts', 'images', 'html', 'browser-sync', 'watch');
});
