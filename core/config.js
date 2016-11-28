/**
 * Created by lemys on 04/11/16.
 */
const _ = require('underscore');
const utils = require('../utils/kaman_utils')
module.exports = function (opt) {

    this.defaults = {
        mode: 'default',
        validCmdArgs: ['-configmode']
    }
    // this.nature=opt.nature
    //this.model
    const self = this;
    _.map(opt, function (element, key, list) {
        self[key] = element;
    }, self)

    this.setCmdLineArgs();

    this.setvalues();


};
module.exports.prototype = {
    cmdLineArgs: {},
    values: {},
    extend: function (child) {
        return _.extend({}, this, child);
    },
    get: function (key) {
        return this.values[key];
    },
    setvalues: function () {
        if (utils.isEmpty(this.values))
            this.values = require('../config/' + this.getMode() + '.conf');
    },
    setCmdLineArgs: function () {
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
                    this.cmdLineArgs[current_key].push(value);
                }
            } else {
                current_key = slicedValue[1]
                this.cmdLineArgs[current_key] = []
            }

        }, this)

    },

    getMode: function () {
        if (this.cmdLineArgs.configmode) {
            if (this.cmdLineArgs.configmode.length > 0) {
                return this.cmdLineArgs.configmode[0];

            } else {
                return this.defaults.mode
            }
        } else {
            return this.defaults.mode
        }
    }
}