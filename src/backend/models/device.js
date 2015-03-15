var mongoose = require('mongoose');

var Device = mongoose.model('device', {
  code: String,
  title: String
});

module.exports = Device;