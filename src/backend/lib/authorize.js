var authorizeByUser = function(cb){
  return function(socket, data){
    if (socket.handshake.session && socket.handshake.session.passport && socket.handshake.session.passport.user)
      cb(socket, data);
  }
};

var authorizeByDevice = function(cb){
  return function(socket){
    if (socket.handshake.session.device){
      console.log('device authorized', socket.handshake.session.device);
      cb(socket);
    }
  }
};

module.exports = function(opt){
  var f;
  switch (opt){
    case 'user': f = authorizeByUser; break;
    case 'device': f = authorizeByDevice; break;
  };
  return f;
}