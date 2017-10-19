$(function() {
  $('#changeProfilePic').on('show.bs.modal',function(){
    console.log("modal shown..!!");
    $('#filename').on('change',function(){
      var basic = $('.profilePic').croppie({
        exif:true,
        viewport: {
          width: 100,
          height: 100
        }
      });
      readFile(event.target,basic)
    })
  })
});

//function to read the selected file
function readFile(input,basic){
  console.log("in readfile..");
  console.log(input.files[0]);
if (input.files && input.files[0]) {
  var reader = new FileReader();
  reader.onload = function (e) {
    console.log("reader loading..");
    basic.croppie('bind', {
      url: e.target.result
    });
    basic.croppie('result', 'html').then(function(html){
      console.log("html..",html);
      image=($(html).find('img'));
      var left=image.css("left");
      var top=image.css("top");

      $('#crop').on('click',function(event){
        console.log("in crop");
        console.log(left,top);
        userProfilePic=$('.navbar-header').find('#userProfilePic');
        $('.navbar-header').find('#userProfilePic').css({"left":left,"top":top})
        // $("#mydiv").position({
        //   of: $('#mydiv').parent(),
        //   my: 'left top',
        //   at: 'left top',
        //   offset: '50 100'
        // });
       console.log(userProfilePic.css("left"));
      })
    });
  }
  reader.readAsDataURL(input.files[0]);
}
}
