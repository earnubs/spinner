var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('default', ['lint', 'compress']);

gulp.task('lint', function() {
    return gulp.src('./*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
  gulp.watch('./*.js', ['lint']);
  gulp.watch('./lib/*.js', ['compress']);
});

gulp.task('compress', function() {
  gulp.src('lib/*.js')
    .pipe(uglify({ outSourceMap: true }))
    .pipe(rename(function (path) {
        if(path.extname === '.js') {
            path.basename += '.min';
        }
    }))
    .pipe(gulp.dest('./dist'));
});
