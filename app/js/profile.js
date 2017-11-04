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
      var id=$(event.target).closest('.col-md-4').attr('id');
      $('#reminderModal').modal('toggle');
      $('#reminderModal').modal('show');
      $('#reminderModal').on('shown.bs.modal', function () {
        $('.timepicker').timepicker();
        $('.datepicker').datepicker();
        /**
         * set reminder at 8:00 pm, today
         */
        $('#tomorrow').on('click',function(){
          var today = new Date();
          var dd = today.getDate();
          var mm = today.getMonth()+1; //January is 0!
          var yyyy = today.getFullYear();
          if(mm==1 ||mm==3||mm==5||mm==7||mm==8||mm==10||mm==12){
            if(dd==31){
              dd=1;mm=mm+1;
            }
          }
          else if(mm=2){
            if(dd==28){
              dd=1;mm=3
            }
          }
          else{
            if(dd==30){
              dd=1;mm=mm+1;
            }
          }
          var values={
            date:dd,
            month:mm,
            year:yyyy,
            hours:8,
            minutes:0,
            seconds:0,
            cardId:id
          }
    /**
     *setting reminder by calling set reminder api
     */
          $.ajax({
            url:'/setReminder',
            method:'POST',
            dataType:'JSON',
            data:values
          }).done(function(err,res){
            alert(res);
            if(err) console.error();
          })
      })
        /**
         * set reminder at 8:00 pm, today
         */
        $('#laterToday').on('click',function(){
          var today = new Date();
          var dd = today.getDate();
          var mm = today.getMonth()+1; //January is 0!
          var yyyy = today.getFullYear();
          var values={
            date:dd,
            month:mm,
            year:yyyy,
            hours:20,
            minutes:0,
            seconds:0,
            cardId:id
          }
    /**
     *setting reminder by calling set reminder api
     */
          $.ajax({
            url:'/setReminder',
            method:'POST',
            dataType:'JSON',
            data:values
          }).done(function(err,res){
            alert(res);
            if(err) console.error();
          })
      })
/**
 * when set reminder button is clicked
 * set reminder on customised date and time
 */
        $('#setReminder').on('click',function(){
          var date=$('.datepicker').val();
          var time=$('.timepicker').val();
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
    /**
     *setting reminder by calling set reminder api
     */
          $.ajax({
            url:'/setReminder',
            method:'POST',
            dataType:'JSON',
            data:values
          }).done(function(err,res){
            alert(res);
            if(err) console.error();
          })
      })
    })
    })
/**
 * [description]
 * @return {[type]} [description]
 */
