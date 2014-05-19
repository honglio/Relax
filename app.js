var express     = require("express");
var http        = require('http');
var nodemailer  = require('nodemailer');
var fs          = require('fs');
var events      = require('events');
var app         = express();

// Create an http server
app.server      = http.createServer(app);

// Create an event dispatcher
var eventDispatcher = new events.EventEmitter();
app.addEventListener = function ( eventName, callback ) {
  eventDispatcher.on(eventName, callback);
};
app.removeEventListener = function ( eventName, callback ) {
  eventDispatcher.removeListener( eventName, callback );
};
app.triggerEvent = function( eventName, eventOptions ) {
  eventDispatcher.emit( eventName, eventOptions );
};

// Import the data layer
var config = {
  mail: require('./config/mail'),
  path: require('./config/path')
};

// express settings
require('./config/express')(app, config);

// Import accounts to models
var models = {
  Account: require('./server/models/Account')(app, config, nodemailer)
};

// Import the routes
var routes_path = './server/controllers';
fs.readdirSync(routes_path).forEach(function (file) {
  if ( file[0] == '.' ) return;
  // var routeName = file.substr(0, file.indexOf('.'));
  if (~file.indexOf('.js'))
    require(routes_path + '/' + file)(app, models);
});

app.server.listen(8080);
console.log("SocialNet is listening to port 8080.");
