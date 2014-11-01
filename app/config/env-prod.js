/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

module.exports = {
  server: {
    host: '127.0.0.1',
    port: 4000,
    url: function (secure) {
      secure = secure || false;
      return ['http', (secure ? 's' : ''), '://', this.host, (this.port != 80 ? ':' + this.port : '')].join('');
    }
  },

  application: {
    salt: 'generate-a-salt'
  },

  database: {
    main: {
      client: 'mysql',
      debug: false,
      connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'akomolafe',
        database: 'elibrary',
        charset: 'utf8'
      },
      migrations: {
        tableName: 'migrations',
        directory: __dirname + '/../data/migrations'
      }
    }
  }
};
