var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var open = require("open");
var mocha = require('gulp-mocha');
var clean = require('gulp-clean');

// Expand this gulpfile with the web app one
require('./webapp/gulpfile');

gulp.task('default', ['dev']);

gulp.task('run-spec', function() {
  nodemon({script: __dirname + '/specs/test_app.js', env: {'NODE_ENV': 'test', 'PORT': '3000'}, ext: 'js, html, hbs'});

  setTimeout(function() {
    gulp.src(__dirname + '/specs/**/*_spec.js')
              .pipe(mocha({reporter: 'spec'}))
              .on('end', function() {
                nodemon.emit('quit');
              });
  }, 2000);
});


gulp.task('clean-js-assets', function () {
  var stream = gulp.src(__dirname + '/webapp/public/js', {read: false});
  stream.pipe(clean());
  return stream;
});

gulp.task('prod', ['clean-js-assets','bundle-client-vendor', 'bundle-client-lib', 'bundle-client-src']);
