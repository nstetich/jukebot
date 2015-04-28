var db = require('../db/dbconfig');

var migrationConfig = {
  directory: './db/migrations'
};
var seedConfig = {
  directory: './db/seeds'
};

function rollback() {
  return db.knex.migrate.currentVersion(migrationConfig)
  .then(function (version) {
    if (version !== 'none') {
      console.log("rolling back database version", version);
      return db.knex.migrate.rollback(migrationConfig)
      .then(function () {
        return rollback();
      });
    }
  });
}

module.exports = function (callback) {
  return rollback()
  .then(function () {
    console.log("migrating to latest");
    return db.knex.migrate.latest(migrationConfig);
  })
  .then(function () {
    console.log("running seed scripts");
    return db.knex.seed.run(seedConfig);
  });
};
