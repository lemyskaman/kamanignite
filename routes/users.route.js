var Krouter = require("./../core/krouter");
var _ = require("underscore");
var basicAuth = require('basic-auth');

var Promise = require('bluebird');
//var readFile = Promise.promisify(require("fs").readFile);
var jwt = Promise.promisifyAll(require('jsonwebtoken')); // used to create, sign, and verify tokens
var bcrypt = Promise.promisifyAll(require('bcrypt'));

var usersModel = require('../models/users.model');
var utils = require('../utils/kaman_utils');
var userVerifyMiddleware = require('../middlewares/tokenVerify.middleware.js');


module.exports = new Krouter({

    model: {
        users: usersModel
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
        req = this._emptyPasswordFix(req);
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
                console.log('register User catch error',err)
                res.status(500).json(err)
            })


    },
    updateUser: function (req, res, next) {
        _that = this;
        console.log(req.body)
        var user = this.model.users._reqBodyAtr(req);

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

        var user = this.model.users._reqBodyAtr(this._emptyPasswordFix(req));

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
    selfUpdate: function (req, res, next) {
        _that = this;
        console.log(req.body)
        var user = this.this.model.users._reqBodyAtr(req);

        this.model.users.selfUpdate(user)
            .then(function (rows) {
                res.status(200).json(user)
            })
            .catch(function (err) {
                //onsole.log('register User catch error',err)
                res.status(500).json(err)
            })

    },
    selfPasswordSet: function (req, res, next) {

        var user = this.this.model.users._reqBodyAtr(this._emptyPasswordFix(req));

        this.model.users
            .selfUpdatePass(user)
            .then(function (rows) {
                user.password = req.body.password;
                res.status(200).json(user);
            })
            .catch(function (err) {
                //onsole.log('register User catch error',err)
                res.status(500).json(err)
            })

    },


   

    /*-----------Mandatory----------*/
    setEndPoints: function () {
        var _that = this

        this.router.route('/me')
            .put(function (req, res, next) {

            })

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

/*
        this.router.route('/users') //this route should be avoided
        //retrive all the system users
            .get(
                function (req, res, next) {
                    _that.getUsers(req, res, next)
                })
                */
    }


})
;