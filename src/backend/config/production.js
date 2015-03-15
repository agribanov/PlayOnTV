module.exports = 
{
  server: {
    port: process.env.PORT
  },
  auth:{
    clientID:     '152072072093-60shq6h75fks19rva26t43birspkd0s1.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_AUTH_SECRET,
    callbackURL: "http://" + process.env.HOST + "/auth/google/callback",
    passReqToCallback   : true
  },
  mongo: {
    connection: process.env.MONGOHQ_URL
  },
  session: {secret: 'express.io makes me happy'}
}