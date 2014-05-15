/**
 * Controllers
 */

var accounts = require('../server/controllers/accounts')
  , auth = require('../server/controllers/authentication')
  , chat = require('../server/controllers/chat')
  , url = require('../server/controllers/url');

/**
 * Expose routes
 */

module.exports = function (app) {
    // accounts routes
    app.get('/accounts/:id/activity', accounts.)
};