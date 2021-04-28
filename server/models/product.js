const Mongoose = require("mongoose");
const { Schema } = Mongoose;

module.exports = Mongoose.model("Product", Schema({
    _userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    name: String,
    image: String,
    price: Number,
    description: String,
    isPublish: {
        type: Boolean,
        default: true
    },
    timeStamp: {
        type: Number,
        default: Date.now()
    }
}));

