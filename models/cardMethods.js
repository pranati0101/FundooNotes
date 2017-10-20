/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
var Card=require('./cards').Card
/**
 *Method definitions
 */
exports.createCard = function(data, id, callback) {
  // create the card
  console.log("creating record");
  console.log(data, id);
  var newCard = new Card();
  // set the card details
  newCard.cardId = newCard._id;
  newCard.userId = id;
  newCard.title = data.title;
  newCard.text = data.text;
  // save the user
  newCard.save(function(err) {
    if (err)
      console.log(err);
    else {
      console.log("saving to db");
      callback(null, newCard);
    }
  });
}
//exports change color
exports.changeColor=function(id,color,callback){
  Card.findOneAndUpdate({cardId:id},{$set:{
    color:color
  }},function(err,res){
    if(err) callback(err,null)
    else {
      callback(null,'done')
    }
  })
}
//add collaborator
exports.addPerson=function(id,mail,callback){
  Card.findOneAndUpdate({cardId:id},{$set:{
    collaborator:mail
  }},function(err,res){
    if(err) console.log(err);
    else {
      callback(null,'done')
    }
  })
}
//search card by _id
exports.getCardById = function(id) {
return new Promise(function(resolve,reject){
  Card.findById(id, function(err, card) {
    if(err) reject(err);
    else resolve(card);
  })
})
};
//get reminder status
exports.getReminderStatus = function(id, callback) {
  Card.findOne({cardId:id}, function(err, card) {
    if(err)
      callback(err,null)
      else if(!card)
      callback(null,null)
    else
      callback(null,card.reminder.status)
  })
};
//set reminder
exports.setReminder = function(data,id,callback) {
  Card.findOneAndUpdate({'cardId':id},{$set:
  {
    'reminder.date':data.date,
    'reminder.month':data.month,
    'reminder.year':data.year,
    'reminder.hours':data.hours,
    'reminder.minutes':data.minutes,
    'reminder.seconds':data.seconds,
    'reminder.status':true
  }},function(err,card){
    console.log("cardMethod setReminder-",err);
    if(err) callback(err,false);
    else{
      callback(null,card);
    }
  })
}
//get all cards of particular user from db
exports.getCards = function(id,userEmail,callback) {
  Card.find({$or:[
    {userId:id},
    {collaborator:userEmail}]
},function(err,info){
    if(err) callback(err,null);
    else{
      callback(null,info)
    }
  })
}
//delete a card
exports.deleteCard=function(id,callback){
  Card.findOneAndRemove({cardId:id},function(err,res){
    if(err) callback(err,null);
    else callback(null)
    console.log(res);
  })
}
//delete a card
exports.updateCard=function(data,id,callback){
  Card.findOneAndUpdate({cardId:id},{$set:{
    title:data.title,
    text:data.text
  }},function(err,res){
    if(err) callback(err,null);
    else callback(null)
  })
}
//move to trash
exports.moveToTrash=function(cardId,callback){
  Card.findOneAndUpdate({cardId:cardId},{$set:
    {
    trash: Date.now()
  }},function(err,info){
    if(err) callback(err,null)
    else callback(null,info)
  })
}
//restore card
exports.restoreCard=function(cardId,callback){
  Card.findOneAndUpdate({cardId:cardId},{$set:
    {
    trash: null
  }},function(err,info){
    if(err) callback(err,null)
    else callback(null,info)
  })
}
//move to archived
exports.moveToArchive=function(cardId,callback){
  Card.findOneAndUpdate({cardId:cardId},{$set:
    {
    archived: true
  }},function(err,info){
    if(err) callback(err,null)
    else callback(null,info)
  })
}
//unarchive
exports.unarchive=function(cardId,callback){
  Card.findOneAndUpdate({cardId:cardId},{$set:
    {
    archived: false
  }},function(err,info){
    if(err) callback(err,null)
    else callback(null,info)
  })
}
exports.pinned=function(cardId,callback){
  Card.findOne({cardId:cardId},function(err,info){
    if(err) console.log(err);
    var pin=!(info.pinned)
    Card.findOneAndUpdate({cardId:cardId},{$set:{
      pinned:pin,
      archived:false
    }},function(err,res){
      if(err) callback(err,null)
      else if(!res) callback(null,null)
      else {
        callback(null,'done')
      }
    })
  })
}
//adding image
// exports.addImage=function(fs,cardId,imgSrc,callback){
//   Card.findOne({cardId:cardId},function(err,card){
//     card.image.data=fs.readFileSync(imgSrc);
//     card.image.contentType = 'image/png';
//   })
// }

exports.addImage=function(cardId,fname){
  Card.findOneAndUpdate({cardId:cardId},{$set:
    {
      image:fname
    }
  },function(err,card){
    console.log(err);
  })
}
