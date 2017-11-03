'use strict';
// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyCSS= require('gulp-clean-css');

var SCSS_SRC = './src/scss/**/*.scss';
var SCSS_DEST = './src/css/';

// Compile SCSS
gulp.task('compile_scss', function() {
    return gulp.src(SCSS_SRC)
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCSS())
        .pipe(gulp.dest(SCSS_DEST));
});

// Default
gulp.task('default', function(){
    gulp.watch(SCSS_SRC, ['compile_scss']);
});
