'use strict'

var Role = require("../Models/Role");


exports.saveRole =function(req,res){

    var body=req.body;
    var role = new Role();

    role.name=body.name;
    role.state=1;
    role.save(function (err){
        if(err){
           
            res.send(err);
        }
        else{
            res.send("save");
        }
    });
};
exports.updateRole= function  (req,res){

    // var artistId = req.params.id;
    var roleId = req.params.id;
    var update = req.body;
    Role.findByIdAndUpdate(roleId,update,(err,role)=>{
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (!role) {
                res.status(404).send({ message: "no exist role  " });
            } else {
                res.status(200).send({ role });
            }
        }
    });

}
exports.getRole=function(req,res){
    var roleId=req.params.id;
    var role =Role.findById(roleId,(err,role)=>{
        if(err){
            res.send(err).state(200);

        }
        else{
            if (!role) {
                res.status(404).send({ message: "no exist role  " });
            } else {
                //return  el role antes de actualizar
                res.status(200).send({ role });
            }
        }
    });
}