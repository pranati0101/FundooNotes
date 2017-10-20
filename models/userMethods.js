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
//add profilePic
exports.addProfilePic=function(id,fname){
  console.log("changing image");
User.findOneAndUpdate({userId:id},{$set:{
  profilePic:"../Images/"+fname
}},function(err,info){
  console.log(err);
})
}
//get user info
exports.getUserInfo=function(userId,done){
  User.findOne({'userId':userId},function(err,userInfo){
    if(err) done(err,null);
    else{
      info={
        firstname:userInfo.firstname,
        lastname:userInfo.lastname,
        email:userInfo.local.email
      }
      done(null,info)
    }

  })
}
//get mailIds stored in database
exports.getMailIds=function(callback){
  User.find({},function(err,info){
    if(err) callback(err,null)
    else callback(null,info);
  })
}
//search user by email or google id or facebook id
exports.searchUser = function(email, fb, google, done)
 {
  console.log(email,fb,google);
  User.findOne({
    $or: [{
      'local.email': email
    },{
      'facebook.email': email
    },{
      'facebook.id': fb
    },{
      'google.email': email
    },{
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
      newUser.userId = String(newUser._id);
      newUser.firstname = data.firstname;
      newUser.lastname = data.lastname;
      newUser.local.email = data.email;
    // use the generateHash function in our user model
     newUser.local.password = newUser.generateHash(data.password);
  }
  if (fb) {
    console.log("facebook",fb);
    // set all of the facebook information in our user model
    newUser.userId = String(newUser._id);
    newUser.facebook.id = fb.id; // set the users facebook id
    newUser.firstname = fb.name.givenName; // set the users firstname
    newUser.lastname = fb.name.familyName;// set the users lastname
    newUser.local.email=fb.emails[0].value
    newUser.profilePic=fb.photos[0].value;
  }
  if (google) {
    // set all of the relevant information
    newUser.userId = String(newUser._id);
    newUser.google.id = google.id;
    newUser.lastname = google.name.familyName;
    newUser.firstname = google.name.givenName;
    newUser.google.email = google.emails[0].value; // pull the first email
    newUser.local.email=google.emails[0].value;
    newUser.profilePic=google.photos[0].value;
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
