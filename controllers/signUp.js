// var flash    = require('connect-flash');
var redis = require('redis');
var redisClient = redis.createClient();
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var User = require('../models/users').User
var hash=require('../models/users').hash;
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
    user: "",
    pass: ""
  }
}));

module.exports = function(app, passport) {

  app.post('/newUserLocal',
    passport.authenticate('local-signup', {
      successRedirect: '/', // redirect to the secure profile section
      failureRedirect: '/signup', // redirect back to the signup page if there is an error
      failureFlash: false // allow flash messages
    }));

  app.post('/forgotPassword', function(req, res) {
    console.log(req.body);
    User.findOne({
      'local.email': req.body.email
    }, function(err, user) {
      if (err) console.error();
      if (!user) {
        res.send('404')
      } else {
        console.log(user);
        var otp = Math.floor((Math.random() * 10000)) + "";
        console.log(otp);
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

app.get('/otp',function(req,res){
  redisClient.get(req.query.email,function(err,info){
    if(err) console.log(err);
    console.log(req.query.otp);
    console.log(info);
    if(info==req.query.otp){
      console.log("otp verified");redisClient
      res.send('verified')
    }
    else{
      res.send('failed')
    }
  })
});

app.post('/updatePassword',function(req,res){
  console.log("password: ",req.body.password);
  var hashpwd=hash(req.body.password);
  console.log(hashpwd,req.body);
  User.findOneAndUpdate({'local.email':req.body.email},{$set:
    {
      // 'local.password':req.body.password
    'local.password':hashpwd
  }
},function(err,info){
  if(err) console.error();
  console.log("data saved..",info);
  res.send('200')
})
})
}
