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
    destinations:[{type: schema.ObjectId, ref: "Destination",unique: true,}],


}, {timestamps: false});


UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.password = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};



UserSchema.plugin(uniqueValidator, {message: 'idGoogle ya esta en uso || destinationDuplicate'});
module.exports=mongoose.model('User', UserSchema);