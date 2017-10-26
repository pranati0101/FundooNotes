/**
 * Module dependencies.
 */
var userMethods=require('../models/userMethods')
module.exports=function(app,cardMethods){

/*-----logic for different api----*/

  app.post('/addPerson',function(req,res){
    // console.log(req.body,req.query.cardId);
    cardMethods.addPerson(req.query.cardId,req.body.personEmail,function(err,result){
      if(err) console.log(err);
      else res.redirect('/profile')
    })
  })

  app.get('/removeMyself',function(req,res){
    // console.log(req.body,req.query.cardId);
    cardMethods.removeCollaborator(req.query.cardId,req.user.local.email,function(err,result){
      if(err) console.log(err);
      else res.redirect('/profile')
    })
  })

  app.get('/removeCollaborator',function(req,res){
    console.log(req.query);
    cardMethods.removeCollaborator(req.query.cardId,req.query.mail,function(err,result){
      if(err) console.log(err);
      else res.redirect('/profile')
    })
  })

  app.get('/getMailIds',function(err,res){
    userMethods.getMailIds(function(err,response){
      if(err) console.log(err);

    })
  })
}
