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

module.exports = function(app, models) {
    app.get('/accounts/:id/activity', function(req, res) {
        var accountId = req.params.id == 'me'
                            ? req.session.accountId
                            : req.params.id;
        models.Account.findById(accountId, function(account) {
          if (null!=account) {
            res.send(account.activity);
          }
        });

    });

    app.get('/accounts/:id/status', function(req, res) {
        var accountId = req.params.id == 'me'
                            ? req.session.accountId
                            : req.params.id;
        models.Account.findById(accountId, function(account) {
          if (null!=account) {
            res.send(account.status);
          }
        });
    });

    app.post('/accounts/:id/status', function(req, res) {
        var accountId = req.params.id == 'me'
                            ? req.session.accountId
                            : req.params.id;
        models.Account.findById(accountId, function(account) {
          if (null!=account) {
            var status = {
                name: account.name,
                status: req.param('contactId', '')
            };
            account.status.push(status);

            // Push the status to all friends
            account.activity.push(status);
            account.save(function (err) {
              if (err) {
                  console.log('Error saving account: ' + err);
              } else {
                app.triggerEvent('event:' + accountId, {
                  from: accountId,
                  data: status,
                  action: 'status'
                });
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
        models.Account.findById(accountId, function(account) {
          if(null!=account)
            res.send(account.contacts);
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

      models.Account.findById(accountId, function(account) {
        if ( !account ) return;
        models.Account.findById(contactId, function(contact, err) {
          if ( !contact ) return;

          models.Account.removeContact(account, contactId);
          // Kill the reverse link
          models.Account.removeContact(contact, accountId);
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

      // Missing contactId, don't bother going any further
      if ( null == contactId ) {
        res.send(400);
        return;
      }

      models.Account.findById(accountId, function(account) {
        if ( account ) {
          models.Account.findById(contactId, function(contact) {
            models.Account.addContact(account, contact);

            // Make the reverse link
            models.Account.addContact(contact, account);
            account.save();
          });
        }
      });

      // Note: Not in callback - this endpoint returns immediately and
      // processes in the background
      res.send(200);
    });

    // check friend
    app.get('/accounts/:id', function(req, res) {
      var accountId = req.params.id == 'me'
                         ? req.session.accountId
                         : req.params.id;
      models.Account.findById(accountId, function(account) {
        if ( accountId == 'me' || models.Account.hasContact(account, req.session.accountId) ) {
          account.isFriend = true;
        }
        res.send(account);
      });
    });

}
