var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var fs = require('fs');
var everyauth = require('everyauth');

var routes = require('./routes/index');
var api = require('./routes/api');

var user = require('./model/user');

var credentials = JSON.parse(fs.readFileSync('./github.credentials.encrypted', 'UTF-8'));
everyauth.github
  .appId(credentials.appId)
  .appSecret(credentials.appSecret)
  .scope('user')
  .findOrCreateUser(function(session, accessToken, accessTokenSecret, githubUserData) {
    var promise = this.Promise();
    user.authenticateUser(accessToken, accessTokenSecret, githubUserData, promise);
    return promise;
  })
  .handleAuthCallbackError( function (req, res) {
    console.log('auth callback error');
  })
  .redirectPath('/');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session / authentication
app.use(session({
  secret: "appfogV2",
  saveUninitialized: true,
  resave: false,
  // name: "hamburglar",
  cookie: {maxAge: 60*60*1000}
}));
app.use(everyauth.middleware());

app.use('/', routes);
app.use('/api', api);

// catch 404 and forward to error handler
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
