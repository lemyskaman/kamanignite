/**
 * Created by lemyskaman on 26/06/16.
 */
var env = process.env;

var config_data = {
    local: {
        lang:'es',
        ip: '127.0.0.1',
        port: 3000,
        mongoUrl: 'mongodb://127.0.0.1/kamanweb',
        mysqlSlots: {
            read: {
                debug:true,
                client: 'mysql',
                connection: {
                    host: 'localhost',
                    user: 'root',
                    password: '128162((',
                    database: 'ma'
                }
            },
            write: {
                debug:true,
                client: 'mysql',
                connection: {
                    host: 'localhost',
                    user: 'root',
                    password: '128162((',
                    database: 'ma'
                }
            },
        },


    },

    openshift: {
        lang:'en',
        ip: env.NODE_IP,
        port: env.NODE_PORT,
        mongoUrl: process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME

    }
}


if (typeof env.NODE_IP === "undefined" || typeof env.NODE_PORT === "undefined") {
    console.log('local has been defined as ecosystem');
    

    module.exports = config_data.local;
} else {
    console.log('openshift has been defined as ecosystem');
    module.exports = config_data.openshift;
}
