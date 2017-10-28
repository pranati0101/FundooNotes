/**
 * Module dependencies.
 */
var contentScrapping=require('./contentScrapping.js')
 var multer=require('multer');
 var fs=require('fs-extra');
 // var urlMetadata=require('url-metadata')
 var cardMethods=require('../models/cardMethods')
 var Storage = multer.diskStorage({
     destination:(req, file, callback) => {
       console.log("in multer");
       var type=req.params.type;
       var path=`./app/Images`;
       fs.mkdirsSync(path)
         callback(null,path);
     },
     filename: function (req, file, callback) {
       // console.log(null, file.fieldname + "_" + Date.now() + "_" + req.body.cardId);
       var fname=file.fieldname + "_" +req.query.cardId+"."+file.mimetype.slice(6,11);
       console.log(fname);
       cardMethods.addImage(req.query.cardId,fname)
       callback(null, fname);


     }
 });
 var upload = multer({ storage: Storage}).array("imgUploader",3); //Field name and max count

module.exports=function(app,cardMethods){
/*-----logic for different api----*/
//new card is created
  app.post('/createCard',function(req,res){
    cardMethods.createCard(req.body,req.user._id,function(err,card){
      if(err) console.error();
      else{
          // userMethods.upadteNumberOfCards(req.user._id,1);
          // console.log(card);
          var expr=/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})/igm
          var val=card.text.match(expr)
          // console.log(val);
          // console.log(val.length);
          if(val!=null){
            for(i=0; i<val.length; i++)
            {
            metadata=contentScrapping(val[i]);
            metadata.then(function(meta){
              if(meta!=null){
                cardMethods.addURL(card.cardId,meta,function(err,resp){
                  if(err) console.log(err);
                  // res.redirect('/profile')
                })
              }
              // else res.redirect('/profile');
            }).catch(function(error){
              console.log(error);
              // res.redirect('/profile');
            })
          }
          }
          res.redirect('/profile')
          // esClient.index({
          //    index: indexName,
          //    type: "info",
          //    body: document,
          //    refresh:true
          //     },function(err,res){
          //          if(err) console.log(err);
          //          console.log(res);
          //        });
          // res.redirect("/profile");
      }
    })
  })

  //update card
  app.post('/updateCard',function(req,res){
    cardMethods.updateCard(req.body,req.query.cardId,function(err,card){
      if(err) console.error();
      else{
        // console.log(card);
        var expr=/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})/igm
        var val=(req.body.text).match(expr)
        console.log(val);
        if(val!=null){

          console.log(val.length);
          for(i=0; i<val.length; i++)
          {
          metadata=contentScrapping(val[i]);
          metadata.then(function(meta){
            if(meta!=null){
              cardMethods.addURL(req.query.cardId,meta,function(err,resp){
                if(err) console.log(err);
              })
            }
          }).catch(function(error){
            console.log(error);
          })
        }

        }

      res.redirect('/profile')
      }
    })
  })
  //image is saved
  app.post('/addImage',function(req,res){
  console.log("in add Image");
  upload(req, res, function (err) {
      if (err) {
        console.log("Something went wrong!");
          // return res.end("Something went wrong!");
      }
      else{
        console.log("File uploaded sucessfully!.");
         res.redirect('/profile')
      }
  })
  })
  //add url
  app.get('/removeURL',function(req,res){

    cardMethods.removeURL(req.query.cardId,req.query.url,function(err){
      if(err) console.error();
      else{
        console.log("redirecting to profile",req.user);
        res.redirect('/profile')
      }
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

  app.get('/changeColor',function(req,res){
    console.log(req.query);
    cardMethods.changeColor(req.query.cardId,req.query.color,function(err,resp){
      if(err) console.log(err);
      else res.redirect('/profile')
    })
  })

}
