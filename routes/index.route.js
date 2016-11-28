/**
 * Created by lemys on 30/10/16.
 */

var Krouter = require("./../core/krouter");
var basicAuth = require('basic-auth');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var Promise = require('bluebird');
var Config = require('../core/config');
var config  = new Config();

//var langDetect = require('../middlewares/langDetect.middleware');


module.exports = new Krouter({

    getFrontEndApp: function (req, res, next) {

        res.render('main', {lang: res.lang});
        next();

    },

    setEndPoints: function () {
        var that = this;
        this.router.route('/')
            .get(
            //pass throug lang detect
            function (req, res, next) {
                res.lang = config.get('lang') || 'en';
                next()
            },
            function (req, res, next) {
                that.getFrontEndApp(req, res, next);
            })
            .post(
            //pass throug lang detect
            function (req, res, next) {
                res.lang = req.body.lang || config.get('lang') || 'en';
                next();
            },
            function (req, res, next) {
                that.getFrontEndApp(req, res, next);
            });

        this.router.route('/lang/:lang')
            .get(
            function (req, res, next) {
                res.lang = req.params.lang || config.get('lang') || 'en';
                next();
            },
            function (req, res, next) {
                that.getFrontEndApp(req, res, next);
            }
        )
    }
})

