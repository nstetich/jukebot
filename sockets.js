var ClientToken = require('./model/client-token');
var Client = require('./model/client');
var moment = require('moment');
var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));
var util = require('util');
var events = require('./eventbus');

module.exports = function(io) {
  var socketIds = {};
  var clients = {};

  io.use(function authenticate(socket, next) {
    var token = socket.handshake.query.token;
    new ClientToken({api_client_token: token}).fetch({withRelated: ['client']})
      .then(function (model) {
        if (moment(model.get('expires')).isAfter(moment())) {
          console.log("socket.io authenticated!");
          var client_id = model.related('client').get('api_client_id');
          socketIds[client_id] = socket.id;
          clients[socket.id] = model.related('client');
          console.log("socket ids: ", socketIds);
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
    var client = clients[socket.id];
    var slackUrl = client.get('slack_callback_url');
    console.log("slack url", slackUrl);

    events.on('command:nextTrack', function (data) {
      if (data.client_id === client.get('id')) {
        socket.emit('command:next', {});
      }
    });
    socket.on('event:trackChange', function (data) {
      console.log(data);
      request.postAsync({
        url: slackUrl,
        json: {
          text: ":musical_note: Now playing: \"" + data.title + "\" by " + data.artist
        }
      }).catch(function (err) {
        console.log(JSON.stringify(err));
      });
    });
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  });

  return io;
};
