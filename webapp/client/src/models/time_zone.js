var Backbone = require('backbone');

var TimeZone = Backbone.Model.extend({
  idAttribute: "_id",

  urlRoot : 'api/time-zones'
});

module.exports = TimeZone;