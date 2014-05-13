// Copy in your particulars and rename this to mail.js
module.exports = {
  service: "WanWang",
  host: "smtp.mxhichina.com",
  port: 587,
  secureConnection: false,
  //name: "servername",
  auth: {
    user: "info",
    pass: "12345china"
  },
  ignoreTLS: false,
  debug: false,
  maxConnections: 5 // Default is 5
}
