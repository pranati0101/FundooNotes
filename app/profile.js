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

  }
  // $('#submitbtn').click(createCard);

  $(document).ready(function() {
    $.ajax({
      url: '/showCards',
      type: 'GET'
    }).done(function(result) {
      console.log("showing cards", result.card);
      for (i in result.card) {
        document.getElementById('cardList').innerHTML +="<li><h2>"+
        result.card[i].title+"</h2><p>"+result.card[i].text+"</p></li>";
      }
      console.log(result.userId);
      socket = io.connect('http://localhost:4000');
      socket.emit('reminder', result.card);
    });
    init;
  })
})();
function createCard(){
  console.log("here");
  var title = document.getElementById('cardTitle').value;
  var text = document.getElementById('cardText').value;
  var date = $('#datepicker').datepicker( "getDate" )
  var time=$('#timepicker').timepicker( "getTime" )
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
        // "reminder":{
        //   date:date.getDay(),
        //   month:date.getMonth(),
        //   year:date.getFullYear(),
        //   hours:time.getHours(),
        //   minutes:time.getMinutes(),
        //   seconds:time.getSeconds()
        // }
      }
    }).done(function(result) {
      console.log(result);
      document.getElementById('cardList').innerHTML +="<li><h2>"+
      title+"</h2><p>"+text+"</p></li>";
  })
}
