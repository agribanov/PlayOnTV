var config = require('config'),
    express = require('express.io'),
    app     = express();

app.use(express.cookieParser())
app.use(express.session(config.session))

app.http().io();

require('./auth')(app);

require('./routes')(app.io);

app.use(function(req, res, next){
  if (!req.isAuthenticated())
    return res.redirect('/login');
  next();
});

app.use(express.static('build'));

require('./db')(app);

require('./server')(app);
