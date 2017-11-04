var cardMethods = require('../Models/noteModel.js')
var userMethods = require('../../users/Models/userModel.js')
var contentScrapping = require('./contentScrapping.js')
var upload=require('./upload.js')
var scheduleReminder=require('./scheduleReminder')
var elasticsearch=require('./elasticSearch.js')
function NoteServices() {

}

/**
 * @method init() => Init this object
 **/
NoteServices.prototype.init = function() {}
/**
 * create a new note
 */
NoteServices.prototype.createCard = function(args,userId, callback) {
  cardMethods.createCard(args, userId, function(err, card) {
    if (err) callback(err, null)
    else {
      userMethods.upadteNumberOfCards(userId, 1);
      var expr = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})/igm
      var val = card.text.match(expr)
      if (val != null) {
        for (i = 0; i < val.length; i++) {
          metadata = contentScrapping(val[i]);
          metadata.then(function(meta) {
            if (meta != null) {
              cardMethods.addURL(card.cardId, meta, function(err, resp) {
                console.log(err,resp);
              })
            }
          }).catch(function(error) {
            console.log(error);
          })
        }
      }
      callback(null, 'card')
    }
  })
}
/**
 * updates exisying note
 */
NoteServices.prototype.updateCard = function(args,cardId,callback) {
  cardMethods.updateCard(args,cardId, function(err, card) {
    if (err) callback(err, null);
    else {
      var expr = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})/igm
      var val = (args.text).match(expr)
      if (val != null) {
        for (i = 0; i < val.length; i++) {
          metadata = contentScrapping(val[i]);
          metadata.then(function(meta) {
            if (meta != null) {
              cardMethods.addURL(cardId, meta, function(err, resp) {
                if (err) console.log(err);;
              })
            }
          }).catch(function(error) {
            console.log(error);
          })
        }
      }
      callback(err, "card")
    }
  })
}
/**
 * adding image in note
 */
 NoteServices.prototype.addImage=function(req,res,callback){
  upload(req,res,callback);
 }
/**
 *removing url meta data from note
 **/
NoteServices.prototype.removeURL=function(cardId,url,callback){
  cardMethods.removeURL(cardId,url,callback)
}
/**
 *deleting notee from db
 **/
NoteServices.prototype.deleteCard=function(cardId,callback){
  cardMethods.deleteCard(cardId,callback);
}
/**
 *changing color of note
 */
NoteServices.prototype.changeColor=function(cardId,color,callback){
  cardMethods.changeColor(cardId,color,callback)
}
/**
 *getting archived notes
 */
NoteServices.prototype.getArchived=function(userId,callback){
  cardMethods.getCards(userId,null,function(err,cards){
   if(err) callback(err,null)
   else{
     var archiveList=[]
     for(i=0;i<cards.length;i++){
       if(cards[i].archived){
         archiveList.push(cards[i])
       }
     }
    callback(null,archiveList)
   }
  })
}
/**
 *getting remindered notes
 */
NoteServices.prototype.getReminder=function(userId,callback){
  cardMethods.getCards(userId,null,function(err,cards){
   if(err) callback(err,null)
   else{
     var reminderList=[]
     for(i=0;i<cards.length;i++){
       if(cards[i].reminder.date>-1){
         reminderList.push(cards[i])
       }
     }
    callback(null,reminderList)
   }
  })
}
/**
 * archiving notes
 */
NoteServices.prototype.moveToArchive=function(cardId,callback){
  cardMethods.moveToArchive(cardId,callback);
}
/**
 * unarchive note
 */
NoteServices.prototype.unarchive=function(cardId,callback){
  cardMethods.unarchive(cardId,callback)
}
/**
 * pin and unpin notes
 */
NoteServices.prototype.pinned=function(cardId,callback){
  cardMethods.pinned(cardId,callback)
}
/**
 * adding collaborators to note
 */
