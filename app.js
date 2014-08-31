var express = require('express');
var webApp = require('./webapp');
var apiServer = require('./api');

var app = express();

var mongoose = require('mongoose');
var mongoUri = process.env.MONGOHQ_URL || 'mongodb://localhost/time_zone_app_dev';

mongoose.connect(mongoUri);
app.use(express.logger());

app.use('/api', apiServer);
app.use(webApp);

var port = process.env.PORT || 5000;
app.listen(port);
console.log("Listening on port " + port);