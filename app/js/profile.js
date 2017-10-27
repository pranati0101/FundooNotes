/**
 * converts div element into text on click on any card/note
 * @return {[type]} [description]
 */
$(document).on('click','.card-content',function(){
$('#updateCardModal').modal('toggle');
$('#updateCardModal').modal('show');
var title=$(this).find('.cardTitle').text();
var text=$(this).find('.cardText').text();
var elem=$(this).closest('.col-md-4');
var id=$(elem).attr('id');
$('#updateCardModal').on('shown.bs.modal',function(){
  $('#title').attr('value',title);
  $('#text').attr('value',text);
  $('#updateContentForm').attr('action','/updateCard?cardId='+id);
})

})

 /**
  * chks for any link present in text content and converts into clickable link
  * uses regex to chk for any string in url form
  * @return {string} []
  */
 function convert(text)
    {
    if(text==null)  return text;
	  var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,;.]*[-A-Z0-9+&@#\/%=~_|])/ig;
	  var text1=text.replace(exp, "<a target='_blank' href='$1'>$1</a>");
	  var exp2 =/(^|[^\/])(www\.[\S]+(\b|$))/gim;
    return (text1.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>'))
    }
/**
 * [description]
 * @return {[type]} [description]
 */
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

    $('[data-toggle="tooltip"]').tooltip();

    document.getElementById('cardList').innerHTML=' ';
    var user=document.getElementById('space').value;
    user=JSON.parse(user);
    var userId=user.userId;
    var userEmail=user.local.email;//document.getElementById('mail').value;
    console.log(userId);
    socket = io.connect('http://localhost:4000');
    socket.emit('reminder',userId,userEmail);
    socket.emit('initElasticSearchIndex',userId)
    socket.on('showCards',function(dashBoard,archived,pinned,trash){
      // console.log("printing cards");
      // console.log(dashBoard,archived,pinned,trash);

      if(pinned.length>0){
          document.getElementById('pinnedLabel').innerHTML+='PINNED';
        for (i=0;i<pinned.length;i++){
          appendCard(user,pinned[i].title,pinned[i].text,pinned[i].cardId,'pinned',pinned[i].color)
        }
        document.getElementById('cardListLabel').innerHTML+='OTHERS';
      }

      if(dashBoard.length>0){
        for(i=0;i<dashBoard.length;i++){
          dashBoard[i].text=convert(dashBoard[i].text);

          if(dashBoard[i].collaborator==user.local.email){
              appendCollaboratorCard(user,dashBoard[i].title,dashBoard[i].text,dashBoard[i].cardId,'cardList',dashBoard[i].color)//.then(function(){
            // $(document).on('click','#collaboratorDropdown',function(dashBoard){
              for(j in dashBoard[i].collaborator){
                var li=document.createElement('li');
                var del=document.createElement('a');
                $(del).attr('data-toggle','tooltip')
                del.href="/removeCollaborator?cardId="+dashBoard[i].cardId+"&mail="+dashBoard[i].collaborator[j];
                del.innerText="x";
                del.title="Remove collaborator"
                del.style.float="right";
                li.append(dashBoard[i].collaborator[j]);
                li.append(del);
                document.getElementById('collaboratorList').append(li);
              }
          }
          else appendCard(user,dashBoard[i].title,dashBoard[i].text,dashBoard[i].cardId,'cardList',dashBoard[i].color)//.then(function(){

          if(dashBoard[i].image != null)
            {
              var img = document.createElement("IMG");
                img.src = "../Images/"+dashBoard[i].image;
                $(img).css("max-width","200px");
                $(img).css("max-height","200px")
                var elem=document.getElementById(dashBoard[i].cardId)
                $(elem).find('.cardImage').append(img);
                // $('#card').css("min-width","content");
                $(elem).closest('.card-content').css("height","400px");
            }
            if(dashBoard[i].url != null)
              {
                var urldiv = document.createElement("DIV");
                var elem=document.getElementById(dashBoard[i].cardId)
                // urldivdashBoard[i].url.title
                $(elem).find('.card-content').append(urldiv);
                $(elem).closest('.card-content').css("height","400px");
              }
        }
      }
    })

  })
