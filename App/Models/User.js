'use strict'

var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

var schema = mongoose.Schema;



var UserSchema = new schema({
    idGoogle: {
        type: String,
        required: true,
        unique: true,
    },
    destinations:[{type: schema.ObjectId, ref: "Destination"}],


}, {timestamps: false});


module.exports=mongoose.model('User', UserSchema);
