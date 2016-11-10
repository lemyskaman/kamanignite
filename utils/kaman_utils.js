// this function is called when you want the server to die gracefully
// i.e. wait for existing connections
// the server params should be a instance of a express server
var _ = require('underscore');
module.exports = {

    objectFilter: function (obj, valid_keys) {
        var result = {};
        _.each(valid_keys, function (element, index, list) {
            if (obj[element]) {
                result[element] = obj[element];
            }
        })
        return result;
    },

    isEmpty: function (obj) {
        for (var prop in obj
            ) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return JSON.stringify(obj) === JSON.stringify({});
    },
    'gracefulShutdown': function (server) {
        console.log("Received kill signal, shutting down gracefully.");
        server.close(function () {
            console.log("Closed out remaining connections.");
            process.exit()
        });

        // if after
        setTimeout(function () {
            console.error("Could not close connections in time, forcefully shutting down");
            process.exit()
        }, 10 * 1000);
    }
}
;