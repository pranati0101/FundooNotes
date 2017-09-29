(function() {
    function init() {
    $('.create-acc').click(register);
    // $('#firstname').change(chkname);
    // $('#lastname').change(chkname);
    // $('#password').change(chkpass);
    // $('#password2').change(chkpass);
    // $('#mail').change(chkmail);
  }

  function chkname(event){
    var firstname = document.getElementById('firstname').value;
    var lastname = document.getElementById('lastname').value;
    // var regex = new RegExp("^[a-zA-Z0-9@_]+$");
    var regex = new RegExp("^[a-zA-Z]+$");
    if (!(regex.test(firstname)) || !(regex.test(firstname))) {
      alert("Enter valid First and Last name !");
    }
  }
var regex=/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  function chkpass(event){
    var form2 = document.getElementById('form2');
    var pass = form2.password.value;
    // var regex = new RegExp("^[a-zA-Z0-9@_]+$");

    if (!(regex.test(pass))) {
      alert("minimum length of password must be 6 characters and it must contain"+
       +"one lowercase, one uppercase, one number and one special character[!@#%&]");
    }
  }

  function chkmail(event){
    var form2 = document.getElementById('form2');
    var mail = form2.mail.value;
    // var regex = new RegExp("^[a-zA-Z0-9@_]+$");
var regex=new RegExp("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/");
if (!(regex.test(mail))) {
      alert("Enter valid email-id");
    }
  }
  //chk if user exists, if not create new user with password and insert into database
  function register(event) {
    var testform = document.getElementById('form2');
    var firstname = form2.firstname.value;
    var lastname = form2.lastname.value;
    var mail = form2.mail.value;
    var pass1=form2.password.value;
    var pass2=form2.password2.value;
    if (pass1 != pass2) {
      alert("Enter same password !");
    }
    else {
      var res = $.ajax({
        url: '/newUserLocal',
        type: 'POST',
        dataType: "JSON",
        data: {
          "firstname": form2.firstname.value,
          "lastname":form2.lastname.value,
          "email":form2.mail.value,
          "password": form2.password.value
        }
      }).done(function(result) {
        console.log(result);
        if (result.data == false) {
          alert("User already registered!");

        } else if (result.data == true) {
          alert("New User registered!");
        }
      });
    }
    console.log("Registration finished");
  }
$(document).ready(init);
})();
