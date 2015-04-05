var config = require('config'),
    express = require('express'),
    app     = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    cookieParser = require('cookie-parser')(config.cookie.secret),
    session = require('express-session')(config.session);

app.use(cookieParser);
app.use(session);


/* Random backgrounds */

app.get('/bg', function(req, res){
  var index = Math.floor((Math.random() * config.backgrounds.length));
  res.redirect(config.backgrounds[index]);
});

app.use('/assets/backgrounds', express.static('build/assets/backgrounds'));

/* ------ */

require('./auth')(app);

app.use(function(req, res, next){
  if (!req.isAuthenticated())
    return res.redirect('/login');
  next();
});

io.use(function(socket, next) {
    var req = socket.handshake;
    var res = {};
    cookieParser(req, res, function(err) {
        if (err) return next(err);
        session(req, res, next);
    });
});

require('./socket')(io);

app.use(express.static('build'));

require('./db')();

require('./server')(http);
