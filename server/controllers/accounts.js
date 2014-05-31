var mongoose = require('mongoose');
var Account = mongoose.model('Account');
var _ = require('underscore');

var callback = function(cb) {
  cb();
}
/***************************************************
   *
   * Account
   *
   ***************************************************/

/**
 * GET /account
 * Profile page.
 */

exports.accountbyId = function(req, res, next) {

  var contactId = req.param('uid', null);

  req.account.contacts.followings.forEach(function(following, i) {
    Account.load(following.accountId, function(err, contact) {
      if (err) next(err);
      req.account.contacts.followings[i] = contact;
    });
  });
  req.account.contacts.followers.forEach(function(follower, i) {
    Account.load(follower.accountId, function(err, contact) {
      if (err) next(err);
      req.account.contacts.followers[i] = contact;
    });
  });

  setTimeout(function() {
    Account.findById(req.user.id, function(err, user) {
      if (err) return next(err);
      if ( !user ) return;

      if(Account.hasFollowing(user, contactId)) {
        res.render('account/profileById', {
          title: 'Account Management',
          account: req.account,
          followed: true
        });
      } else {
        res.render('account/profileById', {
          title: 'Account Management',
          account: req.account,
          followed: false
        });
      }
    });
  }, 100);
};

exports.removeContact = function(req, res, next) {
  var contactId = req.param('uid', null);

  Account.findById(req.user.id, function(err, user) {
    if (err) return next(err);
    if ( !user ) return;
    Account.findById(contactId, function(err, contact) {
      if (err) return next(err);
      if ( !contact ) return;
      console.log('removeContact:');
      Account.removeFollowing(user, contactId);
      // Kill the reverse link
      Account.removeFollower(contact, req.user.id);

      user.save(function (err) {
        if (err) {
          console.log('Error saving account: ' + err);
          return next(err);
        }
      });
      contact.save(function (err) {
        if (err) {
          console.log('Error saving account: ' + err);
          return next(err);
        }
      });
      req.flash('success', { msg: 'Contact Removed.' });
      return res.redirect('/account/' + contactId);
    });
  });
};


exports.addContact = function(req, res, next) {
  var contactId = req.param('uid', null);

  // Missing contactId, don't bother going any further, or
  // contactId is the same as accountId, you can't add yourself as contact.
  if ( null == contactId || contactId === req.user.id ) {
    req.flash('errors', { msg: 'Can not add yourself as contact.' });
    return res.redirect('/account/' + contactId);
  }

  Account.findById(req.user.id, function(err, user) {
    if (err) return next(err);
    if ( !user ) return;
    Account.findById(contactId, function(err, contact) {
      if (err) return next(err);
      if ( !contact ) return;
      console.log('addContact:');

      Account.addFollowing(user, contact);
      Account.addFollower(contact, user);

      user.save(function (err) {
        if (err) {
          console.log('Error saving account: ' + err);
          return next(err);
        }
      });
      contact.save(function (err) {
        if (err) {
          console.log('Error saving account: ' + err);
          return next(err);
        }
      });

      req.flash('success', { msg: 'Contact Added.' });
      return res.redirect('/account/' + contactId);
    });
  });
};

exports.findContact = function(req, res) {
  var searchStr = req.param('searchStr', null);

  if ( null == searchStr) {
    res.send(400);
    return;
  }

  findByString(searchStr, function onSearchDone(err, accounts) {
    if (err || accounts.length == 0) {
      res.send(404);
    } else {
      res.send(accounts);
    }
  });
};

/**
 * Load
 */

exports.load = function(req, res, next, id){
  Account.load(id, function (err, account) {
    if (err) return next(err);
    if (!account) return next(new Error('not found'));
    req.account = account;
    next();
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */

exports.postUpdateProfile = function(req, res, next) {
  Account.findById(req.user.id, function(err, user) {
    if (err) return next(err);
    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.profile.gender = req.body.gender || '';
    user.profile.location = req.body.location || '';
    user.profile.website = req.body.website || '';

    user.save(function (err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Profile information updated.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/password
 * Update current password.
 * @param password
 */

exports.postUpdatePassword = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  Account.findById(req.user.id, function(err, user) {
    if (err) return next(err);

    user.password = req.body.password;

    user.save(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Password has been changed.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 * @param id - User ObjectId
 */

exports.postDeleteAccount = function(req, res, next) {
  Account.remove({ _id: req.user.id }, function(err) {
    if (err) return next(err);
    req.logout();
    res.redirect('/');
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth2 provider from the current user.
 * @param provider
 * @param id - User ObjectId
 */

exports.getOauthUnlink = function(req, res, next) {
  var provider = req.params.provider;
  Account.findById(req.user.id, function(err, user) {
    if (err) return next(err);

    user[provider] = undefined;
    user.tokens = _.reject(user.tokens, function(token) { return token.kind === provider; });

    user.save(function(err) {
      if (err) return next(err);
      req.flash('info', { msg: provider + ' account has been unlinked.' });
      res.redirect('/account');
    });
  });
};

function findByString(searchStr, callback) {
  var searchRegex = new RegExp(searchStr, 'i');
  Account.find({
    $or: [
      { 'name':  { $regex: searchRegex } },
      { email:   { $regex: searchRegex } }
    ]
  }, callback);
};