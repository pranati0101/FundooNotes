/**
 * declaring modules
 */
var amqp = require('amqp');
var mailer=require('./mailer.js')
var rabbitMqConnection = amqp.createConnection({ host: '127.0.0.1' });
var e1,q1,q2;
/**
 * for better debuging
 */
rabbitMqConnection.on('error', function(e) {
  console.log("Error from amqp: ", e);
});

/**
 * waiting for connection to become established
 */
rabbitMqConnection.on('ready', function () {
  //creating exchange
  e1 = rabbitMqConnection.exchange('mail-exchange');
  //creating queue
  q1 = rabbitMqConnection.queue('userVerificationQueue',function(q){
    q.bind(e1,'verifyUser');
    // Receive messages
    q.subscribe(function (data) {
      mailer.sendVerificationMail(data.email,data.url,function(err,resp){
        console.log(err,resp);
      })
    });
  });
  //creating queue
  q2 = rabbitMqConnection.queue('passwordResetQueue',function(q){
    q.bind(e1,'passwordReset');
    // Receive messages
    q.subscribe(function (data) {
      mailer.sendMail(data.email,data.url,function(err,resp){
        console.log(err,resp);
      })
    });
  });
});

/**
 * pushing object into queue
 */
exports.enq=function(email,url,routingKey,callback){
  e1.publish(routingKey, { url: url,email:email});
}
