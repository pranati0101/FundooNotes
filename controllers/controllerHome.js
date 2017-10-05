// exports.home = function(req, res) {
//   res.render('login.pug',{ title : 'Home' });
//   console.log("in home");
//   // pug.renderFile('findex', merge(options, locals));
//   }
//   exports.signUp = function(req, res) {
//     res.render('register.pug',{ title : 'sign-Up' });
//     console.log("in register");
//     // pug.renderFile('findex', merge(options, locals));
//   }
//   exports.forgotPassword = function(req, res) {
//     res.render('forgotpassword.pug',{ title : 'Set Password' });
//     console.log("setting Password");
//     // pug.renderFile('findex', merge(options, locals));
//     }
//     exports.profile = function(req, res) {
//       // res.render('forgotpassword.pug',{ title : 'Set Password' });
//       console.log(" Profile");
//       // pug.renderFile('findex', merge(options, locals));
//       }
module.exports=function(app){

/*-----logic for different api----*/
//apis for displaying different pages

  app.get('/',function(req,res){
    res.render('login.pug',{message: req.flash('loginMessage')});
    
  })

  app.get('/home',function(req,res){
    res.render('login.pug',{message: req.flash('loginMessage')});
    console.log("in home");
  })

  app.get('/signup',function(req,res){
    res.render('register.pug',{message: req.flash('signupMessage')});
    console.log("in signup ",req.flash('signupMessage'));
  })

  app.get('/forgetpassword',function(req,res){
    res.render('forgotPassword.pug',{ title : 'Reset Password' });
    console.log("in home");
  })

  app.get('/resetPassword',function(req,res){
    console.log(req.query);
    res.render('resetpwd',{ email : req.query.email });
    console.log("in resetPassword");

  })

  app.get('/profile',function(req,res){
      res.render('profile.pug',{user:req.user});
      console.log(" Profile");
  })
}
