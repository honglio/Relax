var path = require('path');

module.exports = {
    db: process.env.MONGODB || 'mongodb://localhost/relax',
    root: path.normalize(__dirname + '/..'),
    sessionSecret: process.env.SESSION_SECRET || 'Relax',
    // Copy in your particulars and rename this to mail.js
    mail: {
      service: "WanWang",
      host: "smtp.mxhichina.com",
      port: 25,
      secureConnection: false,
      name: "relax.com",
      auth: {
        user: "info@relax.com",
        pass: "password"
      },
      ignoreTLS: false,
      debug: true,
      maxConnections: 5 // Default is 5
    },
    oss: {
      accessKeyId: 'CONSUMER_KEY',
      accessKeySecret: 'CONSUMER_SECRET',
      host: 'oss-cn-beijing.aliyuncs.com',
      bucket: 'test-relax'
    },
    weibo: {
      clientID: "CONSUMER_KEY",
      clientSecret: "CONSUMER_SECRET",
      callbackURL: "http://localhost:3000/auth/weibo/callback"
    },
    renren: {
      clientID: "CONSUMER_KEY",
      clientSecret: "CONSUMER_SECRET",
      callbackURL: "http://localhost:3000/auth/renren/callback"
    },
    qq: {
      clientID: "CONSUMER_KEY",
      clientSecret: "CONSUMER_SECRET",
      callbackURL: "http://localhost:3000/auth/qq/callback"
    },
    linkedin: {
      clientID: "CONSUMER_KEY",
      clientSecret: "CONSUMER_SECRET",
      callbackURL: "http://localhost:3000/auth/linkedin/callback"
    },
    github: {
      clientID: 'CONSUMER_KEY',
      clientSecret: 'CONSUMER_SECRET',
      callbackURL: 'http://localhost:3000/auth/github/callback'
    }
}