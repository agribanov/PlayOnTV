/** @jsx React.DOM */

var React = require('react');
var widgetAPI = new Common.API.Widget(),
    tvKey = new Common.API.TVKeyValue(),
    Main = {};


var main = React.createClass({

  componentDidMount: function() {
    this.socket = socket = io.connect('http://192.168.0.103:3000');
    socket.on('connect_error',function(error){
      alert('connectio error - ' + error)
    });
    socket.emit('device:list');
    alert("component mounted");
    widgetAPI.sendReadyEvent();

  },

  render: function() {
    return (
      <div>Hello from React </div>
    );
  }

});

module.exports = main;