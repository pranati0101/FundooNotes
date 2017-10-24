module.exports=function(app,cardMethods){

  //cards in trash are fetched and sent to front end
  app.get('/showArchive',function(req,res){
    console.log("in Archive",req.user);
    cardMethods.getCards(req.user.userId,null,function(err,cards){
      if(err) console.log(err);
      else{
        var archiveList=[]
        for(i=0;i<cards.length;i++){
          if(cards[i].archived){
            archiveList.push(cards[i])
          }
        }
        res.render('archive.pug',{archived:archiveList,user:req.user})
      }
    })
  })

  //card is sent to trash
  app.get('/moveToArchive',function(req,res){
    cardMethods.moveToArchive(req.query.cardId,function(err,response){
      if(err) console.log(err);
      else res.redirect('/profile')
    })
  })

  //unarchiving cards
  app.get('/unarchive',function(req,res){
    cardMethods.unarchive(req.query.cardId,function(err,response){
      console.log(response);
      if(err) console.log(err);
      else res.redirect('/showArchive')
    })
  })

  //pinning  and unpinning cards
  app.get('/pin',function(req,res){
    cardMethods.pinned(req.query.cardId,function(err,response){
      console.log(response);
      if(err) console.log(err);
      else if(response=='done') res.redirect('/profile');
      else res.send('404')
    })
  })
}
