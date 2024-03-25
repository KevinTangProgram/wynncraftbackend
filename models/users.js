const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = new Schema ({
    user: {
        type: String,
        required: true
    },
    today: {
        type: String,
        required: false
    },
    world: {
        type: Number,
        required: false
    },
});

const Users = mongoose.model("users", UsersSchema);

module.exports = Users;