var express = require('express');

var store = new express.session.MemoryStore();

module.exports = express.session({
  secret: 'my app secret',
  store: store,
  cookie: { maxAge: null }
});
