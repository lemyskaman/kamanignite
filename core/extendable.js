/**
 * Created by lemyskaman on 26/06/16.
 */
var _ = require("underscore");


module.exports = function (opt) {
    if (this.initialize && typeof this.initialize === 'function')
        this.initialize(opt);

    return {
        extend: function (opt) {
            return _.extend({}, this, opt);
        }
    }
};

module.exports.prototype = {

    initialize: function (opts) {

    },

}




/*
module.exports= {
    name: "kamanwebController",

    extend: function(child) {
        return _.extend({}, this, child);
    },
    run: function(req, res, next) {

    }
}*/