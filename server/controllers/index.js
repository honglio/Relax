/**
 * GET /
 * Home page.
 */

exports.home = function(req, res) {
  res.render('home', {
    title: 'Home'
  });
};

/**
 * GET /login
 * Login page.
 */
exports.login = function(req, res) {
  if (req.user) return res.redirect('/');
  res.render('account/login', {
    title: 'Login'
  });
};

/**
 * GET /logout
 * Log out.
 */

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * GET /signup
 * Signup page.
 */

exports.signup = function(req, res) {
  if (req.user) return res.redirect('/');
  res.render('account/signup', {
    title: 'Create Account'
  });
};

/**
 * GET /forgot
 * Forgot Password page.
 */

exports.forgot = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * GET /account
 * Profile page.
 */

exports.account = function(req, res) {
  res.render('account/profile', {
    title: 'Account Management'
  });
};

/**
 * GET /api
 * List of API examples.
 */

exports.api = function(req, res) {
  res.render('api/index', {
    title: 'API Examples'
  });
};

/**
 * GET /contact
 * Contact form page.
 */

exports.contactForm = function(req, res) {
  res.render('contactForm', {
    title: 'Contact'
  });
};