/**
 * Created by lemyskaman on 28/11/16.
 */
var util = require('util');
var kmiddleware = require("./../core/kmiddleware");
var jwt = require('jsonwebtoken');


module.exports = new kmiddleware({

    _

    run: function (req, res, next) {
        var _that = this;
        //as shown on https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, _that.config.get('secret'), function (err, decoded) {
                if (err) {
                    return res.json({success: false, message: 'Failed to authenticate token.'});
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }


    }
});


