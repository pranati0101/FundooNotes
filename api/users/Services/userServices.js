var upload=require('./uploadFile.js')
var userMethods=require('../Models/userModel.js')
var mailer=require('./mailer.js')
var redisService=require('./redisService.js')
var util         = require("util");
var eventEmitter = require("events").EventEmitter;
var messageq=require('./messageQueue')
// verify=new Verify()
function userServices(){
  eventEmitter.call(this);
}
util.inherits(userServices,eventEmitter);

/**
 *verifying user emal by sending link
 */
userServices.prototype.verifyUser=function(email,callback){
  userMethods.searchUser(email,"-1","-1",function(err,user){
    if(user)  callback(err,"found");
    else{
    var otp=redisService.setOTP(email);
    var url="http://localhost:4000/signup?email="+email+"&otp="+otp;
    messageq.enq(email,url,"verifyUser")
    callback(err,"done")
    }

  })
}
/**
 *extracting token from redis cache and verifying
 */
userServices.prototype.signup=function(email,otp,callback){
  redisService.getOTP(email,function(err,storedOtp){
    console.log(storedOtp,otp);
    if(err) callback(err,null)
    else if(storedOtp==otp) callback(err,"done")
    else callback(err,"notVerified")
  })
}
/**
 *changing profile pic by using multer to upload file
 */
userServices.prototype.changeProfilePic=function(req,callback){
  console.log("change profile pic");
  upload.uploadFile(req,"fname",function(err,response){
    if(err) callback(err,null);
    else{
      callback(null,'done');
    }
  })
}
/**
 *verifying user email id in order to send reset password link
 */
userServices.prototype.forgotPassword=function(req,callback){
  userMethods.searchUser(req.body.email,"-1","-1",function(err,user){
    console.log(user);
    if(err) callback(err,null)
    if(user==false) callback(null,'Notfound')
    if(user!=false){
      var otp=redisService.setOTP(req.body.email);
      var url="http://localhost:4000/resetPassword?otp="+otp
      messageq.enq(req.body.email,url,"passwordReset")
      callback(err,"done")
    }
  })
}
/**
 * update password in db
 */
userServices.prototype.updatePassword=function(args,callback){
  redisService.getOTP(args.email,function(err,otp){
    if(args.otp==otp){
      console.log(otp);
      userMethods.updatePassword(args.email,args.password, function(err, info) {
        callback(err,info)
        console.log(err,info);
      })
    }
  })
}
/**
 * exporting module
 */
module.exports = {
   userServices: userServices
};
