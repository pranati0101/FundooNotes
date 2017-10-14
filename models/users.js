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
