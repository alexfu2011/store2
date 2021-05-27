const Mongoose = require("mongoose");
const { Schema } = Mongoose;

module.exports = Mongoose.model("User", Schema({
    username: String,
    name: String,
    phone: String,
    address: String,
    province: String,
    city: String,
    email: String,
    password: String,
    description: String,
    status: {
        type: Boolean,
        default: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    timeStamp: {
        type: Number,
        default: Date.now()
    }
}));