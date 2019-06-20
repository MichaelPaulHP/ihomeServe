'use strict';

let locationRoute = require("./Routes/Location");
let userRoute = require("./Routes/User");
let roleRoute = require("./Routes/Role");

exports.assignRoutes = function (app) {
    // user Routes
    app.use('/location', locationRoute);
    // role routes

    // user Routes
    app.use('/user', userRoute);
    // role rputes
    app.use('/role', roleRoute);

};
