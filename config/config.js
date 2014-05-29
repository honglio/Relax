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
      name: "niukj.com",
      auth: {
        user: "info@niukj.com",
        pass: "12345china"
      },
      ignoreTLS: false,
      debug: true,
      maxConnections: 5 // Default is 5
    },
    oss: {
      accessKeyId: '3wXgudE0HBMAsuvb',
      accessKeySecret: '8Fl01JVf9L60DDWxighJq8dl4PeAPj',
      host: 'oss-cn-beijing.aliyuncs.com',
      bucket: 'test-niukj'
    },
    weibo: {
      clientID: "1876751546",
      clientSecret: "620aab5cbf338f43a24034d28b7c32eb",
      callbackURL: "http://localhost:3000/auth/weibo/callback"
    },
    renren: {
      clientID: "CONSUMER_KEY",
      clientSecret: "CONSUMER_SECRET",
      callbackURL: "http://localhost:3000/auth/renren/callback"
    },
    qq: {
      clientID: "101101356",
      clientSecret: "6a1622fbe03ae484f4895394afdb5c28",
      callbackURL: "http://localhost:3000/auth/qq/callback"
    },
    linkedin: {
      clientID: "75d51iuwfnv5g9",
      clientSecret: "xlvBqhYm4lKLjNNb",
      callbackURL: "http://localhost:3000/auth/linkedin/callback"
    },
    github: {
      clientID: '4bc43dc1999bb1651532',
      clientSecret: 'cdd93ddff63a2f39d729f645c9bbe9cdd2a8bd6a',
      callbackURL: 'http://localhost:3000/auth/github/callback'
    }
}