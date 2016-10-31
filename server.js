/**
 * Created by lemyskaman on 26/06/16.
 */

//we load some goddies
var kamanUtils = require('./utils/kaman_utils');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');


var _ = require('underscore');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens


var config = require('./config');
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.set('views', './templates');
app.set('basePath', __dirname);
app.set('token_secret', 'kamankaman');
app.use(morgan('dev'));


var routes = {};
routes.index = require('./routes/index.route.js');
routes.users = require('./routes/users.route.js');

//a front end html magic will be builded and deliver from here
app.use(routes.index.getRouter());
app.use('/resources',routes.users.getRouter());
//all static files will be served from here
// for production enviorment ngix is recomendable to do this job
app.use('/static', express.static('static/'));



//front end app should be dwonloaded from server  at /
/*app.all('/:lang', function (req, res, next) {

 });*/






//routes stablishing
//app.use('/resoruces', routes.users.getRouter());


var server = app.listen(config.port, config.ip, function () {

    console.log('Express server listening')
    console.log('form ' + config.ip + ' on port ' + config.port);
})


//gracefull aplication close thanks to
// listen for TERM signal .e.g. kill
process.on('SIGTERM', function () {
    kamanUtils.gracefulShutdown(server)
});

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', function () {
    kamanUtils.gracefulShutdown(server)
});
