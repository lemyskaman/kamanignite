/**
 * Created by lemys on 30/10/16.
 */

var Krouter = require("./../core/krouter");
var basicAuth = require('basic-auth');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var Promise = require('bluebird');
var usersModel = require('../models/users.model');


module.exports = new Krouter({

    getFrontEnd:function(req,res,next){
        console.log('routed')
        var lang = req.body.lang || config.lang || 'en';
        console.log('lang setted to '+lang);
        res.render('main', {lang: lang});
        next();

    }
})