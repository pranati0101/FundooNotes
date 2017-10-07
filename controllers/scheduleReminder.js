//ceating new reminders
exports.setReminder=function(schedule,notifier,cardMethods,data,callback){
  //converting in date dataType
var date=new Date(data.year,data.month,data.date,data.hours,data.minutes,
    data.seconds);
var reminderJob=new schedule.scheduleJob(data.cardId,date,function(){
    task(data.title,notifier)
  })
console.log(schedule,"job created");
//saving reminder in db
cardMethods.setReminder(data,data.cardId,function(err,res){
      if(err) callback(err,"can't save to db")
      else callback(null,"done")
    })
  }
//rescheduling reminders
exports.resetReminder=function(schedule,notifier,cardMethods,data,callback){
  var date=new Date(data.year,data.month,data.date,data.hours,data.minutes,data.seconds);
  var id=data.cardId
  console.log(schedule);
  console.log("in list",schedule.scheduledJobs.sdf)
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
function task(title,notifier){
  notifier.notify({
    title: 'Reminder',
    message:title,
    wait: true // Wait with callback, until user action is taken against notification
  });
  console.log("Reminder..!!!");
}
