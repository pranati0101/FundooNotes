/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
var User=require('../../users/Models/userModel.js')
/**
 * Schema definitions.
 */

var cardSchema = mongoose.Schema({
cardId:{
  type:String
},
userId:{
  type:String,
  required:true
},
title:{
  type:String,
  required:true
},
text:{
  type:String,
},
label:{
  type:String,
  default:null
},
image:{
  type:String,
  default:null
  },
  url:{
    type:[{}],
    default:null
  },
color:{
  type:String,
  default:"white"
},
pinned:{
  type:Boolean,
  default:false
},
archived:{
  type:Boolean,
  default:false
},
trash:{
  type:Date,
  default:null
},
createdOn:{
  type:Date,
  default:Date.now()
},
lastModified:{
  type:Date,
  default:null
},
reminder:{
  date:{
    type:Number,
    default:-1
  },
  month:{
    type:Number,
    default:-1
  },
  year:{
    type:Number,
    default:-1
  },
   hours:{
    type:Number,
    default:-1
  },
  minutes:{
    type:Number,
    default:-1
  },
  seconds:{
    type:Number,
    default:-1
  },
  status:{
    type:Boolean,
    default:false
  }
},
collaborator:{
  type:[{}],
  default:null
}
});
/**
 *Method definitions
 */
/**
 * [description]
 * @param  {Object}   data     [contains data to be inserted in note]
 * @param  {[type]}   id       [id of user to which note belongs]
 * @param  {Function} callback [callback function]
 * @return {[object]}            [newly created note]
 */
