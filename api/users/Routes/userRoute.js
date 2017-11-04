module.exports = function(app, express, passport) {
  /* using router module*/
  var userRouter = express.Router();
  var UserController=require('../Controllers/userController')//(passport)
  /**
   * redirecting different routes to required modules
   */
   userRouter.get('/',UserController.indexPage)
   userRouter.get('/home',UserController.home)
   userRouter.get('/signup',UserController.signup)
   userRouter.get('/verifyPage',UserController.verifyPage)
   userRouter.post('/verifyUser',UserController.verifyUser)
   userRouter.get('/forgetpassword',UserController.forgetpassword)
   userRouter.get('/profile',UserController.profile)
   userRouter.get('/signupfail',UserController.signupfail)
   userRouter.get('/signupSuccess',UserController.signupSuccess)
   userRouter.post('/changeProfilePic',UserController.changeProfilePic)
   userRouter.post('/forgotPassword',UserController.forgotPassword)
   userRouter.get('/resetPassword',UserController.resetPassword)
   userRouter.post('/updatePassword',UserController.updatePassword)
  /**
   * using passort middleware to redirect after user authentication
   * when user logs in locally
   */
  userRouter.post('/loginLocal', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/home', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));
  /**
   * using passort middleware to redirect after user authentication
   * when user logs in using google
   */
  userRouter.get('/auth/googleLogin', passport.authenticate('google', {
    scope: ['profile', 'email']
  }))
/**
 * callback url for google
 */
  userRouter.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/home'
  }))
  /**
   * using passort middleware to redirect after user authentication
   * when user logs in using facebook
   */
  userRouter.get('/auth/facebookLogin', passport.authenticate('facebook', {
    scope: ['email']
  }))
  /**
   * callback url for google
   */
  userRouter.get('/auth/facebook/callback', passport.authenticate('facebook',{
    successRedirect: '/profile',
    failureRedirect: '/home'
  }))
  /**
   * using passort middleware to redirect after user authentication
   * when user signs up locally
   */
   userRouter.post('/newUserLocal',passport.authenticate('local-signup', {
       successRedirect: '/home', // redirect to the secure home section
       failureRedirect: '/signup', // redirect back to the signup page if there is an error
       failureFlash: true // allow flash messages
     }));
  /**
   *logout of session and redirects to index
   */
   userRouter.get('/logout',function(req,res){
         req.session.destroy(function(e){
           if(e) console.error();
             req.logout();
             res.redirect('/')
         })
       })

  return userRouter;
};
