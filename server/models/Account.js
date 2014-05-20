var mongoose = require('mongoose');

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
  activity:  [Status], // All status updates including friends
  viewNum:   { type: Number, default: 0 }
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

mongoose.model('Account', AccountSchema);