var gulp = require('gulp');
var typescript = require('gulp-typescript');

gulp.task('default', function () {
    gulp.src(['src/**/*.ts'])
        .pipe(typescript())
        .pipe(gulp.dest('dist'))
        .pipe(gulp.dest('example'));
});

gulp.watch(['src/**/*.ts'], ['default']);