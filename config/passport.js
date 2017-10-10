// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// load up the user model
var User = require('../models/users').User;
// load the auth variables
var configAuth = require('./auth');
//load user model methods
var userMethods=require('../models/userMethods')
// expose this function to our app using module.exports
module.exports = function(passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    userMethods.searchById(id, function(err, user) {
      done(err, user);
    });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
      console.log("in passport data--",req.body);
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      userMethods.searchUser(email,0,0,function(err,user){
        console.log(err,user);
          if (err)
            return done(err,false,req.flash('signupMessage', 'Error!'));

          // check to see if theres already a user with that email
          if (user) {
            console.log("User exists");
            console.log(user);
            return done(null, false,req.flash('signupMessage', 'That email is already taken.'));
          }
          else {
            userMethods.createUser(req.body,null,null,function(err,newUser){
                if(err) console.error();
                else return done(null,newUser,req.flash('signupMessage', 'New User Registered.'))
              })
            }
            });
            }));
  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================
  passport.use('facebook',new FacebookStrategy({

      // pull in our app id and secret from our auth.js file
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL,
      enableProof: true,
      profileFields: ['id', 'displayName', 'name', 'photos','email']
    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
      console.log("logging via fb..");
      // asynchronous
      process.nextTick(function() {
      console.log("profile,info",profile);
        // find the user in the database based on their facebook id
        userMethods.searchUser(profile.email,profile.id,0,function(err,user){
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
          return done(err,false,req.flash('loginMessage', 'Error.'));

        // if the user is found, then log them in
        if (user) {
          return done(null, user); // user found, return that user
        } else {
          // if there is no user found with that facebook id, create them
          var newUser =userMethods.createUser(null,profile,null,function(err,newUser){
            if(err) console.error();
            else return done(null,newUser)
          })
        }
        });
        })
      }));
  // =========================================================================
  // GOOGLE ==================================================================
  // =========================================================================
  passport.use('google', new GoogleStrategy({
      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURL,
    },
    function(token, refreshToken, profile, done) {

      // make the code asynchronous
      // User.findOne won't fire until we have all our data back from Google
      process.nextTick(function() {
      console.log("profile,info",profile);
        // try to find the user based on their google id
      userMethods.searchUser(0,0,profile.id,function(err,user){
      // if there is an error, stop everything and return that
      // ie an error connecting to the database
      if (err)
        return done(err,false,req.flash('loginMessage', 'Error.'));

      // if the user is found, then log them in
      if (user) {
        return done(null, user); // user found, return that user
      } else {
        // if there is no user found with that facebook id, create them
        var newUser =userMethods.createUser(null,null,profile,function(err,newUser){
          if(err) console.error();
          else return done(null,newUser)
        })
     }
   });
 });
 }));

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-login', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
        console.log("finding data");
        // find a user whose email is the same as the forms email
        userMethods.searchUser(email,0,0,function(err, user) {
          // if there are any errors, return the error before anything else
          // console.log(err,user);
          if (err){
            console.log("Error while connecting to db");
              return done(err,false,req.flash('loginMessage', 'Error.'));
          }
          // if no user is found, return the message
          if (!user){
            console.log("User not Found");
            return done(null, false,req.flash('loginMessage', 'User not registered.')); // req.flash is the way to set flashdata using connect-flash
          }
          if(user.local.password=='false'){
            console.log("Set Password");
            return done(null, false,req.flash('loginMessage', 'Set Password.')); // create the loginMessage and save it to session as flashdata

          }

            // if the user is found but  the password is wrong
           if (!user.validPassword(password)){
              console.log("Incorrect Password");
              return done(null, false,req.flash('loginMessage', 'Incorrect Password.')); // create the loginMessage and save it to session as flashdata
            }
            // all is well, return successful user
            return done(null, user);

        });
      }));
};
