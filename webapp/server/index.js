var flash = require('connect-flash');
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../shared/models/user');

module.exports = function(app) {
  passport.use(new LocalStrategy(User.authenticate()));

  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  app.use(express.urlencoded());
  app.use(express.cookieParser());
  app.use(require('../../shared/session'));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  require('./routes')(app);
};
