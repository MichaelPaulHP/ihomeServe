"use strict";
let port = process.env.PORT || 1337;
let Device = require("./App/Models/Device");
let express = require("express");
let bodyParser = require("body-parser");
let cors = require("cors");
let firebaseAdmin = require("firebase-admin");
var mongoose = require("mongoose");

let app = express();

const {dialogflow, Image,} = require('actions-on-google');


// Config   cors
//app.use(cors());

// BodyParser ==============================================================
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//Routes ==============================================================
var routes = require("./App/Routes");
routes.assignRoutes(app);

// configuration DB ===============================================================

var configDB = require('./Config/database');
mongoose.connect(configDB.url, {
        useMongoClient: true,
        user: configDB.user,
        pass: configDB.pass,
        useFindAndModify: false
    },
    function (err) {
        if (err) {
            console.log("ERROR MongoDB: " + err.message);
        }
    }); // connect to our database


// start server =========================================================
let server = app.listen(port);

// init socketIO serve =========================================================
let io = require("socket.io")(server);


// CONFIG FIREBASE =========================================================
const firebaseConfig = require("./Config/firebase");
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseConfig.credential),
    databaseURL: firebaseConfig.databaseURL
});


app.get("/", (req, res) => {
    res.send("GG! !Home add actios on google");
});

//let devices=[new Device("LED","0","0"),new Device("VENTILADOR","0","0")];
let devices = [
    new Device("LUZ DORMITORIO", "0", "0"),
    new Device("LUZ SALA", "0", "0"),
    new Device("LUZ BANIO", "0", "0"),
    new Device("LUZ COCINA", "0", "0"),
    new Device("GARAGE", "0", "0"),
    new Device("VENTILADOR", "0", "0"),
    new Device("MOVIMIENTO PUERTA", "0", "0"),
    new Device("MOVIMIENTO PUERTA ATRAS", "0", "0"),
    new Device("MOVIMIENTO PUERTA DOS", "0", "0"),
    new Device("FUEGO", "0", "0"),
    new Device("SONIDO", "0", "0"),
    new Device("HUMO", "0", "0"),
    new Device("TEMPERATURA SALA", "0", "0"),
    new Device("TEMPERATURA COCINA", "0", "0"),
    new Device("TEMPERATURA DORMITORIO", "0", "0")
];

function findDeviceByName(name) {
    if (name == null) {
        return null;
    }
    name = name.toUpperCase();
    for (let i = 0; i < devices.length; i++) {
        if (devices[i].name === name) {
            return devices[i];
        }
    }
    return null;
}

function stateToString(state) {
    if (state == "1") {
        return "encendido"
    }
    if (state == "0") {
        return "apagado"
    }
    return state;
}

// actions-on-google ==============================================================
const appDW = dialogflow();
app.post('/fulfillment', appDW);

appDW.intent('prender_apagar_dispositivo', (conv, params) => {


    try {
        console.log(params);
        let state = params.status;
        let device = params.devices;
        let deviceSaved = findDeviceByName(device);
        if (state && deviceSaved != null) {
            //device=device.toUpperCase();
            io.emit("changeState", {mode: "INPUT", name: deviceSaved.name, state: state});
            conv.ask('Listo, fue facil');
        } else {
            conv.ask('no entendí bien, por favor repite');
        }
    } catch (e) {
        conv.ask('oh no algo anda mal');
    }

});

appDW.intent('get_state_device', (conv, params) => {

    try {
        console.log(params);
        let state = params.status;
        let device = params.devices;

        let deviceFound = findDeviceByName(device.toUpperCase());
        if (deviceFound == null) {
            conv.ask('oh no algo anda mal, por favor repite');
        } else {

            conv.ask("el " + deviceFound.name + " esta " + stateToString(deviceFound.state));
        }
    } catch (e) {
        conv.ask('oh no algo anda mal, por favor repite');
    }


});

appDW.intent('open_close_device', (conv, params) => {

    try {
        console.log("open_close_device");
        console.log(params);
        let state = params.status;
        let device = params.devices;

        let deviceFound = findDeviceByName(device.toUpperCase());
        if (deviceFound != null && state) {
            deviceFound.state = state;
            io.emit("changeState", {mode: "OUTPUT", name: deviceFound.name, state: state});
            conv.ask(toOpenOrClose(state));
        } else {
            conv.ask('No entiendo si voy abrir o cerrar');
        }
    } catch (e) {
        conv.ask('oh no algo anda mal, por favor repite');
    }


});

function toOpenOrClose(x) {
    if (x == "0") {
        return "cerrado";
    } else {
        return "abierto";
    }
}


