/**
 * Created by lemyskaman on 25/07/16.
 */
var _ = require("underscore");
var router = require('express').Router();


module.exports = function (opt) {

    // this.nature=opt.nature
    //this.model

    this.name = opt.name;
    
    this.router = router;
    var self = this;
    _.map(opt, function (element, key, list) {
        self[key] = element;
    }, self);

    //todo: build a seter to fill this var and also a initial value checker
    // this.routes = opt.routes
};

module.exports.prototype = {

    
    extend: function (child) {
        return _.extend({}, this, child);
    },
    run: function (req, res, next) {
        console.log('base run');
    }
}

