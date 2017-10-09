(function() {
  $(function(){
      // $( "#datepicker" ).datepicker();
      // // $('#timepicker').wickedpicker();
      // $('#timepicker').timepicker({
      //   'scrollDefault':'now',
      //   'timeFormat': 'H:i:s'
      // });
      $('#datepicker').datetimepicker({
          pickDate: true, // disables the date picker
          pickTime: false, // disables de time picker
          // pick12HourFormat: true, // enables the 12-hour format time picker
          // pickSeconds: true, // disables seconds in the time picker
          startDate: -Infinity, // set a minimum date
          endDate: Infinity, // set a maximum date
          format: 'DD/MM/YYYY',
          language: 'en'
});
      $('#timepicker').datetimepicker({
          pickDate: false, // disables the date picker
          pickTime: true, // disables de time picker
          pick12HourFormat: false, // enables the 12-hour format time picker
          pickSeconds: true, // disables seconds in the time picker
          startDate: -Infinity, // set a minimum date
          endDate: Infinity, // set a maximum date
          format: 'hh:mm:ss',
          language: 'en'
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
      console.log(dashBoard.length);
        for (i=0;i<dashBoard.length;i++) {
          document.getElementById('cardList').innerHTML +="<li><input style='display:none' id='cardId' value='"
          +dashBoard[i].cardId+"'></div><h2>"+
          dashBoard[i].title+"</h2><p>"+dashBoard[i].text+
          "</p><a onclick="+"openModal(\'"+dashBoard[i].cardId+"\')>Reminder</a></li>";
        }
    })
    init;//"myFunction(\''+response[i].id+'\',\''+driversList+'\')"
  })
})();
function createCard(){
  console.log("here");
  var title = document.getElementById('cardTitle').value;
  var text = document.getElementById('cardText').value;
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
      title+"</h2><p>"+text+"</p><input style='display:none' id='cardId'value='"+result.cardId+
      "'/><a onclick="+"openModal(\'"+dashBoard[i].cardId+"\')>Reminder</a></li>";
  })
}

function openModal(cardId){
  // var cardId=document.getElementById('cardId').value;
  console.log("clicked",cardId);
  document.getElementById('showModal').click();
  $('#openModal').modal('toggle');
  $('#openModal').modal('show');
  document.getElementById('cid').value=cardId;
}
//set Reminder
function setReminder(){
  console.log("herer");
 date=document.getElementById('datepicker').value;
 time=document.getElementById('timepicker').value;
 cardId=document.getElementById('cid').value;
 var values={
   date:date.substr(0,2),
   month:date.substr(3,2),
   year:date.substr(6,4),
   hours:time.substr(0,2),
   minutes:time.substr(3,2),
   seconds:time.substr(6,2),
   cardId:cardId
 }
 console.log(values);
 $.ajax({
   url:'/setReminder',
   method:'POST',
   dataType:'JSON',
   data:values
 }).done(function(err,res){
   if(err) console.error();
   console.log(res);
 })
}
