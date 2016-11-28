var Krouter = require("./../core/krouter");
var _ = require("underscore");
var basicAuth = require('basic-auth');

var Promise = require('bluebird');
//var readFile = Promise.promisify(require("fs").readFile);
var jwt = Promise.promisifyAll(require('jsonwebtoken')); // used to create, sign, and verify tokens
var bcrypt = Promise.promisifyAll(require('bcrypt'));

var usersModel = require('../models/users.model');
var utils = require('../utils/kaman_utils');

module.exports = new Krouter({

    model: {
        users: usersModel
    },

    //justreturn an object with the body val
    _reqBodyAtr: function (req) {
        var fields = this.model.users.fields;
        console.log('fields')
        console.log(fields);


        var result = {};
        _.each(fields, function (element, index, list) {
            console.log(element)
            console.log(req.body[element])

            //adding the id get param  as a body attribute
            if (element === 'id')
                if (req.params.id)
                    req.body.id = req.params.id

            if (req.body[element]) {
                result[element] = req.body[element];
            }
        }, this)
        return result;
    },
    //in case we have empty password value on boddy
    //we filli up with a model defult ramdon function for pass
    _emptyPasswordFix: function (req) {
        if (!req.body.password) {
            req.body.password = this.model.users._randomPassString();
            req.body.password_status_id = 'active'
        } else if (req.body.password.length === undefined) {
            req.body.password = this.model.users._randomPassString();
        }

        return req;
    },

    _passwordCompare: function (test, hash) {
        console.log(test, hash);
        return bcrypt.compareAsync(test, hash);
    },
    //retrive users from collection acordign a guess
    getFiltredUsers: function (req, res, next) {
        this.model.users
            .find(req.params.guess)
            .then(function (rows) {
                res.status(200).json(rows);
            })
            .catch(function (err) {
                res.status(500).json(err);
                console.log(err)
            })
    },
    getUsers: function (req, res, next) {

        this.model.users
            .getThem()
            .then(function (rows) {
                res.status(200).json(rows);
            })
            .catch(function (err) {
                res.status(500).json(err);
                console.log(err)
            })
    },
    //retrive a user from the collection but just one acording a criteria
    getUser: function (req, res, next) {

        this.model.users
            ._getUserById(req.params.id)
            .then(function (rows) {
                res.status(200).json(rows)
            })
            .catch(function (err) {
                res.status(500).json(err)
            })
    },


    //neds a data check middleware
    newUser: function (req, res, next) {



        //in case we have empty password value on boddy
        //we filli up with a model defult ramdon function for pass
        req = _emptyPasswordFix(req);
        var user = {
            username: req.body.username,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: req.body.password
        };


        this.model.users
            .addNewUser(user)
            .then(function (rows) {
                //at this point we should be able to retrive some fields of the
                //new user recod but instead maybe becouse there is something wrong
                // we are only getting the id of the new record
                //on the rows object so we are goin to add the original user object to the response
                user.id = rows[0];
                user.password = req.body.password;
                res.status(200).json(user);
            })
            .catch(function (err) {
                //onsole.log('register User catch error',err)
                res.status(500).json(err)
            })


    },
    updateUser: function (req, res, next) {
        _that = this;
        console.log(req.body)
        var user = this._reqBodyAtr(req);

        this.model.users.updateUser(user)
            .then(function (rows) {
                res.status(200).json(user)
            })
            .catch(function (err) {
                //onsole.log('register User catch error',err)
                res.status(500).json(err)
            })


    },
    passwordSet: function (req, res, next) {

        var user = this._reqBodyAtr(this._emptyPasswordFix(req));


        this.model.users
            .updatePass(user)
            .then(function (rows) {
                user.password = req.body.password;
                res.status(200).json(user);
            })
            .catch(function (err) {
                //onsole.log('register User catch error',err)
                res.status(500).json(err)
            })

    },

    passwordReset: function (req, res, next) {

        var user = this._reqBodyAtr(req)
        if (user.id && user.password) {

        }
    },

    _authFail: function (res) {
        res.status(401).json({auth:{success:false,message:'non valid combination of username and password'}})
    },
    authenticate: function (req, res, next) {
        var _that = this;
        var reqUser = this._reqBodyAtr(req);
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
                                        expiresIn:'4h'
                                    });

                                //res.status(200).json(utils.objectFilter(users[0], _that.model.users.publicFields));
                            } else {//passwor dont match the user o db
                                console.log('authentication fail: password dont match user')
                                _that._authFail(res)
                            }

                        })
                        .then(function(token){
                            res.status(200).json({user:utils.objectFilter(matchedUser, _that.model.users.publicFields),token:token})
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


    },

    /*-----------Mandatory----------*/
    setEndPoints: function () {
        var _that = this
        this.router.route('/user')
        //adds a new user
            .post(function (req, res, next) {
                _that.newUser(req, res, next);
            })

        this.router.route('/user/:id')
        //edit user
            .put(function (req, res, next) {
                _that.updateUser(req, res, next)
            })
            //get user by id
            .get(function (req, res, next) {
                _that.getUser(req, res, next);
            });

        this.router.route('/user/passwordset/:id')
        //update an user pass
            .put(function (req, res, next) {
                _that.passwordSet(req, res, next)
            });

        this.router.route('/authenticate')
            .post(function (req, res, next) {
                _that.authenticate(req, res, next);
            })


        /*
         this.router.route('/users/id/:id')
         .get(function (req, res, next) {
         _that.getUser(req, res, next);
         });*/
        this.router.route('/users/:guess')
        //retrive a limited user list based on the guess
            .get(function (req, res, next) {
                _that.getFiltredUsers(req, res, next);
            });


        this.router.route('/users') //this route should be avoided
        //retrive all the system users
            .get(function (req, res, next) {
                _that.getUsers(req, res, next)
            })
    }


})
;