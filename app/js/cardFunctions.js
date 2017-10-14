module.exports=function(){
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

  function pinned(){

  }
  //sending card to archive
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
}
