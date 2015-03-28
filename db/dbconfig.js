var connectionInfo = {
  host: 'localhost',
  user: 'jukebot',
  password: 'Tun3z',
  database: 'jukebot'
};

if (process.env.VCAP_SERVICES) {
  var services = JSON.parse(process.env.VCAP_SERVICES);
  var mysqlConfig = services["p-mysql"];
  if (mysqlConfig) {
    var node = mysqlConfig[0];
    connectionInfo = {
        host: node.credentials.hostname,
        port: node.credentials.port,
        user: node.credentials.username,
        password: node.credentials.password,
        database: node.credentials.name
    };
  }
}

var knex = require('knex')({
  client: 'mysql',
  connection: connectionInfo
});

exports.knex = knex;
exports.bookshelf = require('bookshelf')(knex);
