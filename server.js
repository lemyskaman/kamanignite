/**
 * Created by lemyskaman on 26/06/16.
 */

//we load some goddies
var kamanUtils  = require('./utils/kaman_utils');
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


//middlewares
var middlewares = {};

//models
var models = {};
models.users = require('./models/users.model');


var routes = {};
routes.users = require('./routes/users.route.js');
routes.users.models = models

app.all('/', function (req, res, next) {
    console.log('main');
    var lang=req.body.lang || config.lang
    res.render('main', { lang: lang});
    next(); // pass control to the next handler
});
app.use('/static', express.static('static/'));
//app.use('/resoruces', routes.users.getRouter());
//routers stablishing

var server = app.listen(config.port, config.ip, function () {

    console.log('Express server listening')
    console.log('form ' + config.ip + ' on port ' + config.port);
})

// listen for TERM signal .e.g. kill
process.on('SIGTERM', function(){ kamanUtils.gracefulShutdown(server)});

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT',function(){ kamanUtils.gracefulShutdown(server)});