/**
 * [appendCard description]
 * @param  {[type]} user   [description]
 * @param  {[type]} title  [description]
 * @param  {[type]} text   [description]
 * @param  {[type]} cardId [description]
 * @param  {[type]} divId  [description]
 * @param  {[type]} color  [description]
 * @return {[type]}        [description]
 */
//function to print cards
function appendCard(user,title,text,cardId,divId,color){
  if(divId=='pinned')
    url='../icons/pinned.svg'
  else url='../icons/pin.svg'
  imgSrc=""
  document.getElementById(divId).innerHTML+="<div class='col-md-4' id='"+cardId+"'><div class='card' style='background-color:"+color+"'>"+
         '<a href="pin?cardId='+cardId +'"><img src='+url+' style="float:right" alt="pin" id="pinIcon"/></a>'+
        //  "<div class='cardImage'> </div>"+
          "<div class='cardImage'></div><div class='card-content'><div class='title cardTitle' name='title' style='background-color:"+color+"'><p>"+title+"</p></div>"+
          "<div class='cardText' style='background-color:"+color+";'><p>"+text+"</p></div></div>"+
          "<div class='card-footer'><div><div id='footerButtons'>"+
          "<a class='popoverReminder' id='load'><i class='material-icons'>alarm</i></a>"+
          '<a data-toggle="tooltip" title="send to archive" href="/moveToArchive?cardId='+cardId+'"><i class="material-icons" >archive</i></a>&nbsp'+
          '<div data-toggle="tooltip" title="Add collaborator" class="dropdown"><a class="dropdown-toggle" id="collaboratorDropdown" data-toggle="dropdown"><i class="material-icons">person_add</i></a>'+
          '<div class="dropdown-menu"><ul style="width: 350px !important;" id="collaboratorList"><li><img class="img-responsive img-thumbnail img-circle" width="50px" height="50px" src="'+user.profilePic+'"/><b style="display:inline-block">(Owner)'+user.local.email+'</b>'+
          '</li></ul><form method="POST" action="/addPerson?cardId='+cardId+'"><input type="text" placeholder="Enter email id.." name="personEmail"><br><button type="submit" class="btn btn-primary">Add</button></form></div></div>&nbsp'+
          '<div data-toggle="tooltip" title="Change color" class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown"><i class="material-icons">color_lens</i></a><ul class="dropdown-menu navbar-right">'+
          // '<div class="row">'+
          '<span  class="col-sm-2"><a data-toggle="tooltip" title="white" href="/changeColor?cardId='+cardId+'&color=RGB(255, 255, 255)"><img class="img-circle" src="../Images/c1.png" height="20px" width="20px"/></a></span>'+
          '<span  class="col-sm-2"><a data-toggle="tooltip" title="red" href="/changeColor?cardId='+cardId+'&color=RGB(255, 170, 170)"><img class="img-circle" src="../Images/c2.png" height="20px" width="20px"/></a></span>'+
          '<span  class="col-sm-2"><a data-toggle="tooltip" title="orange" href="/changeColor?cardId='+cardId+'&color=RGB(255, 224, 170)"><img class="img-circle" src="../Images/c3.png" height="20px" width="20px"/></a></span>'+
          '<span  class="col-sm-2"><a data-toggle="tooltip" title="yellow" href="/changeColor?cardId='+cardId+'&color=RGB(255, 250, 170)"><img class="img-circle" src="../Images/c4.png" height="20px" width="20px"/></a></span>'+
          // '<div class="row">'+
          '<span  class="col-sm-2"><a data-toggle="tooltip" title="green" href="/changeColor?cardId='+cardId+'&color=RGB(214, 255, 170)"><img class="img-circle" src="../Images/c5.png" height="20px" width="20px"/></a></span>'+
          '<span  class="col-sm-2"><a data-toggle="tooltip" title="teal" href="/changeColor?cardId='+cardId+'&color=RGB(170, 255, 245)"><img class="img-circle" src="../Images/c6.png" height="20px" width="20px"/></a></span>'+
          '<span  class="col-sm-2"><a data-toggle="tooltip" title="blue" href="/changeColor?cardId='+cardId+'&color=RGB(128, 225, 242)"><img class="img-circle" src="../Images/c7.png" height="20px" width="20px"/></a></span>'+
          '<span  class="col-sm-2"><a data-toggle="tooltip" title="dark-blue" href="/changeColor?cardId='+cardId+'&color=RGB(151, 183, 252)"><img class="img-circle" src="../Images/c8.png" height="20px" width="20px"/></a></span>'+
          // '<div class="row>"'+
          '<span  class="col-sm-2"><a data-toggle="tooltip" title="purple" href="/changeColor?cardId='+cardId+'&color=RGB(193, 149, 249)"><img class="img-circle" src="../Images/c9.png" height="20px" width="20px"/></a></span>'+
          '<span  class="col-sm-2"><a data-toggle="tooltip" title="pink" href="/changeColor?cardId='+cardId+'&color=RGB(242, 179, 231)"><img class="img-circle" src="../Images/c10.png" height="20px" width="20px"/></a></span>'+
          '<span  class="col-sm-2"><a data-toggle="tooltip" title="brown" href="/changeColor?cardId='+cardId+'&color=RGB(196, 178, 161)"><img class="img-circle" src="../Images/c11.png" height="20px" width="20px"/></a></span>'+
          '<span  class="col-sm-2"><a data-toggle="tooltip" title="gray" href="/changeColor?cardId='+cardId+'&color=RGB(204, 204, 204)"><img class="img-circle" src="../Images/c12.png" height="20px" width="20px"/></a></span>'+
          '</ul></div>&nbsp'+
          '<div data-toggle="tooltip" title="Add Image" class="dropdown"><a data-toggle="dropdown"><i class="material-icons">insert_photo</i></a><ul class="dropdown-menu">'+
          '<form id="frmUploader" enctype="multipart/form-data" action="/addImage?cardId='+cardId+'" method="post">'+
        '<input name="imgUploader" type="file" id="imgSrc" multiple/><input type="submit"></input></form></ul></div>'+
          "<div class='dropdown'><a class='dropdown-toggle' data-toggle='dropdown'><i class='material-icons'>more_vert</i></a>"+
          '<ul class="dropdown-menu"><li><a data-toggle="tooltip" title="Delete" href="/moveToTrash?cardId='+cardId+'">Delete</a></li>'+
          '<li><a data-toggle="tooltip" title="Set Location" href="/addLocation?cardId='+cardId+'">Add Location</a></li>'+
          '</ul></div>'+
          "</div></div><div>"
}
//function to add collaborator card
//function to print cards
function appendCollaboratorCard(user,title,text,cardId,divId,color){
  if(divId=='pinned')
    url='../icons/pinned.svg'
  else url='../icons/pin.svg'
  imgSrc=""
  document.getElementById(divId).innerHTML+="<div class='col-md-4' id='"+cardId+"'><div class='card' style='background-color:"+color+"'>"+
         '<a href="pin?cardId='+cardId +'"><img src='+url+' style="float:right" alt="pin" id="pinIcon"/></a>'+
        //  "<div class='cardImage'> </div>"+
          "<div class='cardImage'></div><div class='card-content'><form method='POST' action='/updateCard?cardId="+cardId+"'><h4 class='title'><input name='title' style='border-style:none;background-color:"+color+"' value='"+title+"'></h4><span class='text-success'>"+
          "<input name='text' style='border-style:none;background-color:"+color+";' value='"+text+"'></span><button type='submit' class='btn btn-primary'>Update</button></form>"+"</div>"+
          "<div class='card-footer'><div><div id='footerButtons'>"+
          "<a data-toggle='tooltip' title='Set Reminder' class='popoverReminder' id='load'><i class='material-icons'>alarm</i></a>"+
          '<a data-toggle="tooltip" title="send to archive" href="/moveToArchive?cardId='+cardId+'"><i class="material-icons" >archive</i></a>&nbsp'+
          '<div data-toggle="tooltip" title="Add collaborator" class="dropdown"><a class="dropdown-toggle" id="collaboratorDropdown" data-toggle="dropdown"><i class="material-icons">person_add</i></a>'+
          '<div class="dropdown-menu"><ul style="width: 350px !important;" id="collaboratorList">'+
          '</li></ul><form method="POST" action="/addPerson?cardId='+cardId+'"><input type="text" placeholder="Enter email id.." name="personEmail"><br><button type="submit" class="btn btn-primary">Add</button></form></div></div>&nbsp'+
          '<div data-toggle="tooltip" title="Change color" class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown"><i class="material-icons">color_lens</i></a><ul class="dropdown-menu navbar-right">'+
          // '<div class="row">'+
          '<span  class="col-sm-2"><a data-toggle="tooltip" title="white" href="/changeColor?cardId='+cardId+'&color=RGB(255, 255, 255)"><img class="img-circle" src="../Images/c1.png" height="20px" width="20px"/></a></span>'+
          '<span  class="col-sm-2"><a data-toggle="tooltip" title="red" href="/changeColor?cardId='+cardId+'&color=RGB(255, 170, 170)"><img class="img-circle" src="../Images/c2.png" height="20px" width="20px"/></a></span>'+
          '<span  class="col-sm-2"><a data-toggle="tooltip" title="orange" href="/changeColor?cardId='+cardId+'&color=RGB(255, 224, 170)"><img class="img-circle" src="../Images/c3.png" height="20px" width="20px"/></a></span>'+
          '<span  class="col-sm-2"><a data-toggle="tooltip" title="yellow" href="/changeColor?cardId='+cardId+'&color=RGB(255, 250, 170)"><img class="img-circle" src="../Images/c4.png" height="20px" width="20px"/></a></span>'+
          // '<div class="row">'+
          '<span  class="col-sm-2"><a data-toggle="tooltip" title="green" href="/changeColor?cardId='+cardId+'&color=RGB(214, 255, 170)"><img class="img-circle" src="../Images/c5.png" height="20px" width="20px"/></a></span>'+
          '<span  class="col-sm-2"><a data-toggle="tooltip" title="teal" href="/changeColor?cardId='+cardId+'&color=RGB(170, 255, 245)"><img class="img-circle" src="../Images/c6.png" height="20px" width="20px"/></a></span>'+
          '<span  class="col-sm-2"><a data-toggle="tooltip" title="blue" href="/changeColor?cardId='+cardId+'&color=RGB(128, 225, 242)"><img class="img-circle" src="../Images/c7.png" height="20px" width="20px"/></a></span>'+
          '<span  class="col-sm-2"><a data-toggle="tooltip" title="dark-blue" href="/changeColor?cardId='+cardId+'&color=RGB(151, 183, 252)"><img class="img-circle" src="../Images/c8.png" height="20px" width="20px"/></a></span>'+
          // '<div class="row>"'+
          '<span  class="col-sm-2"><a data-toggle="tooltip" title="purple" href="/changeColor?cardId='+cardId+'&color=RGB(193, 149, 249)"><img class="img-circle" src="../Images/c9.png" height="20px" width="20px"/></a></span>'+
          '<span  class="col-sm-2"><a data-toggle="tooltip" title="pink" href="/changeColor?cardId='+cardId+'&color=RGB(242, 179, 231)"><img class="img-circle" src="../Images/c10.png" height="20px" width="20px"/></a></span>'+
          '<span  class="col-sm-2"><a data-toggle="tooltip" title="brown" href="/changeColor?cardId='+cardId+'&color=RGB(196, 178, 161)"><img class="img-circle" src="../Images/c11.png" height="20px" width="20px"/></a></span>'+
          '<span  class="col-sm-2"><a data-toggle="tooltip" title="gray" href="/changeColor?cardId='+cardId+'&color=RGB(204, 204, 204)"><img class="img-circle" src="../Images/c12.png" height="20px" width="20px"/></a></span>'+
          '</ul></div>&nbsp'+
          '<div data-toggle="tooltip" title="Add Image" class="dropdown"><a data-toggle="dropdown"><i class="material-icons">insert_photo</i></a><ul class="dropdown-menu">'+
          '<form id="frmUploader" enctype="multipart/form-data" action="/addImage?cardId='+cardId+'" method="post">'+
        '<input name="imgUploader" type="file" id="imgSrc" multiple/><input type="submit"></input></form></ul></div>'+
          "<div class='dropdown'><a class='dropdown-toggle' data-toggle='dropdown'><i class='material-icons'>more_vert</i></a>"+
          '<ul class="dropdown-menu"><li><a href="/removeMyself?cardId='+cardId+'">Remove myself</a></li></ul></div>'+
          "</div></div><div>"
}
