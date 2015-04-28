var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');

// added code
//var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/ExpressServer');
// end of added code 

var routes = require('./routes/index'); // commented for angular
var api = require('./routes/api');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views')); // commented for angular
app.set('view engine', 'jade'); // commented for angular

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // commented for angular

// For handling file uploads, added to specific route now
/*
app.use(multer(
{
    dest: './uploads/',

    onFileUploadComplete: function (file, req, res) {
      console.log(file.fieldname + ' uploaded to  ' + file.path);
      console.log("teacher: " + req.body.teacher);
      console.log("name: " + req.body.fileName);
      console.log("dept: " + req.body.dept);
    }


}));
*/



// For allowing CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
  next();
});

app.use('/', routes); //commented for angular
//app.use('/users', users);
app.use('/api', api);
//app.use('/', express.static(path.join(__dirname,'../client'))); // use for openbook app

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
