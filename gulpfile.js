'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var injectVersion = require('gulp-inject-version');
var runSequence = require('gulp-run-sequence');

gulp.task('stylesheets', ['stylesheets:clean'], function () {
    return gulp.src('./src/stylesheets/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./out/css'));
});

gulp.task('stylesheets:clean', function () {
    return gulp.src('./out/css/', {read: false})
        .pipe(clean());
});

gulp.task('stylesheets:watch', function () {
    gulp.watch('./src/stylesheets/*.scss', ['stylesheets']);
});


gulp.task('resources', function (cb) {
    runSequence('resources:clean', 'resources:copy', 'version', cb);
});

gulp.task('resources:copy', function () {
    return gulp.src('./src/*.*')
        .pipe(gulp.dest('./out'));
});

gulp.task('resources:clean', function () {
    return gulp.src('./out/*.*', {read: false})
        .pipe(clean({force: true}));
});

gulp.task('resources:watch', function () {
    gulp.watch('./src/*.*', ['resources']);
});

gulp.task('version', function () {
    return gulp.src('./out/index.html')
        .pipe(injectVersion())
        .pipe(gulp.dest('./out/'));
});

gulp.task('livereload', function () {
    gulp.watch('./out/**', browserSync.reload);
});

gulp.task('build', ['stylesheets', 'resources']);

gulp.task('watch', ['stylesheets:watch', 'resources:watch']);
gulp.task('default', ['build', 'watch', 'livereload'], function () {
    browserSync.init({
        server: {
            baseDir: './out/'
        }
    });
});