console.log("GG!");

let hello;
let Localization = require("./App/Models/Localization");
let Destination = require("./App/Models/Destination");
let User = require("./App/Models/User");

io.on("connection", (socket) => {

    console.log("new connection, sockedId: " + socket.id);


    socket.on("findDestinations", (data) => {
        // data = localization
        // find locations mas j
        Destination.findOne({name: data.name}, (err, destination) => {
            if (destination) {
                let result = destination.toJSON();
                console.log("findDestinations");
                console.log(result);
                socket.emit("destinationsFound", result);
            }
        });


    });
    socket.on("myLocalizationChange", (data) => {

    });
    socket.on("newTempDestination", (data) => {
        let destination = new Destination();
        destination.name = data.name;
        destination.color = data.color;
        destination.numUsers = data.numUsers;
        destination.latitude = data.latitude;
        destination.longitude = data.longitude;


        destination.save((err, destinationSaved) => {
            if (err) {
                console.log("ERR newTempDestination" + err);
            } else {
                let result = destinationSaved.toJSON();
                console.log("newTempDestination");
                console.log(result);
                socket.emit("destinationsFound", result);
            }
        });


    });
    socket.on("joinToDestination", (data) => {
        let userId = data.userID;
        let idDestination = data.idDestination;
        Destination.findByIdAndUpdate(idDestination, {$inc: {numUsers: 1}}, (err, doc, res) => {
            //doc is a destinations numUser:previos
            if (doc && !err) {
                console.log("joinToDestination Destination.findByIdAndUpdate doc");
                User.findOneAndUpdate(
                    {idGoogle: userId},
                    {$push: {destinations: idDestination}},
                    (err, user, res) => {
                        console.log("joinToDestination UserfindOneAndUpdate");
                        // user is a User with added destinations
                        if (user && !err) {
                            let cantUser = doc.numUsers + 1;
                            let result = doc.toJSON();
                            result.numUsers = cantUser + "";
                            socket.emit("joinToDestination", result);
                            Destination.deleteMany({numUser: 0});
                        }
                        if (err) {
                            console.log("ERR User.findOneAndUpdate" + err);
                        }
                    });

            }
            if (err) {
                console.log("ERR Destination.findByIdAndUpdate" + err);
            }
        });
    });


    socket.on("getMyDestinations", (data) => {
        let userId = data.userID;
        User.findOne({idGoogle: userId}, (err, doc) => {
            if (doc) {
                console.log("getMyDestinations");
                console.log(doc.destinations);
                socket.emit("getMyDestinations", doc.destinations);
            }
            if (err) {
                console.log("ERR getMyDestinations" + err);
            }
        });

    });

    socket.on("changeStateHouse", (data) => {
        let state = data.state;
        socket.broadcast.emit("changeStateHouse", {"state": state});
    });
    // change to state value
    socket.on("changeState", (data) => {
        //data = JSON.parse(data);
        console.log(data);
        let deviceName = data.name;
        let deviceState = data.state;
        let device = findDeviceByName(deviceName);
        if (device != null) {
            device.state = deviceState;
            if (data.mode === "INPUT") {
                // si es por ejemplo un sensor de fuego
                socket.broadcast.emit("changeState", {"name": device.name, "state": device.state, mode: "INPUT"});

            } else {
                // es el led
                console.log(data.name + " is " + data.state);
                socket.broadcast.emit("changeState", {"name": device.name, "state": device.state, mode: "OUTPUT"});
            }
        } else {
            console.log("device not found");
        }

    });
    socket.on("testSaveUser", (data) => {
        let user = new User();
        user.idGoogle = data.userID;
        user.save((err, userSaved) => {
            if (userSaved) {
                console.log("userSaved");
                console.log(userSaved);
            }
        })
    });
    socket.on("getDestination", (data) => {
        let idDestination = data.idDestination;
        Destination.findById(idDestination, (err, destination) => {
            if (destination) {
                let result = destination.toJSON();
                socket.emit("getDestination", result);
            }
        });
    });
    socket.on("myLocation", (data) => {
        let user = data.user;

        let longitude = data.location.longitude;
        let latitude = data.location.latitude;
        console.log(user);
        console.log(latitude + "  " + longitude);
    });
    socket.on("disconnectService", (data) => {
        let user = data.user;

        console.log("disconnectService");
        console.log(user);

    });
    socket.on("disconnect", (reason) => {
        socket.emit("changeStateHouse", {"state": "false"});
        console.log("disconnect:" + socket.id + " reason: " + reason);


    });
});
