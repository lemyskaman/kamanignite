/**
 * Created by lemyskaman on 26/06/16.
 */


var _ = require("underscore");
var config = require('../config');
var knex  = require('knex');
module.exports = function (opt) {


    this.reader = new knex(config.mysqlSlots.read);
    this.writer = new knex(config.mysqlSlots.write);


    var self = this;
    _.map(opt, function (element, key, list) {
        self[key] = element;
    }, self)
};

module.exports.prototype = {

    


    extend: function (child) {
        return _.extend({}, this, child);
    }
}

