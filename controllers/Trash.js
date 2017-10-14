module.exports=function(app,cardMethods){

  //cards in trash are fetched and sent to front end
  app.get('/showTrash',function(req,res){
    console.log("in trash",req.user);
    cardMethods.getCards(req.user.userId,function(err,cards){
      if(err) console.log(err);
      else{
        var trashList=[]
        for(i=0;i<cards.length;i++){
          if(cards[i].trash){
            trashList.push(cards[i])
          }
        }
        res.render('trash.pug',{trash:trashList,user:req.user})
      }
    })
  })

  //card is sent to trash
  app.get('/moveToTrash',function(req,res){
    cardMethods.moveToTrash(req.query.cardId,function(err,response){
      console.log(response);
      if(err) console.log(err);
      else if(response) res.send('done');
      else res.send('404')
    })
  })

  //card is restored from trash
    app.get('/restoreCard',function(req,res){
      cardMethods.restoreCard(req.query.cardId,function(err,card){
        if(err) console.error();
        else{
            // userMethods.upadteNumberOfCards(req.user._id,-1);
            res.send(true);
        }
      })
    });
}
