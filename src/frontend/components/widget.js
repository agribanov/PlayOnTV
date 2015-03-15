var React = require('react');

var widget = React.createClass({
  onKeyGenerate: function(data){
    console.log('received key', data);
  },

  onPlay: function(data){
    console.log(data);
  },

  componentDidMount: function() {
    var device = {code: 'SamsungDevice', title: 'Samsung SmartTV'};
    this.socket = socket = io.connect('http://localhost:3000');
    socket.emit('device:register', device);
    socket.on('key:generate', this.onKeyGenerate);
    socket.on('playback:play', function(data){console.log('play', data)});

    setTimeout(function(){
      socket.emit('key:generate');
    },1000);
    // setTimeout(function(){
    //   socket.emit('key:remove');
    // },5000);
  },

  render: function() {
    return (
      <div>Hello from widget!</div>
    );
  }

});

module.exports = widget;