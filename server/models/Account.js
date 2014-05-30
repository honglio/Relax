var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var Status = new mongoose.Schema({
  name: { type: String },
  status:    { type: String }
});

var ContactSchema = new mongoose.Schema({
  name: { type: String },
  accountId: { type: mongoose.Schema.ObjectId, ref : 'Account'},
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
    name: { type: String },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    photoUrl:  { type: String, default: '' },
    biography: { type: String, default: '' }
  },
  contacts:  {
    followers: [ContactSchema],
    followings: [ContactSchema]
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

  /**
   * Find account by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id }).exec(cb);
  },

  addFollower: function(account, addContact) {
    console.log('addFollower:' + account);
    console.log('addFollower:' + addContact);

    var follower = {
      name: addContact.name,
      accountId: addContact._id,
      added: new Date(),
      updated: new Date()
    };
    account.contacts.followers.push(follower);
  },

  addFollowing: function(account, addContact) {
    console.log('addFollowing:' + account);
    console.log('addFollowing:' + addContact);
    var following = {
      name: addContact.name,
      accountId: addContact._id,
      added: new Date(),
      updated: new Date()
    };
    account.contacts.followings.push(following);
  },

  removeFollower: function(account, contactId) {
    if ( null == account.contacts.followers ) return;

    account.contacts.followers.forEach(function(follower) {
      if ( follower.accountId == contactId ) {
        account.contacts.followers.remove(follower);
      }
    });
  },

  removeFollowing: function(account, contactId) {
    if ( null == account.contacts.followings ) return;

    account.contacts.followings.forEach(function(following) {
      if ( following.accountId == contactId ) {
        account.contacts.followings.remove(following);
      }
    });
  },

    // check if has follower
  hasFollower: function(account, contactId) {
    if ( null == account.contacts.followers ) return false;
    var length = account.contacts.followers.length;
    for (var i=0; i<length; i++) {
      if ( account.contacts.followers[i].accountId == contactId ) return true;
    }
    return false;
  },

  // check if has following
  hasFollowing: function(account, contactId) {
    if ( null == account.contacts.followings ) return false;
    // Shouldn't use forEach, because callback will block the process. so function return false always.
    var length = account.contacts.followings.length;
    for (var i=0; i<length; i++) {
      if ( account.contacts.followings[i].accountId == contactId ) return true;
    }
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