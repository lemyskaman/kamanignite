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
        this._routerSeter(key, element)
        self[key] = element;
    }, self);


    //todo: build a seter to fill this var and also a initial value checker
    // this.routes = opt.routes
    console.log('krouter', this.name);
    //console.log(this);
};

module.exports.prototype = {

    _getFnParamNames: function (fn) {
        var fstr = fn.toString();
        return fstr.match(/\(.*?\)/)[0].replace(/[()]/gi, '').replace(/\s/gi, '').split(',');
    },
    _routeString: function (splitedFnName, paramNames) {
        //the string for starts with a backslash
        //the we add the rest of the array gluin with _ and
        // avoiding the method that shoul be on 0 indeex of array
        var routeString = '/' + _.rest(splitedFnName).join('_');

        //we add to routeString the httparams that dosent match with function
        //req res or next param
        _.each(paramNames, function (element, key, list) {

            if (element !== 'req' && element !== 'res' && element !== 'next') {
                routeString = routeString + '/:' + element;
            }
        })
        return routeString
    },
    _fnParamsValues: function (req, res, next, paramNames) {
        var fnParamValues = [];
        _.each(paramNames, function (element, key, list) {

            switch (element) {

                case'req':
                    fnParamValues[key] = req
                    break;
                case 'res':
                    fnParamValues[key] = res
                    break;
                case 'next':
                    fnParamValues[key] = next
                    break;

                //we assume the other params are just http get params
                default :
                    console.log('inside loop swicth', req.params)
                    fnParamValues[key] = req.params[key]
                    break;
            }

        }, this);
        return fnParamValues;
    },

    _routerSeter: function (fnName, fn) {

        var _that = this;
        var splitedFnName = fnName.split('_');


        var httpMethod = _.first(splitedFnName)


        switch (httpMethod) {
            case 'put':
                console.log(httpMethod)
                var paramNames = this._getFnParamNames(fn)
                this.router.route(this._routeString(splitedFnName, paramNames))
                    .put(function (req, res, next) {
                        //the we call the function and aply its arguments with values
                        _that[fnName].apply(_that, _that._fnParamsValues(req, res, next, paramNames));
                    });
                break;
        }


    },

    _jsonResponse: function (res, httpStatusCode, msg, data) {
        var responseJson = {};
        responseJson.data = data;
        responseJson.message = msg;
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

