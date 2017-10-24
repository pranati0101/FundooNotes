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
    $('#crop').on('click',function(event){
      console.log("in crop");
      basic.croppie('result', 'html').then(function(html){
        console.log("html..",html);
        div=$(html)//.find('.croppie-result');
        image=$(html).find('img');
        var width=div.css("width");
        var height=div.css("height");
        var left=image.css("left");
        var top=image.css("top");
        console.log(width,height,left,top);
        userProfilePic=document.getElementById('userProfilePic');
        console.log(userProfilePic);
        // userProfilePic.style["top",top]
        // console.log(typeof(top));
        userProfilePic.style.setProperty("top",top);
        userProfilePic.style.setProperty("left",left);
        // userProfilePic.style.setProperty("width",width);
        // userProfilePic.style.setProperty("height",height);
        // $('.navbar-header').find('#userProfilePic').css({"width":width,"height":height,"left":left,"top":top})
        // $("#mydiv").position({
        //   of: $('#mydiv').parent(),
        //   my: 'left top',
        //   at: 'left top',
        //   offset: '50 100'
        // });
      //  console.log(userProfilePic.css("top"));
      });
    })
  }
  reader.readAsDataURL(input.files[0]);
}
}
