$(document).ready(function() {
  document.getElementById('cardList').innerHTML = " ";
  var userId = document.getElementById('space').value;
  var data = document.getElementById('data').value;
  console.log("data--->",data);
  console.log(data.length);
  data=JSON.parse(data)
  console.log(data.length);
  if (data.length > 0) {
    for (i = 0; i < data.length; i++) {
        console.log(data[i]);
      if(data[i].pinned)  appendCard(data[i].title, data[i].text, data[i].cardId, 'pinned')
      else appendCard(data[i].title, data[i].text, data[i].cardId, 'cardList')
      // appendCard(data[i].title, data[i].text, data[i].cardId, 'cardList') //.then(function(){
      if (data[i].image != null) {
        var img = document.createElement("IMG");
        img.src = "../Images/" + data[i].image;
        var elem = document.getElementById(data[i].cardId)
        $(elem).find('.cardImage').append(img);
      }
    }
  }
})

$(document).on('click', 'a.popoverReminder', function() {
  $(this).popover({
    html: true,
    title: '<input type="text" class="datepicker" placeholder="Enter date"><br><input type="text" placeholder="Enter time" class="timepicker"><br><button type="submit" id="setReminder"> Submit</button>'
  })
  $(this).on('shown.bs.popover', function() {

    $('.datepicker').datepicker();
    $('.timepicker').timepicker();
    $('#setReminder').on('click', function() {
      var date = $(event.target).closest('#footerButtons').find('.datepicker').val();
      var time = $(event.target).closest('#footerButtons').find('.timepicker').val();
      var id = $(event.target).closest('.col-md-4').attr('id');
      var hours = parseInt(time.substr(0, 2))
      var month = parseInt(date.substr(0, 2)) - 1;
      if (time.substr(6, 2) == 'PM' && hours < 12)
        hours = hours + 12
      var values = {
        date: date.substr(3, 2),
        month: month,
        year: date.substr(6, 4),
        hours: hours,
        minutes: time.substr(3, 2),
        seconds: 0,
        cardId: id
      }
      $.ajax({
        url: '/setReminder',
        method: 'POST',
        dataType: 'JSON',
        data: values
      }).done(function(err, res) {
        if (err) console.error();
      })
    })
  })
})


//function to print cards
function appendCard(title, text, cardId, divId) {
  if (divId == 'pinned')
    url = '../icons/pinned.svg'
  else url = '../icons/pin.svg'
  imgSrc = ""
  document.getElementById('cardList').innerHTML += "<div class='col-md-4' id='" + cardId + "'><div class='card'>" +
    '<a href="pin?cardId=' + cardId + '"><img src=' + url + ' style="float:right" alt="pin" id="pinIcon"/></a>' +
    //  "<div class='cardImage'> </div>"+
    "<div class='cardImage'></div><div class='card-content'><br><h4 class='title'><p contentEditable='true'>" + title + "</h4><span class='text-success'>" +
    "<p contentEditable='true'>" + text + "</span>" + "</div>" +
    "<div class='card-footer'><div><i class='material-icons'>access_time</i>" +
    "Last modified on" + "<div><div id='footerButtons'>" +
    "<a class='popoverReminder' id='load'><i class='material-icons'>alarm</i></a>" +
    '<a><i class="material-icons" onclick="moveToArchive(\'' + cardId + '\')">archive</i></a>&nbsp' +
    '<a><i class="material-icons" onclick="addCollaborator(\'' + cardId + '\')">person_add</i></a>&nbsp' +
    '<a><i class="material-icons" onclick="addColor(\'' + cardId + '\')">color_lens</i></a>&nbsp' +
    '<div class="dropdown"><a data-toggle="dropdown"><i class="material-icons">insert_photo</i></a><ul class="dropdown-menu">' +
    '<form id="frmUploader" enctype="multipart/form-data" action="/addImage?cardId=' + cardId + '" method="post">' +
    '<input name="imgUploader" type="file" id="imgSrc" multiple/><input type="submit"></input></form></ul></div>' +
    '<a><i class="material-icons" onclick="moveToTrash(\'' + cardId + '\')">delete</i></a>&nbsp' +
    "</div></div><div>"
}


function moveToArchive(cardId) {
  console.log("archiving..!!");
  $.ajax({
    url: '/moveToArchive?cardId=' + cardId,
    type: 'GET'
  }).done(function(response) {
    if (response == 'done') {
      elem = document.getElementById(cardId);
      elem.remove()
    } else alert("Error");
  })
}
// "moveToTrash(\'' + cardId + '\')"
function moveToTrash(cardId) {
  console.log("deleting..!!");
  $.ajax({
    url: '/moveToTrash?cardId=' + cardId,
    type: 'GET'
  }).done(function(response) {
    if (response == 'done') {
      elem = document.getElementById(cardId);
      // elem.parentNode.removeChild(elem);
      elem.remove()
    } else alert("Error");
  })
}

function addCollaborator() {

}

function addColor() {

}

function openModal(cardId) {
  // var cardId=document.getElementById('cardId').value;
  console.log("clicked", cardId);
  document.getElementById('showModal').click();
  $('#openModal').modal('toggle');
  $('#openModal').modal('show');
  document.getElementById('cid').value = cardId;
}
