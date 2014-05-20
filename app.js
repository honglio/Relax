var express     = require("express");
var fs          = require('fs');
var app         = express();
var passport    = require('passport');
var config      = require('./config/config');

// Import accounts to models
var models_path = __dirname + '/server/models'
fs.readdirSync(models_path).forEach(function (file) {
  if ( file[0] == '.' ) return;
  if (~file.indexOf('.js')) require(models_path + '/' + file)
})

// passport settings
require('./config/passport')(passport, config);

// express settings
require('./config/express')(app, config, passport);

// Import the routes and controllers
var routes_path = __dirname + '/server/controllers';
require(routes_path + '/' + 'api')(app);

app.listen(8080);
console.log("SocialNet is listening to port 8080.");

// expose app
exports = module.exports = app;