const Mongoose = require("mongoose");
const { Schema } = Mongoose;

module.exports = Mongoose.model("Profile", Schema({
    _userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    address: String,
    city: String,
    person: String,
    phone: String
}));
