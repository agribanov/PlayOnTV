var vents = require('./events'),
    avplayObj;

function parseTime(time){
  for (o in time)
    alert('time -> ' + o + ':' + time[o]);
}

var _bufferingCB = {
    onbufferingstart : function() {
      alert("buffering started");
      _setState(Player.states.BUFFERING);
      _triggerEvent('player:buffering:start');
      _triggerEvent('player:play:duration', avplayObj.getDuration())
    },
    onbufferingprogress: function(percent) {
      alert ("on buffering : " + percent);
      _triggerEvent('player:buffering:progress', percent);
    },
    onbufferingcomplete:function() {
      alert ("buffering completely"); 
      _setState(Player.states.PLAYING);
      _triggerEvent('player:buffering:end');
    }
};

var _playCB = { 
    oncurrentplaytime: function(time) {
      alert ("playing time : " + time);
      _triggerEvent('player:play:time', time)
    },
    onresolutionchanged: function(width, height) { 
      alert ("resolution changed : " + width + ", " + height); 
    },
    onstreamcompleted: function() { alert ("streaming completed"); }, 
    onerror: function (error) { alert (error.name); } 
};

function _setState(state){
  Player.state = state;
  _triggerEvent('player:state', state);
  _triggerEvent('player:state:' + state, state);
};

function _triggerEvent(eventName, data){
  vents.emit(eventName, data);
}

function _onAVPlayObtained(obj) {
  avplayObj = obj;
  parseTime(obj);
  alert("getting avplay object successfully");
  _triggerEvent('player:get:success');
}

function _onGetAVPlayError(error) {
  alert("Cannot get avplay object : " + error.name); 
  _triggerEvent('player:get:error', error);
}

function _onPlaySuccess() {
  alert("playing started");
  _triggerEvent('player:play:started');
  _setState(Player.states.PLAYING);
}

function _onPlayError(error) {
  alert("playing error : " + error.name); 
  _triggerEvent('player:play:error', error);
}

function _init(container_id){
  alert('initializing to ' + container_id);
  avplayObj.init({
    containerID : container_id,
    zIndex : 1,
    bufferingCallback : _bufferingCB,
    playCallback : _playCB,
    displayRect : { width : 960, height : 540, top : 0, left : 0 },
    autoratio : true
  });
  _setState(Player.states.STOPPED)
}

function _play(url){
  if (!url) return;
  _setState(Player.states.STARTING);
  avplayObj.stop();
  avplayObj.open(url);
  avplayObj.play(_onPlaySuccess, _onPlayError);
}

function _stop(){
  if (Player.state == Player.states.STOPPED) return;
  _setState(Player.states.STOPPED);
  avplayObj.stop();
}

function _pause(){
  if (Player.state != Player.states.PLAYING) return;
  _setState(Player.states.PAUSED);
  avplayObj.pause();
}

function _resume(){
  if (Player.state != Player.states.PAUSED) return;
  _setState(Player.states.PLAYING);
  avplayObj.resume();
}

function _forward(s){
  alert('forward ' + s);
  if (Player.state != Player.states.PLAYING) return;
  avplayObj.jumpForward(s);
}

function _backward(s){
  if (Player.state != Player.states.PLAYING) return;
  avplayObj.jumpBackward(s)
}

try {
  webapis.avplay.getAVPlay(_onAVPlayObtained, _onGetAVPlayError);
} catch (error) {
  _onGetAVPlayError(error);
}

var Player = {
  states: {
    STOPPED: 0,
    PLAYING: 1,
    PAUSED:  2,
    FORWARD: 3,
    REWIND:  4,
    BUFFERING: 5,
    STARTING: 6
  },
  init: _init,
  play: _play,
  stop: _stop,
  pause: _pause,
  resume: _resume,
  forward: _forward,
  backward: _backward
};

module.exports = Player;