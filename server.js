/**
 * Module dependencies.
 */
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var passport=require('passport');
var session=require('express-session')
var morgan=require('morgan')
var flash= require('connect-flash');
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
var jwt = require('jsonwebtoken');
var schedule = require('node-schedule');
const notifier = require('node-notifier')
var fs=require('fs-extra');
var multer = require('multer');

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
var Card=require('./models/cards');
var userMethods=require('./models/userMethods')
var cardMethods=require('./models/cardMethods')

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
app.use(flash())
/**
 * passing module dependencies
 */
require('./config/passport')(passport);
// require('./index.js')(app,passport);
require('./controllers/controllerHome.js')(app,passport);
require('./controllers/loginController.js')(app,passport);
require('./controllers/signUp.js')(app,passport);
require('./controllers/createCard.js')(app,cardMethods);
require('./controllers/addPerson.js')(app,cardMethods);
require('./controllers/cardReminder.js')(app,schedule,notifier,Card,cardMethods)
require('./controllers/socket.js')(app, io, userMethods, cardMethods, schedule, notifier)
require('./controllers/Trash.js')(app,cardMethods)
require('./controllers/Archive.js')(app,cardMethods)
require('./controllers/search.js')(app,cardMethods)
// require('./controllers/socket')(app,io,cardMethods,schedule,notifier)
//listening at port PORT
http.listen(4000, function() {
  console.log("server is running on 4000");
});
/*exporting app*/
// module.exports=app;
