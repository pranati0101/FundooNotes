// 'use strict';
// var express = require("express");
// // var controllers=require('./controllers/')
// var loginController = require('./controllers/loginController');
// var home=require('./controllers/controllerHome');
// var signup=require('./controllers/signUp')
// module.exports=function(app,passport){
//   //  Routes
// app.get('/',function(req,res){
//   home.home(req,res);
// });
// app.get('/signUp',function(req,res){
//   home.signUp(req,res);
// })
// app.get('/profile',function(req,res){
//   home.profile(req,res);
// })
// app.get('/newUserLocal',function(req,res){
//   signup.localSignUp(req,res,passport);
// })
// app.get('/loginLocal',function(req,res){
//   loginController.loginLocal(req,res,passport);
// })
// app.get('/auth/google',function(req,res){
//
//   loginController.googleLogin(req,res,passport);
// })
// app.get('/auth/google/callback',function(req,res){
//   loginController.googleCallback(req,res,passport);
// })
// route.route('/signup').get(require('./controllers/controllerHome.js').signUp);
// route.route('/forgotPassword').get(require('./controllers/controllerHome.js').forgotPassword,
//   function(err){
//     if(err) console.log(err);
//   });
// route.route('/newUserLocal').post(require('./controllers/signUp.js').localSignUp);
// route.route('/loginLocal').post(require('./controllers/loginController.js').loginLocal);
// route.route('/auth/google').get(require('./controllers/loginController.js').googleLogin(passport));
// route.route('/auth/google/callback').get(require('./controllers/loginController.js').googleCallback(passport));
// }
