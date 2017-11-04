(function() {

function init(){
  $("#emailbtn").click(check);
}
var email;

function check(event){
  email=document.getElementById('email').value;
  console.log("in chk")
    $.ajax({
    type:'POST',
    url:'/forgotPassword',
    datatype:'json',
    data:{
      "email": email
    }
  }).done(function(res){
      console.log(res);
    if(res=='404'){
        alert("Email Id is not registered.")
      }
      else if(res=='500')
        alert("Could not send OTP. Network problem!")
    })
}
  $(document).ready(init);
  })();
