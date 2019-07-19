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
        required: true,
    },
    participants:{
      type:[{type:String,unique: true}]
    },
    isActive:{
        type: Boolean
    },
    idChat: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    createBy: {
        type: String,
        required: true,
    },
    latitude: {
        type: String,
        required: true,
    },
    longitude: {
        type: String,
        required: true,
    }

}, {timestamps: true});

DestinationSchema.methods.toJSON = function () {
    return {
        idDestination: this.id,
        name: this.name,
        idChat:this.idChat,
        createBy:this.createBy,
        numUsers: this.numUsers + "",
        color: this.color,
        latitude: this.latitude,
        longitude: this.longitude
    };
};
DestinationSchema.methods.setFromData = function (data) {

    this.name = data.name;
    this.color = data.color;
    this.numUsers = data.numUsers;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.idChat = data.idChat;
    this.createBy = data.userID;

};

module.exports = mongoose.model('Destination', DestinationSchema);