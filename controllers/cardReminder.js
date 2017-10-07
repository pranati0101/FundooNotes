var scheduleReminder=require('./scheduleReminder')
module.exports=function(app,schedule,notifier,Card,cardMethods){
//set reminder
app.post('/setReminder',function(req,res){
  console.log(req);
  // scheduleReminder.setReminder(schedule,notifier,cardMethods,req.body,
  //   function(err,response){
  //     if(err) console.error();
  //     res.send(response)
  // })
})
//reschedule existing reminder
app.post('/resetReminder',function(req,res){
  scheduleReminder.resetReminder(schedule,notifier,cardMethods,req.body,
  function(err,response){
    if(err) console.error();
    res.send(response);
  })
})
//cancel existing reminder
app.post('/cancelReminder',function(req,res){
  scheduleReminder.cancelReminder(schedule,notifier,cardMethods,req.body,
  function(err,response){
      res.send(response)
  })
})
}
