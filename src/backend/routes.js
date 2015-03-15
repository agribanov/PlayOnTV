var deviceCtrl = require('./controllers/device'),
    keyCtrl = require('./controllers/key'),
    playbackCtrl = require('./controllers/playback');

module.exports = function(io){

  io.route('device', deviceCtrl);
  io.route('key', keyCtrl);
  io.route('playback', playbackCtrl);
}