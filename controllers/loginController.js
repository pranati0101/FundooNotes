/**
 * Module dependencies.
 */
'use strict';
var User;
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

/*-----logic for different api----*/

module.exports = function(app, passport) {
//api for logging in using oauth2 and passport strategies
  app.post('/loginLocal', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/home', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  app.get('/auth/googleLogin', passport.authenticate('google', {
    scope: ['profile', 'email']
  }))

  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/home'
  }))

  app.get('/auth/facebookLogin', passport.authenticate('facebook', {
    scope: ['email']
  }))
  app.get('/auth/facebook/callback', passport.authenticate('facebook',{
    successRedirect: '/profile',
    failureRedirect: '/home'
  }))
//api for logging out
  app.get('/logout',function(req,res){
    console.log(req.session);
    req.session.destroy(function(e){
      if(e) console.error();
        req.logout();
        res.redirect('/')
    })
  })
}
