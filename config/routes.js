var indexController = require('../server/controllers/index');
var userController = require('../server/controllers/accounts');
var authController = require('../server/controllers/auth');
var apiController = require('../server/controllers/api');
var contactFormController = require('../server/controllers/contactForm');
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
     * Web page routes.
     */
    app.get('/', indexController.home);
    app.get('/account', passportConf.isAuthenticated, indexController.account);
    app.get('/login', indexController.login);
    app.get('/logout', indexController.logout);
    app.get('/signup', indexController.signup);
    app.get('/forgot', indexController.forgot);
    app.get('/api', indexController.api);
    app.get('/contactForm', indexController.contactForm);

    /**
     * Contact From routes.
     */
    app.post('/contactForm', contactFormController.postContact);

    /**
     * Authentication routes.
     */
    app.post('/login', authController.postLogin);
    app.post('/forgot', authController.postForgot);
    app.get('/reset/:token', authController.getReset);
    app.post('/reset/:token', authController.postReset);
    app.post('/signup', authController.postSignup);

    /**
     * user account routes.
     */
    app.get('/accounts/:id/contacts', passportConf.isAuthenticated, userController.getContact);
    app.post('/accounts/:id/contact', passportConf.isAuthenticated, userController.addContact);
    app.delete('/accounts/:id/contact', passportConf.isAuthenticated, userController.removeContact);
    app.get('/account/:id', passportConf.isAuthenticated, userController.getAccount);
    app.get('/account/:id/viewNum', passportConf.isAuthenticated, userController.getViewNum);
    app.post('/account/:id/viewNum', passportConf.isAuthenticated, userController.postViewNum);
    app.get('/account/:id/status', passportConf.isAuthenticated, userController.getStatus);
    app.post('/account/:id/status', passportConf.isAuthenticated, userController.addStatus);
    app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
    app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
    app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
    app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);
    app.post('/contacts/find', passportConf.isAuthenticated, userController.findContact);

    /**
     * 3rd party account routes.
     */
    app.get('/api/weibo', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getWeibo);
    app.get('/api/renren', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getRenren);
    app.get('/api/qq', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getQQ);
    app.get('/api/github', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getGithub);
    app.get('/api/linkedin', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getLinkedin);

    /**
     * OAuth routes for sign-in.
     */
    app.get('/auth/weibo', passport.authenticate('weibo', { scope: ['email', 'user_location'] }));
    app.get('/auth/weibo/callback', passport.authenticate('weibo', { failureRedirect: '/login' }), function(req, res) {
      res.redirect(req.session.returnTo || '/');
    });
    app.get('/auth/renren', passport.authenticate('renren'));
    app.get('/auth/renren/callback', passport.authenticate('renren', { failureRedirect: '/login' }), function(req, res) {
      res.redirect(req.session.returnTo || '/');
    });
    app.get('/auth/qq', passport.authenticate('qq', { scope: 'profile email' }));
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
}