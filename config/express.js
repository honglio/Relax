var express = require('express');
var mongoose = require('mongoose');
var MemoryStore = require('connect').session.MemoryStore;

module.exports = function (app, config, passport) {
    // Create a session store to share between methods
    app.sessionStore = new MemoryStore();

    app.configure(function(){
        app.sessionSecret = 'SocialNet secret key';
        app.use(express.limit('2mb'));
        app.use(express.static(config.path.root + '/public'));
        // set backend views path, template engine and default layout
        app.set('views', config.path.root + '/server/views');
        app.set('view engine', 'jade');
        // cookieParser should be above session
        app.use(express.cookieParser());
        // bodyParser should be above methodOverride
        app.use(express.bodyParser());
        app.use(express.methodOverride());

        // express/mongo session storage
        app.use(express.session({
            secret: app.sessionSecret,
            key: 'express.sid',
            store: app.sessionStore
        }));

        mongoose.connect(config.path.db, function onMongooseError (err) {
            if (err) throw err;
        });
    });
};