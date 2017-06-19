/**
 * Created by lemyskaman on 26/06/16.
 */


var _ = require('underscore');
var Config = require('../core/config');
var knex = require('knex');

var config = new Config();

function Kmodel(opt) {


    this.reader = new knex(config.get('mysqlSlots').read);
    this.writer = new knex(config.get('mysqlSlots').write);


    var self = this;
    _.map(opt, function (element, key) {
        self[key] = element;
    }, self);
}
//construct a select knex raw query (fields chunk) from  array or object
Kmodel.prototype.rawFieldsAliases = function (obj) {
    var toReturnArr = [];
    if (_.isArray(obj)) {
        toReturnArr = _.map(obj, function (value, key) {
            return key;
        }, this);
    } else if (_.isObject) {
        toReturnArr = _.map(obj, function (value, key) {
            return key + ' as ' + value;
        }, this);
    }

    return knex.raw(toReturnArr.toString());
};
Kmodel.prototype.listLimit=100,
Kmodel.prototype.knex = knex;
// concat the knext methods to buld a proper search query from a guess and sarch fields
Kmodel.prototype.search= function(readerObject,guess,searchFields){
    var fieldsToSearch = []
    if (searchFields && _.isArray(searchFields) && searchFields.length > 0 ){
        fieldsToSearch = searchFields;
    }else{
        fieldsToSearch = this.schemaFields;
    };

    _.each(fieldsToSearch,function(e,k){
        console.log('kmodel '+k)
        if (k<1){
            //start with guess
            readerObject.where(e, 'like', guess + '%');
            //with guess 
            readerObject.orWhere(e, 'like', '%' + guess + '%');
            //ends with guess 
            readerObject.orWhere(e, 'like', '%' + guess )
        }else{
            readerObject.orWhere(e, 'like',  guess + '%')
            readerObject.orWhere(e, 'like', '%' + guess + '%')
            readerObject.orWhere(e, 'like', '%' + guess )
        }
    });
    return readerObject;
}


module.exports = Kmodel;
