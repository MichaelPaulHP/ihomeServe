'use strict';

var jwt = require("jsonwebtoken");
//var moment = require("moment");
var secret = "clave_secreta"

var User = require("../Models/User");

exports.ensureAuth = function (req,res,next) {

    try {
        if (req.headers.authorization) {
            var token = req.headers.authorization.replace(/['"]+/g, '');
            jwt.verify(token, 'Secret code ',function(err,decoded){
                if (!err){
                    if(decoded){
                        //console.log(decoded);
                        if(req.params.id==decoded.id){
                               
                            next();
                            
                        }
                        else{
                            throw "token not valid"    
                        }                
                    }
                }
                else{throw err}
            });
        }
        else{throw "header not content authorization"}
    } catch (error) {
        return res.status(403).send({
            message: error
        });
    }

    /*if (!req.headers.authorization) {
        return res.status(403).send({
            message: "header not content authorization"
        });
    }
    var token = req.headers.authorization.replace(/['"]+/g, '');
    //try {

        jwt.verify(token, 'Secret code ',function(err,decoded){
            if (err){
           
                return res.status(500).send({message:err});
            }
            else{
                if(decoded){
                    return res.status(403).send({ decoded });
                }
                else{
                    return res.status(403).send({message:"decoded Not Found"}); 
                }
            }
        });
        */
    /*} catch(err) {
        return res.status(404).send({ "message": err });
    }
    next();
    */
    
}