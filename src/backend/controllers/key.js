var authorize = require('../lib/authorize')('device'),
    Keys = require('../models/keys'),
    crypto = require('crypto');

function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
}

var
  _generate = function(socket){
    var key = randomValueHex(7);
    Keys.remove({deviceId: socket.handshake.session.device._id}, function(err){
      var pair = new Keys({deviceId: socket.handshake.session.device._id, key: key});
      pair.save(function(err){
        socket.emit('key:generate', {key: key});
      });
    })
  },
  _remove = function(socket){
    Keys.remove({deviceId: socket.handshake.session.device._id}, function(err){
      if (err)
        console.log(err);
    })
  }
  ;


module.exports = {
  generate: authorize(_generate),
  remove: authorize(_remove)
}