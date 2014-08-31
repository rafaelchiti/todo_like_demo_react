var passport = require('passport');
var User = require('../../shared/models/user');
var userRules = require('../../shared/models/user_rules');
var iz = require('iz');
var _ = require('underscore');

module.exports = function(app) {

  app.get('/', function(req, res) {
    if (req.isAuthenticated()) {
      res.render('index', {userName: req.user.username});
    } else {
      res.redirect('/login');
    }
  });

  app.get('/login', function(req, res){
    res.render('login', { message: req.flash('error') });
  });

  app.post('/login',
    passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}),
    function(req, res) {
      res.redirect('/');
    });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  app.get('/signup', function(req, res) {
    res.render('signup', { message: req.flash('error') });
  });

  app.post('/signup', function(req, res) {
    var params = _(req.body).pick(['username', 'password']);

    var rules = iz.are(userRules);
    if (!rules.validFor(params)) {
      var errorMessages = _(_(rules.getInvalidFields()).map(function(field) { return field})).flatten();
      return res.render('signup', {user: req.body, messages: errorMessages});
    }

    User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
      if (err) {
        return res.render('signup', { user : user, message: err.message });
      }

      req.login(user, function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
    });

  });

};