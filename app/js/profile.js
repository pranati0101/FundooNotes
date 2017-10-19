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
          appendCard(pinned[i].title,pinned[i].text,pinned[i].cardId,'pinned')
        }
        document.getElementById('cardListLabel').innerHTML+='OTHERS';
      }

      if(dashBoard.length>0){
        for(i=0;i<dashBoard.length;i++){
          appendCard(dashBoard[i].title,dashBoard[i].text,dashBoard[i].cardId,'cardList')//.then(function(){
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

function createCard(){
  console.log("here");
  var title = document.getElementById('cardTitle').innerText;
  var text = document.getElementById('cardText').innerText;
  $.ajax({
      url: '/createCard',
      type: 'POST',
      dataType: "JSON",
      data: {
        "title": title,
        "text":text
      }
    }).fail(function(){
      alert("Error");
    }).done(function(result) {
      console.log(result);
      appendCard(title,text,result.cardId,'cardList')
  })
}

//function to print cards
function appendCard(title,text,cardId,divId){
  if(divId=='pinned')
    url='../icons/pinned.svg'
  else url='../icons/pin.svg'
  imgSrc=""
  document.getElementById(divId).innerHTML+="<div class='col-md-4' id='"+cardId+"'><div class='card'>"+
         '<a href="pin?cardId='+cardId +'"><img src='+url+' style="float:right" alt="pin" id="pinIcon"/></a>'+
        //  "<div class='cardImage'> </div>"+
          "<div class='cardImage'></div><div class='card-content'><br><h4 class='title'><p contentEditable='true'>"+title+"</h4><span class='text-success'>"+
          "<p contentEditable='true'>"+text+"</span>"+"</div>"+
          "<div class='card-footer'><div><i class='material-icons'>access_time</i>"+
          "Last modified on"+"<div><div id='footerButtons'>"+
          "<a class='popoverReminder' id='load'><i class='material-icons'>alarm</i></a>"+
          '<a><i class="material-icons" onclick="moveToArchive(\'' + cardId + '\')">archive</i></a>&nbsp'+
          '<div class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown"><i class="material-icons">person_add</i></a>'+
          '<div class="dropdown-menu"><form method="POST" action="/addPerson?cardId="'+cardId+'><input type="text" placeholder="Enter email id.." name="personEmail"><br><button type="submit" class="btn btn-primary">Add</button></form></div></div>&nbsp'+
          '<a><i class="material-icons" onclick="addColor(\'' + cardId + '\')">color_lens</i></a>&nbsp'+
          '<div class="dropdown"><a data-toggle="dropdown"><i class="material-icons">insert_photo</i></a><ul class="dropdown-menu">'+
          '<form id="frmUploader" enctype="multipart/form-data" action="/addImage?cardId='+cardId+'" method="post">'+
        '<input name="imgUploader" type="file" id="imgSrc" multiple/><input type="submit"></input></form></ul></div>'+
          '<a><i class="material-icons" onclick="moveToTrash(\'' + cardId + '\')">delete</i></a>&nbsp'+
          "</div></div><div>"
}
// function insertImage(event){
//   // var elem=($(event.target).closest('#footerButtons').find('#frmUploader'));
//   // console.log(elem.find('#imgSrc').val());
//   // var imgDiv=$(event.target).closest('#cardImage');
//   // var img = document.createElement("IMG");
//   //   img.src = ;
//   //   imgDiv.appendChild(img);                  //.find('#imgSrc').val());
// }
// <form id="frmUploader" enctype="multipart/form-data" action="api/Upload/" method="post">
//     <input type="file" name="imgUploader" multiple />
//     <input type="submit" name="submit" id="btnSubmit" value="Upload" />
// </form>
//sending card to archive
// function loadScript(){
//   console.log("1");
//     $('.popoverReminder').popover({
//       html: true,
//       title:'<input type="text" class="datepicker"><br><input type="text" class="timepicker">',
//       content:'<button type="submit" onclick="setReminder()"> Submit'
//     },function(err,res){
//       console.log("loading..");
//     });
//     $('.popoverReminder').on('shown.bs.popover', function () {
//
//       $('.datepicker').datepicker();
//       $('.timepicker').timepicker();
//     })
// }

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
        // elem.parentNode.removeChild(elem);
        elem.remove()
    }
    else alert("Error");
  })
}
function addCollaborator(){

}
function addColor(){

}
function addImage(event){
  var imgSrc=document.getElementById("imgSrc").value;
  console.log(imgSrc);
  var input=event.target;
  console.log(typeof(input.files[0]));
  // $.ajax({
  //   url:"/addImage",
  //   type:"POST",
  //   data:{
  //     imgSrc:imgSrc,
  //     cardId:cardId
  //   }
  // }).done(function(response){
  //   console.log(response);
  // }).fail(function(){
  //   alert("Error");
  // })
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
  console.log();
 // date=document.getElementById('datepicker').value;
 // time=document.getElementById('timepicker').value;
 // cardId=document.getElementById('cid').value;
 // var values={
 //   date:date.substr(0,2),
 //   month:date.substr(3,2),
 //   year:date.substr(6,4),
 //   hours:time.substr(0,2),
 //   minutes:time.substr(3,2),
 //   seconds:time.substr(6,2),
 //   cardId:cardId
 // }
 // console.log(values);
 // $.ajax({
 //   url:'/setReminder',
 //   method:'POST',
 //   dataType:'JSON',
 //   data:values
 // }).done(function(err,res){
 //   if(err) console.error();
 //   console.log(res);
 // })
}
