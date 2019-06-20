'use strict';

var express = require("express");
var RoleController = require("../Controllers/RoleController");
//var md_auth = require("../Middlewares/Authenticated");
var api = express.Router();



api.post("/create",  RoleController.saveRole);
api.put("/update-role/:id",  RoleController.updateRole);
api.get("/role/:id",  RoleController.getRole);

module.exports = api;
