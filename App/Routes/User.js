'use strict';

var express = require("express");
var UserController = require("../Controllers/UserController");
var md_auth = require("../Middlewares/Authenticated");
var api = express.Router();

var multipart = require("connect-multiparty");
var md_upload = multipart({ uploadDir: "./Uploads/Users" });


api.post("/register",  UserController.saveUser);
api.post("/login",  UserController.loginUser);
api.put("/update/:id", md_auth.ensureAuth, UserController.updateUser)
api.put("/upload-image/:id", [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.post("/get-image/:imageFile", UserController.getImageFile);

module.exports = api;

