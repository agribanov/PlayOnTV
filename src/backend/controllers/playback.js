var authorize = require('../lib/authorize')('user'),
    _ = require('lodash')
  ;

var
  _play = function(socket, data){
    deviceId = String(data.deviceId);
    var index = _.findIndex(socket.handshake.session.passport.user.devices, function(d){
        return String(d) == deviceId;
      });
    console.log(index, deviceId);
    console.log('play', data);
    if (index > -1){
      socket.join(deviceId);
      socket.to(deviceId).emit('playback:play', data);
    }
  };

module.exports = {
  play: authorize(_play)
}
