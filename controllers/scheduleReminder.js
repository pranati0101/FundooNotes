//ceating new reminders
exports.setReminder=function(schedule,notifier,cardMethods,data,callback){
  //converting in date dataType
var date=new Date(2017,9,16,12,19,00);
    console.log("date: ",date);
var reminderJob=new schedule.scheduleJob(data.cardId,date,function(){
  console.log("reminder b4");
    task(data.cardId,data.title,notifier,cardMethods)
  })
console.log("job created");
//saving reminder in db
cardMethods.setReminder(data,data.cardId,function(err,res){
      if(err) callback(err,"can't save to db")
      else callback(null,"done")
    })
  }
//rescheduling reminders
exports.resetReminder=function(schedule,notifier,cardMethods,data,callback){
  var date=new Date((parseInt(data.year),(data.month),(data.date),(data.hours),(data.minutes),(data.seconds)));
    // var date=new Date(2017,9,16,12,37,0)
  console.log("date: ",date);
  console.log(typeof(parseInt(data.year)));
  schedule.rescheduleJob(data.cardId,date);
  console.log("rescheduled");
  //saving reminder in db
  cardMethods.setReminder(data,data.cardId,function(err,res){
        if(err) callback(err);
        else callback(null,"done")
      })
    }
 //Cancel reminders
 exports.cancelReminder=function(schedule,notifier,cardMethods,data,callback){
   schedule.cancelJob(data.cardId);
   console.log("cancelled");
   //saving reminder in db
   var value={
     date:-1,
     month:-1,
     year:-1,
     hours:-1,
     minutes:-1,
     seconds:-1
   }
   cardMethods.setReminder(value,data.cardId,function(err,res){
         if(err) callback(err);
         else callback(null,"done")
       })
  }
//task to be executed
function task(cardId,title,notifier,cardMethods){
  console.log("reminder!!");
  notifier.notify({
    title: 'Reminder',
    message:title,
    wait: true // Wait with callback, until user action is taken against notification
  }).done(function(){
        console.log("Reminder..!!!");
        var value={
          date:-1,
          month:-1,
          year:-1,
          hours:-1,
          minutes:-1,
          seconds:-1
        }
        cardMethods.setReminder(value,cardId,function(err,res){
              if(err) console.log(err);
              else console.log("done");
            })
  })
}
