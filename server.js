"use strict";
let port = process.env.PORT || 1337;
let express = require("express");
let bodyParser = require("body-parser");
let cors = require("cors");
let firebaseAdmin = require("firebase-admin");
var mongoose = require("mongoose");

let app = express();


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
    res.send("GG! !Home");
});


/*let person=require("./providers/Person");
let personTwo=require("./providers/Person");
console.log(person);
person.incrementAge();
console.log(person);
console.log(personTwo)
*/

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
			    let cantUser=doc.numUsers+1;
                            let result = doc.toJSON();
			    result.numUsers=cantUser+"";
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
        User.findOne({idGoogle:userId}, (err, doc) => {
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
    socket.emit("changeStateHouse", {"state": "true"});
    socket.on("changeState", (data) => {
        data = JSON.parse(data);
        console.log(data.state);

        if (data.mode === "INPUT") {
            // si es por ejemplo un sensor de fuego
            if (data.state === 1) {
                // prender led
                socket.emit("changeState", {"name": "led", "state": 1});
            } else {
                socket.emit("changeState", {"name": "led", "state": 0});
            }
        } else {
            // es el led
            console.log(data.name + " is " + data.state);
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