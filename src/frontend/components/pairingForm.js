/** @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({
  onSubmit: function(e){
    e.preventDefault();

    var code = this.refs.code.getDOMNode().value;

    this.refs.pairingForm.getDOMNode().reset();

    this.props.onPairing(code);
  },

  render: function(){
    return (
      <div className="panel panel-default">
        <div className="panel-body">
          <div className="row"><div className="col-xs-12"><h4>Add new device</h4></div></div>
          <div className="row">
            <div className="col-xs-12">
              <form className="form-inline" ref="pairingForm" onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input type="text" ref="code" className="form-control" placeholder="Pairing Code" /> 
                </div>
                <button className="btn btn-primary">Add</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
});