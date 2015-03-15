var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = mongoose.model('user', {
  provider: String,
  oauthID: Number,
  displayName: String,
  email: String,
  devices: [{ type: Schema.Types.ObjectId, ref: 'device' }]
});

module.exports = User;