const mongoose = require('mongoose');
//structure for account.
const Account = mongoose.model(
    "Account",
    new mongoose.Schema({
        email: String,
        teacherID: String,
        password: String,
        pastFirstTime: Boolean,
        role: String,
        DoubleAccount: Boolean,
        sep: Boolean,
        username: String,

        account: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "account"

            },
        ],



    })
);

module.exports = Account; 