cardSchema.statics.createCard = function(data, id, callback) {
  // create the card
  console.log("creating record");
  console.log(data, id);
  var newCard = new this();
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
/**
 * changes color of the note
 * @param  {string}   id       [unique id of the note stored in db]
 * @param  {string}   color    [color to be changed]
 * @param  {Function} callback [callback function]
 * @return {string}           to chk whether data is proprly inserted or not
 */
cardSchema.statics.changeColor=function(id,color,callback){
  console.log("db methods",color);
  this.findOneAndUpdate({cardId:id},{$set:{
    color:color
  }},function(err,res){
    if(err) callback(err,null)
    else {
      callback(null,'done')
    }
  })
}
/**
 * insert mail in the collaborator field of the particular note
 * @param  {string}   id       [unique id of the note stored in db]
 * @param  {[type]}   values     [information of the person with which note is to be shared]
 * @param  {Function} callback [callback function]
 * @return {string}            [to chk whether data is proprly inserted or not]
 */
cardSchema.statics.addPerson = function(id, values, callback) {
  this.findOne({
    cardId: id
  }, function(err, res) {
    if (err) console.log(err);
    res.collaborator.push(values);
    res.save(function(err) {
    callback(null,'done');
    })
  })
}
//add url
/**
 * add url in the url array of card schema
 * @param  {string}   id       [unique id of the note stored in db]
 * @param  {object}   url      [url meta datas to be stored in the card]
 * @param  {Function} callback [callback function]
 * @return {string}            [to chk whether data is proprly inserted or not]
 */
cardSchema.statics.addURL=function(id,url,callback){
  this.findOne({cardId:id},function(err,res){
    if(err) console.log(err);
    else {
      var status=false;
      for(i in res.url){
        if(res.url[i].baseurl==url.baseurl){
          status=true;
          break;
        }
      }
      if(!status){
        res.url.push(url);
        res.save(function(err){
          if(err) callback(err,null);
          else callback(null,'done');
      })
      }
      else callback(null,'done')
    }
  })
}
/**
 * removes mail from the collaborator field of the particular note
 * @param  {string}   id       [unique id of the note stored in db]
 * @param  {[type]}   mail     [mail id  which is to be removed from note]
 * @param  {Function} callback [callback function]
 * @return {string}            [to chk whether data is proprly inserted or not]
 */
//remove user from collaborator
cardSchema.statics.removeCollaborator=function(id,mail,callback){
  this.findOne({cardId:id},function(err,res){
    if(err) console.log(err);
    else {
      console.log("found card",res);
      res.collaborator.splice(res.collaborator.indexOf(mail),1);
      console.log(res.collaborator);
      res.save(function(err){
        if(err) callback(err,null);
        else callback(null,'done');
      })
    }
  })
}
/**
 * removes mail from the collaborator field of the particular note
 * @param  {string}   id       [unique id of the note stored in db]
 * @param  {[type]}   url     [baseurl   which is to be removed from note]
 * @param  {Function} callback [callback function]
 * @return {string}            [to chk whether data is proprly removed or not]
 */
//remove user from collaborator
cardSchema.statics.removeURL=function(id,url,callback){
  this.findOne({cardId:id},function(err,res){
    if(err) console.log(err);
    else {
      // console.log("found card",res);
      res.url.splice(res.collaborator.indexOf(url),1);
      console.log(res.url);
      res.save(function(err){
        if(err) callback(err,null);
        else callback(null,'done');
      })
    }
  })
}
/**
 * returns particular note by searching using _id
 * @param  {object} id [mongoose id of the note]
 * @return {object}    [note with particular id]
 */
//search card by _id
cardSchema.statics.getCardById = function(id) {
return new Promise(function(resolve,reject){
  this.findById(id, function(err, card) {
    if(err) reject(err);
    else resolve(card);
  })
})
};
/**
 * gets reminderStatus i.e. whether reminder is already set on that note or not
 * @param  {string}   id       [unique id of the note stored in db]
 * @param  {Function} callback [callback function to return the status]
 * @return {boolean}            []
 */
//get reminder status
cardSchema.statics.getReminderStatus = function(id, callback) {
  this.findOne({cardId:id}, function(err, card) {
    if(err)
      callback(err,null)
      else if(!card)
      callback(null,null)
    else
      callback(null,card.reminder.status)
  })
};
/**
 * set reminder date and time in the note
 * @param  {object}   data     [contains day,month,year and time on which reminder is to be set]
 * @param  {string}   id       [unique id of the note stored in db]
 * @param  {Function} callback [callback function to return note on completeion]
 * @return {Object}            [modified note]
 */
//set reminder
cardSchema.statics.setReminder = function(data,id,callback) {
  this.findOneAndUpdate({'cardId':id},{$set:
  {
    'reminder.date':data.date,
    'reminder.month':data.month,
    'reminder.year':data.year,
    'reminder.hours':data.hours,
    'reminder.minutes':data.minutes,
    'reminder.seconds':data.seconds,
    'reminder.status':true
  }},function(err,card){
    if(err) callback(err,false);
    else{
      callback(null,card);
    }
  })
}
/**
 * retrieve cards from db using the userid and email id of the user
 * @param  {[type]}   id        [unique id of the user stored in db]
 * @param  {[type]}   userEmail [email id of the user stored in db]
 * @param  {Function} callback  [callback function to return notes retrieved from db]
 * @return {[object]}             [notes with desired userid and email id in the collaborator field]
 */
//get all cards of particular user from db
cardSchema.statics.getCards = function(id,userEmail,callback) {
  this.find({$or:[
    {userId:id},
    {collaborator:{$elemMatch:{
      email:userEmail
    }
    }}]
},function(err,info){
    if(err) callback(err,null);
    else{
      callback(null,info)
    }
  })
}
/**
 * deletes note from db
 * @param  {string}   id       [unique id of the note stored in db]
 * @param  {Function} callback [callback function]
 * @return {object}            [deleted note]
 */
//delete a card
cardSchema.statics.deleteCard=function(id,callback){
  this.findOneAndRemove({cardId:id},function(err,res){
    if(err) console.log(err);//(err,null);
    callback(err,res)
  })
}
/**
 * updates content of a note with specified id
 * @param  {object}   data     [contents to be updated in the card]
 * @param  {string}   id       [unique id of the note stored in db]
 * @param  {Function} callback [callback function to return status whether the function is executed properly]
 * @return {string}            [error or status]
 */
//updates a card
cardSchema.statics.updateCard=function(data,id,callback){
  this.findOneAndUpdate({cardId:id},{$set:{
    title:data.title,
    text:data.text
  }},function(err,res){
    if(err) callback(err,null);
    else callback(null,res)
  })
}
/**
 * moves the note to trash by setting the trash field of note
 * @param  {[type]}   cardId   [unique id of the note stored in db]
 * @param  {Function} callback [callback function to return status whether the function is executed properly]
 * @return {string}            [error or status]
 */
//move to trash
cardSchema.statics.moveToTrash=function(cardId,callback){
  this.findOneAndUpdate({cardId:cardId},{$set:
    {
    trash: Date.now()
  }},function(err,info){
    if(err) callback(err,null)
    else callback(null,info)
  })
}
/**
 * restore the note from trash by setting the trash field of note as null
 * @param  {[type]}   cardId   [unique id of the note stored in db]
 * @param  {Function} callback [callback function to return status whether the function is executed properly]
 * @return {string}            [error or status]
 */
//restore card
cardSchema.statics.restoreCard=function(cardId,callback){
  this.findOneAndUpdate({cardId:cardId},{$set:
    {
    trash: null
  }},function(err,info){
    if(err) callback(err,null)
    else callback(null,info)
  })
}
/**
 * moves the note to archive by setting the archived field of note
 * @param  {[type]}   cardId   [unique id of the note stored in db]
 * @param  {Function} callback [callback function to return status whether the function is executed properly]
 * @return {string}            [error or status]
 */
//move to archived
cardSchema.statics.moveToArchive=function(cardId,callback){
  this.findOneAndUpdate({cardId:cardId},{$set:
    {
    archived: true
  }},function(err,info){
    if(err) callback(err,null)
    else callback(null,info)
  })
}
/**
 * moves the note from archive by setting the archived field of note as null
 * @param  {[type]}   cardId   [unique id of the note stored in db]
 * @param  {Function} callback [callback function to return status whether the function is executed properly]
 * @return {string}            [error or status]
 */
//unarchive
cardSchema.statics.unarchive=function(cardId,callback){
  this.findOneAndUpdate({cardId:cardId},{$set:
    {
    archived: false
  }},function(err,info){
    if(err) callback(err,null)
    else callback(null,info)
  })
}
/**
 * pins or unpins the note by inversing the pinned field of note
 * @param  {[type]}   cardId   [unique id of the note stored in db]
 * @param  {Function} callback [callback function to return status whether the function is executed properly]
 * @return {string}            [error or status]
 */
cardSchema.statics.pinned=function(cardId,callback){
  this.findOne({cardId:cardId},function(err,info){
    if(err) console.log(err);
    var pin=!(info.pinned)
    info.pinned=pin;
    // info.findOneAndUpdate({cardId:cardId},{$set:{
    //   pinned:pin,
    //   archived:false
    // }},
    info.save(function(err,res){
      console.log(err,res);
      if(err) callback(err,null)
      else if(!res) callback(null,null)
      else {
        callback(null,'done')
      }
    })
  })
}
/**
 * insert image in note by inserting the source of the image
 * @param  {string} cardId [unique id of the note stored in db]
 * @param  {string} fname  [name of file to be inserted]
 */
//adding image
cardSchema.statics.addImage=function(cardId,fname){
  // console.log("in db-------",cardId,fname);
  this.findOneAndUpdate({cardId:cardId},{$set:
    {
      image:fname
    }
  },function(err,card){
    console.log(err,card);
  })
}
/**
 * add label
 */
cardSchema.statics.addLabel=function(cardId,label,callback){
  this.findOneAndUpdate({cardId:cardId},{$set:{
    label:label
  }},{new:true},function(err,res){
    console.log(res);
    callback(err,res)
  })
}
// create the model for users and expose it to our app
module.exports = mongoose.model('Card', cardSchema,'cards');
