var authorize = require('../lib/authorize')('user'),
    Device = require('../models/device'),
    Keys = require('../models/keys'),
    User = require('../models/user'),
    async = require('async'),
    _ = require('lodash')
;

var
  _connectDevice = function(socket, device){
    socket.handshake.session.device = device;
    socket.join(String(device._id));
  },
  _register = function(socket, data){
    Device.findOne({ code: data.code }, function(err, device){
      if (err)
        return console.log(err);

      if (!device){
        device = new Device({
          code: data.code,
          title: data.title
        });
        device.save(function(err){
          if (err)
            console.log(err);
          _connectDevice(socket, device);
        })
      }
      else {
          _connectDevice(socket, device);
      }
    });
  },
  _list = function(socket){
    User.findOne({_id: socket.handshake.session.passport.user._id}).populate('devices').exec(function(err, user){
      socket.emit('device:list', user.devices);
    })
  },
  _pair = function(socket, data){
    async.waterfall([
      function(cb){
        Keys.findOne({key: data}, cb);
      },
      function(key,cb){
        if (!key) return;
        Device.findOne({_id: key.deviceId}, cb)
      },
      function(device, cb){
        if (!device) reutrn;
        User.update({_id: socket.handshake.session.passport.user._id})
        User.findOne({_id: socket.handshake.session.passport.user._id}, function(err, user){
          if (err)
            return cb(err);
          cb(null, device, user);
        })
      },
      function(device, user, cb){
        var deviceId = String(device._id);
        var index = _.findIndex(user.devices, function(d){
            return String(d) == deviceId;
          });
        if (index < 0){
          user.devices.push(device._id);
          user.save(function(err){
            if (err)
              console.warn(err);
            socket.emit('device:pair', device);
          });
        }
      }
    ]);
  },
  _unpair = function(socket, data){
    socket.emit('device:unpair', data);
    var deviceId = String(req.data._id),
        user = socket.handshake.session.passport.user;

    user.devices = _.filter(user.devices, function(d){
      String(d) !=deviceId;
    });
    User.update({_id: user._id}, {devices: user.devices}, function(err){

    });
  };


module.exports = {
  list: authorize(_list),
  pair: authorize(_pair),
  unpair: authorize(_unpair),
  register: _register
}