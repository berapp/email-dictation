// grab our gulp packages
const gulp = require('gulp'),
      exec = require('child_process').exec,
      zip = require('gulp-zip'),
      bump = require('gulp-bump'),
      merge = require('merge-stream');

gulp.task('default', ['watch']);

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['uri']);
});

gulp.task('uri', function(){
  exec('chrome-cli open "http://reload.extensions"', function() {
    setTimeout(function() {
      exec('chrome-cli close');
    }, 1000);
  });
});

gulp.task('bump', function() {
  var packageBump = gulp.src('./package.json')
  .pipe(bump({type:'patch'}))
  .pipe(gulp.dest('./'));

  var manifestBump = gulp.src('./src/manifest.json')
  .pipe(bump({type:'patch'}))
  .pipe(gulp.dest('./src'));

  return merge(packageBump, manifestBump);
});

gulp.task('deploy', ['bump'], function(){
  gulp.src('src/**/**')
  .pipe(zip('archive.zip'))
  .pipe(gulp.dest('dist'));
});