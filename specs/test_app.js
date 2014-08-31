var express = require('express');
var webapp = require('../webapp');
var apiServer = require('../api');
var app = express();

var mongoose = require('mongoose');
var mongoUri = 'mongodb://localhost/time_zone_app_test';

mongoose.connect(mongoUri);

app.use('/api', apiServer);
app.use(webapp);

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Ready on port " + port);

var User = require('../shared/models/user');
var TimeZone = require('../shared/models/time_zone');

TimeZone.remove({}, function() {
  console.log('Time Zones removed');
});


function createTimeZone(timeZoneData, user) {
  timeZoneData.userId = user._id;
  timeZoneData.name = timeZoneData.name;
  timeZoneData.cityName = timeZoneData.cityName;
  timeZoneData.gmtOffset = timeZoneData.gmtOffset;

  TimeZone.create(timeZoneData, function(err, timeZone) {
    if (err) console.log(err);
    return timeZone;
  })
}

User.remove({}, function() {
  console.log('Users removed');

  User.register(new User({username: 'rafael' }), 'chiti', function(err, user) {
    if (err) {
      console.log('user creation failed');
      return false;
    }

    console.log('creating dummy time zones');

    createTimeZone({
      name: 'Buenps Aires',
      cityName: 'BUE',
      gmtOffset: -3
    }, user);

    createTimeZone({
      name: 'Brasil',
      cityName: 'BRA',
      gmtOffset: -2
    }, user);

    createTimeZone({
      name: 'Paris',
      cityName: 'PA',
      gmtOffset: +4
    }, user);
  });
});
