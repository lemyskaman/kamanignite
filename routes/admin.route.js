var KamanwebController = require("./../core/extendable");
module.exports = new KamanwebController({name:'home'}).extend({
    
    run: router.route('/users')

        .get(function(req,res,next){
            providers.users.find().select('firstName lastName email').exec()

                .then(function(users){
                    res.status(200).send(users)
                }, function (err){
                    res.status(500).send(users)
                })
        })
        .post(function (req, res, next) {
            var user = new providers.users();


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


        })
    }
});