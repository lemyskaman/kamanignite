/**
 * Created by lemyskaman on 26/06/16.
 */


var _ = require("underscore");
var Config = require('../core/config');
var knex  = require('knex');

var config = new Config();
module.exports = function (opt) {

    console.log(config);
    this.reader = new knex(config.get('mysqlSlots').read);
    this.writer = new knex(config.get('mysqlSlots').write);


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

