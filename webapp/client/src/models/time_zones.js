var Backbone = require('backbone');
var TimeZone = require('./time_zone');

var TimeZones = Backbone.Collection.extend({
  url: 'api/time-zones',

  model: TimeZone,

  fetchTimeZonesWithName: function(name) {
    this.fetch({data:{name: name}});
  }

});

module.exports = TimeZones;
