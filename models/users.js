const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = new Schema ({
    user: {
        type: String,
        required: true
    },
    month: {
        type: String,
        required: false
    },
    today: {
        type: String,
        required: false
    },
    all: {
        type: Array,
        required: false
    },
});

const Users = mongoose.model("users", UsersSchema);

module.exports = Users;