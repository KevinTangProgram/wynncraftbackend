const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AllSchema = new Schema ({
    user: {
        type: String,
        required: true
    },
    all: {
        type: Array,
        required: false
    },
});

const Users = mongoose.model("usersalls", AllSchema);

module.exports = Users;