/**
 * Module dependencies.
 */
var express = require("express");
// var validator = require('express-validator');
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var passport=require('passport');
var session=require('express-session')
var morgan=require('morgan')
var flash= require('connect-flash');
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
var db = require('./config/database')
/**
 * passing module dependencies
 */
require('./api/users/Services/passport.js')(passport);
require('./api/notes/Services/socket.js')(app,io)
/**
 *connecting to mongoose db using configuration
 */
mongoose.connect(db.url, {
  useMongoClient: true,
}).catch(function(e) {
  if (e) console.log(e);
});

app.use(express.static('./app'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
// app.use(validator());
/**
 * setting view engine
 */
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
app.use(flash());

var noteRoutes = require('./api/notes/Routes/noteRoute')(app,express); //importing route
app.use('/',noteRoutes);//register the routes

var userRoutes = require('./api/users/Routes/userRoute.js')(app,express,passport); //importing route
app.use('/', userRoutes);//register the route


//listening at port PORT
http.listen(4000, function() {
  console.log("server is running on 4000");
});

module.exports=app
