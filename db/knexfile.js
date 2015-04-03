var _ = require('lodash');

configs = {
  development: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'jukebot',
      password: 'Tun3z',
      database: 'jukebot'
    }
  },

  staging: {
    client: 'mysql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mysql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};

// Overwrite config properties with properties loaded from
// cloud foundry environment variables

var cloudFoundryConfig = {};
if (process.env.VCAP_SERVICES) {
  var services = JSON.parse(process.env.VCAP_SERVICES);
  cloudFoundryConfig = _(services["p-mysql"]).map(function (node) {
    return _.pick({
      host: node.credentials.hostname,
      port: node.credentials.port,
      user: node.credentials.username,
      password: node.credentials.password,
      database: node.credentials.name
    }, _.identity);
  }).first();
}

module.exports = _.mapValues(configs, function (config) {
  connection = _.extend(config.connection, cloudFoundryConfig);
  return _.extend(config, {connection: connection});
});
