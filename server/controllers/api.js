var async = require('async');
var config = require('../../config/config');
var querystring = require('querystring');
var request = require('request');
var Github = require('github-api');
var Linkedin = require('node-linkedin')(config.linkedin.clientID, config.linkedin.clientSecret, config.linkedin.callbackURL);
var _ = require('underscore');

/**
 * GET /api/weibo
 * Weibo API example.
 */

exports.getWeibo = function(req, res, next) {
  var token = _.findWhere(req.user.tokens, { kind: 'weibo' });
  async.parallel({
    getMe: function(done) {
    },
    getMyFriends: function(done) {
    }
  },
  function(err, results) {
    if (err) return next(err);
    res.render('api/weibo', {
      title: 'Weibo API',
      me: results.getMe,
      friends: results.getMyFriends
    });
  });
};

/**
 * GET /api/renren
 * Renren API example.
 */

exports.getRenren = function(req, res, next) {
  var token = _.findWhere(req.user.tokens, { kind: 'renren' });
  var R = new Renren({
    consumer_key: config.renren.consumerKey,
    consumer_secret: config.renren.consumerSecret,
    access_token: token.accessToken,
    access_token_secret: token.tokenSecret
  });
  R.get('search/tweets', { q: 'hackathon since:2013-01-01', geocode: '40.71448,-74.00598,5mi', count: 50 }, function(err, reply) {
    if (err) return next(err);
    res.render('api/renren', {
      title: 'Renren API',
      tweets: reply.statuses
    });
  });
};

/**
 * GET /api/qq
 * QQ API example.
 */

exports.getQQ = function(req, res, next) {
  var query = querystring.stringify({ 'api-key': config.qq.key, 'list-name': 'young-adult' });
  var url = 'http://api.qq.com/svc/books/v2/lists?' + query;
  request.get(url, function(error, request, body) {
    if (request.statusCode === 403) return next(Error('Missing or Invalid QQ API Key'));
    var bestsellers = JSON.parse(body);
    res.render('api/qq', {
      title: 'QQ API',
      books: bestsellers.results
    });
  });
};

/**
 * GET /api/linkedin
 * LinkedIn API example.
 */

exports.getLinkedin = function(req, res, next) {
  var token = _.findWhere(req.user.tokens, { kind: 'linkedin' });
  var linkedin = Linkedin.init(token.accessToken);

  linkedin.people.me(function(err, $in) {
    if (err) return next(err);
    res.render('api/linkedin', {
      title: 'LinkedIn API',
      profile: $in
    });
  });
};

/**
 * GET /api/github
 * GitHub API Example.
 */
exports.getGithub = function(req, res) {
  var token = _.findWhere(req.user.tokens, { kind: 'github' });
  var github = new Github({ token: token.accessToken });
  var repo = github.getRepo('honglio', 'piano.js');
  repo.show(function(err, repo) {
    res.render('api/github', {
      title: 'GitHub API',
      repo: repo
    });
  });

};