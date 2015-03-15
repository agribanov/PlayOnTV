var config = require('config');

module.exports = function(app){
  var server = app.listen(config.server.port);
}