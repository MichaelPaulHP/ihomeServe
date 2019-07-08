'use strict'

var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');



var schema = mongoose.Schema;

//conect to DB ?

var LocalizationSchema = new schema({
    name: {
        type: String,
        required: true,
    },
    latitude: {
        type: String,
        required:true,
    },
    longitude: {
        type: String,
        required:true,
    }
});

module.exports=mongoose.model('Localization', LocalizationSchema);