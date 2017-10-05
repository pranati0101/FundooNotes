/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
var Card=require('./cards').Card
/**
 *Method definitions
 */
exports.createCard = function(data,id,done) {
  // create the card
  console.log("creating record");
  console.log(data,id);
  var newCard = new Card();
  // set the card details
      newCard.cardId=newCard._id;
      newCard.userId=id;
      newCard.title = data.title;
      newCard.text = data.text;
      // newCard.reminder.date=data.reminder.date;
      // newCard.reminder.month=data.reminder.month;
      // newCard.reminder.year=data.reminder.year;
      // newCard.reminder.hours=data.reminder.hours;
      // newCard.reminder.minutes=data.reminder.minutes;
      // newCard.reminder.seconds=data.reminder.seconds;
      // save the user
      newCard.save(function(err) {
        if (err)
          console.log(err);
        else{
          console.log("saving to db");
          done(null, newCard);
        }
      });
}

//search card by _id
exports.getCardById = function(id, done) {
  Card.findById(id, function(err, card) {
    done(err, card);
  })
};
//set reminder
exports.setReminder = function(data,id,done) {
  // console.log(data,id);
  // Card.findOneAndUpdate({'cardId':data.cardId},{$set:
  // {
  //   'reminder':data.date
  // }})
}
//get all cards of particular user from db
exports.getCards = function(id,done) {
  Card.find({userId:id},function(err,info){
    if(err) done(err,null);
    else{
      done(null,info)
    }
  })
}
