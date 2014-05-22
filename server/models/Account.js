var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var Status = new mongoose.Schema({
  name: {
    first:   { type: String },
    last:    { type: String },
    full:    { type: String }
  },
  status:    { type: String }
});

var Contact = new mongoose.Schema({
  name: {
    first:   { type: String },
    last:    { type: String },
    full:    { type: String }
  },
  accountId: { type: mongoose.Schema.ObjectId },
  added:     { type: Date },     // When the contact was added
  updated:   { type: Date }      // When the contact last updated
});

var AccountSchema = new mongoose.Schema({
  email:     { type: String, unique: true, lowercase: true },
  password:  { type: String },

  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

  weibo: { type: String },
  renren: { type: String },
  qq: { type: String },
  github: { type: String },
  linkedin: { type: String },
  tokens: { type: Array },

  profile: {
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
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    photoUrl:  { type: String, default: '' },
    biography: { type: String, default: '' }
  },
  contacts:  {
    followers: [Contact],
    followings: [Contact]
  },
  status:    [Status], // My own status updates only
  viewNum:   { type: Number, default: 0 }
});

/**
 * Hash the password for security.
 * "Pre" is a Mongoose middleware that executes before each user.save() call.
 */
AccountSchema.pre('save', function(next) {
  var account = this;

  if (!account.isModified('password')) return next();

  bcrypt.genSalt(5, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(account.password, salt, null, function(err, hash) {
      if (err) return next(err);
      account.password = hash;
      next();
    });
  });
});

AccountSchema.statics = {
  addFollower: function(account, addContact) {
    console.log(account);
    console.log(addContact);
    var follower = {
      name: {
        first: addContact.name.first,
        last: addContact.name.last,
        full: addContact.name.full
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
  },

  addFollowing: function(account, addContact) {
    var following = {
      name: {
        first: addContact.name.first,
        last: addContact.name.last,
        full: addContact.name.full
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
  },

  removeFollower: function(account, contactId) {
    if ( null == account.contacts.followers ) return;

    account.contacts.followers.forEach(function(follower) {
      if ( follower.accountId == contactId ) {
        account.contacts.followers.remove(follower);
      }
    });
    account.save();
  },

  removeFollowing: function(account, contactId) {
    if ( null == account.contacts.followings ) return;

    account.contacts.followings.forEach(function(following) {
      if ( following.accountId == contactId ) {
        account.contacts.followings.remove(following);
      }
    });
    account.save();
  },

  // check if has follower
  hasFollower: function(account, contactId) {
    if ( null == account.contacts.followers ) return false;

    account.contacts.followers.forEach(function(follower) {
      if ( follower.accountId == contactId ) {
        return true;
      }
    });
    return false;
  },

  // check if has following
  hasFollowing: function(account, contactId) {
    if ( null == account.contacts.followings ) return false;

    account.contacts.followings.forEach(function(following) {
      if ( following.accountId == contactId ) {
        return true;
      }
    });
    return false;
  }
};

AccountSchema.methods = {
  /**
   * Validate user's password.
   * Used by Passport-Local Strategy for password validation.
   */
  comparePassword: function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  },

  /**
   * Get URL to a user's gravatar.
   * Used in Navbar and Account Management page.
   */

  gravatar: function(size) {
    if (!size) size = 200;

    if (!this.email) {
      return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
    }

    var md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
  }
};

mongoose.model('Account', AccountSchema);