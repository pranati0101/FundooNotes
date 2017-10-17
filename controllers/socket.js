var scheduleReminder = require('./scheduleReminder')
module.exports = function(app, io, userMethods, cardMethods, schedule, notifier) {
  var trashList=[];
  var archived=[];
  var pinned=[];
  var dashBoard=[];
//when any client is connected to server
  io.on('connect', function(socket) {
    console.log("connected to socket");
    trashList=[];
    archived=[];
    pinned=[];
    dashBoard=[];
    //getting userInfo
    socket.on('getUserInfo',function(userId){
      userMethods.getUserInfo(userId,function(err,response){
        if(err) console.error();
        else socket.emit('setUserInfo',response);
      })
    })
//event for scheduling existing remiinders and showing notes
    socket.on('reminder', function(userId) {
// console.log("in reminder event, getting cards---",userId);
      cardMethods.getCards(userId, function(err, card) {
        if (err) console.error();
        else {
          console.log("socket getting cards");
// chking each card for reminder
          for (i in card) {
//if present in trash
            if(card[i].trash){
// if it is present in trash for more than or equal to 7 days
              var trashDate=addDays(card[i].trash,7);
              var today=new Date();
              if(trashDate.getTime()==today.getTime()){
                cardMethods.deleteCard(card[i].cardId);
                card[i]=null;
                continue;
              }
              trashList.push(card[i]);
              continue;
            }
//if card is pinned store it in pinned array
            if(card[i].pinned){
              pinned.push(card[i])
            }
  //if card is archived store it in archived array
            else if(card[i].archived){
              archived.push(card[i])
            }
            else{
              dashBoard.push(card[i])
            }
  //check for reminders
            if (card[i].reminder.date > 0) {
              var data={
                date: card[i].reminder.date,
                month: card[i].reminder.month,
                year: card[i].reminder.year,
                hours: card[i].reminder.hours,
                minutes: card[i].reminder.minutes,
                seconds: card[i].reminder.seconds,
                title: card[i].title,
                cardId: card[i].cardId
                  }
//// scheduling Reminders
              scheduleReminder.setReminder(schedule,notifier,cardMethods,data,
                function(err,res){
                  if(err) console.error();
                  else console.log("reminder scheduled!!");
              })
            }
          }

        }
        // //sending stored cards to client side
        // console.log(dashBoard,archived,pinned,trashList);
                  socket.emit('showCards', dashBoard,archived,pinned,trashList);
      })

    })

  });
}
function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
