const mongoose = require('mongoose');
//structure for teachers. 
const User = mongoose.model(
    "User",
    new mongoose.Schema({
        students: [
            {
                type: mongoose.Schema.Types.Mixed,
                ref: "student"
               
            },
        ],
        firstname: String,
        lastname: String,
        email: String,
        password: String,
        role: String,
        about: String,
        phone: String,
        profilepic: String,
        backgroundpic: String,

        //would it be useful to have an upload file function for profile?
        
       

    })
);

module.exports = User; 