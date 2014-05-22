var express     = require("express");
var passport    = require("passport");
var fs          = require('fs');
var app         = express();

// Import accounts to models
var models_path = __dirname + '/server/models';
fs.readdirSync(models_path).forEach(function (file) {
  if ( file[0] == '.' ) return;
  if (~file.indexOf('.js')) require(models_path + '/' + file);
});

// express settings
require('./config/express')(app, passport);

// Import routes
require('./config/routes')(app, passport);

app.listen(8080);
console.log("SocialNet is listening to port 8080.");

// expose app
exports = module.exports = app;