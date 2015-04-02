var router = require('./lib/router');
require('./routes')(router);

module.exports = function(io){
  io.on('connection', function (socket) {
    router.apply(socket);
    console.log('socket connected');
  });


}