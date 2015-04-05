/** @jsx React.DOM */

var io = require('socket.io-client'),
    React = require('react'),
    vents = require('../lib/events'),
    Player = require('./player'),
    PlayerObj = require('../lib/player');

var widgetAPI = new Common.API.Widget(),
    pluginAPI = new Common.API.Plugin(),
    TVKey = new Common.API.TVKeyValue()
    ;

var 
    onKeyDown = function(e) {
      var keyCode = event.keyCode;
      alert("Main Key code: " + keyCode);
      vents.emit('controller:key', keyCode);
      vents.emit('controller:key:' + keyCode);
    },
    startSocket = function(){
      socket = io.connect('http://playontv.herokuapp.com/');
    },
    registerEventsCallbacks = function(events, context){
      for (e in events){
        vents.on(e, events[e]);

        registerEventEmitter(e);
      }
    },
    registerEventEmitter = function(eventName){
      var e = eventName.split(':');
      if (e.length < 2) return;
      if (eventEmitters[e[0]])
        eventEmitters[e[0]](e.slice(1).join(':'));
    },
    registerSocketEvent = function(eventName){
      alert('registering socket event: ' + eventName);
      socket.on(eventName, function(data){
        alert('socket event triggered: ' + eventName);
        vents.emit('socket:' + eventName, data);
      });
    };

var socket,
    eventEmitters = {
      'socket': registerSocketEvent
    };

var main = React.createClass({
  events: function(){
    var events = {
      'socket:connect': this.socketConnectEvent,
      'socket:error': this.socketErrorEvent,
      'socket:key:generate': this.socketKeyGenerateEvent,
      'socket:playback:play': this.socketPlaybackPlayEvent,
      'controller:key': function(key){ alert('hadle key event: ' + key); },
      'player:state': this.playerStateEvent
    }
      events['controller:key:' + TVKey.KEY_PAUSE] = this.controllerKeyPauseEvent;
      events['controller:key:' + TVKey.KEY_PLAY] = this.controllerKeyPlayEvent;
      events['controller:key:' + TVKey.KEY_STOP] = this.controllerKeyStopEvent;
      events['controller:key:' + TVKey.KEY_RW] = this.controllerKeyBackEvent;
      events['controller:key:' + TVKey.KEY_FF] = this.controllerKeyForwardEvent;
      events['controller:key:' + TVKey.KEY_LEFT] = this.controllerKeyLeftEvent;
      events['controller:key:' + TVKey.KEY_RIGHT] = this.controllerKeyRightEvent;
    return events;
  },

  getInitialState: function() {
    return {
      pairingKey: 'fetching...',
      status: PlayerObj.states.STOPPED
    };
  },

  componentDidMount: function() {
    
    startSocket();

    registerEventsCallbacks(this.events(), this);

    React.findDOMNode(this.refs.anchor).focus();

    widgetAPI.sendReadyEvent();

    alert("component mounted");
  },

  render: function() {
    return (
      <div>
        <div className="pairingKey">Pairing Key: {this.state.pairingKey}</div>
        <a href='javascript:void(0);' ref='anchor' onKeyDown={onKeyDown}></a>
        <Player status={this.state.status} />
      </div>
    );
  },


  // actions
  registerDevice: function(){
    var device = {
                  code: webapis.tv.info.getDeviceID(), 
                  title: 'Samsung SmartTV',  
                  model: webapis.tv.info.getModel()
                };

    socket.emit('device:register', device);
  },

  generatePairingKey: function(){
    alert('quering for key');
    socket.emit('key:generate');
  },


  // Socket events
  socketConnectEvent: function(){
    this.registerDevice();
    this.generatePairingKey();
  },

  socketErrorEvent: function(err){
    alert('error ' + err);
  },

  socketKeyGenerateEvent: function(data){
    this.setState({
      pairingKey: data.key
    });
    alert('received key ' + data.key);
  },

  socketPlaybackPlayEvent: function(data){
    alert('play ' + data.url);
    PlayerObj.play(data.url);
  },

  // Player events
  playerStateEvent: function(state){
    this.setState({status: state});
  },

  // Controller events
  controllerKeyPauseEvent: function(){
    alert('pause');
    PlayerObj.pause();
  },

  controllerKeyPlayEvent: function(){
        alert('resume');

    PlayerObj.resume();
  },

  controllerKeyStopEvent: function(){
    alert('stop');
    PlayerObj.stop();
  },

  controllerKeyBackEvent: function(){
    PlayerObj.backward(15);
  },

  controllerKeyForwardEvent: function(){
    PlayerObj.forward(15);
  },

  controllerKeyLeftEvent: function(){
    PlayerObj.backward(5 * 60);
    // Audio.setRelativeVolume(1);
  },

  controllerKeyRightEvent: function(){
    PlayerObj.forward(5 * 60);
    // Audio.setRelativeVolume(0);
  },



  // onKeyDown: function(e) {
  //   var keyCode = event.keyCode;
  //   alert("Main Key code from React: " + keyCode);
  // },

  // onKeyGenerate: function(data){
  //   this.setState({
  //     key: data.key
  //   });
  //   alert('received key ' + data.key);
  // },

  // onPlay: function(data){
  //   alert('play ' + data.url);
  //   this.setState({status: 'playing'});
  //   Player.setVideoURL(data.url);
  //   Player.playVideo();
  // },

  // generateKey: function(e){
  //   alert('quering for key');
  //   this.socket.emit('key:generate');
  // },

  // startSocket: function(device){
  //   this.socket = socket = io.connect('http://playontv.herokuapp.com/');
  //   socket.on('error', function(err, data){
  //     alert('error ' + err);
  //   });
  //   socket.on('connect', function(){
  //     socket.emit('device:register', device);
  //     socket.emit('key:generate');
  //   });
  //   socket.on('key:generate', this.onKeyGenerate);
  //   socket.on('playback:play', this.onPlay);
  // },

  // initPlayer: function(){
  //   alert('trying to init player');
  //   if ( Player.init() && Audio.init()){
  //     alert('player initialized');
  //   } else {
  //     alert('init player error');
  //   }
  // }


});

module.exports = main;