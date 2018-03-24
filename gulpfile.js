'use strict';

let gulp = require('gulp');
let uglify = require('gulp-uglify');
let minify = require('gulp-clean-css');
let concat = require('gulp-concat');
let rev = require('gulp-rev');
let revReplace = require('gulp-rev-replace');
let clean = require('gulp-clean');
let debug = require('gulp-debug');

let paths = {
    appDestDir: './public/dist',
    cssDestDir: './public/dist/css',
    cssSrcDir: './app/assets/css/*',
    jsDestDir: './public/dist/js',
    jsSrcDir: './app/assets/js/*',
    viewDestDir: './public/dist',
    viewSrcDir: './app/views/**'
}

gulp.task('clean', () => {
    return gulp.src(paths.appDestDir)
    .pipe(clean());
});

gulp.task('css', () => {
    return gulp.src(paths.cssSrcDir)
    .pipe(minify())
    .pipe(concat('frontend.css'))
    .pipe(rev())
    .pipe(gulp.dest(paths.cssDestDir))
    .pipe(rev.manifest())
    .pipe(gulp.dest(paths.cssDestDir))
    .pipe(debug());
});

gulp.task('js', () => {
    return gulp.src(paths.jsSrcDir)
    .pipe(uglify())
    .pipe(concat('frontend.js'))
    .pipe(rev())
    .pipe(gulp.dest(paths.jsDestDir))
    .pipe(rev.manifest())
    .pipe(gulp.dest(paths.jsDestDir))
    .pipe(debug());
});

gulp.task('build', ['css', 'js']);

gulp.task('version', ['build'], () => {
    let manifest = gulp.src('./public/dist/**/rev-manifest.json');
    return gulp.src(paths.viewSrcDir)
    .pipe(revReplace({ manifest: manifest, replaceInExtensions: ['.ejs'] }))
    .pipe(gulp.dest(paths.viewDestDir))
    .pipe(debug());
});

gulp.task('default', ['version']);

// Development

gulp.task('watch', () => {
    gulp.watch(paths.jsSrcDir, ['devjs']);
    gulp.watch(paths.cssSrcDir, ['devcss']);
});

gulp.task('devcss', () => {
    return gulp.src(paths.cssSrcDir)
    .pipe(concat('frontend.css'))
    .pipe(gulp.dest(pths.cssDestDir));
});

gulp.task('devjs', () => {
    return gulp.src(paths.jsSrcDir)
    .pipe(concat('frontend.js'))
    .pipe(gulp.dest(paths.jsDestDir));
});

gulp.task('devbuild', ['devcss', 'devjs']);