NoteServices.prototype.addPerson = function(cardId, personEmail, callback) {
  userMethods.searchUser(personEmail, "-1", "-1", function(err, info) {
    if (info !=undefined || info!= null) {
      var values = {
        name: info.firstname + " " + info.lastname,
        email: info.local.email,
        image: info.profilePic
      }
      cardMethods.addPerson(cardId, values, callback)
    }
     else callback(err, info)
  })
}
/**
 * send any note to trash
 */
NoteServices.prototype.moveToTrash=function(cardId,callback){
  cardMethods.moveToTrash(cardId,callback)
}
/**
 * remove user from shared note
 */
 NoteServices.prototype.removeCollaborator=function(cardId,personEmail,callback){
   cardMethods.removeCollaborator(cardId,personEmail,callback)
 }
 /**
  *cards in trash are fetched and sent to front end
  */
 NoteServices.prototype.showTrash=function(userId,email,callback){
     cardMethods.getCards(userId,email,function(err,cards){
       if(err) callback(err,null);
       else{
         var trashList=[]
         for(i=0;i<cards.length;i++){
           if(cards[i].trash){
             trashList.push(cards[i])
           }
         }
         callback(err,trashList)
       }
     })
 }
 /**
  *restore card from trash to dashboard
  */
 NoteServices.prototype.restoreCard=function(cardId,callback){
   cardMethods.restoreCard(cardId,callback)
 }
 /**
  *set reminders
  */
 NoteServices.prototype.setReminder=function(data,callback){
   //to chk whether scheduler is already present
   cardMethods.getReminderStatus(data.cardId,function(err,status){
     if(status !=null){
       if(status){
         scheduleReminder.resetReminder(data)
         //saving reminder in db
         cardMethods.setReminder(data,data.cardId,callback)
         }
         else{
           scheduleReminder.setReminder(data)
           //saving reminder in db
           cardMethods.setReminder(data,data.cardId,callback)
         }
     }
     else callback(err,null)
   })
 }
 /**
  * reschedule reminder
  */
 NoteServices.prototype.resetReminder=function(data,callback){
   scheduleReminder.resetReminder(data)
   //saving reminder in db
   cardMethods.setReminder(data,data.cardId,callback);
 }
 /**
  * cancel reminder
  */
 NoteServices.prototype.cancelReminder=function(data,callback){
   scheduleReminder.cancelReminder(data)
   var value={
     date:-1,
     month:-1,
     year:-1,
     hours:-1,
     minutes:-1,
     seconds:-1
   }
   //saving reminder in db
   cardMethods.setReminder(value,data,callback)
 }
 /**
  * searching values using elastic search
  */
  NoteServices.prototype.search=function(text,userId,callback){
    var index=0;
    var data=[];
    elasticsearch.search(text,userId,function(err,results){
        if(err) callback(err,null)
        else if(results==null || results.hits==null || results.hits.total==0) {
          callback(err,null)
        }
        else{
          for(i=0;i<results.hits.total;i++){
          console.log(++index,results.hits.hits[i]._source);
          data.push(results.hits.hits[i]._source)
        }
        console.log("data-->",data);
        callback(err,data)
        }
    })
  }
/**
 * autocomplete api using elasticsearch
 */
NoteServices.prototype.autocomplete=function(term,userId,callback){
  elasticsearch.autocomplete(term,userId,"cards",function(results){
    callback(results)
  })
}
/**
 * get user information from user id
 */
NoteServices.prototype.getUserInfo=function(userId,callback){
  userId=Object(userId);
  userMethods.searchById(userId,callback)
}
/**
 * add Label
 */
NoteServices.prototype.addLabel=function(cardId,label,callback){
    cardMethods.addLabel(cardId,label,function(err,resp){
    if(err) callback(err,null)
    else callback(err,resp)
  })
}
 /**
  * exporting module
  */
module.exports = {
    NoteServices: NoteServices
};
