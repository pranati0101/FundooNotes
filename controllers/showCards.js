/**
 * Module dependencies.
 */
 var cardMethods=require('../models/cardMethods')
module.exports=function(app){

/*-----logic for different api----*/

  app.get('/showCards',function(req,res){
    console.log(req.user._id);
    cardMethods.getCards(req.user._id,function(err,card){
      if(err) console.error();
      else{
          res.json({card:card});
      }
    })
  })
}
