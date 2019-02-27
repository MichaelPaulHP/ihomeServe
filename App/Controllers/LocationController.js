'use strict';

// var Role = require("../Models/Role");


exports.saveLocation = function(req,res){

    var body=req.body;
    console.log(body);


    res.send("saved");
};
exports.saveMessage = function(req,res){

    var body=req.body;
    console.log(body);
    res.send("complete");
};
exports.getTest = function(req,res){

    var body=req.body;



    res.send("saved");
};