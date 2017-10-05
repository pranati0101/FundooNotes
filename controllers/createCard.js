/**
 * Module dependencies.
 */
 var cardMethods=require('../models/cardMethods')
 var userMethods=require('../models/userMethods')
module.exports=function(app){

/*-----logic for different api----*/
//new card is created
  app.post('/createCard',function(req,res){
    console.log(req.body,req.user._id);
    cardMethods.createCard(req.body,req.user._id,function(err,card){
      if(err) console.error();
      else{
          // userMethods.upadteNumberOfCards(req.user._id,1);
          console.log(card);
          res.json(card);
      }
    })
  })

}
