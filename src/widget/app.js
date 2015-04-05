/** @jsx React.DOM */

var React = require('react'),
    App = require('./components/main');

React.render(<App />, document.getElementById('app'));


// some overrides
// Function.prototype.bind = function(ctx) {
//     var fn = this;
//     return function() {
//         fn.apply(ctx, arguments);
//     };
// };
