/**
 * @author Laju Morrison <morrelinko@gmail.com>
 */

module.exports = {
  server: {
    host: '127.0.0.1',
    port: 4000,
    url: function(secure) {
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
      debug: true,
      connection: {
        host: '127.0.0.1',
        user: 'morrelinko',
        password: '123456',
        database: 'elibrary',
        charset: 'utf8'
      }
    }
  }
};
