/**
 * Created by lemyskaman on 13/08/16.
 */
var _ = require("underscore");
var Model = require('../core/kmodel');
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var saltrounds = 10;
const SYSTEM_GENERATED_USER_PASSWORD_STATUS = 'WFUSRTCH';
const NEW_USER_STATUS = 'pending';
var simple_select = 'select id, username, first_name,  last_name, password_status_id, status_id from  user  where ';
//each method should return a promise
module.exports = new Model({

    schema: 'user',
    publicFields: ['id', 'username', 'first_name', 'last_name', 'status_id', 'password_status_id'],
    privateFields: ['id', 'username', 'first_name', 'last_name', 'status_id', 'password_status_id'],
    listLimit:100,

    //usefull to create a random pass for users
    _randomString: function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*-_.$#";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },

    _getUserById: function (id) {
        return this.reader.select(this.privateFields).from('user').where('id', id);
    },
    _hashPass:function(pass){
      return bcrypt.hashAsync(pass, saltrounds)
    },
    addNewUser: function (user) {
        var _that = this;
        if (user.password && user.username) {
            return this._hashPass(user.password)
                .then(function (pass) {
                    user.password = pass;
                    user.status_id = NEW_USER_STATUS;
                    user.password_status_id = SYSTEM_GENERATED_USER_PASSWORD_STATUS;
                    //next should return privateFields but is not doing it
                    //it only returns the new user id  iguess is something related to mysql
                    //more than knexjs
                    return _that.writer('user').returning(this.privateFields).insert(user);
                })

        } else {
            return Promise.reject({error: 'username or password value is missing'})
        }
    },
    updateUser:function(id,user){
        if (id && user){
            return this.writer('user')
               // .returning(this.publicFields)
                .update(user,this.publicFields)
                .where('id',id)

        }else{
            return Promise.reject({error: 'user id and user data to update is mandatory '})
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
    getThem:function(){
      return this.reader
          .select(this.publicFields)
          .from('user')
          .orderBy('id','DESC')
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