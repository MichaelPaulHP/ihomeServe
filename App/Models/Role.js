'use strict'



var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');



var schema = mongoose.Schema;

//conect to DB ?

var RoleSchema = new schema({
    name: {
        type: String,
        required: true,
        unique: true, 
    },
    state: {
        type: Number,
        required:true,
    }

});

RoleSchema.plugin(uniqueValidator, { message: 'rol ya existe' });
module.exports=mongoose.model('Role', RoleSchema);