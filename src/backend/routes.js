var deviceCtrl = require('./controllers/device'),
    keyCtrl = require('./controllers/key'),
    playbackCtrl = require('./controllers/playback');

module.exports = function(router){
  // router.add('device',{
  //   list: function(){console.log('device:list', arguments)},
  //   pair: function(){console.log('device:pair', arguments)}
  // })
  router.add('device', deviceCtrl);
  router.add('key', keyCtrl);
  router.add('playback', playbackCtrl);
}