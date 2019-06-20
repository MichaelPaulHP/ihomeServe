const USER="MichaelHP";
const PASS="michael123";

//mongodb://localhost/ihome
//mongodb://<dbuser>:<dbpassword>@ds239967.mlab.com:39967/ihome
var url="mongodb://"+USER+":"+PASS+"@ds239967.mlab.com:39967/ihome";
module.exports = {
    'user':USER,
    'pass':PASS,
    'url' : url 
};