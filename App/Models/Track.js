'user strict';
let socketIO=require("socket.io");
class Track{
    constructor(){
        this.socket=socketIO;

    }
    onTakeLocation(){

        this.socket.emit("printMyLocation",()=>{


        });
        this.socket.on("connection",(socket)=>{
            socket.emit
        });
    }
}