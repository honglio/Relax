var config = require('../../config/config');
var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport('SMTP', config.mail);

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 * @param email
 * @param name
 * @param message
 */

exports.postContact = function(req, res) {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('message', 'Message cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contactForm');
  }

  var from = req.body.email;
  var name = req.body.name;
  var body = req.body.message;
  var to = 'info@niukj.com';
  var subject = 'Contact Form | Relax';

  var mailOptions = {
    to: to,
    from: to,
    subject: from,
    text: body
  };

  smtpTransport.sendMail(mailOptions, function(err) {
    if (err) {
      req.flash('errors', { msg: err.message });
      return res.redirect('/contactForm');
    }
    req.flash('success', { msg: 'Email has been sent successfully!' });
    res.redirect('/contactForm');
  });
};
