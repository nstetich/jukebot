var db = require('../db/dbconfig');
var knex = db.knex;
var _ = require('lodash');

console.log("Checking for table 'users'");
knex.schema.hasTable('users').then(function (exists) {
  if (!exists) {
    console.log("Creating table 'users'.")
    return knex.schema.createTable('users', function (table) {
      table.integer('github_id').primary();
      table.string('github_username');
      table.string('avatar_url');
    });
    return create;
  }
}).catch(function (err) {
  console.log("Error creating table: " + JSON.stringify(err));
});

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
      console.log("Error retrieving/persisting user.");
    });
  return promise;
};
