module.exports = function(app, config, mongoose, nodemailer) {
  var crypto = require('crypto');

  var schemaOptions = {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  };

  var Status = new mongoose.Schema({
    name: {
      first:   { type: String },
      last:    { type: String }
    },
    status:    { type: String },
  });

  var Contact = new mongoose.Schema({
    name: {
      first:   { type: String },
      last:    { type: String }
    },
    accountId: { type: mongoose.Schema.ObjectId },
    added:     { type: Date },     // When the contact was added
    updated:   { type: Date }      // When the contact last updated
  }, schemaOptions);

  Contact.virtual('online').get(function(){
    return app.isAccountOnline(this.get('accountId'));
  });

  var AccountSchema = new mongoose.Schema({
    email:     { type: String, unique: true },
    password:  { type: String },
    name: {
      first:   { type: String },
      last:    { type: String },
      full:    { type: String }
    },
    birthday: {
      day:     { type: Number, min: 1, max: 31, required: false },
      month:   { type: Number, min: 1, max: 12, required: false },
      year:    { type: Number }
    },
    photoUrl:  { type: String },
    biography: { type: String },
    contacts:  {
      followers: [Contact],
      followings: [Contact]
    },
    status:    [Status], // My own status updates only
    activity:  [Status]  // All status updates including friends
  });

  var Account = mongoose.model('Account', AccountSchema);

  var registerCallback = function(err) {
    if (err) {
      return console.log(err);
    };
    return console.log('Account was created');
  };

  var changePassword = function(accountId, newpassword) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(newpassword);
    var hashedPassword = shaSum.digest('hex');
    Account.update({_id:accountId}, {$set: {password:hashedPassword}}, {upsert:false},
      function changePasswordCallback(err) {
        console.log('Change password done for account ' + accountId);
    });
  };

  var forgotPassword = function(email, resetPasswordUrl, callback) {
    var user = Account.findOne({email: email}, function findAccount(err, doc){
      if (err || null==doc ) {
        // Email address is not a valid user
        callback(false);
      } else {
        var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
        resetPasswordUrl += '?account=' + doc._id;

        smtpTransport.sendMail({
          from: 'info@niukj.com',
          to: doc.email,
          subject: 'SocialNet Password Request',
          text: 'Click here to reset your password: ' + resetPasswordUrl
        }, function forgotPasswordResult(err) {
          if (err) {
            callback(false);
          } else {
            callback(true);
          }
        });
      }
    });
  };

  var login = function(email, password, callback) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);
    Account.findOne({email:email,password:shaSum.digest('hex')},function(err,doc){
      callback(doc);
    });
  };

  var findById = function(accountId, callback) {
    Account.findOne({_id:accountId}, function(err, doc) {
      callback(doc);
    });
  };

  var findByString = function(searchStr, callback) {
    var searchRegex = new RegExp(searchStr, 'i');
    Account.find({
      $or: [
        { 'name.full':  { $regex: searchRegex } },
        { email:        { $regex: searchRegex } }
      ]
    }, callback);
  };

  var addFollower = function(account, addContact) {
    console.log(account);
    console.log(addContact);
    var follower = {
      name: {
        first: addContact.name.first,
        last: addContact.name.last
      },
      accountId: addContact._id,
      added: new Date(),
      updated: new Date()
    };
    account.contacts.followers.push(follower);

    account.save(function (err) {
      if (err) {
        console.log('Error saving account: ' + err);
      }
    });
  };

  var addFollowing = function(account, addContact) {
    var following = {
      name: {
        first: addContact.name.first,
        last: addContact.name.last
      },
      accountId: addContact._id,
      added: new Date(),
      updated: new Date()
    };
    account.contacts.followings.push(following);

    account.save(function (err) {
      if (err) {
        console.log('Error saving account: ' + err);
      }
    });
  };

  var removeFollower = function(account, contactId) {
    if ( null == account.contacts.followers ) return;

    account.contacts.followers.forEach(function(follower) {
      if ( follower.accountId == contactId ) {
        account.contacts.followers.remove(follower);
      }
    });
    account.save();
  };

  var removeFollowing = function(account, contactId) {
    if ( null == account.contacts.followings ) return;

    account.contacts.followings.forEach(function(following) {
      if ( following.accountId == contactId ) {
        account.contacts.followings.remove(following);
      }
    });
    account.save();
  };

  // check if has follower
  var hasFollower = function(account, contactId) {
    if ( null == account.contacts.followers ) return false;

    account.contacts.followers.forEach(function(follower) {
      if ( follower.accountId == contactId ) {
        return true;
      }
    });
    return false;
  };

  // check if has following
  var hasFollowing = function(account, contactId) {
    if ( null == account.contacts.followings ) return false;

    account.contacts.followings.forEach(function(following) {
      if ( following.accountId == contactId ) {
        return true;
      }
    });
    return false;
  };

  var register = function(email, password, firstName, lastName) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);

    console.log('Registering ' + email);
    var user = new Account({
      email: email,
      name: {
        first: firstName,
        last: lastName,
        full: firstName + ' ' + lastName
      },
      password: shaSum.digest('hex')
    });
    user.save(registerCallback);
    console.log('Save command was sent');
  }

  return {
    findById: findById,
    findByString: findByString,
    register: register,
    forgotPassword: forgotPassword,
    changePassword: changePassword,
    login: login,
    Account: Account,
    hasFollower: hasFollower,
    hasFollowing: hasFollowing,
    addFollower: addFollower,
    addFollowing: addFollowing,
    removeFollower: removeFollower,
    removeFollowing: removeFollowing
  }
}
