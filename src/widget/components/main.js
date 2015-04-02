/** @jsx React.DOM */

var React = require('react');
var widgetAPI = new Common.API.Widget(),
    tvKey = new Common.API.TVKeyValue()
    ;


var main = React.createClass({
  getInitialState: function() {
    return {
      key: ''
    };
  },
  onKeyGenerate: function(data){
    this.setState({
      key: data.key
    });
    alert('received key ' + data.key);
  },

  onPlay: function(data){
    alert('play ' + data.url);
  },

  generateKey: function(e){
    alert('quering for key');
    this.socket.emit('key:generate');
  },

  componentDidMount: function() {

    // var socket = io.connect('http://playontv.herokuapp.com/');
    // socket.on('all', function (data) { 
    //   alert('Message type: ' + data.messagetype);
    // });
    // var socket = new WebSocket("ws://playontv.herokuapp.com/");
    // socket.onopen = function() {
    //   alert("Соединение установлено.");
    // };
    // socket.onerror = function(error) {
    //   alert("Ошибка " + error.message);
    // };
    // socket.onmessage = function (event) {
    //     alert(event.data);
    //   };


    widgetAPI.sendReadyEvent();
    var device = {code: 'SamsungDevice', title: 'Samsung SmartTV'};
    this.socket = socket = io.connect('http://playontv.herokuapp.com/');
    socket.on('error', function(err, data){
      alert('error ' + err);
    });
    socket.on('connect', function(){
      socket.emit('device:register', device);
    });
    socket.on('key:generate', this.onKeyGenerate);
    socket.on('playback:play', this.onPlay);

    alert("component mounted");

    setTimeout(function(){
      alert('quering for key');
      socket.emit('key:generate');
    },1000);
  },

  render: function() {
    return (
      <div><img src="http://icons.iconarchive.com/icons/hopstarter/puck/256/AIM-Express-icon.png" alt="logo" /><button onClick={this.generateKey}>Get Key</button> {this.state.key}</div>
    );
  }

});

module.exports = main;