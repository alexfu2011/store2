const Mongoose = require("mongoose");
const { Schema } = Mongoose;

module.exports = Mongoose.model("UserSession", Schema({
    _userId: String,
    token: String
}));