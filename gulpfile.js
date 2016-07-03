// grab our gulp packages
var gulp = require('gulp'),
    exec = require('child_process').exec;

// create a default task and just log a message
gulp.task('default', ['watch']);

// configure which files to watch and what tasks to use on file changes
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