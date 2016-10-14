/**
 * Created by lemyskaman on 25/07/16.
 */
var _ = require("underscore");

var router = require('express').Router();
var mongoose = require('mongoose');


module.exports = function (opt) {

    // this.nature=opt.nature
    //this.model

    this.name = opt.name;

    this.httpMethods =['get', 'post', 'put', 'delete'];
    this.KCrud = {}
    this.router = router;
    var self = this;
    _.map(opt, function (element, key, list) {
        self[key] = element;
    }, self);

    //todo: build a seter for this var
    this.routes = opt.routes;
};

module.exports.prototype = {


    //todo: this must be done a way to programatically ad routes WITH MIDDLEWARES
    set:function(){
        //     DO NO DELETE THIS WILL BE USEFULL TO  programatically set what is handy set  above ABOVE
        /*
         this.router.route(_that.routes[0].path)[_that.routes[0].methods[0].name](function(req,res,next){
         _that[_that.routes[0].methods[0]['callable']](req,res,next);
         })*/
    },

    //todo: you got to finsih it
    setRoute: function (root, method, callable, middle, params) {

        try {

            if (typeof root !== 'string')
                throw "setRoute's root must be a string type and it cant be undefined";
            if (typeof method !== 'string')
                throw "setRoute's method param is a mantatory string";
        } catch (err) {
            console.log(err);
        }
    }
    ,


    setKCrud: function () {
        console.log('fired kcrud');
        var _that = this;
        var provider = this.providers[this.kcrudProvidersKey];
        var kcrudfields = {};
        _.each(_that.kcrudFields, function (item) {
            kcrudfields[item] = 1;
        }) //  this.kcrudFields;
        var allFields = Object.keys(mongoose.model(this.kcrudProvidersKey).schema.paths);

        //here we start with all the collection
        this.router.route('/' + this.kcrudProvidersKey.toLowerCase() + 's')//this.kcrudProvidersKey.toLowerCase()+'s')
            .get(function (req, res, next) {
                provider.find().select(kcrudfields).exec()
                    .then(function (users) {
                        res.status(200).send(users)
                    }, function (err) {
                        res.status(500).send(users)
                    })
            })
            .post(function (req, res, next) {
                var row = new provider();


                user.password = req.body.pass;
                user.email = req.body.email;
                user.firstName = req.body.firstName || null;
                user.lastName = req.body.lastName || null;
                user.sites.push(req.body.site)
                var savePromise = user.save()

                    .then(function (user) {
                        res.status(201).send(user);
                    }, function (err) {
                        res.status(500).send(err);
                    })


            });


/// /   if (key.split("_").length>1)


    }
    ,
    getRouter: function () {
        this.set();

        return this.router;

    }
    ,
    extend: function (child) {
        return _.extend({}, this, child);
    }
    ,
    run: function (req, res, next) {
        console.log('base run');
    }
}

