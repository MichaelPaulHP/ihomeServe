'use strict';

var express = require("express");
var LocationController = require("../Controllers/LocationController");
//var md_auth = require("../Middlewares/Authenticated");
var api = express.Router();



api.post("/save",  LocationController.saveLocation);
api.post("/message",  LocationController.saveMessage);
// api.put("/update-role/:id",  RoleController.updateRole);
api.get("/get",  LocationController.getTest);

module.exports = api;