var authorize = require('../lib/authorize')('user'),
    _ = require('lodash')
  ;

var
  _play = function(req){
    deviceId = String(req.data.deviceId);
    var index = _.findIndex(req.session.passport.user.devices, function(d){
        return String(d) == deviceId;
      });
    console.log(index, deviceId);
    if (index > -1){
      req.io.join(req.data.deviceId);
      req.io.room(req.data.deviceId).broadcast('playback:play',req.data);
    }
  };

module.exports = {
  play: authorize(_play)
}
