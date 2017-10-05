module.exports=function(app,io,cardMethods,schedule,notifier){
  io.on('connect',function(socket){
    socket.on('reminder',function(cards){
      console.log("in socket",cards);
      for(i in cards){
      var job = new schedule.Job(function(){
        // cardMethods.getCardById()
        notifier.notify({
          title: cards[0].title,
          message: cards[0].text,
          wait: true // Wait with callback, until user action is taken against notification
        }, function (err, response) {
          // Response is response from notification
        });
      });
      job.runOnDate(new Date(2017,9,5,16,08,0));
      console.log("schedule--",job);
  }
  })
});
}
