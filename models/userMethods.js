/**
 * Module dependencies.
 */
var User = require('./users').User
var hash = require('./users').hash
var mongoose = require('mongoose')
/**
 *Method definitions
 */
/**
 * searches user by mongoose id
 * @param  {object}   id   [unique mongoose id of the user]
 * @param  {Function} done [callback function to return user information stored in db]
 * @return {object}        [user information stored in db]
 */
//search user by id
exports.searchById = function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  })
};
/**
 * add profile pic
 * @param  {string} id    [unique id of the note stored in db]
 * @param  {string} fname [path of image file which is to be set as profile pic]
 */
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
// exports.getUserInfo=function(userId,done){
//   User.findOne({'userId':userId},function(err,userInfo){
//     if(err) done(err,null);
//     else{
//       info={
//         firstname:userInfo.firstname,
//         lastname:userInfo.lastname,
//         email:userInfo.local.email
//       }
//       done(null,info)
//     }
//
//   })
// }
//get mailIds stored in database
// exports.getMailIds=function(callback){
//   User.find({},function(err,info){
//     if(err) callback(err,null)
//     else callback(null,info);
//   })
// }
/**
 * search whether a user is already present in the db using email id or google
 * id or facebook id
 * @param  {string}   email  [local email id of the user]
 * @param  {[type]}   fb     [fb id of the user]
 * @param  {[type]}   google [google id of the user]
 * @param  {Function} done   [callback function to return user information, if user exists ]
 */
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
/**
 * updates number of cards of a user
 * @param  {string} id     [unique id of the user stored in db]
 * @param  {number} number [increases old value by adding number]
 *
 */
//update number of cards of user
exports.upadteNumberOfCards=function(id,number){
  User.findOneAndUpdate({'userId':id},{$set:{
    'numberOfCards':(this.numberOfCards+number)
    }
  })
}
/**
 * creates a new user
 * @param  {object}   data   [information of user if signing up locally]
 * @param  {[type]}   fb     [information of user if signing up using fb]
 * @param  {[type]}   google [information of user if signing up using google]
 * @param  {Function} done   [callback function to return newly created user]
 */
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
/**
 * update password of the user having email as its email id by first encrypting
 * using bcrypt and then updating local.password field of user
 * @param  {string}   email    [description]
 * @param  {string}   password [description]
 * @param  {Function} done     [callback function to return error, if occured,
 *                             or modified record ]
 */
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
