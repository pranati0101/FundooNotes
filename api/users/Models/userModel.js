/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

/**
 * Schema definitions.
 */

// define the schema for our user model
var userSchema = mongoose.Schema({
userId:{
  type:String,
},
numberOfCards:{
  type: Number,
  default:0
},
firstname: String,
lastname: String,
profilePic: {
  type:String,
  default:null
},
  local: {
    email: {
      type:String,
      default:false
    },
    password:{
      type:String,
      default:false
    }
  },
  facebook: {
    id: String,
    email: String
  },
  google: {
    id: String,
    email: String
  }
});

// methods ======================
// generating a hash
userSchema.statics.generateHash = function(password) {
   return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password)
};
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
userSchema.statics.searchById = function(id, done) {
  this.findById(id, function(err, user) {
    done(err, user);
  })
};
/**
 * add profile pic
 * @param  {string} id    [unique id of the note stored in db]
 * @param  {string} fname [path of image file which is to be set as profile pic]
 */
//add profilePic
userSchema.statics.addProfilePic=function(id,fname){
this.findOneAndUpdate({userId:id},{$set:{
  profilePic:"../Images/"+fname
}},function(err,info){
  console.log(err);
})
}
/**
 * search whether a user is already present in the db using email id or google
 * id or facebook id
 * @param  {string}   email  [local email id of the user]
 * @param  {[type]}   fb     [fb id of the user]
 * @param  {[type]}   google [google id of the user]
 * @param  {Function} done   [callback function to return user information, if user exists ]
 */
//search user by email or google id or facebook id
userSchema.statics.searchUser = function(email, fb, google, done)
 {
  this.findOne({
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
    // if there are any errors, return the error
    if (err)
      done(err);
    // check to see if theres already a user with that email
    if (user==null) {

      done(null, false);
    }
    else{
      done(null,user)
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
userSchema.statics.upadteNumberOfCards=function(id,number){
  this.findOneAndUpdate({'userId':id},{$set:{
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
userSchema.statics.createUser = function(data, fb, google, done) {
  // create the user
  var newUser = new this();
  // set the user's local credentials
  if (data) {
      newUser.userId = String(newUser._id);
      newUser.firstname = data.firstname;
      newUser.lastname = data.lastname;
      newUser.local.email = data.email;
    // use the generateHash function in our user model
     newUser.local.password = this.generateHash(data.password);
  }
  if (fb) {
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
userSchema.statics.updatePassword = function(email, password, done) {
  //hash it using bcrypt-nodejs
  var hashpwd = this.generateHash(password);
  //  updating password in db
  this.findOneAndUpdate({
    'local.email': email
  }, {
    $set: {
      'local.password': hashpwd
    }
  }, function(err, info) {
    if (err) return done(err);
    return done(null, info);
  })
}

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema,'userInfo');
// exports.hash=userSchema.methods.generateHash;
