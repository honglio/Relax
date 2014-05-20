var path = require('path');

module.exports = {
    db: 'mongodb://localhost/nodebackbone',
    root: path.normalize(__dirname + '/..'),

    // Copy in your particulars and rename this to mail.js
    mail: {
      service: "WanWang",
      host: "smtp.mxhichina.com",
      port: 25,
      secureConnection: false,
      //name: "servername",
      auth: {
        user: "info",
        pass: "12345china"
      },
      ignoreTLS: false,
      debug: false,
      maxConnections: 5 // Default is 5
    },
    weibo: {
      clientID: "APP_ID",
      clientSecret: "APP_SECRET",
      callbackURL: "http://localhost:3000/auth/weibo/callback"
    },
    renren: {
      clientID: "CONSUMER_KEY",
      clientSecret: "CONSUMER_SECRET",
      callbackURL: "http://localhost:3000/auth/renren/callback"
    },
    qq: {
      clientID: "APP_ID",
      clientSecret: "APP_SECRET",
      callbackURL: "http://localhost:3000/auth/qq/callback"
    },
    linkedin: {
      clientID: "CONSUMER_KEY",
      clientSecret: "CONSUMER_SECRET",
      callbackURL: "http://localhost:3000/auth/linkedin/callback"
    },
    github: {
      clientID: 'APP_ID',
      clientSecret: 'APP_SECRET',
      callbackURL: 'http://localhost:3000/auth/github/callback'
    }
}