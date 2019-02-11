'use strict';

var locationRoute = require("./Routes/Location");

exports.assignRoutes = function (app) {
    // user Routes
    app.use('/location', locationRoute);
    // role rputes

};