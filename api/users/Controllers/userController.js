/**
 * requiring Services of user
 */
var UserServices = require('../Services/userServices').userServices;
var userServices= new UserServices();
// var Validator=require('validator').Validator;
// var validator=new Validator()
var validator = require('node-validator');
var checkUrl = validator.isString({
  regex: /(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
})
var checkEmail = validator.isString({
  regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
})
/**
 *
Password matching expression. Password must be at least 6 characters, no more
than 10 characters, and must include at least one upper case letter, one lower
case letter, and one numeric digit.
 */
var checkPassword=validator.isString({
  regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/
})
/**
 *functions for rendering pug files
 */
/**
 * rendering index page
 */
 exports.indexPage=function(req,res){
   if(req.user) res.redirect('/profile')
   else res.render('login.pug',{message: req.flash('loginMessage')});
   console.log(res.text);
 }
/**
 *rendering home page
 */
 exports.home=function(req,res){
   res.render('login.pug',{message: req.flash('loginMessage')});
 }
 /**
  *rendering user email verification  page
  */
 exports.verifyPage=function(req,res){
   res.render('verifyUser.pug',{message:"Do not refresh this page."});
 }
 /**
  *sending verification link to user
  */
 exports.verifyUser=function(req,res){
   validator.run(checkEmail, req.body.email, function(errCount, err) {
     if(errCount==0){
     userServices.verifyUser(req.body.email,function(err,resp){
       if(err) console.log(err);
       else if (resp=='done')
          res.render("verifyUser.pug",{message:"Check your mail."})
       else//if(resp=="found")
          res.render("verifyUser.pug",{message:"User Already Exists"})
     })
   }
 })
 }
 /**
  *rendering signup page
  */
 exports.signup=function(req,res){
   validator.run(checkEmail, req.query.email, function(errCount, err) {
     if(errCount==0){
     userServices.signup(req.query.email,req.query.otp,function(err,resp){
       console.log(err,resp);
       if(err) console.log(err);
       if(resp=="done") res.render('register.pug',{message: req.flash('signupMessage'),email:req.query.email});
       else res.render("verifyUser.pug",{message:"Not an authorised link!"})
     })
   }
 })
 }
 /**
  *rendering forgotpassword page
  */
 exports.forgetpassword=function(req,res){
   res.render('forgotPassword.pug',{ title : 'Reset Password' });
 }
 /**
  *rendering profile or dashboard page
  */
 exports.profile=function(req,res){
   if(req.user) res.render('profile.pug',{user:req.user});
   else res.redirect('/')
 }
/**
 * when signup fails
 */
exports.signupfail=function(req,res){
  res.json({"result":"signupfail"})
}
/**
 * when user signs up successfully
 */
exports.signupSuccess=function(req,res){
  res.json({"result":"signupsuccess"})
}
/**
 * uploading profile picture
 */
exports.changeProfilePic=function(req,res){
  if(req.user){
  userServices.changeProfilePic(req,function(err,response){
    if(err) console.log(err);
    else res.redirect('/profile');
  })
}
}
/**
 * setting new password
 */
exports.forgotPassword=function(req,res){
  validator.run(checkEmail, req.body.email, function(errCount, err) {
    if(errCount==0){
  userServices.forgotPassword(req,function(err,response){
    if(err) console.log(err);
    else{
      console.log(response);
      if(response=='Notfound') res.send('404')
      if(response=='Error') res.send('500')
      if(response=='done') res.send('200')
    }
  })
}
})
}
/**
 * rendering reset password pug file
 */
exports.resetPassword=function(req,res){
  res.render('resetpwd',{ email : req.query.email,otp:req.query.otp});
}
/**
 * updating password in db
 */
exports.updatePassword=function(req,res){
    validator.run(checkEmail, req.body.email, function(errCount, err) {
      if(errCount==0){
        validator.run(checkPassword, req.body.password, function(errCount, err) {
          if(errCount==0){
        userServices.updatePassword(req.body,function(err,response){
          if(err) console.log(err);
          else if(response==null) res.render('login.pug',{message: "User does not exist."});
          else res.redirect('/')
        })
      }
    })
  }
})
}
// }
