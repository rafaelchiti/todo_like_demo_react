var _ = require('underscore');
var TimeZone = require('../shared/models/time_zone');
var timeZoneRules = require('../shared/models/time_zone_rules');
var iz = require('iz');
var _ = require('underscore');

module.exports = function(app) {

  // GET
  app.get('/time-zones', function(req, res, next) {
    var criteria = {userId: req.user._id};

    if (req.query.name) {
      criteria.name = {$regex: req.query.name, $options: 'i'};
    }

    TimeZone.find(criteria, function(err, timeZones) {
      if (err) return next(err);
      res.send(timeZones);
    });
  });

  // POST
  app.post('/time-zones', function(req, res, next) {
    var timeZoneProps = _.pick(req.body, ['name', 'cityName', 'gmtOffset']);

    var rules = iz.are(timeZoneRules);

    if (!rules.validFor(timeZoneProps)) {
      var errorMessages = _(_(rules.getInvalidFields()).map(function(field) { return field})).flatten();
      res.statusCode = 422;
      return res.send({errors: rules.getInvalidFields()});
    }

    timeZoneProps.userId = req.user._id;

    TimeZone.create(timeZoneProps, function(err, timeZone) {
      if (err) return next(err);
      res.send(timeZone);
    });
  });

  // DELETE
  app.delete('/time-zones/:id', findTimeZone, function(req, res, next) {
    req.timeZone.remove(function(err, timeZone) {
      if (err) return next(err);
      res.send(timeZone);
    });
  });

};

function findTimeZone(req, res, next) {
  TimeZone.findById(req.params.id, function(err, timeZone) {
    if (err || _.isNull(timeZone) || !req.user._id.equals(timeZone.userId)) {
      res.statusCode = 404;
      return res.end("Not found");
    }
    req.timeZone = timeZone;
    next();
  });
}
