var express = require('express');
var app = module.exports = express();
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../shared/models/user');

passport.use(new BasicStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser());
app.use(require('../shared/session'));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate(['basic', 'session']));

app.use(function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.statusCode = 401;
    return res.end("Unauthorized");
  }
  next();
});

require('./routes')(app);
