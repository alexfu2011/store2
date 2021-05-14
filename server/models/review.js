const Mongoose = require("mongoose");
const { Schema } = Mongoose;

module.exports = Mongoose.model("Review", Schema({
    name: String,
    rating: Number,
    comment: String,
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
}));
