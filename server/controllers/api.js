var mongoose = require('mongoose');
var User = mongoose.model('Account');
var Account = require('./accounts');

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

module.exports = function(app) {
  app.get('/', function(req, res){
    res.render('index.jade');
  });

  /***************************************************
   *
   * Authentication
   *
   ***************************************************/
  app.post('/login', function(req, res) {
    console.log('login request');
    var email = req.param('email', null);
    var password = req.param('password', null);

    if ( null == email || email.length < 1
        || null == password || password.length < 1 ) {
      res.send(400);
      return;
    }
    console.log(User);
    Account.login(email, password, function(account) {
      if ( !account ) {
        res.send(401);
        return;
      }
      console.log('login was successful');
      req.session.loggedIn = true;
      req.session.accountId = account._id;
      res.send(account._id);
    });
  });

  app.post('/register', function(req, res) {
    var firstName = req.param('firstName', '');
    var lastName = req.param('lastName', '');
    var email = req.param('email', null);
    var password = req.param('password', null);

    if ( null == email || email.length < 1
         || null == password || password.length < 1 ) {
      res.send(400);
      return;
    }

    Account.register(email, password, firstName, lastName);
    res.send(200);
  });

  app.get('/account/authenticated', function(req, res) {
    if ( req.session && req.session.loggedIn ) {
      res.send(req.session.accountId);
    } else {
      res.send(401);
    }
  });

  app.post('/forgotpassword', function(req, res) {
    var hostname = req.headers.host;
    var resetPasswordUrl = 'http://' + hostname + '/resetPassword';
    var email = req.param('email', null);
    if ( null == email || email.length < 1 ) {
      res.send(400);
      return;
    }

    Account.forgotPassword(email, resetPasswordUrl, function(success){
      if (success) {
        res.send(200);
      } else {
        // Username or password not found
        res.send(404);
      }
    });
  });

  app.get('/resetPassword', function(req, res) {
    var accountId = req.param('account', null);
    res.render('resetPassword.jade', {locals:{accountId:accountId}});
  });

  app.post('/resetPassword', function(req, res) {
    var accountId = req.param('accountId', null);
    var password = req.param('password', null);
    if ( null != accountId && null != password ) {
      Account.changePassword(accountId, password);
    }
    res.render('resetPasswordSuccess.jade');
  });

  /***************************************************
   *
   * Account
   *
   ***************************************************/
  app.get('/accounts/:id/activity', function(req, res) {
      var accountId = req.params.id == 'me'
                          ? req.session.accountId
                          : req.params.id;
      User.findById(accountId, function(account) {
        if (null!=account) {
          res.send(account.activity);
        }
      });

  });

  app.get('/accounts/:id/viewNum', function(req, res) {
      var accountId = req.params.id == 'me'
                          ? req.session.accountId
                          : req.params.id;
      Account.findById(accountId, function(account) {
        if (null!=account) {
          console.log(account.viewNum);
          res.send({data: account.viewNum});
        }
      });
  });

  app.post('/accounts/:id/viewNum', function(req, res) {
    var accountId = req.params.id == 'me'
                       ? req.session.accountId
                       : req.params.id;
    Account.findById(accountId, function(account) {
      if (null!=account) {
        account.viewNum += 1;
        account.save();
      }
    });

    res.send(200);
  });

  app.get('/accounts/:id/status', function(req, res) {
      var accountId = req.params.id == 'me'
                          ? req.session.accountId
                          : req.params.id;
      Account.findById(accountId, function(account) {
        if (null!=account) {
          res.send(account.status);
        }
      });
  });

  app.post('/accounts/:id/status', function(req, res) {
      var accountId = req.params.id == 'me'
                          ? req.session.accountId
                          : req.params.id;
      Account.findById(accountId, function(account) {
        if (null!=account) {
          var status = {
              name: {
                first: account.name.first,
                last: account.name.last,
                full: account.name.full
              },
              status: req.param('status', '')
          };
          account.status.push(status);

          // Push the status to all friends
          account.activity.push(status);
          account.save(function (err) {
            if (err) {
                console.log('Error saving account: ' + err);
            }
          });
        }
      });
      res.send(200);
  });

  app.get('/accounts/:id/contacts', function(req, res) {
      var accountId = req.params.id == 'me'
                          ? req.session.accountId
                          : req.params.id;
      Account.findById(accountId, function(account) {
        if(null!=account) res.send(account.contacts);
      });
  });

  // remove contact
  app.delete('/accounts/:id/contact', function(req, res) {
    var accountId = req.params.id == 'me'
                       ? req.session.accountId
                       : req.params.id;
    var contactId = req.param('contactId', null);

    // Missing contactId, don't bother going any further
    if ( null == contactId ) {
      res.send(400);
      return;
    }

    Account.findById(accountId, function(account) {
      if ( !account ) return;
      Account.findById(contactId, function(contact, err) {
        if ( !contact ) return;

        User.removeFollowing(account, contactId);
        // Kill the reverse link
        User.removeFollower(contact, accountId);
      });
    });

    // Note: Not in callback - this endpoint returns immediately and
    // processes in the background
    res.send(200);
  });

  // Add contact
  app.post('/accounts/:id/contact', function(req, res) {
    var accountId = req.params.id == 'me'
                       ? req.session.accountId
                       : req.params.id;
    var contactId = req.param('contactId', null);

    // Missing contactId, don't bother going any further, or
    // contactId is the same as accountId, you can't add yourself as contact.
    if ( null == contactId || contactId === accountId ) {
      res.send(400);
      return;
    }

    Account.findById(accountId, function(account) {
      if ( account ) {
        Account.findById(contactId, function(contact) {
          User.addFollowing(account, contact);

          // Make the reverse link
          User.addFollower(contact, account);
          account.save();
        });
      }
    });

    // Note: Not in callback - this endpoint returns immediately and
    // processes in the background
    res.send(200);
  });

  // viewNum plus 1
  app.post('/accounts/:id/viewNum', function(req, res) {
    /*optional stuff to do after success */
    var accountId = req.params.id == 'me'
                      ? req.session.accountId
                      : req.params.id;
    var viewNum = req.param('viewNum', null);

    if( null == viewNum ) {
      res.send(400);
      return;
    }

    Account.findById(accountId, function(account) {
      if ( account ) {
        account.viewNum += 1;
        account.save();
      }
    });
  });

  // check friend
  app.get('/accounts/:id', function(req, res) {
    var accountId = req.params.id == 'me'
                       ? req.session.accountId
                       : req.params.id;
    Account.findById(accountId, function(account) {
      if ( User.hasFollower(account, req.session.accountId) ) {
        account.isFollower = true;
      }
      if ( User.hasFollowing(account, req.session.accountId) ) {
        account.isFollowing = true;
      }
      res.send(account);
    });
  });

  // Find contact
  app.post('/contacts/find', function(req, res) {
    var searchStr = req.param('searchStr', null);

    if ( null == searchStr) {
      res.send(400);
      return;
    }

    Account.findByString(searchStr, function onSearchDone(err, accounts) {
      if (err || accounts.length == 0) {
        res.send(404);
      } else {
        res.send(accounts);
      }
    });
  });
}