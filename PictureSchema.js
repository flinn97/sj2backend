const mongoose = require('mongoose');

const Picture = mongoose.model(
    "Profilepic",
    new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    profileImg: {
        type: String
    }
}, {
    collection: 'pictures'

    })
);
// Create a model for items in the museum.

module.exports = Picture; 
