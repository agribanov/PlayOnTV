/** @jsx React.DOM */

var React = require('react');
var widgetAPI = new Common.API.Widget(),
    tvKey = new Common.API.TVKeyValue()
    ;

var PlayerContainer = require('./player');

var main = React.createClass({
  getInitialState: function() {
    return {
      key: '',
      status: 'stoped'
    };
  },

  onKeyDown: function(e) {
    var keyCode = event.keyCode;
    alert("Main Key code from React: " + keyCode);
  },

  onKeyGenerate: function(data){
    this.setState({
      key: data.key
    });
    alert('received key ' + data.key);
  },

  onPlay: function(data){
    alert('play ' + data.url);
    this.setState({status: 'playing'});
    Player.setVideoURL(data.url);
    Player.playVideo();
  },

  generateKey: function(e){
    alert('quering for key');
    this.socket.emit('key:generate');
  },

  startSocket: function(device){
    this.socket = socket = io.connect('http://playontv.herokuapp.com/');
    socket.on('error', function(err, data){
      alert('error ' + err);
    });
    socket.on('connect', function(){
      socket.emit('device:register', device);
      socket.emit('key:generate');
    });
    socket.on('key:generate', this.onKeyGenerate);
    socket.on('playback:play', this.onPlay);
  },

  initPlayer: function(){
    alert('trying to init player');
  if ( Player.init() && Audio.init()){
    alert('player initialized');
  } else {
    alert('init player error');
  }
  },

  componentDidMount: function() {
    var device = {code: webapis.tv.info.getDeviceID(), title: 'Samsung SmartTV',  model:webapis.tv.info.getModel()};

    this.startSocket(device);
    this.initPlayer();
    alert(device.code + ' title ' + device.title);
    alert("component mounted");

    React.findDOMNode(this.refs.anchor).focus();

    widgetAPI.sendReadyEvent();
  },

  render: function() {
    return (
      <div>
        <div className = "pairingKey">Pairing Key: {this.state.key}</div>
        <a href='javascript:void(0);' ref='anchor' onKeyDown={this.onKeyDown}></a>
        <PlayerContainer status = {this.state.status} />
      </div>
    );
  }

});

module.exports = main;