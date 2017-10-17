$(function() {
  $('#changeProfilePic').on('show.bs.modal',function(){
    console.log("modal shown..!!");
    var basic = $('.profilePic').croppie({
      exif:true,
      viewport: {
        width: 150,
        height: 200
      }
    });
  })


  // var data = basic.get();
  // console.log("data",data);
  // get result from croppie
  $('#uploadCrop').on('click',function(){
    console.log("in upload");
    readFile($('#filename').val())
    });
});
function readFile(input){
if (input.files && input.files[0]) {
  var reader = new FileReader();
  reader.onload = function (e) {
    basic.croppie('bind', {
      url: e.target.result
    });
  }
  reader.readAsDataURL(input.files[0]);
}
}
