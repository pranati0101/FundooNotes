/**
 * declaring modules
 */
var multer=require('multer');
var fs=require('fs-extra');
var cardMethods=require('../Models/noteModel')
var Storage = multer.diskStorage({
    destination:(req, file,done) => {
      console.log("in multer");
      var type=req.params.type;
      var path='./app/Images';
      fs.mkdirsSync(path)
      done(null,path);
    },
    filename: function (req, file, done) {
      // console.log(null, file.fieldname + "_" + Date.now() + "_" + req.body.cardId);
      var fname=file.fieldname + "_" +req.query.cardId+"."+file.mimetype.slice(6,11);
      cardMethods.addImage(req.query.cardId,fname)
      done(null, fname);
    }
});
var upload = multer({ storage: Storage}).array("imgUploader",3);
/**
 * function to upload file to erver using multer
 */
module.exports=upload;
