var db = require('../db/dbconfig');
var knex = db.knex;
var _ = require('lodash');

exports.authenticateUser = function(accessToken, accessTokenSecret, githubUserData, promise) {
  var authData = {
    accessToken: accessToken,
    accessTokenSecret: accessTokenSecret,
    github_username: githubUserData.login,
    github_id: githubUserData.id,
    avatar_url: githubUserData.avatar_url
  };
  knex('users')
    .where({github_id: githubUserData.id})
    .then(function(result) {
      if (result.length === 0) {
        return knex('users').insert(_.pick(authData,
          'github_username', 'github_id', 'avatar_url'))
      }
    }).then(function (result) {
      promise.fulfill(authData);
    }).catch(function (err) {
      var msg = "Error retrieving or persisting user. " + JSON.stringify(err);
      console.log(msg);
      promise.fulfill(msg);
    });
  return promise;
};
