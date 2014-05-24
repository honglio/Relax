var express = require('express')
    , mongoose = require('mongoose')
    , mongoStore = require('connect-mongo')(express)
    , flash = require('express-flash')
    , winston = require('winston')
    , expressValidator = require('express-validator')
    , errorHandler = require('errorhandler')
    , csrf = require('lusca').csrf()
    , helpers = require('view-helpers')
    , config = require('./config');

module.exports = function (app, passport) {
    // set backend views path, template engine and default layout
    app.set('views', config.root + '/server/views');
    app.set('view engine', 'jade');

    // should be placed before express.static
    app.use(express.compress({
        filter: function (req, res) {
          return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    app.use(express.favicon())
    app.use(express.static(config.root + '/public'))

    var log = {
      stream: {
        write: function (message, encoding) {
          winston.info(message);
        }
      }
    };

    app.use(express.logger(log));

    // cookieParser should be above session
    app.use(express.cookieParser());
    // bodyParser should be above methodOverride
    app.use(express.bodyParser());
    app.use(expressValidator());
    app.use(express.methodOverride());

    // express/mongo session storage
    app.use(express.session({
        secret: config.sessionSecret,
        store: new mongoStore({
            url: config.db,
            auto_reconnect: true
        })
    }));
    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());
    // connect flash for flash messages - should be declared after sessions
    app.use(flash());
    // should be declared after session and flash
    app.use(helpers('Relax'));
    // adds CSRF attack protect
    var whitelist = ['/url1', '/url2'];
    app.use(function(req, res, next){
        if (whitelist.indexOf(req.path) !== -1) next();
        else csrf(req, res, next);
    })
    app.use(function(req, res, next) {
      res.locals.user = req.user;
      next();
    });
    // Keep track of previous URL to redirect back to
    // original destination after a successful login.
    app.use(function(req, res, next) {
      if (req.method !== 'GET') return next();
      var path = req.path.split('/')[1];
      if (/(auth|login|logout|signup)$/i.test(path)) return next();
      req.session.returnTo = req.path;
      next();
    });

    // routes should be at the last
    app.use(app.router);

    /**
     * 500 Error Handler.
     * As of Express 4.0 it must be placed at the end, after all routes.
     */

    app.use(errorHandler());

    // Connect to mongodb
    var connect = function () {
      var options = { server: { socketOptions: { keepAlive: 1 } } };
      mongoose.connect(config.db, options);
    };
    connect();
    // Error handler
    mongoose.connection.on('error', function (err) {
      console.log(err);
    });
    // Reconnect when closed
    mongoose.connection.on('disconnected', function () {
      connect();
    });
};