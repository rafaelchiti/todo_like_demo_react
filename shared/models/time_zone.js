var mongoose = require('mongoose');

var timeZoneSchema = new mongoose.Schema({
  name: {type: String, required: true},
  cityName: {type: String, required: true},
  gmtOffset: {type: String, required: true},
  userId: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('TimeZone', timeZoneSchema);
