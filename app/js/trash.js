$(document).ready(function(){
  trashList=document.getElementById('trash').value;
  console.log(trashList);
  console.log(typeof(trashList));
  trashList=JSON.parse(trashList)
  console.log(typeof(trashList));
  if(trashList.length>0){
    for(i=0;i<trashList.length;i++){
      appendCard(trashList[i].title,trashList[i].text,trashList[i].cardId)
    }
  }
})

//add card to main panel
function appendCard(title,text,cardId){
  document.getElementById('cardList').innerHTML+="<div class='col-md-4' id='"+cardId+"'><div class='card'>"+
          "<div class='card-content'><h4 class='title'><p>"+title+"</h4><span class='text-success'>"+
          "<p>"+text+"</span>"+"</div><div class='card-footer' id='footerButtons'>"+
          "<div class='dropdown'><a class='dropdown-toggle' data-toggle='dropdown'><i class='material-icons'>more_vert</i></a>"+
          '<ul class="dropdown-menu"><li><a onclick="deleteCard(\''+cardId+'\')"> Delete Forever</a></li>'+
          '<li><a onclick="restoreCard(\''+cardId+'\')"> Restore</a></li>'
          "</div></div><div>"
}
// "moveToTrash(\'' + cardId + '\')"

function deleteCard(cardId){
  $.ajax({
    url:'/deleteCard?cardId='+cardId,
    type:'GET'
  }).done(function(res){
    console.log(res);
    if(res){
      elem=document.getElementById(cardId);
      elem.remove();
    }
  })
}

function restoreCard(cardId){
  $.ajax({
    url:'/restoreCard?cardId='+cardId,
    type:'GET'
  }).done(function(res){
    console.log(res);
    if(res){
      elem=document.getElementById(cardId);
      elem.remove();
    }
  })
}
