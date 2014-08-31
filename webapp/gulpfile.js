var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var glob = require('glob');
var open = require("gulp-open");
var gutil = require('gulp-util');
var watchify = require('watchify');

var vendors = ['jquery', 'react', 'underscore', 'backbone'];

var tasks = {};

var configureBundler = function(bundler, files, configFunc) {
  files.forEach(function(file) {
    bundler[configFunc](file);
  });

  return bundler;
};

function bundlerInstance(watch, config) {
  var bundler;

  if (watch) {

    bundler = watchify(config.entryConfig);
    bundler.on('update', function() {
      return bundle(bundler, config);
    });

  } else {

    bundler = browserify(config.entryConfig);

  }

  if (config.external) {
    configureBundler(bundler, config.external, 'external');
  }

  if (config.require) {
    configureBundler(bundler, config.require, 'require');
  }

  bundler.on('log', function(msg) {gutil.log(msg)})

  return bundler;
};

function bundle(bundler, config) {
  var options = config.bundleOptions || {};

  return bundler.bundle(options)
      .on('error', function(err) {gutil.log(err), gutil.beep()})
      .pipe(source(config.destFile))
      .pipe(gulp.dest(__dirname + config.destDir));
}


// --------------------
// VENDOR
// -

var bundleVendor = function(watch) {
  var config = {
    entryConfig: {entries: __dirname + '/client/vendor/vendor.js'},
    require: vendors,
    destFile: 'client_vendor_bundle.js',
    destDir: '/public/js'
  };

  var bundler = bundlerInstance(watch, config);
  return bundle(bundler, config);
}

gulp.task('bundle-client-vendor', function() {
  return bundleVendor();
});


// --------------------
// LIB
// -

var bundleLib = function(options) {
  var config = {
    entryConfig: {entries: __dirname + '/client/lib/lib.js'},
    external: vendors,
    destFile: 'client_lib_bundle.js',
    destDir: '/public/js'
  };

  var bundler = bundlerInstance(options.watch, config);
  return bundle(bundler, config);
}

gulp.task('bundle-client-lib', function() {
  return bundleLib({watch: false});
});

gulp.task('watch-client-lib', function() {
  return bundleLib({watch: true});
});


// --------------------
// SRC
// -

var bundleSrc = function(options) {
  var config = {
    entryConfig: {entries: __dirname + '/client/client.js', extensions: ['.js', '.jsx']},
    external: vendors,
    destFile: 'client_src_bundle.js',
    destDir: '/public/js',
    bundleOptions: {debug: options.debug}
  };

  var bundler = bundlerInstance(options.watch, config);
  return bundle(bundler, config);
}

gulp.task('bundle-client-src', function() {
  return bundleSrc({watch: false, debug: false});
});

gulp.task('watch-client-src', function() {
  return bundleSrc({watch: true, debug: true});
});


// TEST

var bundleTest = function(watch) {
  var specs = glob(__dirname + '/client/**/*_spec.js', {sync: true});
  if (specs.length === 0) return;

  var config = {
    entryConfig: {entries: specs, extensions: ['.js', '.jsx']},
    external: vendors,
    destFile: 'client_test_bundle.js',
    destDir: '/public/js',
    bundleOptions: {debug: true}
  };

  var bundler = bundlerInstance(watch, config);
  return bundle(bundler, config);
}

gulp.task('bundle-client-test', function() {
  return bundleTest();
});

gulp.task('watch-client-test', function() {
  return bundleTest(true);
});


gulp.task('client-test-runner', function() {
  gulp.src(__dirname + "/client/test/runner.html").pipe(open());
});


gulp.task('dev', ['bundle-client-vendor', 'watch-client-lib', 'watch-client-src', 'watch-client-test']);

module.exports = tasks;
