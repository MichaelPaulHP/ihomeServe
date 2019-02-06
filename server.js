"use strict";
let port = process.env.PORT || 1337;
let express = require("express");
let bodyParser = require("body-parser");
let cors = require("cors");


let app = express();
// Config   cors
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// start server
let server = app.listen(port);
// init socketIO serve
let io = require("socket.io")(server);


app.get("/", (req, res) => {
    res.send("GG! Home");
});


console.log("GG!");
io.on("connection", (socket) => {

    console.log("new connection, sockedId: " + socket.id);
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
    socket.on("myLocation", (data) => {
        let user = data.user;

        let longitude = data.location.longitude;
        let latitude = data.location.latitude;
        console.log(user);
        console .log(latitude+"  "+longitude);
    });
    socket.on("disconnect", () => {
        socket.emit("changeStateHouse", {"state": "false"});
        console.log("disconnect:" + socket.id);

    });
});
