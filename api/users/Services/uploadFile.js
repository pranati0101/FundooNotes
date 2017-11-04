/**
 * declaring module dependencies
 */
var multer=require('multer');
var fs=require('fs-extra');
var userMethods=require('../Models/userModel')
var Storage = multer.diskStorage({
    destination:(req, file, callback) => {
      var path='./app/Images';
      fs.mkdirsSync(path)
        callback(null,path);
    },
    filename: function (req, file, callback) {
      var filename=req.user._id+"."+file.mimetype.slice(6,11);
      userMethods.addProfilePic(req.user._id,filename);
      callback(null, filename);
    }
});
var upload = multer({ storage: Storage}).array("fname",1); //Field name and max count
/**
 * function to upload file to erver using multer
 * @param   req       web request parameter
 * @param  arrayName  name of var containing details of file to be uploaded
 */
exports.uploadFile=function(req,arrayName,callback){
  upload(req,arrayName,callback,function (err) {
      if (err) {
        console.log("Something went wrong!");
        callback(err,null)
      }
      else{
        console.log("File uploaded sucessfully!.");
        callback(null,'done')
      }
  })

}
