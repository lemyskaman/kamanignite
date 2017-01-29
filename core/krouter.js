/**
 * Created by lemyskaman on 25/07/16.
 */
var _ = require("underscore");

var Config = require('../core/config');
var config = new Config();
module.exports = function (opt) {

    // this.nature=opt.nature
    //this.model

    this.name = opt.name;
    this.config = config;
    this.router = require('express').Router();
    var self = this;
    _.map(opt, function (element, key, list) {
        self[key] = element;
    }, self);


    //todo: build a seter to fill this var and also a initial value checker
    // this.routes = opt.routes
    console.log('krouter', this.name);
    console.log(this);
};

module.exports.prototype = {

    _jsonResponse: function (res, httpStatusCode, msg, data) {
        var responseJson = {};
        responseJson.data = data;
        responseJson.message= msg;
        res.status(httpStatusCode).json(responseJson)
    },



    extend: function (child) {
        return _.extend({}, this, child);
    },
    run: function (req, res, next) {
        console.log('base run');
    },
    setEndPoints: function () {
    },
    _getRouter: function () {
        this.setEndPoints();
        return this.router;
    }


}

