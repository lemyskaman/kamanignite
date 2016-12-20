/**
 * Created by lemyskaman on 04/12/16.
 */
var Krouter = require("./../core/krouter");
var _ = require("underscore");


var Promise = require('bluebird');
//var readFile = Promise.promisify(require("fs").readFile);
var jwt = Promise.promisifyAll(require('jsonwebtoken')); // used to create, sign, and verify tokens
var bcrypt = Promise.promisifyAll(require('bcrypt'));

var usersModel = require('../models/users.model');
var utils = require('../utils/kaman_utils');


module.exports = new Krouter({
    model: {users: usersModel}
    ,
    _passwordCompare: function (test, hash) {
        console.log(test, hash);
        return bcrypt.compareAsync(test, hash);
    }
    ,
    _authFail: function (res) {
        res.status(401).json({error:{auth: false, message: 'non valid combination of username and password'}})
    }
    ,
    authenticate: function (req, res, next) {
        var _that = this;
        var reqUser = this.model.users._reqBodyAtr(req);
        var matchedUser = {};

        var userRetriving = {},
            passComparsion = {},
            tokenCreation = {};

        userRetriving = this.model.users._getByUsername(reqUser.username);
        userRetriving
            .then(function (users) {//if a correct db connection and query
                var success = 0;
                if (users.length === 1) {//if we find a user
                    matchedUser = users[0];
                    console.log('auth req user:')
                    console.log(reqUser);
                    console.log('auth db user')
                    console.log(matchedUser);
                    _that._passwordCompare(reqUser.password, matchedUser.password)
                        .then(function (check) {
                            if (check === true) {//if passwor match with db pass
                                console.log('jwt user');
                                console.log(utils.objectFilter(matchedUser, _that.model.users.publicFields));
                                console.log('secret');
                                console.log(_that.config.get('secret'));
                                return jwt.signAsync(
                                    utils.objectFilter(matchedUser, _that.model.users.publicFields),
                                    _that.config.get('secret'),
                                    {
                                        algorithm: 'HS256',
                                        expiresIn: '4h'
                                    });

                                //res.status(200).json(utils.objectFilter(users[0], _that.model.users.publicFields));
                            } else {//passwor dont match the user o db
                                console.log('authentication fail: password dont match user')
                                _that._authFail(res)
                            }

                        })
                        .then(function (token) {
                            const response = utils.objectFilter(matchedUser, _that.model.users.publicFields)
                            response.auth = true;
                            response.token = token;

                            res.status(200).json(response)
                        })
                        .catch(function (err) {
                            console.log('token generation error')
                            console.log(err)
                            res.status(500).json({
                                error: {
                                    action: 'jwt.singAsync',
                                    content: err
                                }
                            })
                        })
                        .catch(function (err) {
                            console.log('password compare error')
                            console.log(err)
                            res.status(500).json({
                                error: {
                                    action: 'passwordCompare',
                                    content: err
                                }
                            })
                        })
                } else { // user not found
                    console.log('authentication fail: user not found')
                    _that._authFail(res);
                }
            })
            .catch(function (err) {//if mysql connection or mysql related error
                console.log(err)
                res.status(500).json({
                    error: {
                        action: '_getByUsername',
                        content: err
                    }
                });
            });


    }
    ,
    setEndPoints: function () {
        var _that = this;
        this.router.route('/authenticate')
            .put(function (req, res, next) {
                _that.authenticate(req, res, next);
            })


    }

})
;