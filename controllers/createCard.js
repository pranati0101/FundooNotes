/**
 * Module dependencies.
 */
 var multer=require('multer');
 var fs=require('fs-extra');
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
    console.log(req.body,req.user._id);
    cardMethods.createCard(req.body,req.user._id,function(err,card){
      if(err) console.error();
      else{
          // userMethods.upadteNumberOfCards(req.user._id,1);
          console.log(card);
          // esClient.index({
          //    index: indexName,
          //    type: "info",
          //    body: document,
          //    refresh:true
          //     },function(err,res){
          //          if(err) console.log(err);
          //          console.log(res);
          //        });
          res.json(card);
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
