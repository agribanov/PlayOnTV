/** @jsx React.DOM */

var React = require('react');

var info = React.createClass({

  render: function() {
    return (
      <div className="infoPanel" style={this.props.style}>
        {this.props.time} / {this.props.duration}
      </div>
    );
  }

});

module.exports = info;