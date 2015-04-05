var ClientToken = require('./model/client-token');
var Client = require('./model/client');
var moment = require('moment');
var Promise = require('bluebird');

module.exports = function(server) {
  var io = require('socket.io')(server);

  io.use(function authenticate(socket, next) {
    var token = socket.handshake.query.token;
    new ClientToken({api_client_token: token}).fetch()
      .then(function (model) {
        if (moment(model.get('expires')).isAfter(moment())) {
          console.log("socket.io authenticated!");
          next();
        } else {
          return Promise.reject("Expired token");
        }
      }).catch(function (err) {
        console.log("Invalid token: " + token);
        next(new Error("Invalid token " + err));
      });
  });

  io.on('connection', function (socket) {
    socket.emit('news', {hello: 'world'});
    socket.on('my other event', function (data) {
      console.log(data);
    });
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  });
}
