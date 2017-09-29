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

  app.get('/',function(req,res){
    res.render('login.pug',{ title : 'Home' });
    console.log("in home");
    // pug.renderFile('findex', merge(options, locals));
  })

  app.get('/signUp',function(req,res){
    res.render('register.pug',{ title : 'Register' });
    console.log("in home");
    // pug.renderFile('findex', merge(options, locals));
  })

  app.get('/forgetpassword',function(req,res){
    res.render('forgotPassword.pug',{ title : 'Reset Password' });
    console.log("in home");
    // pug.renderFile('findex', merge(options, locals));
  })

  app.get('/resetPassword',function(req,res){
    console.log(req.query);
    res.render('resetpwd',{ email : req.query.email });
    console.log("in home");
    // pug.renderFile('findex', merge(options, locals));
  })

  app.get('/profile',function(req,res){
      res.render('profile.pug',{user:req.user});
      console.log(" Profile");
    // pug.renderFile('findex', merge(options, locals));
  })
}
