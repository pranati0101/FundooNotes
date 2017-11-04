(function() {
    function init() {
    // $('.create-acc').click(register);
    $('#firstname').change(chkname);
    $('#lastname').change(chkname);
    $('#password').change(chkpass);
    $('#password2').change(chkpass);
    $('#mail').change(chkmail);
  }

  function chkname(event){
    var firstname = document.getElementById('firstname').value;
    var lastname = document.getElementById('lastname').value;
    /**
     *
    Password must be at least 6 characters, no more
    than 10 characters, and must include only alphabets.
     */
    var regex = new RegExp("^[a-zA-Z]+$");
    if (!(regex.test(firstname)) || !(regex.test(lastname))) {
      alert("Enter valid First and Last name !");
    }
  }
  function chkpass(event){
    var pass1 = document.getElementById('password').value;
    var pass2 = document.getElementById('password').value;
    /**
     *
    Password matching expression. Password must be at least 6 characters, no more
    than 10 characters, and must include at least one upper case letter, one lower
    case letter, and one numeric digit.
     */
    var regex=new RegExp("/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/")
    // var regex = new RegExp("^[a-zA-Z0-9@_]+$");
    // var regex=/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

    if (!(regex.test(pass1)) || !(regex.test(pass2))) {
      alert("minimum length of password must be 6 characters and it must contain\
      one lowercase, one uppercase and one numeric digit");
    }
  }

  function chkmail(event){
    var mail = document.getElementById('mail').value;
    var regex=new RegExp("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/");
    if (!(regex.test(mail))) {
          alert("Enter valid email-id");
        }
      }

$(document).ready(init)
})();
