$(document).on('click','a.popoverReminder',function(){
  $(this).popover({
    html: true,
    title:'<input type="text" class="datepicker" placeholder="Enter date"><br><input type="text" placeholder="Enter time" class="timepicker"><br><button type="submit" id="setReminder"> Submit</button>'
  })
  $(this).on('shown.bs.popover', function () {

    $('.datepicker').datepicker();
    $('.timepicker').timepicker();
    $('#setReminder').on('click',function(){
      var date=$(event.target).closest('#footerButtons').find('.datepicker').val();
      var time=$(event.target).closest('#footerButtons').find('.timepicker').val();
      var id=$(event.target).closest('.col-md-4').attr('id');
      var hours=parseInt(time.substr(0,2))
      var month=parseInt(date.substr(0,2))-1;
      if(time.substr(6,2)=='PM' && hours<12)
        hours=hours+12
      var values={
        date:date.substr(3,2),
        month:month,
        year:date.substr(6,4),
        hours:hours,
        minutes:time.substr(3,2),
        seconds:0,
        cardId:id
      }
      $.ajax({
        url:'/setReminder',
        method:'POST',
        dataType:'JSON',
        data:values
      }).done(function(err,res){
        if(err) console.error();
      })
  })
})
})
  $(document).ready(function() {

    document.getElementById('cardList').innerHTML=' ';
    var userId=document.getElementById('space').value;
    var userEmail=document.getElementById('mail').value;
    console.log(userId);
    socket = io.connect('http://localhost:4000');
    socket.emit('reminder',userId,userEmail);
    socket.emit('initElasticSearchIndex',userId)
    socket.on('showCards',function(dashBoard,archived,pinned,trash){
      console.log("printing cards");
      // console.log(dashBoard,archived,pinned,trash);

      if(pinned.length>0){
          document.getElementById('pinnedLabel').innerHTML+='PINNED';
        for (i=0;i<pinned.length;i++) {
          appendCard(pinned[i].title,pinned[i].text,pinned[i].cardId,'pinned',pinned[i].color)
        }
        document.getElementById('cardListLabel').innerHTML+='OTHERS';
      }

      if(dashBoard.length>0){
        for(i=0;i<dashBoard.length;i++){
          appendCard(dashBoard[i].title,dashBoard[i].text,dashBoard[i].cardId,'cardList',dashBoard[i].color)//.then(function(){
            if(dashBoard[i].image != null)
            {
              var img = document.createElement("IMG");
                img.src = "../Images/"+dashBoard[i].image;
                var elem=document.getElementById(dashBoard[i].cardId)
                $(elem).find('.cardImage').append(img);
                // var cardImg= $(elem).find('.cardImage');
                // console.log(cardImg);
                // elem.style.backgroundImage='url("../Images/"'+dashBoard[i].image+'")';
            }
          // })

        }
      }
      // var scriptElement=document.createElement('script');
      // scriptElement.type = 'text/javascript';
      // scriptElement.src = "../js/dateTime.js";
      // // script(type="text/javascript" src="../js/dateTime.js")
      //
      // document.body.appendChild(scriptElement);
    })

  })

//function to print cards
function appendCard(title,text,cardId,divId,color){
  if(divId=='pinned')
    url='../icons/pinned.svg'
  else url='../icons/pin.svg'
  imgSrc=""
  document.getElementById(divId).innerHTML+="<div class='col-md-4' id='"+cardId+"'><div class='card' style='background-color:"+color+"'>"+
         '<a href="pin?cardId='+cardId +'"><img src='+url+' style="float:right" alt="pin" id="pinIcon"/></a>'+
        //  "<div class='cardImage'> </div>"+
          "<div class='cardImage'></div><div class='card-content'><form method='POST' action='/updateCard?cardId="+cardId+"'><h4 class='title'><input name='title' style='border-style:none' value='"+title+"'></h4><span class='text-success'>"+
          "<input name='text' style='{background-color:"+color+",border-style:none}' value='"+text+"'></span><button type='submit' class='btn btn-primary'>Update</button></form>"+"</div>"+
          "<div class='card-footer'><div><i class='material-icons'>access_time</i>"+
          "Last modified on"+"<div><div id='footerButtons'>"+
          "<a class='popoverReminder' id='load'><i class='material-icons'>alarm</i></a>"+
          '<a href="/moveToArchive?cardId='+cardId+'"><i class="material-icons" >archive</i></a>&nbsp'+
          '<div class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown"><i class="material-icons">person_add</i></a>'+
          '<div class="dropdown-menu"><form method="POST" action="/addPerson?cardId='+cardId+'"><input type="text" placeholder="Enter email id.." name="personEmail"><br><button type="submit" class="btn btn-primary">Add</button></form></div></div>&nbsp'+
          '<div class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown"><i class="material-icons">color_lens</i></a><ul class="dropdown-menu">'+
          '<li><a href="/changeColor?color=blue&cardId='+cardId+'"><img class="img-circle" src="../Images/blue.png" height="20px" width="20px"</a></li>'
          ''+
          '</ul></div>&nbsp'+
          '<div class="dropdown"><a data-toggle="dropdown"><i class="material-icons">insert_photo</i></a><ul class="dropdown-menu">'+
          '<form id="frmUploader" enctype="multipart/form-data" action="/addImage?cardId='+cardId+'" method="post">'+
        '<input name="imgUploader" type="file" id="imgSrc" multiple/><input type="submit"></input></form></ul></div>'+
          '<a href="/moveToTrash?cardId='+cardId+'"><i class="material-icons">delete</i></a>&nbsp'+
          "</div></div><div>"
}
function moveToArchive(cardId){
  console.log("archiving..!!");
  $.ajax({
    url:'/moveToArchive?cardId='+cardId,
    type:'GET'
  }).done(function(response){
    if(response=='done'){
        elem=document.getElementById(cardId);
        elem.remove()
    }
    else alert("Error");
  })
}
// "moveToTrash(\'' + cardId + '\')"
function moveToTrash(cardId){
  console.log("deleting..!!");
  $.ajax({
    url:'/moveToTrash?cardId='+cardId,
    type:'GET'
  }).done(function(response){
    if(response=='done'){
        elem=document.getElementById(cardId);
        elem.remove()
    }
    else alert("Error");
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
