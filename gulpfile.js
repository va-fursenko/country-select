var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    vueify = require('gulp-vueify'),
    babel = require('gulp-babel');
    fs = require('fs');

var srcPath = './src',
    libPath = '../node_modules',
    distPath = './dist',
    examplePath = './example/';

// Component pack
gulp.task('component', function () {
    gulp.src([
        srcPath + '/img/**/*'
    ])
    .pipe(gulp.dest(distPath + '/img'));

    return gulp.src([
        srcPath + '/**/*.js',
        srcPath + '/**/*.vue'
    ])
    .pipe(vueify())
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(sourcemaps.init())
    .pipe(uglify({
        compress: {
            drop_debugger: false
        }
    }))
    .pipe(concat('vue-country-select.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(distPath));
});

// JS pack
gulp.task('js', function () {
    // Custom js
    gulp.src([
        examplePath + '/js/*.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(uglify({
        compress: {
            drop_debugger: false
        }
    }))
    .on('error', function (err) {
        console.log(err);
    })
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(examplePath + '/assets/js'));


    // Libs js
    gulp.src([
        libPath + '/vue/dist/vue.min.js',
        distPath + '/vue-country-select.js',
    ])
    .pipe(concat('lib.js'))
    .pipe(gulp.dest(examplePath + '/assets/js'));
});

// Flags images
gulp.task('img', function () {
    gulp.src([
        distPath + '/img/**/*'
    ])
    .pipe(gulp.dest(examplePath + '/assets/img'));
});