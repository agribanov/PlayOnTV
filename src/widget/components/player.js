/** @jsx React.DOM */

var React = require('react'),
    vents = require('../lib/events'),
    InfoPanel = require('./info'),
    Player = require('../lib/player'),
    TVKey = new Common.API.TVKeyValue();

var infoTimer,
    msToTime = function(duration) {
      var milliseconds = parseInt((duration%1000)/100)
          , seconds = parseInt((duration/1000)%60)
          , minutes = parseInt((duration/(1000*60))%60)
          , hours = parseInt((duration/(1000*60*60))%24);

      hours = (hours < 10) ? "0" + hours : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;

      return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  };

var component = React.createClass({
  getInitialState: function(){
    return {
      infoVisible: false,
      time: 0,
      duration: 0
    }
  },

  showInfo: function(){
    if (this.state.infoVisible){
      clearTimeout(infoTimer);
    }
    else {
      infoTimer = setTimeout(this.showInfo, 5000);
    }
    this.setState({infoVisible: !this.state.infoVisible});
  },

  componentDidMount: function() {
    // registerEventsCallbacks(this.events());
    var self = this;

    vents.on('player:play:time', function(time){self.setState({time: time.timeString})});
    vents.on('player:play:duration', function(duration){self.setState({duration: msToTime(duration)})});
    vents.on('controller:key:' + TVKey.KEY_INFO, this.showInfo);

    Player.init(React.findDOMNode(this.refs.player).getAttribute('id'));
  },

  render: function() {
    var style = {},
        infoStyle = {};
    if (this.props.status == Player.states.STOPPED){
      style.position = 'absolute';
      style.top = '-3000px';
    } else if (!this.state.infoVisible){
      infoStyle.display = 'none';
    }

    return (
      <div style={style}>
        <div id="player_container" ref="player"/>
        <InfoPanel time={this.state.time} duration={this.state.duration} style={infoStyle} />
      </div>
    );
  }

});

module.exports = component;