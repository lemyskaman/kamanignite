/**
 * Created by lemyskaman on 26/06/16.
 */
var env = process.env;

var config_data = {
    local: {
        lang: 'es',
        ip: '127.0.0.1',
        port: 3000,
        mongoUrl: 'mongodb://127.0.0.1/kamanweb',
        mysqlSlots: {
            read: {
                debug: true,
                client: 'mysql',
                connection: {
                    host: 'your-mysql-host',
                    user: 'your-mysql-user',
                    password: 'your-mysql-pass',
                    database: 'database to use'
                }
            },
            write: {
                debug: true,
                client: 'mysql',
                connection: {
                    host: 'your-mysql-host',
                    user: 'your-mysql-user',
                    password: 'your-mysql-pass',
                    database: 'database to use'
                }
            },
        },


    },


}


module.exports = config_data.local;
