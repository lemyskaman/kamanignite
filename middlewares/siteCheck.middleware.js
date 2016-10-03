/**
 * Created by lemyskaman on 26/06/16.
 */

//currently a middleware is based on a controller
var util=require('util');
var kmiddleware = require("./../core/kmiddleware");
module.exports = new  kmiddleware({
    run: function (req, res, next) {
        var HOST = req.get('host').split(":")[0];
        console.log(HOST);
        var sitePromise = this.providers.Site.findOne({'name': HOST}).exec();
        sitePromise.then(function (site) {

            if (!site) {
                //in case we findt a host
                console.log('site: ' + HOST + ' NOT FOUND');
                res.status(404).send('site: ' + HOST + ' NOT FOUND');
                next();
            } else {

                console.log('valid url');
                //console.log(util.inspect(site));
                //in case the host is active
                if (site.status === true) {
                    req.site = site;
                    next()
                } else {
                    console.log('site: ' + site.name + ' is not enabled');
                    res.status(500).send('site: ' + site.name + ' is not enabled');
                }
            }
        })
    }
});


