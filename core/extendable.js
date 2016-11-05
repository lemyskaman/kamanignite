/**
 * Created by lemyskaman on 26/06/16.
 */
var _ = require("underscore");


module.exports=function(opt){
    this.kind=opt.kind;
   // this.nature=opt.nature
    //this.model
    const self=this;
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




/*
module.exports= {
    name: "kamanwebController",

    extend: function(child) {
        return _.extend({}, this, child);
    },
    run: function(req, res, next) {

    }
}*/