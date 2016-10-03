var Krouter = require("./../core/krouter");
var basicAuth = require('basic-auth');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var Promise = require('bluebird');


module.exports = new Krouter({


    userFields: 'cosilla',
    //retrive users from collection acordign a guess
    getFiltredUsers: function (req, res, next) {
        _that.models.users
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
        _that.models.users
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
        _that.models.users
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
        _that = this;
        var user = {
            username: req.body.username,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: req.body.password
        };

        this.models.users
            .addNewUser(user)
            .then(function (rows) {
                res.status(200).json(rows)
            })
            .catch(function (err) {
                //onsole.log('register User catch error',err)
                res.status(500).json(err)
            })


    },
    updateUser: function (req, res, next) {
        _that = this;
        var user = {};
        //only if there are editable fields values in the body request
        if ((req.body.first_name || req.body.last_name ) && req.params.id) {


            //has to be done for every editable field
            if (req.body.first_name)
                user.first_name = req.body.first_name;

            if (req.body.last_name)
                user.last_name = req.body.last_name;

            this.models.users.updateUser(req.params.id, user)
                .then(function (rows) {
                    res.status(200).json(rows)
                })
                .catch(function (err) {
                    //onsole.log('register User catch error',err)
                    res.status(500).json(err)
                })
        }else{
            res.status(500).json({error:'a get id param and some body values are mandatory'})
        }

    },
    PasswordSet: function (req, res, next) {   // called when a user change it own pass after being created

    },
    PasswordReSet: function (req, res, next) {   // called to replace current pass for a new one

    },


    setEndPoints: function () {
        _that = this;
        this.router.route('/user/:id')

            .put(function (req, res, next) {
                _that.updateUser(req, res, next)
            })
            .get(function (req, res, next) {
                _that.getUser(req, res, next);
            });
        this.router.route('/user')
            .post(function(req,res,next){
                _that.newUser(req, res, next);
            })
        /*
         this.router.route('/users/id/:id')
         .get(function (req, res, next) {
         _that.getUser(req, res, next);
         });*/
        this.router.route('/users/:guess')
            .get(function (req, res, next) {
                _that.getFiltredUsers(req, res, next);
            });


        this.router.route('/users')
            /*.post(function (req, res, next) {
                _that.newUser(req, res, next);
            })*/
            .get(function(req,res,next){
                _that.getUsers(req,res,next)
            })

    },
    getRouter: function () {
        this.setEndPoints();
        return this.router;
    }


})
;