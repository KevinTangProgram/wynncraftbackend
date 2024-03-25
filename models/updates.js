const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UpdatesSchema = new Schema ({
    last: {
        type: Number,
        required: false
    },
    people: {
        type: Array,
        required: false
    },
    type: {
        type: String,
        required: false
    },
});

const Updates = mongoose.model("updates", UpdatesSchema);

module.exports = Updates;