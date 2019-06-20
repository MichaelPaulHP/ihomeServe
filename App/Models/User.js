
'use strict'


var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require("crypto");
var jwt = require('jsonwebtoken');


var schema = mongoose.Schema;

var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//conect to DB ?

var UserSchema = new schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        match:re,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: schema.ObjectId, ref: "Role"
    },
    image: {
        type: String
    },
    salt: {
        type: String,
    }
}, {timestamps: true});


UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.password = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.password === hash;
};
//JWT
UserSchema.methods.generateJWT = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    
    return jwt.sign({
        id: this._id,
        email: this.email,
        role:this.role,
        image: this.image,
        exp: parseInt(exp.getTime() / 1000),
    }, "Secret code ");
};

UserSchema.methods.toAuthJSON = function () {
    return {
        name: this.name,
        email: this.email,
        token: this.generateJWT(),
        role:this.role,
        image: this.image
    };
};

/*UserSchema.methods.saveUser = function (){
    this.setPassword(this.password);//hash password
    
    this.save(function(err,userStored){
        if (err){
            
            result = {"message":err};
        }
        else{
            console.log(userStored);
            result= {"message":userStored};
        }
    });
    
}
*/


UserSchema.plugin(uniqueValidator, {message: 'email ya esta en uso'});
module.exports=mongoose.model('User', UserSchema);