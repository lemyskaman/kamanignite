var _ = require('underscore');
var Model = require('./../core/kmodel.js');



var exampleModel = new Model({


    schema: 'EXAMPLE_DATA',
    schemaFields: [
        'id',
        'first_name',
        'last_name',
        'email',
        'gender',
        'ip_address'
    ],

    getById: function(id) {
        return this.reader
                .select(this.rawFieldsAliases(this.schemaFields))
                .from(this.schema)
                .where(this.schema+'.id',id)
                //.limit(1)
    },
    add:function(example){
        return this.writer(this.schema).insert(example).returning(this.schemaFields)
        

    },
    find: function(guess) {

        
        return this.search(this.reader
                .select(this.schemaFields)
                .from(this.schema),
                guess,
                this.schemaFields)

            .limit(this.listLimit)
            .orderBy('id','desc');

    }
});

module.exports = exampleModel;