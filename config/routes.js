/**
 * Controllers
 */

var index = require('../server/controllers/index');
var accounts = require('../server/controllers/accounts');
var comments = require('../server/controllers/comments');
var articles = require('../server/controllers/articles');
var tags = require('../server/controllers/tags');
var auth = require('../server/controllers/auth');
var api = require('../server/controllers/api');
var contactForm = require('../server/controllers/contactForm');
var passportConf = require('./passport');

/*
 * Routes Example
 *
 * Name       Method    Path
 * ---------------------------------------------
 * Index      GET     /restaurants
 * Show       GET     /restaurants/:id
 * New        GET     /restaurants/new
 * Create     POST    /restaurants
 * Edit       GET     /restaurants/edit
 * Update       PUT     /restaurants/:id
 * Delete       GET     /restaurants/delete
 * Destroy      DELETE    /restaurants/:id
 * Search     GET     /restaurants/search?<query>
 * Showcodes    GET     /restaurants/:id/codes
 * Generatecodes  GET     /restaurants/:id/generate?n=<number>
 */

module.exports = function (app, passport) {
  /**
   * Home page routes.
   */
  app.get('/', articles.index);

  /**
   * Web page routes.
   */
  app.get('/account', passportConf.isAuthenticated, index.account);
  app.get('/login', index.login);
  app.get('/logout', index.logout);
  app.get('/signup', index.signup);
  app.get('/forgot', index.forgot);
  app.get('/api', index.api);
  app.get('/contactForm', index.contactForm);

  /**
   * Contact From routes.
   */
  app.post('/contactForm', contactForm.postContact);

  /**
   * Authentication routes.
   */
  app.post('/login', auth.postLogin);
  app.post('/forgot', auth.postForgot);
  app.get('/reset/:token', auth.getReset);
  app.post('/reset/:token', auth.postReset);
  app.post('/signup', auth.postSignup);

  /**
   * user account routes.
   */
  app.get('/account/:id/contacts', passportConf.isAuthenticated, accounts.getContact);
  app.post('/account/:id/contact', passportConf.isAuthenticated, passportConf.user.isAuthorized, accounts.addContact);
  app.delete('/account/:id/contact', passportConf.isAuthenticated, passportConf.user.isAuthorized, accounts.removeContact);

  app.get('/account/:id/viewNum', passportConf.isAuthenticated, accounts.getViewNum);
  app.post('/account/:id/viewNum', passportConf.isAuthenticated, passportConf.user.isAuthorized, accounts.postViewNum);
  app.get('/account/:id', passportConf.isAuthenticated, accounts.getAccount); // index.account
  // app.get('/account/:id/profile', passportConf.isAuthenticated, accounts.getStatus);
  app.post('/account/:id/profile', passportConf.isAuthenticated, passportConf.user.isAuthorized, accounts.addStatus);
  app.post('/account/profile', passportConf.isAuthenticated, accounts.postUpdateProfile);
  app.post('/account/password', passportConf.isAuthenticated, accounts.postUpdatePassword);
  app.post('/account/delete', passportConf.isAuthenticated, accounts.postDeleteAccount);
  app.get('/account/unlink/:provider', passportConf.isAuthenticated, accounts.getOauthUnlink);
  app.post('/contacts/find', passportConf.isAuthenticated, accounts.findContact);

  /**
   * 3rd party account routes.
   */
  app.get('/api/weibo', passportConf.isAuthenticated, passportConf.isAuthorized, api.getWeibo);
  app.get('/api/renren', passportConf.isAuthenticated, passportConf.isAuthorized, api.getRenren);
  app.get('/api/qq', passportConf.isAuthenticated, passportConf.isAuthorized, api.getQQ);
  app.get('/api/github', passportConf.isAuthenticated, passportConf.isAuthorized, api.getGithub);
  app.get('/api/linkedin', passportConf.isAuthenticated, passportConf.isAuthorized, api.getLinkedin);

  /**
   * OAuth routes for sign-in.
   */
  app.get('/auth/weibo', passport.authenticate('weibo'));
  app.get('/auth/weibo/callback', passport.authenticate('weibo', { failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
  });
  app.get('/auth/renren', passport.authenticate('renren'));
  app.get('/auth/renren/callback', passport.authenticate('renren', { failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
  });
  app.get('/auth/qq', passport.authenticate('qq', { state: 'random state value', scope: ['get_user_info', 'list_album'] }));
  app.get('/auth/qq/callback', passport.authenticate('qq', { failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
  });
  app.get('/auth/github', passport.authenticate('github'));
  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
  });
  app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
  app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
  });

  // article routes
  app.param('id', articles.load);
  app.get('/articles', articles.index);
  app.get('/articles/new', passportConf.isAuthenticated, articles.new);
  app.post('/articles', passportConf.isAuthenticated, articles.create);
  app.get('/articles/:id', articles.show);
  app.get('/articles/:id/edit', passportConf.isAuthenticated, passportConf.article.isAuthorized, articles.edit);
  app.put('/articles/:id', passportConf.isAuthenticated, passportConf.article.isAuthorized, articles.update);
  app.del('/articles/:id', passportConf.isAuthenticated, passportConf.article.isAuthorized, articles.destroy);

  // comment routes
  app.param('commentId', comments.load);
  app.post('/articles/:id/comments', passportConf.isAuthenticated, comments.create);
  app.get('/articles/:id/comments', passportConf.isAuthenticated, comments.create);
  app.del('/articles/:id/comments/:commentId', passportConf.isAuthenticated, passportConf.comment.isAuthorized, comments.destroy);

  // tag routes
  app.get('/tags/:tag', tags.index);
}