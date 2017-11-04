/**
 *sending mail using node mailer and smtp
 */
var smtpTransport = require('nodemailer-smtp-transport');
var nodemailer = require("nodemailer");

/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
var smtpTransport = nodemailer.createTransport(smtpTransport({
  host: "smtp.gmail.com",
  service: 'gmail',
  auth: {
    type: 'login',
    user: "",
    pass: ""
  }
}));

exports.sendMail=function(mailId,url,callback){
  // verify connection configuration
  smtpTransport.verify(function(error, success) {
    if (error) console.log(error);
    else {
      var mailOptions = {
        to:mailId,
        subject: "Password reset for fundooNotes",
        text:"Click on the following link:- "+url
      }
  /**
   * sending mail
   */
      smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
          console.log(error);
          callback(error,null)

        } else {
          console.log("Message sent: " + response);
          callback(null,'done')
        }
      });
    }
  });
}

exports.sendVerificationMail=function(mailId,url,callback){
  // verify connection configuration
  smtpTransport.verify(function(error, success) {
    if (error) console.log(error);
    else {
      var mailOptions = {
        to:mailId,
        subject: "Verifying registered email Id.",
        text:"Click on the following link:- "+url
      }
  /**
   * sending mail
   */
      smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
          console.log(error);
          callback(error,null)

        } else {
          console.log("Message sent: " + response);
          callback(null,'done')
        }
      });
    }
  });
}
