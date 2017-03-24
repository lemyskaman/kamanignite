/**
 * Created by lemys on 07/11/16.
 */


const _ = require('underscore');
const cmdLineArgs = function () {

    var agrs = {};
    //the main idea is to walk the process.argv finding
    //command line args that starts with "-"  those will be
    //the valueKey to store command values betwen valuesKeys
    //todo: this should be rewrited using regular expression to filter the process.argv elements
    var current_key = '';
    _.each(process.argv, function (value, index) {

        //using "-" as command line parametter denotaor
        const slicedValue = value.split('-')
        //all args that are no preceded from a -arg will be excluded

        if (slicedValue[0] !== '') {
            if (current_key !== '') {
                args[current_key].push(value);
            }
        } else {
            current_key = slicedValue[1]
            args[current_key] = []
        }

    });
    return args;


}

// we retrive the result object not the function
module.exports = cmdLineArgs();