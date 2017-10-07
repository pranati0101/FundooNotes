(function() {
  $(function(){
      $( "#datepicker" ).datepicker();
      // $('#timepicker').wickedpicker();
      $('#timepicker').timepicker({
        'scrollDefault':'now',
        'timeFormat': 'H:i:s'
      });
  })
  function init() {
    //<span class="+
    // "'glyphicon glyphicon-bell' color='black'></span>
  }
  $(document).ready(function() {
    var userId=document.getElementById('space').value;
    console.log(userId);
    socket = io.connect('http://localhost:4000');
    socket.emit('reminder',userId);
    socket.on('showCards',function(dashBoard,archived,pinned,trash){
      document.getElementById('cardList').innerHTML=' ';
      console.log(dashBoard);
        for (i in dashBoard) {
          document.getElementById('cardList').innerHTML +="<li><h2>"+
          dashBoard[i].title+"</h2><p>"+dashBoard[i].text+"</p><a href='#openModal'>Reminder</a></li>";
        }
    })
    init;
  })
})();
function createCard(){
  console.log("here");
  var title = document.getElementById('cardTitle').value;
  var text = document.getElementById('cardText').value;
  // var date = $('#datepicker').datepicker( "getDate" )
  // var time=$('#timepicker').timepicker( "getTime" )
// console.log(date);
// // date.setHours=(time.getHours());
// console.log("after ",date);
  $.ajax({
      url: '/createCard',
      type: 'POST',
      dataType: "JSON",
      data: {
        "title": title,
        "text":text
      }
    }).done(function(result) {
      console.log(result);
      document.getElementById('cardList').innerHTML +="<li><h2>"+
      title+"</h2><p>"+text+"</p></li>";
  })
}
//set Reminder
function setReminder(){
  console.log("herer");
  // document.getElementById('reminderDialog').click();
  var elem=document.getElementById('reminderDialog');
  elem.click();
}
