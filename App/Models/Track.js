'user strict';

let socketIO = require("socket.io");

/**
 * This is class
 */
class Track {

    constructor() {
        this.socket = socketIO;
    }

    onTakeLocation() {

        this.socket.emit("printMyLocation", () => {
            let a = 0;
            if (a == 0) {

            }

        });
        this.socket.on("connection", (socket) => {
            socket.emit
        });
    }
}