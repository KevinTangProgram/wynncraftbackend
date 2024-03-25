const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MonthSchema = new Schema ({
    user: {
        type: String,
        required: true
    },
    month: {
        type: String,
        required: false
    },
    creation: {
        type: String,
        required: false
    },
    deletion: {
        type: String,
        required: false
    },
});

const Users = mongoose.model("usersmonths", MonthSchema);

module.exports = Users;