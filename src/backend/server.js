var config = require('config');

module.exports = function(http){
  var server = http.listen(config.server.port);
}