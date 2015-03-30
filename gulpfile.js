var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('test', function() {
  return gulp.src(['test/test-*.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
      globals: {
        // TODO: Why is this not working?
        // assert: require('chai').assert
      }
    }));
});

gulp.task('default', ['test']);
