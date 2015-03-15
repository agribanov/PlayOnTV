/** @jsx React.DOM */

var React = require('react'),
    App = require('./components/main');

React.render(<App />, document.getElementById('app'));


// alert ('app.js loaded');

// var widgetAPI = new Common.API.Widget(),
//     tvKey = new Common.API.TVKeyValue(),
//     Main = {};

// document.getElementsByTagName('body').item(0).addEventLstener('load', Main.onLoad);
// document.getElementsByTagName('body').item(0).addEventLstener('unload', Main.onUnload);

// Main.onLoad = function() {
//     alert("Main.onLoad()");
//     // this.enableKeys();
//     widgetAPI.sendReadyEvent();
// };

// window.onShow = function () {
//     alert("window.onShow()");
// };

// window.onHide = function () {
//     alert("window.onHide()");
// };

// Main.onUnload = function() {
//     alert("Main.onUnload()");
// }

// alert(Main);