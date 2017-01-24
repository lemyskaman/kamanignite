/**
 * Created by lemyskaman on 13/08/16.
 */
var _ = require("underscore");
var Model = require('../core/kmodel');
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var saltrounds = 10;
const THIRD_PARTY_CREATED_USER_PASSWORD_STATUS = 'WFUSRTCH';
const SELF_CREATED_USER_PASSWORD_STATUS = 'active';
const NEW_USER_STATUS = 'inactive';
var utils = require('../utils/kaman_utils');
var simple_select = 'select id, username, first_name,  last_name, password_status_id, status_id from  user  where ';
//each method should return a promise
module.exports = new Model({

    schema: 'user',
    publicFields: ['id', 'username', 'first_name', 'last_name', 'status_id', 'temp_password','password_status_id'],
    fields: ['id', 'username','password', 'first_name', 'last_name', 'status_id', 'password_status_id'],
    listLimit: 100,
    //justreturn an object with the body val
    _reqBodyAtr: function (req) {
        var fields = this.fields;
        console.log('fields')
        console.log(fields);


        var result = {};
        _.each(fields, function (element, index, list) {
            console.log(element)
            console.log(req.body[element])

            //adding the id get param  as a body attribute
            if (element === 'id')
                if (req.params.id)
                    req.body.id = req.params.id

            if (req.body[element]) {
                result[element] = req.body[element];
            }
        }, this)
        return result;
    },
    //usefull to create a random pass for users
    _randomPassString: function () {
        var text = "";


        var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var simbols = '*-_.$#';
        var lowercase = 'abcdefghijklmnopqrstuvwxyz';
        var numbers = "0123456789";

        //ramdompass start with 3 letters
        var possible = uppercase + lowercase;
        for (var i = 0; i < 2; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        //continue with one simbol
        var possible = simbols
        for (var i = 0; i < 1; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        //and ends with a ramdom
        var possible = simbols + numbers + uppercase + lowercase;
        for (var i = 0; i < 3; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    },

    _getById: function (id) {
        return this.reader.select(this.publicFields).from('user').where('id', id);
    },
    _getByUsername : function(username){
        
        return this.reader
            .select(this.fields)
            .from('user')
            .where('username',  username )
            .limit(1)
    },

    _hashPass: function (pass) {
        return bcrypt.hashAsync(pass, saltrounds)
    },
    addNewUser: function (user) {
        var _that = this;
        console.log(user.password)
        if (user.password && user.username) {
            return this._hashPass(user.password)
                .then(function (pass) {
                    user.temp_password = user.password;
                    user.password = pass;
                    user.status_id = NEW_USER_STATUS;
                    user.password_status_id = THIRD_PARTY_CREATED_USER_PASSWORD_STATUS;
                    //next should return fields but is not doing it
                    //it only returns the new user id  iguess is something related to mysql
                    //more than knexjs
                    return _that.writer('user').returning(this.fields).insert(user);
                })

        } else {
            return Promise.reject({error: 'username or password value is missing'})
        }
    },


 
    updateUser: function (user) {


        if (user) {
            //uuser with only valid properties
            var uuser = utils.objectFilter(user, ['username', 'first_name', 'last_name', 'status_id', 'password_status_id'])
            return this.writer('user')
                //update only filtred user object fields
                .update(uuser, Object.keys(uuser))
                .where('id', user.id)

        } else {
            return Promise.reject({error: 'user data cant be null '})
        }
    },

    updatePass: function (user) {
        var _that=this;
        console.log(user);
        if (user.password && user.id) {

            var uuser = utils.objectFilter(user, [ 'password']);

            uuser.password_status_id = THIRD_PARTY_CREATED_USER_PASSWORD_STATUS;
            uuser.password = user.password; 
            return this._hashPass(user.password)
                .then(function (pass) {
                    uuser.password = pass;

                    return _that.writer('user')
                        .update(uuser, Object.keys(uuser))
                        .where('id',user.id)
                })

        }else{
            return Promise.reject({error: 'invalid request data '})
        }
    },
    
    selfUpdate: function (user) {

        var uuser = utils.objectFilter(user, ['first_name', 'last_name']);

        return this.updateUser(uuser);
    },

    selfUpdatePass: function(user){
        var _that=this;
        console.log(user);
        if (user.password && user.id) {

            var uuser = utils.objectFilter(user, [ 'password']);

            uuser.password = SELF_CREATED_USER_PASSWORD_STATUS;
            return this._hashPass(user.password)
                .then(function (pass) {
                    uuser.password = pass;

                    return _that.writer('user')
                        .update(uuser, Object.keys(uuser))
                        .where('id',user.id)
                })

        }else{
            return Promise.reject({error: 'invalid request data '})
        }
    },

    find: function (guess) {
        return this.reader
            .select(this.publicFields)
            .from('user')
            .where('username', 'like', '%' + guess + '%')
            .orWhere('first_name', 'like', '%' + guess + '%')
            .orWhere('last_name', 'like', '%' + guess + '%')
            .limit(this.listLimit)

    },
    // will retrive a promise for the listLimit last elements
    getThem: function () {
        return this.reader
            .select(this.publicFields)
            .from('user')
            .orderBy('id', 'DESC')
            .limit(this.listLimit);

    },


    getBy: function (criteria, key_value) {
        var valids = ['username', 'id'];
        //var checked_criteria = (valids.indexOf(criteria) > -1) ? criteria : valids[0];
        if (valids.indexOf(criteria) === -1) {
            return Promise.reject({error: criteria + ' is not a valid field to get a user'})
        } else {

            return this.reader
                .select(this.publicFields)
                .from('user')
                .where(criteria, key_value)
        }


    }


})