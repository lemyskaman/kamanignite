/**
 * Created by lemyskaman on 13/08/16.
 */
var _ = require("underscore");
var Model = require('../core/kmodel');
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var saltrounds = 10;

const NEW_USER_STATUS = 'waiting';
const NEW_USER_PASS_STATUS =  'deactive'

//each method should return a promise
module.exports = new Model({

    schema: 'user',
    userValidSatus: ['active', 'deactivated'],

    fieldsAliases: {
        'user.id': 'id',
        'user.username': 'username',
        'user.first_name': 'first_name',
        'user.last_name': 'last_name',
        'user.status_id': 'status_id',
        'status.name': 'status_name',
        'password_status.id': 'password_status_id',
        'user.temp_password': 'temp_password',
        'password_status.name': 'password_status_name'
    },
    //--Read Only ends
    fields: [
        'id',
        'username',
        'password',
        'first_name',
        'last_name',
        'status_id',
        'temp_password',
        'password_status_id'
    ],


    listLimit: 100,


    //new set

    //retrive a list with a portion of user fields which values match like the guess param
    find: function (guess) {

        return this.reader

            .select(this.rawFieldsAliases({
                'user.id': 'id',
                'user.username': 'username',
                'user.first_name': 'first_name',
                'user.last_name': 'last_name',
                'user.status_id': 'status_id',
                'status.name': 'status_name'
            }))
            .from('user')
            .leftJoin('status', 'user.status_id', 'status.id')
            .leftJoin(this.knex.raw('status as password_status'), 'user.password_status_id', 'password_status.id')
            .where('user.username', 'like', '%' + guess + '%')
            .orWhere('user.id', 'like', '%' + guess + '%')
            .orWhere('user.first_name', 'like', '%' + guess + '%')
            .orWhere('user.last_name', 'like', '%' + guess + '%')
            .limit(this.listLimit)

    },
    //retrives a full field list of users acording matched fields with
    fullFind: function () {
        return this.reader
            .select(this.rawFieldsAliases(this.fieldsAliases))
            .from('user')
            .leftJoin('status', 'user.status_id', 'status.id')
            .leftJoin(this.knex.raw('status as password_status'), 'user.password_status_id', 'password_status.id')
            .where('user.username', 'like', '%' + guess + '%')
            .orWhere('user.id', 'like', '%' + guess + '%')
            .orWhere('user.first_name', 'like', '%' + guess + '%')
            .orWhere('user.last_name', 'like', '%' + guess + '%')
            .limit(this.listLimit)
    },
    _getById: function (id) {
        return this.reader
            .select(this.rawFieldsAliases(this.fieldsAliases))
            .from('user')
            .leftJoin('status', 'user.status_id', 'status.id')
            .leftJoin(this.knex.raw('status as password_status'), 'user.password_status_id', 'password_status.id')
            .where('user.id', id)
            .limit(1)
    },
    //used to do authoritations so its the only one allowed to return pass hash DANGER NO TO BE USED TO RETURN DATA
    _getByUsername: function (username) {
        var aliases = this.fieldsAliases;
        aliases['user.password'] = 'password'
        return this.reader
            .select(this.rawFieldsAliases(aliases))
            .from('user')
            .leftJoin('status', 'user.status_id', 'status.id')
            .leftJoin(this.knex.raw('status as password_status'), 'user.password_status_id', 'password_status.id')
            .where('user.username', username)
            .limit(1)
    },
    _hashPass: function (pass) {
        return bcrypt.hashAsync(pass, saltrounds)
    },
    add: function (user) {
        var _that = this;

        if (user.password && user.username) {
            return this._hashPass(user.password)
                .then(function (pass) {
                    user.temp_password = user.password;
                    user.password = pass;
                    user.status_id = NEW_USER_STATUS;
                    user.password_status_id = NEW_USER_PASS_STATUS;
                    //next should return fields but is not doing it
                    //it only returns the new user id  iguess is something related to mysql
                    //more than knexjs
                    return _that.writer('user').returning(this.fields).insert(user);
                })

        } else {
            return Promise.reject({ code: 'missing_username_or_password' })
        }
    },
    update: function (user) {
        var _that = this;
        //to edit id  field of user is mandatory
        if (user.id) {

            //as password has to be becryted
            if (user.password) {

                return this._hashPass(user.password)
                    .then(function (hashPass) {
                        user.password = hashPass;
                        return _that.writer('user')
                            .update(user, _.keys(user))
                            .where('id', user.id)

                    })

            } else {

                return this.writer('user')
                    //update only user fields and avoid id field to be modify
                    .update(user, _.omit(this.fields, ['id']))
                    .where('id', user.id)
            }

        } else {
            return Promise.reject({ error: 'user data id cant be null ' })
        }
    },

















    getBy: function (criteria, key_value) {
        var valids = ['username', 'id'];
        //var checked_criteria = (valids.indexOf(criteria) > -1) ? criteria : valids[0];
        if (valids.indexOf(criteria) === -1) {
            return Promise.reject({ error: criteria + ' is not a valid field to get a user' })
        } else {

            return this.reader
                .select(this.publicFields)
                .from('user')
                .where(criteria, key_value)
        }


    },


})