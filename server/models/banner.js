const Mongoose = require("mongoose");
const { Schema } = Mongoose;

module.exports = Mongoose.model("Banner", Schema({
    _userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    name: String,
    image: String,
    isActive: {
        type: Number,
        default: 1
    }
}));