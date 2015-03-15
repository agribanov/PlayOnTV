/** @jsx React.DOM */

var React = require('react');
var Form = require('./pairingForm');
var Devices = require('./deviceList');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      deviceList: []
    };
  },
  componentDidMount: function() {
    this.socket = socket = io.connect();
    socket.emit('device:list');
    socket.on('device:list', this.onDeviseList);
    socket.on('device:pair', this.onDevicePair);
    socket.on('device:unpair', this.onDeviceUnpair);
  },

  onDeviseList: function(list){
    this.setState({
      deviceList: list
    })
  },

  onDevicePair: function(device){
    var list = this.state.deviceList;
    list.push(device);
    this.setState({
      deviceList: list
    });
  },
  onDeviceUnpair: function(device){
    var list = _.filter(this.state.deviceList, function(d){ return d.id != device.id });
    this.setState({
      deviceList: list
    });
  },

  pairDevice: function(code){
    this.socket.emit('device:pair', code);
  },

  deleteDevice: function(id){
    var device = _.find(this.state.deviceList, function(d){ return d._id == id});
    this.socket.emit('device:unpair', device);
  },

  playbackPlay: function(obj){
    console.log('Play url ', obj.url);
    this.socket.emit('playback:play', obj);
  },


  render: function(){
    return (
      <div className="container">
        <Form onPairing={this.pairDevice} />
        <Devices list={this.state.deviceList} 
                onDeviceDelete={this.deleteDevice}
                onPlaybackPlay={this.playbackPlay}/>
      </div>
    )
  }
});