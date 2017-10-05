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
  local: {
    firstname: String,
    lastname: String,
    email: String,
    password: String,
  },
  facebook: {
    id: String,
    email: String,
    firstname: String,
    lastname: String
  },
  google: {
    id: String,
    email: String,
    firstname: String,
    lastname: String
  }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
   return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  console.log(typeof(password));
  return bcrypt.compareSync(password, this.local.password)
};

// create the model for users and expose it to our app
exports.User = mongoose.model('User', userSchema,'userInfo');
exports.hash=userSchema.methods.generateHash;
