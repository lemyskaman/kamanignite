/**
 * Created by lemyskaman on 26/06/16.
 */

//we load some goddies
//var kamanUtils = require('./utils/kaman_utils');
const utils = require('./utils/kaman_utils');
const Configuration = require('./core/config');


var express = require('express');

var bodyParser = require('body-parser');
var morgan = require('morgan');
var favicon  =  require('serve-favicon');
var _ = require('underscore');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var userVerifyMiddleware = require('./middlewares/tokenVerify.middleware.js');

var config = new Configuration();
var app = express();







app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.set('views', './templates');
app.set('basePath', __dirname);
app.set('token_secret', 'kamankaman');
app.use(morgan('dev'));

var statusModel=require('./models/status.model.js')
var routes = {};
routes.index = require('./routes/index.route.js');
routes.users = require('./routes/users.route.js');
routes.auth = require('./routes/atuh.route.js');


app.use( function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  
  res.header('Access-Control-Allow-Headers', 'x-access-token, Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
 next();
});

//icon
app.use(favicon(__dirname + '/static/assets/favicon.png'));
//all static files will be served from here
// for production enviorment ngix is recomendable to do this job
app.use('/static', express.static('static/'));







//a front end html/javascript magic will  delivered from here
app.use('/resources',routes.index._getRouter());


//authentication its out side from verifyig middleware
app.use('/resources', routes.auth._getRouter());

//an authenticated user is mandatory after this middleware
app.use(function(req,res,next){
    //userVerifyMiddleware.run(req,res,next);
    next();
});



app.use('/resources', routes.users._getRouter());




//routes stablishing
//app.use('/resoruces', routes.users.getRouter());
var server = app.listen(config.get('port'), config.get('ip'), function () {

    console.log('Express server listening');
    console.log('form ' + config.get('ip') + ' on port ' + config.get('port') + '');
})
//gracefull aplication close thanks to
// listen for TERM signal .e.g. kill
process.on('SIGTERM', function () {
    utils.gracefulShutdown(server);
});
// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', function () {
    utils.gracefulShutdown(server);
});
