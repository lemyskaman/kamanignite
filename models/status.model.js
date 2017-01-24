/**
 * Created by lemyskaman on 23/01/17.
 */

var _ = require("underscore");
var Model = require('../core/kmodel');
var Promise = require('bluebird');

var utils = require('../utils/kaman_utils');


module.exports = new Model({



    getThem:function(){
        return this.reader
            .select()
            .from('status')
    }

});