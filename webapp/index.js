var hbs = require('hbs');
var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var server = require('./server');
var web = module.exports = express();

configureTemplateEngine();
configureStylesheetPreprocessor();
web.use(express.static(__dirname + '/public'));

function configureStylesheetPreprocessor() {
  function compile(str, path) {
    return stylus(str)
      .set('filename', path)
      .set('linenos', true)
      .use(nib());
  };

  web.use(stylus.middleware({
    src: __dirname + '/assets/stylesheets',
    dest: __dirname + '/public',
    compile: compile
  }));
};

function configureTemplateEngine() {
  hbs.registerPartials(__dirname + '/server/views/partials');
  web.engine('html', hbs.__express);

  web.set('view engine', 'hbs');

  web.set('views', __dirname + '/server/views');
};

server(web);