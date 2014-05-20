var mongoose = require('mongoose');
var Account = mongoose.model('Account');
var nodemailer  = require('nodemailer');
var crypto = require('crypto');
var config = require('../../config/config');

exports.findById = function(accountId, callback) {
  Account.findOne({_id:accountId}, function(err, doc) {
    callback(doc);
  });
};

exports.findByString = function(searchStr, callback) {
  var searchRegex = new RegExp(searchStr, 'i');
  Account.find({
    $or: [
      { 'name.full':  { $regex: searchRegex } },
      { email:        { $regex: searchRegex } }
    ]
  }, callback);
};

exports.register = function(email, password, firstName, lastName) {
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
  user.save();
  console.log('Save command was sent');
};

exports.changePassword = function(accountId, newpassword) {
  var shaSum = crypto.createHash('sha256');
  shaSum.update(newpassword);
  var hashedPassword = shaSum.digest('hex');
  Account.update({_id:accountId}, {$set: {password:hashedPassword}}, {upsert:false},
    function changePasswordCallback(err) {
      console.log('Change password done for account ' + accountId);
  });
};

exports.forgotPassword = function(email, resetPasswordUrl, callback) {
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

exports.login = function(email, password, callback) {
  var shaSum = crypto.createHash('sha256');
  shaSum.update(password);

  Account.findOne({email:email,password:shaSum.digest('hex')},function(err,doc){
    callback(doc);
  });
};