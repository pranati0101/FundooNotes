'use strict';
// var Promise = require('mpromise');
var jwt = require('jsonwebtoken');
var User, Message;
// var passport = require('passport');
var flash = require('connect-flash');
var db = require('../config/database')
// var promise = new Promise;
var mongoose = require('mongoose');
/*connecting to mongo database*/
mongoose.connect(db.url, {
  useMongoClient: true,
}).then(function(db) {
  console.log("connected to mongodb!");
}).catch(function(e) {
  if (e) console.log(e);
});

User = require('../models/users.js');
// authModel=require('../models/authModel.js');
//modules for redis db
// var redis=require('redis');
// var redisClient=redis.createClient();
// var uuid = require('uuid');
// var secretKey = uuid.v4();
var token;
// var htmlEncode = require('js-htmlencode').htmlEncode;

/*-----logic for different api----*/
//   //encode api function
//   /*receives string in req and send encode_msg in response*/
// exports.encode_msg= function(req, res) {
//     console.log(req.body.msg);
//     res.json({data:htmlEncode(req.body.msg)});
//     }

module.exports = function(app, passport) {

  app.post('/loginLocal', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/fail' // redirect back to the signup page if there is an error
  }));
  app.get('/auth/googleLogin', passport.authenticate('google', {
    scope: ['profile', 'email']
  }))
  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }))

  app.get('/auth/facebookLogin', passport.authenticate('facebook', {
    scope: ['email']
  }))
  app.get('/auth/facebook/callback', passport.authenticate('facebook',{
    successRedirect: '/profile',
    failureRedirect: '/'
  }))
  app.get('/logout',function(req,res){
    console.log(req.session);
    req.session.destroy(function(e){
      if(e) console.error();
        req.logout();
        res.redirect('/')
    })
  })
}
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}