// $(document).on('click','a.popoverReminder',function(){
//   $(this).popover({
//     html: true,
//     title:'<input type="text" class="datepicker" placeholder="Enter date"><br><input type="text" placeholder="Enter time" class="timepicker"><br><button type="submit" id="setReminder"> Submit</button>'
//   })
//   $(this).on('shown.bs.popover', function () {
//
//     $('.datepicker').datepicker();
//     $('.timepicker').timepicker();
//     $('#setReminder').on('click',function(){
//       var date=$(event.target).closest('#footerButtons').find('.datepicker').val();
//       var time=$(event.target).closest('#footerButtons').find('.timepicker').val();
//       var id=$(event.target).closest('.col-md-4').attr('id');
//       var hours=parseInt(time.substr(0,2))
//       var month=parseInt(date.substr(0,2))-1;
//       if(time.substr(6,2)=='PM' && hours<12)
//         hours=hours+12
//       var values={
//         date:date.substr(3,2),
//         month:month,
//         year:date.substr(6,4),
//         hours:hours,
//         minutes:time.substr(3,2),
//         seconds:0,
//         cardId:id
//       }
//       $.ajax({
//         url:'/setReminder',
//         method:'POST',
//         dataType:'JSON',
//         data:values
//       }).done(function(err,res){
//         if(err) console.error();
//       })
//   })
// })
// })

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
      console.log(dashBoard);

      if(pinned.length>0){
          document.getElementById('pinnedLabel').innerHTML+='PINNED';
        document.getElementById('cardListLabel').innerHTML+='OTHERS';
      }
      //if there are any cards present in dashboard
      if(dashBoard.length>0){
        var divId;
        for(i=0;i<dashBoard.length;i++){
          if(dashBoard[i].pinned) divId="pinned"
          else divId="cardList"
          dashBoard[i].text=convert(dashBoard[i].text);
          //if collaborator field is not null
          if(dashBoard[i].collaborator!=null){
            // user is not owner of the card
            if(dashBoard[i].userId!=user.userId){
              appendCollaboratorCard(user,dashBoard[i].title,dashBoard[i].text,dashBoard[i].cardId,divId,dashBoard[i].color)
              //calling api to get owner information

            var owner;
            $.ajax({
                  url:"/getUserInfo?id="+dashBoard[i].userId,
                  async:false,
                  method:"GET",
                  dataType:"JSON"
                }).then(function(info){
                  owner=info;
                  console.log(info);
                  return info;
                })

                    var li=document.createElement('li');
                    var img=document.createElement('img');
                    img.src=owner.profilePic;
                    img.class="img-responsive img-thumbnail img-circle"
                    $(img).css("max-width","50px");
                    $(img).css("max-height","50px")
                    li.append(img);
                    li.append(owner.local.email);
                    li.append("(owner)"+owner.firstname+" "+owner.lastname);
                    card=document.getElementById(dashBoard[i].cardId);
                    $(card).find('#collaboratorList').append(li);

              }
              else{
                appendCard(user,dashBoard[i].title,dashBoard[i].text,dashBoard[i].cardId,divId,dashBoard[i].color)
              }
                  for(j in dashBoard[i].collaborator){
                      if(dashBoard[i].collaborator[j].email!=user.local.email){
                      var li=document.createElement('li');
                      var del=document.createElement('a');
                      var img=document.createElement('img');
                      img.src=dashBoard[i].collaborator[j].image;
                      console.log("adding collaborators-->"+img.src);
                      img.class="img-responsive img-thumbnail img-circle"
                      $(img).css("max-width","50px");
                      $(img).css("max-height","50px")
                      $(del).attr('data-toggle','tooltip')
                      del.href="/removeCollaborator?cardId="+dashBoard[i].cardId+"&mail="+dashBoard[i].collaborator[j].email;
                      del.innerText="x";
                      del.title="Remove collaborator"
                      del.style.float="right";
                      li.append(img);
                      li.append(dashBoard[i].collaborator[j].name);
                      li.append(dashBoard[i].collaborator[j].email);
                      li.append(del);
                      card=document.getElementById(dashBoard[i].cardId);
                      $(card).find('#collaboratorList').append(li);
                    }
                  }

            }
            else appendCard(user,dashBoard[i].title,dashBoard[i].text,dashBoard[i].cardId,divId,dashBoard[i].color)//.then(function(){
        if(dashBoard[i].label!=null){
                var card=document.getElementById(dashBoard[i].cardId);
                console.log(card);
                var p=document.createElement('p');
                p.innerHTML+=dashBoard[i].label;
                labelElem=$(card).find('.card').find('.label');
                labelElem.append(p);
                labelElem.style="display:block";
                // labelElem.innerHTML+=dashBoard[i].label
              }
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
            if(dashBoard[i].url.length>0)
              {
                var urlList = document.createElement("ul");
                var elem=document.getElementById(dashBoard[i].cardId)
                $(elem).find('.card-content').append(urlList);

                // $(elem).closest('.card-content').css("height","400px");
                for(j in dashBoard[i].url){
                  var urldiv=document.createElement('li');
                  urldiv.className="card";

                  var textDiv=document.createElement("div");
                  textDiv.innerText=dashBoard[i].url[j].title;


                  var link1=document.createElement("a");
                  link1.innerText="visit"
                  link1.innerHTML="<i class='material-icons'>link</i>"
                  link1.target="_blank"
                  link1.href="http://"+dashBoard[i].url[j].baseurl;
                  var link2=document.createElement("a");
                  link2.innerText="Remove"
                  link2.href="/removeURL?url="+dashBoard[i].url[j].baseurl+
                              "&cardId="+dashBoard[i].cardId
                  var img=document.createElement("img");
                  img.alt="IMG";
                  img.className="img-responsive img-thumbnail"
                  $(img).css("max-width","40px");
                  $(img).css("max-height","40px");
                  if(dashBoard[i].url[j].image!=null){
                    img.src=dashBoard[i].url[j].image;
                  }
                  urlList.append(urldiv)
                  urldiv.append(img)
                  urldiv.append(link1);
                  link1.style="FLOAT:RIGHT"
                  urldiv.append(textDiv)
                  urldiv.append(link2);
                  link2.style="FLOAT:RIGHT"


            }
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
          "<div class='cardImage'></div><div class='card-content'><div class='title cardTitle' name='title' style='background-color:"+color+"'><p>"+title+"</p></div>"+
          "<div class='cardText' style='background-color:"+color+";'><p>"+text+"</p></div></div>"+
          "<div class='label'></div>"+
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
          "<div class='dropdown'><a  data-toggle='dropdown'><i class='material-icons'>more_vert</i></a>"+
          '<ul class="dropdown-menu multi-level"><li><a data-toggle="tooltip" title="Delete" href="/moveToTrash?cardId='+cardId+'">Delete</a></li>'+
          '<li><a data-toggle="tooltip" title="Set Location" href="/addLocation?cardId='+cardId+'">Add Location</a></li>'+
          '<li class="dropdown-submenu"><a>AddLabel</a><ul class="dropdown-menu"><form method="POST" action="/addLabel?cardId='+cardId+
          '"><input type="text" placeholder="Enter Label" name="label"><button type="submit">Done</button></form></ul></li>'+
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
          "<div class='cardImage'></div><div class='card-content'><div class='title cardTitle' name='title' style='background-color:"+color+"'><p>"+title+"</p></div>"+
          "<div class='cardText' style='background-color:"+color+";'><p>"+text+"</p></div></div>"+
          "<div class='label color='black-color'></div>"+
          "<div class='card-footer'><div><div id='footerButtons'>"+
          "<a data-toggle='tooltip' title='Set Reminder' class='popoverReminder' id='load'><i class='material-icons'>alarm</i></a>"+
          '<a data-toggle="tooltip" title="send to archive" href="/moveToArchive?cardId='+cardId+'"><i class="material-icons" >archive</i></a>&nbsp'+
          '<div data-toggle="tooltip" title="Add collaborator" class="dropdown"><a class="dropdown-toggle" id="collaboratorDropdown" data-toggle="dropdown"><i class="material-icons">person_add</i></a>'+
          '<div class="dropdown-menu"><ul style="width: 350px !important;" id="collaboratorList">'+
          '</ul><form method="POST" action="/addPerson?cardId='+cardId+'"><input type="text" placeholder="Enter email id.." name="personEmail"><br><button type="submit" class="btn btn-primary">Add</button></form></div></div>&nbsp'+
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
          '<ul class="dropdown-menu"><li><a href="/removeMyself?cardId='+cardId+'">Remove myself</a></li>'+
          '<li><a href="/addLabel?cardId="'+cardId+'">Add Label</a></li>'
          '</ul></div>'+
          "</div></div><div>"
}
