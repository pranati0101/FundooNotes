//declaring modules
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var passport=require('passport');
var session=require('express-session')
var morgan=require('morgan')
// var http = require('http').Server(app);
// var io = require('socket.io').listen(http);
var jwt = require('jsonwebtoken');
// var redis=require('redis');
// var redisClient=redis.createClient();
app.use(express.static('./app'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
// url = 'mongodb://localhost/notes';
var authModel=require('./models/authModel')
var User=require('./models/users');
// var Message=require('./models/msgmodel');
app.set('view engine', 'pug');
app.set('views','./app/views');
app.use(session({
  secret:"something",
  resave:true,
  saveUninitialized:true
}));
app.use(morgan('dev'))
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
require('./config/passport')(passport);
// require('./index.js')(app,passport);
require('./controllers/controllerHome.js')(app,passport);
require('./controllers/loginController.js')(app,passport);
require('./controllers/signUp.js')(app,passport);
//listening at port 8001
app.listen(4000, function() {
  console.log("server is running on 4000");
});
/*exporting app*/
// module.exports=app;
