(function() {

function init(){
  $("#emailbtn").click(check);
  $('#otpbtn').click(otpChk);
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
      if(res=='200'){
        alert("OTP sent.")
      }
    })
}

function otpChk(event){
  var otp=document.getElementById('otp').value;;
  if(otp){
    $.ajax({
      type:'GET',
      url:'/otp?email='+email+'&otp='+otp
    }).done(function(res){
      console.log("verification done...");
      console.log(res);
      if(res=='verified'){
        localStorage.setItem('email',email)
        window.location.href="/resetPassword"//?email="+email;
      }
      else{
        alert("OTP not matched! Please enter again!")
      }
    }).fail(alert("Error"))
  }
}
  $(document).ready(init);
  })();
