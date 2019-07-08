'use strict'

var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

var schema = mongoose.Schema;

var DestinationSchema = new schema({
    name: {
        type: String,
        required: true,
    },
    numUsers: {
        type: Number,
        required:true,
    },
    color: {
        type: String,
        required:true,
    },
    latitude: {
        type: String,
        required:true,
    },
    longitude: {
        type: String,
        required:true,
    }

},{timestamps: true});

DestinationSchema.methods.toJSON = function ( ) {
    return {
        idDestination:this.id,
        name: this.name,
        numUsers: this.numUsers+"",
        color: this.color,
        latitude:this.latitude,
        longitude: this.longitude
    };
};


module.exports=mongoose.model('Destination', DestinationSchema);