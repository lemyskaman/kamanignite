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
    rawFieldsAliases:function(obj){
        var toReturnArr= _.map(obj,function(value,key,list){
            return key+' as '+ value;
        },this)

        return knex.raw(toReturnArr.toString());
    },
    knex:knex,
    extend: function (child) {
        return _.extend({}, this, child);
    }
}

