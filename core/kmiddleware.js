var _ = require("underscore");
var Config = require('../core/config');
var config = new Config();
module.exports=function(opt){
    // this.nature=opt.nature
    //this.model
    var self=this;
    this.config = config;
    _.map(opt,function(element,key,list){
        self[key]=element;
    },self)
};

module.exports.prototype = {

    extend: function(child) {
        return _.extend({}, this, child);
    },
    run: function(req, res, next) {
        console.log('base run');
    }
}

