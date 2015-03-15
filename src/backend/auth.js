var _ = require('lodash'),
    passport = require('passport'),
    GoogleStrategy = require( 'passport-google-oauth2' ).Strategy,
    User = require('./models/user'),
    config = require('config');

  passport.use(new GoogleStrategy(config.auth,
    function(request, accessToken, refreshToken, profile, done) {
      // done(null, profile);
      User.findOne({ oauthID: profile.id }, function(err, user){
        if (err) return done(err);
        console.log(user);
        if (user) return done(null, user);

        user = new User({
            provider: profile.provider,
            oauthID: profile.id,
            displayName: profile.displayName,
            email: profile.email
          });
        user.save(function(err){
          if (err) return done(err);
          done(null, user);
        })
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

module.exports = function(app){

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/login', function(req, res){
    res.redirect('/auth/google');
  })

  app.get('/login/success', function(req, res){
    res.redirect('/');
  })

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });


  app.get('/auth/google',
    passport.authenticate('google', { scope: 
      [ 'https://www.googleapis.com/auth/plus.login',
      , 'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
  ));

  app.get( '/auth/google/callback', 
      passport.authenticate( 'google', { 
          successRedirect: '/login/success',
          failureRedirect: '/login'
  }));
}