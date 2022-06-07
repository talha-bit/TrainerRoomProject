const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CustomerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    classes: [{type: Number, ref: 'classes'}],
});

module.exports = Customer = mongoose.model("customers", CustomerSchema);
