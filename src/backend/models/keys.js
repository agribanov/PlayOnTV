var mongoose = require('mongoose');

var Keys = mongoose.model('keys', {
  key: String,
  deviceId: String
});

module.exports = Keys;