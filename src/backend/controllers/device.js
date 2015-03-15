var authorize = require('../lib/authorize')('user'),
    Device = require('../models/device'),
    Keys = require('../models/keys'),
    User = require('../models/user'),
    async = require('async'),
    _ = require('lodash')
;

var
  _connectDevice = function(req, device){
    req.session.device = device;
    req.io.join(String(device._id));
  },
  _register = function(req){
    Device.findOne({ code: req.data.code }, function(err, device){
      if (err)
        return console.log(err);

      if (!device){
        device = new Device({
          code: req.data.code,
          title: req.data.title
        });
        device.save(function(err){
          if (err)
            console.log(err);
          _connectDevice(req, device);
        })
      }
      else {
          _connectDevice(req, device);
      }
    });
  },
  _list = function(req){
    User.findOne({_id: req.session.passport.user._id}).populate('devices').exec(function(err, user){
      req.io.emit('device:list', user.devices);
    })
  },
  _pair = function(req){
    async.waterfall([
      function(cb){
        Keys.findOne({key: req.data}, cb);
      },
      function(key,cb){
        if (!key) return;
        Device.findOne({_id: key.deviceId}, cb)
      },
      function(device, cb){
        if (!device) reutrn;
        User.update({_id: req.session.passport.user._id})
        User.findOne({_id: req.session.passport.user._id}, function(err, user){
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
            req.io.emit('device:pair', device);
          });
        }
      }
    ]);
  },
  _unpair = function(req){
    req.io.emit('device:unpair', req.data);
    var deviceId = String(req.data._id),
        user = req.session.passport.user;

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