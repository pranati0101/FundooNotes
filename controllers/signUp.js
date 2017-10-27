/**
 * Module dependencies.
 */
// var flash = require('connect-flash');
var multer=require('multer');
var fs=require('fs-extra');
var userMethods=require('../models/userMethods')
var Storage = multer.diskStorage({
    destination:(req, file, callback) => {
      console.log("in multer");
      var type=req.params.type;
      var path=`./app/Images`;
      fs.mkdirsSync(path)
        callback(null,path);
    },
    filename: function (req, file, callback) {
      // console.log(null, file.fieldname + "_" + Date.now() + "_" + req.body.cardId);
      var filename=req.user._id+"."+file.mimetype.slice(6,11);
      console.log(filename);
      userMethods.addProfilePic(req.user._id,filename)
      callback(null, filename);
    }
});
var upload = multer({ storage: Storage}).array("fname",1); //Field name and max count

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
    //changeProfilePic
    app.post('/changeProfilePic',function(req,res){
      console.log("change profile pic");
      upload(req, res, function (err) {
          if (err) {
            console.log(err);
            console.log("Something went wrong!");
              // return res.end("Something went wrong!");
          }
          else{
            console.log("File uploaded sucessfully!.");
             res.redirect('/profile')
          }
      })
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
        redisClient.expire(req.body.email, (3*60));
        url="http://localhost:4000/resetPassword?otp="+otp
        var mailOptions = {
          to: req.body.email,
          subject: "Password reset",
          text: url
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

  app.get('/resetPassword',function(req,res){
    console.log(req.query);
    res.render('resetpwd',{ email : req.query.email,otp:req.query.otp});
    console.log("in resetPassword");

  })
//verifying otp from redis cache with enteered by user
  // app.get('/otp', function(req, res) {
  //   redisClient.get(req.query.email, function(err, info) {
  //     if (err) console.log(err);
  //     console.log(req.query.otp);
  //     console.log(info);
  //     if (info == req.query.otp) {
  //       console.log("otp verified");
  //       redisClient
  //       res.send('verified')
  //     } else {
  //       res.send('failed')
  //     }
  //   })
  // });
//updating password by calling update password function from models
  app.post('/updatePassword', function(req, res) {
    redisClient.get(req.body.email,function(err,otp){
      console.log(err,otp);
      if(req.body.otp==otp){
        userMethods.updatePassword(req.body.email, req.body.password, function(err, info) {
          if (err) console.log(err);
          else console.log("data saved..", info);
          res.send('200')
        })
      }
      else{
        res.send('500')
      }
    })
  })
}
