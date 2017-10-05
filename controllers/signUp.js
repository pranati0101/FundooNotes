/**
 * Module dependencies.
 */
// var flash = require('connect-flash');
var redis = require('redis');
var redisClient = redis.createClient();
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var User = require('../models/users').User
var hash = require('../models/users').hash;
var userMethods=require('../models/userMethods')
/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
var smtpTransport = nodemailer.createTransport(smtpTransport({
  host: "smtp.gmail.com",
  service: 'gmail',
  // port:465,
  // requireTLS:true,
  auth: {
    type: 'login',
    user: "pragyapranati6@gmail.com",
    pass: "abcd@1234567890"
  }
}));

module.exports = function(app, passport) {
  /*-----logic for different api----*/

  app.post('/newUserLocal',
    passport.authenticate('local-signup', {
      successRedirect: '/home', // redirect to the secure home section
      failureRedirect: '/signup', // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    }));
    app.get('/signupfail',function(req,res){
      res.json({"result":"signupfail"})
    })
    app.get('/signupSuccess',function(req,res){
      res.json({"result":"signupsuccess"})
    })
//chk given mail id is registered and send otp
  app.post('/forgotPassword', function(req, res) {
    console.log(req.body);
    userMethods.searchUser(req.body.email,null,null,function(err,user){
      if (err) console.error();
      if (!user) {
        res.send('404')
      } else {
        var otp = Math.floor((Math.random() * 10000)) + "";
        redisClient.set(req.body.email, otp);
        // redisClient.expireat(req.body.email, (3*60*60));
        var mailOptions = {
          to: req.body.email,
          subject: "Password reset",
          text: otp
        }
        console.log(mailOptions);
        // verify connection configuration
        smtpTransport.verify(function(error, success) {
          if (error) console.log(error);
          else {
            console.log("sending message !!");
            smtpTransport.sendMail(mailOptions, function(error, response) {
              if (error) {
                console.log(error);
                res.send("500");
              } else {
                console.log("Message sent: " + response);
                res.send('200');
                // res.redirect('/otp?email='+req.body.email);
              }
            });
          }
        });
      }
    })
  })
//verifying otp from redis cache with enteered by user
  app.get('/otp', function(req, res) {
    redisClient.get(req.query.email, function(err, info) {
      if (err) console.log(err);
      console.log(req.query.otp);
      console.log(info);
      if (info == req.query.otp) {
        console.log("otp verified");
        redisClient
        res.send('verified')
      } else {
        res.send('failed')
      }
    })
  });
//updating password by calling update password function from models
  app.post('/updatePassword', function(req, res) {
    userMethods.updatePassword(req.body.email, req.body.password, function(err, info) {
      if (err) console.error();
      console.log("data saved..", info);
      res.send('200')
    })
  })
}