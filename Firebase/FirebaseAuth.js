'use strict';



let firebaseAdmin = require("firebase-admin");

class FirebaseAuth{
    constructor (){
        this.firebaseAuth=firebaseAdmin.auth();

    }
    getListUsers(){
        this.firebaseAuth.listUsers()
            .then((listUsersResult)=>{
                listUsersResult.users.forEach(function(userRecord) {
                    console.log("user", userRecord.toJSON());
                });
                if (listUsersResult.pageToken) {
                    // List next batch of users.
                    //listAllUsers(listUsersResult.pageToken)
                }

            })
            .catch((error)=>{
                console.log("Error in get list user"+ error);
            });
    }
    getUserByEmail(email){
        this.firebaseAuth.getUserByEmail(email)
            .then(function(userRecord) {
                // See the UserRecord reference doc for the contents of userRecord.
                console.log("Successfully fetched user data:", userRecord.toJSON());
                return userRecord;
            })
            .catch(function(error) {
                console.log("Error fetching user data:", error);
            });
    }
}
module.exports = new FirebaseAuth();