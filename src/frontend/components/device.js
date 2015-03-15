var React = require('react');

var device = React.createClass({

  deleteDevice: function(e){
    e.preventDefault();
    if (confirm('You are going to delete pairing with ' + this.props.title + '.\n Are you sure?'))
      this.props.onDeviceDelete(this.props.id);
  },
  play: function(e){
    var result = prompt('Please provide url to play on ' + this.props.title + '.');
    if (result)
      this.props.onPlaybackPlay({
              deviceId: this.props.id,
              url: result
              })
  },

  render: function() {
    return (
      <div className="col-xs-6 cols-sm-4 col-md-3">
        <div className="thumbnail">
          <img src="/assets/tv.jpg" />
          <h3>{this.props.title} 
            <a href="#" className="pull-right btn btn-link" onClick={this.deleteDevice}><span className="glyphicon glyphicon-remove"></span></a>
          </h3>
          <button className="btn btn-danger" onClick={this.play}><span className="glyphicon glyphicon-play"></span> Play</button>
        </div>
      </div>
    );
  }

});

module.exports = device;