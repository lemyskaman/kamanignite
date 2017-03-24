/**
 * Created by lemyskaman on 28/11/16.
 */
var util = require('util');
var kmiddleware = require("./../core/kmiddleware");
var jwt = require('jsonwebtoken');

tokenVerify = new kmiddleware({

    _tokenFail:function(res){

        return res.status(401).json({
            error: {
                origin: 'tokenVerify.middleware',
                message: 'no token provided or Failed to authenticate token.'
            }
        })
    },

    run: function (req, res, next) {
        console.log('authorize runnig','authorize runnig','authorize runnig','authorize runnig','authorize runnig','authorize runnig','authorize runnig','authorize runnig','authorize runnig','authorize runnig','authorize runnig','authorize runnig','authorize runnig');
        var _that = this;
        //as shown on https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, _that.config.get('secret'), function (err, decoded) {
                if (err) {
                    _that._tokenFail(res);
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            _that._tokenFail(res);
        }


    }
});


module.exports = tokenVerify;