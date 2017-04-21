const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const concat = require('gulp-concat')
const plumber = require('gulp-plumber')
const browserSync = require('browser-sync')
const changed = require('gulp-changed')
const imagemin = require('gulp-imagemin')
const size = require('gulp-size')
const ghPages = require('gulp-gh-pages')
const clean = require('gulp-clean')
const critical = require('critical')
const frontMatter = require('gulp-front-matter')
const markdown = require('gulp-markdown')
const layout = require('gulp-layout')

gulp.task('clean', function () {
  return gulp.src('public/*', {read: false})
    .pipe(clean())
})

gulp.task('critical', function () {
  return gulp.src('public/*', {read: false})
    .pipe(critical.generate({
      inline: true,
      base: 'public/',
      src: 'index.html',
      dest: 'index.html',
      width: 1300,
      height: 900
    }))
})

gulp.task('build', function () {
  return gulp.src('./src/**/*.md')
    .pipe(frontMatter())
    .pipe(markdown())
    .pipe(layout(function (file) {
      return file.frontMatter
    }))
    .pipe(gulp.dest('./public'))
})

gulp.task('styles', function () {
  gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('./public/stylesheets'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./public/stylesheets'))
    .pipe(browserSync.reload({stream: true}))
})

gulp.task('scripts', function () {
  return gulp.src(['./src/javascripts/**/*.js'])
    .pipe(plumber())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./public/javascripts'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('./public/javascripts'))
    .pipe(browserSync.reload({stream: true}))
})

// Optimizes the images that exists
gulp.task('images', function () {
  return gulp.src('src/images/**')
    .pipe(changed('public/images'))
    .pipe(imagemin({
      // Lossless conversion to progressive JPGs
      progressive: true,
      // Interlace GIFs for progressive rendering
      interlaced: true
    }))
    .pipe(gulp.dest('public/images'))
    .pipe(size({title: 'images'}))
})

// gulp.task('html', function () {
//   gulp.src('./src/**/*.html')
//     .pipe(gulp.dest('./public/'))
// })

gulp.task('CNAME', function () {
  gulp.src('./src/CNAME')
    .pipe(gulp.dest('./public/'))
})

gulp.task('dotfiles', function () {
  gulp.src('./src/.*')
    .pipe(gulp.dest('./public/'))
})

gulp.task('browser-sync', ['styles', 'scripts'], function () {
  browserSync({
    server: {
      baseDir: './public/',
      injectChanges: true // this is new
    }
  })
})

gulp.task('watch', function () {
  // Watch .html files
  gulp.watch('src/**/*.md', ['build'])
  gulp.watch('src/**/*.pug', ['build'])
  // Watch .sass files
  gulp.watch('src/sass/**/*.scss', ['styles'])
  // Watch .js files
  gulp.watch('src/javascripts/*.js', ['scripts'])
  // Watch image files
  gulp.watch('src/images/**/*', ['images'])

  gulp.watch('public/*.html', browserSync.reload)
  gulp.watch('public/stylesheets/*.*', browserSync.reload)
  gulp.watch('public/javascripts/*.*', browserSync.reload)
})

gulp.task('deploy', function () {
  return gulp.src('./public/**/*')
    .pipe(ghPages({
      branch: 'master'
    }))
})

gulp.task('default', function () {
  gulp.start('styles', 'scripts', 'images', 'build', 'CNAME', 'dotfiles', 'browser-sync', 'watch')
})
