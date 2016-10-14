var Krouter = require("./../core/krouter");
var basicAuth = require('basic-auth');

module.exports = new Krouter({

    usersGet:function(req,res,next){
        this.providers.users.find().select({name: 1, firstName: 1, lastName: 1, email: 1, sites: 1}).exec()

            .then(function (users) {
                res.status(200).send(users)
            }, function (err) {
                res.status(500).send(users)
            })
    },

    set: function () {
        this.setKCrud();
        var _that = this


        this.route.route('/authenticate')
            .post(function (req, res, next) {
                    //retrive the auth credentials from client
                    var unauthUser = basicAuth(req);
                    if (unauthUser && unauthUser.username && unauthUser.pass) {
                        this.providers.User.findOne({'mail': unauthUser.name}).exec()

                            .then(function (user) {

                                if (passwordChek(user, unauthUser.pass)) {
                                    req.user = user;
                                    next()
                                } else {

                                    res.status(401).send({message: 'Invalid Credentials'});

                                }
                                ;

                            }, function (err) {
                                res.status(500).send({message: err});
                            });
                    } else {

                        res.status(401).send({message: 'Username and Password are required'});

                    }

                }
            )


        /*
         this.router.route('/users')
         .get(function (req, res, next) {
         _that.providers.users.find().select({name: 1, firstName: 1, lastName: 1, email: 1, sites: 1}).exec()

         .then(function (users) {
         res.status(200).send(users)
         }, function (err) {
         res.status(500).send(users)
         })
         })
         .post(function (req, res, next) {
         var user = new _that.providers.users();


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


         });*/
        //retrive by user id
        this.router.route('/user/:user_id')
            .get(function (req, res, next) {
                _that.providers.users.findById(req.params.user_id).exec()
                    .then(function (user) {
                        res.status(200).send(user)
                    }, function (err) {
                        res.status(500).send(err)
                    })
            })
            .get(function (req, res, next) {
                _that.providers.users.findById(req.params.user_id).exec()
                    .then(function (user) {
                        res.status(200).send(user)
                    }, function (err) {
                        res.status(500).send(err)
                    })
            })
            .put(function (req, res, next) {
                // _that.providers.findById

            })
        this.router.route('/user/:user_field/:user_value')

            .get(function (req, res, next) {
                res.send(req.params.user_value + 'initial');

            })

            .put(function (req, res, next) {

            });
        this.router.route('/user/:user_field/:user_value').get(function (req, res, next) {
            res.send('overwrited');

        })

    }
});