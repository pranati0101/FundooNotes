$(document).ready(function(){
  archiveList=document.getElementById('archived').value;
  archiveList=JSON.parse(archiveList)
  console.log(typeof(archiveList));
  if(archiveList.length>0){
    for(i=0;i<archiveList.length;i++){
      appendCard(archiveList[i].title,archiveList[i].text,archiveList[i].cardId)
    }
  }
})

//add card to main panel
function appendCard(title,text,cardId){

  document.getElementById('cardList').innerHTML+="<div class='col-md-4' id='"+cardId+"'><div class='card'>"+
         '<a href="pin?cardId='+cardId +'"><img src="../icons/pin.svg" style="float:right" alt="pin" id="pinIcon"/></a>'+
          "<div class='card-content'><h4 class='title'><p contentEditable='true'>"+title+"</h4><span class='text-success'>"+
          "<p contentEditable='true'>"+text+"</span>"+"</div><div class='card-footer'><div><i class='material-icons'>access_time</i>"+
          "Last modified on"+"<div><div id='footerButtons'>"+
          "<div class='dropdown'><a id='showPanel'class='dropdown-toggle' data-toggle='dropdown' data-for='"+cardId
          +"'><i class='material-icons'>alarm</i></a><div class='dropdown-menu'><input type='text'"+
          "id='datepicker'><br><input type='text'id='timepicker'></div></div>"+
          '<a><i class="material-icons" onclick="unarchive(\'' + cardId + '\')">unarchive</i></a>&nbsp'+
          '<a><i class="material-icons" onclick="addCollaborator(\'' + cardId + '\')">person_add</i></a>&nbsp'+
          '<a><i class="material-icons" onclick="addColor(\'' + cardId + '\')">color_lens</i></a>&nbsp'+
          '<a><i class="material-icons" onclick="addImage(\'' + cardId + '\')">insert_photo</i></a>&nbsp'+
          '<a><i class="material-icons" onclick="moveToTrash(\'' + cardId + '\')">delete</i></a>'+
          "</div></div><div>"
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

//sending card to dashboard
function unarchive(cardId){
  console.log("unarchiving..!!");
  $.ajax({
    url:'/unarchive?cardId='+cardId,
    type:'GET'
  }).done(function(response){
    if(response=='done'){
        elem=document.getElementById(cardId);
        elem.remove()
    }
    else alert("Error");
  })
}

function addCollaborator(){

}
function addColor(){

}
function addImage(){

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
