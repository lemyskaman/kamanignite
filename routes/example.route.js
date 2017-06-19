var _ = require('underscore');

var Krouter = require('./../core/krouter.js');
var exampleModel = require('./../models/example.model.js')


var exampleRouter = new Krouter({

    name: 'example',
    get_examples: function(guess, req, res, next) {
        var _that = this;
        exampleModel
            .find(guess)
            .then(function(rows) {
                console.log('example router examples')
                console.log(rows)
                    //if (rows.length>=1){
                res.sendStatus(200).json(rows)
                    //}else{
                    //	_that._jsonResponse(res, 404, 'no examples found', rows)
                    //}
            })
    },


});

module.exports = exampleRouter;