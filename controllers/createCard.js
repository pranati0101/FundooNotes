/**
 * Module dependencies.
 */
module.exports=function(app,fs,cardMethods){

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
  //image is saved
  app.post('/addImage',function(req,res){
  console.log(req.body);
  cardMethods.addImage(fs,req.body.cardId,req.body.imgSrc,function(err,result){
    if(err) console.log(err);
    res.send('200')
  })
  })
//card is deleteCard
  app.get('/deleteCard',function(req,res){
    cardMethods.deleteCard(req.query.cardId,function(err,card){
      if(err) console.error();
      else{
          // userMethods.upadteNumberOfCards(req.user._id,-1);
          res.send(true);
      }
    })
  });

}
