/**
 * Module dependencies.
 */
var User = require('./users').User
var hash = require('./users').hash
var mongoose = require('mongoose')
/**
 *Method definitions
 */
//search user by id
exports.searchById = function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  })
};
//search user by email or google id or facebook id
exports.searchUser = function(email, fb, google, done)
 {
  console.log(email,fb,google);
  User.findOne({
    $or: [{
      'local.email': email
    }, {
      'facebook.id': fb
    }, {
      'google.id': google
    }]
  }, function(err, user) {
    console.log(user);
    // if there are any errors, return the error
    if (err)
      done(err);

    // check to see if theres already a user with that email
    if (user) {
      done(null, user);
    }
    else{
      done(null,false)
    }
  })
}
//update number of cards of user
exports.upadteNumberOfCards=function(id,number){
  User.findOneAndUpdate({'userId':id},{$set:{
    'numberOfCards':(this.numberOfCards+number)
    }
  })
}
//create a new document in UserInfo collection
exports.createUser = function(data, fb, google, done) {
  // create the user
  console.log("creating record");
  var newUser = new User();
  // set the user's local credentials
  if (data) {
      newUser.local.userId = String(newUser._id),
      newUser.local.firstname = data.firstname,
      newUser.local.lastname = data.lastname,
      newUser.local.email = data.email;
    // use the generateHash function in our user model
     newUser.local.password = newUser.generateHash(data.password);
  }
  if (fb) {
    // set all of the facebook information in our user model
    newUser.facebook.id = fb.id; // set the users facebook id
    newUser.facebook.firstname = fb.first_name; // set the users firstname
    newUser.facebook.lastname = fb.last_name; // set the users lastname
  }
  if (google) {
    // set all of the relevant information
    newUser.google.id = google.id;
    newUser.google.lastname = google.name.familyName;
    newUser.google.firstname = google.name.givenName;
    newUser.google.email = google.emails[0].value; // pull the first email
  }
  // save the user
  newUser.save(function(err) {
    if (err)
      done(err);
    console.log("saving to db");
    done(null, newUser);
  });
}
exports.updatePassword = function(email, password, done) {
  //hash it using bcrypt-nodejs
  var hashpwd = hash(password);
  //  updating password in db
  User.findOneAndUpdate({
    'local.email': email
  }, {
    $set: {
      'local.password': hashpwd
    }
  }, function(err, info) {
    if (err) return done(err);
    console.log("data saved..", info);
    return done(null, info);
  })
}
