/**
 * Created by lemyskaman on 26/06/16.
 */

//currently a middleware is based on a controller
var util=require('util');
var kmiddleware = require("./../core/kmiddleware");
var config = require('../config');
module.exports = new  kmiddleware({
    run: function (req, res, next) {

        console.log(req.originalUrl);
        var lang = req.body.lang || config.lang || 'en';

        //if (req.method==='GET')


        next()
    }
});


