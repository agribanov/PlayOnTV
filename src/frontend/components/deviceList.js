/** @jsx React.DOM */

var React = require('react');
var Device = require('./device');

var deviceList = React.createClass({

  render: function() {
    var list = this.props.list.map(function(device){
      return <Device key={device._id} id={device._id} title={device.title} 
              onDeviceDelete={this.props.onDeviceDelete}
              onPlaybackPlay={this.props.onPlaybackPlay}/>
    }, this);

    return (
      <div className="panel panel-default">
        <div className="panel-heading"><h4>Paired Devices</h4></div>
        <div className="panel-body">
          <div className="row">
            {list}
          </div>
        </div>
      </div>
    );
  }

});

module.exports = deviceList;