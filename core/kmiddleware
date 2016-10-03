var _ = require("underscore");
module.exports=function(opt){
    // this.nature=opt.nature
    //this.model
    var self=this;
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

