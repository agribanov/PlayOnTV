module.exports = 
{
  server: {
    port: 3001
  },
  auth:{
    clientID:     '152072072093-60shq6h75fks19rva26t43birspkd0s1.apps.googleusercontent.com',
    clientSecret: 'BoJv1GBnVntS0gZ6UUo5iInu',
    callbackURL: "http://localhost:3001/auth/google/callback",
    passReqToCallback   : true
  },
  mongo: {
    connection: 'mongodb://localhost/test'
  },
  session: {secret: 'express makes me happy'},
  cookie: {secret: 'cookie secret'},
  backgrounds:[
  '/assets/backgrounds/1.jpg',
  '/assets/backgrounds/2.jpg',
  '/assets/backgrounds/3.jpg',
  '/assets/backgrounds/4.jpg',
  '/assets/backgrounds/5.jpg',
  '/assets/backgrounds/6.jpg',
  '/assets/backgrounds/7.jpg'
  ]
}