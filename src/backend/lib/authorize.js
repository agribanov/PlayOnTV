var authorizeByUser = function(cb){
  return function(req){
    if (req.session.passport.user)
      cb(req);
  }
};

var authorizeByDevice = function(cb){
  return function(req){
    if (req.session.device){
      console.log('device authorized', req.session.device);
      cb(req);
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