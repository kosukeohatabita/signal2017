'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const pug = require('pug');
const gPug = require('gulp-pug');
const gWatch = require('gulp-watch');
const riotify = require('riotify');
const browsersync = require('browser-sync');
const source = require('vinyl-source-stream');
const browserify = require('browserify');


// config
const DEST_PATH = {
  html: './docs/',
  css: './docs/css/',
  js: './docs/css/'
}

// pug
gulp.task('gulp:pug', () => {
  console.log('pug');
  return gulp.src('./src/!(_)*.pug')
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(gPug({pretty:true}))
    .pipe(gulp.dest('./docs/'))
    .pipe(browsersync.stream());
});

// riot
gulp.task('build:riot', () => {
  return browserify({entries: ['./src/app.js']})
    .transform(riotify, { template: 'pug' })
    .bundle()
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(source('app.bundle.js'))
    .pipe(gulp.dest('./docs/'))
    .pipe(browsersync.stream());
});

// browsersync
gulp.task('serve', () => {
  browsersync.init({
   server: {
     baseDir: './docs'
   },
   open: false,
 });
});

// watch
gulp.task('watch', ['serve'], () => {
  gulp.watch("./docs/*", () => {
    browsersync.reload();
  });
  //gulp.watch("./src/**/*.tag", ['build:riot']);
  gulp.watch("./src/**/*.pug", ['build:pug']);
});
