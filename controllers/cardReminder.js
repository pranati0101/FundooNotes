module.exports=function(app,schedule,notifier,Card,cardMethods){

app.post('/setReminder',function(req,res){
  cardMethods.setReminder(req.body,req.user._id,function(err,res){
    if(err) console.error();
  })
})
}
