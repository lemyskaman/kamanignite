/**
 * Created by lemys on 04/11/16.
 */

module.exports = {
    ip: '127.0.0.1',
    lang: 'es',
    secret: 'K4MaN',
    port: 4000,
    mongoUrl: 'mongodb://127.0.0.1/kamanweb',
    mysqlSlots: {
        read: {
            debug: true,
            client: 'mysql',
            connection: {
                host: 'localhost',
                port: 6606,
                user: 'root',
                password: '8524567193orionandromeda**',
                database: 'ma'
            }
        },
        write: {
            debug: true,
            client: 'mysql',
            connection: {
                host: 'localhost',
                port: 6606,
                user: 'root',
                password: '8524567193orionandromeda**',
                database: 'ma'
            }
        }
    }


};